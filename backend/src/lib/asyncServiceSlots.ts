import crypto from 'crypto';
import type { Prisma } from '@prisma/client';
import prisma from '../config/db';
import { findOccupiedSlotConflict } from './appointmentSlots';

export type ServiceCapability =
  | 'VIDEO_CONSULTATION'
  | 'MEDICAL_CERTIFICATE'
  | 'PRESCRIPTION_REVIEW';

/**
 * Doctor categories for auto-assignment:
 * - General Physician (`offersVideoConsultation`): consultations + any booking type
 * - Prescriber (`offersPrescriptionReview`): prescription bookings
 * - Certificate issuer (`offersMedicalCertificate`): certificate bookings
 */
function capableDoctorWhere(capability: ServiceCapability): Prisma.DoctorWhereInput {
  const base: Prisma.DoctorWhereInput = {
    status: 'APPROVED',
    profileComplete: true,
    user: { isActive: true },
  };

  if (capability === 'VIDEO_CONSULTATION') {
    return { ...base, offersVideoConsultation: true };
  }

  if (capability === 'MEDICAL_CERTIFICATE') {
    return {
      ...base,
      OR: [{ offersMedicalCertificate: true }, { offersVideoConsultation: true }],
    };
  }

  return {
    ...base,
    OR: [{ offersPrescriptionReview: true }, { offersVideoConsultation: true }],
  };
}

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

export async function listCapableDoctorIds(
  capability: ServiceCapability,
  take = 20
): Promise<string[]> {
  const configured = process.env.DEFAULT_SERVICE_DOCTOR_ID?.trim();
  const doctors = await prisma.doctor.findMany({
    where: capableDoctorWhere(capability),
    orderBy: { lastName: 'asc' },
    take,
    select: { id: true },
  });

  const ids = doctors.map((d) => d.id);
  if (configured && ids.includes(configured)) {
    return [configured, ...ids.filter((id) => id !== configured)];
  }
  return ids;
}

export async function pickServiceDoctorId(capability: ServiceCapability): Promise<string> {
  const configured = process.env.DEFAULT_SERVICE_DOCTOR_ID?.trim();
  if (configured) {
    const doctor = await prisma.doctor.findFirst({
      where: { id: configured, ...capableDoctorWhere(capability) },
    });
    if (doctor) return doctor.id;
  }

  const doctor = await prisma.doctor.findFirst({
    where: capableDoctorWhere(capability),
    orderBy: { lastName: 'asc' },
  });

  if (!doctor) {
    throw new Error('No doctor is available to review requests. Please try again later.');
  }

  return doctor.id;
}
