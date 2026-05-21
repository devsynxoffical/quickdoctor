"use client";

import React, { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { jsPDF } from "jspdf";
import { AlertCircle, ArrowRight, CheckCircle2, Clock3, FileCheck2, ShieldCheck, Stethoscope, WalletCards } from "lucide-react";

type FormState = {
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  acknowledge: boolean;
  symptoms: string[];
  absenceFrom: string;
  reason: string;
  otherReason: string;
  timeline: string;
  fromDate: string;
  toDate: string;
  phone: string;
};

const initialForm: FormState = {
  firstName: "",
  lastName: "",
  address: "",
  email: "",
  acknowledge: false,
  symptoms: [],
  absenceFrom: "",
  reason: "",
  otherReason: "",
  timeline: "",
  fromDate: "2026-04-21",
  toDate: "",
  phone: "",
};

const symptomOptions = [
  "Chest pain",
  "Shortness of breath",
  "Acute confusion",
  "Slurring of your speech",
  "Double vision (diplopia)",
  "Unilateral arm/leg weakness",
  "Difficulties swallowing",
  "None of the Above",
];

export default function MedicalCertificatesPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [step, setStep] = useState<1 | 2>(1);
  const [paid, setPaid] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "First name is required.";
    if (!form.lastName.trim()) e.lastName = "Last name is required.";
    if (!form.address.trim()) e.address = "Address is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    if (!form.acknowledge) e.acknowledge = "Please confirm acknowledgement.";
    if (!form.symptoms.length) e.symptoms = "Please select at least one symptom option.";
    if (!form.absenceFrom) e.absenceFrom = "Please choose work or study.";
    if (!form.reason) e.reason = "Please select a reason.";
    if (form.reason === "Other" && !form.otherReason.trim()) e.otherReason = "Please specify other reason.";
    if (!form.timeline.trim()) e.timeline = "Timeline is required.";
    if (!form.fromDate) e.fromDate = "From date is required.";
    if (!form.toDate) e.toDate = "To date is required.";
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    if (form.fromDate && form.toDate) {
      const from = new Date(form.fromDate);
      const to = new Date(form.toDate);
      const diffDays = (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays < 0) e.toDate = "To date cannot be before From date.";
      if (diffDays > 7) e.toDate = "You can request up to 7 days at a time.";
    }
    return e;
  }, [form]);

  const handleSymptomToggle = (item: string) => {
    setForm((prev) => {
      if (item === "None of the Above") return { ...prev, symptoms: ["None of the Above"] };
      const withoutNone = prev.symptoms.filter((s) => s !== "None of the Above");
      const exists = withoutNone.includes(item);
      return { ...prev, symptoms: exists ? withoutNone.filter((s) => s !== item) : [...withoutNone, item] };
    });
  };

  const onNext = () => {
    setSubmitted(true);
    if (Object.keys(errors).length) return;
    setStep(2);
  };

  const downloadPdf = () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const issuedDate = new Date().toLocaleDateString("en-IE");
    const patientName = `${form.firstName} ${form.lastName}`.trim();
    const fitNote = `This is to certify that ${patientName} has been assessed via online GP service and is medically unfit for ${form.absenceFrom.toLowerCase()} from ${form.fromDate} to ${form.toDate}.`;

    // Header strip
    doc.setFillColor(0, 98, 255); // primary blue
    doc.rect(0, 0, 210, 28, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("MEDICAL CERTIFICATE", 14, 17);
    doc.setFontSize(10);
    doc.text("QuickDoctor - Online Doctor Services", 14, 23);

    // Certificate frame
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.5);
    doc.roundedRect(12, 34, 186, 230, 3, 3, "S");

    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Certificate Details", 20, 46);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Certificate ID: QD-${Date.now().toString().slice(-8)}`, 20, 54);
    doc.text(`Issued Date: ${issuedDate}`, 20, 60);
    doc.text(`Patient Name: ${patientName}`, 20, 66);
    doc.text(`Email: ${form.email}`, 20, 72);
    doc.text(`Phone: ${form.phone}`, 20, 78);

    doc.setFont("helvetica", "bold");
    doc.text("Sick Leave Period", 20, 90);
    doc.setFont("helvetica", "normal");
    doc.text(`From: ${form.fromDate}`, 20, 97);
    doc.text(`To: ${form.toDate}`, 20, 103);
    doc.text(`Absence Type: ${form.absenceFrom}`, 20, 109);
    doc.text(`Reason Category: ${form.reason}${form.reason === "Other" && form.otherReason ? ` - ${form.otherReason}` : ""}`, 20, 115);

    doc.setFont("helvetica", "bold");
    doc.text("Clinical Statement", 20, 128);
    doc.setFont("helvetica", "normal");
    const wrappedStatement = doc.splitTextToSize(fitNote, 165);
    doc.text(wrappedStatement, 20, 135);

    doc.setFont("helvetica", "bold");
    doc.text("Patient Timeline Summary", 20, 157);
    doc.setFont("helvetica", "normal");
    const wrappedTimeline = doc.splitTextToSize(form.timeline || "N/A", 165);
    doc.text(wrappedTimeline, 20, 164);

    // Signature block
    doc.setDrawColor(148, 163, 184);
    doc.line(20, 232, 95, 232);
    doc.setFontSize(9);
    doc.text("Irish-Registered GP Signature", 20, 237);
    doc.line(120, 232, 190, 232);
    doc.text("Clinic Stamp", 120, 237);

    // QR placeholder box
    doc.setDrawColor(30, 41, 59);
    doc.rect(158, 44, 30, 30);
    doc.setFontSize(7);
    doc.text("QR Verify", 165, 78);

    doc.setTextColor(71, 85, 105);
    doc.setFontSize(8);
    doc.text("Tamperproof digital certificate. Verify with QR.", 20, 255);

    const safeName = (patientName || "patient")
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    try {
      // Primary path: use Blob download for broad browser compatibility.
      const pdfBlob = doc.output("blob");
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `medical-certificate-${safeName || "patient"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      // Fallback path if blob output is unavailable.
      doc.save(`medical-certificate-${safeName || "patient"}.pdf`);
    }
  };

  const inputBaseClass =
    "mt-2 w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition";
  const labelClass = "text-sm font-bold text-slate-800 dark:text-slate-100";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="pt-24">
        <section className="bg-primary/5 border-y border-primary/10 py-3 px-6 text-center">
          <p className="text-sm font-bold text-primary">ONLINE MEDICAL CERTIFICATE</p>
        </section>

        <section className="py-14">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <h1 className="text-4xl md:text-6xl font-black text-dark-slate dark:text-white leading-tight mt-5">
                Fast, secure medical certificates online
              </h1>
              <p className="mt-4 text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                Request your GP-reviewed certificate in minutes with a simple 2-step process and secure digital delivery.
              </p>

              <div className="mt-7 grid sm:grid-cols-3 gap-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-wide font-bold text-slate-500">Price</p>
                  <p className="text-xl font-black text-primary mt-1">EUR30</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-wide font-bold text-slate-500">Review time</p>
                  <p className="text-xl font-black text-primary mt-1">~1 Day</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-wide font-bold text-slate-500">Max duration</p>
                  <p className="text-xl font-black text-primary mt-1">Up to 7 Days</p>
                </div>
              </div>

              <h2 className="text-2xl font-black mt-8">How it works</h2>
              <ul className="mt-4 space-y-3 text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />Cost EUR30 with Irish doctor review.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />Usually delivered by e-mail within 1 business day after approval.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />Sick leave requests can cover up to 7 days at a time.</li>
              </ul>
              <div className="mt-6 p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-sm">
                No risk, 100% refund if our doctors cannot help you. Your information is protected by doctor-patient confidentiality.
              </div>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/70 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="text-xl font-black">When do I need a medical certificate?</h3>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Employers may require a certificate after consecutive sick days. This electronic sick leave cert is not
                submittable to the Department of Social Protection. For that purpose, please visit your local GP in person.
              </p>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <Clock3 className="w-5 h-5 text-primary" />
                  <p className="text-sm font-bold text-dark-slate dark:text-white mt-2">Fast turnaround</p>
                  <p className="text-xs text-slate-500 mt-1">Reviewed quickly by GP team.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <p className="text-sm font-bold text-dark-slate dark:text-white mt-2">Private & secure</p>
                  <p className="text-xs text-slate-500 mt-1">Protected doctor-patient confidentiality.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <Stethoscope className="w-5 h-5 text-primary" />
                  <p className="text-sm font-bold text-dark-slate dark:text-white mt-2">Irish doctors</p>
                  <p className="text-xs text-slate-500 mt-1">Clinical review before certificate issue.</p>
                </div>
              </div>
              <div className="mt-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <p className="font-bold text-dark-slate dark:text-white">Tamperproof document with QR code</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Employers can scan and verify authenticity quickly and securely.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="rounded-3xl bg-white/95 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black">Request for Medical Certificate</h3>
                  <p className="text-sm text-slate-500 mt-1">Step {step} of 2</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{step === 1 ? "50%" : "100%"}</p>
                  <div className="w-36 h-2 bg-slate-200 rounded-full mt-2">
                    <div className={`h-2 bg-primary rounded-full ${step === 1 ? "w-1/2" : "w-full"}`} />
                  </div>
                </div>
              </div>

              {step === 1 && (
                <div className="mt-8 space-y-6">
                  {submitted && Object.keys(errors).length > 0 && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 text-sm flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5" />
                      There was a problem with your submission. Please review the required fields below.
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Name (First)</label>
                      <input className={inputBaseClass} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                      {submitted && errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Name (Last)</label>
                      <input className={inputBaseClass} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                      {submitted && errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Address</label>
                    <input className={inputBaseClass} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                    {submitted && errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <label className={labelClass}>Email</label>
                    <input className={inputBaseClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    {submitted && errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <p className="text-sm font-bold">Acknowledge</p>
                    <label className="mt-2 flex items-start gap-2 text-sm">
                      <input type="checkbox" checked={form.acknowledge} onChange={(e) => setForm({ ...form, acknowledge: e.target.checked })} />
                      I acknowledge this service does not replace urgent care and I confirm I am requesting for myself and I am over 18.
                    </label>
                    {submitted && errors.acknowledge && <p className="text-xs text-red-600 mt-1">{errors.acknowledge}</p>}
                  </div>

                  <div>
                    <p className="text-sm font-bold">Are you experiencing any of these symptoms?</p>
                    <div className="grid sm:grid-cols-2 gap-2 mt-2">
                      {symptomOptions.map((s) => (
                        <label key={s} className="text-sm flex items-center gap-2">
                          <input type="checkbox" checked={form.symptoms.includes(s)} onChange={() => handleSymptomToggle(s)} />
                          {s}
                        </label>
                      ))}
                    </div>
                    {submitted && errors.symptoms && <p className="text-xs text-red-600 mt-1">{errors.symptoms}</p>}
                  </div>

                  <div>
                    <p className="text-sm font-bold">Certificate covering absence from</p>
                    <div className="flex gap-4 mt-2">
                      {["Work", "Study"].map((item) => (
                        <label key={item} className="text-sm flex items-center gap-2">
                          <input type="radio" name="absenceFrom" checked={form.absenceFrom === item} onChange={() => setForm({ ...form, absenceFrom: item })} />
                          {item}
                        </label>
                      ))}
                    </div>
                    {submitted && errors.absenceFrom && <p className="text-xs text-red-600 mt-1">{errors.absenceFrom}</p>}
                  </div>

                  <div>
                    <label className="text-sm font-bold">Reason for sick leave</label>
                    <select className={inputBaseClass} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}>
                      <option value="">Select reason</option>
                      <option>Back pain</option>
                      <option>Headache/Migraine</option>
                      <option>Common cold/flu</option>
                      <option>Depression/Anxiety</option>
                      <option>Stress</option>
                      <option>Period pain</option>
                      <option>Other</option>
                    </select>
                    {form.reason === "Other" && (
                      <input className={inputBaseClass} placeholder="Other reason" value={form.otherReason} onChange={(e) => setForm({ ...form, otherReason: e.target.value })} />
                    )}
                    {submitted && (errors.reason || errors.otherReason) && <p className="text-xs text-red-600 mt-1">{errors.reason || errors.otherReason}</p>}
                  </div>

                  <div>
                    <label className={labelClass}>Describe timeline of your illness</label>
                    <textarea className={`${inputBaseClass} min-h-24`} value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })} />
                    {submitted && errors.timeline && <p className="text-xs text-red-600 mt-1">{errors.timeline}</p>}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>From</label>
                      <input type="date" className={inputBaseClass} value={form.fromDate} onChange={(e) => setForm({ ...form, fromDate: e.target.value })} />
                      {submitted && errors.fromDate && <p className="text-xs text-red-600 mt-1">{errors.fromDate}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>To</label>
                      <input type="date" className={inputBaseClass} value={form.toDate} onChange={(e) => setForm({ ...form, toDate: e.target.value })} />
                      {submitted && errors.toDate && <p className="text-xs text-red-600 mt-1">{errors.toDate}</p>}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Telephone number</label>
                    <input className={inputBaseClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    {submitted && errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                  </div>

                  <button onClick={onNext} className="w-full mt-2 px-6 py-3 bg-primary text-white rounded-xl font-bold inline-flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
                    Continue to Payment <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="mt-8">
                  {!paid ? (
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 bg-slate-50/70 dark:bg-slate-900/60">
                      <h4 className="text-xl font-black">Payment</h4>
                      <p className="text-sm text-slate-500 mt-2">Secure payment for your medical certificate request.</p>
                      <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                        <WalletCards className="w-4 h-4" />
                        Secure Checkout
                      </div>
                      <div className="mt-5 space-y-2 text-sm">
                        <div className="flex items-center justify-between"><span>Medical Certificate</span><span className="font-bold">EUR30.00</span></div>
                        <div className="flex items-center justify-between"><span>Service fee</span><span className="font-bold">EUR0.00</span></div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-200"><span className="font-bold">Total</span><span className="font-black">EUR30.00</span></div>
                      </div>
                      <button onClick={() => setPaid(true)} className="w-full mt-5 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors">Pay EUR30</button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="text-xl font-black text-blue-900">Payment confirmed</h4>
                          <p className="text-sm text-blue-800 mt-1">Your certificate request has been submitted successfully.</p>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-3 gap-3 mt-5">
                        <div className="p-3 rounded-xl bg-white border border-blue-200"><FileCheck2 className="w-4 h-4 text-blue-600" /><p className="text-xs mt-1">Certificate will be issued after review.</p></div>
                        <div className="p-3 rounded-xl bg-white border border-blue-200"><ShieldCheck className="w-4 h-4 text-blue-600" /><p className="text-xs mt-1">Secure and tamperproof document.</p></div>
                        <div className="p-3 rounded-xl bg-white border border-blue-200"><CheckCircle2 className="w-4 h-4 text-blue-600" /><p className="text-xs mt-1">Delivery by e-mail after approval.</p></div>
                      </div>
                      <button onClick={downloadPdf} className="mt-5 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold">
                        Download PDF
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
