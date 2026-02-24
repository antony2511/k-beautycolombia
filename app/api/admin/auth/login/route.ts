import { NextResponse } from 'next/server';
import { verifyAdminCredentials, generateAdminToken } from '@/lib/admin/auth';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validar datos de entrada
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Debug logs
    console.log('🔐 Login attempt:', {
      email,
      envEmail: process.env.ADMIN_EMAIL,
      hasHash: !!process.env.ADMIN_PASSWORD_HASH,
      hashLength: process.env.ADMIN_PASSWORD_HASH?.length
    });

    // Verificar credenciales
    const isValid = await verifyAdminCredentials(email, password);

    console.log('✅ Credentials valid:', isValid);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Generar token
    const token = await generateAdminToken(email);

    // Crear respuesta con cookie
    const response = NextResponse.json({
      success: true,
      message: 'Inicio de sesión exitoso'
    });

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 horas
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
}
