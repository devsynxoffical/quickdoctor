"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { notificationApi, type NotificationRow } from '@/lib/api';
import { getToken } from '@/lib/auth';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [items, setItems] = useState<NotificationRow[]>([]);

  const load = () => {
    if (!getToken()) return;
    notificationApi.unreadCount().then((r) => setCount(r.count)).catch(() => {});
    notificationApi.list().then(setItems).catch(() => {});
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, []);

  if (!getToken()) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          if (!open) load();
        }}
        className="relative w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 z-50">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <span className="font-black text-sm">Notifications</span>
            <button
              type="button"
              onClick={() => notificationApi.markAllRead().then(load)}
              className="text-xs text-primary font-bold"
            >
              Mark all read
            </button>
          </div>
          {items.length === 0 ? (
            <p className="p-6 text-sm text-slate-400 text-center">No notifications</p>
          ) : (
            items.map((n) => (
              <Link
                key={n.id}
                href={n.link || '#'}
                onClick={() => {
                  if (!n.read) notificationApi.markRead(n.id).then(load);
                  setOpen(false);
                }}
                className={`block p-4 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                  !n.read ? 'bg-primary/5' : ''
                }`}
              >
                <p className="font-bold text-sm">{n.title}</p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{n.body}</p>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
