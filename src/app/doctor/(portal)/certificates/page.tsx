"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, ChevronRight, Download } from 'lucide-react';
import { medicalApi, type MedicalCertificateRow } from '@/lib/api';
import { formatAppDate, formatAppDateTime } from '@/lib/appTime';
import { doctorConsultationUrl } from '@/lib/doctorRoutes';
import { downloadMedicalCertificatePdf } from '@/lib/medicalPdf';

export default function DoctorCertificatesPage() {
  const [rows, setRows] = useState<MedicalCertificateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    medicalApi
      .doctorCertificates()
      .then(setRows)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Failed to load certificates'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h1 className="text-4xl font-black">Medical certificates</h1>
        <p className="text-slate-500 mt-2">
          Sick certificates issued during consultations. Issue new certificates from the consultation room.
        </p>
      </div>

      <Link
        href="/doctor/consultations"
        className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-xl font-black text-sm"
      >
        Go to consultations <ChevronRight className="w-4 h-4" />
      </Link>

      {loading && <p className="text-slate-400">Loading…</p>}
      {error && <p className="text-red-600 font-bold text-sm">{error}</p>}

      {!loading && rows.length === 0 && (
        <p className="text-slate-500 text-sm">No certificates issued yet.</p>
      )}

      <div className="grid gap-3">
        {rows.map((cert) => {
          const patient = cert.appointment?.patient as { firstName?: string; lastName?: string } | undefined;
          const patientName = patient ? `${patient.firstName || ''} ${patient.lastName || ''}`.trim() : undefined;
          const appointmentId = cert.appointment?.id;

          return (
            <div key={cert.id} className="glass p-5 rounded-2xl flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-black flex items-center gap-2">
                  <FileText className="w-4 h-4 text-secondary" />
                  {patient ? `${patient.firstName} ${patient.lastName}` : 'Patient'}
                </p>
                <p className="text-sm text-slate-600 mt-2">{cert.reason}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {formatAppDate(cert.startDate)} – {formatAppDate(cert.endDate)}
                  · Issued {formatAppDateTime(cert.issuedAt)}
                </p>
              </div>
              {appointmentId && (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => downloadMedicalCertificatePdf(cert, { patientName })}
                    className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline"
                  >
                    <Download className="w-4 h-4" /> PDF
                  </button>
                  <Link
                    href={doctorConsultationUrl(appointmentId)}
                    className="text-sm font-bold text-secondary hover:underline"
                  >
                    Open consultation
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
