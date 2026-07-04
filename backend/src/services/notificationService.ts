import prisma from '../config/db';
import {
  sendEmail,
  bookingConfirmedEmail,
  doctorNewBookingEmail,
} from './emailService';

function frontendBase() {
  const raw = process.env.FRONTEND_URL || 'http://localhost:3000';
  return raw.split(',')[0].trim().replace(/\/$/, '');
}

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
      doctor: { include: { user: true } },
    },
  });

  if (!appointment?.patient?.user) return;

  const doctorName = `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`;
  const patientName = `${appointment.patient.firstName} ${appointment.patient.lastName}`;
  const when = new Date(appointment.dateTime).toLocaleString();
  const base = frontendBase();
  const dashboardUrl = `${base}/dashboard/appointments`;
  const consultationUrl = `${base}/doctor/consultations/${appointment.id}`;

  const patientJoinUrl = appointment.zoomJoinUrlPatient;
  const doctorHostUrl = appointment.zoomJoinUrlHost;

  await createNotification({
    userId: appointment.patient.user.id,
    type: 'BOOKING_CONFIRMED',
    title: 'Appointment confirmed',
    body: `Your consultation with ${doctorName} on ${when} is confirmed.`,
    link: '/dashboard/appointments',
    email: {
      to: appointment.patient.user.email,
      subject: 'Appointment confirmed — QuickDoctor',
      html: bookingConfirmedEmail({
        patientFirstName: appointment.patient.firstName,
        doctorName,
        dateTime: when,
        joinUrl: patientJoinUrl,
        password: appointment.zoomPassword,
        dashboardUrl,
      }),
    },
  });

  const doctorUser = appointment.doctor.user;
  if (doctorUser) {
    await createNotification({
      userId: doctorUser.id,
      type: 'NEW_BOOKING',
      title: 'New appointment booked',
      body: `${patientName} booked for ${when}.`,
      link: `/doctor/consultations/${appointment.id}`,
      email: {
        to: doctorUser.email,
        subject: 'New patient booking — QuickDoctor',
        html: doctorNewBookingEmail({
          doctorName: appointment.doctor.firstName,
          patientName,
          dateTime: when,
          consultationUrl,
          hostJoinUrl: doctorHostUrl,
        }),
      },
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

export async function notifyCertificateIssued(patientUserId: string, _appointmentId: string) {
  await createNotification({
    userId: patientUserId,
    type: 'CERTIFICATE_ISSUED',
    title: 'Medical certificate ready',
    body: 'Your medical certificate is available in your medical records.',
    link: '/dashboard/records',
  });
}
