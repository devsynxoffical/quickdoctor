"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  CheckCircle2,
  Video,
  Pill,
  FileText,
  CalendarClock,
  Stethoscope,
  BadgeCheck,
  Lock,
  UserCheck,
} from 'lucide-react';
import BookAppointmentLink from '@/components/BookAppointmentLink';
import type { CmsPage } from '@/lib/api';
import heroBgImage from '@/app/prescriptions/jet-lag-prescription/bg 1.jpg';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Video,
  Pill,
  FileText,
  CalendarClock,
  Stethoscope,
  BadgeCheck,
  Lock,
  UserCheck,
};

export default function HomeCmsRenderer({ page }: { page: CmsPage }) {
  const sections = [...page.sections].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary selection:text-white overflow-x-hidden">
      {sections.map((section) => {
        const c = section.contentJson;

        if (section.type === 'HERO') {
          const bg =
            c.backgroundImageUrl && String(c.backgroundImageUrl)
              ? String(c.backgroundImageUrl)
              : heroBgImage.src;
          return (
            <section
              key={section.id}
              className="relative pt-20 md:pt-24 min-h-[620px] md:min-h-[680px] flex items-center overflow-hidden bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 22, 43, 0.84), rgba(0, 22, 43, 0.68)), url('${bg}')`,
                backgroundPosition: 'center 38%',
              }}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
                <div className="max-w-3xl text-white">
                  <h1 className="text-3xl sm:text-4xl md:text-6xl font-black leading-tight">
                    {String(c.headline || page.title)}
                  </h1>
                  {c.subheadline ? (
                    <p className="text-white/90 text-base sm:text-lg mt-4 sm:mt-5 max-w-2xl">
                      {String(c.subheadline)}
                    </p>
                  ) : null}
                  <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:flex-wrap gap-3">
                    {c.ctaHref ? (
                      <Link
                        href={String(c.ctaHref)}
                        className="w-full sm:w-auto text-center px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white rounded-xl font-black hover:bg-primary/90 transition-colors"
                      >
                        {String(c.ctaLabel || 'Book now')}
                      </Link>
                    ) : (
                      <BookAppointmentLink />
                    )}
                    {c.secondaryCtaHref ? (
                      <Link
                        href={String(c.secondaryCtaHref)}
                        className="w-full sm:w-auto text-center px-6 sm:px-8 py-3 sm:py-4 border border-white/35 bg-white/10 backdrop-blur-sm rounded-xl font-black hover:bg-white/20 transition-colors"
                      >
                        {String(c.secondaryCtaLabel || 'Learn more')}
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>
          );
        }

        if (section.type === 'STATS') {
          const items = (c.items as { value: string; label: string }[]) || [];
          return (
            <section key={section.id} className="py-6 px-4 sm:px-6 bg-slate-50">
              <div className="max-w-6xl mx-auto rounded-xl bg-[#0b3a75] text-white px-4 sm:px-6 py-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  {items.map((item) => (
                    <div key={item.label}>
                      <p className="text-3xl font-black">{item.value}</p>
                      <p className="text-[11px] uppercase tracking-wider text-white/85 font-bold mt-1">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (section.type === 'APPOINTMENTS') {
          const items =
            (c.items as { time: string; date: string; price: string; badge?: string }[]) || [];
          return (
            <section key={section.id} className="py-14 md:py-20 px-4 sm:px-6 bg-white">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 md:mb-10 gap-4">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-black text-primary">
                      {String(c.title || 'Available appointments')}
                    </h2>
                    {c.subtitle ? (
                      <p className="text-slate-600 mt-2 text-sm sm:text-base">{String(c.subtitle)}</p>
                    ) : null}
                  </div>
                  {c.viewMoreHref ? (
                    <Link
                      href={String(c.viewMoreHref)}
                      className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
                    >
                      View more <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : null}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {items.map((item) => (
                    <div
                      key={`${item.time}-${item.date}`}
                      className={`rounded-xl border p-5 bg-white shadow-sm hover:shadow-md transition-shadow ${
                        item.badge === 'Popular'
                          ? 'border-l-4 border-l-primary border-slate-200'
                          : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-2xl font-black text-primary">{item.time}</p>
                        {item.badge ? (
                          <span
                            className={`text-[10px] font-black px-2 py-1 rounded ${
                              item.badge === 'Live' ? 'bg-blue-100 text-blue-700' : 'bg-blue-50 text-blue-600'
                            }`}
                          >
                            {item.badge}
                          </span>
                        ) : null}
                      </div>
                      <p className="text-sm text-slate-500 mt-2">{item.date}</p>
                      <div className="flex items-center justify-between mt-5">
                        <p className="text-xl font-black text-primary">{item.price}</p>
                        <Link
                          href="/book"
                          className="px-3 py-2 rounded-lg bg-primary text-white text-xs font-black hover:bg-primary/90"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (section.type === 'FEATURES') {
          const items =
            (c.items as {
              title: string;
              description: string;
              ctaLabel?: string;
              ctaHref?: string;
              icon?: string;
            }[]) || [];
          const benefits = (c.benefits as string[]) || [];
          return (
            <section key={section.id} className="py-14 md:py-20 px-4 sm:px-6 bg-slate-50">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  {c.title ? (
                    <h2 className="text-3xl md:text-4xl font-black text-primary">{String(c.title)}</h2>
                  ) : null}
                  {c.subtitle ? (
                    <p className="text-slate-600 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
                      {String(c.subtitle)}
                    </p>
                  ) : null}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {items.map((item) => {
                    const Icon = iconMap[item.icon || ''] || Video;
                    return (
                      <div
                        key={item.title}
                        className="bg-white rounded-xl border border-slate-200 p-7 group hover:border-primary transition-all"
                      >
                        <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-5 group-hover:bg-primary transition-colors">
                          <Icon className="w-6 h-6 text-primary group-hover:text-white" />
                        </div>
                        <h3 className="text-2xl font-black text-primary">{item.title}</h3>
                        <p className="text-sm text-slate-600 mt-3">{item.description}</p>
                        {item.ctaHref ? (
                          <Link
                            href={item.ctaHref}
                            className="inline-flex items-center gap-2 mt-6 text-primary font-black text-sm"
                          >
                            {item.ctaLabel || 'Learn more'} <ArrowRight className="w-4 h-4" />
                          </Link>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
                {benefits.length > 0 && (
                  <div className="mt-8 rounded-xl bg-[#0b4da2] text-white px-5 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {benefits.map((item) => (
                        <div key={item} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-blue-200" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          );
        }

        if (section.type === 'JOURNEY') {
          const items =
            (c.items as { step: string; title: string; description: string }[]) || [];
          return (
            <section key={section.id} className="py-14 md:py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {c.title ? (
                  <h2 className="text-4xl md:text-5xl font-black text-primary text-center mb-16">
                    {String(c.title)}
                  </h2>
                ) : null}
                <div className="grid md:grid-cols-3 gap-10 relative">
                  <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-[1px] bg-slate-200" />
                  {items.map((item, i) => {
                    const icons = [CalendarClock, Video, Stethoscope];
                    const Icon = icons[i] || Stethoscope;
                    return (
                      <div key={item.step} className="text-center relative z-10">
                        <div className="w-24 h-24 rounded-full bg-white border-2 border-primary flex items-center justify-center mx-auto mb-6 shadow-lg">
                          <Icon className="w-9 h-9 text-primary" />
                        </div>
                        <h3 className="text-2xl font-black text-primary">
                          {item.step}. {item.title}
                        </h3>
                        <p className="text-slate-600 mt-3">{item.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        }

        if (section.type === 'SECURITY') {
          const items = (c.items as { title: string; description: string }[]) || [];
          const icons = [BadgeCheck, Lock, UserCheck];
          return (
            <section key={section.id} className="py-16 md:py-24 px-4 sm:px-6 bg-slate-100">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-14">
                {c.imageUrl ? (
                  <div className="w-full md:w-1/2">
                    <Image
                      src={String(c.imageUrl)}
                      alt=""
                      width={600}
                      height={420}
                      className="w-full h-[280px] sm:h-[360px] md:h-[420px] object-contain rounded-2xl shadow-lg"
                      unoptimized
                    />
                  </div>
                ) : null}
                <div className={`w-full ${c.imageUrl ? 'md:w-1/2' : ''}`}>
                  {c.title ? (
                    <h2 className="text-3xl md:text-5xl font-black text-primary mb-6">{String(c.title)}</h2>
                  ) : null}
                  <div className="space-y-6">
                    {items.map((item, i) => {
                      const Icon = icons[i] || BadgeCheck;
                      return (
                        <div key={item.title} className="flex gap-4">
                          <div className="mt-1 w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-xl font-black text-primary">{item.title}</h4>
                            <p className="text-slate-600 mt-1">{item.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          );
        }

        if (section.type === 'CTA') {
          return (
            <section key={section.id} className="py-16 md:py-24 px-4 sm:px-6">
              <div className="max-w-7xl mx-auto">
                <div className="rounded-3xl bg-gradient-to-br from-primary to-blue-900 p-7 sm:p-10 md:p-20 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10">
                    {c.text ? (
                      <h2 className="text-3xl md:text-5xl font-black text-white">{String(c.text)}</h2>
                    ) : null}
                    {c.subtext ? (
                      <p className="text-blue-100 text-base md:text-lg mt-4 max-w-xl mx-auto">
                        {String(c.subtext)}
                      </p>
                    ) : null}
                    {c.href ? (
                      <Link
                        href={String(c.href)}
                        className="inline-flex mt-8 px-8 sm:px-10 py-3 sm:py-4 bg-white text-primary rounded-xl font-black hover:bg-slate-100 transition-colors"
                      >
                        {String(c.label || 'Book now')}
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>
          );
        }

        return null;
      })}
    </main>
  );
}
