"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2, ChevronDown, Clock, ShieldCheck, Users, XCircle } from "lucide-react";

const faqs = [
  "Who is this service suitable for?",
  "Who is this service not suitable for?",
  "What is psoriasis?",
  "What causes psoriasis?",
  "Are there different types of psoriasis?",
  "Are there other conditions associated with psoriasis?",
  "Are there lifestyle changes I can make to help with psoriasis symptoms?",
  "What treatment options are available for mild-moderate chronic plaque psoriasis?",
  "What treatments for chronic plaque psoriasis can we prescribe?",
  "How do these psoriasis treatments work?",
  "What is the difference between ointments and gels?",
  "How long does it take for treatment to work?",
  "Can I use this psoriasis treatment service if I am pregnant or breastfeeding?",
];

const excluded = [
  "You have a type of psoriasis other than plaque psoriasis (e.g. guttate, pustular, palmoplantar, erythrodermic).",
  "You are pregnant (or may be pregnant) or breastfeeding.",
  "More than 5% of your skin is affected by plaque psoriasis.",
  "You need treatment for psoriasis on your face, genitals, or skin folds.",
  "You require treatment for psoriasis-related nail changes.",
  "You are feeling generally unwell (including fever/high temperature).",
  "You are experiencing joint pain, swelling, or stiffness.",
  "You have unexplained weight loss.",
  "You have had calcium regulation problems (high or low) previously.",
  "You have significant kidney or liver disease.",
  "You are using specialised treatments (immunosuppressants, oral retinoids, biologics, phototherapy).",
  "You need treatment for a skin condition other than plaque psoriasis.",
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

export default function PlaquePsoriasisTreatmentPage() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [age, setAge] = useState("");
  const [diagnosedPsoriasis, setDiagnosedPsoriasis] = useState("");
  const [psoriasisType, setPsoriasisType] = useState("");
  const [overFivePercentBody, setOverFivePercentBody] = useState("");
  const [specialAreasOrNails, setSpecialAreasOrNails] = useState("");
  const [redFlagSymptoms, setRedFlagSymptoms] = useState("");
  const [kidneyLiverDisease, setKidneyLiverDisease] = useState("");
  const [calciumProblems, setCalciumProblems] = useState("");
  const [specialisedTreatments, setSpecialisedTreatments] = useState("");
  const [birthSex, setBirthSex] = useState("");
  const [pregnancyStatus, setPregnancyStatus] = useState("");
  const [photoQualityConfirm, setPhotoQualityConfirm] = useState("");
  const [psoriasisDuration, setPsoriasisDuration] = useState("");
  const [psoriasisLocations, setPsoriasisLocations] = useState<string[]>([]);
  const [psoriasisSymptoms, setPsoriasisSymptoms] = useState<string[]>([]);
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
  const [confirmAnswers, setConfirmAnswers] = useState("");
  const [confirmOwnUse, setConfirmOwnUse] = useState("");

  const optionButtonClass = (isSelected: boolean) =>
    `w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
      isSelected
        ? "border-primary bg-primary text-white"
        : "border-slate-200 bg-white text-dark-slate hover:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
    }`;

  const ageNumber = Number(age);
  const ageValid = Number.isFinite(ageNumber) && ageNumber >= 18;
  const canGoNext =
    (currentStep === 1 &&
      ageValid &&
      diagnosedPsoriasis &&
      psoriasisType &&
      overFivePercentBody &&
      specialAreasOrNails &&
      redFlagSymptoms &&
      kidneyLiverDisease &&
      calciumProblems &&
      specialisedTreatments &&
      birthSex &&
      (birthSex !== "Female" || pregnancyStatus) &&
      photoQualityConfirm) ||
    (currentStep === 2 && psoriasisDuration && psoriasisLocations.length > 0 && psoriasisSymptoms.length > 0 && symptomSeverity) ||
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
      (knowsBloodPressure !== "Yes" || bloodPressure.trim().length > 0) &&
      confirmAnswers &&
      confirmOwnUse);
  const canSubmit = confirmAnswers === "Yes" && confirmOwnUse === "Yes";

  const startQuestionnaire = () => {
    setShowQuestionnaire(true);
    setCurrentStep(1);
    setSubmitted(false);
    setTimeout(() => {
      document.getElementById("psoriasis-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const nextStep = () => {
    if (!canGoNext || currentStep >= 6) return;
    setCurrentStep((prev) => prev + 1);
    setTimeout(() => {
      document.getElementById("psoriasis-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const prevStep = () => {
    if (currentStep <= 1) return;
    setCurrentStep((prev) => prev - 1);
    setTimeout(() => {
      document.getElementById("psoriasis-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };
  const submitQuestionnaire = () => {
    if (!canSubmit) return;
    setSubmitted(true);
    setTimeout(() => {
      document.getElementById("psoriasis-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
          <section id="psoriasis-questionnaire" className="pt-28 pb-16">
            <div className="max-w-4xl mx-auto px-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-black uppercase tracking-wider text-primary">Suitability Check</p>
                <p className="mt-3 text-sm font-bold text-slate-600">Step {currentStep} / 6</p>

                {currentStep === 1 && (
                  <div className="mt-4 space-y-7">
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">1. What age are you?</p>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">This service is only for patients aged 18 or older.</p>
                      <input type="number" min="0" value={age} onChange={(e) => setAge(e.target.value)} className="mt-3 w-full max-w-56 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm" placeholder="Please input number" />
                      {age && !ageValid && <p className="mt-2 text-sm font-semibold text-red-600">You must be 18 or older to proceed.</p>}
                    </div>

                    <div><p className="font-black text-dark-slate dark:text-white">2. Have you been diagnosed with psoriasis by a doctor?</p><div className="mt-3 grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => setDiagnosedPsoriasis("Yes")} className={optionButtonClass(diagnosedPsoriasis === "Yes")}>Yes</button><button type="button" onClick={() => setDiagnosedPsoriasis("No")} className={optionButtonClass(diagnosedPsoriasis === "No")}>No</button></div></div>
                    <div><p className="font-black text-dark-slate dark:text-white">3. Which of the following best describes your psoriasis?</p><div className="mt-3 grid gap-3 sm:grid-cols-2">{["Plaque (thick scaly patches)","Guttate (small red, scaly droplets)","Palmoplantar (just hands & feet affected)","Pustular (blisters/ oozing lesions on skin)","Erythrodermic (peeling/red painful itchy skin)"].map((opt)=><button key={opt} type="button" onClick={()=>setPsoriasisType(opt)} className={optionButtonClass(psoriasisType===opt)}>{opt}</button>)}</div></div>
                    <div><p className="font-black text-dark-slate dark:text-white">4. Is more than 5% of your body affected by the psoriasis lesions?</p><div className="mt-3 grid gap-3 sm:grid-cols-2"><button type="button" onClick={()=>setOverFivePercentBody("Yes")} className={optionButtonClass(overFivePercentBody==="Yes")}>Yes</button><button type="button" onClick={()=>setOverFivePercentBody("No")} className={optionButtonClass(overFivePercentBody==="No")}>No</button></div></div>
                    <div><p className="font-black text-dark-slate dark:text-white">5. Do you need treatment for psoriasis affecting face, genitals, skin folds, or nail changes?</p><div className="mt-3 grid gap-3 sm:grid-cols-2"><button type="button" onClick={()=>setSpecialAreasOrNails("Yes")} className={optionButtonClass(specialAreasOrNails==="Yes")}>Yes</button><button type="button" onClick={()=>setSpecialAreasOrNails("No")} className={optionButtonClass(specialAreasOrNails==="No")}>No</button></div></div>
                    <div><p className="font-black text-dark-slate dark:text-white">6. Are you experiencing fever, malaise, joint pain/stiffness/swelling, or unexplained weight loss?</p><div className="mt-3 grid gap-3 sm:grid-cols-2"><button type="button" onClick={()=>setRedFlagSymptoms("Yes")} className={optionButtonClass(redFlagSymptoms==="Yes")}>Yes</button><button type="button" onClick={()=>setRedFlagSymptoms("No")} className={optionButtonClass(redFlagSymptoms==="No")}>No</button></div></div>
                    <div><p className="font-black text-dark-slate dark:text-white">7. Do you have severe kidney or liver disease?</p><div className="mt-3 grid gap-3 sm:grid-cols-2"><button type="button" onClick={()=>setKidneyLiverDisease("Yes")} className={optionButtonClass(kidneyLiverDisease==="Yes")}>Yes</button><button type="button" onClick={()=>setKidneyLiverDisease("No")} className={optionButtonClass(kidneyLiverDisease==="No")}>No</button></div></div>
                    <div><p className="font-black text-dark-slate dark:text-white">8. Have you ever been diagnosed with high or low calcium levels?</p><div className="mt-3 grid gap-3 sm:grid-cols-2"><button type="button" onClick={()=>setCalciumProblems("Yes")} className={optionButtonClass(calciumProblems==="Yes")}>Yes</button><button type="button" onClick={()=>setCalciumProblems("No")} className={optionButtonClass(calciumProblems==="No")}>No</button></div></div>
                    <div><p className="font-black text-dark-slate dark:text-white">9. Are you currently using specialised treatments (methotrexate, ciclosporin, biologics, phototherapy)?</p><div className="mt-3 grid gap-3 sm:grid-cols-2"><button type="button" onClick={()=>setSpecialisedTreatments("Yes")} className={optionButtonClass(specialisedTreatments==="Yes")}>Yes</button><button type="button" onClick={()=>setSpecialisedTreatments("No")} className={optionButtonClass(specialisedTreatments==="No")}>No</button></div></div>
                    <div><p className="font-black text-dark-slate dark:text-white">10. What is your birth sex?</p><div className="mt-3 grid gap-3 sm:grid-cols-2"><button type="button" onClick={()=>{setBirthSex("Male");setPregnancyStatus("");}} className={optionButtonClass(birthSex==="Male")}>Male</button><button type="button" onClick={()=>setBirthSex("Female")} className={optionButtonClass(birthSex==="Female")}>Female</button></div></div>
                    {birthSex === "Female" && <div><p className="font-black text-dark-slate dark:text-white">11. Are you pregnant, possibly pregnant or breastfeeding?</p><div className="mt-3 grid gap-3 sm:grid-cols-2"><button type="button" onClick={()=>setPregnancyStatus("Yes")} className={optionButtonClass(pregnancyStatus==="Yes")}>Yes</button><button type="button" onClick={()=>setPregnancyStatus("No")} className={optionButtonClass(pregnancyStatus==="No")}>No</button></div></div>}
                    <div><p className="font-black text-dark-slate dark:text-white">{birthSex==="Female"?"12":"11"}. Please confirm clear skin pictures will be available for doctor assessment.</p><div className="mt-3"><button type="button" onClick={()=>setPhotoQualityConfirm("I understand")} className={optionButtonClass(photoQualityConfirm==="I understand")}>I understand</button></div></div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="mt-8 space-y-7">
                    <h2 className="text-3xl font-black text-dark-slate dark:text-white">Condition Details</h2>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">1. How long have you had plaque psoriasis symptoms?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        {["Less than 6 months", "6-24 months", "More than 2 years"].map((opt) => (
                          <button key={opt} type="button" onClick={() => setPsoriasisDuration(opt)} className={optionButtonClass(psoriasisDuration === opt)}>{opt}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">2. Which body areas are affected?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        {["Scalp", "Elbows", "Knees", "Lower back", "Legs", "Arms"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setPsoriasisLocations((prev) => (prev.includes(opt) ? prev.filter((v) => v !== opt) : [...prev, opt]))}
                            className={optionButtonClass(psoriasisLocations.includes(opt))}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">3. Which symptoms are present now?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        {["Itch", "Flaking", "Redness", "Pain", "Cracking skin"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setPsoriasisSymptoms((prev) => (prev.includes(opt) ? prev.filter((v) => v !== opt) : [...prev, opt]))}
                            className={optionButtonClass(psoriasisSymptoms.includes(opt))}
                          >
                            {opt}
                          </button>
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
                    <h2 className="text-3xl font-black text-dark-slate dark:text-white">Photo Confirmation</h2>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">Please confirm you can provide clear photos of affected areas for review.</p>
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
                      {medicineAllergies === "Yes" && (
                        <textarea value={medicineAllergiesDetails} onChange={(e) => setMedicineAllergiesDetails(e.target.value)} className="mt-3 min-h-[100px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm" placeholder="Please provide allergy details" />
                      )}
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">3. Are you taking regular prescribed medication?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setRegularMeds("Yes")} className={optionButtonClass(regularMeds === "Yes")}>Yes</button>
                        <button type="button" onClick={() => { setRegularMeds("No"); setRegularMedsDetails(""); }} className={optionButtonClass(regularMeds === "No")}>No</button>
                      </div>
                      {regularMeds === "Yes" && (
                        <textarea value={regularMedsDetails} onChange={(e) => setRegularMedsDetails(e.target.value)} className="mt-3 min-h-[100px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm" placeholder="List your regular medication" />
                      )}
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
                    <h2 className="text-3xl font-black text-dark-slate dark:text-white">Measurements & Confirmation</h2>
                    {submitted ? (
                      <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6">
                        <p className="font-black text-emerald-900 text-2xl">Request submitted</p>
                        <p className="mt-2 text-sm text-emerald-900">Your plaque psoriasis request has been sent for doctor review.</p>
                      </div>
                    ) : (
                      <>
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
                        <div>
                          <p className="font-black text-dark-slate dark:text-white">4. I confirm the information provided is true and complete.</p>
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            <button type="button" onClick={() => setConfirmAnswers("Yes")} className={optionButtonClass(confirmAnswers === "Yes")}>Yes</button>
                            <button type="button" onClick={() => setConfirmAnswers("No")} className={optionButtonClass(confirmAnswers === "No")}>No</button>
                          </div>
                        </div>
                        <div>
                          <p className="font-black text-dark-slate dark:text-white">5. I confirm prescribed medication is for my use only.</p>
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
                  {currentStep > 1 && !submitted && <button type="button" onClick={prevStep} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-black text-slate-700">Back</button>}
                  {currentStep < 6 && <button type="button" onClick={nextStep} disabled={!canGoNext} className="rounded-xl bg-primary px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-primary/50">Next</button>}
                  {currentStep === 6 && !submitted && <button type="button" onClick={submitQuestionnaire} disabled={!canSubmit} className="rounded-xl bg-primary px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-primary/50">Submit Request</button>}
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
                Plaque Psoriasis <span className="text-primary">Treatment</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-6 leading-relaxed">
                Ireland&apos;s award-winning online doctor service.
              </p>
            </div>

            <div className="rounded-[36px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
              <h3 className="text-2xl font-black mb-5">Treatments that we can provide</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Psoriasis is a long-term condition causing itchy, flaky patches. While not curable, treatment can help
                manage symptoms where clinically appropriate.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
                We issue prescriptions for generic medicine names to support treatment availability. Please check your
                dispensed prescription before leaving the pharmacy.
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-sm font-bold text-dark-slate dark:text-white">Steroid Scalp Applications</p>
                <p className="text-sm font-bold text-dark-slate dark:text-white">Steroid Gel (Ointment and Foam)</p>
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
              <button type="button" onClick={startQuestionnaire} className="w-full mt-6 px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2">
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
                      You will need to upload 3 clear pictures of affected areas.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      Suitable for previously diagnosed mild-moderate plaque psoriasis flares.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      As a written consultation service, criteria for issuing treatment are stricter than face-to-face
                      consultations.
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

