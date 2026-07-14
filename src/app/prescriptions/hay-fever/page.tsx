"use client";

import React, { useState } from "react";
import { beginPrescriptionCheckout } from '@/lib/serviceCheckout';
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2, ChevronDown, Clock, ShieldCheck, Users, XCircle } from "lucide-react";

const faqs = [
  "What is Hay Fever?",
  "What Hay Fever treatments can you prescribe?",
  "How do I take these Hay Fever treatments?",
  "What are the potential side effects of these treatments?",
  "Who is this Hay Fever treatment suitable for?",
  "Will Hay Fever treatments make me drowsy?",
  "Are there things I can do to help reduce my symptoms?",
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
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="pb-5 text-slate-600 dark:text-slate-400"
          >
            Final prescribing decisions are made by an Irish-registered doctor following clinical review.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function HayFeverPage() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Ack, setStep1Ack] = useState(false);
  const [unsuitableAck, setUnsuitableAck] = useState(false);
  const [patientFor, setPatientFor] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [diagnosedHayFever, setDiagnosedHayFever] = useState("");
  const [hasSevereSymptoms, setHasSevereSymptoms] = useState("");
  const [hasMedicationAllergy, setHasMedicationAllergy] = useState("");
  const [pregnantOrBreastfeeding, setPregnantOrBreastfeeding] = useState("");
  const [usingOtherMedication, setUsingOtherMedication] = useState("");
  const [finalAccuracyConfirm, setFinalAccuracyConfirm] = useState(false);
  const [finalDoctorReviewConfirm, setFinalDoctorReviewConfirm] = useState(false);

  const selectClass = (selected: boolean) =>
    `px-4 py-2 rounded-lg border text-sm font-bold transition-colors ${
      selected
        ? "bg-primary text-white border-primary"
        : "border-slate-300 text-slate-700 dark:text-slate-300 dark:border-slate-700 hover:border-primary"
    }`;

  const startQuestionnaire = () => {
    setShowQuestionnaire(true);
    setCurrentStep(1);
    setStep1Ack(false);
    setUnsuitableAck(false);
    setPatientFor("");
    setSubmitted(false);
    setDiagnosedHayFever("");
    setHasSevereSymptoms("");
    setHasMedicationAllergy("");
    setPregnantOrBreastfeeding("");
    setUsingOtherMedication("");
    setFinalAccuracyConfirm(false);
    setFinalDoctorReviewConfirm(false);
    setTimeout(() => {
      document.getElementById("hayfever-questionnaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const showUnsuitableBlock = patientFor === "For a child" || patientFor === "For someone else";
  const step1Complete = step1Ack && patientFor !== "" && (showUnsuitableBlock ? unsuitableAck : true);
  const step2Complete =
    diagnosedHayFever !== "" &&
    hasSevereSymptoms !== "" &&
    hasMedicationAllergy !== "" &&
    pregnantOrBreastfeeding !== "" &&
    usingOtherMedication !== "";
  const canSubmit = finalAccuracyConfirm && finalDoctorReviewConfirm;

  const submitPrescriptionRequest = () => {
    beginPrescriptionCheckout({
      slug: 'hay-fever',
      serviceName: 'Hay Fever',
      payload: {
      step1Ack,
      unsuitableAck,
      patientFor,
      diagnosedHayFever,
      hasSevereSymptoms,
      hasMedicationAllergy,
      pregnantOrBreastfeeding,
      usingOtherMedication,
      finalAccuracyConfirm,
      finalDoctorReviewConfirm,
      },
    });
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
                Hay Fever <span className="text-primary">Treatment</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-6 leading-relaxed">
                Ireland&apos;s award-winning online doctor service.
              </p>
            </div>

            <div className="rounded-[36px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
              <h3 className="text-2xl font-black mb-5">Treatments that we can provide</h3>
              <div className="space-y-3">
                {[
                  { label: "Request Prescription", price: "EUR25", active: true, href: "/prescriptions" },
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
              <button type="button" onClick={startQuestionnaire} className="w-full mt-6 px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2">
                Request Prescription - EUR25 <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {showQuestionnaire && (
          <section id="hayfever-questionnaire" className="pb-10">
            <div className="max-w-4xl mx-auto px-6">
              <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8">
                <p className="text-sm font-bold text-primary">Step {currentStep} / 3</p>
                <h2 className="text-3xl font-black mt-2 text-dark-slate dark:text-white">
                  {currentStep === 1 ? "Patient Selection" : currentStep === 2 ? "Medical Safety Check" : "Review & Submit"}
                </h2>

                <div className="mt-8 space-y-7">
                  {currentStep === 1 && (
                    <>
                      <p className="text-slate-500 mt-2 leading-relaxed">
                        This questionnaire is an important part of your medical assessment today. We ask that you are honest with
                        your answers. Any information that you provide in this questionnaire is protected by the exact same
                        patient-doctor confidentiality you would expect from seeing a doctor face to face.
                      </p>
                      <div>
                        <p className="font-bold text-dark-slate dark:text-white">
                          1. Please be advised that this service is not suitable for all patients experiencing hay fever or allergy symptoms.
                        </p>
                        <p className="text-sm text-slate-500 mt-2">
                          We have safety criteria and checks in place to ensure clinical safety and we kindly ask that you answer all
                          questions honestly.
                        </p>
                        <button
                          type="button"
                          onClick={() => setStep1Ack((v) => !v)}
                          className={`mt-3 ${selectClass(step1Ack)}`}
                        >
                          I understand
                        </button>
                      </div>
                      <div>
                        <p className="font-bold text-dark-slate dark:text-white">2. Who are you requesting this treatment for?</p>
                        <p className="text-sm text-slate-500 mt-2">
                          Please be aware that if this prescription is approved, it will be issued in the name of this account holder,
                          and will include their personal details.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-3">
                          <button type="button" onClick={() => { setPatientFor("For myself"); setUnsuitableAck(false); }} className={selectClass(patientFor === "For myself")}>
                            For myself
                          </button>
                          <button type="button" onClick={() => { setPatientFor("For a child"); setUnsuitableAck(false); }} className={selectClass(patientFor === "For a child")}>
                            For a child
                          </button>
                          <button type="button" onClick={() => { setPatientFor("For someone else"); setUnsuitableAck(false); }} className={selectClass(patientFor === "For someone else")}>
                            For someone else
                          </button>
                        </div>
                      </div>
                      {showUnsuitableBlock && (
                        <div>
                          <p className="font-bold text-dark-slate dark:text-white">3. THIS SERVICE IS UNSUITABLE</p>
                          {patientFor === "For someone else" ? (
                            <>
                              <p className="text-sm text-slate-500 mt-2">You cannot apply for a prescription on behalf of another adult.</p>
                              <p className="text-sm text-slate-500 mt-2">If someone aged 17 or older needs a prescription, they must apply through their own account.</p>
                            </>
                          ) : (
                            <>
                              <p className="text-sm text-slate-500 mt-2">This service is only suitable for individuals aged 17 and older.</p>
                              <p className="text-sm text-slate-500 mt-2">If your child is over 17 years old, they must apply through their own account.</p>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() => setUnsuitableAck((v) => !v)}
                            className={`mt-3 ${selectClass(unsuitableAck)}`}
                          >
                            I understand
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {currentStep === 2 && (
                    <>
                      <div>
                        <p className="font-bold text-dark-slate dark:text-white">1. Have you had a doctor-confirmed diagnosis of hay fever (allergic rhinitis)?</p>
                        <div className="mt-3 flex flex-wrap gap-3">
                          <button type="button" onClick={() => setDiagnosedHayFever("Yes")} className={selectClass(diagnosedHayFever === "Yes")}>Yes</button>
                          <button type="button" onClick={() => setDiagnosedHayFever("No")} className={selectClass(diagnosedHayFever === "No")}>No</button>
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-dark-slate dark:text-white">2. Are your symptoms severe or causing wheeze/shortness of breath right now?</p>
                        <div className="mt-3 flex flex-wrap gap-3">
                          <button type="button" onClick={() => setHasSevereSymptoms("Yes")} className={selectClass(hasSevereSymptoms === "Yes")}>Yes</button>
                          <button type="button" onClick={() => setHasSevereSymptoms("No")} className={selectClass(hasSevereSymptoms === "No")}>No</button>
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-dark-slate dark:text-white">3. Do you have any allergy to antihistamines or steroid nasal sprays?</p>
                        <div className="mt-3 flex flex-wrap gap-3">
                          <button type="button" onClick={() => setHasMedicationAllergy("Yes")} className={selectClass(hasMedicationAllergy === "Yes")}>Yes</button>
                          <button type="button" onClick={() => setHasMedicationAllergy("No")} className={selectClass(hasMedicationAllergy === "No")}>No</button>
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-dark-slate dark:text-white">4. Are you pregnant or breastfeeding?</p>
                        <div className="mt-3 flex flex-wrap gap-3">
                          <button type="button" onClick={() => setPregnantOrBreastfeeding("Yes")} className={selectClass(pregnantOrBreastfeeding === "Yes")}>Yes</button>
                          <button type="button" onClick={() => setPregnantOrBreastfeeding("No")} className={selectClass(pregnantOrBreastfeeding === "No")}>No</button>
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-dark-slate dark:text-white">5. Are you currently taking other regular medication?</p>
                        <div className="mt-3 flex flex-wrap gap-3">
                          <button type="button" onClick={() => setUsingOtherMedication("Yes")} className={selectClass(usingOtherMedication === "Yes")}>Yes</button>
                          <button type="button" onClick={() => setUsingOtherMedication("No")} className={selectClass(usingOtherMedication === "No")}>No</button>
                        </div>
                      </div>
                    </>
                  )}

                  {currentStep === 3 && (
                    <>
                      {submitted ? (
                        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6">
                          <p className="font-black text-emerald-900 text-2xl">Request submitted</p>
                          <p className="mt-2 text-sm text-emerald-900">Your hay fever questionnaire has been sent for doctor review.</p>
                        </div>
                      ) : (
                        <>
                          <div className="rounded-2xl border border-slate-200 p-5">
                            <p className="font-black text-dark-slate dark:text-white">Review your details</p>
                            <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
                              <p><span className="font-bold">Request for:</span> {patientFor || "-"}</p>
                              <p><span className="font-bold">Doctor diagnosis:</span> {diagnosedHayFever || "-"}</p>
                              <p><span className="font-bold">Severe symptoms now:</span> {hasSevereSymptoms || "-"}</p>
                              <p><span className="font-bold">Medication allergy:</span> {hasMedicationAllergy || "-"}</p>
                              <p><span className="font-bold">Pregnant/breastfeeding:</span> {pregnantOrBreastfeeding || "-"}</p>
                              <p><span className="font-bold">Using other medication:</span> {usingOtherMedication || "-"}</p>
                            </div>
                          </div>
                          <div className="rounded-2xl border border-slate-200 p-5">
                            <p className="font-bold text-dark-slate dark:text-white">Final confirmation</p>
                            <div className="mt-4 flex flex-col gap-3">
                              <button type="button" onClick={() => setFinalAccuracyConfirm((v) => !v)} className={selectClass(finalAccuracyConfirm)}>
                                I confirm my answers are complete and accurate.
                              </button>
                              <button type="button" onClick={() => setFinalDoctorReviewConfirm((v) => !v)} className={selectClass(finalDoctorReviewConfirm)}>
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
                      className="px-5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold disabled:opacity-40"
                    >
                      Back
                    </button>
                    {currentStep < 3 ? (
                      <button
                        type="button"
                        onClick={() => setCurrentStep((s) => Math.min(3, s + 1))}
                        disabled={(currentStep === 1 && !step1Complete) || (currentStep === 2 && !step2Complete)}
                        className="px-6 py-2 rounded-xl bg-primary text-white font-bold disabled:opacity-40"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={submitPrescriptionRequest}
                        disabled={submitted || !canSubmit}
                        className="px-6 py-2 rounded-xl bg-primary text-white font-bold disabled:opacity-40"
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
                      Where medically appropriate, we can prescribe antihistamine tablets and steroid nasal sprays.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      When completing the questionnaire, list all prescribed and over-the-counter medications to support
                      safe prescribing and avoid potential drug interactions.
                    </p>
                  </li>
                </ul>
              </div>
              <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-black mb-6">What&apos;s excluded with our service</h3>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      This service is not suitable if you have not had a confirmed diagnosis of hay fever or allergic
                      rhinitis by a doctor.
                    </p>
                  </li>
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
                  desc: "If approved, your prescription is sent to an Irish pharmacy of your choice via secure Healthmail.",
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

