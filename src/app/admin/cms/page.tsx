"use client";

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { cmsAdminApi, type CmsPage } from '@/lib/api';
import Link from 'next/link';

export default function AdminCmsPage() {
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [pageType, setPageType] = useState('PAGE');

  const load = () => cmsAdminApi.pages().then(setPages).catch(console.error);

  useEffect(() => {
    load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await cmsAdminApi.createPage({
        title,
        slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
        pageType,
        status: 'DRAFT',
        sections: [
          {
            type: 'HERO',
            sortOrder: 0,
            contentJson: { headline: title, subheadline: '', ctaLabel: 'Learn more', ctaHref: '/' },
          },
          { type: 'TEXT', sortOrder: 1, contentJson: { body: 'Edit this content in the CMS.' } },
        ],
      });
      setTitle('');
      setSlug('');
      load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed');
    }
  };

  const publish = async (id: string) => {
    const page = pages.find((p) => p.id === id);
    if (!page) return;
    await cmsAdminApi.updatePage(id, { ...page, status: 'PUBLISHED' });
    load();
  };

  return (
    <AdminLayout>
      <section className="space-y-8">
        <header>
          <h1 className="text-4xl font-black">CMS</h1>
          <p className="text-slate-500">Manage pages, blog posts, and published content.</p>
        </header>

        <form onSubmit={create} className="glass p-6 rounded-3xl flex flex-col md:flex-row gap-4">
          <input
            required
            placeholder="Page title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
          />
          <input
            placeholder="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="flex-1 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
          />
          <select
            value={pageType}
            onChange={(e) => setPageType(e.target.value)}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
          >
            <option value="PAGE">Page</option>
            <option value="BLOG_POST">Blog post</option>
          </select>
          <button type="submit" className="px-6 py-4 bg-primary text-white rounded-2xl font-black">
            Create
          </button>
        </form>

        <ul className="space-y-3 list-none p-0 m-0">
          {pages.map((p) => (
            <li key={p.id} className="glass p-5 rounded-2xl flex flex-wrap justify-between gap-4 items-center">
              <span>
                <strong>{p.title}</strong>
                <br />
                <small className="text-slate-400">
                  /p/{p.slug} • {p.pageType} • {p.status}
                </small>
              </span>
              <span className="flex gap-2">
                {p.status === 'PUBLISHED' && (
                  <Link href={`/p/${p.slug}`} className="px-4 py-2 text-sm font-bold text-primary">
                    View
                  </Link>
                )}
                {p.status !== 'PUBLISHED' && (
                  <button
                    type="button"
                    onClick={() => publish(p.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold"
                  >
                    Publish
                  </button>
                )}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </AdminLayout>
  );
}
