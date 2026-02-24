import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateBestsellers() {
  try {
    console.log('Actualizando productos bestsellers...');

    // Actualizar productos específicos para que sean bestsellers
    const updates = [
      {
        id: 'cmlzcsca40001g4xs88yba1it', // Advanced Snail 96 Mucin Power Essence
        badge: 'Bestseller',
        badgeType: 'bestseller',
      },
      {
        id: 'cmlzcscac0002g4xs0dl9dlzh', // Water Sleeping Mask
        badge: 'Bestseller',
        badgeType: 'bestseller',
      },
      {
        id: 'cmlzcscax0005g4xsrygq7yar', // Low pH Good Morning Gel Cleanser
        badge: 'Bestseller',
        badgeType: 'bestseller',
      },
    ];

    for (const update of updates) {
      await prisma.product.update({
        where: { id: update.id },
        data: {
          badge: update.badge,
          badgeType: update.badgeType,
        },
      });
      console.log(`✓ Actualizado: ${update.id}`);
    }

    console.log('\n✅ Productos bestsellers actualizados correctamente!');
    console.log(`Total bestsellers: 4 productos`);
  } catch (error) {
    console.error('❌ Error actualizando bestsellers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateBestsellers();
