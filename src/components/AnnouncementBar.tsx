"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { cmsApi } from '@/lib/api';
import { X } from 'lucide-react';

type AnnouncementValue = {
  enabled?: boolean;
  message?: string;
  linkHref?: string;
  linkLabel?: string;
};

const DISMISS_KEY = 'qd-announcement-dismissed';

export default function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState<AnnouncementValue | null>(null);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    cmsApi
      .settings()
      .then((map) => {
        const value = (map.announcement || null) as AnnouncementValue | null;
        setAnnouncement(value);
        if (value?.enabled && value.message) {
          const fingerprint = `${value.message}|${value.linkHref || ''}`;
          const prev = sessionStorage.getItem(DISMISS_KEY);
          setDismissed(prev === fingerprint);
        } else {
          setDismissed(true);
        }
      })
      .catch(() => setAnnouncement(null));
  }, []);

  if (!announcement?.enabled || !announcement.message || dismissed) {
    return null;
  }

  const dismiss = () => {
    const fingerprint = `${announcement.message}|${announcement.linkHref || ''}`;
    sessionStorage.setItem(DISMISS_KEY, fingerprint);
    setDismissed(true);
  };

  return (
    <div className="relative z-[60] bg-secondary text-white text-center text-sm font-semibold px-10 py-2.5">
      <span>{announcement.message}</span>
      {announcement.linkHref && (
        <Link href={announcement.linkHref} className="ml-3 underline underline-offset-2 font-black">
          {announcement.linkLabel || 'Learn more'}
        </Link>
      )}
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/15"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
