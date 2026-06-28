"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { FileText, Pill, Download } from 'lucide-react';
import { medicalApi, type PrescriptionRow, type MedicalCertificateRow } from '@/lib/api';
import { formatDoctorName, downloadTextFile } from '@/lib/format';

function downloadPrescription(item: PrescriptionRow) {
  const doctor = formatDoctorName(item.appointment?.doctor);
  const text = [
    'QuickDoctor — Prescription',
    '========================',
    '',
    `Medication: ${item.medications}`,
    `Dosage: ${item.dosage}`,
    item.instructions ? `Instructions: ${item.instructions}` : '',
    '',
    `Issued by: ${doctor}`,
    `Date: ${new Date(item.issuedAt).toLocaleString()}`,
    '',
    'Present this at your pharmacy.',
  ]
    .filter(Boolean)
    .join('\n');
  downloadTextFile(`prescription-${item.id.slice(0, 8)}.txt`, text);
}

function downloadCertificate(item: MedicalCertificateRow) {
  const doctor = formatDoctorName(item.appointment?.doctor);
  const text = [
    'QuickDoctor — Medical Certificate',
    '=================================',
    '',
    `Reason: ${item.reason}`,
    `From: ${new Date(item.startDate).toLocaleDateString()}`,
    `To: ${new Date(item.endDate).toLocaleDateString()}`,
    '',
    `Issued by: ${doctor}`,
    `Issued on: ${new Date(item.issuedAt).toLocaleString()}`,
  ].join('\n');
  downloadTextFile(`certificate-${item.id.slice(0, 8)}.txt`, text);
}

export default function RecordsPage() {
  const [prescriptions, setPrescriptions] = useState<PrescriptionRow[]>([]);
  const [certificates, setCertificates] = useState<MedicalCertificateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'prescriptions' | 'certificates'>('prescriptions');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

  return (
    <DashboardLayout>
      <div className="space-y-10">
        <div>
          <h1 className="text-4xl font-black text-dark-slate dark:text-white">Medical records</h1>
          <p className="text-slate-500 mt-2">
            Prescriptions and sick certificates issued after your consultations.
          </p>
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
              prescriptions.map((item, i) => (
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
                      <h3 className="text-xl font-black">{item.medications}</h3>
                      <p className="text-sm font-bold text-slate-500 mt-1">
                        {formatDoctorName(item.appointment?.doctor)} •{' '}
                        {new Date(item.issuedAt).toLocaleDateString()}
                      </p>
                      {item.instructions && (
                        <p className="text-xs text-slate-400 mt-2">{item.instructions}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                        Dosage
                      </p>
                      <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                        {item.dosage}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => downloadPrescription(item)}
                      className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800">
                <Pill className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="font-bold text-slate-500 mb-2">No prescriptions yet</p>
                <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
                  After a consultation, your doctor can issue a prescription — it will show up here.
                </p>
                <Link
                  href="/doctors"
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
                      {formatDoctorName(item.appointment?.doctor)} •{' '}
                      {new Date(item.issuedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                      Duration
                    </p>
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                      {new Date(item.startDate).toLocaleDateString()} –{' '}
                      {new Date(item.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => downloadCertificate(item)}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download
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
