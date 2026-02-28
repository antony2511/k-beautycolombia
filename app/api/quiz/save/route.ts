import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';
import { saveSkinProfile } from '@/lib/firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];

    if (!auth) {
      return NextResponse.json({ error: 'Servicio no disponible' }, { status: 503 });
    }

    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(token);
    } catch {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const uid = decodedToken.uid;
    if (!uid) {
      return NextResponse.json({ error: 'UID no encontrado' }, { status: 400 });
    }

    const body = await request.json();

    await saveSkinProfile(uid, {
      skinType: body.skinType,
      isSensible: body.isSensible,
      concerns: body.concerns || [],
      preferredTexture: body.preferredTexture || 'any',
      ageRange: body.ageRange || '',
      routineComplexity: body.routineComplexity || 'any',
      savedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving skin profile:', error);
    return NextResponse.json({ error: 'Error al guardar el análisis' }, { status: 500 });
  }
}
