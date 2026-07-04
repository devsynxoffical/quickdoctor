/** Static-export-safe doctor URLs (query param instead of dynamic path segments). */

export function doctorConsultationUrl(appointmentId: string) {
  return `/doctor/consultations/room?id=${encodeURIComponent(appointmentId)}`;
}

export function doctorVideoCallUrl(appointmentId: string) {
  return `/doctor/video-call/room?id=${encodeURIComponent(appointmentId)}`;
}
