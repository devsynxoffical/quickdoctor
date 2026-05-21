"use client";

import React, { useState } from 'react';
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
        <h1 className="text-4xl font-black">Privacy & account</h1>
        <p className="text-slate-500">GDPR tools: export your data or request account deletion.</p>

        {message && (
          <p className="p-4 rounded-2xl bg-green-50 text-green-700 font-bold text-sm">{message}</p>
        )}

        <article className="glass p-6 rounded-3xl space-y-4">
          <h2 className="font-black">Privacy consent</h2>
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
