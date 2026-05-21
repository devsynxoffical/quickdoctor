"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { publicDoctorApi, paymentApi, type PublicDoctor } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { Calendar, ArrowLeft, CreditCard } from 'lucide-react';
import DoctorStars from '@/components/DoctorStars';

function DoctorBookingContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;

  const [doctor, setDoctor] = useState<(PublicDoctor & { bio?: string }) | null>(null);
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [feeCents, setFeeCents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    publicDoctorApi
      .get(id)
      .then((d) => setDoctor(d as PublicDoctor))
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!date) {
      setSlots([]);
      return;
    }
    publicDoctorApi
      .slots(id, date)
      .then((r) => {
        setSlots(r.slots);
        setFeeCents(r.consultationFeeCents);
        setSelectedSlot('');
      })
      .catch(() => setSlots([]));
  }, [id, date]);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (searchParams.get('payment') === 'success' && sessionId) {
      paymentApi.status(sessionId).then(() => {
        router.replace('/dashboard/appointments');
      });
    }
  }, [searchParams, router]);

  const handlePay = async () => {
    if (!selectedSlot) return;
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
      });
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
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

  const fee = (feeCents || doctor.consultationFeeCents) / 100;

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
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black uppercase text-slate-400 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Select date
            </label>
            <input
              type="date"
              min={new Date().toISOString().slice(0, 10)}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
            />
          </div>

          {date && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <p className="text-xs font-black uppercase text-slate-400">Available times</p>
              {slots.length === 0 ? (
                <p className="text-sm text-slate-500">No slots on this day.</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3 rounded-xl text-sm font-bold ${
                        selectedSlot === slot
                          ? 'bg-primary text-white'
                          : 'bg-slate-100 dark:bg-slate-800'
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

          {error && (
            <p className="text-sm text-red-600 font-bold">{error}</p>
          )}

          <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5">
            <span className="font-bold">Consultation fee</span>
            <span className="text-xl font-black text-primary">€{fee.toFixed(2)}</span>
          </div>

          <button
            type="button"
            onClick={handlePay}
            disabled={paying || !selectedSlot}
            className="w-full py-4 bg-primary text-white rounded-2xl font-black flex items-center justify-center gap-2 disabled:opacity-50"
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

export default function DoctorBookingPage() {
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
