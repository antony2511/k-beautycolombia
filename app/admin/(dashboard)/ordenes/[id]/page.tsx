'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import StatusBadge from '@/components/admin/StatusBadge';
import { formatCurrency } from '@/lib/utils/currency';
import { formatDateTime } from '@/lib/utils/date';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  image?: string;
  brand?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  customerDocument?: { type: string; number: string };
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: string;
  paymentMethod?: string;
  paymentId?: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    instructions?: string;
  };
  trackingNumber?: string;
  notes?: string;
  statusHistory?: Array<{
    status: string;
    timestamp: string;
    notes: string;
  }>;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  processing: 'Procesando',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const paymentStatusLabels: Record<string, string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  failed: 'Fallido',
  refunded: 'Reembolsado',
};

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [orderId, setOrderId] = useState<string>('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  useEffect(() => {
    params.then((p) => {
      setOrderId(p.id);
      fetchOrder(p.id);
    });
  }, []);

  const fetchOrder = async (id: string) => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`/api/admin/orders/${id}`);
      const data = await response.json();

      if (response.ok) {
        setOrder(data.order);
        setTrackingNumber(data.order.trackingNumber || '');
      } else {
        setError(data.error || 'Error al cargar orden');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (!newStatus) return;

    try {
      setUpdating(true);
      setError('');

      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          notes: statusNotes,
          trackingNumber: newStatus === 'shipped' ? trackingNumber : undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOrder(data.order);
        setShowStatusModal(false);
        setNewStatus('');
        setStatusNotes('');
      } else {
        setError(data.error || 'Error al actualizar estado');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Error al conectar con el servidor');
    } finally {
      setUpdating(false);
    }
  };

  const getAvailableStatuses = (currentStatus: string) => {
    const transitions: Record<string, string[]> = {
      pending: ['processing', 'shipped', 'delivered', 'cancelled'],
      processing: ['shipped', 'delivered', 'cancelled'],
      shipped: ['delivered', 'processing', 'cancelled'],
      delivered: ['shipped', 'processing'],
      cancelled: ['pending', 'processing'],
    };
    return transitions[currentStatus] || [];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-secondary border-t-transparent"></div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
        <Link
          href="/admin/ordenes"
          className="inline-block px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark"
        >
          Volver a Órdenes
        </Link>
      </div>
    );
  }

  if (!order) return null;

  const availableStatuses = getAvailableStatuses(order.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold text-primary">
              Orden #{order.orderNumber}
            </h1>
            <StatusBadge status={order.status} label={statusLabels[order.status]} />
          </div>
          <p className="text-gray-600">
            Creada el {formatDateTime(order.createdAt)}
          </p>
        </div>
        <div className="flex gap-2">
          {availableStatuses.length > 0 && (
            <button
              onClick={() => setShowStatusModal(true)}
              className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark"
            >
              Cambiar Estado
            </button>
          )}
          <Link
            href="/admin/ordenes"
            className="px-4 py-2 border-2 border-accent-light rounded-lg hover:border-secondary"
          >
            Volver
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6">
            <h2 className="text-xl font-bold text-primary mb-4">
              Productos ({order.items.length})
            </h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 border-2 border-accent-light rounded-lg"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-primary">{item.name}</h3>
                    {item.brand && (
                      <p className="text-sm text-gray-600">{item.brand}</p>
                    )}
                    <p className="text-sm text-gray-600 mt-1">
                      Cantidad: {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">
                      {formatCurrency(item.subtotal)}
                    </p>
                  </div>
                </div>
              ))}

              {/* Totales */}
              <div className="border-t-2 border-accent-light pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Descuento:</span>
                    <span className="text-red-600">
                      -{formatCurrency(order.discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Envío:</span>
                  <span>{formatCurrency(order.shipping)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-primary border-t-2 border-accent-light pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dirección de Envío */}
          <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6">
            <h2 className="text-xl font-bold text-primary mb-4">
              Dirección de Envío
            </h2>
            <div className="space-y-2 text-gray-700">
              <p className="font-semibold">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.zipCode}
              </p>
              <p>Tel: {order.shippingAddress.phone}</p>
              {order.shippingAddress.instructions && (
                <div className="mt-4 p-3 bg-accent-light/20 rounded-lg">
                  <p className="text-sm font-semibold mb-1">
                    Instrucciones de entrega:
                  </p>
                  <p className="text-sm">{order.shippingAddress.instructions}</p>
                </div>
              )}
            </div>
          </div>

          {/* Historial de Estados */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6">
              <h2 className="text-xl font-bold text-primary mb-4">
                Historial de Estados
              </h2>
              <div className="space-y-4">
                {order.statusHistory.map((history, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 border-l-4 border-secondary bg-accent-light/10 rounded-r-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <StatusBadge
                          status={history.status as any}
                          label={statusLabels[history.status]}
                        />
                        <span className="text-sm text-gray-600">
                          {formatDateTime(history.timestamp)}
                        </span>
                      </div>
                      {history.notes && (
                        <p className="text-sm text-gray-600 mt-2">{history.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Columna Lateral */}
        <div className="space-y-6">
          {/* Cliente */}
          <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6">
            <h2 className="text-xl font-bold text-primary mb-4">Cliente</h2>
            <div className="space-y-2 text-gray-700">
              <p className="font-semibold">{order.customerName}</p>
              <p className="text-sm">{order.customerEmail}</p>
              {order.customerPhone && (
                <p className="text-sm">{order.customerPhone}</p>
              )}
              {order.customerDocument && (
                <p className="text-sm">
                  {order.customerDocument.type}: {order.customerDocument.number}
                </p>
              )}
            </div>
          </div>

          {/* Información de Pago */}
          <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6">
            <h2 className="text-xl font-bold text-primary mb-4">Pago</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Método de Pago</p>
                <p className="font-semibold capitalize">
                  {order.paymentMethod === 'stripe' ? 'Tarjeta' : order.paymentMethod}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <StatusBadge
                  status={order.paymentStatus as any}
                  label={paymentStatusLabels[order.paymentStatus]}
                />
              </div>
              {order.paymentId && (
                <div>
                  <p className="text-sm text-gray-600">ID Transacción</p>
                  <p className="text-sm font-mono">{order.paymentId}</p>
                </div>
              )}
            </div>
          </div>

          {/* Tracking */}
          {(order.status === 'shipped' || order.status === 'delivered') && (
            <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6">
              <h2 className="text-xl font-bold text-primary mb-4">Tracking</h2>
              {order.trackingNumber ? (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Número de Seguimiento</p>
                  <p className="font-mono font-semibold">{order.trackingNumber}</p>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  No hay número de seguimiento disponible
                </p>
              )}
            </div>
          )}

          {/* Notas */}
          {order.notes && (
            <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6">
              <h2 className="text-xl font-bold text-primary mb-4">Notas</h2>
              <p className="text-gray-700 text-sm">{order.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Cambiar Estado */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-primary mb-4">
              Cambiar Estado de Orden
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nuevo Estado
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
                >
                  <option value="">Seleccionar estado</option>
                  {availableStatuses.map((status) => (
                    <option key={status} value={status}>
                      {statusLabels[status]}
                    </option>
                  ))}
                </select>
              </div>

              {newStatus === 'shipped' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Tracking
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Ej: 1234567890"
                    className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas (opcional)
                </label>
                <textarea
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  rows={3}
                  placeholder="Agregar notas sobre el cambio de estado..."
                  className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setNewStatus('');
                  setStatusNotes('');
                }}
                className="px-4 py-2 border-2 border-accent-light rounded-lg hover:border-secondary transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleStatusChange}
                disabled={!newStatus || updating}
                className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors disabled:opacity-50"
              >
                {updating ? 'Actualizando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
