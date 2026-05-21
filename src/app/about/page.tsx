import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CalendarClock, FileText, Lock, Pill, Stethoscope, UserCheck, Video } from "lucide-react";

const highlights = [
  {
    title: "Licensed Doctors",
    description: "Consult with experienced, Irish-registered clinicians through secure digital appointments.",
    icon: UserCheck,
  },
  {
    title: "Fast Access to Care",
    description: "Get timely medical advice, prescriptions, and certificates without clinic waiting rooms.",
    icon: CalendarClock,
  },
  {
    title: "Privacy First",
    description: "Your records are handled with strict confidentiality and encrypted data protection controls.",
    icon: Lock,
  },
];

const services = [
  {
    title: "Video Consultation",
    description: "Speak directly with a doctor online from anywhere in Ireland.",
    icon: Video,
    href: "/consultation",
  },
  {
    title: "Digital Prescriptions",
    description: "Request treatment online and collect prescribed medication at your local pharmacy.",
    icon: Pill,
    href: "/prescriptions/acne-treatment",
  },
  {
    title: "Medical Certificates",
    description: "Receive sick notes and supporting medical documentation quickly when clinically appropriate.",
    icon: FileText,
    href: "/medical-certificates",
  },
];

const journey = [
  {
    title: "1. Choose a Service",
    description: "Select consultation, prescription, certificate, or specialist support based on your needs.",
  },
  {
    title: "2. Share Your Details",
    description: "Complete the relevant questionnaire or booking form to help our team assess your request safely.",
  },
  {
    title: "3. Get Clinical Support",
    description: "A qualified doctor reviews your case and provides next steps, treatment, or documentation.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="pt-24 pb-16">
        <section className="px-4 sm:px-6 py-14 md:py-20">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-1.5 text-xs font-black uppercase tracking-wide">
                <BadgeCheck className="w-4 h-4" />
                About QuickDoctor
              </p>
              <h1 className="mt-5 text-4xl md:text-6xl font-black text-primary leading-tight">
                Modern healthcare, designed around your life.
              </h1>
              <p className="mt-5 text-slate-600 text-base md:text-lg max-w-2xl">
                QuickDoctor is a digital healthcare platform helping patients across Ireland access trusted medical care
                quickly and securely. Our goal is to make healthcare simpler, safer, and more convenient for everyday life.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-black hover:bg-primary-dark transition-colors"
                >
                  Book an Appointment <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/consultation"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 text-slate-800 font-black hover:bg-slate-100 transition-colors"
                >
                  Explore Services
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-7 sm:p-8">
              <h2 className="text-2xl font-black text-primary">What we stand for</h2>
              <div className="mt-5 space-y-5">
                {highlights.map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900">{item.title}</h3>
                      <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 py-14 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-primary text-center">Our Core Services</h2>
            <p className="text-slate-600 text-center mt-3 max-w-2xl mx-auto">
              Built to help you access quality care quickly, while keeping your experience private and straightforward.
            </p>
            <div className="mt-10 grid md:grid-cols-3 gap-6">
              {services.map((service) => (
                <div key={service.title} className="rounded-2xl border border-slate-200 p-6 bg-slate-50">
                  <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
                    <service.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="mt-4 text-xl font-black text-primary">{service.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{service.description}</p>
                  <Link href={service.href} className="mt-5 inline-flex items-center gap-2 text-primary font-black hover:underline">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 py-14 md:py-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-primary text-center">How QuickDoctor Works</h2>
            <div className="mt-10 grid md:grid-cols-3 gap-6">
              {journey.map((step) => (
                <div key={step.title} className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h3 className="text-xl font-black text-primary">{step.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 pb-8">
          <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-primary to-blue-900 text-white p-8 sm:p-12 text-center">
            <Stethoscope className="w-9 h-9 mx-auto text-blue-100" />
            <h2 className="mt-4 text-3xl md:text-4xl font-black">Ready to get started?</h2>
            <p className="mt-3 text-blue-100 max-w-2xl mx-auto">
              Join patients across Ireland who trust QuickDoctor for convenient, professional, and secure digital care.
            </p>
            <Link
              href="/register"
              className="inline-flex mt-7 px-8 py-3 rounded-xl bg-white text-primary font-black hover:bg-blue-50 transition-colors"
            >
              Book Your Appointment
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
