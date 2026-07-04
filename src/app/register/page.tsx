"use client";

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Stethoscope, User, Calendar, Mail, Lock, UserPlus, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { authApi } from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { getLoginUrl, resolvePatientRedirect, saveSession } from '@/lib/auth';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const intent = searchParams.get('intent');
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    email: '',
    password: '',
    otp: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'email') {
      setOtpSent(false);
    }
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      setError('Enter your email first.');
      return;
    }
    setOtpLoading(true);
    setError(null);
    setInfo(null);
    try {
      const response = await authApi.sendRegistrationOtp(formData.email);
      setOtpSent(true);
      setInfo(response.message);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not send verification code');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.dob || !formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }
    if (!formData.otp || formData.otp.length !== 6) {
      setError('Enter the 6-digit verification code sent to your email.');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.register(formData);
      saveSession(response.token, response.user);
      router.push(resolvePatientRedirect(redirect));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const loginHref = getLoginUrl(redirect ?? undefined, intent ?? undefined);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg"
    >
      <div className="glass rounded-[40px] p-8 md:p-12 medical-shadow">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Stethoscope className="text-primary w-8 h-8" />
        </div>

        <h1 className="text-3xl font-black text-center mb-2">Create patient account</h1>
        <p className="text-slate-500 text-center text-sm mb-8">
          Register to book video consultations, view prescriptions, and manage appointments.
        </p>

        {intent === 'book' && (
          <p className="mb-6 p-4 bg-primary/10 border border-primary/20 text-primary rounded-2xl text-sm font-bold text-center">
            Create your account, then you&apos;ll return to complete your booking.
          </p>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-bold">
            {error}
          </div>
        )}

        {info && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-sm font-bold">
            {info}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">First name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Last name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Date of birth</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpLoading || !formData.email}
                className="shrink-0 px-4 py-4 rounded-2xl bg-slate-900 text-white text-sm font-bold disabled:opacity-50"
              >
                {otpLoading ? 'Sending…' : otpSent ? 'Resend' : 'Send code'}
              </button>
            </div>
            <p className="text-xs text-slate-400">We&apos;ll email a 6-digit code to verify your address.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Verification code</label>
            <div className="relative">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                required
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                placeholder="6-digit code"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary tracking-widest"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                placeholder="At least 8 characters"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            To book a consultation, use{' '}
            <Link href="/doctors" className="text-primary font-bold hover:underline">
              Find a doctor
            </Link>{' '}
            after registering. Doctors should apply via{' '}
            <Link href="/doctor/apply" className="text-secondary font-bold hover:underline">
              Become a doctor
            </Link>
            .
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-primary text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Create account'}
            <UserPlus className="w-5 h-5" />
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 pt-6">
          Already have an account?{' '}
          <Link href={loginHref} className="text-primary font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="pt-32 pb-24 px-6 flex items-center justify-center">
        <Suspense fallback={<p className="text-slate-500 font-bold">Loading…</p>}>
          <RegisterForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
