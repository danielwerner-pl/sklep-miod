import data from '@/data/products.json';

export type Category = 'miod' | 'pylek' | 'propolis' | 'zestaw';

export type Product = {
  slug: string;
  name: string;
  category: Category;
  kind: string;
  origin: string;
  harvest: string;
  weight: string;
  /** Cena w groszach */
  price: number;
  image: string;
  short: string;
  description: string;
  notes: string[];
  soldOut: boolean;
};

// Na start produkty są w JSON-ie w repo; docelowo ten moduł będzie czytał z Sanity.
// Przy eksporcie na GitHub Pages ścieżki zdjęć potrzebują prefiksu basePath.
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const products = (data as Product[]).map((p) => ({ ...p, image: base + p.image }));

export const categoryLabels: Record<Category, string> = {
  miod: 'Miody',
  pylek: 'Pyłek',
  propolis: 'Propolis',
  zestaw: 'Zestawy',
};

export function getProducts() {
  return products;
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

const pln = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' });

export function formatPrice(grosze: number) {
  return pln.format(grosze / 100);
}
