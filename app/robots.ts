import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/perfil/'],
      },
    ],
    sitemap: 'https://korea.uclipcolombia.com/sitemap.xml',
    host: 'https://korea.uclipcolombia.com',
  };
}
