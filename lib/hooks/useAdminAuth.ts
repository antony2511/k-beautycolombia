'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AdminAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  email: string | null;
}

export function useAdminAuth() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AdminAuthState>({
    isAuthenticated: false,
    isLoading: true,
    email: null,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // El middleware ya maneja la verificación del token
      // Si llegamos aquí, el usuario está autenticado
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        email: null, // Podríamos obtener esto del token si fuera necesario
      });
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        email: null,
      });
      router.push('/admin/login');
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Error al iniciar sesión' };
      }

      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        email,
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Error de conexión' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/admin/auth/logout', {
        method: 'POST',
      });

      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        email: null,
      });

      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return {
    ...authState,
    login,
    logout,
    checkAuth,
  };
}
