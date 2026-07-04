"use client";

import React, { useState } from "react";
import { beginPrescriptionCheckout } from '@/lib/serviceCheckout';
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2, ChevronDown, Clock, ShieldCheck, Users, XCircle } from "lucide-react";

const faqs = [
  "How do period delay tablets work?",
  "Who is this service suitable for?",
  "Who is this service not suitable for?",
  "What type of period delay medication do you prescribe?",
  "How do I take period delay tablets?",
  "What are the side effects of period delay tablets?",
  "Do period delay tablets provide contraceptive cover?",
  "Can I use period delay tablets with a combined contraceptive pill?",
];

const excludedItems = [
  "Are using combined hormonal contraception",
  "Are pregnant, possibly pregnant or trying to conceive",
  "Are breastfeeding",
  "Have ever had a blood clot",
  "Have a history of or a diagnosis of breast cancer.",
  "Have cardiovascular disease (stroke, heart attack, angina, stents).",
  "Have significant liver disease",
  "Have porphyria",
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

export default function PeriodDelayTreatmentPage() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [patientSelection, setPatientSelection] = useState("");
  const [understandUnsuitable, setUnderstandUnsuitable] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [confirmAccuracy, setConfirmAccuracy] = useState(false);
  const [confirmDoctorReview, setConfirmDoctorReview] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isSomeoneElse = patientSelection === "For someone else";
  const isChild = patientSelection === "For a child";
  const showUnsuitableDisclaimer = isSomeoneElse || isChild;
  const progressWidth = `${(currentStep / 4) * 100}%`;

  const stepTwoQuestions = [
    { id: "s2_q1", text: "Are you currently pregnant, possibly pregnant or trying to conceive?", options: ["Yes", "No"] },
    { id: "s2_q2", text: "Are you currently breastfeeding?", options: ["Yes", "No"] },
    { id: "s2_q3", text: "Are you using combined hormonal contraception?", options: ["Yes", "No"] },
    { id: "s2_q4", text: "Have you ever had a blood clot?", options: ["Yes", "No"] },
    { id: "s2_q5", text: "Do you have significant liver disease?", options: ["Yes", "No"] },
  ];

  const stepThreeQuestions = [
    { id: "s3_q1", text: "Do you understand period delay tablets do not provide contraceptive cover?", options: ["Yes", "No"] },
    { id: "s3_q2", text: "Can you start treatment at least 3 days before your expected period?", options: ["Yes", "No"] },
    { id: "s3_q3", text: "Do you understand treatment can delay bleeding for up to 14 days only?", options: ["Yes", "No"] },
    { id: "s3_q4", text: "Do you understand a doctor may decline treatment if it is not safe for you?", options: ["Yes", "No"] },
  ];

  const isStepComplete = () => {
    if (currentStep === 1) {
      if (showUnsuitableDisclaimer) {
        return understandUnsuitable;
      }
      return patientSelection === "For myself";
    }
    if (currentStep === 2) {
      return stepTwoQuestions.every((question) => Boolean(answers[question.id]));
    }
    if (currentStep === 3) {
      return stepThreeQuestions.every((question) => Boolean(answers[question.id]));
    }
    return confirmAccuracy && confirmDoctorReview;
  };

  const startQuestionnaire = () => {
    setShowQuestionnaire(true);
    setCurrentStep(1);
    setPatientSelection("");
    setUnderstandUnsuitable(false);
    setAnswers({});
    setConfirmAccuracy(false);
    setConfirmDoctorReview(false);
    setSubmitted(false);
    setTimeout(() => {
      document.getElementById("patient-selection")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const submitPrescriptionRequest = () => {
    beginPrescriptionCheckout({
      slug: 'period-delay-treatment',
      serviceName: 'Period Delay Treatment',
      payload: {
      patientSelection,
      understandUnsuitable,
      answers,
      confirmAccuracy,
      confirmDoctorReview,
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
                Period Delay <span className="text-primary">Treatment</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-6 leading-relaxed">
                Reviewed by Irish-registered GPs. Simple online form, reviewed within hours. Sent directly to your local
                pharmacy for easy collection.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Reviewed by Irish-registered GPs",
                  "Simple online form, reviewed within hours",
                  "Sent directly to your local pharmacy for easy collection",
                  "â‚¬25, available nationwide",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 text-green-600 shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[36px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
              <h3 className="text-2xl font-black mb-5">Treatments that we can provide</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Are you wondering how to delay your period for a vacation or a big event? Webdoctor.ie can help with a
                prescription for Period Delay medication. To request a prescription, simply fill in the short and secure
                suitability questionnaire.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
                Once approved, one of our Irish-registered doctors will send your prescription to your chosen pharmacy.
                Please check your dispensed prescription before leaving the pharmacy as no changes can be made after that
                point.
              </p>
              <p className="text-sm font-bold text-dark-slate dark:text-white mt-4">Oral Progesterone tablets</p>
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
          <section id="patient-selection" className="pb-16">
            <div className="max-w-4xl mx-auto px-6">
              <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8">
                <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: progressWidth }} />
                </div>
                <p className="mt-3 text-sm font-bold text-slate-600">Step {currentStep} / 4</p>

                {currentStep === 1 && (
                  <>
                    <h2 className="mt-6 text-3xl md:text-4xl font-black text-dark-slate dark:text-white">Patient selection</h2>
                    <p className="mt-4 text-slate-600 dark:text-slate-400 font-semibold">
                      This questionnaire is an important part of your assessment today. Please answer honestly so we can
                      safely assess whether this treatment is suitable for you. All information you provide is protected by
                      the same patient-doctor confidentiality as an in-person consultation.
                    </p>

                    <div className="mt-8">
                      <p className="font-bold text-dark-slate dark:text-white">1. Who are you requesting this treatment for?</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        If approved, this prescription will be issued in the account holder&apos;s name and include their personal
                        details.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        {["For myself", "For a child", "For someone else"].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              setPatientSelection(option);
                              setUnderstandUnsuitable(false);
                            }}
                            className={`px-4 py-2 rounded-lg border text-sm font-bold ${
                              patientSelection === option
                                ? "bg-primary text-white border-primary"
                                : "border-slate-300 text-slate-700 dark:text-slate-300 dark:border-slate-700"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    {showUnsuitableDisclaimer && (
                      <div className="mt-8 rounded-2xl border border-amber-300 bg-amber-50 p-5">
                        <p className="font-black text-amber-900">THIS SERVICE IS UNSUITABLE</p>
                        {isChild ? (
                          <>
                            <p className="mt-2 text-sm text-amber-900">
                              This service is only suitable for individuals aged 17 and older. If you&apos;re seeking
                              treatment for a child under 17, please book a video consultation instead.
                            </p>
                            <p className="mt-2 text-sm text-amber-900">
                              If your child is over 17 years old, they must apply through their own account.
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="mt-2 text-sm text-amber-900">
                              You cannot apply for a prescription on behalf of another adult.
                            </p>
                            <p className="mt-2 text-sm text-amber-900">
                              If someone aged 17 or older needs a prescription, they must apply through their own account.
                            </p>
                            <p className="mt-2 text-sm text-amber-900">
                              For registration issues or questions, contact info@webdoctor.ie.
                            </p>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => setUnderstandUnsuitable((prev) => !prev)}
                          className={`w-full mt-4 text-left px-4 py-3 rounded-lg border text-sm font-bold ${
                            understandUnsuitable
                              ? "bg-amber-500 text-white border-amber-500"
                              : "border-amber-300 text-amber-900"
                          }`}
                        >
                          I understand
                        </button>
                      </div>
                    )}
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <h2 className="mt-6 text-3xl md:text-4xl font-black text-dark-slate dark:text-white">Medical suitability</h2>
                    <p className="mt-4 text-slate-600 dark:text-slate-400 font-semibold">
                      Please complete these safety questions so a doctor can assess if period delay treatment is suitable.
                    </p>
                    <div className="mt-8 space-y-6">
                      {stepTwoQuestions.map((question, index) => (
                        <div key={question.id}>
                          <p className="font-bold text-dark-slate dark:text-white">
                            {index + 1}. {question.text}
                          </p>
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
                    </div>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <h2 className="mt-6 text-3xl md:text-4xl font-black text-dark-slate dark:text-white">Treatment understanding</h2>
                    <p className="mt-4 text-slate-600 dark:text-slate-400 font-semibold">
                      Confirm you understand how treatment works and its important safety limits.
                    </p>
                    <div className="mt-8 space-y-6">
                      {stepThreeQuestions.map((question, index) => (
                        <div key={question.id}>
                          <p className="font-bold text-dark-slate dark:text-white">
                            {index + 1}. {question.text}
                          </p>
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
                    </div>
                  </>
                )}

                {currentStep === 4 && (
                  <>
                    <h2 className="mt-6 text-3xl md:text-4xl font-black text-dark-slate dark:text-white">Final declarations</h2>
                    {submitted ? (
                      <div className="mt-8 rounded-2xl border border-emerald-300 bg-emerald-50 p-6">
                        <p className="font-black text-emerald-900 text-2xl">Request submitted</p>
                        <p className="mt-2 text-sm text-emerald-900">
                          Your questionnaire has been submitted for doctor review. You will receive an update in your
                          patient account once reviewed.
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="mt-4 text-slate-600 dark:text-slate-400 font-semibold">
                          Please confirm both statements before submitting your request.
                        </p>
                        <div className="mt-8 flex flex-col gap-3">
                          <button
                            type="button"
                            onClick={() => setConfirmAccuracy((prev) => !prev)}
                            className={`w-full text-left px-4 py-3 rounded-lg border text-sm font-bold ${
                              confirmAccuracy
                                ? "bg-primary text-white border-primary"
                                : "border-slate-300 text-slate-700 dark:text-slate-300 dark:border-slate-700"
                            }`}
                          >
                            I confirm the information I provided is accurate and complete.
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDoctorReview((prev) => !prev)}
                            className={`w-full text-left px-4 py-3 rounded-lg border text-sm font-bold ${
                              confirmDoctorReview
                                ? "bg-primary text-white border-primary"
                                : "border-slate-300 text-slate-700 dark:text-slate-300 dark:border-slate-700"
                            }`}
                          >
                            I understand this request will be clinically reviewed and may be declined if unsuitable.
                          </button>
                        </div>
                      </>
                    )}
                  </>
                )}

                <div className="pt-6 mt-8 border-t border-slate-200 dark:border-slate-700 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (currentStep === 1) {
                        setShowQuestionnaire(false);
                        setPatientSelection("");
                        setUnderstandUnsuitable(false);
                        return;
                      }
                      setCurrentStep((prev) => Math.max(1, prev - 1));
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-bold"
                  >
                    Back
                  </button>

                  {currentStep === 1 && showUnsuitableDisclaimer ? (
                    <button
                      type="button"
                      onClick={() => setShowQuestionnaire(false)}
                      disabled={!understandUnsuitable}
                      className="w-full sm:w-auto px-8 py-3 rounded-lg bg-slate-900 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Exit
                    </button>
                  ) : currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
                      disabled={!isStepComplete()}
                      className="w-full sm:w-auto px-8 py-3 rounded-lg bg-slate-900 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={submitPrescriptionRequest}
                      disabled={!isStepComplete() || submitted}
                      className="w-full sm:w-auto px-8 py-3 rounded-lg bg-primary text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Request
                    </button>
                  )}
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
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      The prescribed treatment can delay your period up to 14 days.
                    </p>
                  </li>
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

