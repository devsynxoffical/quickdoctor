'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Legacy consultation subtypes removed — all go to /book. */
export default function LegacyConsultationRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/book');
  }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-bold">
      Redirecting to booking…
    </div>
  );
}
