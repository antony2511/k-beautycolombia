import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken } from '@/lib/admin/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const kitSchema = z.object({
  name: z.string().min(3),
  tagline: z.string().min(3),
  description: z.string().optional().nullable(),
  image: z.string().min(1),
  discount: z.number().int().min(0).max(100).optional().nullable(),
  isActive: z.boolean().default(true),
  productIds: z.array(z.string()).min(1),
});

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token || !(await verifyAdminToken(token))) return false;
  return true;
}

export async function GET(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [kits, total] = await Promise.all([
      prisma.kit.findMany({
        include: {
          items: {
            include: {
              product: {
                select: { id: true, name: true, brand: true, price: true, image: true },
              },
            },
            orderBy: { position: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.kit.count(),
    ]);

    return NextResponse.json({
      kits,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Error fetching kits:', error);
    return NextResponse.json({ error: 'Error al obtener kits' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validation = kitSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { productIds, ...kitData } = validation.data;

    const kit = await prisma.$transaction(async (tx) => {
      const newKit = await tx.kit.create({ data: kitData });
      await tx.kitItem.createMany({
        data: productIds.map((productId, index) => ({
          kitId: newKit.id,
          productId,
          position: index,
        })),
      });
      return newKit;
    });

    return NextResponse.json({ message: 'Kit creado exitosamente', kit }, { status: 201 });
  } catch (error) {
    console.error('Error creating kit:', error);
    return NextResponse.json({ error: 'Error al crear kit' }, { status: 500 });
  }
}
