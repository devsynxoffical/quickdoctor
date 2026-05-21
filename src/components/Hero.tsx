"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden bg-white dark:bg-slate-950">
      {/* Background Split Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -z-10" />
      
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-4 mb-8">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Meet With</span>
             <div className="h-[1px] w-12 bg-slate-200" />
          </div>
          
          <h1 className="text-6xl md:text-[5rem] font-black text-dark-slate dark:text-white leading-[0.95] mb-10 tracking-tighter">
            Our Best <br />
            <span className="text-primary">Doctors <br /> Online</span>
          </h1>
          
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-12 leading-relaxed max-w-md font-medium">
            He preference connection astonished on of ye. Partiality on or continuing 
            in particular principles as. Do believing oh disposing to supported allowance we.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <button className="px-10 py-5 bg-primary text-white rounded-xl font-bold text-lg medical-shadow hover:bg-primary-dark transition-all active:scale-95">
              Schedule Appointment
            </button>
            <button className="px-10 py-5 border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
              Learn More
            </button>
          </div>
        </motion.div>

        {/* Right Side: Doctor Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative lg:h-[800px] flex items-center justify-center p-12"
        >
           <div className="relative w-full h-full">
              <img 
                src="/images/doctors_hero.png" 
                alt="Doctor Thumbs Up" 
                className="w-full h-full object-contain relative z-10 scale-125"
              />
              {/* Abstract Background for character */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 rounded-full blur-[120px] -z-10" />
           </div>

           {/* Floating Accent */}
           <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-20 right-0 w-24 h-24 border-4 border-dashed border-primary/20 rounded-full"
           />
        </motion.div>
      </div>

    </section>
  );
};

export default Hero;
