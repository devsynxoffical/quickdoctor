"use client";

import React, { useState } from "react";
import { beginPrescriptionCheckout } from '@/lib/serviceCheckout';
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2, ChevronDown, Clock, ShieldCheck, Users, XCircle } from "lucide-react";

const faqs = [
  "What is Genital Thrush?",
  "Who is this service suitable for?",
  "Who is this service unsuitable for?",
  "What causes genital thrush?",
  "Is genital thrush a sexually transmitted infection (STI)?",
  "What genital thrush treatments do you offer?",
  "Important safety information",
];

const includedItems = [
  "Are between 17 and 60 years of age",
  "Have redness/itching around the vulva and vagina or on the head of the penis",
  "Have a thick white, curdy vaginal/ penile discharge",
  "Have been diagnosed with thrush by a professional in the past and have similar symptoms",
];

const excludedItems = [
  "Are pregnant, possibly pregnant or breastfeeding",
  "Have thrush or a fungal infection affecting other areas of your body e.g. mouth, nipples",
  "Have never been diagnosed with Candida/Thrush or have never used treatments for Candida/ Thrush",
  "Are having recurrent infections (more than 4 that require treatment in the past year)",
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
            Final treatment and prescribing decisions are made by an Irish-registered doctor after clinical review.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function GenitalThrushTreatmentPage() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [finalAccuracyConfirm, setFinalAccuracyConfirm] = useState(false);
  const [finalDoctorReviewConfirm, setFinalDoctorReviewConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const steps: {
    title: string;
    intro: string;
    questions: { id: string; text: string; description?: string; options: string[] }[];
  }[] = [
    {
      title: "SUITABILITY/BIRTH SEX QUESTIONS",
      intro: "Please complete all screening questions carefully before continuing.",
      questions: [
        { id: "s1_q1", text: "What is your birth sex?", options: ["Male", "Female", "Other"] },
        {
          id: "s1_q2",
          text: "Do you have symptoms of thrush that affect other areas of the body, e.g. the mouth?",
          options: ["Yes, I do", "No, I do not"],
        },
        { id: "s1_q3", text: "Are you aged 17 years or older?", options: ["Yes, I am", "No, I am not"] },
        { id: "s1_q4", text: "Do you have pain when passing urine or increased urinary frequency?", options: ["Yes, I do", "No, I do not"] },
        {
          id: "s1_q5",
          text: "Do you have green, smelly discharge from the vagina or penis or you are concerned you might have a sexually transmitted infection (STI)?",
          options: ["Yes, I do", "No, I do not"],
        },
        { id: "s1_q6", text: "Do you have blisters or rash on the skin of the vagina or penis?", options: ["Yes, I do", "No, I do not"] },
        { id: "s1_q7", text: "Do you have severe, lower abdominal pain in the past 48 hours?", options: ["Yes, I do", "No, I do not"] },
      ],
    },
    {
      title: "PREGNANCY & SAFETY CHECK",
      intro: "These questions help us safely assess if treatment is suitable.",
      questions: [
        { id: "s2_q1", text: "Are you currently pregnant or possibly pregnant?", options: ["Yes", "No", "Not applicable"] },
        { id: "s2_q2", text: "Are you currently breastfeeding?", options: ["Yes", "No", "Not applicable"] },
        { id: "s2_q3", text: "Have you had 4 or more thrush episodes in the last 12 months?", options: ["Yes", "No"] },
      ],
    },
    {
      title: "MEDICAL HISTORY",
      intro: "Tell us about your health history and current medications.",
      questions: [
        { id: "s3_q1", text: "Have you ever had an allergic reaction to thrush treatments (e.g. fluconazole, clotrimazole)?", options: ["Yes", "No", "Not sure"] },
        { id: "s3_q2", text: "Do you have liver disease or serious ongoing medical conditions?", options: ["Yes", "No"] },
        { id: "s3_q3", text: "Are you currently taking regular prescription medicines?", options: ["Yes", "No"] },
      ],
    },
    {
      title: "CURRENT SYMPTOMS",
      intro: "Please confirm your current symptoms.",
      questions: [
        { id: "s4_q1", text: "Do you have itching, soreness, or irritation around the genital area?", options: ["Yes", "No"] },
        { id: "s4_q2", text: "Do you have thick white discharge typical of thrush?", options: ["Yes", "No"] },
        { id: "s4_q3", text: "Have these symptoms been previously diagnosed as thrush by a doctor?", options: ["Yes", "No"] },
      ],
    },
    {
      title: "TREATMENT PREFERENCE",
      intro: "Choose your preferred treatment type.",
      questions: [
        { id: "s5_q1", text: "Preferred treatment", options: ["Oral tablet", "Topical cream", "Vaginal tablet (pessary)", "No preference"] },
        { id: "s5_q2", text: "Have you used thrush treatment before?", options: ["Yes", "No"] },
      ],
    },
    {
      title: "CONSENT & DECLARATIONS",
      intro: "Please confirm all mandatory declarations.",
      questions: [
        { id: "s6_q1", text: "I understand this online service does not replace emergency or in-person care when needed.", options: ["I confirm"] },
        { id: "s6_q2", text: "I consent to review by an Irish-registered doctor and understand my request may be declined if unsuitable.", options: ["I confirm"] },
      ],
    },
    {
      title: "REVIEW & SUBMIT",
      intro: "Review your answers and submit your request.",
      questions: [],
    },
  ];

  const currentStepData = steps[currentStep - 1];
  const currentStepQuestions =
    currentStep === 1
      ? (() => {
          const [birthSexQuestion, ...rest] = currentStepData.questions;
          if (answers["s1_q1"] === "Female") {
            return [
              birthSexQuestion,
              {
                id: "s1_q_pregnant",
                text: "Are you pregnant or possibly pregnant?",
                description: "This treatment is not suitable for you if you are pregnant.",
                options: ["Yes, I am", "No, I am not"],
              },
              {
                id: "s1_q_breastfeeding",
                text: "Are you breastfeeding at the moment?",
                options: ["Yes, I am", "No, I am not"],
              },
              {
                id: "s1_q_bleeding",
                text: "Do you have bleeding between periods or after intercourse?",
                options: ["Yes, I do", "No, I do not"],
              },
              ...rest,
            ];
          }
          return [birthSexQuestion, ...rest];
        })()
      : currentStepData.questions;

  const isCurrentStepComplete =
    currentStep === 7
      ? finalAccuracyConfirm && finalDoctorReviewConfirm
      : currentStepQuestions.every((q) => Boolean(answers[q.id]));

  const startQuestionnaire = () => {
    setShowQuestionnaire(true);
    setCurrentStep(1);
    setAnswers({});
    setFinalAccuracyConfirm(false);
    setFinalDoctorReviewConfirm(false);
    setSubmitted(false);
    setTimeout(() => {
      document.getElementById("genital-thrush-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const submitPrescriptionRequest = () => {
    beginPrescriptionCheckout({
      slug: 'genital-thrush-treatment',
      serviceName: 'Genital Thrush Treatment',
      payload: {
      answers,
      finalAccuracyConfirm,
      finalDoctorReviewConfirm,
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <Navbar />

      <div className="pt-24 bg-primary/5 border-y border-primary/10 py-3 px-6 text-center">
        <p className="text-sm font-bold text-primary">
          A healthier year starts now. Check your BMI and access medical weight care from â‚¬50.
        </p>
      </div>

      <main>
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-black uppercase mb-6">
                Online Prescription
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-dark-slate dark:text-white leading-tight">
                Genital Thrush <span className="text-primary">Treatment</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-6 leading-relaxed">
                Ireland&apos;s Award-Winning Online Doctor Service.
              </p>
            </div>

            <div className="rounded-[36px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
              <h3 className="text-2xl font-black mb-5">Treatments that we can provide</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                If genital thrush is causing you distress, Webdoctor.ie can help. We can provide prescriptions for
                Genital Thrush treatments. To request a prescription, simply fill in a short suitability questionnaire.
                Once approved, we&apos;ll send your prescription directly to an Irish pharmacy of your choice.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
                Please check your dispensed prescription before leaving the pharmacy as no changes can be made after that
                point.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <li>Oral Thrush Treatment (Tablets)</li>
                <li>Topical Thrush Treatment (Cream)</li>
                <li>Vaginal Tablets (Pessaries)</li>
              </ul>
              <div className="space-y-3 mt-5">
                <button
                  type="button"
                  onClick={startQuestionnaire}
                  className="block w-full p-4 rounded-2xl border text-left transition-all bg-primary text-white border-primary"
                >
                  <p className="font-black text-white">Request Prescription</p>
                  <p className="text-sm font-bold mt-1 text-white/90">EUR25</p>
                </button>
                <Link
                  href="/consultation"
                  className="block w-full p-4 rounded-2xl border text-left transition-all bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-primary"
                >
                  <p className="font-black text-dark-slate dark:text-white">Online Consultation</p>
                  <p className="text-sm font-bold mt-1 text-primary">EUR39+</p>
                </Link>
              </div>
              <button
                type="button"
                onClick={startQuestionnaire}
                className="w-full mt-6 px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2"
              >
                Request Prescription - EUR25 <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {showQuestionnaire && (
          <section id="genital-thrush-questionnaire" className="pb-16">
            <div className="max-w-4xl mx-auto px-6">
              <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8">
                <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${(currentStep / 7) * 100}%` }} />
                </div>
                <p className="mt-3 text-sm font-bold text-slate-600">Step {currentStep} / 7</p>
                <h2 className="mt-6 text-3xl md:text-4xl font-black text-dark-slate dark:text-white">{currentStepData.title}</h2>
                <p className="mt-4 text-slate-600 dark:text-slate-400 font-semibold">{currentStepData.intro}</p>

                <div className="mt-8 space-y-7">
                  {currentStep < 7 &&
                    currentStepQuestions.map((question, index) => (
                      <div key={question.id}>
                        <p className="font-bold text-dark-slate dark:text-white">
                          {index + 1}. {question.text}
                        </p>
                        {question.description && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{question.description}</p>
                        )}
                        <div className="mt-3 flex flex-wrap gap-3">
                          {question.options.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: option }))}
                              className={`px-4 py-2 rounded-lg border text-sm font-bold ${
                                answers[question.id] === option
                                  ? "bg-primary text-white border-primary"
                                  : "border-slate-300 text-slate-700 dark:text-slate-300 dark:border-slate-700"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}

                  {currentStep === 7 && (
                    <div className="space-y-6">
                      {submitted ? (
                        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6">
                          <p className="font-black text-emerald-900 text-2xl">Request submitted</p>
                          <p className="mt-2 text-sm text-emerald-900">
                            Your questionnaire has been sent for doctor review. You will be notified in your secure
                            patient account once a decision is made.
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="rounded-2xl border border-slate-200 p-5">
                            <p className="font-black text-dark-slate dark:text-white">Final confirmation</p>
                            <div className="mt-4 flex flex-col gap-3">
                              <button
                                type="button"
                                onClick={() => setFinalAccuracyConfirm((prev) => !prev)}
                                className={`w-full text-left px-4 py-3 rounded-lg border text-sm font-bold ${
                                  finalAccuracyConfirm
                                    ? "bg-primary text-white border-primary"
                                    : "border-slate-300 text-slate-700 dark:text-slate-300 dark:border-slate-700"
                                }`}
                              >
                                I confirm my answers are complete and accurate.
                              </button>
                              <button
                                type="button"
                                onClick={() => setFinalDoctorReviewConfirm((prev) => !prev)}
                                className={`w-full text-left px-4 py-3 rounded-lg border text-sm font-bold ${
                                  finalDoctorReviewConfirm
                                    ? "bg-primary text-white border-primary"
                                    : "border-slate-300 text-slate-700 dark:text-slate-300 dark:border-slate-700"
                                }`}
                              >
                                I understand this request is subject to doctor review and may be declined if unsafe.
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                    <div className="w-full flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          if (currentStep === 1) {
                            setShowQuestionnaire(false);
                            return;
                          }
                          setCurrentStep((prev) => Math.max(1, prev - 1));
                        }}
                        className="w-full sm:w-auto px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-bold"
                      >
                        Back
                      </button>
                      {currentStep < 7 ? (
                        <button
                          type="button"
                          onClick={() => setCurrentStep((prev) => Math.min(7, prev + 1))}
                          disabled={!isCurrentStepComplete}
                          className="w-full sm:w-auto px-8 py-3 rounded-lg bg-slate-900 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={submitPrescriptionRequest}
                          disabled={!isCurrentStepComplete || submitted}
                          className="w-full sm:w-auto px-8 py-3 rounded-lg bg-primary text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Submit Request
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-center">What&apos;s included and excluded</h2>
            <div className="grid lg:grid-cols-2 gap-8 mt-10">
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-black mb-6">What&apos;s included with our service</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">This service is suitable for you if you:</p>
                <ul className="space-y-3">
                  {includedItems.map((item) => (
                    <li key={item} className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                      <p className="text-sm text-slate-700 dark:text-slate-300">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-black mb-6">What&apos;s excluded with our service</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">This service is not suitable for you if you:</p>
                <ul className="space-y-3">
                  {excludedItems.map((item) => (
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

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-center">How it works</h2>
            <p className="text-slate-500 text-center mt-3">Requesting a prescription online could not be easier with Webdoctor.ie.</p>
            <p className="text-slate-500 text-center mt-2">
              This service is available for selected medications only, which will be clearly shown in the questionnaire.
            </p>
            <p className="text-slate-500 text-center mt-2">If you&apos;re unsure, you can book a GP video consultation.</p>
            <div className="grid md:grid-cols-3 gap-6 mt-10">
              {[
                {
                  step: "Step 1",
                  icon: CheckCircle2,
                  title: "Online Questionnaire",
                  desc: "Complete a secure questionnaire and answer all questions accurately.",
                },
                {
                  step: "Step 2",
                  icon: Clock,
                  title: "Medical Review",
                  desc: "An Irish-registered doctor reviews your information using clinical standards.",
                },
                {
                  step: "Step 3",
                  icon: ArrowRight,
                  title: "Prescription Sent",
                  desc: "If approved, your prescription is sent within minutes to an Irish pharmacy of your choice via secure Healthmail.",
                },
              ].map((item) => (
                <div key={item.title} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <item.icon className="w-8 h-8 text-primary" />
                  <p className="text-xs uppercase tracking-widest font-bold text-primary mt-4">{item.step}</p>
                  <p className="text-xl font-black mt-2 text-dark-slate dark:text-white">{item.title}</p>
                  <p className="text-sm text-slate-500 mt-2">{item.desc}</p>
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
}

