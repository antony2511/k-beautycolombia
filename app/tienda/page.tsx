'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Navbar from '@/components/layout/Navbar';
import { useCartStore } from '@/lib/stores/useCartStore';
import type { Product } from '@/lib/data/products';

// Lazy load Footer (no es crítico para el primer render)
const Footer = dynamic(() => import('@/components/layout/Footer'), {
  loading: () => <div className="h-96" />,
});

interface Filters {
  categories: string[];
  brands: string[];
  priceRange: { min: number; max: number };
  skinTypes: string[];
}

export default function TiendaPage() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableFilters, setAvailableFilters] = useState<Filters>({
    categories: [],
    brands: [],
    priceRange: { min: 0, max: 200000 },
    skinTypes: [],
  });

  // Estados de filtros seleccionados
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');

  const addItem = useCartStore((state) => state.addItem);

  // Cargar filtros disponibles al montar
  useEffect(() => {
    async function fetchFilters() {
      try {
        const response = await fetch('/api/products/filters');
        if (response.ok) {
          const data = await response.json();
          setAvailableFilters(data);
        }
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    }
    fetchFilters();
  }, []);

  // Cargar productos cuando cambien los filtros
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();

        if (selectedCategory !== 'todos') params.set('category', selectedCategory);
        if (selectedBrands.length > 0) params.set('brand', selectedBrands[0]); // Por ahora solo una marca
        if (priceMin) params.set('minPrice', priceMin);
        if (priceMax) params.set('maxPrice', priceMax);
        if (selectedSkinTypes.length > 0) params.set('skinType', selectedSkinTypes[0]);
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
  }, [selectedCategory, selectedBrands, priceMin, priceMax, selectedSkinTypes, sortBy]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleSkinType = (skinType: string) => {
    setSelectedSkinTypes((prev) =>
      prev.includes(skinType)
        ? prev.filter((s) => s !== skinType)
        : [...prev, skinType]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('todos');
    setSelectedBrands([]);
    setSelectedSkinTypes([]);
    setPriceMin('');
    setPriceMax('');
    setSortBy('newest');
  };

  const activeFiltersCount =
    (selectedCategory !== 'todos' ? 1 : 0) +
    selectedBrands.length +
    selectedSkinTypes.length +
    (priceMin || priceMax ? 1 : 0);

  return (
    <>
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">
        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-accent text-sm tracking-widest uppercase mb-2 block font-medium">
              K-Beauty Shop
            </span>
            <h1 className="text-4xl md:text-5xl font-medium text-primary italic">
              Colección Completa
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

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar - Filtros Desktop */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-8 hidden lg:block">
            {/* Botón limpiar filtros */}
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="w-full text-sm text-secondary hover:text-primary transition-colors flex items-center justify-center gap-2 py-2"
              >
                <span className="material-icons text-sm">close</span>
                Limpiar filtros ({activeFiltersCount})
              </button>
            )}

            {/* Categorías */}
            <div className="border-b border-primary/10 pb-6">
              <h3 className="text-lg font-medium text-primary mb-4">Categoría</h3>
              <div className="space-y-3 pl-1">
                <label className="flex items-center gap-3 group cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value="todos"
                    checked={selectedCategory === 'todos'}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                  <span className="text-accent group-hover:text-primary transition-colors">
                    Todos
                  </span>
                </label>
                {availableFilters.categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-3 group cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={selectedCategory === cat}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="h-4 w-4 text-primary focus:ring-primary"
                    />
                    <span className="text-accent group-hover:text-primary transition-colors capitalize">
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Marca */}
            <div className="border-b border-primary/10 pb-6">
              <h3 className="text-lg font-medium text-primary mb-4">Marca</h3>
              <div className="space-y-3 pl-1">
                {availableFilters.brands.map((brand) => (
                  <label key={brand} className="flex items-center gap-3 group cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="h-4 w-4 rounded border-accent text-primary focus:ring-primary"
                    />
                    <span className="text-accent group-hover:text-primary transition-colors">
                      {brand}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tipo de Piel */}
            {availableFilters.skinTypes.length > 0 && (
              <div className="border-b border-primary/10 pb-6">
                <h3 className="text-lg font-medium text-primary mb-4">Tipo de Piel</h3>
                <div className="space-y-3 pl-1">
                  {availableFilters.skinTypes.map((skinType) => (
                    <label
                      key={skinType}
                      className="flex items-center gap-3 group cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSkinTypes.includes(skinType)}
                        onChange={() => toggleSkinType(skinType)}
                        className="h-4 w-4 rounded border-accent text-primary focus:ring-primary"
                      />
                      <span className="text-accent group-hover:text-primary transition-colors">
                        {skinType}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Precio */}
            <div className="pb-6">
              <h3 className="text-lg font-medium text-primary mb-4">Precio</h3>
              <div className="space-y-3">
                <input
                  type="number"
                  placeholder={`Mín: ${formatPrice(availableFilters.priceRange.min)}`}
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-full bg-white border border-primary/20 rounded p-2 focus:border-primary focus:ring-0 placeholder-accent text-sm"
                />
                <input
                  type="number"
                  placeholder={`Máx: ${formatPrice(availableFilters.priceRange.max)}`}
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-full bg-white border border-primary/20 rounded p-2 focus:border-primary focus:ring-0 placeholder-accent text-sm"
                />
              </div>
            </div>
          </aside>

          {/* Mobile Filters Button */}
          <div className="lg:hidden w-full mb-6">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="w-full flex justify-between items-center p-4 border border-primary/20 rounded-lg text-primary hover:bg-primary/5 transition-colors bg-white/30 backdrop-blur-sm"
            >
              <span className="font-medium">
                Filtrar y Ordenar {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </span>
              <span className="material-icons">tune</span>
            </button>
          </div>

          {/* Products Grid */}
          <div className="flex-grow">
            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                  <p className="text-accent">Cargando productos...</p>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col justify-center items-center min-h-[400px]">
                <span className="material-icons text-6xl text-accent mb-4">shopping_bag</span>
                <p className="text-accent text-lg mb-2">No se encontraron productos</p>
                <p className="text-accent/70 text-sm mb-4">
                  Intenta ajustar los filtros
                </p>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-primary hover:text-secondary transition-colors underline"
                  >
                    Limpiar todos los filtros
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
