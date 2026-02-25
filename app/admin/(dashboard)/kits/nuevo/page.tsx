'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ProductOption {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
}

export default function NuevoKitPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    async function fetchProducts() {
      try {
        const res = await fetch('/api/admin/products?limit=100&isActive=true');
        const data = await res.json();
        if (res.ok) setProducts(data.products || []);
      } catch {
        console.error('Error fetching products');
      }
    }
    fetchProducts();
  }, []);

  const toggleProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
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

    if (!formData.name || !formData.tagline || !formData.image) {
      setError('Nombre, tagline e imagen son obligatorios');
      setLoading(false);
      return;
    }

    if (selectedProductIds.length === 0) {
      setError('Debes seleccionar al menos un producto');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/kits', {
        method: 'POST',
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
        setError(data.error || 'Error al crear kit');
      }
    } catch {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Nuevo Kit</h1>
          <p className="text-gray-600 mt-1">Crea un kit o rutina curada</p>
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
                placeholder="Ej: Rutina Básica Coreana"
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
                placeholder="Ej: 4 pasos para una piel radiante"
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
                placeholder="Descripción detallada del kit..."
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
                placeholder="https://..."
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
                placeholder="Ej: 10"
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

        {/* Productos del kit */}
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
            {filteredProducts.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No se encontraron productos</p>
            ) : (
              filteredProducts.map((product) => (
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
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors disabled:opacity-50 font-medium"
          >
            {loading ? 'Creando...' : 'Crear Kit'}
          </button>
        </div>
      </form>
    </div>
  );
}
