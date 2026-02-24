/**
 * INSTRUCCIONES:
 * 1. Ve a: https://console.firebase.google.com/project/k-beauty-30ea2/firestore/data
 * 2. Abre la consola del navegador (F12 o Ctrl+Shift+I)
 * 3. Copia y pega TODO este código
 * 4. Presiona Enter
 * 5. Los productos se crearán automáticamente
 */

const products = [
  {
    id: '1',
    name: 'Ginseng Essence Water',
    brand: 'Beauty of Joseon',
    price: 85000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJA_YnVNnsRPxzUp0Iwv69VgBUGt6sswBkHIvQ1lDnV-KpVTd9dpZnvL-xDHjKRl8b8xIWn61TEttWJ4AJUNQCODRVS9WoTG7L0AMIu335H_htRPjLxxXZ274_XN3Y9GtHgdp5uh3GG8fJ8tH8IfPTy3zkY2_2sAsAnMf3S6R5sIFjKUgKQIxRmU8yn7iD0I__kYDoxPiRYa9svwHIa2YRJruf4tuSp796sGzV7y365lCqO7ba93O2KlWvCBgRnroUloXoyWyVqdom',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDJA_YnVNnsRPxzUp0Iwv69VgBUGt6sswBkHIvQ1lDnV-KpVTd9dpZnvL-xDHjKRl8b8xIWn61TEttWJ4AJUNQCODRVS9WoTG7L0AMIu335H_htRPjLxxXZ274_XN3Y9GtHgdp5uh3GG8fJ8tH8IfPTy3zkY2_2sAsAnMf3S6R5sIFjKUgKQIxRmU8yn7iD0I__kYDoxPiRYa9svwHIa2YRJruf4tuSp796sGzV7y365lCqO7ba93O2KlWvCBgRnroUloXoyWyVqdom',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBWuoEkwHBXi9M-TbWUjcRqLiYjABAfD9exPfiNpFHPykBkfX14ANbiC9ML9dKlsLxdCQ5bL5DXqLy8V0H1kUyKkbRTgOf1ScK3bFW7Dl-mEZfq1fpPkIX60NSuFdUp3nXs1IarMMOmeKmJ8RFtlY5dYc_pkL5MnXE96q2X1o8wpcTxCH8G-2OszNrYT-9CSF12DdfCabm5uuz9_4DmWh4lUWNSkc4N8cItruVEhexZzVe0F4V-2yUmYzhhntb-KQRE5fdi6fFXGhex',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC8SQ4xYN-3uUVfEYRYYWZ_x8-kf4FAq5KH5tuJs2pvpAZekfvYjV7APxeytq4X-YgMTDfSDkCuUYdojINDjmJfsLAq4psvmsUI1Ks9dYYfsGn5IKV08nAymFVbdfx1DGLyMPaIwmgozpcUpkHx0wwyqOFgQyXKpMkKxwFuGX7ZIavBoOIB0v2V0M6tO9hUmBUPyoDcUrh0kQmZNQ5D6UMPpHkiuWk037KKgaLDeuaUABcrEODMR_HdiYiRNWk7rvZ7GHjzhJOP93y0',
    ],
    badge: 'Best Seller',
    badgeType: 'bestseller',
    category: 'hidratacion',
    stock: 50,
    description: 'Una esencia hidratante enriquecida con extracto de ginseng que revitaliza y nutre la piel.',
    benefits: ['Hidratación profunda', 'Mejora la elasticidad', 'Reduce líneas finas'],
    ingredients: ['Extracto de Ginseng (80%)', 'Niacinamida', 'Adenosina'],
    howToUse: ['Después de la limpieza', 'Aplica 2-3 gotas', 'Presiona suavemente'],
    skinType: ['Piel Seca', 'Piel Mixta', 'Sensible'],
  },
  {
    id: '2',
    name: 'Advanced Snail 96 Mucin',
    brand: 'COSRX',
    price: 98000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWuoEkwHBXi9M-TbWUjcRqLiYjABAfD9exPfiNpFHPykBkfX14ANbiC9ML9dKlsLxdCQ5bL5DXqLy8V0H1kUyKkbRTgOf1ScK3bFW7Dl-mEZfq1fpPkIX60NSuFdUp3nXs1IarMMOmeKmJ8RFtlY5dYc_pkL5MnXE96q2X1o8wpcTxCH8G-2OszNrYT-9CSF12DdfCabm5uuz9_4DmWh4lUWNSkc4N8cItruVEhexZzVe0F4V-2yUmYzhhntb-KQRE5fdi6fFXGhex',
    category: 'hidratacion',
    stock: 35,
    description: 'Esencia con 96% de mucina de caracol que repara, hidrata y mejora la textura de la piel.',
  },
  {
    id: '3',
    name: 'Water Sleeping Mask',
    brand: 'Laneige',
    price: 145000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8SQ4xYN-3uUVfEYRYYWZ_x8-kf4FAq5KH5tuJs2pvpAZekfvYjV7APxeytq4X-YgMTDfSDkCuUYdojINDjmJfsLAq4psvmsUI1Ks9dYYfsGn5IKV08nAymFVbdfx1DGLyMPaIwmgozpcUpkHx0wwyqOFgQyXKpMkKxwFuGX7ZIavBoOIB0v2V0M6tO9hUmBUPyoDcUrh0kQmZNQ5D6UMPpHkiuWk037KKgaLDeuaUABcrEODMR_HdiYiRNWk7rvZ7GHjzhJOP93y0',
    badge: 'Nuevo',
    badgeType: 'new',
    category: 'hidratacion',
    stock: 20,
    description: 'Mascarilla nocturna ultra hidratante que trabaja mientras duermes.',
  },
  {
    id: '4',
    name: 'Dark Spot Glow Serum',
    brand: 'Axis-Y',
    price: 72000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBimlT7gZCo3SlamT5DbqiomdEn9RO-ghSDEHtPP5sSyAcGT55BLs6_AY_dNUuFrx8VJbYdm-taRl7yj-HLLHehmC1troBnM06Eq-s0SeVl4rLaIqSRBSaIBMP6hDOUiNmuQ5tUUfFOhUeIOMlrWwEbCI2y7iP1ERZBPjWUQN63_uQ4A0wGVtBlfg9164Ht2jmi1r5kpXTGopuFQHYomb_VowJ6IdvvttqMQtsTBnLYAU_YxEVBvSuYEtj7zD1CtR9DymA-Rv6oiXyP',
    category: 'tratamiento',
    stock: 40,
    description: 'Sérum iluminador que reduce manchas oscuras y mejora el tono de la piel.',
  },
  {
    id: '5',
    name: 'Green Tea Seed Serum',
    brand: 'Innisfree',
    price: 110500,
    compareAtPrice: 130000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWr7IlzFs3PB_PosWJ6a4l_OaGaUsTml-SZCpmC4CoPTBA8pNm1tIZA17IJnG9pZ8VKM-0KKcrdcejc9O0d3yfDMK1mZIp8obG0t7YwiOwgz5DMHjo_bJgJvkNu4nBd06UwCro9mIRBgdfjd6sQrKs9FmJhvgstVrzkyLqapaeQVovScEAMG19ETohK1ZgTN91xhMa6rKs5im3lYVAgiqRgGe2hCNs4RyMy5oAM_I0bzogbfuMMla8zrZctukXeJIrUSxCOLWbH0UU',
    badge: '-15%',
    badgeType: 'discount',
    category: 'hidratacion',
    stock: 25,
    description: 'Sérum hidratante con semilla de té verde de Jeju que refresca y revitaliza.',
  },
  {
    id: '6',
    name: 'Low pH Good Morning Gel',
    brand: 'COSRX',
    price: 55000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkny5X6o0lPHUapDn2LfglaBnNRmvI71jMcEAnbZAp0_LSsi5J5LW1gVyF1UfKb1ekSBDM33--_rF-8J9iY7XssQcejCXQfYrbRWFOBY5z1yCal7XRQw67EHbr4zvvrvgN_bNIEkFs3-hwaPmJmD3fhJMGihLzgulWwkNyvi5g_q78xGKZctlHBW_m33Y0nkXlh2I1J0ypU_jLHPnac_-yCeNjgG404iqbk7o1Gs-ToMpwBS6aZmsYaeSWTT_2Xq3a7rDS_f5G2h5n',
    category: 'limpieza',
    stock: 60,
    description: 'Gel limpiador de pH bajo que limpia suavemente sin resecar.',
  },
];

console.log('🌱 Iniciando creación de productos en Firestore...');

// Espera a que Firebase esté cargado
setTimeout(async () => {
  try {
    // Accede a Firestore desde la página de Firebase Console
    const db = firebase.firestore();

    for (const product of products) {
      const { id, ...data } = product;

      await db.collection('products').doc(id).set({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      console.log(`✅ Producto creado: ${product.name} (ID: ${id})`);
    }

    console.log(`\n🎉 ¡Completado! ${products.length} productos creados en Firestore.`);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}, 1000);
