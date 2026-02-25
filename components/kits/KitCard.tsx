'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/lib/stores/useCartStore';
import type { KitWithItems } from '@/lib/types/kits';
import type { Product } from '@/lib/data/products';

interface KitCardProps {
  kit: KitWithItems;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price);

export default function KitCard({ kit }: KitCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const total = kit.items.reduce((s, i) => s + i.product.price, 0);
  const final = kit.discount ? Math.round(total * (1 - kit.discount / 100)) : total;

  const handleAddAll = () => {
    kit.items.forEach((item) => {
      addItem(item.product as unknown as Product, 1);
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      openCart();
    }
  };

  const handleAddSingle = (product: KitWithItems['items'][0]['product']) => {
    addItem(product as unknown as Product, 1);
  };

  return (
    <div className="bg-white/30 rounded-2xl border border-accent/20 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col">
      {/* Cover image */}
      <div className="relative h-52 overflow-hidden bg-white/40">
        <Image
          src={kit.image}
          alt={kit.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center"
          loading="lazy"
        />
        {kit.discount && (
          <div className="absolute top-3 right-3 bg-secondary text-white text-xs font-bold px-2 py-1 rounded-full shadow">
            Ahorra {kit.discount}%
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-primary leading-tight">{kit.name}</h3>
        <p className="text-sm text-secondary font-medium mt-0.5">{kit.tagline}</p>

        {/* Thumbnails */}
        <div className="flex mt-3 -space-x-2">
          {kit.items.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-white/40 flex-shrink-0"
            >
              <Image
                src={item.product.image}
                alt={item.product.name}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
          {kit.items.length > 5 && (
            <div className="w-10 h-10 rounded-full border-2 border-white bg-accent-light flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
              +{kit.items.length - 5}
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="mt-4 flex items-baseline gap-2">
          {kit.discount ? (
            <>
              <span className="text-lg font-bold text-primary">{formatPrice(final)}</span>
              <span className="text-sm text-accent line-through">{formatPrice(total)}</span>
            </>
          ) : (
            <span className="text-lg font-bold text-primary">{formatPrice(total)}</span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2 flex-wrap">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-1 min-w-0 text-sm px-3 py-2 border border-primary/30 rounded-lg text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-1"
          >
            Ver productos
            <span
              className={`material-icons text-base transition-transform duration-200 ${
                expanded ? 'rotate-180' : ''
              }`}
            >
              expand_more
            </span>
          </button>
          <button
            onClick={handleAddAll}
            disabled={added}
            className="flex-1 min-w-0 text-sm px-3 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors flex items-center justify-center gap-1 disabled:opacity-70"
          >
            {added ? (
              <>
                <span className="material-icons text-base">check</span>
                Añadido
              </>
            ) : (
              <>
                Añadir kit
                <span className="material-icons text-base">arrow_forward</span>
              </>
            )}
          </button>
        </div>

        {/* Expanded product list */}
        {expanded && (
          <div className="mt-4 space-y-3 border-t border-accent/20 pt-4">
            {kit.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/40 flex-shrink-0">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary truncate">{item.product.name}</p>
                  <p className="text-xs text-accent">{formatPrice(item.product.price)}</p>
                </div>
                <button
                  onClick={() => handleAddSingle(item.product)}
                  className="w-7 h-7 rounded-full border border-secondary flex items-center justify-center text-secondary hover:bg-secondary hover:text-white transition-all flex-shrink-0"
                >
                  <span className="material-icons text-sm">add</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
