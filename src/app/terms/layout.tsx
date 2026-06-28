import CmsPageGate from '@/components/CmsPageGate';

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <CmsPageGate slug="terms">{children}</CmsPageGate>;
}
