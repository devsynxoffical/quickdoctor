"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { Video, ChevronLeft, ExternalLink } from 'lucide-react';
import { appointmentApi } from '@/lib/api';

export default function PatientVideoCallClient() {
  const { id } = useParams();
  const router = useRouter();
  const [joinUrl, setJoinUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appointmentApi
      .getJoin(String(id))
      .then((r) => {
        if (r.canJoin && r.url) {
          if (r.url.includes('/dashboard/video-call/')) {
            setMessage('Dev mode: your doctor will start the consultation from their portal. Stay on this page until they join.');
          } else {
            setJoinUrl(r.url);
          }
        } else {
          setMessage(r.message || 'Video is not available for this appointment yet.');
        }
      })
      .catch((e: unknown) => setMessage(e instanceof Error ? e.message : 'Could not load video'))
      .finally(() => setLoading(false));
  }, [id]);

  const openMeeting = () => {
    if (joinUrl) window.open(joinUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto py-10 space-y-6">
        <button
          type="button"
          onClick={() => router.push('/dashboard/appointments')}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary"
        >
          <ChevronLeft className="w-4 h-4" /> Back to appointments
        </button>

        <div className="glass p-8 rounded-3xl text-center space-y-6">
          <Video className="w-16 h-16 text-primary mx-auto" />
          <h1 className="text-2xl font-black">Video consultation</h1>

          {loading && <p className="text-slate-500">Checking your appointment…</p>}

          {!loading && joinUrl && (
            <>
              <p className="text-slate-600 text-sm">
                Your secure video room is ready. Click below to join the consultation.
              </p>
              <button
                type="button"
                onClick={openMeeting}
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-black"
              >
                Join video call <ExternalLink className="w-4 h-4" />
              </button>
            </>
          )}

          {!loading && !joinUrl && message && (
            <p className="text-slate-600 text-sm">{message}</p>
          )}

          <Link href="/dashboard/appointments" className="block text-sm font-bold text-primary">
            View all appointments
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
