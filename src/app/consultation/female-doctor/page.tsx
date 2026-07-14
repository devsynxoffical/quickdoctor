"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContinueBookingButton from "@/components/ContinueBookingButton";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Heart,
  ShieldCheck,
  Users,
  Video,
  XCircle,
} from "lucide-react";

const bookingDays = [
  { key: "apr-21", day: "Tue", date: "21", month: "Apr", label: "Tuesday, April 21st" },
  { key: "apr-22", day: "Wed", date: "22", month: "Apr", label: "Wednesday, April 22nd" },
  { key: "apr-23", day: "Thu", date: "23", month: "Apr", label: "Thursday, April 23rd" },
  { key: "apr-24", day: "Fri", date: "24", month: "Apr", label: "Friday, April 24th" },
  { key: "apr-25", day: "Sat", date: "25", month: "Apr", label: "Saturday, April 25th" },
  { key: "apr-26", day: "Sun", date: "26", month: "Apr", label: "Sunday, April 26th" },
];

const slotsByDay: Record<string, { time: string; price: string }[]> = {
  "apr-21": [
    { time: "08:45", price: "EUR49" },
    { time: "09:45", price: "EUR49" },
    { time: "10:45", price: "EUR49" },
    { time: "11:15", price: "EUR49" },
    { time: "11:30", price: "EUR49" },
    { time: "11:45", price: "EUR49" },
    { time: "12:00", price: "EUR39" },
    { time: "12:15", price: "EUR39" },
    { time: "12:30", price: "EUR39" },
    { time: "12:45", price: "EUR39" },
    { time: "13:00", price: "EUR49" },
    { time: "13:15", price: "EUR49" },
    { time: "13:30", price: "EUR49" },
    { time: "14:00", price: "EUR49" },
  ],
  "apr-22": [
    { time: "09:00", price: "EUR49" },
    { time: "09:30", price: "EUR49" },
    { time: "10:00", price: "EUR49" },
    { time: "10:45", price: "EUR49" },
    { time: "11:15", price: "EUR39" },
    { time: "12:00", price: "EUR39" },
    { time: "12:30", price: "EUR39" },
    { time: "13:15", price: "EUR49" },
  ],
  "apr-23": [
    { time: "08:30", price: "EUR49" },
    { time: "09:15", price: "EUR49" },
    { time: "10:15", price: "EUR49" },
    { time: "11:00", price: "EUR39" },
    { time: "11:45", price: "EUR39" },
    { time: "12:30", price: "EUR39" },
    { time: "13:00", price: "EUR49" },
  ],
  "apr-24": [
    { time: "09:45", price: "EUR49" },
    { time: "10:15", price: "EUR49" },
    { time: "11:00", price: "EUR49" },
    { time: "11:30", price: "EUR39" },
    { time: "12:15", price: "EUR39" },
    { time: "13:00", price: "EUR49" },
  ],
  "apr-25": [
    { time: "10:00", price: "EUR49" },
    { time: "10:30", price: "EUR49" },
    { time: "11:15", price: "EUR39" },
    { time: "12:00", price: "EUR39" },
    { time: "13:00", price: "EUR49" },
  ],
  "apr-26": [
    { time: "10:15", price: "EUR49" },
    { time: "11:00", price: "EUR49" },
    { time: "11:45", price: "EUR39" },
    { time: "12:30", price: "EUR39" },
  ],
};

const included = [
  {
    title: "Referral letters",
    desc: "Referrals to hospital consultants, blood tests, and scans including X-ray, ultrasound, MRI, and DEXA.",
  },
  {
    title: "Medical certificates / sick notes",
    desc: "Digital certificates after clinically appropriate assessment.",
  },
  {
    title: "Routine prescriptions",
    desc: "Prescriptions for most routine medications, sent securely to your chosen pharmacy.",
  },
  {
    title: "Focused 5-10 minute consultation",
    desc: "Advice, next steps, and treatment planning for common conditions that do not require physical examination.",
  },
];

const excluded = [
  "Backdated or retrospective medical certificates",
  "Driver's licence (NDLS) medical reports",
  "Fit for work, travel, and sports certificates",
  "Emergency treatment",
  "Controlled drugs or potential drugs of abuse",
  "Unlicensed medications or medications requiring close monitoring",
  "LARCs (long-acting reversible contraception)",
];

