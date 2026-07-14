"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Pill, ChevronRight, Download, Send } from 'lucide-react';
import { medicalApi, type PrescriptionRow } from '@/lib/api';
import { formatAppDateTime } from '@/lib/appTime';
import { doctorConsultationUrl } from '@/lib/doctorRoutes';
import { itemsFromPrescription } from '@/lib/prescriptionItems';
import { downloadPrescriptionPdf } from '@/lib/medicalPdf';
import PharmacyPicker from '@/components/PharmacyPicker';
import { resolvePharmacySelection } from '@/lib/pharmacies';

export default function DoctorPrescriptionsPage() {
  const [rows, setRows] = useState<PrescriptionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [pharmacyByRx, setPharmacyByRx] = useState<Record<string, { id: string; custom: string }>>({});

  const load = () => {
    setLoading(true);
    medicalApi
      .doctorPrescriptions()
      .then(setRows)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Failed to load prescriptions'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const sendToPharmacy = async (rx: PrescriptionRow) => {
    const pick = pharmacyByRx[rx.id];
    const resolved = resolvePharmacySelection(pick?.id || '', pick?.custom || '');
    const pharmacyName = resolved?.name || rx.pharmacyName || '';
    if (!pharmacyName.trim()) {
      alert('Select or enter a pharmacy before marking as sent.');
      return;
    }
    setSendingId(rx.id);
    try {
      await medicalApi.sendToPharmacy(rx.id, {
        pharmacyName,
        pharmacyCounty: resolved?.county || rx.pharmacyCounty || undefined,
        pharmacyAddress: resolved?.address || undefined,
      });
      load();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to mark sent');
    } finally {
      setSendingId(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h1 className="text-4xl font-black">Prescriptions</h1>
        <p className="text-slate-500 mt-2">
          Download the PDF and send it securely to the patient&apos;s pharmacy. Patients only see send status, not the
          prescription itself.
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
          const pick = pharmacyByRx[rx.id] || { id: '', custom: '' };
          const sent = Boolean(rx.pharmacySentAt);

          return (
            <div key={rx.id} className="glass p-5 rounded-2xl space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-black flex items-center gap-2">
                    <Pill className="w-4 h-4 text-secondary" />
                    {patient ? `${patient.firstName} ${patient.lastName}` : 'Patient'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Issued {formatAppDateTime(rx.issuedAt)}
                  </p>
                  {sent && (
                    <p className="text-sm text-emerald-700 font-bold mt-2">
                      Sent to {rx.pharmacyName || 'pharmacy'}
                      {rx.pharmacySentAt ? ` · ${formatAppDateTime(rx.pharmacySentAt)}` : ''}
                    </p>
                  )}
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
              {!sent && (
                <div className="grid md:grid-cols-[1fr_auto] gap-3 items-end border-t border-slate-100 dark:border-slate-800 pt-4">
                  <PharmacyPicker
                    value={pick.id}
                    onChange={(id) =>
                      setPharmacyByRx((prev) => ({ ...prev, [rx.id]: { id, custom: prev[rx.id]?.custom || '' } }))
                    }
                    customName={pick.custom}
                    onCustomNameChange={(custom) =>
                      setPharmacyByRx((prev) => ({
                        ...prev,
                        [rx.id]: { id: prev[rx.id]?.id || 'other', custom },
                      }))
                    }
                    label="Send to pharmacy"
                  />
                  <button
                    type="button"
                    disabled={sendingId === rx.id}
                    onClick={() => sendToPharmacy(rx)}
                    className="inline-flex items-center gap-1 px-4 py-3 rounded-xl bg-secondary text-white text-sm font-bold disabled:opacity-60"
                  >
                    <Send className="w-4 h-4" />
                    {sendingId === rx.id ? 'Sending…' : 'Mark sent & notify patient'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
