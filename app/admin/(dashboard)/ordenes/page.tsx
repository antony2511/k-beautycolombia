'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { formatCurrency } from '@/lib/utils/currency';
import { formatDateTime } from '@/lib/utils/date';

interface Order {
  id: string;
  customerEmail: string;
  customerName: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  createdAt: string;
}

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  processing: 'Procesando',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export default function OrdenesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [search, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();

      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      params.append('limit', '50');

      const response = await fetch(`/api/admin/orders?${params}`);
      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders || []);
      } else {
        setError(data.error || 'Error al cargar órdenes');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const columns: any[] = [
    {
      accessorKey: 'id',
      header: '#Orden',
      cell: ({ row }: any) => (
        <span className="font-mono text-sm text-gray-600">
          {row.original.id.substring(0, 8)}
        </span>
      ),
    },
    {
      accessorKey: 'customerName',
      header: 'Cliente',
    },
    {
      accessorKey: 'customerEmail',
      header: 'Email',
      cell: ({ row }: any) => (
        <span className="text-sm text-gray-600">{row.original.customerEmail}</span>
      ),
    },
    {
      accessorKey: 'total',
      header: 'Total',
      cell: ({ row }: any) => (
        <span className="font-semibold">{formatCurrency(row.original.total)}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }: any) => (
        <StatusBadge status={row.original.status} label={statusLabels[row.original.status]} />
      ),
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Pago',
      cell: ({ row }: any) => (
        <span className="text-sm capitalize">
          {row.original.paymentMethod === 'stripe' ? 'Tarjeta' : row.original.paymentMethod}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Fecha',
      cell: ({ row }: any) => (
        <span className="text-sm text-gray-600">
          {formatDateTime(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }: any) => (
        <Link
          href={`/admin/ordenes/${row.original.id}`}
          className="text-sm text-secondary hover:text-secondary-dark font-medium"
        >
          Ver Detalle
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Órdenes</h1>
          <p className="text-gray-600 mt-1">
            Gestiona todas las órdenes de tu tienda
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-secondary">
            {orders.length}
          </div>
          <div className="text-sm text-gray-600">Total de órdenes</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <input
              type="text"
              placeholder="Buscar por #orden, email o nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
            >
              <option value="">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="processing">Procesando</option>
              <option value="shipped">Enviado</option>
              <option value="delivered">Entregado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-md border border-accent-light/30 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-secondary border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Cargando órdenes...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <div className="text-red-600 mb-2">⚠️ {error}</div>
            <button
              onClick={fetchOrders}
              className="text-sm text-secondary hover:text-secondary-dark font-medium"
            >
              Reintentar
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg">No hay órdenes</p>
            <p className="text-sm mt-2">
              Cuando los clientes realicen compras, aparecerán aquí
            </p>
          </div>
        ) : (
          <DataTable data={orders} columns={columns} searchKey="customerName" />
        )}
      </div>

      {/* Resumen de estados */}
      {!loading && !error && orders.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(statusLabels).map(([status, label]) => {
            const count = orders.filter((o) => o.status === status).length;
            return (
              <div
                key={status}
                className="bg-white rounded-xl shadow-md border border-accent-light/30 p-4 text-center"
              >
                <div className="text-2xl font-bold text-primary">{count}</div>
                <div className="text-sm text-gray-600 mt-1">{label}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
