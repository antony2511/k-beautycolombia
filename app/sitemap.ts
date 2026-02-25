import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

const BASE_URL = 'https://korea.uclipcolombia.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/tienda`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/kits`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/blog`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/privacidad`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/terminos`, changeFrequency: 'monthly', priority: 0.3 },
  ];

  // Category pages
  const categories = ['hidratacion', 'limpieza', 'tratamiento', 'proteccion', 'mascarillas', 'tónicos'];
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((slug) => ({
    url: `${BASE_URL}/categoria/${slug}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Product pages
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { id: true, updatedAt: true },
  });
  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/producto/${p.id}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Blog posts
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
  });
  const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes];
}
