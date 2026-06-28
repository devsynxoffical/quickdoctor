"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPrescriptionsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard/records');
  }, [router]);
  return null;
}
