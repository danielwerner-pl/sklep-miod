import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, type Product } from '@/lib/products';

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  return (
    <Link href={`/sklep/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-wax">
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority={priority}
          fetchPriority={priority ? 'high' : undefined}
          quality={70}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, calc(100vw - 40px)"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        {product.soldOut && (
          <span className="absolute left-3 top-3 rounded-full bg-cream/95 px-3 py-1 text-xs font-medium">
            Wyprzedane
          </span>
        )}
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-serif text-xl leading-tight">{product.name}</h3>
        <span className="shrink-0 text-sm font-medium">{formatPrice(product.price)}</span>
      </div>
      <p className="mt-1 text-sm text-ink-soft">
        {product.weight} · {product.harvest}
      </p>
    </Link>
  );
}
