import { jsPDF } from 'jspdf';
import type { PrescriptionRow, MedicalCertificateRow } from '@/lib/api';
import { formatAppDateLong, formatAppDateTime } from '@/lib/appTime';
import { formatDoctorName } from '@/lib/format';
import { itemsFromPrescription, type PrescriptionItem } from '@/lib/prescriptionItems';
import { SITE_EMAIL, SITE_DOMAIN } from '@/lib/siteContact';

const PRIMARY = { r: 37, g: 99, b: 235 };
const SLATE = { r: 15, g: 23, b: 42 };
const MUTED = { r: 100, g: 116, b: 139 };

let cachedLogoDataUrl: string | null | undefined;

async function loadLogoDataUrl(): Promise<string | null> {
  if (cachedLogoDataUrl !== undefined) return cachedLogoDataUrl;
  try {
    const res = await fetch('/logo.png');
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

function refId(id: string) {
  return `QD-${id.replace(/-/g, '').slice(0, 10).toUpperCase()}`;
}

function addBrandHeader(doc: jsPDF, title: string, subtitle: string, logoDataUrl: string | null) {
  doc.setFillColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
  doc.rect(0, 0, 210, 28, 'F');

  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, 'PNG', 14, 5, 16, 16);
    } catch {
      /* ignore logo draw errors */
    }
  }

  const textX = logoDataUrl ? 34 : 14;
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(title, textX, 12);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(subtitle, textX, 18);
  doc.setFontSize(7.5);
  doc.text(`${SITE_DOMAIN}  •  ${SITE_EMAIL}`, textX, 24);
}

function addFooter(doc: jsPDF, lines: string[]) {
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  let y = 285;
  for (const line of lines) {
    doc.text(line, 14, y);
    y += 3.5;
  }
}

