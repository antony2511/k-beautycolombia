'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { formatCurrency } from '@/lib/utils/currency';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  category?: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
}

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
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
    fetchProducts();
  }, [search, categoryFilter, statusFilter, pagination.page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (search) params.append('search', search);
      if (categoryFilter) params.append('category', categoryFilter);
      if (statusFilter) params.append('isActive', statusFilter);

      const response = await fetch(`/api/admin/products?${params}`);
      const data = await response.json();

      if (response.ok) {
        setProducts(data.products);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const columns = [
    {
      header: 'Imagen',
      accessorKey: 'image' as keyof Product,
      cell: (row: Product) => (
        <img
          src={row.image}
          alt={row.name}
          className="w-12 h-12 object-cover rounded-md"
        />
      ),
    },
    {
      header: 'Nombre',
      accessorKey: 'name' as keyof Product,
    },
    {
      header: 'Marca',
      accessorKey: 'brand' as keyof Product,
    },
    {
      header: 'Categoría',
      accessorKey: 'category' as keyof Product,
      cell: (row: Product) => row.category || '-',
    },
    {
      header: 'Precio',
      accessorKey: 'price' as keyof Product,
      cell: (row: Product) => formatCurrency(row.price),
    },
    {
      header: 'Stock',
      accessorKey: 'stock' as keyof Product,
      cell: (row: Product) => (
        <span
          className={`${
            row.stock < 10 ? 'text-red-600 font-semibold' : 'text-gray-700'
          }`}
        >
          {row.stock}
        </span>
      ),
    },
    {
      header: 'Estado',
      accessorKey: 'isActive' as keyof Product,
      cell: (row: Product) => (
        <StatusBadge
          status={row.isActive ? 'delivered' : 'cancelled'}
          label={row.isActive ? 'Activo' : 'Inactivo'}
        />
      ),
    },
    {
      header: 'Acciones',
      accessorKey: 'id' as keyof Product,
      cell: (row: Product) => (
        <div className="flex gap-2">
          <Link
            href={`/admin/productos/editar/${row.id}`}
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
          <h1 className="text-3xl font-bold text-primary">Productos</h1>
          <p className="text-gray-600 mt-1">
            Gestiona el catálogo de productos de tu tienda
          </p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="bg-secondary hover:bg-secondary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          + Nuevo Producto
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
              placeholder="Buscar por nombre, marca..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
            >
              <option value="">Todas</option>
              <option value="limpieza">Limpieza</option>
              <option value="hidratacion">Hidratación</option>
              <option value="tratamiento">Tratamiento</option>
              <option value="proteccion-solar">Protección Solar</option>
              <option value="mascarillas">Mascarillas</option>
            </select>
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
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-md border border-accent-light/30 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-secondary border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Cargando productos...</p>
          </div>
        ) : (
          <DataTable
            data={products}
            columns={columns}
            searchKey="name"
          />
        )}

        {/* Paginación */}
        {!loading && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Mostrando {products.length} de {pagination.total} productos
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setPagination({ ...pagination, page: pagination.page - 1 })
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
                  setPagination({ ...pagination, page: pagination.page + 1 })
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
