import crypto from 'crypto';
import prisma from '../config/db';
import { findOccupiedSlotConflict } from './appointmentSlots';

/** Placeholder calendar slot for async certificate/prescription reviews (not a live video slot). */
export async function reserveAsyncReviewSlot(doctorId: string): Promise<Date> {
  const base = new Date();
  base.setSeconds(0, 0);
  base.setMinutes(base.getMinutes() + 1);

  for (let attempt = 0; attempt < 120; attempt++) {
    const candidate = new Date(base.getTime() + attempt * 60_000 + crypto.randomInt(0, 45_000));
    candidate.setMilliseconds(0);
    const conflict = await findOccupiedSlotConflict(doctorId, candidate);
    if (!conflict) return candidate;
  }

  return new Date(base.getTime() + crypto.randomInt(10_000, 600_000));
}

export async function pickServiceDoctorId(): Promise<string> {
  const configured = process.env.DEFAULT_SERVICE_DOCTOR_ID?.trim();
  if (configured) {
    const doctor = await prisma.doctor.findFirst({
      where: {
        id: configured,
        status: 'APPROVED',
        profileComplete: true,
        user: { isActive: true },
      },
    });
    if (doctor) return doctor.id;
  }

  const doctor = await prisma.doctor.findFirst({
    where: { status: 'APPROVED', profileComplete: true, user: { isActive: true } },
    orderBy: { lastName: 'asc' },
  });

  if (!doctor) {
    throw new Error('No doctor is available to review requests. Please try again later.');
  }

  return doctor.id;
}
