import CmsPageGate from '@/components/CmsPageGate';

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return <CmsPageGate slug="help">{children}</CmsPageGate>;
}
