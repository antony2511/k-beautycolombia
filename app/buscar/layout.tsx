import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buscar productos',
  description: 'Busca productos de belleza coreana en K-Beauty Colombia.',
  robots: { index: false, follow: true },
};

export default function BuscarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
