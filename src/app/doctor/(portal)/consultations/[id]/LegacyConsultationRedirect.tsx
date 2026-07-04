"use client";

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doctorConsultationUrl } from '@/lib/doctorRoutes';

export default function LegacyConsultationRedirect() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const raw = params.id;
    const appointmentId = Array.isArray(raw) ? raw[0] : raw;
    if (appointmentId && appointmentId !== '_') {
      router.replace(doctorConsultationUrl(appointmentId));
    } else {
      router.replace('/doctor/consultations');
    }
  }, [params.id, router]);

  return <div className="p-10 text-center text-slate-500">Opening consultation…</div>;
}
