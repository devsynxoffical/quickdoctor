"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2, ChevronDown, Clock, ShieldCheck, Users } from "lucide-react";

const faqs = [
  "Who is this service suitable for?",
  "Who is this service not suitable for?",
  "What is excess female facial hair?",
  "What causes excess facial hair in women?",
  "What hair removal options are there?",
  "What treatment can you prescribe for hirsutism?",
  "What is topical excess female facial hair treatment?",
  "How does this treatment work?",
  "How long does it take for this treatment to work?",
  "What are the side effects of this treatment?",
  "How do you use this treatment for excess female facial hair ?",
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
            Final treatment suitability is determined after doctor review of your medical questionnaire.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ExcessFemaleFacialHairPage() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [finalAccuracyConfirm, setFinalAccuracyConfirm] = useState(false);
  const [finalDoctorReviewConfirm, setFinalDoctorReviewConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const steps: {
    title: string;
    intro: string;
    note?: string;
    questions: {
      id: string;
      text: string;
      description?: string;
      options: string[];
    }[];
  }[] = [
    {
      title: "Suitability Check",
      intro:
        "In this section, you will confirm that you understand some statements regarding Vaniqa and how it works. You will also answer questions to see if you are suitable for this treatment.",
      note:
        "Please note: if you have not been to see your own GP about excess facial hair previously you may not be eligible for this treatment. If you would like to speak to a GP, please book a video consultation.",
      questions: [
        { id: "s1_q1", text: "Is your birth sex female and are you aged over 18 years of age?", options: ["Yes, I am", "No, I am not"] },
        { id: "s1_q2", text: "Do you suffer from unwanted facial hair?", options: ["Yes, I do", "No, I do not"] },
        { id: "s1_q3", text: "Are you pregnant, planning to become pregnant or are you currently breastfeeding?", options: ["Yes, I am", "No, I am not"] },
        {
          id: "s1_q4",
          text: "Are you taking any of the medications in the following list?",
          description:
            "Cyclosporine, long-term oral steroids (more than 3 months), Minoxidil, Phenobarbitone, Phenytoin or Danazol.",
          options: ["Yes, I am", "No, I am not"],
        },
        {
          id: "s1_q5",
          text: "Have you been diagnosed with any of the following conditions?",
          description:
            "Cushing's syndrome, Congenital Adrenal Hyperplasia, or hormone-producing tumours of the ovary or adrenal glands.",
          options: ["Yes, I have", "No, I have not"],
        },
        {
          id: "s1_q6",
          text: "Please confirm you understand this information:",
          description:
            "Some symptoms (for example irregular periods, rapid hair growth, severe acne, or masculine changes) may need further in-person assessment.",
          options: ["Yes, I confirm", "No, I do not confirm"],
        },
        { id: "s1_q7", text: "I understand Vaniqa slows hair growth and is not a hair removal cream.", options: ["Yes, I confirm", "No, I do not confirm"] },
        { id: "s1_q8", text: "I am aware results are usually seen in 4-8 weeks and can take up to 4 months.", options: ["Yes, I confirm", "No, I do not confirm"] },
        { id: "s1_q9", text: "I understand this is long-term treatment and stopping may reverse results.", options: ["Yes, I confirm", "No, I do not confirm"] },
        { id: "s1_q10", text: "I understand Vaniqa should be used only on face/adjacent chin areas.", options: ["Yes, I confirm", "No, I do not confirm"] },
      ],
    },
    {
      title: "Medical Background",
      intro: "These questions help doctors check hormonal and medical causes before treatment.",
      questions: [
        { id: "s2_q1", text: "Have you previously discussed excess facial hair with your GP?", options: ["Yes", "No"] },
        { id: "s2_q2", text: "Do you currently have irregular periods or sudden unexplained weight changes?", options: ["Yes", "No"] },
        { id: "s2_q3", text: "Do you have a known diagnosis of PCOS?", options: ["Yes", "No", "Not sure"] },
        { id: "s2_q4", text: "Has your facial hair growth worsened rapidly within the last 6 months?", options: ["Yes", "No"] },
      ],
    },
    {
      title: "Allergy & Skin Safety",
      intro: "Please confirm your skin and allergy profile.",
      questions: [
        { id: "s3_q1", text: "Have you had an allergic reaction to eflornithine/Vaniqa or similar creams?", options: ["Yes", "No"] },
        { id: "s3_q2", text: "Do you currently have broken, infected, or severely irritated skin in treatment areas?", options: ["Yes", "No"] },
        { id: "s3_q3", text: "Are you currently using topical prescription products on your face?", options: ["Yes", "No"] },
      ],
    },
    {
      title: "Current Treatment Use",
      intro: "Tell us about your current approach so doctors can advise safely.",
      questions: [
        { id: "s4_q1", text: "Are you currently using laser, waxing, threading, or electrolysis for facial hair?", options: ["Yes", "No"] },
        { id: "s4_q2", text: "Have you used Vaniqa previously?", options: ["Yes", "No"] },
        { id: "s4_q3", text: "If used previously, was it effective for you?", options: ["Yes", "No", "Not applicable"] },
      ],
    },
    {
      title: "Treatment Planning",
      intro: "These questions make sure treatment instructions are practical and clear.",
      questions: [
        { id: "s5_q1", text: "Can you apply cream twice daily approximately 8 hours apart?", options: ["Yes", "No"] },
        { id: "s5_q2", text: "Do you understand cream should not be used immediately before/after hair removal?", options: ["Yes", "No"] },
        { id: "s5_q3", text: "Do you understand treatment should be reviewed if no benefit after 4 months?", options: ["Yes", "No"] },
      ],
    },
    {
      title: "Consent & Declarations",
      intro: "Please confirm the mandatory declarations before final review.",
      questions: [
        { id: "s6_q1", text: "I understand this online service does not replace emergency or specialist in-person care.", options: ["I confirm"] },
        { id: "s6_q2", text: "I consent to review by an Irish-registered doctor and understand requests may be declined if unsuitable.", options: ["I confirm"] },
        { id: "s6_q3", text: "I confirm all information provided is accurate and belongs to me.", options: ["I confirm"] },
      ],
    },
    {
      title: "Review & Submit",
      intro: "Review key answers and submit your request for doctor review.",
      questions: [],
    },
  ];

  const currentStepData = steps[currentStep - 1];
  const isCurrentStepComplete =
    currentStep === 7
      ? finalAccuracyConfirm && finalDoctorReviewConfirm
      : currentStepData.questions.every((q) => Boolean(answers[q.id]));

  const hasSuitabilityWarning = [
    answers["s1_q1"] === "No, I am not",
    answers["s1_q2"] === "No, I do not",
    answers["s1_q3"] === "Yes, I am",
    answers["s2_q1"] === "No",
    answers["s3_q1"] === "Yes",
    answers["s3_q2"] === "Yes",
    answers["s5_q1"] === "No",
  ].some(Boolean);

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
                Excess Female Facial Hair <span className="text-primary">Treatment</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-6 leading-relaxed">
                Ireland&apos;s Award-Winning Online Doctor Service.
              </p>
            </div>

            <div className="rounded-[36px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
              <h3 className="text-2xl font-black mb-5">Treatments that we can provide</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                While all women have fine, light hair covering their faces and bodies, approximately 10% of women are
                affected by hirsutism, a condition that causes excess hair growth.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
                To help control excess facial hair in women, by reducing hair growth and regrowth, we can prescribe a
                non-hormonal cream.
              </p>
              <p className="text-sm font-bold text-dark-slate dark:text-white mt-4">
                Topical Excess Female Facial Hair Treatment (Cream)
              </p>
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
              <button
                type="button"
                onClick={startQuestionnaire}
                className="w-full mt-6 px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2"
              >
                Request Prescription - €25 <ArrowRight className="w-4 h-4" />
              </button>
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
                <h2 className="mt-6 text-3xl md:text-4xl font-black text-dark-slate dark:text-white">{currentStepData.title}</h2>
                <p className="mt-4 text-slate-600 dark:text-slate-400 font-semibold">{currentStepData.intro}</p>
                {currentStepData.note && <p className="mt-2 text-slate-600 dark:text-slate-400 font-semibold">{currentStepData.note}</p>}

                <div className="mt-8 space-y-7">
                  {currentStep < 7 &&
                    currentStepData.questions.map((question, index) => (
                      <div key={question.id}>
                        <p className="font-bold text-dark-slate dark:text-white">{index + 1}. {question.text}</p>
                        {question.description && <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{question.description}</p>}
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
                            <p className="font-black text-dark-slate dark:text-white">Key review points</p>
                            <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
                              <p><span className="font-bold">Age/sex criteria:</span> {answers["s1_q1"] || "-"}</p>
                              <p><span className="font-bold">Pregnancy status:</span> {answers["s1_q3"] || "-"}</p>
                              <p><span className="font-bold">GP review completed:</span> {answers["s2_q1"] || "-"}</p>
                              <p><span className="font-bold">Allergy response:</span> {answers["s3_q1"] || "-"}</p>
                              <p><span className="font-bold">Twice-daily adherence:</span> {answers["s5_q1"] || "-"}</p>
                              <p><span className="font-bold">Declaration:</span> {answers["s6_q3"] || "-"}</p>
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
                                I understand this request is subject to doctor review and may be declined if unsafe.
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {hasSuitabilityWarning && currentStep < 7 && (
                    <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
                      <p className="font-black text-amber-900">Safety notice</p>
                      <p className="mt-2 text-sm text-amber-900">
                        One or more answers may indicate this treatment is not suitable. A doctor will still review
                        your request and may advise a video consultation instead.
                      </p>
                    </div>
                  )}

                  <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                    <div className="w-full flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      {currentStep === 7 ? (
                        <button
                          type="button"
                          onClick={startQuestionnaire}
                          className="w-full sm:w-auto px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-bold"
                        >
                          Start New Request
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                          disabled={currentStep === 1}
                          className="w-full sm:w-auto px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Back
                        </button>
                      )}
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
                          onClick={() => setSubmitted(true)}
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
                <ul className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
                  <li>- We can provide a prescription for a non-hormonal cream used to treat excess female facial hair that helps to reduce hair growth and re-growth, subject to clinical suitability.</li>
                </ul>
              </div>
              <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-black mb-6">What&apos;s excluded with our service</h3>
                <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                  <li>- The cream we can prescribe is NOT a hair removal cream.</li>
                  <li>- It is a non-hormonal cream that slows down hair growth and if effective, hair production is slowed down to the point where it is significantly reduced or does not grow.</li>
                  <li>- This is not permanent, and to maintain the effect continuous use is required.</li>
                  <li>- You may still need to remove unwanted hairs while using this treatment and it can be used in conjunction with other hair removal techniques.</li>
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

