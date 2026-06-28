"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomeCmsRenderer from '@/components/home/HomeCmsRenderer';
import StaticHomePage from '@/components/home/StaticHomePage';
import { cmsApi, type CmsPage } from '@/lib/api';

/** Uses CMS home content when published; otherwise shows the built-in static homepage. */
export default function HomePageRoot() {
  const [page, setPage] = useState<CmsPage | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    cmsApi
      .getPage('home')
      .then(setPage)
      .catch(() => setPage(null))
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 font-bold">
        Loading…
      </div>
    );
  }

  const useCms = page && page.sections.length >= 3;

  return (
    <>
      <Navbar />
      {useCms ? <HomeCmsRenderer page={page} /> : <StaticHomePage />}
      <Footer />
    </>
  );
}
