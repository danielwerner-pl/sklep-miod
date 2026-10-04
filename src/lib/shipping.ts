export type DeliveryMethod = 'paczkomat' | 'kurier';

export const FREE_SHIPPING_FROM = 30000;

export const deliveryOptions: Record<DeliveryMethod, { label: string; description: string; price: number; days: [number, number] }> = {
  paczkomat: {
    label: 'Paczkomat InPost',
    description: 'Odbiór 24/7 w wybranym paczkomacie',
    price: 1699,
    days: [1, 2],
  },
  kurier: {
    label: 'Kurier InPost',
    description: 'Dostawa pod wskazany adres',
    price: 2199,
    days: [1, 3],
  },
};

export function shippingCost(method: DeliveryMethod, subtotal: number) {
  return subtotal >= FREE_SHIPPING_FROM ? 0 : deliveryOptions[method].price;
}

export type Paczkomat = { name: string; address: string };
