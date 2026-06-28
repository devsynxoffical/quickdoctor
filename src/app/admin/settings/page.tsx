"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Settings, Newspaper, Shield } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-4xl font-black">System settings</h1>
        <p className="text-slate-500 mt-2">Manage site content and platform configuration.</p>
      </div>

      <div className="space-y-4">
        <Link
          href="/admin/cms"
          className="glass p-6 rounded-3xl flex items-center gap-4 hover:scale-[1.01] transition-transform"
        >
          <Newspaper className="w-8 h-8 text-primary" />
          <div>
            <p className="font-black">CMS & content</p>
            <p className="text-sm text-slate-500">Pages, blog posts, and navigation</p>
          </div>
        </Link>
        <Link
          href="/admin/categories"
          className="glass p-6 rounded-3xl flex items-center gap-4 hover:scale-[1.01] transition-transform"
        >
          <Settings className="w-8 h-8 text-secondary" />
          <div>
            <p className="font-black">Specialty categories</p>
            <p className="text-sm text-slate-500">Doctor specialties and service types</p>
          </div>
        </Link>
        <div className="glass p-6 rounded-3xl flex items-center gap-4 opacity-80">
          <Shield className="w-8 h-8 text-slate-400" />
          <div>
            <p className="font-black">API & integrations</p>
            <p className="text-sm text-slate-500">
              Stripe, Zoom, and email are configured in backend <code className="text-xs">.env</code> on the server.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
