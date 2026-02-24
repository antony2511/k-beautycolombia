'use client';

import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCartStore } from '@/lib/stores/useCartStore';

export default function CarritoPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getTotal = useCartStore((state) => state.getTotal);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const subtotal = getSubtotal();
  const total = getTotal();
  const freeShippingThreshold = 150000;
  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 15000;

  return (
    <>
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full min-h-screen">
        {/* Header */}
        <header className="mb-12">
          <span className="text-accent text-sm tracking-widest uppercase mb-2 block font-medium">
            Tu Selección
          </span>
          <h1 className="text-4xl md:text-5xl font-medium text-primary italic">
            Carrito de Compras
          </h1>
        </header>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="text-center py-24">
            <div className="mb-8">
              <span className="material-icons text-8xl text-accent/30">
                shopping_cart
              </span>
            </div>
            <h2 className="text-2xl text-primary mb-4 font-medium">
              Tu carrito está vacío
            </h2>
            <p className="text-accent mb-8 max-w-md mx-auto">
              Descubre nuestra colección de productos K-Beauty y encuentra tus
              favoritos.
            </p>
            <Link
              href="/tienda"
              className="inline-flex items-center gap-2 bg-secondary text-primary px-8 py-3 rounded-lg font-bold hover:brightness-95 transition-all shadow-md"
            >
              Explorar Productos
              <span className="material-icons text-sm">arrow_forward</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-8 space-y-6">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white/30 rounded-xl p-6 shadow-sm border border-accent/20 hover:shadow-md transition-all"
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <Link
                      href={`/producto/${item.productId}`}
                      className="shrink-0"
                    >
                      <div className="w-24 h-32 relative rounded-lg overflow-hidden bg-white/50 cursor-pointer hover:opacity-90 transition-opacity">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <Link href={`/producto/${item.productId}`}>
                          <h3 className="text-xl font-medium text-primary mb-1 hover:text-secondary transition-colors cursor-pointer">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-accent uppercase tracking-wider mb-3">
                          {item.product.brand}
                        </p>
                        <p className="text-lg font-bold text-primary">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-primary rounded w-28 justify-between px-2 h-10">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                Math.max(0, item.quantity - 1)
                              )
                            }
                            className="w-8 h-full flex items-center justify-center text-primary hover:bg-primary/5 transition-colors"
                          >
                            -
                          </button>
                          <span className="text-primary font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            className="w-8 h-full flex items-center justify-center text-primary hover:bg-primary/5 transition-colors"
                          >
                            +
                          </button>
                        </div>

                        {/* Subtotal & Remove */}
                        <div className="flex items-center gap-6">
                          <p className="text-xl font-bold text-primary">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-accent hover:text-red-500 transition-colors"
                            aria-label="Eliminar producto"
                          >
                            <span className="material-icons">delete_outline</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue Shopping Link */}
              <Link
                href="/tienda"
                className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors mt-6"
              >
                <span className="material-icons text-sm">arrow_back</span>
                <span className="font-medium">Seguir Comprando</span>
              </Link>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4">
              <div className="bg-white/40 rounded-xl p-8 shadow-md border border-accent/20 sticky top-24">
                <h2 className="text-2xl font-medium text-primary mb-6 border-b border-primary/10 pb-4">
                  Resumen del Pedido
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-primary">
                    <span>Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-primary">
                    <span>Envío</span>
                    <span className="font-medium">
                      {shippingCost === 0 ? (
                        <span className="text-green-600">Gratis</span>
                      ) : (
                        formatPrice(shippingCost)
                      )}
                    </span>
                  </div>

                  {subtotal < freeShippingThreshold && (
                    <div className="bg-secondary/20 border border-secondary/30 rounded-lg p-3 text-sm text-primary">
                      <div className="flex items-start gap-2">
                        <span className="material-icons text-sm mt-0.5">
                          local_shipping
                        </span>
                        <span>
                          Agrega{' '}
                          <strong>
                            {formatPrice(freeShippingThreshold - subtotal)}
                          </strong>{' '}
                          más para envío gratis
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-primary/10 pt-4 flex justify-between text-primary text-xl font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total + shippingCost)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full bg-secondary text-primary py-4 rounded-lg font-bold text-lg hover:brightness-95 transition-all shadow-md mb-4 flex items-center justify-center gap-2"
                >
                  <span>Proceder al Pago</span>
                  <span className="material-icons text-sm">arrow_forward</span>
                </Link>

                <div className="space-y-3 text-sm text-accent">
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-sm">local_shipping</span>
                    <span>Envío a todo Colombia</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-sm">verified_user</span>
                    <span>Pago seguro garantizado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-sm">inventory_2</span>
                    <span>Productos 100% originales</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
