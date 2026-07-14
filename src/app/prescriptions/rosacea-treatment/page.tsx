"use client";

import React, { useState } from "react";
import { beginPrescriptionCheckout } from '@/lib/serviceCheckout';
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2, ChevronDown, Clock, ShieldCheck, Users, XCircle } from "lucide-react";

const faqs = [
  "Who is this service suitable for?",
  "Who is this service not suitable for?",
  "What is Rosacea?",
  "What are the symptoms of Rosacea?",
  "What causes Rosacea?",
  "Are there things I can do to help reduce Rosacea flares?",
  "What Rosacea treatments can we provide?",
  "What are the side effects of these treatments?",
  "Need more information on Rosacea?",
  "Important safety information",
];

const excluded = [
  "You have other skin conditions that affect your face (e.g. acne, lupus).",
  "You have severe rosacea symptoms.",
  "You have rhinophyma associated with rosacea.",
  "You have rosacea symptoms affecting your eyes or eyelids, now or in the past.",
  "You have not previously been diagnosed with rosacea by a doctor.",
  "You are pregnant, planning pregnancy, or breastfeeding.",
  "You require medication not listed in our questionnaire. We cannot prescribe oral retinoids.",
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

export default function RosaceaTreatmentPage() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [birthSex, setBirthSex] = useState("");
  const [pregnancyOrBreastfeeding, setPregnancyOrBreastfeeding] = useState("");
  const [diagnosedRosacea, setDiagnosedRosacea] = useState("");
  const [confirmMedicationScope, setConfirmMedicationScope] = useState("");
  const [seekingRoaccutane, setSeekingRoaccutane] = useState("");
  const [rhinophyma, setRhinophyma] = useState("");
  const [recentEyeSymptoms, setRecentEyeSymptoms] = useState("");
  const [suddenEyePainHistory, setSuddenEyePainHistory] = useState("");
  const [rosaceaDuration, setRosaceaDuration] = useState("");
  const [affectedAreas, setAffectedAreas] = useState<string[]>([]);
  const [knownTriggers, setKnownTriggers] = useState<string[]>([]);
  const [symptomsNow, setSymptomsNow] = useState<string[]>([]);
  const [symptomSeverity, setSymptomSeverity] = useState("");
  const [specificTreatmentRequest, setSpecificTreatmentRequest] = useState("");
  const [pastTreatments, setPastTreatments] = useState<string[]>([]);
  const [treatmentResponse, setTreatmentResponse] = useState("");
  const [closeUpPhoto, setCloseUpPhoto] = useState<File | null>(null);
  const [overviewPhoto, setOverviewPhoto] = useState<File | null>(null);
  const [medicalConditions, setMedicalConditions] = useState("");
  const [medicineAllergies, setMedicineAllergies] = useState("");
  const [medicineAllergiesDetails, setMedicineAllergiesDetails] = useState("");
  const [regularMedication, setRegularMedication] = useState("");
  const [regularMedicationDetails, setRegularMedicationDetails] = useState("");
  const [smokerHistory, setSmokerHistory] = useState("");
  const [alcoholUse, setAlcoholUse] = useState("");
  const [exerciseFrequency, setExerciseFrequency] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [knowsBloodPressure, setKnowsBloodPressure] = useState("");
  const [bloodPressureReading, setBloodPressureReading] = useState("");
  const [confirmAnswersTrue, setConfirmAnswersTrue] = useState("");
  const [confirmPersonalUse, setConfirmPersonalUse] = useState("");

  const optionButtonClass = (isSelected: boolean) =>
    `w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
      isSelected
        ? "border-primary bg-primary text-white"
        : "border-slate-200 bg-white text-dark-slate hover:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
    }`;
  const toggleListValue = (list: string[], setList: (value: string[]) => void, value: string) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
      return;
    }
    setList([...list, value]);
  };
  const stepTitle = {
    1: "Suitability",
    2: "Rosacea Profile",
    3: "Current Symptoms",
    4: "Treatment History",
    5: "Photos",
    6: "Medical Safety",
    7: "Lifestyle",
    8: "Measurements",
    9: "Confirmation",
  }[currentStep];

  const canGoNext =
    (currentStep === 1 &&
      birthSex &&
      (birthSex !== "Female" || pregnancyOrBreastfeeding) &&
      diagnosedRosacea &&
      confirmMedicationScope &&
      seekingRoaccutane &&
      rhinophyma &&
      recentEyeSymptoms &&
      suddenEyePainHistory) ||
    (currentStep === 2 && rosaceaDuration && affectedAreas.length > 0 && knownTriggers.length > 0) ||
    (currentStep === 3 && symptomsNow.length > 0 && symptomSeverity) ||
    (currentStep === 4 && specificTreatmentRequest && pastTreatments.length > 0 && treatmentResponse) ||
    (currentStep === 5 && closeUpPhoto && overviewPhoto) ||
    (currentStep === 6 &&
      medicalConditions &&
      medicineAllergies &&
      (medicineAllergies !== "Yes" || medicineAllergiesDetails.trim().length > 0) &&
      regularMedication &&
      (regularMedication !== "Yes" || regularMedicationDetails.trim().length > 0)) ||
    (currentStep === 7 && smokerHistory && alcoholUse && exerciseFrequency) ||
    (currentStep === 8 && heightCm.trim().length > 0 && weightKg.trim().length > 0 && knowsBloodPressure && (knowsBloodPressure !== "Yes" || bloodPressureReading.trim().length > 0)) ||
    (currentStep === 9 && confirmAnswersTrue && confirmPersonalUse);
  const canSubmit = confirmAnswersTrue === "Yes" && confirmPersonalUse === "Yes";

  const startQuestionnaire = () => {
    setShowQuestionnaire(true);
    setCurrentStep(1);
    setSubmitted(false);
    setTimeout(() => {
      document.getElementById("rosacea-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const nextStep = () => {
    if (!canGoNext || currentStep >= 9) return;
    setCurrentStep((prev) => prev + 1);
    setTimeout(() => {
      document.getElementById("rosacea-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const prevStep = () => {
    if (currentStep <= 1) return;
    setCurrentStep((prev) => prev - 1);
    setTimeout(() => {
      document.getElementById("rosacea-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };
    const submitQuestionnaire = () => {
    if (!canSubmit) return;
    beginPrescriptionCheckout({
      slug: 'rosacea-treatment',
      serviceName: 'Rosacea Treatment',
      payload: {
      birthSex,
      pregnancyOrBreastfeeding,
      diagnosedRosacea,
      confirmMedicationScope,
      seekingRoaccutane,
      rhinophyma,
      recentEyeSymptoms,
      suddenEyePainHistory,
      rosaceaDuration,
      affectedAreas,
      knownTriggers,
      symptomsNow,
      symptomSeverity,
      specificTreatmentRequest,
      pastTreatments,
      treatmentResponse,
      closeUpPhoto,
      overviewPhoto,
      medicalConditions,
      medicineAllergies,
      medicineAllergiesDetails,
      regularMedication,
      regularMedicationDetails,
      smokerHistory,
      alcoholUse,
      exerciseFrequency,
      heightCm,
      weightKg,
      knowsBloodPressure,
      bloodPressureReading,
      confirmAnswersTrue,
      confirmPersonalUse,
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <Navbar />
<main>
        {showQuestionnaire && (
          <section id="rosacea-questionnaire" className="pt-28 pb-16">
            <div className="max-w-4xl mx-auto px-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-black uppercase tracking-wider text-primary">{stepTitle}</p>
                <p className="mt-3 text-sm font-bold text-slate-600">Step {currentStep} / 9</p>

                {currentStep === 1 && (
                  <>
                    <h2 className="mt-2 text-3xl font-black text-dark-slate dark:text-white">Suitability</h2>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                      In this section you will answer questions to see if you are suitable for this treatment. Please
                      note: If you would like to speak to a GP, please book a video consultation.
                    </p>

                    <div className="mt-8 space-y-7">
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">1. What is your birth sex?</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-3">
                          <button
                            type="button"
                            onClick={() => {
                              setBirthSex("Male");
                              setPregnancyOrBreastfeeding("");
                            }}
                            className={optionButtonClass(birthSex === "Male")}
                          >
                            Male
                          </button>
                          <button type="button" onClick={() => setBirthSex("Female")} className={optionButtonClass(birthSex === "Female")}>Female</button>
                          <button
                            type="button"
                            onClick={() => {
                              setBirthSex("Other");
                              setPregnancyOrBreastfeeding("");
                            }}
                            className={optionButtonClass(birthSex === "Other")}
                          >
                            Other
                          </button>
                        </div>
                      </div>

                      {birthSex === "Female" && (
                        <div>
                          <p className="font-black text-dark-slate dark:text-white">
                            2. Are you currently pregnant, planning to become pregnant or are you breastfeeding?
                          </p>
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            <button
                              type="button"
                              onClick={() => setPregnancyOrBreastfeeding("Yes, I am")}
                              className={optionButtonClass(pregnancyOrBreastfeeding === "Yes, I am")}
                            >
                              Yes, I am
                            </button>
                            <button
                              type="button"
                              onClick={() => setPregnancyOrBreastfeeding("No, I am not")}
                              className={optionButtonClass(pregnancyOrBreastfeeding === "No, I am not")}
                            >
                              No, I am not
                            </button>
                          </div>
                        </div>
                      )}

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">
                          {birthSex === "Female" ? "3" : "2"}. Have you been diagnosed with Rosacea by a doctor in the past?
                        </p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => setDiagnosedRosacea("Yes, I have")} className={optionButtonClass(diagnosedRosacea === "Yes, I have")}>Yes, I have</button>
                          <button type="button" onClick={() => setDiagnosedRosacea("No, I have not")} className={optionButtonClass(diagnosedRosacea === "No, I have not")}>No, I have not</button>
                        </div>
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">
                          {birthSex === "Female" ? "4" : "3"}. Please confirm that you understand: The only medications available through this service
                          are: Rozex gel (metronidazole), Skinoren (azelaic acid), Soolantra (Ivermectin cream),
                          Doxycycline or. Lymecycline
                        </p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => setConfirmMedicationScope("Yes, I do")} className={optionButtonClass(confirmMedicationScope === "Yes, I do")}>Yes, I do</button>
                        </div>
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">
                          {birthSex === "Female" ? "5" : "4"}. Are you seeking a prescription for Roaccutane?
                        </p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                          Please note: if you are looking for a prescription for Roaccutane, you will need to contact
                          your own GP as this is not provided for by our service.
                        </p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => setSeekingRoaccutane("Yes, I am")} className={optionButtonClass(seekingRoaccutane === "Yes, I am")}>Yes, I am</button>
                          <button type="button" onClick={() => setSeekingRoaccutane("No, I am not")} className={optionButtonClass(seekingRoaccutane === "No, I am not")}>No, I am not</button>
                        </div>
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">
                          {birthSex === "Female" ? "6" : "5"}. Do you have thickening of the skin around the nose (Rhinophyma)?
                        </p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                          Rhinophyma is a condition where the skin (usually around the tip of the nose) becomes lumpy,
                          enlarged and thickened. The skin might also have bigger than normal veins or small blood
                          vessels.
                        </p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => setRhinophyma("Yes, I do")} className={optionButtonClass(rhinophyma === "Yes, I do")}>Yes, I do</button>
                          <button type="button" onClick={() => setRhinophyma("No, I do not")} className={optionButtonClass(rhinophyma === "No, I do not")}>No, I do not</button>
                        </div>
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">
                          {birthSex === "Female" ? "7" : "6"}. Within the past 2 months, have you had any eye symptoms associated with Rosacea?
                        </p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                          Rosacea can be associated with inflammation of the eye and eyelids. Symptoms that can occur
                          include pain, redness, itchiness, poor vision or swellings around the eyelids. You are not
                          suitable for this service if you have any recent eye symptoms associated with Rosacea.
                        </p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => setRecentEyeSymptoms("Yes, I have")} className={optionButtonClass(recentEyeSymptoms === "Yes, I have")}>Yes, I have</button>
                          <button type="button" onClick={() => setRecentEyeSymptoms("No, I have not")} className={optionButtonClass(recentEyeSymptoms === "No, I have not")}>No, I have not</button>
                        </div>
                      </div>

                      <div>
                        <p className="font-black text-dark-slate dark:text-white">
                          {birthSex === "Female" ? "8" : "7"}. At any time in the past, have you ever had a sudden onset of pain or irritation in either
                          of your eyes after being diagnosed with Rosacea?
                        </p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                          The onset of pain, redness and blurred vision associated with Rosacea can be a sign of a
                          serious condition called keratitis or iritis. This can lead to permanent eye damage if it is
                          not assessed by a doctor. If you have ever had a sudden onset of eye pain associated with
                          rosacea, you are not suitable for this service.
                        </p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => setSuddenEyePainHistory("Yes, I have")} className={optionButtonClass(suddenEyePainHistory === "Yes, I have")}>Yes, I have</button>
                          <button type="button" onClick={() => setSuddenEyePainHistory("No, I have not")} className={optionButtonClass(suddenEyePainHistory === "No, I have not")}>No, I have not</button>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">1. How long have you had rosacea symptoms?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        {["Less than 6 months", "6-24 months", "More than 2 years"].map((opt) => (
                          <button key={opt} type="button" onClick={() => setRosaceaDuration(opt)} className={optionButtonClass(rosaceaDuration === opt)}>{opt}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">2. Which areas are affected?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        {["Cheeks", "Nose", "Forehead", "Chin"].map((opt) => (
                          <button key={opt} type="button" onClick={() => toggleListValue(affectedAreas, setAffectedAreas, opt)} className={optionButtonClass(affectedAreas.includes(opt))}>{opt}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">3. Which triggers usually worsen symptoms?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        {["Heat", "Alcohol", "Spicy foods", "Stress", "Sunlight", "Skincare products"].map((opt) => (
                          <button key={opt} type="button" onClick={() => toggleListValue(knownTriggers, setKnownTriggers, opt)} className={optionButtonClass(knownTriggers.includes(opt))}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">1. Which symptoms do you currently have?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        {["Facial redness", "Flushing", "Spots/pustules", "Burning/stinging", "Dryness", "Visible vessels"].map((opt) => (
                          <button key={opt} type="button" onClick={() => toggleListValue(symptomsNow, setSymptomsNow, opt)} className={optionButtonClass(symptomsNow.includes(opt))}>{opt}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">2. Overall, how severe are your symptoms now?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        {["Mild", "Moderate", "Severe"].map((opt) => (
                          <button key={opt} type="button" onClick={() => setSymptomSeverity(opt)} className={optionButtonClass(symptomSeverity === opt)}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">1. Are you requesting a specific treatment today?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setSpecificTreatmentRequest("Yes")} className={optionButtonClass(specificTreatmentRequest === "Yes")}>Yes</button>
                        <button type="button" onClick={() => setSpecificTreatmentRequest("No")} className={optionButtonClass(specificTreatmentRequest === "No")}>No</button>
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">2. Which treatments have you used before?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        {["Metronidazole", "Azelaic acid", "Ivermectin cream", "Doxycycline", "Lymecycline"].map((opt) => (
                          <button key={opt} type="button" onClick={() => toggleListValue(pastTreatments, setPastTreatments, opt)} className={optionButtonClass(pastTreatments.includes(opt))}>{opt}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">3. Did previous treatment help your symptoms?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setTreatmentResponse("Yes")} className={optionButtonClass(treatmentResponse === "Yes")}>Yes</button>
                        <button type="button" onClick={() => setTreatmentResponse("No")} className={optionButtonClass(treatmentResponse === "No")}>No</button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">1. Upload a clear close-up photo of your rosacea.</p>
                      <input type="file" accept="image/*" onChange={(e) => setCloseUpPhoto(e.target.files?.[0] ?? null)} className="mt-3 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm" />
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">2. Upload an overview facial photo.</p>
                      <input type="file" accept="image/*" onChange={(e) => setOverviewPhoto(e.target.files?.[0] ?? null)} className="mt-3 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm" />
                    </div>
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">1. Do you have any significant ongoing medical conditions?</p>
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
                        <button type="button" onClick={() => setRegularMedication("Yes")} className={optionButtonClass(regularMedication === "Yes")}>Yes</button>
                        <button type="button" onClick={() => { setRegularMedication("No"); setRegularMedicationDetails(""); }} className={optionButtonClass(regularMedication === "No")}>No</button>
                      </div>
                      {regularMedication === "Yes" && (
                        <textarea value={regularMedicationDetails} onChange={(e) => setRegularMedicationDetails(e.target.value)} className="mt-3 min-h-[100px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm" placeholder="List your regular medication" />
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 7 && (
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
                      <p className="font-black text-dark-slate dark:text-white">3. How often do you engage in regular exercise?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        {["Daily", "3 times/week", "Weekly", "Rarely", "Never"].map((opt) => (
                          <button key={opt} type="button" onClick={() => setExerciseFrequency(opt)} className={optionButtonClass(exerciseFrequency === opt)}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 8 && (
                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">1. Height (cm)</p>
                      <input type="number" min="0" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm" placeholder="e.g. 170" />
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">2. Weight (kg)</p>
                      <input type="number" min="0" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm" placeholder="e.g. 70" />
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">3. Do you know your latest blood pressure reading?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setKnowsBloodPressure("Yes")} className={optionButtonClass(knowsBloodPressure === "Yes")}>Yes</button>
                        <button type="button" onClick={() => { setKnowsBloodPressure("No"); setBloodPressureReading(""); }} className={optionButtonClass(knowsBloodPressure === "No")}>No</button>
                      </div>
                      {knowsBloodPressure === "Yes" && (
                        <input type="text" value={bloodPressureReading} onChange={(e) => setBloodPressureReading(e.target.value)} className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm" placeholder="e.g. 120/80 mmHg" />
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 9 && (
                  <div className="mt-8 space-y-7">
                    {submitted ? (
                      <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6">
                        <p className="text-2xl font-black text-emerald-900">Request submitted</p>
                        <p className="mt-2 text-sm text-emerald-900">Your rosacea questionnaire has been sent for doctor review.</p>
                      </div>
                    ) : (
                      <>
                        <div>
                          <p className="font-black text-dark-slate dark:text-white">1. I confirm the answers provided are complete and true.</p>
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            <button type="button" onClick={() => setConfirmAnswersTrue("Yes")} className={optionButtonClass(confirmAnswersTrue === "Yes")}>Yes</button>
                            <button type="button" onClick={() => setConfirmAnswersTrue("No")} className={optionButtonClass(confirmAnswersTrue === "No")}>No</button>
                          </div>
                        </div>
                        <div>
                          <p className="font-black text-dark-slate dark:text-white">2. I confirm that any prescribed medication is for my personal use only.</p>
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            <button type="button" onClick={() => setConfirmPersonalUse("Yes")} className={optionButtonClass(confirmPersonalUse === "Yes")}>Yes</button>
                            <button type="button" onClick={() => setConfirmPersonalUse("No")} className={optionButtonClass(confirmPersonalUse === "No")}>No</button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
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
                  {currentStep < 9 && (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!canGoNext}
                      className="rounded-xl bg-primary px-5 py-3 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:bg-primary/50"
                    >
                      Next
                    </button>
                  )}
                  {currentStep === 9 && !submitted && (
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
                Rosacea <span className="text-primary">Treatment</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-6 leading-relaxed">
                Ireland&apos;s award-winning online doctor service.
              </p>
            </div>

            <div className="rounded-[36px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
              <h3 className="text-2xl font-black mb-5">Treatments that we can provide</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Webdoctor.ie can prescribe creams, gels, or oral antibiotics to help control symptoms in mild to
                moderate rosacea.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
                Please check your dispensed prescription before leaving the pharmacy as no changes can be made after
                that point.
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-sm font-bold text-dark-slate dark:text-white">Topical Treatments: Creams or Gels</p>
                <p className="text-sm font-bold text-dark-slate dark:text-white">Oral Antibiotics (Tablets)</p>
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
                      You need to upload 2 clear up-to-date photographs of your rosacea.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      Although rosacea is a long-term condition, effective treatments can help control symptom flares.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      We can arrange prescriptions for a range of treatments depending on your symptoms.
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

