"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2, ChevronDown, Clock, ShieldCheck, Users, XCircle } from "lucide-react";

const faqs = [
  "What is Acne?",
  "What causes Acne?",
  "Who is this service suitable for?",
  "Who is this service not suitable for?",
  "How can I treat my Acne symptoms?",
  "How do Acne treatments work?",
  "What Acne treatments can you prescribe for me?",
  "What are the side effects of these treatments?",
  "Can I use this service if I am pregnant or breastfeeding?",
  "Need more information on Acne?",
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
            Final suitability and treatment decisions are made by an Irish-registered doctor following clinical review.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function AcneTreatmentPage() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [hadAcneBefore, setHadAcneBefore] = useState("");
  const [lookingForExcludedMeds, setLookingForExcludedMeds] = useState("");
  const [specificTreatment, setSpecificTreatment] = useState("");
  const [requestedTreatments, setRequestedTreatments] = useState<string[]>([]);
  const [requestedTreatmentsOther, setRequestedTreatmentsOther] = useState("");
  const [acneDuration, setAcneDuration] = useState("");
  const [bodyAreas, setBodyAreas] = useState<string[]>([]);
  const [otherAffectedAreas, setOtherAffectedAreas] = useState("");
  const [acneSymptoms, setAcneSymptoms] = useState<string[]>([]);
  const [acneSymptomsOther, setAcneSymptomsOther] = useState("");
  const [timesTreated, setTimesTreated] = useState("");
  const [pastTreatments, setPastTreatments] = useState<string[]>([]);
  const [pastTreatmentsOther, setPastTreatmentsOther] = useState("");
  const [successfulTreatment, setSuccessfulTreatment] = useState("");
  const [currentlyUsingTreatment, setCurrentlyUsingTreatment] = useState("");
  const [closeUpPhoto, setCloseUpPhoto] = useState<File | null>(null);
  const [overviewPhoto, setOverviewPhoto] = useState<File | null>(null);
  const [uploadMorePhotos, setUploadMorePhotos] = useState("");
  const [extraPhoto1, setExtraPhoto1] = useState<File | null>(null);
  const [extraPhoto2, setExtraPhoto2] = useState<File | null>(null);
  const [otherSkinProblemsHistory, setOtherSkinProblemsHistory] = useState("");
  const [skinProblems, setSkinProblems] = useState<string[]>([]);
  const [skinProblemsOtherDescription, setSkinProblemsOtherDescription] = useState("");
  const [skinProblemsYesDetails, setSkinProblemsYesDetails] = useState("");
  const [kidneyUrinaryHistory, setKidneyUrinaryHistory] = useState("");
  const [kidneyUrinaryDetails, setKidneyUrinaryDetails] = useState("");
  const [digestiveHistory, setDigestiveHistory] = useState("");
  const [digestiveDetails, setDigestiveDetails] = useState("");
  const [nervousSystemHistory, setNervousSystemHistory] = useState("");
  const [nervousSystemDetails, setNervousSystemDetails] = useState("");
  const [jointConditionsHistory, setJointConditionsHistory] = useState("");
  const [jointConditionsDetails, setJointConditionsDetails] = useState("");
  const [familyHistoryAcne, setFamilyHistoryAcne] = useState("");
  const [prescribedMedications, setPrescribedMedications] = useState("");
  const [nonPrescribedMedications, setNonPrescribedMedications] = useState("");
  const [recreationalDrugs, setRecreationalDrugs] = useState("");
  const [recentAntibiotics, setRecentAntibiotics] = useState("");
  const [otherMedicalInfo, setOtherMedicalInfo] = useState("");
  const [prescribedMedicationsDetails, setPrescribedMedicationsDetails] = useState("");
  const [nonPrescribedMedicationsDetails, setNonPrescribedMedicationsDetails] = useState("");
  const [nonPrescribedSelections, setNonPrescribedSelections] = useState<string[]>([]);
  const [nonPrescribedOther, setNonPrescribedOther] = useState("");
  const [recreationalDrugsDetails, setRecreationalDrugsDetails] = useState("");
  const [recentAntibioticsDetails, setRecentAntibioticsDetails] = useState("");
  const [otherMedicalInfoDetails, setOtherMedicalInfoDetails] = useState("");
  const [medicineAllergies, setMedicineAllergies] = useState("");
  const [medicineAllergyDetails, setMedicineAllergyDetails] = useState("");
  const [generalAllergies, setGeneralAllergies] = useState("");
  const [generalAllergySelections, setGeneralAllergySelections] = useState<string[]>([]);
  const [generalAllergyOther, setGeneralAllergyOther] = useState("");
  const [aboutBirthSex, setAboutBirthSex] = useState("");
  const [heightUnit, setHeightUnit] = useState<"imperial" | "metric">("imperial");
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const [heightCmAbout, setHeightCmAbout] = useState("");
  const [weightUnit, setWeightUnit] = useState<"imperial" | "metric">("imperial");
  const [weightStone, setWeightStone] = useState("");
  const [weightPounds, setWeightPounds] = useState("");
  const [weightKgAbout, setWeightKgAbout] = useState("");
  const [knowsBloodPressure, setKnowsBloodPressure] = useState("");
  const [breastfeedingNow, setBreastfeedingNow] = useState("");
  const [pregnantNow, setPregnantNow] = useState("");
  const [planningPregnancy, setPlanningPregnancy] = useState("");
  const [usingContraception, setUsingContraception] = useState("");
  const [regularContraception, setRegularContraception] = useState("");
  const [regularContraceptionOther, setRegularContraceptionOther] = useState("");
  const [bpLastChecked, setBpLastChecked] = useState("");
  const [bpSysReading, setBpSysReading] = useState("");
  const [bpDiaReading, setBpDiaReading] = useState("");
  const [smokerHistory, setSmokerHistory] = useState("");
  const [currentlySmokes, setCurrentlySmokes] = useState("");
  const [smokesPerDay, setSmokesPerDay] = useState("");
  const [drinksAlcohol, setDrinksAlcohol] = useState("");
  const [alcoholUnitsPerWeek, setAlcoholUnitsPerWeek] = useState("");
  const [exerciseFrequency, setExerciseFrequency] = useState("");
  const [cannotExerciseReason, setCannotExerciseReason] = useState("");
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
    setTimeout(() => {
      document.getElementById("acne-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const toggleListValue = (list: string[], setList: (value: string[]) => void, value: string) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
      return;
    }
    setList([...list, value]);
  };

  const canGoNext =
    (currentStep === 1 && hadAcneBefore && lookingForExcludedMeds) ||
    (currentStep === 2 &&
      specificTreatment &&
      (specificTreatment === "No, I am not" || requestedTreatments.length > 0) &&
      (specificTreatment === "No, I am not" ||
        !requestedTreatments.includes("Other") ||
        requestedTreatmentsOther.trim().length > 0) &&
      acneDuration &&
      bodyAreas.length > 0 &&
      (!bodyAreas.includes("Other") || otherAffectedAreas.trim().length > 0) &&
      acneSymptoms.length > 0 &&
      (!acneSymptoms.includes("Other") || acneSymptomsOther.trim().length > 0) &&
      timesTreated.trim().length > 0 &&
      pastTreatments.length > 0 &&
      (!pastTreatments.includes("OTHER") || pastTreatmentsOther.trim().length > 0) &&
      successfulTreatment &&
      currentlyUsingTreatment) ||
    (currentStep === 3 &&
      closeUpPhoto &&
      overviewPhoto &&
      uploadMorePhotos &&
      (uploadMorePhotos === "No" || extraPhoto1 || extraPhoto2)) ||
    (currentStep === 4 &&
      otherSkinProblemsHistory &&
      (otherSkinProblemsHistory === "No, I have not" || skinProblems.length > 0) &&
      (!skinProblems.includes("Other") || skinProblemsOtherDescription.trim().length > 0) &&
      (otherSkinProblemsHistory === "No, I have not" || skinProblemsYesDetails.trim().length > 0) &&
      kidneyUrinaryHistory &&
      digestiveHistory &&
      (kidneyUrinaryHistory === "No, I have not" || kidneyUrinaryDetails.trim().length > 0) &&
      (digestiveHistory === "No, I have not" || digestiveDetails.trim().length > 0) &&
      nervousSystemHistory &&
      (nervousSystemHistory === "No, I have not" || nervousSystemDetails.trim().length > 0) &&
      jointConditionsHistory &&
      (jointConditionsHistory === "No, I have not" || jointConditionsDetails.trim().length > 0)) ||
    (currentStep === 5 && familyHistoryAcne) ||
    (currentStep === 6 &&
      prescribedMedications &&
      (prescribedMedications !== "Yes, I am" || prescribedMedicationsDetails.trim().length > 0) &&
      nonPrescribedMedications &&
      (nonPrescribedMedications !== "Yes, I am" ||
        (nonPrescribedSelections.length > 0 &&
          (!nonPrescribedSelections.includes("OTHER") || nonPrescribedOther.trim().length > 0))) &&
      recreationalDrugs &&
      (recreationalDrugs !== "Yes, I am" || recreationalDrugsDetails.trim().length > 0) &&
      recentAntibiotics &&
      (recentAntibiotics !== "Yes, I have" || recentAntibioticsDetails.trim().length > 0) &&
      otherMedicalInfo &&
      (otherMedicalInfo !== "Yes" || otherMedicalInfoDetails.trim().length > 0)) ||
    (currentStep === 7 &&
      medicineAllergies &&
      (medicineAllergies !== "Yes" || medicineAllergyDetails.trim().length > 0) &&
      generalAllergies &&
      (generalAllergies !== "Yes" ||
        (generalAllergySelections.length > 0 &&
          (!generalAllergySelections.includes("OTHER") || generalAllergyOther.trim().length > 0)))) ||
    (currentStep === 8 &&
      aboutBirthSex &&
      (aboutBirthSex !== "Female" ||
        (breastfeedingNow &&
          pregnantNow &&
          (pregnantNow !== "No" || planningPregnancy) &&
          usingContraception &&
          (usingContraception !== "Yes, I am" ||
            (regularContraception &&
              (regularContraception !== "Other" || regularContraceptionOther.trim().length > 0))))) &&
      ((heightUnit === "imperial" && (heightFeet.trim().length > 0 || heightInches.trim().length > 0)) ||
        (heightUnit === "metric" && heightCmAbout.trim().length > 0)) &&
      ((weightUnit === "imperial" && (weightStone.trim().length > 0 || weightPounds.trim().length > 0)) ||
        (weightUnit === "metric" && weightKgAbout.trim().length > 0)) &&
      knowsBloodPressure &&
      (knowsBloodPressure !== "Yes" ||
        (bpLastChecked && bpSysReading.trim().length > 0 && bpDiaReading.trim().length > 0))) ||
    (currentStep === 9 &&
      smokerHistory &&
      (smokerHistory !== "Yes, I have" ||
        (currentlySmokes && (currentlySmokes !== "Yes, I do" || smokesPerDay))) &&
      drinksAlcohol &&
      (drinksAlcohol !== "Yes" || alcoholUnitsPerWeek) &&
      exerciseFrequency &&
      (exerciseFrequency !== "CANNOT EXERCISE" || cannotExerciseReason.trim().length > 0)) ||
    (currentStep === 10 && confirmInformationTrue && confirmOwnUseOnly);
  const canSubmit = confirmInformationTrue === "Yes" && confirmOwnUseOnly === "Yes";

  const showSkinProblemsQuestion = otherSkinProblemsHistory === "Yes, I have";
  const nextStep = () => {
    if (!canGoNext || currentStep >= 10) return;
    setCurrentStep((prev) => prev + 1);
    setTimeout(() => {
      document.getElementById("acne-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const prevStep = () => {
    if (currentStep <= 1) return;
    setCurrentStep((prev) => prev - 1);
    setTimeout(() => {
      document.getElementById("acne-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const submitQuestionnaire = () => {
    if (!canSubmit) return;
    setSubmitted(true);
    setTimeout(() => {
      document.getElementById("acne-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <Navbar />

      <div className="pt-24 bg-primary/5 border-y border-primary/10 py-3 px-6 text-center">
        <p className="text-sm font-bold text-primary">
          A healthier year starts now. Check your BMI and access medical weight care from EUR50.
        </p>
      </div>

      <main>
        {showQuestionnaire && (
          <section id="acne-questionnaire" className="pt-28 pb-16">
            <div className="max-w-4xl mx-auto px-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-black uppercase tracking-wider text-primary">
                  {currentStep === 1
                    ? "Suitability"
                    : currentStep === 2
                    ? "Reason for Visit"
                    : currentStep === 3
                    ? "Photos of Your Acne"
                    : currentStep === 4
                    ? "Personal Medical History"
                    : currentStep === 5
                    ? "Family Medical History"
                    : currentStep === 6
                    ? "Medication"
                    : currentStep === 7
                    ? "Allergies"
                    : currentStep === 8
                    ? "More About You"
                    : currentStep === 9
                    ? "Lifestyle"
                    : "Confirmation"}
                </p>
                <p className="mt-3 text-sm font-bold text-slate-600">Step {currentStep} / 10</p>
                {currentStep === 1 && (
                  <>
                    <h2 className="mt-2 text-3xl font-black text-dark-slate dark:text-white">SUITABILITY</h2>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                      Our doctors will use your answer to the question below to assess your suitability for this treatment
                    </p>

                    <div className="mt-8 space-y-7">
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">1. Have you had Acne in the past?</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                          This treatment is only suitable for patients who have been diagnosed with ACNE in the past.
                        </p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={() => setHadAcneBefore("Yes, I have")}
                            className={optionButtonClass(hadAcneBefore === "Yes, I have")}
                          >
                            Yes, I have
                          </button>
                          <button
                            type="button"
                            onClick={() => setHadAcneBefore("No, I have not")}
                            className={optionButtonClass(hadAcneBefore === "No, I have not")}
                          >
                            No, I have not
                          </button>
                        </div>
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">
                          2. Are you looking for a prescription to Roaccutane, Dianette or Minocycline?
                        </p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                          Roaccutane, Dianette or Minocycline are NOT an option on this site. If you are looking for them,
                          we would recommend that you visit your local GP.
                        </p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={() => setLookingForExcludedMeds("Yes, I am")}
                            className={optionButtonClass(lookingForExcludedMeds === "Yes, I am")}
                          >
                            Yes, I am
                          </button>
                          <button
                            type="button"
                            onClick={() => setLookingForExcludedMeds("No, I am not")}
                            className={optionButtonClass(lookingForExcludedMeds === "No, I am not")}
                          >
                            No, I am not
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <h2 className="mt-2 text-3xl font-black text-dark-slate dark:text-white">REASON FOR VISIT</h2>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                      This series of questions can help your doctor to get a better understanding of your Acne
                    </p>

                    <div className="mt-8 space-y-7">
                      {/*
                        Step 2 numbering rules:
                        - "Yes, I am" adds an extra treatment-selection question after Q1.
                        - Selecting "Other" body area adds one follow-up question.
                        This keeps numbering aligned with the user-provided flows.
                      */}
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">1. Are you looking for a specific treatment?</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => setSpecificTreatment("Yes, I am")} className={optionButtonClass(specificTreatment === "Yes, I am")}>Yes, I am</button>
                          <button
                            type="button"
                            onClick={() => {
                              setSpecificTreatment("No, I am not");
                              setRequestedTreatments([]);
                            }}
                            className={optionButtonClass(specificTreatment === "No, I am not")}
                          >
                            No, I am not
                          </button>
                        </div>
                      </div>

                      {specificTreatment === "Yes, I am" && (
                        <div>
                          <p className="font-black text-dark-slate dark:text-white">
                            2. Please select the treatment, or treatments, that you are looking for.
                          </p>
                          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Select &quot;Other&quot; if it is not listed</p>
                          <div className="mt-3 grid gap-3 sm:grid-cols-3">
                            {["Acnecide", "Brevoxyl", "Duac", "Skinoren", "Differin", "Epiduo", "Treclin", "Tetralysal", "Doxycycline", "Other"].map((treatment) => (
                              <button
                                key={treatment}
                                type="button"
                                onClick={() => toggleListValue(requestedTreatments, setRequestedTreatments, treatment)}
                                className={optionButtonClass(requestedTreatments.includes(treatment))}
                              >
                                {treatment}
                              </button>
                            ))}
                          </div>
                          {requestedTreatments.includes("Other") && (
                            <input
                              type="text"
                              value={requestedTreatmentsOther}
                              onChange={(event) => setRequestedTreatmentsOther(event.target.value)}
                              className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                              placeholder="Please specify other requested treatment"
                            />
                          )}
                        </div>
                      )}

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">
                          {specificTreatment === "Yes, I am" ? "3" : "2"}. How long have you had acne?
                        </p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-3">
                          <button type="button" onClick={() => setAcneDuration("Less than 1 month")} className={optionButtonClass(acneDuration === "Less than 1 month")}>Less than 1 month</button>
                          <button type="button" onClick={() => setAcneDuration("Between 1 and 6 months")} className={optionButtonClass(acneDuration === "Between 1 and 6 months")}>Between 1 and 6 months</button>
                          <button type="button" onClick={() => setAcneDuration("More than 6 months")} className={optionButtonClass(acneDuration === "More than 6 months")}>More than 6 months</button>
                        </div>
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">
                          {specificTreatment === "Yes, I am" ? "4" : "3"}. In which areas of your body do you have acne?
                        </p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Please select all the areas that are affected</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-3">
                          {["Back", "Chest", "Face", "Neck", "Shoulders", "Other"].map((area) => (
                            <button key={area} type="button" onClick={() => toggleListValue(bodyAreas, setBodyAreas, area)} className={optionButtonClass(bodyAreas.includes(area))}>
                              {area}
                            </button>
                          ))}
                        </div>
                      </div>

                      {bodyAreas.includes("Other") && (
                        <div>
                          <p className="font-black text-dark-slate dark:text-white">
                            {specificTreatment === "Yes, I am" ? "5" : "4"}. Please tell us which other areas are affected
                          </p>
                          <input
                            type="text"
                            value={otherAffectedAreas}
                            onChange={(event) => setOtherAffectedAreas(event.target.value)}
                            className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                            placeholder="Describe other affected areas"
                          />
                        </div>
                      )}

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">
                          {specificTreatment === "Yes, I am"
                            ? bodyAreas.includes("Other")
                              ? "6"
                              : "5"
                            : bodyAreas.includes("Other")
                            ? "5"
                            : "4"}
                          . Please select the symptoms that best describe your acne.
                        </p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Use Other to add to your description should you wish.</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-3">
                          {["Blackheads", "Inflamed spots", "Tender lumps under skin", "Whiteheads", "Other"].map((symptom) => (
                            <button key={symptom} type="button" onClick={() => toggleListValue(acneSymptoms, setAcneSymptoms, symptom)} className={optionButtonClass(acneSymptoms.includes(symptom))}>
                              {symptom}
                            </button>
                          ))}
                        </div>
                        {acneSymptoms.includes("Other") && (
                          <input
                            type="text"
                            value={acneSymptomsOther}
                            onChange={(event) => setAcneSymptomsOther(event.target.value)}
                            className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                            placeholder="Please describe other symptoms"
                          />
                        )}
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">
                          {specificTreatment === "Yes, I am"
                            ? bodyAreas.includes("Other")
                              ? "7"
                              : "6"
                            : bodyAreas.includes("Other")
                            ? "6"
                            : "5"}
                          . How many times have you been treated for Acne?
                        </p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">If you are unsure indicate an approximate number for the times you have been treated</p>
                        <input
                          type="number"
                          min="0"
                          value={timesTreated}
                          onChange={(event) => setTimesTreated(event.target.value)}
                          className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                          placeholder="e.g. 2"
                        />
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">
                          {specificTreatment === "Yes, I am"
                            ? bodyAreas.includes("Other")
                              ? "8"
                              : "7"
                            : bodyAreas.includes("Other")
                            ? "7"
                            : "6"}
                          . Please select the treatments that you have used previously.
                        </p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Select from the below any treatments that apply</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-3">
                          {[
                            "BENZOYL-PEROXIDE",
                            "ACNECIDE",
                            "BREVOXYL",
                            "DUAC",
                            "ADAPALENE",
                            "DIFFERIN",
                            "AZELAIC",
                            "SKINOREN",
                            "ISOTREX",
                            "TRECLIN",
                            "LYMECYCLINE",
                            "TETRALYSAL",
                            "DOXYCYCLINE",
                            "ORAL CONTRACEPTIVE PILL",
                            "ROACCUTANE",
                            "OTHER",
                          ].map((treatment) => (
                            <button key={treatment} type="button" onClick={() => toggleListValue(pastTreatments, setPastTreatments, treatment)} className={optionButtonClass(pastTreatments.includes(treatment))}>
                              {treatment}
                            </button>
                          ))}
                        </div>
                        {pastTreatments.includes("OTHER") && (
                          <input
                            type="text"
                            value={pastTreatmentsOther}
                            onChange={(event) => setPastTreatmentsOther(event.target.value)}
                            className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                            placeholder="Please specify other past treatment"
                          />
                        )}
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">
                          {specificTreatment === "Yes, I am"
                            ? bodyAreas.includes("Other")
                              ? "9"
                              : "8"
                            : bodyAreas.includes("Other")
                            ? "8"
                            : "7"}
                          . Was the treatment successful?
                        </p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => setSuccessfulTreatment("Yes")} className={optionButtonClass(successfulTreatment === "Yes")}>Yes</button>
                          <button type="button" onClick={() => setSuccessfulTreatment("No")} className={optionButtonClass(successfulTreatment === "No")}>No</button>
                        </div>
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">
                          {specificTreatment === "Yes, I am"
                            ? bodyAreas.includes("Other")
                              ? "10"
                              : "9"
                            : bodyAreas.includes("Other")
                            ? "9"
                            : "8"}
                          . Are you currently using any acne treatments?
                        </p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => setCurrentlyUsingTreatment("Yes, I am")} className={optionButtonClass(currentlyUsingTreatment === "Yes, I am")}>Yes, I am</button>
                          <button type="button" onClick={() => setCurrentlyUsingTreatment("No, I am not")} className={optionButtonClass(currentlyUsingTreatment === "No, I am not")}>No, I am not</button>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <h2 className="mt-2 text-3xl font-black text-dark-slate dark:text-white">PHOTOS OF YOUR ACNE</h2>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                      Please upload at least 2 pictures of your Acne. You can use your mobile phone camera. One picture
                      should be a close up of your Acne and one should be an overview picture. You can add an additional
                      2 pictures from different angles if you wish.
                    </p>

                    <div className="mt-8 space-y-7">
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">
                          1. Please upload a close up image of your Acne.
                        </p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                          Please make sure that the image is focused and the Acne is clear in the image.
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) => setCloseUpPhoto(event.target.files?.[0] ?? null)}
                          className="mt-3 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-primary/90 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">
                          2. Please upload an image that is an overview of your Acne.
                        </p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                          Please make sure that the image is focused and the Acne is clear in the image.
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) => setOverviewPhoto(event.target.files?.[0] ?? null)}
                          className="mt-3 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-primary/90 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">
                          3. Would you like to upload more photos of your Acne?
                        </p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={() => setUploadMorePhotos("Yes")}
                            className={optionButtonClass(uploadMorePhotos === "Yes")}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setUploadMorePhotos("No");
                              setExtraPhoto1(null);
                              setExtraPhoto2(null);
                            }}
                            className={optionButtonClass(uploadMorePhotos === "No")}
                          >
                            No
                          </button>
                        </div>
                      </div>

                      {uploadMorePhotos === "Yes" && (
                        <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
                          <div>
                            <p className="font-black text-dark-slate dark:text-white">Additional photo 1</p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(event) => setExtraPhoto1(event.target.files?.[0] ?? null)}
                              className="mt-3 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-primary/90 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <p className="font-black text-dark-slate dark:text-white">Additional photo 2 (optional)</p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(event) => setExtraPhoto2(event.target.files?.[0] ?? null)}
                              className="mt-3 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-primary/90 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {currentStep === 4 && (
                  <>
                    <h2 className="mt-2 text-3xl font-black text-dark-slate dark:text-white">PERSONAL MEDICAL HISTORY</h2>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                      In this section, we just need you to answer a few questions about your medical history.
                    </p>

                    <div className="mt-8 space-y-7">
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">
                          1. Have you ever suffered from other skin problems?
                        </p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={() => setOtherSkinProblemsHistory("Yes, I have")}
                            className={optionButtonClass(otherSkinProblemsHistory === "Yes, I have")}
                          >
                            Yes, I have
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setOtherSkinProblemsHistory("No, I have not");
                              setSkinProblems([]);
                              setSkinProblemsOtherDescription("");
                              setSkinProblemsYesDetails("");
                            }}
                            className={optionButtonClass(otherSkinProblemsHistory === "No, I have not")}
                          >
                            No, I have not
                          </button>
                        </div>
                      </div>

                      {otherSkinProblemsHistory === "Yes, I have" && (
                        <div>
                          <p className="font-black text-dark-slate dark:text-white">
                            2. Please select the skin problems you have suffered from.
                          </p>
                          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            Select &quot;Other&quot; if your condition is not listed.
                          </p>
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            {["Dermatitis", "Eczema", "Rosacea", "Other"].map((condition) => (
                              <button
                                key={condition}
                                type="button"
                                onClick={() => toggleListValue(skinProblems, setSkinProblems, condition)}
                                className={optionButtonClass(skinProblems.includes(condition))}
                              >
                                {condition}
                              </button>
                            ))}
                          </div>
                          {skinProblems.includes("Other") && (
                            <input
                              type="text"
                              value={skinProblemsOtherDescription}
                              onChange={(event) => setSkinProblemsOtherDescription(event.target.value)}
                              className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                              placeholder="Please describe your other skin problem"
                            />
                          )}
                          <textarea
                            value={skinProblemsYesDetails}
                            onChange={(event) => setSkinProblemsYesDetails(event.target.value)}
                            className="mt-3 min-h-[120px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                            placeholder="Please give as much details as possible"
                          />
                        </div>
                      )}

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">
                          {showSkinProblemsQuestion ? "3" : "2"}. Have you any history of Kidney/Urinary System Problems?
                        </p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={() => setKidneyUrinaryHistory("Yes, I have")}
                            className={optionButtonClass(kidneyUrinaryHistory === "Yes, I have")}
                          >
                            Yes, I have
                          </button>
                          <button
                            type="button"
                            onClick={() => setKidneyUrinaryHistory("No, I have not")}
                            className={optionButtonClass(kidneyUrinaryHistory === "No, I have not")}
                          >
                            No, I have not
                          </button>
                        </div>
                        {kidneyUrinaryHistory === "Yes, I have" && (
                          <textarea
                            value={kidneyUrinaryDetails}
                            onChange={(event) => setKidneyUrinaryDetails(event.target.value)}
                            className="mt-3 min-h-[120px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                            placeholder="Please give as much details as possible"
                          />
                        )}
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">
                          {showSkinProblemsQuestion ? "4" : "3"}. Have you any history of Digestive System problems, including inflammation of the bowel/ diarrhoea?
                        </p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={() => setDigestiveHistory("Yes, I have")}
                            className={optionButtonClass(digestiveHistory === "Yes, I have")}
                          >
                            Yes, I have
                          </button>
                          <button
                            type="button"
                            onClick={() => setDigestiveHistory("No, I have not")}
                            className={optionButtonClass(digestiveHistory === "No, I have not")}
                          >
                            No, I have not
                          </button>
                        </div>
                        {digestiveHistory === "Yes, I have" && (
                          <textarea
                            value={digestiveDetails}
                            onChange={(event) => setDigestiveDetails(event.target.value)}
                            className="mt-3 min-h-[120px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                            placeholder="Please give as much details as possible"
                          />
                        )}
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">
                          {showSkinProblemsQuestion
                            ? "5"
                            : "4"}
                          . Have you any conditions that affect your nervous system?
                        </p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={() => setNervousSystemHistory("Yes, I have")}
                            className={optionButtonClass(nervousSystemHistory === "Yes, I have")}
                          >
                            Yes, I have
                          </button>
                          <button
                            type="button"
                            onClick={() => setNervousSystemHistory("No, I have not")}
                            className={optionButtonClass(nervousSystemHistory === "No, I have not")}
                          >
                            No, I have not
                          </button>
                        </div>
                        {nervousSystemHistory === "Yes, I have" && (
                          <textarea
                            value={nervousSystemDetails}
                            onChange={(event) => setNervousSystemDetails(event.target.value)}
                            className="mt-3 min-h-[120px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                            placeholder="Please give as much details as possible"
                          />
                        )}
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">
                          {showSkinProblemsQuestion
                            ? "6"
                            : "5"}
                          . Have you any conditions that affects joints, including systemic lupus erythematous?
                        </p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={() => setJointConditionsHistory("Yes, I have")}
                            className={optionButtonClass(jointConditionsHistory === "Yes, I have")}
                          >
                            Yes, I have
                          </button>
                          <button
                            type="button"
                            onClick={() => setJointConditionsHistory("No, I have not")}
                            className={optionButtonClass(jointConditionsHistory === "No, I have not")}
                          >
                            No, I have not
                          </button>
                        </div>
                        {jointConditionsHistory === "Yes, I have" && (
                          <textarea
                            value={jointConditionsDetails}
                            onChange={(event) => setJointConditionsDetails(event.target.value)}
                            className="mt-3 min-h-[120px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                            placeholder="Please give as much details as possible"
                          />
                        )}
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 5 && (
                  <>
                    <h2 className="mt-2 text-3xl font-black text-dark-slate dark:text-white">FAMILY MEDICAL HISTORY</h2>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                      Knowing your immediate family medical history can help your doctor get a better understanding of your
                      current health and also help make a more accurate assessment.
                    </p>

                    <div className="mt-8 space-y-7">
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">1. Do you have a family history of Acne?</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={() => setFamilyHistoryAcne("Yes")}
                            className={optionButtonClass(familyHistoryAcne === "Yes")}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => setFamilyHistoryAcne("No")}
                            className={optionButtonClass(familyHistoryAcne === "No")}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 6 && (
                  <>
                    <h2 className="mt-2 text-3xl font-black text-dark-slate dark:text-white">MEDICATION</h2>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                      Detail any medication, prescribed or not, that you are taking so your doctor can be better informed
                      prior to your application.
                    </p>

                    <div className="mt-8 space-y-7">
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">1. Are you currently taking any prescribed medications?</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                          Please include any prescribed inhalers that you are taking.
                        </p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={() => setPrescribedMedications("Yes, I am")}
                            className={optionButtonClass(prescribedMedications === "Yes, I am")}
                          >
                            Yes, I am
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPrescribedMedications("No, I am not");
                              setPrescribedMedicationsDetails("");
                            }}
                            className={optionButtonClass(prescribedMedications === "No, I am not")}
                          >
                            No, I am not
                          </button>
                        </div>
                        {prescribedMedications === "Yes, I am" && (
                          <div className="mt-4">
                            <p className="font-black text-dark-slate dark:text-white">
                              2. Please detail any prescribed medications or inhalers you are taking.
                            </p>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                              Give as much detail as you can including dosages.
                            </p>
                            <textarea
                              value={prescribedMedicationsDetails}
                              onChange={(event) => setPrescribedMedicationsDetails(event.target.value)}
                              className="mt-3 min-h-[120px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                              placeholder="Please provide prescribed medication details"
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">
                          {prescribedMedications === "Yes, I am" ? "3" : "2"}. Are you currently taking any non-prescribed medications, vitamin supplements, over the counter or herbal remedies?
                        </p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={() => setNonPrescribedMedications("Yes, I am")}
                            className={optionButtonClass(nonPrescribedMedications === "Yes, I am")}
                          >
                            Yes, I am
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setNonPrescribedMedications("No, I am not");
                              setNonPrescribedSelections([]);
                              setNonPrescribedOther("");
                            }}
                            className={optionButtonClass(nonPrescribedMedications === "No, I am not")}
                          >
                            No, I am not
                          </button>
                        </div>
                        {nonPrescribedMedications === "Yes, I am" && (
                          <div className="mt-4">
                            <p className="font-black text-dark-slate dark:text-white">
                              {(prescribedMedications === "Yes, I am" ? 4 : 3)}. Please select the supplements, over the counter or herbal remedies you are taking.
                            </p>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                              Select other if your choice is not listed.
                            </p>
                            <div className="mt-3 grid gap-3 sm:grid-cols-3">
                              {[
                                "MULTIVITAMIN/MINERAL",
                                "CALCIUM",
                                "ECHINACEA",
                                "FOLIC ACID",
                                "IRON",
                                "PROTEIN SUPPLEMENT",
                                "ST. JOHN'S WORT",
                                "VITAMIN B",
                                "VITAMIN D",
                                "NATURAL SLEEPING AID",
                                "OTHER",
                              ].map((supplement) => (
                                <button
                                  key={supplement}
                                  type="button"
                                  onClick={() => toggleListValue(nonPrescribedSelections, setNonPrescribedSelections, supplement)}
                                  className={optionButtonClass(nonPrescribedSelections.includes(supplement))}
                                >
                                  {supplement}
                                </button>
                              ))}
                            </div>
                            {nonPrescribedSelections.includes("OTHER") && (
                              <input
                                type="text"
                                value={nonPrescribedOther}
                                onChange={(event) => setNonPrescribedOther(event.target.value)}
                                className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                placeholder="Please specify other supplement/remedy"
                              />
                            )}
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">
                          {(prescribedMedications === "Yes, I am" ? 1 : 0) + (nonPrescribedMedications === "Yes, I am" ? 1 : 0) + 3}. Are you currently taking any recreational drugs?
                        </p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                          This information will help your doctor make an accurate medical assessment.
                        </p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={() => setRecreationalDrugs("Yes, I am")}
                            className={optionButtonClass(recreationalDrugs === "Yes, I am")}
                          >
                            Yes, I am
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRecreationalDrugs("No, I am not");
                              setRecreationalDrugsDetails("");
                            }}
                            className={optionButtonClass(recreationalDrugs === "No, I am not")}
                          >
                            No, I am not
                          </button>
                        </div>
                        {recreationalDrugs === "Yes, I am" && (
                          <div className="mt-4">
                            <p className="font-black text-dark-slate dark:text-white">
                              {(prescribedMedications === "Yes, I am" ? 1 : 0) +
                                (nonPrescribedMedications === "Yes, I am" ? 1 : 0) +
                                4}
                              . Please detail any recreational drugs you are taking.
                            </p>
                            <textarea
                              value={recreationalDrugsDetails}
                              onChange={(event) => setRecreationalDrugsDetails(event.target.value)}
                              className="mt-3 min-h-[120px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                              placeholder="Please provide details"
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">
                          {(prescribedMedications === "Yes, I am" ? 1 : 0) +
                            (nonPrescribedMedications === "Yes, I am" ? 1 : 0) +
                            (recreationalDrugs === "Yes, I am" ? 1 : 0) +
                            4}
                          . Have you taken any antibiotics in the past 6 weeks, including antibiotics for Acne?
                        </p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={() => setRecentAntibiotics("Yes, I have")}
                            className={optionButtonClass(recentAntibiotics === "Yes, I have")}
                          >
                            Yes, I have
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRecentAntibiotics("No, I have not");
                              setRecentAntibioticsDetails("");
                            }}
                            className={optionButtonClass(recentAntibiotics === "No, I have not")}
                          >
                            No, I have not
                          </button>
                        </div>
                        {recentAntibiotics === "Yes, I have" && (
                          <div className="mt-4">
                            <p className="font-black text-dark-slate dark:text-white">
                              {(prescribedMedications === "Yes, I am" ? 1 : 0) +
                                (nonPrescribedMedications === "Yes, I am" ? 1 : 0) +
                                (recreationalDrugs === "Yes, I am" ? 1 : 0) +
                                5}
                              . Please give as much detail as possible
                            </p>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                              Please give details about medicine name, duration of treatment.
                            </p>
                            <textarea
                              value={recentAntibioticsDetails}
                              onChange={(event) => setRecentAntibioticsDetails(event.target.value)}
                              className="mt-3 min-h-[120px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                              placeholder="Please list the antibiotics taken in the past 6 weeks"
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">
                          {(prescribedMedications === "Yes, I am" ? 1 : 0) +
                            (nonPrescribedMedications === "Yes, I am" ? 1 : 0) +
                            (recreationalDrugs === "Yes, I am" ? 1 : 0) +
                            (recentAntibiotics === "Yes, I have" ? 1 : 0) +
                            5}
                          . Any other medical information relevant to your treatment request that you think our Doctor should consider?
                        </p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={() => setOtherMedicalInfo("Yes")}
                            className={optionButtonClass(otherMedicalInfo === "Yes")}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setOtherMedicalInfo("No");
                              setOtherMedicalInfoDetails("");
                            }}
                            className={optionButtonClass(otherMedicalInfo === "No")}
                          >
                            No
                          </button>
                        </div>
                        {otherMedicalInfo === "Yes" && (
                          <div className="mt-4">
                            <p className="font-black text-dark-slate dark:text-white">
                              {(prescribedMedications === "Yes, I am" ? 1 : 0) +
                                (nonPrescribedMedications === "Yes, I am" ? 1 : 0) +
                                (recreationalDrugs === "Yes, I am" ? 1 : 0) +
                                (recentAntibiotics === "Yes, I have" ? 1 : 0) +
                                6}
                              . Please provide details
                            </p>
                            <textarea
                              value={otherMedicalInfoDetails}
                              onChange={(event) => setOtherMedicalInfoDetails(event.target.value)}
                              className="mt-3 min-h-[120px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                              placeholder="Please provide additional relevant medical information"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 7 && (
                  <>
                    <h2 className="mt-2 text-3xl font-black text-dark-slate dark:text-white">ALLERGIES</h2>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                      If you have any form of allergy the information you provide will be of major assistance to the
                      doctor in helping you.
                    </p>

                    <div className="mt-8 space-y-7">
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">1. Have you allergies to medicines or tablets?</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">e.g. Penicillin</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={() => setMedicineAllergies("Yes")}
                            className={optionButtonClass(medicineAllergies === "Yes")}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setMedicineAllergies("No");
                              setMedicineAllergyDetails("");
                            }}
                            className={optionButtonClass(medicineAllergies === "No")}
                          >
                            No
                          </button>
                        </div>
                      </div>

                      {medicineAllergies === "Yes" && (
                        <div>
                          <p className="font-black text-dark-slate dark:text-white">
                            2. Please provide more information about the allergies you have to medicines or tablets.
                          </p>
                          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            It is very important that your doctor has this information before they make their assessment.
                          </p>
                          <textarea
                            value={medicineAllergyDetails}
                            onChange={(event) => setMedicineAllergyDetails(event.target.value)}
                            className="mt-3 min-h-[120px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                            placeholder="Please provide medicine/tablet allergy details"
                          />
                        </div>
                      )}

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">
                          {medicineAllergies === "Yes" ? "3" : "2"}. Have you any other allergies in general?
                        </p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">e.g. Hay fever, milk etc.</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={() => setGeneralAllergies("Yes")}
                            className={optionButtonClass(generalAllergies === "Yes")}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setGeneralAllergies("No");
                              setGeneralAllergySelections([]);
                              setGeneralAllergyOther("");
                            }}
                            className={optionButtonClass(generalAllergies === "No")}
                          >
                            No
                          </button>
                        </div>
                      </div>

                      {generalAllergies === "Yes" && (
                        <div>
                          <p className="font-black text-dark-slate dark:text-white">
                            {medicineAllergies === "Yes" ? "4" : "3"}. What are you allergic to?
                          </p>
                          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Please select all that apply.</p>
                          <div className="mt-3 grid gap-3 sm:grid-cols-3">
                            {[
                              "PEANUTS",
                              "HAY FEVER",
                              "DUST MITES",
                              "MILK",
                              "EGGS",
                              "FISH",
                              "SHELLFISH",
                              "TREENUTS",
                              "WHEAT",
                              "SOYA",
                              "PET DANDER (HAIR / FUR)",
                              "OTHER",
                            ].map((allergy) => (
                              <button
                                key={allergy}
                                type="button"
                                onClick={() => toggleListValue(generalAllergySelections, setGeneralAllergySelections, allergy)}
                                className={optionButtonClass(generalAllergySelections.includes(allergy))}
                              >
                                {allergy}
                              </button>
                            ))}
                          </div>
                          {generalAllergySelections.includes("OTHER") && (
                            <input
                              type="text"
                              value={generalAllergyOther}
                              onChange={(event) => setGeneralAllergyOther(event.target.value)}
                              className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                              placeholder="Please specify other allergy"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {currentStep === 8 && (
                  <>
                    <h2 className="mt-2 text-3xl font-black text-dark-slate dark:text-white">MORE ABOUT YOU</h2>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                      In this section we ask some questions about your physical characteristics and measurements.
                      Answering these questions can help your doctor in making a more accurate assessment.
                    </p>

                    <div className="mt-8 space-y-7">
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">1. What is your birth sex?</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-3">
                          <button type="button" onClick={() => setAboutBirthSex("Female")} className={optionButtonClass(aboutBirthSex === "Female")}>Female</button>
                          <button type="button" onClick={() => setAboutBirthSex("Male")} className={optionButtonClass(aboutBirthSex === "Male")}>Male</button>
                          <button type="button" onClick={() => setAboutBirthSex("Other")} className={optionButtonClass(aboutBirthSex === "Other")}>Other</button>
                        </div>
                      </div>

                      {aboutBirthSex === "Female" && (
                        <>
                          <div>
                            <p className="font-black text-dark-slate dark:text-white">2. Are you breastfeeding at the moment?</p>
                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                              <button type="button" onClick={() => setBreastfeedingNow("Yes")} className={optionButtonClass(breastfeedingNow === "Yes")}>Yes</button>
                              <button type="button" onClick={() => setBreastfeedingNow("No")} className={optionButtonClass(breastfeedingNow === "No")}>No</button>
                            </div>
                          </div>

                          <div>
                            <p className="font-black text-dark-slate dark:text-white">3. Are you pregnant?</p>
                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setPregnantNow("Yes");
                                  setPlanningPregnancy("");
                                }}
                                className={optionButtonClass(pregnantNow === "Yes")}
                              >
                                Yes
                              </button>
                              <button type="button" onClick={() => setPregnantNow("No")} className={optionButtonClass(pregnantNow === "No")}>No</button>
                            </div>
                          </div>

                          {pregnantNow === "No" && (
                            <div>
                              <p className="font-black text-dark-slate dark:text-white">4. Are you planning to become pregnant?</p>
                              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                <button type="button" onClick={() => setPlanningPregnancy("Yes")} className={optionButtonClass(planningPregnancy === "Yes")}>Yes</button>
                                <button type="button" onClick={() => setPlanningPregnancy("No")} className={optionButtonClass(planningPregnancy === "No")}>No</button>
                              </div>
                            </div>
                          )}

                          <div>
                            <p className="font-black text-dark-slate dark:text-white">
                              {pregnantNow === "No" ? "5" : "4"}. Are you using any form of contraception?
                            </p>
                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                              <button type="button" onClick={() => setUsingContraception("Yes, I am")} className={optionButtonClass(usingContraception === "Yes, I am")}>Yes, I am</button>
                              <button
                                type="button"
                                onClick={() => {
                                  setUsingContraception("No, I am not");
                                  setRegularContraception("");
                                  setRegularContraceptionOther("");
                                }}
                                className={optionButtonClass(usingContraception === "No, I am not")}
                              >
                                No, I am not
                              </button>
                            </div>
                          </div>

                          {usingContraception === "Yes, I am" && (
                            <div>
                              <p className="font-black text-dark-slate dark:text-white">
                                {pregnantNow === "No" ? "6" : "5"}. Please select your regular contraception
                              </p>
                              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                {["Combined Pill/Patch", "Implant/Injection", "Mini Pill", "Other"].map((option) => (
                                  <button
                                    key={option}
                                    type="button"
                                    onClick={() => setRegularContraception(option)}
                                    className={optionButtonClass(regularContraception === option)}
                                  >
                                    {option}
                                  </button>
                                ))}
                              </div>
                              {regularContraception === "Other" && (
                                <input
                                  type="text"
                                  value={regularContraceptionOther}
                                  onChange={(event) => setRegularContraceptionOther(event.target.value)}
                                  className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                  placeholder="Please specify your regular contraception"
                                />
                              )}
                            </div>
                          )}
                        </>
                      )}

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">
                          {aboutBirthSex === "Female"
                            ? pregnantNow === "No"
                              ? usingContraception === "Yes, I am"
                                ? "7"
                                : "6"
                              : usingContraception === "Yes, I am"
                              ? "6"
                              : "5"
                            : "2"}
                          . Can you tell us your height?
                        </p>
                        {heightUnit === "imperial" ? (
                          <>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                              I am {heightFeet || "0"}ft {heightInches || "0"}in or 0cm tall
                            </p>
                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                              <input
                                type="number"
                                min="0"
                                value={heightFeet}
                                onChange={(event) => setHeightFeet(event.target.value)}
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                placeholder="ft"
                              />
                              <input
                                type="number"
                                min="0"
                                value={heightInches}
                                onChange={(event) => setHeightInches(event.target.value)}
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                placeholder="in"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => setHeightUnit("metric")}
                              className="mt-3 text-sm font-semibold text-primary hover:underline"
                            >
                              Click to enter as centimeters
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="mt-3">
                              <input
                                type="number"
                                min="0"
                                value={heightCmAbout}
                                onChange={(event) => setHeightCmAbout(event.target.value)}
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                placeholder="cm"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => setHeightUnit("imperial")}
                              className="mt-3 text-sm font-semibold text-primary hover:underline"
                            >
                              Click to enter as feet/inches
                            </button>
                          </>
                        )}
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">
                          {aboutBirthSex === "Female"
                            ? pregnantNow === "No"
                              ? usingContraception === "Yes, I am"
                                ? "8"
                                : "7"
                              : usingContraception === "Yes, I am"
                              ? "7"
                              : "6"
                            : "3"}
                          . Can you tell us your current weight?
                        </p>
                        {weightUnit === "imperial" ? (
                          <>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                              I weigh {weightStone || "0"}st {weightPounds || "0"}lb or 0kg
                            </p>
                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                              <input
                                type="number"
                                min="0"
                                value={weightStone}
                                onChange={(event) => setWeightStone(event.target.value)}
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                placeholder="st"
                              />
                              <input
                                type="number"
                                min="0"
                                value={weightPounds}
                                onChange={(event) => setWeightPounds(event.target.value)}
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                placeholder="lb"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => setWeightUnit("metric")}
                              className="mt-3 text-sm font-semibold text-primary hover:underline"
                            >
                              Click to enter as kg
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="mt-3">
                              <input
                                type="number"
                                min="0"
                                value={weightKgAbout}
                                onChange={(event) => setWeightKgAbout(event.target.value)}
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                placeholder="kg"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => setWeightUnit("imperial")}
                              className="mt-3 text-sm font-semibold text-primary hover:underline"
                            >
                              Click to enter as st/lb
                            </button>
                          </>
                        )}
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">
                          {aboutBirthSex === "Female"
                            ? pregnantNow === "No"
                              ? usingContraception === "Yes, I am"
                                ? "9"
                                : "8"
                              : usingContraception === "Yes, I am"
                              ? "8"
                              : "7"
                            : "4"}
                          . Do you know your most recent blood pressure reading?
                        </p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => setKnowsBloodPressure("Yes")} className={optionButtonClass(knowsBloodPressure === "Yes")}>Yes</button>
                          <button
                            type="button"
                            onClick={() => {
                              setKnowsBloodPressure("No");
                              setBpLastChecked("");
                              setBpSysReading("");
                              setBpDiaReading("");
                            }}
                            className={optionButtonClass(knowsBloodPressure === "No")}
                          >
                            No
                          </button>
                        </div>
                      </div>

                      {knowsBloodPressure === "Yes" && (
                        <>
                          <div>
                            <p className="font-black text-dark-slate dark:text-white">
                              {aboutBirthSex === "Female"
                                ? pregnantNow === "No"
                                  ? usingContraception === "Yes, I am"
                                    ? "10"
                                    : "9"
                                  : usingContraception === "Yes, I am"
                                  ? "9"
                                  : "8"
                                : "5"}
                              . When did you last have your blood pressure taken?
                            </p>
                            <div className="mt-3 grid gap-3 sm:grid-cols-3">
                              {["IN THE LAST 6 MONTHS", "MORE THAN 6 MONTHS", "I CANNOT REMEMBER"].map((option) => (
                                <button key={option} type="button" onClick={() => setBpLastChecked(option)} className={optionButtonClass(bpLastChecked === option)}>
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="font-black text-dark-slate dark:text-white">
                              {aboutBirthSex === "Female"
                                ? pregnantNow === "No"
                                  ? usingContraception === "Yes, I am"
                                    ? "11"
                                    : "10"
                                  : usingContraception === "Yes, I am"
                                  ? "10"
                                  : "9"
                                : "6"}
                              . Please use the input below to enter your blood pressure
                            </p>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">My BP is over or ( / mmHg)</p>
                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                              <input
                                type="number"
                                min="0"
                                value={bpSysReading}
                                onChange={(event) => setBpSysReading(event.target.value)}
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                placeholder="SYS Reading"
                              />
                              <input
                                type="number"
                                min="0"
                                value={bpDiaReading}
                                onChange={(event) => setBpDiaReading(event.target.value)}
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                                placeholder="DIA Reading"
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}

                {currentStep === 9 && (
                  <>
                    <h2 className="mt-2 text-3xl font-black text-dark-slate dark:text-white">LIFESTYLE</h2>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                      In this section you can provide information about your lifestyle. This information can help your
                      doctor get a better understanding of your current state of health.
                    </p>

                    <div className="mt-8 space-y-7">
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">1. Are you or have you ever been a smoker?</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => setSmokerHistory("Yes, I have")} className={optionButtonClass(smokerHistory === "Yes, I have")}>Yes, I have</button>
                          <button
                            type="button"
                            onClick={() => {
                              setSmokerHistory("No, I have not");
                              setCurrentlySmokes("");
                            }}
                            className={optionButtonClass(smokerHistory === "No, I have not")}
                          >
                            No, I have not
                          </button>
                        </div>
                      </div>

                      {smokerHistory === "Yes, I have" && (
                        <div>
                          <p className="font-black text-dark-slate dark:text-white">2. Do you currently smoke?</p>
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            <button type="button" onClick={() => setCurrentlySmokes("Yes, I do")} className={optionButtonClass(currentlySmokes === "Yes, I do")}>Yes, I do</button>
                            <button
                              type="button"
                              onClick={() => {
                                setCurrentlySmokes("No, I do not");
                                setSmokesPerDay("");
                              }}
                              className={optionButtonClass(currentlySmokes === "No, I do not")}
                            >
                              No, I do not
                            </button>
                          </div>
                        </div>
                      )}

                      {smokerHistory === "Yes, I have" && currentlySmokes === "Yes, I do" && (
                        <div>
                          <p className="font-black text-dark-slate dark:text-white">3. How many do you smoke per day?</p>
                          <div className="mt-3 grid gap-3 sm:grid-cols-3">
                            {["0-4", "5-10", "11-20", "21-40", "41 OR MORE", "PREFER NOT TO SAY"].map((option) => (
                              <button key={option} type="button" onClick={() => setSmokesPerDay(option)} className={optionButtonClass(smokesPerDay === option)}>
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">
                          {(smokerHistory === "Yes, I have" ? 2 : 1) + (smokerHistory === "Yes, I have" && currentlySmokes === "Yes, I do" ? 1 : 0)}. Do you ever drink alcohol?
                        </p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => setDrinksAlcohol("Yes")} className={optionButtonClass(drinksAlcohol === "Yes")}>Yes</button>
                          <button
                            type="button"
                            onClick={() => {
                              setDrinksAlcohol("No");
                              setAlcoholUnitsPerWeek("");
                            }}
                            className={optionButtonClass(drinksAlcohol === "No")}
                          >
                            No
                          </button>
                        </div>
                      </div>

                      {drinksAlcohol === "Yes" && (
                        <div>
                          <p className="font-black text-dark-slate dark:text-white">
                            {(smokerHistory === "Yes, I have" ? 3 : 2) + (smokerHistory === "Yes, I have" && currentlySmokes === "Yes, I do" ? 1 : 0)}. On average, how many units do you drink per week?
                          </p>
                          <div className="mt-3 grid gap-3 sm:grid-cols-3">
                            {["0-5", "6-11", "12-17", "18-24", "25 OR MORE"].map((option) => (
                              <button key={option} type="button" onClick={() => setAlcoholUnitsPerWeek(option)} className={optionButtonClass(alcoholUnitsPerWeek === option)}>
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">
                          {(smokerHistory === "Yes, I have" ? 2 : 1) +
                            (smokerHistory === "Yes, I have" && currentlySmokes === "Yes, I do" ? 1 : 0) +
                            (drinksAlcohol === "Yes" ? 1 : 0) +
                            1}
                          . How often do you engage in health-benefiting exercise?
                        </p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                          This includes any activity that makes you sweat and causes heavier breathing. Please select the closest match.
                        </p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {[
                            "DAILY",
                            "THREE TIMES A WEEK",
                            "ONCE A WEEK",
                            "ONCE A MONTH",
                            "SELDOM",
                            "NEVER",
                            "CANNOT EXERCISE",
                          ].map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => setExerciseFrequency(option)}
                              className={optionButtonClass(exerciseFrequency === option)}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                      {exerciseFrequency === "CANNOT EXERCISE" && (
                        <div>
                          <p className="font-black text-dark-slate dark:text-white">
                            {(smokerHistory === "Yes, I have" ? 2 : 1) +
                              (smokerHistory === "Yes, I have" && currentlySmokes === "Yes, I do" ? 1 : 0) +
                              (drinksAlcohol === "Yes" ? 1 : 0) +
                              2}
                            . Please specify why you cannot participate in regular exercise.
                          </p>
                          <textarea
                            value={cannotExerciseReason}
                            onChange={(event) => setCannotExerciseReason(event.target.value)}
                            className="mt-3 min-h-[120px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                            placeholder="Please provide details"
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}

                {currentStep === 10 && (
                  <>
                    <h2 className="mt-2 text-3xl font-black text-dark-slate dark:text-white">CONFIRMATION</h2>
                    {submitted ? (
                      <div className="mt-8 rounded-2xl border border-emerald-300 bg-emerald-50 p-6">
                        <p className="text-2xl font-black text-emerald-900">Request submitted</p>
                        <p className="mt-2 text-sm text-emerald-900">
                          Your acne treatment questionnaire has been submitted for doctor review.
                        </p>
                      </div>
                    ) : (
                      <div className="mt-8 space-y-7">
                        <div>
                          <p className="font-black text-dark-slate dark:text-white">1. Medication can interact with many prescribed, over the counter and recreational drugs.</p>
                          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            Please consider your responses and please answer honestly and clearly. Any and all information that you provide in this questionnaire is protected by the exact same patient-doctor confidentiality you would expect from seeing a doctor face to face. Do you confirm that you have read and understood this and your answers are fully correct and true?
                          </p>
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            <button type="button" onClick={() => setConfirmInformationTrue("Yes")} className={optionButtonClass(confirmInformationTrue === "Yes")}>Yes</button>
                            <button type="button" onClick={() => setConfirmInformationTrue("No")} className={optionButtonClass(confirmInformationTrue === "No")}>No</button>
                          </div>
                        </div>

                        <div>
                          <p className="font-black text-dark-slate dark:text-white">2. Please confirm that this medication, if prescribed, is for your use only.</p>
                          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            Do you confirm that the medication, if prescribed, if for your use only?
                          </p>
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            <button type="button" onClick={() => setConfirmOwnUseOnly("Yes")} className={optionButtonClass(confirmOwnUseOnly === "Yes")}>Yes</button>
                            <button type="button" onClick={() => setConfirmOwnUseOnly("No")} className={optionButtonClass(confirmOwnUseOnly === "No")}>No</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="mt-10 flex flex-wrap items-center gap-3">
                  {currentStep > 1 && !submitted && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-black text-slate-700 transition hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-200"
                    >
                      Back
                    </button>
                  )}
                  {currentStep < 10 && (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!canGoNext}
                      className="rounded-xl bg-primary px-5 py-3 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:bg-primary/50"
                    >
                      Next
                    </button>
                  )}
                  {currentStep === 10 && !submitted && (
                    <button
                      type="button"
                      onClick={submitQuestionnaire}
                      disabled={!canSubmit}
                      className="rounded-xl bg-primary px-5 py-3 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:bg-primary/50"
                    >
                      Submit Request
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
                Acne <span className="text-primary">Treatment</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-6 leading-relaxed">
                Ireland&apos;s award-winning online doctor service.
              </p>
            </div>

            <div className="rounded-[36px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
              <h3 className="text-2xl font-black mb-5">Treatments that we can provide</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Acne can affect people at any age. We prescribe by generic medicine name to support maximum treatment
                availability. Please check your dispensed prescription before leaving the pharmacy as changes cannot be
                made afterward.
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-sm font-bold text-dark-slate dark:text-white">Topical Treatments (Creams and Gels)</p>
                <p className="text-sm font-bold text-dark-slate dark:text-white">
                  Oral Tetracycline Antibiotics (Tablets)
                </p>
              </div>
              <div className="space-y-3 mt-5">
                {[
                  { label: "Request Prescription", price: "EUR25", active: true, href: "#" },
                  { label: "Online Consultation", price: "EUR39+", active: false, href: "/consultation" },
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
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      Please provide 2 clear, up-to-date photographs of your acne.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      We can prescribe topical treatments alone, or combined with oral antibiotic treatment when
                      clinically appropriate.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      Where appropriate, a 12-week oral antibiotic course may be prescribed alongside a non-antibiotic
                      topical treatment that can continue after oral treatment ends.
                    </p>
                  </li>
                </ul>
              </div>
              <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-black mb-6">What&apos;s excluded with our service</h3>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      Not suitable for severe acne with painful lumps or scarring.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      We do not prescribe oral antibiotics with topical antibiotics, in line with guidelines.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      If you need dermatology referral support, use our Video Consultation service.
                    </p>
                  </li>
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

