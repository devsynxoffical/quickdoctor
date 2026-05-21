"use client";

import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Edit3, Trash2, 
  Eye, Calendar, User, Tag,
  FileText, Globe, Save, X
} from 'lucide-react';

const BlogManagement = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [posts, setPosts] = useState([
    { id: 1, title: 'Understanding Seasonal Flu in 2026', author: 'Dr. Sarah Johnson', category: 'Health', status: 'Published', date: 'April 15, 2026' },
    { id: 2, title: 'Top 5 Benefits of Telemedicine', author: 'Dr. Michael Chen', category: 'General', status: 'Draft', date: 'April 18, 2026' },
    { id: 3, title: 'Modern Nutrition: Fact vs Fiction', author: 'Health Team', category: 'Lifestyle', status: 'Scheduled', date: 'April 22, 2026' },
  ]);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
           <div>
              <h1 className="text-4xl font-bold text-dark-slate dark:text-white mb-2">CMS Blog System</h1>
              <p className="text-slate-500">Manage patient education, medical news, and healthcare updates.</p>
           </div>
           <button 
             onClick={() => setShowEditor(true)}
             className="px-8 py-4 bg-primary text-white rounded-2xl font-bold medical-shadow flex items-center gap-2 hover:scale-105 transition-all"
           >
              <Plus className="w-5 h-5" />
              New Article
           </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass p-6 rounded-[32px] medical-shadow">
           <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search articles..." 
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border-none text-sm focus:ring-2 focus:ring-primary transition-all"
              />
           </div>
           <div className="flex gap-2">
              {['All', 'Published', 'Draft', 'Scheduled'].map((tab) => (
                 <button key={tab} className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                   tab === 'All' ? 'bg-dark-slate text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                 }`}>
                    {tab}
                 </button>
              ))}
           </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {posts.map((post, i) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-[40px] overflow-hidden medical-shadow group"
              >
                 <div className="h-48 bg-slate-200 dark:bg-slate-800 relative">
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 text-[10px] font-black uppercase tracking-widest text-primary backdrop-blur-sm">
                       {post.category}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-all backdrop-blur-[2px]">
                       <div className="flex gap-2">
                          <button className="w-10 h-10 rounded-full bg-white text-dark-slate flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                             <Edit3 className="w-4 h-4" />
                          </button>
                          <button className="w-10 h-10 rounded-full bg-white text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                 </div>
                 <div className="p-8">
                    <div className="flex items-center gap-2 mb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                       <Calendar className="w-3 h-3" />
                       {post.date}
                    </div>
                    <h4 className="text-xl font-bold mb-4 line-clamp-2 min-h-[3.5rem]">{post.title}</h4>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                       <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">SJ</div>
                          <span className="text-[10px] font-bold text-slate-500">{post.author}</span>
                       </div>
                       <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                         post.status === 'Published' ? 'bg-green-100 text-green-600' : 
                         post.status === 'Draft' ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-600'
                       }`}>
                          {post.status}
                       </span>
                    </div>
                 </div>
              </motion.div>
           ))}
        </div>

        {/* Mock Article Editor Modal */}
        <AnimatePresence>
           {showEditor && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                 <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                   onClick={() => setShowEditor(false)}
                 />
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.95, y: 20 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.95, y: 20 }}
                   className="relative w-full max-w-5xl h-[90vh] glass rounded-[40px] medical-shadow flex flex-col overflow-hidden bg-white dark:bg-slate-900"
                 >
                    {/* Editor Header */}
                    <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                             <FileText />
                          </div>
                          <div>
                             <h2 className="text-2xl font-bold">New Medical Article</h2>
                             <p className="text-xs text-slate-400">Content will be auto-saved to drafts</p>
                          </div>
                       </div>
                       <div className="flex gap-4">
                          <button className="px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-200 transition-all">
                             <Eye className="w-4 h-4" /> Preview
                          </button>
                          <button className="px-8 py-3 bg-dark-slate text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:scale-105 transition-all">
                             <Save className="w-4 h-4" /> Publish Article
                          </button>
                          <button onClick={() => setShowEditor(false)} className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                             <X className="w-5 h-5" />
                          </button>
                       </div>
                    </div>

                    {/* Editor Body */}
                    <div className="flex-1 overflow-y-auto p-12 no-scrollbar">
                       <div className="max-w-3xl mx-auto space-y-12">
                          <input 
                            type="text" 
                            placeholder="Enter catchy headline..." 
                            className="w-full text-5xl font-black bg-transparent border-none focus:ring-0 placeholder:text-slate-200 dark:placeholder:text-slate-800"
                          />
                          
                          <div className="flex flex-wrap gap-4 py-8 border-y border-slate-100 dark:border-slate-800">
                             <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-500">
                                <Tag className="w-3 h-3" />
                                <select className="bg-transparent border-none focus:ring-0 p-0 text-xs font-bold cursor-pointer">
                                   <option>General Health</option>
                                   <option>Nutrition</option>
                                   <option>Mental Health</option>
                                   <option>Telemedicine</option>
                                </select>
                             </div>
                             <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-500">
                                <User className="w-3 h-3" />
                                <span className="text-xs font-bold">Author: Admin Root</span>
                             </div>
                             <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-400">
                                <Globe className="w-3 h-3" />
                                <span className="text-xs font-bold">Public Content</span>
                             </div>
                          </div>

                          <textarea 
                            placeholder="Start writing the next big medical insight..." 
                            className="w-full min-h-[400px] text-lg bg-transparent border-none focus:ring-0 resize-none text-slate-600 dark:text-slate-300 leading-relaxed"
                          />
                       </div>
                    </div>
                 </motion.div>
              </div>
           )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
};

export default BlogManagement;
