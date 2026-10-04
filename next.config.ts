import type { NextConfig } from 'next';

// GITHUB_PAGES=1: statyczny eksport w trybie demo (bez API i Stripe) pod danielwerner-pl.github.io/sklep-miod.
const pages = process.env.GITHUB_PAGES === '1';
const basePath = pages ? '/sklep-miod' : '';

const nextConfig: NextConfig = {
  ...(pages ? { output: 'export', basePath, trailingSlash: true } : { output: 'standalone' }),
  env: {
    NEXT_PUBLIC_STATIC_DEMO: pages ? '1' : '',
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: pages,
    formats: ['image/avif', 'image/webp'],
    qualities: [70, 75],
  },
  experimental: {
    // CSS w <head> zamiast osobnego pliku: brak zasobu blokującego render (PageSpeed).
    inlineCss: true,
  },
};

export default nextConfig;
