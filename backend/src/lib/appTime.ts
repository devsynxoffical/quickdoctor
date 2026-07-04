/** Canonical timezone for all scheduling and displayed appointment times. */
export const APP_TIMEZONE = 'Europe/Warsaw';
export const APP_TIMEZONE_LABEL = 'Poland time (CET/CEST)';

type DateInput = Date | string | number;

function toDate(value: DateInput): Date {
  if (value instanceof Date) return value;
  if (typeof value === 'number') return new Date(value);
  const s = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?$/.test(s)) {
    return new Date(`${s}Z`);
  }
  return new Date(s);
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

function getTimezoneOffsetMs(date: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const parts = dtf.formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const hourPart = parts.find((p) => p.type === 'hour')?.value ?? '0';
  const hour = Number(hourPart === '24' ? '0' : hourPart);
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), hour, get('minute'), get('second'));
  return asUtc - date.getTime();
}

/** Wall-clock minutes from midnight on a calendar date in APP_TIMEZONE → UTC Date. */
export function wallTimeInAppTz(dateStr: string, timeMinutes: number): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  const hh = Math.floor(timeMinutes / 60);
  const mm = timeMinutes % 60;
  const utcGuess = Date.UTC(y, m - 1, d, hh, mm);
  const offset = getTimezoneOffsetMs(new Date(utcGuess), APP_TIMEZONE);
  const refined = getTimezoneOffsetMs(new Date(utcGuess - offset), APP_TIMEZONE);
  return new Date(utcGuess - refined);
}

export function startOfAppDay(dateStr: string): Date {
  return wallTimeInAppTz(dateStr, 0);
}

export function endOfAppDay(dateStr: string): Date {
  return new Date(wallTimeInAppTz(dateStr, 23 * 60 + 59).getTime() + 59_999);
}
