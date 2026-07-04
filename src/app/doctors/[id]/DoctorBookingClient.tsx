"use client";

import React, { useEffect, useState, Suspense, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { publicDoctorApi, paymentApi, type CouponPreview, type PublicDoctor } from '@/lib/api';
import { getToken, getStoredUser, normalizeRole, getLoginUrl, clearSession } from '@/lib/auth';
import { Calendar, ArrowLeft, CreditCard, Tag } from 'lucide-react';
import DoctorStars from '@/components/DoctorStars';

type DoctorAvailability = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotMinutes?: number;
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatDateInput(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function availabilityLabel(availability: DoctorAvailability[]): string {
  if (!availability.length) return 'No weekly hours set yet';
  const days = [...availability]
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
    .map((a) => DAY_NAMES[a.dayOfWeek]);
  const { startTime, endTime } = availability[0];
  return `${days.join(', ')} · ${startTime}–${endTime}`;
}

function nextWeekdayOnOrAfter(from: Date, allowedDays: Set<number>): string | null {
  for (let i = 0; i < 21; i++) {
    const candidate = new Date(from);
    candidate.setDate(from.getDate() + i);
    if (allowedDays.has(candidate.getDay())) {
      return formatDateInput(candidate);
    }
  }
  return null;
}

async function findFirstBookableDate(
  doctorId: string,
  availability: DoctorAvailability[],
  startFrom: string
): Promise<{ date: string; slots: string[]; feeCents: number } | null> {
  const allowedDays = new Set(availability.map((a) => a.dayOfWeek));
  if (!allowedDays.size) return null;

  const start = new Date(`${startFrom}T12:00:00`);
  for (let i = 0; i < 21; i++) {
    const candidate = new Date(start);
    candidate.setDate(start.getDate() + i);
    if (!allowedDays.has(candidate.getDay())) continue;

    const dateStr = formatDateInput(candidate);
    try {
      const r = await publicDoctorApi.slots(doctorId, dateStr);
      if (r.slots.length > 0) {
        return { date: dateStr, slots: r.slots, feeCents: r.consultationFeeCents };
      }
    } catch {
      /* try next day */
    }
  }
  return null;
}

function DoctorBookingContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;

  const [doctor, setDoctor] = useState<(PublicDoctor & { bio?: string; availability?: DoctorAvailability[] }) | null>(
    null
  );
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [feeCents, setFeeCents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slotHint, setSlotHint] = useState<string | null>(null);
  const [nonPatientRole, setNonPatientRole] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponPreview, setCouponPreview] = useState<CouponPreview | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    const role = normalizeRole(getStoredUser()?.role);
    if (role && role !== 'PATIENT') {
      setNonPatientRole(role);
    }
  }, []);

  useEffect(() => {
    publicDoctorApi
      .get(id)
      .then((d) => setDoctor(d as PublicDoctor & { availability?: DoctorAvailability[] }))
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  const loadSlotsForDate = useCallback(
    async (dateStr: string, slotParam?: string | null, autoSelectFirst = true) => {
      if (!dateStr) {
        setSlots([]);
        setSelectedSlot('');
        setSlotHint(null);
        return;
      }

      setSlotsLoading(true);
      setSlotHint(null);
      try {
        const r = await publicDoctorApi.slots(id, dateStr);
        setSlots(r.slots);
        setFeeCents(r.consultationFeeCents);

        if (slotParam && r.slots.includes(slotParam)) {
          setSelectedSlot(slotParam);
        } else if (autoSelectFirst && r.slots.length > 0) {
          setSelectedSlot(r.slots[0]);
        } else {
          setSelectedSlot('');
        }

        if (r.slots.length === 0 && doctor?.availability?.length) {
          const day = new Date(`${dateStr}T12:00:00`).getDay();
          const allowed = doctor.availability.some((a) => a.dayOfWeek === day);
          if (!allowed) {
            setSlotHint(`Not available on ${DAY_NAMES[day]}. ${availabilityLabel(doctor.availability)}`);
          } else {
            setSlotHint('No open times left on this day — try a later date.');
          }
        } else if (r.slots.length === 0) {
          setSlotHint('No times available on this day.');
        }
      } catch {
        setSlots([]);
        setSelectedSlot('');
        setSlotHint('Could not load times. Please try again.');
      } finally {
        setSlotsLoading(false);
      }
    },
    [id, doctor?.availability]
  );

  useEffect(() => {
    if (!doctor) return;

    const dateParam = searchParams.get('date');
    const slotParam = searchParams.get('slot');

    if (dateParam) {
      setDate(dateParam);
      loadSlotsForDate(dateParam, slotParam);
      return;
    }

    const today = formatDateInput(new Date());
    const allowedDays = new Set((doctor.availability || []).map((a) => a.dayOfWeek));

    if (!allowedDays.size) {
      setDate(today);
      loadSlotsForDate(today, null, false);
      setSlotHint('This doctor has not set weekly availability yet.');
      return;
    }

    void (async () => {
      const first = await findFirstBookableDate(id, doctor.availability || [], today);
      if (first) {
        setDate(first.date);
        setSlots(first.slots);
        setFeeCents(first.feeCents);
        setSelectedSlot(first.slots[0]);
        setSlotHint(null);
      } else {
        const fallback = nextWeekdayOnOrAfter(new Date(), allowedDays) || today;
        setDate(fallback);
        await loadSlotsForDate(fallback, null, false);
      }
    })();
  }, [doctor, id, searchParams, loadSlotsForDate]);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (searchParams.get('payment') === 'success' && sessionId) {
      paymentApi.status(sessionId).then(() => {
        router.replace('/dashboard/appointments');
      });
    }
  }, [searchParams, router]);

  const handleDateChange = (dateStr: string) => {
    setDate(dateStr);
    setSelectedSlot('');
    loadSlotsForDate(dateStr, null, true);
  };

  const handleApplyCoupon = async () => {
    const baseCents = feeCents || doctor?.consultationFeeCents || 0;
    if (!couponCode.trim()) {
      setCouponPreview(null);
      setCouponError(null);
      return;
    }
    setCouponLoading(true);
    setCouponError(null);
    try {
      const preview = await paymentApi.validateCoupon({ code: couponCode, amountCents: baseCents });
      setCouponPreview(preview);
    } catch (e: unknown) {
      setCouponPreview(null);
      setCouponError(e instanceof Error ? e.message : 'Invalid coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handlePay = async () => {
    if (!selectedSlot) return;
    if (nonPatientRole) {
      setError(
        nonPatientRole === 'DOCTOR'
          ? 'You are signed in as a doctor. Patient bookings require a patient account.'
          : 'You are signed in as an admin. Patient bookings require a patient account.'
      );
      return;
    }
    const token = getToken();
    if (!token) {
      router.push(`/login?redirect=${encodeURIComponent(`/doctors/${id}?date=${date}&slot=${selectedSlot}`)}`);
      return;
    }
    setPaying(true);
    setError(null);
    try {
      const result = await paymentApi.checkout({
        doctorId: id,
        dateTime: selectedSlot,
        notes,
        couponCode: couponPreview?.code || couponCode || undefined,
      });
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

  const payDisabled = paying || !selectedSlot || Boolean(nonPatientRole);
  const payHint = nonPatientRole
    ? 'Sign in with a patient account to book and pay'
    : !selectedSlot
    ? !date
      ? 'Choose a date to see available times'
      : slotsLoading
        ? 'Loading available times…'
        : slots.length === 0
          ? slotHint || 'Pick a date with open times (Mon–Fri)'
          : 'Select a time slot above'
    : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Loading doctor…
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error || 'Doctor not found'}</p>
        <Link href="/doctors" className="text-primary font-bold">
          Back to doctors
        </Link>
      </div>
    );
  }

  const baseCents = feeCents || doctor.consultationFeeCents;
  const fee = baseCents / 100;
  const discount = (couponPreview?.discountCents || 0) / 100;
  const total = (couponPreview?.finalCents ?? baseCents) / 100;
  const hoursLabel = availabilityLabel(doctor.availability || []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="pt-28 pb-24 px-6 max-w-2xl mx-auto">
        <Link href="/doctors" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 mb-8">
          <ArrowLeft className="w-4 h-4" /> All doctors
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[40px] p-8 md:p-10 medical-shadow space-y-8"
        >
          <div>
            <h1 className="text-3xl font-black">
              Dr. {doctor.firstName} {doctor.lastName}
            </h1>
            <p className="text-slate-500 mt-1">{doctor.specialization}</p>
            <DoctorStars
              averageRating={doctor.averageRating}
              reviewCount={doctor.reviewCount}
              className="mt-3"
            />
            {doctor.bio && <p className="text-sm text-slate-400 mt-4">{doctor.bio}</p>}
            <p className="text-xs font-bold text-secondary mt-3 uppercase tracking-wide">
              Available: {hoursLabel}
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black uppercase text-slate-400 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Select date
            </label>
            <input
              type="date"
              min={formatDateInput(new Date())}
              value={date}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
            />
          </div>

          {date && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <p className="text-xs font-black uppercase text-slate-400">Available times</p>
              {slotsLoading ? (
                <p className="text-sm text-slate-500">Loading times…</p>
              ) : slots.length === 0 ? (
                <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                  {slotHint || 'No slots on this day.'}
                </p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3 rounded-xl text-sm font-bold transition-colors ${
                        selectedSlot === slot
                          ? 'bg-primary text-white ring-2 ring-primary ring-offset-2'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-primary/10'
                      }`}
                    >
                      {new Date(slot).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          <textarea
            placeholder="Notes for the doctor (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none h-24"
          />

          {nonPatientRole && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm space-y-3">
              <p className="font-bold">
                You&apos;re signed in as a {nonPatientRole.toLowerCase()}. Only patients can book consultations.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={getLoginUrl(`/doctors/${id}?date=${date}&slot=${selectedSlot}`)}
                  onClick={() => clearSession()}
                  className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-black"
                >
                  Sign in as patient
                </Link>
                <Link href="/register" className="px-4 py-2 bg-white border border-amber-300 rounded-xl text-xs font-black">
                  Create patient account
                </Link>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-600 font-bold">{error}</p>}

          <div className="space-y-3">
            <label className="text-xs font-black uppercase text-slate-400 flex items-center gap-2">
              <Tag className="w-4 h-4" /> Coupon code
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                placeholder="Enter promo code"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value.toUpperCase());
                  setCouponPreview(null);
                  setCouponError(null);
                }}
                className="flex-1 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none uppercase"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={couponLoading || !couponCode.trim()}
                className="px-5 py-4 rounded-2xl bg-slate-900 text-white font-bold text-sm disabled:opacity-50"
              >
                {couponLoading ? 'Checking…' : 'Apply'}
              </button>
            </div>
            {couponError && <p className="text-sm text-red-600 font-bold">{couponError}</p>}
            {couponPreview && (
              <p className="text-sm text-emerald-700 font-bold">
                {couponPreview.code} applied — save €{discount.toFixed(2)}
              </p>
            )}
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-primary/5">
            <div className="flex items-center justify-between">
              <span className="font-bold">Consultation fee</span>
              <span className="text-lg font-black text-primary">€{fee.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between text-sm text-emerald-700">
                <span>Discount</span>
                <span className="font-bold">-€{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-2 border-t border-primary/10">
              <span className="font-black">Total</span>
              <span className="text-xl font-black text-primary">€{total.toFixed(2)}</span>
            </div>
          </div>

          {payHint && (
            <p className="text-sm text-center text-slate-500 font-medium">{payHint}</p>
          )}

          <button
            type="button"
            onClick={handlePay}
            disabled={payDisabled}
            className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all ${
              payDisabled
                ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-primary text-white hover:opacity-95'
            }`}
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

export default function DoctorBookingClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-slate-400">
          Loading…
        </div>
      }
    >
      <DoctorBookingContent />
    </Suspense>
  );
}
