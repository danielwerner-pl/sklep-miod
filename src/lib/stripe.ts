import 'server-only';
import Stripe from 'stripe';

let client: Stripe | null = null;

/** Zwraca klienta Stripe albo null, gdy brak klucza (tryb demo bez płatności). */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!key.startsWith('sk_test_') && !key.startsWith('rk_test_')) {
    throw new Error('Prototyp obsługuje tylko testowe klucze Stripe (sk_test_…).');
  }
  client ??= new Stripe(key);
  return client;
}
