'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
  desktopSlideInterval?: number;
}

const DESKTOP_VISIBLE = 3;

export default function ProductSlider({
  products,
  autoSlide = true,
  slideInterval = 4000,
  desktopSlideInterval = 15000,
}: ProductSliderProps) {
  const [mobileIndex, setMobileIndex] = useState(0);
  const [desktopIndex, setDesktopIndex] = useState(0);
  const desktopTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const maxDesktopIndex = Math.max(0, products.length - DESKTOP_VISIBLE);

  // ── Móvil: auto-slide cada `slideInterval` ms ──
  useEffect(() => {
    if (!autoSlide || products.length <= 1) return;
    const interval = setInterval(() => {
      setMobileIndex((prev) => (prev + 1) % products.length);
    }, slideInterval);
    return () => clearInterval(interval);
  }, [autoSlide, products.length, slideInterval]);

  // ── Desktop: rotación automática cada `desktopSlideInterval` ms ──
  // Se reinicia también cuando el usuario navega manualmente
  const resetDesktopTimer = useCallback(() => {
    if (desktopTimerRef.current) clearInterval(desktopTimerRef.current);
    if (!autoSlide || products.length <= DESKTOP_VISIBLE) return;
    const maxIdx = Math.max(0, products.length - DESKTOP_VISIBLE);
    desktopTimerRef.current = setInterval(() => {
      setDesktopIndex((prev) => (prev >= maxIdx ? 0 : prev + 1));
    }, desktopSlideInterval);
  }, [autoSlide, products.length, desktopSlideInterval]);

  useEffect(() => {
    resetDesktopTimer();
    return () => {
      if (desktopTimerRef.current) clearInterval(desktopTimerRef.current);
    };
  }, [resetDesktopTimer]);

  const goDesktop = (index: number) => {
    setDesktopIndex(index);
    resetDesktopTimer();
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-accent">No hay productos disponibles</p>
      </div>
    );
  }

  const showDesktopCarousel = products.length > DESKTOP_VISIBLE;

  return (
    <>
      {/* ─────────────────────────────────────────
          MÓVIL: slider 1 producto a la vez
      ───────────────────────────────────────── */}
      <div className="lg:hidden">
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${mobileIndex * 100}%)` }}
          >
            {products.map((product) => (
              <div key={product.id} className="min-w-full px-4 flex justify-center">
                <div className="max-w-sm w-full">
                  <ProductCard {...product} />
                </div>
              </div>
            ))}
          </div>

          {products.length > 1 && (
            <>
              <button
                onClick={() =>
                  setMobileIndex((prev) =>
                    prev === 0 ? products.length - 1 : prev - 1
                  )
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all z-10 hover:scale-110"
                aria-label="Anterior"
              >
                <span className="material-icons text-primary">chevron_left</span>
              </button>
              <button
                onClick={() =>
                  setMobileIndex((prev) => (prev + 1) % products.length)
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all z-10 hover:scale-110"
                aria-label="Siguiente"
              >
                <span className="material-icons text-primary">chevron_right</span>
              </button>
            </>
          )}
        </div>

        {products.length > 1 && (
          <>
            <div className="flex justify-center gap-2 mt-6">
              {products.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setMobileIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === mobileIndex
                      ? 'bg-secondary w-8'
                      : 'bg-accent/30 hover:bg-accent/50 w-2'
                  }`}
                  aria-label={`Producto ${index + 1}`}
                />
              ))}
            </div>
            <div className="text-center mt-3 text-sm text-accent">
              {mobileIndex + 1} / {products.length}
            </div>
          </>
        )}
      </div>

      {/* ─────────────────────────────────────────
          DESKTOP: carrusel 3 productos a la vez
      ───────────────────────────────────────── */}
      <div className="hidden lg:block">
        {!showDesktopCarousel ? (
          // 3 o menos productos → grid estático
          <div
            className={`grid gap-8 ${
              products.length === 1
                ? 'grid-cols-1 max-w-sm mx-auto'
                : products.length === 2
                ? 'grid-cols-2 max-w-2xl mx-auto'
                : 'grid-cols-3'
            }`}
          >
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <>
            <div className="relative overflow-hidden">
              {/* Track deslizable */}
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${desktopIndex * (100 / DESKTOP_VISIBLE)}%)`,
                }}
              >
                {products.map((product) => (
                  <div key={product.id} className="min-w-[33.333%] px-4">
                    <ProductCard {...product} />
                  </div>
                ))}
              </div>

              {/* Flecha izquierda */}
              <button
                onClick={() => goDesktop(Math.max(0, desktopIndex - 1))}
                disabled={desktopIndex === 0}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all z-10 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Anterior"
              >
                <span className="material-icons text-primary">chevron_left</span>
              </button>

              {/* Flecha derecha */}
              <button
                onClick={() =>
                  goDesktop(Math.min(maxDesktopIndex, desktopIndex + 1))
                }
                disabled={desktopIndex === maxDesktopIndex}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all z-10 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Siguiente"
              >
                <span className="material-icons text-primary">chevron_right</span>
              </button>
            </div>

            {/* Indicadores de posición */}
            <div className="flex justify-center gap-3 mt-8">
              {Array.from({ length: maxDesktopIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goDesktop(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === desktopIndex
                      ? 'bg-secondary w-8'
                      : 'bg-accent/30 hover:bg-accent/50 w-2'
                  }`}
                  aria-label={`Posición ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
