/** Resend when RESEND_API_KEY is set; otherwise logs to console. */
import { APP_TIMEZONE_LABEL } from '../lib/appTime';

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}) {
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'QuickDoctor <noreply@quickdoctor.local>',
          to: params.to,
          subject: params.subject,
          html: params.html,
        }),
      });
      if (!res.ok) {
        console.warn('Resend error:', await res.text());
      }
      return;
    } catch (e) {
      console.warn('Resend failed:', e);
    }
  }

  console.log(`[email] To: ${params.to} | ${params.subject}`);
}

function emailLayout(title: string, body: string) {
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
      <h2 style="color:#0f172a">${title}</h2>
      ${body}
      <p style="color:#64748b;font-size:12px;margin-top:32px">QuickDoctor — online GP consultations</p>
    </div>
  `;
}

function appointmentDetailsBlock(details: {
  dateTime: string;
  timezoneLabel?: string;
  doctorName?: string;
  patientName?: string;
  fee?: string;
  reference?: string;
}) {
  const rows = [
    details.reference ? `<tr><td style="padding:6px 0;color:#64748b">Reference</td><td style="padding:6px 0;font-weight:bold">${details.reference}</td></tr>` : '',
    details.dateTime
      ? `<tr><td style="padding:6px 0;color:#64748b">Date &amp; time</td><td style="padding:6px 0;font-weight:bold">${details.dateTime}${details.timezoneLabel ? `<br><span style="font-size:12px;color:#64748b">${details.timezoneLabel}</span>` : ''}</td></tr>`
      : '',
    details.doctorName
      ? `<tr><td style="padding:6px 0;color:#64748b">Doctor</td><td style="padding:6px 0;font-weight:bold">${details.doctorName}</td></tr>`
      : '',
    details.patientName
      ? `<tr><td style="padding:6px 0;color:#64748b">Patient</td><td style="padding:6px 0;font-weight:bold">${details.patientName}</td></tr>`
      : '',
    details.fee
      ? `<tr><td style="padding:6px 0;color:#64748b">Fee paid</td><td style="padding:6px 0;font-weight:bold">${details.fee}</td></tr>`
      : '',
  ].join('');

  return `
    <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:12px;padding:16px;margin:16px 0">
      ${rows}
    </table>
  `;
}

export function registrationOtpEmail(params: { code: string; expiresMinutes: number }) {
  return emailLayout(
    'Verify your email',
    `<p>Use this code to complete your QuickDoctor registration:</p>
     <p style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#2563eb;margin:24px 0">${params.code}</p>
     <p style="color:#64748b;font-size:14px">This code expires in ${params.expiresMinutes} minutes. If you did not request this, you can ignore this email.</p>`
  );
}

export function welcomeEmail(params: {
  firstName: string;
  dashboardUrl: string;
  doctorsUrl: string;
}) {
  return emailLayout(
    'Welcome to QuickDoctor',
    `<p>Hi ${params.firstName},</p>
     <p>Your patient account is ready. You can now book video GP consultations, view prescriptions, and manage appointments online.</p>
     <p><a href="${params.doctorsUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Find a doctor</a></p>
     <p style="font-size:13px;color:#64748b">Manage your care anytime from your <a href="${params.dashboardUrl}">patient dashboard</a>.</p>`
  );
}

export function bookingConfirmedEmail(params: {
  patientFirstName: string;
  doctorName: string;
  dateTime: string;
  timezoneLabel?: string;
  fee?: string;
  reference?: string;
  joinUrl?: string | null;
  password?: string | null;
  dashboardUrl: string;
}) {
  const joinBlock = params.joinUrl
    ? `<p><a href="${params.joinUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Join video consultation</a></p>${
        params.password
          ? `<p style="font-size:13px;color:#64748b">Meeting password: <strong>${params.password}</strong></p>`
          : ''
      }`
    : `<p>Your video link will be available on your <a href="${params.dashboardUrl}">appointments page</a> shortly before the consultation.</p>`;

  return emailLayout(
    'Appointment confirmed',
    `<p>Hi ${params.patientFirstName},</p>
     <p>Thank you for your payment. Your video consultation is confirmed.</p>
     ${appointmentDetailsBlock({
       reference: params.reference,
       dateTime: params.dateTime,
       timezoneLabel: params.timezoneLabel || APP_TIMEZONE_LABEL,
       doctorName: params.doctorName,
       fee: params.fee,
     })}
     ${joinBlock}
     <p style="font-size:13px;color:#64748b">Join opens 5 minutes before your scheduled time. All times are in ${params.timezoneLabel || APP_TIMEZONE_LABEL}.</p>`
  );
}

export function doctorNewBookingEmail(params: {
  doctorName: string;
  patientName: string;
  dateTime: string;
  timezoneLabel?: string;
  fee?: string;
  reference?: string;
  consultationUrl: string;
  hostJoinUrl?: string | null;
}) {
  const joinBlock = params.hostJoinUrl
    ? `<p><a href="${params.hostJoinUrl}" style="display:inline-block;background:#059669;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Start meeting</a></p>`
    : '';

  return emailLayout(
    'New appointment booked',
    `<p>Hi ${params.doctorName},</p>
     <p>A patient has booked and paid for a consultation.</p>
     ${appointmentDetailsBlock({
       reference: params.reference,
       dateTime: params.dateTime,
       timezoneLabel: params.timezoneLabel || APP_TIMEZONE_LABEL,
       patientName: params.patientName,
       fee: params.fee,
     })}
     ${joinBlock}
     <p><a href="${params.consultationUrl}">Open consultation room</a> for notes, prescriptions, and certificates.</p>
     <p style="font-size:13px;color:#64748b">Meeting time is in ${params.timezoneLabel || APP_TIMEZONE_LABEL}.</p>`
  );
}

