"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Menu, ChevronDown, ChevronRight, X, LogIn } from 'lucide-react';
import Logo from '@/components/Logo';
import UserMenu from '@/components/UserMenu';
import { cmsApi } from '@/lib/api';
import {
  BOOKING_APPOINTMENTS_PATH,
  getLoginUrl,
  isPatient,
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

const consultationSlugMap: Record<string, string> = {
  "Video Consultation with a Female Doctor": "consultation-female-doctor",
  "Video Consultation with a Male Doctor": "consultation-male-doctor",
  "Video Consultation in Portuguese": "consultation-portuguese",
  "Video Consultation in Spanish": "consultation-spanish",
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

const prescriptionSlugMap: Record<string, string> = Object.fromEntries(
  Object.entries(prescriptionRouteMap).map(([label, path]) => [
    label,
    path.replace(/^\//, '').replace(/\//g, '-'),
  ])
);

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [visibleConsultationItems, setVisibleConsultationItems] = useState<string[] | null>(null);
  const [hiddenPrescriptionItems, setHiddenPrescriptionItems] = useState<Set<string>>(new Set());

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const bookHref = isPatient() ? '/doctors' : getLoginUrl(BOOKING_APPOINTMENTS_PATH, 'book');

  useEffect(() => {
    let cancelled = false;

    const isLiveSlug = async (slug?: string) => {
      if (!slug) return true;
      try {
        const avail = await cmsApi.pageAvailability(slug);
        // Hide only explicit drafts; MISSING keeps static pages live.
        return avail.status !== 'DRAFT';
      } catch {
        return true;
      }
    };

    const loadVisibility = async () => {
      const consultationItems = Object.values(consultationOptions).flat();
      const consultationChecks = await Promise.all(
        consultationItems.map(async (item) => ({
          item,
          visible: await isLiveSlug(consultationSlugMap[item]),
        }))
      );

      const prescriptionItems = Object.values(prescriptionOptions).flat();
      const prescriptionChecks = await Promise.all(
        prescriptionItems.map(async (item) => ({
          item,
          visible: await isLiveSlug(prescriptionSlugMap[item]),
        }))
      );

      if (cancelled) return;
      setVisibleConsultationItems(consultationChecks.filter((c) => c.visible).map((c) => c.item));
      setHiddenPrescriptionItems(
        new Set(prescriptionChecks.filter((c) => !c.visible).map((c) => c.item))
      );
    };

    void loadVisibility();
    return () => {
      cancelled = true;
    };
  }, []);

  const consultationOptionsFiltered = useMemo((): Record<string, string[]> => {
    if (!visibleConsultationItems) return consultationOptions;
    const items = consultationOptions["GENERAL CONSULTATION"].filter((item) =>
      visibleConsultationItems.includes(item)
    );
    return items.length ? { "GENERAL CONSULTATION": items } : {};
  }, [visibleConsultationItems]);

  const prescriptionOptionsFiltered = useMemo((): Record<string, string[]> => {
    const filtered: Record<string, string[]> = {};
    for (const [category, items] of Object.entries(prescriptionOptions)) {
      const live = items.filter((item) => !hiddenPrescriptionItems.has(item));
      if (live.length) filtered[category] = live;
    }
    return filtered;
  }, [hiddenPrescriptionItems]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto h-[4.25rem] px-4 sm:px-6 flex items-center gap-4 lg:gap-6">
          <Logo size="md" showText={false} className="shrink-0" />

          {/* Desktop nav */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-1 lg:gap-2 min-w-0">
            <Link
              href="/"
              className="px-3 py-2 rounded-lg text-[13px] font-semibold text-primary bg-primary/5 whitespace-nowrap"
            >
              Home
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('consultation')}
              onMouseLeave={() => {
                setActiveDropdown(null);
                setActiveSubmenu(null);
              }}
            >
              <Link
                href="/consultation"
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-[13px] font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors whitespace-nowrap"
              >
                Consultations
                <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${activeDropdown === 'consultation' ? 'rotate-180' : ''}`} />
              </Link>

              {activeDropdown === 'consultation' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-72 z-[60]">
                  <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl border border-slate-200 dark:border-slate-800 p-3">
                    <div className="flex flex-col gap-1 relative">
                       {Object.keys(consultationOptionsFiltered).map((category, idx) => (
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
                                  {(consultationOptionsFiltered[category] ?? []).map((item, idy) => (
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
                </div>
              )}
            </div>

            <Link
              href="/medical-certificates"
              className="px-3 py-2 rounded-lg text-[13px] font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors whitespace-nowrap hidden lg:inline-flex"
            >
              Certificates
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('prescriptions')}
              onMouseLeave={() => {
                setActiveDropdown(null);
                setActiveSubmenu(null);
              }}
            >
              <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-[13px] font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors whitespace-nowrap">
                Prescriptions
                <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${activeDropdown === 'prescriptions' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'prescriptions' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-72 z-[60]">
                  <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl border border-slate-200 dark:border-slate-800 p-3">
                    <div className="flex flex-col gap-1 relative">
                      {Object.keys(prescriptionOptionsFiltered).map((category, idx) => (
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
                                  {(prescriptionOptionsFiltered[category] ?? []).map((item, idy) => (
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
                </div>
              )}
            </div>

            <Link
              href="/doctors"
              className="px-3 py-2 rounded-lg text-[13px] font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors whitespace-nowrap"
            >
              Find a GP
            </Link>
            <Link
              href="/doctor/apply"
              className="px-3 py-2 rounded-lg text-[13px] font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors whitespace-nowrap hidden xl:inline-flex"
            >
              For doctors
            </Link>
            <Link
              href="/contact"
              className="px-3 py-2 rounded-lg text-[13px] font-medium text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors whitespace-nowrap hidden xl:inline-flex"
            >
              Contact
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto shrink-0">
            <Link
              href={bookHref}
              className="hidden sm:inline-flex px-4 lg:px-5 py-2.5 bg-primary text-white rounded-xl text-[13px] font-bold hover:bg-primary/90 transition-all active:scale-[0.98] shadow-sm shadow-primary/20"
            >
              Book appointment
            </Link>
            <UserMenu />
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open menu"
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
                         {Object.keys(consultationOptionsFiltered).map((cat, i) => (
                           <div key={i} className="mb-4">
                              <div className="px-4 py-2 text-[10px] font-black tracking-widest text-primary uppercase">{cat}</div>
                              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl overflow-hidden mt-2">
                                {(consultationOptionsFiltered[cat] ?? []).map((item, j) => (
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
                         {Object.keys(prescriptionOptionsFiltered).map((cat, i) => (
                           <div key={i} className="mb-4">
                              <div className="px-4 py-2 text-[10px] font-black tracking-widest text-primary uppercase">{cat}</div>
                              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl overflow-hidden mt-2">
                                {(prescriptionOptionsFiltered[cat] ?? []).map((item, j) => (
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
