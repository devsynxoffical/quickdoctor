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

function formatTime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function parseBookingDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function generateSlotsForDay(
  availability: WeeklySlot | undefined,
  date: Date,
  bookedTimes: Date[]
): string[] {
  if (!availability) return [];

  const day = date.getDay();
  if (availability.dayOfWeek !== day) return [];

  const start = parseTime(availability.startTime);
  const end = parseTime(availability.endTime);
  const step = availability.slotMinutes;
  const slots: string[] = [];
  const now = new Date();

  for (let t = start; t + step <= end; t += step) {
    const slotDate = new Date(date);
    slotDate.setHours(Math.floor(t / 60), t % 60, 0, 0);
    if (slotDate <= now) continue;

    const isBooked = bookedTimes.some((b) => new Date(b).getTime() === slotDate.getTime());
    if (!isBooked) {
      slots.push(slotDate.toISOString());
    }
  }

  return slots;
}

export function combineDateAndSlot(dateStr: string, isoSlot: string): Date {
  const d = new Date(dateStr);
  const s = new Date(isoSlot);
  d.setHours(s.getHours(), s.getMinutes(), 0, 0);
  return d;
}
