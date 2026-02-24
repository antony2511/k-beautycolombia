'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { useCartStore } from '@/lib/stores/useCartStore';
import type { Product } from '@/lib/data/products';

// Lazy load Footer
const Footer = dynamic(() => import('@/components/layout/Footer'), {
  loading: () => <div className="h-96" />,
});

const categoryNames: { [key: string]: string } = {
  hidratacion: 'Hidratación',
  limpieza: 'Limpieza',
  tratamiento: 'Tratamiento',
  proteccion: 'Protección Solar',
  mascarillas: 'Mascarillas',
};

export default function CategoriaPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>('newest');
  const addItem = useCartStore((state) => state.addItem);

  const categoryName = categoryNames[slug] || slug;

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('category', slug);
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
    fetchProducts();
  }, [slug, sortBy]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full min-h-screen">
        {/* Breadcrumb */}
        <nav className="text-xs uppercase tracking-widest text-accent mb-8">
          <Link href="/" className="hover:text-primary transition-colors">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <Link href="/tienda" className="hover:text-primary transition-colors">
            Tienda
          </Link>
          <span className="mx-2">/</span>
          <span className="text-primary border-b border-primary capitalize">
            {categoryName}
          </span>
        </nav>

        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-accent text-sm tracking-widest uppercase mb-2 block font-medium">
              Categoría
            </span>
            <h1 className="text-4xl md:text-5xl font-medium text-primary capitalize">
              {categoryName}
            </h1>
            <p className="text-accent mt-2">
              {loading ? 'Cargando...' : `${products.length} productos encontrados`}
            </p>
          </div>
          <div className="flex items-center gap-3">
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
        </header>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-accent">Cargando productos...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col justify-center items-center min-h-[400px]">
            <span className="material-icons text-6xl text-accent mb-4">
              shopping_bag
            </span>
            <p className="text-accent text-lg mb-2">
              No hay productos en esta categoría
            </p>
            <Link
              href="/tienda"
              className="text-primary hover:text-secondary transition-colors underline mt-4"
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
