"use client";

import React from 'react';
import { Trash2 } from 'lucide-react';

export type SectionDraft = {
  type: string;
  sortOrder: number;
  contentJson: Record<string, unknown>;
};

export const SECTION_TYPES = ['HERO', 'TEXT', 'HTML', 'CTA', 'FAQ', 'FEATURES', 'IMAGE'] as const;

export function defaultSection(type: string, sortOrder: number): SectionDraft {
  switch (type) {
    case 'HERO':
      return {
        type: 'HERO',
        sortOrder,
        contentJson: {
          headline: '',
          subheadline: '',
          ctaLabel: 'Learn more',
          ctaHref: '/doctors',
          imageUrl: '',
        },
      };
    case 'HTML':
      return { type: 'HTML', sortOrder, contentJson: { body: '' } };
    case 'CTA':
      return {
        type: 'CTA',
        sortOrder,
        contentJson: { text: '', label: 'Get started', href: '/doctors' },
      };
    case 'FAQ':
      return {
        type: 'FAQ',
        sortOrder,
        contentJson: { items: [{ q: 'Question?', a: 'Answer.' }] },
      };
    case 'FEATURES':
      return {
        type: 'FEATURES',
        sortOrder,
        contentJson: {
          items: [{ title: 'Feature', description: 'Description' }],
        },
      };
    case 'IMAGE':
      return { type: 'IMAGE', sortOrder, contentJson: { url: '', alt: '', caption: '' } };
    default:
      return { type: 'TEXT', sortOrder, contentJson: { body: '' } };
  }
}

type Props = {
  sections: SectionDraft[];
  onChange: (sections: SectionDraft[]) => void;
};

