"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, XCircle, ArrowRight } from 'lucide-react';
import { doctorApplyApi } from '@/lib/api';

type Status = 'PENDING' | 'APPROVED' | 'REJECTED' | string;

export default function DoctorApplicationStatusPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const [specialty, setSpecialty] = useState<string | null>(null);
  const [canAccessPortal, setCanAccessPortal] = useState(false);

  useEffect(() => {
    doctorApplyApi
      .status()
      .then((data) => {
        setStatus(data.application.status);
        setSpecialty(data.application.specialtyCategory?.name ?? null);
        setCanAccessPortal(data.canAccessPortal);
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : 'Could not load application status');
      })
      .finally(() => setLoading(false));
  }, []);

  const icon =
    status === 'APPROVED' ? (
      <CheckCircle2 className="w-12 h-12 text-green-600" />
    ) : status === 'REJECTED' ? (
      <XCircle className="w-12 h-12 text-red-600" />
    ) : (
      <Clock className="w-12 h-12 text-amber-600" />
    );

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 pb-20 px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto glass p-10 rounded-[40px] medical-shadow space-y-6"
      >
        <h1 className="text-3xl font-black text-dark-slate dark:text-white">Application status</h1>

        {loading && <p className="text-slate-500">Loading…</p>}
        {error && (
          <p className="text-red-600 font-bold">
            {error}.{' '}
            <Link href="/doctor/apply" className="underline">
              Submit an application
            </Link>
          </p>
        )}

        {!loading && !error && status && (
          <>
            <div className="flex items-center gap-4">{icon}</div>
            <p className="text-lg font-bold text-slate-700 dark:text-slate-200">
              Your application is <span className="text-secondary">{status}</span>
              {specialty ? ` (${specialty})` : ''}.
            </p>
            {status === 'PENDING' && (
              <p className="text-sm text-slate-500">
                Our team is reviewing your credentials. You will receive an email when a decision is made.
              </p>
            )}
            {status === 'REJECTED' && (
              <p className="text-sm text-slate-500">
                Contact support if you believe this was a mistake, or submit updated documents.
              </p>
            )}
            {canAccessPortal && (
              <Link
                href="/doctor"
                className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-xl font-black"
              >
                Open doctor portal <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </>
        )}

        <Link href="/" className="text-sm font-bold text-slate-400 hover:text-primary">
          Back to home
        </Link>
      </motion.div>
    </main>
  );
}
