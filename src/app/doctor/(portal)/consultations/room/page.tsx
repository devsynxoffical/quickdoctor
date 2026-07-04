import { Suspense } from 'react';
import ConsultationRoomClient from '../[id]/ConsultationRoomClient';

export default function ConsultationRoomPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-slate-500">Loading consultation room…</div>}>
      <ConsultationRoomClient />
    </Suspense>
  );
}
