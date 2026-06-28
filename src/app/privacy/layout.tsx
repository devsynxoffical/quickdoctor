import CmsPageGate from '@/components/CmsPageGate';

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <CmsPageGate slug="privacy">{children}</CmsPageGate>;
}
