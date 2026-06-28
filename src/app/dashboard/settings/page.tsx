"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { accountApi } from '@/lib/api';
import { clearSession, getStoredUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function PatientSettingsPage() {
  const router = useRouter();
  const user = getStoredUser();
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const exportData = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const data = await accountApi.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quickdoctor-export-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage('Your data export has downloaded.');
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : 'Export failed');
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (!confirm('This will deactivate your account. Continue?')) return;
    setLoading(true);
    try {
      await accountApi.deleteAccount(email);
      clearSession();
      router.push('/');
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  const acceptPrivacy = async () => {
    try {
      await accountApi.recordConsent('PRIVACY_POLICY');
      setMessage('Privacy consent recorded.');
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : 'Failed');
    }
  };

  return (
    <DashboardLayout>
      <section className="space-y-8 max-w-xl">
        <div>
          <h1 className="text-4xl font-black">Account settings</h1>
          <p className="text-slate-500 mt-2">Profile, privacy, and GDPR tools.</p>
        </div>

        {message && (
          <p className="p-4 rounded-2xl bg-green-50 text-green-700 font-bold text-sm">{message}</p>
        )}

        <article className="glass p-6 rounded-3xl space-y-3">
          <h2 className="font-black">Your profile</h2>
          <dl className="text-sm space-y-2">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500 font-bold">Name</dt>
              <dd className="font-black text-right">
                {user?.firstName} {user?.lastName}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500 font-bold">Email</dt>
              <dd className="font-black text-right">{user?.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500 font-bold">Account type</dt>
              <dd className="font-black text-right uppercase text-primary">{user?.role || 'Patient'}</dd>
            </div>
          </dl>
          <Link
            href="/forgot-password"
            className="inline-block text-sm font-bold text-primary hover:underline mt-2"
          >
            Change password
          </Link>
        </article>

        <article className="glass p-6 rounded-3xl space-y-4">
          <h2 className="font-black">Privacy consent</h2>
          <p className="text-sm text-slate-500">
            Record acceptance of our{' '}
            <Link href="/privacy" className="text-primary font-bold hover:underline">
              privacy policy
            </Link>
            .
          </p>
          <button
            type="button"
            onClick={acceptPrivacy}
            className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm"
          >
            Accept privacy policy (v1.0)
          </button>
        </article>

        <article className="glass p-6 rounded-3xl space-y-4">
          <h2 className="font-black">Export my data</h2>
          <p className="text-sm text-slate-500">
            Download a JSON copy of your appointments, prescriptions, and account data (GDPR).
          </p>
          <button
            type="button"
            disabled={loading}
            onClick={exportData}
            className="px-6 py-3 bg-slate-800 text-white rounded-xl font-bold text-sm disabled:opacity-50"
          >
            Download JSON export
          </button>
        </article>

        <article className="glass p-6 rounded-3xl space-y-4 border-2 border-red-100">
          <h2 className="font-black text-red-600">Delete account</h2>
          <p className="text-sm text-slate-500">Confirm your email to deactivate your account.</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
            placeholder="Your email"
          />
          <button
            type="button"
            disabled={loading}
            onClick={deleteAccount}
            className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold text-sm disabled:opacity-50"
          >
            Delete my account
          </button>
        </article>
      </section>
    </DashboardLayout>
  );
}
