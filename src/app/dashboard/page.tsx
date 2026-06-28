"use client";

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { 
  Video, Calendar, Clock, ArrowRight, 
  Activity, Heart, TrendingUp, CheckCircle2, FileText
} from 'lucide-react';

import { useEffect, useState } from 'react';
import { appointmentApi } from '@/lib/api';

const Overview = () => {
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchAppointments = async () => {
      try {
        const data = await appointmentApi.getAll();
        setAppointments(data);
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const nextAppointment = appointments.find(
    (a) => a.status === 'CONFIRMED' || a.status === 'PENDING'
  );

  const joinConsultation = async () => {
    if (!nextAppointment) return;
    try {
      const r = await appointmentApi.getJoin(nextAppointment.id);
      if (r.canJoin && r.url) {
        window.open(r.url, '_blank', 'noopener,noreferrer');
      } else {
        alert(r.message || 'Video join is not available yet');
      }
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Could not join');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Welcome Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-r from-primary to-accent rounded-[40px] p-10 text-white overflow-hidden medical-shadow"
        >
          <div className="relative z-10 max-w-xl">
             <h1 className="text-4xl font-bold mb-4">Hello, {user?.firstName || 'User'}! 👋</h1>
             <p className="text-white/80 text-lg mb-8">
               {nextAppointment ? (
                 `You have an upcoming consultation on ${new Date(nextAppointment.dateTime).toLocaleDateString()} at ${new Date(nextAppointment.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
               ) : (
                 "Access expert GP consultations, prescriptions, and specialist referrals from the comfort of your home."
               )}
             </p>
             {nextAppointment && (
               <button
                 type="button"
                 onClick={joinConsultation}
                 className="px-8 py-4 bg-white text-primary rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all"
               >
                 <Video className="w-5 h-5" />
                 Join Consultation
               </button>
             )}
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 -mr-10 -mb-10">
             <Activity className="w-80 h-80" />
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { label: 'Weight', value: '72', unit: 'kg', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100' },
             { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: Activity, color: 'text-red-600', bg: 'bg-red-100' },
             { label: 'Heart Rate', value: '72', unit: 'bpm', icon: Heart, color: 'text-pink-600', bg: 'bg-pink-100' },
           ].map((stat, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: i * 0.1 }}
               className="glass p-8 rounded-3xl medical-shadow flex items-center justify-between"
             >
               <div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                  <div className="flex items-baseline gap-1">
                     <span className="text-3xl font-black text-dark-slate dark:text-white">{stat.value}</span>
                     <span className="text-xs font-bold text-slate-400">{stat.unit}</span>
                  </div>
               </div>
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                   {React.createElement(stat.icon, { className: "w-6 h-6" })}
                </div>
             </motion.div>
           ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
           {/* Recent Appointments */}
           <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between mb-2">
                 <h2 className="text-2xl font-bold text-dark-slate dark:text-white">Recent Activities</h2>
                 <button className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
                    View All <ArrowRight className="w-4 h-4" />
                 </button>
              </div>

              <div className="space-y-4">
                 {appointments.length > 0 ? (
                   appointments.map((item, i) => (
                      <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + (i * 0.1) }}
                        className="glass p-6 rounded-[32px] flex items-center justify-between hover:bg-white transition-all cursor-pointer group border-transparent hover:border-primary/20 border"
                      >
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                               <Video className="w-6 h-6" />
                            </div>
                            <div>
                               <h4 className="font-bold text-dark-slate dark:text-white group-hover:text-primary transition-colors">Consultation</h4>
                               <p className="text-xs text-slate-500 font-medium">Dr. Johnson • {new Date(item.dateTime).toLocaleString()}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-3">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                              item.status === 'PENDING' ? 'bg-primary/10 text-primary' : 'bg-green-100 text-green-600'
                            }`}>
                              {item.status}
                            </span>
                            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-all translate-x-0 group-hover:translate-x-1" />
                         </div>
                      </motion.div>
                   ))
                 ) : (
                   <div className="flex flex-col items-center justify-center py-12 px-6 rounded-[40px] bg-slate-100 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800">
                      <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mb-4">
                         <Calendar className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="font-bold text-slate-600 dark:text-slate-400 mb-2">No other activities found</p>
                      <p className="text-xs text-slate-500 text-center max-w-[200px]">Book a new consultation or request a prescription to get started.</p>
                   </div>
                 )}
              </div>
           </div>

           {/* Health Insights / Sidebar */}
           <div className="space-y-8">
              <h2 className="text-2xl font-bold text-dark-slate dark:text-white">Active Treatments</h2>
              
              <div className="glass p-8 rounded-[40px] medical-shadow">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                       <Activity className="w-6 h-6" />
                    </div>
                    <div>
                       <h4 className="font-bold">Post-flu Recovery</h4>
                       <p className="text-xs text-slate-500">Day 5 of 7</p>
                    </div>
                 </div>
                 
                 <div className="space-y-6">
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: '70%' }}
                         className="h-full bg-blue-500" 
                       />
                    </div>
                    
                    <div className="space-y-4">
                       <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-blue-500" />
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Stay hydrated (2L water)</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-blue-500" />
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Take Amoxicillin 500mg</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full border-2 border-slate-200" />
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Rest for 8 hours</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="rounded-[40px] bg-slate-900 p-8 text-white relative overflow-hidden medical-shadow">
                 <div className="relative z-10">
                    <h4 className="text-xl font-bold mb-2">Need Help?</h4>
                    <p className="text-xs text-slate-400 mb-6 leading-relaxed">Our support team and doctors are ready to help you with any medical concerns 24/7.</p>
                    <button className="w-full py-4 bg-primary rounded-2xl text-sm font-bold medical-shadow hover:scale-105 transition-all">
                       Contact Support
                    </button>
                 </div>
                 <div className="absolute -right-4 -bottom-4 opacity-10">
                    <Heart className="w-32 h-32" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Overview;
