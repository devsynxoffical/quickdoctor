"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Stethoscope, Calendar } from 'lucide-react';
import { adminApi } from '@/lib/api';

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalRevenue: 0,
  });
  const [payments, setPayments] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminApi.stats(), adminApi.payments()])
      .then(([statsData, paymentsData]) => {
        setStats(statsData);
        setPayments(paymentsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div>
        <h1 className="text-4xl font-black">Financial reports</h1>
        <p className="text-slate-500 mt-2">Platform revenue and activity overview.</p>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading…</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Patients', value: stats.totalPatients, icon: Users },
              { label: 'Doctors', value: stats.totalDoctors, icon: Stethoscope },
              { label: 'Appointments', value: stats.totalAppointments, icon: Calendar },
              { label: 'Revenue (EUR)', value: `€${stats.totalRevenue.toLocaleString()}`, icon: BarChart3 },
            ].map((item) => (
              <div key={item.label} className="glass p-6 rounded-3xl">
                <item.icon className="w-6 h-6 text-primary mb-3" />
                <p className="text-[10px] font-black uppercase text-slate-400">{item.label}</p>
                <p className="text-2xl font-black mt-1">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="glass rounded-3xl p-6">
            <h2 className="text-lg font-black mb-4">Recent payments</h2>
            <p className="text-sm text-slate-500">{payments.length} payment records loaded.</p>
          </div>
        </>
      )}
    </motion.div>
  );
}
