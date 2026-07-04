export const CERTIFICATE_PRICE_CENTS = 3000;
export const PRESCRIPTION_REVIEW_PRICE_CENTS = 2500;

export function formatServicePrice(cents: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('en-IE', { style: 'currency', currency }).format(cents / 100);
}
