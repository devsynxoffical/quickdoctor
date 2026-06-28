"use client";

import { usePathname } from 'next/navigation';
import CmsPageGate from '@/components/CmsPageGate';

function pathToSlug(path: string): string {
  return path.replace(/^\//, '').replace(/\//g, '-');
}

export default function ConsultationCmsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const slug = pathToSlug(pathname);
  return <CmsPageGate slug={slug}>{children}</CmsPageGate>;
}
