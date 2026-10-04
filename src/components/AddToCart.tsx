'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MAX_QTY, useCart } from './CartProvider';

export function AddToCart({ slug, soldOut }: { slug: string; soldOut: boolean }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (soldOut) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-wax/60 p-5">
        <p className="font-medium">Wyprzedane</p>
        <p className="mt-1 text-sm text-ink-soft">Nowy zbiór pojawi się w przyszłym sezonie.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <QtyStepper value={qty} onChange={setQty} />
      <button
        type="button"
        className="btn-primary min-w-48 flex-1 sm:flex-none"
        onClick={() => {
          add(slug, qty);
          setAdded(true);
        }}
      >
        Dodaj do koszyka
      </button>
      <p role="status" className="w-full text-sm">
        {added && (
          <>
            Dodano do koszyka.{' '}
            <Link href="/koszyk" className="font-medium underline decoration-honey decoration-2 underline-offset-4">
              Przejdź do koszyka →
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

export function QtyStepper({ value, onChange, label = 'Ilość' }: { value: number; onChange: (v: number) => void; label?: string }) {
  const btn = 'flex h-11 w-11 items-center justify-center text-lg transition hover:bg-ink/5 disabled:opacity-30';
  return (
    <div className="inline-flex items-center rounded-full border border-ink/20" role="group" aria-label={label}>
      <button type="button" className={btn + ' rounded-l-full'} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Mniej">
        −
      </button>
      <span className="w-8 text-center text-sm font-medium tabular-nums" aria-live="polite">
        {value}
      </span>
      <button type="button" className={btn + ' rounded-r-full'} onClick={() => onChange(value + 1)} disabled={value >= MAX_QTY} aria-label="Więcej">
        +
      </button>
    </div>
  );
}
