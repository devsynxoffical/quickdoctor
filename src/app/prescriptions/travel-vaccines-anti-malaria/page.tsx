"use client";

import React, { useState } from "react";
import { beginPrescriptionCheckout } from '@/lib/serviceCheckout';
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2, ChevronDown, Clock, ShieldCheck, Users } from "lucide-react";
import PharmacyPicker from "@/components/PharmacyPicker";
import { resolvePharmacyDisplay } from "@/lib/pharmacies";

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

export default function TravelVaccinesAntiMalariaPage() {
  const submitPrescriptionRequest = () => {
    beginPrescriptionCheckout({
      slug: 'travel-vaccines-anti-malaria',
      serviceName: 'Travel Vaccines Anti Malaria',
      payload: {
      requestFor,
      departureWindow,
      age,
      birthSex,
      pregnant,
      breastfeeding,
      bleedingDisorder,
      immunocompromised,
      warfarin,
      anaphylaxis,
      yellowFever,
      malariaPastYear,
      acknowledge,
      destinationRegion,
      tripDuration,
      departureMonth,
      ruralTravel,
      outdoorActivity,
      nightExposure,
      vaccineRecord,
      ongoingIllness,
      regularMedication,
      allergies,
      preferredPharmacy,
      contactNumber,
      consentDoctorReview,
      confirmAccuracy,
      },
    });
  };

  const commonVaccines = [
    "Cholera (oral)",
    "Diphtheria",
    "Hepatitis A",
    "Hepatitis B",
    "Japanese Encephalitis",
    "Meningitis ACWY",
    "Polio",
    "Rabies",
    "Tetanus",
    "Tick Borne Encephalitis",
    "Typhoid",
  ];
  const regions = [
    {
      name: "Africa",
      core: ["Tetanus", "Hepatitis A", "Typhoid"],
      additional: ["Diphtheria", "Cholera", "Meningitis", "Rabies"],
    },
    {
      name: "Central/South America & Caribbean",
      core: ["Tetanus", "Hepatitis A", "Typhoid"],
      additional: ["Polio", "Hepatitis B", "Meningitis", "Rabies"],
    },
    {
      name: "Central/South Asia",
      core: ["Tetanus", "Hepatitis A", "Typhoid"],
      additional: ["Polio", "Diphtheria", "Hepatitis B", "Japanese Encephalitis", "Rabies", "Cholera"],
    },
    {
      name: "South-East Asia",
      core: ["Tetanus", "Hepatitis A", "Typhoid"],
      additional: ["Polio", "Diphtheria", "Hepatitis B", "Japanese Encephalitis", "Rabies"],
    },
  ];
  const pricingRows = [
    { vaccine: "Cholera (oral)", price: "EUR70", doses: "2" },
    { vaccine: "Diphtheria, Tetanus & Polio (combined)", price: "EUR43", doses: "1*" },
    { vaccine: "Hepatitis A", price: "EUR54", doses: "1**" },
    { vaccine: "Hepatitis B", price: "EUR44", doses: "3" },
    { vaccine: "Hepatitis A + Hepatitis B (combined)", price: "EUR67", doses: "1**" },
    { vaccine: "Hepatitis A + Typhoid (combined)", price: "EUR74", doses: "1**" },
    { vaccine: "Japanese Encephalitis", price: "EUR153", doses: "2" },
    { vaccine: "Rabies", price: "EUR75", doses: "3" },
    { vaccine: "Tick Borne Encephalitis", price: "EUR76", doses: "2 / 3***" },
    { vaccine: "Typhoid", price: "EUR40", doses: "1" },
    { vaccine: "Meningitis ACWY", price: "EUR69", doses: "1" },
  ];
  const faqItems = [
    {
      question: "Who is this service suitable for?",
      answer: "This service is suitable for adults in Ireland who need travel vaccine and/or anti-malaria advice and can complete the online medical assessment truthfully.",
    },
    {
      question: "Who is this service not suitable for?",
      answer: "It may be unsuitable for children, pregnancy-related risk groups, or people with certain medical risks identified in the questionnaire. In those cases, a GP or travel clinic is advised.",
    },
    {
      question: "What Travel Vaccines do I Need?",
      answer: "Vaccine recommendations depend on your destination, trip length, planned activities, medical history, and prior vaccinations.",
    },
    {
      question: "Where can I have my travel vaccine administered?",
      answer: "If approved, your prescription is sent to your chosen participating pharmacy where vaccine administration is arranged.",
    },
    {
      question: "Where can I find out more about travel vaccinations and travel health advice?",
      answer: "Use trusted public-health travel resources and official country guidance, then confirm your personal plan through medical review.",
    },
    {
      question: "How long before travel do I need to get my travel vaccinations?",
      answer: "Ideally several weeks before travel. If you are travelling in under 4 weeks, you should seek urgent GP/travel-clinic advice.",
    },
    {
      question: "Why do I need travel vaccinations?",
      answer: "They reduce your risk of serious travel-related infections that may be uncommon in Ireland.",
    },
    {
      question: "What vaccines do I need to travel to Thailand and Southeast Asia?",
      answer: "Common recommendations can include tetanus, hepatitis A, and typhoid, with extras based on risk and itinerary.",
    },
    {
      question: "Can Webdoctor.ie prescribe a vaccine for Yellow Fever?",
      answer: "No. Yellow fever vaccination requires attendance at a specialist yellow-fever centre or suitable local clinic.",
    },
    {
      question: "What do you need to provide Webdoctor.ie with to make our assessment?",
      answer: "You should provide accurate medical history, travel plans, medication details, and vaccine history to allow safe prescribing.",
    },
    {
      question: "What are the potential side effects of travel vaccines?",
      answer: "Most side effects are mild, such as injection-site soreness, headache, or mild fever. Serious reactions are uncommon.",
    },
    {
      question: "What anti-malaria treatments do you prescribe?",
      answer: "Where appropriate, this service can prescribe anti-malaria oral treatments such as doxycycline or malarone after review.",
    },
    {
      question: "How long do you need to take anti-malaria medication?",
      answer: "Timing varies by treatment and itinerary, and usually includes doses before travel, during travel, and after return.",
    },
    {
      question: "What are mosquito avoidance measures?",
      answer: "Use repellent, protective clothing, bed nets, and practical bite-prevention steps, especially in higher-risk regions.",
    },
    {
      question: "What are the important facts about malaria and travelling?",
      answer: "Malaria can be severe or fatal. Prevention combines medication plus bite-avoidance, and fever after travel needs urgent medical review.",
    },
    {
      question: "Can I use this service if I am pregnant or breastfeeding?",
      answer: "This service may not be suitable in pregnancy or breastfeeding and specialist travel-medicine advice is usually recommended.",
    },
    {
      question: "What will happen when I attend the pharmacy for my vaccinations?",
      answer: "Your identity and prescription details are checked, the pharmacist confirms safety, and vaccines are administered per pharmacy protocol.",
    },
  ];
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [requestFor, setRequestFor] = useState("");
  const [departureWindow, setDepartureWindow] = useState("");
  const [age, setAge] = useState("");
  const [birthSex, setBirthSex] = useState("");
  const [pregnant, setPregnant] = useState("");
  const [breastfeeding, setBreastfeeding] = useState("");
  const [bleedingDisorder, setBleedingDisorder] = useState("");
  const [immunocompromised, setImmunocompromised] = useState("");
  const [warfarin, setWarfarin] = useState("");
  const [anaphylaxis, setAnaphylaxis] = useState("");
  const [yellowFever, setYellowFever] = useState("");
  const [malariaPastYear, setMalariaPastYear] = useState("");
  const [acknowledge, setAcknowledge] = useState(false);
  const [destinationRegion, setDestinationRegion] = useState("");
  const [tripDuration, setTripDuration] = useState("");
  const [departureMonth, setDepartureMonth] = useState("");
  const [ruralTravel, setRuralTravel] = useState("");
  const [outdoorActivity, setOutdoorActivity] = useState("");
  const [nightExposure, setNightExposure] = useState("");
  const [vaccineRecord, setVaccineRecord] = useState("");
  const [ongoingIllness, setOngoingIllness] = useState("");
  const [regularMedication, setRegularMedication] = useState("");
  const [allergies, setAllergies] = useState("");
  const [preferredPharmacyId, setPreferredPharmacyId] = useState("");
  const [customPharmacy, setCustomPharmacy] = useState("");
  const preferredPharmacy = resolvePharmacyDisplay(preferredPharmacyId, customPharmacy);
  const [contactNumber, setContactNumber] = useState("");
  const [consentDoctorReview, setConsentDoctorReview] = useState(false);
  const [confirmAccuracy, setConfirmAccuracy] = useState(false);

  const selectClass = (selected: boolean) =>
    `px-4 py-2 rounded-lg border text-sm font-bold transition-colors ${
      selected
        ? "bg-primary text-white border-primary"
        : "border-slate-300 text-slate-700 dark:text-slate-300 dark:border-slate-700 hover:border-primary"
    }`;
  const showRequestNotice = requestFor === "Another adult" || requestFor === "My child";
  const isFemale = birthSex === "Female";
  const departureNumber = showRequestNotice ? 3 : 2;
  const ageNumber = departureNumber + 1;
  const birthSexNumber = ageNumber + 1;
  const pregnantNumber = birthSexNumber + 1;
  const breastfeedingNumber = pregnantNumber + 1;
  const bleedingDisorderNumber = birthSexNumber + (isFemale ? 3 : 1);
  const immunocompromisedNumber = bleedingDisorderNumber + 1;
  const warfarinNumber = immunocompromisedNumber + 1;
  const anaphylaxisNumber = warfarinNumber + 1;
  const yellowFeverNumber = anaphylaxisNumber + 1;
  const malariaPastYearNumber = yellowFeverNumber + 1;
  const acknowledgeNumber = malariaPastYearNumber + 1;
  const stepTitle = {
    1: "Suitability Check",
    2: "Travel Details",
    3: "Risk Assessment",
    4: "Medical History",
    5: "Pharmacy Details",
    6: "Review & Submit",
  }[currentStep];

  const step1Complete =
    requestFor &&
    departureWindow &&
    age &&
    birthSex &&
    bleedingDisorder &&
    immunocompromised &&
    warfarin &&
    anaphylaxis &&
    yellowFever &&
    malariaPastYear &&
    acknowledge &&
    (isFemale ? pregnant && breastfeeding : true);
  const step2Complete = Boolean(destinationRegion && tripDuration && departureMonth);
  const step3Complete = Boolean(ruralTravel && outdoorActivity && nightExposure);
  const step4Complete = Boolean(vaccineRecord && ongoingIllness && regularMedication && allergies);
  const step5Complete = Boolean(preferredPharmacy && contactNumber);
  const canGoNext =
    (currentStep === 1 && step1Complete) ||
    (currentStep === 2 && step2Complete) ||
    (currentStep === 3 && step3Complete) ||
    (currentStep === 4 && step4Complete) ||
    (currentStep === 5 && step5Complete);

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
                Travel Vaccines & <span className="text-primary">Anti-Malaria Tablets</span>
              </h1>
              <ul className="mt-6 space-y-3">
                {[
                  "Reviewed by Irish-registered doctors.",
                  "Travel vaccinations and anti-malaria tablets available.",
                  "Tailored to your destination and travel plans.",
                  "Simple online questionnaire - no appointment required.",
                  "From EUR50, available nationwide.",
                  "Same-day review - prescriptions sent to your local pharmacy for easy pickup.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 mt-0.5 text-green-600 shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[36px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8">
              <h3 className="text-2xl font-black mb-5">Request Treatment</h3>
              <div className="p-4 rounded-2xl border bg-primary text-white border-primary">
                <p className="font-black">From</p>
                <p className="text-3xl font-black mt-1">EUR50</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(1);
                  document.getElementById("travel-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="w-full mt-6 px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2"
              >
                Request Prescription - EUR50 <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-center">Why You Need Travel Vaccinations and/or Anti-Malaria Tablets</h2>
            <div className="max-w-5xl mx-auto mt-8 space-y-5 text-slate-700 dark:text-slate-300">
              <p>If you are planning to visit certain parts of the world, you may need vaccinations and/or anti-malaria tablets before you travel.</p>
              <p>Malaria is a potentially fatal infection. While prophylactic medication is not 100% effective, combining it with mosquito bite prevention can provide over 90% protection.</p>
              <p>Vaccinations can prevent serious diseases not commonly seen in Ireland. Depending on your destination and circumstances, additional vaccines may be appropriate beyond routine childhood immunisations.</p>
              <p>If you feel unwell after returning to Ireland, especially with fever/high temperature, contact a doctor promptly.</p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-center">Webdoctor.ie&apos;s Travel Health Service</h2>
            <div className="grid lg:grid-cols-2 gap-8 mt-10">
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-black mb-4">Travel Vaccines</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  After your online Travel Health Assessment, our doctors review your details and recommend suitable vaccines.
                  If accepted, your prescription is sent to a participating pharmacy of your choice by the next working day.
                  Vaccination administration is arranged with the pharmacy, and payment for vaccines is made directly to the pharmacy.
                </p>
              </div>
              <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="text-2xl font-black mb-4">Anti-Malaria Tablets</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Malaria is spread by mosquito bites in tropical and subtropical regions. There is no vaccine for malaria
                  prevention, so prophylactic medication plus mosquito avoidance measures are key for protection.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-3">
                  This combination can provide up to 90% protection against malaria.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-center">Common Travel Vaccines</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
              {commonVaccines.map((vaccine) => (
                <div key={vaccine} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-semibold">
                  {vaccine}
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-2xl bg-primary/10 border border-primary/20 text-sm font-bold text-primary">
              Common Anti-Malaria Treatments: Oral anti-malaria tablets.
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-center">Popular Travel Destinations - Vaccines You May Need</h2>
            <p className="text-center text-slate-500 mt-3 max-w-3xl mx-auto">This is a general guide only. Recommendations vary by individual risk and itinerary.</p>
            <div className="grid md:grid-cols-2 gap-6 mt-10">
              {regions.map((region) => (
                <div key={region.name} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <h3 className="text-xl font-black">{region.name}</h3>
                  <p className="text-sm font-bold text-primary mt-4">For most travellers:</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    {region.core.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                  <p className="text-sm font-bold text-primary mt-4">May also be considered:</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    {region.additional.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                  <p className="text-sm font-bold text-primary mt-4">We may also recommend:</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">- Anti-Malaria Tablets</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-center">How Much Do Vaccines Typically Cost?</h2>
            <p className="text-center text-slate-500 mt-3 max-w-3xl mx-auto">Approximate guide only. Prices may vary between pharmacies.</p>
            <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 dark:bg-slate-900">
                  <tr>
                    <th className="text-left p-4 font-black">Vaccination Name</th>
                    <th className="text-left p-4 font-black">Price Per Dose (approx.)</th>
                    <th className="text-left p-4 font-black">Usual No. of Doses</th>
                  </tr>
                </thead>
                <tbody>
                  {pricingRows.map((row) => (
                    <tr key={row.vaccine} className="border-t border-slate-200 dark:border-slate-800">
                      <td className="p-4">{row.vaccine}</td>
                      <td className="p-4">{row.price}</td>
                      <td className="p-4">{row.doses}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 space-y-2 text-xs text-slate-500">
              <p>* If primary DTP course was completed in childhood, a booster may be sufficient. If not, additional doses may be required.</p>
              <p>** Primary course, excludes booster.</p>
              <p>*** Dosage regime depends on travel dates and clinical advice.</p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-black text-center">Find a pharmacy near you</h2>
            <p className="text-slate-500 text-center mt-3">Enter your town, Dublin postal code, or first 3 characters of your Eircode.</p>
            <div className="mt-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row gap-3">
              <input type="text" placeholder="Search by town, postal code or Eircode" className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" />
              <button className="px-6 py-3 rounded-xl bg-primary text-white font-bold">Search</button>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-black text-center">Important Medical Information</h2>
            <div className="mt-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 px-6">
              {faqItems.map((item) => (
                <AccordionItem key={item.question} question={item.question} answer={item.answer} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-dark-slate text-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-center">How it works</h2>
            <p className="text-slate-300 text-center mt-3 max-w-2xl mx-auto">Requesting a prescription online could not be easier with Webdoctor.ie.</p>
            <div className="grid md:grid-cols-3 gap-6 mt-10">
              {[
                { step: "Step 1", icon: CheckCircle2, title: "Online Questionnaire", desc: "Complete a secure questionnaire and answer all questions accurately." },
                { step: "Step 2", icon: Clock, title: "Medical Review", desc: "An Irish-registered doctor reviews your information using clinical standards." },
                { step: "Step 3", icon: ArrowRight, title: "Prescription Sent", desc: "If approved, your prescription is sent within minutes to your chosen pharmacy." },
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

        <section id="travel-form" className="pt-28 pb-16">
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
                      Please answer honestly. Any and all information that you provide in this questionnaire is protected by the
                      exact same patient-doctor confidentiality you would expect when seeing a doctor face to face. We need to
                      make sure we are providing safe and appropriate travel advice for you. Unfortunately, this service is not suitable
                      for all patients.
                    </p>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">1. Who are you requesting this prescription for?</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        Please note: if this prescription is approved, it will be issued in the name of this account owner, and
                        include their personal details. Photographic ID is required to complete this questionnaire and will be
                        required when you attend for your vaccination appointment. These details will be checked and verified by
                        the pharmacist before your vaccination can be administered.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <button type="button" onClick={() => setRequestFor("Myself")} className={selectClass(requestFor === "Myself")}>Myself</button>
                        <button type="button" onClick={() => setRequestFor("Another adult")} className={selectClass(requestFor === "Another adult")}>Another adult</button>
                        <button type="button" onClick={() => setRequestFor("My child")} className={selectClass(requestFor === "My child")}>My child</button>
                      </div>
                    </div>

                    {requestFor === "Another adult" && (
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        2. If another adult requires advice on travel medicine they will need to make a request using their own
                        personal account.
                      </p>
                    )}

                    {requestFor === "My child" && (
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        2. This travel medicine service is only available to those who are 17 years of age and over. If your child
                        is under 17 years, please contact your local GP or travel medicine clinic for a consultation.
                      </p>
                    )}

                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">
                        {departureNumber}. How long is it to your planned date of departure?
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        If it is less than 4 weeks to your planned date of departure, please seek advice and assessment with your
                        local GP or travel clinic.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <button type="button" onClick={() => setDepartureWindow("Less than 4 weeks")} className={selectClass(departureWindow === "Less than 4 weeks")}>Less than 4 weeks</button>
                        <button type="button" onClick={() => setDepartureWindow("4 weeks or more")} className={selectClass(departureWindow === "4 weeks or more")}>4 weeks or more</button>
                      </div>
                    </div>

                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">{ageNumber}. What age are you?</p>
                      <input
                        value={age}
                        onChange={(e) => setAge(e.target.value.replace(/\D/g, ""))}
                        placeholder="Enter age"
                        className="mt-3 w-full max-w-60 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
                      />
                    </div>

                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">{birthSexNumber}. What is your birth sex?</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <button type="button" onClick={() => setBirthSex("Female")} className={selectClass(birthSex === "Female")}>Female</button>
                        <button type="button" onClick={() => setBirthSex("Male")} className={selectClass(birthSex === "Male")}>Male</button>
                      </div>
                    </div>

                    {isFemale && (
                      <div>
                        <p className="font-bold text-dark-slate dark:text-white">{pregnantNumber}. Are you pregnant or possibly pregnant?</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                          This service is not suitable for you if you are pregnant/ possibly pregnant. We would advise that you seek
                          advice from a specialist travel medicine clinic.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-3">
                          <button type="button" onClick={() => setPregnant("Yes")} className={selectClass(pregnant === "Yes")}>Yes</button>
                          <button type="button" onClick={() => setPregnant("No")} className={selectClass(pregnant === "No")}>No</button>
                        </div>
                      </div>
                    )}

                    {isFemale && (
                      <div>
                        <p className="font-bold text-dark-slate dark:text-white">{breastfeedingNumber}. Are you breastfeeding?</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                          This service is not suitable if you are breast feeding as it is important you and your child are assessed
                          together. We would advise that you seek advice from a specialist travel medicine clinic.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-3">
                          <button type="button" onClick={() => setBreastfeeding("Yes")} className={selectClass(breastfeeding === "Yes")}>Yes</button>
                          <button type="button" onClick={() => setBreastfeeding("No")} className={selectClass(breastfeeding === "No")}>No</button>
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">{bleedingDisorderNumber}. Do you have a bleeding disorder?</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        This service is not suitable if you have a bleeding disorder.
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        If you are not sure about this, send us a message. Below are some examples:
                      </p>
                      <ul className="text-sm text-slate-600 dark:text-slate-400 mt-2 space-y-1">
                        <li>- Haemophilia</li>
                        <li>- Von Willebrand disease</li>
                        <li>- Factor V / VII / X deficiencies</li>
                        <li>- Idiopathic thrombocytopenic purpura (ITP)</li>
                      </ul>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <button type="button" onClick={() => setBleedingDisorder("Yes, I do")} className={selectClass(bleedingDisorder === "Yes, I do")}>Yes, I do</button>
                        <button type="button" onClick={() => setBleedingDisorder("No, I don't")} className={selectClass(bleedingDisorder === "No, I don't")}>No, I don't</button>
                      </div>
                    </div>

                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">
                        {immunocompromisedNumber}. Are you immunocompromised (weak immune system)?
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        Some medical conditions and treatments can weaken your immune system and you can become immunocompromised.
                        Examples include:
                      </p>
                      <ul className="text-sm text-slate-600 dark:text-slate-400 mt-2 space-y-1">
                        <li>- Cancer</li>
                        <li>- HIV / AIDS</li>
                        <li>- Spleen removed</li>
                        <li>- Receiving chemotherapy / radiotherapy</li>
                        <li>- Organ transplant</li>
                        <li>- Autoimmune conditions</li>
                        <li>- Taking medications that suppress your immune system</li>
                      </ul>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        If you are not sure if this applies to you or you have a question please send us a message.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <button type="button" onClick={() => setImmunocompromised("Yes")} className={selectClass(immunocompromised === "Yes")}>Yes</button>
                        <button type="button" onClick={() => setImmunocompromised("No")} className={selectClass(immunocompromised === "No")}>No</button>
                      </div>
                    </div>

                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">{warfarinNumber}. Are you taking warfarin medication?</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        Please note if you are taking warfarin medication you are not suitable for this service. You should speak
                        with your local GP or travel health clinic.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <button type="button" onClick={() => setWarfarin("Yes")} className={selectClass(warfarin === "Yes")}>Yes</button>
                        <button type="button" onClick={() => setWarfarin("No")} className={selectClass(warfarin === "No")}>No</button>
                      </div>
                    </div>

                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">
                        {anaphylaxisNumber}. Have you had an anaphylactic reaction to ANY previous vaccination?
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        Anaphylaxis is a severe potentially life threatening allergic reaction that starts rapidly. It is a medical
                        emergency. This service is not suitable if you have had an anaphylactic reaction to any previous vaccination.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <button type="button" onClick={() => setAnaphylaxis("Yes")} className={selectClass(anaphylaxis === "Yes")}>Yes</button>
                        <button type="button" onClick={() => setAnaphylaxis("No")} className={selectClass(anaphylaxis === "No")}>No</button>
                      </div>
                    </div>

                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">
                        {yellowFeverNumber}. Do you require a vaccination for yellow fever?
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        Please note, we are not able to provide prescriptions for yellow fever via this service. You will need to
                        attend your local GP or travel health clinic for this.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <button type="button" onClick={() => setYellowFever("Yes")} className={selectClass(yellowFever === "Yes")}>Yes</button>
                        <button type="button" onClick={() => setYellowFever("No")} className={selectClass(yellowFever === "No")}>No</button>
                      </div>
                    </div>

                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">{malariaPastYearNumber}. Have you had malaria in the past year?</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <button type="button" onClick={() => setMalariaPastYear("Yes")} className={selectClass(malariaPastYear === "Yes")}>Yes</button>
                        <button type="button" onClick={() => setMalariaPastYear("No")} className={selectClass(malariaPastYear === "No")}>No</button>
                      </div>
                    </div>

                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">
                        {acknowledgeNumber}. Please be advised if anti-malaria treatment is required we can only prescribe doxycycline or malarone.
                      </p>
                      <div className="mt-3">
                        <button type="button" onClick={() => setAcknowledge((prev) => !prev)} className={selectClass(acknowledge)}>
                          ACKNOWLEDGE
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">1. Which region best describes your destination?</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {["Africa", "Asia", "South America", "Multiple regions"].map((option) => (
                          <button key={option} type="button" onClick={() => setDestinationRegion(option)} className={selectClass(destinationRegion === option)}>{option}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">2. How long is your trip?</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {["Less than 1 week", "1-4 weeks", "More than 4 weeks"].map((option) => (
                          <button key={option} type="button" onClick={() => setTripDuration(option)} className={selectClass(tripDuration === option)}>{option}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">3. What month are you planning to depart?</p>
                      <input
                        value={departureMonth}
                        onChange={(e) => setDepartureMonth(e.target.value)}
                        placeholder="e.g. July 2026"
                        className="mt-3 w-full max-w-80 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
                      />
                    </div>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">1. Will you spend time in rural or jungle areas?</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {["Yes", "No"].map((option) => (
                          <button key={option} type="button" onClick={() => setRuralTravel(option)} className={selectClass(ruralTravel === option)}>{option}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">2. Will you have significant outdoor activity (trekking/camping)?</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {["Yes", "No"].map((option) => (
                          <button key={option} type="button" onClick={() => setOutdoorActivity(option)} className={selectClass(outdoorActivity === option)}>{option}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">3. Will you be exposed to mosquitoes at night?</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {["Yes", "No", "Not sure"].map((option) => (
                          <button key={option} type="button" onClick={() => setNightExposure(option)} className={selectClass(nightExposure === option)}>{option}</button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 4 && (
                  <>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">1. Do you have an up-to-date vaccination record?</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {["Yes", "No", "Not sure"].map((option) => (
                          <button key={option} type="button" onClick={() => setVaccineRecord(option)} className={selectClass(vaccineRecord === option)}>{option}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">2. Do you have any ongoing medical illness under treatment?</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {["Yes", "No"].map((option) => (
                          <button key={option} type="button" onClick={() => setOngoingIllness(option)} className={selectClass(ongoingIllness === option)}>{option}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">3. Are you taking regular medication not already listed?</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {["Yes", "No"].map((option) => (
                          <button key={option} type="button" onClick={() => setRegularMedication(option)} className={selectClass(regularMedication === option)}>{option}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">4. Do you have any significant medicine or food allergies?</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {["Yes", "No"].map((option) => (
                          <button key={option} type="button" onClick={() => setAllergies(option)} className={selectClass(allergies === option)}>{option}</button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 5 && (
                  <>
                    <PharmacyPicker
                      value={preferredPharmacyId}
                      onChange={setPreferredPharmacyId}
                      customName={customPharmacy}
                      onCustomNameChange={setCustomPharmacy}
                      required
                      label="Preferred pharmacy"
                      className="max-w-[28rem] [&_select]:rounded-lg [&_select]:border [&_select]:border-slate-300 [&_select]:bg-transparent [&_input]:rounded-lg [&_input]:border [&_input]:border-slate-300 [&_input]:bg-transparent"
                    />
                    <div>
                      <p className="font-bold text-dark-slate dark:text-white">2. Contact number for pharmacy follow-up</p>
                      <input
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        placeholder="Phone number"
                        className="mt-3 w-full max-w-80 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent"
                      />
                    </div>
                  </>
                )}

                {currentStep === 6 && (
                  <>
                    {submitted ? (
                      <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6">
                        <p className="font-black text-emerald-900 text-2xl">Request submitted</p>
                        <p className="mt-2 text-sm text-emerald-900">
                          Your travel health assessment has been sent for doctor review. You will be updated in your account once reviewed.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="rounded-2xl border border-slate-200 p-5">
                          <p className="font-black text-dark-slate dark:text-white">Review your details</p>
                          <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
                            <p><span className="font-bold">Request for:</span> {requestFor || "-"}</p>
                            <p><span className="font-bold">Departure timeline:</span> {departureWindow || "-"}</p>
                            <p><span className="font-bold">Age:</span> {age || "-"}</p>
                            <p><span className="font-bold">Birth sex:</span> {birthSex || "-"}</p>
                            <p><span className="font-bold">Destination:</span> {destinationRegion || "-"}</p>
                            <p><span className="font-bold">Trip duration:</span> {tripDuration || "-"}</p>
                            <p><span className="font-bold">Warfarin:</span> {warfarin || "-"}</p>
                            <p><span className="font-bold">Anaphylaxis history:</span> {anaphylaxis || "-"}</p>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 p-5">
                          <p className="font-bold text-dark-slate dark:text-white">Final confirmations</p>
                          <div className="mt-3 flex flex-col gap-3">
                            <button type="button" onClick={() => setConsentDoctorReview((v) => !v)} className={selectClass(consentDoctorReview)}>
                              I consent to doctor review of this questionnaire.
                            </button>
                            <button type="button" onClick={() => setConfirmAccuracy((v) => !v)} className={selectClass(confirmAccuracy)}>
                              I confirm all information is accurate and complete.
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
                      disabled={submitted || !consentDoctorReview || !confirmAccuracy}
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
      </main>

      <Footer />
    </div>
  );
}
