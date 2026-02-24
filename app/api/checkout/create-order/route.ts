import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { generateOrderNumber, generateReferenceCode } from '@/lib/utils/order-number';
import { checkoutSchema } from '@/lib/validations/checkout';
import type { CartItem } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerInfo, cartItems, subtotal, shipping, total } = body;

    // Validar datos del cliente con Zod
    const validatedCustomer = checkoutSchema.parse(customerInfo);

    // Validar que haya items en el carrito
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'El carrito está vacío' },
        { status: 400 }
      );
    }

    // Generar número de orden y referencia únicos
    const orderNumber = generateOrderNumber();
    const referenceCode = generateReferenceCode();

    // Preparar dirección de envío
    const shippingAddress = {
      fullName: validatedCustomer.fullName,
      phone: validatedCustomer.phone,
      address: validatedCustomer.address,
      city: validatedCustomer.city,
      department: validatedCustomer.department,
      postalCode: validatedCustomer.postalCode || '',
    };

    // Preparar items para la base de datos
    const dbItems = cartItems.map((item: CartItem) => ({
      productId: item.productId,
      productName: item.product.name,
      productBrand: item.product.brand,
      productImage: item.product.image,
      quantity: item.quantity,
      price: item.product.price,
      subtotal: item.product.price * item.quantity,
    }));

    // Crear cliente de Supabase
    const supabase = createServerSupabaseClient();

    // Insertar orden en la base de datos
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: validatedCustomer.fullName,
        customer_email: validatedCustomer.email,
        customer_phone: validatedCustomer.phone,
        customer_document_type: validatedCustomer.documentType,
        customer_document_number: validatedCustomer.documentNumber,
        items: dbItems,
        shipping_address: shippingAddress,
        delivery_instructions: validatedCustomer.deliveryInstructions || null,
        subtotal,
        discount: 0,
        shipping,
        total,
        status: 'pending',
        payment_status: 'pending',
        wompi_reference: referenceCode,
      })
      .select()
      .single();

    if (error) {
      console.error('Error al crear orden en Supabase:', error);
      return NextResponse.json(
        { error: 'Error al crear la orden' },
        { status: 500 }
      );
    }

    // Retornar datos para Wompi
    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
      referenceCode: referenceCode,
      totalAmount: total,
      customerEmail: validatedCustomer.email,
      customerName: validatedCustomer.fullName,
      customerPhone: validatedCustomer.phone,
    });
  } catch (error) {
    console.error('Error en create-order:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
