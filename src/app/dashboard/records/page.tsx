"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { FileText, Pill, Download, CheckCircle2, Send } from 'lucide-react';
import { medicalApi, type PrescriptionRow, type MedicalCertificateRow } from '@/lib/api';
import { formatAppDate } from '@/lib/appTime';
import { formatDoctorName } from '@/lib/format';
import { downloadMedicalCertificatePdf } from '@/lib/medicalPdf';
import PharmacyPicker from '@/components/PharmacyPicker';
import { IRISH_PHARMACIES, pharmacyLabel } from '@/lib/pharmacies';

export default function RecordsPage() {
  const [prescriptions, setPrescriptions] = useState<PrescriptionRow[]>([]);
  const [certificates, setCertificates] = useState<MedicalCertificateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'prescriptions' | 'certificates'>('prescriptions');
  const [error, setError] = useState<string | null>(null);
  const [preferredPharmacyId, setPreferredPharmacyId] = useState('');
  const [customPharmacy, setCustomPharmacy] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('qd-preferred-pharmacy');
      if (saved) {
        const parsed = JSON.parse(saved) as { id?: string; custom?: string };
        if (parsed.id) setPreferredPharmacyId(parsed.id);
        if (parsed.custom) setCustomPharmacy(parsed.custom);
      }
    } catch {
      /* ignore */
    }

    Promise.all([medicalApi.prescriptions(), medicalApi.certificates()])
      .then(([pre, cert]) => {
        setPrescriptions(pre);
        setCertificates(cert);
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : 'Failed to load records');
      })
      .finally(() => setLoading(false));
  }, []);

  const savePharmacyPreference = () => {
    localStorage.setItem(
      'qd-preferred-pharmacy',
      JSON.stringify({ id: preferredPharmacyId, custom: customPharmacy })
    );
  };

  const preferredLabel = (() => {
    if (!preferredPharmacyId) return null;
    const found = IRISH_PHARMACIES.find((p) => p.id === preferredPharmacyId);
    if (!found) return null;
    if (found.id === 'other') return customPharmacy || 'Other pharmacy';
    return pharmacyLabel(found);
  })();

  return (
    <DashboardLayout>
      <div className="space-y-10">
        <div>
          <h1 className="text-4xl font-black text-dark-slate dark:text-white">Medical records</h1>
          <p className="text-slate-500 mt-2">
            Certificates you can download, and prescription status (details are sent directly to your pharmacy).
          </p>
        </div>

        <div className="glass p-6 rounded-3xl space-y-3 max-w-xl">
          <h2 className="font-black">Your designated pharmacy</h2>
          <PharmacyPicker
            value={preferredPharmacyId}
            onChange={setPreferredPharmacyId}
            customName={customPharmacy}
            onCustomNameChange={setCustomPharmacy}
          />
          <button
            type="button"
            onClick={savePharmacyPreference}
            className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold"
          >
            Save pharmacy preference
          </button>
          {preferredLabel && (
            <p className="text-sm text-emerald-700 font-bold">Saved: {preferredLabel}</p>
          )}
        </div>

        <div className="flex p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl w-fit">
          {[
            { id: 'prescriptions' as const, label: 'Prescriptions', icon: Pill },
            { id: 'certificates' as const, label: 'Sick certificates', icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-800 text-primary medical-shadow'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <p className="p-4 rounded-2xl bg-red-50 text-red-600 font-bold text-sm">{error}</p>
        )}

        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <div className="py-20 text-center text-slate-400">Loading your records…</div>
          ) : activeTab === 'prescriptions' ? (
            prescriptions.length > 0 ? (
              prescriptions.map((item, i) => {
                const sent = Boolean(item.pharmacySentAt || item.sentToPharmacy);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass p-8 rounded-[40px] medical-shadow flex flex-col md:flex-row md:items-center justify-between gap-8"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                        <Pill className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black">Prescription issued</h3>
                        <p className="text-sm font-bold text-slate-500 mt-1">
                          {formatDoctorName(item.appointment?.doctor)} • {formatAppDate(item.issuedAt)}
                        </p>
                        <p className="text-xs text-slate-500 mt-2 max-w-md">
                          For Irish regulatory reasons, prescription details are sent securely to your pharmacy and are not
                          available to download from your account.
                        </p>
                        {item.pharmacyName && (
                          <p className="text-sm text-slate-600 mt-2 font-bold">Pharmacy: {item.pharmacyName}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {sent ? (
                        <span className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-black uppercase">
                          <CheckCircle2 className="w-4 h-4" /> Sent to pharmacy
                          {item.pharmacySentAt ? ` · ${formatAppDate(item.pharmacySentAt)}` : ''}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-50 text-amber-800 text-xs font-black uppercase">
                          <Send className="w-4 h-4" /> Awaiting pharmacy send
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="py-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800">
                <Pill className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="font-bold text-slate-500 mb-2">No prescriptions yet</p>
                <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
                  When a doctor issues a prescription, you will see status here. The document itself is sent to your pharmacy.
                </p>
                <Link
                  href="/book"
                  className="inline-block px-6 py-3 bg-primary text-white rounded-xl text-sm font-black"
                >
                  Book a consultation
                </Link>
              </div>
            )
          ) : certificates.length > 0 ? (
            certificates.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass p-8 rounded-[40px] medical-shadow flex flex-col md:flex-row md:items-center justify-between gap-8"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black">{item.reason}</h3>
                    <p className="text-sm font-bold text-slate-500 mt-1">
                      {formatDoctorName(item.appointment?.doctor)} • {formatAppDate(item.issuedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Duration</p>
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                      {formatAppDate(item.startDate)} – {formatAppDate(item.endDate)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => downloadMedicalCertificatePdf(item)}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="font-bold text-slate-500 mb-2">No certificates yet</p>
              <p className="text-sm text-slate-400 max-w-sm mx-auto">
                Sick certificates from your consultations will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
