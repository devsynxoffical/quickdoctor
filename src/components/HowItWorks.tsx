"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MousePointer2, ClipboardCheck, Video, CalendarCheck } from 'lucide-react';

const steps = [
  {
    title: "Select Service",
    desc: "Choose from our range of GP services and find a time that works for you.",
    icon: MousePointer2,
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "Clinical Info",
    desc: "Complete our secure intake form to provide your medical background.",
    icon: ClipboardCheck,
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "Book & Pay",
    desc: "Secure your 15-minute consultation via our encrypted payment system.",
    icon: Video,
    color: "bg-indigo-50 text-indigo-600"
  },
  {
    title: "Join Call",
    desc: "Meet your doctor online and receive your prescription instantly.",
    icon: CalendarCheck,
    color: "bg-rose-50 text-rose-600"
  }
];

const HowItWorks = () => {
  return (
    <section id="about" className="py-32 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-24">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-primary font-black uppercase tracking-[0.2em] text-xs mb-4"
          >
            Process
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Your Path to <span className="text-primary">Expert</span> Care.</h2>
          <p className="text-lg text-slate-500 font-medium">Four simple steps to connect with a certified Irish GP today.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
          {/* Connector Line */}
          <div className="hidden lg:block absolute top-[60px] left-[15%] right-[15%] h-[2px] bg-slate-100 dark:bg-slate-800 -z-10" />

          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center group"
            >
              <div className={`w-32 h-32 rounded-[40px] ${step.color} mx-auto flex items-center justify-center mb-10 medical-shadow-lg border-8 border-white dark:border-slate-950 group-hover:scale-110 transition-transform duration-500`}>
                 {React.createElement(step.icon, { className: "w-10 h-10" })}
              </div>
              <div>
                 <h4 className="text-2xl font-bold mb-4 tracking-tight">{step.title}</h4>
                 <p className="text-slate-500 text-sm leading-relaxed max-w-[220px] mx-auto font-medium">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
