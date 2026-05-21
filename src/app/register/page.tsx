"use client";

import React, { Suspense, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stethoscope, User, Calendar, Mail, 
  Phone, MapPin, ChevronRight, ChevronLeft, 
  CheckCircle, Shield, CreditCard, ClipboardList
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import { authApi } from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { resolvePatientRedirect, saveSession } from '@/lib/auth';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const intent = searchParams.get('intent');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    email: '',
    password: '', // Added password field
    serviceType: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.register(formData);
      saveSession(response.token, response.user);
      router.push(resolvePatientRedirect(redirect));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Progress Header */}
          <div className="mb-12 overflow-x-auto pb-4">
            <div className="flex items-center justify-between min-w-[500px] mb-4">
               {[1, 2, 3, 4].map((i) => (
                 <div key={i} className="flex flex-col items-center gap-2 flex-1 relative">
                   <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition-all relative z-10 ${
                     step >= i ? 'bg-primary text-white medical-shadow' : 'bg-slate-200 text-slate-500'
                   }`}>
                     {step > i ? <CheckCircle className="w-5 h-5" /> : i}
                   </div>
                   <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${
                     step >= i ? 'text-primary' : 'text-slate-400'
                   }`}>
                     {['Profile', 'Service', 'Questions', 'Payment'][i-1]}
                   </span>
                   {i < 4 && (
                     <div className={`absolute top-4 md:top-5 left-[60%] w-[80%] h-0.5 -z-0 ${
                       step > i ? 'bg-primary' : 'bg-slate-200'
                     }`} />
                   )}
                 </div>
               ))}
            </div>
          </div>

          {/* Form Container */}
          <div className="glass rounded-[40px] p-8 md:p-12 medical-shadow">
            {intent === 'book' && (
              <p className="mb-6 p-4 bg-primary/10 border border-primary/20 text-primary rounded-2xl text-sm font-bold text-center">
                Create your account to book your appointment.
              </p>
            )}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-bold">
                {error}
              </div>
            )}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">Create Your Profile</h2>
                    <p className="text-slate-500">Enter your personal information as it appears on your ID.</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">First Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                          type="text" 
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="John" 
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Last Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                          type="text" 
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Doe" 
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Date of Birth</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                          type="date" 
                          name="dob"
                          value={formData.dob}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com" 
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                      <div className="relative">
                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                          type="password" 
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••" 
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-8">
                    <button 
                      onClick={nextStep}
                      className="w-full py-5 bg-primary text-white rounded-2xl font-bold text-lg medical-shadow hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                      Continue to Service Selection
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">Select Service</h2>
                    <p className="text-slate-500">What would you like to consult about today?</p>
                  </div>

                  <div className="grid gap-4">
                    {[
                      { id: 'video', title: 'Video Consultation', price: '€45', desc: 'Real-time face-to-face medical advice' },
                      { id: 'prescription', title: 'Prescription Request', price: '€25', desc: 'New script or refill for your medication' },
                      { id: 'certificate', title: 'Sick Certificate', price: '€30', desc: 'Professional documentation for absence' }
                    ].map((s) => (
                      <button 
                        key={s.id}
                        className="flex items-center justify-between p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-800 hover:border-primary transition-all text-left group"
                        onClick={() => {
                          setFormData({...formData, serviceType: s.id});
                          nextStep();
                        }}
                      >
                        <div>
                          <h4 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{s.title}</h4>
                          <p className="text-slate-500 text-sm">{s.desc}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-primary">{s.price}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-8 flex gap-4">
                    <button 
                      onClick={prevStep}
                      className="px-8 py-5 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2"
                    >
                      <ChevronLeft className="w-6 h-6" />
                      Back
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                   <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">Medical Questionnaire</h2>
                    <p className="text-slate-500">Please answer truthfully for accurate diagnosis.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                      <p className="text-sm text-red-600 dark:text-red-400 font-bold mb-2 uppercase tracking-wide">Red Flag Warning</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300">Do you have chest pain, severe breathing difficulty, or confusion? If yes, exit and call 112/999 immediately.</p>
                    </div>

                    <div className="space-y-4">
                      <p className="font-bold text-slate-800 dark:text-white">What are your main symptoms?</p>
                      <textarea 
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary transition-all min-h-[120px]"
                        placeholder="Please describe in detail..."
                      />
                    </div>

                    <div className="space-y-4">
                      <p className="font-bold text-slate-800 dark:text-white">Are you currently taking any medication?</p>
                      <div className="flex gap-4">
                        {['Yes', 'No'].map((v) => (
                           <button key={v} className="px-8 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 hover:border-primary transition-all font-bold">
                              {v}
                           </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                      <input type="checkbox" className="mt-1 w-5 h-5 rounded border-primary text-primary focus:ring-primary" />
                      <label className="text-sm text-slate-600 dark:text-slate-400">
                        I confirm that the information provided is accurate and I consent to a telemedicine consultation.
                      </label>
                    </div>
                  </div>

                  <div className="pt-8 flex gap-4">
                    <button 
                      onClick={prevStep}
                      className="px-8 py-5 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2"
                    >
                      <ChevronLeft className="w-6 h-6" />
                      Back
                    </button>
                    <button 
                      onClick={nextStep}
                      className="flex-1 py-5 bg-primary text-white rounded-2xl font-bold text-lg medical-shadow hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                      Proceed to Secure Payment
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2 text-gradient">Secure Payment</h2>
                    <p className="text-slate-500">Your consultation is secured by Stripe encryption.</p>
                  </div>

                  <div className="p-8 rounded-3xl bg-slate-900 text-white medical-shadow mb-8 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                       <CreditCard className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                      <p className="text-slate-400 text-sm font-bold uppercase mb-8">Summary</p>
                      <div className="flex justify-between items-end mb-6">
                         <div>
                            <h3 className="text-2xl font-bold">Video Consultation</h3>
                            <p className="text-slate-400">With Dr. Sarah Johnson</p>
                         </div>
                         <p className="text-4xl font-black text-primary">€45.00</p>
                      </div>
                      <div className="pt-6 border-t border-white/10 flex items-center gap-2 text-sm text-slate-400">
                        <Shield className="w-4 h-4 text-green-500" />
                        SSL Secured Transaction
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-5 bg-primary text-white rounded-2xl font-bold text-lg medical-shadow hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Pay & Confirm Appointment'}
                    <CheckCircle className="w-6 h-6" />
                  </button>
                  
                  <p className="text-center text-xs text-slate-400 pt-4">
                    By clicking Confirm, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-slate-500 font-bold">Loading…</p></div>}>
      <RegisterForm />
    </Suspense>
  );
}
