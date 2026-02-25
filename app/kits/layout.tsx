import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kits y Rutinas',
  description:
    'Descubre nuestros kits de belleza coreana cuidadosamente curados. Rutinas completas con descuento especial: básica, anti-edad, anti-acné y más.',
  keywords: [
    'kits k-beauty', 'rutinas coreanas', 'sets skincare', 'rutina anti-acné',
    'rutina glass skin', 'bundle belleza coreana',
  ],
  openGraph: {
    title: 'Kits y Rutinas K-Beauty Colombia',
    description: 'Rutinas completas de belleza coreana con descuento especial.',
  },
};

export default function KitsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
