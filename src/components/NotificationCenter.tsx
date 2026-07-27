import React, { useState } from 'react';
import {
  Bell,
  Clock,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Trash2,
  Check,
  Zap,
  Flame,
  HelpCircle,
  Settings,
  Calendar,
  Volume2,
  VolumeX,
  PlusCircle,
  Filter,
  CheckSquare,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NotificationType, Notification } from '../types';

export const NotificationCenter: React.FC = () => {
  const {
    user,
    notifications,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    clearAllNotifications,
    reminderSettings,
    updateReminderSettings,
    setActiveTab,
    educationLevel,
    addXp,
  } = useAuth();

  const [activeFilter, setActiveFilter] = useState<'all' | 'study_reminder' | 'quiz_reminder' | 'course_update' | 'settings'>('all');
  const [testNoticeTitle, setTestNoticeTitle] = useState('');
  const [testNoticeCategory, setTestNoticeCategory] = useState<NotificationType>('study_reminder');
  const [showSimModal, setShowSimModal] = useState(false);

  // Unread count per category
  const unreadTotal = notifications.filter((n) => !n.read).length;
  const unreadStudy = notifications.filter((n) => !n.read && n.type === 'study_reminder').length;
  const unreadQuiz = notifications.filter((n) => !n.read && n.type === 'quiz_reminder').length;
  const unreadCourse = notifications.filter((n) => !n.read && n.type === 'course_update').length;

  // Filtered notifications list
  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'settings') return false;
    return n.type === activeFilter;
  });

  // Handler to simulate triggering a custom instant reminder
  const handleTriggerCustomReminder = (type: NotificationType) => {
    let title = '';
    let message = '';
    let actionTab = 'courses';

    if (type === 'study_reminder') {
      title = '🔥 Daily Study Goal: Time for 30-min Session!';
      message = `Hey ${user.name}, your daily study reminder for ${educationLevel} is active. Complete today's module to earn +50 XP!`;
      actionTab = 'courses';
    } else if (type === 'quiz_reminder') {
      title = '⏰ Quiz Alert: Practice Test Due in 30 Mins';
      message = 'Your scheduled Mathematics & Physics Mock Quiz is about to start. Prepare your formulas!';
      actionTab = 'tests';
    } else if (type === 'course_update') {
      title = '📚 New Course Released: AI & Python Data Analytics';
      message = 'New interactive course with 12 video lessons, PDF formula sheets, and practice labs has been added!';
      actionTab = 'courses';
    }

    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      date: 'Just now',
      read: false,
      type,
      category: type === 'study_reminder' ? 'Daily Study' : type === 'quiz_reminder' ? 'Quiz Alert' : 'Course Update',
      actionTab,
    };

    addNotification(newNotif);
    addXp(10);
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'study_reminder':
        return <Flame className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'quiz_reminder':
        return <Clock className="w-5 h-5 text-rose-500 shrink-0" />;
      case 'course_update':
        return <BookOpen className="w-5 h-5 text-indigo-500 shrink-0" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
      default:
        return <Sparkles className="w-5 h-5 text-blue-500 shrink-0" />;
    }
  };

  const getTypeBadge = (type: NotificationType) => {
    switch (type) {
      case 'study_reminder':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Daily Study</span>;
      case 'quiz_reminder':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">Quiz Alert</span>;
      case 'course_update':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">New Course</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">System</span>;
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Bell className="w-4 h-4 text-amber-300 animate-bounce" />
              Real-time Notifications & Study Reminders
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Notifications & Daily Reminders Center
            </h1>
            <p className="text-xs md:text-sm text-indigo-200/90 leading-relaxed font-normal">
              Stay disciplined with scheduled daily study reminders, upcoming quiz count-downs, and instant alerts when new courses and study materials are added.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-white/10 dark:bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
            <div className="text-center px-3 border-r border-white/10">
              <span className="text-2xl font-black text-amber-300">{unreadTotal}</span>
              <p className="text-[10px] uppercase font-bold text-indigo-200">Unread</p>
            </div>
            <div className="text-center px-3 border-r border-white/10">
              <span className="text-2xl font-black text-emerald-400">{user.streak}d</span>
              <p className="text-[10px] uppercase font-bold text-indigo-200">Streak</p>
            </div>
            <div className="text-center px-3">
              <span className="text-2xl font-black text-indigo-300">{reminderSettings.dailyStudyTime}</span>
              <p className="text-[10px] uppercase font-bold text-indigo-200">Daily Alarm</p>
            </div>
          </div>
        </div>
      </div>

      {/* Instant Action Test Reminders Bar */}
      <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 dark:text-indigo-200">
          <Zap className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Test Instant Reminder Trigger:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleTriggerCustomReminder('study_reminder')}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-xs flex items-center gap-1.5"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>+ Daily Study Reminder</span>
          </button>

          <button
            type="button"
            onClick={() => handleTriggerCustomReminder('quiz_reminder')}
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>+ Quiz Reminder</span>
          </button>

          <button
            type="button"
            onClick={() => handleTriggerCustomReminder('course_update')}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>+ New Course Alert</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/80 dark:border-slate-700/80 shadow-inner overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`flex-1 sm:flex-none py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>All ({notifications.length})</span>
            {unreadTotal > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-slate-950 font-bold">
                {unreadTotal}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('study_reminder')}
            className={`flex-1 sm:flex-none py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeFilter === 'study_reminder'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Daily Study Reminders</span>
            {unreadStudy > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-slate-950 font-bold">
                {unreadStudy}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('quiz_reminder')}
            className={`flex-1 sm:flex-none py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeFilter === 'quiz_reminder'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
            }`}
          >
            <Clock className="w-4 h-4 text-rose-500" />
            <span>Quiz Reminders</span>
            {unreadQuiz > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-bold">
                {unreadQuiz}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('course_update')}
            className={`flex-1 sm:flex-none py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeFilter === 'course_update'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
            }`}
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>New Course Updates</span>
            {unreadCourse > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-indigo-500 text-white font-bold">
                {unreadCourse}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('settings')}
            className={`flex-1 sm:flex-none py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeFilter === 'settings'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Reminder Settings</span>
          </button>
        </div>

        {/* Global Bulk Action Controls */}
        {activeFilter !== 'settings' && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={markAllNotificationsAsRead}
              className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all flex items-center gap-1.5"
              title="Mark all notifications as read"
            >
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span>Mark All Read</span>
            </button>

            <button
              type="button"
              onClick={clearAllNotifications}
              className="py-2 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 font-bold text-xs transition-all flex items-center gap-1.5"
              title="Clear all notifications"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>

      {/* CONTENT AREA */}
      {activeFilter !== 'settings' ? (
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <Bell className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                No Notifications in this category
              </h3>
              <p className="text-xs text-slate-400">
                You are all caught up! Click the trigger buttons above to test instant study reminders.
              </p>
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <div
                key={n.id}
                className={`p-5 rounded-3xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  !n.read
                    ? 'bg-gradient-to-r from-indigo-50/80 via-purple-50/40 to-white dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-slate-900 border-indigo-200 dark:border-indigo-800/80 shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/80 opacity-90'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs shrink-0">
                    {getNotificationIcon(n.type)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {getTypeBadge(n.type)}
                      <span className="text-[10px] font-bold text-slate-400">{n.date}</span>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                      )}
                    </div>
                    <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">
                      {n.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                      {n.message}
                    </p>
                  </div>
                </div>

                {/* Right Action Controls */}
                <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800 shrink-0">
                  {n.actionTab && (
                    <button
                      type="button"
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        setActiveTab(n.actionTab || 'courses');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <span>Open & Study</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {!n.read && (
                    <button
                      type="button"
                      onClick={() => markNotificationAsRead(n.id)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all"
                      title="Mark as Read"
                    >
                      <Check className="w-4 h-4 text-emerald-500" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => deleteNotification(n.id)}
                    className="p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 transition-all"
                    title="Delete Notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* REMINDER SETTINGS & SCHEDULE CONFIGURATION PANEL */
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-8">
          <div className="space-y-1">
            <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Daily Study Reminders & Notification Preferences</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize daily alarm times, quiz advance alerts, and course release notifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Setting 1: Daily Study Reminder */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <Flame className="w-4 h-4" /> Daily Study Reminder
                  </span>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    Daily Scheduled Alarm
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Receive daily notifications to study for {educationLevel} at your chosen time.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={reminderSettings.dailyStudyReminder}
                    onChange={(e) => updateReminderSettings({ dailyStudyReminder: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {reminderSettings.dailyStudyReminder && (
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Daily Alarm Time:</span>
                    <input
                      type="time"
                      value={reminderSettings.dailyStudyTime}
                      onChange={(e) => updateReminderSettings({ dailyStudyTime: e.target.value })}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Target Study Session:</span>
                    <select
                      value={reminderSettings.targetDailyMinutes}
                      onChange={(e) => updateReminderSettings({ targetDailyMinutes: Number(e.target.value) })}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                    >
                      <option value={15}>15 Minutes / day</option>
                      <option value={30}>30 Minutes / day</option>
                      <option value={45}>45 Minutes / day</option>
                      <option value={60}>60 Minutes / day</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Setting 2: Quiz & Exam Alerts */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-4 h-4" /> Quiz & Practice Test Alerts
                  </span>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    Quiz Reminders
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Get advance alerts before assigned tests, mid-terms, or mock exams.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={reminderSettings.quizReminders}
                    onChange={(e) => updateReminderSettings({ quizReminders: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                </label>
              </div>

              {reminderSettings.quizReminders && (
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Alert Lead Time:</span>
                    <select
                      value={reminderSettings.quizAdvanceNoticeMins}
                      onChange={(e) => updateReminderSettings({ quizAdvanceNoticeMins: Number(e.target.value) })}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                    >
                      <option value={15}>15 Minutes Before</option>
                      <option value={30}>30 Minutes Before</option>
                      <option value={60}>1 Hour Before</option>
                      <option value={120}>2 Hours Before</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Setting 3: New Course Release Notifications */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="w-4 h-4" /> New Course Updates
                  </span>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    New Material & Chapter Release
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Get notified immediately when new subjects, video lessons, or PDF books are added.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={reminderSettings.courseUpdates}
                    onChange={(e) => updateReminderSettings({ courseUpdates: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>

            {/* Setting 4: Audio Sound Alerts */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <Volume2 className="w-4 h-4" /> Audio Sound Chime
                  </span>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    In-App Notification Sound
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Play a gentle educational chime sound when new reminders trigger.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={reminderSettings.soundAlerts}
                    onChange={(e) => updateReminderSettings({ soundAlerts: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
