import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Configurar revalidación automática cada 60 segundos
export const revalidate = 60;

export async function GET() {
  try {
    // Obtener todas las categorías únicas
    const categories = await prisma.product.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ['category'],
    });

    // Obtener todas las marcas únicas
    const brands = await prisma.product.findMany({
      where: { isActive: true },
      select: { brand: true },
      distinct: ['brand'],
    });

    // Obtener rango de precios
    const priceRange = await prisma.product.aggregate({
      where: { isActive: true },
      _min: { price: true },
      _max: { price: true },
    });

    // Obtener tipos de piel únicos usando raw query para MySQL
    const productsWithSkinType = await prisma.$queryRaw<Array<{ skinType: any }>>`
      SELECT skinType FROM Product
      WHERE isActive = 1 AND skinType IS NOT NULL
    `;

    const skinTypes = new Set<string>();
    productsWithSkinType.forEach((product) => {
      try {
        let skinTypeData = product.skinType;
        // Si viene como string, parsearlo
        if (typeof skinTypeData === 'string') {
          skinTypeData = JSON.parse(skinTypeData);
        }
        if (Array.isArray(skinTypeData)) {
          skinTypeData.forEach((type: string) => skinTypes.add(type));
        }
      } catch (error) {
        console.error('Error parsing skinType:', error);
      }
    });

    return NextResponse.json({
      categories: categories
        .map((p) => p.category)
        .filter(Boolean)
        .sort(),
      brands: brands
        .map((p) => p.brand)
        .filter(Boolean)
        .sort(),
      priceRange: {
        min: priceRange._min.price || 0,
        max: priceRange._max.price || 200000,
      },
      skinTypes: Array.from(skinTypes).sort(),
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error: any) {
    console.error('Error fetching filters:', error);
    return NextResponse.json(
      { error: 'Error al obtener filtros', details: error.message },
      { status: 500 }
    );
  }
}
