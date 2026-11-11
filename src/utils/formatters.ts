// src/utils/formatters.ts

export type Currency = 'VES' | 'USD';

export function formatMoney(amount: number, currency: Currency): string {
  return new Intl.NumberFormat(currency === 'VES' ? 'es-VE' : 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
