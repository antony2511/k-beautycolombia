import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';

export async function getEmailTransporter() {
  const settings = await prisma.emailSettings.findFirst();
  if (!settings || !settings.isActive) return null;

  return nodemailer.createTransport({
    host: settings.smtpHost,
    port: settings.smtpPort,
    secure: settings.smtpPort === 465,
    auth: {
      user: settings.smtpUser,
      pass: settings.smtpPass,
    },
  });
}

export async function sendWelcomeEmail(email: string): Promise<boolean> {
  try {
    const settings = await prisma.emailSettings.findFirst();
    if (!settings || !settings.isActive) return false;

    const transporter = await getEmailTransporter();
    if (!transporter) return false;

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bienvenida al Glow Club</title>
</head>
<body style="margin:0;padding:0;background:#FEFDFB;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FEFDFB;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(45,62,64,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#2D3E40,#4A5F62);padding:40px 40px 32px;text-align:center;">
              <p style="margin:0 0 8px;color:#FF9B9B;font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">K-Beauty Colombia</p>
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;line-height:1.2;">¡Bienvenida al Glow Club! 🌿</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 16px;color:#4A5F62;font-size:16px;line-height:1.6;">
                Hola,
              </p>
              <p style="margin:0 0 24px;color:#4A5F62;font-size:16px;line-height:1.6;">
                Gracias por unirte a nuestra comunidad. Aquí tienes tu regalo de bienvenida:
              </p>

              <!-- Coupon box -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#FF9B9B,#FFB8B8);border-radius:12px;padding:28px;text-align:center;">
                    <p style="margin:0 0 4px;color:#ffffff;font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">Tu código de descuento</p>
                    <p style="margin:0 0 8px;color:#ffffff;font-size:38px;font-weight:800;letter-spacing:6px;">GLOW10</p>
                    <p style="margin:0;color:rgba(255,255,255,0.9);font-size:14px;">10% de descuento en tu primera compra</p>
                  </td>
                </tr>
              </table>

              <p style="margin:28px 0 16px;color:#4A5F62;font-size:15px;line-height:1.6;">
                Úsalo al finalizar tu compra. Como miembro del Glow Club también recibirás:
              </p>
              <ul style="margin:0 0 28px;padding-left:20px;color:#4A5F62;font-size:15px;line-height:2;">
                <li>Tips exclusivos de skincare K-Beauty</li>
                <li>Acceso anticipado a nuevos productos</li>
                <li>Ofertas especiales para suscriptores</li>
              </ul>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://korea.uclipcolombia.com/tienda" style="display:inline-block;background:#2D3E40;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 36px;border-radius:50px;">
                      Ir a la tienda →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#F8F9FA;padding:24px 40px;text-align:center;border-top:1px solid #E5D9CC;">
              <p style="margin:0;color:#C8B6A6;font-size:12px;">
                © ${new Date().getFullYear()} K-Beauty Colombia ·
                <a href="https://korea.uclipcolombia.com" style="color:#C8B6A6;">korea.uclipcolombia.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    await transporter.sendMail({
      from: `"${settings.smtpFromName}" <${settings.smtpFrom}>`,
      to: email,
      subject: '¡Bienvenida al Glow Club! 🌿 Tu 10% de descuento te espera',
      html,
    });

    return true;
  } catch (error) {
    console.error('Error enviando email de bienvenida:', error);
    return false;
  }
}
