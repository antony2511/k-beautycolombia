'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StatusBadge from '@/components/admin/StatusBadge';
import { formatCurrency } from '@/lib/utils/currency';
import { formatDateTime } from '@/lib/utils/date';

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  itemCount: number;
}

export default function MisOrdenesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      fetchOrders();
    }
  }, [user, authLoading, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');

      if (!user) {
        setOrders([]);
        return;
      }

      // Obtener el token de Firebase
      const token = await user.getIdToken();

      const response = await fetch('/api/user/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders || []);
      } else {
        setError(data.error || 'Error al cargar las órdenes');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Error al cargar las órdenes');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-secondary border-t-transparent"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl pt-24">
      <div className="mb-8">
        <Link
          href="/perfil"
          className="inline-flex items-center gap-2 text-secondary hover:text-secondary-dark transition-colors mb-4"
        >
          <span className="material-icons">arrow_back</span>
          Volver a Mi Perfil
        </Link>
        <h1 className="text-3xl font-bold text-primary">Mis Órdenes</h1>
        <p className="text-gray-600 mt-2">
          Revisa el estado de tus pedidos recientes
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center pb-12 pt-24">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-secondary border-t-transparent"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-12 text-center">
          <span className="material-icons text-6xl text-accent mb-4">
            shopping_bag
          </span>
          <h2 className="text-2xl font-bold text-primary mb-2">
            No tienes órdenes aún
          </h2>
          <p className="text-gray-600 mb-6">
            Cuando realices tu primera compra, aparecerá aquí
          </p>
          <Link
            href="/tienda"
            className="inline-block px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors"
          >
            Ir a la Tienda
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/perfil/ordenes/${order.id}`}
              className="block bg-white rounded-xl shadow-md border border-accent-light/30 p-6 hover:border-secondary transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-primary">
                      Orden #{order.orderNumber}
                    </h3>
                    <StatusBadge status={order.status as any} />
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatDateTime(order.createdAt)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.itemCount} {order.itemCount === 1 ? 'producto' : 'productos'}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-xl font-bold text-primary">
                      {formatCurrency(order.total)}
                    </p>
                  </div>
                  <span className="material-icons text-accent">
                    chevron_right
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      </div>
      <Footer />
    </>
  );
}
