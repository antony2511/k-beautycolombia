'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/stores/useCartStore';
import type { ProductLite } from '@/lib/recommendations/engine';
import type { Product } from '@/lib/data/products';

export default function MiniCart() {
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const addItem = useCartStore((state) => state.addItem);
  const lastAddedProductId = useCartStore((state) => state.lastAddedProductId);
  const clearLastAdded = useCartStore((state) => state.clearLastAdded);

  const [cartRecs, setCartRecs] = useState<ProductLite[]>([]);
  const [recLoading, setRecLoading] = useState(false);

  // Bloquear scroll del body cuando el carrito está abierto
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && window.innerWidth >= 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Fetch recommendations when a product is added
  useEffect(() => {
    if (!lastAddedProductId) return;
    setRecLoading(true);
    fetch(`/api/recommendations?productId=${lastAddedProductId}&limit=2`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data: { product: ProductLite }[]) => {
        setCartRecs(data.map((d) => d.product));
      })
      .catch(() => setCartRecs([]))
      .finally(() => {
        setRecLoading(false);
        clearLastAdded();
      });
  }, [lastAddedProductId]); // eslint-disable-line react-hooks/exhaustive-deps

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);

  const subtotal = getSubtotal();
  const totalItems = items.reduce((t, i) => t + i.quantity, 0);

  return (
    <>
      {/* Backdrop — solo desktop */}
      <div
        className={`fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity duration-300 hidden md:block ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Drawer — solo desktop */}
      <div
        className={`fixed right-0 top-0 h-full w-[400px] bg-white shadow-2xl z-[101] transition-transform duration-300 ease-out hidden md:flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-accent-light/40">
          <div>
            <h2 className="text-lg font-bold text-primary">Mi Carrito</h2>
            <p className="text-xs text-accent mt-0.5">
              {totalItems === 0 ? 'Vacío' : `${totalItems} ${totalItems === 1 ? 'producto' : 'productos'}`}
            </p>
          </div>
          <button
            onClick={closeCart}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-accent-light/30 text-primary transition-colors"
            aria-label="Cerrar carrito"
          >
            <span className="material-icons text-xl">close</span>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <span className="material-icons text-6xl text-accent/25 mb-4">shopping_bag</span>
              <p className="text-primary font-semibold mb-1">Tu carrito está vacío</p>
              <p className="text-sm text-accent mb-6">Agrega productos para comenzar</p>
              <button
                onClick={closeCart}
                className="text-sm text-secondary font-semibold hover:text-secondary-dark transition-colors"
              >
                Explorar tienda →
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-3 bg-background-light rounded-xl p-3 border border-accent-light/20"
              >
                {/* Imagen */}
                <Link
                  href={`/producto/${item.productId}`}
                  onClick={closeCart}
                  className="shrink-0"
                >
                  <div className="w-18 h-22 relative rounded-lg overflow-hidden bg-white border border-accent-light/30 w-[72px] h-[88px]">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <Link href={`/producto/${item.productId}`} onClick={closeCart}>
                      <p className="text-sm font-semibold text-primary leading-tight line-clamp-2 hover:text-secondary transition-colors">
                        {item.product.name}
                      </p>
                    </Link>
                    <p className="text-[11px] text-accent uppercase tracking-wider mt-0.5">
                      {item.product.brand}
                    </p>
                    <p className="text-sm font-bold text-primary mt-1">
                      {formatPrice(item.product.price)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Controles de cantidad */}
                    <div className="flex items-center border border-accent-light/50 rounded-full overflow-hidden bg-white">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-primary hover:bg-accent-light/30 transition-colors text-sm font-medium"
                        aria-label="Reducir cantidad"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-primary">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-primary hover:bg-accent-light/30 transition-colors text-sm font-medium"
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-secondary">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-accent hover:text-red-400 transition-colors"
                        aria-label="Eliminar producto"
                      >
                        <span className="material-icons text-[18px]">delete_outline</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Recommendations */}
        {items.length > 0 && cartRecs.length > 0 && (
          <div className="px-5 pb-4 border-t border-accent-light/30 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-icons text-secondary text-sm">auto_awesome</span>
              <p className="text-xs font-bold text-primary uppercase tracking-wider">Completa tu rutina</p>
            </div>
            {recLoading ? (
              <div className="flex items-center gap-2 py-2">
                <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin shrink-0"></div>
                <span className="text-xs text-accent">Buscando complementos...</span>
              </div>
            ) : (
              <div className="space-y-2">
                {cartRecs.map((rec) => (
                  <div key={rec.id} className="flex items-center gap-3 bg-background-light rounded-lg p-2 border border-accent-light/20">
                    <Link href={`/producto/${rec.id}`} onClick={closeCart} className="shrink-0">
                      <div className="w-12 h-12 relative rounded-md overflow-hidden bg-white border border-accent-light/30">
                        <Image src={rec.image} alt={rec.name} fill className="object-cover" />
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/producto/${rec.id}`} onClick={closeCart}>
                        <p className="text-xs font-semibold text-primary leading-tight line-clamp-2 hover:text-secondary transition-colors">
                          {rec.name}
                        </p>
                      </Link>
                      <p className="text-xs font-bold text-primary mt-0.5">
                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(rec.price)}
                      </p>
                    </div>
                    <button
                      onClick={() => addItem(rec as unknown as Product, 1)}
                      className="shrink-0 w-8 h-8 flex items-center justify-center bg-secondary rounded-full hover:brightness-95 transition-colors shadow-sm"
                      aria-label={`Añadir ${rec.name} al carrito`}
                    >
                      <span className="material-icons text-primary text-sm">add</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer con totales y botones */}
        {items.length > 0 && (
          <div className="px-5 py-5 border-t border-accent-light/40 bg-white space-y-3">
            {/* Barra de envío gratis */}
            {subtotal < 150000 && (
              <div className="bg-secondary/10 border border-secondary/20 rounded-lg px-3 py-2 flex items-center gap-2 text-xs text-primary">
                <span className="material-icons text-sm text-secondary">local_shipping</span>
                <span>
                  Agrega{' '}
                  <strong>{formatPrice(150000 - subtotal)}</strong> más para envío gratis
                </span>
              </div>
            )}

            {/* Subtotal */}
            <div className="flex justify-between items-center py-1">
              <span className="text-primary font-medium">Subtotal</span>
              <span className="text-xl font-bold text-primary">{formatPrice(subtotal)}</span>
            </div>

            {/* Botón checkout */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full bg-gradient-to-r from-secondary to-secondary-dark text-white py-3.5 rounded-xl font-bold text-sm hover:brightness-95 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Proceder al Pago</span>
              <span className="material-icons text-sm">arrow_forward</span>
            </Link>

            {/* Link carrito completo */}
            <Link
              href="/carrito"
              onClick={closeCart}
              className="w-full text-center text-sm text-primary/70 hover:text-secondary transition-colors font-medium block pt-0.5"
            >
              Ver carrito completo
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
