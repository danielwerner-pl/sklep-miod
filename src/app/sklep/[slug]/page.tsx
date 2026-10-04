import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AddToCart } from '@/components/AddToCart';
import { ProductCard } from '@/components/ProductCard';
import { formatPrice, getProduct, getProducts } from '@/lib/products';
import { FREE_SHIPPING_FROM } from '@/lib/shipping';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProduct((await params).slug);
  return product ? { title: product.name, description: product.short } : {};
}

export default async function ProductPage({ params }: Props) {
  const product = getProduct((await params).slug);
  if (!product) notFound();

  const related = getProducts()
    .filter((p) => p.slug !== product.slug && !p.soldOut)
    .slice(0, 4);

  const facts = [
    ['Rodzaj', product.kind],
    ['Pochodzenie', product.origin],
    ['Zbiór', product.harvest],
    ['Waga', product.weight],
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-16">
      <nav className="text-sm text-ink-soft" aria-label="Okruszki">
        <Link href="/sklep" className="hover:text-ink">Sklep</Link> <span aria-hidden>/</span>{' '}
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-wax">
          <Image src={product.image} alt={product.name} fill priority fetchPriority="high" quality={70} sizes="(min-width: 1024px) 50vw, calc(100vw - 40px)" className="object-cover" />
        </div>

        <div className="lg:py-6">
          <p className="eyebrow">{product.kind}</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">{product.name}</h1>
          <p className="mt-4 text-lg text-ink-soft">{product.short}</p>
          <p className="mt-6 font-serif text-3xl">{formatPrice(product.price)}</p>
          <p className="mt-1 text-sm text-ink-soft">{product.weight} · cena brutto</p>

          <div className="mt-8">
            <AddToCart slug={product.slug} soldOut={product.soldOut} />
          </div>

          <ul className="mt-6 space-y-1.5 text-sm text-ink-soft">
            <li>✓ Wysyłka w 24 h do paczkomatu InPost lub kurierem</li>
            <li>✓ Darmowa dostawa od {formatPrice(FREE_SHIPPING_FROM)}</li>
            <li>✓ Płatność BLIK, Przelewy24 lub kartą</li>
          </ul>

          <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10">
            {facts.map(([k, v]) => (
              <div key={k} className="bg-cream p-4">
                <dt className="text-xs uppercase tracking-wider text-ink-soft">{k}</dt>
                <dd className="mt-1 font-medium">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10">
            <h2 className="font-serif text-2xl">O produkcie</h2>
            <p className="mt-3 leading-relaxed text-ink-soft">{product.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {product.notes.map((n) => (
                <span key={n} className="rounded-full bg-wax px-3 py-1 text-sm">
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="mt-24">
        <h2 className="font-serif text-3xl">Może Cię zainteresować</h2>
        <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
