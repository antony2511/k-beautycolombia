import { NextResponse } from 'next/server';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export async function POST(request: Request) {
  try {
    const simpleProducts = [
      { name: 'Producto 1', price: 10000, stock: 50 },
      { name: 'Producto 2', price: 20000, stock: 30 },
      { name: 'Producto 3', price: 30000, stock: 20 },
    ];

    const results = [];

    for (let i = 0; i < simpleProducts.length; i++) {
      try {
        const productId = `p${i + 1}`;
        await setDoc(doc(db, 'products', productId), simpleProducts[i]);
        results.push({ id: productId, status: 'success' });
      } catch (error: any) {
        results.push({ id: `p${i + 1}`, status: 'error', error: error.message });
      }
    }

    return NextResponse.json({
      message: 'Seed completado',
      results,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}
