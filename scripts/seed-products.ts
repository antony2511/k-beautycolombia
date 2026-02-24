#!/usr/bin/env tsx

/**
 * Script para poblar Firestore con los productos iniciales
 *
 * Uso:
 * npm run seed:products
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { products } from '../lib/data/products';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Usar la base de datos DEFAULT

// Función para limpiar datos recursivamente
function cleanFirestoreData(obj: any): any {
  if (obj === null || obj === undefined) {
    return null;
  }

  if (Array.isArray(obj)) {
    return obj.filter(item => item !== null && item !== undefined);
  }

  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            cleaned[key] = value;
          }
        } else {
          cleaned[key] = value;
        }
      }
    }
    return cleaned;
  }

  return obj;
}

async function seedProducts() {
  console.log('🌱 Iniciando seed de productos en Firestore...\n');

  try {
    for (const product of products) {
      try {
        const productRef = doc(db, 'products', product.id);

        // Remove 'id' field from product data (it's already the document ID)
        const { id, ...productData } = product;

        // Clean data for Firestore
        const cleanData = cleanFirestoreData(productData);

        await setDoc(productRef, {
          ...cleanData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        console.log(`✅ Producto creado: ${product.name} (ID: ${id})`);
      } catch (error: any) {
        console.error(`❌ Error creando producto ${product.name}:`, error.message);
        console.error('Datos del producto:', JSON.stringify(product, null, 2));
      }
    }

    console.log(`\n🎉 ¡Seed completado! ${products.length} productos creados en Firestore.`);
    console.log('\n📦 Productos:');
    products.forEach(p => {
      console.log(`   - ${p.name} (${p.brand}) - $${p.price.toLocaleString()}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    process.exit(1);
  }
}

seedProducts();
