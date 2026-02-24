'use client';

import { useState, useEffect } from 'react';
import StatCard from '@/components/admin/StatCard';
import StatusBadge from '@/components/admin/StatusBadge';
import { formatCurrency } from '@/lib/utils/currency';
import { formatShortDate } from '@/lib/utils/date';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import Link from 'next/link';

interface DashboardStats {
  kpis: {
    totalSales: number;
    pendingOrders: number;
    lowStockProducts: number;
    newUsers: number;
  };
  dailySales: Array<{ date: string; sales: number }>;
  topProducts: Array<{ productId: string; name: string; quantity: number }>;
  recentOrders: Array<{
    id: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30'); // días

  useEffect(() => {
    fetchStats();
  }, [dateRange]);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date(
        endDate.getTime() - parseInt(dateRange) * 24 * 60 * 60 * 1000
      );

      const response = await fetch(
        `/api/admin/stats?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <span className="material-icons text-6xl text-accent animate-spin">
            refresh
          </span>
          <p className="text-accent mt-4">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-accent">Error al cargar estadísticas</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with date range selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-primary">Resumen de Negocio</h2>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
        >
          <option value="7">Últimos 7 días</option>
          <option value="30">Últimos 30 días</option>
          <option value="90">Últimos 90 días</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Ventas Totales"
          value={formatCurrency(stats.kpis.totalSales)}
          icon="payments"
          color="success"
        />
        <StatCard
          title="Órdenes Pendientes"
          value={stats.kpis.pendingOrders}
          icon="pending_actions"
          color="warning"
        />
        <StatCard
          title="Productos Bajo Stock"
          value={stats.kpis.lowStockProducts}
          icon="inventory_2"
          color="secondary"
        />
        <StatCard
          title="Nuevos Usuarios"
          value={stats.kpis.newUsers}
          icon="person_add"
          color="info"
        />
      </div>

      {/* Sales Chart */}
      <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6">
        <h3 className="text-xl font-bold text-primary mb-6">
          Ventas Diarias (COP)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.dailySales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getDate()}/${date.getMonth() + 1}`;
              }}
            />
            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => formatShortDate(label)}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#FF9B9B"
              strokeWidth={2}
              name="Ventas"
              dot={{ fill: '#FF9B9B', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products Chart */}
        <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6">
          <h3 className="text-xl font-bold text-primary mb-6">
            Productos Más Vendidos
          </h3>
          {stats.topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={150}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Bar dataKey="quantity" fill="#FF9B9B" name="Cantidad Vendida" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-accent text-center py-12">
              No hay ventas en este período
            </p>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6">
          <h3 className="text-xl font-bold text-primary mb-6">
            Últimas Órdenes
          </h3>
          <div className="space-y-3">
            {stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/ordenes/${order.id}`}
                  className="flex items-center justify-between p-4 bg-accent-light/10 rounded-lg hover:bg-accent-light/20 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-primary">
                      {order.customerName}
                    </p>
                    <p className="text-sm text-accent">
                      {formatShortDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-primary">
                      {formatCurrency(order.total)}
                    </p>
                    <StatusBadge
                      status={order.status as any}
                    />
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-accent text-center py-12">
                No hay órdenes recientes
              </p>
            )}
          </div>
          {stats.recentOrders.length > 0 && (
            <Link
              href="/admin/ordenes"
              className="block mt-4 text-center text-secondary hover:text-secondary/80 font-medium"
            >
              Ver todas las órdenes →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
