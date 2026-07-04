import prisma from '../config/db';
import type { Appointment, AppointmentServiceType, AppointmentStatus, Prisma } from '@prisma/client';

/** Statuses that actually occupy a doctor's calendar slot. */
export const SLOT_OCCUPIED_STATUSES: AppointmentStatus[] = ['CONFIRMED', 'PENDING', 'COMPLETED'];

export class SlotTakenError extends Error {
  constructor() {
    super('This time slot is no longer available');
    this.name = 'SlotTakenError';
  }
}

export function normalizeSlotTime(dateTime: Date | string): Date {
  const slot = new Date(dateTime);
  slot.setMilliseconds(0);
  return slot;
}

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

/** Reuse an existing checkout row for this doctor/slot instead of violating @@unique. */
export async function prepareCheckoutAppointment(input: {
  patientId: string;
  doctorId: string;
  dateTime: Date;
  notes?: string;
  priceCents: number;
  holdExpiresAt: Date;
  serviceType?: AppointmentServiceType;
  serviceSlug?: string;
  serviceName?: string;
  requestPayload?: Prisma.InputJsonValue;
}): Promise<{ appointment: Appointment; reused: boolean }> {
  const existing = await prisma.appointment.findUnique({
    where: {
      doctorId_dateTime: {
        doctorId: input.doctorId,
        dateTime: input.dateTime,
      },
    },
    include: { payment: true },
  });

  if (existing && SLOT_OCCUPIED_STATUSES.includes(existing.status)) {
    throw new SlotTakenError();
  }

  if (existing) {
    const appointment = await prisma.appointment.update({
      where: { id: existing.id },
      data: {
        patientId: input.patientId,
        status: 'PENDING_PAYMENT',
        notes: input.notes,
        priceCents: input.priceCents,
        holdExpiresAt: input.holdExpiresAt,
        serviceType: input.serviceType,
        serviceSlug: input.serviceSlug,
        serviceName: input.serviceName,
        requestPayload: input.requestPayload,
      },
    });
    return { appointment, reused: true };
  }

  const appointment = await prisma.appointment.create({
    data: {
      patientId: input.patientId,
      doctorId: input.doctorId,
      dateTime: input.dateTime,
      status: 'PENDING_PAYMENT',
      notes: input.notes,
      priceCents: input.priceCents,
      holdExpiresAt: input.holdExpiresAt,
      serviceType: input.serviceType ?? 'VIDEO_CONSULTATION',
      serviceSlug: input.serviceSlug,
      serviceName: input.serviceName,
      requestPayload: input.requestPayload,
    },
  });

  return { appointment, reused: false };
}
