"use client";

import React, { useState } from "react";
import { beginPrescriptionCheckout } from '@/lib/serviceCheckout';
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2, ChevronDown, Clock, Heart, ShieldCheck, Users, XCircle } from "lucide-react";

const todaySlots = ["11:00", "11:30", "17:15", "18:30", "19:30", "20:00"];

const included = [
  "You will receive tailored medical advice from a GP with a special interest in weight management.",
  "Where clinically appropriate, we can provide prescriptions for self-injectable medications and weight loss tablets.",
  "Training is provided for safe and confident self-injection if this treatment is prescribed.",
  "Access to a support library covering treatment use, side effects, and practical lifestyle guidance.",
  "Lifestyle webinars on sleep, stress, diet, and exercise.",
  "Secure doctor messaging support Monday to Friday, 9 am to 5:30 pm.",
  "Repeat prescriptions may be provided after your 12-week follow-up consultation if clinically appropriate.",
];

const excluded = [
  "We cannot prescribe self-injectable weight loss medication without verified height, weight, and blood pressure.",
  "Verification must be dated, signed, and stamped by a healthcare professional (pharmacist, doctor, or nurse).",
  "This is a medical obesity service and is not suitable if you only want to lose a small amount of weight.",
];

const faqs = [
  "Who is this service suitable for?",
  "Who is this service not suitable for?",
  "How does this service work?",
  "What is obesity?",
  "What is body mass index (BMI)?",
  "Am I a healthy weight?",
  "Why is it so hard to lose weight?",
  "Can my mental health be affected?",
  "How do weight loss injections work?",
];

const AccordionItem = ({ question }: { question: string }) => {
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
            Final advice and treatment decisions are made by an Irish-registered doctor after clinical review.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function WeightManagementConsultationPage() {
  const [showAll, setShowAll] = useState(false);
  const slots = showAll ? todaySlots : todaySlots.slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <Navbar />

      <div className="pt-24 bg-primary/5 border-y border-primary/10 py-3 px-6 text-center">
        <p className="text-sm font-bold text-primary">
          A healthier year starts now. Check your BMI and access medical weight care from EUR50.
        </p>
      </div>

      <main>
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-black uppercase mb-6">
                <Heart className="w-4 h-4 fill-secondary" />
                Ireland&apos;s Premium
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-dark-slate dark:text-white leading-tight">
                Weight Management <span className="text-primary">Consultation</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-6 leading-relaxed">
                Irish-registered doctors from Ireland&apos;s award-winning online doctor service.
              </p>
              <div className="mt-8 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-bold uppercase text-slate-500">Next available</p>
                <p className="text-xl font-black text-primary mt-1">In 4 hours</p>
              </div>
            </div>

            <div className="rounded-[36px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
              <h3 className="text-2xl font-black mb-2">Available appointments</h3>
              <p className="text-sm text-slate-500 mb-5">Today, April 22nd</p>
              <div className="grid grid-cols-2 gap-3">
                {slots.map((time) => (
                  <button
                    key={time}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-left"
                  >
                    <p className="text-lg font-black">{time}</p>
                    <p className="text-xs font-bold text-primary mt-1">EUR90</p>
                  </button>
                ))}
              </div>
              <button className="mt-4 text-primary font-bold underline underline-offset-4" onClick={() => setShowAll((v) => !v)}>
                {showAll ? "Show fewer" : "View more"}
              </button>

              <button className="w-full mt-6 px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2">
                Book Now <ArrowRight className="w-4 h-4" />
              </button>
              <button className="w-full mt-3 px-6 py-3 border border-slate-300 dark:border-slate-700 rounded-xl font-bold">
                Follow-Up Consultation - EUR55
              </button>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-4xl mx-auto px-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <p className="font-black text-lg">Dr. Ahmeda Ali</p>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Achieving a healthy weight is not just about dieting. Our GP-led service offers tailored medical
                guidance, lifestyle support, and treatment options to help you manage your weight safely and
                effectively.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-center">Treatments that we can provide</h2>
            <div className="max-w-5xl mx-auto mt-8 space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                At Webdoctor.ie, our GPs specialise in weight management and offer personalised plans based on your
                individual needs.
              </p>
              <p>
                A holistic approach is essential. Balanced nutrition, regular physical activity, realistic goals, and
                family support all play an important role.
              </p>
              <p>
                Psychological support can improve your relationship with food, and our GPs can support you throughout
                your journey.
              </p>
              <p>
                Where needed, approved medications can be integrated, including tablets and self-injectable weight
                management treatments.
              </p>
              <p className="font-semibold">
                This medical service is for individuals living with obesity and is not suitable if you only need to lose
                a little weight.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-center">What&apos;s included with our service</h2>
            <div className="grid lg:grid-cols-2 gap-8 mt-10">
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <ul className="space-y-3">
                  {included.map((item) => (
                    <li key={item} className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                      <p className="text-sm text-slate-700 dark:text-slate-300">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-black mb-6">What&apos;s excluded with our service</h3>
                <ul className="space-y-3">
                  {excluded.map((item) => (
                    <li key={item} className="flex gap-3">
                      <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-slate-700 dark:text-slate-300">{item}</p>
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
              Requesting a prescription online could not be easier with Webdoctor.ie.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-10">
              {[
                { step: "Step 1", icon: CheckCircle2, title: "Online Questionnaire", desc: "Complete a secure questionnaire and answer all questions accurately." },
                { step: "Step 2", icon: Clock, title: "Medical Review", desc: "An Irish-registered doctor reviews your information using clinical standards." },
                { step: "Step 3", icon: ArrowRight, title: "Prescription Sent", desc: "If approved, your prescription is sent within minutes to your chosen pharmacy via secure Healthmail." },
              ].map((item) => (
                <div key={item.title} className="p-6 rounded-3xl bg-white/5 border border-white/10">
                  {React.createElement(item.icon, { className: "w-8 h-8 text-primary" })}
                  <p className="text-xs uppercase tracking-widest font-bold text-primary mt-4">{item.step}</p>
                  <p className="text-xl font-black mt-2">{item.title}</p>
                  <p className="text-sm text-slate-300 mt-2">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-black text-center">Important Medical Information</h2>
            <div className="mt-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 px-6">
              {faqs.map((q) => (
                <AccordionItem key={q} question={q} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-center">Why Choose Webdoctor.ie?</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-10">
              {[
                { title: "Expertise", icon: ShieldCheck, desc: "Irish Medical Council registered doctors." },
                { title: "Confidential", icon: CheckCircle2, desc: "Same confidentiality as in-person care." },
                { title: "Caring", icon: CheckCircle2, desc: "Patient safety is always our priority." },
                { title: "Convenience", icon: Clock, desc: "Access care from home, evenings and weekends." },
                { title: "Irish", icon: Users, desc: "Trusted by over 800,000 patients nationwide." },
              ].map((item) => (
                <div key={item.title} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  {React.createElement(item.icon, { className: "w-5 h-5 text-primary" })}
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
}
