import prisma from '../config/db';
import type { AppointmentStatus } from '@prisma/client';

/** Statuses that actually occupy a doctor's calendar slot. */
export const SLOT_OCCUPIED_STATUSES: AppointmentStatus[] = ['CONFIRMED', 'PENDING', 'COMPLETED'];

export async function findOccupiedSlotConflict(
  doctorId: string,
  dateTime: Date,
  excludeAppointmentId?: string
) {
  return prisma.appointment.findFirst({
    where: {
      doctorId,
      dateTime,
      status: { in: SLOT_OCCUPIED_STATUSES },
      ...(excludeAppointmentId ? { id: { not: excludeAppointmentId } } : {}),
    },
  });
}
