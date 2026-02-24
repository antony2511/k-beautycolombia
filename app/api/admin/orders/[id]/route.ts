import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken } from '@/lib/admin/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schema de validación para actualizar orden
const updateOrderSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
  notes: z.string().optional(),
  trackingNumber: z.string().optional(),
});

// GET - Obtener detalle completo de una orden
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

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error obteniendo orden:', error);
    return NextResponse.json(
      { error: 'Error al obtener orden' },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar orden
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
    const validation = updateOrderSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.errors },
        { status: 400 }
      );
    }

    // Verificar que la orden existe
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      );
    }

    // Preparar datos de actualización
    const updateData: any = {
      ...validation.data,
      updatedAt: new Date(),
    };

    // Si se está cambiando el estado, agregar al historial
    if (validation.data.status) {
      const statusHistory = (existingOrder.statusHistory as any) || [];
      statusHistory.push({
        status: validation.data.status,
        timestamp: new Date().toISOString(),
        notes: validation.data.notes || '',
      });
      updateData.statusHistory = statusHistory;
    }

    // Actualizar orden
    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      message: 'Orden actualizada exitosamente',
      order,
    });
  } catch (error) {
    console.error('Error actualizando orden:', error);
    return NextResponse.json(
      { error: 'Error al actualizar orden' },
      { status: 500 }
    );
  }
}
