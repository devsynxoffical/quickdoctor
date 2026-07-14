"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CmsPageRenderer from '@/components/CmsPageRenderer';
import { cmsApi, type CmsPage } from '@/lib/api';

type CmsPageGateProps = {
  slug: string;
  children: React.ReactNode;
};

/**
 * Published CMS page replaces static content.
 * Draft CMS page hides the static fallback (not live).
 * Missing CMS page keeps the built-in static page.
 */
export default function CmsPageGate({ slug, children }: CmsPageGateProps) {
  const [page, setPage] = useState<CmsPage | null>(null);
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT' | 'MISSING' | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const avail = await cmsApi.pageAvailability(slug);
        if (cancelled) return;
        setStatus(avail.status);
        if (avail.status === 'PUBLISHED') {
          const published = await cmsApi.getPage(slug);
          if (!cancelled) setPage(published);
        } else {
          setPage(null);
        }
      } catch {
        if (!cancelled) {
          setStatus('MISSING');
          setPage(null);
        }
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 font-bold">
        Loading…
      </div>
    );
  }

  if (status === 'DRAFT') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <main className="pt-28 pb-24 px-6 max-w-xl mx-auto text-center">
          <h1 className="text-3xl font-black text-dark-slate dark:text-white">Page not available</h1>
          <p className="mt-3 text-slate-500">
            This page is still in draft and is not live on the website yet.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  if (page?.sections?.length) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <main className="pt-28 pb-24 px-6 max-w-5xl mx-auto">
          <CmsPageRenderer page={page} />
        </main>
        <Footer />
      </div>
    );
  }

  return <>{children}</>;
}
