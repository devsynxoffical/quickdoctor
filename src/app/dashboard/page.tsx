"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { formatAppDate, formatAppDateTime, formatAppTime } from '@/lib/appTime';
import { motion } from 'framer-motion';
import {
  Video,
  Calendar,
  ArrowRight,
  Activity,
  Pill,
  CheckCircle2,
  Clock,
  Stethoscope,
} from 'lucide-react';
import { appointmentApi, medicalApi, type AppointmentRow, type PrescriptionRow } from '@/lib/api';
import { getStoredUser } from '@/lib/auth';
import { formatDoctorName, formatStatusLabel } from '@/lib/format';

function statusBadgeClass(status: string): string {
  if (status === 'PENDING_PAYMENT') return 'bg-amber-100 text-amber-700';
  if (status === 'PENDING') return 'bg-orange-100 text-orange-600';
  if (status === 'CONFIRMED') return 'bg-blue-100 text-blue-600';
  if (status === 'COMPLETED') return 'bg-green-100 text-green-600';
  return 'bg-red-100 text-red-600';
}

export default function PatientDashboardOverview() {
  const [user] = useState(() => getStoredUser());
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [prescriptions, setPrescriptions] = useState<PrescriptionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([appointmentApi.getAll(), medicalApi.prescriptions()])
      .then(([appts, rx]) => {
        setAppointments(appts);
        setPrescriptions(rx);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const now = Date.now();
  const upcoming = appointments.filter(
    (a) =>
      ['CONFIRMED', 'PENDING', 'PENDING_PAYMENT'].includes(a.status) &&
      new Date(a.dateTime).getTime() > now
  );
  const nextAppointment = [...upcoming].sort(
    (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
  )[0];
  const completedCount = appointments.filter((a) => a.status === 'COMPLETED').length;
  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
    .slice(0, 5);
  const recentPrescriptions = prescriptions.slice(0, 3);

  const joinConsultation = async () => {
    if (!nextAppointment) return;
    try {
      const r = await appointmentApi.getJoin(nextAppointment.id);
      if (r.canJoin && r.url) {
        window.open(r.url, '_blank', 'noopener,noreferrer');
      } else {
        alert(r.message || 'Video join is not available yet');
      }
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Could not join');
    }
  };

  const stats = [
    {
      label: 'Upcoming',
      value: String(upcoming.length),
      unit: 'visits',
      icon: Calendar,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      label: 'Completed',
      value: String(completedCount),
      unit: 'consultations',
      icon: CheckCircle2,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      label: 'Prescriptions',
      value: String(prescriptions.length),
      unit: 'on file',
      icon: Pill,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-r from-primary to-accent rounded-[40px] p-10 text-white overflow-hidden medical-shadow"
        >
          <div className="relative z-10 max-w-xl">
            <h1 className="text-4xl font-bold mb-4">
              Hello, {user?.firstName || 'there'}!
            </h1>
            <p className="text-white/80 text-lg mb-8">
              {loading ? (
                'Loading your dashboard…'
              ) : nextAppointment ? (
                <>
                  Your next consultation is with{' '}
                  {formatDoctorName(nextAppointment.doctor)} on{' '}
                  {formatAppDate(nextAppointment.dateTime)} at{' '}
                  {formatAppTime(nextAppointment.dateTime)}
                  .
                </>
              ) : (
                'Book a video GP consultation, view prescriptions, and manage appointments from here.'
              )}
            </p>
            <div className="flex flex-wrap gap-3">
              {nextAppointment?.status === 'CONFIRMED' && (
                <button
                  type="button"
                  onClick={joinConsultation}
                  className="px-8 py-4 bg-white text-primary rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all"
                >
                  <Video className="w-5 h-5" />
                  Join consultation
                </button>
              )}
              <Link
                href="/book"
                className="px-8 py-4 bg-white/15 text-white border border-white/30 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/25 transition-all"
              >
                <Stethoscope className="w-5 h-5" />
                Book a consultation
              </Link>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 -mr-10 -mb-10">
            <Activity className="w-80 h-80" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-3xl medical-shadow flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-dark-slate dark:text-white">
                    {loading ? '—' : stat.value}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{stat.unit}</span>
                </div>
              </div>
              <div
                className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-dark-slate dark:text-white">
                Recent appointments
              </h2>
              <Link
                href="/dashboard/appointments"
                className="text-primary font-bold text-sm flex items-center gap-1 hover:underline"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <p className="text-slate-400 py-8">Loading appointments…</p>
            ) : recentAppointments.length > 0 ? (
              <div className="space-y-4">
                {recentAppointments.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Link
                      href="/dashboard/appointments"
                      className="glass p-6 rounded-[32px] flex items-center justify-between hover:border-primary/20 border border-transparent transition-all group block"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                          <Video className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-dark-slate dark:text-white group-hover:text-primary transition-colors">
                            {formatDoctorName(item.doctor)}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium">
                            {item.doctor?.specialization || 'Video consultation'} •{' '}
                            {formatAppDateTime(item.dateTime)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${statusBadgeClass(item.status)}`}
                        >
                          {formatStatusLabel(item.status)}
                        </span>
                        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-all" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-6 rounded-[40px] bg-slate-100 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800">
                <Calendar className="w-12 h-12 text-slate-400 mb-4" />
                <p className="font-bold text-slate-600 dark:text-slate-400 mb-2">
                  No appointments yet
                </p>
                <p className="text-xs text-slate-500 text-center max-w-xs mb-4">
                  Book your first video consultation with an approved GP.
                </p>
                <Link
                  href="/book"
                  className="px-6 py-3 bg-primary text-white rounded-xl text-sm font-black"
                >
                  Find a doctor
                </Link>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-dark-slate dark:text-white">
                Prescriptions
              </h2>
              <Link
                href="/dashboard/records"
                className="text-primary font-bold text-sm hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="glass p-8 rounded-[40px] medical-shadow space-y-4">
              {loading ? (
                <p className="text-sm text-slate-400">Loading…</p>
              ) : recentPrescriptions.length > 0 ? (
                recentPrescriptions.map((rx) => (
                  <div
                    key={rx.id}
                    className="pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3">
                      <Pill className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-sm">{rx.medications}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {rx.dosage} • {formatAppDate(rx.issuedAt)}
                        </p>
                        {rx.instructions && (
                          <p className="text-xs text-slate-400 mt-1">{rx.instructions}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <Pill className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-slate-500">No prescriptions yet</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Prescriptions from your consultations will appear here.
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-[40px] bg-slate-900 p-8 text-white relative overflow-hidden medical-shadow">
              <div className="relative z-10">
                <h4 className="text-xl font-bold mb-2">Need help?</h4>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  Contact our support team for booking, billing, or account questions.
                </p>
                <a
                  href="mailto:info@quickdoctor.ie"
                  className="w-full py-4 bg-primary rounded-2xl text-sm font-bold medical-shadow hover:opacity-90 transition-all block text-center"
                >
                  info@quickdoctor.ie
                </a>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <Clock className="w-32 h-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
