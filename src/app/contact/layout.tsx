import CmsPageGate from '@/components/CmsPageGate';

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <CmsPageGate slug="contact">{children}</CmsPageGate>;
}
