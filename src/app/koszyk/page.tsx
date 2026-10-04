import type { Metadata } from 'next';
import { CartView } from '@/components/CartView';
import { getProducts } from '@/lib/products';

export const metadata: Metadata = { title: 'Koszyk', robots: { index: false } };

export default function CartPage() {
  const products = getProducts().map(({ slug, name, price, image, weight, soldOut }) => ({ slug, name, price, image, weight, soldOut }));
  return (
    <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20">
      <h1 className="font-serif text-5xl tracking-tight">Koszyk</h1>
      <CartView products={products} />
    </div>
  );
}
