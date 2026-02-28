import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken } from '@/lib/admin/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateBlogPostSchema = z.object({
  title: z.string().min(3).optional(),
  slug: z.string().min(3).optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  coverImage: z.string().optional(),
  category: z.string().optional(),
  skinType: z.array(z.string()).optional().nullable(),
  brands: z.array(z.string()).optional().nullable(),
  relatedProductIds: z.array(z.string()).optional().nullable(),
  isPublished: z.boolean().optional(),
  author: z.string().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Artículo no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error obteniendo post:', error);
    return NextResponse.json(
      { error: 'Error al obtener artículo' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const validation = updateBlogPostSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.errors },
        { status: 400 }
      );
    }

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Artículo no encontrado' },
        { status: 404 }
      );
    }

    // Si se cambia el slug, verificar que sea único
    if (validation.data.slug && validation.data.slug !== existing.slug) {
      const slugConflict = await prisma.blogPost.findUnique({
        where: { slug: validation.data.slug },
      });
      if (slugConflict) {
        return NextResponse.json(
          { error: 'Ya existe un artículo con ese slug' },
          { status: 400 }
        );
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: validation.data,
    });

    return NextResponse.json({
      message: 'Artículo actualizado exitosamente',
      post,
    });
  } catch (error) {
    console.error('Error actualizando post:', error);
    return NextResponse.json(
      { error: 'Error al actualizar artículo' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Artículo no encontrado' },
        { status: 404 }
      );
    }

    await prisma.blogPost.delete({ where: { id } });

    return NextResponse.json({
      message: 'Artículo eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error eliminando post:', error);
    return NextResponse.json(
      { error: 'Error al eliminar artículo' },
      { status: 500 }
    );
  }
}
