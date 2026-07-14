import Link from "next/link";
import { SITE_COMPANY_NAME, SITE_COMPANY_REG } from "@/lib/siteContact";

const policyLinks = [
  { label: "Patient Guide", href: "/patient-guide" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Refund Policy", href: "/refund-policy" },
];

export default function PolicyPageFooter() {
  return (
    <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 sm:p-6 md:p-8 mt-6">
      <h2 className="text-base sm:text-lg font-black text-primary">Our Policies</h2>

      <div className="mt-4 grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
        {policyLinks.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="inline-flex items-center justify-center px-3 py-2 sm:py-1.5 rounded-full bg-slate-100 text-xs sm:text-sm font-semibold text-slate-700 hover:text-primary transition-colors text-center"
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <p>
          &copy; {new Date().getFullYear()} {SITE_COMPANY_NAME}. Registered in Ireland under Company Registration Number{" "}
          {SITE_COMPANY_REG}.
        </p>
        <p className="mt-3">
          <Link href="#top" className="text-primary font-semibold hover:underline">
            Back To Top
          </Link>
        </p>
      </div>
    </section>
  );
}
