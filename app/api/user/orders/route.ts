import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    // Obtener el token de Firebase del header
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];

    // Verificar el token de Firebase
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(token);
    } catch (error) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    const userEmail = decodedToken.email;

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Email no encontrado en el token' },
        { status: 400 }
      );
    }

    // Obtener órdenes del usuario desde Prisma
    const orders = await prisma.order.findMany({
      where: {
        customerEmail: userEmail,
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Formatear las órdenes para el cliente
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      total: order.total,
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt.toISOString(),
      itemCount: order.items.length,
      items: order.items.map((item) => ({
        id: item.id,
        name: item.name,
        brand: item.brand,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal,
        image: item.image,
      })),
    }));

    return NextResponse.json({
      success: true,
      orders: formattedOrders,
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json(
      { error: 'Error al obtener las órdenes' },
      { status: 500 }
    );
  }
}
