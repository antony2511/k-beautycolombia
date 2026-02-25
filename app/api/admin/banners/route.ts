import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken } from '@/lib/admin/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const bannerSchema = z.object({
  message: z.string().min(1),
  subMessage: z.string().optional().nullable(),
  type: z.enum(['top_bar', 'modal']).default('top_bar'),
  variant: z.enum(['promo', 'info', 'sale', 'warning']).default('promo'),
  image: z.string().optional().nullable(),
  link: z.string().optional().nullable(),
  linkText: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  dismissible: z.boolean().default(true),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
});

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token && (await verifyAdminToken(token));
}

export async function GET(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const [banners, total] = await Promise.all([
      prisma.banner.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.banner.count(),
    ]);

    return NextResponse.json({
      banners,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json({ error: 'Error al obtener banners' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validation = bannerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.errors },
        { status: 400 }
      );
    }

    const data = validation.data;

    const banner = await prisma.banner.create({
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });

    return NextResponse.json({ message: 'Banner creado', banner }, { status: 201 });
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json({ error: 'Error al crear banner' }, { status: 500 });
  }
}
