import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyWompiTransaction } from '@/lib/wompi/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const transactionId = searchParams.get('id');

    if (!transactionId) {
      return NextResponse.json(
        { error: 'ID de transacción no proporcionado' },
        { status: 400 }
      );
    }

    // Verificar transacción con Wompi
    const transaction = await verifyWompiTransaction(transactionId);

    if (!transaction) {
      return NextResponse.json(
        { error: 'No se pudo verificar la transacción' },
        { status: 500 }
      );
    }

    // Buscar la orden por la referencia de Wompi
    const order = await prisma.order.findFirst({
      where: { paymentId: transaction.reference },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      );
    }

    // Determinar el estado del pago
    const paymentStatus =
      transaction.status === 'APPROVED' ? 'paid' :
      transaction.status === 'DECLINED' ? 'failed' :
      transaction.status === 'PENDING' ? 'pending' : 'failed';

    const orderStatus =
      transaction.status === 'APPROVED' ? 'processing' : order.status;

    // Actualizar la orden en Prisma
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus,
        status: orderStatus,
        paymentId: transaction.id,
        paymentMethod: transaction.payment_method_type || 'wompi',
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      paymentStatus,
      transactionStatus: transaction.status,
      message:
        transaction.status === 'APPROVED'
          ? '¡Pago exitoso! Tu orden ha sido confirmada.'
          : transaction.status === 'DECLINED'
          ? 'El pago fue rechazado. Por favor intenta nuevamente.'
          : transaction.status === 'PENDING'
          ? 'El pago está pendiente de confirmación.'
          : 'Hubo un error al procesar el pago.',
    });
  } catch (error) {
    console.error('Error en verify-payment:', error);

    return NextResponse.json(
      { error: 'Error al verificar el pago' },
      { status: 500 }
    );
  }
}
