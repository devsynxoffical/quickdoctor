"use client";

import React, { useState } from "react";
import { beginPrescriptionCheckout } from '@/lib/serviceCheckout';
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2, ChevronDown, Clock, ShieldCheck, Users, XCircle } from "lucide-react";

const faqs = [
  "What is Premature Ejaculation?",
  "What causes Premature Ejaculation?",
  "Who is this service suitable for?",
  "Who is this service not suitable for?",
  "What treatments can you prescribe?",
  "What are premature ejaculation tablets?",
  "What is an anaesthetic cream?",
  "What does â€˜off-licence 'mean?",
  "Important safety information",
];

const excludedItems = [
  "This service is not suitable for you if you have significant kidney or liver disease.",
  "The treatment prescribed here belongs to a group of medicines called selective serotonin reuptake inhibitors (SSRI) and is licensed in Ireland for the treatment of erectile dysfunction.",
  "SSRI/SNRI medications can also be used to treat depression/anxiety symptoms and SHOULD NOT be taken together due to potentially serious interactions.",
  "You should avoid taking anti-inflammatory medications when you are using this treatment.",
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

export default function PrematureEjaculationTreatmentPage() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [sexuallyActiveDuration, setSexuallyActiveDuration] = useState("");
  const [peProblemDuration, setPeProblemDuration] = useState("");
  const [peFrequency, setPeFrequency] = useState("");
  const [ejaculationTiming, setEjaculationTiming] = useState("");
  const [inRelationship, setInRelationship] = useState("");
  const [relationshipAffected, setRelationshipAffected] = useState("");
  const [masturbationPe, setMasturbationPe] = useState("");
  const [knowCause, setKnowCause] = useState("");
  const [triedTherapy, setTriedTherapy] = useState("");
  const [erectionProblems, setErectionProblems] = useState("");
  const [edTreatmentHistory, setEdTreatmentHistory] = useState("");
  const [preferredMedication, setPreferredMedication] = useState("");
  const [lastBloodPressureCheck, setLastBloodPressureCheck] = useState("");
  const [bloodPressureCheckedBy, setBloodPressureCheckedBy] = useState("");
  const [bloodPressureReading, setBloodPressureReading] = useState("");
  const [recentMedicineUse, setRecentMedicineUse] = useState("");
  const [recentMedicineDetails, setRecentMedicineDetails] = useState("");
  const [advisedAvoidSex, setAdvisedAvoidSex] = useState("");
  const [adviceReason, setAdviceReason] = useState("");
  const [genitalPain, setGenitalPain] = useState("");
  const [pastTreatmentsHistory, setPastTreatmentsHistory] = useState("");
  const [pastTreatmentsDetails, setPastTreatmentsDetails] = useState("");
  const [lowBloodPressureHistory, setLowBloodPressureHistory] = useState("");
  const [lowBloodPressureDetails, setLowBloodPressureDetails] = useState("");
  const [heartConditionHistory, setHeartConditionHistory] = useState("");
  const [heartConditionDetails, setHeartConditionDetails] = useState("");
  const [bleedingDisorderHistory, setBleedingDisorderHistory] = useState("");
  const [bleedingDisorderDetails, setBleedingDisorderDetails] = useState("");
  const [migraineHistory, setMigraineHistory] = useState("");
  const [migraineDetails, setMigraineDetails] = useState("");
  const [epilepsyHistory, setEpilepsyHistory] = useState("");
  const [epilepsyDetails, setEpilepsyDetails] = useState("");
  const [physicalBirthSex, setPhysicalBirthSex] = useState("");
  const [heightUnit, setHeightUnit] = useState<"imperial" | "metric">("imperial");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightUnit, setWeightUnit] = useState<"imperial" | "metric">("imperial");
  const [weightSt, setWeightSt] = useState("");
  const [weightLb, setWeightLb] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [snore, setSnore] = useState("");
  const [neckSize, setNeckSize] = useState("");
  const [confirmTrueAnswers, setConfirmTrueAnswers] = useState("");
  const [agreeTerms, setAgreeTerms] = useState("");
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
    setTimeout(() => {
      document.getElementById("pe-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const canGoNext =
    (currentStep === 1 &&
      sexuallyActiveDuration &&
      peProblemDuration &&
      peFrequency &&
      ejaculationTiming &&
      inRelationship &&
      (inRelationship !== "Yes, I am" || relationshipAffected) &&
      masturbationPe &&
      knowCause &&
      triedTherapy &&
      erectionProblems &&
      edTreatmentHistory &&
      preferredMedication &&
      lastBloodPressureCheck &&
      (lastBloodPressureCheck === "Never" || bloodPressureCheckedBy) &&
      (lastBloodPressureCheck === "Never" || bloodPressureReading.trim().length > 0) &&
      recentMedicineUse &&
      (recentMedicineUse !== "Yes, I am" || recentMedicineDetails.trim().length > 0)) ||
    (currentStep === 2 &&
      advisedAvoidSex &&
      (advisedAvoidSex !== "Yes, I have" || adviceReason.trim().length > 0) &&
      genitalPain) ||
    (currentStep === 3 &&
      pastTreatmentsHistory &&
      (pastTreatmentsHistory !== "Yes, I was" || pastTreatmentsDetails.trim().length > 0) &&
      lowBloodPressureHistory &&
      (lowBloodPressureHistory !== "Yes, I do" || lowBloodPressureDetails.trim().length > 0) &&
      heartConditionHistory &&
      (heartConditionHistory !== "Yes, I do" || heartConditionDetails.trim().length > 0) &&
      bleedingDisorderHistory &&
      (bleedingDisorderHistory !== "Yes, I do" || bleedingDisorderDetails.trim().length > 0) &&
      migraineHistory &&
      (migraineHistory !== "Yes, I do" || migraineDetails.trim().length > 0) &&
      epilepsyHistory &&
      (epilepsyHistory !== "Yes, I do" || epilepsyDetails.trim().length > 0)) ||
    (currentStep === 4 &&
      physicalBirthSex &&
      ((heightUnit === "imperial" && heightFt.trim().length > 0 && heightIn.trim().length > 0) ||
        (heightUnit === "metric" && heightCm.trim().length > 0)) &&
      ((weightUnit === "imperial" && weightSt.trim().length > 0 && weightLb.trim().length > 0) ||
        (weightUnit === "metric" && weightKg.trim().length > 0)) &&
      (physicalBirthSex !== "Male" || (snore && neckSize.trim().length > 0)));

  const canSubmit = confirmTrueAnswers === "I confirm" && agreeTerms === "I agree";

  const nextStep = () => {
    if (!canGoNext || currentStep >= 5) return;
    setCurrentStep((prev) => prev + 1);
    setTimeout(() => {
      document.getElementById("pe-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const prevStep = () => {
    if (currentStep <= 1) return;
    setCurrentStep((prev) => prev - 1);
    setTimeout(() => {
      document.getElementById("pe-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

    const submitQuestionnaire = () => {
    if (!canSubmit) return;
    beginPrescriptionCheckout({
      slug: 'premature-ejaculation-treatment',
      serviceName: 'Premature Ejaculation Treatment',
      payload: {
      sexuallyActiveDuration,
      peProblemDuration,
      peFrequency,
      ejaculationTiming,
      inRelationship,
      relationshipAffected,
      masturbationPe,
      knowCause,
      triedTherapy,
      erectionProblems,
      edTreatmentHistory,
      preferredMedication,
      lastBloodPressureCheck,
      bloodPressureCheckedBy,
      bloodPressureReading,
      recentMedicineUse,
      recentMedicineDetails,
      advisedAvoidSex,
      adviceReason,
      genitalPain,
      pastTreatmentsHistory,
      pastTreatmentsDetails,
      lowBloodPressureHistory,
      lowBloodPressureDetails,
      heartConditionHistory,
      heartConditionDetails,
      bleedingDisorderHistory,
      bleedingDisorderDetails,
      migraineHistory,
      migraineDetails,
      epilepsyHistory,
      epilepsyDetails,
      physicalBirthSex,
      heightUnit,
      heightFt,
      heightIn,
      heightCm,
      weightUnit,
      weightSt,
      weightLb,
      weightKg,
      snore,
      neckSize,
      confirmTrueAnswers,
      agreeTerms,
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <Navbar />

      <div className="pt-24 bg-primary/5 border-y border-primary/10 py-3 px-6 text-center">
        <p className="text-sm font-bold text-primary">
          A healthier year starts now. Check your BMI and access medical weight care from â‚¬50.
        </p>
      </div>

      <main>
        {showQuestionnaire && (
          <section id="pe-questionnaire" className="pt-28 pb-16">
            <div className="max-w-4xl mx-auto px-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Step {currentStep} / 5</p>
                <h2 className="mt-2 text-3xl font-black text-dark-slate dark:text-white">
                  {currentStep === 1
                    ? "Problem Details"
                    : currentStep === 2
                    ? "Health Details"
                    : currentStep === 3
                    ? "History Details"
                    : currentStep === 4
                    ? "Your Physical Characteristics"
                    : currentStep === 5
                    ? "Consent"
                    : "Step In Progress"}
                </h2>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Please answer all questions below.</p>

                {currentStep === 1 && <div className="mt-8 space-y-7">
                  <div>
                    <p className="font-black text-dark-slate dark:text-white">1. For how long have you been sexually active?</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {["Fewer than six months", "Six months to a year", "One year to five years", "More than five years"].map((item) => (
                        <button key={item} type="button" onClick={() => setSexuallyActiveDuration(item)} className={optionButtonClass(sexuallyActiveDuration === item)}>{item}</button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-black text-dark-slate dark:text-white">2. For how long has your Premature Ejaculation (PE) been a problem?</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {["Ever since I started having sex", "This is a recent problem"].map((item) => (
                        <button key={item} type="button" onClick={() => setPeProblemDuration(item)} className={optionButtonClass(peProblemDuration === item)}>{item}</button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-black text-dark-slate dark:text-white">3. How often do you experience PE?</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {["Everytime I have sex", "Only when I have sex with a new partner", "Other"].map((item) => (
                        <button key={item} type="button" onClick={() => setPeFrequency(item)} className={optionButtonClass(peFrequency === item)}>{item}</button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-black text-dark-slate dark:text-white">4. When does ejaculation occur?</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {[
                        "During foreplay",
                        "At attempted penetration",
                        "Just after penetration",
                        "Fewer than two minutes after penetration",
                        "More than two minutes after penetration",
                      ].map((item) => (
                        <button key={item} type="button" onClick={() => setEjaculationTiming(item)} className={optionButtonClass(ejaculationTiming === item)}>{item}</button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-black text-dark-slate dark:text-white">5. Are you in a relationship at this time?</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <button type="button" onClick={() => setInRelationship("Yes, I am")} className={optionButtonClass(inRelationship === "Yes, I am")}>Yes, I am</button>
                      <button type="button" onClick={() => { setInRelationship("No, I'm not"); setRelationshipAffected(""); }} className={optionButtonClass(inRelationship === "No, I'm not")}>No, I&apos;m not</button>
                    </div>
                    {inRelationship === "Yes, I am" && (
                      <div className="mt-4">
                        <p className="text-sm text-dark-slate dark:text-white">Does this condition affect your relationship?</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => setRelationshipAffected("Yes, it does")} className={optionButtonClass(relationshipAffected === "Yes, it does")}>Yes, it does</button>
                          <button type="button" onClick={() => setRelationshipAffected("No, it doesn't")} className={optionButtonClass(relationshipAffected === "No, it doesn't")}>No, it doesn&apos;t</button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="font-black text-dark-slate dark:text-white">6. During masturbation, does PE occur?</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <button type="button" onClick={() => setMasturbationPe("Yes, it does")} className={optionButtonClass(masturbationPe === "Yes, it does")}>Yes, it does</button>
                      <button type="button" onClick={() => setMasturbationPe("No, it doesn't")} className={optionButtonClass(masturbationPe === "No, it doesn't")}>No, it doesn&apos;t</button>
                    </div>
                  </div>

                  <div>
                    <p className="font-black text-dark-slate dark:text-white">7. Do you know what might be the cause of your PE?</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <button type="button" onClick={() => setKnowCause("Yes, I do")} className={optionButtonClass(knowCause === "Yes, I do")}>Yes, I do</button>
                      <button type="button" onClick={() => setKnowCause("No, I do not")} className={optionButtonClass(knowCause === "No, I do not")}>No, I do not</button>
                    </div>
                  </div>

                  <div>
                    <p className="font-black text-dark-slate dark:text-white">8. Have you ever tried any therapy or medicine for PE?</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <button type="button" onClick={() => setTriedTherapy("Yes, I have")} className={optionButtonClass(triedTherapy === "Yes, I have")}>Yes, I have</button>
                      <button type="button" onClick={() => setTriedTherapy("No, I've not")} className={optionButtonClass(triedTherapy === "No, I've not")}>No, I&apos;ve not</button>
                    </div>
                  </div>

                  <div>
                    <p className="font-black text-dark-slate dark:text-white">9. Do you have any problems getting or maintaining an erection before ejaculation?</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <button type="button" onClick={() => setErectionProblems("Yes, I do")} className={optionButtonClass(erectionProblems === "Yes, I do")}>Yes, I do</button>
                      <button type="button" onClick={() => setErectionProblems("No, I do not")} className={optionButtonClass(erectionProblems === "No, I do not")}>No, I do not</button>
                    </div>
                  </div>

                  <div>
                    <p className="font-black text-dark-slate dark:text-white">10. Have you ever received or are you currently receiving treatment for erectile dysfunction?</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <button type="button" onClick={() => setEdTreatmentHistory("Yes, I have")} className={optionButtonClass(edTreatmentHistory === "Yes, I have")}>Yes, I have</button>
                      <button type="button" onClick={() => setEdTreatmentHistory("No, I've not")} className={optionButtonClass(edTreatmentHistory === "No, I've not")}>No, I&apos;ve not</button>
                    </div>
                  </div>

                  <div>
                    <p className="font-black text-dark-slate dark:text-white">11. Which medication would you like to apply for?</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <button type="button" onClick={() => setPreferredMedication("EMLA")} className={optionButtonClass(preferredMedication === "EMLA")}>EMLA</button>
                      <button type="button" onClick={() => setPreferredMedication("Priligy")} className={optionButtonClass(preferredMedication === "Priligy")}>Priligy</button>
                    </div>
                  </div>

                  <div>
                    <p className="font-black text-dark-slate dark:text-white">
                      When did you last have your blood pressure taken? (Blood pressure monitoring is an essential part of
                      the safety assessment when prescribing contraceptive medications as some contraceptives can increase
                      blood pressure. If this happens, and you continue to use these contraceptives you are at increased
                      risk of stroke and heart disease, regardless of your age.)
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      {["In the last 6 months", "More than 6 months ago", "Never"].map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setLastBloodPressureCheck(item);
                            if (item === "Never") {
                              setBloodPressureCheckedBy("");
                              setBloodPressureReading("");
                            }
                          }}
                          className={optionButtonClass(lastBloodPressureCheck === item)}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  {lastBloodPressureCheck && lastBloodPressureCheck !== "Never" && (
                    <>
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">Whom have you last have your blood pressure taken by?</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-3">
                          {["Doctor", "Nurse", "Pharmacy", "Personal Monitor", "Gym or Club", "Other"].map((item) => (
                            <button key={item} type="button" onClick={() => setBloodPressureCheckedBy(item)} className={optionButtonClass(bloodPressureCheckedBy === item)}>
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">Please use the input below to enter your blood pressure</p>
                        <input
                          value={bloodPressureReading}
                          onChange={(event) => setBloodPressureReading(event.target.value)}
                          placeholder="e.g. 120/80"
                          className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <p className="font-black text-dark-slate dark:text-white">
                      Are you currently or in the last two months have you taken any medicine (prescribed or not),
                      alternative medicines or recreational drugs other than those you have mentioned previously?
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <button type="button" onClick={() => setRecentMedicineUse("Yes, I am")} className={optionButtonClass(recentMedicineUse === "Yes, I am")}>Yes, I am</button>
                      <button type="button" onClick={() => { setRecentMedicineUse("No, I'm not"); setRecentMedicineDetails(""); }} className={optionButtonClass(recentMedicineUse === "No, I'm not")}>No, I&apos;m not</button>
                    </div>
                    {recentMedicineUse === "Yes, I am" && (
                      <div className="mt-4">
                        <p className="text-sm text-dark-slate dark:text-white">Please give us more information in the text box</p>
                        <textarea
                          value={recentMedicineDetails}
                          onChange={(event) => setRecentMedicineDetails(event.target.value)}
                          className="mt-3 min-h-[120px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        />
                      </div>
                    )}
                  </div>
                </div>}

                {currentStep === 2 && (
                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">
                        1. Were you ever advised by any Healthcare provider (Doctor, Nurse or Pharmacist) that you should avoid sexual activity?
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setAdvisedAvoidSex("Yes, I have")} className={optionButtonClass(advisedAvoidSex === "Yes, I have")}>Yes, I have</button>
                        <button type="button" onClick={() => { setAdvisedAvoidSex("No, I've not"); setAdviceReason(""); }} className={optionButtonClass(advisedAvoidSex === "No, I've not")}>No, I&apos;ve not</button>
                      </div>
                      {advisedAvoidSex === "Yes, I have" && (
                        <div className="mt-4">
                          <p className="text-sm text-dark-slate dark:text-white">Why was this advice given?</p>
                          <textarea
                            value={adviceReason}
                            onChange={(event) => setAdviceReason(event.target.value)}
                            className="mt-3 min-h-[120px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">
                        2. Do you have any pain in your genitals, when you ejaculate or when you pass urine?
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setGenitalPain("Yes, I have")} className={optionButtonClass(genitalPain === "Yes, I have")}>Yes, I have</button>
                        <button type="button" onClick={() => setGenitalPain("No, I've not")} className={optionButtonClass(genitalPain === "No, I've not")}>No, I&apos;ve not</button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">
                        1. Apart from the issues already mentioned, were you ever treated for any previous Accidents, Operations, Investigations or Illnesses?
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setPastTreatmentsHistory("Yes, I was")} className={optionButtonClass(pastTreatmentsHistory === "Yes, I was")}>Yes, I was</button>
                        <button type="button" onClick={() => { setPastTreatmentsHistory("No, I was not"); setPastTreatmentsDetails(""); }} className={optionButtonClass(pastTreatmentsHistory === "No, I was not")}>No, I was not</button>
                      </div>
                      {pastTreatmentsHistory === "Yes, I was" && (
                        <div className="mt-4">
                          <p className="text-sm text-dark-slate dark:text-white">
                            Please give us more details in the text box (Please detail when these Accidents, Operations, Investigations or Illnesses occurred, what was the cause and are you currently on any treatment for the condition(s).)
                          </p>
                          <textarea
                            value={pastTreatmentsDetails}
                            onChange={(event) => setPastTreatmentsDetails(event.target.value)}
                            className="mt-3 min-h-[120px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="font-black text-dark-slate dark:text-white">
                        2. Do you have a history of low blood pressure, fainting or, after lying down, do you get dizzy when you stand up?
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setLowBloodPressureHistory("Yes, I do")} className={optionButtonClass(lowBloodPressureHistory === "Yes, I do")}>Yes, I do</button>
                        <button type="button" onClick={() => { setLowBloodPressureHistory("No, I do not"); setLowBloodPressureDetails(""); }} className={optionButtonClass(lowBloodPressureHistory === "No, I do not")}>No, I do not</button>
                      </div>
                      {lowBloodPressureHistory === "Yes, I do" && (
                        <div className="mt-4">
                          <p className="text-sm text-dark-slate dark:text-white">
                            Please give us more information in the text box (Please detail when this occurred, was this investigated by your doctor, what was the final cause or is it still a problem?)
                          </p>
                          <textarea
                            value={lowBloodPressureDetails}
                            onChange={(event) => setLowBloodPressureDetails(event.target.value)}
                            className="mt-3 min-h-[120px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="font-black text-dark-slate dark:text-white">
                        3. Do you suffer from any heart conditions such as angina or irregular heart rhythm?
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setHeartConditionHistory("Yes, I do")} className={optionButtonClass(heartConditionHistory === "Yes, I do")}>Yes, I do</button>
                        <button type="button" onClick={() => { setHeartConditionHistory("No, I do not"); setHeartConditionDetails(""); }} className={optionButtonClass(heartConditionHistory === "No, I do not")}>No, I do not</button>
                      </div>
                      {heartConditionHistory === "Yes, I do" && (
                        <textarea
                          value={heartConditionDetails}
                          onChange={(event) => setHeartConditionDetails(event.target.value)}
                          placeholder="Please provide details"
                          className="mt-3 min-h-[100px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        />
                      )}
                    </div>

                    <div>
                      <p className="font-black text-dark-slate dark:text-white">4. Do you have a bleeding or clotting disorder?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setBleedingDisorderHistory("Yes, I do")} className={optionButtonClass(bleedingDisorderHistory === "Yes, I do")}>Yes, I do</button>
                        <button type="button" onClick={() => { setBleedingDisorderHistory("No, I do not"); setBleedingDisorderDetails(""); }} className={optionButtonClass(bleedingDisorderHistory === "No, I do not")}>No, I do not</button>
                      </div>
                      {bleedingDisorderHistory === "Yes, I do" && (
                        <textarea
                          value={bleedingDisorderDetails}
                          onChange={(event) => setBleedingDisorderDetails(event.target.value)}
                          placeholder="Please provide details"
                          className="mt-3 min-h-[100px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        />
                      )}
                    </div>

                    <div>
                      <p className="font-black text-dark-slate dark:text-white">5. Do you have a history of migraines or severe headaches?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setMigraineHistory("Yes, I do")} className={optionButtonClass(migraineHistory === "Yes, I do")}>Yes, I do</button>
                        <button type="button" onClick={() => { setMigraineHistory("No, I do not"); setMigraineDetails(""); }} className={optionButtonClass(migraineHistory === "No, I do not")}>No, I do not</button>
                      </div>
                      {migraineHistory === "Yes, I do" && (
                        <textarea
                          value={migraineDetails}
                          onChange={(event) => setMigraineDetails(event.target.value)}
                          placeholder="Please provide details"
                          className="mt-3 min-h-[100px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        />
                      )}
                    </div>

                    <div>
                      <p className="font-black text-dark-slate dark:text-white">6. Have you been treated for epilepsy or have you suffered from seizures?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setEpilepsyHistory("Yes, I do")} className={optionButtonClass(epilepsyHistory === "Yes, I do")}>Yes, I do</button>
                        <button type="button" onClick={() => { setEpilepsyHistory("No, I do not"); setEpilepsyDetails(""); }} className={optionButtonClass(epilepsyHistory === "No, I do not")}>No, I do not</button>
                      </div>
                      {epilepsyHistory === "Yes, I do" && (
                        <textarea
                          value={epilepsyDetails}
                          onChange={(event) => setEpilepsyDetails(event.target.value)}
                          placeholder="Please provide details"
                          className="mt-3 min-h-[100px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        />
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">1. What is your birth sex?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        {["Female", "Male", "Intersex"].map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              setPhysicalBirthSex(item);
                              if (item !== "Male") {
                                setSnore("");
                                setNeckSize("");
                              }
                            }}
                            className={optionButtonClass(physicalBirthSex === item)}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="font-black text-dark-slate dark:text-white">2. Please use the input below to enter your height</p>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        I am {heightFt || 0}ft {heightIn || 0}in or {heightCm || 0}cm tall
                      </p>
                      {heightUnit === "imperial" ? (
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <div>
                            <input value={heightFt} onChange={(e) => setHeightFt(e.target.value.replace(/[^0-9.]/g, ""))} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm" />
                            <p className="mt-1 text-xs text-slate-500">ft</p>
                          </div>
                          <div>
                            <input value={heightIn} onChange={(e) => setHeightIn(e.target.value.replace(/[^0-9.]/g, ""))} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm" />
                            <p className="mt-1 text-xs text-slate-500">in</p>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3">
                          <input value={heightCm} onChange={(e) => setHeightCm(e.target.value.replace(/[^0-9.]/g, ""))} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm" />
                          <p className="mt-1 text-xs text-slate-500">cm</p>
                        </div>
                      )}
                      <button type="button" onClick={() => setHeightUnit(heightUnit === "imperial" ? "metric" : "imperial")} className="mt-3 text-sm font-bold text-primary">
                        {heightUnit === "imperial" ? "Click to enter as centimeters" : "Click to enter as ft/in"}
                      </button>
                    </div>

                    <div>
                      <p className="font-black text-dark-slate dark:text-white">3. Please use the input below to enter your weight</p>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        I weigh {weightSt || 0}st {weightLb || 0}lb or {weightKg || 0}kg
                      </p>
                      {weightUnit === "imperial" ? (
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <div>
                            <input value={weightSt} onChange={(e) => setWeightSt(e.target.value.replace(/[^0-9.]/g, ""))} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm" />
                            <p className="mt-1 text-xs text-slate-500">st</p>
                          </div>
                          <div>
                            <input value={weightLb} onChange={(e) => setWeightLb(e.target.value.replace(/[^0-9.]/g, ""))} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm" />
                            <p className="mt-1 text-xs text-slate-500">lbs</p>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3">
                          <input value={weightKg} onChange={(e) => setWeightKg(e.target.value.replace(/[^0-9.]/g, ""))} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm" />
                          <p className="mt-1 text-xs text-slate-500">kg</p>
                        </div>
                      )}
                      <button type="button" onClick={() => setWeightUnit(weightUnit === "imperial" ? "metric" : "imperial")} className="mt-3 text-sm font-bold text-primary">
                        {weightUnit === "imperial" ? "Click to enter as kg" : "Click to enter as st/lbs"}
                      </button>
                    </div>

                    {physicalBirthSex === "Male" && (
                      <>
                        <div>
                          <p className="font-black text-dark-slate dark:text-white">Do you snore?</p>
                          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            This information can help your doctor assess your overall health and in particular the quality of your sleep.
                          </p>
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            <button type="button" onClick={() => setSnore("Yes")} className={optionButtonClass(snore === "Yes")}>Yes</button>
                            <button type="button" onClick={() => setSnore("No")} className={optionButtonClass(snore === "No")}>No</button>
                          </div>
                        </div>

                        <div>
                          <p className="font-black text-dark-slate dark:text-white">
                            4. Please input your neck size below, e.g enter 16.5 if your neck measures 16.5 inches.
                          </p>
                          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            The size of the neck in a male is a useful measurement that can help your doctor make help make a more accurate assessment. Please use inches when entering your neck circumference.
                          </p>
                          <input
                            value={neckSize}
                            onChange={(e) => setNeckSize(e.target.value.replace(/[^0-9.]/g, ""))}
                            className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
                            placeholder="e.g. 16.5"
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="mt-8 space-y-7">
                    {submitted ? (
                      <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6">
                        <p className="text-2xl font-black text-emerald-900">Request submitted</p>
                        <p className="mt-2 text-sm text-emerald-900">
                          Your premature ejaculation questionnaire has been submitted for doctor review.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div>
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            Medication can interact with many prescribed, over the counter and recreational drugs. Please
                            consider your responses and please answer honestly and clearly.
                          </p>
                          <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
                            Any and all information that you provide in this questionnaire is protected by the exact same
                            patient-doctor confidentiality you would expect from seeing a doctor face to face.
                          </p>
                        </div>
                        <div>
                          <p className="font-black text-dark-slate dark:text-white">
                            I confirm that I have read and understood this and my answers are fully correct and true.
                          </p>
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            <button type="button" onClick={() => setConfirmTrueAnswers("I confirm")} className={optionButtonClass(confirmTrueAnswers === "I confirm")}>I confirm</button>
                            <button type="button" onClick={() => setConfirmTrueAnswers("I do not confirm")} className={optionButtonClass(confirmTrueAnswers === "I do not confirm")}>I do not confirm</button>
                          </div>
                        </div>
                        <div>
                          <p className="font-black text-dark-slate dark:text-white">
                            Before continuing you must agree to Webdoctor.ie&apos;s Terms &amp; Conditions.
                          </p>
                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            <button type="button" onClick={() => setAgreeTerms("I agree")} className={optionButtonClass(agreeTerms === "I agree")}>I agree</button>
                            <button type="button" onClick={() => setAgreeTerms("I do not agree")} className={optionButtonClass(agreeTerms === "I do not agree")}>I do not agree</button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

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
                  {currentStep < 5 ? (
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
                      disabled={!canSubmit || submitted}
                      className={`px-6 py-3 rounded-xl font-bold text-sm ${
                        canSubmit && !submitted ? "bg-primary text-white" : "bg-slate-200 text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      Submit
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
                Premature Ejaculation <span className="text-primary">Treatment</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-6 leading-relaxed">
                Ireland&apos;s Award-Winning Online Doctor Service.
              </p>
            </div>

            <div className="rounded-[36px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
              <h3 className="text-2xl font-black mb-5">Treatments that we can provide</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                If premature ejaculation is causing you distress, Webdoctor.ie can help. We can provide prescriptions for
                premature ejaculation treatment. Simply fill in a short suitability questionnaire and one of our
                Irish-registered doctors will issue a prescription if medically suitable.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
                We provide 6-month prescriptions for a number of premature ejaculation treatments online. Please check
                your dispensed prescription before leaving the Pharmacy as no changes can be made after that point.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <li>Oral Tablets (Selective Serotonin Re-uptake Inhibitor)</li>
                <li>Anaesthetic (numbing) cream</li>
              </ul>
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
                      Webdoctor.ie provides prescriptions for tablets or an anaesthetic cream, subject to clinical
                      suitability.
                    </p>
                  </li>
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

