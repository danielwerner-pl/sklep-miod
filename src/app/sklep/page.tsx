import type { Metadata } from 'next';
import { ProductCard } from '@/components/ProductCard';
import { categoryLabels, getProducts, type Category } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Sklep',
  description: 'Miody odmianowe, pyłek pszczeli, propolis i zestawy prezentowe.',
};

const order: Category[] = ['miod', 'zestaw', 'pylek', 'propolis'];

export default function ShopPage() {
  const products = getProducts();
  const groups = order
    .map((c) => ({ category: c, items: products.filter((p) => p.category === c) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20">
      <p className="eyebrow">Sklep</p>
      <h1 className="mt-3 font-serif text-5xl tracking-tight sm:text-6xl">Z naszej pasieki</h1>
      <p className="mt-5 max-w-2xl text-lg text-ink-soft">
        Wszystkie miody są surowe, nieprzegrzewane i pochodzą z tegorocznych zbiorów. Wysyłamy w ciągu 24 godzin, szkło
        pakujemy w tekturę falistą.
      </p>
      <nav className="mt-8 flex flex-wrap gap-2" aria-label="Kategorie">
        {groups.map((g) => (
          <a key={g.category} href={`#${g.category}`} className="rounded-full border border-ink/15 px-4 py-1.5 text-sm hover:border-ink/40">
            {categoryLabels[g.category]}
          </a>
        ))}
      </nav>
      {groups.map((g, gi) => (
        <section key={g.category} id={g.category} className="mt-16 scroll-mt-20">
          <h2 className="font-serif text-3xl">{categoryLabels[g.category]}</h2>
          <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {g.items.map((p, i) => (
              <ProductCard key={p.slug} product={p} priority={gi === 0 && i < 2} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