export function prescriptionIssuedEmail(params: {
  patientFirstName: string;
  doctorName: string;
  recordsUrl: string;
}) {
  return emailLayout(
    'Prescription issued',
    `<p>Hi ${params.patientFirstName},</p>
     <p><strong>${params.doctorName}</strong> has issued a prescription for you.</p>
     <p style="background:#f8fafc;padding:12px;border-radius:8px">For Irish regulatory reasons, prescription details are not shown in your account. Once your doctor or our team send it to your designated pharmacy, we will email you a confirmation.</p>
     <p><a href="${params.recordsUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">View prescription status</a></p>`
  );
}

export function prescriptionSentToPharmacyEmail(params: {
  patientFirstName: string;
  pharmacyName: string;
  recordsUrl: string;
}) {
  return emailLayout(
    'Prescription sent to pharmacy',
    `<p>Hi ${params.patientFirstName},</p>
     <p>Your prescription has been sent to <strong>${params.pharmacyName}</strong>.</p>
     <p><a href="${params.recordsUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">View medical records</a></p>`
  );
}

export function certificateIssuedEmail(params: {
  patientFirstName: string;
  doctorName: string;
  reason: string;
  startDate: string;
  endDate: string;
  recordsUrl: string;
}) {
  return emailLayout(
    'Medical certificate ready',
    `<p>Hi ${params.patientFirstName},</p>
     <p><strong>${params.doctorName}</strong> has issued a medical certificate for you.</p>
     ${appointmentDetailsBlock({
       dateTime: `${params.startDate} – ${params.endDate}`,
       doctorName: params.doctorName,
     })}
     <p style="background:#f8fafc;padding:12px;border-radius:8px"><strong>Reason:</strong> ${params.reason}</p>
     <p><a href="${params.recordsUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Download certificate</a></p>`
  );
}

