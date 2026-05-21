"use client";

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Pill, Download, Search, 
  ChevronRight, Calendar, User, ExternalLink
} from 'lucide-react';
import { fetchApi } from '@/lib/api';

const RecordsPage = () => {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'prescriptions' | 'certificates'>('prescriptions');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pre, cert] = await Promise.all([
          fetchApi<any[]>('/medical/prescriptions/me'),
          fetchApi<any[]>('/medical/certificates/me'),
        ]);
        setPrescriptions(pre);
        setCertificates(cert);
      } catch (err) {
        console.error('Failed to fetch records:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-10">
        <div>
          <h1 className="text-4xl font-black text-dark-slate dark:text-white">Medical Records</h1>
          <p className="text-slate-500 mt-2">Access your digital prescriptions and medical certificates.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl w-fit">
           {[
             { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
             { id: 'certificates', label: 'Sick Certificates', icon: FileText }
           ].map((tab) => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex items-center gap-3 px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                 activeTab === tab.id ? 'bg-white dark:bg-slate-800 text-primary medical-shadow' : 'text-slate-500 hover:text-slate-700'
               }`}
             >
               <tab.icon className="w-4 h-4" />
               {tab.label}
             </button>
           ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 gap-6">
           {loading ? (
             <div className="py-20 text-center text-slate-400">Loading your records...</div>
           ) : activeTab === 'prescriptions' ? (
             prescriptions.length > 0 ? (
               prescriptions.map((item, i) => (
                 <motion.div
                   key={item.id}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="glass p-8 rounded-[40px] medical-shadow flex flex-col md:flex-row md:items-center justify-between gap-8 group"
                 >
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                          <Pill className="w-8 h-8" />
                       </div>
                       <div>
                          <h3 className="text-xl font-black group-hover:text-primary transition-colors">{item.medications}</h3>
                          <p className="text-sm font-bold text-slate-500 mt-1">Issued by Dr. {item.appointment?.doctor?.lastName} • {new Date(item.issuedAt).toLocaleDateString()}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="text-right hidden sm:block">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Dosage</p>
                          <p className="text-sm font-bold text-slate-600">{item.dosage}</p>
                       </div>
                       <button className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                          <Download className="w-4 h-4" />
                          Download PDF
                       </button>
                    </div>
                 </motion.div>
               ))
             ) : (
               <div className="py-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800">
                  <Pill className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="font-bold text-slate-500">No prescriptions issued yet.</p>
               </div>
             )
           ) : (
             certificates.length > 0 ? (
               certificates.map((item, i) => (
                 <motion.div
                   key={item.id}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="glass p-8 rounded-[40px] medical-shadow flex flex-col md:flex-row md:items-center justify-between gap-8 group"
                 >
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center">
                          <FileText className="w-8 h-8" />
                       </div>
                       <div>
                          <h3 className="text-xl font-black group-hover:text-primary transition-colors">{item.reason}</h3>
                          <p className="text-sm font-bold text-slate-500 mt-1">Issued by Dr. {item.appointment?.doctor?.lastName} • {new Date(item.issuedAt).toLocaleDateString()}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="text-right hidden sm:block">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Duration</p>
                          <p className="text-sm font-bold text-slate-600">
                             {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                          </p>
                       </div>
                       <button className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                          <Download className="w-4 h-4" />
                          Download PDF
                       </button>
                    </div>
                 </motion.div>
               ))
             ) : (
               <div className="py-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="font-bold text-slate-500">No medical certificates issued yet.</p>
               </div>
             )
           )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RecordsPage;
