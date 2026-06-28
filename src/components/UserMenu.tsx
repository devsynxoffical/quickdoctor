"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, LogOut, Settings, LayoutDashboard, User } from 'lucide-react';
import {
  clearSession,
  getStoredUser,
  getToken,
  normalizeRole,
  type StoredUser,
} from '@/lib/auth';

export default function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUser(getStoredUser());
    const onStorage = () => setUser(getStoredUser());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  if (!getToken() || !user) {
    return (
      <Link
        href="/login"
        className="hidden sm:flex px-5 lg:px-6 py-2.5 bg-primary text-white rounded-lg text-[12px] font-bold tracking-wide hover:bg-primary/90 transition-all shadow-md shadow-primary/25"
      >
        Sign in
      </Link>
    );
  }

  const role = normalizeRole(user.role);
  const dashboardPath =
    role === 'ADMIN' ? '/admin' : role === 'DOCTOR' ? '/doctor' : '/dashboard';
  const settingsPath =
    role === 'ADMIN'
      ? '/admin/settings'
      : role === 'DOCTOR'
        ? '/doctor/settings'
        : '/dashboard/settings';
  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email.split('@')[0];
  const initials =
    (user.firstName?.[0] || user.email[0] || '?').toUpperCase() +
    (user.lastName?.[0] || '').toUpperCase();

  const signOut = () => {
    clearSession();
    setUser(null);
    setOpen(false);
    router.push('/');
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm">
          {initials}
        </div>
        <span className="hidden lg:block text-left max-w-[120px]">
          <span className="block text-sm font-bold text-dark-slate dark:text-white truncate">
            {displayName}
          </span>
          <span className="block text-[10px] font-bold text-primary uppercase">{role || 'User'}</span>
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-[70]">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
            <p className="font-bold text-sm truncate">{displayName}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
          <Link
            href={dashboardPath}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            href={settingsPath}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          <Link
            href={dashboardPath}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 lg:hidden"
          >
            <User className="w-4 h-4" />
            My profile
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