function addSignatureBlock(doc: jsPDF, doctorName: string, issuedAt: string, y: number) {
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.line(14, y, 90, y);
  doc.line(110, y, 196, y);
  doc.setTextColor(SLATE.r, SLATE.g, SLATE.b);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Prescribing doctor', 14, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(doctorName, 14, y + 10);
  doc.text(`Date: ${issuedAt}`, 14, y + 15);
  doc.setFont('helvetica', 'bold');
  doc.text('Digital verification', 110, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Contact ${SITE_EMAIL}`, 110, y + 10);
  doc.text('(Reference on document)', 110, y + 15);
}

function patientNameFromRow(
  row: { appointment?: { patient?: { firstName?: string; lastName?: string } } },
  fallback?: string
) {
  const p = row.appointment?.patient;
  if (p?.firstName || p?.lastName) {
    return [p.firstName, p.lastName].filter(Boolean).join(' ');
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

export async function downloadPrescriptionPdf(
  item: PrescriptionRow,
  options?: { patientName?: string }
) {
  const logo = await loadLogoDataUrl();
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const doctor = formatDoctorName(item.appointment?.doctor);
  const patient = options?.patientName || patientNameFromRow(item, getStoredPatientName());
  const issuedStr = formatAppDateLong(item.issuedAt);
  const items = itemsFromPrescription(item);
  const reference = refId(item.id);

  addBrandHeader(doc, 'PRESCRIPTION', 'QuickDoctor — Digital Prescription', logo);

  doc.setTextColor(SLATE.r, SLATE.g, SLATE.b);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Prescription details', 14, 38);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Reference: ${reference}`, 14, 44);
  doc.text(`Issued: ${issuedStr}`, 110, 44);
  doc.text(`Patient: ${patient}`, 14, 50);
  doc.text(`Prescriber: ${doctor}`, 110, 50);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
  doc.text('Rx', 14, 60);

  doc.setTextColor(SLATE.r, SLATE.g, SLATE.b);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  const colX = { med: 14, dose: 70, freq: 110, dur: 152 };
  let y = 68;
  doc.setFillColor(241, 245, 249);
  doc.rect(12, y - 5, 186, 7, 'F');
  doc.text('Medicine', colX.med, y);
  doc.text('Dosage', colX.dose, y);
  doc.text('Frequency', colX.freq, y);
  doc.text('Duration', colX.dur, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  const renderItem = (med: PrescriptionItem, index: number) => {
    if (y > 230) return;
    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(12, y - 3.5, 186, med.instructions ? 12 : 8, 'F');
    }
    doc.setTextColor(SLATE.r, SLATE.g, SLATE.b);
    doc.text(doc.splitTextToSize(med.name, 52), colX.med, y);
    doc.text(doc.splitTextToSize(med.dosage, 36), colX.dose, y);
    doc.text(med.frequency || '—', colX.freq, y);
    doc.text(med.duration || '—', colX.dur, y);
    y += 5;
    if (med.instructions) {
      doc.setFontSize(7.5);
      doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
      doc.text(`Note: ${med.instructions}`, colX.med, y);
      doc.setFontSize(8.5);
      y += 4;
    }
    y += 3;
  };

  items.forEach(renderItem);

  if (item.instructions && y < 235) {
    y += 2;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(SLATE.r, SLATE.g, SLATE.b);
    doc.text('General instructions', 14, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    const wrapped = doc.splitTextToSize(item.instructions, 182);
    doc.text(wrapped, 14, y);
    y += wrapped.length * 4 + 2;
  }

  const sigY = Math.min(Math.max(y + 8, 245), 260);
  addSignatureBlock(doc, doctor, issuedStr, sigY);

  addFooter(doc, [
    'Digitally generated after a QuickDoctor telemedicine consultation. Present to your pharmacy. Emergencies: 112 / 999.',
    `Document ID: ${reference}  •  Generated ${formatAppDateTime(new Date())}  •  ${SITE_EMAIL}`,
  ]);

  savePdf(doc, `prescription-${reference}.pdf`);
}

export async function downloadMedicalCertificatePdf(
  item: MedicalCertificateRow,
  options?: { patientName?: string }
) {
  const logo = await loadLogoDataUrl();
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const doctor = formatDoctorName(item.appointment?.doctor);
  const patient = options?.patientName || patientNameFromRow(item, getStoredPatientName());
  const issuedStr = formatAppDateLong(item.issuedAt);
  const fromStr = formatAppDateLong(item.startDate);
  const toStr = formatAppDateLong(item.endDate);
  const reference = refId(item.id);

  addBrandHeader(doc, 'MEDICAL CERTIFICATE', 'QuickDoctor — Sick Certificate / Fit Note', logo);

  doc.setTextColor(SLATE.r, SLATE.g, SLATE.b);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Certificate of incapacity for work', 14, 40);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Certificate ID: ${reference}`, 14, 48);
  doc.text(`Date issued: ${issuedStr}`, 110, 48);
  doc.text(`Patient: ${patient}`, 14, 54);
  doc.text(`Registered GP: ${doctor}`, 110, 54);

  doc.setFillColor(239, 246, 255);
  doc.roundedRect(12, 62, 186, 38, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Absence period', 16, 72);
  doc.setFont('helvetica', 'normal');
  doc.text(`From: ${fromStr}`, 16, 80);
  doc.text(`To: ${toStr}`, 110, 80);
  doc.text(`Reason: ${item.reason}`, 16, 90);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Medical statement', 14, 116);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  const statement = `This is to certify that ${patient} was assessed via QuickDoctor telemedicine services and, in my professional opinion, is medically unfit for work and/or study for the period stated above due to: ${item.reason}.`;
  const wrapped = doc.splitTextToSize(statement, 182);
  doc.text(wrapped, 14, 124);

  doc.setFontSize(8);
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
  const note =
    'Issued following a remote consultation. Suitable for employers and educational institutions under applicable Irish telemedicine guidance.';
  doc.text(doc.splitTextToSize(note, 182), 14, 150);

  addSignatureBlock(doc, doctor, issuedStr, 175);

  doc.setDrawColor(SLATE.r, SLATE.g, SLATE.b);
  doc.setLineWidth(0.4);
  doc.rect(168, 34, 28, 22);
  doc.setFontSize(7);
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
  doc.text('VERIFY', 175, 46);
  doc.text(reference.slice(0, 10), 171, 51);

  addFooter(doc, [
    'QuickDoctor — Registered in Ireland. Digitally generated and tamper-evident.',
    `Employers may contact ${SITE_EMAIL} to verify authenticity.  •  ${reference}  •  ${formatAppDateTime(new Date())}`,
  ]);

  savePdf(doc, `medical-certificate-${reference}.pdf`);
}
