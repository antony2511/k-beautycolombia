import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken } from '@/lib/admin/auth';
import { prisma } from '@/lib/prisma';
import { db } from '@/lib/firebase-admin';

export async function GET(request: Request) {
  try {
    // Verificar autenticación admin
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener parámetros de fecha
    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    // Calcular fechas (por defecto últimos 30 días)
    const endDate = endDateParam ? new Date(endDateParam) : new Date();
    const startDate = startDateParam
      ? new Date(startDateParam)
      : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

    // 1. Obtener estadísticas de productos
    const totalProducts = await prisma.product.count({
      where: { isActive: true },
    });

    const lowStockProducts = await prisma.product.count({
      where: {
        isActive: true,
        stock: { lt: 10 },
      },
    });

    // 2. Obtener estadísticas de órdenes desde MySQL
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    let totalSales = 0;
    let ordersByStatus: Record<string, number> = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    const salesByDay: Record<string, number> = {};
    const productSales: Record<string, { name: string; quantity: number }> = {};

    // Procesar órdenes desde MySQL
    orders.forEach((order) => {
      const status = order.status || 'pending';

      // Contar por estado
      ordersByStatus[status] = (ordersByStatus[status] || 0) + 1;

      // Sumar ventas totales
      totalSales += order.total || 0;

      // Agrupar ventas por día
      const orderDate = order.createdAt;
      if (orderDate) {
        const dateKey = orderDate.toISOString().split('T')[0];
        salesByDay[dateKey] = (salesByDay[dateKey] || 0) + (order.total || 0);
      }

      // Contar productos vendidos
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          if (item.productId) {
            if (!productSales[item.productId]) {
              productSales[item.productId] = {
                name: item.name || 'Producto',
                quantity: 0,
              };
            }
            productSales[item.productId].quantity += item.quantity || 0;
          }
        });
      }
    });

    // 3. Obtener estadísticas de usuarios desde Firestore
    let usersSnapshot: any = { size: 0 };

    try {
      usersSnapshot = await db
        .collection('users')
        .limit(1000)
        .get();
    } catch (error) {
      console.error('Error fetching users:', error);
    }

    const newUsers = usersSnapshot.size;

    // 4. Preparar ventas por día para la gráfica (últimos 30 días)
    const dailySales = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(endDate.getTime() - i * 24 * 60 * 60 * 1000);
      const dateKey = date.toISOString().split('T')[0];
      dailySales.push({
        date: dateKey,
        sales: salesByDay[dateKey] || 0,
      });
    }

    // 5. Top 10 productos más vendidos
    const topProducts = Object.entries(productSales)
      .sort((a, b) => b[1].quantity - a[1].quantity)
      .slice(0, 10)
      .map(([id, data]) => ({
        productId: id,
        name: data.name,
        quantity: data.quantity,
      }));

    // 6. Últimas 5 órdenes desde MySQL
    let recentOrders: any[] = [];

    try {
      const recentOrdersData = await prisma.order.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
        select: {
          id: true,
          customerName: true,
          total: true,
          status: true,
          createdAt: true,
        },
      });

      recentOrders = recentOrdersData.map((order) => ({
        id: order.id,
        customerName: order.customerName || 'Cliente',
        total: order.total || 0,
        status: order.status || 'pending',
        createdAt: order.createdAt.toISOString(),
      }));
    } catch (error) {
      console.error('Error fetching recent orders:', error);
    }

    // Respuesta final
    return NextResponse.json({
      kpis: {
        totalSales,
        pendingOrders: ordersByStatus.pending || 0,
        lowStockProducts,
        newUsers,
      },
      ordersByStatus,
      dailySales,
      topProducts,
      recentOrders,
      totalProducts,
      totalOrders: orders.length,
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    );
  }
}
