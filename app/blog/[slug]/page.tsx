import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { prisma } from '@/lib/prisma';

const BASE_URL = 'https://korea.uclipcolombia.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findFirst({
    where: { slug, isPublished: true },
    select: { title: true, excerpt: true, coverImage: true, slug: true },
  });

  if (!post) return { title: 'Artículo no encontrado' };

  const url = `${BASE_URL}/blog/${slug}`;
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      url,
      type: 'article',
      images: post.coverImage ? [{ url: post.coverImage, alt: post.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.coverImage ? [post.coverImage] : [],
    },
    alternates: { canonical: url },
  };
}

const categoryLabels: Record<string, string> = {
  rutina_dia: 'Rutina de Día',
  rutina_noche: 'Rutina de Noche',
  ingredientes: 'Ingredientes',
  casos_exito: 'Casos de Éxito',
  consejos: 'Consejos',
};

const categoryColors: Record<string, string> = {
  rutina_dia: 'bg-yellow-100 text-yellow-800',
  rutina_noche: 'bg-indigo-100 text-indigo-800',
  ingredientes: 'bg-green-100 text-green-800',
  casos_exito: 'bg-pink-100 text-pink-800',
  consejos: 'bg-purple-100 text-purple-800',
};

async function getPost(slug: string) {
  return prisma.blogPost.findFirst({
    where: { slug, isPublished: true },
  });
}

async function getRelatedProducts(ids: string[]) {
  if (!ids.length) return [];
  return prisma.product.findMany({
    where: { id: { in: ids }, isActive: true },
    select: { id: true, name: true, image: true, price: true, brand: true },
    take: 4,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const relatedProductIds = (post.relatedProductIds as string[]) || [];
  const relatedProducts = await getRelatedProducts(relatedProductIds);
  const brands = (post.brands as string[]) || [];
  const skinTypes = (post.skinType as string[]) || [];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background-gray pt-24">
        {/* Hero image */}
        <div className="relative h-[40vh] md:h-[55vh] overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-4xl mx-auto">
            <span
              className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 ${
                categoryColors[post.category] || 'bg-gray-100 text-gray-800'
              }`}
            >
              {categoryLabels[post.category] || post.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              {post.title}
            </h1>
          </div>
        </div>

        {/* Content area */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Author & date */}
          <div className="flex items-center gap-3 mb-8 pb-8 border-b border-accent-light/30">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-secondary-light flex items-center justify-center text-white font-bold text-sm">
              DR
            </div>
            <div>
              <p className="font-semibold text-primary">{post.author}</p>
              <p className="text-sm text-accent">
                {new Date(post.createdAt).toLocaleDateString('es-CO', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Excerpt */}
          <p className="text-xl text-accent leading-relaxed mb-8 font-medium italic border-l-4 border-secondary pl-6">
            {post.excerpt}
          </p>

          {/* Main content */}
          <div className="prose prose-lg max-w-none text-primary whitespace-pre-line leading-relaxed">
            {post.content}
          </div>

          {/* Skin type tags */}
          {skinTypes.length > 0 && (
            <div className="mt-10 pt-8 border-t border-accent-light/30">
              <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">
                Tipo de piel
              </p>
              <div className="flex flex-wrap gap-2">
                {skinTypes.map((st) => (
                  <span
                    key={st}
                    className="px-4 py-1.5 bg-secondary/10 text-secondary rounded-full text-sm font-medium"
                  >
                    {st}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Brands mentioned */}
          {brands.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">
                Marcas mencionadas
              </p>
              <div className="flex flex-wrap gap-2">
                {brands.map((brand) => (
                  <span
                    key={brand}
                    className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-bold"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12 pt-8 border-t border-accent-light/30">
              <h3 className="text-2xl font-bold text-primary mb-6">
                Productos Recomendados
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/producto/${product.id}`}
                    className="group bg-white rounded-xl overflow-hidden border border-accent-light/30 hover:border-secondary hover:shadow-md transition-all"
                  >
                    <div className="h-32 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-accent/70 font-medium mb-0.5">{product.brand}</p>
                      <p className="text-sm font-semibold text-primary line-clamp-2">
                        {product.name}
                      </p>
                      <p className="text-secondary font-bold text-sm mt-1">
                        ${product.price.toLocaleString('es-CO')}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back button */}
          <div className="mt-12 pt-8 border-t border-accent-light/30">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-secondary hover:text-secondary-dark font-semibold transition-colors"
            >
              <span className="material-icons text-lg">arrow_back</span>
              Volver al blog
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
