"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Video, Pill, FileText, Activity, 
  Stethoscope, HeartPulse, Microscope, 
  ArrowRight, ShieldCheck, Check 
} from 'lucide-react';
import Link from 'next/link';

const coreServices = [
  {
    title: "Video Consultation",
    desc: "HD video calls with registered Irish GPs for diagnosis, advice, and referrals.",
    icon: Video,
    color: "bg-blue-50 text-blue-600",
    link: "/book",
    tag: "MOST POPULAR"
  },
  {
    title: "Digital Prescription",
    desc: "Instant prescriptions sent directly to your local pharmacy after clinical review.",
    icon: Pill,
    color: "bg-blue-50 text-blue-600",
    link: "/prescriptions/acne-treatment",
    tag: "INSTANT"
  },
  {
    title: "Medical Certificates",
    desc: "Official certificates for work or university, signed by certified doctors.",
    icon: FileText,
    color: "bg-indigo-50 text-indigo-600",
    link: "/medical-certificates",
    tag: "SAME DAY"
  }
];

const Services = () => {
  return (
    <section id="services" className="py-32 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-24">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-primary font-black uppercase tracking-[0.2em] text-xs mb-4"
            >
              Our Expertise
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-dark-slate dark:text-white tracking-tighter"
            >
              Professional Care <br />
              <span className="text-primary">Delivered Digitally.</span>
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-lg text-slate-500 max-w-md leading-relaxed"
          >
            Access a full range of GP services from anywhere in Ireland. 
            Regulated clinical expertise at your fingertips.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           {coreServices.map((service, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               whileHover={{ y: -10 }}
               className="group p-10 rounded-[48px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-primary/20 transition-all medical-shadow"
             >
                <div className={`w-16 h-16 rounded-2xl ${service.color} flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500`}>
                   {React.createElement(service.icon, { className: "w-8 h-8" })}
                </div>

                <div className="text-[10px] font-black text-primary tracking-widest mb-4 opacity-50">{service.tag}</div>
                
                <h3 className="text-2xl font-bold mb-4 text-dark-slate dark:text-white">
                  {service.title}
                </h3>
                
                <p className="text-slate-500 text-sm leading-relaxed mb-10">
                  {service.desc}
                </p>

                <Link 
                  href={service.link}
                  className="inline-flex items-center gap-2 text-dark-slate dark:text-white font-bold group-hover:text-primary transition-colors"
                >
                   Learn More 
                   <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
             </motion.div>
           ))}
        </div>

        {/* Benefits Strip */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 p-12 bg-dark-slate rounded-[50px] text-white overflow-hidden relative">
           {[
             "Secure Consultations",
             "Irish Medical Council GPs",
             "Instant Prescriptions",
             "Full Confidentiality"
           ].map((text, i) => (
             <div key={i} className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                   <Check className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold tracking-tight">{text}</span>
             </div>
           ))}
           {/* Decor */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />
        </div>
      </div>
    </section>
  );
};

export default Services;
