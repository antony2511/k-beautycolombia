import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRecommendations } from '@/lib/recommendations/engine';
import type { ProductLite } from '@/lib/recommendations/engine';

function parseJsonField<T>(field: unknown, fallback: T): T {
  if (Array.isArray(field)) return field as T;
  if (typeof field === 'string') {
    try {
      return JSON.parse(field) as T;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

function toProductLite(p: {
  id: string;
  name: string;
  brand: string;
  category: string | null;
  skinType: unknown;
  benefits: unknown;
  price: number;
  compareAtPrice: number | null;
  image: string;
}): ProductLite {
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category ?? '',
    skinType: parseJsonField<string[]>(p.skinType, []),
    benefits: parseJsonField<string[]>(p.benefits, []),
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    image: p.image,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '3', 10), 10);

  if (!productId) {
    return NextResponse.json({ error: 'productId requerido' }, { status: 400 });
  }

  try {
    const current = await prisma.product.findUnique({
      where: { id: productId, isActive: true },
      select: {
        id: true,
        name: true,
        brand: true,
        category: true,
        skinType: true,
        benefits: true,
        price: true,
        compareAtPrice: true,
        image: true,
      },
    });

    if (!current) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    const catalogRaw = await prisma.product.findMany({
      where: { isActive: true, id: { not: productId } },
      take: 30,
      select: {
        id: true,
        name: true,
        brand: true,
        category: true,
        skinType: true,
        benefits: true,
        price: true,
        compareAtPrice: true,
        image: true,
      },
    });

    const currentLite = toProductLite(current);
    const catalogLite = catalogRaw.map(toProductLite);

    const recommendations = getRecommendations(currentLite, catalogLite, limit);

    return NextResponse.json(recommendations, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error: unknown) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json([], { status: 500 });
  }
}
