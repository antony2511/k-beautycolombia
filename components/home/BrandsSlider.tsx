'use client';

import { useEffect, useRef } from 'react';

interface BrandsSliderProps {
  brands: string[];
}

export default function BrandsSlider({ brands }: BrandsSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.5; // Velocidad del scroll (píxeles por frame)

    const scroll = () => {
      scrollPosition += scrollSpeed;

      // Cuando llega al final, reinicia
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }

      scrollContainer.scrollLeft = scrollPosition;
      requestAnimationFrame(scroll);
    };

    const animationId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationId);
  }, []);

  // Duplicar las marcas para el efecto infinito
  const duplicatedBrands = [...brands, ...brands];

  return (
    <div className="relative overflow-hidden">
      {/* Gradientes en los bordes */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background-cream/50 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background-cream/50 to-transparent z-10 pointer-events-none"></div>

      {/* Contenedor del slider */}
      <div
        ref={scrollRef}
        className="flex gap-8 overflow-x-hidden whitespace-nowrap"
        style={{ scrollBehavior: 'auto' }}
      >
        {duplicatedBrands.map((brand, index) => (
          <span
            key={`${brand}-${index}`}
            className="inline-block text-2xl font-bold text-primary/70 px-6"
          >
            {brand}
          </span>
        ))}
      </div>
    </div>
  );
}