export default function CmsSectionEditor({ sections, onChange }: Props) {
  const updateField = (index: number, field: string, value: string) => {
    onChange(
      sections.map((s, i) =>
        i === index ? { ...s, contentJson: { ...s.contentJson, [field]: value } } : s
      )
    );
  };

  const changeType = (index: number, type: string) => {
    onChange(sections.map((s, i) => (i === index ? defaultSection(type, s.sortOrder) : s)));
  };

  const remove = (index: number) => onChange(sections.filter((_, i) => i !== index));

  const move = (index: number, dir: -1 | 1) => {
    const next = [...sections];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next.map((s, i) => ({ ...s, sortOrder: i })));
  };

  const updateFaq = (index: number, faqIndex: number, field: 'q' | 'a', value: string) => {
    const items = [...((sections[index].contentJson.items as { q: string; a: string }[]) || [])];
    items[faqIndex] = { ...items[faqIndex], [field]: value };
    onChange(
      sections.map((s, i) =>
        i === index ? { ...s, contentJson: { ...s.contentJson, items } } : s
      )
    );
  };

  const addFaq = (index: number) => {
    const items = [...((sections[index].contentJson.items as { q: string; a: string }[]) || [])];
    items.push({ q: '', a: '' });
    onChange(
      sections.map((s, i) =>
        i === index ? { ...s, contentJson: { ...s.contentJson, items } } : s
      )
    );
  };

  const updateFeatures = (
    index: number,
    fi: number,
    field: 'title' | 'description',
    value: string
  ) => {
    const items = [...((sections[index].contentJson.items as { title: string; description: string }[]) || [])];
    items[fi] = { ...items[fi], [field]: value };
    onChange(
      sections.map((s, i) =>
        i === index ? { ...s, contentJson: { ...s.contentJson, items } } : s
      )
    );
  };

  const addFeature = (index: number) => {
    const items = [...((sections[index].contentJson.items as { title: string; description: string }[]) || [])];
    items.push({ title: '', description: '' });
    onChange(
      sections.map((s, i) =>
        i === index ? { ...s, contentJson: { ...s.contentJson, items } } : s
      )
    );
  };

  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <div key={index} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 space-y-3 border border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <select
              value={section.type}
              onChange={(e) => changeType(index, e.target.value)}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border-none text-sm font-bold"
            >
              {SECTION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <div className="flex gap-1">
              <button type="button" onClick={() => move(index, -1)} className="px-2 py-1 text-xs font-bold bg-white dark:bg-slate-800 rounded-lg">↑</button>
              <button type="button" onClick={() => move(index, 1)} className="px-2 py-1 text-xs font-bold bg-white dark:bg-slate-800 rounded-lg">↓</button>
              <button type="button" onClick={() => remove(index)} className="p-2 text-red-500 rounded-lg hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {section.type === 'HERO' && (
            <div className="grid md:grid-cols-2 gap-3">
              <input placeholder="Headline" value={String(section.contentJson.headline || '')} onChange={(e) => updateField(index, 'headline', e.target.value)} className="p-3 rounded-xl bg-white dark:bg-slate-800 border-none md:col-span-2" />
              <input placeholder="Subheadline" value={String(section.contentJson.subheadline || '')} onChange={(e) => updateField(index, 'subheadline', e.target.value)} className="p-3 rounded-xl bg-white dark:bg-slate-800 border-none md:col-span-2" />
              <input placeholder="CTA label" value={String(section.contentJson.ctaLabel || '')} onChange={(e) => updateField(index, 'ctaLabel', e.target.value)} className="p-3 rounded-xl bg-white dark:bg-slate-800 border-none" />
              <input placeholder="CTA link" value={String(section.contentJson.ctaHref || '')} onChange={(e) => updateField(index, 'ctaHref', e.target.value)} className="p-3 rounded-xl bg-white dark:bg-slate-800 border-none" />
              <input placeholder="Hero image URL (optional)" value={String(section.contentJson.imageUrl || '')} onChange={(e) => updateField(index, 'imageUrl', e.target.value)} className="p-3 rounded-xl bg-white dark:bg-slate-800 border-none md:col-span-2" />
            </div>
          )}

          {(section.type === 'TEXT' || section.type === 'HTML') && (
            <textarea rows={6} placeholder="Body content" value={String(section.contentJson.body || '')} onChange={(e) => updateField(index, 'body', e.target.value)} className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border-none font-mono text-sm" />
          )}

          {section.type === 'CTA' && (
            <div className="grid gap-3">
              <input placeholder="Text" value={String(section.contentJson.text || '')} onChange={(e) => updateField(index, 'text', e.target.value)} className="p-3 rounded-xl bg-white dark:bg-slate-800 border-none" />
              <input placeholder="Button label" value={String(section.contentJson.label || '')} onChange={(e) => updateField(index, 'label', e.target.value)} className="p-3 rounded-xl bg-white dark:bg-slate-800 border-none" />
              <input placeholder="Link" value={String(section.contentJson.href || '')} onChange={(e) => updateField(index, 'href', e.target.value)} className="p-3 rounded-xl bg-white dark:bg-slate-800 border-none" />
            </div>
          )}

          {section.type === 'FAQ' && (
            <div className="space-y-3">
              {((section.contentJson.items as { q: string; a: string }[]) || []).map((item, fi) => (
                <div key={fi} className="grid gap-2 p-3 bg-white dark:bg-slate-800 rounded-xl">
                  <input placeholder="Question" value={item.q} onChange={(e) => updateFaq(index, fi, 'q', e.target.value)} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border-none text-sm" />
                  <textarea placeholder="Answer" value={item.a} onChange={(e) => updateFaq(index, fi, 'a', e.target.value)} rows={2} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border-none text-sm" />
                </div>
              ))}
              <button type="button" onClick={() => addFaq(index)} className="text-xs font-bold text-primary">+ Add FAQ item</button>
            </div>
          )}

          {section.type === 'FEATURES' && (
            <div className="space-y-3">
              {((section.contentJson.items as { title: string; description: string }[]) || []).map((item, fi) => (
                <div key={fi} className="grid gap-2 p-3 bg-white dark:bg-slate-800 rounded-xl">
                  <input placeholder="Title" value={item.title} onChange={(e) => updateFeatures(index, fi, 'title', e.target.value)} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border-none text-sm" />
                  <textarea placeholder="Description" value={item.description} onChange={(e) => updateFeatures(index, fi, 'description', e.target.value)} rows={2} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border-none text-sm" />
                </div>
              ))}
              <button type="button" onClick={() => addFeature(index)} className="text-xs font-bold text-primary">+ Add feature</button>
            </div>
          )}

          {section.type === 'IMAGE' && (
            <div className="grid gap-3">
              <input placeholder="Image URL" value={String(section.contentJson.url || '')} onChange={(e) => updateField(index, 'url', e.target.value)} className="p-3 rounded-xl bg-white dark:bg-slate-800 border-none" />
              <input placeholder="Alt text" value={String(section.contentJson.alt || '')} onChange={(e) => updateField(index, 'alt', e.target.value)} className="p-3 rounded-xl bg-white dark:bg-slate-800 border-none" />
              <input placeholder="Caption" value={String(section.contentJson.caption || '')} onChange={(e) => updateField(index, 'caption', e.target.value)} className="p-3 rounded-xl bg-white dark:bg-slate-800 border-none" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
