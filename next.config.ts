import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [70, 75],
  },
  experimental: {
    // CSS w <head> zamiast osobnego pliku: brak zasobu blokującego render (PageSpeed).
    inlineCss: true,
  },
};

export default nextConfig;
