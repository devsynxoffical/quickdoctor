"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Pill, ChevronRight, Download } from 'lucide-react';
import { medicalApi, type PrescriptionRow } from '@/lib/api';
import { doctorConsultationUrl } from '@/lib/doctorRoutes';
import { itemsFromPrescription } from '@/lib/prescriptionItems';
import { downloadPrescriptionPdf } from '@/lib/medicalPdf';

export default function DoctorPrescriptionsPage() {
  const [rows, setRows] = useState<PrescriptionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    medicalApi
      .doctorPrescriptions()
      .then(setRows)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Failed to load prescriptions'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h1 className="text-4xl font-black">Prescriptions</h1>
        <p className="text-slate-500 mt-2">
          Prescriptions you have issued during consultations. To create a new one, open a consultation room.
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
        <p className="text-slate-500 text-sm">No prescriptions issued yet.</p>
      )}

      <div className="grid gap-3">
        {rows.map((rx) => {
          const patient = rx.appointment?.patient as { firstName?: string; lastName?: string } | undefined;
          const patientName = patient ? `${patient.firstName || ''} ${patient.lastName || ''}`.trim() : undefined;
          const appointmentId = rx.appointment?.id;
          const items = itemsFromPrescription(rx);

          return (
            <div key={rx.id} className="glass p-5 rounded-2xl space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-black flex items-center gap-2">
                    <Pill className="w-4 h-4 text-secondary" />
                    {patient ? `${patient.firstName} ${patient.lastName}` : 'Patient'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Issued {new Date(rx.issuedAt).toLocaleString()}
                  </p>
                </div>
                {appointmentId && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => downloadPrescriptionPdf(rx, { patientName })}
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
              <ul className="text-sm text-slate-600 space-y-1">
                {items.map((item, i) => (
                  <li key={i}>
                    {item.name} — {item.dosage}
                    {item.frequency ? ` · ${item.frequency}` : ''}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
