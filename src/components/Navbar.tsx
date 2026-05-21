"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Stethoscope, Menu, ChevronDown, ChevronRight, X, LogIn } from 'lucide-react';
import {
  BOOKING_APPOINTMENTS_PATH,
  getLoginUrl,
  getRegisterUrl,
  isPatient,
  normalizeRole,
} from '@/lib/auth';

const prescriptionOptions = {
  "WOMEN’S HEALTH": [
    "Contraceptive Pill, Patch or Ring",
    "Period Delay",
    "Genital Thrush",
    "Bacterial Vaginosis",
    "Menopausal Vaginal Dryness",
    "Excess Female Facial Hair",
    "Cystitis"
  ],
  "MEN’S HEALTH": [
    "Male Hair Loss",
    "Erectile Dysfunction",
    "Premature Ejaculation"
  ],
  "GENERAL HEALTH": [
    "Asthma",
    "Migraine",
    "Hypothyroidism",
    "Stop Smoking"
  ],
  "SKIN CONDITIONS": [
    "Acne",
    "Rosacea",
    "Cold Sores",
    "Eczema",
    "Psoriasis"
  ],
  "WEIGHT MANAGEMENT": [
    "Self Injectable",
    "Consultation",
    "Calculate your BMI"
  ],
  "ALLERGIES": [
    "Hay Fever",
    "Anaphylaxis"
  ],
  "TRAVEL HEALTH": [
    "Travel Vaccines & Anti-Malaria",
    "Jet Lag"
  ],
  "SEXUAL HEALTH": [
    "Genital Herpes",
    "HPV Vaccine"
  ],
  "HAIR CONDITIONS": [
    "Male Hair Loss",
    "Excess Female Facial Hair"
  ]
};

const consultationOptions = {
  "GENERAL CONSULTATION": [
    "Video Consultation with a Female Doctor",
    "Video Consultation with a Male Doctor",
    "Video Consultation in Portuguese",
    "Video Consultation in Spanish"
  ]
};

const consultationRouteMap: Record<string, string> = {
  "Video Consultation with a Female Doctor": "/consultation/female-doctor",
  "Video Consultation with a Male Doctor": "/consultation/male-doctor",
  "Video Consultation in Portuguese": "/consultation/portuguese",
  "Video Consultation in Spanish": "/consultation/spanish",
};

