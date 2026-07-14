'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Patients no longer pick a doctor — booking is category-based via /book. */
export default function DoctorsListRedirectPage() {
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
