import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
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

    // Crear cliente de Supabase
    const supabase = createServerSupabaseClient();

    // Buscar la orden por el reference code de Wompi
    const { data: order, error: findError } = await supabase
      .from('orders')
      .select('*')
      .eq('wompi_reference', transaction.reference)
      .single();

    if (findError || !order) {
      console.error('Error al buscar orden:', findError);
      return NextResponse.json(
        { error: 'Orden no encontrada' },
        { status: 404 }
      );
    }

    // Determinar el estado del pago
    const paymentStatus =
      transaction.status === 'APPROVED'
        ? 'approved'
        : transaction.status === 'DECLINED'
        ? 'declined'
        : transaction.status === 'PENDING'
        ? 'pending'
        : 'error';

    // Determinar el estado de la orden
    const orderStatus =
      transaction.status === 'APPROVED' ? 'processing' : order.status;

    // Actualizar la orden en Supabase
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: paymentStatus,
        status: orderStatus,
        wompi_transaction_id: transaction.id,
        payment_method: transaction.payment_method_type,
        paid_at: transaction.status === 'APPROVED' ? new Date().toISOString() : null,
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
