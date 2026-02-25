import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Página no encontrada | K-Beauty Colombia',
  description: 'La página que buscas no existe.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <span className="material-symbols-outlined text-8xl text-secondary mb-4">search_off</span>
      <h1 className="text-4xl font-bold text-primary mb-2">404</h1>
      <p className="text-xl text-gray-600 mb-2">Página no encontrada</p>
      <p className="text-gray-500 mb-8 max-w-md">
        La página que buscas no existe o fue movida. Explora nuestra tienda de productos K-Beauty.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="px-6 py-3 bg-secondary text-white rounded-xl font-semibold hover:bg-secondary/90 transition-colors"
        >
          Ir al inicio
        </Link>
        <Link
          href="/tienda"
          className="px-6 py-3 border-2 border-secondary text-secondary rounded-xl font-semibold hover:bg-secondary/5 transition-colors"
        >
          Ver tienda
        </Link>
      </div>
    </div>
  );
}
