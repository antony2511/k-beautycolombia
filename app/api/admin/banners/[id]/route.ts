import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken } from '@/lib/admin/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const bannerUpdateSchema = z.object({
  message: z.string().min(1).optional(),
  subMessage: z.string().optional().nullable(),
  type: z.enum(['top_bar', 'modal']).optional(),
  variant: z.enum(['promo', 'info', 'sale', 'warning']).optional(),
  image: z.string().optional().nullable(),
  link: z.string().optional().nullable(),
  linkText: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  dismissible: z.boolean().optional(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
});

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token && (await verifyAdminToken(token));
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const banner = await prisma.banner.findUnique({ where: { id: params.id } });
    if (!banner) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
    return NextResponse.json(banner);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener banner' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validation = bannerUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.errors },
        { status: 400 }
      );
    }

    const data = validation.data;

    const banner = await prisma.banner.update({
      where: { id: params.id },
      data: {
        ...data,
        startDate: data.startDate !== undefined
          ? (data.startDate ? new Date(data.startDate) : null)
          : undefined,
        endDate: data.endDate !== undefined
          ? (data.endDate ? new Date(data.endDate) : null)
          : undefined,
      },
    });

    return NextResponse.json({ message: 'Banner actualizado', banner });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al actualizar banner' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    await prisma.banner.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Banner eliminado' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al eliminar banner' }, { status: 500 });
  }
}
