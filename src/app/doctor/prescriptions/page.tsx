"use client";

import React, { useState } from 'react';
import DoctorDashboardLayout from '@/components/DoctorDashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Pill, Plus, Trash2, 
  Download, Send, AlertTriangle,
  CheckCircle2, X, ClipboardList, FileText
} from 'lucide-react';

const PrescriptionGenerator = () => {
  const [items, setItems] = useState<{name: string, dose: string, freq: string, dur: string}[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const medicineDb = [
    { name: 'Amoxicillin', strength: '500mg', class: 'Antibiotic' },
    { name: 'Ibuprofen', strength: '400mg', class: 'NSAID' },
    { name: 'Paracetamol', strength: '500mg', class: 'Analgesic' },
    { name: 'Ventolin', strength: '100mcg', class: 'Bronchodilator' },
    { name: 'Cetirizine', strength: '10mg', class: 'Antihistamine' },
  ];

  const addItem = (med: any) => {
    setItems([...items, { name: med.name, dose: med.strength, freq: 'Twice daily', dur: '7 Days' }]);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-4xl font-bold text-dark-slate dark:text-white mb-2">Issue Prescription</h1>
            <p className="text-slate-500">Create a secure digital prescription for your patient.</p>
         </div>
         <button 
           onClick={() => setShowPreview(true)}
           disabled={items.length === 0}
           className="px-8 py-4 bg-secondary text-white rounded-2xl font-bold medical-shadow flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50 disabled:grayscale"
         >
            <Download className="w-5 h-5" />
            Preview & Issue
         </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
         {/* Left: Search & Build */}
         <div className="space-y-8">
            <div className="glass p-8 rounded-[40px] medical-shadow">
               <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Search className="text-secondary w-5 h-5" />
                  Search Medicine Database
               </h3>
               <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Type medicine name (e.g. Amoxicillin)..." 
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-secondary transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>

               <div className="space-y-2">
                  {medicineDb.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase())).map((med, i) => (
                     <button 
                       key={i}
                       onClick={() => addItem(med)}
                       className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-secondary hover:bg-secondary/5 transition-all group"
                     >
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-secondary">
                              <Pill className="w-5 h-5" />
                           </div>
                           <div className="text-left">
                              <p className="font-bold text-sm tracking-tight">{med.name} ({med.strength})</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase">{med.class}</p>
                           </div>
                        </div>
                        <Plus className="w-5 h-5 text-slate-300 group-hover:text-secondary" />
                     </button>
                  ))}
               </div>
            </div>

            {/* Safety Alerts Panel */}
            <div className="p-6 rounded-[32px] bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
               <div className="flex items-center gap-2 text-amber-600 mb-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-widest">Clinical Safety Alert</span>
               </div>
               <p className="text-xs text-slate-700 dark:text-slate-300">
                  System checking for allergies... <span className="font-bold text-green-600">No interactions detected</span> for selected combinations.
               </p>
            </div>
         </div>

         {/* Right: Current Script */}
         <div className="space-y-6">
            <div className="glass p-10 rounded-[40px] medical-shadow min-h-[500px] flex flex-col">
               <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Patient</p>
                     <h4 className="text-xl font-bold">Liam O'Brien</h4>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Prescription ID</p>
                     <p className="font-black text-secondary">RX-2026-0042</p>
                  </div>
               </div>

               <div className="flex-1 space-y-4">
                  {items.length === 0 ? (
                     <div className="flex flex-col items-center justify-center h-full text-center py-20 opacity-40">
                        <ClipboardList className="w-16 h-16 mb-4" />
                        <p className="font-bold">No medications added yet</p>
                        <p className="text-xs">Search and select items from the database</p>
                     </div>
                  ) : (
                     items.map((item, i) => (
                        <motion.div 
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          key={i}
                          className="p-5 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between group"
                        >
                           <div>
                              <h5 className="font-bold text-secondary mb-1">{item.name}</h5>
                              <p className="text-xs text-slate-500 font-medium">Dose: {item.dose} • {item.freq} • {item.dur}</p>
                           </div>
                           <button 
                             onClick={() => setItems(items.filter((_, idx) => idx !== i))}
                             className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                           >
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </motion.div>
                     ))
                  )}
               </div>

               <div className="mt-10 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Physician Notes</p>
                  <textarea 
                    placeholder="Add clinical instructions or notes for the pharmacist..."
                    className="w-full bg-transparent border-none resize-none text-sm focus:ring-0 p-0 text-slate-600 dark:text-slate-300 min-h-[80px]"
                  />
               </div>
            </div>
         </div>
      </div>

      {/* Prescription Preview Modal */}
      <AnimatePresence>
        {showPreview && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                onClick={() => setShowPreview(false)}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-[40px] p-0 shadow-2xl no-scrollbar"
              >
                 {/* Modal Header */}
                 <div className="sticky top-0 z-10 px-10 py-6 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                       <FileText className="text-secondary w-6 h-6" />
                       Prescription Preview
                    </h2>
                    <button onClick={() => setShowPreview(false)} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                       <X className="w-5 h-5" />
                    </button>
                 </div>

                 {/* Mock PDF Content */}
                 <div className="p-16">
                    <div className="max-w-2xl mx-auto bg-white text-black p-12 border border-slate-200 shadow-sm font-serif min-h-[800px]">
                       <div className="flex justify-between items-start mb-12">
                          <div>
                             <h1 className="text-3xl font-black mb-2 text-blue-800">QuickDoctor</h1>
                             <p className="text-xs uppercase tracking-widest text-slate-500">Digital Health Services</p>
                          </div>
                          <div className="text-right text-xs">
                             <p className="font-bold">RX-2026-0042</p>
                             <p>Date: April 20, 2026</p>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-8 mb-12 pb-8 border-b border-slate-100">
                          <div>
                             <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">Patient Details</p>
                             <p className="font-bold text-lg">Liam O'Brien</p>
                             <p className="text-sm">DOB: 12/05/1992</p>
                             <p className="text-sm">Dublin, Republic of Ireland</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">Prescribing Physician</p>
                             <p className="font-bold text-lg">Dr. Sarah Johnson</p>
                             <p className="text-sm">IMC Registration: #458293</p>
                             <p className="text-sm">Telemedicine Center 1</p>
                          </div>
                       </div>

                       <div className="space-y-8 mb-20">
                          <h3 className="text-xl font-bold italic border-b-2 border-slate-900 pb-2">Rx</h3>
                          {items.map((item, i) => (
                             <div key={i} className="pl-6">
                                <p className="text-lg font-black">{item.name} {item.dose}</p>
                                <p className="text-sm italic">Sig: {item.freq}, Duration: {item.dur}</p>
                             </div>
                          ))}
                       </div>

                       <div className="mt-auto pt-10 flex justify-between items-end">
                          <div className="text-[10px] text-slate-400 max-w-[200px]">
                             This is a digitally generated prescription. Authenticity can be verified at quickdoctor.ie/verify
                          </div>
                          <div className="text-center">
                             <div className="w-32 h-12 border-b-2 border-slate-900 mb-2 flex items-center justify-center font-cursive text-xl text-blue-900 opacity-70">
                                S. Johnson
                             </div>
                             <p className="text-[10px] font-bold uppercase tracking-widest">Digital Signature</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Footer Actions */}
                 <div className="p-10 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex gap-4">
                    <button className="flex-1 py-5 bg-secondary text-white rounded-2xl font-bold medical-shadow flex items-center justify-center gap-3 hover:scale-105 transition-all">
                       <Send className="w-6 h-6" />
                       Send to Patient Pharmacy
                    </button>
                    <button className="px-10 py-5 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-bold flex items-center gap-2">
                       <Download className="w-6 h-6" />
                       Download PDF
                    </button>
                 </div>
              </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function DoctorPrescriptions() {
  return (
    <DoctorDashboardLayout>
      <PrescriptionGenerator />
    </DoctorDashboardLayout>
  );
}
