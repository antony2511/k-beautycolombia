import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken } from '@/lib/admin/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const kitUpdateSchema = z.object({
  name: z.string().min(3).optional(),
  tagline: z.string().min(3).optional(),
  description: z.string().optional().nullable(),
  image: z.string().min(1).optional(),
  discount: z.number().int().min(0).max(100).optional().nullable(),
  isActive: z.boolean().optional(),
  productIds: z.array(z.string()).optional(),
});

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token || !(await verifyAdminToken(token))) return false;
  return true;
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const kit = await prisma.kit.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true, name: true, brand: true, price: true,
                compareAtPrice: true, image: true, category: true,
              },
            },
          },
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!kit) {
      return NextResponse.json({ error: 'Kit no encontrado' }, { status: 404 });
    }

    return NextResponse.json(kit);
  } catch (error) {
    console.error('Error fetching kit:', error);
    return NextResponse.json({ error: 'Error al obtener kit' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validation = kitUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { productIds, ...kitData } = validation.data;

    const kit = await prisma.$transaction(async (tx) => {
      const updated = await tx.kit.update({
        where: { id: params.id },
        data: kitData,
      });

      if (productIds !== undefined) {
        await tx.kitItem.deleteMany({ where: { kitId: params.id } });
        await tx.kitItem.createMany({
          data: productIds.map((productId, index) => ({
            kitId: params.id,
            productId,
            position: index,
          })),
        });
      }

      return updated;
    });

    return NextResponse.json({ message: 'Kit actualizado', kit });
  } catch (error) {
    console.error('Error updating kit:', error);
    return NextResponse.json({ error: 'Error al actualizar kit' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    await prisma.kit.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    return NextResponse.json({ message: 'Kit desactivado' });
  } catch (error) {
    console.error('Error deleting kit:', error);
    return NextResponse.json({ error: 'Error al eliminar kit' }, { status: 500 });
  }
}
