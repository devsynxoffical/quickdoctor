"use client";

import React, { useState } from "react";
import { beginPrescriptionCheckout } from '@/lib/serviceCheckout';
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2, ChevronDown, Clock, ShieldCheck, Users } from "lucide-react";

const faqItems = [
  "Who is Self-Injectable Weight Management Treatment suitable for?",
  "What is Self-Injectable Weight Management Treatment and what is it used for?",
  "What is a GLP-1 Agonist?",
  "How does Self-Injectable Weight Management Treatment work?",
  "How long do I need to use a Self-Injectable Weight Management Treatment?",
  "How do you use Self-Injectable Weight Management Treatments?",
  "When should I take this medication?",
  "What dose of medication will I need to use?",
  "How long does it take this injectable medication to work?",
  "How much weight will I lose?",
  "Do I need a review after I start treatment?",
  "Can I use Self-Injectable Weight Management Treatments if I am trying to conceive, pregnant or breastfeeding?",
  "What are the potential side effects of this treatment?",
  "What will be included in my prescription?",
  "Will this medication affect my contraception?",
];

const journeySteps = [
  "Apply Online - Complete a secure questionnaire and upload your verified health details.",
  "Doctor Review - An Irish GP reviews your information for clinical suitability.",
  "Receive Prescription - If approved, it is sent directly to your chosen pharmacy, often the same day.",
  "Start Safely - Begin at a low dose, with clear instructions for gradual increase.",
  "Continue Confidently - Get follow-up support, repeat prescriptions, and lifestyle guidance after 16 weeks.",
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
            All treatment and continuation decisions are made by an Irish-registered doctor based on clinical
            suitability and safe prescribing standards.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function SelfInjectablePrescriptionPage() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [requestFor, setRequestFor] = useState("");
  const [ageBand, setAgeBand] = useState("");
  const [birthSex, setBirthSex] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [pregnancyStatus, setPregnancyStatus] = useState("");

  const [medicalConditions, setMedicalConditions] = useState("");
  const [medications, setMedications] = useState("");
  const [pancreatitisHistory, setPancreatitisHistory] = useState("");
  const [thyroidHistory, setThyroidHistory] = useState("");
  const [allergyHistory, setAllergyHistory] = useState("");

  const [dietExerciseReady, setDietExerciseReady] = useState("");
  const [injectionConfidence, setInjectionConfidence] = useState("");
  const [followUpCommitment, setFollowUpCommitment] = useState("");
  const [finalAccuracyConfirm, setFinalAccuracyConfirm] = useState(false);
  const [finalDoctorReviewConfirm, setFinalDoctorReviewConfirm] = useState(false);

  const optionButtonClass = (isSelected: boolean) =>
    `w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
      isSelected
        ? "border-primary bg-primary text-white"
        : "border-slate-200 bg-white text-dark-slate hover:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
    }`;

  const startQuestionnaire = () => {
    setShowQuestionnaire(true);
    setCurrentStep(1);
    setSubmitted(false);
    setTimeout(() => {
      document.getElementById("self-injectable-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const canGoNext =
    (currentStep === 1 &&
      requestFor &&
      ageBand &&
      birthSex &&
      heightCm.trim() &&
      weightKg.trim() &&
      (birthSex !== "Female" || pregnancyStatus)) ||
    (currentStep === 2 && medicalConditions && medications && pancreatitisHistory && thyroidHistory && allergyHistory) ||
    (currentStep === 3 && dietExerciseReady && injectionConfidence && followUpCommitment && finalAccuracyConfirm && finalDoctorReviewConfirm);

  const nextStep = () => {
    if (!canGoNext || currentStep >= 4) return;
    setCurrentStep((prev) => prev + 1);
    setTimeout(() => {
      document.getElementById("self-injectable-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const prevStep = () => {
    if (currentStep <= 1) return;
    setCurrentStep((prev) => prev - 1);
    setTimeout(() => {
      document.getElementById("self-injectable-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

    const submitForm = () => {
    beginPrescriptionCheckout({
      slug: 'self-injectable',
      serviceName: 'Self Injectable',
      payload: {
      requestFor,
      ageBand,
      birthSex,
      heightCm,
      weightKg,
      pregnancyStatus,
      medicalConditions,
      medications,
      pancreatitisHistory,
      thyroidHistory,
      allergyHistory,
      dietExerciseReady,
      injectionConfidence,
      followUpCommitment,
      finalAccuracyConfirm,
      finalDoctorReviewConfirm,
      },
    });
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSubmitted(false);
    setRequestFor("");
    setAgeBand("");
    setBirthSex("");
    setHeightCm("");
    setWeightKg("");
    setPregnancyStatus("");
    setMedicalConditions("");
    setMedications("");
    setPancreatitisHistory("");
    setThyroidHistory("");
    setAllergyHistory("");
    setDietExerciseReady("");
    setInjectionConfidence("");
    setFollowUpCommitment("");
    setFinalAccuracyConfirm(false);
    setFinalDoctorReviewConfirm(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <Navbar />
<main>
        {showQuestionnaire && (
          <section id="self-injectable-questionnaire" className="pt-28 pb-16">
            <div className="max-w-4xl mx-auto px-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-black uppercase tracking-wider text-primary">
                  {currentStep <= 3 ? "Suitability Assessment" : "Review & Submit"}
                </p>
                <p className="mt-3 text-sm font-bold text-slate-600">Step {currentStep} / 4</p>
                <h2 className="mt-2 text-3xl font-black text-dark-slate dark:text-white">Self-Injectable Weight Management Questionnaire</h2>

                {currentStep === 1 && (
                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">1. Who are you requesting treatment for?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setRequestFor("Myself")} className={optionButtonClass(requestFor === "Myself")}>Myself</button>
                        <button type="button" onClick={() => setRequestFor("Someone else")} className={optionButtonClass(requestFor === "Someone else")}>Someone else</button>
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">2. Select your age group</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => { setAgeBand("18-50"); setPregnancyStatus(""); }} className={optionButtonClass(ageBand === "18-50")}>18 to 50</button>
                        <button type="button" onClick={() => { setAgeBand("50+"); setPregnancyStatus(""); }} className={optionButtonClass(ageBand === "50+")}>Over 50</button>
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">3. Height (cm)</p>
                      <input
                        type="number"
                        value={heightCm}
                        onChange={(event) => setHeightCm(event.target.value)}
                        className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        placeholder="e.g. 170"
                      />
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">4. Current weight (kg)</p>
                      <input
                        type="number"
                        value={weightKg}
                        onChange={(event) => setWeightKg(event.target.value)}
                        className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        placeholder="e.g. 95"
                      />
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">5. What is your birth sex?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => setBirthSex("Female")}
                          className={optionButtonClass(birthSex === "Female")}
                        >
                          Female
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setBirthSex("Male");
                            setPregnancyStatus("");
                          }}
                          className={optionButtonClass(birthSex === "Male")}
                        >
                          Male
                        </button>
                      </div>
                    </div>
                    {birthSex === "Female" && (
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">6. Are you pregnant, trying to conceive, or breastfeeding?</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => setPregnancyStatus("Yes")} className={optionButtonClass(pregnancyStatus === "Yes")}>Yes</button>
                          <button type="button" onClick={() => setPregnancyStatus("No")} className={optionButtonClass(pregnancyStatus === "No")}>No</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">7. Do you have diabetes, high blood pressure, or high cholesterol?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setMedicalConditions("Yes")} className={optionButtonClass(medicalConditions === "Yes")}>Yes</button>
                        <button type="button" onClick={() => setMedicalConditions("No")} className={optionButtonClass(medicalConditions === "No")}>No</button>
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">8. Are you currently taking any regular medication?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setMedications("Yes")} className={optionButtonClass(medications === "Yes")}>Yes</button>
                        <button type="button" onClick={() => setMedications("No")} className={optionButtonClass(medications === "No")}>No</button>
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">9. Have you ever had pancreatitis?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setPancreatitisHistory("Yes")} className={optionButtonClass(pancreatitisHistory === "Yes")}>Yes</button>
                        <button type="button" onClick={() => setPancreatitisHistory("No")} className={optionButtonClass(pancreatitisHistory === "No")}>No</button>
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">10. Any personal or family history of medullary thyroid cancer?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setThyroidHistory("Yes")} className={optionButtonClass(thyroidHistory === "Yes")}>Yes</button>
                        <button type="button" onClick={() => setThyroidHistory("No")} className={optionButtonClass(thyroidHistory === "No")}>No</button>
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">11. Any allergy to GLP-1 medicines or injection ingredients?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setAllergyHistory("Yes")} className={optionButtonClass(allergyHistory === "Yes")}>Yes</button>
                        <button type="button" onClick={() => setAllergyHistory("No")} className={optionButtonClass(allergyHistory === "No")}>No</button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">12. Are you prepared to combine treatment with diet and activity changes?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setDietExerciseReady("Yes")} className={optionButtonClass(dietExerciseReady === "Yes")}>Yes</button>
                        <button type="button" onClick={() => setDietExerciseReady("No")} className={optionButtonClass(dietExerciseReady === "No")}>No</button>
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">13. Are you confident using a once-weekly injection device after training?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setInjectionConfidence("Yes")} className={optionButtonClass(injectionConfidence === "Yes")}>Yes</button>
                        <button type="button" onClick={() => setInjectionConfidence("No")} className={optionButtonClass(injectionConfidence === "No")}>No</button>
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">14. Do you agree to follow-up review requirements before repeat prescriptions?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setFollowUpCommitment("Yes")} className={optionButtonClass(followUpCommitment === "Yes")}>Yes</button>
                        <button type="button" onClick={() => setFollowUpCommitment("No")} className={optionButtonClass(followUpCommitment === "No")}>No</button>
                      </div>
                    </div>
                    <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/40">
                      <input
                        type="checkbox"
                        checked={finalAccuracyConfirm}
                        onChange={(event) => setFinalAccuracyConfirm(event.target.checked)}
                        className="mt-1 h-4 w-4 accent-primary"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        I confirm the information I provided is true and complete.
                      </span>
                    </label>
                    <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/40">
                      <input
                        type="checkbox"
                        checked={finalDoctorReviewConfirm}
                        onChange={(event) => setFinalDoctorReviewConfirm(event.target.checked)}
                        className="mt-1 h-4 w-4 accent-primary"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        I understand prescriptions are issued only if clinically suitable after doctor review.
                      </span>
                    </label>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="mt-8">
                    <div className="rounded-2xl border border-green-200 bg-green-50 p-5 dark:border-green-900/30 dark:bg-green-900/20">
                      <p className="text-lg font-black text-green-800 dark:text-green-300">Questionnaire submitted.</p>
                      <p className="mt-2 text-sm text-green-700 dark:text-green-200">
                        Thank you. Your request will be reviewed by an Irish-registered doctor.
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-10 flex flex-wrap items-center gap-3">
                  {currentStep > 1 && currentStep <= 3 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-black text-slate-700 transition hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-200"
                    >
                      Back
                    </button>
                  )}

                  {currentStep < 3 && (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!canGoNext}
                      className="rounded-xl bg-primary px-5 py-3 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:bg-primary/50"
                    >
                      Next
                    </button>
                  )}

                  {currentStep === 3 && (
                    <button
                      type="button"
                      onClick={submitForm}
                      disabled={!canGoNext}
                      className="rounded-xl bg-primary px-5 py-3 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:bg-primary/50"
                    >
                      Submit
                    </button>
                  )}

                  {currentStep === 4 && submitted && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-black text-slate-700 transition hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-200"
                    >
                      Start again
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-black uppercase mb-6">
                Online Prescription
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-dark-slate dark:text-white leading-tight">
                Self-Injectable <span className="text-primary">Weight Management Prescription</span>
              </h1>
              <ul className="mt-6 space-y-3">
                {[
                  "Reviewed by Irish-registered GPs.",
                  "Choose your preferred medicine in the process.",
                  "Sent directly to your local pharmacy for collection.",
                  "From EUR50, available nationwide.",
                  "Same-day review - most prescriptions approved within hours.",
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
              <div className="space-y-3">
                {[
                  { label: "Request Treatment", price: "EUR50", active: true, href: "#" },
                  { label: "Book a Weight Mgmt Consultation", price: "EUR90", active: false, href: "/consultation" },
                ].map((item) => (
                  item.active ? (
                    <button
                      key={item.label}
                      type="button"
                      onClick={startQuestionnaire}
                      className="block w-full p-4 rounded-2xl border text-left transition-all bg-primary text-white border-primary"
                    >
                      <p className="font-black text-white">{item.label}</p>
                      <p className="text-sm font-bold mt-1 text-white/90">{item.price}</p>
                    </button>
                  ) : (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="block w-full p-4 rounded-2xl border text-left transition-all bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-primary"
                    >
                      <p className="font-black text-dark-slate dark:text-white">{item.label}</p>
                      <p className="text-sm font-bold mt-1 text-primary">{item.price}</p>
                    </Link>
                  )
                ))}
              </div>

              <div className="mt-5 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">From</p>
                <p className="text-3xl font-black text-primary mt-1">EUR50</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-dark-slate text-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-center">How it works</h2>
            <p className="text-slate-300 text-center mt-3 max-w-3xl mx-auto">
              Requesting a prescription online could not be easier with Webdoctor.ie. This service is available for
              selected medications shown in the questionnaire.
            </p>
            <p className="text-slate-300 text-center mt-2">If you are unsure, you can book a GP video consultation.</p>

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
                  desc: "If approved, your prescription is sent within minutes to your chosen Irish pharmacy via Healthmail.",
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
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-center">Your Weight Management Journey with Webdoctor.ie</h2>
            <p className="text-slate-600 dark:text-slate-400 text-center mt-3 max-w-4xl mx-auto">
              Our self-injectable prescription helps adults living with obesity achieve gradual, sustainable weight
              management. It works best alongside a balanced diet and regular physical activity.
            </p>

            <div className="grid lg:grid-cols-2 gap-8 mt-10">
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <ul className="space-y-3">
                  {[
                    "Prescribed by Irish-registered doctors.",
                    "Clinically reviewed for suitability and safety.",
                    "May be continued long-term for lasting results.",
                    "Every request is assessed by a Webdoctor.ie GP to ensure it is safe and appropriate for you.",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                      <p className="text-sm text-slate-700 dark:text-slate-300">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-black mb-4">Your Weight Management Journey</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  We guide you through every stage, from first application to long-term care.
                </p>
                <ol className="space-y-3">
                  {journeySteps.map((step) => (
                    <li key={step} className="text-sm text-slate-700 dark:text-slate-300">
                      {step}
                    </li>
                  ))}
                </ol>
                <p className="text-sm font-bold text-primary mt-5">
                  Our goal: help you manage weight safely, and maintain it for good.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-black text-center">Ongoing Support from Webdoctor.ie</h2>
            <p className="text-slate-600 dark:text-slate-400 text-center mt-3">
              Your care does not end with your prescription. We support your full journey.
            </p>
            <div className="mt-8 p-8 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <ul className="space-y-3">
                {[
                  "Guidance on safe self-injection techniques.",
                  "Access to nutrition and lifestyle advice.",
                  "Regular webinars on sleep, stress, diet, and exercise.",
                  "Secure messaging with your GP (Mon-Fri, 9 a.m.-5:30 p.m.).",
                  "Repeat prescriptions may be available after 16 weeks if clinically suitable.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-700 dark:text-slate-300">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-black text-center">Important Medical Information</h2>
            <div className="mt-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 px-6">
              {faqItems.map((item) => (
                <AccordionItem key={item} question={item} />
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

