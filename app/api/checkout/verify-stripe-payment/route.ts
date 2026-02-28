import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getStripeClient } from '@/lib/stripe/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'ID de sesión no proporcionado' },
        { status: 400 }
      );
    }

    // Obtener la sesión de Stripe
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: 'Sesión no encontrada' },
        { status: 404 }
      );
    }

    // Buscar la orden por el session ID de Stripe
    const order = await prisma.order.findFirst({
      where: { paymentId: sessionId },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      );
    }

    const paymentStatus =
      session.payment_status === 'paid' ? 'paid' :
      session.payment_status === 'unpaid' ? 'pending' : 'failed';

    const orderStatus =
      session.payment_status === 'paid' ? 'processing' : order.status;

    // Actualizar la orden en Prisma
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus,
        status: orderStatus,
        paymentMethod: 'stripe',
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      paymentStatus,
      sessionStatus: session.status,
      message:
        session.payment_status === 'paid'
          ? '¡Pago exitoso! Tu orden ha sido confirmada.'
          : session.payment_status === 'unpaid'
          ? 'El pago está pendiente de confirmación.'
          : 'El pago no fue completado.',
    });
  } catch (error) {
    console.error('Error en verify-stripe-payment:', error);

    return NextResponse.json(
      { error: 'Error al verificar el pago' },
      { status: 500 }
    );
  }
}
