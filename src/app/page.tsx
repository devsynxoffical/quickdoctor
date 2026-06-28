import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  CheckCircle2,
  Video,
  Pill,
  FileText,
  CalendarClock,
  Stethoscope,
  BadgeCheck,
  Lock,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import BookAppointmentLink from "@/components/BookAppointmentLink";
import PatientAreaLink from "@/components/PatientAreaLink";
import CmsPageGate from "@/components/CmsPageGate";
import heroBgImage from "@/app/prescriptions/jet-lag-prescription/bg 1.jpg";
import safetyImage from "@/../public/images/saftey-removebg-preview.png";

const appointmentCards = [
  { time: "09:45", date: "Today, June 24th", price: "€49", badge: "Live" },
  { time: "10:30", date: "Today, June 24th", price: "€49" },
  { time: "11:15", date: "Today, June 24th", price: "€49" },
  { time: "14:00", date: "Today, June 24th", price: "€49", badge: "Popular" },
];

const trustMetrics = [
  { value: "500k+", label: "Patients Treated" },
  { value: "4.9/5", label: "Trustpilot Rating" },
  { value: "150+", label: "Expert Doctors" },
  { value: "10min", label: "Avg. Wait Time" },
];

const journeySteps = [
  {
    step: "1",
    title: "Book",
    desc: "Choose a time that works for you. Appointments are available throughout the day.",
    icon: CalendarClock,
  },
  {
    step: "2",
    title: "Connect",
    desc: "Join your secure video consultation from your smartphone, tablet, or laptop.",
    icon: Video,
  },
  {
    step: "3",
    title: "Get Care",
    desc: "Receive medical advice, prescriptions, or referrals instantly where appropriate.",
    icon: Stethoscope,
  },
];

const securityFeatures = [
  {
    title: "CQC Regulated",
    desc: "We meet national standards for safety and quality of digital care delivery.",
    icon: BadgeCheck,
  },
  {
    title: "Data Privacy",
    desc: "Medical records are encrypted and managed using strict GDPR-grade controls.",
    icon: Lock,
  },
  {
    title: "Qualified Doctors",
    desc: "All clinicians are experienced, registered, and held to high governance standards.",
    icon: UserCheck,
  },
];

const featuredDigitalCare = [
  {
    title: "Video Consultation",
    desc: "Face-to-face appointments with Irish Medical Council registered doctors on our secure platform.",
    cta: "Book Now",
    icon: Video,
  },
  {
    title: "Digital Prescription",
    desc: "Receive prescriptions directly to your local pharmacy after clinical review.",
    cta: "Get Prescription",
    icon: Pill,
  },
  {
    title: "Medical Certificates",
    desc: "Official medical certs and referral letters delivered quickly through your patient account.",
    cta: "Request Certificate",
    icon: FileText,
  },
];

const digitalCareBenefits = [
  "Secure Consultations",
  "Irish Medical Council GPs",
  "Encrypted Records",
  "EU Health Compliance",
];

