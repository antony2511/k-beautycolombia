export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  images?: string[];
  badge?: string;
  badgeType?: 'bestseller' | 'new' | 'discount' | 'top';
  category?: string;
  description?: string;
  benefits?: string[];
  ingredients?: string[];
  howToUse?: string[];
  skinType?: string[];
  stock?: number;
  created_at?: string;
  updated_at?: string;
}

export const products: Product[] = [
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
    description: 'Una esencia hidratante enriquecida con extracto de ginseng que revitaliza y nutre la piel, mejorando su textura y luminosidad.',
    benefits: [
      'Hidratación profunda y duradera',
      'Mejora la elasticidad de la piel',
      'Reduce líneas finas y arrugas',
      'Aporta luminosidad natural',
      'Revitaliza pieles cansadas',
    ],
    ingredients: [
      'Extracto de Ginseng (80%)',
      'Niacinamida',
      'Adenosina',
      'Ácido Hialurónico',
    ],
    howToUse: [
      'Después de la limpieza, aplica tónico',
      'Dispensa 2-3 gotas en las palmas',
      'Presiona suavemente sobre el rostro',
      'Continúa con sérum y crema',
    ],
    skinType: ['Piel Seca', 'Piel Mixta', 'Sensible'],
  },
  {
    id: '2',
    name: 'Advanced Snail 96 Mucin',
    brand: 'COSRX',
    price: 98000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWuoEkwHBXi9M-TbWUjcRqLiYjABAfD9exPfiNpFHPykBkfX14ANbiC9ML9dKlsLxdCQ5bL5DXqLy8V0H1kUyKkbRTgOf1ScK3bFW7Dl-mEZfq1fpPkIX60NSuFdUp3nXs1IarMMOmeKmJ8RFtlY5dYc_pkL5MnXE96q2X1o8wpcTxCH8G-2OszNrYT-9CSF12DdfCabm5uuz9_4DmWh4lUWNSkc4N8cItruVEhexZzVe0F4V-2yUmYzhhntb-KQRE5fdi6fFXGhex',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBWuoEkwHBXi9M-TbWUjcRqLiYjABAfD9exPfiNpFHPykBkfX14ANbiC9ML9dKlsLxdCQ5bL5DXqLy8V0H1kUyKkbRTgOf1ScK3bFW7Dl-mEZfq1fpPkIX60NSuFdUp3nXs1IarMMOmeKmJ8RFtlY5dYc_pkL5MnXE96q2X1o8wpcTxCH8G-2OszNrYT-9CSF12DdfCabm5uuz9_4DmWh4lUWNSkc4N8cItruVEhexZzVe0F4V-2yUmYzhhntb-KQRE5fdi6fFXGhex',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDJA_YnVNnsRPxzUp0Iwv69VgBUGt6sswBkHIvQ1lDnV-KpVTd9dpZnvL-xDHjKRl8b8xIWn61TEttWJ4AJUNQCODRVS9WoTG7L0AMIu335H_htRPjLxxXZ274_XN3Y9GtHgdp5uh3GG8fJ8tH8IfPTy3zkY2_2sAsAnMf3S6R5sIFjKUgKQIxRmU8yn7iD0I__kYDoxPiRYa9svwHIa2YRJruf4tuSp796sGzV7y365lCqO7ba93O2KlWvCBgRnroUloXoyWyVqdom',
    ],
    category: 'hidratacion',
    description: 'Esencia con 96% de mucina de caracol que repara, hidrata y mejora la textura de la piel.',
    benefits: [
      'Reparación intensiva de la piel',
      'Hidratación profunda',
      'Mejora cicatrices y marcas de acné',
      'Textura ligera y absorbente',
    ],
    ingredients: [
      'Filtrado de Secreción de Caracol (96%)',
      'Pantenol',
      'Arginina',
    ],
    howToUse: [
      'Aplica después del tónico',
      'Usa 2-3 gotas en rostro limpio',
      'Palmea suavemente hasta absorber',
      'Sigue con crema hidratante',
    ],
    skinType: ['Piel Grasa', 'Piel Mixta', 'Piel Seca'],
  },
  {
    id: '3',
    name: 'Water Sleeping Mask',
    brand: 'Laneige',
    price: 145000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8SQ4xYN-3uUVfEYRYYWZ_x8-kf4FAq5KH5tuJs2pvpAZekfvYjV7APxeytq4X-YgMTDfSDkCuUYdojINDjmJfsLAq4psvmsUI1Ks9dYYfsGn5IKV08nAymFVbdfx1DGLyMPaIwmgozpcUpkHx0wwyqOFgQyXKpMkKxwFuGX7ZIavBoOIB0v2V0M6tO9hUmBUPyoDcUrh0kQmZNQ5D6UMPpHkiuWk037KKgaLDeuaUABcrEODMR_HdiYiRNWk7rvZ7GHjzhJOP93y0',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC8SQ4xYN-3uUVfEYRYYWZ_x8-kf4FAq5KH5tuJs2pvpAZekfvYjV7APxeytq4X-YgMTDfSDkCuUYdojINDjmJfsLAq4psvmsUI1Ks9dYYfsGn5IKV08nAymFVbdfx1DGLyMPaIwmgozpcUpkHx0wwyqOFgQyXKpMkKxwFuGX7ZIavBoOIB0v2V0M6tO9hUmBUPyoDcUrh0kQmZNQ5D6UMPpHkiuWk037KKgaLDeuaUABcrEODMR_HdiYiRNWk7rvZ7GHjzhJOP93y0',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBimlT7gZCo3SlamT5DbqiomdEn9RO-ghSDEHtPP5sSyAcGT55BLs6_AY_dNUuFrx8VJbYdm-taRl7yj-HLLHehmC1troBnM06Eq-s0SeVl4rLaIqSRBSaIBMP6hDOUiNmuQ5tUUfFOhUeIOMlrWwEbCI2y7iP1ERZBPjWUQN63_uQ4A0wGVtBlfg9164Ht2jmi1r5kpXTGopuFQHYomb_VowJ6IdvvttqMQtsTBnLYAU_YxEVBvSuYEtj7zD1CtR9DymA-Rv6oiXyP',
    ],
    badge: 'Nuevo',
    badgeType: 'new',
    category: 'hidratacion',
    description: 'Mascarilla nocturna ultra hidratante que trabaja mientras duermes para revelar una piel radiante por la mañana.',
    benefits: [
      'Hidratación intensa durante la noche',
      'Piel más luminosa al despertar',
      'Textura gel refrescante',
      'Fortalece la barrera cutánea',
    ],
    ingredients: [
      'Complejo Hydro Ionized Mineral Water',
      'Extracto de Té Verde',
      'Extracto de Castaña',
      'Ácido Hialurónico',
    ],
    howToUse: [
      'Aplica como último paso de rutina nocturna',
      'Extiende generosamente sobre el rostro',
      'Deja actuar toda la noche',
      'Enjuaga con agua tibia por la mañana',
    ],
    skinType: ['Piel Seca', 'Piel Mixta', 'Sensible'],
  },
  {
    id: '4',
    name: 'Dark Spot Glow Serum',
    brand: 'Axis-Y',
    price: 72000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBimlT7gZCo3SlamT5DbqiomdEn9RO-ghSDEHtPP5sSyAcGT55BLs6_AY_dNUuFrx8VJbYdm-taRl7yj-HLLHehmC1troBnM06Eq-s0SeVl4rLaIqSRBSaIBMP6hDOUiNmuQ5tUUfFOhUeIOMlrWwEbCI2y7iP1ERZBPjWUQN63_uQ4A0wGVtBlfg9164Ht2jmi1r5kpXTGopuFQHYomb_VowJ6IdvvttqMQtsTBnLYAU_YxEVBvSuYEtj7zD1CtR9DymA-Rv6oiXyP',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBimlT7gZCo3SlamT5DbqiomdEn9RO-ghSDEHtPP5sSyAcGT55BLs6_AY_dNUuFrx8VJbYdm-taRl7yj-HLLHehmC1troBnM06Eq-s0SeVl4rLaIqSRBSaIBMP6hDOUiNmuQ5tUUfFOhUeIOMlrWwEbCI2y7iP1ERZBPjWUQN63_uQ4A0wGVtBlfg9164Ht2jmi1r5kpXTGopuFQHYomb_VowJ6IdvvttqMQtsTBnLYAU_YxEVBvSuYEtj7zD1CtR9DymA-Rv6oiXyP',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAWr7IlzFs3PB_PosWJ6a4l_OaGaUsTml-SZCpmC4CoPTBA8pNm1tIZA17IJnG9pZ8VKM-0KKcrdcejc9O0d3yfDMK1mZIp8obG0t7YwiOwgz5DMHjo_bJgJvkNu4nBd06UwCro9mIRBgdfjd6sQrKs9FmJhvgstVrzkyLqapaeQVovScEAMG19ETohK1ZgTN91xhMa6rKs5im3lYVAgiqRgGe2hCNs4RyMy5oAM_I0bzogbfuMMla8zrZctukXeJIrUSxCOLWbH0UU',
    ],
    category: 'tratamiento',
    description: 'Sérum iluminador que reduce manchas oscuras y mejora el tono de la piel de forma natural.',
    benefits: [
      'Reduce manchas y pigmentación',
      'Unifica el tono de la piel',
      'Aporta luminosidad instantánea',
      'Fórmula vegana y natural',
    ],
    ingredients: [
      'Extracto de Papaya',
      'Niacinamida',
      'Extracto de Saúco',
      'Vitamina C',
    ],
    howToUse: [
      'Aplica después del tónico',
      'Distribuye uniformemente en el rostro',
      'Concentra en áreas con manchas',
      'Usa protector solar durante el día',
    ],
    skinType: ['Piel Grasa', 'Piel Mixta', 'Sensible'],
  },
  {
    id: '5',
    name: 'Green Tea Seed Serum',
    brand: 'Innisfree',
    price: 110500,
    compareAtPrice: 130000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWr7IlzFs3PB_PosWJ6a4l_OaGaUsTml-SZCpmC4CoPTBA8pNm1tIZA17IJnG9pZ8VKM-0KKcrdcejc9O0d3yfDMK1mZIp8obG0t7YwiOwgz5DMHjo_bJgJvkNu4nBd06UwCro9mIRBgdfjd6sQrKs9FmJhvgstVrzkyLqapaeQVovScEAMG19ETohK1ZgTN91xhMa6rKs5im3lYVAgiqRgGe2hCNs4RyMy5oAM_I0bzogbfuMMla8zrZctukXeJIrUSxCOLWbH0UU',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAWr7IlzFs3PB_PosWJ6a4l_OaGaUsTml-SZCpmC4CoPTBA8pNm1tIZA17IJnG9pZ8VKM-0KKcrdcejc9O0d3yfDMK1mZIp8obG0t7YwiOwgz5DMHjo_bJgJvkNu4nBd06UwCro9mIRBgdfjd6sQrKs9FmJhvgstVrzkyLqapaeQVovScEAMG19ETohK1ZgTN91xhMa6rKs5im3lYVAgiqRgGe2hCNs4RyMy5oAM_I0bzogbfuMMla8zrZctukXeJIrUSxCOLWbH0UU',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAkny5X6o0lPHUapDn2LfglaBnNRmvI71jMcEAnbZAp0_LSsi5J5LW1gVyF1UfKb1ekSBDM33--_rF-8J9iY7XssQcejCXQfYrbRWFOBY5z1yCal7XRQw67EHbr4zvvrvgN_bNIEkFs3-hwaPmJmD3fhJMGihLzgulWwkNyvi5g_q78xGKZctlHBW_m33Y0nkXlh2I1J0ypU_jLHPnac_-yCeNjgG404iqbk7o1Gs-ToMpwBS6aZmsYaeSWTT_2Xq3a7rDS_f5G2h5n',
    ],
    badge: '-15%',
    badgeType: 'discount',
    category: 'hidratacion',
    description: 'Sérum hidratante con semilla de té verde de Jeju que refresca y revitaliza la piel.',
    benefits: [
      'Hidratación ligera y fresca',
      'Control de oleosidad',
      'Rico en antioxidantes',
      'Piel más suave y tersa',
    ],
    ingredients: [
      'Extracto de Semilla de Té Verde (80%)',
      'Aceite de Semilla de Té Verde',
      'Extracto de Hoja de Té Verde',
      'Pantenol',
    ],
    howToUse: [
      'Aplica después de la limpieza y tónico',
      'Distribuye 2-3 gotas en el rostro',
      'Masajea suavemente hasta absorber',
      'Continúa con crema hidratante',
    ],
    skinType: ['Piel Grasa', 'Piel Mixta', 'Sensible'],
  },
  {
    id: '6',
    name: 'Low pH Good Morning Gel',
    brand: 'COSRX',
    price: 55000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkny5X6o0lPHUapDn2LfglaBnNRmvI71jMcEAnbZAp0_LSsi5J5LW1gVyF1UfKb1ekSBDM33--_rF-8J9iY7XssQcejCXQfYrbRWFOBY5z1yCal7XRQw67EHbr4zvvrvgN_bNIEkFs3-hwaPmJmD3fhJMGihLzgulWwkNyvi5g_q78xGKZctlHBW_m33Y0nkXlh2I1J0ypU_jLHPnac_-yCeNjgG404iqbk7o1Gs-ToMpwBS6aZmsYaeSWTT_2Xq3a7rDS_f5G2h5n',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAkny5X6o0lPHUapDn2LfglaBnNRmvI71jMcEAnbZAp0_LSsi5J5LW1gVyF1UfKb1ekSBDM33--_rF-8J9iY7XssQcejCXQfYrbRWFOBY5z1yCal7XRQw67EHbr4zvvrvgN_bNIEkFs3-hwaPmJmD3fhJMGihLzgulWwkNyvi5g_q78xGKZctlHBW_m33Y0nkXlh2I1J0ypU_jLHPnac_-yCeNjgG404iqbk7o1Gs-ToMpwBS6aZmsYaeSWTT_2Xq3a7rDS_f5G2h5n',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBWuoEkwHBXi9M-TbWUjcRqLiYjABAfD9exPfiNpFHPykBkfX14ANbiC9ML9dKlsLxdCQ5bL5DXqLy8V0H1kUyKkbRTgOf1ScK3bFW7Dl-mEZfq1fpPkIX60NSuFdUp3nXs1IarMMOmeKmJ8RFtlY5dYc_pkL5MnXE96q2X1o8wpcTxCH8G-2OszNrYT-9CSF12DdfCabm5uuz9_4DmWh4lUWNSkc4N8cItruVEhexZzVe0F4V-2yUmYzhhntb-KQRE5fdi6fFXGhex',
    ],
    category: 'limpieza',
    description: 'Gel limpiador de pH bajo que limpia suavemente sin resecar, ideal para uso diario.',
    benefits: [
      'Limpieza suave y efectiva',
      'Mantiene el pH natural de la piel',
      'No reseca ni irrita',
      'Controla el exceso de grasa',
    ],
    ingredients: [
      'Ácido Salicílico (BHA)',
      'Aceite de Árbol de Té',
      'Extracto de Corteza de Sauce',
      'Betaína Salicilato',
    ],
    howToUse: [
      'Humedece el rostro con agua tibia',
      'Aplica pequeña cantidad en las manos',
      'Masajea suavemente en movimientos circulares',
      'Enjuaga abundantemente',
    ],
    skinType: ['Piel Grasa', 'Piel Mixta', 'Sensible'],
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getRelatedProducts(
  currentProductId: string,
  limit: number = 4
): Product[] {
  return products
    .filter((product) => product.id !== currentProductId)
    .slice(0, limit);
}

export function getBestSellers(limit: number = 4): Product[] {
  return products
    .filter((product) => product.badgeType === 'bestseller')
    .concat(products.filter((product) => product.badgeType !== 'bestseller'))
    .slice(0, limit);
}
