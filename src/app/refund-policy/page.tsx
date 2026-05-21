import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const policyLinks = [
  { label: "Patient Guide", href: "/patient-guide" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Refund Policy", href: "/refund-policy" },
];

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="pt-28 pb-16 px-4 sm:px-6" id="top">
        <div className="max-w-5xl mx-auto">
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8 mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Logo</p>
            <h1 className="mt-2 text-2xl sm:text-4xl font-black text-primary">Refund Policy</h1>
            <p className="mt-4 text-slate-700 font-semibold">
              A healthier year starts now. Check your BMI and access medical weight care from €50.
            </p>
            <p className="mt-4 text-sm text-slate-600">Version 4.0</p>
            <p className="text-sm text-slate-600">Effective from 04/2026</p>
          </section>

          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8 leading-7">
            <h2 className="text-xl font-black text-primary">Online Prescription Services</h2>

            <p className="mt-4">
              Cancellation and refund requests for online prescription services may be made within 3 hours from the time the
              purchase was made, or 3 hours into the next working day if the purchase was made outside our normal operating
              hours (Mon-Fri 8am-10pm, Sat-Sun 10am-6pm), the Cancellation Period.
            </p>

            <p className="mt-4">
              Refunds, if applicable, can only be made to the original credit or debit card and take 1 to 10 working days to
              process.
            </p>

            <p className="mt-4">
              Once the Cancellation Period is over, and if our doctors issue a prescription for you, no refund will be
              permitted.
            </p>

            <p className="mt-4">
              If our doctors refuse your prescription request because it is deemed unsafe and/or medically unsuitable for you,
              you will be offered a safe alternative (if available), or a full refund will be provided to you. Please note
              that refunds can only be made to the original credit or debit card and take 1 to 10 working days to process.
            </p>

            <p className="mt-4">
              If our doctors refuse to issue your prescription request because our doctors consider that the prescription
              service (rather than the prescription itself) is deemed unsafe and unsuitable for your medical needs, then the
              following shall apply:
            </p>

            <ul className="mt-4 list-disc pl-6 space-y-2">
              <li>
                If our doctors consider that a full consultation is necessary for the relevant medication request, you will be
                offered an online discount code that can be used towards such an online video consultation with one of our
                GPs.
              </li>
              <li>
                If our doctors consider that the online video consultation format is deemed unsafe and/or unsuitable for your
                medical needs, you will be offered an option to take a refund and advised to attend your local GP instead.
                Please note that refunds can only be made to the original credit or debit card and take 1 to 10 working days
                to process.
              </li>
            </ul>

            <p className="mt-4">
              If your request for a prescription is assessed by one of our doctors and you fail to provide the required
              medical information as requested in our questionnaire, and when prompted by the doctor, within 3 days of the
              date of your request (or if you supply incorrect or insufficient information), no refund will be permitted.
            </p>
          </section>

          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8 mt-6">
            <h2 className="text-lg font-black text-primary">Our Policies</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {policyLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-3 py-1.5 rounded-full bg-slate-100 text-sm font-semibold text-slate-700 hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-6 text-sm text-slate-600">
              <p>About us: About, Help, In the Media, Careers, Sitemap</p>
              <p className="mt-1">Health HQ: Blog, Podcast</p>
              <p className="mt-1">Social: Facebook, Twitter, Linkedin, Instagram, TikTok</p>
              <p className="mt-1">App store, Google Play</p>
              <p className="mt-3">
                &copy; 2026 QuickDoctor Limited. Registered in Ireland under Company Registration Number 536841.
              </p>
              <p className="mt-2">
                <Link href="#top" className="text-primary font-semibold hover:underline">
                  Back To Top
                </Link>
              </p>
              <p className="mt-2">A Medihive company</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
