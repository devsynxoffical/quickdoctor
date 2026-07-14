"use client";

import React, { useEffect, useState } from "react";
import { beginPrescriptionCheckout } from '@/lib/serviceCheckout';
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2, ChevronDown, Clock, Search, ShieldCheck, Syringe, Users } from "lucide-react";

type RequestFor = "Myself" | "Another Adult" | "My Child" | "";
type AnswerKey =
  | "q4"
  | "q5"
  | "q6"
  | "q7"
  | "q8"
  | "q9"
  | "s2q1"
  | "s2q2"
  | "s2q3"
  | "s3q1"
  | "s3q2"
  | "s3q3"
  | "s4q1"
  | "s4q2"
  | "s4q3"
  | "s5q1"
  | "s5q2"
  | "s5q3";

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

export default function HpvVaccinePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [hasStartedRequest, setHasStartedRequest] = useState(false);
  const [requestFor, setRequestFor] = useState<RequestFor>("");
  const [age, setAge] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [answers, setAnswers] = useState<Record<AnswerKey, string>>({
    q4: "",
    q5: "",
    q6: "",
    q7: "",
    q8: "",
    q9: "",
    s2q1: "",
    s2q2: "",
    s2q3: "",
    s3q1: "",
    s3q2: "",
    s3q3: "",
    s4q1: "",
    s4q2: "",
    s4q3: "",
    s5q1: "",
    s5q2: "",
    s5q3: "",
  });

  const hasEligibilityNotice = requestFor === "Another Adult" || requestFor === "My Child";
  const ageQuestionNumber = hasEligibilityNotice ? 3 : 2;
  const vaccinationQuestionNumber = ageQuestionNumber + 1;
  const pregnancyQuestionNumber = vaccinationQuestionNumber + 1;
  const anaphylaxisQuestionNumber = pregnancyQuestionNumber + 1;
  const bleedingDisorderQuestionNumber = anaphylaxisQuestionNumber + 1;
  const proceedQuestionNumber = bleedingDisorderQuestionNumber + 1;
  const confirmQuestionNumber = proceedQuestionNumber + 1;

  const optionButtonClass = (option: RequestFor) =>
    `px-4 py-2 rounded-lg border text-sm font-bold transition-colors ${
      requestFor === option
        ? "bg-primary text-white border-primary"
        : "border-slate-300 text-slate-700 dark:text-slate-300 dark:border-slate-700 hover:border-primary"
    }`;

  const answerButtonClass = (questionId: AnswerKey, option: string) =>
    `px-4 py-2 rounded-lg border text-sm font-bold transition-colors ${
      answers[questionId] === option
        ? "bg-primary text-white border-primary"
        : "border-slate-300 text-slate-700 dark:text-slate-300 dark:border-slate-700 hover:border-primary"
    }`;

  const stepTitle = {
    1: "Suitability Check",
    2: "Vaccination History",
    3: "Medical Safety",
    4: "Treatment Understanding",
    5: "Pharmacy and Follow-up",
    6: "Review & Submit",
  }[currentStep];

  const step1Complete =
    requestFor !== "" && age.trim() !== "" && answers.q4 && answers.q5 && answers.q6 && answers.q7 && answers.q8 && answers.q9;
  const step2Complete = Boolean(answers.s2q1 && answers.s2q2 && answers.s2q3);
  const step3Complete = Boolean(answers.s3q1 && answers.s3q2 && answers.s3q3);
  const step4Complete = Boolean(answers.s4q1 && answers.s4q2 && answers.s4q3);
  const step5Complete = Boolean(answers.s5q1 && answers.s5q2 && answers.s5q3);
  const canGoNext =
    (currentStep === 1 && step1Complete) ||
    (currentStep === 2 && step2Complete) ||
    (currentStep === 3 && step3Complete) ||
    (currentStep === 4 && step4Complete) ||
    (currentStep === 5 && step5Complete);

  const startQuestionnaire = () => {
    setHasStartedRequest(true);
    setCurrentStep(1);
    setSubmitted(false);
    setTimeout(() => {
      document.getElementById("hpv-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  useEffect(() => {
    setHasStartedRequest(false);

    // Reset questionnaire visibility when page is restored from browser cache.
    const handlePageShow = () => setHasStartedRequest(false);
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const infoQuestions = [
    {
      question: "Who is this service for?",
      answer:
        "This service is for adults in Ireland seeking a doctor-reviewed prescription for HPV 9 vaccination, subject to medical suitability.",
    },
    {
      question: "What is Human papilloma virus (HPV)?",
      answer:
        "HPV is a common virus spread through skin-to-skin intimate contact. Many infections clear naturally, but some types can persist and cause health problems.",
    },
    {
      question: "What is genital HPV?",
      answer:
        "Genital HPV refers to HPV infection in the genital or anal area. It can affect people of any gender and may not cause immediate symptoms.",
    },
    {
      question: "Are there high and low-risk genital HPV infections?",
      answer:
        "Yes. Low-risk types may cause genital warts, while high-risk types are linked to cervical and other anogenital and throat cancers.",
    },
    {
      question: "Is there a cure for HPV?",
      answer:
        "There is no cure for the virus itself, but many infections clear with time and treatments are available for HPV-related conditions.",
    },
    {
      question: "Are there things that increase my risk of contracting HPV?",
      answer:
        "Risk can increase with new or multiple partners, inconsistent condom use, smoking, and not being vaccinated.",
    },
    {
      question: "How can I reduce my risk of getting HPV?",
      answer:
        "Vaccination, safer sex practices, regular screening, and avoiding smoking all help reduce risk.",
    },
    {
      question: "What is HPV 9 vaccination?",
      answer:
        "HPV 9 (Gardasil 9) is a vaccine that protects against nine HPV types, including types linked to cancers and genital warts.",
    },
    {
      question: "When should I get this HPV vaccine?",
      answer:
        "The best timing is before exposure to HPV, but adults may still benefit. Final suitability is confirmed by a clinician.",
    },
    {
      question: "Is this vaccination available from the HSE?",
      answer:
        "Some groups may be eligible through HSE programs. If you are unsure, check current HSE guidance or ask your GP/pharmacist.",
    },
    {
      question: "How many vaccinations do I need to complete a full course?",
      answer:
        "Dose schedules vary by age and previous doses, usually 1 to 3 doses. Your clinician or pharmacist will advise the correct schedule.",
    },
    {
      question: "If I started a course, can I complete it?",
      answer:
        "In many cases yes. Your prior dose history is reviewed to plan safe catch-up or completion.",
    },
    {
      question: "Can I get revaccinated with HPV 9?",
      answer:
        "Some people may be considered for HPV 9 after previous vaccination, depending on history and clinician assessment.",
    },
    {
      question: "How long will protection last?",
      answer:
        "Current evidence shows durable long-term protection, with ongoing studies continuing to monitor duration.",
    },
    {
      question: "Can I get HPV 9 vaccine if I am immunocompromised?",
      answer:
        "Many immunocompromised patients can still be vaccinated, but this requires individual clinical review.",
    },
    {
      question: "Potential side effects of this vaccine?",
      answer:
        "Common effects include arm soreness, redness, mild fever, headache, and fatigue. Serious reactions are rare.",
    },
    {
      question: "What ingredients are in HPV 9 vaccine?",
      answer:
        "The vaccine contains purified protein components, adjuvant, and inactive ingredients. A clinician can review full ingredient details if needed.",
    },
    {
      question: "Do I still need smear tests after vaccination?",
      answer:
        "Yes. Vaccination does not replace cervical screening. Continue attending routine smear tests as advised.",
    },
    {
      question: "Important information about HPV vaccination",
      answer:
        "Vaccination lowers risk but does not remove it completely. Keep up with screening and follow medical advice for ongoing protection.",
    },
    {
      question: "How does this service work?",
      answer:
        "You complete a questionnaire, a doctor reviews your answers, and if suitable a prescription is issued for pharmacy administration.",
    },
    {
      question: "What will happen during this initial consultation?",
      answer:
        "You provide your medical history, vaccination history, and consent information so the doctor can assess safety and suitability.",
    },
  ];

  const submitPrescriptionRequest = () => {
    beginPrescriptionCheckout({
      slug: 'hpv-vaccine',
      serviceName: 'Hpv Vaccine',
      payload: {
      hasStartedRequest,
      requestFor,
      age,
      locationQuery,
      searched,
      answers,
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <Navbar />
<main>
        {hasStartedRequest && (
          <section id="hpv-questionnaire" className="pt-28 pb-16">
            <div className="max-w-4xl mx-auto px-6">
              <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8">
              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${(currentStep / 6) * 100}%` }} />
              </div>
              <p className="mt-3 text-sm font-bold text-slate-600">Step {currentStep} / 6</p>
              <h1 className="mt-2 text-3xl md:text-4xl font-black text-dark-slate dark:text-white">{stepTitle}</h1>

              <div className="mt-8 space-y-7">
                {currentStep === 1 && (
                  <>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      The same patient-doctor confidentiality protects all the information you provide in this questionnaire you
                      would expect when seeing a doctor face to face. We need to make sure that it is safe to prescribe this
                      vaccination for you.
                    </p>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">1. Who are you requesting this prescription for?</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        Please note: if this prescription is approved, it will be issued in the name of this account owner, and
                        include their personal details. Photographic ID is required to complete this questionnaire and will be
                        required when you attend for your vaccination appointment.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <button type="button" onClick={() => setRequestFor("Myself")} className={optionButtonClass("Myself")}>Myself</button>
                        <button type="button" onClick={() => setRequestFor("Another Adult")} className={optionButtonClass("Another Adult")}>Another Adult</button>
                        <button type="button" onClick={() => setRequestFor("My Child")} className={optionButtonClass("My Child")}>My Child</button>
                      </div>
                    </div>
                    {requestFor === "Another Adult" && (
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        2. If another adult is seeking a prescription for HPV vaccination they will need to apply for this using
                        their own personal account. They can register for free at Webdoctor.ie.
                      </p>
                    )}
                    {requestFor === "My Child" && (
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        2. This prescription service is only available to those who are 17 years of age and over. If your child
                        is under 17 and needs a HPV vaccination this can be arranged via your local HSE vaccination service.
                      </p>
                    )}
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">{ageQuestionNumber}. What is your age?</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        Please note: if you are older than 45 years at the time your first vaccination is booked to be given, the
                        pharmacist will NOT be able to proceed with the vaccination.
                      </p>
                      <input
                        value={age}
                        onChange={(e) => setAge(e.target.value.replace(/\D/g, ""))}
                        placeholder="Enter age"
                        className="mt-3 w-full max-w-60 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">{vaccinationQuestionNumber}. Have you received a FULL course of HPV vaccination before October 2022?</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Before October 2022: 2 doses if first dose was before 15 years of age, and 3 doses if first dose was at 15 years or more.</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <button type="button" onClick={() => setAnswers((prev) => ({ ...prev, q4: "Yes, I have" }))} className={answerButtonClass("q4", "Yes, I have")}>Yes, I have</button>
                        <button type="button" onClick={() => setAnswers((prev) => ({ ...prev, q4: "No, I have not" }))} className={answerButtonClass("q4", "No, I have not")}>No, I have not</button>
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">{pregnancyQuestionNumber}. Are you pregnant or possibly pregnant?</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <button type="button" onClick={() => setAnswers((prev) => ({ ...prev, q5: "Yes, I am" }))} className={answerButtonClass("q5", "Yes, I am")}>Yes, I am</button>
                        <button type="button" onClick={() => setAnswers((prev) => ({ ...prev, q5: "No, I am not" }))} className={answerButtonClass("q5", "No, I am not")}>No, I am not</button>
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">{anaphylaxisQuestionNumber}. Have you had an anaphylactic reaction to ANY previous vaccination?</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <button type="button" onClick={() => setAnswers((prev) => ({ ...prev, q6: "Yes" }))} className={answerButtonClass("q6", "Yes")}>Yes</button>
                        <button type="button" onClick={() => setAnswers((prev) => ({ ...prev, q6: "No" }))} className={answerButtonClass("q6", "No")}>No</button>
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">{bleedingDisorderQuestionNumber}. Do you have a bleeding disorder?</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <button type="button" onClick={() => setAnswers((prev) => ({ ...prev, q7: "Yes, I do" }))} className={answerButtonClass("q7", "Yes, I do")}>Yes, I do</button>
                        <button type="button" onClick={() => setAnswers((prev) => ({ ...prev, q7: "No, I do not" }))} className={answerButtonClass("q7", "No, I do not")}>No, I do not</button>
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">{proceedQuestionNumber}. Are you happy to proceed with Gardasil 9 (HPV 9) vaccine only?</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <button type="button" onClick={() => setAnswers((prev) => ({ ...prev, q8: "Yes, I am happy to proceed" }))} className={answerButtonClass("q8", "Yes, I am happy to proceed")}>Yes, I am happy to proceed</button>
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">{confirmQuestionNumber}. Please confirm you have read and understood all the details on our information page.</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <button type="button" onClick={() => setAnswers((prev) => ({ ...prev, q9: "I confirm" }))} className={answerButtonClass("q9", "I confirm")}>I confirm</button>
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">1. Have you ever received any HPV vaccine dose previously?</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {["No previous dose", "Yes, one dose", "Yes, two or more doses", "I am not sure"].map((option) => (
                          <button key={option} type="button" onClick={() => setAnswers((prev) => ({ ...prev, s2q1: option }))} className={answerButtonClass("s2q1", option)}>{option}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">2. When was your most recent HPV vaccine dose?</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {["Within 12 months", "1-3 years ago", "More than 3 years ago", "I have never received one"].map((option) => (
                          <button key={option} type="button" onClick={() => setAnswers((prev) => ({ ...prev, s2q2: option }))} className={answerButtonClass("s2q2", option)}>{option}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">3. Are you requesting this for completion/catch-up of your vaccine course?</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {["Yes", "No", "I am not sure"].map((option) => (
                          <button key={option} type="button" onClick={() => setAnswers((prev) => ({ ...prev, s2q3: option }))} className={answerButtonClass("s2q3", option)}>{option}</button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">1. Do you have a history of severe allergy to any vaccine ingredient?</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {["Yes", "No", "I am not sure"].map((option) => (
                          <button key={option} type="button" onClick={() => setAnswers((prev) => ({ ...prev, s3q1: option }))} className={answerButtonClass("s3q1", option)}>{option}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">2. Do you have any significant current illness or fever?</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {["Yes", "No"].map((option) => (
                          <button key={option} type="button" onClick={() => setAnswers((prev) => ({ ...prev, s3q2: option }))} className={answerButtonClass("s3q2", option)}>{option}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">3. Are you currently immunocompromised due to illness or treatment?</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {["Yes", "No", "I am not sure"].map((option) => (
                          <button key={option} type="button" onClick={() => setAnswers((prev) => ({ ...prev, s3q3: option }))} className={answerButtonClass("s3q3", option)}>{option}</button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 4 && (
                  <>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">1. Do you understand this service issues a prescription only if clinically suitable?</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {["I understand", "I do not understand"].map((option) => (
                          <button key={option} type="button" onClick={() => setAnswers((prev) => ({ ...prev, s4q1: option }))} className={answerButtonClass("s4q1", option)}>{option}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">2. Do you understand vaccination appointment and administration are arranged through a pharmacy?</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {["I understand", "I do not understand"].map((option) => (
                          <button key={option} type="button" onClick={() => setAnswers((prev) => ({ ...prev, s4q2: option }))} className={answerButtonClass("s4q2", option)}>{option}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">3. Do you understand final eligibility is confirmed by pharmacist and doctor review?</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {["I understand", "I do not understand"].map((option) => (
                          <button key={option} type="button" onClick={() => setAnswers((prev) => ({ ...prev, s4q3: option }))} className={answerButtonClass("s4q3", option)}>{option}</button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 5 && (
                  <>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">1. Can you attend an Irish pharmacy with photographic ID if approved?</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {["Yes", "No"].map((option) => (
                          <button key={option} type="button" onClick={() => setAnswers((prev) => ({ ...prev, s5q1: option }))} className={answerButtonClass("s5q1", option)}>{option}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">2. Do you agree to contact support if any answer needs correction after submission?</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {["Yes", "No"].map((option) => (
                          <button key={option} type="button" onClick={() => setAnswers((prev) => ({ ...prev, s5q2: option }))} className={answerButtonClass("s5q2", option)}>{option}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">3. I confirm the information provided is true and accurate.</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <button type="button" onClick={() => setAnswers((prev) => ({ ...prev, s5q3: "I confirm" }))} className={answerButtonClass("s5q3", "I confirm")}>I confirm</button>
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 6 && (
                  <div className="space-y-5">
                    {submitted ? (
                      <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6">
                        <p className="font-black text-emerald-900 text-2xl">Request submitted</p>
                        <p className="mt-2 text-sm text-emerald-900">Your HPV vaccine questionnaire has been sent for doctor review. You will receive an update in your account after assessment.</p>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-slate-200 p-5">
                        <p className="font-black text-dark-slate dark:text-white">Review your key details</p>
                        <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
                          <p><span className="font-bold">Request for:</span> {requestFor || "-"}</p>
                          <p><span className="font-bold">Age:</span> {age || "-"}</p>
                          <p><span className="font-bold">Full HPV course before Oct 2022:</span> {answers.q4 || "-"}</p>
                          <p><span className="font-bold">Pregnant/possibly pregnant:</span> {answers.q5 || "-"}</p>
                          <p><span className="font-bold">Anaphylaxis history:</span> {answers.q6 || "-"}</p>
                          <p><span className="font-bold">Bleeding disorder:</span> {answers.q7 || "-"}</p>
                          <p><span className="font-bold">Proceed consent:</span> {answers.q8 || "-"}</p>
                          <p><span className="font-bold">Information confirmed:</span> {answers.q9 || "-"}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                    disabled={currentStep === 1 || submitted}
                    className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Back
                  </button>
                  {currentStep < 6 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep((prev) => Math.min(6, prev + 1))}
                      disabled={!canGoNext}
                      className="px-8 py-3 rounded-lg bg-slate-900 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={submitPrescriptionRequest}
                      disabled={submitted}
                      className="px-8 py-3 rounded-lg bg-primary text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Request
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          </section>
        )}

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-black uppercase mb-6">
                Ireland&apos;s Award-Winning Online Doctor Service
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-dark-slate dark:text-white leading-tight">
                HPV Vaccine <span className="text-primary">Assessment</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-6 leading-relaxed">
                HPV vaccination can help protect against specific HPV types linked to cancer and genital warts. We can provide prescriptions for HPV 9 vaccine after clinical review.
              </p>
            </div>
            <div className="rounded-[36px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
              <h3 className="text-2xl font-black mb-5">Choose your service</h3>
              <div className="space-y-3">
                <button type="button" onClick={startQuestionnaire} className="block w-full p-4 rounded-2xl border text-left transition-all bg-primary text-white border-primary">
                  <p className="font-black text-white">Request Prescription</p>
                  <p className="text-sm font-bold mt-1 text-white/90">EUR40</p>
                </button>
                <Link href="/consultation" className="block w-full p-4 rounded-2xl border text-left transition-all bg-slate-50 border-slate-200 hover:border-primary">
                  <p className="font-black text-dark-slate">Online Consultation</p>
                  <p className="text-sm font-bold mt-1 text-primary">EUR39+</p>
                </Link>
              </div>
              <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">From</p>
                <p className="text-3xl font-black text-primary mt-1">EUR40</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-center">Treatments that we can provide</h2>
            <p className="text-slate-600 dark:text-slate-400 text-center mt-4 max-w-4xl mx-auto leading-relaxed">
              Certain HPV types can cause cervical, vaginal, penile, anal and mouth/throat cancers, and genital warts. There is no cure for HPV, but vaccination can provide important protection. Our online service can provide HPV 9 vaccine prescriptions after doctor review.
            </p>
            <div className="mt-8 max-w-xl mx-auto p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <Syringe className="w-6 h-6 text-primary mx-auto" />
              <p className="font-black mt-2">HPV (9) vaccination</p>
              <button type="button" onClick={startQuestionnaire} className="mt-4 px-6 py-3 bg-primary text-white rounded-xl font-bold inline-flex items-center gap-2">
                Request Prescription <ArrowRight className="w-4 h-4" />
              </button>
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
                <div key={item.title} className="p-6 rounded-3xl bg-white border border-slate-200">
                  <item.icon className="w-8 h-8 text-primary" />
                  <p className="text-xs uppercase tracking-widest font-bold text-primary mt-4">{item.step}</p>
                  <p className="text-xl font-black mt-2 text-dark-slate">{item.title}</p>
                  <p className="text-sm text-slate-500 mt-2">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-center">How Much Does The HPV Vaccine Typically Cost?</h2>
            <div className="mt-8 max-w-4xl mx-auto rounded-3xl overflow-hidden border border-slate-200">
              <div className="grid grid-cols-3 bg-slate-100 text-sm font-bold">
                <div className="p-4">Vaccination Name</div>
                <div className="p-4">Price Per Dose (approx.)</div>
                <div className="p-4">Usual No. of Doses</div>
              </div>
              <div className="grid grid-cols-3 text-sm">
                <div className="p-4 border-t border-slate-200">HPV Vaccine</div>
                <div className="p-4 border-t border-slate-200">EUR185</div>
                <div className="p-4 border-t border-slate-200">1-3*</div>
              </div>
            </div>
            <p className="text-xs text-slate-500 text-center mt-3">*The number of vaccinations needed is decided by your doctor.</p>
            <div className="mt-10 max-w-4xl mx-auto p-6 rounded-3xl bg-slate-50 border border-slate-200">
              <h3 className="text-xl font-black">Find a pharmacy near you</h3>
              <p className="text-sm text-slate-500 mt-2">Enter your town, Dublin postal code or first 3 letters of your Eircode.</p>
              <div className="mt-4 flex gap-3">
                <input
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="Search by town, postal code or Eircode"
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white"
                />
                <button onClick={() => setSearched(true)} className="px-5 py-3 rounded-xl bg-primary text-white font-bold inline-flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>
              {searched && (
                <p className="text-sm text-slate-600 mt-3">
                  Demo result for <span className="font-bold">{locationQuery || "your area"}</span>: nearest pharmacy options will be shown here after map integration.
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-black text-center">Important Medical Information</h2>
            <div className="mt-8 bg-white rounded-3xl border border-slate-200 p-6">
              <div>
                {infoQuestions.map((item) => (
                  <AccordionItem key={item.question} question={item.question} answer={item.answer} />
                ))}
              </div>
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
                <div key={item.title} className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <item.icon className="w-5 h-5 text-primary" />
                  <p className="font-black mt-3">{item.title}</p>
                  <p className="text-sm text-slate-600 mt-1">{item.desc}</p>
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

