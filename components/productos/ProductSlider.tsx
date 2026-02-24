'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/productos/ProductCard';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  badge?: string;
  badgeType?: string;
}

interface ProductSliderProps {
  products: Product[];
  autoSlide?: boolean;
  slideInterval?: number;
}

export default function ProductSlider({
  products,
  autoSlide = true,
  slideInterval = 4000,
}: ProductSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoSlide || products.length <= 1) return;

    // Auto-slide cada X segundos
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, slideInterval);

    return () => clearInterval(interval);
  }, [autoSlide, products.length, slideInterval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? products.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-accent">No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <>
      {/* Vista móvil: Slider */}
      <div className="lg:hidden">
        <div className="relative overflow-hidden">
          {/* Productos */}
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="min-w-full px-4 flex justify-center"
              >
                <div className="max-w-sm w-full">
                  <ProductCard {...product} />
                </div>
              </div>
            ))}
          </div>

          {/* Botones de navegación */}
          {products.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all z-10 hover:scale-110"
                aria-label="Anterior"
              >
                <span className="material-icons text-primary">chevron_left</span>
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all z-10 hover:scale-110"
                aria-label="Siguiente"
              >
                <span className="material-icons text-primary">chevron_right</span>
              </button>
            </>
          )}
        </div>

        {/* Indicadores de puntos */}
        {products.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-secondary w-8'
                    : 'bg-accent/30 hover:bg-accent/50 w-2'
                }`}
                aria-label={`Ir al producto ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Contador */}
        {products.length > 1 && (
          <div className="text-center mt-4 text-sm text-accent">
            {currentIndex + 1} / {products.length}
          </div>
        )}
      </div>

      {/* Vista desktop: Grid normal */}
      <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </>
  );
}
