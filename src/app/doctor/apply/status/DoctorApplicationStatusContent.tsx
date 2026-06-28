"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, XCircle, ArrowRight, Mail, Lock } from 'lucide-react';
import { doctorApplyApi } from '@/lib/api';
import { getToken, saveSession } from '@/lib/auth';

type Status = 'PENDING' | 'APPROVED' | 'REJECTED' | string;

export default function DoctorApplicationStatusPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const [specialty, setSpecialty] = useState<string | null>(null);
  const [canAccessPortal, setCanAccessPortal] = useState(false);
  const [form, setForm] = useState({
    email: searchParams.get('email') ?? '',
    password: '',
  });

  const loadStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      type StatusPayload = Awaited<ReturnType<typeof doctorApplyApi.checkStatus>>;
      const data: StatusPayload = token
        ? ((await doctorApplyApi.status()) as StatusPayload)
        : await doctorApplyApi.checkStatus(form);
      setStatus(data.application.status);
      setSpecialty(data.application.specialtyCategory?.name ?? null);
      setCanAccessPortal(data.canAccessPortal);
      if (data.token && data.user) {
        saveSession(data.token, data.user, { pendingApproval: Boolean(data.pendingApproval) });
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Could not load application status');
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (getToken()) {
      loadStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const icon =
    status === 'APPROVED' ? (
      <CheckCircle2 className="w-12 h-12 text-green-600" />
    ) : status === 'REJECTED' ? (
      <XCircle className="w-12 h-12 text-red-600" />
    ) : status ? (
      <Clock className="w-12 h-12 text-amber-600" />
    ) : null;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 pb-20 px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto glass p-10 rounded-[40px] medical-shadow space-y-6"
      >
        <h1 className="text-3xl font-black text-dark-slate dark:text-white">Application status</h1>

        {!status && !loading && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              loadStatus();
            }}
            className="space-y-4"
          >
            <p className="text-sm text-slate-500">
              Enter the email and password you used when applying.
            </p>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="Email"
                className="w-full pl-12 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="Password"
                className="w-full pl-12 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-secondary text-white rounded-2xl font-black disabled:opacity-50"
            >
              {loading ? 'Checking…' : 'Check status'}
            </button>
          </form>
        )}

        {loading && status === null && <p className="text-slate-500">Loading…</p>}
        {error && (
          <p className="text-red-600 font-bold">
            {error}.{' '}
            <Link href="/doctor/apply" className="underline">
              Submit an application
            </Link>
          </p>
        )}

        {status && (
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
