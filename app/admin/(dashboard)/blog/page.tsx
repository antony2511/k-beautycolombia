'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  isPublished: boolean;
  author: string;
  createdAt: string;
}

const categoryLabels: Record<string, string> = {
  rutina_dia: 'Rutina de día',
  rutina_noche: 'Rutina de noche',
  ingredientes: 'Ingredientes',
  casos_exito: 'Casos de éxito',
  consejos: 'Consejos',
};

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchPosts();
  }, [search, categoryFilter, statusFilter, pagination.page]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (search) params.append('search', search);
      if (categoryFilter) params.append('category', categoryFilter);
      if (statusFilter !== '') params.append('isPublished', statusFilter);

      const response = await fetch(`/api/admin/blog?${params}`);
      const data = await response.json();

      if (response.ok) {
        setPosts(data.posts);
        setPagination((prev) => ({ ...prev, ...data.pagination }));
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este artículo? Esta acción no se puede deshacer.')) return;

    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const columns = [
    {
      header: 'Título',
      accessorKey: 'title' as keyof BlogPost,
    },
    {
      header: 'Categoría',
      accessorKey: 'category' as keyof BlogPost,
      cell: (row: BlogPost) => categoryLabels[row.category] || row.category,
    },
    {
      header: 'Estado',
      accessorKey: 'isPublished' as keyof BlogPost,
      cell: (row: BlogPost) => (
        <StatusBadge
          status={row.isPublished ? 'delivered' : 'cancelled'}
          label={row.isPublished ? 'Publicado' : 'Borrador'}
        />
      ),
    },
    {
      header: 'Fecha',
      accessorKey: 'createdAt' as keyof BlogPost,
      cell: (row: BlogPost) =>
        new Date(row.createdAt).toLocaleDateString('es-CO', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
    },
    {
      header: 'Acciones',
      accessorKey: 'id' as keyof BlogPost,
      cell: (row: BlogPost) => (
        <div className="flex gap-2">
          <Link
            href={`/admin/blog/editar/${row.id}`}
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Blog</h1>
          <p className="text-gray-600 mt-1">
            Gestiona los artículos y rutinas de skincare
          </p>
        </div>
        <Link
          href="/admin/blog/nuevo"
          className="bg-secondary hover:bg-secondary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          + Nuevo Artículo
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <input
              type="text"
              placeholder="Buscar por título..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
            >
              <option value="">Todas</option>
              <option value="rutina_dia">Rutina de día</option>
              <option value="rutina_noche">Rutina de noche</option>
              <option value="ingredientes">Ingredientes</option>
              <option value="casos_exito">Casos de éxito</option>
              <option value="consejos">Consejos</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
            >
              <option value="">Todos</option>
              <option value="true">Publicados</option>
              <option value="false">Borradores</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-md border border-accent-light/30 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-secondary border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Cargando artículos...</p>
          </div>
        ) : (
          <DataTable
            data={posts}
            columns={columns}
            searchKey="title"
          />
        )}

        {/* Paginación */}
        {!loading && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Mostrando {posts.length} de {pagination.total} artículos
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="px-4 py-2 text-gray-700">
                Página {pagination.page} de {pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
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
