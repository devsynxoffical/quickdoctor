"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2, ChevronDown, Clock, ShieldCheck, Users } from "lucide-react";

const faqs = [
  "Who is this service suitable for?",
  "Who is this service unsuitable for?",
  "What is male pattern hair loss?",
  "What causes male pattern hair loss?",
  "Are there other causes of hair loss in men?",
  "What hair loss treatment options do you offer?",
  "How do I take this medication for hair loss?",
  "What does â€œoff-licenceâ€ use of medicine mean?",
  "How does this treatment work?",
  "What are the possible side effects of this treatment?",
  "Important safety information",
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
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="pb-5 text-slate-600 dark:text-slate-400">
            Final suitability and treatment decisions are made by an Irish-registered doctor after clinical review.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function MaleHairLossPage() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [questionStep, setQuestionStep] = useState(1);
  const [patientFor, setPatientFor] = useState("");
  const [unsuitableAck, setUnsuitableAck] = useState(false);
  const [serviceAck, setServiceAck] = useState(false);
  const [hairPattern, setHairPattern] = useState("");
  const [birthSex, setBirthSex] = useState("");
  const [age, setAge] = useState("");
  const [finasterideAck, setFinasterideAck] = useState(false);
  const [finasterideStrength, setFinasterideStrength] = useState("");
  const [hairLossStart, setHairLossStart] = useState("");
  const [bodyHairLoss, setBodyHairLoss] = useState("");
  const [scalpCondition, setScalpCondition] = useState("");
  const [conditions, setConditions] = useState("");
  const [lowMoodHistory, setLowMoodHistory] = useState("");
  const [prostateFinasteride, setProstateFinasteride] = useState("");
  const [finasterideUsage, setFinasterideUsage] = useState("");
  const [finasterideEffective, setFinasterideEffective] = useState("");
  const [offLicenceChoice, setOffLicenceChoice] = useState("");
  const [offLicenceUnsuitableAck, setOffLicenceUnsuitableAck] = useState(false);
  const [hairLossUnsuitableAck, setHairLossUnsuitableAck] = useState(false);
  const [bodyUnsuitableAck, setBodyUnsuitableAck] = useState(false);
  const [scalpUnsuitableAck, setScalpUnsuitableAck] = useState(false);
  const [conditionsUnsuitableAck, setConditionsUnsuitableAck] = useState(false);
  const [moodChoice, setMoodChoice] = useState("");
  const [moodUnsuitableAck, setMoodUnsuitableAck] = useState(false);
  const [prostateUnsuitableAck, setProstateUnsuitableAck] = useState(false);
  const [confirmAccuracy, setConfirmAccuracy] = useState(false);
  const [confirmSafety, setConfirmSafety] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const hairPatternOptions = [
    { id: "pattern-1", label: "Pattern 1", image: "/1.png" },
    { id: "pattern-2", label: "Pattern 2", image: "/2.png" },
    { id: "pattern-3", label: "Pattern 3", image: "/3.png" },
    { id: "pattern-4", label: "Pattern 4", image: "/4.png" },
    { id: "pattern-5", label: "Pattern 5", image: "/5.png" },
  ];

  const startQuestionnaire = () => {
    setShowQuestionnaire(true);
    setQuestionStep(1);
    setPatientFor("");
    setUnsuitableAck(false);
    setServiceAck(false);
    setHairPattern("");
    setBirthSex("");
    setAge("");
    setFinasterideAck(false);
    setFinasterideStrength("");
    setHairLossStart("");
    setBodyHairLoss("");
    setScalpCondition("");
    setConditions("");
    setLowMoodHistory("");
    setProstateFinasteride("");
    setFinasterideUsage("");
    setFinasterideEffective("");
    setOffLicenceChoice("");
    setOffLicenceUnsuitableAck(false);
    setHairLossUnsuitableAck(false);
    setBodyUnsuitableAck(false);
    setScalpUnsuitableAck(false);
    setConditionsUnsuitableAck(false);
    setMoodChoice("");
    setMoodUnsuitableAck(false);
    setProstateUnsuitableAck(false);
    setConfirmAccuracy(false);
    setConfirmSafety(false);
    setRequestSubmitted(false);
    setTimeout(() => {
      document.getElementById("patient-selection")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const hasFemaleUnsuitable = birthSex === "Female";
  const has5mgNote = finasterideStrength === "5mg tablets";
  const has5mgUnsuitable = has5mgNote && offLicenceChoice === "stop";
  const hasSuddenUnsuitable = hairLossStart === "Suddenly";
  const hasBodyUnsuitable = bodyHairLoss === "Yes";
  const hasScalpUnsuitable = scalpCondition === "Yes";
  const hasConditionsUnsuitable = conditions === "Yes";
  const hasMoodAdvisory = lowMoodHistory === "Yes" || lowMoodHistory === "No";
  const hasMoodUnsuitable = hasMoodAdvisory && moodChoice === "stop";
  const hasProstateUnsuitable = prostateFinasteride === "Yes";
  const showEffectivenessQuestion =
    finasterideUsage === "I'm currently using it" || finasterideUsage === "I've used it before";

  const question4 = hasFemaleUnsuitable ? 5 : 4;
  const question5 = question4 + 1;
  const question6 = question5 + 1;
  const question7 = question6 + (has5mgNote ? 2 : 1);
  const question8 = question7 + (hasSuddenUnsuitable ? 2 : 1);
  const question9 = question8 + (hasBodyUnsuitable ? 2 : 1);
  const question10 = question9 + (hasScalpUnsuitable ? 2 : 1);
  const question11 = question10 + (hasConditionsUnsuitable ? 2 : 1);
  const question12 = question11 + (hasMoodAdvisory ? 1 : 0) + (hasMoodUnsuitable ? 1 : 0) + 1;
  const question13 = question12 + (hasProstateUnsuitable ? 2 : 1);
  const question14 = question13 + 1;
  const canContinueToReview =
    serviceAck &&
    hairPattern &&
    birthSex &&
    age &&
    finasterideAck &&
    finasterideStrength &&
    hairLossStart &&
    bodyHairLoss &&
    scalpCondition &&
    conditions &&
    lowMoodHistory &&
    (!hasMoodAdvisory || moodChoice) &&
    prostateFinasteride &&
    finasterideUsage &&
    (!showEffectivenessQuestion || finasterideEffective);
  const canSubmitRequest = confirmAccuracy && confirmSafety;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <Navbar />

      <div className="pt-24 bg-primary/5 border-y border-primary/10 py-3 px-6 text-center">
        <p className="text-sm font-bold text-primary">A healthier year starts now. Check your BMI and access medical weight care from €50.</p>
      </div>

      <main>
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-black uppercase mb-6">
                Online Prescription
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-dark-slate dark:text-white leading-tight">
                Male Hair Loss <span className="text-primary">Treatment</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-6 leading-relaxed">
                Get effective male hair loss treatment in minutes. Complete our quick suitability questionnaire and our
                Irish-registered doctors will send your treatment directly to your chosen pharmacy. Start your hair loss
                treatment today with convenient oral tablets.
              </p>
            </div>

            <div className="rounded-[36px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
              <h3 className="text-2xl font-black mb-5">Treatments that we can provide</h3>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={startQuestionnaire}
                  className="block w-full p-4 rounded-2xl border text-left transition-all bg-primary text-white border-primary"
                >
                  <p className="font-black text-white">Request Prescription</p>
                  <p className="text-sm font-bold mt-1 text-white/90">€25</p>
                </button>
                <Link
                  href="/consultation"
                  className="block w-full p-4 rounded-2xl border text-left transition-all bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-primary"
                >
                  <p className="font-black text-dark-slate dark:text-white">Online Consultation</p>
                  <p className="text-sm font-bold mt-1 text-primary">€39+</p>
                </Link>
              </div>
              <button
                type="button"
                onClick={startQuestionnaire}
                className="w-full mt-6 px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2"
              >
                Request Prescription - €25 <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {showQuestionnaire && (
          <section id="patient-selection" className="pb-16">
            <div className="max-w-4xl mx-auto px-6">
              <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8">
                <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div className={`h-full bg-primary ${questionStep === 1 ? "w-1/3" : questionStep === 2 ? "w-2/3" : "w-full"}`} />
                </div>
                <p className="mt-3 text-sm font-bold text-slate-600">Step {questionStep} / 3</p>

                <h2 className="mt-6 text-4xl font-black text-dark-slate dark:text-white">
                  {questionStep === 1 ? "Patient Selection" : questionStep === 2 ? "Safety Check" : "Review & Submit"}
                </h2>
                <p className="mt-4 text-slate-600 dark:text-slate-400 font-semibold">
                  This questionnaire is an important part of your assessment today. We ask that you are honest with your
                  answers.
                </p>

                {questionStep === 1 && (
                  <div className="mt-7">
                    <p className="font-bold text-dark-slate dark:text-white">1. Who are you requesting this treatment for?</p>
                    <p className="text-sm text-slate-500 mt-2">
                      Please be aware that if this prescription is approved, it will be issued in the name of this account
                      holder, and will include their personal details.
                    </p>

                    <div className="mt-4 flex flex-col items-start gap-3">
                      {["For myself", "For a child", "For someone else"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setPatientFor(option);
                            setUnsuitableAck(false);
                          }}
                          className={`px-4 py-2 rounded-lg border text-sm font-bold transition-colors ${
                            patientFor === option
                              ? "bg-primary text-white border-primary"
                              : "border-slate-300 text-slate-700 dark:text-slate-300 dark:border-slate-700"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {questionStep === 1 && (
                  <div className="mt-8">
                    <button
                      type="button"
                      onClick={() => setQuestionStep(2)}
                      disabled={!patientFor}
                      className="inline-flex px-6 py-3 bg-primary text-white rounded-xl font-bold items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {questionStep === 2 && (
                  <div className="mt-7 space-y-7">
                    <div className="rounded-2xl border border-slate-200 p-5">
                      <p className="font-bold text-dark-slate dark:text-white">
                        1. This service is only suitable for those with male pattern hair loss.
                      </p>
                      <p className="text-sm text-slate-600 mt-2">
                        We are not able to treat other forms of hair loss through this service.
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        To discuss other forms of hair loss, please book a video consultation with one of our GPs.
                      </p>
                      <button
                        onClick={() => setServiceAck((v) => !v)}
                        className={`mt-4 px-4 py-2 rounded-lg border text-sm font-bold ${
                          serviceAck
                            ? "bg-primary text-white border-primary"
                            : "border-slate-300 text-slate-700 dark:text-slate-300 dark:border-slate-700"
                        }`}
                      >
                        I understand
                      </button>
                    </div>

                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">
                        2. Please select the pattern of hair loss that most closely matches your hair loss from the options
                        below.
                      </p>
                      <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {hairPatternOptions.map((pattern) => (
                          <button
                            key={pattern.id}
                            onClick={() => setHairPattern(pattern.id)}
                            className={`p-3 rounded-xl border text-sm font-bold ${
                              hairPattern === pattern.id
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-slate-200 dark:border-slate-700"
                            }`}
                          >
                            <Image src={pattern.image} alt={pattern.label} width={240} height={96} className="w-full h-24 object-contain" />
                            <p className="mt-2">{pattern.label}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">3. What is your birth sex?</p>
                      <p className="text-sm text-slate-500 mt-2">
                        We ask for your birth sex (rather than gender identity) to guide the medical questions asked and to
                        make sure the treatment is medically safe for you.
                      </p>
                      <div className="mt-3 flex gap-3">
                        {["Female", "Male"].map((item) => (
                          <button
                            key={item}
                            onClick={() => {
                              setBirthSex(item);
                              setUnsuitableAck(false);
                            }}
                            className={`px-4 py-2 rounded-lg border text-sm font-bold ${
                              birthSex === item
                                ? "bg-primary text-white border-primary"
                                : "border-slate-300 text-slate-700 dark:text-slate-300 dark:border-slate-700"
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    {birthSex === "Female" && (
                      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
                        <p className="font-bold text-amber-900">4. THIS SERVICE IS UNSUITABLE</p>
                        <p className="mt-2 text-sm text-amber-900">
                          This service is only available to patients assigned male at birth.
                        </p>
                        <p className="mt-1 text-sm text-amber-900">
                          To discuss treatment options, we recommend contacting your local GP.
                        </p>
                        <button
                          type="button"
                          onClick={() => setUnsuitableAck(true)}
                          className={`mt-4 px-4 py-2 rounded-lg border text-sm font-bold ${
                            unsuitableAck
                              ? "bg-primary text-white border-primary"
                              : "border-slate-300 text-slate-700"
                          }`}
                        >
                          I understand
                        </button>
                      </div>
                    )}

                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">{question4}. What is your age?</p>
                      <input
                        value={age}
                        onChange={(e) => setAge(e.target.value.replace(/\D/g, ""))}
                        placeholder="Enter your age"
                        className="mt-2 w-full md:w-56 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent"
                      />
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-5">
                      <p className="font-bold text-dark-slate dark:text-white">
                        {question5}. We can only issue prescriptions for finasteride (1mg or 5mg) via this service.
                      </p>
                      <p className="text-sm text-slate-600 mt-2">
                        We cannot provide prescriptions for any other medications e.g. minoxidil or dutasteride.
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        To discuss other treatment options we would recommend contacting your local GP.
                      </p>
                      <button
                        onClick={() => setFinasterideAck((v) => !v)}
                        className={`mt-4 px-4 py-2 rounded-lg border text-sm font-bold ${
                          finasterideAck
                            ? "bg-primary text-white border-primary"
                            : "border-slate-300 text-slate-700 dark:text-slate-300 dark:border-slate-700"
                        }`}
                      >
                        I understand
                      </button>
                    </div>

                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">
                        {question6}. What strength of finasteride tablets would you like our GP to prescribe for you, if medically
                        suitable?
                      </p>
                      <p className="text-sm text-slate-600 mt-2">
                        You can choose from the following options:
                      </p>
                      <ul className="mt-2 text-sm text-slate-600 list-disc pl-5 space-y-1">
                        <li>
                          1mg tablets - Take one tablet daily. These tablets are considerably more expensive. Please confirm
                          the price with your pharmacy before selecting this option.
                        </li>
                        <li>
                          5mg tablets - Take one quarter of a tablet daily. These are significantly cheaper and provide a
                          similar daily dose (1.25mg) when quartered. A pill cutter can be purchased from most pharmacies.
                        </li>
                      </ul>
                      <div className="mt-3 flex gap-3">
                        {["1mg tablets", "5mg tablets"].map((item) => (
                          <button
                            key={item}
                            onClick={() => {
                              setFinasterideStrength(item);
                              setOffLicenceChoice("");
                              setOffLicenceUnsuitableAck(false);
                            }}
                            className={`px-4 py-2 rounded-lg border text-sm font-bold ${
                              finasterideStrength === item
                                ? "bg-primary text-white border-primary"
                                : "border-slate-300 text-slate-700 dark:text-slate-300 dark:border-slate-700"
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    {finasterideStrength === "5mg tablets" && (
                      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
                        <p className="font-bold text-amber-900">
                          {question6 + 1}. Please note: Using finasteride by cutting 5mg tablets
                          into quarters is considered &ldquo;off-licence&rdquo;.
                        </p>
                        <p className="mt-2 text-sm text-amber-900">
                          This means it&apos;s being used differently from what the licence states. While this is a
                          common and accepted medical practice, we are required to inform patients when a medicine is
                          prescribed off-licence.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => setOffLicenceChoice("proceed")}
                            className={`px-4 py-2 rounded-lg border text-sm font-bold ${
                              offLicenceChoice === "proceed"
                                ? "bg-primary text-white border-primary"
                                : "border-slate-300 text-slate-700"
                            }`}
                          >
                            I understand and want to proceed
                          </button>
                          <button
                            type="button"
                            onClick={() => setOffLicenceChoice("stop")}
                            className={`px-4 py-2 rounded-lg border text-sm font-bold ${
                              offLicenceChoice === "stop"
                                ? "bg-primary text-white border-primary"
                                : "border-slate-300 text-slate-700"
                            }`}
                          >
                            I do not want to proceed
                          </button>
                        </div>
                      </div>
                    )}

                    {has5mgUnsuitable && (
                      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
                        <p className="font-bold text-amber-900">{question6 + 2}. THIS SERVICE IS UNSUITABLE</p>
                        <p className="mt-2 text-sm text-amber-900">
                          To discuss other potential treatment options please book a video consultation with one of our GPs.
                        </p>
                        <button
                          type="button"
                          onClick={() => setOffLicenceUnsuitableAck(true)}
                          className={`mt-4 px-4 py-2 rounded-lg border text-sm font-bold ${
                            offLicenceUnsuitableAck
                              ? "bg-primary text-white border-primary"
                              : "border-slate-300 text-slate-700"
                          }`}
                        >
                          I understand
                        </button>
                      </div>
                    )}

                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">
                        {question7}. How did your hair loss start?
                      </p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {["Suddenly", "Gradually (over months or years)"].map((item) => (
                          <button
                            key={item}
                            onClick={() => {
                              setHairLossStart(item);
                              setHairLossUnsuitableAck(false);
                            }}
                            className={`px-4 py-2 rounded-lg border text-sm font-bold ${
                              hairLossStart === item
                                ? "bg-primary text-white border-primary"
                                : "border-slate-300 text-slate-700 dark:text-slate-300 dark:border-slate-700"
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    {hasSuddenUnsuitable && (
                      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
                        <p className="font-bold text-amber-900">{question7 + 1}. THIS SERVICE IS UNSUITABLE</p>
                        <p className="mt-2 text-sm text-amber-900">
                          Sudden hair loss is not typical of male pattern hair loss and alternative treatments may be
                          needed. To discuss other forms of hair loss, please book a video consultation with one of our
                          GPs.
                        </p>
                        <button
                          type="button"
                          onClick={() => setHairLossUnsuitableAck(true)}
                          className={`mt-4 px-4 py-2 rounded-lg border text-sm font-bold ${
                            hairLossUnsuitableAck
                              ? "bg-primary text-white border-primary"
                              : "border-slate-300 text-slate-700"
                          }`}
                        >
                          I understand
                        </button>
                      </div>
                    )}

                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">
                        {question8}. Has your hair loss affected other parts of your body?
                      </p>
                      <p className="text-sm text-slate-500 mt-1">E.g. eyebrows, genital or underarm areas.</p>
                      <div className="mt-3 flex gap-3">
                        {["Yes", "No"].map((item) => (
                          <button
                            key={item}
                            onClick={() => {
                              setBodyHairLoss(item);
                              setBodyUnsuitableAck(false);
                            }}
                            className={`px-4 py-2 rounded-lg border text-sm font-bold ${
                              bodyHairLoss === item
                                ? "bg-primary text-white border-primary"
                                : "border-slate-300 text-slate-700 dark:text-slate-300 dark:border-slate-700"
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    {hasBodyUnsuitable && (
                      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
                        <p className="font-bold text-amber-900">{question8 + 1}. THIS SERVICE IS UNSUITABLE</p>
                        <p className="mt-2 text-sm text-amber-900">
                          Hair loss other than on the head is not typical of male pattern hair loss. To discuss other
                          forms of hair loss, please book a video consultation with one of our GPs.
                        </p>
                        <button
                          type="button"
                          onClick={() => setBodyUnsuitableAck(true)}
                          className={`mt-4 px-4 py-2 rounded-lg border text-sm font-bold ${
                            bodyUnsuitableAck
                              ? "bg-primary text-white border-primary"
                              : "border-slate-300 text-slate-700"
                          }`}
                        >
                          I understand
                        </button>
                      </div>
                    )}

                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">
                        {question9}. Do you have any skin conditions affecting your scalp?
                      </p>
                      <p className="text-sm text-slate-500 mt-1">E.g. redness, flaking, itch, soreness.</p>
                      <div className="mt-3 flex gap-3">
                        {["Yes", "No"].map((item) => (
                          <button
                            key={item}
                            onClick={() => {
                              setScalpCondition(item);
                              setScalpUnsuitableAck(false);
                            }}
                            className={`px-4 py-2 rounded-lg border text-sm font-bold ${
                              scalpCondition === item
                                ? "bg-primary text-white border-primary"
                                : "border-slate-300 text-slate-700 dark:text-slate-300 dark:border-slate-700"
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    {hasScalpUnsuitable && (
                      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
                        <p className="font-bold text-amber-900">{question9 + 1}. THIS SERVICE IS UNSUITABLE</p>
                        <p className="mt-2 text-sm text-amber-900">
                          Treatment will be less effective if you have a condition affecting your hair follicles. We
                          would advise that you book a video consultation with one of our GP&apos;s to get this
                          addressed first.
                        </p>
                        <button
                          type="button"
                          onClick={() => setScalpUnsuitableAck(true)}
                          className={`mt-4 px-4 py-2 rounded-lg border text-sm font-bold ${
                            scalpUnsuitableAck
                              ? "bg-primary text-white border-primary"
                              : "border-slate-300 text-slate-700"
                          }`}
                        >
                          I understand
                        </button>
                      </div>
                    )}

                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">
                        {question10}. Do you have, or have you ever had, any of the following conditions?
                      </p>
                      <ul className="mt-2 text-sm text-slate-600 list-disc pl-5 space-y-1">
                        <li>Allergy to finasteride</li>
                        <li>Liver or Kidney dysfunction</li>
                        <li>Prostate conditions (e.g. BPH)</li>
                        <li>Male breast cancer</li>
                        <li>Prostate cancer</li>
                        <li>Alopecia areata (a type of hair loss)</li>
                        <li>Autoimmune diseases (e.g. lupus, rheumatoid arthritis, IBD)</li>
                      </ul>
                      <div className="mt-3 flex gap-3">
                        {["Yes", "No"].map((item) => (
                          <button
                            key={item}
                            onClick={() => {
                              setConditions(item);
                              setConditionsUnsuitableAck(false);
                            }}
                            className={`px-4 py-2 rounded-lg border text-sm font-bold ${
                              conditions === item
                                ? "bg-primary text-white border-primary"
                                : "border-slate-300 text-slate-700 dark:text-slate-300 dark:border-slate-700"
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    {hasConditionsUnsuitable && (
                      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
                        <p className="font-bold text-amber-900">{question10 + 1}. THIS SERVICE IS UNSUITABLE</p>
                        <p className="mt-2 text-sm text-amber-900">
                          This medication may not be safe for you to take and a more detailed medical assessment is
                          needed. To discuss other treatment options we would recommend contacting your local GP.
                        </p>
                        <button
                          type="button"
                          onClick={() => setConditionsUnsuitableAck(true)}
                          className={`mt-4 px-4 py-2 rounded-lg border text-sm font-bold ${
                            conditionsUnsuitableAck
                              ? "bg-primary text-white border-primary"
                              : "border-slate-300 text-slate-700"
                          }`}
                        >
                          I understand
                        </button>
                      </div>
                    )}

                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">
                        {question11}. Do you have a history of low mood, depression, or suicidal thoughts?
                      </p>
                      <div className="mt-3 flex gap-3">
                        {["Yes", "No"].map((item) => (
                          <button
                            key={item}
                            onClick={() => {
                              setLowMoodHistory(item);
                              setMoodChoice("");
                              setMoodUnsuitableAck(false);
                            }}
                            className={`px-4 py-2 rounded-lg border text-sm font-bold ${
                              lowMoodHistory === item
                                ? "bg-primary text-white border-primary"
                                : "border-slate-300 text-slate-700 dark:text-slate-300 dark:border-slate-700"
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    {hasMoodAdvisory && (
                      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
                        <p className="font-bold text-amber-900">{question11 + 1}. {lowMoodHistory === "Yes" ? "This medication can potentially worsen these conditions." : "Depression and suicidal thoughts are rare side effects of this medication."}</p>
                        <p className="mt-2 text-sm text-amber-900">
                          {lowMoodHistory === "Yes"
                            ? "If you choose to continue taking this medication, it is essential to monitor your mood closely. If you notice any changes, stop the medication and speak to your doctor or book a video consultation with one of our GPs."
                            : "While most people do not experience these, it is important to be aware of the possibility. If you have any concerns, stop the medication and speak to your doctor or book a video consultation with one of our GPs."}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => setMoodChoice("proceed")}
                            className={`px-4 py-2 rounded-lg border text-sm font-bold ${
                              moodChoice === "proceed"
                                ? "bg-primary text-white border-primary"
                                : "border-slate-300 text-slate-700"
                            }`}
                          >
                            I understand and want to proceed
                          </button>
                          <button
                            type="button"
                            onClick={() => setMoodChoice("stop")}
                            className={`px-4 py-2 rounded-lg border text-sm font-bold ${
                              moodChoice === "stop"
                                ? "bg-primary text-white border-primary"
                                : "border-slate-300 text-slate-700"
                            }`}
                          >
                            I do not want to proceed
                          </button>
                        </div>
                      </div>
                    )}

                    {hasMoodUnsuitable && (
                      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
                        <p className="font-bold text-amber-900">{question11 + 2}. THIS SERVICE IS UNSUITABLE</p>
                        <p className="mt-2 text-sm text-amber-900">
                          To discuss other treatment options please book a video consultation with one of our GPs.
                        </p>
                        <button
                          type="button"
                          onClick={() => setMoodUnsuitableAck(true)}
                          className={`mt-4 px-4 py-2 rounded-lg border text-sm font-bold ${
                            moodUnsuitableAck
                              ? "bg-primary text-white border-primary"
                              : "border-slate-300 text-slate-700"
                          }`}
                        >
                          I understand
                        </button>
                      </div>
                    )}

                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">
                        {question12}. Are you currently taking finasteride or dutasteride for prostate problems?
                      </p>
                      <div className="mt-3 flex gap-3">
                        {["Yes", "No"].map((item) => (
                          <button
                            key={item}
                            onClick={() => {
                              setProstateFinasteride(item);
                              setProstateUnsuitableAck(false);
                            }}
                            className={`px-4 py-2 rounded-lg border text-sm font-bold ${
                              prostateFinasteride === item
                                ? "bg-primary text-white border-primary"
                                : "border-slate-300 text-slate-700 dark:text-slate-300 dark:border-slate-700"
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    {hasProstateUnsuitable && (
                      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
                        <p className="font-bold text-amber-900">{question12 + 1}. THIS SERVICE IS UNSUITABLE</p>
                        <p className="mt-2 text-sm text-amber-900">
                          To discuss other treatment options please book a video consultation with one of our GPs.
                        </p>
                        <button
                          type="button"
                          onClick={() => setProstateUnsuitableAck(true)}
                          className={`mt-4 px-4 py-2 rounded-lg border text-sm font-bold ${
                            prostateUnsuitableAck
                              ? "bg-primary text-white border-primary"
                              : "border-slate-300 text-slate-700"
                          }`}
                        >
                          I understand
                        </button>
                      </div>
                    )}

                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">
                        {question13}. Have you ever used finasteride for hair loss?
                      </p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {["I'm currently using it", "I've used it before", "I've never used it"].map((item) => (
                          <button
                            key={item}
                            onClick={() => {
                              setFinasterideUsage(item);
                              setFinasterideEffective("");
                            }}
                            className={`px-4 py-2 rounded-lg border text-sm font-bold ${
                              finasterideUsage === item
                                ? "bg-primary text-white border-primary"
                                : "border-slate-300 text-slate-700 dark:text-slate-300 dark:border-slate-700"
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    {showEffectivenessQuestion && (
                      <div>
                        <p className="font-bold text-dark-slate dark:text-white">{question14}. Did you find it effective?</p>
                        <div className="mt-3 flex gap-3">
                          {["Yes", "No"].map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => setFinasterideEffective(item)}
                              className={`px-4 py-2 rounded-lg border text-sm font-bold ${
                                finasterideEffective === item
                                  ? "bg-primary text-white border-primary"
                                  : "border-slate-300 text-slate-700 dark:text-slate-300 dark:border-slate-700"
                              }`}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setQuestionStep(3)}
                        disabled={!canContinueToReview}
                        title={!canContinueToReview ? "Please complete all required answers first" : undefined}
                        className="px-8 py-3 rounded-lg bg-slate-900 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {questionStep === 3 && (
                  <div className="mt-7 space-y-6">
                    {requestSubmitted ? (
                      <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6">
                        <p className="text-2xl font-black text-emerald-900">Request submitted</p>
                        <p className="mt-2 text-sm text-emerald-900">
                          Thank you. Your prescription request has been sent for doctor review. We will update you in
                          your secure patient account.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="rounded-2xl border border-slate-200 p-5">
                          <p className="font-black text-dark-slate dark:text-white">Your answers at a glance</p>
                          <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
                            <p><span className="font-bold">Patient for:</span> {patientFor || "-"}</p>
                            <p><span className="font-bold">Hair pattern:</span> {hairPattern.replace("pattern-", "Pattern ") || "-"}</p>
                            <p><span className="font-bold">Birth sex:</span> {birthSex || "-"}</p>
                            <p><span className="font-bold">Age:</span> {age || "-"}</p>
                            <p><span className="font-bold">Finasteride strength:</span> {finasterideStrength || "-"}</p>
                            <p><span className="font-bold">Previous finasteride use:</span> {finasterideUsage || "-"}</p>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 p-5">
                          <p className="font-bold text-dark-slate dark:text-white">Final confirmation</p>
                          <div className="mt-4 flex flex-col gap-3">
                            <button
                              type="button"
                              onClick={() => setConfirmAccuracy((v) => !v)}
                              className={`w-full text-left px-4 py-3 rounded-lg border text-sm font-bold transition-colors ${
                                confirmAccuracy
                                  ? "bg-primary text-white border-primary"
                                  : "border-slate-300 text-slate-700 dark:text-slate-300 dark:border-slate-700"
                              }`}
                            >
                              I confirm my answers are complete and accurate
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmSafety((v) => !v)}
                              className={`w-full text-left px-4 py-3 rounded-lg border text-sm font-bold transition-colors ${
                                confirmSafety
                                  ? "bg-primary text-white border-primary"
                                  : "border-slate-300 text-slate-700 dark:text-slate-300 dark:border-slate-700"
                              }`}
                            >
                              I understand this request is subject to doctor approval
                            </button>
                          </div>
                        </div>

                        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => setQuestionStep(2)}
                            className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-bold"
                          >
                            Back
                          </button>
                          <button
                            type="button"
                            onClick={() => setRequestSubmitted(true)}
                            disabled={!canSubmitRequest}
                            className="px-8 py-3 rounded-lg bg-primary text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Submit Request
                          </button>
                        </div>
                      </>
                    )}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={startQuestionnaire}
                        className="px-8 py-3 rounded-lg bg-slate-900 text-white font-bold"
                      >
                        Start New Request
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-center">What&apos;s included and excluded</h2>
            <div className="grid lg:grid-cols-2 gap-8 mt-10">
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-black mb-6">What&apos;s included with our service</h3>
                <ul className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
                  <li>- There is no cure for male pattern hair loss, but Webdoctor.ie can arrange a prescription for medication to help further loss and encourage growth, subject to clinical suitability.</li>
                  <li>- If no improvement is observed by 12 months of continuous treatment, it is unlikely that this treatment will work for you and should stop it.</li>
                  <li>- Please be aware, this is an â€œoff-licenceâ€ use of this medication. A licensed version of this medication (1 mg tablets) is also now available on the Irish market and can also be requested. If you would prefer this medication, please let us know by sending a message on your secure patient account.</li>
                </ul>
              </div>
              <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-black mb-6">What&apos;s excluded with our service</h3>
                <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                  <li>- Are already using medication to treat benign prostate conditions</li>
                  <li>- Have a history of breast or prostate cancer</li>
                  <li>- Are female. We are NOT able to provide this treatment for females safely via our prescription service.</li>
                  <li>- If you are trying to conceive, you should not use this medication. It can affect sperm quality.</li>
                  <li>- This medication may cause harm to an unborn baby.</li>
                  <li>- Pregnant women MUST avoid handling these tablets once they have been removed from the protective packaging.</li>
                  <li>- If your partner is pregnant or might be pregnant, you MUST use condoms.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-center">How it works</h2>
            <p className="text-slate-500 text-center mt-3">Requesting a prescription online could not be easier with Webdoctor.ie.</p>
            <div className="grid md:grid-cols-3 gap-6 mt-10">
              {[
                { step: "Step 1", icon: CheckCircle2, title: "Online Questionnaire", desc: "Complete a secure questionnaire and answer all questions accurately." },
                { step: "Step 2", icon: Clock, title: "Medical Review", desc: "An Irish-registered doctor reviews your information using clinical standards." },
                { step: "Step 3", icon: ArrowRight, title: "Prescription Sent", desc: "If approved, your prescription is sent to your chosen Irish pharmacy via Healthmail." },
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

