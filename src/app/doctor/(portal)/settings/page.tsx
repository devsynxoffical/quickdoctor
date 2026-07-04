"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { doctorProfileApi } from '@/lib/api';
import { APP_TIMEZONE_LABEL } from '@/lib/appTime';

type AvailabilitySlot = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotMinutes: number;
  enabled: boolean;
};

/** Mon–Fri on by default; Sat/Sun optional */
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0] as const;

const DAY_LABELS: Record<number, string> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

function buildWeekTemplate(
  saved?: Array<{ dayOfWeek: number; startTime: string; endTime: string; slotMinutes?: number }>
): AvailabilitySlot[] {
  return WEEK_ORDER.map((dayOfWeek) => {
    const existing = saved?.find((s) => s.dayOfWeek === dayOfWeek);
    const defaultEnabled = dayOfWeek >= 1 && dayOfWeek <= 5;
    return {
      dayOfWeek,
      startTime: existing?.startTime || '09:00',
      endTime: existing?.endTime || '17:00',
      slotMinutes: existing?.slotMinutes || 15,
      enabled: existing ? true : saved?.length ? false : defaultEnabled,
    };
  });
}

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
  availability?: Array<{ dayOfWeek: number; startTime: string; endTime: string; slotMinutes?: number }>;
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
  const [availability, setAvailability] = useState<AvailabilitySlot[]>(() => buildWeekTemplate());
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
        setAvailability(buildWeekTemplate(doc.availability));
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : 'Could not load profile');
      })
      .finally(() => setLoadingProfile(false));
  }, []);

  const updateSlot = (dayOfWeek: number, patch: Partial<AvailabilitySlot>) => {
    setAvailability((prev) =>
      prev.map((slot) => (slot.dayOfWeek === dayOfWeek ? { ...slot, ...patch } : slot))
    );
  };

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

    const activeDays = availability.filter((s) => s.enabled);
    if (activeDays.length === 0) {
      setError('Enable at least one day in your weekly availability.');
      setSaving(false);
      return;
    }

    for (const slot of activeDays) {
      if (slot.startTime >= slot.endTime) {
        setError(`${DAY_LABELS[slot.dayOfWeek]}: end time must be after start time.`);
        setSaving(false);
        return;
      }
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
      await doctorProfileApi.updateAvailability(
        activeDays.map(({ enabled: _enabled, ...slot }) => slot)
      );
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
          Update your public profile, consultation fee, and weekly availability — including weekends.
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
        <div>
          <p className="text-xs font-black uppercase text-slate-400">Weekly availability</p>
          <p className="text-xs text-slate-500 mt-1">
            All times are in {APP_TIMEZONE_LABEL}. Turn on Saturday or Sunday if you offer weekend
            consultations.
          </p>
        </div>

        {availability.map((slot) => (
          <div
            key={slot.dayOfWeek}
            className={`p-4 rounded-2xl border transition-colors ${
              slot.enabled
                ? 'border-secondary/30 bg-secondary/5'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={slot.enabled}
                  onChange={(e) => updateSlot(slot.dayOfWeek, { enabled: e.target.checked })}
                  className="w-4 h-4 accent-secondary"
                />
                <span className="font-bold text-sm">{DAY_LABELS[slot.dayOfWeek]}</span>
                {slot.dayOfWeek === 6 || slot.dayOfWeek === 0 ? (
                  <span className="text-[10px] font-bold uppercase tracking-wide text-secondary">
                    Weekend
                  </span>
                ) : null}
              </label>
              {slot.enabled ? (
                <div className="flex items-center gap-2 text-sm">
                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => updateSlot(slot.dayOfWeek, { startTime: e.target.value })}
                    className="p-2 rounded-xl bg-white dark:bg-slate-800 border-none"
                  />
                  <span className="text-slate-400">to</span>
                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => updateSlot(slot.dayOfWeek, { endTime: e.target.value })}
                    className="p-2 rounded-xl bg-white dark:bg-slate-800 border-none"
                  />
                </div>
              ) : (
                <span className="text-xs text-slate-400">Not available</span>
              )}
            </div>
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
