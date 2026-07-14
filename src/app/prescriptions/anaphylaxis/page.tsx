"use client";

import React, { useState } from "react";
import { beginPrescriptionCheckout } from '@/lib/serviceCheckout';
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2, ChevronDown, Clock, ShieldCheck, Users, XCircle } from "lucide-react";
import PharmacyPicker from "@/components/PharmacyPicker";
import { resolvePharmacyDisplay } from "@/lib/pharmacies";

const suitableItems = [
  "Are aged 17 years or older.",
  "Have been diagnosed by a doctor with severe allergy/anaphylaxis that requires carrying an adrenaline pen.",
  "Can provide proof of previous adrenaline pen treatment (consultant letter and/or pen box details with your name, date of birth, and pharmacy details).",
  "Have been trained on how to use an adrenaline pen and are confident using it.",
  "Know the signs and symptoms of a severe allergic attack.",
];

const excludedItems = [
  "Have not had a prescription for an adrenaline pen before.",
  "Have not had or used an adrenaline pen for some time.",
  "Want to change to a different adrenaline pen.",
  "Are not confident with the injection technique for your specific adrenaline pen.",
];

const faqs = [
  "Who is this service for?",
  "Who is this service not suitable for?",
  "What is anaphylaxis?",
  "What are the symptoms of anaphylaxis?",
  "What causes anaphylaxis or severe allergic attacks?",
  "How is anaphylaxis treated?",
  "What anaphylaxis treatments can we provide?",
  "Can I prevent an anaphylactic reaction?",
  "What should I do if someone is experiencing anaphylaxis?",
  "Important safety information",
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
            Final prescribing decisions are made by an Irish-registered doctor after reviewing your clinical details.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function AnaphylaxisPage() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [aged17OrOver, setAged17OrOver] = useState("");
  const [diagnosedAnaphylaxis, setDiagnosedAnaphylaxis] = useState("");
  const [trainedAndCarry, setTrainedAndCarry] = useState("");
  const [awareSymptoms, setAwareSymptoms] = useState("");
  const [confidentUsage, setConfidentUsage] = useState("");
  const [requestEmerade, setRequestEmerade] = useState("");
  const [hasCurrentPen, setHasCurrentPen] = useState("");
  const [penType, setPenType] = useState("");
  const [changedDeviceRequest, setChangedDeviceRequest] = useState("");
  const [recentSevereReaction, setRecentSevereReaction] = useState("");
  const [emergencyCareNeeded, setEmergencyCareNeeded] = useState("");
  const [symptomsControlled, setSymptomsControlled] = useState("");
  const [birthSex, setBirthSex] = useState("");
  const [pregnantOrBreastfeeding, setPregnantOrBreastfeeding] = useState("");
  const [newMedicalCondition, setNewMedicalCondition] = useState("");
  const [newMedication, setNewMedication] = useState("");
  const [pharmacyId, setPharmacyId] = useState("");
  const [customPharmacy, setCustomPharmacy] = useState("");
  const pharmacyName = resolvePharmacyDisplay(pharmacyId, customPharmacy);
  const [idConfirm, setIdConfirm] = useState("");
  const [carryConfirm, setCarryConfirm] = useState("");
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
      document.getElementById("anaphylaxis-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const canGoNext =
    (currentStep === 1 &&
      aged17OrOver &&
      diagnosedAnaphylaxis &&
      trainedAndCarry &&
      awareSymptoms &&
      confidentUsage &&
      requestEmerade) ||
    (currentStep === 2 && hasCurrentPen && penType && changedDeviceRequest) ||
    (currentStep === 3 && recentSevereReaction && emergencyCareNeeded && symptomsControlled) ||
    (currentStep === 4 &&
      birthSex &&
      (birthSex === "Male" || pregnantOrBreastfeeding) &&
      newMedicalCondition &&
      newMedication) ||
    (currentStep === 5 && pharmacyName.trim().length > 1 && idConfirm && carryConfirm) ||
    (currentStep === 6 && finalAccuracyConfirm && finalDoctorReviewConfirm);

  const nextStep = () => {
    if (!canGoNext || currentStep >= 7) return;
    setCurrentStep((prev) => prev + 1);
    setTimeout(() => {
      document.getElementById("anaphylaxis-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const prevStep = () => {
    if (currentStep <= 1) return;
    setCurrentStep((prev) => prev - 1);
    setTimeout(() => {
      document.getElementById("anaphylaxis-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

    const submitForm = () => {
    beginPrescriptionCheckout({
      slug: 'anaphylaxis',
      serviceName: 'Anaphylaxis',
      payload: {
      aged17OrOver,
      diagnosedAnaphylaxis,
      trainedAndCarry,
      awareSymptoms,
      confidentUsage,
      requestEmerade,
      hasCurrentPen,
      penType,
      changedDeviceRequest,
      recentSevereReaction,
      emergencyCareNeeded,
      symptomsControlled,
      birthSex,
      pregnantOrBreastfeeding,
      newMedicalCondition,
      newMedication,
      pharmacyName,
      idConfirm,
      carryConfirm,
      finalAccuracyConfirm,
      finalDoctorReviewConfirm,
      },
    });
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSubmitted(false);
    setAged17OrOver("");
    setDiagnosedAnaphylaxis("");
    setTrainedAndCarry("");
    setAwareSymptoms("");
    setConfidentUsage("");
    setRequestEmerade("");
    setHasCurrentPen("");
    setPenType("");
    setChangedDeviceRequest("");
    setRecentSevereReaction("");
    setEmergencyCareNeeded("");
    setSymptomsControlled("");
    setBirthSex("");
    setPregnantOrBreastfeeding("");
    setNewMedicalCondition("");
    setNewMedication("");
    setPharmacyId("");
    setCustomPharmacy("");
    setIdConfirm("");
    setCarryConfirm("");
    setFinalAccuracyConfirm(false);
    setFinalDoctorReviewConfirm(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <Navbar />
<main>
        {showQuestionnaire && (
          <section id="anaphylaxis-questionnaire" className="pt-28 pb-16">
            <div className="max-w-4xl mx-auto px-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-black uppercase tracking-wider text-primary">
                  {currentStep <= 6 ? "Suitability" : "Review & Submit"}
                </p>
                <p className="mt-3 text-sm font-bold text-slate-600">Step {currentStep} / 7</p>
                {currentStep <= 6 && (
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                    Our doctors will use your answer to the questions below to assess your suitability for this treatment.
                  </p>
                )}

                {currentStep === 1 && (
                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">1. Are you aged 17 years or over?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setAged17OrOver("Yes, I am")} className={optionButtonClass(aged17OrOver === "Yes, I am")}>
                          Yes, I am
                        </button>
                        <button type="button" onClick={() => setAged17OrOver("No, I am not")} className={optionButtonClass(aged17OrOver === "No, I am not")}>
                          No, I am not
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="font-black text-dark-slate dark:text-white">
                        2. Have you been diagnosed by a doctor in the past with an anaphylactic allergy that requires
                        you to carry a prefilled adrenaline injectable pen at all times for emergency use?
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => setDiagnosedAnaphylaxis("Yes, I have")}
                          className={optionButtonClass(diagnosedAnaphylaxis === "Yes, I have")}
                        >
                          Yes, I have
                        </button>
                        <button
                          type="button"
                          onClick={() => setDiagnosedAnaphylaxis("No, I haven't")}
                          className={optionButtonClass(diagnosedAnaphylaxis === "No, I haven't")}
                        >
                          No, I haven&apos;t
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="font-black text-dark-slate dark:text-white">
                        3. Please confirm that you have been trained on how to use a prefilled adrenaline injectable
                        pen and that you agree to carry the device at all times
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => setTrainedAndCarry("Yes, I confirm")}
                          className={optionButtonClass(trainedAndCarry === "Yes, I confirm")}
                        >
                          Yes, I confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setTrainedAndCarry("No, I don't confirm")}
                          className={optionButtonClass(trainedAndCarry === "No, I don't confirm")}
                        >
                          No, I don&apos;t confirm
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="font-black text-dark-slate dark:text-white">
                        4. Are you aware of the potential signs and symptoms of an anaphylactic reaction?
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => setAwareSymptoms("Yes, I am")}
                          className={optionButtonClass(awareSymptoms === "Yes, I am")}
                        >
                          Yes, I am
                        </button>
                        <button
                          type="button"
                          onClick={() => setAwareSymptoms("No, I am not")}
                          className={optionButtonClass(awareSymptoms === "No, I am not")}
                        >
                          No, I am not
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="font-black text-dark-slate dark:text-white">
                        5. This device is only for use in an emergency situation. Are you confident you know how and
                        when to use an adrenaline device?
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => setConfidentUsage("Yes, I am")}
                          className={optionButtonClass(confidentUsage === "Yes, I am")}
                        >
                          Yes, I am
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfidentUsage("No, I am not")}
                          className={optionButtonClass(confidentUsage === "No, I am not")}
                        >
                          No, I am not
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="font-black text-dark-slate dark:text-white">
                        6. Are you looking for a prescription for Emerade 300 or 500 micrograms adrenaline pen?
                      </p>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Please note that there is currently a medication shortage of Emerade and we cannot issue scripts
                        for this.
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => setRequestEmerade("Yes, I am")}
                          className={optionButtonClass(requestEmerade === "Yes, I am")}
                        >
                          Yes, I am
                        </button>
                        <button
                          type="button"
                          onClick={() => setRequestEmerade("No, I am not")}
                          className={optionButtonClass(requestEmerade === "No, I am not")}
                        >
                          No, I am not
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">
                        7. Do you currently have an adrenaline pen prescription from your doctor?
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setHasCurrentPen("Yes")} className={optionButtonClass(hasCurrentPen === "Yes")}>
                          Yes
                        </button>
                        <button type="button" onClick={() => setHasCurrentPen("No")} className={optionButtonClass(hasCurrentPen === "No")}>
                          No
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">
                        8. Which adrenaline pen are you currently using?
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        <button type="button" onClick={() => setPenType("EpiPen")} className={optionButtonClass(penType === "EpiPen")}>
                          EpiPen
                        </button>
                        <button type="button" onClick={() => setPenType("Jext")} className={optionButtonClass(penType === "Jext")}>
                          Jext
                        </button>
                        <button type="button" onClick={() => setPenType("Emerade")} className={optionButtonClass(penType === "Emerade")}>
                          Emerade
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">
                        9. Are you requesting a different pen device from your current prescribed brand?
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setChangedDeviceRequest("Yes")} className={optionButtonClass(changedDeviceRequest === "Yes")}>
                          Yes
                        </button>
                        <button type="button" onClick={() => setChangedDeviceRequest("No")} className={optionButtonClass(changedDeviceRequest === "No")}>
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">
                        10. Have you had a severe allergic reaction in the last 12 months?
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setRecentSevereReaction("Yes")} className={optionButtonClass(recentSevereReaction === "Yes")}>
                          Yes
                        </button>
                        <button type="button" onClick={() => setRecentSevereReaction("No")} className={optionButtonClass(recentSevereReaction === "No")}>
                          No
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">
                        11. Did any recent reaction require emergency department care or hospital admission?
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setEmergencyCareNeeded("Yes")} className={optionButtonClass(emergencyCareNeeded === "Yes")}>
                          Yes
                        </button>
                        <button type="button" onClick={() => setEmergencyCareNeeded("No")} className={optionButtonClass(emergencyCareNeeded === "No")}>
                          No
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">
                        12. Are your allergy symptoms currently stable and controlled?
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setSymptomsControlled("Yes")} className={optionButtonClass(symptomsControlled === "Yes")}>
                          Yes
                        </button>
                        <button type="button" onClick={() => setSymptomsControlled("No")} className={optionButtonClass(symptomsControlled === "No")}>
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">
                        13. What is your birth sex?
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setBirthSex("Female")} className={optionButtonClass(birthSex === "Female")}>
                          Female
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setBirthSex("Male");
                            setPregnantOrBreastfeeding("");
                          }}
                          className={optionButtonClass(birthSex === "Male")}
                        >
                          Male
                        </button>
                      </div>
                    </div>

                    {birthSex === "Female" && (
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">
                          14. Are you currently pregnant, trying to conceive, or breastfeeding?
                        </p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={() => setPregnantOrBreastfeeding("Yes")}
                            className={optionButtonClass(pregnantOrBreastfeeding === "Yes")}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => setPregnantOrBreastfeeding("No")}
                            className={optionButtonClass(pregnantOrBreastfeeding === "No")}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="font-black text-dark-slate dark:text-white">
                        {birthSex === "Female" ? "15" : "14"}. Have you had any new medical condition or diagnosis since your last adrenaline pen review?
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => setNewMedicalCondition("Yes")}
                          className={optionButtonClass(newMedicalCondition === "Yes")}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewMedicalCondition("No")}
                          className={optionButtonClass(newMedicalCondition === "No")}
                        >
                          No
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">
                        {birthSex === "Female" ? "16" : "15"}. Have you started any new medication in the last 3 months?
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setNewMedication("Yes")} className={optionButtonClass(newMedication === "Yes")}>
                          Yes
                        </button>
                        <button type="button" onClick={() => setNewMedication("No")} className={optionButtonClass(newMedication === "No")}>
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="mt-8 space-y-7">
                    <PharmacyPicker
                      value={pharmacyId}
                      onChange={setPharmacyId}
                      customName={customPharmacy}
                      onCustomNameChange={setCustomPharmacy}
                      required
                      label="Preferred pharmacy"
                      className="[&_select]:rounded-xl [&_select]:border [&_select]:border-slate-300 [&_select]:bg-white [&_input]:rounded-xl [&_input]:border [&_input]:border-slate-300 [&_input]:bg-white"
                    />
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">
                        17. Please confirm you have valid photo ID matching your account details.
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setIdConfirm("Yes")} className={optionButtonClass(idConfirm === "Yes")}>
                          Yes
                        </button>
                        <button type="button" onClick={() => setIdConfirm("No")} className={optionButtonClass(idConfirm === "No")}>
                          No
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">
                        18. Please confirm you agree to carry your adrenaline pen at all times.
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setCarryConfirm("Yes")} className={optionButtonClass(carryConfirm === "Yes")}>
                          Yes
                        </button>
                        <button type="button" onClick={() => setCarryConfirm("No")} className={optionButtonClass(carryConfirm === "No")}>
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="mt-8 space-y-5">
                    <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/40">
                      <input
                        type="checkbox"
                        checked={finalAccuracyConfirm}
                        onChange={(event) => setFinalAccuracyConfirm(event.target.checked)}
                        className="mt-1 h-4 w-4 accent-primary"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        I confirm that the information provided is accurate and complete to the best of my knowledge.
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
                        I understand that issuing a prescription is at the doctor&apos;s discretion following clinical review.
                      </span>
                    </label>
                  </div>
                )}

                {currentStep === 7 && (
                  <div className="mt-8 space-y-6">
                    {submitted ? (
                      <div className="rounded-2xl border border-green-200 bg-green-50 p-5 dark:border-green-900/30 dark:bg-green-900/20">
                        <p className="text-lg font-black text-green-800 dark:text-green-300">Questionnaire submitted.</p>
                        <p className="mt-2 text-sm text-green-700 dark:text-green-200">
                          Thank you. A doctor will review your answers and contact you if more information is needed.
                        </p>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-xl font-black text-dark-slate dark:text-white">Review your answers</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Use Back if you want to update any details before final submission.
                        </p>
                        <button
                          type="button"
                          onClick={submitForm}
                          className="rounded-xl bg-primary px-5 py-3 text-sm font-black text-white transition hover:bg-primary/90"
                        >
                          Submit questionnaire
                        </button>
                      </>
                    )}
                  </div>
                )}

                <div className="mt-10 flex flex-wrap items-center gap-3">
                  {currentStep > 1 && currentStep < 7 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-black text-slate-700 transition hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-200"
                    >
                      Back
                    </button>
                  )}

                  {currentStep < 6 && (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!canGoNext}
                      className="rounded-xl bg-primary px-5 py-3 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:bg-primary/50"
                    >
                      Next
                    </button>
                  )}

                  {currentStep === 6 && (
                    <>
                      <button
                        type="button"
                        onClick={prevStep}
                        className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-black text-slate-700 transition hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-200"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={!canGoNext}
                        className="rounded-xl bg-primary px-5 py-3 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:bg-primary/50"
                      >
                        Continue to review
                      </button>
                    </>
                  )}

                  {currentStep === 7 && submitted && (
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
                Anaphylaxis <span className="text-primary">Treatment</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-6 leading-relaxed">
                Ireland&apos;s award-winning online doctor service.
              </p>
            </div>

            <div className="rounded-[36px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
              <h3 className="text-2xl font-black mb-5">Treatments that we can provide</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Avoid the waiting room. Request your prescription online and, if medically suitable, receive a
                prescription for an injectable adrenaline pen.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
                Please check your dispensed prescription before leaving the pharmacy as no changes can be made after
                that point.
              </p>
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <p className="font-black text-dark-slate dark:text-white">Injectable Adrenaline Pens</p>
              </div>
              <div className="space-y-3 mt-4">
                {[
                  { label: "Request Prescription", price: "EUR25", active: true, href: "#" },
                  { label: "Online Consultation", price: "EUR39+", active: false, href: "/consultation" },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      if (item.active) {
                        startQuestionnaire();
                      }
                    }}
                    className={`block w-full p-4 rounded-2xl border text-left transition-all ${
                      item.active
                        ? "bg-primary text-white border-primary"
                        : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-primary"
                    }`}
                  >
                    <p className={`font-black ${item.active ? "text-white" : "text-dark-slate dark:text-white"}`}>{item.label}</p>
                    <p className={`text-sm font-bold mt-1 ${item.active ? "text-white/90" : "text-primary"}`}>{item.price}</p>
                  </button>
                ))}
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
                  {suitableItems.map((item) => (
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
                  desc: "If approved, your prescription is sent to an Irish pharmacy of your choice via secure Healthmail.",
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

