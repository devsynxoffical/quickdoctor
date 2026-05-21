"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  Heart,
  Pill,
  ShieldCheck,
  Users,
} from "lucide-react";

const faqs = [
  "Who is this service for?",
  "What is the Oral Contraceptive Pill?",
  "What is the Contraceptive Patch?",
  "What is the Contraceptive Ring?",
  "What potential side effects may be caused by the hormones oestrogen and progesterone?",
  "Do contraceptive pills/ rings/ patches protect against sexually transmitted infections (STIs)?",
  "Can other medications interact with the contraceptive pill/ patch/ ring?",
  "Important Safety Information",
];

const combinedPills = [
  "Elvina",
  "Elvinette*",
  "Freedo",
  "Freedonel*",
  "Leonore*",
  "Logynon*",
  "Marviol",
  "Mercilon*",
  "Microlite*",
  "Minulet",
  "Ovranette",
  "Ovreena",
  "Qlaira",
  "Violite*",
  "Yasmin",
  "Yasminelle*",
  "Yaz*",
  "Zoely",
];

type ContraceptiveType = "progestogen" | "combined" | "evra" | "nuvaring" | "not-sure" | "";

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
            Please consult your doctor for personalized guidance. Final clinical decisions are made after reviewing your questionnaire and medical history.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ContraceptivePage() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [step, setStep] = useState(1);
  const [patientFor, setPatientFor] = useState("");
  const [birthSex, setBirthSex] = useState("");
  const [age, setAge] = useState("");
  const [pregnant, setPregnant] = useState("");
  const [understandIrelandOnly, setUnderstandIrelandOnly] = useState(false);
  const [understandBp, setUnderstandBp] = useState(false);
  const [contraceptiveType, setContraceptiveType] = useState<ContraceptiveType>("");
  const [pillOption, setPillOption] = useState("");
  const [currentlyUsing, setCurrentlyUsing] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [smokerStatus, setSmokerStatus] = useState("");
  const [migraineAura, setMigraineAura] = useState("");
  const [bpWhen, setBpWhen] = useState("");
  const [bpSys, setBpSys] = useState("");
  const [bpDia, setBpDia] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [confirmTrue, setConfirmTrue] = useState(false);
  const [confirmTerms, setConfirmTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const canContinueStep1 = !!patientFor;
  const canContinueStep2 = !!birthSex && !!age && !!pregnant && understandIrelandOnly && understandBp;
  const step3NeedsSpecificPill = contraceptiveType === "progestogen" || contraceptiveType === "combined";
  const canContinueStep3 =
    !!contraceptiveType &&
    (contraceptiveType === "not-sure" || (!!currentlyUsing && (!step3NeedsSpecificPill || !!pillOption)));
  const canContinueStep4 = !!medicalHistory && !!smokerStatus && !!migraineAura;
  const canContinueStep5 = !!bpWhen && !!bpSys && !!bpDia;
  const canContinueStep6 = !!heightCm && !!weightKg;
  const canContinueStep7 = confirmTrue && confirmTerms;

  const handleStartQuestionnaire = () => {
    setShowQuestionnaire(true);
    setStep(1);
    setPatientFor("");
    setBirthSex("");
    setAge("");
    setPregnant("");
    setUnderstandIrelandOnly(false);
    setUnderstandBp(false);
    setContraceptiveType("");
    setPillOption("");
    setCurrentlyUsing("");
    setMedicalHistory("");
    setSmokerStatus("");
    setMigraineAura("");
    setBpWhen("");
    setBpSys("");
    setBpDia("");
    setHeightCm("");
    setWeightKg("");
    setConfirmTrue(false);
    setConfirmTerms(false);
    setSubmitted(false);
    document.getElementById("questionnaire")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <Navbar />

      <div className="pt-24 bg-primary/5 border-y border-primary/10 py-3 px-6 text-center">
        <p className="text-sm font-bold text-primary">A healthier year starts now. Check your BMI and access medical weight care from â‚¬50.</p>
      </div>

      <main>
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-black uppercase mb-6">
                <Pill className="w-4 h-4" />
                Online Prescription
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-dark-slate dark:text-white leading-tight">
                Contraceptive Pill, <span className="text-primary">Patch or Ring</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-6 leading-relaxed">
                Reviewed by Irish-registered GPs. Choose your preferred method: pill, patch, or ring. Sent directly to
                your local pharmacy for collection.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Reviewed by Irish-registered GPs",
                  "Choose your preferred method: pill, patch, or ring",
                  "Sent directly to your local pharmacy for collection",
                  "From â‚¬25, available nationwide",
                  "Same-day review â€” most prescriptions approved within hours",
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
                <button
                  type="button"
                  onClick={handleStartQuestionnaire}
                  className="block w-full p-4 rounded-2xl border text-left transition-all bg-primary text-white border-primary"
                >
                  <p className="font-black text-white">Request Prescription</p>
                  <p className="text-sm font-bold mt-1 text-white/90">â‚¬25</p>
                </button>
                <Link
                  href="/consultation"
                  className="block w-full p-4 rounded-2xl border text-left transition-all bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-primary"
                >
                  <p className="font-black text-dark-slate dark:text-white">Online Consultation</p>
                  <p className="text-sm font-bold mt-1 text-primary">â‚¬39+</p>
                </Link>
              </div>
              <button
                onClick={handleStartQuestionnaire}
                className="w-full mt-6 px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2"
              >
                Request Prescription - â‚¬25 <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {showQuestionnaire && (
          <section id="questionnaire" className="pb-10">
            <div className="max-w-4xl mx-auto px-6">
              <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8">
                <p className="text-sm font-bold text-primary">Step {step} / 7</p>
                <h2 className="text-3xl font-black mt-2 text-dark-slate dark:text-white">
                  {step === 1
                    ? "Patient selection"
                    : step === 2
                    ? "Suitability Check"
                    : step === 3
                    ? "Contraceptive Details"
                    : step === 4
                    ? "Medical History"
                    : step === 5
                    ? "Blood Pressure"
                    : step === 6
                    ? "Physical Details"
                    : "Consent"}
                </h2>
                <p className="text-slate-500 mt-2">
                  This questionnaire is an important part of your assessment today. We ask that you are honest with your answers.
                </p>

                {step === 1 && (
                  <div className="mt-8">
                    <p className="font-bold text-dark-slate dark:text-white">1. Who are you requesting this treatment for?</p>
                    <p className="text-sm text-slate-500 mt-2">
                      If approved, this prescription will be issued in the name of this account holder.
                    </p>
                    <div className="grid sm:grid-cols-3 gap-3 mt-4">
                      {["For myself", "For a child", "For someone else"].map((item) => (
                        <button
                          key={item}
                          onClick={() => setPatientFor(item)}
                          className={`p-3 rounded-xl border text-sm font-bold ${
                            patientFor === item ? "border-primary bg-primary/10 text-primary" : "border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">1. What is your birth sex?</p>
                      <p className="text-sm text-slate-500 mt-1">We ask this to make sure the treatment is medically safe for you.</p>
                      <div className="flex gap-3 mt-3">
                        {["Female", "Male"].map((item) => (
                          <button
                            key={item}
                            onClick={() => setBirthSex(item)}
                            className={`px-4 py-2 rounded-xl border text-sm font-bold ${
                              birthSex === item ? "border-primary bg-primary/10 text-primary" : "border-slate-200 dark:border-slate-700"
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">2. What is your age?</p>
                      <input
                        value={age}
                        onChange={(e) => setAge(e.target.value.replace(/\D/g, ""))}
                        placeholder="Enter your age"
                        className="mt-2 w-full md:w-56 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">3. Are you currently pregnant, possibly pregnant, or within 12 weeks after giving birth?</p>
                      <div className="flex gap-3 mt-3">
                        {["Yes", "No"].map((item) => (
                          <button
                            key={item}
                            onClick={() => setPregnant(item)}
                            className={`px-4 py-2 rounded-xl border text-sm font-bold ${
                              pregnant === item ? "border-primary bg-primary/10 text-primary" : "border-slate-200 dark:border-slate-700"
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-4 border border-slate-200 dark:border-slate-700">
                      <p className="font-bold text-dark-slate dark:text-white">4. Available methods through this service</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        We can only prescribe pills, patches and vaginal rings available in Ireland. Not available: injection, implant, coil (IUD/IUS), Dianette.
                      </p>
                      <button
                        onClick={() => setUnderstandIrelandOnly((v) => !v)}
                        className={`mt-3 px-4 py-2 rounded-xl border text-sm font-bold ${
                          understandIrelandOnly ? "border-primary bg-primary/10 text-primary" : "border-slate-300 dark:border-slate-700"
                        }`}
                      >
                        I understand
                      </button>
                    </div>
                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-4 border border-slate-200 dark:border-slate-700">
                      <p className="font-bold text-dark-slate dark:text-white">5. Recent blood pressure reading required</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        We need a blood pressure reading from the past 12 months for safety.
                      </p>
                      <button
                        onClick={() => setUnderstandBp((v) => !v)}
                        className={`mt-3 px-4 py-2 rounded-xl border text-sm font-bold ${
                          understandBp ? "border-primary bg-primary/10 text-primary" : "border-slate-300 dark:border-slate-700"
                        }`}
                      >
                        I understand
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">1. What type of contraceptive would you like a prescription for?</p>
                      <div className="grid sm:grid-cols-2 gap-3 mt-3">
                        {[
                          { id: "progestogen", label: "Progestogen-only pill (Azalia, Cerazette or Noriday)" },
                          { id: "combined", label: "Combined contraceptive pill" },
                          { id: "evra", label: "Evra patch" },
                          { id: "nuvaring", label: "Nuvaring" },
                          { id: "not-sure", label: "I'm not sure" },
                        ].map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setContraceptiveType(item.id as ContraceptiveType);
                              setPillOption("");
                            }}
                            className={`p-3 rounded-xl border text-sm font-bold text-left ${
                              contraceptiveType === item.id ? "border-primary bg-primary/10 text-primary" : "border-slate-200 dark:border-slate-700"
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {contraceptiveType === "progestogen" && (
                      <div>
                        <p className="font-bold text-dark-slate dark:text-white">2. Select a progestogen-only pill</p>
                        <div className="grid sm:grid-cols-3 gap-3 mt-3">
                          {["Azalia", "Cerazette", "Noriday"].map((name) => (
                            <button
                              key={name}
                              onClick={() => setPillOption(name)}
                              className={`p-3 rounded-xl border text-sm font-bold ${
                                pillOption === name ? "border-primary bg-primary/10 text-primary" : "border-slate-200 dark:border-slate-700"
                              }`}
                            >
                              {name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {contraceptiveType === "combined" && (
                      <div>
                        <p className="font-bold text-dark-slate dark:text-white">2. Select a combined contraceptive pill</p>
                        <p className="text-sm text-slate-500 mt-1">Low oestrogen options are marked with an asterisk (*). Dianette is not available.</p>
                        <div className="grid sm:grid-cols-3 gap-2 mt-3 max-h-56 overflow-auto pr-1">
                          {combinedPills.map((name) => (
                            <button
                              key={name}
                              onClick={() => setPillOption(name)}
                              className={`p-2.5 rounded-lg border text-xs font-bold text-left ${
                                pillOption === name ? "border-primary bg-primary/10 text-primary" : "border-slate-200 dark:border-slate-700"
                              }`}
                            >
                              {name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {contraceptiveType === "not-sure" ? (
                      <div className="rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 p-4">
                        <p className="font-bold text-amber-800 dark:text-amber-400">THIS SERVICE IS UNSUITABLE</p>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                          Please book a video consultation with one of our GPs to discuss suitable options.
                        </p>
                        <button className="mt-3 px-4 py-2 rounded-xl border border-amber-300 text-amber-800 dark:text-amber-300 text-sm font-bold">
                          I understand
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="font-bold text-dark-slate dark:text-white">3. Are you currently using the contraceptive you have requested?</p>
                        <div className="grid sm:grid-cols-2 gap-3 mt-3">
                          {[
                            "Yes",
                            "No - I stopped, want to restart",
                            "No - first time using it",
                            "No - never used any contraception",
                          ].map((item) => (
                            <button
                              key={item}
                              onClick={() => setCurrentlyUsing(item)}
                              className={`p-3 rounded-xl border text-sm font-bold text-left ${
                                currentlyUsing === item ? "border-primary bg-primary/10 text-primary" : "border-slate-200 dark:border-slate-700"
                              }`}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {step === 4 && (
                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">1. Do you have any significant medical history we should know about?</p>
                      <div className="grid sm:grid-cols-2 gap-3 mt-3">
                        {["Yes", "No"].map((item) => (
                          <button key={item} onClick={() => setMedicalHistory(item)} className={`p-3 rounded-xl border text-sm font-bold ${medicalHistory === item ? "border-primary bg-primary/10 text-primary" : "border-slate-200 dark:border-slate-700"}`}>{item}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">2. Do you currently smoke?</p>
                      <div className="grid sm:grid-cols-2 gap-3 mt-3">
                        {["Yes", "No"].map((item) => (
                          <button key={item} onClick={() => setSmokerStatus(item)} className={`p-3 rounded-xl border text-sm font-bold ${smokerStatus === item ? "border-primary bg-primary/10 text-primary" : "border-slate-200 dark:border-slate-700"}`}>{item}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">3. Do you experience migraine with aura?</p>
                      <div className="grid sm:grid-cols-2 gap-3 mt-3">
                        {["Yes", "No"].map((item) => (
                          <button key={item} onClick={() => setMigraineAura(item)} className={`p-3 rounded-xl border text-sm font-bold ${migraineAura === item ? "border-primary bg-primary/10 text-primary" : "border-slate-200 dark:border-slate-700"}`}>{item}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">1. When was your blood pressure last checked?</p>
                      <div className="grid sm:grid-cols-2 gap-3 mt-3">
                        {["Within last 6 months", "More than 6 months ago", "Not sure"].map((item) => (
                          <button key={item} onClick={() => setBpWhen(item)} className={`p-3 rounded-xl border text-sm font-bold ${bpWhen === item ? "border-primary bg-primary/10 text-primary" : "border-slate-200 dark:border-slate-700"}`}>{item}</button>
                        ))}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <p className="font-bold text-dark-slate dark:text-white">2. Systolic</p>
                        <input value={bpSys} onChange={(e) => setBpSys(e.target.value.replace(/\D/g, ""))} placeholder="e.g. 120" className="mt-2 w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent" />
                      </div>
                      <div>
                        <p className="font-bold text-dark-slate dark:text-white">3. Diastolic</p>
                        <input value={bpDia} onChange={(e) => setBpDia(e.target.value.replace(/\D/g, ""))} placeholder="e.g. 80" className="mt-2 w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent" />
                      </div>
                    </div>
                  </div>
                )}

                {step === 6 && (
                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">1. Height (cm)</p>
                      <input value={heightCm} onChange={(e) => setHeightCm(e.target.value.replace(/\D/g, ""))} placeholder="Enter cm" className="mt-2 w-full md:w-56 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent" />
                    </div>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">2. Weight (kg)</p>
                      <input value={weightKg} onChange={(e) => setWeightKg(e.target.value.replace(/\D/g, ""))} placeholder="Enter kg" className="mt-2 w-full md:w-56 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent" />
                    </div>
                  </div>
                )}

                {step === 7 && (
                  <div className="mt-8 space-y-7">
                    {submitted ? (
                      <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6">
                        <p className="text-2xl font-black text-emerald-900">Request submitted</p>
                        <p className="mt-2 text-sm text-emerald-900">Your contraceptive request has been submitted for doctor review.</p>
                      </div>
                    ) : (
                      <>
                        <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/40 p-4 border border-slate-200 dark:border-slate-700">
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            Please confirm your information is accurate and that you agree to proceed under Webdoctor.ie terms.
                          </p>
                        </div>
                        <button onClick={() => setConfirmTrue((v) => !v)} className={`w-full p-3 rounded-xl border text-sm font-bold text-left ${confirmTrue ? "border-primary bg-primary/10 text-primary" : "border-slate-200 dark:border-slate-700"}`}>
                          I confirm my answers are complete and accurate
                        </button>
                        <button onClick={() => setConfirmTerms((v) => !v)} className={`w-full p-3 rounded-xl border text-sm font-bold text-left ${confirmTerms ? "border-primary bg-primary/10 text-primary" : "border-slate-200 dark:border-slate-700"}`}>
                          I agree to Webdoctor.ie Terms & Conditions
                        </button>
                      </>
                    )}
                  </div>
                )}

                <div className="mt-8 flex items-center justify-between">
                  <button
                    onClick={() => setStep((s) => Math.max(1, s - 1))}
                    disabled={step === 1}
                    className="px-5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold disabled:opacity-40"
                  >
                    Back
                  </button>
                  {step < 7 ? (
                    <button
                      onClick={() => setStep((s) => Math.min(7, s + 1))}
                      disabled={
                        (step === 1 && !canContinueStep1) ||
                        (step === 2 && !canContinueStep2) ||
                        (step === 3 && !canContinueStep3) ||
                        (step === 4 && !canContinueStep4) ||
                        (step === 5 && !canContinueStep5) ||
                        (step === 6 && !canContinueStep6)
                      }
                      className="px-6 py-2 rounded-xl bg-primary text-white font-bold disabled:opacity-40"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={() => setSubmitted(true)}
                      disabled={!canContinueStep7 || submitted}
                      className="px-6 py-2 rounded-xl bg-primary text-white font-bold disabled:opacity-40"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-center">Treatments that we can provide</h2>
            <p className="text-slate-600 dark:text-slate-400 text-center mt-4 max-w-4xl mx-auto leading-relaxed">
              We issue 6-month prescriptions for contraceptive products (pills, patches and rings) that are available in
              Ireland. Once your request has been approved by a doctor, we send your prescription directly to an Irish
              pharmacy of your choice via Healthmail for pickup and payment.
            </p>
            <div className="mt-5 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 p-4 max-w-4xl mx-auto">
              <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
                We are not able to provide prescriptions for long-acting reversible contraceptives (LARCs), such as
                contraceptive injections, implants or coils, via this service.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-center">How it works</h2>
            <p className="text-slate-500 text-center mt-3">Requesting a prescription online could not be easier with Webdoctor.ie.</p>
            <div className="grid md:grid-cols-3 gap-6 mt-10">
              {[
                { step: "Step 1", icon: FileText, title: "Online Questionnaire", desc: "Complete a secure questionnaire and answer all questions accurately." },
                { step: "Step 2", icon: Clock, title: "Medical Review", desc: "An Irish-registered doctor reviews your request using clinical standards." },
                { step: "Step 3", icon: CheckCircle2, title: "Prescription Sent", desc: "If approved, your prescription is sent to your chosen pharmacy in minutes." },
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
                { title: "Confidential", icon: Heart, desc: "Same confidentiality as in-person care." },
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

