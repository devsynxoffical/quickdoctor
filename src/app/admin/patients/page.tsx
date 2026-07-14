"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { adminApi } from '@/lib/api';

type UserRow = {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    address?: string | null;
    dob?: string;
  };
};

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<UserRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    dob: '',
    isActive: true,
  });

  const load = () => {
    setLoading(true);
    adminApi
      .users()
      .then((data) => setPatients((data as UserRow[]).filter((u) => u.role === 'PATIENT')))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = (row: UserRow) => {
    setEditing(row);
    setError(null);
    setForm({
      email: row.email || '',
      firstName: row.patient?.firstName || '',
      lastName: row.patient?.lastName || '',
      phone: row.patient?.phone || '',
      address: row.patient?.address || '',
      dob: row.patient?.dob ? row.patient.dob.slice(0, 10) : '',
      isActive: row.isActive,
    });
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      await adminApi.updatePatient(editing.id, {
        email: form.email.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim() || null,
        address: form.address.trim() || null,
        dob: form.dob || undefined,
        isActive: form.isActive,
      });
      setEditing(null);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h1 className="text-4xl font-black">All patients</h1>
        <p className="text-slate-500 mt-2">View and edit registered patient accounts.</p>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : patients.length === 0 ? (
        <p className="text-slate-500">No patients yet.</p>
      ) : (
        <div className="glass rounded-3xl overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-slate-50 dark:bg-slate-800 text-left">
              <tr>
                <th className="p-4 font-black uppercase text-[10px] text-slate-400">Name</th>
                <th className="p-4 font-black uppercase text-[10px] text-slate-400">Email</th>
                <th className="p-4 font-black uppercase text-[10px] text-slate-400">Phone</th>
                <th className="p-4 font-black uppercase text-[10px] text-slate-400">Status</th>
                <th className="p-4 font-black uppercase text-[10px] text-slate-400">Joined</th>
                <th className="p-4 font-black uppercase text-[10px] text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="p-4 font-bold">
                    {p.patient ? `${p.patient.firstName} ${p.patient.lastName}` : '—'}
                  </td>
                  <td className="p-4 text-slate-500">{p.email}</td>
                  <td className="p-4">{p.patient?.phone ?? '—'}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black ${
                        p.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {p.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <button
                      type="button"
                      onClick={() => openEdit(p)}
                      className="text-primary font-bold text-sm hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-xl">
            <h2 className="text-2xl font-black">Edit patient</h2>
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
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
            <input
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-sm"
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            />
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400">Date of birth</label>
              <input
                type="date"
                className="mt-1 w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-sm"
                value={form.dob}
                onChange={(e) => setForm((f) => ({ ...f, dob: e.target.value }))}
              />
            </div>
            <label className="flex items-center gap-3 text-sm font-bold">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                className="w-4 h-4 accent-primary"
              />
              Account active
            </label>
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
