'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';

const pageTitles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/productos': 'Gestión de Productos',
  '/admin/ordenes': 'Gestión de Órdenes',
  '/admin/usuarios': 'Gestión de Usuarios',
};

export default function AdminHeader() {
  const pathname = usePathname();
  const { logout } = useAdminAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  // Get page title based on pathname
  const getPageTitle = () => {
    // Check exact match first
    if (pageTitles[pathname]) {
      return pageTitles[pathname];
    }

    // Check partial match
    const matchedKey = Object.keys(pageTitles).find(
      (key) => key !== '/admin/dashboard' && pathname.startsWith(key)
    );

    if (matchedKey) {
      return pageTitles[matchedKey];
    }

    return 'Panel de Administración';
  };

  const adminEmail = 'admin@glowseoul.co'; // Could be fetched from auth context

  return (
    <header className="bg-white border-b border-accent-light/30 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Page title */}
        <div>
          <h1 className="text-2xl font-bold text-primary">{getPageTitle()}</h1>
          <p className="text-sm text-accent mt-1">
            Bienvenido al panel de administración
          </p>
        </div>

        {/* Admin info */}
        <div className="flex items-center gap-4">
          {/* Online indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            En línea
          </div>

          {/* Admin profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-accent-light/50 rounded-lg transition-colors"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-secondary/60 flex items-center justify-center shadow-md">
                <span className="material-icons text-white">person</span>
              </div>

              {/* Info */}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-primary">Administrador</p>
                <p className="text-xs text-accent">{adminEmail}</p>
              </div>

              <span className="material-icons text-accent">
                {showDropdown ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <>
                {/* Backdrop to close dropdown */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDropdown(false)}
                />

                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-accent-light/30 py-2 z-20">
                  <div className="px-4 py-3 border-b border-accent-light/30">
                    <p className="text-sm font-medium text-primary">
                      Administrador
                    </p>
                    <p className="text-xs text-accent mt-1">{adminEmail}</p>
                  </div>

                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 transition-colors"
                  >
                    <span className="material-icons text-xl">logout</span>
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
