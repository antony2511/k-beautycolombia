import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken } from '@/lib/admin/auth';
import { db, isFirebaseInitialized } from '@/lib/firebase-admin';
import { z } from 'zod';

// Schema de validación para actualizar usuario
const updateUserSchema = z.object({
  displayName: z.string().optional(),
  phoneNumber: z.string().optional(),
  disabled: z.boolean().optional(),
});

// GET - Obtener detalle de usuario con estadísticas
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticación admin
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;

    // Verificar si Firebase está inicializado
    if (!isFirebaseInitialized() || !db) {
      return NextResponse.json(
        { error: 'Firebase no está configurado correctamente' },
        { status: 500 }
      );
    }

    try {
      // Obtener usuario desde Firestore
      const userDoc = await db.collection('users').doc(id).get();

      if (!userDoc.exists) {
        return NextResponse.json(
          { error: 'Usuario no encontrado' },
          { status: 404 }
        );
      }

      const userData = userDoc.data();

      const user = {
        id: userDoc.id,
        email: userData?.email || '',
        displayName: userData?.displayName || userData?.name || 'Usuario',
        photoURL: userData?.photoURL || '',
        phoneNumber: userData?.phoneNumber || '',
        createdAt: userData?.createdAt?.toDate ? userData.createdAt.toDate().toISOString() : new Date().toISOString(),
        disabled: userData?.disabled || false,
        emailVerified: userData?.emailVerified || false,
        lastLoginAt: userData?.lastLoginAt?.toDate ? userData.lastLoginAt.toDate().toISOString() : null,
      };

      // TODO: Obtener estadísticas de órdenes del usuario desde MySQL
      // Por ahora retornamos valores por defecto
      const stats = {
        totalOrders: 0,
        totalSpent: 0,
        averageOrder: 0,
        productsOrdered: 0,
      };

      return NextResponse.json({ user, stats });
    } catch (error) {
      console.error('Error fetching user:', error);
      return NextResponse.json(
        { error: 'Error al obtener usuario' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    return NextResponse.json(
      { error: 'Error al obtener usuario' },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar usuario
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticación admin
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Validar datos
    const validation = updateUserSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.errors },
        { status: 400 }
      );
    }

    // Verificar si Firebase está inicializado
    if (!isFirebaseInitialized() || !db) {
      return NextResponse.json(
        { error: 'Firebase no está configurado correctamente' },
        { status: 500 }
      );
    }

    try {
      // Verificar que el usuario existe
      const userDoc = await db.collection('users').doc(id).get();

      if (!userDoc.exists) {
        return NextResponse.json(
          { error: 'Usuario no encontrado' },
          { status: 404 }
        );
      }

      // Actualizar usuario en Firestore
      const updateData: any = {
        ...validation.data,
        updatedAt: new Date(),
      };

      await db.collection('users').doc(id).update(updateData);

      // Obtener usuario actualizado
      const updatedDoc = await db.collection('users').doc(id).get();
      const userData = updatedDoc.data();

      const user = {
        id: updatedDoc.id,
        email: userData?.email || '',
        displayName: userData?.displayName || userData?.name || 'Usuario',
        photoURL: userData?.photoURL || '',
        phoneNumber: userData?.phoneNumber || '',
        createdAt: userData?.createdAt?.toDate ? userData.createdAt.toDate().toISOString() : new Date().toISOString(),
        disabled: userData?.disabled || false,
        emailVerified: userData?.emailVerified || false,
      };

      return NextResponse.json({
        message: 'Usuario actualizado exitosamente',
        user,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      return NextResponse.json(
        { error: 'Error al actualizar usuario' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    return NextResponse.json(
      { error: 'Error al actualizar usuario' },
      { status: 500 }
    );
  }
}
