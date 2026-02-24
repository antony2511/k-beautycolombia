'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface WompiWidgetProps {
  referenceCode: string;
  totalAmount: number;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  orderId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

// Declarar el tipo global de Wompi
declare global {
  interface Window {
    WidgetCheckout: any;
  }
}

export default function WompiWidget({
  referenceCode,
  totalAmount,
  customerEmail,
  customerName,
  customerPhone,
  orderId,
  onSuccess,
  onError,
}: WompiWidgetProps) {
  const router = useRouter();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar el script de Wompi
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Verificar si el script ya está cargado
    if (window.WidgetCheckout) {
      setIsScriptLoaded(true);
      return;
    }

    // Cargar el script de Wompi
    const script = document.createElement('script');
    script.src = 'https://checkout.wompi.co/widget.js';
    script.async = true;
    script.onload = () => {
      setIsScriptLoaded(true);
    };
    script.onerror = () => {
      console.error('Error al cargar el script de Wompi');
      onError?.('No se pudo cargar el sistema de pagos');
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [onError]);

  const openWompiCheckout = () => {
    if (!isScriptLoaded || !window.WidgetCheckout) {
      alert('El sistema de pagos aún no está listo. Por favor intenta nuevamente.');
      return;
    }

    setIsLoading(true);

    const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (!publicKey) {
      alert('Error de configuración: Clave pública de Wompi no encontrada');
      setIsLoading(false);
      return;
    }

    try {
      const checkout = new window.WidgetCheckout({
        currency: 'COP',
        amountInCents: Math.round(totalAmount * 100), // Convertir a centavos
        reference: referenceCode,
        publicKey: publicKey,
        redirectUrl: `${appUrl}/checkout/confirmacion/${orderId}`,
        customerData: {
          email: customerEmail,
          fullName: customerName,
          phoneNumber: customerPhone,
        },
      });

      checkout.open((result: any) => {
        // Este callback se ejecuta cuando el widget se cierra
        setIsLoading(false);

        if (result.transaction && result.transaction.status === 'APPROVED') {
          // Pago exitoso
          onSuccess?.();
          router.push(`/checkout/confirmacion/${orderId}?transaction=${result.transaction.id}`);
        } else if (result.transaction && result.transaction.status === 'DECLINED') {
          // Pago rechazado
          onError?.('El pago fue rechazado');
        } else {
          // Usuario cerró el widget sin completar el pago
          console.log('Widget cerrado sin completar el pago');
        }
      });
    } catch (error) {
      console.error('Error al abrir Wompi checkout:', error);
      setIsLoading(false);
      onError?.('Error al abrir el sistema de pagos');
    }
  };

  return (
    <button
      onClick={openWompiCheckout}
      disabled={!isScriptLoaded || isLoading}
      className={`w-full py-4 rounded-lg font-bold text-lg transition-all shadow-md flex items-center justify-center gap-2 ${
        !isScriptLoaded || isLoading
          ? 'bg-accent/30 text-accent cursor-not-allowed'
          : 'bg-secondary text-primary hover:brightness-95'
      }`}
    >
      {isLoading ? (
        <>
          <span className="material-icons animate-spin">refresh</span>
          <span>Abriendo sistema de pago...</span>
        </>
      ) : !isScriptLoaded ? (
        <>
          <span className="material-icons animate-spin">refresh</span>
          <span>Cargando...</span>
        </>
      ) : (
        <>
          <span>Pagar con Wompi</span>
          <span className="material-icons text-sm">arrow_forward</span>
        </>
      )}
    </button>
  );
}
