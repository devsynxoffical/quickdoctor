"use client";

import { usePathname } from 'next/navigation';
import CmsPageGate from '@/components/CmsPageGate';

function pathToSlug(path: string): string {
  if (path === '/') return 'home';
  return path.replace(/^\//, '').replace(/\//g, '-');
}

export default function PrescriptionsCmsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const slug = pathToSlug(pathname);
  return <CmsPageGate slug={slug}>{children}</CmsPageGate>;
}
