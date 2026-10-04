# Sklep z miodem – prototyp

Next.js 15 (App Router) + Tailwind. Teksty, ceny i zdjęcia są przykładowe.

```bash
npm install
npm run dev        # http://localhost:3000
```

## Tryb demo (domyślny)

Bez `.env.local` sklep działa w pełni poza płatnością: „Przejdź do płatności” prowadzi od razu
na stronę potwierdzenia z dopiskiem „Tryb demo”. Paczkomat wpisuje się ręcznie (kod, np. `KRA01M`).

## Wersja demo na GitHub Pages

https://danielwerner-pl.github.io/sklep-miod/ – budowana automatycznie po każdym pushu na `main`
([workflow](.github/workflows/pages.yml)). To statyczny eksport (`GITHUB_PAGES=1`): bez tras API,
płatność zawsze kończy się potwierdzeniem demo, zdjęcia bez optymalizacji Next.js.

## Później

- **Stripe:** skopiuj `.env.example` → `.env.local`, wpisz `sk_test_…`. Checkout: BLIK, Przelewy24, karta (PLN).
  BLIK i P24 włącza się w panelu Stripe; jeśli nie są włączone, checkout wraca do samej karty.
  Webhook: `stripe listen --forward-to localhost:3000/api/stripe/webhook`.
- **E-maile:** `RESEND_API_KEY` + `SELLER_EMAIL`; bez klucza treść maili trafia do logu serwera.
- **InPost Geowidget:** `NEXT_PUBLIC_INPOST_GEOWIDGET_TOKEN` – zamiast pola tekstowego pojawi się mapa.
- **Produkty:** `src/data/products.json` (`soldOut: true` = „Wyprzedane”). Docelowo Sanity – podmiana w `src/lib/products.ts`.

## Struktura

- `src/app/page.tsx` – strona główna (hero, historia pasieki, „od ula do słoika”)
- `src/app/sklep/` – lista i karty produktów
- `src/app/koszyk/` + `src/components/CartView.tsx` – koszyk, dostawa, paczkomat
- `src/app/api/checkout/` – sesja Stripe Checkout (ceny liczone na serwerze)
- `src/app/api/stripe/webhook/` – e-maile po opłaceniu
- `src/app/zamowienie/potwierdzenie/` – potwierdzenie zamówienia
- `src/app/zdjecia/` – licencje zdjęć (Wikimedia Commons, CC/PD)
