"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { authApi } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authApi.forgotPassword(email.trim());
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="pt-32 pb-24 px-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="glass rounded-[40px] p-8 md:p-12 medical-shadow">
            <h1 className="text-3xl font-black text-center mb-2">Forgot password</h1>
            <p className="text-slate-500 text-center text-sm mb-8">
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>

            {sent ? (
              <div className="space-y-6 text-center">
                <p className="text-slate-600 dark:text-slate-300 font-medium">
                  If an account exists for that email, a reset link has been sent. Check your inbox.
                </p>
                <Link href="/login" className="inline-flex items-center gap-2 text-primary font-bold">
                  <ArrowLeft className="w-4 h-4" />
                  Back to sign in
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-bold">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-black disabled:opacity-50"
                >
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>
                <p className="text-center text-sm">
                  <Link href="/login" className="text-primary font-bold hover:underline">
                    Back to sign in
                  </Link>
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
