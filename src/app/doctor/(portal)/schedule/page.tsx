"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DoctorSchedulePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/doctor/settings');
  }, [router]);
  return <p className="text-slate-400">Redirecting to availability settings…</p>;
}
