import { jsPDF } from 'jspdf';
import type { PrescriptionRow, MedicalCertificateRow } from '@/lib/api';
import { formatDoctorName } from '@/lib/format';
import { itemsFromPrescription, type PrescriptionItem } from '@/lib/prescriptionItems';

const PRIMARY = { r: 37, g: 99, b: 235 };
const SLATE = { r: 15, g: 23, b: 42 };
const MUTED = { r: 100, g: 116, b: 139 };

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

function addBrandHeader(doc: jsPDF, title: string, subtitle: string) {
  doc.setFillColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
  doc.rect(0, 0, 210, 34, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(title, 14, 15);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(subtitle, 14, 22);
  doc.setFontSize(8);
  doc.text('quickdoctor.ie  •  support@quickdoctor.ie', 14, 28);
}

function addFooter(doc: jsPDF, lines: string[]) {
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  let y = 282;
  for (const line of lines) {
    doc.text(line, 14, y);
    y += 4;
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
  doc.text('Scan at quickdoctor.ie/verify', 110, y + 10);
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

export function downloadPrescriptionPdf(
  item: PrescriptionRow,
  options?: { patientName?: string }
) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const doctor = formatDoctorName(item.appointment?.doctor);
  const patient = options?.patientName || patientNameFromRow(item, getStoredPatientName());
  const issued = new Date(item.issuedAt);
  const issuedStr = issued.toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const items = itemsFromPrescription(item);
  const reference = refId(item.id);

  addBrandHeader(doc, 'PRESCRIPTION', 'QuickDoctor — Digital Prescription');

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.roundedRect(12, 40, 186, 238, 2, 2, 'S');

  doc.setTextColor(SLATE.r, SLATE.g, SLATE.b);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Prescription details', 18, 50);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Reference: ${reference}`, 18, 58);
  doc.text(`Issued: ${issuedStr}`, 18, 64);
  doc.text(`Patient: ${patient}`, 18, 70);
  doc.text(`Prescriber: ${doctor}`, 18, 76);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(PRIMARY.r, PRIMARY.g, PRIMARY.b);
  doc.text('Rx', 18, 92);

  doc.setTextColor(SLATE.r, SLATE.g, SLATE.b);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  const colX = { med: 18, dose: 72, freq: 110, dur: 150 };
  let y = 100;
  doc.setFillColor(241, 245, 249);
  doc.rect(16, y - 5, 178, 8, 'F');
  doc.text('Medicine', colX.med, y);
  doc.text('Dosage', colX.dose, y);
  doc.text('Frequency', colX.freq, y);
  doc.text('Duration', colX.dur, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  const renderItem = (med: PrescriptionItem, index: number) => {
    if (y > 230) {
      doc.addPage();
      y = 30;
    }
    const rowH = med.instructions ? 14 : 10;
    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(16, y - 4, 178, rowH, 'F');
    }
    doc.setTextColor(SLATE.r, SLATE.g, SLATE.b);
    doc.text(doc.splitTextToSize(med.name, 50), colX.med, y);
    doc.text(doc.splitTextToSize(med.dosage, 34), colX.dose, y);
    doc.text(med.frequency || '—', colX.freq, y);
    doc.text(med.duration || '—', colX.dur, y);
    y += 6;
    if (med.instructions) {
      doc.setFontSize(8);
      doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
      doc.text(`Note: ${med.instructions}`, colX.med, y);
      doc.setFontSize(9);
      y += 5;
    }
    y += 4;
  };

  items.forEach(renderItem);

  if (item.instructions) {
    y += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(SLATE.r, SLATE.g, SLATE.b);
    doc.text('General instructions', 18, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    const wrapped = doc.splitTextToSize(item.instructions, 170);
    doc.text(wrapped, 18, y);
    y += wrapped.length * 5 + 4;
  }

  const sigY = Math.min(Math.max(y + 12, 220), 248);
  addSignatureBlock(doc, doctor, issuedStr, sigY);

  addFooter(doc, [
    'This is a digitally generated prescription issued following a QuickDoctor telemedicine consultation.',
    'Present this document to your pharmacy. For emergencies call 112 / 999.',
    `Document ID: ${reference}  •  Generated ${new Date().toLocaleString('en-IE')}`,
  ]);

  savePdf(doc, `prescription-${reference}.pdf`);
}

export function downloadMedicalCertificatePdf(
  item: MedicalCertificateRow,
  options?: { patientName?: string }
) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const doctor = formatDoctorName(item.appointment?.doctor);
  const patient = options?.patientName || patientNameFromRow(item, getStoredPatientName());
  const issued = new Date(item.issuedAt);
  const issuedStr = issued.toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const fromStr = new Date(item.startDate).toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const toStr = new Date(item.endDate).toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const reference = refId(item.id);

  addBrandHeader(doc, 'MEDICAL CERTIFICATE', 'QuickDoctor — Sick Certificate / Fit Note');

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.roundedRect(12, 40, 186, 238, 2, 2, 'S');

  doc.setTextColor(SLATE.r, SLATE.g, SLATE.b);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Certificate of incapacity for work', 18, 52);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Certificate ID: ${reference}`, 18, 62);
  doc.text(`Date issued: ${issuedStr}`, 18, 68);
  doc.text(`Patient: ${patient}`, 18, 74);
  doc.text(`Registered GP: ${doctor}`, 18, 80);

  doc.setFillColor(239, 246, 255);
  doc.roundedRect(16, 88, 178, 52, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Absence period', 20, 96);
  doc.setFont('helvetica', 'normal');
  doc.text(`From: ${fromStr}`, 20, 104);
  doc.text(`To: ${toStr}`, 20, 110);
  doc.text(`Reason: ${item.reason}`, 20, 118);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Medical statement', 18, 152);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const statement = `This is to certify that ${patient} was assessed via QuickDoctor telemedicine services and, in my professional opinion, is medically unfit for work and/or study for the period stated above due to: ${item.reason}.`;
  const wrapped = doc.splitTextToSize(statement, 170);
  doc.text(wrapped, 18, 160);

  doc.setFontSize(8);
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
  const note =
    'This certificate is issued following a remote consultation and should be accepted by employers and educational institutions in accordance with applicable Irish guidance on telemedicine documentation.';
  doc.text(doc.splitTextToSize(note, 170), 18, 185);

  addSignatureBlock(doc, doctor, issuedStr, 215);

  doc.setDrawColor(SLATE.r, SLATE.g, SLATE.b);
  doc.setLineWidth(0.5);
  doc.rect(158, 44, 32, 32);
  doc.setFontSize(7);
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
  doc.text('VERIFY', 166, 62);
  doc.text(reference.slice(0, 12), 162, 68);

  addFooter(doc, [
    'QuickDoctor Ltd — Registered in Ireland. This document is digitally generated and tamper-evident.',
    'Employers may contact support@quickdoctor.ie to verify certificate authenticity.',
    `Document ID: ${reference}  •  Generated ${new Date().toLocaleString('en-IE')}`,
  ]);

  savePdf(doc, `medical-certificate-${reference}.pdf`);
}
