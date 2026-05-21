"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Shield, Users, Stethoscope, Briefcase, 
  Settings, LogOut, Search,
  ChevronRight, BarChart3, Newspaper,
  LayoutDashboard, Menu, X, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationBell from '@/components/NotificationBell';

const SidebarLink = ({ href, icon: Icon, label, active, onClick }: { href: string, icon: any, label: string, active: boolean, onClick?: () => void }) => (
  <Link href={href} onClick={onClick}>
    <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all group ${
      active ? 'bg-dark-slate text-white medical-shadow' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`}>
      <Icon className={`w-5 h-5 ${active ? 'text-white' : 'group-hover:text-dark-slate transition-colors'}`} />
      <span className="font-bold text-sm">{label}</span>
      {active && <motion.div layoutId="active" className="ml-auto"><ChevronRight className="w-4 h-4" /></motion.div>}
    </div>
  </Link>
);

import { useRouter } from 'next/navigation';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        /* portal gate handles invalid session */
      }
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/admin';
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col fixed h-screen z-50 transition-transform duration-300 lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-dark-slate rounded-xl flex items-center justify-center medical-shadow">
              <Shield className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-dark-slate dark:text-white">
              Admin<span className="text-primary">Panel</span>
            </span>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-dark-slate">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <p className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Management</p>
          <SidebarLink href="/admin" icon={LayoutDashboard} label="Dashboard" active={pathname === '/admin'} onClick={() => setIsSidebarOpen(false)} />
          <SidebarLink href="/admin/applications" icon={Stethoscope} label="Doctor Applications" active={pathname === '/admin/applications'} onClick={() => setIsSidebarOpen(false)} />
          <SidebarLink href="/admin/categories" icon={Briefcase} label="Specialty Categories" active={pathname === '/admin/categories'} onClick={() => setIsSidebarOpen(false)} />
          <SidebarLink href="/admin/doctors" icon={Stethoscope} label="All Doctors" active={pathname === '/admin/doctors'} onClick={() => setIsSidebarOpen(false)} />
          <SidebarLink href="/admin/patients" icon={Users} label="All Patients" active={pathname === '/admin/patients'} onClick={() => setIsSidebarOpen(false)} />
          <SidebarLink href="/admin/services" icon={Briefcase} label="Services & Pricing" active={pathname === '/admin/services'} onClick={() => setIsSidebarOpen(false)} />
          <SidebarLink href="/admin/cms" icon={Newspaper} label="CMS & Blog" active={pathname === '/admin/blog' || pathname === '/admin/cms'} onClick={() => setIsSidebarOpen(false)} />
          <SidebarLink href="/admin/appointments" icon={Calendar} label="Appointments" active={pathname === '/admin/appointments'} onClick={() => setIsSidebarOpen(false)} />
          <SidebarLink href="/admin/payments" icon={BarChart3} label="Payments" active={pathname === '/admin/payments'} onClick={() => setIsSidebarOpen(false)} />
          
          <div className="pt-8">
            <p className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Core</p>
            <SidebarLink href="/admin/analytics" icon={BarChart3} label="Financial Reports" active={pathname === '/admin/analytics'} onClick={() => setIsSidebarOpen(false)} />
            <SidebarLink href="/admin/settings" icon={Settings} label="System Settings" active={pathname === '/admin/settings'} onClick={() => setIsSidebarOpen(false)} />
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm mt-4"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </nav>

        <div className="p-6">
           <div className="p-4 bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Build Version</p>
              <p className="text-sm font-bold">v1.0.4-stable</p>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 min-w-0">
        {/* Header */}
        <header className="h-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 md:px-10 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-1">
             <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-slate-600 dark:text-slate-400">
               <Menu className="w-6 h-6" />
             </button>
             <h2 className="text-sm md:text-lg font-bold text-dark-slate dark:text-white truncate">Global Control Center</h2>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
             <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Live Network Active
             </div>
             
             <NotificationBell />
             
             <div className="flex items-center gap-3 md:pl-6 md:border-l border-slate-200 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-dark-slate text-white flex items-center justify-center overflow-hidden medical-shadow shrink-0">
                   <Shield className="w-6 h-6" />
                </div>
             </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
