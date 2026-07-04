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

/** Wall-clock minutes from midnight on a calendar date in APP_TIMEZONE → UTC Date. */
export function wallTimeInAppTz(dateStr: string, timeMinutes: number): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  const hh = Math.floor(timeMinutes / 60);
  const mm = timeMinutes % 60;

  let utcMs = Date.UTC(y, m - 1, d, hh, mm, 0, 0);
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: APP_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const read = (ms: number) => {
    const parts = formatter.formatToParts(new Date(ms));
    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '0';
    return {
      y: Number(get('year')),
      m: Number(get('month')),
      d: Number(get('day')),
      h: Number(get('hour') === '24' ? '0' : get('hour')),
      min: Number(get('minute')),
    };
  };

  for (let i = 0; i < 4; i++) {
    const got = read(utcMs);
    const diffMin =
      (y - got.y) * 525600 +
      (m - got.m) * 43200 +
      (d - got.d) * 1440 +
      (hh - got.h) * 60 +
      (mm - got.min);
    if (diffMin === 0) break;
    utcMs -= diffMin * 60_000;
  }

  return new Date(utcMs);
}

export function startOfAppDay(dateStr: string): Date {
  return wallTimeInAppTz(dateStr, 0);
}

export function endOfAppDay(dateStr: string): Date {
  return new Date(wallTimeInAppTz(dateStr, 23 * 60 + 59).getTime() + 59_999);
}
