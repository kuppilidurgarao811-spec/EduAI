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
  FileText,
  Video,
  HelpCircle,
  Sparkles,
  Layers,
  FileSpreadsheet,
  ChevronRight,
  Database,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { setActiveTab, courses } = useAuth();

  const contentModules = [
    {
      id: 'subjects',
      icon: '📚',
      lucideIcon: BookOpen,
      title: 'Subjects',
      count: '64 Active Subjects',
      desc: 'Create, organize, and edit course subjects across all education levels',
      color: 'from-blue-600 to-indigo-600',
      badgeColor: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300',
    },
    {
      id: 'chapters',
      icon: '📑',
      lucideIcon: Layers,
      title: 'Chapters',
      count: '312 Chapters',
      desc: 'Manage chapter sequencing, syllabus topics, and unit breakdowns',
      color: 'from-indigo-600 to-purple-600',
      badgeColor: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300',
    },
    {
      id: 'lessons',
      icon: '📖',
      lucideIcon: FileText,
      title: 'Lessons',
      count: '1,420 Lessons',
      desc: 'Interactive rich text lesson modules, durations, and AI summaries',
      color: 'from-purple-600 to-pink-600',
      badgeColor: 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300',
    },
    {
      id: 'pdfs',
      icon: '📄',
      lucideIcon: FileText,
      title: 'PDFs',
      count: '580 Handbooks',
      desc: 'Downloadable textbooks, formula sheets, and offline study materials',
      color: 'from-emerald-600 to-teal-600',
      badgeColor: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300',
    },
    {
      id: 'videos',
      icon: '🎥',
      lucideIcon: Video,
      title: 'Videos',
      count: '890 Video Lectures',
      desc: 'HD video lectures, YouTube streams, and animated AI visual guides',
      color: 'from-rose-600 to-red-600',
      badgeColor: 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300',
    },
    {
      id: 'quizzes',
      icon: '📝',
      lucideIcon: HelpCircle,
      title: 'Quizzes',
      count: '3,200 Questions',
      desc: 'Interactive MCQs, solution explanations, and practice mock tests',
      color: 'from-amber-500 to-orange-600',
      badgeColor: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300',
    },
    {
      id: 'published',
      icon: '🚀',
      lucideIcon: Sparkles,
      title: 'Published Content',
      count: `${courses.length} Live in Firestore`,
      desc: 'Live Firestore database explorer, student visibility toggles, and updates',
      color: 'from-emerald-600 to-cyan-600',
      badgeColor: 'bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300',
    },
  ];

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

      {/* SECTION 1: EDUAI ADMIN CONTENT MANAGEMENT DASHBOARD */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-900/60 shadow-xl space-y-6">
        
        {/* Header matching requested ASCII Layout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white text-2xl shadow-lg shadow-indigo-500/30">
              🎓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-black uppercase tracking-wider">
                  Admin Content Hub
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  <Database className="w-3 h-3" /> Firestore Live Sync
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 mt-0.5 tracking-tight">
                EDUAI ADMIN — Content Management Dashboard
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('education_management')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs shadow-md flex items-center gap-2 transition-all hover:scale-105 shrink-0"
          >
            <BookOpen className="w-4 h-4 text-amber-300" />
            <span>Open Education Curriculum Editor</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 7 Core Content Management Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {contentModules.map((mod) => (
            <div
              key={mod.id}
              onClick={() => setActiveTab('education_management')}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl group-hover:scale-125 transition-transform">
                    {mod.icon}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${mod.badgeColor}`}>
                    {mod.count}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {mod.icon} {mod.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {mod.desc}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                <span>Manage {mod.title} →</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
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
