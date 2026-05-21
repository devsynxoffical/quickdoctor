"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { cmsApi, type CmsPage } from '@/lib/api';

export default function BlogPage() {
  const [posts, setPosts] = useState<CmsPage[]>([]);

  useEffect(() => {
    cmsApi.blogPosts().then(setPosts).catch(() => setPosts([]));
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-24 px-6 max-w-5xl mx-auto">
        <h1 className="text-4xl font-black mb-10 text-center">Health & wellness blog</h1>
        {posts.length === 0 ? (
          <p className="text-center text-slate-500">No published posts yet. Check back soon.</p>
        ) : (
          <section className="grid md:grid-cols-2 gap-8">
            {posts.map((post) => {
              const hero = post.sections?.[0]?.contentJson as Record<string, string> | undefined;
              return (
                <Link
                  key={post.id}
                  href={`/p/${post.slug}`}
                  className="glass p-8 rounded-3xl medical-shadow hover:border-primary/20 border border-transparent block"
                >
                  <h2 className="text-xl font-black mb-2">{post.title}</h2>
                  <p className="text-sm text-slate-500 line-clamp-3">
                    {hero?.excerpt || post.seoDescription || 'Read more'}
                  </p>
                  {post.publishedAt && (
                    <p className="text-xs text-slate-400 mt-4">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </p>
                  )}
                </Link>
              );
            })}
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
