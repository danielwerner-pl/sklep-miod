import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FBF6EC',
        wax: '#F3E7CF',
        honey: { DEFAULT: '#D8961C', light: '#F2C14E', dark: '#9A5B0B' },
        ink: { DEFAULT: '#2B1D0E', soft: '#5C4A36' },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
