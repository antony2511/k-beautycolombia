import nodemailer from 'nodemailer';

// Lazy init — crea el transporter solo cuando se va a enviar
function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) throw new Error('GMAIL_USER o GMAIL_APP_PASSWORD no configurados');
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

const FROM = process.env.EMAIL_FROM ?? 'K-Beauty Colombia <Info@kbeautycolombia.com>';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OrderItem {
  name: string;
  brand: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress?: {
    fullName?: string;
    address?: string;
    city?: string;
    state?: string;
  };
}

export interface StatusEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: string;
  trackingNumber?: string | null;
  notes?: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

const statusLabel: Record<string, string> = {
  pending: 'Pendiente de pago',
  processing: 'En preparación',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const statusColor: Record<string, string> = {
  pending: '#f59e0b',
  processing: '#3b82f6',
  shipped: '#8b5cf6',
  delivered: '#10b981',
  cancelled: '#ef4444',
};

// ─── Base layout ──────────────────────────────────────────────────────────────

function layout(content: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>K-Beauty Colombia</title>
</head>
<body style="margin:0;padding:0;background:#f9f5f2;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#2d2d2d;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f5f2;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#d4607a 0%,#e8a0b0 100%);padding:32px 40px;text-align:center;">
            <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:1px;">K-Beauty Colombia</p>
            <p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.85);letter-spacing:2px;text-transform:uppercase;">Tu ritual coreano</p>
          </td>
        </tr>
        <!-- Content -->
        <tr><td style="padding:40px;">
          ${content}
        </td></tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f9f5f2;padding:24px 40px;text-align:center;border-top:1px solid #f0e8e4;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">
              © ${new Date().getFullYear()} K-Beauty Colombia ·
              <a href="mailto:Info@kbeautycolombia.com" style="color:#d4607a;text-decoration:none;">Info@kbeautycolombia.com</a>
            </p>
            <p style="margin:6px 0 0;font-size:11px;color:#c4b5ad;">
              Productos auténticos importados de Corea del Sur · Certificación Cosmética Europea
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Template: Order Confirmation ─────────────────────────────────────────────

function orderConfirmationHtml(data: OrderEmailData): string {
  const itemsHtml = data.items.map((item) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #f5eeeb;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="width:48px;vertical-align:top;">
              ${item.image
                ? `<img src="${item.image}" width="44" height="44" style="border-radius:8px;object-fit:cover;" />`
                : `<div style="width:44px;height:44px;background:#f5eeeb;border-radius:8px;"></div>`}
            </td>
            <td style="padding-left:12px;vertical-align:top;">
              <p style="margin:0;font-size:14px;font-weight:600;color:#2d2d2d;">${item.name}</p>
              <p style="margin:2px 0 0;font-size:12px;color:#9ca3af;">${item.brand} · x${item.quantity}</p>
            </td>
            <td style="text-align:right;vertical-align:top;">
              <p style="margin:0;font-size:14px;font-weight:600;color:#2d2d2d;">${fmt(item.price * item.quantity)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('');

  const addressHtml = data.shippingAddress
    ? `<p style="margin:4px 0;font-size:13px;color:#6b7280;">
        ${data.shippingAddress.address ?? ''}, ${data.shippingAddress.city ?? ''}, ${data.shippingAddress.state ?? ''}
       </p>`
    : '';

  return layout(`
    <h2 style="margin:0 0 4px;font-size:24px;font-weight:800;color:#2d2d2d;">¡Pedido confirmado! 🎉</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#6b7280;">Hola <strong>${data.customerName}</strong>, recibimos tu pedido correctamente.</p>

    <!-- Order number badge -->
    <div style="background:#fdf2f5;border:1px solid #f5d0da;border-radius:10px;padding:16px 20px;margin-bottom:28px;">
      <p style="margin:0;font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">Número de pedido</p>
      <p style="margin:4px 0 0;font-size:22px;font-weight:800;color:#d4607a;">#${data.orderNumber}</p>
    </div>

    <!-- Items -->
    <h3 style="margin:0 0 12px;font-size:14px;font-weight:700;color:#2d2d2d;text-transform:uppercase;letter-spacing:1px;">Productos</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      ${itemsHtml}
    </table>

    <!-- Totals -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td style="padding:4px 0;font-size:13px;color:#6b7280;">Subtotal</td>
        <td style="padding:4px 0;font-size:13px;color:#6b7280;text-align:right;">${fmt(data.subtotal)}</td>
      </tr>
      <tr>
        <td style="padding:4px 0;font-size:13px;color:#6b7280;">Envío</td>
        <td style="padding:4px 0;font-size:13px;color:#6b7280;text-align:right;">${data.shipping === 0 ? 'Gratis' : fmt(data.shipping)}</td>
      </tr>
      <tr>
        <td style="padding:12px 0 0;font-size:16px;font-weight:800;color:#2d2d2d;border-top:2px solid #f0e8e4;">Total</td>
        <td style="padding:12px 0 0;font-size:16px;font-weight:800;color:#d4607a;text-align:right;border-top:2px solid #f0e8e4;">${fmt(data.total)}</td>
      </tr>
    </table>

    <!-- Shipping address -->
    ${data.shippingAddress ? `
    <div style="background:#f9f5f2;border-radius:10px;padding:16px 20px;margin-bottom:28px;">
      <p style="margin:0 0 6px;font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">Dirección de entrega</p>
      ${addressHtml}
    </div>` : ''}

    <!-- Info box -->
    <div style="background:#fdf2f5;border-left:4px solid #d4607a;border-radius:0 8px 8px 0;padding:14px 18px;">
      <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">
        Tu pedido se despacha desde nuestro centro en <strong>España</strong> directamente a Colombia.
        Te notificaremos cuando esté en camino con el número de seguimiento.
      </p>
    </div>
  `);
}

// ─── Template: Status Update ───────────────────────────────────────────────────

function statusUpdateHtml(data: StatusEmailData): string {
  const label = statusLabel[data.status] ?? data.status;
  const color = statusColor[data.status] ?? '#6b7280';

  const trackingHtml = data.trackingNumber
    ? `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px 20px;margin-top:20px;">
        <p style="margin:0;font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">Número de seguimiento</p>
        <p style="margin:4px 0 0;font-size:18px;font-weight:800;color:#10b981;">${data.trackingNumber}</p>
       </div>`
    : '';

  const notesHtml = data.notes
    ? `<p style="margin:16px 0 0;font-size:13px;color:#6b7280;font-style:italic;">Nota: ${data.notes}</p>`
    : '';

  return layout(`
    <h2 style="margin:0 0 4px;font-size:24px;font-weight:800;color:#2d2d2d;">Actualización de tu pedido</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#6b7280;">Hola <strong>${data.customerName}</strong>, tu pedido cambió de estado.</p>

    <!-- Order number -->
    <p style="margin:0 0 16px;font-size:13px;color:#9ca3af;">Pedido <strong style="color:#2d2d2d;">#${data.orderNumber}</strong></p>

    <!-- Status badge -->
    <div style="display:inline-block;background:${color}18;border:1.5px solid ${color}40;border-radius:999px;padding:10px 24px;margin-bottom:20px;">
      <p style="margin:0;font-size:16px;font-weight:700;color:${color};">${label}</p>
    </div>

    ${trackingHtml}
    ${notesHtml}

    <div style="margin-top:28px;background:#f9f5f2;border-radius:10px;padding:16px 20px;">
      <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">
        ¿Tienes preguntas sobre tu pedido? Escríbenos a
        <a href="mailto:Info@kbeautycolombia.com" style="color:#d4607a;text-decoration:none;">Info@kbeautycolombia.com</a>
      </p>
    </div>
  `);
}

// ─── Template: Welcome ────────────────────────────────────────────────────────

function welcomeHtml(name: string): string {
  return layout(`
    <h2 style="margin:0 0 4px;font-size:24px;font-weight:800;color:#2d2d2d;">¡Bienvenida a K-Beauty Colombia! ✨</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#6b7280;">Hola <strong>${name}</strong>, tu cuenta fue creada exitosamente.</p>

    <div style="background:#fdf2f5;border-radius:12px;padding:24px;margin-bottom:28px;text-align:center;">
      <p style="margin:0 0 8px;font-size:32px;">🌸</p>
      <p style="margin:0;font-size:15px;color:#6b7280;line-height:1.7;">
        Ahora puedes explorar nuestra tienda de productos coreanos auténticos,
        guardar tus favoritos y seguir el estado de tus pedidos.
      </p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      ${[
        ['verified', 'Importado directamente', 'Todos nuestros productos vienen directo de Corea del Sur.'],
        ['local_shipping', 'Despacho desde España', 'Centro de distribución en Europa para entregas más rápidas.'],
        ['workspace_premium', 'Certificación EU', 'Cada producto cumple la normativa cosmética europea.'],
      ].map(([, title, desc]) => `
        <tr>
          <td style="padding:10px 0;vertical-align:top;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="width:36px;vertical-align:top;">
                  <div style="width:28px;height:28px;background:#fdf2f5;border-radius:50%;"></div>
                </td>
                <td style="padding-left:12px;vertical-align:top;">
                  <p style="margin:0;font-size:14px;font-weight:700;color:#2d2d2d;">${title}</p>
                  <p style="margin:2px 0 0;font-size:12px;color:#9ca3af;">${desc}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `).join('')}
    </table>

    <div style="text-align:center;">
      <a href="https://korea.uclipcolombia.com/tienda"
         style="display:inline-block;background:linear-gradient(135deg,#d4607a,#e8a0b0);color:#fff;text-decoration:none;padding:14px 36px;border-radius:999px;font-weight:700;font-size:15px;">
        Explorar la tienda →
      </a>
    </div>
  `);
}

// ─── Public send functions ────────────────────────────────────────────────────

export async function sendOrderConfirmation(data: OrderEmailData) {
  try {
    await getTransporter().sendMail({
      from: FROM,
      to: data.customerEmail,
      subject: `Pedido confirmado #${data.orderNumber} — K-Beauty Colombia`,
      html: orderConfirmationHtml(data),
    });
  } catch (err) {
    console.error('[email] sendOrderConfirmation error:', err);
  }
}

export async function sendStatusUpdate(data: StatusEmailData) {
  try {
    const label = statusLabel[data.status] ?? data.status;
    await getTransporter().sendMail({
      from: FROM,
      to: data.customerEmail,
      subject: `Tu pedido #${data.orderNumber} está: ${label} — K-Beauty Colombia`,
      html: statusUpdateHtml(data),
    });
  } catch (err) {
    console.error('[email] sendStatusUpdate error:', err);
  }
}

export async function sendWelcome(email: string, name: string) {
  try {
    await getTransporter().sendMail({
      from: FROM,
      to: email,
      subject: '¡Bienvenida a K-Beauty Colombia! ✨',
      html: welcomeHtml(name),
    });
  } catch (err) {
    console.error('[email] sendWelcome error:', err);
  }
}
