import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import MiniCart from '@/components/layout/MiniCart';
import BannerDisplay from '@/components/ui/BannerDisplay';
import QuizFloatingButton from '@/components/quiz/QuizFloatingButton';
import { Toaster } from 'sonner';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const BASE_URL = 'https://korea.uclipcolombia.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'K-Beauty Colombia | Productos Coreanos Originales',
    template: '%s | K-Beauty Colombia',
  },
  description:
    'Descubre el secreto de la Glass Skin. Productos auténticos importados de Corea del Sur. Transforma tu rutina con ingredientes puros y tecnología innovadora.',
  keywords: [
    'k-beauty',
    'belleza coreana',
    'skincare',
    'cosmética coreana',
    'K-Beauty Colombia',
    'productos coreanos',
    'rutina coreana',
    'glass skin',
    'cosrx',
    'beauty of joseon',
  ],
  authors: [{ name: 'K-Beauty Colombia' }],
  creator: 'K-Beauty Colombia',
  publisher: 'K-Beauty Colombia',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: BASE_URL,
    siteName: 'K-Beauty Colombia',
    title: 'K-Beauty Colombia | Productos Coreanos Originales',
    description:
      'Descubre el secreto de la Glass Skin. Productos auténticos de Corea del Sur.',
    images: [{ url: '/logo.png', width: 220, height: 75, alt: 'K-Beauty Colombia' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'K-Beauty Colombia',
    description: 'Productos auténticos de belleza coreana',
    images: ['/logo.png'],
  },
  alternates: { canonical: BASE_URL },
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
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons&display=swap"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <BannerDisplay />
          {children}
          <MiniCart />
          <QuizFloatingButton />
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: { fontFamily: 'var(--font-space-grotesk)' },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
