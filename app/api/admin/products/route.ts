import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken } from '@/lib/admin/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schema de validación para crear/actualizar productos
const productSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  brand: z.string().min(2, 'La marca debe tener al menos 2 caracteres'),
  price: z.number().positive('El precio debe ser positivo'),
  compareAtPrice: z.number().positive().optional().nullable().or(z.literal(0)).transform(val => val === 0 ? null : val),
  image: z.string().min(1, 'La imagen es requerida'),
  images: z.array(z.string()).max(4, 'Máximo 4 imágenes adicionales').optional().nullable().or(z.literal([])).transform(val => val?.length === 0 ? null : val),
  badge: z.string().optional().nullable().or(z.literal('')).transform(val => val === '' ? null : val),
  badgeType: z.enum(['bestseller', 'new', 'discount']).optional().nullable().or(z.literal('')).transform(val => val === '' ? null : val),
  category: z.string().optional().nullable().or(z.literal('')).transform(val => val === '' ? null : val),
  description: z.string().optional().nullable().or(z.literal('')).transform(val => val === '' ? null : val),
  benefits: z.array(z.string()).optional().nullable().or(z.literal([])).transform(val => val?.length === 0 ? null : val),
  ingredients: z.array(z.string()).optional().nullable().or(z.literal([])).transform(val => val?.length === 0 ? null : val),
  howToUse: z.array(z.string()).optional().nullable().or(z.literal([])).transform(val => val?.length === 0 ? null : val),
  skinType: z.array(z.string()).optional().nullable().or(z.literal([])).transform(val => val?.length === 0 ? null : val),
  stock: z.number().int().min(0, 'El stock no puede ser negativo'),
  isActive: z.boolean().default(true),
});

// GET - Listar productos (incluye inactivos para admin)
export async function GET(request: Request) {
  try {
    // Verificar autenticación admin
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    // Parámetros de filtrado
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const brand = searchParams.get('brand') || '';
    const isActive = searchParams.get('isActive');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { brand: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (brand) {
      where.brand = brand;
    }

    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    // Obtener productos con paginación
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}

// POST - Crear producto
export async function POST(request: Request) {
  try {
    // Verificar autenticación admin
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();

    console.log('📦 Creating product with data:', JSON.stringify(body, null, 2));

    // Validar datos
    const validation = productSchema.safeParse(body);
    if (!validation.success) {
      console.error('❌ Validation failed:', validation.error.errors);
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.errors },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Crear producto
    const product = await prisma.product.create({
      data: {
        name: data.name,
        brand: data.brand,
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        image: data.image,
        images: data.images || [],
        badge: data.badge,
        badgeType: data.badgeType,
        category: data.category,
        description: data.description,
        benefits: data.benefits || [],
        ingredients: data.ingredients || [],
        howToUse: data.howToUse || [],
        skinType: data.skinType || [],
        stock: data.stock,
        isActive: data.isActive,
      },
    });

    return NextResponse.json(
      { message: 'Producto creado exitosamente', product },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creando producto:', error);
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    );
  }
}
