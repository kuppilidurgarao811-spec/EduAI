import React from 'react';
import {
  LayoutDashboard,
  Bot,
  BookOpen,
  Wrench,
  FileQuestion,
  Trophy,
  Users,
  GraduationCap,
  Calendar,
  Settings,
  Sparkles,
  Award,
  BarChart3,
  BookCheck,
  Radio,
  Bell,
  WifiOff,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { role, activeTab, setActiveTab, user } = useAuth();

  const getMenuItems = () => {
    switch (role) {
      case 'teacher':
        return [
          { id: 'teacher-dashboard', label: 'Teacher Dashboard', icon: LayoutDashboard },
          { id: 'admin_panel', label: 'Admin Panel', icon: ShieldAlert, badge: 'ADMIN' },
          { id: 'ai-tutor', label: 'AI Lesson Planner', icon: Bot, badge: 'AI' },
          { id: 'courses', label: 'Manage Courses', icon: BookOpen },
          { id: 'tests', label: 'Create Exams & Quizzes', icon: FileQuestion },
          { id: 'community', label: 'Community Forum', icon: Users, badge: 'FORUM' },
          { id: 'gamification', label: 'Student Leaderboard', icon: Trophy },
          { id: 'settings', label: 'Settings', icon: Settings, badge: 'PREFS' },
        ];
      case 'parent':
        return [
          { id: 'parent-dashboard', label: 'Child Progress', icon: LayoutDashboard },
          { id: 'ai-tutor', label: 'Ask AI Assistant', icon: Bot, badge: 'AI' },
          { id: 'courses', label: 'Recommended Lessons', icon: BookOpen },
          { id: 'community', label: 'Community Forum', icon: Users, badge: 'FORUM' },
          { id: 'admin_panel', label: 'Admin Panel', icon: ShieldAlert, badge: 'ADMIN' },
          { id: 'gamification', label: 'Badges & Streak', icon: Award },
          { id: 'settings', label: 'Settings', icon: Settings, badge: 'PREFS' },
        ];
      case 'admin':
        return [
          { id: 'admin_panel', label: 'Admin Control Center', icon: ShieldAlert, badge: 'ADMIN' },
          { id: 'admin-dashboard', label: 'Admin Analytics', icon: LayoutDashboard },
          { id: 'courses', label: 'Course Catalog', icon: BookOpen },
          { id: 'community', label: 'Community Forum', icon: Users, badge: 'FORUM' },
          { id: 'ai-tools', label: 'AI Tools Overview', icon: Wrench },
          { id: 'gamification', label: 'Platform Leaderboard', icon: Trophy },
          { id: 'settings', label: 'Settings', icon: Settings, badge: 'PREFS' },
        ];
      case 'student':
      default:
        return [
          { id: 'dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
          { id: 'admin_panel', label: 'Admin Panel', icon: ShieldAlert, badge: 'ADMIN' },
          { id: 'ai-tutor', label: 'AI Tutor & Voice', icon: Bot, badge: 'AI' },
          { id: 'voice-classes', label: 'AI Voice Classes', icon: Radio, badge: 'LIVE VOICE' },
          { id: 'courses', label: 'Courses (LKG to Degree)', icon: BookOpen },
          { id: 'study-materials', label: 'Study Materials & PDFs', icon: BookCheck, badge: 'PDF & PYQ' },
          { id: 'community', label: 'Community Forum', icon: Users, badge: 'FORUM' },
          { id: 'offline-vault', label: 'Offline Mode & Vault', icon: WifiOff, badge: 'OFFLINE' },
          { id: 'notifications', label: 'Notifications & Reminders', icon: Bell, badge: 'ALERTS' },
          { id: 'ai-tools', label: 'AI Tools Suite', icon: Wrench, badge: '12 Tools' },
          { id: 'tests', label: 'Mock Tests & Flashcards', icon: FileQuestion },
          { id: 'gamification', label: 'Leaderboard & Badges', icon: Trophy },
          { id: 'settings', label: 'Settings', icon: Settings, badge: 'PREFS' },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-[calc(100vh-4rem)] p-4 select-none shrink-0">
      
      {/* Current Level Banner */}
      <div className="mb-6 p-3.5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-blue-500/10 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-blue-950/40 border border-indigo-200/60 dark:border-indigo-800/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <GraduationCap className="w-4.5 h-4.5" />
          </div>
          <div className="overflow-hidden">
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              Level Selected
            </div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
              {user.educationLevel}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation List */}
      <div className="space-y-1 flex-1">
        <div className="px-3 pb-2 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Main Navigation
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 dark:shadow-indigo-900/40'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide uppercase ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Gamification / Streak Card */}
      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              🔥 Streak Progress
            </span>
            <span className="text-xs font-black text-amber-500">{user.streak} Days</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
              style={{ width: `${Math.min((user.streak / 10) * 100, 100)}%` }}
            />
          </div>
          <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-2">
            Reach 10 days to unlock the <span className="font-bold text-amber-600 dark:text-amber-400">Golden Trophy</span>!
          </p>
        </div>
      </div>
    </aside>
  );
};