export function doctorApprovedEmail(params: {
  firstName: string;
  portalUrl: string;
  settingsUrl: string;
}) {
  return emailLayout(
    'Doctor application approved',
    `<p>Hi ${params.firstName},</p>
     <p>Your QuickDoctor application has been <strong>approved</strong>. You can now sign in to the doctor portal.</p>
     <p><a href="${params.portalUrl}" style="display:inline-block;background:#059669;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Open doctor portal</a></p>
     <p style="font-size:13px">Before patients can book you, set your consultation fee and weekly availability in <a href="${params.settingsUrl}">Profile &amp; fees</a>.</p>`
  );
}

export function passwordResetEmail(params: { resetUrl: string }) {
  return emailLayout(
    'Reset your password',
    `<p>You requested a password reset for your QuickDoctor account.</p>
     <p><a href="${params.resetUrl}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold">Reset password</a></p>
     <p style="color:#64748b;font-size:14px">This link expires in 1 hour. If you did not request this, you can ignore this email.</p>`
  );
}

export function temporaryPasswordEmail(params: {
  firstName: string;
  email: string;
  tempPassword: string;
  loginUrl: string;
}) {
  return emailLayout(
    'Your QuickDoctor account',
    `<p>Hi ${params.firstName},</p>
     <p>We created a patient account so you can complete your booking. Use these details to sign in anytime:</p>
     <p style="background:#f8fafc;padding:12px;border-radius:8px">
       <strong>Email:</strong> ${params.email}<br>
       <strong>Temporary password:</strong> ${params.tempPassword}
     </p>
     <p><a href="${params.loginUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Sign in</a></p>
     <p style="color:#64748b;font-size:14px">Please change your password after signing in.</p>`
  );
}

export function doctorRejectedEmail(params: {
  firstName: string;
  reason: string;
  applyUrl: string;
}) {
  return emailLayout(
    'Doctor application update',
    `<p>Hi ${params.firstName},</p>
     <p>Unfortunately your QuickDoctor doctor application was not approved at this time.</p>
     <p><strong>Reason:</strong> ${params.reason}</p>
     <p>If you have questions, contact support or <a href="${params.applyUrl}">submit updated information</a>.</p>`
  );
}

export function serviceOrderConfirmedEmail(params: {
  patientFirstName: string;
  serviceLabel: string;
  fee: string;
  reference: string;
  dashboardUrl: string;
  recordsUrl: string;
  isCertificate: boolean;
}) {
  const outcome = params.isCertificate
    ? 'Your certificate will be emailed after GP approval (usually within 1 business day).'
    : 'If suitable, your prescription will appear in your medical records after GP review.';

  return emailLayout(
    'Payment confirmed',
    `<p>Hi ${params.patientFirstName},</p>
     <p>Thank you for your payment. Your <strong>${params.serviceLabel}</strong> request is now with our GP team.</p>
     ${appointmentDetailsBlock({
       reference: params.reference,
       dateTime: 'Review in progress',
       fee: params.fee,
     })}
     <p>${outcome}</p>
     <p><a href="${params.dashboardUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">View my requests</a></p>
     <p style="font-size:13px;color:#64748b">Issued documents will also appear on your <a href="${params.recordsUrl}">medical records</a> page.</p>`
  );
}

export function doctorServiceRequestEmail(params: {
  doctorName: string;
  patientName: string;
  serviceLabel: string;
  fee: string;
  reference: string;
  consultationUrl: string;
}) {
  return emailLayout(
    'New paid service request',
    `<p>Hi ${params.doctorName},</p>
     <p><strong>${params.patientName}</strong> has paid for a <strong>${params.serviceLabel}</strong> review.</p>
     ${appointmentDetailsBlock({
       reference: params.reference,
       dateTime: 'Awaiting review',
       patientName: params.patientName,
       fee: params.fee,
     })}
     <p><a href="${params.consultationUrl}" style="display:inline-block;background:#059669;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Review questionnaire</a></p>
     <p style="font-size:13px;color:#64748b">Open the consultation room to read answers and issue a prescription or certificate.</p>`
  );
}
