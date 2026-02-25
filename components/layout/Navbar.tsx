'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/stores/useCartStore';
import UserNav from '@/components/auth/UserNav';
import { prefetchProducts, prefetchFilters } from '@/lib/hooks/usePrefetch';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cartCount = useCartStore((state) => state.getItemCount());
  const openCart = useCartStore((state) => state.openCart);

  // Evitar error de hidratación - solo mostrar carrito después de montar
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prefetch productos y filtros al cargar para navegación más rápida
  useEffect(() => {
    // Esperar un poco antes de prefetch para no interferir con la carga inicial
    const timeout = setTimeout(() => {
      prefetchProducts();
      prefetchFilters();
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  // Funciones de hover para prefetch
  const handleHoverTienda = () => {
    prefetchProducts();
    prefetchFilters();
  };

  const handleHoverCategoria = (categoria: string) => {
    const params = new URLSearchParams();
    params.set('category', categoria);
    params.set('sortBy', 'newest');
    prefetchProducts(params);
  };

  return (
    <nav className="fixed w-full z-50 top-0 start-0 border-b border-accent-light/30 bg-surface-white/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center rtl:space-x-reverse">
          <Image
            src="/logo.png?v=2"
            alt="K-Beauty Colombia"
            width={220}
            height={75}
            className="h-14 w-auto object-contain"
            priority
            unoptimized
          />
        </Link>

        {/* Icons & Mobile Toggle */}
        <div className="flex md:order-2 space-x-3 md:space-x-4 rtl:space-x-reverse items-center">
          <Link
            href="/buscar"
            className="text-primary hover:text-secondary focus:outline-none transition-colors"
            aria-label="Buscar"
          >
            <span className="material-icons">search</span>
          </Link>
          <UserNav />
          <Link
            href="/carrito"
            onClick={(e) => {
              if (window.innerWidth >= 768) {
                e.preventDefault();
                openCart();
              }
            }}
            className="relative text-primary hover:text-secondary focus:outline-none transition-colors"
          >
            <span className="material-icons">shopping_bag</span>
            {mounted && cartCount > 0 && (
              <div className="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-secondary border-2 border-background-cream rounded-full -top-1 -end-2">
                {cartCount}
              </div>
            )}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-primary rounded-lg md:hidden hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-primary/20"
            type="button"
            aria-label="Menú"
          >
            <span className="material-icons">menu</span>
          </button>
        </div>

        {/* Desktop Menu */}
        <div
          className={`items-center justify-between ${
            mobileMenuOpen ? 'flex' : 'hidden'
          } w-full md:flex md:w-auto md:order-1`}
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-primary/10 rounded-lg bg-white/30 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent">
            <li>
              <Link
                href="/tienda"
                className="block py-2 px-3 text-primary rounded hover:bg-white/40 md:hover:bg-transparent md:hover:text-secondary md:p-0 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
                onMouseEnter={handleHoverTienda}
              >
                Tienda
              </Link>
            </li>
            <li>
              <Link
                href="/categoria/limpieza"
                className="block py-2 px-3 text-primary rounded hover:bg-white/40 md:hover:bg-transparent md:hover:text-secondary md:p-0 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
                onMouseEnter={() => handleHoverCategoria('limpieza')}
              >
                Limpieza
              </Link>
            </li>
            <li>
              <Link
                href="/categoria/hidratacion"
                className="block py-2 px-3 text-primary rounded hover:bg-white/40 md:hover:bg-transparent md:hover:text-secondary md:p-0 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
                onMouseEnter={() => handleHoverCategoria('hidratacion')}
              >
                Hidratación
              </Link>
            </li>
            <li>
              <Link
                href="/categoria/tratamiento"
                className="block py-2 px-3 text-primary rounded hover:bg-white/40 md:hover:bg-transparent md:hover:text-secondary md:p-0 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
                onMouseEnter={() => handleHoverCategoria('tratamiento')}
              >
                Tratamiento
              </Link>
            </li>
            <li>
              <Link
                href="/kits"
                className="block py-2 px-3 text-primary rounded hover:bg-white/40 md:hover:bg-transparent md:hover:text-secondary md:p-0 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Kits
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                className="block py-2 px-3 text-primary rounded hover:bg-white/40 md:hover:bg-transparent md:hover:text-secondary md:p-0 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
