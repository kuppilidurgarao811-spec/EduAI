import React from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Bot,
  BookOpen,
  Wrench,
  FileQuestion,
  Trophy,
  Users,
  GraduationCap,
  Settings,
  Award,
  BookCheck,
  Radio,
  Bell,
  WifiOff,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { role, activeTab, setActiveTab, user } = useAuth();

  const getMenuGroups = () => {
    if (role === 'teacher') {
      return [
        {
          title: 'Teacher Workspace',
          items: [
            { id: 'teacher-dashboard', label: 'Teacher Dashboard', icon: LayoutDashboard },
            { id: 'ai-tutor', label: 'AI Lesson Planner', icon: Bot, badge: 'AI' },
            { id: 'courses', label: 'Manage Courses', icon: BookOpen },
            { id: 'tests', label: 'Create Exams & Quizzes', icon: FileQuestion },
          ],
        },
        {
          title: 'Administration & Community',
          items: [
            { id: 'admin_panel', label: 'Admin Panel', icon: ShieldAlert, badge: 'ADMIN' },
            { id: 'community', label: 'Community Forum', icon: Users, badge: 'FORUM' },
            { id: 'gamification', label: 'Student Leaderboard', icon: Trophy },
            { id: 'settings', label: 'Settings', icon: Settings, badge: 'PREFS' },
          ],
        },
      ];
    }

    if (role === 'parent') {
      return [
        {
          title: 'Parent Portal',
          items: [
            { id: 'parent-dashboard', label: 'Child Progress', icon: LayoutDashboard },
            { id: 'ai-tutor', label: 'Ask AI Assistant', icon: Bot, badge: 'AI' },
            { id: 'courses', label: 'Recommended Lessons', icon: BookOpen },
            { id: 'gamification', label: 'Badges & Streak', icon: Award },
          ],
        },
        {
          title: 'Platform Services',
          items: [
            { id: 'community', label: 'Community Forum', icon: Users, badge: 'FORUM' },
            { id: 'admin_panel', label: 'Admin Panel', icon: ShieldAlert, badge: 'ADMIN' },
            { id: 'settings', label: 'Settings', icon: Settings, badge: 'PREFS' },
          ],
        },
      ];
    }

    if (role === 'admin') {
      return [
        {
          title: 'Admin Operations',
          items: [
            { id: 'admin_panel', label: 'Admin Control Center', icon: ShieldAlert, badge: 'ADMIN' },
            { id: 'admin-dashboard', label: 'Admin Analytics', icon: LayoutDashboard },
            { id: 'courses', label: 'Course Catalog', icon: BookOpen },
          ],
        },
        {
          title: 'Platform Tools',
          items: [
            { id: 'community', label: 'Community Forum', icon: Users, badge: 'FORUM' },
            { id: 'ai-tools', label: 'AI Tools Overview', icon: Wrench },
            { id: 'gamification', label: 'Platform Leaderboard', icon: Trophy },
            { id: 'settings', label: 'Settings', icon: Settings, badge: 'PREFS' },
          ],
        },
      ];
    }

    // Default: Student Mode
    return [
      {
        title: 'Core Learning',
        items: [
          { id: 'dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
          { id: 'courses', label: 'Courses (LKG to Degree)', icon: BookOpen },
          { id: 'study-materials', label: 'Study Materials & PDFs', icon: BookCheck, badge: 'PDF & PYQ' },
        ],
      },
      {
        title: 'AI & Smart Tools',
        items: [
          { id: 'ai-tutor', label: 'AI Tutor & Chat', icon: Bot, badge: 'AI' },
          { id: 'voice-classes', label: 'AI Voice Classes', icon: Radio, badge: 'LIVE VOICE' },
          { id: 'ai-tools', label: 'AI Tools Suite', icon: Wrench, badge: '12 Tools' },
        ],
      },
      {
        title: 'Practice & Offline',
        items: [
          { id: 'tests', label: 'Mock Tests & Flashcards', icon: FileQuestion },
          { id: 'offline-vault', label: 'Offline Vault', icon: WifiOff, badge: 'OFFLINE' },
          { id: 'notifications', label: 'Notifications', icon: Bell, badge: 'ALERTS' },
          { id: 'gamification', label: 'Leaderboard & Badges', icon: Trophy },
        ],
      },
      {
        title: 'Community & Admin',
        items: [
          { id: 'community', label: 'Community Forum', icon: Users, badge: 'FORUM' },
          { id: 'admin_panel', label: 'Admin Panel', icon: ShieldAlert, badge: 'ADMIN' },
          { id: 'settings', label: 'Settings', icon: Settings, badge: 'PREFS' },
        ],
      },
    ];
  };

  const menuGroups = getMenuGroups();

  return (
    <aside className="w-64 hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 backdrop-blur-md min-h-[calc(100vh-4rem)] p-4 select-none shrink-0 transition-all duration-200">
      
      {/* Current Level Banner */}
      <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-blue-500/10 dark:from-indigo-950/50 dark:via-purple-950/40 dark:to-blue-950/40 border border-indigo-200/60 dark:border-indigo-800/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-indigo-500/20">
            <GraduationCap className="w-4.5 h-4.5" />
          </div>
          <div className="overflow-hidden">
            <div className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Active Level
            </div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
              {user.educationLevel}
            </div>
          </div>
        </div>
      </div>

      {/* Categorized Navigation Groups */}
      <div className="space-y-5 flex-1 overflow-y-auto no-scrollbar pr-1">
        {menuGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            <div className="px-3 pb-1.5 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {group.title}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-600/25 dark:shadow-indigo-900/40 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide uppercase shrink-0 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Quick Gamification / Streak Card */}
      <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              🔥 Learning Streak
            </span>
            <span className="text-xs font-black text-amber-500">{user.streak} Days</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((user.streak / 10) * 100, 100)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-2">
            Keep it up! <span className="font-bold text-indigo-600 dark:text-indigo-400">{user.xp} total XP</span> earned.
          </p>
        </div>
      </div>
    </aside>
  );
};

