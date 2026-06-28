"use client";

import React, { useEffect, useState } from 'react';
import { cmsAdminApi, type CmsPage, type CmsSection } from '@/lib/api';
import Link from 'next/link';
import { Trash2, Pencil, X, Plus } from 'lucide-react';

type SectionDraft = {
  type: string;
  sortOrder: number;
  contentJson: Record<string, unknown>;
};

function sectionsToDraft(sections: CmsSection[]): SectionDraft[] {
  return [...sections]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((s, i) => ({
      type: s.type,
      sortOrder: i,
      contentJson: { ...s.contentJson },
    }));
}

function defaultSection(type: string, sortOrder: number): SectionDraft {
  if (type === 'HERO') {
    return {
      type: 'HERO',
      sortOrder,
      contentJson: { headline: '', subheadline: '', ctaLabel: 'Learn more', ctaHref: '/' },
    };
  }
  return { type: 'TEXT', sortOrder, contentJson: { body: '' } };
}

export default function AdminCmsPage() {
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [pageType, setPageType] = useState('PAGE');
  const [editing, setEditing] = useState<CmsPage | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editPageType, setEditPageType] = useState('PAGE');
  const [editStatus, setEditStatus] = useState('DRAFT');
  const [editSeoTitle, setEditSeoTitle] = useState('');
  const [editSeoDescription, setEditSeoDescription] = useState('');
  const [editSections, setEditSections] = useState<SectionDraft[]>([]);
  const [saving, setSaving] = useState(false);

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

  const openEditor = (page: CmsPage) => {
    setEditing(page);
    setEditTitle(page.title);
    setEditSlug(page.slug);
    setEditPageType(page.pageType);
    setEditStatus(page.status);
    setEditSeoTitle(page.seoTitle || '');
    setEditSeoDescription(page.seoDescription || '');
    setEditSections(sectionsToDraft(page.sections || []));
  };

  const closeEditor = () => setEditing(null);

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await cmsAdminApi.updatePage(editing.id, {
        title: editTitle,
        slug: editSlug,
        pageType: editPageType,
        status: editStatus,
        seoTitle: editSeoTitle || undefined,
        seoDescription: editSeoDescription || undefined,
        sections: editSections.map((s, i) => ({ ...s, sortOrder: i })),
      });
      closeEditor();
      load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const deletePage = async (id: string, pageTitle: string) => {
    if (!confirm(`Delete "${pageTitle}"? This cannot be undone.`)) return;
    try {
      await cmsAdminApi.deletePage(id);
      if (editing?.id === id) closeEditor();
      load();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const publish = async (id: string) => {
    const page = pages.find((p) => p.id === id);
    if (!page) return;
    await cmsAdminApi.updatePage(id, { ...page, status: 'PUBLISHED' });
    load();
  };

  const unpublish = async (id: string) => {
    const page = pages.find((p) => p.id === id);
    if (!page) return;
    await cmsAdminApi.updatePage(id, { ...page, status: 'DRAFT' });
    load();
  };

  const updateSectionField = (index: number, field: string, value: string) => {
    setEditSections((prev) =>
      prev.map((s, i) =>
        i === index ? { ...s, contentJson: { ...s.contentJson, [field]: value } } : s
      )
    );
  };

  const changeSectionType = (index: number, type: string) => {
    setEditSections((prev) =>
      prev.map((s, i) => (i === index ? defaultSection(type, s.sortOrder) : s))
    );
  };

  const removeSection = (index: number) => {
    setEditSections((prev) => prev.filter((_, i) => i !== index));
  };

  const addSection = (type: string) => {
    setEditSections((prev) => [...prev, defaultSection(type, prev.length)]);
  };

  return (
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

      {editing && (
        <div className="glass p-8 rounded-3xl space-y-6 border-2 border-primary/20">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-black">Edit: {editing.title}</h2>
            <button type="button" onClick={closeEditor} className="p-2 text-slate-400 hover:text-primary">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Title"
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
            />
            <input
              value={editSlug}
              onChange={(e) => setEditSlug(e.target.value)}
              placeholder="Slug"
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
            />
            <select
              value={editPageType}
              onChange={(e) => setEditPageType(e.target.value)}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
            >
              <option value="PAGE">Page</option>
              <option value="BLOG_POST">Blog post</option>
            </select>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
            <input
              value={editSeoTitle}
              onChange={(e) => setEditSeoTitle(e.target.value)}
              placeholder="SEO title"
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none md:col-span-2"
            />
            <textarea
              value={editSeoDescription}
              onChange={(e) => setEditSeoDescription(e.target.value)}
              placeholder="SEO description"
              rows={2}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none md:col-span-2"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-lg">Sections</h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => addSection('HERO')}
                  className="px-3 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Hero
                </button>
                <button
                  type="button"
                  onClick={() => addSection('TEXT')}
                  className="px-3 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Text
                </button>
              </div>
            </div>

            {editSections.map((section, index) => (
              <div key={index} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <select
                    value={section.type}
                    onChange={(e) => changeSectionType(index, e.target.value)}
                    className="p-2 rounded-xl bg-white dark:bg-slate-800 border-none text-sm font-bold"
                  >
                    <option value="HERO">HERO</option>
                    <option value="TEXT">TEXT</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeSection(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
                    aria-label="Remove section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {section.type === 'HERO' && (
                  <div className="grid md:grid-cols-2 gap-3">
                    <input
                      value={String(section.contentJson.headline || '')}
                      onChange={(e) => updateSectionField(index, 'headline', e.target.value)}
                      placeholder="Headline"
                      className="p-3 rounded-xl bg-white dark:bg-slate-800 border-none"
                    />
                    <input
                      value={String(section.contentJson.subheadline || '')}
                      onChange={(e) => updateSectionField(index, 'subheadline', e.target.value)}
                      placeholder="Subheadline"
                      className="p-3 rounded-xl bg-white dark:bg-slate-800 border-none"
                    />
                    <input
                      value={String(section.contentJson.ctaLabel || '')}
                      onChange={(e) => updateSectionField(index, 'ctaLabel', e.target.value)}
                      placeholder="CTA label"
                      className="p-3 rounded-xl bg-white dark:bg-slate-800 border-none"
                    />
                    <input
                      value={String(section.contentJson.ctaHref || '')}
                      onChange={(e) => updateSectionField(index, 'ctaHref', e.target.value)}
                      placeholder="CTA link"
                      className="p-3 rounded-xl bg-white dark:bg-slate-800 border-none"
                    />
                  </div>
                )}

                {section.type === 'TEXT' && (
                  <textarea
                    value={String(section.contentJson.body || '')}
                    onChange={(e) => updateSectionField(index, 'body', e.target.value)}
                    placeholder="Body text"
                    rows={4}
                    className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border-none"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={saveEdit}
              className="px-6 py-3 bg-primary text-white rounded-xl font-black disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            {editStatus === 'PUBLISHED' && (
              <Link href={`/p/${editSlug}`} className="px-6 py-3 text-primary font-bold">
                Preview live
              </Link>
            )}
          </div>
        </div>
      )}

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
            <span className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => openEditor(p)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-bold flex items-center gap-1"
              >
                <Pencil className="w-3 h-3" /> Edit
              </button>
              {p.status === 'PUBLISHED' && (
                <>
                  <Link href={`/p/${p.slug}`} className="px-4 py-2 text-sm font-bold text-primary">
                    View
                  </Link>
                  <button
                    type="button"
                    onClick={() => unpublish(p.id)}
                    className="px-4 py-2 bg-amber-100 text-amber-800 rounded-xl text-sm font-bold"
                  >
                    Unpublish
                  </button>
                </>
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
              <button
                type="button"
                onClick={() => deletePage(p.id, p.title)}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl text-sm font-bold flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
