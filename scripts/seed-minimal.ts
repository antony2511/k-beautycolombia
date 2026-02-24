#!/usr/bin/env tsx

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const products = [
  {
    name: 'Ginseng Essence Water',
    brand: 'Beauty of Joseon',
    price: 85000,
    stock: 50,
    category: 'hidratacion',
    image: 'https://via.placeholder.com/400',
  },
  {
    name: 'Advanced Snail 96 Mucin',
    brand: 'COSRX',
    price: 98000,
    stock: 35,
    category: 'hidratacion',
    image: 'https://via.placeholder.com/400',
  },
  {
    name: 'Water Sleeping Mask',
    brand: 'Laneige',
    price: 145000,
    stock: 20,
    category: 'hidratacion',
    image: 'https://via.placeholder.com/400',
  },
  {
    name: 'Dark Spot Glow Serum',
    brand: 'Axis-Y',
    price: 72000,
    stock: 40,
    category: 'tratamiento',
    image: 'https://via.placeholder.com/400',
  },
  {
    name: 'Green Tea Seed Serum',
    brand: 'Innisfree',
    price: 110500,
    stock: 25,
    category: 'hidratacion',
    image: 'https://via.placeholder.com/400',
  },
  {
    name: 'Low pH Good Morning Gel',
    brand: 'COSRX',
    price: 55000,
    stock: 60,
    category: 'limpieza',
    image: 'https://via.placeholder.com/400',
  },
];

async function seedProducts() {
  console.log('🌱 Iniciando seed MINIMALISTA...\n');

  try {
    let successCount = 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const productId = String(i + 1);

      console.log(`Creando producto ${productId}: ${product.name}...`);

      try {
        await setDoc(doc(db, 'products', productId), product);
        console.log(`✅ Éxito!`);
        successCount++;
      } catch (error: any) {
        console.error(`❌ Error: ${error.message}`);
      }
    }

    console.log(`\n🎉 Seed completado: ${successCount}/${products.length} productos creados`);
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  }
}

seedProducts();
