export function formatDoctorName(
  doctor?: { firstName?: string; lastName?: string } | null
): string {
  if (!doctor) return 'Your doctor';
  const parts = [doctor.firstName, doctor.lastName].filter(Boolean);
  return parts.length ? `Dr. ${parts.join(' ')}` : 'Your doctor';
}

export function formatStatusLabel(status: string): string {
  return status.replace(/_/g, ' ');
}

export function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
