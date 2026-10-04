import Link from 'next/link';
import { site } from '@/lib/site';
import { CartLink } from './CartLink';
import { Logo } from './Logo';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 font-serif text-xl tracking-tight">
          <Logo className="h-7 w-7 text-honey" />
          {site.name}
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-ink-soft md:flex">
          <Link href="/sklep" className="hover:text-ink">Sklep</Link>
          <Link href="/#historia" className="hover:text-ink">O pasiece</Link>
          <Link href="/#od-ula-do-sloika" className="hover:text-ink">Od ula do słoika</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/sklep" className="text-sm text-ink-soft hover:text-ink md:hidden">Sklep</Link>
          <CartLink />
        </div>
      </div>
    </header>
  );
}
