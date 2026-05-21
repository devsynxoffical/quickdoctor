"use client";

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { adminApi } from '@/lib/api';

type PaymentRow = {
  id: string;
  amountCents: number;
  currency: string;
  status: string;
  appointment?: {
    dateTime: string;
    patient?: { firstName: string; lastName: string };
  };
};

export default function AdminPaymentsPage() {
  const [rows, setRows] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .payments()
      .then((d) => setRows(d as PaymentRow[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <section className="space-y-8">
        <h1 className="text-4xl font-black">Payments</h1>
        {loading ? (
          <p className="text-slate-400">Loading…</p>
        ) : (
          <ul className="space-y-3 list-none p-0 m-0">
            {rows.map((p) => (
              <li key={p.id} className="glass p-5 rounded-2xl flex justify-between gap-4">
                <span>
                  <strong>
                    {p.appointment?.patient?.firstName} {p.appointment?.patient?.lastName}
                  </strong>
                  <br />
                  <small className="text-slate-500">
                    {p.appointment?.dateTime
                      ? new Date(p.appointment.dateTime).toLocaleString()
                      : '—'}
                  </small>
                </span>
                <span className="text-right">
                  <strong className="text-primary">
                    {p.currency} {(p.amountCents / 100).toFixed(2)}
                  </strong>
                  <br />
                  <small className="font-black uppercase">{p.status}</small>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AdminLayout>
  );
}
