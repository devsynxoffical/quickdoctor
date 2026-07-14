"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, UserCheck, Video } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getLoginUrl, isPatient } from "@/lib/auth";

const reassurancePoints = [
  {
    title: "Irish-Registered Doctors",
    description: "Consultations are delivered by qualified clinicians. Admin assigns your booking to an available GP.",
    icon: UserCheck,
  },
  {
    title: "Private & Secure",
    description: "Your consultation details remain confidential and securely handled.",
    icon: ShieldCheck,
  },
  {
    title: "Video Appointments",
    description: "Pick a time that suits you — no need to choose a specific doctor.",
    icon: Video,
  },
];

export default function ConsultationLandingPage() {
  const bookHref = isPatient() ? "/book" : getLoginUrl("/book", "book");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="pt-24">
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-xs font-black uppercase tracking-widest text-primary mb-4">Video consultation</p>
              <h1 className="text-4xl md:text-5xl font-black text-dark-slate dark:text-white">
                Book a private online GP appointment
              </h1>
              <p className="mt-4 text-slate-600 dark:text-slate-300 text-lg">
                Choose a time, complete payment, and we assign an available General Physician. You do not pick a doctor from
                a list.
              </p>
              <Link
                href={bookHref}
                className="mt-10 inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm hover:bg-primary/90 transition-colors"
              >
                Book video consultation <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        <section className="pb-20 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-4">
            {reassurancePoints.map((point) => (
              <div
                key={point.title}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5"
              >
                <point.icon className="w-5 h-5 text-primary" />
                <h3 className="mt-3 font-black text-dark-slate dark:text-white">{point.title}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{point.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
