#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function testSkinType() {
  console.log('🧪 Testing skinType filter...\n');

  try {
    // 1. Ver productos con skinType
    console.log('1️⃣ Productos con skinType:');
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { id: true, name: true, skinType: true },
      take: 3,
    });

    products.forEach((p) => {
      console.log(`  - ${p.name}: ${JSON.stringify(p.skinType)}`);
    });

    // 2. Probar raw query con JSON_CONTAINS
    console.log('\n2️⃣ Productos para piel Normal (raw query):');
    const normalSkinProducts = await prisma.$queryRawUnsafe(`
      SELECT id, name, skinType
      FROM Product
      WHERE isActive = 1 AND JSON_CONTAINS(skinType, ?)
      LIMIT 3
    `, JSON.stringify('Normal'));

    console.log('Resultados:', normalSkinProducts);

    // 3. Obtener todos los tipos de piel únicos
    console.log('\n3️⃣ Tipos de piel únicos:');
    const allProducts = await prisma.$queryRaw<Array<{ skinType: any }>>`
      SELECT skinType FROM Product
      WHERE isActive = 1 AND skinType IS NOT NULL
    `;

    const skinTypes = new Set<string>();
    allProducts.forEach((product) => {
      try {
        let skinTypeData = product.skinType;
        if (typeof skinTypeData === 'string') {
          skinTypeData = JSON.parse(skinTypeData);
        }
        if (Array.isArray(skinTypeData)) {
          skinTypeData.forEach((type: string) => skinTypes.add(type));
        }
      } catch (error) {
        console.error('Error parsing:', error);
      }
    });

    console.log('Tipos encontrados:', Array.from(skinTypes));

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testSkinType();
