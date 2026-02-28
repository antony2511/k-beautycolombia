'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Subscriber {
  id: string;
  email: string;
  source: string;
  couponSent: boolean;
  isActive: boolean;
  createdAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function SuscriptoresPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 20, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/subscribers?${params}`);
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data.subscribers);
        setPagination(data.pagination);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timer = setTimeout(fetchSubscribers, 300);
    return () => clearTimeout(timer);
  }, [fetchSubscribers]);

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este suscriptor?')) return;
    setDeleting(id);
    try {
      await fetch('/api/admin/subscribers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchSubscribers();
    } finally {
      setDeleting(null);
    }
  }

  function handleExportCSV() {
    const rows = [
      ['Email', 'Fuente', 'Cupón enviado', 'Fecha'],
      ...subscribers.map((s) => [
        s.email,
        s.source,
        s.couponSent ? 'Sí' : 'No',
        new Date(s.createdAt).toLocaleDateString('es-CO'),
      ]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `suscriptores-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Suscriptores</h1>
          <p className="text-sm text-gray-500 mt-1">
            {pagination.total} suscriptor{pagination.total !== 1 ? 'es' : ''} registrado{pagination.total !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span className="material-icons text-sm">download</span>
            Exportar CSV
          </button>
          <Link
            href="/admin/configuracion"
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <span className="material-icons text-sm">settings</span>
            Config. Email
          </Link>
        </div>
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: pagination.total, icon: 'people', color: 'bg-blue-50 text-blue-700' },
          { label: 'Cupón enviado', value: subscribers.filter((s) => s.couponSent).length, icon: 'local_offer', color: 'bg-green-50 text-green-700' },
          { label: 'Sin cupón', value: subscribers.filter((s) => !s.couponSent).length, icon: 'mail_outline', color: 'bg-yellow-50 text-yellow-700' },
          { label: 'Esta página', value: subscribers.length, icon: 'list', color: 'bg-purple-50 text-purple-700' },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-xl p-4 ${stat.color} border border-current/10`}>
            <span className="material-icons text-xl mb-1">{stat.icon}</span>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs font-medium opacity-80">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Buscador */}
      <div className="relative">
        <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
        <input
          type="text"
          placeholder="Buscar por email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
        />
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400">
            <span className="material-icons text-4xl animate-spin">refresh</span>
          </div>
        ) : subscribers.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <span className="material-icons text-4xl mb-2">inbox</span>
            <p>No hay suscriptores {search ? 'con ese email' : 'aún'}</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Fuente</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Cupón</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Fecha</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{sub.email}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 capitalize">
                      {sub.source}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {sub.couponSent ? (
                      <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                        <span className="material-icons text-sm">check_circle</span> Enviado
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-yellow-600 text-xs font-medium">
                        <span className="material-icons text-sm">schedule</span> Pendiente
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                    {new Date(sub.createdAt).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(sub.id)}
                      disabled={deleting === sub.id}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      title="Eliminar"
                    >
                      <span className="material-icons text-sm">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Paginación */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <span className="text-xs text-gray-500">
              Página {pagination.page} de {pagination.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-white transition-colors"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === pagination.totalPages}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-white transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
