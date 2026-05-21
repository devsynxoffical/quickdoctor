"use client";

import Link from 'next/link';
import { getLoginUrl, isPatient } from '@/lib/auth';

type PatientAreaLinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

/** Sends guests to login first; patients go straight to the destination. */
export default function PatientAreaLink({ href, className, children }: PatientAreaLinkProps) {
  const dest = isPatient() ? href : getLoginUrl(href);
  return (
    <Link href={dest} className={className}>
      {children}
    </Link>
  );
}
