import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getProduct } from '@/lib/products';
import { deliveryOptions, shippingCost, type DeliveryMethod } from '@/lib/shipping';
import { getStripe } from '@/lib/stripe';

type Body = {
  items?: { slug: string; qty: number }[];
  delivery?: DeliveryMethod;
  paczkomat?: { name: string; address?: string } | null;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Nieprawidłowe dane.' }, { status: 400 });
  }

  const delivery = body.delivery;
  if (!delivery || !(delivery in deliveryOptions)) {
    return NextResponse.json({ error: 'Wybierz sposób dostawy.' }, { status: 400 });
  }
  const paczkomat = body.paczkomat?.name?.trim().toUpperCase();
  if (delivery === 'paczkomat' && !paczkomat) {
    return NextResponse.json({ error: 'Wybierz paczkomat.' }, { status: 400 });
  }

  // Ceny zawsze z serwera, nigdy z przeglądarki.
  const lines = (body.items ?? [])
    .map((i) => ({ product: getProduct(i.slug), qty: Math.floor(Number(i.qty)) }))
    .filter((l) => l.product && l.qty > 0 && l.qty <= 20);
  if (lines.length === 0) return NextResponse.json({ error: 'Koszyk jest pusty.' }, { status: 400 });
  const soldOut = lines.find((l) => l.product!.soldOut);
  if (soldOut) return NextResponse.json({ error: `${soldOut.product!.name} jest wyprzedany.` }, { status: 409 });

  const subtotal = lines.reduce((s, l) => s + l.product!.price * l.qty, 0);
  const option = deliveryOptions[delivery];
  const origin = req.headers.get('origin') ?? new URL(req.url).origin;
  const publicImages = !/localhost|127\.0\.0\.1/.test(origin);

  let stripe: Stripe | null;
  try {
    stripe = getStripe();
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
  if (!stripe) {
    // Tryb demo: bez kluczy Stripe przechodzimy od razu na stronę potwierdzenia.
    return NextResponse.json({ url: `/zamowienie/potwierdzenie?demo=1` });
  }

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: 'payment',
    locale: 'pl',
    currency: 'pln',
    payment_method_types: ['blik', 'p24', 'card'],
    line_items: lines.map(({ product, qty }) => ({
      quantity: qty,
      price_data: {
        currency: 'pln',
        unit_amount: product!.price,
        product_data: {
          name: `${product!.name} (${product!.weight})`,
          metadata: { slug: product!.slug },
          ...(publicImages && { images: [origin + product!.image] }),
        },
      },
    })),
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          display_name: delivery === 'paczkomat' ? `${option.label} ${paczkomat}` : option.label,
          fixed_amount: { amount: shippingCost(delivery, subtotal), currency: 'pln' },
          delivery_estimate: {
            minimum: { unit: 'business_day', value: option.days[0] },
            maximum: { unit: 'business_day', value: option.days[1] },
          },
        },
      },
    ],
    ...(delivery === 'kurier' && { shipping_address_collection: { allowed_countries: ['PL'] } }),
    phone_number_collection: { enabled: true },
    billing_address_collection: 'auto',
    metadata: {
      delivery,
      ...(paczkomat && { paczkomat, paczkomat_adres: body.paczkomat?.address?.slice(0, 200) ?? '' }),
    },
    payment_intent_data: {
      description: `Zamówienie – ${option.label}${paczkomat ? ` ${paczkomat}` : ''}`,
    },
    success_url: `${origin}/zamowienie/potwierdzenie?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/koszyk`,
  };

  try {
    const session = await stripe.checkout.sessions.create(params);
    return NextResponse.json({ url: session.url });
  } catch (e) {
    // BLIK i Przelewy24 trzeba włączyć w panelu Stripe (Settings → Payment methods).
    // Jeśli nie są aktywne, w prototypie zostajemy przy samej karcie.
    if (e instanceof Error && 'type' in e && /payment method type|payment_method_types/i.test(e.message)) {
      console.warn('[checkout] BLIK/P24 nieaktywne w Stripe, używam tylko karty:', e.message);
      const session = await stripe.checkout.sessions.create({ ...params, payment_method_types: ['card'] });
      return NextResponse.json({ url: session.url });
    }
    console.error('[checkout]', e);
    return NextResponse.json({ error: 'Nie udało się rozpocząć płatności. Spróbuj ponownie.' }, { status: 502 });
  }
}
