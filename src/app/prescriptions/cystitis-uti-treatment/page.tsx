"use client";

import React, { useState } from "react";
import { beginPrescriptionCheckout } from '@/lib/serviceCheckout';
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2, ChevronDown, Clock, ShieldCheck, Users, XCircle } from "lucide-react";

const faqs = [
  "Who is this service for?",
  "Who is this service not suitable for?",
  "What causes Urinary Tract Infections?",
  "What is Cystitis?",
  "What are the main symptoms of female Cystitis?",
  "What can increase your risk of developing female Cystitis?",
  "Are antibiotics always necessary to treat female Cystitis?",
  "What prescription medication can we provide?",
  "What are the potential side effects of this antibiotic?",
  "When should you arrange an â€˜in personâ€™ appointment with a doctor?",
  "Can taking antibiotics lead to antibiotic resistance?",
];

const includedItems = [
  "If clinically appropriate, we can provide treatment for female patients with an antibiotic.",
  "Usually, these begin to work within 24 hours.",
];

const excludedItems = [
  "Male",
  "A child under the age of 17",
  "A female over the age of 65",
  "Pregnant (or suspect you could be pregnant) or breastfeeding",
  "Having symptoms of fever, shaking chills, vomiting or flank pain (pain in the sides)",
  "Seeing blood in your urine",
  "Experiencing vaginal bleeding or abnormal vaginal discharge",
  "Using a urinary catheter (including self-catheterisation and permanent catheters)",
  "Aware your kidney filtration rate (eGFR/ estimated glomerular filtration rate) is less than 45 mL/min",
  "Seeking a prescription for antibiotics not listed in our medical application form. These cannot be issued via this service",
  "Requiring a medical certificate due to the urine infection (Please note, we cannot issue retrospective medical certificates).",
  "Suffering from recurrent Urinary Tract Infections (more than 2 in 6 months or 3 in one year)",
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

export default function CystitisUtiTreatmentPage() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [understandUnsuitable, setUnderstandUnsuitable] = useState(false);
  const [finalAccuracyConfirm, setFinalAccuracyConfirm] = useState(false);
  const [finalDoctorReviewConfirm, setFinalDoctorReviewConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const steps: {
    title: string;
    intro: string;
    questions: { id: string; text: string; description?: string; options: string[] }[];
  }[] = [
    {
      title: "Patient Selection",
      intro:
        "This questionnaire is an important part of your assessment today. We ask that you are honest with your answers.",
      questions: [
        {
          id: "s1_q1",
          text: "Please be advised that this service is not suitable for all patients experiencing urinary symptoms or infections.",
          description:
            "We have safety criteria and checks in place to ensure your clinical safety and we kindly ask that you answer all questions honestly.",
          options: ["I understand"],
        },
        {
          id: "s1_q2",
          text: "Who are you requesting this treatment for?",
          description:
            "Please be aware that if this prescription is approved, it will be issued in the name of this account holder, and will include their personal details.",
          options: ["For myself", "For a child", "For someone else"],
        },
      ],
    },
    {
      title: "Symptoms",
      intro: "Tell us about your current urinary symptoms and timeline.",
      questions: [
        { id: "s2_q1", text: "Do you have pain or burning when passing urine?", options: ["Yes", "No"] },
        { id: "s2_q2", text: "Do you need to pass urine more frequently than usual?", options: ["Yes", "No"] },
        { id: "s2_q3", text: "Do you feel urgency to pass urine?", options: ["Yes", "No"] },
        { id: "s2_q4", text: "Have your symptoms started within the last 7 days?", options: ["Yes", "No"] },
      ],
    },
    {
      title: "Safety screening",
      intro: "Please answer these safety questions before continuing.",
      questions: [
        { id: "s3_q1", text: "Do you have fever, chills, vomiting or flank (side/back) pain?", options: ["Yes", "No"] },
        { id: "s3_q2", text: "Have you noticed blood in your urine?", options: ["Yes", "No"] },
        { id: "s3_q3", text: "Are you pregnant, possibly pregnant, or breastfeeding?", options: ["Yes", "No"] },
        { id: "s3_q4", text: "Do you have vaginal bleeding or abnormal vaginal discharge?", options: ["Yes", "No"] },
      ],
    },
    {
      title: "Medical background",
      intro: "Background checks to support safe prescribing.",
      questions: [
        { id: "s4_q1", text: "Do you use a urinary catheter?", options: ["Yes", "No"] },
        { id: "s4_q2", text: "Have you had recurrent UTIs (2 in 6 months or 3 in one year)?", options: ["Yes", "No"] },
        { id: "s4_q3", text: "Are you aware of reduced kidney function (eGFR below 45)?", options: ["Yes", "No", "Not sure"] },
        { id: "s4_q4", text: "Do you understand only Nitrofurantoin can be prescribed through this service?", options: ["Yes", "No"] },
      ],
    },
    {
      title: "Review & submit",
      intro: "Review your responses and submit your request.",
      questions: [],
    },
  ];

  const currentStepData = steps[currentStep - 1];
  const selectedPatient = answers["s1_q2"];
  const showUnsuitablePatientNotice = selectedPatient === "For a child" || selectedPatient === "For someone else";
  const nitroQuestionNumber = showUnsuitablePatientNotice ? "4" : "3";

  const isStepOneComplete = () => {
    const baseComplete = Boolean(answers["s1_q1"]) && Boolean(answers["s1_q2"]) && Boolean(answers["s1_q3"]);
    if (!baseComplete) {
      return false;
    }
    if (showUnsuitablePatientNotice) {
      return Boolean(answers["s1_q_unsuitable"]);
    }
    return true;
  };

  const isCurrentStepComplete =
    currentStep === 5
      ? finalAccuracyConfirm && finalDoctorReviewConfirm
      : currentStep === 1
        ? isStepOneComplete()
        : currentStepData.questions.every((q) => Boolean(answers[q.id]));

  const stepUnsuitable =
    (currentStep === 2 && (answers["s2_q1"] === "No" || answers["s2_q2"] === "No" || answers["s2_q4"] === "No")) ||
    (currentStep === 3 &&
      (answers["s3_q1"] === "Yes" ||
        answers["s3_q2"] === "Yes" ||
        answers["s3_q3"] === "Yes" ||
        answers["s3_q4"] === "Yes")) ||
    (currentStep === 4 &&
      (answers["s4_q1"] === "Yes" || answers["s4_q2"] === "Yes" || answers["s4_q4"] === "No"));

  const startQuestionnaire = () => {
    setShowQuestionnaire(true);
    setCurrentStep(1);
    setAnswers({});
    setUnderstandUnsuitable(false);
    setFinalAccuracyConfirm(false);
    setFinalDoctorReviewConfirm(false);
    setSubmitted(false);
    setTimeout(() => {
      document.getElementById("cystitis-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const submitPrescriptionRequest = () => {
    beginPrescriptionCheckout({
      slug: 'cystitis-uti-treatment',
      serviceName: 'Cystitis Uti Treatment',
      payload: {
      answers,
      understandUnsuitable,
      finalAccuracyConfirm,
      finalDoctorReviewConfirm,
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <Navbar />
<main>
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-black uppercase mb-6">
                Online Prescription
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-dark-slate dark:text-white leading-tight">
                Cystitis UTI <span className="text-primary">Treatment</span>
              </h1>
              <ul className="mt-6 space-y-3">
                {[
                  "Reviewed by Irish-registered GPs",
                  "Same-day review - prescriptions approved within hours",
                  "Sent directly to your local pharmacy for collection",
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
                Cystitis is when the bladder becomes inflamed, and is most commonly caused by infection.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
                Women tend to get cystitis more often than men because their urethra is much shorter, and it sits closer
                to the back passage. This means that bacteria can get into the bladder more easily via faeces (poo),
                which contains high levels of E.Coli bacteria, the most common cause of female cystitis.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
                This usually responds well to treatment with the nitrofuran antibiotics.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
                Please be advised, as a written consultation service, our clinical criteria for issuing antibiotic
                prescriptions for potential urine infections is more strict than the clinical judgement that may be used
                during a face-to-face consultation. We can only treat female cystitis.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
                We issue prescriptions for generic name medicines to ensure maximum availability of treatments. Please
                check your dispensed prescription before leaving the pharmacy as no changes can be made after that point.
              </p>
              <p className="text-sm font-bold text-dark-slate dark:text-white mt-4">Nitrofuran antibiotics</p>
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
                <Link
                  href="/home-test-kits"
                  className="block w-full p-4 rounded-2xl border text-left transition-all bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-primary"
                >
                  <p className="font-black text-dark-slate dark:text-white">Home Test Kits</p>
                  <p className="text-sm font-bold mt-1 text-primary">EUR69+</p>
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
          <section id="cystitis-questionnaire" className="pb-16">
            <div className="max-w-4xl mx-auto px-6">
              <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8">
                <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${(currentStep / 5) * 100}%` }} />
                </div>
                <p className="mt-3 text-sm font-bold text-slate-600">Step {currentStep} / 5</p>
                <h2 className="mt-6 text-3xl md:text-4xl font-black text-dark-slate dark:text-white">{currentStepData.title}</h2>
                <p className="mt-4 text-slate-600 dark:text-slate-400 font-semibold">{currentStepData.intro}</p>

                <div className="mt-8 space-y-7">
                  {currentStep === 1 && (
                    <>
                      <div>
                        <p className="font-bold text-dark-slate dark:text-white">
                          1. Please be advised that this service is not suitable for all patients experiencing urinary symptoms or infections.
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                          We have safety criteria and checks in place to ensure your clinical safety and we kindly ask
                          that you answer all questions honestly.
                        </p>
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={() => setAnswers((prev) => ({ ...prev, s1_q1: "I understand" }))}
                            className={`px-4 py-2 rounded-lg border text-sm font-bold ${
                              answers["s1_q1"] === "I understand"
                                ? "bg-primary text-white border-primary"
                                : "border-slate-300 text-slate-700 dark:text-slate-300 dark:border-slate-700"
                            }`}
                          >
                            I understand
                          </button>
                        </div>
                      </div>

                      <div>
                        <p className="font-bold text-dark-slate dark:text-white">2. Who are you requesting this treatment for?</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                          Please be aware that if this prescription is approved, it will be issued in the name of this
                          account holder, and will include their personal details.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-3">
                          {["For myself", "For a child", "For someone else"].map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() =>
                                setAnswers((prev) => ({ ...prev, s1_q2: option, s1_q_unsuitable: "" }))
                              }
                              className={`px-4 py-2 rounded-lg border text-sm font-bold ${
                                answers["s1_q2"] === option
                                  ? "bg-primary text-white border-primary"
                                  : "border-slate-300 text-slate-700 dark:text-slate-300 dark:border-slate-700"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                      {showUnsuitablePatientNotice && (
                        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
                          <p className="font-black text-amber-900">3. THIS SERVICE IS NOT SUITABLE</p>
                          <p className="mt-2 text-sm text-amber-900">
                            This service is only suitable for individuals aged 17 and older.
                          </p>
                          <p className="mt-2 text-sm text-amber-900">
                            If someone aged 17 or older requires treatment, they must apply through their own account
                          </p>
                          <p className="mt-2 text-sm text-amber-900">
                            For any registration issues or questions, you can contact us at info@webdoctor.ie.
                          </p>
                          <button
                            type="button"
                            onClick={() => setAnswers((prev) => ({ ...prev, s1_q_unsuitable: "I understand" }))}
                            className={`w-full mt-4 text-left px-4 py-3 rounded-lg border text-sm font-bold ${
                              answers["s1_q_unsuitable"] === "I understand"
                                ? "bg-amber-500 text-white border-amber-500"
                                : "border-amber-300 text-amber-900"
                            }`}
                          >
                            I understand
                          </button>
                        </div>
                      )}

                      <div>
                        <p className="font-bold text-dark-slate dark:text-white">
                          {nitroQuestionNumber}. We can only issue prescriptions for Nitrofurantoin antibiotics via this service.
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                          Other antibiotics and medical certificates cannot be provided through this service.
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                          If you need a medical certificate or a different antibiotic, you can book a video consultation
                          to discuss this with one of our GPs.
                        </p>
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={() => setAnswers((prev) => ({ ...prev, s1_q3: "I understand" }))}
                            className={`px-4 py-2 rounded-lg border text-sm font-bold ${
                              answers["s1_q3"] === "I understand"
                                ? "bg-primary text-white border-primary"
                                : "border-slate-300 text-slate-700 dark:text-slate-300 dark:border-slate-700"
                            }`}
                          >
                            I understand
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {currentStep > 1 && currentStep < 5 &&
                    currentStepData.questions.map((question, index) => (
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
                              onClick={() => {
                                setAnswers((prev) => ({ ...prev, [question.id]: option }));
                                setUnderstandUnsuitable(false);
                              }}
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

                  {currentStep > 1 && currentStep < 5 && stepUnsuitable && (
                    <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
                      <p className="font-black text-amber-900">SAFETY NOTICE</p>
                      <p className="mt-2 text-sm text-amber-900">
                        One or more answers may mean this service is not suitable. Please consider a GP video consultation
                        for full assessment.
                      </p>
                      <button
                        type="button"
                        onClick={() => setUnderstandUnsuitable((prev) => !prev)}
                        className={`w-full mt-4 text-left px-4 py-3 rounded-lg border text-sm font-bold ${
                          understandUnsuitable ? "bg-amber-500 text-white border-amber-500" : "border-amber-300 text-amber-900"
                        }`}
                      >
                        I understand
                      </button>
                    </div>
                  )}

                  {currentStep === 5 && (
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
                            <p className="font-black text-dark-slate dark:text-white">Review snapshot</p>
                            <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
                              <p><span className="font-bold">Patient selection:</span> {answers["s1_q2"] || "-"}</p>
                              <p><span className="font-bold">Burning urination:</span> {answers["s2_q1"] || "-"}</p>
                              <p><span className="font-bold">Frequency:</span> {answers["s2_q2"] || "-"}</p>
                              <p><span className="font-bold">Urgency:</span> {answers["s2_q3"] || "-"}</p>
                              <p><span className="font-bold">Systemic symptoms:</span> {answers["s3_q1"] || "-"}</p>
                              <p><span className="font-bold">Pregnancy/breastfeeding:</span> {answers["s3_q3"] || "-"}</p>
                            </div>
                          </div>
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
                                I understand this request is subject to doctor review and may be declined if unsuitable.
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
                      {currentStep < 5 ? (
                        <button
                          type="button"
                          onClick={() => setCurrentStep((prev) => Math.min(5, prev + 1))}
                          disabled={!isCurrentStepComplete || (stepUnsuitable && !understandUnsuitable)}
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
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">This service is NOT suitable for you if you are:</p>
                <ul className="space-y-3">
                  {excludedItems.map((item) => (
                    <li key={item} className="flex gap-3">
                      <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-slate-700 dark:text-slate-300">{item}</p>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
                  Please note: the management of male patients with cystitis is VERY different and we are not able to
                  provide this via this service.
                </p>
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

