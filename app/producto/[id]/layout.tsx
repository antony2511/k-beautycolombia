import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

const BASE_URL = 'https://korea.uclipcolombia.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    select: { name: true, brand: true, description: true, image: true, price: true, category: true },
  });

  if (!product) {
    return { title: 'Producto no encontrado' };
  }

  const title = `${product.name} — ${product.brand}`;
  const description =
    product.description
      ? product.description.slice(0, 155)
      : `Compra ${product.name} de ${product.brand} en K-Beauty Colombia. Producto auténtico importado de Corea del Sur.`;
  const url = `${BASE_URL}/producto/${id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: product.image ? [{ url: product.image, alt: product.name }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.image ? [product.image] : [],
    },
    alternates: { canonical: url },
  };
}

export default function ProductoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
