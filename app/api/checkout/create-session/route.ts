import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOrderNumber } from '@/lib/utils/order-number';
import { checkoutSchema } from '@/lib/validations/checkout';
import type { CartItem } from '@/types';
import { sendOrderConfirmation } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerInfo, cartItems, subtotal, shipping, total } = body;

    console.log('📦 Creating order with data:', {
      customer: customerInfo.fullName,
      email: customerInfo.email,
      items: cartItems.length,
      total: total,
    });

    // Validar datos del cliente con Zod
    const validatedCustomer = checkoutSchema.parse(customerInfo);

    // Validar que haya items en el carrito
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'El carrito está vacío' },
        { status: 400 }
      );
    }

    // Generar número de orden único
    const orderNumber = generateOrderNumber();
    console.log('📝 Order number generated:', orderNumber);

    // Preparar dirección de envío
    const shippingAddress = {
      fullName: validatedCustomer.fullName,
      phone: validatedCustomer.phone,
      address: validatedCustomer.address,
      city: validatedCustomer.city,
      department: validatedCustomer.department,
      postalCode: validatedCustomer.postalCode || '',
    };

    // Crear orden en la base de datos con Prisma
    const order = await prisma.order.create({
      data: {
        orderNumber: orderNumber,
        customerName: validatedCustomer.fullName,
        customerEmail: validatedCustomer.email,
        customerPhone: validatedCustomer.phone,
        customerDocument: {
          type: validatedCustomer.documentType,
          number: validatedCustomer.documentNumber,
        },
        shippingAddress: {
          fullName: validatedCustomer.fullName,
          address: validatedCustomer.address,
          city: validatedCustomer.city,
          state: validatedCustomer.department,
          zipCode: validatedCustomer.postalCode || '',
          phone: validatedCustomer.phone,
          instructions: validatedCustomer.deliveryInstructions || '',
        },
        notes: validatedCustomer.deliveryInstructions || null,
        subtotal,
        discount: 0,
        shipping,
        total,
        status: 'pending',
        paymentStatus: 'pending',
        items: {
          create: cartItems.map((item: CartItem) => ({
            productId: item.productId,
            name: item.product.name,
            brand: item.product.brand,
            image: item.product.image,
            price: item.product.price,
            quantity: item.quantity,
            subtotal: item.product.price * item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Verificar si Stripe está configurado
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const isDevelopmentMode = !stripeKey || stripeKey.startsWith('tu_strip');

    if (isDevelopmentMode) {
      // MODO DESARROLLO: Simular pago exitoso sin Stripe
      console.log('🔧 Development mode: Skipping Stripe, simulating successful payment');

      // Actualizar orden como pagada (simulación)
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'paid',
          paymentMethod: 'test',
          paymentId: `test_${Date.now()}`,
        },
      });

      console.log('✅ Order created successfully:', {
        id: order.id,
        orderNumber: order.orderNumber,
      });

      // Enviar email de confirmación
      sendOrderConfirmation({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        items: order.items.map((i) => ({
          name: i.name,
          brand: i.brand,
          quantity: i.quantity,
          price: i.price,
          image: i.image ?? undefined,
        })),
        subtotal,
        shipping,
        total,
        shippingAddress: order.shippingAddress as any,
      });

      // Redirigir directamente a confirmación (modo desarrollo)
      return NextResponse.json({
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        checkoutUrl: `${appUrl}/checkout/confirmacion/${order.id}?dev_mode=true`,
        sessionId: `dev_${order.id}`,
        developmentMode: true,
      });
    }

    // MODO PRODUCCIÓN: Usar Stripe real
    console.log('💳 Production mode: Creating Stripe checkout session');
    const Stripe = require('stripe');
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2024-12-18.acacia',
    });

    // Preparar line items para Stripe
    const lineItems = cartItems.map((item: CartItem) => ({
      price_data: {
        currency: 'cop',
        product_data: {
          name: item.product.name,
          description: `${item.product.brand} - K-Beauty Colombia`,
          images: [item.product.image],
        },
        unit_amount: Math.round(item.product.price),
      },
      quantity: item.quantity,
    }));

    // Agregar shipping como line item si aplica
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'cop',
          product_data: {
            name: 'Envío',
            description: 'Costo de envío a domicilio',
          },
          unit_amount: Math.round(shipping),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${appUrl}/checkout/confirmacion/${order.id}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout?canceled=true`,
      customer_email: validatedCustomer.email,
      metadata: {
        order_id: order.id,
        order_number: orderNumber,
      },
      locale: 'es',
    });

    // Actualizar orden con el session ID de Stripe
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentId: session.id,
      },
    });

    console.log('✅ Stripe session created:', session.id);

    // Enviar email de confirmación (Stripe — el pago se confirma vía webhook)
    sendOrderConfirmation({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      items: order.items.map((i) => ({
        name: i.name,
        brand: i.brand,
        quantity: i.quantity,
        price: i.price,
        image: i.image ?? undefined,
      })),
      subtotal,
      shipping,
      total,
      shippingAddress: order.shippingAddress as any,
    });

    // Retornar URL de checkout de Stripe
    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Error en create-session:', error);

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
