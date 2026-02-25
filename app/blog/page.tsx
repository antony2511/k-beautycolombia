import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string;
  skinType: string[] | null;
  brands: string[] | null;
  author: string;
  createdAt: string;
}

interface BlogResponse {
  posts: BlogPost[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
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

async function getBlogPosts(searchParams: { category?: string; page?: string }): Promise<BlogResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const params = new URLSearchParams({ limit: '9' });

  if (searchParams.category) params.set('category', searchParams.category);
  if (searchParams.page) params.set('page', searchParams.page);

  try {
    const res = await fetch(`${baseUrl}/api/blog?${params}`, {
      cache: 'no-store',
    });
    if (!res.ok) return { posts: [], pagination: { total: 0, page: 1, limit: 9, totalPages: 0 } };
    return res.json();
  } catch {
    return { posts: [], pagination: { total: 0, page: 1, limit: 9, totalPages: 0 } };
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const params = await searchParams;
  const { posts, pagination } = await getBlogPosts(params);
  const activeCategory = params.category || '';

  const categories = [
    { value: '', label: 'Todos' },
    { value: 'rutina_dia', label: 'Rutina de Día' },
    { value: 'rutina_noche', label: 'Rutina de Noche' },
    { value: 'ingredientes', label: 'Ingredientes' },
    { value: 'casos_exito', label: 'Casos de Éxito' },
    { value: 'consejos', label: 'Consejos' },
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background-gray pt-24">
        {/* Header */}
        <section className="py-16 bg-gradient-to-br from-background-cream/60 via-secondary/5 to-background-cream/60">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <span className="inline-block text-secondary font-bold uppercase tracking-widest text-sm mb-4 bg-secondary/10 px-4 py-2 rounded-full">
              Blog & Rutinas
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Skincare con Criterio Médico
            </h1>
            <p className="text-lg text-accent max-w-2xl mx-auto">
              Artículos, rutinas y consejos de skincare escritos por la{' '}
              <span className="font-semibold text-primary">Dra. Berenice Rodríguez</span>,
              médica estética especializada en K-Beauty.
            </p>
          </div>
        </section>

        {/* Filtros */}
        <section className="py-6 bg-white border-b border-accent-light/30 sticky top-[73px] z-40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <Link
                  key={cat.value}
                  href={cat.value ? `/blog?category=${cat.value}` : '/blog'}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat.value
                      ? 'bg-secondary text-white shadow-md shadow-secondary/30'
                      : 'bg-accent-light/30 text-primary hover:bg-secondary/10 hover:text-secondary'
                  }`}
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            {posts.length === 0 ? (
              <div className="text-center py-20">
                <span className="material-icons text-6xl text-accent/30 mb-4 block">article</span>
                <h3 className="text-2xl font-bold text-primary mb-2">
                  Próximamente...
                </h3>
                <p className="text-accent max-w-md mx-auto">
                  La Dra. Berenice está preparando artículos de skincare y rutinas personalizadas.
                  ¡Vuelve pronto!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border border-accent-light/20"
                  >
                    {/* Cover image */}
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            categoryColors[post.category] || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {categoryLabels[post.category] || post.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h2 className="text-lg font-bold text-primary mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-sm text-accent line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      {(post.skinType?.length || post.brands?.length) ? (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {post.skinType?.slice(0, 2).map((st) => (
                            <span
                              key={st}
                              className="text-xs px-2 py-0.5 bg-secondary/10 text-secondary rounded-full"
                            >
                              {st}
                            </span>
                          ))}
                          {post.brands?.slice(0, 2).map((brand) => (
                            <span
                              key={brand}
                              className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium"
                            >
                              {brand}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-accent/70">
                          {new Date(post.createdAt).toLocaleDateString('es-CO', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-sm font-semibold text-secondary hover:text-secondary-dark transition-colors flex items-center gap-1"
                        >
                          Leer más
                          <span className="material-icons text-sm">arrow_forward</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Paginación */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                {pagination.page > 1 && (
                  <Link
                    href={`/blog?${activeCategory ? `category=${activeCategory}&` : ''}page=${pagination.page - 1}`}
                    className="px-6 py-3 border-2 border-accent-light rounded-full hover:border-secondary transition-colors font-medium"
                  >
                    Anterior
                  </Link>
                )}
                <span className="text-accent">
                  Página {pagination.page} de {pagination.totalPages}
                </span>
                {pagination.page < pagination.totalPages && (
                  <Link
                    href={`/blog?${activeCategory ? `category=${activeCategory}&` : ''}page=${pagination.page + 1}`}
                    className="px-6 py-3 border-2 border-accent-light rounded-full hover:border-secondary transition-colors font-medium"
                  >
                    Siguiente
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
