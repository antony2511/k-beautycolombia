import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GlowSeoul - K-Beauty Colombia | Productos Coreanos Originales',
  description:
    'Descubre el secreto de la Glass Skin. Productos auténticos importados de Corea del Sur. Transforma tu rutina con ingredientes puros y tecnología innovadora.',
  keywords: [
    'k-beauty',
    'belleza coreana',
    'skincare',
    'cosmética coreana',
    'GlowSeoul',
    'productos coreanos',
    'rutina coreana',
    'glass skin',
    'cosrx',
    'beauty of joseon',
  ],
  authors: [{ name: 'GlowSeoul Colombia' }],
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://glowseoul.co',
    siteName: 'GlowSeoul',
    title: 'GlowSeoul - K-Beauty Colombia',
    description:
      'Descubre el secreto de la Glass Skin. Productos auténticos de Corea del Sur.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GlowSeoul - K-Beauty Colombia',
    description: 'Productos auténticos de belleza coreana',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={spaceGrotesk.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
