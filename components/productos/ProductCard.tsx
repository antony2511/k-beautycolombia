'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/stores/useCartStore';

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  badge?: string;
  badgeType?: 'top' | 'new';
}

export default function ProductCard({
  id,
  name,
  brand,
  price,
  image,
  badge,
  badgeType = 'new',
}: ProductCardProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleClick = () => {
    router.push(`/producto/${id}`);
  };

  return (
    <div className="group relative">
      <div
        onClick={handleClick}
        className="relative w-full overflow-hidden bg-surface-white rounded-2xl aspect-[4/5] mb-4 shadow-md group-hover:shadow-2xl transition-all duration-300 border-2 border-accent-light/20 group-hover:border-secondary/50 cursor-pointer group-hover:-translate-y-1"
      >
        {badge && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg ${
                badgeType === 'top'
                  ? 'bg-gradient-to-r from-secondary to-secondary-dark text-white'
                  : 'bg-white/95 backdrop-blur-sm text-secondary border border-secondary/30'
              }`}
            >
              {badge}
            </span>
          </div>
        )}
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iI2Y1ZjVmNSIvPjwvc3ZnPg=="
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Crear objeto de producto mínimo para el carrito
            const product = {
              id,
              name,
              brand,
              price,
              image,
              badge,
              badgeType,
            };
            addItem(product as any, 1);
          }}
          className="absolute bottom-4 right-4 bg-gradient-to-r from-secondary to-secondary-dark text-white p-3 rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 z-20"
          aria-label="Agregar al carrito"
        >
          <span className="material-icons">add_shopping_cart</span>
        </button>
      </div>
      <div className="px-2">
        <p className="text-xs text-accent-dark uppercase tracking-wider mb-1 font-semibold">{brand}</p>
        <h3
          onClick={handleClick}
          className="text-base font-bold text-primary mb-2 hover:text-secondary transition-colors cursor-pointer line-clamp-2"
        >
          {name}
        </h3>
        <p className="text-xl font-bold text-secondary">{formatPrice(price)}</p>
      </div>
    </div>
  );
}
