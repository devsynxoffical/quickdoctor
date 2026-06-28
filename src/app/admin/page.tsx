"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Stethoscope, BarChart3, 
  TrendingUp, ArrowUpRight, ArrowDownRight,
  ShieldCheck, AlertCircle, Clock
} from 'lucide-react';
import { fetchApi } from '@/lib/api';

const AdminOverview = () => {
  const [stats, setStats] = useState({ totalPatients: 0, totalDoctors: 0, totalAppointments: 0, totalRevenue: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, usersData] = await Promise.all([
          fetchApi<{
            totalPatients: number;
            totalDoctors: number;
            totalAppointments: number;
            totalRevenue: number;
          }>('/admin/stats'),
          fetchApi<any[]>('/admin/users'),
        ]);
        setStats(statsData);
        setUsers(usersData);
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
          <div className="space-y-10">
        {/* Global Performance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {[
             { label: 'Total Patients', value: stats.totalPatients.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
             { label: 'Verified Doctors', value: stats.totalDoctors.toLocaleString(), icon: Stethoscope, color: 'text-secondary', bg: 'bg-blue-100' },
             { label: 'Monthly Revenue', value: `€${stats.totalRevenue.toLocaleString()}`, icon: BarChart3, color: 'text-indigo-600', bg: 'bg-indigo-100' },
             { label: 'Total Appointments', value: stats.totalAppointments.toLocaleString(), icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
           ].map((stat, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="glass p-6 rounded-3xl medical-shadow"
             >
                <div className="flex justify-between items-start mb-4">
                   <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                      {React.createElement(stat.icon, { className: "w-6 h-6" })}
                   </div>
                   <div className="flex items-center gap-1 text-xs font-black text-green-600">
                      <ArrowUpRight className="w-4 h-4" />
                      Stable
                   </div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-dark-slate dark:text-white">{stat.value}</p>
             </motion.div>
           ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
           {/* Recent Users List */}
           <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between mb-2">
                 <h2 className="text-2xl font-bold text-dark-slate dark:text-white">Recent Users</h2>
                 <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all">View All Users</button>
              </div>

              <div className="overflow-hidden glass rounded-[40px] medical-shadow">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">User Email</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Joined</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                       {loading ? (
                         <tr><td colSpan={4} className="p-10 text-center text-slate-400">Loading users...</td></tr>
                       ) : users.length > 0 ? (
                         users.slice(0, 10).map((user, i) => (
                          <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                             <td className="px-8 py-5 font-bold text-sm tracking-tight">{user.email}</td>
                             <td className="px-8 py-5 text-sm font-medium text-slate-500">{user.role}</td>
                             <td className="px-8 py-5 text-sm font-medium text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                             <td className="px-8 py-5">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                  user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-600' :
                                  user.role === 'DOCTOR' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                }`}>
                                   {user.role}
                                </span>
                             </td>
                          </tr>
                         ))
                       ) : (
                         <tr><td colSpan={4} className="p-10 text-center text-slate-400">No users found in system.</td></tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* System Health & Performance */}
           <div className="space-y-8">
              <h2 className="text-2xl font-bold">System Integrity</h2>
              
              <div className="glass p-8 rounded-[40px] medical-shadow space-y-6">
                 <div>
                    <div className="flex justify-between items-center mb-2">
                       <p className="text-xs font-bold text-slate-500 uppercase">Server Uptime</p>
                       <p className="text-xs font-black text-green-600">99.98%</p>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: '99.98%' }} className="h-full bg-green-500" />
                    </div>
                 </div>

                 <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                       <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-xs font-bold">SSL Encryption</p>
                       <p className="text-[10px] text-slate-400">Active & Verified</p>
                    </div>
                 </div>
              </div>

              {/* Service Management Quick Actions */}
              <div className="p-8 rounded-[40px] bg-slate-900 text-white medical-shadow space-y-4">
                 <h4 className="text-xl font-bold mb-2">Service Control</h4>
                 <p className="text-xs text-slate-400 leading-relaxed mb-6">Manage global pricing, duration, and availability for all medical services.</p>
                 <button className="w-full py-4 bg-primary text-white rounded-2xl text-xs font-black hover:scale-105 transition-all">
                    Manage Service Catalog
                 </button>
              </div>
           </div>
        </div>
      </div>
      );
};

export default AdminOverview;
