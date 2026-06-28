"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { adminApi } from '@/lib/api';
import { Check, X } from 'lucide-react';

type Application = {
  id: string;
  status: string;
  licenseNumber: string;
  submittedAt: string;
  rejectionReason?: string;
  specialtyCategory?: { name: string };
  user?: { email: string };
};

export default function AdminApplicationsPage() {
  const [filter, setFilter] = useState('PENDING');
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminApi.applications(filter);
      setApps(data as Application[]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filter]);

  const approve = async (id: string) => {
    setActionId(id);
    try {
      await adminApi.approveApplication(id);
      await load();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed');
    } finally {
      setActionId(null);
    }
  };

  const reject = async (id: string) => {
    const reason = prompt('Rejection reason for the doctor:');
    if (!reason) return;
    setActionId(id);
    try {
      await adminApi.rejectApplication(id, reason);
      await load();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed');
    } finally {
      setActionId(null);
    }
  };

  return (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div>
          <h1 className="text-4xl font-black">Doctor applications</h1>
          <p className="text-slate-500 mt-2">Review and approve doctor registration requests.</p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-2 flex-wrap"
        >
          {['PENDING', 'APPROVED', 'REJECTED'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
                filter === s ? 'bg-dark-slate text-white' : 'bg-slate-100 dark:bg-slate-800'
              }`}
            >
              {s}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <p className="text-slate-400">Loading…</p>
        ) : apps.length === 0 ? (
          <p className="text-slate-500">No applications in this category.</p>
        ) : (
          <div className="space-y-4">
            {apps.map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass p-6 rounded-3xl medical-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <p className="font-black text-lg">{app.user?.email}</p>
                  <p className="text-sm text-slate-500">
                    {app.specialtyCategory?.name} • License {app.licenseNumber}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Submitted {new Date(app.submittedAt).toLocaleString()}
                  </p>
                  {app.rejectionReason && (
                    <p className="text-sm text-red-500 mt-2">Reason: {app.rejectionReason}</p>
                  )}
                </div>
                {app.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <button
                      disabled={actionId === app.id}
                      onClick={() => approve(app.id)}
                      className="px-5 py-3 bg-green-600 text-white rounded-xl font-bold text-sm flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" /> Approve
                    </button>
                    <button
                      disabled={actionId === app.id}
                      onClick={() => reject(app.id)}
                      className="px-5 py-3 bg-red-500 text-white rounded-xl font-bold text-sm flex items-center gap-2"
                    >
                      <X className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}
                {app.status !== 'PENDING' && (
                  <span
                    className={`px-4 py-2 rounded-full text-xs font-black uppercase ${
                      app.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {app.status}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
      );
}
