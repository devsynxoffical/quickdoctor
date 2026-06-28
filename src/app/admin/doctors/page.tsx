"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { adminApi } from '@/lib/api';

type DoctorRow = {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  status: string;
  consultationFeeCents: number;
  user?: { email: string };
};

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<DoctorRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .doctors()
      .then((data) => setDoctors(data as DoctorRow[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h1 className="text-4xl font-black">All doctors</h1>
        <p className="text-slate-500 mt-2">Registered doctors and approval status.</p>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : doctors.length === 0 ? (
        <p className="text-slate-500">No doctors yet.</p>
      ) : (
        <div className="glass rounded-3xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800 text-left">
              <tr>
                <th className="p-4 font-black uppercase text-[10px] text-slate-400">Name</th>
                <th className="p-4 font-black uppercase text-[10px] text-slate-400">Email</th>
                <th className="p-4 font-black uppercase text-[10px] text-slate-400">Specialty</th>
                <th className="p-4 font-black uppercase text-[10px] text-slate-400">Status</th>
                <th className="p-4 font-black uppercase text-[10px] text-slate-400">Fee</th>
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
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-primary/10 text-primary">
                      {d.status}
                    </span>
                  </td>
                  <td className="p-4 font-bold">€{(d.consultationFeeCents / 100).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
