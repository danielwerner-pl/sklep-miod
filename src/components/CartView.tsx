'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { formatPrice, type Product } from '@/lib/products';
import { deliveryOptions, FREE_SHIPPING_FROM, shippingCost, type DeliveryMethod, type Paczkomat } from '@/lib/shipping';
import { QtyStepper } from './AddToCart';
import { useCart } from './CartProvider';
import { InpostPicker } from './InpostPicker';

type CartProduct = Pick<Product, 'slug' | 'name' | 'price' | 'image' | 'weight' | 'soldOut'>;

export function CartView({ products }: { products: CartProduct[] }) {
  const { items, ready, setQty, remove } = useCart();
  const [method, setMethod] = useState<DeliveryMethod>('paczkomat');
  const [paczkomat, setPaczkomat] = useState<Paczkomat | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lines = items
    .map((i) => ({ ...i, product: products.find((p) => p.slug === i.slug) }))
    .filter((l): l is typeof l & { product: CartProduct } => !!l.product);
  const unavailable = lines.filter((l) => l.product.soldOut);
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const shipping = shippingCost(method, subtotal);
  const missingToFree = FREE_SHIPPING_FROM - subtotal;

  if (!ready) return <div className="mt-10 h-40 animate-pulse rounded-2xl bg-wax/60" />;

  if (lines.length === 0) {
    return (
      <div className="mt-10 rounded-[2rem] bg-wax/60 px-8 py-16 text-center">
        <p className="font-serif text-2xl">Twój koszyk jest pusty</p>
        <p className="mt-2 text-ink-soft">Zajrzyj do sklepu – tegoroczne miody już czekają.</p>
        <Link href="/sklep" className="btn-primary mt-8">
          Przejdź do sklepu
        </Link>
      </div>
    );
  }

  async function checkout() {
    setError(null);
    if (method === 'paczkomat' && !paczkomat) {
      setError('Wybierz paczkomat, do którego mamy wysłać paczkę.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: lines.map(({ slug, qty }) => ({ slug, qty })), delivery: method, paczkomat }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? 'Nie udało się rozpocząć płatności.');
      window.location.assign(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Nie udało się rozpocząć płatności.');
      setLoading(false);
    }
  }

  return (
    <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_400px]">
      <div>
        <ul className="divide-y divide-ink/10 border-y border-ink/10">
          {lines.map((l) => (
            <li key={l.slug} className="flex gap-5 py-6">
              <Link href={`/sklep/${l.slug}`} className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-wax">
                <Image src={l.product.image} alt="" fill sizes="96px" className="object-cover" />
              </Link>
              <div className="flex flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <Link href={`/sklep/${l.slug}`} className="font-serif text-xl hover:underline">
                    {l.product.name}
                  </Link>
                  <p className="text-sm text-ink-soft">
                    {l.product.weight} · {formatPrice(l.product.price)}
                  </p>
                  {l.product.soldOut && <p className="mt-1 text-sm font-medium text-red-700">Wyprzedane – usuń z koszyka</p>}
                </div>
                <div className="flex items-center gap-4">
                  <QtyStepper value={l.qty} onChange={(q) => setQty(l.slug, q)} label={`Ilość: ${l.product.name}`} />
                  <span className="w-24 text-right font-medium tabular-nums">{formatPrice(l.product.price * l.qty)}</span>
                  <button type="button" onClick={() => remove(l.slug)} className="text-sm text-ink-soft underline hover:text-ink">
                    Usuń
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <fieldset className="mt-12">
          <legend className="font-serif text-2xl">Dostawa</legend>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {(Object.keys(deliveryOptions) as DeliveryMethod[]).map((m) => {
              const o = deliveryOptions[m];
              const cost = shippingCost(m, subtotal);
              return (
                <label
                  key={m}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-5 transition ${
                    method === m ? 'border-ink bg-wax/50' : 'border-ink/15 hover:border-ink/40'
                  }`}
                >
                  <input type="radio" name="delivery" value={m} checked={method === m} onChange={() => setMethod(m)} className="mt-1 accent-ink" />
                  <span className="flex-1">
                    <span className="flex justify-between gap-2 font-medium">
                      {o.label}
                      <span>{cost === 0 ? 'Gratis' : formatPrice(cost)}</span>
                    </span>
                    <span className="mt-1 block text-sm text-ink-soft">
                      {o.description} · {o.days[0]}–{o.days[1]} dni robocze
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
          {method === 'paczkomat' && (
            <div className="mt-5">
              <InpostPicker value={paczkomat} onChange={setPaczkomat} />
            </div>
          )}
          {method === 'kurier' && <p className="mt-4 text-sm text-ink-soft">Adres dostawy podasz na stronie płatności.</p>}
        </fieldset>
      </div>

      <aside className="h-fit rounded-[2rem] bg-wax/60 p-7 lg:sticky lg:top-24">
        <h2 className="font-serif text-2xl">Podsumowanie</h2>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-soft">Produkty</dt>
            <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">Dostawa ({deliveryOptions[method].label})</dt>
            <dd className="tabular-nums">{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</dd>
          </div>
          <div className="flex justify-between border-t border-ink/10 pt-3 text-base font-semibold">
            <dt>Razem</dt>
            <dd className="tabular-nums">{formatPrice(subtotal + shipping)}</dd>
          </div>
        </dl>
        {missingToFree > 0 && (
          <p className="mt-4 rounded-xl bg-cream px-4 py-3 text-sm">
            Dodaj produkty za <strong>{formatPrice(missingToFree)}</strong>, a dostawa będzie gratis.
          </p>
        )}
        <button type="button" className="btn-primary mt-6 w-full py-4" onClick={checkout} disabled={loading || unavailable.length > 0}>
          {loading ? 'Przekierowuję do płatności…' : 'Przejdź do płatności'}
        </button>
        {error && (
          <p role="alert" className="mt-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <p className="mt-4 text-center text-xs text-ink-soft">BLIK · Przelewy24 · Karta · Bezpieczna płatność Stripe</p>
      </aside>
    </div>
  );
}
