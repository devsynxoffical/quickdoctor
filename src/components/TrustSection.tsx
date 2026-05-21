"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Heart, UserCheck, Lock, CheckCircle2 } from 'lucide-react';

const certifications = [
  { icon: ShieldCheck, title: "IMC Certified Doctors", desc: "Every physician is fully registered with the Irish Medical Council." },
  { icon: Heart, title: "Patient Confidentiality", desc: "Strict adherence to HIPAA and European GDPR standards." },
  { icon: UserCheck, title: "Clinical Governance", desc: "Rigorous quality audits and professional clinical oversight." },
];

const TrustSection = () => {
  return (
    <section className="py-32 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
             <div className="text-primary font-black uppercase tracking-[0.2em] text-xs mb-4">Security First</div>
             <h2 className="text-3xl md:text-4xl font-black text-dark-slate dark:text-white mb-10 leading-tight tracking-tight">
               Medical Grade Safety <br />& <span className="text-primary italic">Total Compliance.</span>
             </h2>

             
             <div className="space-y-10">
                {certifications.map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-6 items-start"
                  >
                     <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 text-primary flex items-center justify-center shrink-0 medical-shadow">
                        {React.createElement(item.icon, { className: "w-8 h-8" })}
                     </div>
                     <div>
                        <h4 className="text-xl font-bold mb-2 tracking-tight">{item.title}</h4>
                        <p className="text-sm text-slate-500 leading-relaxed max-w-sm font-medium">{item.desc}</p>
                     </div>
                  </motion.div>
                ))}
             </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-16 rounded-[60px] bg-white dark:bg-slate-900 medical-shadow-lg border border-slate-100 dark:border-slate-800"
          >
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl -z-10" />
             
             <div className="relative z-10 text-center">
                <div className="w-24 h-24 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-8 medical-shadow">
                   <Lock className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-black mb-6 text-dark-slate dark:text-white">Encrypted Data Hub</h3>
                <p className="text-slate-500 mb-10 leading-relaxed font-medium">
                  Your medical history is protected using military-grade AES-256 encryption. 
                  Only your assigned physician can access your clinical records.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                   <div className="px-6 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-[10px] font-black tracking-widest text-slate-500 uppercase">HIPAA Compliant</div>
                   <div className="px-6 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-[10px] font-black tracking-widest text-slate-500 uppercase">SSL Secure</div>
                </div>
             </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default TrustSection;
