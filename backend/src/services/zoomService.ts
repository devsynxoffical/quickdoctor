import prisma from '../config/db';

const ZOOM_API = 'https://api.zoom.us/v2';

async function getZoomAccessToken(): Promise<string | null> {
  const accountId = process.env.ZOOM_ACCOUNT_ID;
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;

  if (!accountId || !clientId || !clientSecret) return null;

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const res = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`,
    {
      method: 'POST',
      headers: { Authorization: `Basic ${credentials}` },
    }
  );

  if (!res.ok) {
    console.warn('Zoom OAuth failed:', await res.text());
    return null;
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

function devMeetingUrls(appointmentId: string) {
  const base = frontendBase();
  return {
    meetingId: `dev-${appointmentId.slice(0, 8)}`,
    joinUrlPatient: `${base}/dashboard/appointments?join=${appointmentId}`,
    joinUrlHost: `${base}/doctor/consultations/${appointmentId}`,
    password: 'dev123',
  };
}

function frontendBase() {
  const raw = process.env.FRONTEND_URL || 'http://localhost:3000';
  return raw.split(',')[0].trim().replace(/\/$/, '');
}

function allowDevZoomFallback() {
  return process.env.NODE_ENV !== 'production' || process.env.ALLOW_ZOOM_DEV_FALLBACK === 'true';
}

export async function ensureZoomMeetingForAppointment(appointmentId: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { doctor: true, patient: true },
  });

  if (!appointment || appointment.zoomMeetingId) {
    return appointment;
  }

  const duration = 30;
  const start = appointment.dateTime.toISOString();

  const token = await getZoomAccessToken();

  if (!token) {
    if (!allowDevZoomFallback()) {
      console.error('[zoom] Missing credentials in production — no meeting created for', appointmentId);
      return appointment;
    }
    const dev = devMeetingUrls(appointmentId);
    return prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        zoomMeetingId: dev.meetingId,
        zoomJoinUrlPatient: dev.joinUrlPatient,
        zoomJoinUrlHost: dev.joinUrlHost,
        zoomPassword: dev.password,
      },
    });
  }

  const res = await fetch(`${ZOOM_API}/users/me/meetings`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      topic: `QuickDoctor — ${appointment.patient.firstName} ${appointment.patient.lastName}`,
      type: 2,
      start_time: start,
      duration,
      timezone: 'UTC',
      settings: {
        join_before_host: false,
        waiting_room: true,
      },
    }),
  });

  if (!res.ok) {
    console.warn('Zoom meeting create failed:', await res.text());
    if (!allowDevZoomFallback()) {
      return appointment;
    }
    const dev = devMeetingUrls(appointmentId);
    return prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        zoomMeetingId: dev.meetingId,
        zoomJoinUrlPatient: dev.joinUrlPatient,
        zoomJoinUrlHost: dev.joinUrlHost,
        zoomPassword: dev.password,
      },
    });
  }

  const meeting = (await res.json()) as {
    id: number;
    join_url: string;
    start_url: string;
    password?: string;
  };

  return prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      zoomMeetingId: String(meeting.id),
      zoomJoinUrlPatient: meeting.join_url,
      zoomJoinUrlHost: meeting.start_url,
      zoomPassword: meeting.password || null,
    },
  });
}

export function canJoinVideo(dateTime: Date): boolean {
  const now = Date.now();
  const start = dateTime.getTime();
  const fiveMin = 5 * 60 * 1000;
  const twoHours = 2 * 60 * 60 * 1000;
  return now >= start - fiveMin && now <= start + twoHours;
}

export function getJoinUrlForRole(
  appointment: {
    dateTime: Date;
    status: string;
    zoomJoinUrlPatient: string | null;
    zoomJoinUrlHost: string | null;
  },
  role: 'PATIENT' | 'DOCTOR'
): { canJoin: boolean; url: string | null; message?: string } {
  if (appointment.status !== 'CONFIRMED') {
    return { canJoin: false, url: null, message: 'Appointment is not confirmed' };
  }

  if (!canJoinVideo(appointment.dateTime)) {
    return {
      canJoin: false,
      url: null,
      message: 'Join opens 5 minutes before your appointment time',
    };
  }

  const url =
    role === 'DOCTOR' ? appointment.zoomJoinUrlHost : appointment.zoomJoinUrlPatient;

  if (!url) {
    return { canJoin: false, url: null, message: 'Video link not ready yet' };
  }

  return { canJoin: true, url };
}
