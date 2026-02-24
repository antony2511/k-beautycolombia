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
const db = getFirestore(app); // Usar la base de datos DEFAULT

async function testFirestore() {
  console.log('Testing Firestore connection...\n');

  try {
    // Producto simple de prueba
    const testProduct = {
      name: 'Test Product',
      brand: 'Test Brand',
      price: 10000,
      image: 'https://via.placeholder.com/300',
      category: 'test',
      created_at: new Date().toISOString(),
    };

    console.log('Intentando crear producto de prueba...');
    console.log('Datos:', JSON.stringify(testProduct, null, 2));

    const productRef = doc(db, 'test_collection', 'test-1');
    await setDoc(productRef, testProduct);

    console.log('✅ ¡Producto de prueba creado exitosamente!');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error('Código:', error.code);
    console.error('Detalles completos:', error);
    process.exit(1);
  }
}

testFirestore();
