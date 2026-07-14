import { jsPDF } from 'jspdf';
import type { PrescriptionRow, MedicalCertificateRow } from '@/lib/api';
import { SITE_EMAIL, SITE_PHONE, SITE_DOMAIN } from '@/lib/siteContact';
import { itemsFromPrescription, type PrescriptionItem } from '@/lib/prescriptionItems';

/** Teal accents matching client sample PDFs */
const TEAL = { r: 13, g: 148, b: 136 };
const SLATE = { r: 15, g: 23, b: 42 };
const MUTED = { r: 100, g: 116, b: 139 };
const LINE = { r: 203, g: 213, b: 225 };
const BOX_BG = { r: 248, g: 250, b: 252 };

const MARGIN = 14;
const PAGE_W = 210;
const CONTENT_W = PAGE_W - MARGIN * 2;
const PAGE_BOTTOM = 282;

type DateInput = Date | string | number;

type PatientInfo = {
  firstName?: string;
  lastName?: string;
  dob?: string;
  address?: string | null;
  phone?: string | null;
};

type DoctorInfo = {
  firstName?: string;
  lastName?: string;
  licenseNumber?: string;
};

let cachedLogoDataUrl: string | null | undefined;

async function loadLogoDataUrl(): Promise<string | null> {
  if (cachedLogoDataUrl !== undefined) return cachedLogoDataUrl;
  try {
    const res = await fetch('/logo.png');
    // Prefer PNG for jsPDF addImage compatibility; SVG logo is used on the website.
    if (!res.ok) {
      cachedLogoDataUrl = null;
      return null;
    }
    const blob = await res.blob();
    cachedLogoDataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    return cachedLogoDataUrl;
  } catch {
    cachedLogoDataUrl = null;
    return null;
  }
}

function toDate(value: DateInput): Date {
  if (value instanceof Date) return value;
  if (typeof value === 'number') return new Date(value);
  const s = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?$/.test(s)) {
    return new Date(`${s}Z`);
  }
  return new Date(s);
}

