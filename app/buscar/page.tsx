'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { useCartStore } from '@/lib/stores/useCartStore';
import type { Product } from '@/lib/data/products';

// Lazy load Footer
const Footer = dynamic(() => import('@/components/layout/Footer'), {
  loading: () => <div className="h-96" />,
});

export default function BuscarPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(query);
  const [sortBy, setSortBy] = useState<string>('newest');
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  useEffect(() => {
    async function fetchProducts() {
      if (!searchTerm) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('search', searchTerm);
        params.set('sortBy', sortBy);

        const response = await fetch(`/api/products?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    const debounce = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchTerm, sortBy]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const search = formData.get('search') as string;
    setSearchTerm(search);
    window.history.pushState({}, '', `/buscar?q=${encodeURIComponent(search)}`);
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full min-h-screen">
        {/* Header con barra de búsqueda */}
        <header className="mb-12">
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-medium text-primary mb-2">
              Buscar Productos
            </h1>
            <p className="text-accent">
              {loading
                ? 'Buscando...'
                : searchTerm
                ? `${products.length} resultados para "${searchTerm}"`
                : 'Ingresa un término de búsqueda'}
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
            <input
              type="text"
              name="search"
              defaultValue={searchTerm}
              placeholder="Buscar por nombre, marca o descripción..."
              className="flex-1 px-4 py-3 rounded-lg border border-primary/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium"
            >
              <span className="material-icons">search</span>
              Buscar
            </button>
          </form>

          {searchTerm && products.length > 0 && (
            <div className="mt-6 flex items-center gap-3">
              <span className="text-primary text-sm font-medium">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-primary/30 rounded px-4 py-2 text-primary font-medium focus:outline-none focus:border-primary"
              >
                <option value="newest">Más recientes</option>
                <option value="price_asc">Precio: Menor a Mayor</option>
                <option value="price_desc">Precio: Mayor a Menor</option>
                <option value="name_asc">Nombre: A-Z</option>
                <option value="name_desc">Nombre: Z-A</option>
              </select>
            </div>
          )}
        </header>

        {/* Results */}
        {!searchTerm ? (
          <div className="flex flex-col justify-center items-center min-h-[400px]">
            <span className="material-icons text-6xl text-accent mb-4">search</span>
            <p className="text-accent text-lg">Empieza a buscar tus productos favoritos</p>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-accent">Buscando productos...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col justify-center items-center min-h-[400px]">
            <span className="material-icons text-6xl text-accent mb-4">
              search_off
            </span>
            <p className="text-accent text-lg mb-2">No se encontraron resultados</p>
            <p className="text-accent/70 text-sm mb-4">
              Intenta con otros términos de búsqueda
            </p>
            <Link
              href="/tienda"
              className="text-primary hover:text-secondary transition-colors underline"
            >
              Ver todos los productos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col h-full bg-white/20 p-4 rounded-xl shadow-sm border border-accent/20 hover:shadow-lg hover:border-accent/40 transition-all duration-300"
              >
                {/* Image */}
                <Link href={`/producto/${product.id}`}>
                  <div className="relative overflow-hidden rounded-lg aspect-[4/5] mb-4 bg-white/40 cursor-pointer">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iI2Y1ZjVmNSIvPjwvc3ZnPg=="
                    />

                    {/* Badge */}
                    {product.badge && (
                      <div className="absolute top-3 left-3">
                        <span
                          className={`text-[10px] tracking-wider uppercase px-2 py-1 rounded-sm font-semibold shadow-sm ${
                            product.badgeType === 'bestseller'
                              ? 'bg-primary text-background-cream'
                              : product.badgeType === 'new'
                              ? 'bg-white/80 backdrop-blur-md text-primary border border-primary/5'
                              : product.badgeType === 'discount'
                              ? 'bg-red-400 text-white'
                              : 'bg-secondary text-primary'
                          }`}
                        >
                          {product.badge}
                        </span>
                      </div>
                    )}

                    {/* Quick View Button */}
                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center pb-6 bg-gradient-to-t from-primary/20 to-transparent">
                      <button className="bg-background-cream hover:bg-white text-primary shadow-lg px-6 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 backdrop-blur-sm border border-primary/10">
                        <span className="material-icons text-base">visibility</span>
                        Vista Rápida
                      </button>
                    </div>
                  </div>
                </Link>

                {/* Product Info */}
                <div className="flex flex-col flex-grow px-1">
                  <span className="text-xs text-accent uppercase tracking-widest mb-1 font-semibold">
                    {product.brand}
                  </span>
                  <Link href={`/producto/${product.id}`}>
                    <h3 className="text-xl font-medium text-primary leading-tight mb-2 group-hover:text-secondary transition-colors cursor-pointer">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Price */}
                  <div className="mt-auto flex justify-between items-center pt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(product.price)}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-sm text-accent line-through">
                          {formatPrice(product.compareAtPrice)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addItem(product, 1);
                      }}
                      className="h-8 w-8 rounded-full border border-secondary flex items-center justify-center text-secondary hover:bg-secondary hover:text-primary transition-all duration-300 shadow-sm"
                    >
                      <span className="material-icons text-sm">add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
