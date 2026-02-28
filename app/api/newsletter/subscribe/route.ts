import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendWelcomeEmail } from '@/lib/email/mailer';

export async function POST(request: NextRequest) {
  try {
    const { email, source = 'newsletter' } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Verificar si ya existe
    const existing = await prisma.subscriber.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Este correo ya está registrado', alreadyExists: true },
        { status: 409 }
      );
    }

    // Crear suscriptor
    const subscriber = await prisma.subscriber.create({
      data: { email: normalizedEmail, source },
    });

    // Enviar email de bienvenida con cupón (si hay SMTP configurado)
    const emailSent = await sendWelcomeEmail(normalizedEmail);

    if (emailSent) {
      await prisma.subscriber.update({
        where: { id: subscriber.id },
        data: { couponSent: true },
      });
    }

    return NextResponse.json({ success: true, emailSent });
  } catch (error) {
    console.error('Error en suscripción:', error);
    return NextResponse.json({ error: 'Error al procesar la suscripción' }, { status: 500 });
  }
}
