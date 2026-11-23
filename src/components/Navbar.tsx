import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Moon,
  Sun,
  Bell,
  User as UserIcon,
  Globe,
  GraduationCap,
  ChevronDown,
  Check,
  LogOut,
  ShieldAlert,
  BookOpen,
  Award,
  UserPlus,
  Radio,
  WifiOff,
  Crown,
  Zap,
  Settings as SettingsIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole, EducationLevel, Language } from '../types';
import { SUPPORTED_LANGUAGES, getLanguageInfo } from '../utils/translations';
import { EDUCATION_LEVELS } from '../data/mockData';

export const Navbar: React.FC = () => {
  const {
    user,
    role,
    setRole,
    educationLevel,
    setEducationLevel,
    language,
    setLanguage,
    darkMode,
    toggleDarkMode,
    notifications,
    markNotificationAsRead,
    setShowAuthModal,
    logout,
    searchTerm,
    setSearchTerm,
    setActiveTab,
    isOfflineMode,
    offlineItems,
    isPremium,
    subscriptionPlan,
    setShowPremiumModal,
  } = useAuth();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showLevelMenu, setShowLevelMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const roleLabels: Record<UserRole, { label: string; bg: string; text: string }> = {
    student: { label: 'Student Mode', bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', text: 'text-emerald-700 dark:text-emerald-300' },
    teacher: { label: 'Teacher Portal', bg: 'bg-indigo-500/10 dark:bg-indigo-500/20', text: 'text-indigo-700 dark:text-indigo-300' },
    parent: { label: 'Parent View', bg: 'bg-amber-500/10 dark:bg-amber-500/20', text: 'text-amber-700 dark:text-amber-300' },
    admin: { label: 'Admin Control', bg: 'bg-rose-500/10 dark:bg-rose-500/20', text: 'text-rose-700 dark:text-rose-300' },
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        
        {/* Brand Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => setActiveTab('dashboard')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
                EduAI
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 uppercase tracking-wide">
                AI Tutor
              </span>
            </div>
            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
              LKG to Degree & Competitive Exams
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search subjects, topics, formula, or ask AI..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition-all"
            />
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold ${roleLabels[role].bg} ${roleLabels[role].text} hover:opacity-90 transition-all`}
              title="Switch User Role View"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="capitalize">{role}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Select User Role
                </div>
                {(['student', 'teacher', 'parent', 'admin'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRole(r);
                      setShowRoleMenu(false);
                      if (r === 'teacher') setActiveTab('teacher-dashboard');
                      else if (r === 'parent') setActiveTab('parent-dashboard');
                      else if (r === 'admin') setActiveTab('admin-dashboard');
                      else setActiveTab('dashboard');
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700/50 ${
                      role === r ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/40' : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <span className="capitalize">{r} Mode</span>
                    {role === r && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Education Level Selector */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setShowLevelMenu(!showLevelMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all"
            >
              <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
              <span className="truncate max-w-[120px]">{educationLevel}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showLevelMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-2 z-50 max-h-80 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Target Education Level
                </div>
                {EDUCATION_LEVELS.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => {
                      setEducationLevel(lvl as EducationLevel);
                      setShowLevelMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700/50 ${
                      educationLevel === lvl ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/40' : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <span>{lvl}</span>
                    {educationLevel === lvl && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Change Language / భాషను మార్చండి"
            >
              <Globe className="w-4 h-4 text-indigo-500 animate-spin-slow" />
              <span className="hidden sm:inline font-bold">{getLanguageInfo(language).nativeName.split(' ')[0]}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl py-2 z-50 max-h-96 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 mb-1">
                  <span>Select Preferred Language</span>
                  <span className="text-[9px] bg-indigo-500/10 text-indigo-500 px-1.5 py-0.5 rounded font-extrabold">12 Regional</span>
                </div>
                {SUPPORTED_LANGUAGES.map((langItem) => (
                  <button
                    key={langItem.id}
                    onClick={() => {
                      setLanguage(langItem.id);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs font-medium flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors ${
                      language === langItem.id ? 'text-indigo-600 dark:text-indigo-400 font-extrabold bg-indigo-50 dark:bg-indigo-950/50' : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-extrabold text-xs">{langItem.nativeName}</div>
                      <div className="text-[10px] opacity-70">{langItem.label}</div>
                    </div>
                    {language === langItem.id && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Premium Membership Button */}
          <button
            onClick={() => setShowPremiumModal(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black shadow-md transition-all hover:scale-105 ${
              isPremium
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/20'
                : 'bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 text-white shadow-amber-500/20'
            }`}
            title="EduAI Premium Features - Unlimited AI Chat, Advanced Explanations, Personalized Study Plans, Ad-Free"
          >
            <Crown className="w-3.5 h-3.5 text-amber-200" />
            <span>{isPremium ? `${subscriptionPlan}` : 'Upgrade Premium'}</span>
          </button>

          {/* AI Voice Class Quick Shortcut */}
          <button
            onClick={() => setActiveTab('voice-classes')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-sm transition-all"
            title="Open Interactive AI Voice Classroom"
          >
            <Radio className="w-3.5 h-3.5 text-slate-950 animate-pulse" />
            <span>Voice Class</span>
          </button>

          {/* Offline Mode Shortcut */}
          <button
            onClick={() => setActiveTab('offline-vault')}
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition-all ${
              isOfflineMode
                ? 'bg-amber-500 text-slate-950 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950'
            }`}
            title="Offline Mode Vault & Downloads"
          >
            <WifiOff className="w-3.5 h-3.5 text-amber-500" />
            <span>{isOfflineMode ? 'OFFLINE MODE' : `Offline Vault (${offlineItems.length})`}</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Toggle Light/Dark Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Settings Shortcut Button */}
          <button
            onClick={() => setActiveTab('settings')}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Settings - Dark Mode, Language, Font Size & Privacy"
          >
            <SettingsIcon className="w-4 h-4 text-slate-600 dark:text-slate-300 hover:text-indigo-500" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">Notifications</span>
                  <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">{unreadNotifs} unread</span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        if (n.actionTab) {
                          setActiveTab(n.actionTab);
                        } else {
                          setActiveTab('notifications');
                        }
                        setShowNotifMenu(false);
                      }}
                      className={`p-3 text-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${
                        !n.read ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                      }`}
                    >
                      <div className="font-semibold text-slate-800 dark:text-slate-100">{n.title}</div>
                      <div className="text-slate-600 dark:text-slate-300 mt-0.5">{n.message}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{n.date}</div>
                    </div>
                  ))}
                </div>
                <div className="p-2 pt-2 border-t border-slate-100 dark:border-slate-700 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('notifications');
                      setShowNotifMenu(false);
                    }}
                    className="w-full py-1.5 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-300 text-xs font-bold transition-all"
                  >
                    Notifications & Reminders Center →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar / Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30"
              />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                  <div className="font-bold text-sm text-slate-800 dark:text-slate-100">{user.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</div>
                  <div className="mt-1.5 flex items-center gap-2 text-[10px]">
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
                      🔥 {user.streak} Days
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-bold">
                      ⚡ {user.xp} XP
                    </span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setActiveTab('gamification');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <Award className="w-4 h-4 text-amber-500" />
                    My Badges & XP
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('courses');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    My Enrolled Courses
                  </button>
                  <button
                    onClick={() => {
                      setShowAuthModal(true);
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <UserIcon className="w-4 h-4 text-blue-500" />
                    Account Credentials
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <SettingsIcon className="w-4 h-4 text-purple-500" />
                    Settings & Preferences
                  </button>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700 pt-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setShowAuthModal(true);
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4 text-indigo-500" />
                    Sign In / New Profile Login
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out & Switch Profile
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
