'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCartStore } from '@/lib/stores/useCartStore';

interface PaymentResult {
  success: boolean;
  orderNumber: string;
  paymentStatus: string;
  transactionStatus: string;
  message: string;
}

export default function ConfirmacionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = params.orderId as string;
  const sessionId = searchParams.get('session_id');
  const devMode = searchParams.get('dev_mode');

  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    async function verifyPayment() {
      // Modo desarrollo: Simular pago exitoso
      if (devMode === 'true') {
        console.log('🔧 Development mode: Simulating successful payment');
        setResult({
          success: true,
          orderNumber: `ORD-${orderId.slice(0, 8)}`,
          paymentStatus: 'paid',
          transactionStatus: 'approved',
          message: 'Pago simulado exitosamente (Modo Desarrollo)',
        });
        setIsLoading(false);
        clearCart();
        return;
      }

      if (!sessionId) {
        setError('No se encontró el ID de la sesión de Stripe');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/checkout/verify-stripe-payment?session_id=${sessionId}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Error al verificar el pago');
        }

        setResult(data);

        // Si el pago fue aprobado, limpiar el carrito
        if (data.paymentStatus === 'approved') {
          clearCart();
        }
      } catch (err) {
        console.error('Error al verificar el pago:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'No se pudo verificar el estado del pago'
        );
      } finally {
        setIsLoading(false);
      }
    }

    verifyPayment();
  }, [sessionId, clearCart]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-6 py-12 w-full min-h-screen">
        {isLoading ? (
          // Loading State
          <div className="text-center py-24">
            <div className="mb-8">
              <span className="material-icons text-8xl text-accent/30 animate-spin">
                refresh
              </span>
            </div>
            <h2 className="text-2xl text-primary mb-4 font-medium">
              Verificando tu pago...
            </h2>
            <p className="text-accent">Por favor espera un momento</p>
          </div>
        ) : error ? (
          // Error State
          <div className="text-center py-24">
            <div className="mb-8">
              <span className="material-icons text-8xl text-red-400">error</span>
            </div>
            <h2 className="text-2xl text-primary mb-4 font-medium">
              Error al Verificar el Pago
            </h2>
            <p className="text-accent mb-8 max-w-md mx-auto">{error}</p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/carrito"
                className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-lg font-medium hover:brightness-95 transition-all"
              >
                <span className="material-icons text-sm">arrow_back</span>
                Volver al Carrito
              </Link>
              <Link
                href="/tienda"
                className="inline-flex items-center gap-2 bg-secondary text-primary px-6 py-3 rounded-lg font-medium hover:brightness-95 transition-all"
              >
                Ir a la Tienda
              </Link>
            </div>
          </div>
        ) : result?.paymentStatus === 'approved' ? (
          // Success State
          <div className="text-center py-12">
            <div className="mb-8">
              <span className="material-icons text-8xl text-green-500 animate-bounce">
                check_circle
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-medium text-primary mb-4 italic">
              ¡Pago Exitoso!
            </h1>
            <p className="text-xl text-accent mb-8">
              Tu orden ha sido confirmada
            </p>

            {/* Order Details Card */}
            <div className="bg-white/40 rounded-xl p-8 shadow-md border border-accent/20 max-w-2xl mx-auto mb-8">
              <div className="space-y-4 text-left">
                <div className="flex justify-between border-b border-primary/10 pb-3">
                  <span className="text-accent">Número de Orden:</span>
                  <span className="font-bold text-primary">{result.orderNumber}</span>
                </div>
                <div className="flex justify-between border-b border-primary/10 pb-3">
                  <span className="text-accent">Estado del Pago:</span>
                  <span className="font-bold text-green-600">Aprobado</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-accent">Estado de la Orden:</span>
                  <span className="font-bold text-primary">En Procesamiento</span>
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-2xl mx-auto mb-8">
              <div className="flex items-start gap-3">
                <span className="material-icons text-green-500">info</span>
                <div className="text-left">
                  <h3 className="font-medium text-green-800 mb-2">
                    ¿Qué sigue?
                  </h3>
                  <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
                    <li>Recibirás un correo de confirmación</li>
                    <li>Procesaremos tu pedido en las próximas 24 horas</li>
                    <li>Te notificaremos cuando tu pedido sea enviado</li>
                    <li>El tiempo de entrega es de 3-5 días hábiles</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Link
                href="/tienda"
                className="inline-flex items-center gap-2 bg-secondary text-primary px-8 py-3 rounded-lg font-bold text-lg hover:brightness-95 transition-all shadow-md"
              >
                <span>Seguir Comprando</span>
                <span className="material-icons text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        ) : result?.paymentStatus === 'declined' ? (
          // Declined State
          <div className="text-center py-12">
            <div className="mb-8">
              <span className="material-icons text-8xl text-red-400">cancel</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-medium text-primary mb-4 italic">
              Pago Rechazado
            </h1>
            <p className="text-xl text-accent mb-8">{result.message}</p>

            {/* Order Details Card */}
            <div className="bg-white/40 rounded-xl p-8 shadow-md border border-accent/20 max-w-2xl mx-auto mb-8">
              <div className="space-y-4 text-left">
                <div className="flex justify-between border-b border-primary/10 pb-3">
                  <span className="text-accent">Número de Orden:</span>
                  <span className="font-bold text-primary">{result.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-accent">Estado del Pago:</span>
                  <span className="font-bold text-red-600">Rechazado</span>
                </div>
              </div>
            </div>

            {/* Help Message */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto mb-8">
              <div className="flex items-start gap-3">
                <span className="material-icons text-red-500">help</span>
                <div className="text-left">
                  <h3 className="font-medium text-red-800 mb-2">
                    ¿Qué puedes hacer?
                  </h3>
                  <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                    <li>Verifica que tu tarjeta tenga fondos suficientes</li>
                    <li>Confirma que los datos sean correctos</li>
                    <li>Intenta con otro método de pago</li>
                    <li>Contacta con tu banco si el problema persiste</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Link
                href="/carrito"
                className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-lg font-medium hover:brightness-95 transition-all"
              >
                <span className="material-icons text-sm">arrow_back</span>
                Volver al Carrito
              </Link>
              <Link
                href="/checkout"
                className="inline-flex items-center gap-2 bg-secondary text-primary px-8 py-3 rounded-lg font-bold hover:brightness-95 transition-all shadow-md"
              >
                Reintentar Pago
              </Link>
            </div>
          </div>
        ) : (
          // Pending or Other State
          <div className="text-center py-12">
            <div className="mb-8">
              <span className="material-icons text-8xl text-yellow-500">pending</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-medium text-primary mb-4 italic">
              Pago Pendiente
            </h1>
            <p className="text-xl text-accent mb-8">
              {result?.message || 'Tu pago está siendo procesado'}
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto mb-8">
              <p className="text-sm text-yellow-700">
                Te notificaremos por correo cuando se confirme tu pago
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-secondary text-primary px-8 py-3 rounded-lg font-bold hover:brightness-95 transition-all shadow-md"
            >
              Volver al Inicio
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
