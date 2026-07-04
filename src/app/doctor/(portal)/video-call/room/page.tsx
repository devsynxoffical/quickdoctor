import { Suspense } from 'react';
import DoctorVideoCallClient from './DoctorVideoCallClient';

export default function DoctorVideoCallPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-slate-500">Loading video call…</div>}>
      <DoctorVideoCallClient />
    </Suspense>
  );
}
