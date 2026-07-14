"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { publicDoctorApi, specialtyApi, type PublicDoctor, type SpecialtyCategory } from '@/lib/api';
import { Stethoscope, ArrowRight } from 'lucide-react';
import DoctorStars from '@/components/DoctorStars';

export default function DoctorsListPage() {
  const [doctors, setDoctors] = useState<PublicDoctor[]>([]);
  const [categories, setCategories] = useState<SpecialtyCategory[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    specialtyApi.list().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    publicDoctorApi
      .list(categoryId || undefined)
      .then(setDoctors)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [categoryId]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="pt-28 pb-24 px-6 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-black mb-2">Find a doctor</h1>
          <p className="text-slate-500 mb-8">Book a video consultation with an approved specialist.</p>

          <div className="flex flex-wrap gap-2 mb-10">
            <button
              type="button"
              onClick={() => setCategoryId('')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase ${
                !categoryId ? 'bg-primary text-white' : 'bg-white dark:bg-slate-900'
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategoryId(c.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase ${
                  categoryId === c.id ? 'bg-primary text-white' : 'bg-white dark:bg-slate-900'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-slate-400">Loading doctors…</p>
          ) : doctors.length === 0 ? (
            <p className="text-slate-500">No doctors available in this category yet.</p>
          ) : (
            <div className="grid gap-4">
              {doctors.map((doc, i) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass p-6 rounded-3xl medical-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center shrink-0">
                      <Stethoscope className="w-7 h-7 text-secondary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black">
                        Dr. {doc.firstName} {doc.lastName}
                      </h2>
                      <p className="text-sm text-slate-500">
                        {doc.category?.name || doc.specialization}
                      </p>
                      <DoctorStars
                        averageRating={doc.averageRating}
                        reviewCount={doc.reviewCount}
                        className="mt-2"
                      />
                      {doc.bio && (
                        <p className="text-sm text-slate-400 mt-2 line-clamp-2">{doc.bio}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-black text-primary">
                      €{(doc.consultationFeeCents / 100).toFixed(2)}
                    </p>
                    <Link
                      href={`/doctors/book?id=${encodeURIComponent(doc.id)}`}
                      className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm flex items-center gap-2"
                    >
                      Book <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
