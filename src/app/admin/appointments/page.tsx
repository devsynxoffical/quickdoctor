"use client";

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { adminApi } from '@/lib/api';

type Row = {
  id: string;
  dateTime: string;
  status: string;
  priceCents: number;
  patient?: { firstName: string; lastName: string };
  doctor?: { firstName: string; lastName: string };
  payment?: { status: string };
};

export default function AdminAppointmentsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .appointments()
      .then((d) => setRows(d as Row[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <h1 className="text-4xl font-black">All appointments</h1>
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
      </div>
    </AdminLayout>
  );
}
