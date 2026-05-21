"use client";

import Link from 'next/link';
import type { CmsPage } from '@/lib/api';

export default function CmsPageRenderer({ page }: { page: CmsPage }) {
  return (
    <div className="space-y-12">
      {page.sections.map((section) => {
        const c = section.contentJson;
        if (section.type === 'HERO') {
          return (
            <div key={section.id} className="text-center max-w-3xl mx-auto space-y-6">
              <h1 className="text-4xl md:text-5xl font-black">{String(c.headline || page.title)}</h1>
              {c.subheadline ? (
                <p className="text-lg text-slate-500">{String(c.subheadline)}</p>
              ) : null}
              {c.ctaHref ? (
                <Link
                  href={String(c.ctaHref)}
                  className="inline-block px-8 py-4 bg-primary text-white rounded-2xl font-black"
                >
                  {String(c.ctaLabel || 'Learn more')}
                </Link>
              ) : null}
              {c.excerpt ? <p className="text-slate-500">{String(c.excerpt)}</p> : null}
            </div>
          );
        }
        if (section.type === 'TEXT' || section.type === 'HTML') {
          return (
            <div
              key={section.id}
              className="max-w-3xl mx-auto text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap"
            >
              {String(c.body || '')}
            </div>
          );
        }
        if (section.type === 'CTA') {
          return (
            <div
              key={section.id}
              className="glass p-8 rounded-3xl text-center medical-shadow max-w-xl mx-auto"
            >
              <p className="font-bold mb-4">{String(c.text || '')}</p>
              {c.href ? (
                <Link href={String(c.href)} className="text-primary font-black">
                  {String(c.label || 'Continue')}
                </Link>
              ) : null}
            </div>
          );
        }
        if (section.type === 'FAQ') {
          const items = (c.items as { q: string; a: string }[]) || [];
          return (
            <div key={section.id} className="max-w-2xl mx-auto space-y-4">
              {items.map((item, i) => (
                <div key={i} className="glass p-6 rounded-2xl">
                  <p className="font-black mb-2">{item.q}</p>
                  <p className="text-sm text-slate-500">{item.a}</p>
                </div>
              ))}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
