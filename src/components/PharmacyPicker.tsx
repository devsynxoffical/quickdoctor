"use client";

import React from 'react';
import { IRISH_PHARMACIES, pharmacyLabel } from '@/lib/pharmacies';

type PharmacyPickerProps = {
  value: string;
  onChange: (pharmacyId: string) => void;
  customName?: string;
  onCustomNameChange?: (name: string) => void;
  required?: boolean;
  className?: string;
  label?: string;
};

export default function PharmacyPicker({
  value,
  onChange,
  customName = '',
  onCustomNameChange,
  required,
  className,
  label = 'Preferred pharmacy',
}: PharmacyPickerProps) {
  return (
    <div className={className}>
      <label className="text-xs font-black uppercase text-slate-400">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="mt-2 w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none text-sm"
      >
        <option value="">Select a pharmacy…</option>
        {IRISH_PHARMACIES.map((p) => (
          <option key={p.id} value={p.id}>
            {pharmacyLabel(p)}
          </option>
        ))}
      </select>
      {value === 'other' && onCustomNameChange && (
        <input
          type="text"
          value={customName}
          onChange={(e) => onCustomNameChange(e.target.value)}
          placeholder="Pharmacy name and town"
          required={required}
          className="mt-3 w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none text-sm"
        />
      )}
      <p className="mt-2 text-xs text-slate-500">
        Your prescription will be sent securely to this pharmacy (not shown as a downloadable file in your account).
      </p>
    </div>
  );
}
