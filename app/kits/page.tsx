'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/layout/Navbar';
import KitCard from '@/components/kits/KitCard';
import type { KitWithItems } from '@/lib/types/kits';

const Footer = dynamic(() => import('@/components/layout/Footer'), {
  loading: () => <div className="h-96" />,
});

function KitSkeleton() {
  return (
    <div className="bg-white/30 rounded-2xl border border-accent/20 overflow-hidden animate-pulse">
      <div className="h-52 bg-accent/10" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-accent/10 rounded w-3/4" />
        <div className="h-4 bg-accent/10 rounded w-1/2" />
        <div className="flex gap-2 mt-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-10 h-10 rounded-full bg-accent/10" />
          ))}
        </div>
        <div className="h-6 bg-accent/10 rounded w-1/3 mt-2" />
        <div className="flex gap-2 mt-4">
          <div className="flex-1 h-9 bg-accent/10 rounded-lg" />
          <div className="flex-1 h-9 bg-accent/10 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function KitsPage() {
  const [kits, setKits] = useState<KitWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchKits() {
      try {
        const res = await fetch('/api/kits');
        if (res.ok) {
          const data = await res.json();
          setKits(data);
        }
      } catch (error) {
        console.error('Error fetching kits:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchKits();
  }, []);

  return (
    <>
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-6 pb-12 pt-24 w-full">
        {/* Header */}
        <header className="mb-12 text-center">
          <span className="inline-block bg-secondary/10 text-secondary text-sm font-semibold px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase">
            Rutinas Completas
          </span>
          <h1 className="text-4xl md:text-5xl font-medium text-primary italic mb-4">
            Kits K-Beauty
          </h1>
          <p className="text-accent max-w-xl mx-auto leading-relaxed">
            Rutinas curadas por nuestras expertas en K-Beauty. Cada kit combina los productos
            perfectos para tu tipo de piel con un descuento especial.
          </p>
        </header>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <KitSkeleton key={i} />
            ))}
          </div>
        ) : kits.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
            <span className="material-icons text-6xl text-accent mb-4">auto_awesome</span>
            <p className="text-accent text-lg mb-2">No hay kits disponibles aún</p>
            <p className="text-accent/70 text-sm">Vuelve pronto para descubrir nuestras rutinas curadas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kits.map((kit) => (
              <KitCard key={kit.id} kit={kit} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
