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

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="pt-28 pb-16 px-4 sm:px-6" id="top">
        <div className="max-w-5xl mx-auto">
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8 mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Logo</p>
            <h1 className="mt-2 text-2xl sm:text-4xl font-black text-primary">Terms and Conditions</h1>
            <p className="mt-4 text-slate-700 font-semibold">
              A healthier year starts now. Check your BMI and access medical weight care from €50.
            </p>
            <p className="mt-4 text-sm text-slate-600">Version 4.0</p>
            <p className="text-sm text-slate-600">Effective from 04/2026</p>
          </section>

          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8 space-y-7 leading-7">
            <div>
              <h2 className="text-xl font-black text-primary">Terms and Conditions</h2>
              <p className="mt-3">
                QuickDoctor.ie has taken great care in the development and presentation of this website and the material
                present on it. However, there may be inadvertent and occasional errors for which we apologise, but for which
                we can accept no liability.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-black text-primary">Definitions</h2>
              <p className="mt-3">
                “You or yours” refers to you as the person who has submitted your personal information on this website and
                agreed to use the Online Medical Consultation service.
              </p>
              <p className="mt-2">
                “We or our” refers to QuickDoctor Ltd, incorporated in the Republic of Ireland under Company Registration
                Number 536841, whose registered office is at QuickDoctor Limited, 20 Knockmeenagh Road, Clondalkin, Dublin
                22, Ireland.
              </p>
              <p className="mt-2">
                “Website or Site” means the linked pages of QuickDoctor.ie that allow an online consultation to be performed
                for the purpose of issuing private prescriptions.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-black text-primary">Change to the Terms and Conditions</h2>
              <p className="mt-3">
                By using the site, you agree to be bound by these Terms. We reserve the right, in our sole discretion, to
                change, modify, add or remove portions of these Terms at any time.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-black text-primary">Declaration</h2>
              <p className="mt-3">
                By agreeing to these Terms and Conditions and using the site, you declare that you wish to take part in the
                online medical consultation service operated by QuickDoctor Ltd through the QuickDoctor.ie website.
              </p>
              <ul className="mt-3 list-disc pl-6 space-y-2">
                <li>
                  You agree to register as an authorised user and warrant that you are over eighteen years of age or the legal
                  guardian of the child you have registered, and are resident in the Republic of Ireland.
                </li>
                <li>
                  You agree not to disclose your authorisation credentials (username and password) to any third party, and not
                  to complete consultations for anyone other than yourself.
                </li>
                <li>You warrant that all information provided by you is correct, true and complete.</li>
                <li>
                  Medication is prescribed in accordance with information you provide to our doctors through website
                  assessments, account messages, email and telephone.
                </li>
                <li>
                  We rely on the information you provide and accept no liability for loss or damage arising from incorrect or
                  incomplete information supplied by you.
                </li>
                <li>
                  You agree to promptly inform our doctors of side effects and any other issues arising from treatments
                  provided through the website.
                </li>
                <li>You agree to inform your GP about medication supplied and advice given through the website.</li>
                <li>
                  We are not liable for any damage arising from your failure to inform your GP or healthcare professional, or
                  from failing to follow advice given on the website.
                </li>
                <li>
                  You accept that the website does not replace your GP and that you should consult your GP and other health
                  carers when advised by our doctors or as needed.
                </li>
                <li>
                  If you do not fully understand any assessment question or advice, you agree to seek clarification from our
                  doctors.
                </li>
                <li>
                  Any medicine prescribed to you is for your own personal use only, and you agree not to supply it to any
                  other person.
                </li>
                <li>
                  Before taking medicine, you agree to read all information provided by the doctor, the manufacturer&apos;s
                  patient leaflet, and follow dispensing pharmacist advice.
                </li>
                <li>
                  Prescriptions are issued entirely at the discretion of the doctor. QuickDoctor Ltd cannot guarantee that a
                  consultation will result in a prescription being issued.
                </li>
                <li>
                  If any terms are held invalid or unenforceable, the validity and enforceability of the remaining provisions
                  is unaffected.
                </li>
                <li>
                  You consent to your health and medical history being viewed and exchanged by QuickDoctor Ltd employees and
                  doctors working on our behalf for the purpose of medical consultation, including electronically.
                </li>
                <li>
                  Online consultations are handled by a doctor as soon as possible. QuickDoctor.ie relies on third-party
                  networks and technology and cannot guarantee delivery timing in all circumstances.
                </li>
                <li>
                  Healthcare Plan benefits expire 12 months from purchase and must be used within that period. Unused benefits
                  are forfeited.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-black text-primary">Payments</h2>
              <p className="mt-3">
                You are responsible for providing valid credit or debit card details and authorise us to take full payment for
                services. You warrant that you are authorised to use the card. Pricing is clearly displayed and includes post
                and packaging where applicable.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-black text-primary">Refund Policy</h2>

              <h3 className="mt-4 text-lg font-bold text-primary">Online Video Consultations</h3>
              <p className="mt-2">
                Appointments may be cancelled or rescheduled free of charge if requested more than 24 hours in advance.
                Cancellations or rescheduling within 24 hours are charged in full.
              </p>
              <p className="mt-2">
                Refunds, where applicable, are made only to the original card and typically take 1 to 10 working days.
                Rescheduling requests can be made by emailing{" "}
                <a href="mailto:support@quickdoctor.ie" className="text-primary font-semibold hover:underline">
                  support@quickdoctor.ie
                </a>
                .
              </p>

              <h3 className="mt-5 text-lg font-bold text-primary">Online Prescription Services</h3>
              <p className="mt-2">
                Cancellation and refund requests can be made within 3 hours of purchase, or 3 hours into the next working day
                if purchased outside operating hours (Mon-Fri 8am-10pm, Sat-Sun 10am-6pm).
              </p>
              <p className="mt-2">
                Once the cancellation period is over and a prescription is issued, no refund is permitted.
              </p>
              <p className="mt-2">
                If a request is refused due to safety or suitability concerns, you may be offered a safe alternative or full
                refund, depending on clinical decision.
              </p>
              <p className="mt-2">
                If further medical information is requested and not provided within 3 days (or incorrect/insufficient
                information is supplied), no refund is permitted.
              </p>

              <h3 className="mt-5 text-lg font-bold text-primary">Home Health Test Kits</h3>
              <p className="mt-2">
                You may cancel and request a refund within 14 days of receiving the product by writing to{" "}
                <a href="mailto:support@quickdoctor.ie" className="text-primary font-semibold hover:underline">
                  support@quickdoctor.ie
                </a>
                .
              </p>
              <p className="mt-2">
                For hygiene and health protection reasons, opened or unsealed kits are not eligible for cancellation or refund.
                Personalized or rapidly expiring products are also excluded.
              </p>
              <p className="mt-2">
                Returned kits must be unopened and untampered with and sent back within 14 days from notifying us. A deduction
                of 50% of RRP may apply to cover kit costs that cannot be recovered.
              </p>
              <p className="mt-2">
                Kits are generally shipped within 24 hours and usually delivered within 7 days. If not received within 30
                days, you may be entitled to a refund.
              </p>

              <h3 className="mt-5 text-lg font-bold text-primary">Healthcare Plans</h3>
              <p className="mt-2">
                You may cancel your Healthcare Plan and receive a full refund within 14 days of purchase by emailing{" "}
                <a href="mailto:support@quickdoctor.ie" className="text-primary font-semibold hover:underline">
                  support@quickdoctor.ie
                </a>
                .
              </p>
              <p className="mt-2">
                If services have been used during this period, standard rates may be charged and deducted from your payment
                method.
              </p>
              <p className="mt-2">After the 14-day period, Healthcare Plan cancellation is no longer possible.</p>
            </div>

            <div>
              <h2 className="text-xl font-black text-primary">Disclaimer</h2>
              <p className="mt-3">
                QuickDoctor Ltd has taken care in preparing website content. To the fullest extent permitted by law,
                QuickDoctor Ltd disclaims all warranties of any kind with respect to website content.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-black text-primary">Acceptable Patient Behaviour Policy</h2>
              <p className="mt-3">
                We believe patients have a right to be heard, understood and respected. We also believe our staff have a right
                to work in a safe environment free from abuse or harm.
              </p>
              <p className="mt-2">
                Aggressive or abusive behaviour includes intimidating language, derogatory remarks, rudeness, menacing
                behaviour, unreasonable demands, or unreasonable contact levels.
              </p>
              <p className="mt-2">
                Before action is taken, the person is given an opportunity to modify behaviour. Repeated unacceptable behaviour
                may result in removal from our service.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-black text-primary">Exclusive Jurisdiction of the Irish Courts</h2>
              <p className="mt-3">
                The site is created and controlled by QuickDoctor Ltd in Ireland. These Terms are governed by and construed in
                accordance with Irish law, and you submit to the exclusive jurisdiction of the Irish courts.
              </p>
            </div>
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
