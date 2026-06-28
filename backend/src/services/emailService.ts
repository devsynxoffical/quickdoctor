/** Resend when RESEND_API_KEY is set; otherwise logs to console. */

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

export function bookingConfirmedEmail(params: {
  patientFirstName: string;
  doctorName: string;
  dateTime: string;
  joinUrl?: string | null;
  password?: string | null;
  dashboardUrl: string;
}) {
  const joinBlock = params.joinUrl
    ? `<p><a href="${params.joinUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Join video consultation</a></p>${
        params.password ? `<p style="font-size:13px;color:#64748b">Meeting password: <strong>${params.password}</strong></p>` : ''
      }`
    : `<p>Your video link will be available on your <a href="${params.dashboardUrl}">appointments page</a> shortly before the consultation.</p>`;

  return emailLayout(
    'Appointment confirmed',
    `<p>Hi ${params.patientFirstName},</p>
     <p>Your video consultation with <strong>${params.doctorName}</strong> is confirmed for <strong>${params.dateTime}</strong>.</p>
     ${joinBlock}
     <p style="font-size:13px;color:#64748b">Join opens 5 minutes before your scheduled time.</p>`
  );
}

export function doctorNewBookingEmail(params: {
  doctorName: string;
  patientName: string;
  dateTime: string;
  consultationUrl: string;
  hostJoinUrl?: string | null;
}) {
  const joinBlock = params.hostJoinUrl
    ? `<p><a href="${params.hostJoinUrl}" style="display:inline-block;background:#059669;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Start meeting</a></p>`
    : '';

  return emailLayout(
    'New appointment booked',
    `<p>Hi ${params.doctorName},</p>
     <p><strong>${params.patientName}</strong> booked a consultation for <strong>${params.dateTime}</strong>.</p>
     ${joinBlock}
     <p><a href="${params.consultationUrl}">Open consultation room</a></p>`
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
