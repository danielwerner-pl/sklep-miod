'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';

export function CartLink() {
  const { count } = useCart();
  return (
    <Link
      href="/koszyk"
      className="relative inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm font-medium transition hover:border-ink/40"
      aria-label={`Koszyk, produktów: ${count}`}
    >
      <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 7h12l-1 13H7L6 7Z" strokeLinejoin="round" />
        <path d="M9 7a3 3 0 0 1 6 0" />
      </svg>
      Koszyk
      {count > 0 && (
        <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-honey px-1.5 text-xs font-semibold text-ink">
          {count}
        </span>
      )}
    </Link>
  );
}