export default function Home() {
  return (
    <CmsPageGate slug="home">
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary selection:text-white overflow-x-hidden">
      <Navbar />

      <section
        className="relative pt-20 md:pt-24 min-h-[620px] md:min-h-[680px] flex items-center overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            `linear-gradient(rgba(0, 22, 43, 0.84), rgba(0, 22, 43, 0.68)), url('${heroBgImage.src}')`,
          backgroundPosition: "center 38%",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-3xl text-white">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black leading-tight">
              Healthcare that fits your life, not the other way around.
            </h1>
            <p className="text-white/90 text-base sm:text-lg mt-4 sm:mt-5 max-w-2xl">
              Access expert GP consultations, prescriptions, and specialist referrals from the comfort of your home in
              minutes.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:flex-wrap gap-3">
              <BookAppointmentLink />
              <Link
                href="/contact"
                className="w-full sm:w-auto text-center px-6 sm:px-8 py-3 sm:py-4 border border-white/35 bg-white/10 backdrop-blur-sm rounded-xl font-black hover:bg-white/20 transition-colors"
              >
                How it Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto rounded-xl bg-[#0b3a75] text-white px-4 sm:px-6 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {trustMetrics.map((item) => (
              <div key={item.label}>
                <p className="text-3xl font-black text-white">{item.value}</p>
                <p className="text-[11px] uppercase tracking-wider text-white/85 font-bold mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 md:mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-primary">Available appointments</h2>
              <p className="text-slate-600 mt-2 text-sm sm:text-base">Book a live session with our licensed General Practitioners today.</p>
            </div>
            <button className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
              View more <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {appointmentCards.map((item) => (
              <div
                key={item.time}
                className={`rounded-xl border p-5 bg-white shadow-sm hover:shadow-md transition-shadow ${
                  item.badge === "Popular" ? "border-l-4 border-l-primary border-slate-200" : "border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <p className="text-2xl font-black text-primary">{item.time}</p>
                  {item.badge ? (
                    <span
                      className={`text-[10px] font-black px-2 py-1 rounded ${
                        item.badge === "Live" ? "bg-blue-100 text-blue-700" : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                <p className="text-sm text-slate-500 mt-2">{item.date}</p>
                <div className="flex items-center justify-between mt-5">
                  <p className="text-xl font-black text-primary">{item.price}</p>
                  <button className="px-3 py-2 rounded-lg bg-primary text-white text-xs font-black hover:bg-primary/90">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-primary">Professional Care Delivered Digitally</h2>
            <p className="text-slate-600 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
              Get medical advice, prescriptions, and certificates from the comfort of your home within minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredDigitalCare.map((service) => (
              <div
                key={service.title}
                className="bg-white rounded-xl border border-slate-200 p-7 group hover:border-primary transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-5 group-hover:bg-primary transition-colors">
                  {React.createElement(service.icon, { className: "w-6 h-6 text-primary group-hover:text-white" })}
                </div>
                <h3 className="text-2xl font-black text-primary">{service.title}</h3>
                <p className="text-sm text-slate-600 mt-3">{service.desc}</p>
                {service.title === "Video Consultation" ? (
                  <BookAppointmentLink className="inline-flex items-center gap-2 mt-6 text-primary font-black text-sm">
                    {service.cta} <ArrowRight className="w-4 h-4" />
                  </BookAppointmentLink>
                ) : (
                  <PatientAreaLink
                    href={service.title === "Medical Certificates" ? "/dashboard/records" : "/dashboard"}
                    className="inline-flex items-center gap-2 mt-6 text-primary font-black text-sm"
                  >
                    {service.cta} <ArrowRight className="w-4 h-4" />
                  </PatientAreaLink>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl bg-[#0b4da2] text-white px-5 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {digitalCareBenefits.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-blue-200" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-4xl md:text-5xl font-black text-primary text-center mb-16">
            Your healthcare journey
          </h2>
          <div className="grid md:grid-cols-3 gap-10 relative">
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-[1px] bg-slate-200" />
            {journeySteps.map((item) => (
              <div key={item.step} className="text-center relative z-10">
                <div className="w-24 h-24 rounded-full bg-white border-2 border-primary flex items-center justify-center mx-auto mb-6 shadow-lg">
                  {React.createElement(item.icon, { className: "w-9 h-9 text-primary" })}
                </div>
                <h3 className="text-2xl font-black text-primary">{item.step}. {item.title}</h3>
                <p className="text-slate-600 mt-3">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 sm:px-6 bg-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-14">
          <div className="w-full md:w-1/2">
            <Image
              src={safetyImage}
              alt="Secure healthcare systems"
              sizes="(min-width: 768px) 50vw, 100vw"
              className="w-full h-[280px] sm:h-[360px] md:h-[420px] object-contain rounded-2xl shadow-lg"
            />
          </div>

          <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-5xl font-black text-primary mb-6">Safe, secure, and regulated.</h2>
            <div className="space-y-6">
              {securityFeatures.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="mt-1 w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    {React.createElement(item.icon, { className: "w-4 h-4 text-primary" })}
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-primary">{item.title}</h4>
                    <p className="text-slate-600 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-primary to-blue-900 p-7 sm:p-10 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white">Ready to see a doctor?</h2>
              <p className="text-blue-100 text-base md:text-lg mt-4 max-w-xl mx-auto">
                Join thousands of patients who trust QuickDoctor for their daily healthcare needs. Available 7 days a week.
              </p>
              <BookAppointmentLink className="inline-flex mt-8 px-8 sm:px-10 py-3 sm:py-4 bg-primary text-white rounded-xl font-black hover:bg-primary-dark transition-colors">
                Book Now - €49
              </BookAppointmentLink>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
    </CmsPageGate>
  );
}
