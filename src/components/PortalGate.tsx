"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Stethoscope, Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import { authApi } from '@/lib/api';
import {
  UserRole,
  clearSession,
  getStoredUser,
  getToken,
  isPendingApproval,
  normalizeRole,
  StoredUser,
  saveSession,
} from '@/lib/auth';

type PortalGateProps = {
  requiredRole: UserRole;
  portalTitle: string;
  portalDescription: string;
  accent?: 'admin' | 'doctor';
  children: React.ReactNode;
};

const PortalGate = ({
  requiredRole,
  portalTitle,
  portalDescription,
  accent = requiredRole === 'ADMIN' ? 'admin' : 'doctor',
  children,
}: PortalGateProps) => {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wrongRole, setWrongRole] = useState<string | null>(null);
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    const validate = async () => {
      const token = getToken();
      const user = getStoredUser();
      if (!token || !user) {
        setUnlocked(false);
        setWrongRole(null);
        setReady(true);
        return;
      }

      try {
        const { user: liveUser } = await authApi.me();
        saveSession(token, liveUser as StoredUser);
        const role = normalizeRole(liveUser.role);
        if (role === requiredRole) {
          setUnlocked(true);
          setWrongRole(null);
        } else {
          setUnlocked(false);
          setWrongRole(role ?? 'UNKNOWN');
        }
      } catch {
        clearSession();
        setUnlocked(false);
        setWrongRole(null);
      } finally {
        setReady(true);
      }
    };

    validate();

    const onExpired = () => {
      setUnlocked(false);
      setWrongRole(null);
    };
    window.addEventListener('session-expired', onExpired);
    return () => window.removeEventListener('session-expired', onExpired);
  }, [requiredRole]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.login(form);
      const role = normalizeRole(response.user?.role);
      if (role !== requiredRole) {
        clearSession();
        setError(
          role === 'PATIENT'
            ? 'This portal is for staff only. Patients should use the main site login.'
            : role === 'ADMIN' && requiredRole === 'DOCTOR'
              ? 'This is the doctor portal. Use /admin for administrator access.'
              : role === 'DOCTOR' && requiredRole === 'ADMIN'
                ? 'This is the admin portal. Use /doctor for doctor access.'
                : 'These credentials are not authorized for this portal.'
        );
        setUnlocked(false);
        return;
      }
      saveSession(response.token, response.user, {
        pendingApproval: Boolean(response.pendingApproval),
      });
      setUnlocked(true);
      setWrongRole(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchAccount = () => {
    clearSession();
    setUnlocked(false);
    setWrongRole(null);
    setForm({ email: '', password: '' });
    setError(null);
  };

  if (!ready) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"
      >
        <p className="text-slate-500 font-bold">Loading portal…</p>
      </motion.div>
    );
  }

  if (unlocked) {
    if (requiredRole === 'DOCTOR' && isPendingApproval()) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-6">
          <div className="max-w-lg w-full glass p-10 rounded-[40px] medical-shadow text-center space-y-6">
            <Stethoscope className="w-14 h-14 text-secondary mx-auto" />
            <h1 className="text-2xl font-black">Application under review</h1>
            <p className="text-slate-500 text-sm">
              Your doctor account is waiting for admin approval. You can sign in here to check status,
              but the full portal unlocks after approval.
            </p>
            <Link
              href="/doctor/apply/status"
              className="inline-block px-6 py-3 bg-secondary text-white rounded-xl font-black"
            >
              Check application status
            </Link>
            <button
              type="button"
              onClick={handleSwitchAccount}
              className="block w-full text-sm font-bold text-slate-400 hover:text-primary"
            >
              Sign out
            </button>
          </div>
        </div>
      );
    }
    return <>{children}</>;
  }

  const isAdmin = accent === 'admin';
  const Icon = isAdmin ? Shield : Stethoscope;
  const accentBg = isAdmin ? 'bg-dark-slate' : 'bg-secondary';
  const accentText = isAdmin ? 'text-dark-slate' : 'text-secondary';
  const buttonBg = isAdmin ? 'bg-dark-slate hover:bg-slate-800' : 'bg-secondary hover:bg-secondary/90';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to QuickDoctor
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-[40px] p-8 md:p-10 medical-shadow"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`w-16 h-16 ${accentBg} rounded-2xl flex items-center justify-center mx-auto mb-6 medical-shadow`}
            >
              <Icon className="text-white w-8 h-8" />
            </motion.div>

            <h1 className="text-2xl md:text-3xl font-black text-center mb-2">{portalTitle}</h1>
            <p className="text-slate-500 text-center text-sm mb-8">{portalDescription}</p>

            {wrongRole && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-sm">
                <p className="font-bold">Signed in as {wrongRole}</p>
                <p className="mt-1">Sign in with {requiredRole.toLowerCase()} credentials to unlock this portal.</p>
                <button
                  type="button"
                  onClick={handleSwitchAccount}
                  className={`mt-3 text-xs font-black uppercase tracking-widest ${accentText} hover:underline`}
                >
                  Use a different account
                </button>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
                className="space-y-2"
              >
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email</label>
                <motion.div className="relative" whileFocus={{ scale: 1.01 }}>
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="staff@quickdoctor.com"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </div>
              </motion.div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className={`w-full py-4 ${buttonBg} text-white rounded-2xl font-black flex items-center justify-center gap-2 disabled:opacity-50 transition-all`}
              >
                {loading ? 'Unlocking…' : 'Unlock portal'}
                <LogIn className="w-5 h-5" />
              </motion.button>
            </form>

            <p className="text-center text-xs text-slate-400 mt-6">
              Patient?{' '}
              <Link href="/login" className="text-primary font-bold hover:underline">
                Sign in on the main site
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PortalGate;
