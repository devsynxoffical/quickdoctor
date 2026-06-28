"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Video, ChevronRight } from 'lucide-react';
import { appointmentApi, type AppointmentRow } from '@/lib/api';

export default function DoctorConsultationsPage() {
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appointmentApi
      .getAll()
      .then(setAppointments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const active = appointments.filter((a) =>
    ['PENDING', 'CONFIRMED', 'PENDING_PAYMENT'].includes(a.status)
  );
  const past = appointments.filter((a) => !['PENDING', 'CONFIRMED', 'PENDING_PAYMENT'].includes(a.status));

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h1 className="text-4xl font-black">Consultations</h1>
        <p className="text-slate-500 mt-2">Upcoming and past patient consultations.</p>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : (
        <>
          <section className="space-y-4">
            <h2 className="text-sm font-black uppercase text-slate-400">Upcoming</h2>
            {active.length === 0 ? (
              <p className="text-slate-500 text-sm">No upcoming consultations.</p>
            ) : (
              active.map((a) => (
                <Link
                  key={a.id}
                  href={`/doctor/consultations/${a.id}`}
                  className="glass p-5 rounded-2xl flex items-center justify-between hover:scale-[1.01] transition-transform"
                >
                  <div>
                    <p className="font-black">
                      {a.patient?.firstName} {a.patient?.lastName}
                    </p>
                    <p className="text-sm text-slate-500">
                      {new Date(a.dateTime).toLocaleString()} · {a.status}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </Link>
              ))
            )}
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-black uppercase text-slate-400">Past</h2>
            {past.length === 0 ? (
              <p className="text-slate-500 text-sm">No past consultations.</p>
            ) : (
              past.slice(0, 20).map((a) => (
                <Link
                  key={a.id}
                  href={`/doctor/consultations/${a.id}`}
                  className="glass p-5 rounded-2xl flex items-center justify-between opacity-80 hover:opacity-100 transition-opacity"
                >
                  <div>
                    <p className="font-bold">
                      {a.patient?.firstName} {a.patient?.lastName}
                    </p>
                    <p className="text-sm text-slate-500">
                      {new Date(a.dateTime).toLocaleString()} · {a.status}
                    </p>
                  </div>
                  <Video className="w-5 h-5 text-slate-400" />
                </Link>
              ))
            )}
          </section>
        </>
      )}
    </motion.div>
  );
}
