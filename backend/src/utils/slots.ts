import { bookingDayOfWeek, wallTimeInAppTz } from '../lib/appTime';

export type WeeklySlot = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotMinutes: number;
};

function parseTime(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + (m || 0);
}

export function parseBookingDate(dateStr: string): Date {
  return wallTimeInAppTz(dateStr, 12 * 60);
}

export function generateSlotsForDay(
  availability: WeeklySlot | undefined,
  dateStr: string,
  bookedTimes: Date[]
): string[] {
  if (!availability) return [];

  const day = bookingDayOfWeek(dateStr);
  if (availability.dayOfWeek !== day) return [];

  const start = parseTime(availability.startTime);
  const end = parseTime(availability.endTime);
  const step = availability.slotMinutes;
  const slots: string[] = [];
  const now = new Date();

  for (let t = start; t + step <= end; t += step) {
    const slotDate = wallTimeInAppTz(dateStr, t);
    if (slotDate <= now) continue;

    const isBooked = bookedTimes.some((b) => new Date(b).getTime() === slotDate.getTime());
    if (!isBooked) {
      slots.push(slotDate.toISOString());
    }
  }

  return slots;
}
