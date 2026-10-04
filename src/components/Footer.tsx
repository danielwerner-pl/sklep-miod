import Link from 'next/link';
import { site } from '@/lib/site';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-cream/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 font-serif text-2xl text-cream">
            <Logo className="h-7 w-7 text-honey-light" />
            {site.name}
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            Miód z rodzinnej pasieki, rozlewany ręcznie i wysyłany prosto do Ciebie. Bez pośredników i bez podgrzewania.
          </p>
        </div>
        <div className="text-sm">
          <h2 className="font-medium text-cream">Sklep</h2>
          <ul className="mt-3 space-y-2">
            <li><Link href="/sklep" className="hover:text-cream">Wszystkie produkty</Link></li>
            <li><Link href="/koszyk" className="hover:text-cream">Koszyk</Link></li>
            <li><Link href="/zdjecia" className="hover:text-cream">Źródła zdjęć</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <h2 className="font-medium text-cream">Kontakt</h2>
          <ul className="mt-3 space-y-2">
            <li>{site.email}</li>
            <li>{site.phone}</li>
            <li>Wysyłka: Paczkomaty i Kurier InPost</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <p className="mx-auto max-w-7xl px-5 py-5 text-xs text-cream/50 sm:px-8">
          Prototyp – teksty, ceny i zdjęcia przykładowe. Płatności w trybie testowym Stripe.
        </p>
      </div>
    </footer>
  );
}
