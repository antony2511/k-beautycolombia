import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken } from '@/lib/admin/auth';
import admin from 'firebase-admin';

// GET - Listar usuarios con filtros usando Firebase Admin Auth
export async function GET(request: Request) {
  try {
    // Verificar autenticación admin
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const limit = parseInt(searchParams.get('limit') || '100');

    try {
      console.log('👥 Fetching users from Firebase Auth...');

      // Usar Firebase Admin Auth para listar usuarios
      const listUsersResult = await admin.auth().listUsers(limit);

      console.log(`👥 Found ${listUsersResult.users.length} users from Auth`);

      let users = listUsersResult.users.map((userRecord) => {
        // Convertir creationTime a ISO string para consistencia
        let createdAt = new Date().toISOString();
        if (userRecord.metadata.creationTime) {
          try {
            createdAt = new Date(userRecord.metadata.creationTime).toISOString();
          } catch (error) {
            console.error('❌ Error parsing creationTime:', error);
          }
        }

        return {
          id: userRecord.uid,
          email: userRecord.email || '',
          displayName: userRecord.displayName || userRecord.email?.split('@')[0] || 'Usuario',
          photoURL: userRecord.photoURL || '',
          phoneNumber: userRecord.phoneNumber || '',
          createdAt: createdAt,
          disabled: userRecord.disabled || false,
          emailVerified: userRecord.emailVerified || false,
        };
      });

      console.log(`👥 Total users mapped: ${users.length}`);

      // Filtrar por búsqueda
      if (search) {
        const searchLower = search.toLowerCase();
        users = users.filter((user: any) =>
          user.email.toLowerCase().includes(searchLower) ||
          user.displayName.toLowerCase().includes(searchLower)
        );
        console.log(`👥 After search filter: ${users.length} users`);
      }

      // Filtrar por estado
      if (status === 'active') {
        users = users.filter((user: any) => !user.disabled);
      } else if (status === 'inactive') {
        users = users.filter((user: any) => user.disabled);
      }

      console.log(`✅ Returning ${users.length} users`);

      return NextResponse.json({
        users,
        total: users.length,
      });
    } catch (error: any) {
      console.error('❌ Error fetching users from Firebase Auth:', error);
      console.error('❌ Error message:', error?.message);

      // Retornar array vacío si hay error
      return NextResponse.json({
        users: [],
        total: 0,
        error: 'Error al obtener usuarios desde Firebase Auth',
      });
    }
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    return NextResponse.json(
      { error: 'Error al obtener usuarios' },
      { status: 500 }
    );
  }
}
