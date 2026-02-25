'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface ProductOption {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
}

export default function EditarKitPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [productSearch, setProductSearch] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    image: '',
    discount: '',
    isActive: true,
  });

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [kitRes, productsRes] = await Promise.all([
          fetch(`/api/admin/kits/${id}`),
          fetch('/api/admin/products?limit=100&isActive=true'),
        ]);

        if (kitRes.ok) {
          const kit = await kitRes.json();
          setFormData({
            name: kit.name,
            tagline: kit.tagline,
            description: kit.description || '',
            image: kit.image,
            discount: kit.discount?.toString() || '',
            isActive: kit.isActive,
          });
          setSelectedProductIds(kit.items.map((item: { productId: string }) => item.productId));
        }

        if (productsRes.ok) {
          const data = await productsRes.json();
          setProducts(data.products || []);
        }
      } catch {
        setError('Error al cargar el kit');
      } finally {
        setFetching(false);
      }
    }

    fetchData();
  }, [id]);

  const toggleProduct = (pid: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(pid) ? prev.filter((p) => p !== pid) : [...prev, pid]
    );
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase())
  );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (selectedProductIds.length === 0) {
      setError('Debes seleccionar al menos un producto');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/admin/kits/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          discount: formData.discount ? parseInt(formData.discount) : null,
          productIds: selectedProductIds,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin/kits');
      } else {
        setError(data.error || 'Error al actualizar kit');
      }
    } catch {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-secondary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Editar Kit</h1>
          <p className="text-gray-600 mt-1">Modifica los datos del kit</p>
        </div>
        <Link
          href="/admin/kits"
          className="px-4 py-2 border-2 border-accent-light rounded-lg hover:border-secondary transition-colors"
        >
          Cancelar
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica */}
        <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6">
          <h2 className="text-xl font-bold text-primary mb-4">Información del Kit</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tagline <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData((p) => ({ ...p, tagline: e.target.value }))}
                className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Imagen de portada <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData((p) => ({ ...p, image: e.target.value }))}
                className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descuento (%)
              </label>
              <input
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData((p) => ({ ...p, discount: e.target.value }))}
                min="0"
                max="100"
                className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Estado */}
        <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6">
          <h2 className="text-xl font-bold text-primary mb-4">Estado</h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
              className="w-5 h-5 text-secondary border-2 border-accent-light rounded focus:ring-2 focus:ring-secondary"
            />
            <span className="text-gray-700">Kit activo (visible en la tienda)</span>
          </label>
        </div>

        {/* Productos */}
        <div className="bg-white rounded-xl shadow-md border border-accent-light/30 p-6">
          <h2 className="text-xl font-bold text-primary mb-4">
            Productos del Kit{' '}
            {selectedProductIds.length > 0 && (
              <span className="text-sm font-normal text-secondary ml-2">
                ({selectedProductIds.length} seleccionados)
              </span>
            )}
          </h2>

          <input
            type="text"
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full px-4 py-2 border-2 border-accent-light rounded-lg focus:border-secondary focus:outline-none mb-4"
          />

          <div className="max-h-80 overflow-y-auto space-y-2 border border-accent-light/30 rounded-lg p-3">
            {filteredProducts.map((product) => (
              <label
                key={product.id}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedProductIds.includes(product.id)
                    ? 'bg-secondary/10 border border-secondary/30'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedProductIds.includes(product.id)}
                  onChange={() => toggleProduct(product.id)}
                  className="w-4 h-4 text-secondary rounded focus:ring-secondary"
                />
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded-md flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.brand}</p>
                </div>
                <span className="text-sm font-semibold text-gray-700 flex-shrink-0">
                  {formatPrice(product.price)}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors disabled:opacity-50 font-medium"
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}
