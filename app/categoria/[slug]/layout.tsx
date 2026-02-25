import type { Metadata } from 'next';

const BASE_URL = 'https://korea.uclipcolombia.com';

const categoryMeta: Record<string, { name: string; description: string }> = {
  hidratacion: {
    name: 'Hidratación',
    description: 'Cremas, hidratantes y emolientes coreanos para una piel suave y radiante. Descubre la hidratación al estilo K-Beauty en Colombia.',
  },
  limpieza: {
    name: 'Limpieza',
    description: 'Limpiadores coreanos: aceites desmaquillantes, espumas y balms. Doble limpieza para una piel perfecta.',
  },
  tratamiento: {
    name: 'Tratamiento',
    description: 'Sérums, ampollas y tratamientos coreanos de alta concentración para manchas, poros y firmeza.',
  },
  proteccion: {
    name: 'Protección Solar',
    description: 'Protectores solares coreanos de alta tecnología. Ligeros, sin residuo blanco, perfectos para piel mixta y grasa.',
  },
  mascarillas: {
    name: 'Mascarillas',
    description: 'Mascarillas coreanas en lámina, crema y sleeping mask. Hidratación y luminosidad en minutos.',
  },
  tónicos: {
    name: 'Tónicos',
    description: 'Tónicos y esencias coreanas que preparan la piel para absorber mejor el resto de tu rutina.',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = categoryMeta[slug];

  const name = meta?.name ?? slug.charAt(0).toUpperCase() + slug.slice(1);
  const description =
    meta?.description ??
    `Productos de ${name} K-Beauty en Colombia. Cosméticos coreanos originales con envío a todo el país.`;
  const url = `${BASE_URL}/categoria/${slug}`;

  return {
    title: `${name} K-Beauty`,
    description,
    openGraph: { title: `${name} | K-Beauty Colombia`, description, url },
    alternates: { canonical: url },
  };
}

export default function CategoriaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
