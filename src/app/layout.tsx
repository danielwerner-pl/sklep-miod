import type { Metadata, Viewport } from 'next';
import { Fraunces } from 'next/font/google';
import { CartProvider } from '@/components/CartProvider';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { site } from '@/lib/site';
import './globals.css';

// Nagłówki: statyczny Fraunces (bez pełnego fontu zmiennego). Tekst ciągły: font systemowy – 0 KB do pobrania.
const serif = Fraunces({
  subsets: ['latin', 'latin-ext'],
  weight: ['400'],
  style: ['normal'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: `${site.name} – ${site.tagline}`, template: `%s | ${site.name}` },
  description: 'Miody odmianowe, pyłek i propolis z rodzinnej pasieki. Wysyłka do paczkomatu InPost, płatność BLIK.',
};

export const viewport: Viewport = { themeColor: '#FBF6EC' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={serif.variable}>
      <body className="font-sans">
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
