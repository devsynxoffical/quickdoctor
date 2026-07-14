"use client";

import React, { useState } from "react";
import { beginPrescriptionCheckout } from '@/lib/serviceCheckout';
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2, ChevronDown, Clock, ShieldCheck, Users, XCircle } from "lucide-react";
import PharmacyPicker from "@/components/PharmacyPicker";
import { resolvePharmacySelection } from "@/lib/pharmacies";

const faqItems = [
  "Who is this service suitable for?",
  "Who is this service not suitable for?",
  "What is the Thyroid Gland?",
  "What is Hypothyroidism?",
  "What are the most common causes of Hypothyroidism?",
  "What are the most common symptoms of Hypothyroidism?",
  "What is Subclinical Hypothyroidism?",
  "Why do I need to take treatment for Hypothyroidism?",
  "What treatment can we prescribe?",
  "How do I use T4 thyroid tablets?",
  "What are the most common side effects of T4 medication?",
  "Can Hypothyroidism affect pregnancy?",
  "Is there a specific Hypothyroidism diet that I should follow?",
];

const excludedItems = [
  "You have not been diagnosed with hypothyroidism by a doctor.",
  "You require a change to your dose of medication.",
  "You are pregnant or breastfeeding.",
  "You are seeking T3 or a medication not listed in our medical questionnaire.",
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

export default function HypothyroidismTreatmentPage() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [takingHypothyroidismMedication, setTakingHypothyroidismMedication] = useState("");
  const [toldToStopMedication, setToldToStopMedication] = useState("");
  const [declinedMedicationBefore, setDeclinedMedicationBefore] = useState("");
  const [hadOveractiveThyroid, setHadOveractiveThyroid] = useState("");
  const [allergicReactionToThyroidMedication, setAllergicReactionToThyroidMedication] = useState("");
  const [birthGender, setBirthGender] = useState("");
  const [pregnantOrBreastfeeding, setPregnantOrBreastfeeding] = useState("");
  const [hasLatestBloodResults, setHasLatestBloodResults] = useState("");
  const [bloodResultsFileName, setBloodResultsFileName] = useState("");
  const [lastBloodTestWhen, setLastBloodTestWhen] = useState("");
  const [knowsTshLevel, setKnowsTshLevel] = useState("");
  const [tshLevelValue, setTshLevelValue] = useState("");
  const [doseStable, setDoseStable] = useState("");
  const [currentMedicationName, setCurrentMedicationName] = useState("");
  const [currentDose, setCurrentDose] = useState("");
  const [missedDoses, setMissedDoses] = useState("");
  const [currentSymptoms, setCurrentSymptoms] = useState<string[]>([]);
  const [otherSymptoms, setOtherSymptoms] = useState("");
  const [heartConditions, setHeartConditions] = useState("");
  const [weightChanges, setWeightChanges] = useState("");
  const [interactingSupplements, setInteractingSupplements] = useState("");
  const [pharmacyId, setPharmacyId] = useState("");
  const [customPharmacy, setCustomPharmacy] = useState("");
  const pharmacyResolved = resolvePharmacySelection(pharmacyId, customPharmacy);
  const pharmacyName = pharmacyResolved?.name || "";
  const pharmacyCounty = pharmacyResolved?.county || (pharmacyId === "other" ? "Other" : "");
  const [confirmInformationTrue, setConfirmInformationTrue] = useState("");
  const [confirmOwnUseOnly, setConfirmOwnUseOnly] = useState("");

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
      document.getElementById("hypothyroidism-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const showPregnancyQuestion = birthGender === "Female";
  const bloodResultsQuestionNumber = showPregnancyQuestion ? "8" : "7";
  const uploadQuestionNumber = showPregnancyQuestion ? "9" : "8";
  const shouldUploadBloodResults = hasLatestBloodResults === "Yes, I have";
  const hasOtherSymptoms = currentSymptoms.includes("Other");

  const canGoNext =
    (currentStep === 1 &&
      takingHypothyroidismMedication &&
      toldToStopMedication &&
      declinedMedicationBefore &&
      hadOveractiveThyroid &&
      allergicReactionToThyroidMedication &&
      birthGender &&
      (!showPregnancyQuestion || pregnantOrBreastfeeding) &&
      hasLatestBloodResults &&
      (!shouldUploadBloodResults || bloodResultsFileName.trim().length > 0)) ||
    (currentStep === 2 &&
      lastBloodTestWhen &&
      knowsTshLevel &&
      (knowsTshLevel !== "Yes" || tshLevelValue.trim().length > 0) &&
      doseStable) ||
    (currentStep === 3 && currentMedicationName.trim().length > 0 && currentDose.trim().length > 0 && missedDoses) ||
    (currentStep === 4 &&
      currentSymptoms.length > 0 &&
      (!hasOtherSymptoms || otherSymptoms.trim().length > 0) &&
      heartConditions) ||
    (currentStep === 5 && weightChanges && interactingSupplements) ||
    (currentStep === 6 && pharmacyName.trim().length > 0) ||
    (currentStep === 7 && confirmInformationTrue && confirmOwnUseOnly);

  const canSubmit = currentStep === 7 && confirmInformationTrue === "Yes" && confirmOwnUseOnly === "Yes";

  const stepTitle =
    currentStep === 1
      ? "SUITABILITY"
      : currentStep === 2
      ? "THYROID MONITORING"
      : currentStep === 3
      ? "MEDICATION DETAILS"
      : currentStep === 4
      ? "SYMPTOMS AND HEALTH"
      : currentStep === 5
      ? "LIFESTYLE SAFETY"
      : currentStep === 6
      ? "PHARMACY DETAILS"
      : "CONFIRMATION";

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
    if (!canGoNext || currentStep >= 7) return;
    setCurrentStep((prev) => prev + 1);
    setTimeout(() => {
      document.getElementById("hypothyroidism-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const prevStep = () => {
    if (currentStep <= 1) return;
    setCurrentStep((prev) => prev - 1);
    setTimeout(() => {
      document.getElementById("hypothyroidism-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

    const submitQuestionnaire = () => {
    if (!canSubmit) return;
    beginPrescriptionCheckout({
      slug: 'hypothyroidism-treatment',
      serviceName: 'Hypothyroidism Treatment',
      payload: {
      takingHypothyroidismMedication,
      toldToStopMedication,
      declinedMedicationBefore,
      hadOveractiveThyroid,
      allergicReactionToThyroidMedication,
      birthGender,
      pregnantOrBreastfeeding,
      hasLatestBloodResults,
      bloodResultsFileName,
      lastBloodTestWhen,
      knowsTshLevel,
      tshLevelValue,
      doseStable,
      currentMedicationName,
      currentDose,
      missedDoses,
      currentSymptoms,
      otherSymptoms,
      heartConditions,
      weightChanges,
      interactingSupplements,
      pharmacyName,
      pharmacyCounty,
      confirmInformationTrue,
      confirmOwnUseOnly,
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <Navbar />
<main>
        {showQuestionnaire && (
          <section id="hypothyroidism-questionnaire" className="pt-28 pb-16">
            <div className="max-w-4xl mx-auto px-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Step {currentStep} / 7</p>
                <h2 className="mt-2 text-3xl font-black text-dark-slate dark:text-white">{stepTitle}</h2>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                  In this section you will answer questions to see if you are suitable for this treatment. Please note: If you
                  would like to speak to a GP, please book a video consultation.
                </p>

                {currentStep === 1 && <div className="mt-8 space-y-7">
                  <div>
                    <p className="font-black text-dark-slate dark:text-white">
                      1. Are you currently taking medication for hypothyroidism?
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <button type="button" onClick={() => setTakingHypothyroidismMedication("Yes, I am")} className={optionButtonClass(takingHypothyroidismMedication === "Yes, I am")}>Yes, I am</button>
                      <button type="button" onClick={() => setTakingHypothyroidismMedication("No, I am not")} className={optionButtonClass(takingHypothyroidismMedication === "No, I am not")}>No, I am not</button>
                    </div>
                  </div>

                  <div>
                    <p className="font-black text-dark-slate dark:text-white">
                      2. Have you ever been told to stop thyroid medication or that you are unsuitable for this medication?
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <button type="button" onClick={() => setToldToStopMedication("Yes, I have")} className={optionButtonClass(toldToStopMedication === "Yes, I have")}>Yes, I have</button>
                      <button type="button" onClick={() => setToldToStopMedication("No, I haven't")} className={optionButtonClass(toldToStopMedication === "No, I haven't")}>No, I haven&apos;t</button>
                    </div>
                  </div>

                  <div>
                    <p className="font-black text-dark-slate dark:text-white">3. Have you ever been declined thyroid medication before?</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <button type="button" onClick={() => setDeclinedMedicationBefore("Yes, I have")} className={optionButtonClass(declinedMedicationBefore === "Yes, I have")}>Yes, I have</button>
                      <button type="button" onClick={() => setDeclinedMedicationBefore("No, I haven't")} className={optionButtonClass(declinedMedicationBefore === "No, I haven't")}>No, I haven&apos;t</button>
                    </div>
                  </div>

                  <div>
                    <p className="font-black text-dark-slate dark:text-white">4. Have you ever had overactive thyroid?</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <button type="button" onClick={() => setHadOveractiveThyroid("Yes, I have")} className={optionButtonClass(hadOveractiveThyroid === "Yes, I have")}>Yes, I have</button>
                      <button type="button" onClick={() => setHadOveractiveThyroid("No, I haven't")} className={optionButtonClass(hadOveractiveThyroid === "No, I haven't")}>No, I haven&apos;t</button>
                    </div>
                  </div>

                  <div>
                    <p className="font-black text-dark-slate dark:text-white">
                      5. Have you ever had allergic reactions to thyroid medication before?
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <button type="button" onClick={() => setAllergicReactionToThyroidMedication("Yes, I have")} className={optionButtonClass(allergicReactionToThyroidMedication === "Yes, I have")}>Yes, I have</button>
                      <button type="button" onClick={() => setAllergicReactionToThyroidMedication("No, I haven't")} className={optionButtonClass(allergicReactionToThyroidMedication === "No, I haven't")}>No, I haven&apos;t</button>
                    </div>
                  </div>

                  <div>
                    <p className="font-black text-dark-slate dark:text-white">6. What is your birth gender?</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      <button
                        type="button"
                        onClick={() => {
                          setBirthGender("Male");
                          setPregnantOrBreastfeeding("No, I am not");
                        }}
                        className={optionButtonClass(birthGender === "Male")}
                      >
                        Male
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setBirthGender("Female");
                          setPregnantOrBreastfeeding("");
                        }}
                        className={optionButtonClass(birthGender === "Female")}
                      >
                        Female
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setBirthGender("Other");
                          setPregnantOrBreastfeeding("No, I am not");
                        }}
                        className={optionButtonClass(birthGender === "Other")}
                      >
                        Other
                      </button>
                    </div>
                  </div>

                  {showPregnancyQuestion && (
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">
                        7. Are you pregnant, planning to become pregnant or breastfeeding?
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setPregnantOrBreastfeeding("Yes, I am")} className={optionButtonClass(pregnantOrBreastfeeding === "Yes, I am")}>Yes, I am</button>
                        <button type="button" onClick={() => setPregnantOrBreastfeeding("No, I am not")} className={optionButtonClass(pregnantOrBreastfeeding === "No, I am not")}>No, I am not</button>
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="font-black text-dark-slate dark:text-white">
                      {bloodResultsQuestionNumber}. Have you got a copy of your latest thyroid blood results ?
                    </p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      In order to use this service we will need you to upload a copy of your latest thyroid blood results.
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setHasLatestBloodResults("Yes, I have")}
                        className={optionButtonClass(hasLatestBloodResults === "Yes, I have")}
                      >
                        Yes, I have
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setHasLatestBloodResults("No, I haven't");
                          setBloodResultsFileName("");
                        }}
                        className={optionButtonClass(hasLatestBloodResults === "No, I haven't")}
                      >
                        No, I haven&apos;t
                      </button>
                    </div>
                  </div>

                  {shouldUploadBloodResults && (
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">
                        {uploadQuestionNumber}. Please upload a copy of your latest thyroid blood results
                      </p>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Files accepted: .jpg, .jpeg, .png, .pdf, .csv
                      </p>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf,.csv"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          setBloodResultsFileName(file ? file.name : "");
                        }}
                        className="mt-3 block w-full text-sm text-dark-slate file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-primary/90 dark:text-white"
                      />
                      {bloodResultsFileName && (
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Selected file: {bloodResultsFileName}</p>
                      )}
                    </div>
                  )}
                </div>}

                {currentStep === 2 && (
                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">1. When was your last thyroid blood test?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {["Within last 3 months", "3-6 months ago", "6-12 months ago", "Over 12 months ago"].map((item) => (
                          <button key={item} type="button" onClick={() => setLastBloodTestWhen(item)} className={optionButtonClass(lastBloodTestWhen === item)}>
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">2. Do you know your latest TSH level?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setKnowsTshLevel("Yes")} className={optionButtonClass(knowsTshLevel === "Yes")}>Yes</button>
                        <button type="button" onClick={() => { setKnowsTshLevel("No"); setTshLevelValue(""); }} className={optionButtonClass(knowsTshLevel === "No")}>No</button>
                      </div>
                      {knowsTshLevel === "Yes" && (
                        <input
                          value={tshLevelValue}
                          onChange={(event) => setTshLevelValue(event.target.value)}
                          placeholder="Enter your TSH value"
                          className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">3. Has your thyroid dose been stable for at least 3 months?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setDoseStable("Yes")} className={optionButtonClass(doseStable === "Yes")}>Yes</button>
                        <button type="button" onClick={() => setDoseStable("No")} className={optionButtonClass(doseStable === "No")}>No</button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">1. What thyroid medication are you currently taking?</p>
                      <input
                        value={currentMedicationName}
                        onChange={(event) => setCurrentMedicationName(event.target.value)}
                        placeholder="e.g. Levothyroxine"
                        className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">2. What is your current daily dose?</p>
                      <input
                        value={currentDose}
                        onChange={(event) => setCurrentDose(event.target.value)}
                        placeholder="e.g. 50 micrograms once daily"
                        className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">3. Have you missed any doses in the last 2 weeks?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setMissedDoses("Yes")} className={optionButtonClass(missedDoses === "Yes")}>Yes</button>
                        <button type="button" onClick={() => setMissedDoses("No")} className={optionButtonClass(missedDoses === "No")}>No</button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">1. Which symptoms are you currently experiencing?</p>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Select all that apply.</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {["Fatigue", "Weight gain", "Dry skin", "Low mood", "Constipation", "Other"].map((item) => (
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
                          placeholder="Please provide details"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">2. Have you been diagnosed with any heart condition?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setHeartConditions("Yes")} className={optionButtonClass(heartConditions === "Yes")}>Yes</button>
                        <button type="button" onClick={() => setHeartConditions("No")} className={optionButtonClass(heartConditions === "No")}>No</button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">1. Have you had significant weight change in the last 3 months?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setWeightChanges("Yes")} className={optionButtonClass(weightChanges === "Yes")}>Yes</button>
                        <button type="button" onClick={() => setWeightChanges("No")} className={optionButtonClass(weightChanges === "No")}>No</button>
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">2. Do you take supplements that may affect thyroid tablets (iron, calcium, antacids)?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setInteractingSupplements("Yes")} className={optionButtonClass(interactingSupplements === "Yes")}>Yes</button>
                        <button type="button" onClick={() => setInteractingSupplements("No")} className={optionButtonClass(interactingSupplements === "No")}>No</button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="mt-8 space-y-7">
                    <PharmacyPicker
                      value={pharmacyId}
                      onChange={setPharmacyId}
                      customName={customPharmacy}
                      onCustomNameChange={setCustomPharmacy}
                      required
                      label="Which pharmacy should receive your prescription?"
                      className="[&_select]:rounded-xl [&_select]:border [&_select]:border-slate-300 [&_select]:bg-white [&_input]:rounded-xl [&_input]:border [&_input]:border-slate-300 [&_input]:bg-white"
                    />
                  </div>
                )}

                {currentStep === 7 && (
                  <div className="mt-8 space-y-7">
                    {submitted ? (
                      <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6">
                        <p className="text-2xl font-black text-emerald-900">Request submitted</p>
                        <p className="mt-2 text-sm text-emerald-900">
                          Your hypothyroidism treatment questionnaire has been submitted for doctor review.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div>
                          <p className="font-black text-dark-slate dark:text-white">
                            1. I confirm that the information I have provided is true and complete.
                          </p>
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            <button type="button" onClick={() => setConfirmInformationTrue("Yes")} className={optionButtonClass(confirmInformationTrue === "Yes")}>Yes</button>
                            <button type="button" onClick={() => setConfirmInformationTrue("No")} className={optionButtonClass(confirmInformationTrue === "No")}>No</button>
                          </div>
                        </div>
                        <div>
                          <p className="font-black text-dark-slate dark:text-white">
                            2. I confirm this request, if approved, is for my own treatment only.
                          </p>
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            <button type="button" onClick={() => setConfirmOwnUseOnly("Yes")} className={optionButtonClass(confirmOwnUseOnly === "Yes")}>Yes</button>
                            <button type="button" onClick={() => setConfirmOwnUseOnly("No")} className={optionButtonClass(confirmOwnUseOnly === "No")}>No</button>
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
                    {currentStep < 7 ? (
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
                Hypothyroidism <span className="text-primary">Treatment</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-6 leading-relaxed">
                Ireland&apos;s award-winning online doctor service.
              </p>
            </div>

            <div className="rounded-[36px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
              <h3 className="text-2xl font-black mb-5">Treatments that we can provide</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Hypothyroidism is when your thyroid gland does not produce enough thyroid hormone (thyroxine). Low
                levels can slow metabolism and cause fatigue, weight gain, dry skin/hair, muscle aches, low mood, and
                tiredness.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
                While hypothyroidism cannot be prevented, most cases can be treated with tablet medication to replace
                thyroxine. We can provide a 6-month prescription where clinically appropriate.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
                We issue prescriptions for generic medicine names to support maximum availability. Please check your
                dispensed prescription before leaving the pharmacy as no changes can be made after that point.
              </p>
              <div className="mt-4">
                <p className="text-sm font-bold text-dark-slate dark:text-white">Oral Thyroid Hormone (T4)</p>
              </div>
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
                      We can prescribe thyroid hormone (T4) tablets.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      We are not able to prescribe other thyroid medications via this service, but you can book a Video
                      Consultation to discuss alternatives with one of our GPs.
                    </p>
                  </li>
                </ul>
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