/** DD/MM/YYYY for Irish medical documents */
function formatDocDate(value: DateInput): string {
  const d = toDate(value);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function savePdf(doc: jsPDF, filename: string) {
  const safe = filename.replace(/[^a-z0-9._-]/gi, '-').toLowerCase();
  try {
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = safe.endsWith('.pdf') ? safe : `${safe}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch {
    doc.save(safe.endsWith('.pdf') ? safe : `${safe}.pdf`);
  }
}

/** Stable RX-/SC- style reference from UUID */
function documentReference(prefix: 'RX' | 'SC', id: string): string {
  const hex = id.replace(/-/g, '').slice(-6);
  const n = Number.parseInt(hex, 16) % 1_000_000;
  return `${prefix}-${String(n).padStart(6, '0')}`;
}

function doctorDisplayName(doctor?: DoctorInfo | null): string {
  if (!doctor) return 'Dr';
  const parts = [doctor.firstName, doctor.lastName].filter(Boolean);
  return parts.length ? `Dr ${parts.join(' ')}` : 'Dr';
}

function doctorSurname(doctor?: DoctorInfo | null): string {
  if (!doctor) return 'Doctor';
  return [doctor.firstName, doctor.lastName].filter(Boolean).join(' ') || 'Doctor';
}

function patientFullName(patient?: PatientInfo | null, fallback?: string): string {
  if (patient?.firstName || patient?.lastName) {
    return [patient.firstName, patient.lastName].filter(Boolean).join(' ');
  }
  return fallback || 'Patient';
}

export function getStoredPatientName(): string {
  if (typeof window === 'undefined') return 'Patient';
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return 'Patient';
    const u = JSON.parse(raw) as { firstName?: string; lastName?: string };
    const name = [u.firstName, u.lastName].filter(Boolean).join(' ');
    return name || 'Patient';
  } catch {
    return 'Patient';
  }
}

function drawPlatformHeader(doc: jsPDF, logoDataUrl: string | null): number {
  const top = 10;

  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, 'PNG', MARGIN, top, 14, 14);
    } catch {
      /* ignore */
    }
  }

  const leftX = logoDataUrl ? MARGIN + 18 : MARGIN;
  doc.setTextColor(SLATE.r, SLATE.g, SLATE.b);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('QuickDoctor.ie', leftX, top + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
  doc.text('Online GP Consultation Service', leftX, top + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(SLATE.r, SLATE.g, SLATE.b);
  const rightLines = [
    'QuickDoctor.ie',
    `www.${SITE_DOMAIN}`,
    SITE_EMAIL,
    SITE_PHONE,
  ];
  rightLines.forEach((line, i) => {
    doc.text(line, PAGE_W - MARGIN, top + 4 + i * 4, { align: 'right' });
  });

  const dividerY = top + 20;
  doc.setDrawColor(LINE.r, LINE.g, LINE.b);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, dividerY, PAGE_W - MARGIN, dividerY);

  return dividerY + 8;
}

/** Title centered with reference number box on the right (per client arrow). */
function drawTitleWithReference(
  doc: jsPDF,
  y: number,
  title: string,
  reference: string
): number {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(TEAL.r, TEAL.g, TEAL.b);
  doc.text(title, PAGE_W / 2, y, { align: 'center' });

  const boxW = 38;
  const boxH = 12;
  const boxX = PAGE_W - MARGIN - boxW;
  const boxY = y - 8;
  doc.setDrawColor(LINE.r, LINE.g, LINE.b);
  doc.setFillColor(BOX_BG.r, BOX_BG.g, BOX_BG.b);
  doc.setLineWidth(0.35);
  doc.roundedRect(boxX, boxY, boxW, boxH, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
  doc.text('Reference', boxX + boxW / 2, boxY + 4.5, { align: 'center' });
  doc.setFontSize(9);
  doc.setTextColor(SLATE.r, SLATE.g, SLATE.b);
  doc.text(reference, boxX + boxW / 2, boxY + 9.5, { align: 'center' });

  return y + 8;
}

function drawSectionHeading(doc: jsPDF, y: number, label: string): number {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(TEAL.r, TEAL.g, TEAL.b);
  doc.text(label, MARGIN, y);
  return y + 5;
}

function drawLabeledLine(
  doc: jsPDF,
  y: number,
  label: string,
  value: string,
  options?: { labelWidth?: number; maxWidth?: number }
): number {
  const labelW = options?.labelWidth ?? 42;
  const maxW = options?.maxWidth ?? CONTENT_W - labelW;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(SLATE.r, SLATE.g, SLATE.b);
  doc.text(label, MARGIN, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
  const lines = doc.splitTextToSize(value || '—', maxW);
  doc.text(lines, MARGIN + labelW, y);
  return y + Math.max(5, lines.length * 4.2);
}

function drawWrappedBody(doc: jsPDF, y: number, text: string, fontSize = 9): number {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(fontSize);
  doc.setTextColor(SLATE.r, SLATE.g, SLATE.b);
  const lines = doc.splitTextToSize(text, CONTENT_W);
  doc.text(lines, MARGIN, y);
  return y + lines.length * (fontSize * 0.4 + 1.2);
}

function drawDoctorFooterBlock(
  doc: jsPDF,
  y: number,
  doctor: DoctorInfo | null | undefined,
  issueDate: string
): number {
  y = drawSectionHeading(doc, y, 'Doctor Details');

  y = drawLabeledLine(doc, y, 'Doctor Name:', doctorSurname(doctor));
  y = drawLabeledLine(
    doc,
    y,
    'Irish Medical Council Registration No.:',
    doctor?.licenseNumber || '—',
    { labelWidth: 78 }
  );

  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(SLATE.r, SLATE.g, SLATE.b);
  doc.text('Date of Issue', MARGIN, y);
  doc.text('Doctor Signature', 110, y);
  y += 2;
  doc.setDrawColor(LINE.r, LINE.g, LINE.b);
  doc.setLineWidth(0.35);
  doc.line(MARGIN, y, 90, y);
  doc.line(110, y, PAGE_W - MARGIN, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
  doc.text(issueDate, MARGIN + 20, y, { align: 'center' });
  doc.text(doctorSurname(doctor), 153, y, { align: 'center' });
  y += 4;
  doc.setFontSize(8);
  doc.text(`Irish MCRN: ${doctor?.licenseNumber || '—'}`, 153, y, { align: 'center' });
  return y + 6;
}

function drawPageFooter(doc: jsPDF, lines: string[]) {
  doc.setDrawColor(LINE.r, LINE.g, LINE.b);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, PAGE_BOTTOM - 8, PAGE_W - MARGIN, PAGE_BOTTOM - 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
  let y = PAGE_BOTTOM - 4;
  for (const line of lines) {
    const wrapped = doc.splitTextToSize(line, CONTENT_W);
    doc.text(wrapped, PAGE_W / 2, y, { align: 'center' });
    y += wrapped.length * 3.2;
  }
}

export async function downloadPrescriptionPdf(
  item: PrescriptionRow,
  options?: {
    patientName?: string;
    patient?: PatientInfo;
    doctor?: DoctorInfo;
  }
) {
  const logo = await loadLogoDataUrl();
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const patient = options?.patient || (item.appointment?.patient as PatientInfo | undefined);
  const doctor = options?.doctor || (item.appointment?.doctor as DoctorInfo | undefined);
  const patientName = options?.patientName || patientFullName(patient, getStoredPatientName());
  const issuedStr = formatDocDate(item.issuedAt);
  const reference = documentReference('RX', item.id);
  const medicines = itemsFromPrescription(item);

  let y = drawPlatformHeader(doc, logo);
  y = drawTitleWithReference(doc, y, 'MEDICAL PRESCRIPTION', reference);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
  doc.text(`Issue Date: ${issuedStr}`, PAGE_W / 2, y, { align: 'center' });
  y += 8;

  y = drawSectionHeading(doc, y, 'Patient Details');
  y = drawLabeledLine(doc, y, 'Patient Name:', patientName);
  y = drawLabeledLine(doc, y, 'Date of Birth:', patient?.dob ? formatDocDate(patient.dob) : '—');
  y = drawLabeledLine(doc, y, 'Address:', patient?.address?.trim() || '—');
  y += 3;

  y = drawSectionHeading(doc, y, 'Prescription');

  const colX = { med: MARGIN, dose: 68, freq: 108, dur: 148 };
  doc.setFillColor(TEAL.r, TEAL.g, TEAL.b);
  doc.rect(MARGIN, y - 4, CONTENT_W, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Medicine', colX.med + 1, y);
  doc.text('Dosage', colX.dose, y);
  doc.text('Frequency', colX.freq, y);
  doc.text('Duration', colX.dur, y);
  y += 6;

  const renderMed = (med: PrescriptionItem, index: number) => {
    if (y > 210) return;
    if (index % 2 === 0) {
      doc.setFillColor(BOX_BG.r, BOX_BG.g, BOX_BG.b);
      doc.rect(MARGIN, y - 3.5, CONTENT_W, med.instructions ? 11 : 7.5, 'F');
    }
    doc.setTextColor(SLATE.r, SLATE.g, SLATE.b);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(doc.splitTextToSize(med.name || '—', 48), colX.med + 1, y);
    doc.text(doc.splitTextToSize(med.dosage || '—', 36), colX.dose, y);
    doc.text(doc.splitTextToSize(med.frequency || '—', 36), colX.freq, y);
    doc.text(doc.splitTextToSize(med.duration || '—', 40), colX.dur, y);
    y += 5;
    if (med.instructions) {
      doc.setFontSize(7);
      doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
      doc.text(`Instructions: ${med.instructions}`, colX.med + 1, y);
      y += 4;
    }
    y += 2;
  };

  const rows = medicines.length ? medicines : [{ name: item.medications, dosage: item.dosage } as PrescriptionItem];
  rows.slice(0, 8).forEach(renderMed);

  // Pad empty medicine rows so the table looks like the template
  const shown = Math.min(rows.length, 8);
  for (let i = shown; i < Math.max(3, shown); i++) {
    if (y > 210) break;
    doc.setDrawColor(LINE.r, LINE.g, LINE.b);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, y + 1, PAGE_W - MARGIN, y + 1);
    y += 7;
  }

  y += 2;
  if (item.instructions && y < 225) {
    y = drawSectionHeading(doc, y, 'Clinical Notes (Optional)');
    y = drawWrappedBody(doc, y, item.instructions, 8.5);
    y += 2;
  }

  y = Math.max(y + 2, 228);
  if (y > 240) y = 228;
  drawDoctorFooterBlock(doc, y, doctor, issuedStr);

  drawPageFooter(doc, [
    'This prescription was issued following an online medical consultation with a doctor registered with the Irish Medical Council.',
    `QuickDoctor.ie  •  ${SITE_EMAIL}  •  ${SITE_PHONE}`,
  ]);

  savePdf(doc, `prescription-${reference}.pdf`);
}

export async function downloadMedicalCertificatePdf(
  item: MedicalCertificateRow,
  options?: {
    patientName?: string;
    patient?: PatientInfo;
    doctor?: DoctorInfo;
  }
) {
  const logo = await loadLogoDataUrl();
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const patient = options?.patient || (item.appointment?.patient as PatientInfo | undefined);
  const doctor = options?.doctor || (item.appointment?.doctor as DoctorInfo | undefined);
  const patientName = options?.patientName || patientFullName(patient, getStoredPatientName());
  const doctorName = doctorDisplayName(doctor);
  const issuedStr = formatDocDate(item.issuedAt);
  const fromStr = formatDocDate(item.startDate);
  const toStr = formatDocDate(item.endDate);
  const reference = documentReference('SC', item.id);

  let y = drawPlatformHeader(doc, logo);
  y = drawTitleWithReference(doc, y, 'MEDICAL CERTIFICATE', reference);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
  doc.text(`Issue Date: ${issuedStr}`, PAGE_W / 2, y, { align: 'center' });
  y += 8;

  y = drawSectionHeading(doc, y, 'Patient Details');
  y = drawLabeledLine(doc, y, 'Patient Name:', patientName);
  y = drawLabeledLine(doc, y, 'Date of Birth:', patient?.dob ? formatDocDate(patient.dob) : '—');
  y = drawLabeledLine(doc, y, 'Address:', patient?.address?.trim() || '—');
  y += 4;

  y = drawSectionHeading(doc, y, 'Medical Certification');
  const certification = `I, ${doctorName}, a doctor registered with the Irish Medical Council, certify that the above-named patient is medically unfit for work, school, or college during the period stated below. This certificate has been issued following an online medical consultation and clinical assessment.`;
  doc.setFillColor(BOX_BG.r, BOX_BG.g, BOX_BG.b);
  doc.setDrawColor(LINE.r, LINE.g, LINE.b);
  doc.setLineWidth(0.3);
  const certLines = doc.splitTextToSize(certification, CONTENT_W - 8);
  const certBoxH = certLines.length * 4.2 + 8;
  doc.roundedRect(MARGIN, y - 3, CONTENT_W, certBoxH, 2, 2, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(SLATE.r, SLATE.g, SLATE.b);
  doc.text(certLines, MARGIN + 4, y + 3);
  y += certBoxH + 6;

  y = drawSectionHeading(doc, y, 'Period of Incapacity');
  doc.setFillColor(239, 246, 255);
  doc.roundedRect(MARGIN, y - 3, CONTENT_W, 18, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(SLATE.r, SLATE.g, SLATE.b);
  doc.text('Unfit From:', MARGIN + 4, y + 4);
  doc.text('Unfit Until:', 110, y + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(TEAL.r, TEAL.g, TEAL.b);
  doc.text(fromStr, MARGIN + 30, y + 10);
  doc.text(toStr, 110 + 24, y + 10);
  y += 22;

  y = drawSectionHeading(doc, y, 'Additional Notes (Optional)');
  if (item.reason?.trim()) {
    y = drawWrappedBody(doc, y, item.reason.trim(), 9);
  } else {
    doc.setDrawColor(LINE.r, LINE.g, LINE.b);
    doc.setLineWidth(0.25);
    for (let i = 0; i < 3; i++) {
      doc.line(MARGIN, y + i * 6, PAGE_W - MARGIN, y + i * 6);
    }
    y += 18;
  }
  y += 6;

  y = Math.min(Math.max(y, 210), 230);
  drawDoctorFooterBlock(doc, y, doctor, issuedStr);

  drawPageFooter(doc, [
    'This certificate was issued following an online medical consultation with a doctor registered with the IMC.',
    `Employers may contact www.${SITE_DOMAIN}/verify to verify the authenticity of this certificate.`,
    `${SITE_EMAIL}  •  ${SITE_PHONE}`,
  ]);

  savePdf(doc, `medical-certificate-${reference}.pdf`);
}
