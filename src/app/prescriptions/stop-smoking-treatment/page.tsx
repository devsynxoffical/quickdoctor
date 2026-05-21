"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2, ChevronDown, Clock, ShieldCheck, Users, XCircle } from "lucide-react";

const faqItems = [
  "Why Should I Quit Smoking?",
  "Who Is This Service Suitable For?",
  "Can I get tablets to help me stop smoking online in Ireland?",
  "Do tablets to help me stop smoking really work?",
  "Are there side effects of using tablets to quit smoking?",
  "How soon before my quit date should I start taking my oral tablets?",
];

const excludedItems = [
  "Are under 18 years of age.",
  "Are pregnant, possibly pregnant, or breastfeeding.",
  "Are taking more than one form of smoking cessation therapy at a time.",
  "Have ever been treated for psychological or psychiatric problems.",
  "Have a history of seizures or a condition that increases seizure risk.",
  "Have reduced kidney function.",
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

export default function StopSmokingTreatmentPage() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [patientSelection, setPatientSelection] = useState("");
  const [understandUnsuitable, setUnderstandUnsuitable] = useState(false);
  const [understandCourseOnly, setUnderstandCourseOnly] = useState(false);
  const [birthSex, setBirthSex] = useState("");
  const [pregnantOrBreastfeeding, setPregnantOrBreastfeeding] = useState("");
  const [understandPregnancyUnsuitable, setUnderstandPregnancyUnsuitable] = useState(false);
  const [age, setAge] = useState("");
  const [smokingAmount, setSmokingAmount] = useState("");
  const [usedVareniclineBefore, setUsedVareniclineBefore] = useState("");
  const [lastUsedVarenicline, setLastUsedVarenicline] = useState("");
  const [stopSmokingSuccess, setStopSmokingSuccess] = useState("");
  const [unsuccessfulReason, setUnsuccessfulReason] = useState("");
  const [hadSideEffects, setHadSideEffects] = useState("");
  const [listedSideEffects, setListedSideEffects] = useState("");
  const [understandSideEffectsUnsuitable, setUnderstandSideEffectsUnsuitable] = useState(false);
  const [medicalConditions, setMedicalConditions] = useState("");
  const [takingQuitTherapy, setTakingQuitTherapy] = useState("");
  const [understandQuitTherapyUnsuitable, setUnderstandQuitTherapyUnsuitable] = useState(false);
  const [takingInteractionMeds, setTakingInteractionMeds] = useState("");
  const [understandInteractionUnsuitable, setUnderstandInteractionUnsuitable] = useState(false);
  const [understandImportantInfo, setUnderstandImportantInfo] = useState(false);
  const [understandInformGp, setUnderstandInformGp] = useState(false);
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
    setSubmitted(false);
    setTimeout(() => {
      document.getElementById("stop-smoking-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const showUnsuitableMessage = patientSelection === "For a child" || patientSelection === "For someone else";
  const showFemalePregnancyQuestion = birthSex === "Female";
  const showPregnancyUnsuitable = birthSex === "Male" || (showFemalePregnancyQuestion && pregnantOrBreastfeeding === "Yes");
  const showVareniclineFollowup = usedVareniclineBefore === "Yes";
  const showStopSmokingSuccessQuestion = showVareniclineFollowup && lastUsedVarenicline === "More than 12 weeks ago";
  const showUnsuccessfulReasonQuestion = showStopSmokingSuccessQuestion && stopSmokingSuccess === "No, but I'd like to try again";
  const showListedSideEffectsQuestion = showVareniclineFollowup && hadSideEffects === "Yes";
  const showSideEffectsUnsuitable = showListedSideEffectsQuestion && listedSideEffects === "Yes";
  const showQuitTherapyUnsuitable = takingQuitTherapy === "Yes";
  const showInteractionUnsuitable = takingInteractionMeds === "Yes";
  const canGoNext =
    (currentStep === 1 && patientSelection.length > 0 && (!showUnsuitableMessage || understandUnsuitable)) ||
    (currentStep === 2 &&
      understandCourseOnly &&
      birthSex &&
      (!showFemalePregnancyQuestion || pregnantOrBreastfeeding) &&
      (!showPregnancyUnsuitable || understandPregnancyUnsuitable) &&
      age.trim().length > 0 &&
      smokingAmount &&
      usedVareniclineBefore &&
      (!showVareniclineFollowup || lastUsedVarenicline) &&
      (!showStopSmokingSuccessQuestion || stopSmokingSuccess) &&
      (!showUnsuccessfulReasonQuestion || unsuccessfulReason.trim().length > 0) &&
      (!showVareniclineFollowup || hadSideEffects) &&
      (!showListedSideEffectsQuestion || listedSideEffects) &&
      (!showSideEffectsUnsuitable || understandSideEffectsUnsuitable) &&
      medicalConditions &&
      takingQuitTherapy &&
      (!showQuitTherapyUnsuitable || understandQuitTherapyUnsuitable) &&
      takingInteractionMeds &&
      (!showInteractionUnsuitable || understandInteractionUnsuitable)) ||
    (currentStep === 3 && understandImportantInfo && understandInformGp);

  const nextStep = () => {
    if (!canGoNext || currentStep >= 3) return;
    setCurrentStep((prev) => prev + 1);
    setTimeout(() => {
      document.getElementById("stop-smoking-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const prevStep = () => {
    if (currentStep <= 1) return;
    setCurrentStep((prev) => prev - 1);
    setTimeout(() => {
      document.getElementById("stop-smoking-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const submitQuestionnaire = () => {
    setSubmitted(true);
    setTimeout(() => {
      document.getElementById("stop-smoking-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  let step2Counter = 1;
  const step2Q1 = step2Counter++;
  const step2Q2 = step2Counter++;
  const step2Q3 = showFemalePregnancyQuestion ? step2Counter++ : null;
  const step2UnsuitablePregnancy = showPregnancyUnsuitable ? step2Counter++ : null;
  const step2QAge = step2Counter++;
  const step2QSmoking = step2Counter++;
  const step2QUsedVarenicline = step2Counter++;
  const step2QLastUsed = showVareniclineFollowup ? step2Counter++ : null;
  const step2QSuccess = showStopSmokingSuccessQuestion ? step2Counter++ : null;
  const step2QReason = showUnsuccessfulReasonQuestion ? step2Counter++ : null;
  const step2QSideEffects = showVareniclineFollowup ? step2Counter++ : null;
  const step2QListedSideEffects = showListedSideEffectsQuestion ? step2Counter++ : null;
  const step2UnsuitableSideEffects = showSideEffectsUnsuitable ? step2Counter++ : null;
  const step2QMedicalConditions = step2Counter++;
  const step2QQuitTherapy = step2Counter++;
  const step2UnsuitableQuitTherapy = showQuitTherapyUnsuitable ? step2Counter++ : null;
  const step2QInteractionMeds = step2Counter++;
  const step2UnsuitableInteraction = showInteractionUnsuitable ? step2Counter++ : null;

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
          <section id="stop-smoking-questionnaire" className="pt-28 pb-16">
            <div className="max-w-4xl mx-auto px-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Step {currentStep} / 3</p>
                <h2 className="mt-2 text-3xl font-black text-dark-slate dark:text-white">
                  {currentStep === 1 ? "Patient Selection" : currentStep === 2 ? "Medical Safety Check" : "Confirmation"}
                </h2>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                  This questionnaire is an important part of your assessment today. We ask that you are honest with your answers.
                </p>

                {currentStep === 1 && <div className="mt-8 space-y-7">
                  <div>
                    <p className="font-black text-dark-slate dark:text-white">1. Who are you requesting this treatment for?</p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      Please be aware that if this prescription is approved, it will be issued in the name of this account
                      holder, and will include their personal details.
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-1">
                      <button
                        type="button"
                        onClick={() => {
                          setPatientSelection("For myself");
                          setUnderstandUnsuitable(false);
                        }}
                        className={optionButtonClass(patientSelection === "For myself")}
                      >
                        For myself
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPatientSelection("For a child");
                          setUnderstandUnsuitable(false);
                        }}
                        className={optionButtonClass(patientSelection === "For a child")}
                      >
                        For a child
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPatientSelection("For someone else");
                          setUnderstandUnsuitable(false);
                        }}
                        className={optionButtonClass(patientSelection === "For someone else")}
                      >
                        For someone else
                      </button>
                    </div>
                  </div>

                  {showUnsuitableMessage && (
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">2. THIS SERVICE IS UNSUITABLE</p>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        This service is only suitable for <span className="font-bold italic">individuals aged 18 and older.</span>
                      </p>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        If someone aged 18 or older requires treatment, they must{" "}
                        <span className="font-bold underline">apply through their own account.</span>
                      </p>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        For any registration issues or questions, you can contact us at info@webdoctor.ie.
                      </p>
                      <div className="mt-3 max-w-[180px]">
                        <button
                          type="button"
                          onClick={() => setUnderstandUnsuitable(true)}
                          className={optionButtonClass(understandUnsuitable)}
                        >
                          I understand
                        </button>
                      </div>
                    </div>
                  )}
                </div>}

                {currentStep === 2 && (
                  <div className="mt-8 space-y-7">
                    <div>
                      <p className="font-black text-dark-slate dark:text-white">
                        {step2Q1}. We prescribe a 12-week course of varenicline (0.5mg/ 1mg) through this service.
                      </p>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        We&apos;re not able to prescribe alternative medications.
                      </p>
                      <div className="mt-3 max-w-[180px]">
                        <button type="button" onClick={() => setUnderstandCourseOnly(true)} className={optionButtonClass(understandCourseOnly)}>
                          I understand
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="font-black text-dark-slate dark:text-white">{step2Q2}. What is your birth sex?</p>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        We ask for your birth sex (rather than gender identity) to guide the medical questions asked and to
                        make sure the treatment is medically safe for you.
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => {
                            setBirthSex("Female");
                            setPregnantOrBreastfeeding("");
                            setUnderstandPregnancyUnsuitable(false);
                          }}
                          className={optionButtonClass(birthSex === "Female")}
                        >
                          Female
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setBirthSex("Male");
                            setPregnantOrBreastfeeding("No");
                            setUnderstandPregnancyUnsuitable(false);
                          }}
                          className={optionButtonClass(birthSex === "Male")}
                        >
                          Male
                        </button>
                      </div>
                    </div>

                    {showFemalePregnancyQuestion && (
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">{step2Q3}. Do any of the following apply to you?</p>
                        <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                          <p>Pregnant</p>
                          <p>Breastfeeding</p>
                        </div>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => { setPregnantOrBreastfeeding("Yes"); setUnderstandPregnancyUnsuitable(false); }} className={optionButtonClass(pregnantOrBreastfeeding === "Yes")}>Yes</button>
                          <button type="button" onClick={() => { setPregnantOrBreastfeeding("No"); setUnderstandPregnancyUnsuitable(false); }} className={optionButtonClass(pregnantOrBreastfeeding === "No")}>No</button>
                        </div>
                      </div>
                    )}

                    {showPregnancyUnsuitable && (
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">{step2UnsuitablePregnancy}. THIS SERVICE IS UNSUITABLE</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                          Varenicline may not be safe in these circumstances. We advise not to take this medication right now and use{" "}
                          <span className="font-bold underline">alternative smoking cessation options.</span>
                        </p>
                        <div className="mt-3 max-w-[180px]">
                          <button type="button" onClick={() => setUnderstandPregnancyUnsuitable(true)} className={optionButtonClass(understandPregnancyUnsuitable)}>
                            I understand
                          </button>
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="font-black text-dark-slate dark:text-white">{step2QAge}. What is your age?</p>
                      <input
                        value={age}
                        onChange={(event) => setAge(event.target.value.replace(/[^0-9]/g, ""))}
                        inputMode="numeric"
                        placeholder="Enter your age"
                        className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <p className="font-black text-dark-slate dark:text-white">{step2QSmoking}. How much do you currently smoke?</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {["Occasionally/socially", "Daily - less than 10 a day", "Daily - more than 10 a day", "Not currently smoking"].map((item) => (
                          <button key={item} type="button" onClick={() => setSmokingAmount(item)} className={optionButtonClass(smokingAmount === item)}>
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="font-black text-dark-slate dark:text-white">
                        {step2QUsedVarenicline}. Have you ever used varenicline (Champix) to try and stop smoking before?
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => {
                            setUsedVareniclineBefore("Yes");
                            setUnderstandSideEffectsUnsuitable(false);
                          }}
                          className={optionButtonClass(usedVareniclineBefore === "Yes")}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setUsedVareniclineBefore("No");
                            setLastUsedVarenicline("");
                            setStopSmokingSuccess("");
                            setUnsuccessfulReason("");
                            setHadSideEffects("");
                            setListedSideEffects("");
                            setUnderstandSideEffectsUnsuitable(false);
                          }}
                          className={optionButtonClass(usedVareniclineBefore === "No")}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {showVareniclineFollowup && (
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">{step2QLastUsed}. When did you last use varenicline?</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => { setLastUsedVarenicline("Within the last 12 weeks"); setStopSmokingSuccess(""); setUnsuccessfulReason(""); }} className={optionButtonClass(lastUsedVarenicline === "Within the last 12 weeks")}>Within the last 12 weeks</button>
                          <button type="button" onClick={() => setLastUsedVarenicline("More than 12 weeks ago")} className={optionButtonClass(lastUsedVarenicline === "More than 12 weeks ago")}>More than 12 weeks ago</button>
                        </div>
                      </div>
                    )}

                    {showStopSmokingSuccessQuestion && (
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">{step2QSuccess}. Did you successfully stop smoking using varenicline?</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => { setStopSmokingSuccess("Yes"); setUnsuccessfulReason(""); }} className={optionButtonClass(stopSmokingSuccess === "Yes")}>Yes</button>
                          <button type="button" onClick={() => setStopSmokingSuccess("No, but I'd like to try again")} className={optionButtonClass(stopSmokingSuccess === "No, but I'd like to try again")}>No, but I&apos;d like to try again</button>
                        </div>
                      </div>
                    )}

                    {showUnsuccessfulReasonQuestion && (
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">{step2QReason}. Please tell us more about why you were unsuccessful previously</p>
                        <textarea
                          value={unsuccessfulReason}
                          onChange={(event) => setUnsuccessfulReason(event.target.value)}
                          className="mt-3 min-h-[120px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-dark-slate outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        />
                      </div>
                    )}

                    {showVareniclineFollowup && (
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">{step2QSideEffects}. Did you have any side effects from varenicline?</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => { setHadSideEffects("Yes"); setUnderstandSideEffectsUnsuitable(false); }} className={optionButtonClass(hadSideEffects === "Yes")}>Yes</button>
                          <button type="button" onClick={() => { setHadSideEffects("No"); setListedSideEffects(""); setUnderstandSideEffectsUnsuitable(false); }} className={optionButtonClass(hadSideEffects === "No")}>No</button>
                        </div>
                      </div>
                    )}

                    {showListedSideEffectsQuestion && (
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">{step2QListedSideEffects}. Did you experience any of the listed side effects?</p>
                        <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                          <p>Mood changes (e.g., depression, anxiety, irritability)</p>
                          <p>Suicidal thoughts or behaviour</p>
                          <p>Seizures</p>
                          <p>Allergic reaction (e.g. rash, swelling, difficulty breathing)</p>
                          <p>Cardiovascular problems (e.g chest pain, palpitations)</p>
                        </div>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <button type="button" onClick={() => { setListedSideEffects("Yes"); setUnderstandSideEffectsUnsuitable(false); }} className={optionButtonClass(listedSideEffects === "Yes")}>Yes</button>
                          <button type="button" onClick={() => { setListedSideEffects("No"); setUnderstandSideEffectsUnsuitable(false); }} className={optionButtonClass(listedSideEffects === "No")}>No</button>
                        </div>
                      </div>
                    )}

                    {showSideEffectsUnsuitable && (
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">{step2UnsuitableSideEffects}. THIS SERVICE IS UNSUITABLE</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                          If you have experienced these serious side effects in the past, the continued use of varenicline is not
                          recommended. Please try alternative forms of smoking cessation treatment such as nicotine replacement
                          therapy instead.
                        </p>
                        <div className="mt-3 max-w-[180px]">
                          <button type="button" onClick={() => setUnderstandSideEffectsUnsuitable(true)} className={optionButtonClass(understandSideEffectsUnsuitable)}>
                            I understand
                          </button>
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="font-black text-dark-slate dark:text-white">
                        {step2QMedicalConditions}. Do you have, or have you ever had, any of the following conditions?
                      </p>
                      <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        <p>Psychological conditions (e.g. depression, anxiety, panic attacks)</p>
                        <p>Psychiatric conditions (e.g. schizophrenia, bipolar disorder, mania)</p>
                        <p>Seizures or a condition that increases your risk of seizures</p>
                        <p>Reduced kidney function</p>
                      </div>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => setMedicalConditions("Yes")} className={optionButtonClass(medicalConditions === "Yes")}>Yes</button>
                        <button type="button" onClick={() => setMedicalConditions("No")} className={optionButtonClass(medicalConditions === "No")}>No</button>
                      </div>
                    </div>

                    <div>
                      <p className="font-black text-dark-slate dark:text-white">
                        {step2QQuitTherapy}. Are you currently taking any of the following?
                      </p>
                      <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        <p>Zyban</p>
                        <p>Cytisine</p>
                        <p>Bupropion</p>
                        <p>Nicotine Replacement Therapy</p>
                      </div>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => { setTakingQuitTherapy("Yes"); setUnderstandQuitTherapyUnsuitable(false); }} className={optionButtonClass(takingQuitTherapy === "Yes")}>Yes</button>
                        <button type="button" onClick={() => { setTakingQuitTherapy("No"); setUnderstandQuitTherapyUnsuitable(false); }} className={optionButtonClass(takingQuitTherapy === "No")}>No</button>
                      </div>
                    </div>

                    {showQuitTherapyUnsuitable && (
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">{step2UnsuitableQuitTherapy}. THIS SERVICE IS UNSUITABLE</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                          Taking more than one form of smoking cessation therapy at a time can cause significant side effects.
                          Please <span className="font-bold underline">book a video consultation</span> with one of our GPs to discuss
                          the best treatment option for you.
                        </p>
                        <div className="mt-3 max-w-[180px]">
                          <button type="button" onClick={() => setUnderstandQuitTherapyUnsuitable(true)} className={optionButtonClass(understandQuitTherapyUnsuitable)}>
                            I understand
                          </button>
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="font-black text-dark-slate dark:text-white">
                        {step2QInteractionMeds}. Are you currently taking any of the following?
                      </p>
                      <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        <p>Warfarin (Jantoven)</p>
                        <p>Diabetes medications, such as insulin</p>
                        <p>Theophylline (Theo-24, Elixophyllin)</p>
                      </div>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <button type="button" onClick={() => { setTakingInteractionMeds("Yes"); setUnderstandInteractionUnsuitable(false); }} className={optionButtonClass(takingInteractionMeds === "Yes")}>Yes</button>
                        <button type="button" onClick={() => { setTakingInteractionMeds("No"); setUnderstandInteractionUnsuitable(false); }} className={optionButtonClass(takingInteractionMeds === "No")}>No</button>
                      </div>
                    </div>

                    {showInteractionUnsuitable && (
                      <div>
                        <p className="font-black text-dark-slate dark:text-white">{step2UnsuitableInteraction}. THIS SERVICE IS UNSUITABLE</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                          The use of varenicline with any of these medications may cause side effects. Please consult with your local
                          GP instead.
                        </p>
                        <div className="mt-3 max-w-[180px]">
                          <button type="button" onClick={() => setUnderstandInteractionUnsuitable(true)} className={optionButtonClass(understandInteractionUnsuitable)}>
                            I understand
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="mt-8 space-y-7">
                    {submitted ? (
                      <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6">
                        <p className="text-2xl font-black text-emerald-900">Request submitted</p>
                        <p className="mt-2 text-sm text-emerald-900">
                          Your stop smoking questionnaire has been submitted for doctor review.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div>
                          <p className="font-black text-dark-slate dark:text-white">
                            1. Please read and confirm you have understood this important information:
                          </p>
                          <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 space-y-2">
                            <p>
                              Varenicline can rarely cause cardiovascular symptoms such as chest pain or heart palpitations.
                              If you experience any of these symptoms while taking this medication, you should seek immediate
                              medical attention.
                            </p>
                            <p>
                              Varenicline may increase the side effects of alcohol. It is not recommended to consume alcohol
                              while taking this medication.
                            </p>
                            <p>
                              To give yourself the best chance of successfully quitting smoking, this medication should be used
                              alongside non-medical supports. These can include behavioural therapy, counselling, or joining a
                              support group. We will send you a link with some helpful options after your request is received.
                            </p>
                          </div>
                          <div className="mt-3 max-w-[180px]">
                            <button
                              type="button"
                              onClick={() => setUnderstandImportantInfo(true)}
                              className={optionButtonClass(understandImportantInfo)}
                            >
                              I understand
                            </button>
                          </div>
                        </div>

                        <div>
                          <p className="font-black text-dark-slate dark:text-white">
                            2. You should inform your local GP of any treatments you receive to ensure you get appropriate and
                            safe clinical care going forward.
                          </p>
                          <div className="mt-3 max-w-[180px]">
                            <button
                              type="button"
                              onClick={() => setUnderstandInformGp(true)}
                              className={optionButtonClass(understandInformGp)}
                            >
                              I understand
                            </button>
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
                  {currentStep < 3 ? (
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
                      disabled={submitted || !canGoNext}
                      className={`px-6 py-3 rounded-xl font-bold text-sm ${
                        submitted || !canGoNext ? "bg-slate-200 text-slate-500 cursor-not-allowed" : "bg-primary text-white"
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
                Stop Smoking <span className="text-primary">Treatment</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-6 leading-relaxed">
                Life tastes better smoke-free, and every smoke-free day is a step toward a healthier future.
                Webdoctor.ie offers a convenient, doctor-approved prescription service to support your quit journey.
              </p>
            </div>

            <div className="rounded-[36px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
              <h3 className="text-2xl font-black mb-5">Treatments that we can provide</h3>
              <div className="space-y-3 mt-1">
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
                <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">This service is suitable if you:</p>
                <ul className="space-y-3">
                  {["You are aged 18 years or older.", "You are committed to quit smoking."].map((item) => (
                    <li key={item} className="flex gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                      <p className="text-sm text-slate-700 dark:text-slate-300">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-black mb-6">What&apos;s excluded with our service</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">This service is not suitable if you:</p>
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

