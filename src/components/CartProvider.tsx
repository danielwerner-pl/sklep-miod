'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type CartItem = { slug: string; qty: number };

type CartContextValue = {
  items: CartItem[];
  count: number;
  ready: boolean;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'koszyk-v1';
export const MAX_QTY = 20;

function read(): CartItem[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((i) => typeof i?.slug === 'string' && i.qty > 0) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(read());
    setReady(true);
    const onStorage = (e: StorageEvent) => e.key === STORAGE_KEY && setItems(read());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  const setQty = useCallback((slug: string, qty: number) => {
    setItems((prev) => {
      const q = Math.max(0, Math.min(MAX_QTY, Math.floor(qty)));
      if (q === 0) return prev.filter((i) => i.slug !== slug);
      return prev.some((i) => i.slug === slug)
        ? prev.map((i) => (i.slug === slug ? { ...i, qty: q } : i))
        : [...prev, { slug, qty: q }];
    });
  }, []);

  const add = useCallback((slug: string, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === slug);
      const q = Math.min(MAX_QTY, (existing?.qty ?? 0) + qty);
      return existing ? prev.map((i) => (i.slug === slug ? { ...i, qty: q } : i)) : [...prev, { slug, qty: q }];
    });
  }, []);

  const remove = useCallback((slug: string) => setItems((prev) => prev.filter((i) => i.slug !== slug)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, count: items.reduce((n, i) => n + i.qty, 0), ready, add, setQty, remove, clear }),
    [items, ready, add, setQty, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
