/** Email stub — logs to console; plug Resend/SendGrid via RESEND_API_KEY */

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

export function bookingConfirmedEmail(params: {
  to: string;
  doctorName: string;
  dateTime: string;
  joinUrl?: string;
}) {
  return sendEmail({
    to: params.to,
    subject: 'Your QuickDoctor appointment is confirmed',
    html: `<p>Your video consultation with ${params.doctorName} is confirmed for ${params.dateTime}.</p>${
      params.joinUrl ? `<p><a href="${params.joinUrl}">Join consultation</a></p>` : ''
    }`,
  });
}
