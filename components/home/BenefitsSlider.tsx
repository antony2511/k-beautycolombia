'use client';

import { useState, useEffect } from 'react';

interface Benefit {
  icon: string;
  title: string;
  subtitle: string;
}

const benefits: Benefit[] = [
  {
    icon: 'verified',
    title: '100%',
    subtitle: 'Auténtico',
  },
  {
    icon: 'local_shipping',
    title: 'Envío Gratis',
    subtitle: '+$150.000',
  },
  {
    icon: 'favorite',
    title: '1000+',
    subtitle: 'Clientes Felices',
  },
];

export default function BenefitsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Auto-slide cada 3 segundos
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % benefits.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-12">
      {/* Vista móvil: Slider automático */}
      <div className="md:hidden relative overflow-hidden">
        <div className="flex justify-center">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="min-w-full flex justify-center px-4"
              >
                <div className="flex items-center gap-3 group cursor-pointer bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 border border-white/50">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary to-secondary/60 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                    <span className="material-icons text-white text-2xl">
                      {benefit.icon}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-primary text-xl">{benefit.title}</p>
                    <p className="text-sm text-accent font-medium">{benefit.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indicadores de puntos */}
        <div className="flex justify-center gap-2 mt-4">
          {benefits.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-secondary w-6'
                  : 'bg-accent/30 hover:bg-accent/50'
              }`}
              aria-label={`Ir a beneficio ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Vista desktop: Grid normal */}
      <div className="hidden md:flex flex-wrap gap-6 animate-slide-in-left" style={{ animationDelay: '0.4s' }}>
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="flex items-center gap-3 group cursor-pointer bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 border border-white/50"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-secondary to-secondary/60 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
              <span className="material-icons text-white text-2xl">
                {benefit.icon}
              </span>
            </div>
            <div>
              <p className="font-bold text-primary text-xl">{benefit.title}</p>
              <p className="text-sm text-accent font-medium">{benefit.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