const faqs = [
  {
    q: "When can I speak with an online GP?",
    a: "Appointments are available 7 days a week, including evenings and weekends.",
  },
  {
    q: "What happens during the video consultation?",
    a: "Your doctor reviews symptoms, gives medical advice, and may issue prescriptions, certificates, or referrals when clinically appropriate.",
  },
  {
    q: "Can I use this service if I am pregnant?",
    a: "Many pregnancy-related issues can be assessed online, but some cases require in-person care for safety.",
  },
  {
    q: "Can this service be used for children?",
    a: "Yes. If the consultation is for a child, both the parent/guardian and child must be physically present during the consultation.",
  },
];

const AccordionItem = ({ question, answer }: { question: string; answer: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 dark:border-slate-800">
      <button onClick={() => setOpen(!open)} className="w-full py-5 flex items-center justify-between text-left">
        <span className="font-bold text-dark-slate dark:text-white">{question}</span>
        <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="pb-5 text-slate-600 dark:text-slate-400"
          >
            {answer}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

const FemaleDoctorPage = () => {
  const [selectedDay, setSelectedDay] = useState(bookingDays[0].key);
  const [selectedTime, setSelectedTime] = useState(slotsByDay[bookingDays[0].key][0]?.time ?? "");
  const [showAllSlots, setShowAllSlots] = useState(false);
  const selectedDayMeta = bookingDays.find((day) => day.key === selectedDay) ?? bookingDays[0];
  const daySlots = slotsByDay[selectedDay] ?? [];
  const visibleSlots = showAllSlots ? daySlots : daySlots.slice(0, 12);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <Navbar />
<main>
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-8 xl:gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-black uppercase mb-6">
                <Heart className="w-4 h-4 fill-secondary" />
                Ireland's Premium
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-dark-slate dark:text-white leading-tight">
                Online Consultation with a <span className="text-primary">Female Doctor</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-6 leading-relaxed">
                Prefer to speak with a female doctor? Book a secure online consultation with an Irish-registered
                female doctor, whenever it suits you.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-8">
                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <p className="text-xs font-bold uppercase text-slate-500">Next available</p>
                  <p className="text-xl font-black text-primary mt-1">In 1-2 hours</p>
                </div>
                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <p className="text-xs font-bold uppercase text-slate-500">Same-day pricing</p>
                  <p className="text-xl font-black text-primary mt-1">From EUR39</p>
                </div>
              </div>

              <button
                onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}
                className="mt-8 px-8 py-4 bg-primary text-white rounded-2xl font-black text-lg hover:scale-105 transition-all inline-flex items-center gap-3"
              >
                Book Now
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-[30px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 md:p-6 w-full max-w-[540px] lg:justify-self-end">
              <img src="/images/female_doctor.png" alt="Online female GP consultation" className="w-full h-[300px] md:h-[360px] object-cover rounded-2xl" />
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-center">
                  <Video className="w-5 h-5 mx-auto text-primary mb-1" />
                  <p className="text-xs font-bold text-slate-500 uppercase">Consultation</p>
                  <p className="font-black text-dark-slate dark:text-white">5-10 min</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-center">
                  <ShieldCheck className="w-5 h-5 mx-auto text-primary mb-1" />
                  <p className="text-xs font-bold text-slate-500 uppercase">Doctors</p>
                  <p className="font-black text-dark-slate dark:text-white">IMC Registered</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="booking" className="py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-6xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 p-4 md:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-dark-slate dark:text-white">Book your appointment</h2>
                  <p className="text-sm text-slate-500 mt-1">Select a date and time for your online consultation.</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 px-3 py-2 rounded-xl">
                  <Calendar className="w-4 h-4" />
                  April 2026
                </div>
              </div>

              <div className="mt-6 grid lg:grid-cols-[1fr_280px] gap-6">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Choose date</p>
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-500" aria-label="Previous dates">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-500" aria-label="Next dates">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {bookingDays.map((day) => {
                      const isSelected = selectedDay === day.key;
                      return (
                        <button
                          key={day.key}
                          onClick={() => {
                            setSelectedDay(day.key);
                            setSelectedTime(slotsByDay[day.key]?.[0]?.time ?? "");
                            setShowAllSlots(false);
                          }}
                          className={`rounded-2xl border p-3 text-center transition-all ${
                            isSelected
                              ? "border-primary bg-primary text-white shadow-md"
                              : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-primary/60"
                          }`}
                        >
                          <p className={`text-xs font-bold uppercase ${isSelected ? "text-white/80" : "text-slate-500"}`}>{day.day}</p>
                          <p className="text-2xl font-black leading-none mt-1">{day.date}</p>
                          <p className={`text-xs font-semibold mt-1 ${isSelected ? "text-white/90" : "text-slate-500"}`}>{day.month}</p>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Choose time</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {visibleSlots.map((slot) => {
                        const isSelected = selectedTime === slot.time;
                        return (
                          <button
                            key={`${selectedDay}-${slot.time}`}
                            onClick={() => setSelectedTime(slot.time)}
                            className={`p-4 rounded-xl border transition-all text-left ${
                              isSelected
                                ? "border-primary bg-primary/10 dark:bg-primary/20"
                                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-primary/60"
                            }`}
                          >
                            <p className="text-lg font-black text-dark-slate dark:text-white">{slot.time}</p>
                            <p className="text-xs font-bold text-primary mt-1">{slot.price}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 h-fit">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Appointment summary</p>
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-xs text-slate-500">Consultation type</p>
                      <p className="font-bold text-dark-slate dark:text-white">Video consultation with a female doctor</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Date</p>
                      <p className="font-bold text-dark-slate dark:text-white">{selectedDayMeta.label}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Time</p>
                      <p className="font-bold text-dark-slate dark:text-white">{selectedTime || "Select a time"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Duration</p>
                      <p className="font-bold text-dark-slate dark:text-white">5-10 minutes</p>
                    </div>
                  </div>
                  <ContinueBookingButton showSignUpHint />
                </div>
              </div>

              <div className="mt-6">
                <button
                  className="text-primary font-bold underline underline-offset-4 text-left"
                  onClick={() => setShowAllSlots((v) => !v)}
                >
                  {showAllSlots ? "Show fewer times" : "View all times"}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-center">What's included and excluded</h2>
            <div className="grid lg:grid-cols-2 gap-8 mt-10">
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-black mb-6">Included with our service</h3>
                <ul className="space-y-5">
                  {included.map((item) => (
                    <li key={item.title} className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 shrink-0" />
                      <div>
                        <p className="font-bold text-dark-slate dark:text-white">{item.title}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-black mb-6">Excluded with our service</h3>
                <ul className="space-y-3">
                  {excluded.map((item) => (
                    <li key={item} className="flex gap-3">
                      <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-dark-slate text-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-center">How it works</h2>
            <p className="text-slate-300 text-center mt-3 max-w-2xl mx-auto">
              A GP video consultation lasts around 5-10 minutes and takes place wherever you are comfortable.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-10">
              {[
                {
                  step: "Step 1",
                  icon: FileText,
                  title: "Online Questionnaire",
                  desc: "Complete a simple and secure questionnaire so your GP can prepare.",
                },
                {
                  step: "Step 2",
                  icon: Calendar,
                  title: "Choose A Time",
                  desc: "Choose an appointment time that fits your day, including evenings and weekends.",
                },
                {
                  step: "Step 3",
                  icon: Clock,
                  title: "Speak With A GP",
                  desc: "Have your 5-10 minute consultation and receive guidance, treatment, or referral.",
                },
              ].map((item) => (
                <div key={item.title} className="p-6 rounded-3xl bg-white/5 border border-white/10">
                  <item.icon className="w-8 h-8 text-primary" />
                  <p className="text-xs uppercase tracking-widest font-bold text-primary mt-4">{item.step}</p>
                  <p className="text-xl font-black mt-2">{item.title}</p>
                  <p className="text-sm text-slate-300 mt-2">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-black text-center">Important medical information</h2>
            <div className="mt-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 px-6">
              {faqs.map((faq) => (
                <AccordionItem key={faq.q} question={faq.q} answer={faq.a} />
              ))}
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mt-8">
              {[
                { title: "Confidential", icon: ShieldCheck, desc: "Doctor-patient confidentiality as in-person care." },
                { title: "Caring", icon: Heart, desc: "Patient safety and clear guidance in every consultation." },
                { title: "Irish based", icon: Users, desc: "Trusted by over 800,000 patients across Ireland." },
              ].map((item) => (
                <div key={item.title} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <item.icon className="w-5 h-5 text-primary" />
                  <p className="font-black mt-3">{item.title}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FemaleDoctorPage;
