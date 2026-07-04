"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video, FileText, Pill, X, ChevronLeft, AlertCircle, Shield,
  Plus, Trash2, Eye, CheckCircle2, Download,
} from 'lucide-react';
import { appointmentApi, medicalApi, type PrescriptionRow, type MedicalCertificateRow } from '@/lib/api';
import { emptyMedicine, itemsFromPrescription, type PrescriptionItem } from '@/lib/prescriptionItems';
import { doctorVideoCallUrl } from '@/lib/doctorRoutes';
import { downloadPrescriptionPdf, downloadMedicalCertificatePdf } from '@/lib/medicalPdf';

function resolveAppointmentId(
  params: ReturnType<typeof useParams>,
  searchParams: ReturnType<typeof useSearchParams>
) {
  const fromQuery = searchParams.get('id');
  if (fromQuery) return fromQuery;
  const raw = params?.id;
  const fromPath = Array.isArray(raw) ? raw[0] : raw;
  if (fromPath && fromPath !== '_') return String(fromPath);
  return '';
}

function ConsultationRoomContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const appointmentId = resolveAppointmentId(params, searchParams);
  const router = useRouter();
  const [appointment, setAppointment] = useState<AppointmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'notes' | 'prescription' | 'certificate'>('notes');
  const [message, setMessage] = useState<string | null>(null);

  const [notes, setNotes] = useState('');
  const [medicines, setMedicines] = useState<PrescriptionItem[]>([emptyMedicine()]);
  const [generalInstructions, setGeneralInstructions] = useState('');
  const [certData, setCertData] = useState({ reason: '', startDate: '', endDate: '' });
  const [showPreview, setShowPreview] = useState(false);
  const [processing, setProcessing] = useState(false);

  const loadAppointment = async () => {
    if (!appointmentId) return;
    const data = (await appointmentApi.get(appointmentId)) as unknown as AppointmentDetail;
    setAppointment(data);
    setNotes(data.clinicalNotes || data.notes || '');
    if (data.prescription) {
      setMedicines(itemsFromPrescription(data.prescription));
      setGeneralInstructions(data.prescription.instructions || '');
    }
    if (data.certificate) {
      setCertData({
        reason: data.certificate.reason,
        startDate: data.certificate.startDate.slice(0, 10),
        endDate: data.certificate.endDate.slice(0, 10),
      });
    }
  };

  useEffect(() => {
    if (!appointmentId) {
      setLoading(false);
      return;
    }
    appointmentApi
      .get(appointmentId)
      .then((data) => {
        const appt = data as unknown as AppointmentDetail;
        setAppointment(appt);
        setNotes(appt.clinicalNotes || appt.notes || '');
        if (appt.prescription) {
          setMedicines(itemsFromPrescription(appt.prescription));
          setGeneralInstructions(appt.prescription.instructions || '');
        }
        if (appt.certificate) {
          setCertData({
            reason: appt.certificate.reason,
            startDate: appt.certificate.startDate.slice(0, 10),
            endDate: appt.certificate.endDate.slice(0, 10),
          });
        }
      })
      .catch(() => setMessage('Could not load consultation'))
      .finally(() => setLoading(false));
  }, [appointmentId]);

  const saveNotes = async () => {
    if (!appointmentId) return;
    setProcessing(true);
    setMessage(null);
    try {
      await appointmentApi.saveNotes(appointmentId, notes);
      setMessage('Clinical notes saved');
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Failed to save notes');
    } finally {
      setProcessing(false);
    }
  };

  const startVideo = async () => {
    if (!appointmentId) return;
    try {
      const r = await appointmentApi.getJoin(appointmentId);
      if (r.canJoin && r.url) {
        if (r.url.includes('/doctor/consultations') || r.url.includes('/doctor/video-call')) {
          window.open(doctorVideoCallUrl(appointmentId), '_blank', 'noopener,noreferrer');
        } else {
          window.open(r.url, '_blank', 'noopener,noreferrer');
        }
      } else {
        setMessage(r.message || 'Video not available yet. Join opens 5 minutes before the appointment.');
      }
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Failed to start video');
    }
  };

  const updateMedicine = (index: number, field: keyof PrescriptionItem, value: string) => {
    setMedicines((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)));
  };

  const handleIssuePrescription = async () => {
    if (!appointment) return;
    const validItems = medicines.filter((m) => m.name.trim() && m.dosage.trim());
    if (validItems.length === 0) {
      setMessage('Add at least one medicine with name and dosage');
      return;
    }

    setProcessing(true);
    setMessage(null);
    try {
      await medicalApi.issuePrescription({
        appointmentId,
        patientId: appointment.patientId,
        items: validItems,
        instructions: generalInstructions || undefined,
      });
      setShowPreview(false);
      setMessage(appointment.prescription ? 'Prescription updated' : 'Prescription issued to patient');
      await loadAppointment();
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Failed to issue prescription');
    } finally {
      setProcessing(false);
    }
  };

  const handleIssueCertificate = async () => {
    if (!appointment) return;
    if (!certData.reason.trim() || !certData.startDate || !certData.endDate) {
      setMessage('Fill in reason and dates for the certificate');
      return;
    }

    setProcessing(true);
    setMessage(null);
    try {
      await medicalApi.issueCertificate({
        appointmentId,
        patientId: appointment.patientId,
        ...certData,
      });
      setMessage(appointment.certificate ? 'Certificate updated' : 'Certificate issued to patient');
      await loadAppointment();
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Failed to issue certificate');
    } finally {
      setProcessing(false);
    }
  };

  const endConsultation = async () => {
    if (!confirm('Mark this consultation as completed?')) return;
    setProcessing(true);
    try {
      await appointmentApi.complete(appointmentId);
      setMessage('Consultation marked complete');
      await loadAppointment();
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : 'Could not complete consultation');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading consultation room…</div>;
  if (!appointmentId) {
    return (
      <div className="p-10 text-center space-y-4">
        <p className="text-slate-500">No appointment selected.</p>
        <button
          type="button"
          onClick={() => router.push('/doctor/consultations')}
          className="text-secondary font-bold"
        >
          Back to consultations
        </button>
      </div>
    );
  }
  if (!appointment?.patient) {
    return <div className="p-10 text-center text-slate-500">Consultation not found or access denied.</div>;
  }

  const isComplete = appointment.status === 'COMPLETED';
  const validPreviewItems = medicines.filter((m) => m.name.trim() && m.dosage.trim());

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 font-bold hover:text-secondary transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to consultations
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${
            isComplete ? 'bg-slate-100 text-slate-600' : 'bg-green-100 text-green-600'
          }`}>
            {appointment.status.replace('_', ' ')}
          </span>
          {!isComplete && (
            <button
              type="button"
              disabled={processing}
              onClick={endConsultation}
              className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-black disabled:opacity-50"
            >
              End consultation
            </button>
          )}
        </div>
      </div>

      {message && (
        <p className="p-4 rounded-2xl bg-secondary/10 text-secondary font-bold text-sm">{message}</p>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-video bg-slate-900 rounded-[32px] overflow-hidden shadow-xl">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white/70 px-6">
                <Video className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-sm font-bold uppercase tracking-widest mb-4">Video consultation</p>
                <button
                  type="button"
                  onClick={startVideo}
                  className="px-6 py-3 bg-secondary text-white rounded-xl font-black text-sm"
                >
                  Start / join meeting
                </button>
              </div>
            </div>
          </div>

          <div className="glass p-6 md:p-8 rounded-[32px]">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center font-black text-xl">
                {appointment.patient.firstName.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-black">
                  {appointment.patient.firstName} {appointment.patient.lastName}
                </h3>
                <p className="text-slate-500 text-sm">
                  DOB: {new Date(appointment.patient.dob).toLocaleDateString()} ·{' '}
                  {appointment.patient.gender || 'Gender not specified'}
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Patient notes
                </h4>
                <p className="text-sm text-slate-600">{appointment.notes || 'No notes from patient.'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Issued documents
                </h4>
                <p className="text-sm text-slate-600">
                  {appointment.prescription ? '✓ Prescription on file' : 'No prescription yet'}
                  <br />
                  {appointment.certificate ? '✓ Certificate on file' : 'No certificate yet'}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {appointment.prescription && (
                    <button
                      type="button"
                      onClick={() =>
                        downloadPrescriptionPdf(appointment.prescription!, {
                          patientName: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
                        })
                      }
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary"
                    >
                      <Download className="w-3 h-3" /> Rx PDF
                    </button>
                  )}
                  {appointment.certificate && (
                    <button
                      type="button"
                      onClick={() =>
                        downloadMedicalCertificatePdf(appointment.certificate!, {
                          patientName: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
                        })
                      }
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary"
                    >
                      <Download className="w-3 h-3" /> Cert PDF
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-[32px] overflow-hidden flex flex-col min-h-[640px]">
          <div className="flex border-b border-slate-100 dark:border-slate-800 p-2">
            {(['notes', 'prescription', 'certificate'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                  activeTab === tab ? 'bg-secondary text-white' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'notes' && (
                <motion.div key="notes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <h4 className="font-bold">Clinical notes</h4>
                  <textarea
                    className="w-full h-72 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none text-sm resize-none"
                    placeholder="Examination findings, diagnosis, plan…"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={saveNotes}
                    disabled={processing}
                    className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold text-sm disabled:opacity-50"
                  >
                    Save notes
                  </button>
                </motion.div>
              )}

              {activeTab === 'prescription' && (
                <motion.div key="rx" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold">Prescription</h4>
                    {appointment.prescription && (
                      <span className="text-[10px] font-black uppercase text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Issued
                      </span>
                    )}
                  </div>

                  {medicines.map((med, index) => (
                    <div key={index} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-black text-slate-400">Medicine {index + 1}</p>
                        {medicines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setMedicines((prev) => prev.filter((_, i) => i !== index))}
                            className="text-red-500 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <input
                        placeholder="Medicine name (e.g. Amoxicillin 500mg)"
                        value={med.name}
                        onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                        className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border-none text-sm"
                      />
                      <input
                        placeholder="Dosage (e.g. 1 capsule)"
                        value={med.dosage}
                        onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                        className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border-none text-sm"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          placeholder="Frequency"
                          value={med.frequency || ''}
                          onChange={(e) => updateMedicine(index, 'frequency', e.target.value)}
                          className="p-3 rounded-xl bg-white dark:bg-slate-800 border-none text-sm"
                        />
                        <input
                          placeholder="Duration"
                          value={med.duration || ''}
                          onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                          className="p-3 rounded-xl bg-white dark:bg-slate-800 border-none text-sm"
                        />
                      </div>
                      <input
                        placeholder="Special instructions for this medicine"
                        value={med.instructions || ''}
                        onChange={(e) => updateMedicine(index, 'instructions', e.target.value)}
                        className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border-none text-sm"
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => setMedicines((prev) => [...prev, emptyMedicine()])}
                    className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-sm font-bold text-secondary flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add another medicine
                  </button>

                  <textarea
                    placeholder="General pharmacist instructions (optional)"
                    value={generalInstructions}
                    onChange={(e) => setGeneralInstructions(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-sm h-20"
                  />

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPreview(true)}
                      disabled={validPreviewItems.length === 0}
                      className="flex-1 py-3 border border-secondary text-secondary rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40"
                    >
                      <Eye className="w-4 h-4" /> Preview receipt
                    </button>
                    <button
                      type="button"
                      onClick={handleIssuePrescription}
                      disabled={processing}
                      className="flex-1 py-3 bg-secondary text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Pill className="w-4 h-4" />
                      {appointment.prescription ? 'Update Rx' : 'Issue Rx'}
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'certificate' && (
                <motion.div key="cert" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold">Medical certificate</h4>
                    {appointment.certificate && (
                      <span className="text-[10px] font-black uppercase text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Issued
                      </span>
                    )}
                  </div>
                  <input
                    placeholder="Reason for absence"
                    value={certData.reason}
                    onChange={(e) => setCertData({ ...certData, reason: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={certData.startDate}
                      onChange={(e) => setCertData({ ...certData, startDate: e.target.value })}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-sm"
                    />
                    <input
                      type="date"
                      value={certData.endDate}
                      onChange={(e) => setCertData({ ...certData, endDate: e.target.value })}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleIssueCertificate}
                    disabled={processing}
                    className="w-full py-3 bg-secondary text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <FileText className="w-4 h-4" />
                    {appointment.certificate ? 'Update certificate' : 'Issue certificate'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black">Prescription preview</h3>
              <button type="button" onClick={() => setShowPreview(false)}><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-slate-500">
              Patient: {appointment.patient.firstName} {appointment.patient.lastName}
            </p>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {validPreviewItems.map((med, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 text-sm">
                  <p className="font-bold">{med.name}</p>
                  <p>{med.dosage}{med.frequency ? ` · ${med.frequency}` : ''}{med.duration ? ` · ${med.duration}` : ''}</p>
                  {med.instructions && <p className="text-slate-500 mt-1">{med.instructions}</p>}
                </div>
              ))}
            </div>
            {generalInstructions && (
              <p className="text-sm text-slate-600"><strong>Notes:</strong> {generalInstructions}</p>
            )}
            <button
              type="button"
              onClick={handleIssuePrescription}
              disabled={processing}
              className="w-full py-3 bg-secondary text-white rounded-xl font-black disabled:opacity-50"
            >
              Confirm & issue to patient
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

type AppointmentDetail = {
  id: string;
  status: string;
  patientId: string;
  notes?: string | null;
  clinicalNotes?: string | null;
  patient: { firstName: string; lastName: string; dob: string; gender?: string };
  prescription?: PrescriptionRow | null;
  certificate?: MedicalCertificateRow | null;
};

export default function ConsultationRoomClient() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-slate-500">Loading consultation room…</div>}>
      <ConsultationRoomContent />
    </Suspense>
  );
}
