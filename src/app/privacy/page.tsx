import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PolicyPageFooter from "@/components/PolicyPageFooter";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="pt-28 pb-16 px-4 sm:px-6" id="top">
        <div className="max-w-5xl mx-auto">
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8 mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Logo</p>
            <h1 className="mt-2 text-2xl sm:text-4xl font-black text-primary">Privacy Policy</h1>
            <p className="mt-4 text-slate-700 font-semibold">
              A healthier year starts now. Check your BMI and access medical weight care from €50.
            </p>
            <p className="mt-4 text-sm text-slate-600">Version 4.0</p>
            <p className="text-sm text-slate-600">Effective from 04/2026</p>
          </section>

          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8 space-y-7 leading-7">
            <div>
              <h2 className="text-xl font-black text-primary">Privacy Policy Statement</h2>
              <p className="mt-3">
                This privacy statement applies to the website, apps and services available from QuickDoctor Ltd (
                <a href="https://www.quickdoctor.ie" className="text-primary font-semibold hover:underline">
                  https://www.quickdoctor.ie
                </a>
                ).
              </p>
              <p className="mt-2">
                Email:{" "}
                <a href="mailto:support@quickdoctor.ie" className="text-primary font-semibold hover:underline">
                  support@quickdoctor.ie
                </a>
              </p>
              <p className="mt-3">
                At https://www.quickdoctor.ie we fully respect your privacy and we will not collect any personal information on
                this website without your consent. It is our priority to protect your data. This is why we have taken the
                time to describe our information handling practices in detail. Please review this document and contact us if
                anything is unclear.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-black text-primary">Personal Information We Collect</h3>
              <h4 className="mt-4 font-bold">Information You Provide</h4>
              <p className="mt-2">
                We collect personal information when you apply for services, including by online questionnaire, video
                consultation, follow-up question, phone call, email, or other communication methods.
              </p>
              <p className="mt-2">
                We may collect sensitive medical information so our medical team can make a clinical decision on whether
                treatment is safe and suitable for you. We also collect your email, mobile number, and home or shipping
                address to deliver services such as prescriptions, medical certificates, and test kits.
              </p>
              <p className="mt-2">
                If you purchase a service, payment information is processed by Stripe. Credit card details are not received or
                stored on our servers. Stripe is PCI-DSS compliant. Stripe policy:{" "}
                <a href="https://stripe.com/us/checkout/legal" className="text-primary font-semibold hover:underline">
                  https://stripe.com/us/checkout/legal
                </a>
                .
              </p>
              <p className="mt-2">
                If you contact us by web chat, app messages, phone, email, post, or other means, we may hold the content and
                contact details for future reference.
              </p>

              <h4 className="mt-5 font-bold">Information We Receive About You</h4>
              <p className="mt-2">
                If you are referred to a consultant, diagnostics, or treatment services, reports and results may be received
                by our team and made available in your secure health record.
              </p>

              <h4 className="mt-5 font-bold">Device and Network Information</h4>
              <p className="mt-2">
                We may collect browser and device identifiers, settings, operating system details, app version, IP address,
                crash reports, system activity, and request metadata such as date, time, and referrer URL.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-black text-primary">Use of Personal Information</h3>
              <h4 className="mt-4 font-bold">Provide You with Our Service</h4>
              <p className="mt-2">
                We use your consultation information so our medical team can determine whether treatment is safe and suitable.
                Questions are based on current medical standards and reviewed regularly.
              </p>
              <p className="mt-2">
                We also use your information in clinical decision support systems to assist medical personnel. Final clinical
                decisions are made by our medical team.
              </p>

              <h4 className="mt-5 font-bold">Communicate with you</h4>
              <p className="mt-2">
                We use your email to notify you of messages from your doctor. For urgent matters, we may contact you by SMS
                or phone. When you contact us, we use your details to respond via available channels.
              </p>

              <h4 className="mt-5 font-bold">Marketing</h4>
              <p className="mt-2">
                Where consent is provided, we may send occasional updates about services, offers, and health topics. You can
                opt out at any time.
              </p>

              <h4 className="mt-5 font-bold">Research and Development</h4>
              <p className="mt-2">
                We analyze personal data to improve services and clinical awareness. We may publish anonymized aggregate
                research where individuals cannot be identified.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-black text-primary">How Long Do We Hold Your Data (Data Retention Policy)</h3>
              <p className="mt-2">
                We retain data while needed to deliver services, comply with legal obligations, or until account deletion
                applies, subject to medical record retention requirements.
              </p>
              <ul className="mt-3 list-disc pl-6 space-y-1">
                <li>Adults (18+): eight years after last treatment or death.</li>
                <li>
                  Children and young people: until age 25, or 26 if aged 17 at treatment conclusion, or eight years after
                  death.
                </li>
                <li>Maternity records: 25 years after birth of the last child.</li>
                <li>Mentally disordered patient records: 20 years after last treatment or eight years after death.</li>
                <li>Where required for legal proceedings, records may be retained longer as necessary.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-black text-primary">Who Has Access to the Information We Collect?</h3>
              <p className="mt-2">
                We do not share identifiable personal information except where required to operate services and fulfill legal
                or regulatory obligations.
              </p>
              <h4 className="mt-4 font-bold">QuickDoctor Team</h4>
              <p className="mt-2">
                Team-based patient care may require role-based internal sharing on a need-to-know basis. Staff are bound by
                contractual confidentiality and professional obligations.
              </p>
              <h4 className="mt-5 font-bold">Disclosure with Your Consent</h4>
              <p className="mt-2">
                Disclosure may occur with your explicit consent (for example insurer or employer requests), limited to the
                authority you provide.
              </p>
              <h4 className="mt-5 font-bold">Disclosure without Your Consent</h4>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Where required by law (court, tribunal, or statutory body).</li>
                <li>Where disclosure is in the public interest (for example serious risk or infectious disease rules).</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-black text-primary">How is your Information Secured and Protected?</h3>
              <p className="mt-2">
                We use technologies and procedures to protect personal information. Please note that standard email is not
                always secure in transmission.
              </p>
              <p className="mt-2">
                For each third-party service provider, we maintain Data Processing Agreements and assess legal compliance.
              </p>
              <h4 className="mt-5 font-bold">Telephone Recording</h4>
              <p className="mt-2">Telephone calls may be recorded for training and verification purposes.</p>
              <h4 className="mt-5 font-bold">Communication with Customers</h4>
              <p className="mt-2">
                Prescription-related communication is sent to your secure account inbox. We may call to discuss your request.
                No medical information is sent to personal email; only inbox notifications are emailed.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-black text-primary">How to Access and Update your Information?</h3>
              <p className="mt-2">
                You have the right to access your personal data and export account data in machine-readable format through
                your account tools.
              </p>
              <p className="mt-2">
                You can request correction of inaccuracies in writing and must include proof of identity. Subject access
                requests are processed within one month of receipt.
              </p>

              <h4 className="mt-5 font-bold">Account deactivation, deletion and erasure</h4>
              <p className="mt-2">
                If no medical services were used, account deletion permanently removes your account data. If you have had a
                consultation, the account is deactivated and records are retained for the minimum retention period. To
                reactivate, contact support at{" "}
                <a href="mailto:support@quickdoctor.ie" className="text-primary font-semibold hover:underline">
                  support@quickdoctor.ie
                </a>
                .
              </p>
            </div>

            <div>
              <h3 className="text-lg font-black text-primary">Changes to this Statement</h3>
              <p className="mt-2">
                This privacy statement may be updated periodically. Continued use of services constitutes acceptance of
                updates.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-black text-primary">How to Contact QuickDoctor with Questions</h3>
              <p className="mt-2">
                The data controller is QuickDoctor Ltd. Contact by email at{" "}
                <a href="mailto:support@quickdoctor.ie" className="text-primary font-semibold hover:underline">
                  support@quickdoctor.ie
                </a>{" "}
                (subject: FAO DPO), or by post at:
              </p>
              <p className="mt-2">
                Data Protection Officer
                <br />
                QuickDoctor Ltd.
                <br />
                20 Knockmeenagh Road
                <br />
                Dublin 22
                <br />
                Ireland
              </p>
            </div>
          </section>

          <PolicyPageFooter />
        </div>
      </main>

      <Footer />
    </div>
  );
}
