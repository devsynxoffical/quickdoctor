import CmsPageGate from '@/components/CmsPageGate';

export default function MedicalCertificatesLayout({ children }: { children: React.ReactNode }) {
  return <CmsPageGate slug="medical-certificates">{children}</CmsPageGate>;
}
