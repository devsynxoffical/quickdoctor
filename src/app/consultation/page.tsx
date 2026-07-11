"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, UserCheck, Video } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const consultationCards = [
  {
    title: "Female Doctor Consultation",
    description: "Private online GP appointments with experienced female doctors.",
    href: "/consultation/female-doctor",
    badge: "Most Requested",
  },
  {
    title: "Male Doctor Consultation",
    description: "Comfortable online consultations with qualified male doctors.",
    href: "/consultation/male-doctor",
    badge: "Available Today",
  },
  {
    title: "Consultation in Portuguese",
    description: "Book a video consultation with Portuguese-speaking clinicians.",
    href: "/consultation/portuguese",
    badge: "Language Support",
  },
  {
    title: "Consultation in Spanish",
    description: "Access Spanish-language online GP consultations from home.",
    href: "/consultation/spanish",
    badge: "Language Support",
  },
];

const reassurancePoints = [
  {
    title: "Irish-Registered Doctors",
    description: "All consultations are reviewed and delivered by qualified clinicians.",
    icon: UserCheck,
  },
  {
    title: "Private & Secure",
    description: "Your consultation details remain confidential and securely handled.",
    icon: ShieldCheck,
  },
  {
    title: "Video Appointments",
    description: "See a doctor online without visiting a clinic.",
    icon: Video,
  },
];

export default function ConsultationLandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="pt-24">
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-black text-dark-slate dark:text-white">
                Choose your consultation type
              </h1>
              <p className="mt-4 text-slate-600 dark:text-slate-300 text-lg max-w-3xl mx-auto">
                Book a private video consultation with an Irish-registered GP. Choose your preferred doctor or language, pick a time that suits you, and get care from home.
              </p>
            </motion.div>

            <div className="mt-12 grid md:grid-cols-2 gap-6">
              {consultationCards.map((item) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
                >
                  <div className="p-6">
                    <p className="inline-flex text-[11px] font-black uppercase tracking-wide px-3 py-1 rounded-full bg-primary/10 text-primary">
                      {item.badge}
                    </p>
                    <h2 className="mt-3 text-2xl font-black text-dark-slate dark:text-white">{item.title}</h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
                    <Link
                      href={item.href}
                      className="mt-5 inline-flex items-center gap-2 font-black text-primary hover:text-primary/80 transition-colors"
                    >
                      Book consultation <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-20 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-4">
            {reassurancePoints.map((point) => (
              <div key={point.title} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
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

