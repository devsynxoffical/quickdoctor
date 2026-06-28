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

/** When a published CMS page exists for this slug, it replaces the static page content. */
export default function CmsPageGate({ slug, children }: CmsPageGateProps) {
  const [page, setPage] = useState<CmsPage | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    cmsApi
      .getPage(slug)
      .then(setPage)
      .catch(() => setPage(null))
      .finally(() => setLoaded(true));
  }, [slug]);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 font-bold">
        Loading…
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
