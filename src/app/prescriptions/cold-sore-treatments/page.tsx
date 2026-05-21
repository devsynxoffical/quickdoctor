"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2, ChevronDown, Clock, ShieldCheck, Users, XCircle } from "lucide-react";

const faqs = [
  "Who is this service for?",
  "Who is this service not suitable for?",
  "What causes Cold Sores?",
  "Are there different types of Herpes Simplex Virus (HSV)?",
  "What are the symptoms of a Cold Sore?",
  "What can trigger a breakout of Cold Sores?",
  "Can you do anything to stop a Cold Sore from spreading?",
  "Should I avoid others if I have a Cold Sore?",
  "What prescriptions can we provide?",
  "What are the potential side effects of antiviral treatment for cold sores?",
  "Are there topical treatments (cream) for cold sores?",
  "Important safety information",
];

const excluded = [
  "This is the first time you have had a cold sore.",
  "You have new lesions that are not where your cold sore lesions usually occur.",
  "You have lesions inside your nose/mouth/ears or areas other than your face.",
  "You have lesions around or on your eye (seek urgent medical assessment).",
  "You need suppression therapy (a longer prevention treatment course).",
  "You are feeling unwell or have a temperature.",
  "You have severe kidney disease.",
  "You are immunocompromised due to conditions or medication.",
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

export default function ColdSoreTreatmentsPage() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [requestFor, setRequestFor] = useState("");
  const [birthSex, setBirthSex] = useState("");
  const [pregnantOrBreastfeeding, setPregnantOrBreastfeeding] = useState("");
  const [previousDiagnosis, setPreviousDiagnosis] = useState("");
  const [proceedAciclovir, setProceedAciclovir] = useState("");
  const [seekingExtendedCourse, setSeekingExtendedCourse] = useState("");
  const [usualLesionLocation, setUsualLesionLocation] = useState("");
  const [redFlagSymptoms, setRedFlagSymptoms] = useState("");
  const [kidneyDisease, setKidneyDisease] = useState("");
  const [immunocompromised, setImmunocompromised] = useState("");
  const [lesionsOnLipsMouthChin, setLesionsOnLipsMouthChin] = useState("");
  const [activeOutbreakNow, setActiveOutbreakNow] = useState("");
  const [outbreakFrequency, setOutbreakFrequency] = useState("");
  const [lastOutbreakTiming, setLastOutbreakTiming] = useState("");
  const [currentMedications, setCurrentMedications] = useState("");
  const [currentMedicationsDetails, setCurrentMedicationsDetails] = useState("");
  const [medicineAllergies, setMedicineAllergies] = useState("");
  const [medicineAllergiesDetails, setMedicineAllergiesDetails] = useState("");
  const [smokerHistory, setSmokerHistory] = useState("");
  const [alcoholUse, setAlcoholUse] = useState("");
  const [stressLevels, setStressLevels] = useState("");
  const [preferredPharmacy, setPreferredPharmacy] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [confirmTrueAnswers, setConfirmTrueAnswers] = useState("");
  const [confirmPersonalUse, setConfirmPersonalUse] = useState("");

  const optionButtonClass = (isSelected: boolean) =>
    `w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
      isSelected
        ? "border-primary bg-primary text-white"
        : "border-slate-200 bg-white text-dark-slate hover:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
    }`;

  const canGoNext =
    (currentStep === 1 &&
      requestFor &&
      birthSex &&
      (birthSex !== "Female" || pregnantOrBreastfeeding) &&
      previousDiagnosis &&
      proceedAciclovir &&
      seekingExtendedCourse &&
      usualLesionLocation &&
      redFlagSymptoms &&
      kidneyDisease &&
      immunocompromised &&
      lesionsOnLipsMouthChin) ||
    (currentStep === 2 && activeOutbreakNow && outbreakFrequency && lastOutbreakTiming) ||
    (currentStep === 3 &&
      currentMedications &&
      (currentMedications !== "Yes" || currentMedicationsDetails.trim().length > 0) &&
      medicineAllergies &&
      (medicineAllergies !== "Yes" || medicineAllergiesDetails.trim().length > 0)) ||
    (currentStep === 4 && smokerHistory && alcoholUse && stressLevels) ||
    (currentStep === 5 && preferredPharmacy.trim().length > 0 && contactNumber.trim().length > 0) ||
    (currentStep === 6 && confirmTrueAnswers && confirmPersonalUse);
  const canSubmit = confirmTrueAnswers === "Yes" && confirmPersonalUse === "Yes";

  const startQuestionnaire = () => {
    setShowQuestionnaire(true);
    setCurrentStep(1);
    setSubmitted(false);
    setTimeout(() => {
      document.getElementById("cold-sore-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const nextStep = () => {
    if (!canGoNext || currentStep >= 6) return;
    setCurrentStep((prev) => prev + 1);
    setTimeout(() => {
      document.getElementById("cold-sore-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const prevStep = () => {
    if (currentStep <= 1) return;
    setCurrentStep((prev) => prev - 1);
    setTimeout(() => {
      document.getElementById("cold-sore-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };
  const submitQuestionnaire = () => {
    if (!canSubmit) return;
    setSubmitted(true);
    setTimeout(() => {
      document.getElementById("cold-sore-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
          <section id="cold-sore-questionnaire" className="pt-28 pb-16">
            <div className="max-w-4xl mx-auto px-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-black uppercase tracking-wider text-primary">Suitability Check</p>
                <p className="mt-3 text-sm font-bold text-slate-600">Step {currentStep} / 6</p>

                {currentStep === 1 && (
                  <>
                    <h2 className="mt-2 text-3xl font-black text-dark-slate dark:text-white">Suitability Check</h2>
                    <div className="mt-8 space-y-7">
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">1. Who are you requesting this treatment for?</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                          Please be aware that if this prescription is approved, it will be issued in the name of this account owner, and include their personal details.
                        </p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => setRequestFor("Myself")} className={optionButtonClass(requestFor === "Myself")}>Myself</button>
                          <button type="button" onClick={() => setRequestFor("Another person")} className={optionButtonClass(requestFor === "Another person")}>Another person</button>
                        </div>
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">2. What is your birth sex?</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-3">
                          <button type="button" onClick={() => { setBirthSex("Male"); setPregnantOrBreastfeeding(""); }} className={optionButtonClass(birthSex === "Male")}>Male</button>
                          <button type="button" onClick={() => setBirthSex("Female")} className={optionButtonClass(birthSex === "Female")}>Female</button>
                          <button type="button" onClick={() => { setBirthSex("Other"); setPregnantOrBreastfeeding(""); }} className={optionButtonClass(birthSex === "Other")}>Other</button>
                        </div>
                      </div>

                      {birthSex === "Female" && (
                        <div>
                          <p className="font-black text-dark-slate dark:text-white">3. Are you currently pregnant, planning to become pregnant or are you breastfeeding?</p>
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            <button type="button" onClick={() => setPregnantOrBreastfeeding("Yes")} className={optionButtonClass(pregnantOrBreastfeeding === "Yes")}>Yes</button>
                            <button type="button" onClick={() => setPregnantOrBreastfeeding("No")} className={optionButtonClass(pregnantOrBreastfeeding === "No")}>No</button>
                          </div>
                        </div>
                      )}

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">{birthSex === "Female" ? "4" : "3"}. Have you previously been diagnosed with a cold sore by a healthcare professional?</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">This service is only suitable for those that have a previous diagnosis.</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => setPreviousDiagnosis("Yes")} className={optionButtonClass(previousDiagnosis === "Yes")}>Yes</button>
                          <button type="button" onClick={() => setPreviousDiagnosis("No")} className={optionButtonClass(previousDiagnosis === "No")}>No</button>
                        </div>
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">{birthSex === "Female" ? "5" : "4"}. This service provides prescriptions for a 5 day course of aciclovir medication... Are you happy to proceed?</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">We are unable to provide prescriptions for extended courses of treatment. A video consultation would be required to discuss this.</p>
                        <div className="mt-3">
                          <button type="button" onClick={() => setProceedAciclovir("Yes")} className={optionButtonClass(proceedAciclovir === "Yes")}>Yes</button>
                        </div>
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">{birthSex === "Female" ? "6" : "5"}. Are you seeking an extended course of treatment?</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => setSeekingExtendedCourse("Yes, I am")} className={optionButtonClass(seekingExtendedCourse === "Yes, I am")}>Yes, I am</button>
                          <button type="button" onClick={() => setSeekingExtendedCourse("No, I am not")} className={optionButtonClass(seekingExtendedCourse === "No, I am not")}>No, I am not</button>
                        </div>
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">{birthSex === "Female" ? "7" : "6"}. If you currently have active cold sore lesions, are they located in the usual place?</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">(Do you have any new lesions in a different location to where they normally appear?)</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => setUsualLesionLocation("Yes")} className={optionButtonClass(usualLesionLocation === "Yes")}>Yes</button>
                          <button type="button" onClick={() => setUsualLesionLocation("No")} className={optionButtonClass(usualLesionLocation === "No")}>No</button>
                        </div>
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">{birthSex === "Female" ? "8" : "7"}. Do you have any of the following symptoms?</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Temperature, difficulty swallowing, swollen/painful gums, sores inside mouth, blurred vision, headache/neck stiffness.</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => setRedFlagSymptoms("Yes")} className={optionButtonClass(redFlagSymptoms === "Yes")}>Yes</button>
                          <button type="button" onClick={() => setRedFlagSymptoms("No")} className={optionButtonClass(redFlagSymptoms === "No")}>No</button>
                        </div>
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">{birthSex === "Female" ? "9" : "8"}. Do you have significant kidney disease?</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">This refers to significant decrease in kidney function and does not relate to urine infections.</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => setKidneyDisease("Yes")} className={optionButtonClass(kidneyDisease === "Yes")}>Yes</button>
                          <button type="button" onClick={() => setKidneyDisease("No")} className={optionButtonClass(kidneyDisease === "No")}>No</button>
                        </div>
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">{birthSex === "Female" ? "10" : "9"}. Do you have a weak immune system (immunocompromised)?</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">This can be due to illnesses such as cancer, HIV, autoimmune conditions, or treatment such as chemotherapy/radiotherapy.</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => setImmunocompromised("Yes")} className={optionButtonClass(immunocompromised === "Yes")}>Yes</button>
                          <button type="button" onClick={() => setImmunocompromised("No")} className={optionButtonClass(immunocompromised === "No")}>No</button>
                        </div>
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">{birthSex === "Female" ? "11" : "10"}. Are your cold sore lesions on your lips/ mouth/ chin area?</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Please note: IF YOU HAVE LESIONS ON/ AROUND YOUR EYE, PLEASE SEEK URGENT MEDICAL ASSESSMENT.</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => setLesionsOnLipsMouthChin("Yes")} className={optionButtonClass(lesionsOnLipsMouthChin === "Yes")}>Yes</button>
                          <button type="button" onClick={() => setLesionsOnLipsMouthChin("No")} className={optionButtonClass(lesionsOnLipsMouthChin === "No")}>No</button>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <h2 className="mt-2 text-3xl font-black text-dark-slate dark:text-white">Outbreak Details</h2>
                    <div className="mt-8 space-y-7">
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">1. Do you currently have an active cold sore outbreak?</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => setActiveOutbreakNow("Yes")} className={optionButtonClass(activeOutbreakNow === "Yes")}>Yes</button>
                          <button type="button" onClick={() => setActiveOutbreakNow("No")} className={optionButtonClass(activeOutbreakNow === "No")}>No</button>
                        </div>
                      </div>
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">2. How often do you usually get cold sore flares?</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-3">
                          {["Less than once yearly", "1-3 times yearly", "4+ times yearly"].map((opt) => (
                            <button key={opt} type="button" onClick={() => setOutbreakFrequency(opt)} className={optionButtonClass(outbreakFrequency === opt)}>{opt}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">3. When did your most recent flare begin?</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-3">
                          {["Within 24 hours", "2-3 days ago", "More than 3 days ago"].map((opt) => (
                            <button key={opt} type="button" onClick={() => setLastOutbreakTiming(opt)} className={optionButtonClass(lastOutbreakTiming === opt)}>{opt}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <h2 className="mt-2 text-3xl font-black text-dark-slate dark:text-white">Medication & Allergies</h2>
                    <div className="mt-8 space-y-7">
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">1. Are you currently taking prescribed medication?</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => setCurrentMedications("Yes")} className={optionButtonClass(currentMedications === "Yes")}>Yes</button>
                          <button type="button" onClick={() => { setCurrentMedications("No"); setCurrentMedicationsDetails(""); }} className={optionButtonClass(currentMedications === "No")}>No</button>
                        </div>
                        {currentMedications === "Yes" && (
                          <textarea value={currentMedicationsDetails} onChange={(e) => setCurrentMedicationsDetails(e.target.value)} className="mt-3 min-h-[100px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm" placeholder="Please list prescribed medications" />
                        )}
                      </div>
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">2. Do you have any known medicine allergies?</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => setMedicineAllergies("Yes")} className={optionButtonClass(medicineAllergies === "Yes")}>Yes</button>
                          <button type="button" onClick={() => { setMedicineAllergies("No"); setMedicineAllergiesDetails(""); }} className={optionButtonClass(medicineAllergies === "No")}>No</button>
                        </div>
                        {medicineAllergies === "Yes" && (
                          <textarea value={medicineAllergiesDetails} onChange={(e) => setMedicineAllergiesDetails(e.target.value)} className="mt-3 min-h-[100px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm" placeholder="Please provide allergy details" />
                        )}
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 4 && (
                  <>
                    <h2 className="mt-2 text-3xl font-black text-dark-slate dark:text-white">Lifestyle</h2>
                    <div className="mt-8 space-y-7">
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
                        <p className="font-black text-dark-slate dark:text-white">3. How would you rate your recent stress levels?</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-3">
                          {["Low", "Moderate", "High"].map((opt) => (
                            <button key={opt} type="button" onClick={() => setStressLevels(opt)} className={optionButtonClass(stressLevels === opt)}>{opt}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 5 && (
                  <>
                    <h2 className="mt-2 text-3xl font-black text-dark-slate dark:text-white">Pharmacy Details</h2>
                    <div className="mt-8 space-y-7">
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">1. Preferred pharmacy (name/town)</p>
                        <input value={preferredPharmacy} onChange={(e) => setPreferredPharmacy(e.target.value)} className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm" placeholder="Pharmacy name or town" />
                      </div>
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">2. Contact number</p>
                        <input value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm" placeholder="Phone number" />
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 6 && (
                  <>
                    <h2 className="mt-2 text-3xl font-black text-dark-slate dark:text-white">Confirmation</h2>
                    {submitted ? (
                      <div className="mt-8 rounded-2xl border border-emerald-300 bg-emerald-50 p-6">
                        <p className="font-black text-emerald-900 text-2xl">Request submitted</p>
                        <p className="mt-2 text-sm text-emerald-900">Your cold sore treatment request has been sent for doctor review.</p>
                      </div>
                    ) : (
                      <div className="mt-8 space-y-7">
                        <div>
                          <p className="font-black text-dark-slate dark:text-white">1. I confirm the answers provided are accurate and complete.</p>
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            <button type="button" onClick={() => setConfirmTrueAnswers("Yes")} className={optionButtonClass(confirmTrueAnswers === "Yes")}>Yes</button>
                            <button type="button" onClick={() => setConfirmTrueAnswers("No")} className={optionButtonClass(confirmTrueAnswers === "No")}>No</button>
                          </div>
                        </div>
                        <div>
                          <p className="font-black text-dark-slate dark:text-white">2. I confirm this medication, if prescribed, is for my use only.</p>
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            <button type="button" onClick={() => setConfirmPersonalUse("Yes")} className={optionButtonClass(confirmPersonalUse === "Yes")}>Yes</button>
                            <button type="button" onClick={() => setConfirmPersonalUse("No")} className={optionButtonClass(confirmPersonalUse === "No")}>No</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="mt-10 flex flex-wrap items-center gap-3">
                  {currentStep > 1 && !submitted && (
                    <button type="button" onClick={prevStep} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-black text-slate-700 transition hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-200">
                      Back
                    </button>
                  )}
                  {currentStep < 6 && (
                    <button type="button" onClick={nextStep} disabled={!canGoNext} className="rounded-xl bg-primary px-5 py-3 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:bg-primary/50">
                      Next
                    </button>
                  )}
                  {currentStep === 6 && !submitted && (
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
                Cold Sore <span className="text-primary">Treatments</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-6 leading-relaxed">
                Ireland&apos;s award-winning online doctor service.
              </p>
            </div>

            <div className="rounded-[36px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
              <h3 className="text-2xl font-black mb-5">Treatments that we can provide</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Cold sores are caused by Herpes Simplex Virus (HSV). Antiviral treatment is not a cure, but it can
                reduce outbreak severity/duration and reduce spread by limiting viral multiplication.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
                We issue prescriptions for generic medicine names to support treatment availability. Please check your
                dispensed prescription before leaving the pharmacy.
              </p>
              <div className="mt-4">
                <p className="text-sm font-bold text-dark-slate dark:text-white">Oral Antiviral Medication (Tablets)</p>
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
                      Prescription can be arranged for people previously diagnosed with cold sores for a current outbreak
                      or preparation for next recurrence.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      You need a prior diagnosis by a healthcare professional.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      Lesions must be on lips/mouth/chin. If lesions are elsewhere on the face or inside the mouth,
                      please use Video Consultation.
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
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
                  In these situations, please book a Video Consultation for a detailed clinical history and appropriate
                  dosing plan.
                </p>
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

