import React from 'react';
import {
  ShieldAlert,
  Users,
  BookOpen,
  DollarSign,
  Activity,
  Cpu,
  BarChart3,
  Server,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { setActiveTab } = useAuth();

  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
            Administrator Control Panel
          </span>
          <h1 className="text-2xl font-black mt-2">EduAI Platform Administration & Revenue</h1>
          <p className="text-xs text-slate-300 mt-1">
            System health, active subscriptions, Gemini AI API token metrics, user management, and platform security logs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('admin_panel')}
          className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 shrink-0 transition-all hover:scale-105"
        >
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Launch Full Admin Control Panel</span>
        </button>
      </div>

      {/* Analytics KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Total Registered Users</div>
          <div className="text-2xl font-black text-slate-800 dark:text-slate-100">48,290</div>
          <div className="text-[10px] text-emerald-500 font-bold mt-1">↑ +12% this month</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Monthly Active Revenue</div>
          <div className="text-2xl font-black text-emerald-600">₹ 14,85,000</div>
          <div className="text-[10px] text-emerald-500 font-bold mt-1">↑ +18% subscriptions</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">AI Tutor Queries Processed</div>
          <div className="text-2xl font-black text-indigo-600">1.2M Calls</div>
          <div className="text-[10px] text-indigo-500 font-bold mt-1">Avg response 420ms</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Server Status</div>
          <div className="text-2xl font-black text-emerald-500">99.98%</div>
          <div className="text-[10px] text-slate-400 font-bold mt-1">Cloud Run Active</div>
        </div>
      </div>

      {/* User Management & Subscriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
          <h2 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>Platform User Breakdown by Role</span>
          </h2>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900">
              <div className="text-xl font-black text-blue-700 dark:text-blue-300">42,500</div>
              <div className="text-xs font-bold text-slate-600 dark:text-slate-300">Students</div>
            </div>
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900">
              <div className="text-xl font-black text-indigo-700 dark:text-indigo-300">3,200</div>
              <div className="text-xs font-bold text-slate-600 dark:text-slate-300">Teachers</div>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900">
              <div className="text-xl font-black text-amber-700 dark:text-amber-300">2,590</div>
              <div className="text-xs font-bold text-slate-600 dark:text-slate-300">Parents</div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
          <h2 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-600" />
            <span>System Infrastructure</span>
          </h2>

          <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex justify-between font-bold">
              <span>Gemini 3.6 Flash Engine</span>
              <span className="text-emerald-500">Active</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Speech-to-Text & TTS</span>
              <span className="text-emerald-500">Active</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>OCR Vision Processor</span>
              <span className="text-emerald-500">Active</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
