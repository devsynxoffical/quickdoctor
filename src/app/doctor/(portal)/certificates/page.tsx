"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, ArrowRight } from 'lucide-react';

export default function DoctorCertificatesPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-4xl font-black">Medical certificates</h1>
        <p className="text-slate-500 mt-2">
          Issue sick certificates during an active consultation.
        </p>
      </div>

      <div className="glass p-8 rounded-3xl space-y-4">
        <FileText className="w-10 h-10 text-secondary" />
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Open a consultation, then use the <strong>Certificate</strong> tab to issue a sick
          certificate for that patient. Certificates are linked to the appointment record.
        </p>
        <Link
          href="/doctor/consultations"
          className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-xl font-black"
        >
          Go to consultations <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}
