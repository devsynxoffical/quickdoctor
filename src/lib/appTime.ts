/** Canonical timezone for all scheduling and displayed appointment times. */
export const APP_TIMEZONE = 'Europe/Warsaw';
export const APP_TIMEZONE_LABEL = 'Poland time (CET/CEST)';

type DateInput = Date | string | number;

function toDate(value: DateInput): Date {
  return value instanceof Date ? value : new Date(value);
}

export function formatAppDateTime(value: DateInput): string {
  return toDate(value).toLocaleString('en-GB', {
    timeZone: APP_TIMEZONE,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatAppTime(value: DateInput): string {
  return toDate(value).toLocaleTimeString('en-GB', {
    timeZone: APP_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatAppDate(value: DateInput): string {
  return toDate(value).toLocaleDateString('en-GB', {
    timeZone: APP_TIMEZONE,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatAppDateLong(value: DateInput): string {
  return toDate(value).toLocaleDateString('en-GB', {
    timeZone: APP_TIMEZONE,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function bookingDayOfWeek(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}
