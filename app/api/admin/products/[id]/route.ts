import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken } from '@/lib/admin/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schema de validación para actualizar productos (todos los campos opcionales)
const updateProductSchema = z.object({
  name: z.string().min(3).optional(),
  brand: z.string().min(2).optional(),
  price: z.number().positive().optional(),
  compareAtPrice: z.number().min(0).optional().nullable()
    .or(z.literal(0))
    .transform((val) => (val === 0 ? null : val)),
  image: z.string().min(1).optional(),
  images: z.array(z.string()).max(4).optional().nullable()
    .transform((val) => (Array.isArray(val) && val.length === 0 ? null : val)),
  badge: z.string().optional().nullable()
    .or(z.literal('')).transform((val) => (val === '' ? null : val)),
  badgeType: z.enum(['bestseller', 'new', 'discount']).optional().nullable()
    .or(z.literal('')).transform((val) => (val === '' ? null : val)),
  category: z.string().optional().nullable()
    .or(z.literal('')).transform((val) => (val === '' ? null : val)),
  description: z.string().optional().nullable()
    .or(z.literal('')).transform((val) => (val === '' ? null : val)),
  benefits: z.array(z.string()).optional().nullable()
    .transform((val) => (Array.isArray(val) && val.length === 0 ? null : val)),
  ingredients: z.array(z.string()).optional().nullable()
    .transform((val) => (Array.isArray(val) && val.length === 0 ? null : val)),
  howToUse: z.array(z.string()).optional().nullable()
    .transform((val) => (Array.isArray(val) && val.length === 0 ? null : val)),
  skinType: z.array(z.string()).optional().nullable()
    .transform((val) => (Array.isArray(val) && val.length === 0 ? null : val)),
  stock: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

// GET - Obtener un producto por ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticación admin
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    return NextResponse.json(
      { error: 'Error al obtener producto' },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar producto
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticación admin
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Validar datos
    const validation = updateProductSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.errors },
        { status: 400 }
      );
    }

    // Verificar que el producto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar producto
    const product = await prisma.product.update({
      where: { id },
      data: validation.data,
    });

    return NextResponse.json({
      message: 'Producto actualizado exitosamente',
      product,
    });
  } catch (error) {
    console.error('Error actualizando producto:', error);
    return NextResponse.json(
      { error: 'Error al actualizar producto' },
      { status: 500 }
    );
  }
}

// DELETE - Hard delete con limpieza de relaciones
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

    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { _count: { select: { orderItems: true } } },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    // Bloquear si hay órdenes reales con este producto
    if (existingProduct._count.orderItems > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar: el producto tiene órdenes asociadas. Puedes desactivarlo en su lugar.' },
        { status: 409 }
      );
    }

    // Borrar en transacción: primero KitItems, luego el producto
    await prisma.$transaction([
      prisma.kitItem.deleteMany({ where: { productId: id } }),
      prisma.product.delete({ where: { id } }),
    ]);

    return NextResponse.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    return NextResponse.json(
      { error: 'Error al eliminar producto' },
      { status: 500 }
    );
  }
}
