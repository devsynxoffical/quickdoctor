/** All user-facing routes editable from Admin → CMS */

export type SitePageDef = {
  slug: string;
  path: string;
  title: string;
  group: string;
  pageType?: 'PAGE' | 'BLOG_POST';
};

export function defaultSectionsForPage(def: SitePageDef) {
  return [
    {
      type: 'HERO',
      sortOrder: 0,
      contentJson: {
        headline: def.title,
        subheadline: `Learn about ${def.title} at QuickDoctor — book online video consultations with licensed doctors.`,
        ctaLabel: 'Book a consultation',
        ctaHref: '/doctors',
      },
    },
    {
      type: 'TEXT',
      sortOrder: 1,
      contentJson: {
        body: `Welcome to our ${def.title} page. Edit this content in Admin → CMS to update what patients see on ${def.path}.`,
      },
    },
    {
      type: 'FAQ',
      sortOrder: 2,
      contentJson: {
        items: [
          {
            q: 'How do I book?',
            a: 'Choose a doctor, pick a time slot, and complete payment to confirm your video consultation.',
          },
          {
            q: 'Is this service available in Ireland?',
            a: 'Yes — QuickDoctor connects you with registered doctors for online consultations.',
          },
        ],
      },
    },
    {
      type: 'CTA',
      sortOrder: 3,
      contentJson: {
        text: 'Ready to speak with a doctor?',
        label: 'Find a doctor',
        href: '/doctors',
      },
    },
  ];
}

const prescriptionPages: SitePageDef[] = [
  { slug: 'prescriptions-contraceptive-pill-patch-ring', path: '/prescriptions/contraceptive-pill-patch-ring', title: 'Contraceptive Pill, Patch or Ring', group: 'Prescriptions' },
  { slug: 'prescriptions-period-delay-treatment', path: '/prescriptions/period-delay-treatment', title: 'Period Delay', group: 'Prescriptions' },
  { slug: 'prescriptions-genital-thrush-treatment', path: '/prescriptions/genital-thrush-treatment', title: 'Genital Thrush', group: 'Prescriptions' },
  { slug: 'prescriptions-menopausal-vaginal-dryness-treatment', path: '/prescriptions/menopausal-vaginal-dryness-treatment', title: 'Menopausal Vaginal Dryness', group: 'Prescriptions' },
  { slug: 'prescriptions-cystitis-uti-treatment', path: '/prescriptions/cystitis-uti-treatment', title: 'Cystitis / UTI', group: 'Prescriptions' },
  { slug: 'prescriptions-bacterial-vaginosis-treatment', path: '/prescriptions/bacterial-vaginosis-treatment', title: 'Bacterial Vaginosis', group: 'Prescriptions' },
  { slug: 'prescriptions-self-injectable', path: '/prescriptions/self-injectable', title: 'Self Injectable', group: 'Prescriptions' },
  { slug: 'prescriptions-weight-management-consultation', path: '/prescriptions/weight-management-consultation', title: 'Weight Management Consultation', group: 'Prescriptions' },
  { slug: 'prescriptions-hay-fever', path: '/prescriptions/hay-fever', title: 'Hay Fever', group: 'Prescriptions' },
  { slug: 'prescriptions-anaphylaxis', path: '/prescriptions/anaphylaxis', title: 'Anaphylaxis', group: 'Prescriptions' },
  { slug: 'prescriptions-acne-treatment', path: '/prescriptions/acne-treatment', title: 'Acne Treatment', group: 'Prescriptions' },
  { slug: 'prescriptions-rosacea-treatment', path: '/prescriptions/rosacea-treatment', title: 'Rosacea Treatment', group: 'Prescriptions' },
  { slug: 'prescriptions-cold-sore-treatments', path: '/prescriptions/cold-sore-treatments', title: 'Cold Sore Treatments', group: 'Prescriptions' },
  { slug: 'prescriptions-eczema-treatment', path: '/prescriptions/eczema-treatment', title: 'Eczema Treatment', group: 'Prescriptions' },
  { slug: 'prescriptions-plaque-psoriasis-treatment', path: '/prescriptions/plaque-psoriasis-treatment', title: 'Plaque Psoriasis', group: 'Prescriptions' },
  { slug: 'prescriptions-asthma-treatment', path: '/prescriptions/asthma-treatment', title: 'Asthma Treatment', group: 'Prescriptions' },
  { slug: 'prescriptions-migraine-treatment', path: '/prescriptions/migraine-treatment', title: 'Migraine Treatment', group: 'Prescriptions' },
  { slug: 'prescriptions-stop-smoking-treatment', path: '/prescriptions/stop-smoking-treatment', title: 'Stop Smoking', group: 'Prescriptions' },
  { slug: 'prescriptions-hypothyroidism-treatment', path: '/prescriptions/hypothyroidism-treatment', title: 'Hypothyroidism', group: 'Prescriptions' },
  { slug: 'prescriptions-male-hair-loss', path: '/prescriptions/male-hair-loss', title: 'Male Hair Loss', group: 'Prescriptions' },
  { slug: 'prescriptions-erectile-dysfunction-treatment', path: '/prescriptions/erectile-dysfunction-treatment', title: 'Erectile Dysfunction', group: 'Prescriptions' },
  { slug: 'prescriptions-premature-ejaculation-treatment', path: '/prescriptions/premature-ejaculation-treatment', title: 'Premature Ejaculation', group: 'Prescriptions' },
  { slug: 'prescriptions-excess-female-facial-hair', path: '/prescriptions/excess-female-facial-hair', title: 'Excess Female Facial Hair', group: 'Prescriptions' },
  { slug: 'prescriptions-hpv-vaccine', path: '/prescriptions/hpv-vaccine', title: 'HPV Vaccine', group: 'Prescriptions' },
  { slug: 'prescriptions-genital-herpes', path: '/prescriptions/genital-herpes', title: 'Genital Herpes', group: 'Prescriptions' },
  { slug: 'prescriptions-travel-vaccines-anti-malaria', path: '/prescriptions/travel-vaccines-anti-malaria', title: 'Travel Vaccines & Anti-Malaria', group: 'Prescriptions' },
  { slug: 'prescriptions-jet-lag-prescription', path: '/prescriptions/jet-lag-prescription', title: 'Jet Lag Prescription', group: 'Prescriptions' },
  { slug: 'prescriptions-calculate-bmi', path: '/prescriptions/calculate-bmi', title: 'Calculate your BMI', group: 'Prescriptions' },
];

