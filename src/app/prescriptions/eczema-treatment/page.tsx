"use client";

import React, { useState } from "react";
import { beginPrescriptionCheckout } from '@/lib/serviceCheckout';
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2, ChevronDown, Clock, ShieldCheck, Users, XCircle } from "lucide-react";

const faqs = [
  "Who is the service suitable for?",
  "Who is the service not suitable for?",
  "What is eczema?",
  "What causes eczema?",
  "What are the most common types of eczema?",
  "What can trigger a flare of eczema?",
  "Are there things I can do to avoid a flare of my eczema symptoms?",
  "How is eczema treated?",
  "What is the best eczema cream (emollient) to use?",
  "What are topical corticosteriods?",
  "What are antihistamine tablets?",
  "What treatments are available via this service?",
  "I think my eczema might be infected, what should I do?",
  "What is eczema herpeticum?",
];

const excluded = [
  "You have not been diagnosed with eczema by a doctor.",
  "You require ongoing or long-term management of symptoms.",
  "You are requesting treatment for a child or another adult.",
  "You need treatment not listed on our application questionnaire.",
  "You are pregnant or breastfeeding.",
  "You are taking immunosuppressive medication.",
  "You are concerned your eczema is currently infected.",
  "You have had serious eczema complications, including prior hospital admission for bacterial/viral infection.",
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

export default function EczemaTreatmentPage() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [birthSex, setBirthSex] = useState("");
  const [pregnancyStatus, setPregnancyStatus] = useState("");
  const [diagnosedEczema, setDiagnosedEczema] = useState("");
  const [seekingProtopic, setSeekingProtopic] = useState("");
  const [immunosuppressantMeds, setImmunosuppressantMeds] = useState("");
  const [lookingForTretinoin, setLookingForTretinoin] = useState("");
  const [seriousComplications, setSeriousComplications] = useState("");
  const [forAnotherAdultOrChild, setForAnotherAdultOrChild] = useState("");
  const [possibleInfectionSymptoms, setPossibleInfectionSymptoms] = useState("");
  const [currentTreatments, setCurrentTreatments] = useState("");
  const [otherAffectedAreas, setOtherAffectedAreas] = useState("");
  const [eczemaDuration, setEczemaDuration] = useState("");
  const [eczemaLocations, setEczemaLocations] = useState<string[]>([]);
  const [eczemaSymptoms, setEczemaSymptoms] = useState<string[]>([]);
  const [symptomSeverity, setSymptomSeverity] = useState("");
  const [photosUploaded, setPhotosUploaded] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");
  const [medicineAllergies, setMedicineAllergies] = useState("");
  const [medicineAllergiesDetails, setMedicineAllergiesDetails] = useState("");
  const [regularMeds, setRegularMeds] = useState("");
  const [regularMedsDetails, setRegularMedsDetails] = useState("");
  const [smokerHistory, setSmokerHistory] = useState("");
  const [alcoholUse, setAlcoholUse] = useState("");
  const [exerciseFrequency, setExerciseFrequency] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [knowsBloodPressure, setKnowsBloodPressure] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [preferredPharmacy, setPreferredPharmacy] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [confirmAnswers, setConfirmAnswers] = useState("");
  const [confirmOwnUse, setConfirmOwnUse] = useState("");

  const optionButtonClass = (isSelected: boolean) =>
    `w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
      isSelected
        ? "border-primary bg-primary text-white"
        : "border-slate-200 bg-white text-dark-slate hover:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
    }`;

  const canGoNext =
    (currentStep === 1 &&
      birthSex &&
      (birthSex !== "Female" || pregnancyStatus) &&
      diagnosedEczema &&
      seekingProtopic &&
      immunosuppressantMeds &&
      lookingForTretinoin &&
      seriousComplications &&
      forAnotherAdultOrChild &&
      possibleInfectionSymptoms &&
      currentTreatments.trim().length > 0 &&
      otherAffectedAreas.trim().length > 0) ||
    (currentStep === 2 && eczemaDuration && eczemaLocations.length > 0 && eczemaSymptoms.length > 0 && symptomSeverity) ||
    (currentStep === 3 && photosUploaded) ||
    (currentStep === 4 &&
      medicalConditions &&
      medicineAllergies &&
      (medicineAllergies !== "Yes" || medicineAllergiesDetails.trim().length > 0) &&
      regularMeds &&
      (regularMeds !== "Yes" || regularMedsDetails.trim().length > 0)) ||
    (currentStep === 5 && smokerHistory && alcoholUse && exerciseFrequency) ||
    (currentStep === 6 &&
      heightCm.trim().length > 0 &&
      weightKg.trim().length > 0 &&
      knowsBloodPressure &&
      (knowsBloodPressure !== "Yes" || bloodPressure.trim().length > 0)) ||
    (currentStep === 7 && currentTreatments.trim().length > 0 && otherAffectedAreas.trim().length > 0) ||
    (currentStep === 8 && preferredPharmacy.trim().length > 0 && contactNumber.trim().length > 0) ||
    (currentStep === 9 && confirmAnswers && confirmOwnUse);
  const canSubmit = confirmAnswers === "Yes" && confirmOwnUse === "Yes";

  const startQuestionnaire = () => {
    setShowQuestionnaire(true);
    setCurrentStep(1);
    setSubmitted(false);
    setTimeout(() => {
      document.getElementById("eczema-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const nextStep = () => {
    if (!canGoNext || currentStep >= 9) return;
    setCurrentStep((prev) => prev + 1);
    setTimeout(() => {
      document.getElementById("eczema-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const prevStep = () => {
    if (currentStep <= 1) return;
    setCurrentStep((prev) => prev - 1);
    setTimeout(() => {
      document.getElementById("eczema-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };
    const submitQuestionnaire = () => {
    if (!canSubmit) return;
    beginPrescriptionCheckout({
      slug: 'eczema-treatment',
      serviceName: 'Eczema Treatment',
      payload: {
      birthSex,
      pregnancyStatus,
      diagnosedEczema,
      seekingProtopic,
      immunosuppressantMeds,
      lookingForTretinoin,
      seriousComplications,
      forAnotherAdultOrChild,
      possibleInfectionSymptoms,
      currentTreatments,
      otherAffectedAreas,
      eczemaDuration,
      eczemaLocations,
      eczemaSymptoms,
      symptomSeverity,
      photosUploaded,
      medicalConditions,
      medicineAllergies,
      medicineAllergiesDetails,
      regularMeds,
      regularMedsDetails,
      smokerHistory,
      alcoholUse,
      exerciseFrequency,
      heightCm,
      weightKg,
      knowsBloodPressure,
      bloodPressure,
      preferredPharmacy,
      contactNumber,
      confirmAnswers,
      confirmOwnUse,
      },
    });
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
          <section id="eczema-questionnaire" className="pt-28 pb-16">
            <div className="max-w-4xl mx-auto px-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-black uppercase tracking-wider text-primary">Suitability Check</p>
                <p className="mt-3 text-sm font-bold text-slate-600">Step {currentStep} / 9</p>

                {currentStep === 1 && (
                  <>
                    <h2 className="mt-2 text-3xl font-black text-dark-slate dark:text-white">Suitability Check</h2>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                      In this section you will answer questions to see if you are suitable for this treatment. Please
                      note: If you would like to speak to a GP, please book a video consultation.
                    </p>

                    <div className="mt-8 space-y-7">
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">1. What is your birth sex?</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-3">
                          <button type="button" onClick={() => { setBirthSex("Male"); setPregnancyStatus(""); }} className={optionButtonClass(birthSex === "Male")}>Male</button>
                          <button type="button" onClick={() => setBirthSex("Female")} className={optionButtonClass(birthSex === "Female")}>Female</button>
                          <button type="button" onClick={() => { setBirthSex("Other"); setPregnancyStatus(""); }} className={optionButtonClass(birthSex === "Other")}>Other</button>
                        </div>
                      </div>

                      {birthSex === "Female" && (
                        <div>
                          <p className="font-black text-dark-slate dark:text-white">2. Are you currently pregnant, trying to become pregnant or are you breastfeeding?</p>
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            <button type="button" onClick={() => setPregnancyStatus("Yes")} className={optionButtonClass(pregnancyStatus === "Yes")}>Yes</button>
                            <button type="button" onClick={() => setPregnancyStatus("No")} className={optionButtonClass(pregnancyStatus === "No")}>No</button>
                          </div>
                        </div>
                      )}

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">{birthSex === "Female" ? "3" : "2"}. Have you been diagnosed with eczema by a doctor in the past?</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => setDiagnosedEczema("Yes")} className={optionButtonClass(diagnosedEczema === "Yes")}>Yes</button>
                          <button type="button" onClick={() => setDiagnosedEczema("No")} className={optionButtonClass(diagnosedEczema === "No")}>No</button>
                        </div>
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">{birthSex === "Female" ? "4" : "3"}. Are you seeking a prescription for Protopic/Tacrolimus cream?</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Please note: if you are looking for a prescription for Protopic/Tacrolimus cream, you will need to contact your own GP as this is not provided for by our service.</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => setSeekingProtopic("Yes")} className={optionButtonClass(seekingProtopic === "Yes")}>Yes</button>
                          <button type="button" onClick={() => setSeekingProtopic("No")} className={optionButtonClass(seekingProtopic === "No")}>No</button>
                        </div>
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">{birthSex === "Female" ? "5" : "4"}. Are you taking any medications that lower your immune system?</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Medications that lower your immune system include: methotrexate and etanercept.</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => setImmunosuppressantMeds("Yes")} className={optionButtonClass(immunosuppressantMeds === "Yes")}>Yes</button>
                          <button type="button" onClick={() => setImmunosuppressantMeds("No")} className={optionButtonClass(immunosuppressantMeds === "No")}>No</button>
                        </div>
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">{birthSex === "Female" ? "6" : "5"}. Are you looking for products containing tretinoin?</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Products containing tretinoin are unlicensed in Ireland and are not available through this service.</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => setLookingForTretinoin("Yes")} className={optionButtonClass(lookingForTretinoin === "Yes")}>Yes</button>
                          <button type="button" onClick={() => setLookingForTretinoin("No")} className={optionButtonClass(lookingForTretinoin === "No")}>No</button>
                        </div>
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">{birthSex === "Female" ? "7" : "6"}. Have you had any serious complications of eczema at any time in the past?</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">A serious complication includes hospital admission for bacterial/viral infection or eczema complications.</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => setSeriousComplications("Yes")} className={optionButtonClass(seriousComplications === "Yes")}>Yes</button>
                          <button type="button" onClick={() => setSeriousComplications("No")} className={optionButtonClass(seriousComplications === "No")}>No</button>
                        </div>
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">{birthSex === "Female" ? "8" : "7"}. Are you looking to use this service for another adult or a child in your care?</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">If yes, this service is unsuitable. Adults must use their own account; children under 17 require video consultation.</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => setForAnotherAdultOrChild("Yes")} className={optionButtonClass(forAnotherAdultOrChild === "Yes")}>Yes</button>
                          <button type="button" onClick={() => setForAnotherAdultOrChild("No")} className={optionButtonClass(forAnotherAdultOrChild === "No")}>No</button>
                        </div>
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">{birthSex === "Female" ? "9" : "8"}. Do you have any symptoms that may indicate your eczema may be infected at the moment?</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Examples: fluid oozing, yellow crust, swollen/sore skin, feeling hot/shivery, generally unwell.</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => setPossibleInfectionSymptoms("Yes")} className={optionButtonClass(possibleInfectionSymptoms === "Yes")}>Yes</button>
                          <button type="button" onClick={() => setPossibleInfectionSymptoms("No")} className={optionButtonClass(possibleInfectionSymptoms === "No")}>No</button>
                        </div>
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">{birthSex === "Female" ? "10" : "9"}. What treatments are you currently using?</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Please give as many details as you can.</p>
                        <textarea value={currentTreatments} onChange={(e) => setCurrentTreatments(e.target.value)} className="mt-3 min-h-[110px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">{birthSex === "Female" ? "11" : "10"}. Please tell us which other areas are affected.</p>
                        <textarea value={otherAffectedAreas} onChange={(e) => setOtherAffectedAreas(e.target.value)} className="mt-3 min-h-[110px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <div className="mt-8 space-y-7">
                    <h2 className="text-3xl font-black text-dark-slate dark:text-white">Eczema Profile</h2>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">1. How long have you had eczema symptoms?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        {["Less than 6 months", "6-24 months", "More than 2 years"].map((opt) => (
                          <button key={opt} type="button" onClick={() => setEczemaDuration(opt)} className={optionButtonClass(eczemaDuration === opt)}>{opt}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">2. Which areas are affected?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        {["Hands", "Face", "Neck", "Arms", "Legs", "Trunk"].map((opt) => (
                          <button key={opt} type="button" onClick={() => setEczemaLocations((prev) => prev.includes(opt) ? prev.filter((v) => v !== opt) : [...prev, opt])} className={optionButtonClass(eczemaLocations.includes(opt))}>{opt}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">3. Which symptoms are present now?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        {["Itch", "Redness", "Dry skin", "Cracking", "Sleep disturbance"].map((opt) => (
                          <button key={opt} type="button" onClick={() => setEczemaSymptoms((prev) => prev.includes(opt) ? prev.filter((v) => v !== opt) : [...prev, opt])} className={optionButtonClass(eczemaSymptoms.includes(opt))}>{opt}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">4. Overall severity right now?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        {["Mild", "Moderate", "Severe"].map((opt) => (
                          <button key={opt} type="button" onClick={() => setSymptomSeverity(opt)} className={optionButtonClass(symptomSeverity === opt)}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="mt-8 space-y-7">
                    <h2 className="text-3xl font-black text-dark-slate dark:text-white">Photos</h2>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">Please confirm you can upload recent eczema photos for review.</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setPhotosUploaded("Yes")} className={optionButtonClass(photosUploaded === "Yes")}>Yes</button>
                        <button type="button" onClick={() => setPhotosUploaded("No")} className={optionButtonClass(photosUploaded === "No")}>No</button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="mt-8 space-y-7">
                    <h2 className="text-3xl font-black text-dark-slate dark:text-white">Medical Safety</h2>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">1. Do you have significant ongoing medical conditions?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setMedicalConditions("Yes")} className={optionButtonClass(medicalConditions === "Yes")}>Yes</button>
                        <button type="button" onClick={() => setMedicalConditions("No")} className={optionButtonClass(medicalConditions === "No")}>No</button>
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">2. Do you have allergies to any medicines?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setMedicineAllergies("Yes")} className={optionButtonClass(medicineAllergies === "Yes")}>Yes</button>
                        <button type="button" onClick={() => { setMedicineAllergies("No"); setMedicineAllergiesDetails(""); }} className={optionButtonClass(medicineAllergies === "No")}>No</button>
                      </div>
                      {medicineAllergies === "Yes" && <textarea value={medicineAllergiesDetails} onChange={(e) => setMedicineAllergiesDetails(e.target.value)} className="mt-3 min-h-[100px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm" placeholder="Please provide allergy details" />}
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">3. Are you taking regular prescribed medication?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setRegularMeds("Yes")} className={optionButtonClass(regularMeds === "Yes")}>Yes</button>
                        <button type="button" onClick={() => { setRegularMeds("No"); setRegularMedsDetails(""); }} className={optionButtonClass(regularMeds === "No")}>No</button>
                      </div>
                      {regularMeds === "Yes" && <textarea value={regularMedsDetails} onChange={(e) => setRegularMedsDetails(e.target.value)} className="mt-3 min-h-[100px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm" placeholder="List your regular medication" />}
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="mt-8 space-y-7">
                    <h2 className="text-3xl font-black text-dark-slate dark:text-white">Lifestyle</h2>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">1. Are you or have you ever been a smoker?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setSmokerHistory("Yes")} className={optionButtonClass(smokerHistory === "Yes")}>Yes</button>
                        <button type="button" onClick={() => setSmokerHistory("No")} className={optionButtonClass(smokerHistory === "No")}>No</button>
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">2. Do you drink alcohol?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setAlcoholUse("Yes")} className={optionButtonClass(alcoholUse === "Yes")}>Yes</button>
                        <button type="button" onClick={() => setAlcoholUse("No")} className={optionButtonClass(alcoholUse === "No")}>No</button>
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">3. How often do you exercise?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        {["Daily", "3 times/week", "Weekly", "Rarely", "Never"].map((opt) => (
                          <button key={opt} type="button" onClick={() => setExerciseFrequency(opt)} className={optionButtonClass(exerciseFrequency === opt)}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="mt-8 space-y-7">
                    <h2 className="text-3xl font-black text-dark-slate dark:text-white">Measurements</h2>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">1. Height (cm)</p>
                      <input type="number" min="0" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm" placeholder="e.g. 170" />
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">2. Weight (kg)</p>
                      <input type="number" min="0" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm" placeholder="e.g. 70" />
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">3. Do you know your recent blood pressure?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setKnowsBloodPressure("Yes")} className={optionButtonClass(knowsBloodPressure === "Yes")}>Yes</button>
                        <button type="button" onClick={() => { setKnowsBloodPressure("No"); setBloodPressure(""); }} className={optionButtonClass(knowsBloodPressure === "No")}>No</button>
                      </div>
                      {knowsBloodPressure === "Yes" && <input type="text" value={bloodPressure} onChange={(e) => setBloodPressure(e.target.value)} className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm" placeholder="e.g. 120/80 mmHg" />}
                    </div>
                  </div>
                )}

                {currentStep === 7 && (
                  <div className="mt-8 space-y-7">
                    <h2 className="text-3xl font-black text-dark-slate dark:text-white">Current Management</h2>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">1. What treatments are you currently using?</p>
                      <textarea value={currentTreatments} onChange={(e) => setCurrentTreatments(e.target.value)} className="mt-3 min-h-[110px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm" />
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">2. Please tell us which other areas are affected.</p>
                      <textarea value={otherAffectedAreas} onChange={(e) => setOtherAffectedAreas(e.target.value)} className="mt-3 min-h-[110px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm" />
                    </div>
                  </div>
                )}

                {currentStep === 8 && (
                  <div className="mt-8 space-y-7">
                    <h2 className="text-3xl font-black text-dark-slate dark:text-white">Pharmacy Details</h2>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">1. Preferred pharmacy/town</p>
                      <input value={preferredPharmacy} onChange={(e) => setPreferredPharmacy(e.target.value)} className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm" placeholder="Pharmacy name or town" />
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">2. Contact number</p>
                      <input value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm" placeholder="Phone number" />
                    </div>
                  </div>
                )}

                {currentStep === 9 && (
                  <div className="mt-8 space-y-7">
                    <h2 className="text-3xl font-black text-dark-slate dark:text-white">Confirmation</h2>
                    {submitted ? (
                      <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6">
                        <p className="font-black text-emerald-900 text-2xl">Request submitted</p>
                        <p className="mt-2 text-sm text-emerald-900">Your eczema request has been sent for doctor review.</p>
                      </div>
                    ) : (
                      <>
                        <div>
                          <p className="font-black text-dark-slate dark:text-white">1. I confirm the information provided is true and complete.</p>
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            <button type="button" onClick={() => setConfirmAnswers("Yes")} className={optionButtonClass(confirmAnswers === "Yes")}>Yes</button>
                            <button type="button" onClick={() => setConfirmAnswers("No")} className={optionButtonClass(confirmAnswers === "No")}>No</button>
                          </div>
                        </div>
                        <div>
                          <p className="font-black text-dark-slate dark:text-white">2. I confirm any prescribed medication is for my use only.</p>
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            <button type="button" onClick={() => setConfirmOwnUse("Yes")} className={optionButtonClass(confirmOwnUse === "Yes")}>Yes</button>
                            <button type="button" onClick={() => setConfirmOwnUse("No")} className={optionButtonClass(confirmOwnUse === "No")}>No</button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <div className="mt-10 flex flex-wrap items-center gap-3">
                  {currentStep > 1 && !submitted && (
                    <button type="button" onClick={prevStep} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-black text-slate-700 transition hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-200">
                      Back
                    </button>
                  )}
                  {currentStep < 9 && (
                    <button type="button" onClick={nextStep} disabled={!canGoNext} className="rounded-xl bg-primary px-5 py-3 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:bg-primary/50">
                      Next
                    </button>
                  )}
                  {currentStep === 9 && !submitted && (
                    <button type="button" onClick={submitQuestionnaire} disabled={!canSubmit} className="rounded-xl bg-primary px-5 py-3 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:bg-primary/50">
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
                Eczema <span className="text-primary">Treatment</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-6 leading-relaxed">
                Ireland&apos;s award-winning online doctor service.
              </p>
            </div>

            <div className="rounded-[36px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
              <h3 className="text-2xl font-black mb-5">Treatments that we can provide</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Too busy to see your GP? Order prescription support for eczema online with Webdoctor.ie. Where
                clinically suitable, we can provide topical and oral treatment options for use in any Irish pharmacy.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
                Please check your dispensed prescription before leaving the pharmacy as no changes can be made after
                that point.
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-sm font-bold text-dark-slate dark:text-white">Topical Steroids (Creams/Ointments)</p>
                <p className="text-sm font-bold text-dark-slate dark:text-white">Oral Antihistamines</p>
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
                      You will need to upload recent photos of your eczema.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      We can prescribe treatments to help manage eczema flares including topical corticosteroids and
                      antihistamine tablets.
                    </p>
                  </li>
                </ul>
              </div>
              <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-black mb-6">What&apos;s excluded with our service</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">This service is not suitable if:</p>
                <ul className="space-y-3">
                  {excluded.map((item) => (
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

