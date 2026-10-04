import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { sendMail } from '@/lib/email';
import { formatPrice } from '@/lib/products';
import { site } from '@/lib/site';
import { getStripe } from '@/lib/stripe';

export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) return NextResponse.json({ error: 'Webhook nieskonfigurowany' }, { status: 501 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await req.text(), req.headers.get('stripe-signature') ?? '', secret);
  } catch (e) {
    return NextResponse.json({ error: `Błędny podpis: ${(e as Error).message}` }, { status: 400 });
  }

  // BLIK i karta potwierdzają się od razu; Przelewy24 może przyjść później jako async_payment_succeeded.
  const paidEvents = ['checkout.session.completed', 'checkout.session.async_payment_succeeded'];
  if (paidEvents.includes(event.type)) {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === 'paid') await notify(stripe, session);
  }

  return NextResponse.json({ received: true });
}

async function notify(stripe: Stripe, session: Stripe.Checkout.Session) {
  const full = await stripe.checkout.sessions.retrieve(session.id, { expand: ['line_items'] });
  const items = (full.line_items?.data ?? []).map((l) => `• ${l.quantity} × ${l.description} – ${formatPrice(l.amount_total)}`);
  const c = full.customer_details;
  const m = full.metadata ?? {};
  const addr = full.collected_information?.shipping_details?.address;
  const delivery =
    m.delivery === 'paczkomat'
      ? `Paczkomat InPost ${m.paczkomat}${m.paczkomat_adres ? ` (${m.paczkomat_adres})` : ''}`
      : `Kurier: ${[addr?.line1, addr?.line2, addr?.postal_code, addr?.city].filter(Boolean).join(', ')}`;
  const nr = full.id.slice(-8).toUpperCase();

  const summary = [
    ...items,
    `Dostawa: ${formatPrice(full.shipping_cost?.amount_total ?? 0)}`,
    `Razem: ${formatPrice(full.amount_total ?? 0)}`,
    '',
    delivery,
  ].join('\n');

  const jobs: Promise<void>[] = [];
  if (process.env.SELLER_EMAIL) {
    jobs.push(
      sendMail({
        to: process.env.SELLER_EMAIL,
        subject: `Nowe zamówienie ${nr} – ${formatPrice(full.amount_total ?? 0)}`,
        text: `Klient: ${c?.name ?? ''}\nE-mail: ${c?.email ?? ''}\nTelefon: ${c?.phone ?? ''}\n\n${summary}\n\nSzczegóły w panelu Stripe.`,
      }),
    );
  }
  if (c?.email) {
    jobs.push(
      sendMail({
        to: c.email,
        subject: `Dziękujemy za zamówienie ${nr} – ${site.name}`,
        text: `Dzień dobry${c.name ? ` ${c.name.split(' ')[0]}` : ''},\n\ndziękujemy za zamówienie! Wyślemy je w ciągu 24 godzin roboczych.\n\n${summary}\n\nPozdrawiamy,\n${site.name}`,
      }),
    );
  }
  const results = await Promise.allSettled(jobs);
  results.forEach((r) => r.status === 'rejected' && console.error('[webhook] e-mail:', r.reason));
}
