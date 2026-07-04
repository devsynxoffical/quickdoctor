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

type DoctorProfile = {
  firstName?: string;
  lastName?: string;
  specialization?: string;
  licenseNumber?: string;
  consultationFeeCents?: number;
  bio?: string;
  profileComplete?: boolean;
  user?: { email?: string };
  specialtyCategory?: { name?: string };
  availability?: typeof defaultDays;
};

export default function DoctorSettingsPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [email, setEmail] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [specialtyName, setSpecialtyName] = useState('');
  const [feeEuro, setFeeEuro] = useState('49');
  const [bio, setBio] = useState('');
  const [availability, setAvailability] = useState(defaultDays);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    doctorProfileApi
      .get()
      .then((d) => {
        const doc = d as DoctorProfile;
        setFirstName(doc.firstName || '');
        setLastName(doc.lastName || '');
        setSpecialization(doc.specialization || '');
        setEmail(doc.user?.email || '');
        setLicenseNumber(doc.licenseNumber || '');
        setSpecialtyName(doc.specialtyCategory?.name || '');
        if (doc.consultationFeeCents) setFeeEuro(String(doc.consultationFeeCents / 100));
        if (doc.bio) setBio(doc.bio);
        if (doc.availability?.length) setAvailability(doc.availability as typeof defaultDays);
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : 'Could not load profile');
      })
      .finally(() => setLoadingProfile(false));
  }, []);

  const save = async () => {
    setSaving(true);
    setMessage(null);
    setError(null);

    const priceCents = Math.round(parseFloat(feeEuro) * 100);
    if (!Number.isFinite(priceCents) || priceCents < 100) {
      setError('Enter a valid consultation fee (minimum €1.00).');
      setSaving(false);
      return;
    }

    try {
      await doctorProfileApi.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        specialization: specialization.trim(),
        bio,
        profileComplete: true,
      });
      await doctorProfileApi.updateServices({ priceCents, durationMinutes: 15 });
      await doctorProfileApi.updateAvailability(availability);
      setMessage('Profile, fees, and availability saved. Patients can book you now.');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loadingProfile) {
    return <p className="text-slate-400">Loading profile…</p>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-black">My profile</h1>
        <p className="text-slate-500 text-sm mt-2">
          Update your public profile, consultation fee, and weekly availability.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 text-red-700 font-bold text-sm">{error}</div>
      )}
      {message && (
        <div className="p-4 rounded-2xl bg-green-50 text-green-700 font-bold text-sm">{message}</div>
      )}

      <div className="glass p-6 rounded-3xl space-y-4">
        <p className="text-xs font-black uppercase text-slate-400">Personal details</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
          />
          <input
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
          />
        </div>
        <input
          type="email"
          disabled
          value={email}
          className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border-none text-slate-500"
        />
        <input
          placeholder="Specialization shown to patients"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            disabled
            value={licenseNumber}
            placeholder="License number"
            className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border-none text-slate-500"
          />
          <input
            disabled
            value={specialtyName}
            placeholder="Specialty category"
            className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border-none text-slate-500"
          />
        </div>
      </div>

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
          placeholder="Tell patients about your experience and approach…"
        />
      </div>

      <div className="glass p-6 rounded-3xl space-y-4">
        <p className="text-xs font-black uppercase text-slate-400">Weekly availability</p>
        {availability.map((slot, idx) => (
          <div key={slot.dayOfWeek} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center text-sm">
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
      </div>

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="w-full py-4 bg-secondary text-white rounded-2xl font-black disabled:opacity-50"
      >
        {saving ? 'Saving…' : 'Save profile & availability'}
      </button>
    </motion.div>
  );
}
