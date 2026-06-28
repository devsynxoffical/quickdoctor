"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Video, FileText, Pill, X,
  ChevronLeft, AlertCircle,
  Activity, Shield
} from 'lucide-react';
import { appointmentApi, fetchApi } from '@/lib/api';

export default function ConsultationRoomClient() {
  const { id } = useParams();
  const router = useRouter();
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'notes' | 'prescription' | 'certificate'>('notes');
  
  // Form states
  const [notes, setNotes] = useState('');
  const [prescriptionData, setPrescriptionData] = useState({ medications: '', dosage: '', instructions: '' });
  const [certData, setCertData] = useState({ reason: '', startDate: '', endDate: '' });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const data = await fetchApi<{
          id: string;
          patientId: string;
          patient: { firstName: string; lastName: string; dob: string; gender?: string };
          notes?: string | null;
          clinicalNotes?: string | null;
        }>(`/appointments/${id}`);
        setAppointment(data);
        if (data.notes) setNotes(data.notes);
        if (data.clinicalNotes) setNotes(data.clinicalNotes);
      } catch (err) {
        console.error('Failed to fetch appointment:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [id]);

  const saveNotes = async () => {
    setProcessing(true);
    try {
      await appointmentApi.saveNotes(String(id), notes);
      alert('Clinical notes saved');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setProcessing(false);
    }
  };

  const startVideo = async () => {
    try {
      const r = await appointmentApi.getJoin(String(id));
      if (r.canJoin && r.url) window.open(r.url, '_blank', 'noopener,noreferrer');
      else alert(r.message || 'Video not available');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed');
    }
  };

  const handleIssuePrescription = async () => {
    setProcessing(true);
    try {
      await fetchApi('/medical/prescription', {
        method: 'POST',
        body: JSON.stringify({
          appointmentId: id,
          patientId: appointment.patientId,
          ...prescriptionData
        })
      });
      alert('Prescription issued successfully!');
      router.push('/doctor');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleIssueCertificate = async () => {
    setProcessing(true);
    try {
      await fetchApi('/medical/certificate', {
        method: 'POST',
        body: JSON.stringify({
          appointmentId: id,
          patientId: appointment.patientId,
          ...certData
        })
      });
      alert('Medical certificate issued successfully!');
      router.push('/doctor');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading consultation room...</div>;
  if (!appointment?.patient) {
    return (
              <div className="p-10 text-center text-slate-500">Consultation not found or you do not have access.</div>
          );
  }

  return (
          <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 font-bold hover:text-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
             <span className="px-4 py-2 rounded-full bg-green-100 text-green-600 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live Consultation
             </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left: Video & Patient Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video Mockup */}
            <div className="relative aspect-video bg-slate-900 rounded-[40px] overflow-hidden medical-shadow group">
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white/50">
                     <Video className="w-20 h-20 mx-auto mb-4 opacity-20" />
                     <p className="text-sm font-bold uppercase tracking-widest mb-4">Zoom video consultation</p>
                     <button
                       type="button"
                       onClick={startVideo}
                       className="px-6 py-3 bg-secondary text-white rounded-xl font-black text-sm"
                     >
                       Start meeting
                     </button>
                  </div>
               </div>
               
               {/* Doctor's mini view */}
               <div className="absolute bottom-6 right-6 w-40 h-28 bg-slate-800 rounded-2xl border-2 border-white/20 overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 flex items-center justify-center bg-secondary/10">
                     <User className="w-8 h-8 text-secondary/40" />
                  </div>
               </div>

               {/* Controls */}
               <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20">
                     <Activity className="w-5 h-5" />
                  </button>
                  <button className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 medical-shadow">
                     <X className="w-5 h-5" />
                  </button>
               </div>
            </div>

            {/* Patient File Summary */}
            <div className="glass p-8 rounded-[40px] medical-shadow">
               <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                     <div className="w-16 h-16 rounded-3xl bg-secondary/10 text-secondary flex items-center justify-center font-black text-2xl">
                        {appointment.patient.firstName.charAt(0)}
                     </div>
                     <div>
                        <h3 className="text-2xl font-bold">{appointment.patient.firstName} {appointment.patient.lastName}</h3>
                        <p className="text-slate-500 font-medium">DOB: {new Date(appointment.patient.dob).toLocaleDateString()} • Gender: {appointment.patient.gender || 'Not Specified'}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Consultation ID</p>
                     <p className="text-sm font-bold text-slate-600">#{appointment.id.substring(0,8)}</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-8">
                  <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/50">
                     <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> Reported Symptoms
                     </h4>
                     <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {appointment.notes || 'No notes provided by patient.'}
                     </p>
                  </div>
                  <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/50">
                     <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4" /> Medical History
                     </h4>
                     <p className="text-sm text-slate-500 italic">No previous records available in system.</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Right: Clinical Workspace */}
          <div className="space-y-6">
             <div className="glass rounded-[40px] medical-shadow overflow-hidden flex flex-col h-full min-h-[600px]">
                {/* Tabs */}
                <div className="flex border-b border-slate-100 dark:border-slate-800 p-2">
                   {['notes', 'prescription', 'certificate'].map((tab) => (
                      <button 
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${
                          activeTab === tab ? 'bg-secondary text-white medical-shadow' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {tab}
                      </button>
                   ))}
                </div>

                {/* Tab Content */}
                <div className="flex-1 p-8 overflow-y-auto">
                   <AnimatePresence mode="wait">
                      {activeTab === 'notes' && (
                        <motion.div 
                          key="notes"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-4"
                        >
                           <h4 className="font-bold">Clinical Notes</h4>
                           <textarea 
                             className="w-full h-80 p-5 rounded-3xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-secondary transition-all resize-none text-sm"
                             placeholder="Type your clinical findings and observations here..."
                             value={notes}
                             onChange={(e) => setNotes(e.target.value)}
                           />
                           <button
                             type="button"
                             onClick={saveNotes}
                             disabled={processing}
                             className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold text-sm disabled:opacity-50"
                           >
                             Save clinical notes
                           </button>
                        </motion.div>
                      )}

                      {activeTab === 'prescription' && (
                        <motion.div 
                          key="prescription"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-6"
                        >
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Medication Name</label>
                              <input 
                                type="text"
                                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none text-sm"
                                placeholder="e.g. Amoxicillin 500mg"
                                value={prescriptionData.medications}
                                onChange={(e) => setPrescriptionData({...prescriptionData, medications: e.target.value})}
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dosage</label>
                              <input 
                                type="text"
                                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none text-sm"
                                placeholder="e.g. 1 capsule three times daily"
                                value={prescriptionData.dosage}
                                onChange={(e) => setPrescriptionData({...prescriptionData, dosage: e.target.value})}
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Instructions</label>
                              <textarea 
                                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none text-sm h-32"
                                placeholder="Pharmacist instructions..."
                                value={prescriptionData.instructions}
                                onChange={(e) => setPrescriptionData({...prescriptionData, instructions: e.target.value})}
                              />
                           </div>
                           <button 
                             onClick={handleIssuePrescription}
                             disabled={processing}
                             className="w-full py-4 bg-secondary text-white rounded-2xl font-black text-sm uppercase tracking-widest medical-shadow hover:scale-105 transition-all flex items-center justify-center gap-2"
                           >
                              <Pill className="w-4 h-4" />
                              {processing ? 'Issuing...' : 'Issue Prescription'}
                           </button>
                        </motion.div>
                      )}

                      {activeTab === 'certificate' && (
                        <motion.div 
                          key="certificate"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-6"
                        >
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reason for Absence</label>
                              <input 
                                type="text"
                                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none text-sm"
                                placeholder="e.g. Acute Respiratory Infection"
                                value={certData.reason}
                                onChange={(e) => setCertData({...certData, reason: e.target.value})}
                              />
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Start Date</label>
                                 <input 
                                   type="date"
                                   className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none text-sm"
                                   value={certData.startDate}
                                   onChange={(e) => setCertData({...certData, startDate: e.target.value})}
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">End Date</label>
                                 <input 
                                   type="date"
                                   className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none text-sm"
                                   value={certData.endDate}
                                   onChange={(e) => setCertData({...certData, endDate: e.target.value})}
                                 />
                              </div>
                           </div>
                           <button 
                             onClick={handleIssueCertificate}
                             disabled={processing}
                             className="w-full py-4 bg-secondary text-white rounded-2xl font-black text-sm uppercase tracking-widest medical-shadow hover:scale-105 transition-all flex items-center justify-center gap-2"
                           >
                              <FileText className="w-4 h-4" />
                              {processing ? 'Issuing...' : 'Issue Certificate'}
                           </button>
                        </motion.div>
                      )}
                   </AnimatePresence>
                </div>
             </div>
          </div>
        </div>
      </div>
      );
}
