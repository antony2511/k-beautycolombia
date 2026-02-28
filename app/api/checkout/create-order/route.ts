import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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

    // Crear orden con items en Prisma
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerEmail: validatedCustomer.email,
        customerName: validatedCustomer.fullName,
        customerPhone: validatedCustomer.phone,
        customerDocument: {
          type: validatedCustomer.documentType,
          number: validatedCustomer.documentNumber,
        },
        shippingAddress,
        subtotal,
        discount: 0,
        shipping,
        total,
        status: 'pending',
        paymentStatus: 'pending',
        paymentId: referenceCode,
        items: {
          create: cartItems.map((item: CartItem) => ({
            productId: item.productId,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            subtotal: item.product.price * item.quantity,
            image: (item.product.images as string[])?.[0] || '',
            brand: (item.product as unknown as { brand?: string }).brand || '',
          })),
        },
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      referenceCode,
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
