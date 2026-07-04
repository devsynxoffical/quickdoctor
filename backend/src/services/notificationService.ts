import { APP_TIMEZONE_LABEL, formatAppDate, formatAppDateTime } from '../lib/appTime';
import prisma from '../config/db';
import {
  sendEmail,
  bookingConfirmedEmail,
  doctorNewBookingEmail,
  prescriptionIssuedEmail,
  certificateIssuedEmail,
} from './emailService';

function frontendBase() {
  const raw = process.env.FRONTEND_URL || 'http://localhost:3000';
  return raw.split(',')[0].trim().replace(/\/$/, '');
}

function formatFee(cents: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('en-IE', { style: 'currency', currency }).format(cents / 100);
}

function appointmentReference(id: string): string {
  return id.slice(0, 8).toUpperCase();
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
  const when = formatAppDateTime(appointment.dateTime);
  const base = frontendBase();
  const dashboardUrl = `${base}/dashboard/appointments`;
  const consultationUrl = `${base}/doctor/consultations/room?id=${appointment.id}`;
  const reference = appointmentReference(appointment.id);
  const fee = formatFee(appointment.priceCents);

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
        timezoneLabel: APP_TIMEZONE_LABEL,
        fee,
        reference,
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
      link: `/doctor/consultations/room?id=${appointment.id}`,
      email: {
        to: doctorUser.email,
        subject: 'New patient booking — QuickDoctor',
        html: doctorNewBookingEmail({
          doctorName: appointment.doctor.firstName,
          patientName,
          dateTime: when,
          timezoneLabel: APP_TIMEZONE_LABEL,
          fee,
          reference,
          consultationUrl,
          hostJoinUrl: doctorHostUrl,
        }),
      },
    });
  }
}

export async function notifyPrescriptionIssued(patientUserId: string, appointmentId: string) {
  const prescription = await prisma.prescription.findUnique({
    where: { appointmentId },
    include: {
      patient: { include: { user: true } },
      appointment: { include: { doctor: true } },
    },
  });

  if (!prescription?.patient?.user || prescription.patient.user.id !== patientUserId) {
    await createNotification({
      userId: patientUserId,
      type: 'PRESCRIPTION_ISSUED',
      title: 'New prescription available',
      body: 'Your doctor has issued a prescription. View it in your medical records.',
      link: '/dashboard/records',
    });
    return;
  }

  const base = frontendBase();
  const doctorName = `Dr. ${prescription.appointment.doctor.firstName} ${prescription.appointment.doctor.lastName}`;

  await createNotification({
    userId: patientUserId,
    type: 'PRESCRIPTION_ISSUED',
    title: 'New prescription available',
    body: 'Your doctor has issued a prescription. View it in your medical records.',
    link: '/dashboard/records',
    email: {
      to: prescription.patient.user.email,
      subject: 'New prescription — QuickDoctor',
      html: prescriptionIssuedEmail({
        patientFirstName: prescription.patient.firstName,
        doctorName,
        medications: prescription.medications,
        recordsUrl: `${base}/dashboard/records`,
      }),
    },
  });
}

export async function notifyCertificateIssued(patientUserId: string, appointmentId: string) {
  const certificate = await prisma.medicalCertificate.findUnique({
    where: { appointmentId },
    include: {
      patient: { include: { user: true } },
      appointment: { include: { doctor: true } },
    },
  });

  if (!certificate?.patient?.user || certificate.patient.user.id !== patientUserId) {
    await createNotification({
      userId: patientUserId,
      type: 'CERTIFICATE_ISSUED',
      title: 'Medical certificate ready',
      body: 'Your medical certificate is available in your medical records.',
      link: '/dashboard/records',
    });
    return;
  }

  const base = frontendBase();
  const doctorName = `Dr. ${certificate.appointment.doctor.firstName} ${certificate.appointment.doctor.lastName}`;

  await createNotification({
    userId: patientUserId,
    type: 'CERTIFICATE_ISSUED',
    title: 'Medical certificate ready',
    body: 'Your medical certificate is available in your medical records.',
    link: '/dashboard/records',
    email: {
      to: certificate.patient.user.email,
      subject: 'Medical certificate ready — QuickDoctor',
      html: certificateIssuedEmail({
        patientFirstName: certificate.patient.firstName,
        doctorName,
        reason: certificate.reason,
        startDate: formatAppDate(certificate.startDate),
        endDate: formatAppDate(certificate.endDate),
        recordsUrl: `${base}/dashboard/records`,
      }),
    },
  });
}
