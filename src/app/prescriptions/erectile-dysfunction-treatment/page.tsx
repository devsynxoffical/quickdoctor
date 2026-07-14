"use client";

import React, { useState } from "react";
import { beginPrescriptionCheckout } from '@/lib/serviceCheckout';
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2, ChevronDown, Clock, ShieldCheck, Users, XCircle } from "lucide-react";

const faqItems = [
  "What is erectile dysfunction?",
  "What causes erectile dysfunction?",
  "Who is the service suitable for?",
  "Who is this service not suitable for?",
  "Are there medications that can interact with prescription ED treatments?",
  "What treatments are available via this service?",
  "How do these medications work?",
  "What are the potential side effects of these medications?",
  "Are there things I can do to help erectile dysfunction symptoms?",
  "Important safety information",
];

const excludedItems = [
  "Have had a heart attack or stroke in the past 6 months.",
  "Have unstable angina.",
  "Have uncontrolled high blood pressure.",
  "Have low blood pressure and are prone to fainting.",
  "Have irregular heart rhythm.",
  "Have heart failure, heart valve problems, or cardiomyopathy.",
  "Have significant liver or kidney disease.",
  "Have decreased vision due to optic nerve damage.",
  "Have retinitis pigmentosa.",
  "Have sickle cell anaemia, leukaemia, or multiple myeloma.",
  "Have a coagulation disorder e.g. haemophilia.",
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

export default function ErectileDysfunctionTreatmentPage() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [understandAssessmentInfo, setUnderstandAssessmentInfo] = useState(false);
  const [patientSelection, setPatientSelection] = useState("");
  const [understandUnsuitable, setUnderstandUnsuitable] = useState(false);
  const [birthSex, setBirthSex] = useState("");
  const [age, setAge] = useState("");
  const [chestPainHistory, setChestPainHistory] = useState("");
  const [nitratesUse, setNitratesUse] = useState("");
  const [cardiacCondition, setCardiacCondition] = useState("");
  const [smokingStatus, setSmokingStatus] = useState("");
  const [alcoholUnits, setAlcoholUnits] = useState("");
  const [exerciseLevel, setExerciseLevel] = useState("");
  const [currentEdMedication, setCurrentEdMedication] = useState("");
  const [otherMedications, setOtherMedications] = useState("");
  const [medicationAllergies, setMedicationAllergies] = useState("");
  const [confirmAccurate, setConfirmAccurate] = useState(false);
  const [confirmGpAware, setConfirmGpAware] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const optionButtonClass = (isSelected: boolean) =>
    `w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
      isSelected
        ? "border-primary bg-primary text-white"
        : "border-slate-200 bg-white text-dark-slate hover:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
    }`;

  const startQuestionnaire = () => {
    setShowQuestionnaire(true);
    setCurrentStep(1);
    setUnderstandAssessmentInfo(false);
    setPatientSelection("");
    setUnderstandUnsuitable(false);
    setBirthSex("");
    setAge("");
    setChestPainHistory("");
    setNitratesUse("");
    setCardiacCondition("");
    setSmokingStatus("");
    setAlcoholUnits("");
    setExerciseLevel("");
    setCurrentEdMedication("");
    setOtherMedications("");
    setMedicationAllergies("");
    setConfirmAccurate(false);
    setConfirmGpAware(false);
    setSubmitted(false);
    setTimeout(() => {
      document.getElementById("ed-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const showUnsuitableForSomeoneElse = patientSelection === "For someone else";
  const showFemaleUnsuitable = birthSex === "Female";
  const canGoNext =
    (currentStep === 1 &&
      understandAssessmentInfo &&
      patientSelection.length > 0 &&
      (!showUnsuitableForSomeoneElse || understandUnsuitable)) ||
    (currentStep === 2 &&
      birthSex &&
      (!showFemaleUnsuitable || understandUnsuitable) &&
      age.trim().length > 0 &&
      chestPainHistory &&
      nitratesUse &&
      cardiacCondition) ||
    (currentStep === 3 && smokingStatus && alcoholUnits && exerciseLevel) ||
    (currentStep === 4 && currentEdMedication.trim().length > 0 && otherMedications.trim().length > 0 && medicationAllergies) ||
    (currentStep === 5 && confirmAccurate && confirmGpAware);

  const canSubmit = currentStep === 5 && confirmAccurate && confirmGpAware;

  const nextStep = () => {
    if (!canGoNext || currentStep >= 5) return;
    setCurrentStep((prev) => prev + 1);
    setTimeout(() => {
      document.getElementById("ed-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const prevStep = () => {
    if (currentStep <= 1) return;
    setCurrentStep((prev) => prev - 1);
    setTimeout(() => {
      document.getElementById("ed-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

    const submitQuestionnaire = () => {
    if (!canSubmit) return;
    beginPrescriptionCheckout({
      slug: 'erectile-dysfunction-treatment',
      serviceName: 'Erectile Dysfunction Treatment',
      payload: {
      understandAssessmentInfo,
      patientSelection,
      understandUnsuitable,
      birthSex,
      age,
      chestPainHistory,
      nitratesUse,
      cardiacCondition,
      smokingStatus,
      alcoholUnits,
      exerciseLevel,
      currentEdMedication,
      otherMedications,
      medicationAllergies,
      confirmAccurate,
      confirmGpAware,
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <Navbar />
<main>
        {showQuestionnaire && (
          <section id="ed-questionnaire" className="pt-28 pb-16">
            <div className="max-w-4xl mx-auto px-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Step {currentStep} / 5</p>
                <h2 className="mt-2 text-3xl font-black text-dark-slate dark:text-white">
                  {currentStep === 1
                    ? "Patient Selection"
                    : currentStep === 2
                    ? "Medical Safety"
                    : currentStep === 3
                    ? "Lifestyle"
                    : currentStep === 4
                    ? "Medication"
                    : "Important Information"}
                </h2>

                {currentStep === 1 && (
                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">
                        1. This questionnaire is an important part of your medical assessment today.
                      </p>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Our doctors use your answers to ensure this treatment is safe and suitable for you.
                      </p>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Please answer all questions honestly to help us prescribe safely.
                      </p>
                      <div className="mt-3 max-w-[180px]">
                        <button type="button" onClick={() => setUnderstandAssessmentInfo(true)} className={optionButtonClass(understandAssessmentInfo)}>
                          I understand
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="font-black text-dark-slate dark:text-white">2. Who are you requesting this treatment for?</p>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Please be aware that if this prescription is approved, it will be issued in the name of this account holder, and will include their personal details.
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => { setPatientSelection("For myself"); setUnderstandUnsuitable(false); }} className={optionButtonClass(patientSelection === "For myself")}>For myself</button>
                        <button type="button" onClick={() => { setPatientSelection("For someone else"); setUnderstandUnsuitable(false); }} className={optionButtonClass(patientSelection === "For someone else")}>For someone else</button>
                      </div>
                    </div>

                    {showUnsuitableForSomeoneElse && (
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">3. THIS SERVICE IS UNSUITABLE</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">You cannot apply for a prescription on behalf of another adult.</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">If someone aged 18 or older requires treatment, they must apply through their own account.</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">For any registration issues or questions, you can contact us via our Contact Us form.</p>
                        <div className="mt-3 max-w-[180px]">
                          <button type="button" onClick={() => setUnderstandUnsuitable(true)} className={optionButtonClass(understandUnsuitable)}>I understand</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">1. What is your birth sex?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => { setBirthSex("Male"); setUnderstandUnsuitable(false); }} className={optionButtonClass(birthSex === "Male")}>Male</button>
                        <button type="button" onClick={() => { setBirthSex("Female"); setUnderstandUnsuitable(false); }} className={optionButtonClass(birthSex === "Female")}>Female</button>
                      </div>
                    </div>
                    {showFemaleUnsuitable && (
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">2. THIS SERVICE IS UNSUITABLE</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">This treatment service is available to male patients only.</p>
                        <div className="mt-3 max-w-[180px]">
                          <button type="button" onClick={() => setUnderstandUnsuitable(true)} className={optionButtonClass(understandUnsuitable)}>I understand</button>
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">3. What is your age?</p>
                      <input value={age} onChange={(event) => setAge(event.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">4. Have you had chest pain, heart attack or stroke in the last 6 months?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setChestPainHistory("Yes")} className={optionButtonClass(chestPainHistory === "Yes")}>Yes</button>
                        <button type="button" onClick={() => setChestPainHistory("No")} className={optionButtonClass(chestPainHistory === "No")}>No</button>
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">5. Do you currently use nitrate medication (GTN spray, isosorbide, nitroglycerin)?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setNitratesUse("Yes")} className={optionButtonClass(nitratesUse === "Yes")}>Yes</button>
                        <button type="button" onClick={() => setNitratesUse("No")} className={optionButtonClass(nitratesUse === "No")}>No</button>
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">6. Do you have significant heart, liver or kidney disease?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setCardiacCondition("Yes")} className={optionButtonClass(cardiacCondition === "Yes")}>Yes</button>
                        <button type="button" onClick={() => setCardiacCondition("No")} className={optionButtonClass(cardiacCondition === "No")}>No</button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">1. Do you currently smoke?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {["No", "Occasionally", "Daily - less than 10", "Daily - more than 10"].map((item) => (
                          <button key={item} type="button" onClick={() => setSmokingStatus(item)} className={optionButtonClass(smokingStatus === item)}>{item}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">2. Alcohol intake per week</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {["0-5 units", "6-14 units", "15-21 units", "More than 21 units"].map((item) => (
                          <button key={item} type="button" onClick={() => setAlcoholUnits(item)} className={optionButtonClass(alcoholUnits === item)}>{item}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">3. How active are you physically?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {["Regular exercise", "Some exercise", "Rarely exercise", "Unable to exercise"].map((item) => (
                          <button key={item} type="button" onClick={() => setExerciseLevel(item)} className={optionButtonClass(exerciseLevel === item)}>{item}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">1. Which ED treatment are you requesting?</p>
                      <input value={currentEdMedication} onChange={(event) => setCurrentEdMedication(event.target.value)} placeholder="e.g. Sildenafil, Tadalafil" className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">2. List all current medications (prescribed, OTC, supplements)</p>
                      <textarea value={otherMedications} onChange={(event) => setOtherMedications(event.target.value)} className="mt-3 min-h-[120px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">3. Any medication allergies?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setMedicationAllergies("Yes")} className={optionButtonClass(medicationAllergies === "Yes")}>Yes</button>
                        <button type="button" onClick={() => setMedicationAllergies("No")} className={optionButtonClass(medicationAllergies === "No")}>No</button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="mt-8 space-y-7">
                    {submitted ? (
                      <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6">
                        <p className="text-2xl font-black text-emerald-900">Request submitted</p>
                        <p className="mt-2 text-sm text-emerald-900">Your erectile dysfunction questionnaire has been submitted for doctor review.</p>
                      </div>
                    ) : (
                      <>
                        <div>
                          <p className="font-black text-dark-slate dark:text-white">1. I confirm my answers are true and complete.</p>
                          <div className="mt-3 max-w-[180px]">
                            <button type="button" onClick={() => setConfirmAccurate((v) => !v)} className={optionButtonClass(confirmAccurate)}>I understand</button>
                          </div>
                        </div>
                        <div>
                          <p className="font-black text-dark-slate dark:text-white">2. I understand I should inform my local GP about treatment received.</p>
                          <div className="mt-3 max-w-[180px]">
                            <button type="button" onClick={() => setConfirmGpAware((v) => !v)} className={optionButtonClass(confirmGpAware)}>I understand</button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {!submitted && (
                  <div className="mt-8 flex items-center justify-between">
                    <button type="button" onClick={prevStep} disabled={currentStep === 1} className={`px-6 py-3 rounded-xl font-bold text-sm ${currentStep === 1 ? "bg-slate-200 text-slate-500 cursor-not-allowed" : "bg-slate-100 text-dark-slate"}`}>
                      Back
                    </button>
                    {currentStep < 5 ? (
                      <button type="button" onClick={nextStep} disabled={!canGoNext} className={`px-6 py-3 rounded-xl font-bold text-sm ${canGoNext ? "bg-primary text-white" : "bg-slate-200 text-slate-500 cursor-not-allowed"}`}>
                        Next
                      </button>
                    ) : (
                      <button type="button" onClick={submitQuestionnaire} disabled={!canSubmit} className={`px-6 py-3 rounded-xl font-bold text-sm ${canSubmit ? "bg-primary text-white" : "bg-slate-200 text-slate-500 cursor-not-allowed"}`}>
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
                Erectile Dysfunction <span className="text-primary">Treatment</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-6 leading-relaxed">
                Reviewed by Irish-registered GPs. Quick renewals or first-time requests online, sent directly to your
                local pharmacy for easy collection.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Reviewed by Irish-registered GPs",
                  "Quick renewals or first-time requests online",
                  "Sent directly to your local pharmacy for easy collection",
                  "â‚¬25, available nationwide",
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
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Too busy to see your GP? Order your prescription for erectile dysfunction medication online with
                Webdoctor.ie. Where clinically suitable, we provide a 6-month prescription for up to 16 tablets per
                month of common branded and generic erectile dysfunction treatments.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
                We issue prescriptions for branded and generic medicines licensed and available in Ireland, depending on
                your preference. Please check your dispensed prescription before leaving the pharmacy as no changes can
                be made after that point.
              </p>
              <p className="text-sm font-bold text-dark-slate dark:text-white mt-4">Phosphodiesterase Inhibitors</p>
              <div className="space-y-3 mt-5">
                <button
                  type="button"
                  onClick={startQuestionnaire}
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
                type="button"
                onClick={startQuestionnaire}
                className="w-full mt-6 px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2"
              >
                Request Prescription - â‚¬25 <ArrowRight className="w-4 h-4" />
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
                      Medications can help you achieve and maintain an erection. However, ED medications will not treat
                      underlying medical conditions causing or contributing to this problem.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      We strongly advise that you consult with a doctor for advice on assessment and management of any
                      underlying cause.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      It is very important to include all prescribed and over-the-counter medications, herbal remedies,
                      and recreational drugs in your questionnaire so we can prescribe safely and avoid serious
                      interactions.
                    </p>
                  </li>
                </ul>
              </div>
              <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-black mb-6">What&apos;s excluded with our service</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">This service is not suitable for patients who:</p>
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

