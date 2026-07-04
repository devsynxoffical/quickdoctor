import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, Pill } from "lucide-react";

const prescriptionServices = [
  { name: "Contraceptive Pill, Patch or Ring", href: "/prescriptions/contraceptive-pill-patch-ring" },
  { name: "Period Delay", href: "/prescriptions/period-delay-treatment" },
  { name: "Genital Thrush", href: "/prescriptions/genital-thrush-treatment" },
  { name: "Bacterial Vaginosis", href: "/prescriptions/bacterial-vaginosis-treatment" },
  { name: "Menopausal Vaginal Dryness", href: "/prescriptions/menopausal-vaginal-dryness-treatment" },
  { name: "Excess Female Facial Hair", href: "/prescriptions/excess-female-facial-hair" },
  { name: "Cystitis", href: "/prescriptions/cystitis-uti-treatment" },
  { name: "Male Hair Loss", href: "/prescriptions/male-hair-loss" },
  { name: "Erectile Dysfunction", href: "/prescriptions/erectile-dysfunction-treatment" },
  { name: "Premature Ejaculation", href: "/prescriptions/premature-ejaculation-treatment" },
  { name: "Asthma", href: "/prescriptions/asthma-treatment" },
  { name: "Migraine", href: "/prescriptions/migraine-treatment" },
  { name: "Hypothyroidism", href: "/prescriptions/hypothyroidism-treatment" },
  { name: "Stop Smoking", href: "/prescriptions/stop-smoking-treatment" },
  { name: "Acne", href: "/prescriptions/acne-treatment" },
  { name: "Rosacea", href: "/prescriptions/rosacea-treatment" },
  { name: "Cold Sores", href: "/prescriptions/cold-sore-treatments" },
  { name: "Eczema", href: "/prescriptions/eczema-treatment" },
  { name: "Psoriasis", href: "/prescriptions/plaque-psoriasis-treatment" },
  { name: "Hay Fever", href: "/prescriptions/hay-fever" },
  { name: "Anaphylaxis", href: "/prescriptions/anaphylaxis" },
  { name: "Travel Vaccines & Anti-Malaria", href: "/prescriptions/travel-vaccines-anti-malaria" },
  { name: "Jet Lag", href: "/prescriptions/jet-lag-prescription" },
  { name: "Genital Herpes", href: "/prescriptions/genital-herpes" },
  { name: "HPV Vaccine", href: "/prescriptions/hpv-vaccine" },
  { name: "Weight Management", href: "/prescriptions/weight-management-consultation" },
  { name: "Self Injectable", href: "/prescriptions/self-injectable" },
];

export default function PrescriptionsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <section className="py-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-1.5 text-xs font-black uppercase tracking-wide">
              <Pill className="w-4 h-4" />
              Online Prescriptions
            </div>
            <h1 className="mt-4 text-4xl md:text-5xl font-black text-primary">Choose Your Prescription Service</h1>
            <p className="mt-4 text-slate-600 max-w-3xl">
              Select a treatment below to start your request. Complete the health questionnaire, pay securely with Stripe,
              and an Irish GP reviews your answers — usually within 1 business day.
            </p>

            <div className="mt-8 grid md:grid-cols-3 gap-4 max-w-4xl">
              {[
                { step: '1', title: 'Questionnaire', text: 'Answer clinical questions honestly for your chosen treatment.' },
                { step: '2', title: 'Pay €25', text: 'Secure Stripe checkout. Full refund if our doctors cannot help.' },
                { step: '3', title: 'GP review', text: 'Prescription appears in Medical Records if medically suitable.' },
              ].map((item) => (
                <div key={item.step} className="rounded-2xl bg-white border border-slate-200 p-5">
                  <p className="text-xs font-black text-primary">Step {item.step}</p>
                  <p className="font-black mt-1">{item.title}</p>
                  <p className="text-sm text-slate-600 mt-2">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/consultation"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 font-black hover:bg-slate-100 transition-colors"
              >
                Book Online Consultation <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

          <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {prescriptionServices.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="rounded-2xl bg-white border border-slate-200 p-5 hover:border-primary hover:shadow-sm transition-all"
              >
                <p className="font-black text-slate-900">{service.name}</p>
                <p className="mt-2 text-sm text-primary font-semibold inline-flex items-center gap-1">
                  Open service <ArrowRight className="w-4 h-4" />
                </p>
              </Link>
            ))}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