const prescriptionRouteMap: Record<string, string> = {
  "Contraceptive Pill, Patch or Ring": "/prescriptions/contraceptive-pill-patch-ring",
  "Period Delay": "/prescriptions/period-delay-treatment",
  "Genital Thrush": "/prescriptions/genital-thrush-treatment",
  "Menopausal Vaginal Dryness": "/prescriptions/menopausal-vaginal-dryness-treatment",
  Cystitis: "/prescriptions/cystitis-uti-treatment",
  "Bacterial Vaginosis": "/prescriptions/bacterial-vaginosis-treatment",
  "Self Injectable": "/prescriptions/self-injectable",
  Consultation: "/prescriptions/weight-management-consultation",
  "Hay Fever": "/prescriptions/hay-fever",
  "Anaphylaxis": "/prescriptions/anaphylaxis",
  Acne: "/prescriptions/acne-treatment",
  Rosacea: "/prescriptions/rosacea-treatment",
  "Cold Sores": "/prescriptions/cold-sore-treatments",
  Eczema: "/prescriptions/eczema-treatment",
  Psoriasis: "/prescriptions/plaque-psoriasis-treatment",
  Asthma: "/prescriptions/asthma-treatment",
  Migraine: "/prescriptions/migraine-treatment",
  "Stop Smoking": "/prescriptions/stop-smoking-treatment",
  Hypothyroidism: "/prescriptions/hypothyroidism-treatment",
  "Male Hair Loss": "/prescriptions/male-hair-loss",
  "Erectile Dysfunction": "/prescriptions/erectile-dysfunction-treatment",
  "Premature Ejaculation": "/prescriptions/premature-ejaculation-treatment",
  "Excess Female Facial Hair": "/prescriptions/excess-female-facial-hair",
  "HPV Vaccine": "/prescriptions/hpv-vaccine",
  "Genital Herpes": "/prescriptions/genital-herpes",
  "Travel Vaccines & Anti-Malaria": "/prescriptions/travel-vaccines-anti-malaria",
  "Jet Lag": "/prescriptions/jet-lag-prescription",
  "Calculate your BMI": "/prescriptions/calculate-bmi",
};

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const getDashboardPath = () => {
    if (!user) return getLoginUrl();
    const role = normalizeRole(user.role);
    if (role === 'ADMIN') return '/admin';
    if (role === 'DOCTOR') return '/doctor';
    return '/dashboard';
  };

  const bookHref = isPatient() ? '/doctors' : getLoginUrl(BOOKING_APPOINTMENTS_PATH, 'book');

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 sm:px-6 shadow-sm">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
          
          {/* Column 1: Logo */}
          <div className="flex-1 flex justify-start min-w-[180px]">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white group-hover:scale-105 transition-transform shadow-md shadow-primary/25">
                <Stethoscope className="w-5 h-5" />
              </div>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-dark-slate dark:text-white">
                Quick<span className="text-primary">Doctor</span>
              </span>
            </Link>
          </div>

          {/* Column 2: Desktop Links */}
          <div className="hidden md:flex flex-[2] justify-center items-center gap-6 lg:gap-7 text-[12px] font-semibold tracking-wide text-slate-600 dark:text-slate-300">
            <Link href="/" className="text-primary border-b-2 border-primary pb-1">Home</Link>
            {user && (
              <Link href={getDashboardPath()} className="hover:text-primary transition-colors whitespace-nowrap font-bold">Dashboard</Link>
            )}
            
            <div 
              className="relative h-16 flex items-center"
              onMouseEnter={() => setActiveDropdown('consultation')}
              onMouseLeave={() => {
                setActiveDropdown(null);
                setActiveSubmenu(null);
              }}
            >
              <Link href="/consultation" className="flex items-center gap-1.5 hover:text-primary transition-colors py-6 outline-none whitespace-nowrap">
                Video Consultation
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeDropdown === 'consultation' ? 'rotate-180' : ''}`} />
              </Link>

              {activeDropdown === 'consultation' && (
                <div className="absolute top-[64px] left-1/2 -translate-x-1/2 w-72 bg-white dark:bg-slate-900 shadow-xl rounded-2xl border border-slate-200 dark:border-slate-800 p-3 z-[60]">
                    <div className="flex flex-col gap-1 relative">
                       {Object.keys(consultationOptions).map((category, idx) => (
                        <div 
                          key={idx}
                          onMouseEnter={() => setActiveSubmenu(category)}
                          className="relative"
                        >
                          <div className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-default transition-all ${activeSubmenu === category ? 'bg-primary text-white' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:text-primary'}`}>
                            <span className="text-[11px] font-semibold tracking-wide whitespace-nowrap">{category}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </div>

                          {activeSubmenu === category && (
                            <div className="absolute top-0 left-full ml-3 w-80 bg-white dark:bg-slate-900 shadow-xl rounded-2xl border border-slate-200 dark:border-slate-800 p-3 z-[70]">
                                <div className="flex flex-col gap-1">
                                  {consultationOptions[category as keyof typeof consultationOptions].map((item, idy) => (
                                    <Link 
                                      key={idy}
                                      href={consultationRouteMap[item] ?? "/register"}
                                      className="px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 text-[11px] font-semibold tracking-wide text-slate-600 dark:text-slate-300 hover:text-primary transition-all"
                                    >
                                      {item}
                                    </Link>
                                  ))}
                                </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                </div>
              )}
            </div>

            <Link href="/medical-certificates" className="hover:text-primary transition-colors whitespace-nowrap">Medical Certificates</Link>

            <div 
              className="relative h-16 flex items-center"
              onMouseEnter={() => setActiveDropdown('prescriptions')}
              onMouseLeave={() => {
                setActiveDropdown(null);
                setActiveSubmenu(null);
              }}
            >
              <button className="flex items-center gap-1.5 hover:text-primary transition-colors py-6 outline-none whitespace-nowrap">
                Digital Prescription
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeDropdown === 'prescriptions' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'prescriptions' && (
                <div className="absolute top-[64px] left-1/2 -translate-x-1/2 w-72 bg-white dark:bg-slate-900 shadow-xl rounded-2xl border border-slate-200 dark:border-slate-800 p-3 z-[60]">
                    <div className="flex flex-col gap-1 relative">
                      {Object.keys(prescriptionOptions).map((category, idx) => (
                        <div 
                          key={idx}
                          onMouseEnter={() => setActiveSubmenu(category)}
                          className="relative"
                        >
                          <div className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-default transition-all ${activeSubmenu === category ? 'bg-primary text-white' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:text-primary'}`}>
                            <span className="text-[11px] font-semibold tracking-wide whitespace-nowrap">{category}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </div>

                          {activeSubmenu === category && (
                            <div className="absolute top-0 left-full ml-3 w-80 bg-white dark:bg-slate-900 shadow-xl rounded-2xl border border-slate-200 dark:border-slate-800 p-3 z-[70]">
                                <div className="flex flex-col gap-1">
                                  {prescriptionOptions[category as keyof typeof prescriptionOptions].map((item, idy) => (
                                    <Link 
                                      key={idy}
                                      href={prescriptionRouteMap[item] ?? "/register"}
                                      className="px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 text-[11px] font-semibold tracking-wide text-slate-600 dark:text-slate-300 hover:text-primary transition-all"
                                    >
                                      {item}
                                    </Link>
                                  ))}
                                </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                </div>
              )}
            </div>

            <Link href="/doctors" className="hover:text-primary transition-colors whitespace-nowrap">Find a doctor</Link>
            <Link href="/doctor/apply" className="hover:text-primary transition-colors whitespace-nowrap">Become a doctor</Link>
            <Link href="/contact" className="hover:text-primary transition-colors whitespace-nowrap">Contact</Link>
          </div>

          {/* Column 3: Action Buttons */}
          <div className="flex-1 flex justify-end items-center gap-3">
            <Link 
              href={user ? getDashboardPath() : bookHref} 
              className="hidden sm:flex px-5 lg:px-6 py-2.5 bg-primary text-white rounded-lg text-[12px] font-bold tracking-wide hover:bg-primary/90 transition-all active:scale-95 shadow-md shadow-primary/25"
            >
              {user ? 'My Account' : 'Book appointment'}
            </Link>
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-dark-slate dark:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[45] bg-white dark:bg-slate-950 pt-24 px-6 overflow-y-auto">
            <div className="max-w-md mx-auto py-10">
              <div className="space-y-6">
                
                {/* Regular Links */}
                <Link href="/" onClick={toggleMobileMenu} className="block text-2xl font-black text-dark-slate dark:text-white">Home</Link>
                
                {/* Video Consultation Mobile Accordion */}
                <div>
                   <button 
                     onClick={() => setMobileExpanded(mobileExpanded === 'consultation' ? null : 'consultation')}
                     className="w-full flex items-center justify-between text-2xl font-black text-dark-slate dark:text-white py-2"
                   >
                     Video Consultation
                     <ChevronDown className={`w-6 h-6 transition-transform ${mobileExpanded === 'consultation' ? 'rotate-180' : ''}`} />
                   </button>
                   {mobileExpanded === 'consultation' && (
                      <div className="overflow-hidden mt-4">
                         {Object.keys(consultationOptions).map((cat, i) => (
                           <div key={i} className="mb-4">
                              <div className="px-4 py-2 text-[10px] font-black tracking-widest text-primary uppercase">{cat}</div>
                              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl overflow-hidden mt-2">
                                {consultationOptions[cat as keyof typeof consultationOptions].map((item, j) => (
                                  <Link 
                                    key={j} 
                                    href={consultationRouteMap[item] ?? "/register"}
                                    onClick={toggleMobileMenu}
                                    className="block px-6 py-3 text-sm font-medium text-slate-500 border-b border-white dark:border-slate-800 last:border-0"
                                  >
                                    {item}
                                  </Link>
                                ))}
                              </div>
                           </div>
                         ))}
                       </div>
                     )}
                </div>

                <Link href="/medical-certificates" onClick={toggleMobileMenu} className="block text-2xl font-black text-dark-slate dark:text-white">Medical Certificates</Link>

                {/* Digital Prescription Mobile Accordion */}
                <div>
                   <button 
                     onClick={() => setMobileExpanded(mobileExpanded === 'prescriptions' ? null : 'prescriptions')}
                     className="w-full flex items-center justify-between text-2xl font-black text-dark-slate dark:text-white py-2"
                   >
                     Digital Prescription
                     <ChevronDown className={`w-6 h-6 transition-transform ${mobileExpanded === 'prescriptions' ? 'rotate-180' : ''}`} />
                   </button>
                   {mobileExpanded === 'prescriptions' && (
                      <div className="overflow-hidden mt-4">
                         {Object.keys(prescriptionOptions).map((cat, i) => (
                           <div key={i} className="mb-4">
                              <div className="px-4 py-2 text-[10px] font-black tracking-widest text-primary uppercase">{cat}</div>
                              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl overflow-hidden mt-2">
                                {prescriptionOptions[cat as keyof typeof prescriptionOptions].map((item, j) => (
                                  <Link 
                                    key={j} 
                                    href={prescriptionRouteMap[item] ?? "/register"} 
                                    onClick={toggleMobileMenu}
                                    className="block px-6 py-3 text-sm font-medium text-slate-500 border-b border-white dark:border-slate-800 last:border-0"
                                  >
                                    {item}
                                  </Link>
                                ))}
                              </div>
                           </div>
                         ))}
                       </div>
                     )}
                </div>

                <Link href="/contact" onClick={toggleMobileMenu} className="block text-2xl font-black text-dark-slate dark:text-white">Contact</Link>

                {/* Mobile CTAs */}
                <div className="pt-10 flex flex-col gap-4">
                   <Link 
                     href={bookHref} 
                     onClick={toggleMobileMenu}
                     className="w-full py-5 bg-primary text-white rounded-2xl font-black text-center text-lg uppercase tracking-widest shadow-xl shadow-primary/20"
                   >
                     Book Appointment
                   </Link>
                   <Link 
                     href={getLoginUrl()} 
                     onClick={toggleMobileMenu}
                     className="w-full py-5 border-2 border-slate-200 dark:border-slate-800 text-dark-slate dark:text-white rounded-2xl font-black text-center text-lg uppercase tracking-widest flex items-center justify-center gap-3"
                   >
                     <LogIn className="w-5 h-5" />
                     Patient Login
                   </Link>
                   <div className="flex justify-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 pt-2">
                     <Link href="/doctor" onClick={toggleMobileMenu} className="hover:text-secondary">Doctor portal</Link>
                     <span>•</span>
                     <Link href="/admin" onClick={toggleMobileMenu} className="hover:text-dark-slate">Admin portal</Link>
                   </div>
                </div>

              </div>
            </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
