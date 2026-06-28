"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CmsPageRenderer from '@/components/CmsPageRenderer';
import { cmsApi, type CmsPage } from '@/lib/api';

export default function CmsDynamicClient() {
  const params = useParams();
  const slug = params.slug as string;
  const [page, setPage] = useState<CmsPage | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cmsApi
      .getPage(slug)
      .then(setPage)
      .catch((e) => setError(e instanceof Error ? e.message : 'Page not found'));
  }, [slug]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="pt-28 pb-24 px-6 max-w-5xl mx-auto">
        {error ? (
          <p className="text-center text-slate-500">{error}</p>
        ) : !page ? (
          <p className="text-center text-slate-400">Loading…</p>
        ) : (
          <CmsPageRenderer page={page} />
        )}
      </main>
      <Footer />
    </div>
  );
}
