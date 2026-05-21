"use client";

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Stethoscope, Mail, Lock, LogIn } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { authApi } from '@/lib/api';
import {
  getRegisterUrl,
  getToken,
  getStoredUser,
  resolvePostLoginPath,
  saveSession,
} from '@/lib/auth';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const intent = searchParams.get('intent');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ email: '', password: '' });

  useEffect(() => {
    const token = getToken();
    const user = getStoredUser();
    if (token && user) {
      router.replace(resolvePostLoginPath(user.role, redirect));
    }
  }, [redirect, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.login(formData);
      saveSession(response.token, response.user);
      router.push(resolvePostLoginPath(response.user?.role, redirect));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const registerHref = getRegisterUrl(redirect ?? undefined, intent ?? undefined);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-[40px] p-8 md:p-12 medical-shadow text-center"
      >
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Stethoscope className="text-primary w-8 h-8" />
        </div>

        <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
        <p className="text-slate-500 mb-4">Sign in to your QuickDoctor patient account</p>
        {intent === 'book' && (
          <p className="text-sm font-bold text-primary mb-6 px-4 py-2 rounded-xl bg-primary/10">
            Sign in or create an account to complete your booking.
          </p>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary transition-all"
                required
              />
            </div>
          </div>

          <motion.div className="space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
              <Link href="/forgot-password" className="text-xs font-bold text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary transition-all"
                required
              />
            </div>
          </motion.div>

          <motion.div className="pt-4" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-primary text-white rounded-2xl font-bold text-lg medical-shadow hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
              <LogIn className="w-6 h-6" />
            </button>
          </motion.div>
        </form>

        <p className="text-center text-sm text-slate-500 pt-6">
          Don&apos;t have an account?{' '}
          <Link href={registerHref} className="text-primary font-bold hover:underline">
            Register now
          </Link>
        </p>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Staff portals</p>
          <motion.div className="flex flex-wrap justify-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            <Link href="/doctor" className="text-xs font-bold text-secondary hover:underline">
              Doctor portal →
            </Link>
            <span className="text-slate-300">|</span>
            <Link href="/admin" className="text-xs font-bold text-dark-slate dark:text-slate-300 hover:underline">
              Admin portal →
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <div className="mt-8 flex justify-center gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
        <Link href="/privacy" className="hover:text-primary">Privacy</Link>
        <span>•</span>
        <Link href="/terms" className="hover:text-primary">Terms</Link>
        <span>•</span>
        <Link href="/help" className="hover:text-primary">Support</Link>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="pt-32 pb-24 px-6 flex items-center justify-center">
        <Suspense fallback={<p className="text-slate-500 font-bold">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
