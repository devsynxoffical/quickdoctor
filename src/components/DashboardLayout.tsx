"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Calendar, FileText,
  Settings, LogOut, Search,
  ChevronRight, User, Menu, X
} from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';
import Logo from '@/components/Logo';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarLink = ({ href, icon: Icon, label, active, onClick }: { href: string, icon: any, label: string, active: boolean, onClick?: () => void }) => (
  <Link href={href} onClick={onClick}>
    <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all group ${
      active ? 'bg-primary text-white medical-shadow' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`}>
      <Icon className={`w-5 h-5 ${active ? 'text-white' : 'group-hover:text-primary transition-colors'}`} />
      <span className="font-bold text-sm">{label}</span>
      {active && <motion.div layoutId="active" className="ml-auto"><ChevronRight className="w-4 h-4" /></motion.div>}
    </div>
  </Link>
);

import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { clearSession, getLoginUrl, getStoredUser, saveSession } from '@/lib/auth';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [authReady, setAuthReady] = React.useState(false);

  React.useEffect(() => {
    const validate = async () => {
      const token = localStorage.getItem('token');
      const storedUser = getStoredUser();
      if (!token || !storedUser) {
        router.replace(getLoginUrl(pathname || '/dashboard'));
        return;
      }

      try {
        const { user: liveUser } = await authApi.me();
        saveSession(token, liveUser);
        setUser(liveUser);
        const role = String(liveUser.role ?? '').toUpperCase();
        if (role === 'DOCTOR') router.replace('/doctor');
        else if (role === 'ADMIN') router.replace('/admin');
        setAuthReady(true);
      } catch {
        clearSession();
        router.replace(getLoginUrl(pathname || '/dashboard'));
      }
    };

    validate();

    const onExpired = () => router.replace(getLoginUrl(pathname || '/dashboard'));
    window.addEventListener('session-expired', onExpired);
    return () => window.removeEventListener('session-expired', onExpired);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignOut = () => {
    clearSession();
    router.push('/login');
  };

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 font-bold">
        Loading dashboard…
      </div>
    );
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/doctors');
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
          <Logo href="/" size="sm" />
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-primary">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <p className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Main Menu</p>
          <SidebarLink href="/dashboard" icon={LayoutDashboard} label="Overview" active={pathname === '/dashboard'} onClick={() => setIsSidebarOpen(false)} />
          <SidebarLink href="/dashboard/appointments" icon={Calendar} label="Appointments" active={pathname === '/dashboard/appointments'} onClick={() => setIsSidebarOpen(false)} />
          <SidebarLink href="/dashboard/records" icon={FileText} label="Prescriptions & Records" active={pathname === '/dashboard/records' || pathname === '/dashboard/prescriptions'} onClick={() => setIsSidebarOpen(false)} />
          
          <div className="pt-8">
            <p className="px-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">System</p>
            <SidebarLink href="/dashboard/settings" icon={Settings} label="Settings" active={pathname === '/dashboard/settings'} onClick={() => setIsSidebarOpen(false)} />
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
          <Link
            href="/doctors"
            className="block bg-gradient-to-br from-primary to-accent rounded-3xl p-5 text-white medical-shadow hover:opacity-95 transition-opacity"
          >
            <p className="text-xs font-bold opacity-80 mb-1">Need a GP?</p>
            <p className="text-sm font-black mb-4">Book a video consultation</p>
            <span className="w-full py-2 bg-white text-primary rounded-xl text-xs font-black block text-center">
              Find a doctor
            </span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 min-w-0">
        {/* Header */}
        <header className="h-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 md:px-10 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
             <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-slate-600 dark:text-slate-400">
               <Menu className="w-6 h-6" />
             </button>
             <form onSubmit={handleSearch} className="relative w-full hidden sm:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find a doctor to book…" 
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none text-sm focus:ring-2 focus:ring-primary transition-all"
                />
             </form>
             {/* Logo for mobile only */}
             <div className="flex items-center gap-2 sm:hidden">
                <Logo href="/" showText={false} size="sm" />
             </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
             <NotificationBell />
             
             <div className="flex items-center gap-3 md:pl-6 md:border-l border-slate-200 dark:border-slate-800">
                 <div className="text-right hidden md:block">
                    <p className="text-sm font-bold text-dark-slate dark:text-white">{user ? `${user.firstName} ${user.lastName}` : 'Guest'}</p>
                    <p className="text-[10px] font-bold text-primary uppercase">{user?.role || 'Patient'} Account</p>
                 </div>
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                   <User className="w-6 h-6 text-slate-400" />
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

export default DashboardLayout;
