"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2, ChevronDown, Clock, ShieldCheck, Users } from "lucide-react";

const faqs = [
  "Who is this service suitable for?",
  "Who is this service unsuitable for?",
  "What is Genital Herpes?",
  "What causes Genital Herpes?",
  "What are the symptoms of Genital Herpes?",
  "What is a primary Genital Herpes infection?",
  "What should I do if I think I have Genital Herpes for the first time?",
  "What are recurrent Genital Herpes infections?",
  "Where can herpes blisters appear?",
  "What Genital Herpes treatments can we provide?",
  "What are antiviral tablets?",
  "What are the side effects of antiviral tablets?",
  "How do you take these medications?",
  "What is anaesthetic gel?",
  "How do you use anaesthetic gel?",
  "What are the side effects of anaesthetic gels?",
  "Can I prevent a flare of Genital Herpes?",
  "How do you stop the spread of Genital Herpes?",
  "When should I see a doctor in person?",
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
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="pb-5 text-slate-600 dark:text-slate-400">
            Final treatment suitability is confirmed by an Irish-registered doctor after review of your questionnaire.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function GenitalHerpesPage() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [finalAccuracyConfirm, setFinalAccuracyConfirm] = useState(false);
  const [finalDoctorReviewConfirm, setFinalDoctorReviewConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const questions = [
    {
      id: "q1",
      text: "Who are you requesting this treatment for?",
      description:
        "Please be aware that if this prescription is approved, it will be issued in the name of this account owner, and include their personal details.",
      options: ["Myself", "Another person"],
    },
    {
      id: "q2",
      text: "What is your birth sex?",
      description: "",
      options: ["Male", "Female"],
    },
    {
      id: "q3",
      text: "Are you pregnant, possibly pregnant or breastfeeding?",
      description: "",
      options: ["Yes", "No"],
    },
    {
      id: "q4",
      text: "Have you previously been diagnosed with genital herpes by a healthcare professional?",
      description:
        "If you have genital sores you MUST have an in-person medical assessment to confirm the diagnosis and arrange appropriate management before obtaining further medical treatment online. This service is not suitable if you have not been diagnosed by a healthcare professional.",
      options: ["Yes", "No"],
    },
    {
      id: "q5",
      text: "This service provides prescriptions for up to 5 days of aciclovir or valaciclovir medication, to treat a significant acute flare of genital herpes or in preparation for a future significant flare.",
      description:
        "We are unable to provide prescriptions for extended courses of treatment (suppression treatment). A more detailed clinical history would be necessary to arrange this. Please contact your local GP or sexual health clinic to discuss this further. Are you happy to proceed?",
      options: ["Yes", "No"],
    },
    {
      id: "q6",
      text: "Do you have any of the following symptoms?",
      description:
        "Temperature/shivering, muscle aches and pains, difficulty or pain passing urine, unable to pee, unable to pass a bowel motion or pain/bleeding from the back passage, vomiting, headache/neck stiffness.",
      options: ["Yes, I do", "No, I don't"],
    },
    {
      id: "q7",
      text: "Do you have significant kidney disease?",
      description:
        "This refers to any significant decrease in your kidney function and does not relate to urine infections. If you are unsure, please send us a message to info@webdoctor.ie and we can advise you.",
      options: ["Yes", "No"],
    },
    {
      id: "q8",
      text: "Do you have a weak immune system (immunocompromised)?",
      description:
        "This can be due to illnesses such as cancer, HIV or autoimmune conditions, or because of treatment you are receiving such as chemotherapy/radiotherapy, or drugs such as methotrexate, ciclosporin or regular/prolonged use of oral steroids.",
      options: ["Yes", "No"],
    },
    {
      id: "q9",
      text: "This service is to treat herpes lesions on/around your genitals. Are all your lesions located in this area only?",
      description: "",
      options: ["Yes", "No"],
    },
  ];

  const step2Questions = [
    { id: "s2_q1", text: "How often do your herpes flares occur?", options: ["This is a current flare", "Less than 6 times a year", "6 times or more a year"] },
    { id: "s2_q2", text: "When did your current symptoms start?", options: ["Within 24 hours", "1-3 days ago", "More than 3 days ago", "No current flare"] },
    { id: "s2_q3", text: "Which treatment do you prefer if suitable?", options: ["Aciclovir", "Valaciclovir", "Doctor decides"] },
  ];

  const step3Questions = [
    { id: "s3_q1", text: "Do you have any known allergy to aciclovir, valaciclovir, or similar antivirals?", options: ["Yes", "No"] },
    { id: "s3_q2", text: "Are you currently taking any prescription medication that your doctor has asked you to monitor closely?", options: ["Yes", "No"] },
    { id: "s3_q3", text: "Do you understand doses may need adjustment in kidney problems?", options: ["Yes", "No"] },
  ];

  const step4Questions = [
    { id: "s4_q1", text: "Do you need anaesthetic gel for pain relief alongside antivirals, if suitable?", options: ["Yes", "No"] },
    { id: "s4_q2", text: "Do you understand antivirals reduce flare severity/duration but do not cure herpes?", options: ["Yes", "No"] },
    { id: "s4_q3", text: "Do you understand safe-sex precautions are still needed during and between flares?", options: ["Yes", "No"] },
  ];

  const step5Questions = [
    { id: "s5_q1", text: "Can you start treatment immediately after doctor approval?", options: ["Yes", "No"] },
    { id: "s5_q2", text: "Do you understand you must seek in-person care if symptoms worsen or fail to improve?", options: ["Yes", "No"] },
    { id: "s5_q3", text: "Do you agree to contact urgent care immediately for severe urinary retention, severe pain, or systemic illness?", options: ["Yes", "No"] },
  ];

  const step6Questions = [
    { id: "s6_q1", text: "I confirm the information provided is accurate and belongs to me.", options: ["I confirm"] },
    { id: "s6_q2", text: "I understand this service provides short-course treatment only and not long-term suppression.", options: ["I confirm"] },
    { id: "s6_q3", text: "I consent to clinical review by an Irish-registered doctor and understand treatment may be declined if unsuitable.", options: ["I confirm"] },
  ];

  const pregnancyQuestionVisible = answers["q2"] === "Female";
  const visibleStep1Questions = pregnancyQuestionVisible ? questions : questions.filter((q) => q.id !== "q3");
  const hasRedFlagSymptoms = answers["q6"] === "Yes, I do";
  const hasWeakImmuneSystem = answers["q8"] === "Yes";

  const q4Number = pregnancyQuestionVisible ? 4 : 3;
  const q5Number = q4Number + 1;
  const q6Number = q5Number + 1;
  const redFlagWarningNumber = q6Number + 1;
  const q7Number = q6Number + (hasRedFlagSymptoms ? 2 : 1);
  const q8Number = q7Number + 1;
  const immuneWarningNumber = q8Number + 1;
  const q9Number = q8Number + (hasWeakImmuneSystem ? 2 : 1);

  const getStep1QuestionNumber = (id: string, index: number) => {
    if (id === "q4") return q4Number;
    if (id === "q5") return q5Number;
    if (id === "q6") return q6Number;
    if (id === "q7") return q7Number;
    if (id === "q8") return q8Number;
    if (id === "q9") return q9Number;
    return index + 1;
  };

  const step1Complete = visibleStep1Questions.every((q) => Boolean(answers[q.id]));
  const step2Complete = step2Questions.every((q) => Boolean(answers[q.id]));
  const step3Complete = step3Questions.every((q) => Boolean(answers[q.id]));
  const step4Complete = step4Questions.every((q) => Boolean(answers[q.id]));
  const step5Complete = step5Questions.every((q) => Boolean(answers[q.id]));
  const step6Complete = step6Questions.every((q) => Boolean(answers[q.id]));
  const step7Complete = finalAccuracyConfirm && finalDoctorReviewConfirm;
  const canGoNext =
    (currentStep === 1 && step1Complete) ||
    (currentStep === 2 && step2Complete) ||
    (currentStep === 3 && step3Complete) ||
    (currentStep === 4 && step4Complete) ||
    (currentStep === 5 && step5Complete) ||
    (currentStep === 6 && step6Complete);
  const stepTitle = {
    1: "Suitability Check",
    2: "Outbreak Details",
    3: "Medication Safety",
    4: "Treatment Understanding",
    5: "Safety Net Advice",
    6: "Consent & Declarations",
    7: "Review & Submit",
  }[currentStep];

  const startQuestionnaire = () => {
    setShowQuestionnaire(true);
    setCurrentStep(1);
    setAnswers({});
    setFinalAccuracyConfirm(false);
    setFinalDoctorReviewConfirm(false);
    setSubmitted(false);
    setTimeout(() => {
      document.getElementById("suitability-check")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <Navbar />

      <div className="pt-24 bg-primary/5 border-y border-primary/10 py-3 px-6 text-center">
        <p className="text-sm font-bold text-primary">A healthier year starts now. Check your BMI and access medical weight care from €50.</p>
      </div>

      <main>
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-black uppercase mb-6">
                Online Prescription
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-dark-slate dark:text-white leading-tight">
                Genital Herpes <span className="text-primary">Treatment</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-6 leading-relaxed">
                Ireland&apos;s award-winning online doctor service. We offer prescriptions for antiviral treatment options and anaesthetic gel for symptomatic relief.
              </p>
            </div>

            <div className="rounded-[36px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
              <h3 className="text-2xl font-black mb-5">Choose your service</h3>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={startQuestionnaire}
                  className="block w-full p-4 rounded-2xl border text-left transition-all bg-primary text-white border-primary"
                >
                  <p className="font-black text-white">Request Prescription</p>
                  <p className="text-sm font-bold mt-1 text-white/90">€25</p>
                </button>
                <Link
                  href="/consultation"
                  className="block w-full p-4 rounded-2xl border text-left transition-all bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-primary"
                >
                  <p className="font-black text-dark-slate dark:text-white">Online Consultation</p>
                  <p className="text-sm font-bold mt-1 text-primary">€39+</p>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {showQuestionnaire && (
          <section id="suitability-check" className="pb-16">
            <div className="max-w-4xl mx-auto px-6">
              <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8">
                <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${(currentStep / 7) * 100}%` }} />
                </div>
                <p className="mt-3 text-sm font-bold text-slate-600">Step {currentStep} / 7</p>
                <h2 className="mt-6 text-4xl font-black text-dark-slate dark:text-white">{stepTitle}</h2>

                <div className="mt-8 space-y-7">
                  {currentStep === 1 &&
                    visibleStep1Questions.map((question, index) => (
                      <div key={question.id}>
                        <p className="font-bold text-dark-slate dark:text-white">
                          {getStep1QuestionNumber(question.id, index)}.{" "}
                          {question.text}
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

                        {question.id === "q6" && hasRedFlagSymptoms && (
                          <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-5">
                            <p className="font-bold text-amber-900">
                              {redFlagWarningNumber}. These are potential signs of significant infection and you should
                              be assessed in person by a doctor.
                            </p>
                            <p className="mt-2 text-sm text-amber-900">
                              Please contact your local GP/out of hours GP or sexual health/GUM clinic.
                            </p>
                          </div>
                        )}

                        {question.id === "q8" && hasWeakImmuneSystem && (
                          <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-5">
                            <p className="font-bold text-amber-900">
                              {immuneWarningNumber}. A more detailed clinical history will be needed to ensure the
                              appropriate treatment is provided.
                            </p>
                            <p className="mt-2 text-sm text-amber-900">
                              This may be different (higher dose and possibly longer duration) to treatment usually
                              issued via this service. Please speak with your regular doctor or book a video
                              consultation.
                            </p>
                          </div>
                        )}
                      </div>
                    ))}

                  {currentStep >= 2 && currentStep <= 6 && (
                    <>
                      {(currentStep === 2
                        ? step2Questions
                        : currentStep === 3
                          ? step3Questions
                          : currentStep === 4
                            ? step4Questions
                            : currentStep === 5
                              ? step5Questions
                              : step6Questions
                      ).map((question, index) => (
                        <div key={question.id}>
                          <p className="font-bold text-dark-slate dark:text-white">{index + 1}. {question.text}</p>
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
                    </>
                  )}

                  {currentStep === 7 && (
                    <div className="space-y-6">
                      {submitted ? (
                        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6">
                          <p className="font-black text-emerald-900 text-2xl">Request submitted</p>
                          <p className="mt-2 text-sm text-emerald-900">
                            Your questionnaire has been sent for doctor review. You will be notified in your secure patient account once a decision is made.
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="rounded-2xl border border-slate-200 p-5">
                            <p className="font-black text-dark-slate dark:text-white">Key review points</p>
                            <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
                              <p><span className="font-bold">Previously diagnosed:</span> {answers["q4"] || "-"}</p>
                              <p><span className="font-bold">Red flag symptoms:</span> {answers["q6"] || "-"}</p>
                              <p><span className="font-bold">Kidney disease:</span> {answers["q7"] || "-"}</p>
                              <p><span className="font-bold">Immunocompromised:</span> {answers["q8"] || "-"}</p>
                              <p><span className="font-bold">Lesions location:</span> {answers["q9"] || "-"}</p>
                              <p><span className="font-bold">Preferred treatment:</span> {answers["s2_q3"] || "-"}</p>
                            </div>
                          </div>
                          <div className="rounded-2xl border border-slate-200 p-5">
                            <p className="font-bold text-dark-slate dark:text-white">Final confirmation</p>
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
                    <div className="w-full flex items-center justify-between gap-3">
                      {currentStep === 7 ? (
                        <button
                          type="button"
                          onClick={startQuestionnaire}
                          className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-bold"
                        >
                          Start New Request
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                          disabled={currentStep === 1}
                          className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Back
                        </button>
                      )}

                      {currentStep < 7 ? (
                        <button
                          type="button"
                          onClick={() => setCurrentStep((prev) => Math.min(7, prev + 1))}
                          disabled={!canGoNext}
                          className="px-8 py-3 rounded-lg bg-slate-900 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSubmitted(true)}
                          disabled={!step7Complete || submitted}
                          className="px-8 py-3 rounded-lg bg-primary text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
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
            <h2 className="text-3xl md:text-4xl font-black text-center">Treatments that we can provide</h2>
            <p className="text-slate-600 dark:text-slate-400 text-center mt-4 max-w-4xl mx-auto leading-relaxed">
              We provide prescriptions for two antiviral genital herpes treatments and an anaesthetic (numbing) gel to help manage pain. Prescriptions are issued as generic medicines for maximum availability.
            </p>
            <p className="text-sm text-slate-500 text-center mt-3">Please check your dispensed prescription before leaving the pharmacy as no changes can be made after that point.</p>
            <div className="mt-8 max-w-xl mx-auto p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center">
              <p className="font-black">Oral Antiviral Medications</p>
              <p className="font-black mt-1">Anaesthetic Gel</p>
              <Link href="/register" className="mt-4 px-6 py-3 bg-primary text-white rounded-xl font-bold inline-flex items-center gap-2">
                Request Prescription <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mt-10">
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-black mb-6">What&apos;s included with our service</h3>
                <ul className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
                  <li>- Prescription for antiviral tablets and anaesthetic gel.</li>
                  <li>- Service for those previously diagnosed by a healthcare professional.</li>
                  <li>- Suitable for current outbreaks or preparation for future outbreaks, subject to clinical suitability.</li>
                </ul>
              </div>
              <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-black mb-6">What&apos;s excluded with our service</h3>
                <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                  <li>- Pregnancy, possible pregnancy or breastfeeding</li>
                  <li>- First-ever genital herpes infection (requires in-person assessment and swab)</li>
                  <li>- Suppression therapy requests (long-term prevention course)</li>
                  <li>- Feeling unwell with fever/high temperature/malaise</li>
                  <li>- Severe kidney disease or immunocompromised status</li>
                  <li>- Lesions not all on or around genital area</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-center">How it works</h2>
            <p className="text-slate-500 text-center mt-3">Requesting a prescription online could not be easier with Webdoctor.ie.</p>
            <div className="grid md:grid-cols-3 gap-6 mt-10">
              {[
                { step: "Step 1", icon: CheckCircle2, title: "Online Questionnaire", desc: "Complete a secure questionnaire and answer all questions accurately." },
                { step: "Step 2", icon: Clock, title: "Medical Review", desc: "An Irish-registered doctor reviews your information using clinical standards." },
                { step: "Step 3", icon: ArrowRight, title: "Prescription Sent", desc: "If approved, your prescription is sent to your chosen Irish pharmacy via Healthmail." },
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

