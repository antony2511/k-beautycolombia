#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

const products = [
  {
    name: 'Ginseng Essence Water',
    brand: 'Beauty of Joseon',
    price: 85000,
    compareAtPrice: 95000,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
    ],
    badge: 'Bestseller',
    badgeType: 'bestseller',
    category: 'hidratacion',
    description: 'Essence hidratante con ginseng que revitaliza y nutre la piel, mejorando su elasticidad y luminosidad natural.',
    benefits: [
      'Hidratación profunda',
      'Mejora la elasticidad',
      'Revitaliza la piel',
      'Ilumina el rostro',
    ],
    ingredients: ['Ginseng Extract 80%', 'Niacinamide', 'Adenosine'],
    howToUse: [
      'Después de la limpieza, aplica sobre el rostro',
      'Da palmaditas suaves para absorción',
      'Continúa con tu rutina de skincare',
    ],
    skinType: ['Normal', 'Seca', 'Mixta'],
    stock: 50,
    isActive: true,
  },
  {
    name: 'Advanced Snail 96 Mucin Power Essence',
    brand: 'COSRX',
    price: 98000,
    compareAtPrice: 110000,
    image: 'https://images.unsplash.com/photo-1556228852-80a39e5e6a61?w=400',
    images: [
      'https://images.unsplash.com/photo-1556228852-80a39e5e6a61?w=400',
    ],
    badge: 'Top Ventas',
    badgeType: 'top',
    category: 'hidratacion',
    description: 'Esencia con 96% de mucina de caracol que repara, hidrata y mejora la textura de la piel.',
    benefits: [
      'Reparación de piel dañada',
      'Hidratación intensa',
      'Mejora textura',
      'Reduce cicatrices',
    ],
    ingredients: ['Snail Secretion Filtrate 96%', 'Betaine', 'Allantoin'],
    howToUse: [
      'Aplicar después del tónico',
      'Extender suavemente por rostro y cuello',
      'Dejar absorber completamente',
    ],
    skinType: ['Todo tipo de piel'],
    stock: 35,
    isActive: true,
  },
  {
    name: 'Water Sleeping Mask',
    brand: 'Laneige',
    price: 145000,
    image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400',
    badge: 'Nuevo',
    badgeType: 'new',
    category: 'hidratacion',
    description: 'Mascarilla nocturna que hidrata intensamente mientras duermes, dejando la piel radiante al despertar.',
    benefits: [
      'Hidratación nocturna',
      'Piel radiante',
      'Textura gel refrescante',
      'Aroma relajante',
    ],
    ingredients: ['Hydro Ionized Mineral Water', 'Apricot Extract', 'Evening Primrose Root Extract'],
    howToUse: [
      'Usar como último paso de rutina nocturna',
      'Aplicar capa generosa',
      'Dejar actuar toda la noche',
      'Enjuagar por la mañana',
    ],
    skinType: ['Todo tipo de piel'],
    stock: 20,
    isActive: true,
  },
  {
    name: 'Dark Spot Correcting Glow Serum',
    brand: 'Axis-Y',
    price: 72000,
    image: 'https://images.unsplash.com/photo-1570194065650-d99fb4b3a68b?w=400',
    badge: '20% OFF',
    badgeType: 'discount',
    category: 'tratamiento',
    description: 'Sérum iluminador que reduce manchas oscuras y unifica el tono de la piel.',
    benefits: [
      'Reduce manchas oscuras',
      'Unifica el tono',
      'Ilumina la piel',
      'Textura ligera',
    ],
    ingredients: ['Niacinamide 5%', 'Plant-derived Squalane', 'Papaya Extract'],
    howToUse: [
      'Aplicar después del tónico',
      '2-3 gotas en rostro',
      'Masajear suavemente hasta absorber',
    ],
    skinType: ['Todo tipo de piel', 'Piel con manchas'],
    stock: 40,
    isActive: true,
  },
  {
    name: 'Green Tea Seed Serum',
    brand: 'Innisfree',
    price: 110500,
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400',
    category: 'hidratacion',
    description: 'Sérum antioxidante con té verde que hidrata y protege la piel del daño ambiental.',
    benefits: [
      'Alto poder antioxidante',
      'Hidratación duradera',
      'Protección ambiental',
      'Fortalece la barrera cutánea',
    ],
    ingredients: ['Green Tea Extract from Jeju', 'Green Tea Seed Oil', 'Camellia Extract'],
    howToUse: [
      'Después del tónico',
      'Aplicar 2-3 bombeos',
      'Distribuir uniformemente',
    ],
    skinType: ['Normal', 'Mixta', 'Grasa'],
    stock: 25,
    isActive: true,
  },
  {
    name: 'Low pH Good Morning Gel Cleanser',
    brand: 'COSRX',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
    category: 'limpieza',
    description: 'Limpiador gel suave con pH balanceado que limpia sin resecar, ideal para uso diario.',
    benefits: [
      'pH balanceado (5.0-6.0)',
      'Limpieza suave',
      'No reseca',
      'Apto para piel sensible',
    ],
    ingredients: ['Tea Tree Oil', 'BHA', 'Allantoin'],
    howToUse: [
      'Usar en la mañana o noche',
      'Aplicar sobre rostro húmedo',
      'Masajear suavemente',
      'Enjuagar con agua tibia',
    ],
    skinType: ['Todo tipo de piel', 'Piel sensible'],
    stock: 60,
    isActive: true,
  },
];

async function seedProducts() {
  console.log('🌱 Iniciando seed de productos en MySQL...\n');

  try {
    // Limpiar productos existentes
    await prisma.product.deleteMany({});
    console.log('✅ Productos anteriores eliminados\n');

    let successCount = 0;

    for (const product of products) {
      try {
        await prisma.product.create({
          data: product,
        });
        console.log(`✅ Creado: ${product.name} (${product.brand})`);
        successCount++;
      } catch (error: any) {
        console.error(`❌ Error creando ${product.name}:`, error.message);
      }
    }

    console.log(`\n🎉 Seed completado: ${successCount}/${products.length} productos creados`);
  } catch (error: any) {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

seedProducts();
