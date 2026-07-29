import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  GraduationCap,
  Bot,
  FileQuestion,
  User,
  Grid,
  X,
  Radio,
  BookCheck,
  Users,
  WifiOff,
  Bell,
  Wrench,
  Trophy,
  ShieldAlert,
  Settings,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, role, setShowAuthModal, user } = useAuth();
  const [showMenuDrawer, setShowMenuDrawer] = useState(false);

  const primaryDashboardTab =
    role === 'teacher'
      ? 'teacher-dashboard'
      : role === 'parent'
      ? 'parent-dashboard'
      : role === 'admin'
      ? 'admin-dashboard'
      : 'dashboard';

  const navItems = [
    { id: primaryDashboardTab, label: 'Home', icon: Home },
    { id: 'courses', label: 'Learn', icon: GraduationCap },
    { id: 'ai-tutor', label: 'AI Tutor', icon: Bot, isHighlight: true },
    { id: 'tests', label: 'Quiz', icon: FileQuestion },
    { id: 'more_menu', label: 'More', icon: Grid },
  ];

  const allMobileTabs = [
    { id: primaryDashboardTab, label: 'Dashboard', icon: Home, color: 'text-blue-500' },
    { id: 'courses', label: 'Courses (LKG-Degree)', icon: GraduationCap, color: 'text-indigo-500' },
    { id: 'ai-tutor', label: 'AI Tutor Chat', icon: Bot, color: 'text-purple-500' },
    { id: 'voice-classes', label: 'AI Voice Class', icon: Radio, color: 'text-amber-500' },
    { id: 'study-materials', label: 'PDFs & Materials', icon: BookCheck, color: 'text-emerald-500' },
    { id: 'ai-tools', label: '12 AI Tools Suite', icon: Wrench, color: 'text-pink-500' },
    { id: 'tests', label: 'Tests & Flashcards', icon: FileQuestion, color: 'text-cyan-500' },
    { id: 'offline-vault', label: 'Offline Vault', icon: WifiOff, color: 'text-amber-600' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'text-red-500' },
    { id: 'gamification', label: 'Leaderboard & XP', icon: Trophy, color: 'text-yellow-500' },
    { id: 'community', label: 'Community Forum', icon: Users, color: 'text-teal-500' },
    { id: 'admin_panel', label: 'Admin Panel', icon: ShieldAlert, color: 'text-rose-500' },
    { id: 'settings', label: 'Settings & Prefs', icon: Settings, color: 'text-slate-500' },
  ];

  const handleNavClick = (id: string) => {
    if (id === 'more_menu') {
      setShowMenuDrawer(!showMenuDrawer);
      return;
    }
    if (id === 'settings' && !user?.email) {
      setShowAuthModal(true);
      return;
    }
    setActiveTab(id);
    setShowMenuDrawer(false);
  };

  return (
    <>
      {/* Mobile Drawer Backdrop & Modal */}
      <AnimatePresence>
        {showMenuDrawer && (
          <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMenuDrawer(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative z-10 bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-5 max-h-[80vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <Grid className="w-5 h-5 text-indigo-500" />
                  <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                    All EduAI Navigation
                  </span>
                </div>
                <button
                  onClick={() => setShowMenuDrawer(false)}
                  className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 pb-6">
                {allMobileTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleNavClick(tab.id)}
                      className={`flex flex-col items-center text-center p-3 rounded-2xl transition-all border ${
                        isActive
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className={`p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm mb-1.5 ${tab.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Persistent Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 select-none">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === 'more_menu' && showMenuDrawer);
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all ${
                  item.isHighlight
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 font-medium'
                }`}
              >
                <div
                  className={`p-1.5 rounded-full transition-all ${
                    item.isHighlight
                      ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/30 -translate-y-2 ring-4 ring-white dark:ring-slate-900'
                      : isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                      : ''
                  }`}
                >
                  <Icon className={`${item.isHighlight ? 'w-5 h-5' : 'w-4.5 h-4.5'}`} />
                </div>
                <span className={`text-[10px] mt-0.5 ${item.isHighlight ? '-mt-1' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

