"use client";

import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { paymentApi, publicDoctorApi } from '@/lib/api';
import { getToken, getStoredUser, normalizeRole, getLoginUrl, saveSession, clearSession } from '@/lib/auth';
import {
  APP_TIMEZONE_LABEL,
  addDaysToDateStr,
  formatAppDateTime,
  formatAppTime,
  todayInAppTz,
} from '@/lib/appTime';
import { ArrowLeft, Calendar, CreditCard } from 'lucide-react';

function BookContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [date, setDate] = useState(todayInAppTz());
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [feeCents, setFeeCents] = useState(4900);
  const [notes, setNotes] = useState('');
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nonPatientRole, setNonPatientRole] = useState<string | null>(null);
  const [guestEmail, setGuestEmail] = useState('');
  const [guestFirstName, setGuestFirstName] = useState('');
  const [guestLastName, setGuestLastName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestDob, setGuestDob] = useState('');

  const loggedInAsPatient =
    Boolean(getToken()) && normalizeRole(getStoredUser()?.role) === 'PATIENT';

  useEffect(() => {
    const role = normalizeRole(getStoredUser()?.role);
    if (role && role !== 'PATIENT') setNonPatientRole(role);
  }, []);

  const loadSlots = useCallback(async (dateStr: string) => {
    if (!dateStr) return;
    setSlotsLoading(true);
    setSelectedSlot('');
    try {
      const r = await publicDoctorApi.availableSlots(dateStr);
      setSlots(r.slots);
      setFeeCents(r.consultationFeeCents);
      if (r.slots.length) setSelectedSlot(r.slots[0]);
    } catch (e: unknown) {
      setSlots([]);
      setError(e instanceof Error ? e.message : 'Could not load times');
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSlots(date);
  }, [date, loadSlots]);

  const handlePay = async () => {
    if (!selectedSlot || nonPatientRole) return;
    setPaying(true);
    setError(null);
    try {
      let result;
      if (loggedInAsPatient) {
        result = await paymentApi.autoCheckout({ dateTime: selectedSlot, notes });
      } else {
        if (!guestEmail.trim() || !guestFirstName.trim() || !guestLastName.trim() || !guestDob) {
          setError('Enter your name, email, and date of birth to continue.');
          setPaying(false);
          return;
        }
        result = await paymentApi.guestAutoCheckout({
          dateTime: selectedSlot,
          notes,
          email: guestEmail.trim(),
          firstName: guestFirstName.trim(),
          lastName: guestLastName.trim(),
          phone: guestPhone.trim() || undefined,
          dob: guestDob,
        });
        if (result.requiresLogin) {
          router.push(`/login?redirect=${encodeURIComponent('/book')}`);
          return;
        }
        if (result.token && result.user) {
          saveSession(result.token, result.user as Parameters<typeof saveSession>[1]);
        }
      }

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
        return;
      }
      if (result.freeCheckout && result.appointmentId) {
        router.push('/dashboard/appointments?booked=1');
        return;
      }
      if (result.testMode && result.appointmentId) {
        await paymentApi.devConfirm(result.appointmentId);
        router.push('/dashboard/appointments?booked=1');
        return;
      }
      setError(result.message || 'Payment unavailable');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Checkout failed');
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="pt-28 pb-24 px-6 max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 mb-8">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[40px] p-8 md:p-10 medical-shadow space-y-8"
        >
          <div>
            <h1 className="text-3xl font-black">Book a video consultation</h1>
            <p className="text-slate-500 mt-2 text-sm">
              Choose a time that suits you. A suitable Irish-registered GP is assigned automatically — you do not need to
              pick a doctor.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black uppercase text-slate-400 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Select date
            </label>
            <input
              type="date"
              min={todayInAppTz()}
              max={addDaysToDateStr(todayInAppTz(), 21)}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
            />
            <p className="text-xs text-slate-500">All times shown in {APP_TIMEZONE_LABEL}.</p>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-black uppercase text-slate-400">Available times</p>
            {slotsLoading ? (
              <p className="text-sm text-slate-500">Loading times…</p>
            ) : slots.length === 0 ? (
              <p className="text-sm text-amber-700 font-medium">No open times on this day — try another date.</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 rounded-xl text-sm font-bold ${
                      selectedSlot === slot
                        ? 'bg-primary text-white ring-2 ring-primary ring-offset-2'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-primary/10'
                    }`}
                  >
                    {formatAppTime(slot)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedSlot && (
            <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/20">
              <p className="text-xs font-black uppercase text-slate-400">Selected time</p>
              <p className="text-lg font-black mt-1">{formatAppDateTime(selectedSlot)}</p>
            </div>
          )}

          {!nonPatientRole && !loggedInAsPatient && (
            <div className="space-y-3 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
              <p className="font-black text-sm">Your details</p>
              <p className="text-xs text-slate-500">No login needed — we create your account and email a temporary password.</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  placeholder="First name"
                  value={guestFirstName}
                  onChange={(e) => setGuestFirstName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-sm"
                />
                <input
                  placeholder="Last name"
                  value={guestLastName}
                  onChange={(e) => setGuestLastName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-sm"
                />
              </div>
              <input
                type="email"
                placeholder="Email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-sm"
              />
              <input
                type="tel"
                placeholder="Phone (optional)"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-sm"
              />
              <input
                type="date"
                value={guestDob}
                onChange={(e) => setGuestDob(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-sm"
              />
            </div>
          )}

          {nonPatientRole && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm space-y-3">
              <p className="font-bold">You are signed in as a {nonPatientRole.toLowerCase()}. Use a patient account to book.</p>
              <Link
                href={getLoginUrl('/book')}
                onClick={() => clearSession()}
                className="inline-block px-4 py-2 bg-primary text-white rounded-xl text-xs font-black"
              >
                Sign in as patient
              </Link>
            </div>
          )}

          <textarea
            placeholder="Notes for the doctor (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none h-24"
          />

          <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5">
            <span className="font-black">From</span>
            <span className="text-xl font-black text-primary">€{(feeCents / 100).toFixed(2)}</span>
          </div>

          {error && <p className="text-sm text-red-600 font-bold">{error}</p>}

          <button
            type="button"
            onClick={handlePay}
            disabled={paying || !selectedSlot || Boolean(nonPatientRole)}
            className="w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 bg-primary text-white disabled:opacity-50"
          >
            <CreditCard className="w-5 h-5" />
            {paying ? 'Processing…' : 'Pay & book'}
          </button>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">Loading…</div>}>
      <BookContent />
    </Suspense>
  );
}
