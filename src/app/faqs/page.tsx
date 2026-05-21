import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const featuredFaqs = [
  {
    question: "What do I need to do before my video consultation?",
    answer: [
      "Log in to your QuickDoctor account at least 5 minutes before your consultation.",
      "Use a smartphone, tablet, or computer with a working camera and microphone.",
      "Use a stable internet connection. If using WiFi, restart your router before the consultation.",
      "Disable VPN services and reduce high-bandwidth activity (for example streaming or backups).",
      "For mobile data, a strong 3G/4G signal is typically sufficient.",
      "If you still have issues, contact support@quickdoctor.ie for help.",
    ],
  },
  {
    question: "How does it work?",
    answer: [
      "You can access care through an online medical questionnaire, a face-to-face video consultation, or home health testing.",
      "Our doctors review your case and prescribe treatment at their clinical discretion where appropriate.",
      "Some treatments are available without video consultation via online assessment.",
      "If needed, you can book a video consultation and speak directly with a doctor.",
      "QuickDoctor is not an online pharmacy. Prescriptions are filled at your local pharmacy.",
    ],
  },
  {
    question: "How can I get started?",
    answer: [
      "Anyone can register for QuickDoctor services.",
      "Visit quickdoctor.ie, select Sign Up, and follow the on-screen steps.",
      "If you have a corporate membership and need access support, contact support@quickdoctor.ie.",
    ],
  },
  {
    question: "When can I see a doctor?",
    answer: [
      "Prescription service is available 24/7.",
      "Video consultation hours are Monday to Friday: 8:00 to 22:00.",
      "Weekends and some Bank Holidays: 10:00 to 18:00.",
      "Home Health Tests and STI Home Health Tests can be ordered 24/7.",
    ],
  },
  {
    question: "How much does it cost?",
    answer: [
      "Prescription services start from €25.",
      "Video consultation prices depend on time/day and are shown during booking.",
      "Home Health Tests start from €79 and STI Home Health Tests start from €69.",
      "Weight Management service starts from €50.",
      "Travel health consultation costs €50, while vaccine prices vary by pharmacy.",
      "Medication pricing is set by local pharmacies because QuickDoctor is not an online pharmacy.",
    ],
  },
];

const videoConsultationFaqs = [
  {
    question: "Should I use my smartphone, tablet or computer for the video consultation?",
    answer: [
      "Use a laptop/desktop with webcam and microphone, or a supported iOS/Android phone app.",
      "Join at least 5 minutes before your consultation in case of technical issues.",
      "Latest Google Chrome is recommended.",
      "Supported browsers include latest Firefox, Opera (desktop), Edge, and Safari.",
      "Internet Explorer is not supported.",
    ],
  },
  {
    question: "How long does a consultation last?",
    answer: ["Regular video consultations typically last 10 minutes."],
  },
];

const technicalFaqs = [
  {
    question: "I sometimes have internet connection issues, what can I do?",
    answer: [
      "Ensure you are connected at least 5 minutes before consultation start.",
      "Restart your WiFi router before consultation.",
      "Disable VPN if enabled.",
      "Limit bandwidth-heavy usage such as streaming or backups.",
      "If using mobile data, use a strong 3G/4G signal.",
    ],
  },
  {
    question: "Do I need super fast broadband?",
    answer: [
      "No. A stable connection is most important. A strong mobile 3G connection can work, but home or office WiFi is usually more stable.",
    ],
  },
];

function FaqSection({
  title,
  description,
  items,
}: {
  title: string;
  description?: string;
  items: { question: string; answer: string[] }[];
}) {
  return (
    <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8 mt-6">
      <h2 className="text-xl font-black text-primary">{title}</h2>
      {description ? <p className="mt-2 text-slate-600">{description}</p> : null}
      <div className="mt-5 space-y-5">
        {items.map((item) => (
          <article key={item.question} className="rounded-xl border border-slate-200 p-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">{item.question}</h3>
            <ul className="mt-3 list-disc pl-6 space-y-1 text-slate-700">
              {item.answer.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Logo</p>
            <h1 className="mt-2 text-2xl sm:text-4xl font-black text-primary">Frequently Asked Questions</h1>
            <p className="mt-4 text-slate-700 font-semibold">
              A healthier year starts now. Check your BMI and access medical weight care from €50.
            </p>
            <p className="mt-4 text-sm text-slate-600">By QuickDoctor Support</p>
            <p className="text-sm text-slate-600">Help Center FAQ Collection</p>
            <p className="mt-3 text-sm text-slate-600">
              Need direct help? Contact{" "}
              <a href="mailto:support@quickdoctor.ie" className="text-primary font-semibold hover:underline">
                support@quickdoctor.ie
              </a>
              .
            </p>
          </section>

          <FaqSection
            title="Featured Articles"
            description="Most common patient questions before booking or starting treatment."
            items={featuredFaqs}
          />

          <FaqSection title="Video Consultation" items={videoConsultationFaqs} />

          <FaqSection title="Technical Queries" items={technicalFaqs} />

          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8 mt-6 text-sm text-slate-600">
            <p>
              You can also start from the{" "}
              <Link href="/register" className="text-primary font-semibold hover:underline">
                registration page
              </Link>{" "}
              or book via the{" "}
              <Link href="/consultation" className="text-primary font-semibold hover:underline">
                consultation page
              </Link>
              .
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
