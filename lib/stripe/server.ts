import Stripe from 'stripe';

// Cliente de Stripe para usar en el servidor (API routes)
export function getStripeClient(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY no está configurada');
  }

  return new Stripe(secretKey, {
    apiVersion: '2024-12-18.acacia',
    typescript: true,
  });
}
