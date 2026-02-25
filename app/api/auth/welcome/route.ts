import { NextRequest, NextResponse } from 'next/server';
import { sendWelcome } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    if (!email || !name) {
      return NextResponse.json({ error: 'Email y nombre requeridos' }, { status: 400 });
    }

    // Fire-and-forget — no bloqueamos la respuesta
    sendWelcome(email, name);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
