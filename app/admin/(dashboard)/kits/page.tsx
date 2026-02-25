'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';

interface KitRow {
  id: string;
  name: string;
  tagline: string;
  image: string;
  discount?: number | null;
  isActive: boolean;
  items: { id: string }[];
}

export default function AdminKitsPage() {
  const [kits, setKits] = useState<KitRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchKits();
  }, [pagination.page]);

  const fetchKits = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      const response = await fetch(`/api/admin/kits?${params}`);
      const data = await response.json();

      if (response.ok) {
        setKits(data.kits);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching kits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Desactivar este kit?')) return;

    try {
      const response = await fetch(`/api/admin/kits/${id}`, { method: 'DELETE' });
      if (response.ok) fetchKits();
    } catch (error) {
      console.error('Error deleting kit:', error);
    }
  };

  const columns = [
    {
      header: 'Imagen',
      accessorKey: 'image' as keyof KitRow,
      cell: (row: KitRow) => (
        <img src={row.image} alt={row.name} className="w-10 h-10 object-cover rounded-md" />
      ),
    },
    {
      header: 'Nombre',
      accessorKey: 'name' as keyof KitRow,
    },
    {
      header: '# Productos',
      accessorKey: 'items' as keyof KitRow,
      cell: (row: KitRow) => (
        <span className="font-medium text-gray-700">{row.items.length}</span>
      ),
    },
    {
      header: 'Descuento',
      accessorKey: 'discount' as keyof KitRow,
      cell: (row: KitRow) =>
        row.discount ? (
          <span className="inline-block bg-secondary/10 text-secondary text-xs font-bold px-2 py-0.5 rounded-full">
            -{row.discount}%
          </span>
        ) : (
          <span className="text-gray-400 text-sm">—</span>
        ),
    },
    {
      header: 'Estado',
      accessorKey: 'isActive' as keyof KitRow,
      cell: (row: KitRow) => (
        <StatusBadge
          status={row.isActive ? 'delivered' : 'cancelled'}
          label={row.isActive ? 'Activo' : 'Inactivo'}
        />
      ),
    },
    {
      header: 'Acciones',
      accessorKey: 'id' as keyof KitRow,
      cell: (row: KitRow) => (
        <div className="flex gap-2">
          <Link
            href={`/admin/kits/editar/${row.id}`}
            className="text-sm text-secondary hover:text-secondary-dark font-medium"
          >
            Editar
          </Link>
          <button
            onClick={() => handleDelete(row.id)}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Kits y Rutinas</h1>
          <p className="text-gray-600 mt-1">Gestiona los kits curados de tu tienda</p>
        </div>
        <Link
          href="/admin/kits/nuevo"
          className="bg-secondary hover:bg-secondary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          + Nuevo Kit
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-accent-light/30 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-secondary border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Cargando kits...</p>
          </div>
        ) : (
          <DataTable data={kits} columns={columns} searchKey="name" />
        )}

        {!loading && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Mostrando {kits.length} de {pagination.total} kits
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="px-4 py-2 text-gray-700">
                Página {pagination.page} de {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
