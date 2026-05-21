"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2, ChevronDown, Clock, ShieldCheck, Users, XCircle } from "lucide-react";

const faqs = [
  "Who Is This Service Suitable For?",
  "Who Is This Service Not Suitable For?",
  "What Is Asthma?",
  "What Causes Asthma Symptoms?",
  "What Is An Asthma Attack?",
  "Does 'Exercise Induced' Asthma Exist?",
  "What Can I Do To Ensure My Asthma Is Managed Properly?",
  "What is An Asthma Management Plan?",
  "How Do I Know If My Asthma Is Well Controlled?",
  "Why Are There Different Types of Asthma Inhalers?",
  "Why Should I Not Only Use My Reliever (Blue) Inhaler to Manage My Asthma Symptoms?",
  "What Are The Side Effects Of Asthma Inhalers?",
  "Where Can I Get More Useful Information About Asthma?",
];

const excluded = [
  "Have never been diagnosed with asthma by a doctor.",
  "Are pregnant.",
  "Are requesting a prescription for a reliever inhaler only.",
  "Feel your symptoms are not controlled with your current treatment.",
  "Are feeling unwell (shortness of breath/wheeze/chest pain/high temperature).",
  "Are concerned you are having an acute asthma attack or chest infection.",
  "Need rapid access to a prescription for inhalers.",
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

export default function AsthmaTreatmentPage() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [understandAssessment, setUnderstandAssessment] = useState("");
  const [requestFor, setRequestFor] = useState("");
  const [understandUnsuitable, setUnderstandUnsuitable] = useState("");
  const [birthSex, setBirthSex] = useState("");
  const [pregnancyStatus, setPregnancyStatus] = useState("");
  const [asthmaDiagnosed, setAsthmaDiagnosed] = useState("");
  const [needsRelieverOnly, setNeedsRelieverOnly] = useState("");
  const [symptomsControlled, setSymptomsControlled] = useState("");
  const [acuteSymptoms, setAcuteSymptoms] = useState("");
  const [inhalerType, setInhalerType] = useState("");
  const [currentInhalers, setCurrentInhalers] = useState("");
  const [lastReviewWindow, setLastReviewWindow] = useState("");
  const [inhalerSideEffects, setInhalerSideEffects] = useState("");
  const [otherConditions, setOtherConditions] = useState("");
  const [otherConditionsDetails, setOtherConditionsDetails] = useState("");
  const [medicineAllergies, setMedicineAllergies] = useState("");
  const [medicineAllergyDetails, setMedicineAllergyDetails] = useState("");
  const [smokerHistory, setSmokerHistory] = useState("");
  const [smokesPerDay, setSmokesPerDay] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [knowsBloodPressure, setKnowsBloodPressure] = useState("");
  const [bpLastTaken, setBpLastTaken] = useState("");
  const [bpSys, setBpSys] = useState("");
  const [bpDia, setBpDia] = useState("");
  const [confirmTrue, setConfirmTrue] = useState("");
  const [confirmOwnUse, setConfirmOwnUse] = useState("");

  const optionButtonClass = (isSelected: boolean) =>
    `w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
      isSelected
        ? "border-primary bg-primary text-white"
        : "border-slate-200 bg-white text-dark-slate hover:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
    }`;

  const canGoNext =
    (currentStep === 1 &&
      Boolean(understandAssessment) &&
      Boolean(requestFor) &&
      (!["For someone else", "For a child"].includes(requestFor) || Boolean(understandUnsuitable))) ||
    (currentStep === 2 &&
      Boolean(birthSex) &&
      (birthSex !== "Female" || Boolean(pregnancyStatus)) &&
      Boolean(asthmaDiagnosed) &&
      Boolean(needsRelieverOnly) &&
      Boolean(symptomsControlled) &&
      Boolean(acuteSymptoms)) ||
    (currentStep === 3 &&
      Boolean(inhalerType) &&
      currentInhalers.trim().length > 0 &&
      Boolean(lastReviewWindow) &&
      Boolean(inhalerSideEffects)) ||
    (currentStep === 4 &&
      Boolean(otherConditions) &&
      (otherConditions !== "Yes" || otherConditionsDetails.trim().length > 0) &&
      Boolean(medicineAllergies) &&
      (medicineAllergies !== "Yes" || medicineAllergyDetails.trim().length > 0) &&
      Boolean(smokerHistory) &&
      (smokerHistory !== "Yes" || Boolean(smokesPerDay))) ||
    (currentStep === 5 &&
      heightCm.trim().length > 0 &&
      weightKg.trim().length > 0 &&
      Boolean(knowsBloodPressure) &&
      (knowsBloodPressure !== "Yes" || (Boolean(bpLastTaken) && bpSys.trim().length > 0 && bpDia.trim().length > 0)));

  const canSubmit = currentStep === 6 && confirmTrue === "Yes" && confirmOwnUse === "Yes";

  const stepTitle =
    currentStep === 1
      ? "Patient Selection"
      : currentStep === 2
      ? "Suitability Check"
      : currentStep === 3
      ? "Current Asthma Treatment"
      : currentStep === 4
      ? "Medical Background"
      : currentStep === 5
      ? "Health Measurements"
      : "Confirmation";

  const startQuestionnaire = () => {
    setShowQuestionnaire(true);
    setCurrentStep(1);
    setSubmitted(false);
    setTimeout(() => {
      document.getElementById("asthma-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const nextStep = () => {
    if (!canGoNext || currentStep >= 6) return;
    setCurrentStep((prev) => prev + 1);
    setTimeout(() => {
      document.getElementById("asthma-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const prevStep = () => {
    if (currentStep <= 1) return;
    setCurrentStep((prev) => prev - 1);
    setTimeout(() => {
      document.getElementById("asthma-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const submitQuestionnaire = () => {
    if (!canSubmit) return;
    setSubmitted(true);
    setTimeout(() => {
      document.getElementById("asthma-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
          <section id="asthma-questionnaire" className="pt-28 pb-16">
            <div className="max-w-4xl mx-auto px-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-black uppercase tracking-wider text-primary">{stepTitle}</p>
                <p className="mt-3 text-sm font-bold text-slate-600">Step {currentStep} / 6</p>

                {currentStep === 1 && (
                  <div className="mt-8 space-y-7">
                    <h2 className="text-3xl font-black text-dark-slate dark:text-white">Patient Selection</h2>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">1. This questionnaire is an important part of your medical assessment today.</p>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Our doctors use your answers to ensure this treatment is safe and suitable for you.
                      </p>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Answering the questions honestly is important for your safety and for preventing serious asthma attacks.
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setUnderstandAssessment("I understand")} className={optionButtonClass(understandAssessment === "I understand")}>I understand</button>
                      </div>
                    </div>

                    <div>
                      <p className="font-black text-dark-slate dark:text-white">2. Who are you requesting this treatment for?</p>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Please be aware that if this prescription is approved, it will be issued in the name of this account holder, and will include their personal details.
                      </p>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Submitting a request for another person will result in cancellation without refund.
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        <button
                          type="button"
                          onClick={() => {
                            setRequestFor("For myself");
                            setUnderstandUnsuitable("");
                          }}
                          className={optionButtonClass(requestFor === "For myself")}
                        >
                          For myself
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRequestFor("For a child");
                            setUnderstandUnsuitable("");
                          }}
                          className={optionButtonClass(requestFor === "For a child")}
                        >
                          For a child
                        </button>
                        <button
                          type="button"
                          onClick={() => setRequestFor("For someone else")}
                          className={optionButtonClass(requestFor === "For someone else")}
                        >
                          For someone else
                        </button>
                      </div>
                    </div>

                    {["For someone else", "For a child"].includes(requestFor) && (
                      <div>
                        <p className="font-black uppercase text-dark-slate dark:text-white">3. This service is unsuitable</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                          You cannot apply for a prescription on behalf of another adult.
                        </p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                          If someone aged 17 or older needs a prescription, they must{" "}
                          <span className="font-bold underline">apply through their own account</span>.
                        </p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                          For any registration issues or questions, you can contact us via our{" "}
                          <Link href="/contact" className="font-bold underline">
                            Contact Us form
                          </Link>
                          .
                        </p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={() => setUnderstandUnsuitable("I understand")}
                            className={optionButtonClass(understandUnsuitable === "I understand")}
                          >
                            I understand
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="mt-8 space-y-7">
                    <h2 className="text-3xl font-black text-dark-slate dark:text-white">Suitability Check</h2>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">1. What is your birth sex?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        {["Male", "Female", "Other"].map((item) => (
                          <button key={item} type="button" onClick={() => setBirthSex(item)} className={optionButtonClass(birthSex === item)}>
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    {birthSex === "Female" && (
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">
                          2. Are you currently pregnant, trying to become pregnant or breastfeeding?
                        </p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          {["Yes", "No"].map((item) => (
                            <button key={item} type="button" onClick={() => setPregnancyStatus(item)} className={optionButtonClass(pregnancyStatus === item)}>
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="font-black text-dark-slate dark:text-white">
                        {birthSex === "Female" ? "3" : "2"}. Have you been diagnosed with asthma by a doctor?
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {["Yes, I have", "No, I have not"].map((item) => (
                          <button key={item} type="button" onClick={() => setAsthmaDiagnosed(item)} className={optionButtonClass(asthmaDiagnosed === item)}>
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="font-black text-dark-slate dark:text-white">
                        {(birthSex === "Female" ? 1 : 0) + 3}. Are you requesting a reliever inhaler only?
                      </p>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Reliever-only treatment is not suitable through this written prescription service.
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {["Yes", "No"].map((item) => (
                          <button key={item} type="button" onClick={() => setNeedsRelieverOnly(item)} className={optionButtonClass(needsRelieverOnly === item)}>
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="font-black text-dark-slate dark:text-white">
                        {(birthSex === "Female" ? 1 : 0) + 4}. Do you feel your asthma symptoms are currently well controlled?
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {["Yes", "No"].map((item) => (
                          <button key={item} type="button" onClick={() => setSymptomsControlled(item)} className={optionButtonClass(symptomsControlled === item)}>
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="font-black text-dark-slate dark:text-white">
                        {(birthSex === "Female" ? 1 : 0) + 5}. Are you currently unwell with worsening breathlessness, wheeze, chest pain, or fever?
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {["Yes", "No"].map((item) => (
                          <button key={item} type="button" onClick={() => setAcuteSymptoms(item)} className={optionButtonClass(acuteSymptoms === item)}>
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="mt-8 space-y-7">
                    <h2 className="text-3xl font-black text-dark-slate dark:text-white">Current Asthma Treatment</h2>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">1. Which type of inhaler treatment are you requesting?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {["Preventer inhaler", "Combination inhaler", "Not sure"].map((item) => (
                          <button key={item} type="button" onClick={() => setInhalerType(item)} className={optionButtonClass(inhalerType === item)}>
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">2. Please list your current asthma inhalers and doses.</p>
                      <textarea
                        value={currentInhalers}
                        onChange={(e) => setCurrentInhalers(e.target.value)}
                        rows={4}
                        className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                        placeholder="Example: Symbicort 200/6, 2 puffs twice daily"
                      />
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">3. When was your last asthma review with a doctor or nurse?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        {["Within 6 months", "6-12 months", "Over 12 months / cannot remember"].map((item) => (
                          <button key={item} type="button" onClick={() => setLastReviewWindow(item)} className={optionButtonClass(lastReviewWindow === item)}>
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">4. Have you had side effects from your current inhalers?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {["Yes", "No"].map((item) => (
                          <button key={item} type="button" onClick={() => setInhalerSideEffects(item)} className={optionButtonClass(inhalerSideEffects === item)}>
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="mt-8 space-y-7">
                    <h2 className="text-3xl font-black text-dark-slate dark:text-white">Medical Background</h2>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">1. Do you have any other medical conditions?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {["Yes", "No"].map((item) => (
                          <button key={item} type="button" onClick={() => setOtherConditions(item)} className={optionButtonClass(otherConditions === item)}>
                            {item}
                          </button>
                        ))}
                      </div>
                      {otherConditions === "Yes" && (
                        <textarea
                          value={otherConditionsDetails}
                          onChange={(e) => setOtherConditionsDetails(e.target.value)}
                          rows={3}
                          className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                          placeholder="Please include key diagnoses and treatment"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">2. Do you have any medicine allergies?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {["Yes", "No"].map((item) => (
                          <button key={item} type="button" onClick={() => setMedicineAllergies(item)} className={optionButtonClass(medicineAllergies === item)}>
                            {item}
                          </button>
                        ))}
                      </div>
                      {medicineAllergies === "Yes" && (
                        <textarea
                          value={medicineAllergyDetails}
                          onChange={(e) => setMedicineAllergyDetails(e.target.value)}
                          rows={3}
                          className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                          placeholder="List allergies and reactions"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">3. Are you or have you ever been a smoker?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {["Yes", "No"].map((item) => (
                          <button key={item} type="button" onClick={() => setSmokerHistory(item)} className={optionButtonClass(smokerHistory === item)}>
                            {item}
                          </button>
                        ))}
                      </div>
                      {smokerHistory === "Yes" && (
                        <div>
                          <p className="mt-3 font-black text-dark-slate dark:text-white">4. How many cigarettes do you smoke per day?</p>
                          <div className="mt-3 grid gap-3 sm:grid-cols-4">
                            {["1-5", "6-10", "11-20", "20+"].map((item) => (
                              <button key={item} type="button" onClick={() => setSmokesPerDay(item)} className={optionButtonClass(smokesPerDay === item)}>
                                {item}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="mt-8 space-y-7">
                    <h2 className="text-3xl font-black text-dark-slate dark:text-white">Health Measurements</h2>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">1. Please enter your height (cm).</p>
                      <input
                        type="number"
                        value={heightCm}
                        onChange={(e) => setHeightCm(e.target.value)}
                        className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                        placeholder="e.g. 170"
                      />
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">2. Please enter your weight (kg).</p>
                      <input
                        type="number"
                        value={weightKg}
                        onChange={(e) => setWeightKg(e.target.value)}
                        className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                        placeholder="e.g. 70"
                      />
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">3. Do you know your most recent blood pressure reading?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {["Yes", "No"].map((item) => (
                          <button key={item} type="button" onClick={() => setKnowsBloodPressure(item)} className={optionButtonClass(knowsBloodPressure === item)}>
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                    {knowsBloodPressure === "Yes" && (
                      <>
                        <div>
                          <p className="font-black text-dark-slate dark:text-white">4. When was this blood pressure taken?</p>
                          <div className="mt-3 grid gap-3 sm:grid-cols-3">
                            {["In the last 6 months", "More than 6 months ago", "Cannot remember"].map((item) => (
                              <button key={item} type="button" onClick={() => setBpLastTaken(item)} className={optionButtonClass(bpLastTaken === item)}>
                                {item}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <p className="font-black text-dark-slate dark:text-white">5. SYS reading</p>
                            <input
                              type="number"
                              value={bpSys}
                              onChange={(e) => setBpSys(e.target.value)}
                              className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                              placeholder="e.g. 120"
                            />
                          </div>
                          <div>
                            <p className="font-black text-dark-slate dark:text-white">6. DIA reading</p>
                            <input
                              type="number"
                              value={bpDia}
                              onChange={(e) => setBpDia(e.target.value)}
                              className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                              placeholder="e.g. 80"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="mt-8 space-y-7">
                    <h2 className="text-3xl font-black text-dark-slate dark:text-white">Confirmation</h2>
                    {!submitted ? (
                      <>
                        <div>
                          <p className="font-black text-dark-slate dark:text-white">
                            1. Do you confirm that you have read and understood the information provided and that your answers are true and accurate?
                          </p>
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            {["Yes", "No"].map((item) => (
                              <button key={item} type="button" onClick={() => setConfirmTrue(item)} className={optionButtonClass(confirmTrue === item)}>
                                {item}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="font-black text-dark-slate dark:text-white">
                            2. Please confirm that this treatment request, if approved, is for your own use only.
                          </p>
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            {["Yes", "No"].map((item) => (
                              <button key={item} type="button" onClick={() => setConfirmOwnUse(item)} className={optionButtonClass(confirmOwnUse === item)}>
                                {item}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950/30">
                        <p className="text-xl font-black text-green-800 dark:text-green-300">Request submitted successfully</p>
                        <p className="mt-2 text-sm text-green-700 dark:text-green-300/90">
                          Thank you. Your asthma questionnaire has been submitted for doctor review.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-10 flex flex-wrap items-center gap-3">
                  {currentStep > 1 && (
                    <button type="button" onClick={prevStep} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-black text-slate-700">
                      Back
                    </button>
                  )}
                  {currentStep < 6 && (
                    <button type="button" onClick={nextStep} disabled={!canGoNext} className="rounded-xl bg-primary px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-primary/50">
                      Next
                    </button>
                  )}
                  {currentStep === 6 && !submitted && (
                    <button
                      type="button"
                      onClick={submitQuestionnaire}
                      disabled={!canSubmit}
                      className="rounded-xl bg-primary px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-primary/50"
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
                Asthma Treatment: <span className="text-primary">Fast, Safe, and Doctor-Reviewed</span>
              </h1>
              <ul className="mt-6 space-y-3">
                {[
                  "Reviewed by Irish-registered doctors, usually within hours.",
                  "If suitable, your prescription is sent directly to your local pharmacy.",
                  "Includes combination/preventer inhalers for complete support.",
                  "From just EUR25, available nationwide.",
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
                Need an asthma prescription but not enough time to see your GP? Complete our questionnaire and if
                approved, your prescription is sent to your chosen Irish pharmacy.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
                We cannot prescribe reliever inhalers via this service. Requests for reliever inhalers should be
                discussed with your local GP.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
                Where appropriate, a 6-month prescription usually contains 6 preventer/combination inhalers. We can
                only prescribe inhaler products licensed in Ireland.
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-sm font-bold text-dark-slate dark:text-white">Steroid Inhalers</p>
                <p className="text-sm font-bold text-dark-slate dark:text-white">Reliever (rescue) Inhalers</p>
                <p className="text-sm font-bold text-dark-slate dark:text-white">Combination Inhalers</p>
              </div>
              <div className="space-y-3 mt-5">
                <button type="button" onClick={startQuestionnaire} className="block w-full p-4 rounded-2xl border text-left transition-all bg-primary text-white border-primary">
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
                      If you do not have an asthma management plan, book a Video Consultation to discuss this with one
                      of our doctors.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      If symptoms are not well controlled, follow your asthma management plan or speak with a doctor for
                      advice.
                    </p>
                  </li>
                </ul>
              </div>
              <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-black mb-6">What&apos;s excluded with our service</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">This service is not suitable if you:</p>
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

