/** Full CMS section templates — mirrors live page content for admin editing. */

import type { SitePageDef } from './sitePagesRegistry';

export type SectionTemplate = {
  type: string;
  sortOrder: number;
  contentJson: Record<string, unknown>;
};

export function homePageSections(): SectionTemplate[] {
  return [
    {
      type: 'HERO',
      sortOrder: 0,
      contentJson: {
        headline: 'Healthcare that fits your life, not the other way around.',
        subheadline:
          'Access expert GP consultations, prescriptions, and specialist referrals from the comfort of your home in minutes.',
        ctaLabel: 'Book an Appointment',
        ctaHref: '/book',
        secondaryCtaLabel: 'How it Works',
        secondaryCtaHref: '/contact',
        backgroundImageUrl: '',
      },
    },
    {
      type: 'STATS',
      sortOrder: 1,
      contentJson: {
        items: [
          { value: '500k+', label: 'Patients Treated' },
          { value: '4.9/5', label: 'Trustpilot Rating' },
          { value: '150+', label: 'Expert Doctors' },
          { value: '10min', label: 'Avg. Wait Time' },
        ],
      },
    },
    {
      type: 'APPOINTMENTS',
      sortOrder: 2,
      contentJson: {
        title: 'Available appointments',
        subtitle: 'Book a live session with our licensed General Practitioners today.',
        viewMoreHref: '/book',
        items: [
          { time: '09:45', date: 'Today', price: '€49', badge: 'Live' },
          { time: '10:30', date: 'Today', price: '€49', badge: '' },
          { time: '11:15', date: 'Today', price: '€49', badge: '' },
          { time: '14:00', date: 'Today', price: '€49', badge: 'Popular' },
        ],
      },
    },
    {
      type: 'FEATURES',
      sortOrder: 3,
      contentJson: {
        title: 'Professional Care Delivered Digitally',
        subtitle:
          'Get medical advice, prescriptions, and certificates from the comfort of your home within minutes.',
        items: [
          {
            title: 'Video Consultation',
            description:
              'Face-to-face appointments with Irish Medical Council registered doctors on our secure platform.',
            ctaLabel: 'Book Now',
            ctaHref: '/book',
          },
          {
            title: 'Digital Prescription',
            description: 'Receive prescriptions directly to your local pharmacy after clinical review.',
            ctaLabel: 'Get Prescription',
            ctaHref: '/dashboard',
          },
          {
            title: 'Medical Certificates',
            description:
              'Official medical certs and referral letters delivered quickly through your patient account.',
            ctaLabel: 'Request Certificate',
            ctaHref: '/dashboard/records',
          },
        ],
        benefits: [
          'Secure Consultations',
          'Irish Medical Council GPs',
          'Encrypted Records',
          'EU Health Compliance',
        ],
      },
    },
    {
      type: 'JOURNEY',
      sortOrder: 4,
      contentJson: {
        title: 'Your healthcare journey',
        items: [
          {
            step: '1',
            title: 'Book',
            description:
              'Choose a time that works for you. Appointments are available throughout the day.',
          },
          {
            step: '2',
            title: 'Connect',
            description:
              'Join your secure video consultation from your smartphone, tablet, or laptop.',
          },
          {
            step: '3',
            title: 'Get Care',
            description:
              'Receive medical advice, prescriptions, or referrals instantly where appropriate.',
          },
        ],
      },
    },
    {
      type: 'SECURITY',
      sortOrder: 5,
      contentJson: {
        title: 'Safe, secure, and regulated.',
        imageUrl: '/images/saftey-removebg-preview.png',
        items: [
          {
            title: 'CQC Regulated',
            description: 'We meet national standards for safety and quality of digital care delivery.',
          },
          {
            title: 'Data Privacy',
            description:
              'Medical records are encrypted and managed using strict GDPR-grade controls.',
          },
          {
            title: 'Qualified Doctors',
            description:
              'All clinicians are experienced, registered, and held to high governance standards.',
          },
        ],
      },
    },
    {
      type: 'CTA',
      sortOrder: 6,
      contentJson: {
        text: 'Ready to see a doctor?',
        subtext:
          'Join thousands of patients who trust QuickDoctor for their daily healthcare needs. Available 7 days a week.',
        label: 'Book Now - €49',
        href: '/book',
      },
    },
  ];
}

export function getTemplateSections(def: SitePageDef): SectionTemplate[] {
  if (def.slug === 'home') {
    return homePageSections();
  }
  return [
    {
      type: 'HERO',
      sortOrder: 0,
      contentJson: {
        headline: def.title,
        subheadline: `Learn about ${def.title} at QuickDoctor — book online video consultations with licensed doctors.`,
        ctaLabel: 'Book a consultation',
        ctaHref: '/book',
        secondaryCtaLabel: '',
        secondaryCtaHref: '',
        backgroundImageUrl: '',
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
        subtext: '',
        label: 'Find a doctor',
        href: '/book',
      },
    },
  ];
}
