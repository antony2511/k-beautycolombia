import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
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

    // Crear clientes de Stripe y Supabase
    const stripe = getStripeClient();
    const supabase = createServerSupabaseClient();

    // Obtener la sesión de Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: 'Sesión no encontrada' },
        { status: 404 }
      );
    }

    // Buscar la orden por el session ID
    const { data: order, error: findError } = await supabase
      .from('orders')
      .select('*')
      .eq('wompi_reference', sessionId) // Estamos reutilizando este campo
      .single();

    if (findError || !order) {
      console.error('Error al buscar orden:', findError);
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      );
    }

    // Determinar el estado del pago basado en el estado de la sesión
    const paymentStatus =
      session.payment_status === 'paid'
        ? 'approved'
        : session.payment_status === 'unpaid'
        ? 'pending'
        : 'declined';

    const orderStatus =
      session.payment_status === 'paid' ? 'processing' : order.status;

    // Actualizar la orden en Supabase
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: paymentStatus,
        status: orderStatus,
        wompi_transaction_id: session.payment_intent as string, // Payment Intent ID
        payment_method: 'card', // Stripe usa tarjeta
        paid_at: session.payment_status === 'paid' ? new Date().toISOString() : null,
      })
      .eq('id', order.id);

    if (updateError) {
      console.error('Error al actualizar orden:', updateError);
      return NextResponse.json(
        { error: 'Error al actualizar la orden' },
        { status: 500 }
      );
    }

    // Retornar resultado
    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
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
