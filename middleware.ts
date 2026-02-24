import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminToken } from '@/lib/admin/auth';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Proteger rutas admin
  if (pathname.startsWith('/admin')) {
    // Permitir acceso a login
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Verificar token admin
    const token = request.cookies.get('admin_token')?.value;
    const tokenData = token ? await verifyAdminToken(token) : null;
    const isValid = tokenData !== null;

    console.log('🔒 Middleware check:', {
      pathname,
      hasToken: !!token,
      isValid,
      tokenData: tokenData ? 'valid' : 'invalid',
      tokenStart: token?.substring(0, 20),
    });

    if (!token || !isValid) {
      console.log('❌ Redirecting to login from:', pathname);
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    console.log('✅ Access granted to:', pathname);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
