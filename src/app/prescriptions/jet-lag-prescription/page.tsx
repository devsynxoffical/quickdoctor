"use client";

import React, { useState } from "react";
import { beginPrescriptionCheckout } from '@/lib/serviceCheckout';
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2, ChevronDown, Clock, ShieldCheck, Users, XCircle } from "lucide-react";

const AccordionItem = ({ question, answer }: { question: string; answer: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 dark:border-slate-800 last:border-b-0">
      <button onClick={() => setOpen((prev) => !prev)} className="w-full py-5 flex items-center justify-between text-left">
        <span className="font-bold text-dark-slate dark:text-white">{question}</span>
        <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="pb-5 text-sm text-slate-600 dark:text-slate-400"
          >
            {answer}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function JetLagPrescriptionPage() {
  const submitPrescriptionRequest = () => {
    beginPrescriptionCheckout({
      slug: 'jet-lag-prescription',
      serviceName: 'Jet Lag Prescription',
      payload: {
      requestFor,
      unsuitableAck,
      melatoninOnlyAck,
      forJetLag,
      age,
      birthSex,
      femaleRiskFactors,
      hormonalMeds,
      conditions,
      medicationsA,
      medicationsB,
      diabetic,
      timeDifference,
      jetLagUnsuitableAck,
      conditionsUnsuitableAck,
      medicationsAUnsuitableAck,
      medicationsBUnsuitableAck,
      timeDiffUnsuitableAck,
      finalAccuracyConfirm,
      finalDoctorReviewConfirm,
      },
    });
  };

  const infoItems = [
    {
      question: "What is jet lag?",
      answer: "Jet lag is a temporary sleep and body-clock disruption after crossing time zones, often causing fatigue, poor sleep, and concentration issues.",
    },
    {
      question: "What type of jet lag medication do you prescribe?",
      answer: "This service provides melatonin 3mg immediate-release tablets only, where clinically suitable after doctor review.",
    },
    {
      question: "How do I take tablets for jet lag?",
      answer: "Use exactly as prescribed by your doctor. Timing is usually linked to your destination bedtime and travel schedule.",
    },
    {
      question: "What are the side effects of jet lag tablets?",
      answer: "Possible side effects include drowsiness, headache, dizziness, or nausea. If symptoms are concerning, seek medical advice promptly.",
    },
    {
      question: "Safety considerations",
      answer: "This treatment is for suitable adults only and may be unsafe with some medical conditions, medicines, or pregnancy/breastfeeding risk factors.",
    },
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [requestFor, setRequestFor] = useState("");
  const [unsuitableAck, setUnsuitableAck] = useState(false);
  const [melatoninOnlyAck, setMelatoninOnlyAck] = useState(false);
  const [forJetLag, setForJetLag] = useState("");
  const [age, setAge] = useState("");
  const [birthSex, setBirthSex] = useState("");
  const [femaleRiskFactors, setFemaleRiskFactors] = useState("");
  const [hormonalMeds, setHormonalMeds] = useState("");
  const [conditions, setConditions] = useState("");
  const [medicationsA, setMedicationsA] = useState("");
  const [medicationsB, setMedicationsB] = useState("");
  const [diabetic, setDiabetic] = useState("");
  const [timeDifference, setTimeDifference] = useState("");
  const [jetLagUnsuitableAck, setJetLagUnsuitableAck] = useState(false);
  const [conditionsUnsuitableAck, setConditionsUnsuitableAck] = useState(false);
  const [medicationsAUnsuitableAck, setMedicationsAUnsuitableAck] = useState(false);
  const [medicationsBUnsuitableAck, setMedicationsBUnsuitableAck] = useState(false);
  const [timeDiffUnsuitableAck, setTimeDiffUnsuitableAck] = useState(false);
  const [finalAccuracyConfirm, setFinalAccuracyConfirm] = useState(false);
  const [finalDoctorReviewConfirm, setFinalDoctorReviewConfirm] = useState(false);

  const selectClass = (selected: boolean) =>
    `px-4 py-2 rounded-lg border text-sm font-bold transition-colors ${
      selected
        ? "bg-primary text-white border-primary"
        : "border-slate-300 text-slate-700 dark:text-slate-300 dark:border-slate-700 hover:border-primary"
    }`;

  const showUnsuitableStep1 = requestFor === "For a child" || requestFor === "For someone else";
  const isFemale = birthSex === "Female";
  const showJetLagUnsuitable = forJetLag === "No";
  const showConditionsUnsuitable = conditions === "Yes";
  const showMedsAUnsuitable = medicationsA === "Yes";
  const showMedsBUnsuitable = medicationsB === "Yes";
  const showTimeDiffUnsuitable = timeDifference === "Less than 3 hours";

  const conditionsQuestionNumber = isFemale ? 7 : 5;
  const afterConditionsUnsuitableOffset = showConditionsUnsuitable ? 1 : 0;
  const medsAQuestionNumber = conditionsQuestionNumber + 1 + afterConditionsUnsuitableOffset;
  const afterMedsAUnsuitableOffset = showMedsAUnsuitable ? 1 : 0;
  const medsBQuestionNumber = medsAQuestionNumber + 1 + afterMedsAUnsuitableOffset;
  const afterMedsBUnsuitableOffset = showMedsBUnsuitable ? 1 : 0;
  const diabeticQuestionNumber = medsBQuestionNumber + 1 + afterMedsBUnsuitableOffset;
  const timeDiffQuestionNumber = diabeticQuestionNumber + 1;
  const timeDiffUnsuitableNumber = timeDiffQuestionNumber + 1;

  const canGoStep2 = requestFor !== "" && (showUnsuitableStep1 ? unsuitableAck : true);
  const canGoStep3 =
    melatoninOnlyAck &&
    forJetLag !== "" &&
    (showJetLagUnsuitable ? jetLagUnsuitableAck : true) &&
    age !== "" &&
    birthSex !== "" &&
    (isFemale ? femaleRiskFactors !== "" && hormonalMeds !== "" : true) &&
    conditions !== "" &&
    (showConditionsUnsuitable ? conditionsUnsuitableAck : true) &&
    medicationsA !== "" &&
    (showMedsAUnsuitable ? medicationsAUnsuitableAck : true) &&
    medicationsB !== "" &&
    (showMedsBUnsuitable ? medicationsBUnsuitableAck : true) &&
    diabetic !== "" &&
    timeDifference !== "" &&
    (showTimeDiffUnsuitable ? timeDiffUnsuitableAck : true);
  const canSubmit = finalAccuracyConfirm && finalDoctorReviewConfirm;

  const resetForm = () => {
    setCurrentStep(1);
    setSubmitted(false);
    setRequestFor("");
    setUnsuitableAck(false);
    setMelatoninOnlyAck(false);
    setForJetLag("");
    setAge("");
    setBirthSex("");
    setFemaleRiskFactors("");
    setHormonalMeds("");
    setConditions("");
    setMedicationsA("");
    setMedicationsB("");
    setDiabetic("");
    setTimeDifference("");
    setJetLagUnsuitableAck(false);
    setConditionsUnsuitableAck(false);
    setMedicationsAUnsuitableAck(false);
    setMedicationsBUnsuitableAck(false);
    setTimeDiffUnsuitableAck(false);
    setFinalAccuracyConfirm(false);
    setFinalDoctorReviewConfirm(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <Navbar />
<main>
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-black uppercase mb-6">
                Online Prescription
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-dark-slate dark:text-white leading-tight">
                Jet Lag Prescription - <span className="text-primary">Reset Your Sleep and Travel Better</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-6 leading-relaxed">
                Planning a trip across multiple time zones? Avoid the fatigue, grogginess, and disrupted sleep that come with jet lag.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Reviewed by Irish-registered GPs for safety and suitability.",
                  "Quick online questionnaire - takes just minutes to complete.",
                  "EUR25, available nationwide.",
                  "Sent directly to your local pharmacy for easy collection.",
                  "Same-day review - most prescriptions approved within hours.",
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
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => document.getElementById("jet-lag-form")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  className="w-full p-4 rounded-2xl border text-left transition-all bg-primary text-white border-primary"
                >
                  <p className="font-black text-white">Request Prescription</p>
                  <p className="text-sm font-bold mt-1 text-white/90">EUR25</p>
                </button>
              </div>
              <button
                type="button"
                onClick={() => document.getElementById("jet-lag-form")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="w-full mt-6 px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2"
              >
                Request Prescription - EUR25 <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-center">What&apos;s included with our service</h2>
            <div className="max-w-4xl mx-auto mt-10 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="text-2xl font-black mb-4">This service is suitable for you if:</h3>
              <ul className="space-y-3">
                {[
                  "You are aged 18 years or older.",
                  "The time difference between your destination and departure location is more than 3 hours.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="max-w-4xl mx-auto mt-8 p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="text-2xl font-black mb-4">What&apos;s excluded with our service</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">This service is not suitable for you if you:</p>
              <ul className="space-y-3">
                {[
                  "Are under 18 years of age.",
                  "Are seeking treatment for insomnia, long term sleep problems, or management of shift work patterns.",
                  "Might become pregnant and not using effective contraception.",
                  "Are breastfeeding.",
                  "Are a woman of child-bearing potential who is not using reliable contraception.",
                  "Are using certain medications (listed in our questionnaire).",
                  "Have a history of autoimmune disease, epilepsy/seizures, kidney disease, or liver disease.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-black text-center">Important medical information</h2>
            <div className="mt-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 px-6">
              {infoItems.map((item) => (
                <AccordionItem key={item.question} question={item.question} answer={item.answer} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-dark-slate text-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-center">How it works</h2>
            <p className="text-slate-300 text-center mt-3 max-w-2xl mx-auto">
              Requesting a prescription online could not be easier with Webdoctor.ie.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-10">
              {[
                { step: "Step 1", icon: CheckCircle2, title: "Online Questionnaire", desc: "Complete a secure questionnaire and answer all questions accurately." },
                { step: "Step 2", icon: Clock, title: "Medical Review", desc: "An Irish-registered doctor reviews your information using clinical standards. Approval usually takes a few hours." },
                { step: "Step 3", icon: ArrowRight, title: "Prescription Sent", desc: "If approved, your prescription is sent within minutes to your chosen Irish pharmacy via secure Healthmail." },
              ].map((item) => (
                <div key={item.title} className="p-6 rounded-3xl bg-white/5 border border-white/10">
                  <item.icon className="w-8 h-8 text-primary" />
                  <p className="text-xs uppercase tracking-widest font-bold text-primary mt-4">{item.step}</p>
                  <p className="text-xl font-black mt-2">{item.title}</p>
                  <p className="text-sm text-slate-300 mt-2">{item.desc}</p>
                </div>
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
                <div key={item.title} className="p-5 rounded-2xl bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-800">
                  <item.icon className="w-5 h-5 text-primary" />
                  <p className="font-black mt-3">{item.title}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="jet-lag-form" className="pt-28 pb-16">
          <div className="max-w-4xl mx-auto px-6">
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8">
              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${(currentStep / 3) * 100}%` }} />
              </div>
              <p className="mt-3 text-sm font-bold text-slate-600">Step {currentStep} / 3</p>
              <h1 className="mt-2 text-3xl md:text-4xl font-black text-dark-slate dark:text-white">
                {currentStep === 1 ? "Patient Selection" : currentStep === 2 ? "Medical Safety Check" : "Review & Submit"}
              </h1>

              <div className="mt-8 space-y-7">
                {currentStep === 1 && (
                  <>
                    <p className="text-slate-600 dark:text-slate-400">
                      This questionnaire is an important part of your assessment today. We ask that you are honest with your answers.
                    </p>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">1. Who are you requesting this treatment for?</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        Please be aware that if this prescription is approved, it will be issued in the name of this account holder,
                        and will include their personal details.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <button type="button" onClick={() => { setRequestFor("For myself"); setUnsuitableAck(false); }} className={selectClass(requestFor === "For myself")}>For myself</button>
                        <button type="button" onClick={() => { setRequestFor("For a child"); setUnsuitableAck(false); }} className={selectClass(requestFor === "For a child")}>For a child</button>
                        <button type="button" onClick={() => { setRequestFor("For someone else"); setUnsuitableAck(false); }} className={selectClass(requestFor === "For someone else")}>For someone else</button>
                      </div>
                    </div>

                    {showUnsuitableStep1 && (
                      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
                        <p className="font-bold text-amber-900">2. THIS SERVICE IS UNSUITABLE</p>
                        <p className="mt-2 text-sm text-amber-900">This service is only suitable for individuals aged 18 and older.</p>
                        <p className="mt-2 text-sm text-amber-900">
                          If someone aged 18 or older requires treatment, they must apply through their own account.
                        </p>
                        <button type="button" onClick={() => setUnsuitableAck((v) => !v)} className={`mt-3 ${selectClass(unsuitableAck)}`}>
                          I understand
                        </button>
                      </div>
                    )}
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">1. We prescribe Melatonin (3mg immediate release, 10 tablets) through this service only.</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">We&apos;re not able to prescribe different doses or alternative medications.</p>
                      <button type="button" onClick={() => setMelatoninOnlyAck((v) => !v)} className={`mt-3 ${selectClass(melatoninOnlyAck)}`}>I understand</button>
                    </div>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">2. Are you requesting this treatment for jet lag?</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setForJetLag("Yes");
                            setJetLagUnsuitableAck(false);
                          }}
                          className={selectClass(forJetLag === "Yes")}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setForJetLag("No");
                            setJetLagUnsuitableAck(false);
                          }}
                          className={selectClass(forJetLag === "No")}
                        >
                          No
                        </button>
                      </div>
                    </div>
                    {showJetLagUnsuitable && (
                      <div>
                        <p className="font-bold text-dark-slate dark:text-white">3. THIS SERVICE IS UNSUITABLE</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                          We can only prescribe this medication for jet lag via this service.
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                          For other conditions such as insomnia or shift work we would advise that you speak with your local GP.
                        </p>
                        <button type="button" onClick={() => setJetLagUnsuitableAck((v) => !v)} className={`mt-3 ${selectClass(jetLagUnsuitableAck)}`}>
                          I understand
                        </button>
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">4. What is your age?</p>
                      <input value={age} onChange={(e) => setAge(e.target.value.replace(/\D/g, ""))} placeholder="Enter age" className="mt-3 w-full max-w-56 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent" />
                    </div>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">5. What is your birth sex?</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        We ask for your birth sex (rather than gender identity) to guide the medical questions asked and to make sure the treatment is medically safe for you.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <button type="button" onClick={() => setBirthSex("Female")} className={selectClass(birthSex === "Female")}>Female</button>
                        <button type="button" onClick={() => setBirthSex("Male")} className={selectClass(birthSex === "Male")}>Male</button>
                      </div>
                    </div>
                    {isFemale && (
                      <div>
                        <p className="font-bold text-dark-slate dark:text-white">6. Do any of the following apply to you?</p>
                        <ul className="text-sm text-slate-600 dark:text-slate-400 mt-2 space-y-1">
                          <li>1. Breastfeeding</li>
                          <li>2. Pregnant</li>
                          <li>3. Could become pregnant (not using reliable contraception)</li>
                        </ul>
                        <div className="mt-3 flex flex-wrap gap-3">
                          <button type="button" onClick={() => setFemaleRiskFactors("Yes")} className={selectClass(femaleRiskFactors === "Yes")}>Yes</button>
                          <button type="button" onClick={() => setFemaleRiskFactors("No")} className={selectClass(femaleRiskFactors === "No")}>No</button>
                        </div>
                      </div>
                    )}
                    {isFemale && (
                      <div>
                        <p className="font-bold text-dark-slate dark:text-white">7. Do you use combined hormonal contraception (pill, patch or ring) or hormone replacement therapy (HRT)?</p>
                        <div className="mt-3 flex flex-wrap gap-3">
                          <button type="button" onClick={() => setHormonalMeds("Yes")} className={selectClass(hormonalMeds === "Yes")}>Yes</button>
                          <button type="button" onClick={() => setHormonalMeds("No")} className={selectClass(hormonalMeds === "No")}>No</button>
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">{conditionsQuestionNumber}. Do you have, or have you ever had, any of the following conditions?</p>
                      <ul className="text-sm text-slate-600 dark:text-slate-400 mt-2 space-y-1">
                        <li>1. Autoimmune disease (e.g. lupus, rheumatoid arthritis)</li>
                        <li>2. Epilepsy/ seizures</li>
                        <li>3. Kidney disease</li>
                        <li>4. Liver disease</li>
                      </ul>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setConditions("Yes");
                            setConditionsUnsuitableAck(false);
                          }}
                          className={selectClass(conditions === "Yes")}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setConditions("No");
                            setConditionsUnsuitableAck(false);
                          }}
                          className={selectClass(conditions === "No")}
                        >
                          No
                        </button>
                      </div>
                    </div>
                    {showConditionsUnsuitable && (
                      <div>
                        <p className="font-bold text-dark-slate dark:text-white">{conditionsQuestionNumber + 1}. THIS SERVICE IS UNSUITABLE</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                          Melatonin is not safe and should not be prescribed if you have any of these conditions.
                        </p>
                        <button type="button" onClick={() => setConditionsUnsuitableAck((v) => !v)} className={`mt-3 ${selectClass(conditionsUnsuitableAck)}`}>
                          I understand
                        </button>
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">{medsAQuestionNumber}. Are you taking any of the following medications?</p>
                      <ul className="text-sm text-slate-600 dark:text-slate-400 mt-2 space-y-1">
                        <li>1. Benzodiazepines e.g. temazepam or diazepam</li>
                        <li>2. Nonsteroidal anti-inflammatory drugs e.g. ibuprofen, naproxen or diclofenac</li>
                        <li>3. Opiates e.g. codeine or morphine</li>
                        <li>4. Psoralens</li>
                        <li>5. Quinolones or rifampicin antibiotics</li>
                        <li>6. Carbamazepine</li>
                        <li>7. Cimetidine</li>
                        <li>8. Thioridazine</li>
                      </ul>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setMedicationsA("Yes");
                            setMedicationsAUnsuitableAck(false);
                          }}
                          className={selectClass(medicationsA === "Yes")}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMedicationsA("No");
                            setMedicationsAUnsuitableAck(false);
                          }}
                          className={selectClass(medicationsA === "No")}
                        >
                          No
                        </button>
                      </div>
                    </div>
                    {showMedsAUnsuitable && (
                      <div>
                        <p className="font-bold text-dark-slate dark:text-white">{medsAQuestionNumber + 1}. THIS SERVICE IS UNSUITABLE</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                          Unfortunately our service is not suitable for you if you are taking any of the listed medications. Please contact your local GP instead.
                        </p>
                        <button type="button" onClick={() => setMedicationsAUnsuitableAck((v) => !v)} className={`mt-3 ${selectClass(medicationsAUnsuitableAck)}`}>
                          I understand
                        </button>
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">{medsBQuestionNumber}. Are you taking any of the following medications?</p>
                      <ul className="text-sm text-slate-600 dark:text-slate-400 mt-2 space-y-1">
                        <li>1. Blood pressure medications</li>
                        <li>2. Medications to suppress your immune system</li>
                        <li>3. Antidepressants</li>
                        <li>4. Warfarin</li>
                        <li>5. Zaleplon, zolpidem or zopiclone</li>
                      </ul>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setMedicationsB("Yes");
                            setMedicationsBUnsuitableAck(false);
                          }}
                          className={selectClass(medicationsB === "Yes")}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMedicationsB("No");
                            setMedicationsBUnsuitableAck(false);
                          }}
                          className={selectClass(medicationsB === "No")}
                        >
                          No
                        </button>
                      </div>
                    </div>
                    {showMedsBUnsuitable && (
                      <div>
                        <p className="font-bold text-dark-slate dark:text-white">{medsBQuestionNumber + 1}. THIS SERVICE IS UNSUITABLE</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                          Unfortunately our service is not suitable for you if you are taking any of the listed medications. Please contact your local GP instead.
                        </p>
                        <button type="button" onClick={() => setMedicationsBUnsuitableAck((v) => !v)} className={`mt-3 ${selectClass(medicationsBUnsuitableAck)}`}>
                          I understand
                        </button>
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">{diabeticQuestionNumber}. Are you diabetic or pre-diabetic?</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <button type="button" onClick={() => setDiabetic("Yes")} className={selectClass(diabetic === "Yes")}>Yes</button>
                        <button type="button" onClick={() => setDiabetic("No")} className={selectClass(diabetic === "No")}>No</button>
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">{timeDiffQuestionNumber}. What is the time difference between your departure location and final destination?</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setTimeDifference("Less than 3 hours");
                            setTimeDiffUnsuitableAck(false);
                          }}
                          className={selectClass(timeDifference === "Less than 3 hours")}
                        >
                          Less than 3 hours
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setTimeDifference("More than 3 hours");
                            setTimeDiffUnsuitableAck(false);
                          }}
                          className={selectClass(timeDifference === "More than 3 hours")}
                        >
                          More than 3 hours
                        </button>
                      </div>
                    </div>
                    {showTimeDiffUnsuitable && (
                      <div>
                        <p className="font-bold text-dark-slate dark:text-white">{timeDiffUnsuitableNumber}. THIS SERVICE IS UNSUITABLE</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                          You are unlikely to experience significant jet lag requiring medication when the time difference at your final destination is less than 3 hours. You should discuss this with your local GP if you have concerns.
                        </p>
                        <button type="button" onClick={() => setTimeDiffUnsuitableAck((v) => !v)} className={`mt-3 ${selectClass(timeDiffUnsuitableAck)}`}>
                          I understand
                        </button>
                      </div>
                    )}
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    {submitted ? (
                      <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6">
                        <p className="font-black text-emerald-900 text-2xl">Request submitted</p>
                        <p className="mt-2 text-sm text-emerald-900">
                          Your jet lag request has been sent for doctor review.
                        </p>
                        <button type="button" onClick={resetForm} className="mt-4 px-5 py-2 rounded-lg bg-emerald-700 text-white font-bold">
                          Start New Request
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="rounded-2xl border border-slate-200 p-5">
                          <p className="font-black text-dark-slate dark:text-white">Review</p>
                          <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
                            <p><span className="font-bold">Request for:</span> {requestFor || "-"}</p>
                            <p><span className="font-bold">For jet lag:</span> {forJetLag || "-"}</p>
                            <p><span className="font-bold">Age:</span> {age || "-"}</p>
                            <p><span className="font-bold">Birth sex:</span> {birthSex || "-"}</p>
                            <p><span className="font-bold">Time difference:</span> {timeDifference || "-"}</p>
                            <p><span className="font-bold">Diabetic/pre-diabetic:</span> {diabetic || "-"}</p>
                            {isFemale && <p><span className="font-bold">Female risk factors:</span> {femaleRiskFactors || "-"}</p>}
                            {isFemale && <p><span className="font-bold">Hormonal/HRT meds:</span> {hormonalMeds || "-"}</p>}
                            <p><span className="font-bold">Listed conditions:</span> {conditions || "-"}</p>
                            <p><span className="font-bold">Medication list A:</span> {medicationsA || "-"}</p>
                            <p><span className="font-bold">Medication list B:</span> {medicationsB || "-"}</p>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 p-5">
                          <p className="font-bold text-dark-slate dark:text-white">Final confirmation</p>
                          <div className="mt-4 flex flex-col gap-3">
                            <button
                              type="button"
                              onClick={() => setFinalAccuracyConfirm((v) => !v)}
                              className={selectClass(finalAccuracyConfirm)}
                            >
                              I confirm my answers are complete and accurate.
                            </button>
                            <button
                              type="button"
                              onClick={() => setFinalDoctorReviewConfirm((v) => !v)}
                              className={selectClass(finalDoctorReviewConfirm)}
                            >
                              I understand this request is subject to doctor review and may be declined if unsuitable.
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                    disabled={currentStep === 1 || submitted}
                    className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-bold disabled:opacity-50"
                  >
                    Back
                  </button>
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep((s) => Math.min(3, s + 1))}
                      disabled={(currentStep === 1 && !canGoStep2) || (currentStep === 2 && !canGoStep3)}
                      className="px-8 py-3 rounded-lg bg-slate-900 text-white font-bold disabled:opacity-50"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={submitPrescriptionRequest}
                      disabled={submitted || !canSubmit}
                      className="px-8 py-3 rounded-lg bg-primary text-white font-bold disabled:opacity-50"
                    >
                      Submit Request
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
