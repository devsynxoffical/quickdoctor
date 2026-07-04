import prisma from '../config/db';
import { ensureZoomMeetingForAppointment } from './zoomService';
import { notifyBookingConfirmed } from './notificationService';
import { logAudit } from './auditService';

export async function finalizeConfirmedAppointment(appointmentId: string, actorId?: string) {
  const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
  if (!appointment) return;

  if (appointment.serviceType === 'VIDEO_CONSULTATION') {
    await ensureZoomMeetingForAppointment(appointmentId);
  }

  await notifyBookingConfirmed(appointmentId);
  await logAudit({
    actorId,
    action: 'APPOINTMENT_CONFIRMED',
    entityType: 'Appointment',
    entityId: appointmentId,
  });
}

export async function releaseExpiredPaymentHolds() {
  const now = new Date();
  const expired = await prisma.appointment.findMany({
    where: {
      status: 'PENDING_PAYMENT',
      holdExpiresAt: { lt: now },
    },
    select: { id: true },
  });

  if (expired.length === 0) return 0;

  await prisma.appointment.updateMany({
    where: { id: { in: expired.map((e) => e.id) } },
    data: { status: 'CANCELLED' },
  });

  return expired.length;
}
