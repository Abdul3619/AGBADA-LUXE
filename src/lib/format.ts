import type { Currency } from './api';

const LOCALES: Record<Currency, string> = { NGN: 'en-NG', USD: 'en-US', GBP: 'en-GB', EUR: 'en-IE' };

export function formatPrice(price: number | null, currency: Currency): string {
  if (price === null || price === undefined) return 'Price on request';
  return new Intl.NumberFormat(LOCALES[currency] ?? 'en-NG', {
    style: 'currency',
    currency,
    minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export function formatDate(value: string, withTime = false): string {
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date(value);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  }).format(date);
}

/** Turns a WhatsApp number as typed by the owner (e.g. "+234 801 234 5678") into a wa.me link. */
export function whatsappLink(number: string, text?: string): string | null {
  const digits = number.replace(/[^\d]/g, '');
  if (digits.length < 7) return null;
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}

export function safeExternalUrl(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.href : null;
  } catch {
    return null;
  }
}
