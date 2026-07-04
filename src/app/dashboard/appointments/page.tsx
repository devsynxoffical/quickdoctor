"use client";

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { Calendar, Video, Clock, Plus, X } from 'lucide-react';
import { appointmentApi, paymentApi, reviewApi, type AppointmentRow } from '@/lib/api';
import { formatAppDate, formatAppTime, APP_TIMEZONE_LABEL } from '@/lib/appTime';
import { formatDoctorName, formatStatusLabel } from '@/lib/format';

function formatPrice(cents: number) {
  return `€${(cents / 100).toFixed(2)}`;
}

function AppointmentReviewForm({ appointmentId }: { appointmentId: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    try {
      await reviewApi.create({ appointmentId, rating, comment: comment || undefined });
      setDone(true);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Could not submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return <p className="text-sm font-bold text-green-600">Thank you for your feedback.</p>;
  }

  return (
    <motion.div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
      <p className="text-xs font-black uppercase tracking-widest text-slate-400">Rate your visit</p>
      <motion.div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            className={`w-10 h-10 rounded-xl font-black text-sm ${
              n <= rating ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}
          >
            {n}
          </button>
        ))}
      </motion.div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Optional comment"
        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm"
        rows={2}
      />
      <button
        type="button"
        disabled={submitting}
        onClick={submit}
        className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-black disabled:opacity-50"
      >
        {submitting ? 'Submitting…' : 'Submit review'}
      </button>
    </motion.div>
  );
}

function AppointmentsContent() {
  const searchParams = useSearchParams();
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookBanner, setShowBookBanner] = useState(false);
  const [cancelNotice, setCancelNotice] = useState<string | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState<string | null>(null);

  const load = async () => {
    try {
      const appts = await appointmentApi.getAll();
      setAppointments(appts);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (searchParams.get('book') === '1') {
      setShowBookBanner(true);
    }
    const sessionId = searchParams.get('session_id');
    if (searchParams.get('payment') === 'success' && sessionId) {
      paymentApi
        .status(sessionId)
        .then((result) => {
          load();
          if (result.slotUnavailable) {
            setCancelNotice(result.slotUnavailable);
          } else {
            setBookingConfirmed('Payment successful — your appointment is confirmed.');
          }
        })
        .catch(console.error);
    }
    if (searchParams.get('booked') === '1') {
      load();
      setBookingConfirmed('Your appointment is confirmed.');
    }
    if (searchParams.get('payment') === 'cancelled') {
      const appointmentId = searchParams.get('appointmentId');
      if (appointmentId) {
        appointmentApi
          .cancelPending(appointmentId)
          .then(() => {
            setCancelNotice('Payment was cancelled. You can choose another time slot.');
            load();
          })
          .catch(() => {
            setCancelNotice('Payment was cancelled.');
            load();
          });
      } else {
        setCancelNotice('Payment was cancelled.');
      }
    }
    const confirmDevId = searchParams.get('confirmDev');
    const joinId = searchParams.get('join');
    if (confirmDevId) {
      paymentApi
        .devConfirm(confirmDevId)
        .then(() => load())
        .catch(console.error);
    }
    if (joinId) {
      appointmentApi
        .getJoin(joinId)
        .then((r) => {
          if (r.canJoin && r.url) window.open(r.url, '_blank', 'noopener,noreferrer');
        })
        .catch(console.error);
    }
  }, [searchParams]);

  const joinCall = async (id: string) => {
    try {
      const r = await appointmentApi.getJoin(id);
      if (r.canJoin && r.url) {
        window.open(r.url, '_blank', 'noopener,noreferrer');
      } else {
        alert(r.message || 'Video join is not available yet');
      }
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Could not join');
    }
  };

  const cancelPending = async (id: string) => {
    try {
      await appointmentApi.cancelPending(id);
      await load();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Could not cancel');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-dark-slate dark:text-white">My Appointments</h1>
            <p className="text-slate-500 mt-2">Manage your upcoming and past medical consultations.</p>
          </div>
          <Link
            href="/doctors"
            className="px-8 py-4 bg-primary text-white rounded-2xl font-black flex items-center gap-2 medical-shadow hover:scale-105 transition-all w-full md:w-auto justify-center"
          >
            <Plus className="w-5 h-5" />
            Book New Appointment
          </Link>
        </div>

        {bookingConfirmed && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-3xl border-2 border-green-200 bg-green-50/50 dark:bg-green-950/20 flex items-center justify-between gap-4"
          >
            <p className="font-bold text-green-800 dark:text-green-200">
              {bookingConfirmed} All times are in {APP_TIMEZONE_LABEL}.
            </p>
            <button
              type="button"
              onClick={() => setBookingConfirmed(null)}
              className="p-2 text-green-600"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {cancelNotice && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-3xl border-2 border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 flex items-center justify-between gap-4"
          >
            <p className="font-bold text-amber-800 dark:text-amber-200">{cancelNotice}</p>
            <button
              type="button"
              onClick={() => setCancelNotice(null)}
              className="p-2 text-amber-600"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {showBookBanner && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-3xl border-2 border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <p className="font-bold text-slate-600 dark:text-slate-300">
              Choose a doctor and time slot to complete your booking.
            </p>
            <Link
              href="/doctors"
              className="px-6 py-3 bg-primary text-white rounded-xl font-black text-sm"
            >
              Browse doctors
            </Link>
            <button
              type="button"
              onClick={() => setShowBookBanner(false)}
              className="p-2 text-slate-400 hover:text-primary"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <p className="py-20 text-center text-slate-400">Loading your appointments…</p>
          ) : appointments.length > 0 ? (
            appointments.map((appt, i) => (
              <motion.div
                key={appt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass p-8 rounded-[40px] medical-shadow flex flex-col gap-6 border border-transparent hover:border-primary/20 transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Video className="w-10 h-10" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                          appt.status === 'PENDING_PAYMENT'
                            ? 'bg-amber-100 text-amber-700'
                            : appt.status === 'PENDING'
                              ? 'bg-orange-100 text-orange-600'
                              : appt.status === 'CONFIRMED'
                                ? 'bg-blue-100 text-blue-600'
                                : appt.status === 'COMPLETED'
                                  ? 'bg-green-100 text-green-600'
                                  : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {formatStatusLabel(appt.status)}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-dark-slate dark:text-white group-hover:text-primary transition-colors">
                      Video Consultation
                    </h3>
                    <p className="text-sm font-bold text-slate-500 mt-1">
                      With {formatDoctorName(appt.doctor)} •{' '}
                      {appt.doctor?.specialization || 'GP'}
                    </p>
                    {appt.notes && (
                      <p className="text-xs text-slate-400 mt-2">Note: {appt.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-8 md:gap-12">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Date & Time
                    </p>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold">
                        {formatAppDate(appt.dateTime)}
                      </span>
                      <Clock className="w-4 h-4 text-primary ml-2" />
                      <span className="text-sm font-bold">
                        {formatAppTime(appt.dateTime)}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">{APP_TIMEZONE_LABEL}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Payment
                    </p>
                    <p className="text-lg font-black text-primary">
                      {formatPrice(appt.priceCents ?? 0)}
                    </p>
                    {appt.payment?.status && (
                      <p className="text-xs text-slate-400">{appt.payment.status}</p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    {appt.status === 'PENDING_PAYMENT' && (
                      <>
                        <Link
                          href={`/doctors/${appt.doctor?.id || ''}`}
                          className="px-6 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest"
                        >
                          Complete booking
                        </Link>
                        <button
                          type="button"
                          onClick={() => cancelPending(appt.id)}
                          className="px-6 py-3 bg-slate-200 dark:bg-slate-800 rounded-xl text-xs font-black uppercase"
                        >
                          Cancel hold
                        </button>
                      </>
                    )}
                    {appt.status === 'COMPLETED' && (
                      <Link
                        href="/dashboard/records"
                        className="px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-black uppercase tracking-widest"
                      >
                        View records
                      </Link>
                    )}
                    {appt.status === 'CONFIRMED' && (
                      <button
                        type="button"
                        onClick={() => joinCall(appt.id)}
                        className="px-6 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest"
                      >
                        Join call
                      </button>
                    )}
                    {!['PENDING_PAYMENT', 'CONFIRMED', 'COMPLETED'].includes(appt.status) && (
                      <span className="text-xs text-slate-400 font-bold uppercase">
                        {formatStatusLabel(appt.status)}
                      </span>
                    )}
                  </div>
                </div>
                </div>
                {appt.status === 'COMPLETED' && (
                  <>
                    {appt.clinicalNotes && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                          Doctor notes
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{appt.clinicalNotes}</p>
                      </div>
                    )}
                    <AppointmentReviewForm appointmentId={appt.id} />
                  </>
                )}
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800">
              <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-600 mb-2">No appointments yet</h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto mb-8">
                Book your first consultation with one of our expert doctors.
              </p>
              <Link
                href="/doctors"
                className="inline-block px-8 py-4 bg-primary text-white rounded-2xl font-bold medical-shadow"
              >
                Find a doctor
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function AppointmentsPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <p className="py-20 text-center text-slate-400">Loading…</p>
        </DashboardLayout>
      }
    >
      <AppointmentsContent />
    </Suspense>
  );
}
