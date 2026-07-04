"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Video, ChevronLeft, ExternalLink } from 'lucide-react';
import { appointmentApi } from '@/lib/api';
import { doctorConsultationUrl } from '@/lib/doctorRoutes';

export default function DoctorVideoCallClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const appointmentId = searchParams.get('id') || '';
  const [joinUrl, setJoinUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!appointmentId) {
      setMessage('Missing appointment id.');
      setLoading(false);
      return;
    }

    appointmentApi
      .getJoin(appointmentId)
      .then((r) => {
        if (r.canJoin && r.url) {
          if (r.url.includes('/doctor/consultations') || r.url.includes('/doctor/video-call')) {
            setMessage(
              'Dev mode: video is simulated. Use the consultation room to manage notes, prescriptions, and certificates.'
            );
          } else {
            setJoinUrl(r.url);
          }
        } else {
          setMessage(r.message || 'Video is not available for this appointment yet.');
        }
      })
      .catch((e: unknown) => setMessage(e instanceof Error ? e.message : 'Could not load video'))
      .finally(() => setLoading(false));
  }, [appointmentId]);

  if (!appointmentId) {
    return (
      <div className="max-w-xl mx-auto py-10 text-center space-y-4">
        <p className="text-red-600 font-bold">Invalid video link.</p>
        <Link href="/doctor/consultations" className="text-secondary font-bold">
          Back to consultations
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      <button
        type="button"
        onClick={() => router.push(doctorConsultationUrl(appointmentId))}
        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-secondary"
      >
        <ChevronLeft className="w-4 h-4" /> Back to consultation room
      </button>

      <div className="glass p-8 rounded-3xl text-center space-y-6">
        <Video className="w-16 h-16 text-secondary mx-auto" />
        <h1 className="text-2xl font-black">Host video consultation</h1>

        {loading && <p className="text-slate-500">Checking your appointment…</p>}

        {!loading && joinUrl && (
          <>
            <p className="text-slate-600 text-sm">
              Your secure video room is ready. Click below to start the consultation.
            </p>
            <button
              type="button"
              onClick={() => window.open(joinUrl, '_blank', 'noopener,noreferrer')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-white rounded-xl font-black"
            >
              Start video call <ExternalLink className="w-4 h-4" />
            </button>
          </>
        )}

        {!loading && !joinUrl && message && <p className="text-slate-600 text-sm">{message}</p>}

        <Link
          href={doctorConsultationUrl(appointmentId)}
          className="block text-sm font-bold text-secondary"
        >
          Open consultation room
        </Link>
      </div>
    </div>
  );
}
