"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { doctorApplyApi, specialtyApi, type SpecialtyCategory } from '@/lib/api';
import { Stethoscope, ArrowRight, CheckCircle } from 'lucide-react';

export default function DoctorApplyPage() {
  const [categories, setCategories] = useState<SpecialtyCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    specialtyCategoryId: '',
    licenseNumber: '',
    bio: '',
    yearsExperience: '',
  });

  useEffect(() => {
    specialtyApi.list().then(setCategories).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await doctorApplyApi.apply(form);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Application failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-slate-50 dark:bg-slate-950"
      >
        <Navbar />
        <main className="pt-32 pb-24 px-6 max-w-lg mx-auto text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-black mb-4">Application submitted</h1>
          <p className="text-slate-500 mb-8">
            An admin will review your credentials. You will be able to sign in at the doctor portal once approved.
          </p>
          <Link href={`/doctor/apply/status?email=${encodeURIComponent(form.email)}`} className="text-secondary font-bold hover:underline block mb-4">
            Check application status
          </Link>
          <Link href="/" className="text-primary font-bold hover:underline">
            Return home
          </Link>
        </main>
        <Footer />
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="pt-28 pb-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto glass rounded-[40px] p-8 md:p-12 medical-shadow"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6"
          >
            <Stethoscope className="w-7 h-7 text-secondary" />
          </motion.div>
          <h1 className="text-3xl font-black mb-2">Apply as a doctor</h1>
          <p className="text-slate-500 mb-8 text-sm">
            Choose your specialty. After admin approval you can set your fees and availability.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div className="grid md:grid-cols-2 gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <input
                required
                placeholder="First name"
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />
              <input
                required
                placeholder="Last name"
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </motion.div>
            <input
              required
              type="email"
              placeholder="Email"
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              required
              type="password"
              placeholder="Password"
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <select
              required
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
              value={form.specialtyCategoryId}
              onChange={(e) => setForm({ ...form, specialtyCategoryId: e.target.value })}
            >
              <option value="">Select specialty category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              required
              placeholder="Medical license number"
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
              value={form.licenseNumber}
              onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
            />
            <textarea
              placeholder="Short bio"
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none h-24"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
            <input
              type="number"
              min={0}
              placeholder="Years of experience"
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
              value={form.yearsExperience}
              onChange={(e) => setForm({ ...form, yearsExperience: e.target.value })}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-secondary text-white rounded-2xl font-black flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Submitting…' : 'Submit application'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-6">
            Already approved? <Link href="/doctor" className="text-secondary font-bold">Doctor portal</Link>
          </p>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
