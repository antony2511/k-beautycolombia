'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import { useCartStore } from '@/lib/stores/useCartStore';
import type { CheckoutFormData } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const items = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getSubtotal);

  const subtotal = getSubtotal();
  const freeShippingThreshold = 150000;
  const shipping = subtotal >= freeShippingThreshold ? 0 : 15000;
  const total = subtotal + shipping;

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/carrito');
    }
  }, [items.length, router]);

  const handleFormSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true);
    setError(null);

    try {
      // Llamar al API para crear la sesión de Stripe
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerInfo: data,
          cartItems: items,
          subtotal,
          shipping,
          total,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al crear la sesión de pago');
      }

      // Redirigir a Stripe Checkout
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else {
        throw new Error('No se recibió URL de checkout');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Hubo un error al procesar tu pedido. Por favor intenta nuevamente.'
      );
      setIsProcessing(false);
    }
  };

  const handleCheckoutClick = () => {
    // Trigger form submission
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event('submit', { cancelable: true, bubbles: true })
      );
    }
  };

  if (items.length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <>
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-6 pb-12 pt-24 w-full min-h-screen">
        {/* Breadcrumb */}
        <nav className="text-xs uppercase tracking-widest text-accent mb-8">
          <Link href="/" className="hover:text-primary transition-colors">
            Inicio
          </Link>
          <span className="mx-2">/</span>
          <Link href="/carrito" className="hover:text-primary transition-colors">
            Carrito
          </Link>
          <span className="mx-2">/</span>
          <span className="text-primary border-b border-primary">Checkout</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <span className="text-accent text-sm tracking-widest uppercase mb-2 block font-medium">
            Finalizar Compra
          </span>
          <h1 className="text-4xl md:text-5xl font-medium text-primary italic">
            Información de Envío
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-7">
            <CheckoutForm
              ref={formRef}
              onSubmit={handleFormSubmit}
              isLoading={isProcessing}
              onValidationChange={setIsFormValid}
            />
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5">
            {/* Mostrar errores si existen */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="material-icons text-red-500">error</span>
                  <div>
                    <h4 className="font-medium text-red-800 mb-1">Error</h4>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <OrderSummary
              items={items}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              onCheckout={handleCheckoutClick}
              isProcessing={isProcessing}
              isFormValid={isFormValid}
            />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