const consultationPages: SitePageDef[] = [
  { slug: 'consultation-female-doctor', path: '/consultation/female-doctor', title: 'Video Consultation — Female Doctor', group: 'Video consultation' },
  { slug: 'consultation-male-doctor', path: '/consultation/male-doctor', title: 'Video Consultation — Male Doctor', group: 'Video consultation' },
  { slug: 'consultation-portuguese', path: '/consultation/portuguese', title: 'Video Consultation in Portuguese', group: 'Video consultation' },
  { slug: 'consultation-spanish', path: '/consultation/spanish', title: 'Video Consultation in Spanish', group: 'Video consultation' },
];

export const SITE_PAGE_REGISTRY: SitePageDef[] = [
  { slug: 'home', path: '/', title: 'Home', group: 'Main' },
  { slug: 'contact', path: '/contact', title: 'Contact', group: 'Main' },
  { slug: 'help', path: '/help', title: 'Help & Support', group: 'Main' },
  { slug: 'doctors', path: '/doctors', title: 'Find a Doctor', group: 'Main' },
  { slug: 'medical-certificates', path: '/medical-certificates', title: 'Medical Certificates', group: 'Main' },
  { slug: 'consultation', path: '/consultation', title: 'Video Consultation', group: 'Main' },
  { slug: 'blog', path: '/blog', title: 'Blog', group: 'Main' },
  { slug: 'doctor-apply', path: '/doctor/apply', title: 'Become a Doctor', group: 'Main' },
  { slug: 'privacy', path: '/privacy', title: 'Privacy Policy', group: 'Legal' },
  { slug: 'terms', path: '/terms', title: 'Terms of Service', group: 'Legal' },
  { slug: 'refund-policy', path: '/refund-policy', title: 'Refund Policy', group: 'Legal' },
  ...consultationPages,
  ...prescriptionPages,
];

export function registryBySlug(slug: string): SitePageDef | undefined {
  return SITE_PAGE_REGISTRY.find((p) => p.slug === slug);
}
