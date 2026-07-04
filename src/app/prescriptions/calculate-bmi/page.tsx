"use client";

import React, { useMemo, useState } from "react";
import { beginPrescriptionCheckout } from '@/lib/serviceCheckout';
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";

type UnitMode = "metric" | "imperial";

const getBmiCategory = (bmi: number) => {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Healthy weight";
  if (bmi < 30) return "Overweight";
  return "Obesity";
};

export default function CalculateBmiPage() {
  const [unitMode, setUnitMode] = useState<UnitMode>("metric");
  const [weightKg, setWeightKg] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightStone, setWeightStone] = useState("");
  const [weightPounds, setWeightPounds] = useState("");
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const bmiValue = useMemo(() => {
    if (unitMode === "metric") {
      const kg = Number(weightKg);
      const cm = Number(heightCm);
      if (!kg || !cm || kg <= 0 || cm <= 0) return null;
      const meters = cm / 100;
      return kg / (meters * meters);
    }

    const st = Number(weightStone || 0);
    const lb = Number(weightPounds || 0);
    const ft = Number(heightFeet || 0);
    const inch = Number(heightInches || 0);
    const totalPounds = st * 14 + lb;
    const totalInches = ft * 12 + inch;
    if (!totalPounds || !totalInches || totalPounds <= 0 || totalInches <= 0) return null;
    return (703 * totalPounds) / (totalInches * totalInches);
  }, [unitMode, weightKg, heightCm, weightStone, weightPounds, heightFeet, heightInches]);

  const submitPrescriptionRequest = () => {
    beginPrescriptionCheckout({
      slug: 'calculate-bmi',
      serviceName: 'Calculate Bmi',
      payload: {
      unitMode,
      weightKg,
      heightCm,
      weightStone,
      weightPounds,
      heightFeet,
      heightInches,
      },
    });
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
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h1 className="text-4xl md:text-6xl font-black text-dark-slate dark:text-white leading-tight">
                Find your <span className="text-primary">BMI</span> in 30 seconds
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-6 leading-relaxed">
                Quickly calculate your Body Mass Index to see where you stand. This simple tool helps you understand
                your health and can motivate positive lifestyle changes.
              </p>
              <a
                href="#bmi-calculator"
                className="mt-8 inline-flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black text-lg hover:scale-105 transition-all"
              >
                Calculate your BMI
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>

            <div
              id="bmi-calculator"
              className="rounded-[36px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8"
            >
              <h2 className="text-2xl font-black mb-5">Body Mass Index (BMI) calculator</h2>

              {unitMode === "metric" ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Enter your weight in kg</label>
                    <input
                      type="number"
                      min="1"
                      value={weightKg}
                      onChange={(e) => setWeightKg(e.target.value)}
                      placeholder="e.g. 65"
                      className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60"
                    />
                  </div>
                  <button className="text-primary text-sm font-bold underline underline-offset-4" onClick={() => setUnitMode("imperial")}>
                    Switch to stone and pounds
                  </button>
                  <div>
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Enter your height in cm</label>
                    <input
                      type="number"
                      min="1"
                      value={heightCm}
                      onChange={(e) => setHeightCm(e.target.value)}
                      placeholder="e.g. 170"
                      className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60"
                    />
                  </div>
                  <button className="w-full mt-2 px-6 py-3 bg-primary text-white rounded-xl font-bold" onClick={submitPrescriptionRequest}>
                    Calculate your BMI
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Weight (st)</label>
                      <input
                        type="number"
                        min="0"
                        value={weightStone}
                        onChange={(e) => setWeightStone(e.target.value)}
                        className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Weight (lb)</label>
                      <input
                        type="number"
                        min="0"
                        value={weightPounds}
                        onChange={(e) => setWeightPounds(e.target.value)}
                        className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60"
                      />
                    </div>
                  </div>
                  <button className="text-primary text-sm font-bold underline underline-offset-4" onClick={() => setUnitMode("metric")}>
                    Switch to kg and cm
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Height (ft)</label>
                      <input
                        type="number"
                        min="0"
                        value={heightFeet}
                        onChange={(e) => setHeightFeet(e.target.value)}
                        className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Height (in)</label>
                      <input
                        type="number"
                        min="0"
                        value={heightInches}
                        onChange={(e) => setHeightInches(e.target.value)}
                        className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60"
                      />
                    </div>
                  </div>
                  <button className="w-full mt-2 px-6 py-3 bg-primary text-white rounded-xl font-bold" onClick={submitPrescriptionRequest}>
                    Calculate your BMI
                  </button>
                </div>
              )}

              {submitted && (
                <div className="mt-5 p-4 rounded-2xl bg-primary/10 border border-primary/20">
                  {bmiValue ? (
                    <>
                      <p className="text-sm font-bold text-primary">Your BMI result</p>
                      <p className="text-3xl font-black mt-1">{bmiValue.toFixed(1)}</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{getBmiCategory(bmiValue)}</p>
                    </>
                  ) : (
                    <p className="text-sm text-slate-700 dark:text-slate-300">Please enter valid values to calculate BMI.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-center">Welcome to Webdoctor BMI calculator</h2>
            <p className="text-slate-600 dark:text-slate-400 text-center mt-4 max-w-4xl mx-auto">
              Quickly calculate your Body Mass Index (BMI) to see where you stand. Our personalised weight management
              services can guide your weight-loss journey with Irish-registered doctors and prescription-based options.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-center">Treatments That We Can Provide</h2>
            <div className="grid lg:grid-cols-3 gap-6 mt-10">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="text-2xl font-black">Self-Injectable Weight Management Treatment</p>
                <p className="text-primary font-bold mt-2">Starting from EUR50</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
                  Request a self-injectable prescription online. If suitable, prescriptions are sent directly to your
                  chosen pharmacy, often within the same day.
                </p>
                <Link href="/prescriptions/self-injectable" className="mt-6 inline-flex items-center gap-2 font-bold text-primary">
                  Request Treatment <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="text-2xl font-black">Weight Management Consultation</p>
                <p className="text-primary font-bold mt-2">Starting from EUR55</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
                  Book a specialist GP consultation to review your health, discuss options, and choose a safe and
                  effective plan for your goals.
                </p>
                <Link
                  href="/prescriptions/weight-management-consultation"
                  className="mt-6 inline-flex items-center gap-2 font-bold text-primary"
                >
                  Book Consultation <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="text-2xl font-black">Diet & Nutrition: Dietitian Consultation</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
                  Speak with an Irish-registered dietitian for personalised nutrition advice and sustainable lifestyle
                  changes.
                </p>
                <Link href="/contact" className="mt-6 inline-flex items-center gap-2 font-bold text-primary">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
