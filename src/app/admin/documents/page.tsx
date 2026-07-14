"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { adminApi } from '@/lib/api';
import { Download, FileText, Pill } from 'lucide-react';
import { formatAppDateTime } from '@/lib/appTime';
import { downloadMedicalCertificatePdf, downloadPrescriptionPdf } from '@/lib/medicalPdf';
import { itemsFromPrescription } from '@/lib/prescriptionItems';
import type { MedicalCertificateRow, PrescriptionRow } from '@/lib/api';

export default function AdminMedicalDocsPage() {
  const [tab, setTab] = useState<'prescriptions' | 'certificates'>('prescriptions');
  const [prescriptions, setPrescriptions] = useState<PrescriptionRow[]>([]);
  const [certificates, setCertificates] = useState<MedicalCertificateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([adminApi.prescriptions(), adminApi.certificates()])
      .then(([rx, certs]) => {
        setPrescriptions(rx);
        setCertificates(certs);
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h1 className="text-4xl font-black">Issued documents</h1>
        <p className="text-slate-500 mt-2">
          Download prescriptions and medical certificates to resend to patients when needed.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab('prescriptions')}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase ${
            tab === 'prescriptions' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-900'
          }`}
        >
          Prescriptions ({prescriptions.length})
        </button>
        <button
          type="button"
          onClick={() => setTab('certificates')}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase ${
            tab === 'certificates' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-900'
          }`}
        >
          Certificates ({certificates.length})
        </button>
      </div>

      {loading && <p className="text-slate-400">Loading…</p>}
      {error && <p className="text-red-600 font-bold text-sm">{error}</p>}

      {!loading && tab === 'prescriptions' && (
        <div className="grid gap-3">
          {prescriptions.length === 0 && <p className="text-slate-500 text-sm">No prescriptions issued yet.</p>}
          {prescriptions.map((rx) => {
            const patient = rx.appointment?.patient as { firstName?: string; lastName?: string } | undefined;
            const doctor = rx.appointment?.doctor as { firstName?: string; lastName?: string } | undefined;
            const patientName = patient ? `${patient.firstName || ''} ${patient.lastName || ''}`.trim() : 'Patient';
            const items = itemsFromPrescription(rx);
            return (
              <div key={rx.id} className="glass p-5 rounded-2xl flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-black flex items-center gap-2">
                    <Pill className="w-4 h-4 text-secondary" />
                    {patientName}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Issued {formatAppDateTime(rx.issuedAt)}
                    {doctor ? ` · Dr. ${doctor.firstName} ${doctor.lastName}` : ''}
                  </p>
                  <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                    {items.map((i) => i.name).join(', ') || rx.medications}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => downloadPrescriptionPdf(rx, { patientName })}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              </div>
            );
          })}
        </div>
      )}

      {!loading && tab === 'certificates' && (
        <div className="grid gap-3">
          {certificates.length === 0 && <p className="text-slate-500 text-sm">No certificates issued yet.</p>}
          {certificates.map((cert) => {
            const patient = cert.appointment?.patient as { firstName?: string; lastName?: string } | undefined;
            const doctor = cert.appointment?.doctor as { firstName?: string; lastName?: string } | undefined;
            const patientName = patient ? `${patient.firstName || ''} ${patient.lastName || ''}`.trim() : 'Patient';
            return (
              <div key={cert.id} className="glass p-5 rounded-2xl flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-black flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    {patientName}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Issued {formatAppDateTime(cert.issuedAt)}
                    {doctor ? ` · Dr. ${doctor.firstName} ${doctor.lastName}` : ''}
                  </p>
                  <p className="text-sm text-slate-600 mt-2">{cert.reason}</p>
                </div>
                <button
                  type="button"
                  onClick={() => downloadMedicalCertificatePdf(cert, { patientName })}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
