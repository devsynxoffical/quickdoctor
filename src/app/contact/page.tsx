"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, ShieldCheck } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            
            {/* Left Side: Info */}
            <div className="space-y-12">
               <div>
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase mb-6"
                  >
                     <MessageSquare className="w-4 h-4" />
                     Get in Touch
                  </motion.div>
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-6xl font-bold mb-8 text-dark-slate dark:text-white leading-tight"
                  >
                    We're Here to <br />
                    <span className="text-gradient">Help You.</span>
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-lg"
                  >
                    Have questions about our telemedicine services? Our support team and medical administrators are available 24/7 to assist you.
                  </motion.p>
               </div>

               <div className="space-y-8">
                  {[
                    { icon: Phone, label: 'Call Us', value: '+353 83 413 6053', desc: 'Mon-Sun, 24/7 Availability' },
                    { icon: Mail, label: 'Email Support', value: 'info@quickdoctor.ie', desc: 'Responses within 1 hour' },
                    { icon: MapPin, label: 'Headquarters', value: 'Limerick, Ireland', desc: 'Secure Data Center' },
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + (i * 0.1) }}
                      className="flex gap-6 items-center p-6 rounded-[32px] glass hover:bg-white transition-all medical-shadow group"
                    >
                       <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                          <item.icon className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{item.label}</p>
                          <p className="text-lg font-bold text-dark-slate dark:text-white">{item.value}</p>
                          <p className="text-xs text-slate-500">{item.desc}</p>
                       </div>
                    </motion.div>
                  ))}
               </div>

               <div className="p-8 rounded-[40px] bg-dark-slate text-white medical-shadow flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                     <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                     <h4 className="font-bold text-sm">HIPAA & GDPR Secure</h4>
                     <p className="text-xs text-slate-400">Your communication is encrypted and stored in EU-based secure servers.</p>
                  </div>
               </div>
            </div>

            {/* Right Side: Form */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-10 md:p-14 rounded-[50px] medical-shadow"
            >
               <h3 className="text-3xl font-bold mb-10">Send a Message</h3>
               <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Full Name</label>
                        <input 
                           type="text" 
                           placeholder="John Doe" 
                           className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none focus:ring-2 focus:ring-primary transition-all"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Email Address</label>
                        <input 
                           type="email" 
                           placeholder="john@example.com" 
                           className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none focus:ring-2 focus:ring-primary transition-all"
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Subject</label>
                     <select className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none focus:ring-2 focus:ring-primary transition-all appearance-none cursor-pointer">
                        <option>General Inquiry</option>
                        <option>Technical Support</option>
                        <option>Billing Question</option>
                        <option>Partnership Interest</option>
                     </select>
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Your Message</label>
                     <textarea 
                        placeholder="How can we help you today?" 
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none focus:ring-2 focus:ring-primary transition-all min-h-[200px] resize-none"
                     />
                  </div>

                  <div className="pt-4">
                     <button className="w-full py-5 bg-primary text-white rounded-2xl font-bold text-lg medical-shadow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                        Send Message
                        <Send className="w-5 h-5" />
                     </button>
                  </div>
                  
                  <p className="text-center text-xs text-slate-500 pt-4">
                     By contacting us, you agree to our <span className="text-primary font-bold">Privacy Policy</span>.
                  </p>
               </form>
            </motion.div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
