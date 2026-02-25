'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar suscripción a newsletter
    console.log('Suscrito:', email);
    setEmail('');
  };

  return (
    <footer className="bg-gradient-to-b from-surface-white to-accent-light/20 pt-16 pb-8 border-t border-accent-light/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo.png?v=2"
                alt="K-Beauty Colombia"
                width={180}
                height={60}
                className="h-12 w-auto object-contain"
                unoptimized
              />
            </Link>
            <p className="text-accent text-sm mb-6">
              Tu destino confiable para la mejor cosmética coreana en Colombia.
              Productos 100% originales.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary/60 hover:text-primary transition-colors"
              >
                <span className="material-icons">facebook</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary/60 hover:text-primary transition-colors"
              >
                <svg
                  className="w-6 h-6 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Comprar */}
          <div>
            <h4 className="font-bold text-primary mb-4">Comprar</h4>
            <ul className="space-y-2 text-sm text-accent">
              <li>
                <Link href="/tienda?sortBy=newest" className="hover:text-primary transition-colors">
                  Novedades
                </Link>
              </li>
              <li>
                <Link href="/tienda?sortBy=bestseller" className="hover:text-primary transition-colors">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/kits" className="hover:text-primary transition-colors">
                  Kits de Rutina
                </Link>
              </li>
              <li>
                <Link href="/tienda?sortBy=price_asc" className="hover:text-primary transition-colors">
                  Ofertas
                </Link>
              </li>
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h4 className="font-bold text-primary mb-4">Ayuda</h4>
            <ul className="space-y-2 text-sm text-accent">
              <li>
                <Link href="/tienda" className="hover:text-primary transition-colors">
                  Envíos y Devoluciones
                </Link>
              </li>
              <li>
                <Link href="/tienda" className="hover:text-primary transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link href="/perfil/ordenes" className="hover:text-primary transition-colors">
                  Rastrea tu pedido
                </Link>
              </li>
              <li>
                <Link href="/tienda" className="hover:text-primary transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Envíos */}
          <div>
            <h4 className="font-bold text-primary mb-4">Envíos</h4>
            <p className="text-sm text-accent mb-4">
              Envíos a todo Colombia. Gratis por compras superiores a $150.000
              COP.
            </p>
            <div className="flex items-center gap-2 text-primary/60">
              <span className="material-icons text-lg">local_shipping</span>
              <span className="text-sm">Bogotá, Medellín, Cali...</span>
            </div>
          </div>
        </div>

        <div className="border-t border-primary/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-accent">
          <p>
            © {new Date().getFullYear()} K-Beauty Colombia. Todos los derechos
            reservados.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacidad" className="hover:text-primary">
              Privacidad
            </Link>
            <Link href="/terminos" className="hover:text-primary">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
