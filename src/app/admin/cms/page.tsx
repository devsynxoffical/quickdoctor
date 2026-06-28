"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { cmsAdminApi, type CmsPage, type CmsSection } from '@/lib/api';
import CmsSectionEditor, { defaultSection, SECTION_TYPES, type SectionDraft } from '@/components/admin/CmsSectionEditor';
import { defaultSectionsForPage, registryBySlug } from '@/lib/sitePagesRegistry';
import { ExternalLink, RefreshCw, Search } from 'lucide-react';

type RegistryRow = {
  slug: string;
  path: string;
  title: string;
  group: string;
  id: string | null;
  status: string;
  sectionCount: number;
  updatedAt: string | null;
};

function sectionsToDraft(sections: CmsSection[]): SectionDraft[] {
  return [...sections]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((s, i) => ({ type: s.type, sortOrder: i, contentJson: { ...s.contentJson } }));
}

export default function AdminCmsPage() {
  const [registry, setRegistry] = useState<RegistryRow[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [groupFilter, setGroupFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [page, setPage] = useState<CmsPage | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editStatus, setEditStatus] = useState('DRAFT');
  const [editSeoTitle, setEditSeoTitle] = useState('');
  const [editSeoDescription, setEditSeoDescription] = useState('');
  const [editSections, setEditSections] = useState<SectionDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadRegistry = async () => {
    setLoading(true);
    try {
      const data = await cmsAdminApi.registry();
      setRegistry(data.pages);
      setGroups(['All', ...data.groups]);
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : 'Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistry();
  }, []);

  const filtered = useMemo(() => {
    return registry.filter((p) => {
      if (groupFilter !== 'All' && p.group !== groupFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.path.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
      );
    });
  }, [registry, groupFilter, search]);

  const grouped = useMemo(() => {
    const map = new Map<string, RegistryRow[]>();
    for (const row of filtered) {
      if (!map.has(row.group)) map.set(row.group, []);
      map.get(row.group)!.push(row);
    }
    return map;
  }, [filtered]);

  const applyPageToEditor = (found: CmsPage) => {
    setPage(found);
    setEditTitle(found.title);
    setEditSlug(found.slug);
    setEditStatus(found.status);
    setEditSeoTitle(found.seoTitle || '');
    setEditSeoDescription(found.seoDescription || '');
    setEditSections(sectionsToDraft(found.sections || []));
  };

  const openPage = async (row: RegistryRow) => {
    setSelectedSlug(row.slug);
    setMessage(null);
    if (!row.id) {
      setPage(null);
      setEditTitle(row.title);
      setEditSlug(row.slug);
      setEditStatus('DRAFT');
      setEditSeoTitle(row.title);
      setEditSeoDescription('');
      setEditSections([]);
      return;
    }
    try {
      const pages = await cmsAdminApi.pages();
      const found = pages.find((p) => p.id === row.id);
      if (!found) return;
      applyPageToEditor(found);
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : 'Could not load page');
    }
  };

  const syncAll = async (publish: boolean) => {
    setSyncing(true);
    setMessage(null);
    try {
      const result = await cmsAdminApi.syncPages(publish);
      setMessage(result.message);
      await loadRegistry();
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  const createFromRegistry = async () => {
    if (!selectedSlug) return;
    const row = registry.find((r) => r.slug === selectedSlug);
    if (!row) return;
    const def = registryBySlug(row.slug);
    const templateSections = def ? defaultSectionsForPage(def) : [];
    setSaving(true);
    try {
      const created = await cmsAdminApi.createPage({
        title: row.title,
        slug: row.slug,
        pageType: 'PAGE',
        status: 'DRAFT',
        seoTitle: row.title,
        seoDescription: `QuickDoctor — ${row.title}`,
        sections: editSections.length
          ? editSections
          : templateSections.length
            ? templateSections
            : [
                defaultSection('HERO', 0),
                defaultSection('TEXT', 1),
                defaultSection('FAQ', 2),
                defaultSection('CTA', 3),
              ],
      });
      setPage(created);
      setMessage('Page created — add sections and publish.');
      await loadRegistry();
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : 'Create failed');
    } finally {
      setSaving(false);
    }
  };

  const resetTemplate = async () => {
    if (!page) return;
    if (!confirm('Replace all sections with the default template for this page? Unsaved edits will be lost.')) return;
    setResetting(true);
    setMessage(null);
    try {
      const updated = await cmsAdminApi.resetTemplate(page.id);
      setPage(updated);
      setEditSections(sectionsToDraft(updated.sections || []));
      setMessage('Sections reset from template. Review and save if needed.');
      await loadRegistry();
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : 'Reset failed');
    } finally {
      setResetting(false);
    }
  };

  const save = async (options?: { publish?: boolean }) => {
    if (!page) {
      await createFromRegistry();
      return;
    }
    const status = options?.publish ? 'PUBLISHED' : editStatus;
    setSaving(true);
    setMessage(null);
    try {
      const updated = await cmsAdminApi.updatePage(page.id, {
        title: editTitle,
        slug: editSlug,
        pageType: page.pageType,
        status,
        seoTitle: editSeoTitle || undefined,
        seoDescription: editSeoDescription || undefined,
        sections: editSections.map((s, i) => ({ ...s, sortOrder: i })),
      });
      applyPageToEditor(updated);
      setMessage(
        status === 'PUBLISHED'
          ? 'Page published — changes are now live on the site.'
          : 'Page saved as draft. Set status to Published to show changes on the live site.'
      );
      await loadRegistry();
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const selectedRow = registry.find((r) => r.slug === selectedSlug);

  return (
    <section className="space-y-6">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black">Site content manager</h1>
          <p className="text-slate-500 mt-1">
            Edit every public page — home, prescriptions, consultations, legal pages, and more.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={syncing}
            onClick={() => syncAll(false)}
            className="px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            Sync all pages
          </button>
          <button
            type="button"
            disabled={syncing}
            onClick={() => syncAll(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold disabled:opacity-50"
          >
            Sync & publish all
          </button>
        </div>
      </header>

      {message && (
        <p className="p-4 rounded-2xl bg-primary/10 text-primary font-bold text-sm">{message}</p>
      )}

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pages…"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none"
          />
        </div>
        <select
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-sm"
        >
          {groups.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {loading ? (
            <p className="text-slate-400">Loading site pages…</p>
          ) : (
            [...grouped.entries()].map(([group, rows]) => (
              <div key={group}>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 sticky top-0 bg-slate-50 dark:bg-slate-950 py-1">
                  {group} ({rows.length})
                </p>
                <ul className="space-y-2 list-none p-0 m-0 mb-4">
                  {rows.map((row) => (
                    <li key={row.slug}>
                      <button
                        type="button"
                        onClick={() => openPage(row)}
                        className={`w-full text-left p-4 rounded-2xl transition-all ${
                          selectedSlug === row.slug
                            ? 'bg-primary text-white medical-shadow'
                            : 'glass hover:border-primary/30 border border-transparent'
                        }`}
                      >
                        <p className="font-bold text-sm">{row.title}</p>
                        <p className={`text-xs mt-1 ${selectedSlug === row.slug ? 'text-white/80' : 'text-slate-400'}`}>
                          {row.path}
                        </p>
                        <p className={`text-[10px] font-black uppercase mt-2 ${selectedSlug === row.slug ? 'text-white/70' : 'text-slate-500'}`}>
                          {row.status} · {row.sectionCount} sections
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>

        <div className="lg:col-span-3">
          {!selectedSlug ? (
            <div className="glass p-10 rounded-3xl text-center text-slate-500">
              Select a page from the list to edit its content and sections.
            </div>
          ) : (
            <div className="glass p-6 md:p-8 rounded-3xl space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black">{selectedRow?.title}</h2>
                  <p className="text-sm text-slate-500">{selectedRow?.path}</p>
                </div>
                {page && editStatus === 'PUBLISHED' && (
                  <Link
                    href={selectedRow?.path || '/'}
                    target="_blank"
                    className="flex items-center gap-2 text-sm font-bold text-primary"
                  >
                    View live <ExternalLink className="w-4 h-4" />
                  </Link>
                )}
              </div>

              {page && editStatus === 'DRAFT' && (
                <p className="p-4 rounded-xl bg-blue-50 text-blue-900 text-sm font-medium">
                  This page is a <strong>draft</strong>. Visitors will not see your edits until you publish it.
                </p>
              )}

              {page && selectedSlug === 'home' && editSections.length < 7 && (
                <p className="p-4 rounded-xl bg-amber-50 text-amber-900 text-sm font-medium">
                  Home page is missing sections (stats, appointments, journey, etc.). Click{' '}
                  <strong>Reset from template</strong> below to load the full homepage content.
                </p>
              )}

              {!page && (
                <p className="p-4 rounded-xl bg-amber-50 text-amber-800 text-sm font-medium">
                  This page is not in the database yet. Click &quot;Create page&quot; or run &quot;Sync all pages&quot; first.
                </p>
              )}

              <div className="grid md:grid-cols-2 gap-3">
                <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Title" className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none" />
                <input value={editSlug} onChange={(e) => setEditSlug(e.target.value)} placeholder="CMS slug" className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none" />
                <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none">
                  <option value="DRAFT">Draft (not visible on site)</option>
                  <option value="PUBLISHED">Published (live on site)</option>
                </select>
                <input value={editSeoTitle} onChange={(e) => setEditSeoTitle(e.target.value)} placeholder="SEO title" className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none" />
                <textarea value={editSeoDescription} onChange={(e) => setEditSeoDescription(e.target.value)} placeholder="SEO description" rows={2} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none md:col-span-2" />
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <h3 className="font-black">Sections</h3>
                  <div className="flex flex-wrap gap-1">
                    {SECTION_TYPES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setEditSections((prev) => [...prev, defaultSection(t, prev.length)])}
                        className="px-2 py-1 text-[10px] font-black uppercase bg-slate-100 dark:bg-slate-800 rounded-lg"
                      >
                        + {t}
                      </button>
                    ))}
                  </div>
                </div>
                <CmsSectionEditor sections={editSections} onChange={setEditSections} />
              </div>

              <div className="flex flex-wrap gap-3">
                <button type="button" disabled={saving} onClick={() => save()} className="px-6 py-3 bg-primary text-white rounded-xl font-black disabled:opacity-50">
                  {saving ? 'Saving…' : page ? 'Save changes' : 'Create page'}
                </button>
                {page && (
                  <button
                    type="button"
                    disabled={resetting}
                    onClick={resetTemplate}
                    className="px-6 py-3 bg-slate-800 text-white rounded-xl font-black disabled:opacity-50 flex items-center gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${resetting ? 'animate-spin' : ''}`} />
                    Reset from template
                  </button>
                )}
                {page && editStatus !== 'PUBLISHED' && (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => save({ publish: true })}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl font-black disabled:opacity-50"
                  >
                    {saving ? 'Publishing…' : 'Publish'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
