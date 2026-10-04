import type { Metadata } from 'next';
import Link from 'next/link';
import { ClearCart } from '@/components/ClearCart';
import { formatPrice } from '@/lib/products';
import { getStripe } from '@/lib/stripe';

export const metadata: Metadata = { title: 'Dziękujemy za zamówienie', robots: { index: false } };

type Props = { searchParams: Promise<{ session_id?: string; demo?: string }> };

export default async function ConfirmationPage({ searchParams }: Props) {
  const { session_id, demo } = await searchParams;
  const order = session_id ? await loadOrder(session_id) : null;

  if (!order && !demo) {
    return (
      <Shell title="Nie znaleźliśmy zamówienia">
        <p className="text-ink-soft">Link jest niepełny albo sesja płatności wygasła. Jeśli pieniądze zostały pobrane, napisz do nas.</p>
        <Link href="/koszyk" className="btn-primary mt-8">Wróć do koszyka</Link>
      </Shell>
    );
  }

  if (!order) {
    return (
      <Shell title="Dziękujemy za zamówienie!">
        <ClearCart />
        <p className="rounded-xl bg-honey-light/40 px-4 py-3 text-sm">
          <strong>Tryb demo:</strong> brak kluczy Stripe w <code>.env.local</code>, więc płatność została pominięta.
        </p>
        <p className="mt-6 text-lg text-ink-soft">Potwierdzenie wyślemy na Twój e-mail. Paczka wyjdzie z pasieki w ciągu 24 godzin roboczych.</p>
        <Link href="/sklep" className="btn-primary mt-10">Wróć do sklepu</Link>
      </Shell>
    );
  }

  return (
    <Shell title={order.paid ? 'Dziękujemy za zamówienie!' : 'Czekamy na potwierdzenie płatności'}>
      {order.paid && <ClearCart />}
      <p className="text-lg text-ink-soft">
        {order.paid
          ? `Potwierdzenie wysłaliśmy na ${order.email}. Paczka wyjdzie z pasieki w ciągu 24 godzin roboczych.`
          : 'Gdy bank potwierdzi płatność, wyślemy e-mail z potwierdzeniem.'}
      </p>

      <div className="mt-10 rounded-[2rem] bg-wax/60 p-7 text-left">
        <div className="flex flex-wrap justify-between gap-2 text-sm">
          <span className="text-ink-soft">Numer zamówienia</span>
          <span className="font-mono font-medium">{order.number}</span>
        </div>
        <ul className="mt-5 divide-y divide-ink/10 border-y border-ink/10">
          {order.items.map((i, idx) => (
            <li key={idx} className="flex justify-between gap-4 py-3 text-sm">
              <span>
                {i.qty} × {i.name}
              </span>
              <span className="tabular-nums">{formatPrice(i.total)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-soft">Dostawa</dt>
            <dd className="tabular-nums">{order.shipping === 0 ? 'Gratis' : formatPrice(order.shipping)}</dd>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <dt>Razem</dt>
            <dd className="tabular-nums">{formatPrice(order.total)}</dd>
          </div>
        </dl>
        <div className="mt-6 border-t border-ink/10 pt-5 text-sm">
          <p className="text-ink-soft">Dostawa</p>
          <p className="mt-1 font-medium">{order.delivery}</p>
        </div>
      </div>

      <Link href="/sklep" className="btn-primary mt-10">Wróć do sklepu</Link>
    </Shell>
  );
}

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl px-5 py-20 text-center sm:px-8">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-honey text-3xl" aria-hidden>
        ✓
      </div>
      <h1 className="mt-6 font-serif text-4xl tracking-tight sm:text-5xl">{title}</h1>
      <div className="mt-5">{children}</div>
    </div>
  );
}

async function loadOrder(id: string) {
  const stripe = getStripe();
  if (!stripe || !id.startsWith('cs_')) return null;
  try {
    const s = await stripe.checkout.sessions.retrieve(id, { expand: ['line_items'] });
    const m = s.metadata ?? {};
    const addr = s.collected_information?.shipping_details?.address;
    return {
      number: s.id.slice(-8).toUpperCase(),
      paid: s.payment_status === 'paid',
      email: s.customer_details?.email ?? 'Twój e-mail',
      items: (s.line_items?.data ?? []).map((l) => ({ name: l.description ?? '', qty: l.quantity ?? 1, total: l.amount_total })),
      shipping: s.shipping_cost?.amount_total ?? 0,
      total: s.amount_total ?? 0,
      delivery:
        m.delivery === 'paczkomat'
          ? `Paczkomat InPost ${m.paczkomat}${m.paczkomat_adres ? `, ${m.paczkomat_adres}` : ''}`
          : `Kurier InPost: ${[addr?.line1, addr?.postal_code, addr?.city].filter(Boolean).join(', ')}`,
    };
  } catch {
    return null;
  }
}
