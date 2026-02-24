'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { CartItem } from '@/types';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  onCheckout: () => void;
  isProcessing: boolean;
  isFormValid: boolean;
}

export default function OrderSummary({
  items,
  subtotal,
  shipping,
  total,
  onCheckout,
  isProcessing,
  isFormValid,
}: OrderSummaryProps) {
  const [showItems, setShowItems] = useState(true);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white/40 rounded-xl p-8 shadow-md border border-accent/20 sticky top-24">
      <h2 className="text-2xl font-medium text-primary mb-6 border-b border-primary/10 pb-4">
        Resumen del Pedido
      </h2>

      {/* Items Toggle */}
      <button
        onClick={() => setShowItems(!showItems)}
        className="w-full flex justify-between items-center mb-4 text-primary hover:text-secondary transition-colors"
      >
        <span className="font-medium">
          Productos ({items.reduce((acc, item) => acc + item.quantity, 0)})
        </span>
        <span className="material-icons text-sm">
          {showItems ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {/* Items List */}
      {showItems && (
        <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-3 pb-4 border-b border-primary/10 last:border-0"
            >
              <div className="relative w-16 h-20 rounded overflow-hidden bg-white/50 shrink-0">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-grow min-w-0">
                <h4 className="text-sm font-medium text-primary truncate">
                  {item.product.name}
                </h4>
                <p className="text-xs text-accent mb-1">{item.product.brand}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-accent">Cant: {item.quantity}</span>
                  <span className="text-sm font-bold text-primary">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6 pt-4 border-t border-primary/10">
        <div className="flex justify-between text-primary">
          <span>Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-primary">
          <span>Envío</span>
          <span className="font-medium">
            {shipping === 0 ? (
              <span className="text-green-600">Gratis</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>

        <div className="border-t border-primary/10 pt-3 flex justify-between text-primary text-xl font-bold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        disabled={!isFormValid || isProcessing}
        className={`w-full py-4 rounded-lg font-bold text-lg transition-all shadow-md mb-2 flex items-center justify-center gap-2 ${
          !isFormValid || isProcessing
            ? 'bg-accent/30 text-accent cursor-not-allowed'
            : 'bg-secondary text-primary hover:brightness-95'
        }`}
      >
        {isProcessing ? (
          <>
            <span className="material-icons animate-spin">refresh</span>
            <span>Procesando...</span>
          </>
        ) : (
          <>
            <span>Proceder al Pago</span>
            <span className="material-icons text-sm">arrow_forward</span>
          </>
        )}
      </button>

      {/* Validation Message */}
      {!isFormValid && !isProcessing && (
        <p className="text-xs text-accent text-center mb-4">
          Por favor completa todos los campos requeridos (*)
        </p>
      )}

      {/* Trust Indicators */}
      <div className="space-y-2 text-sm text-accent">
        <div className="flex items-center gap-2">
          <span className="material-icons text-sm">verified_user</span>
          <span>Pago seguro garantizado</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-icons text-sm">local_shipping</span>
          <span>Envío a todo Colombia</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-icons text-sm">inventory_2</span>
          <span>Productos 100% originales</span>
        </div>
      </div>
    </div>
  );
}
