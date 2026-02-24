import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken } from '@/lib/admin/auth';
import { z } from 'zod';

// Importar Firebase Admin
let db: any = null;
try {
  const firebaseAdmin = require('@/lib/firebase-admin');
  db = firebaseAdmin.db;
} catch (error) {
  console.log('⚠️ Firebase Admin not configured');
}

// Schema de validación para cambio de estado
const changeStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  notes: z.string().optional(),
  notifyCustomer: z.boolean().optional().default(false),
  trackingNumber: z.string().optional(),
});

// Validar transiciones de estado permitidas
const allowedTransitions: Record<string, string[]> = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [], // Estado final
  cancelled: [], // Estado final
};

// PATCH - Cambiar estado de orden
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

    if (!db) {
      return NextResponse.json(
        { error: 'Firebase Admin no configurado' },
        { status: 500 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Validar datos
    const validation = changeStatusSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { status: newStatus, notes, notifyCustomer, trackingNumber } = validation.data;

    // Obtener orden actual
    const orderRef = db.collection('orders').doc(id);
    const doc = await orderRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      );
    }

    const currentData = doc.data();
    const currentStatus = currentData.status || 'pending';

    // Validar transición de estado
    const allowed = allowedTransitions[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
      return NextResponse.json(
        {
          error: `Transición de estado no permitida: ${currentStatus} → ${newStatus}`,
          allowedTransitions: allowed,
        },
        { status: 400 }
      );
    }

    // Preparar actualización
    const statusHistory = currentData.statusHistory || [];
    statusHistory.push({
      status: newStatus,
      timestamp: new Date(),
      notes: notes || '',
      changedBy: 'admin', // Podríamos usar el email del admin del token
    });

    const updateData: any = {
      status: newStatus,
      statusHistory,
      updatedAt: new Date(),
    };

    // Si se proporciona tracking number (para estado 'shipped')
    if (trackingNumber && newStatus === 'shipped') {
      updateData.trackingNumber = trackingNumber;
    }

    // Actualizar orden
    await orderRef.update(updateData);

    // TODO: Si notifyCustomer es true, enviar email al cliente
    if (notifyCustomer) {
      console.log(`📧 TODO: Enviar email de notificación de cambio de estado a ${currentData.customerEmail}`);
      // Implementar envío de email aquí (con Resend, SendGrid, etc.)
    }

    // Obtener orden actualizada
    const updatedDoc = await orderRef.get();
    const updatedData = updatedDoc.data();

    return NextResponse.json({
      message: `Estado cambiado exitosamente: ${currentStatus} → ${newStatus}`,
      order: {
        id: updatedDoc.id,
        status: updatedData.status,
        statusHistory: updatedData.statusHistory,
        trackingNumber: updatedData.trackingNumber,
      },
    });
  } catch (error) {
    console.error('Error cambiando estado de orden:', error);
    return NextResponse.json(
      { error: 'Error al cambiar estado de orden' },
      { status: 500 }
    );
  }
}
