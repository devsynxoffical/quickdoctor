"use client";

import React, { useState } from 'react';
import { authApi } from '@/lib/api';

type ChangePasswordFormProps = {
  className?: string;
};

export default function ChangePasswordForm({ className }: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setSaving(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMessage('Password updated successfully.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not update password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className={`space-y-4 ${className || ''}`}>
      <div>
        <h2 className="font-black text-lg">Change password</h2>
        <p className="text-sm text-slate-500 mt-1">Enter your current password and choose a new one.</p>
      </div>

      <input
        type="password"
        autoComplete="current-password"
        placeholder="Current password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
        className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none text-sm"
      />
      <input
        type="password"
        autoComplete="new-password"
        placeholder="New password (min 8 characters)"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none text-sm"
      />
      <input
        type="password"
        autoComplete="new-password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none text-sm"
      />

      {error && <p className="text-sm text-red-600 font-bold">{error}</p>}
      {message && <p className="text-sm text-emerald-600 font-bold">{message}</p>}

      <button
        type="submit"
        disabled={saving}
        className="px-6 py-3 bg-primary text-white rounded-2xl font-black text-sm disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Update password'}
      </button>
    </form>
  );
}
