import prisma from '../config/db';
import { sendEmail } from './emailService';

export async function createNotification(params: {
  userId: string;
  type: string;
  title: string;
  body: string;
  link?: string;
  email?: { to: string; subject: string; html: string };
}) {
  await prisma.notification.create({
    data: {
      userId: params.userId,
      type: params.type,
      title: params.title,
      body: params.body,
      link: params.link,
    },
  });

  if (params.email) {
    await sendEmail({
      to: params.email.to,
      subject: params.email.subject,
      html: params.email.html,
    });
  }
}

export async function notifyBookingConfirmed(appointmentId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      patient: { include: { user: true } },
      doctor: true,
    },
  });

  if (!appointment?.patient?.user) return;

  const doctorName = `Dr. ${appointment.doctor.lastName}`;
  const when = new Date(appointment.dateTime).toLocaleString();
  const joinLink = appointment.zoomJoinUrlPatient
    ? `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/appointments`
    : undefined;

  await createNotification({
    userId: appointment.patient.user.id,
    type: 'BOOKING_CONFIRMED',
    title: 'Appointment confirmed',
    body: `Your consultation with ${doctorName} on ${when} is confirmed.`,
    link: '/dashboard/appointments',
    email: {
      to: appointment.patient.user.email,
      subject: 'Appointment confirmed — QuickDoctor',
      html: `<p>Hi ${appointment.patient.firstName},</p><p>Your consultation with ${doctorName} is confirmed for ${when}.</p>`,
    },
  });

  const doctorUser = await prisma.user.findUnique({
    where: { id: appointment.doctor.userId },
  });
  if (doctorUser) {
    await createNotification({
      userId: doctorUser.id,
      type: 'NEW_BOOKING',
      title: 'New appointment booked',
      body: `${appointment.patient.firstName} ${appointment.patient.lastName} booked for ${when}.`,
      link: `/doctor/consultations/${appointment.id}`,
    });
  }
}

export async function notifyPrescriptionIssued(patientUserId: string, appointmentId: string) {
  await createNotification({
    userId: patientUserId,
    type: 'PRESCRIPTION_ISSUED',
    title: 'New prescription available',
    body: 'Your doctor has issued a prescription. View it in your medical records.',
    link: '/dashboard/records',
  });
}
