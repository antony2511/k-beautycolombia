'use client';

import { useEffect } from 'react';

interface PrefetchOptions {
  url: string;
  priority?: 'high' | 'low' | 'auto';
}

/**
 * Hook para prefetch de datos al hacer hover sobre links
 */
export function usePrefetch(options: PrefetchOptions) {
  const { url, priority = 'low' } = options;

  useEffect(() => {
    // Prefetch con RequestIdleCallback si está disponible
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleCallback = window.requestIdleCallback(() => {
        fetch(url, {
          method: 'GET',
          priority: priority as RequestPriority,
        }).catch(() => {
          // Silenciar errores de prefetch
        });
      });

      return () => {
        if ('cancelIdleCallback' in window) {
          window.cancelIdleCallback(idleCallback);
        }
      };
    } else {
      // Fallback a setTimeout
      const timeout = setTimeout(() => {
        fetch(url, {
          method: 'GET',
        }).catch(() => {
          // Silenciar errores de prefetch
        });
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [url, priority]);
}

/**
 * Función para prefetch manual de productos
 */
export function prefetchProducts(params: URLSearchParams = new URLSearchParams()) {
  if (typeof window === 'undefined') return;

  const url = `/api/products?${params.toString()}`;

  // Usar fetch con cache para que el navegador cachee la respuesta
  fetch(url, {
    method: 'GET',
    cache: 'force-cache',
  }).catch(() => {
    // Silenciar errores de prefetch
  });
}

/**
 * Función para prefetch de filtros
 */
export function prefetchFilters() {
  if (typeof window === 'undefined') return;

  fetch('/api/products/filters', {
    method: 'GET',
    cache: 'force-cache',
  }).catch(() => {
    // Silenciar errores de prefetch
  });
}
