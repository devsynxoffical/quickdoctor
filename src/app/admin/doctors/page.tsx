"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { adminApi } from '@/lib/api';

type DoctorRow = {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  licenseNumber?: string;
  bio?: string | null;
  status: string;
  consultationFeeCents: number;
  profileComplete?: boolean;
  offersVideoConsultation?: boolean;
  offersPrescriptionReview?: boolean;
  offersMedicalCertificate?: boolean;
  user?: { email: string; isActive?: boolean };
};

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<DoctorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<DoctorRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    specialization: '',
    licenseNumber: '',
    bio: '',
    consultationFeeEuro: '49',
    status: 'APPROVED',
    isActive: true,
    profileComplete: true,
    offersVideoConsultation: true,
    offersPrescriptionReview: true,
    offersMedicalCertificate: true,
  });

  const load = () => {
    setLoading(true);
    adminApi
      .doctors()
      .then((data) => setDoctors(data as DoctorRow[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = (row: DoctorRow) => {
    setEditing(row);
    setError(null);
    setForm({
      email: row.user?.email || '',
      firstName: row.firstName || '',
      lastName: row.lastName || '',
      specialization: row.specialization || '',
      licenseNumber: row.licenseNumber || '',
      bio: row.bio || '',
      consultationFeeEuro: String((row.consultationFeeCents || 4900) / 100),
      status: row.status || 'APPROVED',
      isActive: row.user?.isActive !== false,
      profileComplete: row.profileComplete !== false,
      offersVideoConsultation: row.offersVideoConsultation !== false,
      offersPrescriptionReview: row.offersPrescriptionReview !== false,
      offersMedicalCertificate: row.offersMedicalCertificate !== false,
    });
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      const fee = Math.round(Number(form.consultationFeeEuro) * 100);
      await adminApi.updateDoctor(editing.id, {
        email: form.email.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        specialization: form.specialization.trim(),
        licenseNumber: form.licenseNumber.trim(),
        bio: form.bio.trim() || null,
        consultationFeeCents: Number.isFinite(fee) ? fee : undefined,
        status: form.status,
        isActive: form.isActive,
        profileComplete: form.profileComplete,
        offersVideoConsultation: form.offersVideoConsultation,
        offersPrescriptionReview: form.offersPrescriptionReview,
        offersMedicalCertificate: form.offersMedicalCertificate,
      });
      setEditing(null);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const quickSuspend = async (row: DoctorRow, suspend: boolean) => {
    try {
      await adminApi.updateDoctor(row.id, {
        status: suspend ? 'SUSPENDED' : 'APPROVED',
        isActive: !suspend,
      });
      load();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Update failed');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h1 className="text-4xl font-black">All doctors</h1>
        <p className="text-slate-500 mt-2">
          Edit doctor details, service categories (consultation / prescription / certificate), and disable accounts.
        </p>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : doctors.length === 0 ? (
        <p className="text-slate-500">No doctors yet.</p>
      ) : (
        <div className="glass rounded-3xl overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="bg-slate-50 dark:bg-slate-800 text-left">
              <tr>
                <th className="p-4 font-black uppercase text-[10px] text-slate-400">Name</th>
                <th className="p-4 font-black uppercase text-[10px] text-slate-400">Email</th>
                <th className="p-4 font-black uppercase text-[10px] text-slate-400">Specialty</th>
                <th className="p-4 font-black uppercase text-[10px] text-slate-400">Categories</th>
                <th className="p-4 font-black uppercase text-[10px] text-slate-400">Status</th>
                <th className="p-4 font-black uppercase text-[10px] text-slate-400">Fee</th>
                <th className="p-4 font-black uppercase text-[10px] text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((d) => (
                <tr key={d.id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="p-4 font-bold">
                    Dr. {d.firstName} {d.lastName}
                  </td>
                  <td className="p-4 text-slate-500">{d.user?.email ?? '—'}</td>
                  <td className="p-4">{d.specialization}</td>
                  <td className="p-4 text-xs text-slate-500">
                    {[
                      d.offersVideoConsultation !== false ? 'GP' : null,
                      d.offersPrescriptionReview ? 'Prescriber' : null,
                      d.offersMedicalCertificate ? 'Cert' : null,
                    ]
                      .filter(Boolean)
                      .join(' · ') || '—'}
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-primary/10 text-primary">
                      {d.status}
                      {d.user?.isActive === false ? ' · DISABLED' : ''}
                    </span>
                  </td>
                  <td className="p-4 font-bold">€{(d.consultationFeeCents / 100).toFixed(2)}</td>
                  <td className="p-4 space-x-3 whitespace-nowrap">
                    <button type="button" onClick={() => openEdit(d)} className="text-primary font-bold text-sm hover:underline">
                      Edit
                    </button>
                    {d.status === 'APPROVED' && d.user?.isActive !== false ? (
                      <button
                        type="button"
                        onClick={() => quickSuspend(d, true)}
                        className="text-red-600 font-bold text-sm hover:underline"
                      >
                        Disable
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => quickSuspend(d, false)}
                        className="text-emerald-700 font-bold text-sm hover:underline"
                      >
                        Enable
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black">Edit doctor</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-sm"
                placeholder="First name"
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
              />
              <input
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-sm"
                placeholder="Last name"
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
              />
            </div>
            <input
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-sm"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
            <input
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-sm"
              placeholder="Specialization"
              value={form.specialization}
              onChange={(e) => setForm((f) => ({ ...f, specialization: e.target.value }))}
            />
            <input
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-sm"
              placeholder="Medical registration number"
              value={form.licenseNumber}
              onChange={(e) => setForm((f) => ({ ...f, licenseNumber: e.target.value }))}
            />
            <textarea
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-sm"
              rows={3}
              placeholder="Bio"
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            />
            <input
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-sm"
              placeholder="Consultation fee (€)"
              value={form.consultationFeeEuro}
              onChange={(e) => setForm((f) => ({ ...f, consultationFeeEuro: e.target.value }))}
            />
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400">Status</label>
              <select
                className="mt-1 w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-sm"
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              >
                <option value="APPROVED">APPROVED</option>
                <option value="SUSPENDED">SUSPENDED</option>
                <option value="PENDING">PENDING</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>
            <label className="flex items-center gap-3 text-sm font-bold">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                className="w-4 h-4 accent-primary"
              />
              Login enabled (user active)
            </label>
            <label className="flex items-center gap-3 text-sm font-bold">
              <input
                type="checkbox"
                checked={form.profileComplete}
                onChange={(e) => setForm((f) => ({ ...f, profileComplete: e.target.checked }))}
                className="w-4 h-4 accent-primary"
              />
              Profile complete (bookable)
            </label>
            <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
              <p className="text-[10px] font-black uppercase text-slate-400">Assignment categories</p>
              <p className="text-xs text-slate-500">
                General Physicians can receive any booking. Prescribers and certificate issuers only receive that
                service type when auto-assign is on.
              </p>
              <label className="flex items-center gap-3 text-sm font-bold">
                <input
                  type="checkbox"
                  checked={form.offersVideoConsultation}
                  onChange={(e) => setForm((f) => ({ ...f, offersVideoConsultation: e.target.checked }))}
                  className="w-4 h-4 accent-primary"
                />
                General Physician (consultations + all booking types)
              </label>
              <label className="flex items-center gap-3 text-sm font-bold">
                <input
                  type="checkbox"
                  checked={form.offersPrescriptionReview}
                  onChange={(e) => setForm((f) => ({ ...f, offersPrescriptionReview: e.target.checked }))}
                  className="w-4 h-4 accent-primary"
                />
                Prescriber (prescription bookings)
              </label>
              <label className="flex items-center gap-3 text-sm font-bold">
                <input
                  type="checkbox"
                  checked={form.offersMedicalCertificate}
                  onChange={(e) => setForm((f) => ({ ...f, offersMedicalCertificate: e.target.checked }))}
                  className="w-4 h-4 accent-primary"
                />
                Certificate issuer (certificate bookings)
              </label>
            </div>
            {error && <p className="text-sm text-red-600 font-bold">{error}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl font-bold text-sm">
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={save}
                className="px-5 py-2 rounded-xl bg-primary text-white font-bold text-sm disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
