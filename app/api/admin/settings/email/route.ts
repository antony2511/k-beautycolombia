import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken } from '@/lib/admin/auth';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const settings = await prisma.emailSettings.findFirst();
    if (!settings) {
      return NextResponse.json({ settings: null });
    }

    // No exponer la contraseña completa
    return NextResponse.json({
      settings: {
        ...settings,
        smtpPass: settings.smtpPass ? '••••••••' : '',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener configuración' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { smtpHost, smtpPort, smtpUser, smtpPass, smtpFrom, smtpFromName, isActive } = body;

    const existing = await prisma.emailSettings.findFirst();

    // Si la contraseña es la máscara, mantener la existente
    const passToSave =
      smtpPass && smtpPass !== '••••••••'
        ? smtpPass
        : existing?.smtpPass || '';

    if (existing) {
      const updated = await prisma.emailSettings.update({
        where: { id: existing.id },
        data: { smtpHost, smtpPort: parseInt(smtpPort), smtpUser, smtpPass: passToSave, smtpFrom, smtpFromName, isActive },
      });
      return NextResponse.json({ success: true, settings: { ...updated, smtpPass: '••••••••' } });
    } else {
      const created = await prisma.emailSettings.create({
        data: { smtpHost, smtpPort: parseInt(smtpPort), smtpUser, smtpPass: passToSave, smtpFrom, smtpFromName, isActive: isActive ?? false },
      });
      return NextResponse.json({ success: true, settings: { ...created, smtpPass: '••••••••' } });
    }
  } catch (error) {
    console.error('Error guardando configuración:', error);
    return NextResponse.json({ error: 'Error al guardar configuración' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { testEmail } = await request.json();
    const settings = await prisma.emailSettings.findFirst();

    if (!settings) {
      return NextResponse.json({ error: 'No hay configuración guardada' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: settings.smtpHost,
      port: settings.smtpPort,
      secure: settings.smtpPort === 465,
      auth: { user: settings.smtpUser, pass: settings.smtpPass },
    });

    await transporter.sendMail({
      from: `"${settings.smtpFromName}" <${settings.smtpFrom}>`,
      to: testEmail,
      subject: 'Prueba de configuración SMTP — K-Beauty Colombia',
      html: '<p>¡La configuración de correo funciona correctamente! 🎉</p>',
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error al enviar correo de prueba' }, { status: 500 });
  }
}
