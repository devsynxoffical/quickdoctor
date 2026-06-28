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
  patient?: { firstName: string; lastName: string; phone?: string };
};

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .users()
      .then((data) => setPatients((data as UserRow[]).filter((u) => u.role === 'PATIENT')))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h1 className="text-4xl font-black">All patients</h1>
        <p className="text-slate-500 mt-2">Registered patient accounts.</p>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : patients.length === 0 ? (
        <p className="text-slate-500">No patients yet.</p>
      ) : (
        <div className="glass rounded-3xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800 text-left">
              <tr>
                <th className="p-4 font-black uppercase text-[10px] text-slate-400">Name</th>
                <th className="p-4 font-black uppercase text-[10px] text-slate-400">Email</th>
                <th className="p-4 font-black uppercase text-[10px] text-slate-400">Phone</th>
                <th className="p-4 font-black uppercase text-[10px] text-slate-400">Joined</th>
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
                  <td className="p-4 text-slate-400">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
