"use client";

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { motion } from 'framer-motion';
import { adminApi, type SpecialtyCategory } from '@/lib/api';
import { Plus } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<SpecialtyCategory[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const load = () => adminApi.categories().then(setCategories).catch(console.error);
  useEffect(() => {
    load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createCategory({
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      });
      setName('');
      setSlug('');
      load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed');
    }
  };

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <h1 className="text-4xl font-black">Specialty categories</h1>
        <p className="text-slate-500">Doctors choose a category when applying.</p>

        <form onSubmit={create} className="glass p-6 rounded-3xl flex flex-col sm:flex-row gap-4">
          <input
            required
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
          />
          <input
            placeholder="slug (optional)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="flex-1 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
          />
          <button
            type="submit"
            className="px-6 py-4 bg-primary text-white rounded-2xl font-black flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add
          </button>
        </form>

        <motion.div className="grid gap-3">
          {categories.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass p-5 rounded-2xl flex justify-between items-center"
            >
              <div>
                <p className="font-bold">{c.name}</p>
                <p className="text-xs text-slate-400">{c.slug}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
}
