"use client";

import { Suspense } from 'react';
import DoctorApplicationStatusPage from './DoctorApplicationStatusContent';

export default function DoctorApplicationStatusWrapper() {
  return (
    <Suspense fallback={<main className="min-h-screen pt-28 text-center text-slate-400">Loading…</main>}>
      <DoctorApplicationStatusPage />
    </Suspense>
  );
}
