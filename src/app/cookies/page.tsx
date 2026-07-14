import Logo from "@/components/Logo";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PolicyPageFooter from "@/components/PolicyPageFooter";
import Link from "next/link";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="pt-28 pb-16 px-4 sm:px-6" id="top">
        <div className="max-w-5xl mx-auto">
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8 mb-6">
            <div className="mb-3"><Logo href="/" size="sm" showText /></div>
            <h1 className="mt-2 text-2xl sm:text-4xl font-black text-primary">Cookie Policy</h1>
            <p className="mt-4 text-sm text-slate-600">Version 4.0</p>
            <p className="text-sm text-slate-600">Effective from 04/2026</p>
          </section>

          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8 space-y-7 leading-7">
            <div>
              <h2 className="text-xl font-black text-primary">What are Cookies?</h2>
              <p className="mt-3">
                A cookie is a small text file, often including a unique identifier, that is sent to your browser from a
                website and stored on your device.
              </p>
              <p className="mt-2">
                Some cookies are only placed for the time you browse the website. Others may be stored and sent back to the
                originating website on later visits, or to another website that recognizes that cookie.
              </p>
              <p className="mt-2">
                Cookies are useful because they allow a website to recognize a user&apos;s device.
              </p>
              <p className="mt-2">
                Your browser only allows a website to access cookies it has sent to you, not cookies sent by other websites.
                More information is available at{" "}
                <a href="https://www.allaboutcookies.org" className="text-primary font-semibold hover:underline">
                  www.allaboutcookies.org
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="text-xl font-black text-primary">QuickDoctor Medical Services ltd and Cookies</h2>
              <p className="mt-3">
                Our policy is to use cookies only to improve the way we do business with you or when they are essential for
                our service to work.
              </p>
              <p className="mt-2">
                We do not use cookies to store sensitive details or other data that could identify you as an individual.
              </p>
              <p className="mt-2">
                quickdoctor.ie uses cookies and similar small pieces of software to improve performance and user experience.
                Without these cookies, many functions needed for purchases would not be available.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-black text-primary">How We May Use Cookies</h2>
              <p className="mt-3">The types of activities we may use cookies for are to:</p>
              <ul className="mt-3 list-disc pl-6 space-y-1">
                <li>Store details that help you manage accounts and prescriptions online, such as login details.</li>
                <li>
                  Understand how people use our sites, including visit frequency, pages viewed, and links clicked, so we can
                  improve the site.
                </li>
                <li>
                  Provide relevant information, such as treatments, services, and other information you may be interested in.
                </li>
              </ul>
              <p className="mt-3">
                Some pages include third-party cookies not set by quickdoctor.ie. These are usually supplied by partners and
                support analytics and relevance of information shown.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-black text-primary">Cookies used by QuickDoctor</h2>
              <ul className="mt-3 list-disc pl-6 space-y-1">
                <li>
                  <span className="font-semibold">QuickDoctor</span> - monitors site usage so we can provide a better user
                  experience and improve products and services.
                </li>
                <li>
                  <span className="font-semibold">Google Analytics</span> - recognizes and counts visitors and how they move
                  around the site. This information is collected in anonymous form.
                </li>
                <li>
                  <span className="font-semibold">Intercom</span> - monitors site usage to provide customer support and
                  improve products and services.
                </li>
                <li>
                  <span className="font-semibold">Wistia (Video Player)</span> - used when watching videos on our sites to
                  recognize and count visits to videos.
                </li>
                <li>
                  <span className="font-semibold">NewRelic</span> - monitors technical performance and helps detect platform
                  issues.
                </li>
                <li>
                  <span className="font-semibold">Stripe</span> - handles payments. Since card details are not stored on our
                  servers, Stripe sets cookies required to process payments.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-black text-primary">Accepting or Rejecting Cookies</h2>
              <p className="mt-3">
                Most browsers accept cookies by default. If you prefer that we do not collect data this way, you can disable
                cookies in browser settings.
              </p>
              <p className="mt-2">
                If you want to delete existing cookies, refer to your device or browser instructions to locate stored cookie
                files. Additional guidance is available at{" "}
                <a href="https://www.allaboutcookies.org" className="text-primary font-semibold hover:underline">
                  www.allaboutcookies.org
                </a>
                .
              </p>
              <p className="mt-2">
                To find out more about cookies and how we use your information, please see our{" "}
                <Link href="/privacy" className="text-primary font-semibold hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
              <p className="mt-3 font-semibold text-slate-700">Click to manage your consent</p>
            </div>
          </section>

          <PolicyPageFooter />
        </div>
      </main>

      <Footer />
    </div>
  );
}
