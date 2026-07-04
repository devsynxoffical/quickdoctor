"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { adminApi } from '@/lib/api';

type Row = {
  id: string;
  dateTime: string;
  status: string;
  priceCents: number;
  patient?: { id: string; firstName: string; lastName: string };
  doctor?: { id: string; firstName: string; lastName: string };
  payment?: { status: string };
};

type PatientUser = {
  patient?: { id: string; firstName: string; lastName: string };
};

type DoctorRow = {
  id: string;
  firstName: string;
  lastName: string;
  status: string;
  profileComplete?: boolean;
};

export default function AdminAppointmentsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [patients, setPatients] = useState<PatientUser[]>([]);
  const [doctors, setDoctors] = useState<DoctorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [notes, setNotes] = useState('');
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    adminApi
      .appointments()
      .then((d) => setRows(d as Row[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    adminApi
      .users()
      .then((users) => setPatients((users as PatientUser[]).filter((u) => u.patient?.id)))
      .catch(console.error);
    adminApi
      .doctors()
      .then((d) =>
        setDoctors(
          (d as DoctorRow[]).filter((doc) => doc.status === 'APPROVED' && doc.profileComplete)
        )
      )
      .catch(console.error);
  }, []);

  const book = async (e: React.FormEvent) => {
    e.preventDefault();
    setBooking(true);
    setMessage(null);
    setError(null);
    try {
      const result = await adminApi.createAppointment({
        patientId,
        doctorId,
        dateTime: new Date(dateTime).toISOString(),
        notes: notes || undefined,
      });
      setMessage(result.message || 'Appointment created');
      setNotes('');
      setDateTime('');
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h1 className="text-4xl font-black">All appointments</h1>
        <p className="text-slate-500 mt-2">View bookings and create confirmed appointments for patients.</p>
      </div>

      <form onSubmit={book} className="glass p-6 rounded-3xl space-y-4 max-w-3xl">
        <p className="font-black">Book appointment for patient</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select
            required
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
          >
            <option value="">Select patient</option>
            {patients.map((u) =>
              u.patient ? (
                <option key={u.patient.id} value={u.patient.id}>
                  {u.patient.firstName} {u.patient.lastName}
                </option>
              ) : null
            )}
          </select>
          <select
            required
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
          >
            <option value="">Select doctor</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                Dr. {d.firstName} {d.lastName}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            required
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
          />
          <input
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
          />
        </div>
        {error && <p className="text-sm text-red-600 font-bold">{error}</p>}
        {message && <p className="text-sm text-emerald-600 font-bold">{message}</p>}
        <button
          type="submit"
          disabled={booking}
          className="px-6 py-3 bg-primary text-white rounded-2xl font-black text-sm disabled:opacity-50"
        >
          {booking ? 'Booking…' : 'Create confirmed booking'}
        </button>
      </form>

      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : (
        <div className="space-y-3">
          {rows.map((a) => (
            <div key={a.id} className="glass p-5 rounded-2xl flex flex-wrap justify-between gap-4">
              <div>
                <p className="font-bold">
                  {a.patient?.firstName} {a.patient?.lastName} → Dr. {a.doctor?.lastName}
                </p>
                <p className="text-sm text-slate-500">{new Date(a.dateTime).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-black uppercase">{a.status}</span>
                <p className="font-black text-primary">€{(a.priceCents / 100).toFixed(2)}</p>
                {a.payment && <p className="text-xs text-slate-400">{a.payment.status}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
