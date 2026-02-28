import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken } from '@/lib/admin/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const blogPostSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  slug: z.string().min(3, 'El slug debe tener al menos 3 caracteres'),
  excerpt: z.string().min(1, 'El extracto es requerido'),
  content: z.string().min(1, 'El contenido es requerido'),
  coverImage: z.string().min(1, 'La imagen de portada es requerida'),
  category: z.string().min(1, 'La categoría es requerida'),
  skinType: z.array(z.string()).optional().nullable(),
  brands: z.array(z.string()).optional().nullable(),
  relatedProductIds: z.array(z.string()).optional().nullable(),
  isPublished: z.boolean().default(false),
  author: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const isPublished = searchParams.get('isPublished');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (isPublished !== null && isPublished !== undefined && isPublished !== '') {
      where.isPublished = isPublished === 'true';
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error obteniendo posts:', error);
    return NextResponse.json(
      { error: 'Error al obtener posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();

    const validation = blogPostSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.errors },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Verificar slug único
    const existing = await prisma.blogPost.findUnique({
      where: { slug: data.slug },
    });
    if (existing) {
      return NextResponse.json(
        { error: 'Ya existe un artículo con ese slug' },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage,
        category: data.category,
        skinType: data.skinType || [],
        brands: data.brands || [],
        relatedProductIds: data.relatedProductIds || [],
        isPublished: data.isPublished,
        author: data.author || 'Dra. Berenice Rodríguez',
      },
    });

    return NextResponse.json(
      { message: 'Artículo creado exitosamente', post },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creando post:', error);
    return NextResponse.json(
      { error: 'Error al crear artículo' },
      { status: 500 }
    );
  }
}
