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

export default function PatientGuidePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="pt-28 pb-16 px-4 sm:px-6" id="top">
        <div className="max-w-5xl mx-auto">
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8 mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Logo</p>
            <h1 className="mt-2 text-2xl sm:text-4xl font-black text-primary">Patient Guide</h1>
            <p className="mt-4 text-slate-700 font-semibold">
              A healthier year starts now. Check your BMI and access medical weight care from €50.
            </p>
            <p className="mt-4 text-sm text-slate-600">Version 4.0</p>
            <p className="text-sm text-slate-600">Effective from 04/2026</p>
          </section>

          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8 space-y-7 leading-7">
            <div>
              <h2 className="text-xl font-black text-primary">Our Patient Guide</h2>
              <p className="mt-3">
                QuickDoctor.ie aims to provide the highest standards of medical care through our online services. All online
                consultations have the same level of confidentiality as face-to-face consultations.
              </p>
              <p className="mt-2">
                Our online services are safe, discreet and convenient. If medically safe and suitable, patients will receive
                a prescription by post that can be used in any Irish pharmacy.
              </p>
              <p className="mt-2">
                All doctors who write prescriptions live and work in Ireland. Dr Sylvester Mooney is the QuickDoctor.ie
                Medical Director. Dr Mooney is a GP with over 25 years of experience and is registered with the Irish Medical
                Council (number 010015).
              </p>
              <p className="mt-2">
                Our medical questionnaire is identified as a Class 1 medical device under Rule 11 of Annex VIII of EU
                Regulation 2017/745 (Medical Device Regulations).
              </p>
            </div>

            <div>
              <h2 className="text-xl font-black text-primary">Where Can I Use This Service?</h2>
              <p className="mt-3">
                This service is only available to people physically located in the Republic of Ireland.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-black text-primary">Online Consultation</h2>
              <p className="mt-3">
                Our online consultation takes only a few minutes. As with face-to-face consultations, your medical history is
                crucial to help assess whether issuing a prescription is safe and suitable. We rely on honest answers to
                prescribe safely.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-black text-primary">Buying Medicines</h2>
              <p className="mt-3">
                We are not an online pharmacy. You will need to take any prescription to your local pharmacy to buy medicines.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-black text-primary">Pricing</h2>
              <p className="mt-3">
                QuickDoctor.ie is an online-only business. We pass on cost savings by offering competitive prices. Pricing is
                clearly displayed, includes post and packaging, and has no hidden fees. Treatment prices start from €25.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-black text-primary">Refunds</h2>
              <p className="mt-3">
                A full refund is provided if our doctors deem you medically unsuitable. In such cases, our doctors may
                recommend a face-to-face consultation with your local GP or suggest a convenient GP option.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-black text-primary">Delivery</h2>
              <p className="mt-3">
                Once you complete your online consultation, it is reviewed by one of our doctors at QuickDoctor.ie.
                Consultations submitted on weekends or bank holidays are reviewed on the next working day.
              </p>
              <p className="mt-2">
                If medically suitable, a prescription is sent by post. We aim to deliver within three days, though postal
                times may vary by area. All packaging is discreet.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-black text-primary">Feedback and Complaints</h2>
              <p className="mt-3">
                Feedback and complaints can be made in writing to QuickDoctor Data Manager, QuickDoctor.ie, 20 Knockmeenagh
                Road, Clondalkin, Dublin 22.
              </p>
              <p className="mt-2">
                All complaints are acknowledged within 3 working days and a full response is usually provided within 10
                working days.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-black text-primary">Privacy and Data Protection</h2>
              <p className="mt-3">
                At QuickDoctor.ie we fully respect your privacy and do not collect personal information on this website
                without your consent. Protecting your data is a priority.
              </p>
              <p className="mt-2">
                All data is securely stored and confidential medical information is not sent by email. Confidential messages
                are exchanged through your secure QuickDoctor.ie account. For more details, please review our{" "}
                <Link href="/privacy" className="text-primary font-semibold hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

            <div>
              <h2 className="text-xl font-black text-primary">Terms and Conditions</h2>
              <p className="mt-3">
                To use QuickDoctor.ie, you must confirm that you have read and understood our Terms and Conditions. Please see
                our{" "}
                <Link href="/terms" className="text-primary font-semibold hover:underline">
                  Terms and Conditions
                </Link>{" "}
                for detailed information.
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
