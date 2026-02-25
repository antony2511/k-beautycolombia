'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';

const menuItems = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: 'dashboard',
  },
  {
    name: 'Productos',
    href: '/admin/productos',
    icon: 'inventory',
  },
  {
    name: 'Kits',
    href: '/admin/kits',
    icon: 'auto_awesome',
  },
  {
    name: 'Blog',
    href: '/admin/blog',
    icon: 'article',
  },
  {
    name: 'Banners',
    href: '/admin/banners',
    icon: 'campaign',
  },
  {
    name: 'Órdenes',
    href: '/admin/ordenes',
    icon: 'shopping_bag',
  },
  {
    name: 'Usuarios',
    href: '/admin/usuarios',
    icon: 'people',
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAdminAuth();

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-primary text-white flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="relative w-10 h-10">
            <Image
              src="/logo.png"
              alt="K-Beauty Colombia"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold">K-Beauty Colombia</h1>
            <p className="text-xs text-white/70">Panel Admin</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive(item.href)
                ? 'bg-secondary text-white shadow-lg'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="material-icons text-xl">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-red-500/20 hover:text-white transition-all"
        >
          <span className="material-icons text-xl">logout</span>
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
