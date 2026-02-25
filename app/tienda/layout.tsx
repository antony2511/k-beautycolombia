import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tienda',
  description:
    'Explora nuestra colección de productos de belleza coreana: limpiadores, tónicos, sérums, hidratantes, mascarillas y más. Envíos a toda Colombia.',
  keywords: [
    'tienda k-beauty', 'productos coreanos Colombia', 'skincare coreano', 'cosméticos coreanos',
    'limpiadores coreanos', 'sérums coreanos', 'hidratantes coreanos',
  ],
  openGraph: {
    title: 'Tienda K-Beauty Colombia',
    description: 'Productos auténticos de belleza coreana con envío a toda Colombia.',
  },
};

export default function TiendaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
