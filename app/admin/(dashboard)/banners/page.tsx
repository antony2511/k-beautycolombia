'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import StatusBadge from '@/components/admin/StatusBadge';

interface Banner {
  id: string;
  message: string;
  subMessage?: string | null;
  type: string;
  variant: string;
  link?: string | null;
  linkText?: string | null;
  isActive: boolean;
  dismissible: boolean;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
}

const typeLabel: Record<string, string> = {
  top_bar: 'Barra superior',
  modal: 'Popup modal',
};

const variantLabel: Record<string, { label: string; color: string }> = {
  promo: { label: 'Promo', color: 'bg-pink-100 text-pink-700' },
  sale: { label: 'Oferta', color: 'bg-red-100 text-red-700' },
  info: { label: 'Info', color: 'bg-blue-100 text-blue-700' },
  warning: { label: 'Aviso', color: 'bg-amber-100 text-amber-700' },
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/banners');
      const data = await res.json();
      if (res.ok) setBanners(data.banners);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (banner: Banner) => {
    try {
      await fetch(`/api/admin/banners/${banner.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !banner.isActive }),
      });
      fetchBanners();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este banner permanentemente?')) return;
    try {
      await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
      fetchBanners();
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Banners y Alertas</h1>
          <p className="text-gray-600 mt-1">
            Gestiona las barras de anuncio y popups que ven los visitantes
          </p>
        </div>
        <Link
          href="/admin/banners/nuevo"
          className="bg-secondary hover:bg-secondary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          + Nuevo Banner
        </Link>
      </div>

      {/* Preview info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 text-sm text-blue-800">
        <span className="material-icons text-blue-500 flex-shrink-0">info</span>
        <div>
          <strong>Tipos disponibles:</strong>{' '}
          <span className="font-medium">Barra superior</span> — aparece encima del navbar en todas las páginas.{' '}
          <span className="font-medium">Popup modal</span> — ventana emergente al cargar la página (solo se muestra una vez por sesión).
          Los banners desactivados <strong>no son visibles</strong> para los usuarios.
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md border border-accent-light/30 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-secondary border-t-transparent" />
            <p className="mt-4 text-gray-600">Cargando banners...</p>
          </div>
        ) : banners.length === 0 ? (
          <div className="p-12 text-center">
            <span className="material-icons text-5xl text-gray-300 mb-3 block">campaign</span>
            <p className="text-gray-500 font-medium">No hay banners creados</p>
            <p className="text-gray-400 text-sm mt-1">
              Crea tu primer banner para mostrar ofertas o alertas a los usuarios.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-gray-600 font-semibold">Mensaje</th>
                  <th className="text-left px-6 py-3 text-gray-600 font-semibold">Tipo</th>
                  <th className="text-left px-6 py-3 text-gray-600 font-semibold">Variante</th>
                  <th className="text-left px-6 py-3 text-gray-600 font-semibold">Vigencia</th>
                  <th className="text-left px-6 py-3 text-gray-600 font-semibold">Estado</th>
                  <th className="text-left px-6 py-3 text-gray-600 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {banners.map((banner) => {
                  const v = variantLabel[banner.variant] ?? variantLabel.promo;
                  return (
                    <tr key={banner.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 max-w-xs">
                        <p className="font-medium text-gray-800 truncate">{banner.message}</p>
                        {banner.subMessage && (
                          <p className="text-gray-400 text-xs truncate mt-0.5">{banner.subMessage}</p>
                        )}
                        {banner.link && (
                          <p className="text-blue-500 text-xs truncate mt-0.5">
                            <span className="material-icons text-xs align-middle mr-0.5">link</span>
                            {banner.linkText || banner.link}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-gray-600">
                          <span className="material-icons text-sm">
                            {banner.type === 'modal' ? 'open_in_new' : 'horizontal_rule'}
                          </span>
                          {typeLabel[banner.type] ?? banner.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${v.color}`}>
                          {v.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">
                        {banner.startDate || banner.endDate ? (
                          <>
                            <div>Desde: {formatDate(banner.startDate)}</div>
                            <div>Hasta: {formatDate(banner.endDate)}</div>
                          </>
                        ) : (
                          <span className="text-gray-400">Sin límite</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge
                          status={banner.isActive ? 'delivered' : 'cancelled'}
                          label={banner.isActive ? 'Activo' : 'Inactivo'}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleToggle(banner)}
                            className={`text-xs font-medium transition-colors ${
                              banner.isActive
                                ? 'text-amber-600 hover:text-amber-700'
                                : 'text-green-600 hover:text-green-700'
                            }`}
                          >
                            {banner.isActive ? 'Desactivar' : 'Activar'}
                          </button>
                          <Link
                            href={`/admin/banners/editar/${banner.id}`}
                            className="text-secondary hover:text-secondary-dark text-xs font-medium"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => handleDelete(banner.id)}
                            className="text-red-500 hover:text-red-700 text-xs font-medium"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
