"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Users, Video, ClipboardList, Clock, 
  TrendingUp, Star, CheckCircle2, ArrowRight,
  Stethoscope, AlertCircle
} from 'lucide-react';

import { useEffect, useState } from 'react';
import { appointmentApi, doctorProfileApi, reviewApi } from '@/lib/api';
import { formatAppTime } from '@/lib/appTime';
import { doctorConsultationUrl } from '@/lib/doctorRoutes';

const DoctorOverview = () => {
  const [stats, setStats] = useState({ today: 0, pending: 0, earnings: 0 });
  const [rating, setRating] = useState<{ value: string; count: number }>({ value: '—', count: 0 });
  const [queue, setQueue] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [profileComplete, setProfileComplete] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appointments = await appointmentApi.getAll();
        const today = appointments.filter((a: any) => new Date(a.dateTime).toDateString() === new Date().toDateString()).length;
        const pending = appointments.filter((a: any) =>
          ['PENDING', 'CONFIRMED', 'PENDING_PAYMENT'].includes(a.status)
        ).length;
        const earningsCents = appointments.reduce(
          (acc: number, a: any) =>
            acc + (['COMPLETED', 'CONFIRMED'].includes(a.status) ? a.priceCents || 0 : 0),
          0
        );

        setStats({ today, pending, earnings: Math.round(earningsCents / 100) });
        setQueue(
          appointments.filter((a: any) =>
            ['CONFIRMED', 'PENDING'].includes(a.status)
          )
        );
        const now = Date.now();
        setUpcoming(
          appointments
            .filter((a: any) => new Date(a.dateTime).getTime() > now && a.status !== 'CANCELLED')
            .sort((a: any, b: any) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
            .slice(0, 5)
        );

        try {
          const profile = (await doctorProfileApi.get()) as { id?: string; profileComplete?: boolean };
          setProfileComplete(Boolean(profile?.profileComplete));
          if (profile?.id) {
            const rev = await reviewApi.forDoctor(profile.id);
            if (rev.averageRating != null && rev.count > 0) {
              setRating({
                value: rev.averageRating.toFixed(1),
                count: rev.count,
              });
            } else {
              setRating({ value: '—', count: 0 });
            }
          }
        } catch {
          /* rating is optional */
        }
      } catch (err) {
        console.error('Failed to fetch doctor data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
          <div className="space-y-10">
        {!profileComplete && (
          <div className="glass p-6 rounded-3xl border-2 border-secondary/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-black text-dark-slate dark:text-white">Complete your doctor profile</p>
              <p className="text-sm text-slate-500 mt-1">
                Add your bio, fees, and availability so patients can find and book you.
              </p>
            </div>
            <Link
              href="/doctor/settings"
              className="px-6 py-3 bg-secondary text-white rounded-xl font-black text-sm whitespace-nowrap"
            >
              Go to settings
            </Link>
          </div>
        )}

        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {[
             { label: 'Today Consultations', value: stats.today.toString(), icon: Video, color: 'text-blue-600', bg: 'bg-blue-100' },
             { label: 'Active appointments', value: stats.pending.toString(), icon: ClipboardList, color: 'text-orange-600', bg: 'bg-orange-100' },
             { label: 'Total Earnings', value: `€${stats.earnings}`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
             {
               label: rating.count > 0 ? `Patient Rating (${rating.count})` : 'Patient Rating',
               value: rating.value,
               icon: Star,
               color: 'text-yellow-600',
               bg: 'bg-yellow-100',
             },
           ].map((stat, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="glass p-6 rounded-3xl medical-shadow flex items-center justify-between"
             >
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                   <p className="text-2xl font-black text-dark-slate dark:text-white">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                   {React.createElement(stat.icon, { className: "w-6 h-6" })}
                </div>
             </motion.div>
           ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
           {/* Queue Section */}
           <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between mb-2">
                 <h2 className="text-2xl font-bold text-dark-slate dark:text-white">Active Queue</h2>
                 <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-[10px] font-bold">Online</span>
                 </div>
              </div>

              <div className="space-y-4">
                 {queue.length > 0 ? (
                   queue.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + (i * 0.1) }}
                        className="glass p-6 rounded-[32px] medical-shadow flex items-center justify-between group hover:border-secondary/20 border border-transparent transition-all"
                      >
                         <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-400">
                               {item.patient?.firstName?.charAt(0) || 'P'}
                            </div>
                            <div>
                               <h4 className="font-bold text-lg group-hover:text-secondary transition-colors">{item.patient?.firstName} {item.patient?.lastName}</h4>
                               <p className="text-xs text-slate-500 font-medium">Consultation • Scheduled at {formatAppTime(item.dateTime)}</p>
                            </div>
                         </div>
                         
                         <div className="flex items-center gap-6">
                            <div className="text-right hidden sm:block">
                               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Reason</p>
                               <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{item.notes || 'Routine checkup'}</p>
                            </div>
                            <Link 
                              href={doctorConsultationUrl(item.id)}
                              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                                ['PENDING', 'CONFIRMED'].includes(item.status)
                                  ? 'bg-secondary text-white medical-shadow'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              {['PENDING', 'CONFIRMED'].includes(item.status) ? 'Start Call' : 'Review'}
                            </Link>
                         </div>
                      </motion.div>
                   ))
                 ) : (
                   <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800">
                     <p className="text-slate-500 font-bold">No active queue at the moment.</p>
                   </div>
                 )}
              </div>
           </div>

           {/* Schedule & Alerts */}
           <div className="space-y-8">
              <h2 className="text-2xl font-bold">Upcoming Schedule</h2>
              <div className="glass p-8 rounded-[40px] medical-shadow">
                 <div className="space-y-6">
                    {upcoming.length > 0 ? (
                      upcoming.map((a) => (
                        <div key={a.id} className="flex gap-4">
                          <div className="text-sm font-black text-secondary w-12">
                            {formatAppTime(a.dateTime)}
                          </div>
                          <div className="flex-1 pb-6 border-l-2 border-slate-100 dark:border-slate-800 pl-6 relative">
                            <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-secondary" />
                            <h5 className="font-bold text-sm mb-1">
                              {a.patient?.firstName} {a.patient?.lastName}
                            </h5>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                              {a.status.replace('_', ' ')}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500 font-medium">No upcoming appointments.</p>
                    )}
                 </div>
                 <Link
                   href="/doctor/settings"
                   className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-secondary hover:underline"
                 >
                   Manage availability
                   <ArrowRight className="w-4 h-4" />
                 </Link>
              </div>

              {/* Safety Warning */}
              <div className="p-8 rounded-[40px] bg-red-600 text-white medical-shadow relative overflow-hidden">
                 <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                       <AlertCircle className="w-5 h-5" />
                       <span className="text-xs font-black uppercase tracking-widest">Medical Compliance</span>
                    </div>
                    <p className="text-sm font-bold mb-4">Always verify patient ID and history before issuing prescriptions.</p>
                    <p className="text-xs text-white/70 leading-relaxed mb-6">Unauthorized issuance of controlled substances is strictly prohibited and monitored.</p>
                    <Link href="/patient-guide" className="block w-full py-3 bg-white text-red-600 rounded-xl text-xs font-black hover:bg-slate-100 transition-colors text-center">
                       View Policy
                    </Link>
                 </div>
                 <div className="absolute -right-4 -bottom-4 opacity-10">
                    <Stethoscope className="w-32 h-32" />
                 </div>
              </div>
           </div>
        </div>
      </div>
      );
};

export default DoctorOverview;
