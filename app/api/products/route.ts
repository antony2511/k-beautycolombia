import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Configurar revalidación automática cada 60 segundos
export const revalidate = 60;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Filtros
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const skinType = searchParams.get('skinType');

    // Ordenamiento
    const sortBy = searchParams.get('sortBy') || 'newest';

    // Si hay filtro de tipo de piel, usar raw query
    if (skinType) {
      return await handleSkinTypeFilter(
        category,
        brand,
        minPrice,
        maxPrice,
        search,
        skinType,
        sortBy
      );
    }

    // Construir filtros dinámicamente
    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    // Filtro por categoría
    if (category && category !== 'todos') {
      where.category = category;
    }

    // Filtro por marca
    if (brand) {
      where.brand = brand;
    }

    // Filtro por rango de precio
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // Búsqueda por nombre o descripción
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Configurar ordenamiento
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };

    switch (sortBy) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'name_asc':
        orderBy = { name: 'asc' };
        break;
      case 'name_desc':
        orderBy = { name: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
    });

    // Agregar headers de caché
    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos', details: error.message },
      { status: 500 }
    );
  }
}

// Función auxiliar para manejar filtro de tipo de piel con raw query
async function handleSkinTypeFilter(
  category: string | null,
  brand: string | null,
  minPrice: string | null,
  maxPrice: string | null,
  search: string | null,
  skinType: string,
  sortBy: string
) {
  // Construir condiciones WHERE
  const conditions: string[] = ['isActive = 1'];
  const params: any[] = [];

  // JSON_CONTAINS para skinType
  conditions.push('JSON_CONTAINS(skinType, ?)');
  params.push(JSON.stringify(skinType));

  if (category && category !== 'todos') {
    conditions.push('category = ?');
    params.push(category);
  }

  if (brand) {
    conditions.push('brand = ?');
    params.push(brand);
  }

  if (minPrice) {
    conditions.push('price >= ?');
    params.push(parseFloat(minPrice));
  }

  if (maxPrice) {
    conditions.push('price <= ?');
    params.push(parseFloat(maxPrice));
  }

  if (search) {
    conditions.push('(name LIKE ? OR description LIKE ? OR brand LIKE ?)');
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }

  // Construir ORDER BY
  let orderByClause = 'createdAt DESC';
  switch (sortBy) {
    case 'price_asc':
      orderByClause = 'price ASC';
      break;
    case 'price_desc':
      orderByClause = 'price DESC';
      break;
    case 'name_asc':
      orderByClause = 'name ASC';
      break;
    case 'name_desc':
      orderByClause = 'name DESC';
      break;
    case 'newest':
      orderByClause = 'createdAt DESC';
      break;
    case 'oldest':
      orderByClause = 'createdAt ASC';
      break;
  }

  const whereClause = conditions.join(' AND ');
  const query = `SELECT * FROM Product WHERE ${whereClause} ORDER BY ${orderByClause}`;

  const products = await prisma.$queryRawUnsafe(query, ...params);

  return NextResponse.json(products, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
    },
  });
}
