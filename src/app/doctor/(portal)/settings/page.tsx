"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { doctorProfileApi } from '@/lib/api';

const defaultDays = [
  { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', slotMinutes: 15 },
  { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', slotMinutes: 15 },
  { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', slotMinutes: 15 },
  { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', slotMinutes: 15 },
  { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', slotMinutes: 15 },
];

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function DoctorSettingsPage() {
  const [feeEuro, setFeeEuro] = useState('49');
  const [bio, setBio] = useState('');
  const [availability, setAvailability] = useState(defaultDays);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    doctorProfileApi.get().then((d) => {
      const doc = d as {
        consultationFeeCents?: number;
        bio?: string;
        availability?: typeof defaultDays;
      };
      if (doc.consultationFeeCents) setFeeEuro(String(doc.consultationFeeCents / 100));
      if (doc.bio) setBio(doc.bio);
      if (doc.availability?.length) setAvailability(doc.availability as typeof defaultDays);
    });
  }, []);

  const save = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const priceCents = Math.round(parseFloat(feeEuro) * 100);
      await doctorProfileApi.update({ bio, profileComplete: true });
      await doctorProfileApi.updateServices({ priceCents, durationMinutes: 15 });
      await doctorProfileApi.updateAvailability(availability);
      setMessage('Profile, fees, and availability saved. You are visible for bookings.');
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-2xl">
        <h1 className="text-3xl font-black">Profile & fees</h1>
        <p className="text-slate-500 text-sm">Set your consultation price and weekly availability before patients can book.</p>

        {message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 rounded-2xl bg-green-50 text-green-700 font-bold text-sm"
          >
            {message}
          </motion.div>
        )}

        <div className="glass p-6 rounded-3xl space-y-4">
          <label className="text-xs font-black uppercase text-slate-400">Consultation fee (EUR)</label>
          <input
            type="number"
            step="0.01"
            min="1"
            value={feeEuro}
            onChange={(e) => setFeeEuro(e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
          />
          <label className="text-xs font-black uppercase text-slate-400">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none h-28"
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass p-6 rounded-3xl space-y-4"
        >
          <p className="text-xs font-black uppercase text-slate-400">Weekly availability</p>
          {availability.map((slot, idx) => (
            <div key={slot.dayOfWeek} className="grid grid-cols-4 gap-2 items-center text-sm">
              <span className="font-bold">{dayNames[slot.dayOfWeek]}</span>
              <input
                type="time"
                value={slot.startTime}
                onChange={(e) => {
                  const next = [...availability];
                  next[idx] = { ...next[idx], startTime: e.target.value };
                  setAvailability(next);
                }}
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border-none"
              />
              <input
                type="time"
                value={slot.endTime}
                onChange={(e) => {
                  const next = [...availability];
                  next[idx] = { ...next[idx], endTime: e.target.value };
                  setAvailability(next);
                }}
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border-none"
              />
            </div>
          ))}
        </motion.div>

        <button
          onClick={save}
          disabled={loading}
          className="w-full py-4 bg-secondary text-white rounded-2xl font-black disabled:opacity-50"
        >
          {loading ? 'Saving…' : 'Save & publish profile'}
        </button>
      </motion.div>
      );
}
