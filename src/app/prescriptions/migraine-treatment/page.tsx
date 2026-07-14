"use client";

import React, { useState } from "react";
import { beginPrescriptionCheckout } from '@/lib/serviceCheckout';
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2, ChevronDown, Clock, ShieldCheck, Users, XCircle } from "lucide-react";

const faqItems = [
  "Who is this service for?",
  "Who is this service not suitable for?",
  "What is a migraine?",
  "How long do migraine headaches last?",
  "How frequently do migraines occur?",
  "Are there different types of migraine?",
  "What causes migraines?",
  "What treatments are there for acute migraine attacks?",
  "What is the best painkiller for an acute migraine attack?",
  "What is a medication overuse headache?",
  "What are triptans?",
  "What are the side effects of triptans?",
  "How do you use triptan medication for acute migraine episodes?",
  "What are anti-sickness medications?",
  "Can I use this service if I am pregnant or breastfeeding?",
  "Are there other things I can do to help with migraine symptoms?",
  "Are there other things I should know about migraine?",
];

const excludedItems = [
  "You had your first migraine in the last 12 months.",
  "Your migraine episodes began after you turned 50 years of age.",
  "Your migraine symptoms have changed recently.",
  "You have cardiovascular disease (heart disease, heart attack, angina, Prinzmetal's angina, stroke/TIA, peripheral vascular disease, or high blood pressure).",
  "You have epilepsy or have ever had a seizure.",
  "You have liver or kidney disease.",
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

export default function MigraineTreatmentPage() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [birthSex, setBirthSex] = useState("");
  const [pregnantOrBreastfeeding, setPregnantOrBreastfeeding] = useState("");
  const [age, setAge] = useState("");
  const [forAnotherPerson, setForAnotherPerson] = useState("");
  const [diagnosedMigraineBefore, setDiagnosedMigraineBefore] = useState("");
  const [requestingExcludedMeds, setRequestingExcludedMeds] = useState("");
  const [firstMigrainePastSixMonths, setFirstMigrainePastSixMonths] = useState("");
  const [migraineFrequency, setMigraineFrequency] = useState("");
  const [currentSymptoms, setCurrentSymptoms] = useState<string[]>([]);
  const [otherSymptoms, setOtherSymptoms] = useState("");
  const [currentMedication, setCurrentMedication] = useState("");
  const [medicationAllergies, setMedicationAllergies] = useState("");
  const [heartOrStrokeHistory, setHeartOrStrokeHistory] = useState("");
  const [liverOrKidneyProblems, setLiverOrKidneyProblems] = useState("");
  const [safeToTreatAtHome, setSafeToTreatAtHome] = useState("");
  const [consentAccurateInfo, setConsentAccurateInfo] = useState("");
  const [consentOwnUseOnly, setConsentOwnUseOnly] = useState("");

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
      document.getElementById("migraine-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const showPregnancyQuestion = birthSex === "Female";
  const stepTitle =
    currentStep === 1
      ? "SUITABILITY"
      : currentStep === 2
      ? "MIGRAINE DETAILS"
      : currentStep === 3
      ? "MEDICATION"
      : currentStep === 4
      ? "MEDICAL HISTORY"
      : currentStep === 5
      ? "SAFETY CHECK"
      : "CONFIRMATION";

  const hasOtherSymptoms = currentSymptoms.includes("Other");

  const canGoNext =
    (currentStep === 1 &&
      birthSex &&
      (!showPregnancyQuestion || pregnantOrBreastfeeding) &&
      age.trim().length > 0 &&
      forAnotherPerson &&
      diagnosedMigraineBefore &&
      requestingExcludedMeds &&
      firstMigrainePastSixMonths) ||
    (currentStep === 2 &&
      migraineFrequency &&
      currentSymptoms.length > 0 &&
      (!hasOtherSymptoms || otherSymptoms.trim().length > 0)) ||
    (currentStep === 3 && currentMedication.trim().length > 0 && medicationAllergies) ||
    (currentStep === 4 && heartOrStrokeHistory && liverOrKidneyProblems) ||
    (currentStep === 5 && safeToTreatAtHome) ||
    (currentStep === 6 && consentAccurateInfo && consentOwnUseOnly);

  const canSubmit = currentStep === 6 && consentAccurateInfo === "Yes" && consentOwnUseOnly === "Yes";

  const toggleSymptom = (value: string) => {
    setCurrentSymptoms((prev) => {
      if (prev.includes(value)) {
        const next = prev.filter((item) => item !== value);
        if (value === "Other") setOtherSymptoms("");
        return next;
      }
      return [...prev, value];
    });
  };

  const nextStep = () => {
    if (!canGoNext || currentStep >= 6) return;
    setCurrentStep((prev) => prev + 1);
    setTimeout(() => {
      document.getElementById("migraine-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const prevStep = () => {
    if (currentStep <= 1) return;
    setCurrentStep((prev) => prev - 1);
    setTimeout(() => {
      document.getElementById("migraine-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

    const submitQuestionnaire = () => {
    if (!canSubmit) return;
    beginPrescriptionCheckout({
      slug: 'migraine-treatment',
      serviceName: 'Migraine Treatment',
      payload: {
      birthSex,
      pregnantOrBreastfeeding,
      age,
      forAnotherPerson,
      diagnosedMigraineBefore,
      requestingExcludedMeds,
      firstMigrainePastSixMonths,
      migraineFrequency,
      currentSymptoms,
      otherSymptoms,
      currentMedication,
      medicationAllergies,
      heartOrStrokeHistory,
      liverOrKidneyProblems,
      safeToTreatAtHome,
      consentAccurateInfo,
      consentOwnUseOnly,
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <Navbar />
<main>
        {showQuestionnaire && (
          <section id="migraine-questionnaire" className="pt-28 pb-16">
            <div className="max-w-4xl mx-auto px-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Step {currentStep} / 6</p>
                <h2 className="mt-2 text-3xl font-black text-dark-slate dark:text-white">{stepTitle}</h2>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                  In this section you will answer questions to see if you are suitable for this treatment. Please note: If you
                  would like to speak to a GP, please book a video consultation.
                </p>

                {currentStep === 1 && <div className="mt-8 space-y-7">
                  <div>
                    <p className="font-black text-dark-slate dark:text-white">1. What is your birth sex?</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      <button
                        type="button"
                        onClick={() => {
                          setBirthSex("Male");
                          setPregnantOrBreastfeeding("No, I am not");
                        }}
                        className={optionButtonClass(birthSex === "Male")}
                      >
                        Male
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setBirthSex("Female");
                          setPregnantOrBreastfeeding("");
                        }}
                        className={optionButtonClass(birthSex === "Female")}
                      >
                        Female
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setBirthSex("Other");
                          setPregnantOrBreastfeeding("No, I am not");
                        }}
                        className={optionButtonClass(birthSex === "Other")}
                      >
                        Other
                      </button>
                    </div>
                  </div>

                  {showPregnancyQuestion && (
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">2. Are you currently pregnant or are you breastfeeding?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => setPregnantOrBreastfeeding("Yes, I am")}
                          className={optionButtonClass(pregnantOrBreastfeeding === "Yes, I am")}
                        >
                          Yes, I am
                        </button>
                        <button
                          type="button"
                          onClick={() => setPregnantOrBreastfeeding("No, I am not")}
                          className={optionButtonClass(pregnantOrBreastfeeding === "No, I am not")}
                        >
                          No, I am not
                        </button>
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="font-black text-dark-slate dark:text-white">{showPregnancyQuestion ? "3" : "2"}. What is your age?</p>
                    <input
                      value={age}
                      onChange={(event) => setAge(event.target.value.replace(/[^0-9]/g, ""))}
                      inputMode="numeric"
                      placeholder="Enter your age"
                      className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <p className="font-black text-dark-slate dark:text-white">
                      {showPregnancyQuestion ? "4" : "3"}. Are you looking to use the service for another adult or child in your care?
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setForAnotherPerson("Yes, I am")}
                        className={optionButtonClass(forAnotherPerson === "Yes, I am")}
                      >
                        Yes, I am
                      </button>
                      <button
                        type="button"
                        onClick={() => setForAnotherPerson("No, I am not")}
                        className={optionButtonClass(forAnotherPerson === "No, I am not")}
                      >
                        No, I am not
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="font-black text-dark-slate dark:text-white">
                      {showPregnancyQuestion ? "5" : "4"}. Have you been diagnosed with Migraine by a doctor in the past?
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setDiagnosedMigraineBefore("Yes, I have")}
                        className={optionButtonClass(diagnosedMigraineBefore === "Yes, I have")}
                      >
                        Yes, I have
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiagnosedMigraineBefore("No, I haven't")}
                        className={optionButtonClass(diagnosedMigraineBefore === "No, I haven't")}
                      >
                        No, I haven&apos;t
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="font-black text-dark-slate dark:text-white">
                      {showPregnancyQuestion ? "6" : "5"}. Are you looking for a prescription for opiates, topiramate, gabapentin or ergotamine?
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setRequestingExcludedMeds("Yes, I am")}
                        className={optionButtonClass(requestingExcludedMeds === "Yes, I am")}
                      >
                        Yes, I am
                      </button>
                      <button
                        type="button"
                        onClick={() => setRequestingExcludedMeds("No, I am not")}
                        className={optionButtonClass(requestingExcludedMeds === "No, I am not")}
                      >
                        No, I am not
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="font-black text-dark-slate dark:text-white">
                      {showPregnancyQuestion ? "7" : "6"}. Did you have your first migraine in the past 6 months?
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setFirstMigrainePastSixMonths("Yes, I did")}
                        className={optionButtonClass(firstMigrainePastSixMonths === "Yes, I did")}
                      >
                        Yes, I did
                      </button>
                      <button
                        type="button"
                        onClick={() => setFirstMigrainePastSixMonths("No, I did not")}
                        className={optionButtonClass(firstMigrainePastSixMonths === "No, I did not")}
                      >
                        No, I did not
                      </button>
                    </div>
                  </div>
                </div>}

                {currentStep === 2 && (
                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">1. How often do you experience migraine attacks?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {["Less than once a month", "1-3 times a month", "Weekly", "More than once a week"].map((item) => (
                          <button key={item} type="button" onClick={() => setMigraineFrequency(item)} className={optionButtonClass(migraineFrequency === item)}>
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="font-black text-dark-slate dark:text-white">2. Which symptoms do you currently have with migraine?</p>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Select all that apply.</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {["Nausea", "Vomiting", "Light sensitivity", "Sound sensitivity", "Visual aura", "Other"].map((item) => (
                          <button key={item} type="button" onClick={() => toggleSymptom(item)} className={optionButtonClass(currentSymptoms.includes(item))}>
                            {item}
                          </button>
                        ))}
                      </div>
                      {hasOtherSymptoms && (
                        <textarea
                          value={otherSymptoms}
                          onChange={(event) => setOtherSymptoms(event.target.value)}
                          className="mt-3 min-h-[100px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                          placeholder="Please provide additional symptom details"
                        />
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">1. What migraine treatment are you currently using?</p>
                      <textarea
                        value={currentMedication}
                        onChange={(event) => setCurrentMedication(event.target.value)}
                        className="mt-3 min-h-[110px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        placeholder="List current or recent migraine medication"
                      />
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">2. Do you have any medication allergies?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setMedicationAllergies("Yes")} className={optionButtonClass(medicationAllergies === "Yes")}>Yes</button>
                        <button type="button" onClick={() => setMedicationAllergies("No")} className={optionButtonClass(medicationAllergies === "No")}>No</button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">1. Do you have any history of heart attack, stroke, TIA or uncontrolled blood pressure?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setHeartOrStrokeHistory("Yes")} className={optionButtonClass(heartOrStrokeHistory === "Yes")}>Yes</button>
                        <button type="button" onClick={() => setHeartOrStrokeHistory("No")} className={optionButtonClass(heartOrStrokeHistory === "No")}>No</button>
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">2. Do you have liver or kidney disease?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setLiverOrKidneyProblems("Yes")} className={optionButtonClass(liverOrKidneyProblems === "Yes")}>Yes</button>
                        <button type="button" onClick={() => setLiverOrKidneyProblems("No")} className={optionButtonClass(liverOrKidneyProblems === "No")}>No</button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">1. Are your symptoms stable and similar to your previous migraine episodes?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setSafeToTreatAtHome("Yes")} className={optionButtonClass(safeToTreatAtHome === "Yes")}>Yes</button>
                        <button type="button" onClick={() => setSafeToTreatAtHome("No")} className={optionButtonClass(safeToTreatAtHome === "No")}>No</button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="mt-8 space-y-7">
                    {submitted ? (
                      <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6">
                        <p className="text-2xl font-black text-emerald-900">Request submitted</p>
                        <p className="mt-2 text-sm text-emerald-900">
                          Your migraine treatment questionnaire has been submitted for doctor review.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div>
                          <p className="font-black text-dark-slate dark:text-white">
                            1. I confirm that the information I have provided is true and accurate.
                          </p>
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            <button type="button" onClick={() => setConsentAccurateInfo("Yes")} className={optionButtonClass(consentAccurateInfo === "Yes")}>Yes</button>
                            <button type="button" onClick={() => setConsentAccurateInfo("No")} className={optionButtonClass(consentAccurateInfo === "No")}>No</button>
                          </div>
                        </div>
                        <div>
                          <p className="font-black text-dark-slate dark:text-white">
                            2. I confirm this medication request, if prescribed, is for my own use only.
                          </p>
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            <button type="button" onClick={() => setConsentOwnUseOnly("Yes")} className={optionButtonClass(consentOwnUseOnly === "Yes")}>Yes</button>
                            <button type="button" onClick={() => setConsentOwnUseOnly("No")} className={optionButtonClass(consentOwnUseOnly === "No")}>No</button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {!submitted && (
                  <div className="mt-8 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className={`px-6 py-3 rounded-xl font-bold text-sm ${
                        currentStep === 1 ? "bg-slate-200 text-slate-500 cursor-not-allowed" : "bg-slate-100 text-dark-slate"
                      }`}
                    >
                      Back
                    </button>

                    {currentStep < 6 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={!canGoNext}
                        className={`px-6 py-3 rounded-xl font-bold text-sm ${
                          canGoNext ? "bg-primary text-white" : "bg-slate-200 text-slate-500 cursor-not-allowed"
                        }`}
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={submitQuestionnaire}
                        disabled={!canSubmit}
                        className={`px-6 py-3 rounded-xl font-bold text-sm ${
                          canSubmit ? "bg-primary text-white" : "bg-slate-200 text-slate-500 cursor-not-allowed"
                        }`}
                      >
                        Submit
                      </button>
                    )}
                  </div>
                )}
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
                Migraine <span className="text-primary">Treatment</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-6 leading-relaxed">
                Ireland&apos;s award-winning online doctor service.
              </p>
            </div>

            <div className="rounded-[36px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
              <h3 className="text-2xl font-black mb-5">Treatments that we can provide</h3>
              <div className="space-y-3 mt-1">
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

        <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-center">What&apos;s included and excluded</h2>
            <div className="grid lg:grid-cols-2 gap-8 mt-10">
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-black mb-6">What&apos;s included with our service</h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                  Four medicine types are used for acute migraine attacks:
                </p>
                <ul className="space-y-3">
                  {[
                    "Simple painkillers, such as paracetamol.",
                    "Anti-inflammatory painkillers, such as ibuprofen and aspirin.",
                    "Triptan medications.",
                    "Anti-sickness medications.",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                      <p className="text-sm text-slate-700 dark:text-slate-300">{item}</p>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-slate-500 mt-4">
                  Note: paracetamol, ibuprofen, and aspirin can be purchased without prescription from your pharmacy.
                </p>
              </div>
              <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-black mb-6">What&apos;s excluded with our service</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">This service is not suitable if:</p>
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
              {faqItems.map((q) => (
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

