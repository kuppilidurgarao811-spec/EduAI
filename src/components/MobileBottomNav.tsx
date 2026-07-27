import React from 'react';
import {
  Home,
  GraduationCap,
  Bot,
  FileQuestion,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, role, setShowAuthModal, user } = useAuth();

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
    { id: 'settings', label: 'Profile', icon: User },
  ];

  const handleNavClick = (id: string) => {
    if (id === 'settings' && !user?.email) {
      setShowAuthModal(true);
      return;
    }
    setActiveTab(id);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 select-none">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
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
  );
};
