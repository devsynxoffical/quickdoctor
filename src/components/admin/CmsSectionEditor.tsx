"use client";

import React from 'react';
import { Trash2 } from 'lucide-react';

export type SectionDraft = {
  type: string;
  sortOrder: number;
  contentJson: Record<string, unknown>;
};

export const SECTION_TYPES = [
  'HERO',
  'STATS',
  'APPOINTMENTS',
  'FEATURES',
  'JOURNEY',
  'SECURITY',
  'TEXT',
  'HTML',
  'CTA',
  'FAQ',
  'IMAGE',
] as const;

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
          ctaHref: '/book',
          secondaryCtaLabel: '',
          secondaryCtaHref: '',
          backgroundImageUrl: '',
        },
      };
    case 'STATS':
      return {
        type: 'STATS',
        sortOrder,
        contentJson: {
          items: [{ value: '100+', label: 'Patients' }],
        },
      };
    case 'APPOINTMENTS':
      return {
        type: 'APPOINTMENTS',
        sortOrder,
        contentJson: {
          title: 'Available appointments',
          subtitle: '',
          viewMoreHref: '/book',
          items: [{ time: '09:00', date: 'Today', price: '€49', badge: '' }],
        },
      };
    case 'JOURNEY':
      return {
        type: 'JOURNEY',
        sortOrder,
        contentJson: {
          title: 'Your healthcare journey',
          items: [{ step: '1', title: 'Step', description: 'Description' }],
        },
      };
    case 'SECURITY':
      return {
        type: 'SECURITY',
        sortOrder,
        contentJson: {
          title: 'Safe, secure, and regulated.',
          imageUrl: '',
          items: [{ title: 'Feature', description: 'Description' }],
        },
      };
    case 'HTML':
      return { type: 'HTML', sortOrder, contentJson: { body: '' } };
    case 'CTA':
      return {
        type: 'CTA',
        sortOrder,
        contentJson: { text: '', subtext: '', label: 'Get started', href: '/book' },
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
          title: '',
          subtitle: '',
          items: [{ title: 'Feature', description: 'Description', ctaLabel: '', ctaHref: '' }],
          benefits: ['Benefit one'],
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

function inputClass() {
  return 'p-3 rounded-xl bg-white dark:bg-slate-800 border-none w-full';
}

function smallInputClass() {
  return 'p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border-none text-sm w-full';
}

export default function CmsSectionEditor({ sections, onChange }: Props) {
  const updateField = (index: number, field: string, value: string) => {
    onChange(
      sections.map((s, i) =>
        i === index ? { ...s, contentJson: { ...s.contentJson, [field]: value } } : s
      )
    );
  };

  const updateItems = <T extends Record<string, string>>(
    index: number,
    items: T[],
    itemIndex: number,
    field: keyof T,
    value: string
  ) => {
    const next = [...items];
    next[itemIndex] = { ...next[itemIndex], [field]: value };
    onChange(
      sections.map((s, i) =>
        i === index ? { ...s, contentJson: { ...s.contentJson, items: next } } : s
      )
    );
  };

  const addItem = (index: number, empty: Record<string, string>) => {
    const items = [...((sections[index].contentJson.items as Record<string, string>[]) || [])];
    items.push(empty);
    onChange(
      sections.map((s, i) =>
        i === index ? { ...s, contentJson: { ...s.contentJson, items } } : s
      )
    );
  };

  const removeItem = (index: number, itemIndex: number) => {
    const items = [...((sections[index].contentJson.items as unknown[]) || [])];
    items.splice(itemIndex, 1);
    onChange(
      sections.map((s, i) =>
        i === index ? { ...s, contentJson: { ...s.contentJson, items } } : s
      )
    );
  };

  const updateStringList = (index: number, field: string, listIndex: number, value: string) => {
    const list = [...((sections[index].contentJson[field] as string[]) || [])];
    list[listIndex] = value;
    onChange(
      sections.map((s, i) =>
        i === index ? { ...s, contentJson: { ...s.contentJson, [field]: list } } : s
      )
    );
  };

  const addStringListItem = (index: number, field: string) => {
    const list = [...((sections[index].contentJson[field] as string[]) || []), ''];
    onChange(
      sections.map((s, i) =>
        i === index ? { ...s, contentJson: { ...s.contentJson, [field]: list } } : s
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

  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <div
          key={index}
          className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 space-y-3 border border-slate-200 dark:border-slate-800"
        >
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
              <input placeholder="Headline" value={String(section.contentJson.headline || '')} onChange={(e) => updateField(index, 'headline', e.target.value)} className={`${inputClass()} md:col-span-2`} />
              <input placeholder="Subheadline" value={String(section.contentJson.subheadline || '')} onChange={(e) => updateField(index, 'subheadline', e.target.value)} className={`${inputClass()} md:col-span-2`} />
              <input placeholder="Primary CTA label" value={String(section.contentJson.ctaLabel || '')} onChange={(e) => updateField(index, 'ctaLabel', e.target.value)} className={inputClass()} />
              <input placeholder="Primary CTA link" value={String(section.contentJson.ctaHref || '')} onChange={(e) => updateField(index, 'ctaHref', e.target.value)} className={inputClass()} />
              <input placeholder="Secondary CTA label" value={String(section.contentJson.secondaryCtaLabel || '')} onChange={(e) => updateField(index, 'secondaryCtaLabel', e.target.value)} className={inputClass()} />
              <input placeholder="Secondary CTA link" value={String(section.contentJson.secondaryCtaHref || '')} onChange={(e) => updateField(index, 'secondaryCtaHref', e.target.value)} className={inputClass()} />
              <input placeholder="Background image URL (optional)" value={String(section.contentJson.backgroundImageUrl || section.contentJson.imageUrl || '')} onChange={(e) => updateField(index, 'backgroundImageUrl', e.target.value)} className={`${inputClass()} md:col-span-2`} />
            </div>
          )}

          {section.type === 'STATS' && (
            <div className="space-y-3">
              {((section.contentJson.items as { value: string; label: string }[]) || []).map((item, si) => (
                <div key={si} className="grid md:grid-cols-2 gap-2 p-3 bg-white dark:bg-slate-800 rounded-xl">
                  <input placeholder="Value (e.g. 500k+)" value={item.value} onChange={(e) => updateItems(index, section.contentJson.items as { value: string; label: string }[], si, 'value', e.target.value)} className={smallInputClass()} />
                  <input placeholder="Label" value={item.label} onChange={(e) => updateItems(index, section.contentJson.items as { value: string; label: string }[], si, 'label', e.target.value)} className={smallInputClass()} />
                </div>
              ))}
              <button type="button" onClick={() => addItem(index, { value: '', label: '' })} className="text-xs font-bold text-primary">+ Add stat</button>
            </div>
          )}

          {section.type === 'APPOINTMENTS' && (
            <div className="space-y-3">
              <input placeholder="Section title" value={String(section.contentJson.title || '')} onChange={(e) => updateField(index, 'title', e.target.value)} className={inputClass()} />
              <input placeholder="Subtitle" value={String(section.contentJson.subtitle || '')} onChange={(e) => updateField(index, 'subtitle', e.target.value)} className={inputClass()} />
              <input placeholder="View more link" value={String(section.contentJson.viewMoreHref || '')} onChange={(e) => updateField(index, 'viewMoreHref', e.target.value)} className={inputClass()} />
              {((section.contentJson.items as { time: string; date: string; price: string; badge?: string }[]) || []).map((item, ai) => (
                <div key={ai} className="grid md:grid-cols-4 gap-2 p-3 bg-white dark:bg-slate-800 rounded-xl">
                  <input placeholder="Time" value={item.time} onChange={(e) => updateItems(index, section.contentJson.items as { time: string; date: string; price: string; badge?: string }[], ai, 'time', e.target.value)} className={smallInputClass()} />
                  <input placeholder="Date" value={item.date} onChange={(e) => updateItems(index, section.contentJson.items as { time: string; date: string; price: string; badge?: string }[], ai, 'date', e.target.value)} className={smallInputClass()} />
                  <input placeholder="Price" value={item.price} onChange={(e) => updateItems(index, section.contentJson.items as { time: string; date: string; price: string; badge?: string }[], ai, 'price', e.target.value)} className={smallInputClass()} />
                  <input placeholder="Badge (Live/Popular)" value={item.badge || ''} onChange={(e) => updateItems(index, section.contentJson.items as { time: string; date: string; price: string; badge?: string }[], ai, 'badge', e.target.value)} className={smallInputClass()} />
                </div>
              ))}
              <button type="button" onClick={() => addItem(index, { time: '', date: '', price: '', badge: '' })} className="text-xs font-bold text-primary">+ Add appointment slot</button>
            </div>
          )}

          {(section.type === 'TEXT' || section.type === 'HTML') && (
            <textarea rows={6} placeholder="Body content" value={String(section.contentJson.body || '')} onChange={(e) => updateField(index, 'body', e.target.value)} className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border-none font-mono text-sm" />
          )}

          {section.type === 'CTA' && (
            <div className="grid gap-3">
              <input placeholder="Heading" value={String(section.contentJson.text || '')} onChange={(e) => updateField(index, 'text', e.target.value)} className={inputClass()} />
              <textarea placeholder="Subtext" value={String(section.contentJson.subtext || '')} onChange={(e) => updateField(index, 'subtext', e.target.value)} rows={2} className="w-full p-3 rounded-xl bg-white dark:bg-slate-800 border-none text-sm" />
              <input placeholder="Button label" value={String(section.contentJson.label || '')} onChange={(e) => updateField(index, 'label', e.target.value)} className={inputClass()} />
              <input placeholder="Link" value={String(section.contentJson.href || '')} onChange={(e) => updateField(index, 'href', e.target.value)} className={inputClass()} />
            </div>
          )}

          {section.type === 'FAQ' && (
            <div className="space-y-3">
              {((section.contentJson.items as { q: string; a: string }[]) || []).map((item, fi) => (
                <div key={fi} className="grid gap-2 p-3 bg-white dark:bg-slate-800 rounded-xl">
                  <input placeholder="Question" value={item.q} onChange={(e) => updateItems(index, section.contentJson.items as { q: string; a: string }[], fi, 'q', e.target.value)} className={smallInputClass()} />
                  <textarea placeholder="Answer" value={item.a} onChange={(e) => updateItems(index, section.contentJson.items as { q: string; a: string }[], fi, 'a', e.target.value)} rows={2} className={smallInputClass()} />
                </div>
              ))}
              <button type="button" onClick={() => addItem(index, { q: '', a: '' })} className="text-xs font-bold text-primary">+ Add FAQ item</button>
            </div>
          )}

          {section.type === 'FEATURES' && (
            <div className="space-y-3">
              <input placeholder="Section title" value={String(section.contentJson.title || '')} onChange={(e) => updateField(index, 'title', e.target.value)} className={inputClass()} />
              <input placeholder="Section subtitle" value={String(section.contentJson.subtitle || '')} onChange={(e) => updateField(index, 'subtitle', e.target.value)} className={inputClass()} />
              {((section.contentJson.items as { title: string; description: string; ctaLabel?: string; ctaHref?: string }[]) || []).map((item, fi) => (
                <div key={fi} className="grid gap-2 p-3 bg-white dark:bg-slate-800 rounded-xl">
                  <input placeholder="Title" value={item.title} onChange={(e) => updateItems(index, section.contentJson.items as { title: string; description: string; ctaLabel?: string; ctaHref?: string }[], fi, 'title', e.target.value)} className={smallInputClass()} />
                  <textarea placeholder="Description" value={item.description} onChange={(e) => updateItems(index, section.contentJson.items as { title: string; description: string; ctaLabel?: string; ctaHref?: string }[], fi, 'description', e.target.value)} rows={2} className={smallInputClass()} />
                  <div className="grid md:grid-cols-2 gap-2">
                    <input placeholder="CTA label" value={item.ctaLabel || ''} onChange={(e) => updateItems(index, section.contentJson.items as { title: string; description: string; ctaLabel?: string; ctaHref?: string }[], fi, 'ctaLabel', e.target.value)} className={smallInputClass()} />
                    <input placeholder="CTA link" value={item.ctaHref || ''} onChange={(e) => updateItems(index, section.contentJson.items as { title: string; description: string; ctaLabel?: string; ctaHref?: string }[], fi, 'ctaHref', e.target.value)} className={smallInputClass()} />
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => addItem(index, { title: '', description: '', ctaLabel: '', ctaHref: '' })} className="text-xs font-bold text-primary">+ Add feature</button>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider pt-2">Benefits bar</p>
              {((section.contentJson.benefits as string[]) || []).map((b, bi) => (
                <input key={bi} placeholder="Benefit" value={b} onChange={(e) => updateStringList(index, 'benefits', bi, e.target.value)} className={smallInputClass()} />
              ))}
              <button type="button" onClick={() => addStringListItem(index, 'benefits')} className="text-xs font-bold text-primary">+ Add benefit</button>
            </div>
          )}

          {section.type === 'JOURNEY' && (
            <div className="space-y-3">
              <input placeholder="Section title" value={String(section.contentJson.title || '')} onChange={(e) => updateField(index, 'title', e.target.value)} className={inputClass()} />
              {((section.contentJson.items as { step: string; title: string; description: string }[]) || []).map((item, ji) => (
                <div key={ji} className="grid gap-2 p-3 bg-white dark:bg-slate-800 rounded-xl">
                  <div className="grid md:grid-cols-2 gap-2">
                    <input placeholder="Step number" value={item.step} onChange={(e) => updateItems(index, section.contentJson.items as { step: string; title: string; description: string }[], ji, 'step', e.target.value)} className={smallInputClass()} />
                    <input placeholder="Step title" value={item.title} onChange={(e) => updateItems(index, section.contentJson.items as { step: string; title: string; description: string }[], ji, 'title', e.target.value)} className={smallInputClass()} />
                  </div>
                  <textarea placeholder="Description" value={item.description} onChange={(e) => updateItems(index, section.contentJson.items as { step: string; title: string; description: string }[], ji, 'description', e.target.value)} rows={2} className={smallInputClass()} />
                </div>
              ))}
              <button type="button" onClick={() => addItem(index, { step: '', title: '', description: '' })} className="text-xs font-bold text-primary">+ Add step</button>
            </div>
          )}

          {section.type === 'SECURITY' && (
            <div className="space-y-3">
              <input placeholder="Section title" value={String(section.contentJson.title || '')} onChange={(e) => updateField(index, 'title', e.target.value)} className={inputClass()} />
              <input placeholder="Image URL" value={String(section.contentJson.imageUrl || '')} onChange={(e) => updateField(index, 'imageUrl', e.target.value)} className={inputClass()} />
              {((section.contentJson.items as { title: string; description: string }[]) || []).map((item, si) => (
                <div key={si} className="grid gap-2 p-3 bg-white dark:bg-slate-800 rounded-xl">
                  <input placeholder="Title" value={item.title} onChange={(e) => updateItems(index, section.contentJson.items as { title: string; description: string }[], si, 'title', e.target.value)} className={smallInputClass()} />
                  <textarea placeholder="Description" value={item.description} onChange={(e) => updateItems(index, section.contentJson.items as { title: string; description: string }[], si, 'description', e.target.value)} rows={2} className={smallInputClass()} />
                </div>
              ))}
              <button type="button" onClick={() => addItem(index, { title: '', description: '' })} className="text-xs font-bold text-primary">+ Add security item</button>
            </div>
          )}

          {section.type === 'IMAGE' && (
            <div className="grid gap-3">
              <input placeholder="Image URL" value={String(section.contentJson.url || '')} onChange={(e) => updateField(index, 'url', e.target.value)} className={inputClass()} />
              <input placeholder="Alt text" value={String(section.contentJson.alt || '')} onChange={(e) => updateField(index, 'alt', e.target.value)} className={inputClass()} />
              <input placeholder="Caption" value={String(section.contentJson.caption || '')} onChange={(e) => updateField(index, 'caption', e.target.value)} className={inputClass()} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
