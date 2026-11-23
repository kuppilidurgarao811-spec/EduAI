import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  Send,
  PlayCircle,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Brain,
  Lightbulb,
  GraduationCap,
  ChevronRight,
  TrendingUp,
  Radio,
  Edit3,
  Search,
  X,
  Clock,
  Filter,
  Smartphone,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Course, Test, EducationLevel } from '../types';
import { AdBanner } from './AdBanner';
import { Crown, Calendar, Zap, ShieldCheck } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    user,
    educationLevel,
    setEducationLevel,
    courses,
    tests,
    setActiveTab,
    addChatMessage,
    searchTerm,
    setSearchTerm,
    setShowAuthModal,
    isPremium,
    setShowPremiumModal,
  } = useAuth();

  const [dashboardPrompt, setDashboardPrompt] = useState('');

  // Categories list from LKG to Degree
  const categories: { level: EducationLevel; label: string; icon: string; count: number }[] = [
    { level: 'LKG', label: 'LKG', icon: '🧸', count: 12 },
    { level: 'UKG', label: 'UKG', icon: '🎈', count: 15 },
    { level: 'Class 1–5', label: 'Class 1–5 (Primary)', icon: '🎒', count: 28 },
    { level: 'Class 6–10', label: 'Class 6–10 (High School)', icon: '📚', count: 42 },
    { level: 'Intermediate (11–12)', label: 'Intermediate (11–12)', icon: '🔬', count: 35 },
    { level: 'Degree (BSc, BCom, BA, BTech)', label: 'Degree (BTech/BSc)', icon: '🎓', count: 50 },
    { level: 'Diploma', label: 'Diploma', icon: '📐', count: 18 },
    { level: 'Competitive Exams (UPSC, APPSC, Banking, Railways)', label: 'Competitive Exams', icon: '🏆', count: 30 },
  ];

  // Filter courses for current level or search term
  const levelCourses = courses.filter((c) => {
    const matchesLevel = c.level === educationLevel || educationLevel === 'Degree (BSc, BCom, BA, BTech)';
    const matchesSearch = searchTerm
      ? c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesLevel && matchesSearch;
  });

  const displayCourses = levelCourses.length > 0 ? levelCourses : courses.slice(0, 4);

  // In-progress courses for "Continue Learning"
  const inProgressCourses = courses.filter((c) => c.progressPercent && c.progressPercent > 0);

  // Recent activity logs
  const recentActivities = [
    {
      id: 'act-1',
      title: 'Completed Class 10 Math Quiz',
      detail: 'Scored 95% in Trigonometry & Quadratic Equations',
      time: '2 hours ago',
      type: 'quiz',
      icon: '📝',
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 'act-2',
      title: 'Attended AI Voice Lecture',
      detail: 'Interactive Physics class on Newton Mechanics',
      time: 'Yesterday at 4:30 PM',
      type: 'voice',
      icon: '🎙️',
      bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    },
    {
      id: 'act-3',
      title: 'Asked AI Tutor a Question',
      detail: 'Solved: Step-by-step photosynthesis light reaction',
      time: 'Yesterday at 2:15 PM',
      type: 'ai',
      icon: '🤖',
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
    {
      id: 'act-4',
      title: 'Unlocked New Achievement Badge',
      detail: 'Earned "Math Mastermind 🏅" for 5 day streak',
      time: '2 days ago',
      type: 'badge',
      icon: '🏆',
      bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    },
  ];

  const handleQuickAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dashboardPrompt.trim()) return;

    addChatMessage({
      id: `m-${Date.now()}`,
      role: 'user',
      text: dashboardPrompt,
      timestamp: 'Just now',
    });

    setActiveTab('ai-tutor');
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-in fade-in duration-200">
      
      {/* 1. Welcome Message Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 md:p-8 text-white shadow-xl shadow-indigo-500/15">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-3 border border-white/20 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Welcome Message</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight flex items-center gap-2">
              <span>Welcome back, {user.name}!</span>
              <button
                onClick={() => setShowAuthModal(true)}
                className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-amber-200 transition-colors"
                title="Edit Profile"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </h1>
            <p className="mt-2 text-sm text-blue-100 max-w-xl">
              Personalized AI learning dashboard tailored for your grade level:{' '}
              <span className="font-bold text-amber-300 underline decoration-amber-400 decoration-wavy">
                {educationLevel}
              </span>
            </p>
          </div>

          {/* Quick Stats Grid inside Welcome Banner */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 text-center min-w-[90px]">
              <div className="flex items-center justify-center gap-1 text-amber-300 text-lg font-black">
                <Flame className="w-5 h-5 fill-amber-300" />
                <span>{user.streak}</span>
              </div>
              <div className="text-[10px] font-bold text-blue-100 uppercase tracking-wider mt-0.5">
                Day Streak
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 text-center min-w-[90px]">
              <div className="flex items-center justify-center gap-1 text-emerald-300 text-lg font-black">
                <TrendingUp className="w-5 h-5" />
                <span>{user.xp}</span>
              </div>
              <div className="text-[10px] font-bold text-blue-100 uppercase tracking-wider mt-0.5">
                Total XP
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 text-center min-w-[90px]">
              <div className="flex items-center justify-center gap-1 text-purple-200 text-lg font-black">
                <Award className="w-5 h-5" />
                <span>{user.badges.length}</span>
              </div>
              <div className="text-[10px] font-bold text-blue-100 uppercase tracking-wider mt-0.5">
                Badges
              </div>
            </div>
          </div>
        </div>

        {/* Quick Ask AI Prompt Box */}
        <div className="mt-6 pt-6 border-t border-white/20">
          <form onSubmit={handleQuickAsk} className="relative flex items-center">
            <input
              type="text"
              value={dashboardPrompt}
              onChange={(e) => setDashboardPrompt(e.target.value)}
              placeholder={`Ask EduAI anything about ${educationLevel} syllabus... (e.g., "Explain quadratic equations step by step")`}
              className="w-full pl-4 pr-28 py-3.5 rounded-2xl bg-white text-slate-900 placeholder-slate-400 text-sm font-medium shadow-lg outline-none focus:ring-4 focus:ring-amber-400/50 transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-transform active:scale-95"
            >
              <span>Ask AI</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Ad Banner for Free Tier Users */}
      <AdBanner type="banner" />

      {/* Premium Features Highlight Section */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-purple-500/10 border border-amber-500/20 dark:border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
            <Crown className="w-6 h-6 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-slate-800 dark:text-slate-100 text-sm md:text-base">
                EduAI Premium Membership
              </h3>
              {isPremium ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-black border border-emerald-500/30">
                  ✨ PRO UNLOCKED
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-black border border-amber-500/30">
                  ⚡ UPGRADE NOW
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Unlock Unlimited AI Chat • Advanced Explanations • Personalized Study Plans • Ad-Free Experience
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('ai-tutor')}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-black border border-slate-200 dark:border-slate-700 shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span>AI Study Plans</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPremiumModal(true)}
            className="flex-1 md:flex-none px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white text-xs font-black shadow-md hover:scale-105 transition-all flex items-center justify-center gap-1.5"
          >
            <Zap className="w-4 h-4 text-amber-200" />
            <span>{isPremium ? 'Manage Membership' : 'Upgrade to Premium'}</span>
          </button>
        </div>
      </div>

      {/* Android App Student Flow Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 border border-indigo-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 uppercase tracking-wider">
                Curriculum Hierarchy
              </span>
              <span className="text-xs text-indigo-300 font-bold">LKG to Degree ➔ Classes ➔ Subjects ➔ Lessons</span>
            </div>
            <h3 className="text-sm md:text-base font-black text-white mt-1">
              Interactive 6-Tier Educational Curriculum
            </h3>
            <p className="text-xs text-slate-300">
              Drill down sequentially from Education Level (LKG/School/Intermediate/Degree) to Subject & Lessons.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('curriculum')}
          className="w-full md:w-auto px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shrink-0 shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Explore Curriculum</span>
          <ArrowRight className="w-4 h-4 text-slate-950" />
        </button>
      </div>

      {/* 2. Global Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
            Search Dashboard
          </span>
        </div>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search courses, subjects, chapters, or exam tests across LKG to Degree..."
            className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {searchTerm && (
          <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold pt-1">
            Found {levelCourses.length} result(s) matching "{searchTerm}"
          </div>
        )}
      </div>

      {/* 3. Categories (LKG to Degree) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Categories (LKG to Degree)
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Active: <strong className="text-indigo-600 dark:text-indigo-400">{educationLevel}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {categories.map((cat) => {
            const isSelected = educationLevel === cat.level;
            return (
              <button
                key={cat.level}
                onClick={() => setEducationLevel(cat.level)}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20 scale-[1.02]'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700/80 hover:border-indigo-300 hover:shadow-xs'
                }`}
              >
                <div className="text-2xl mb-1">{cat.icon}</div>
                <div>
                  <div className={`text-xs font-bold leading-snug line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>
                    {cat.label}
                  </div>
                  <div className={`text-[10px] mt-0.5 font-medium ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {cat.count}+ Courses
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live AI Voice Classroom Highlight Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 border border-indigo-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0 shadow-lg text-xl animate-pulse">
            🎙️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 uppercase tracking-wider flex items-center gap-1">
                <Radio className="w-3 h-3 text-slate-950 animate-ping" /> Live Classroom
              </span>
              <span className="text-xs font-bold text-indigo-200">{user.educationLevel}</span>
            </div>
            <h3 className="text-base font-black text-white mt-1">
              Interactive AI Voice Classroom & Audio Lectures
            </h3>
            <p className="text-xs text-indigo-200/90">
              Listen to AI teachers deliver live voice lessons, view digital blackboard slides, and ask doubts live by microphone!
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('voice-classes')}
          className="w-full md:w-auto px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shrink-0 shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <span>Join Voice Class Now</span>
          <ArrowRight className="w-4 h-4 text-slate-950" />
        </button>
      </div>

      {/* 4. Continue Learning Section */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
        {/* Active Lesson Prompt Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10 border border-indigo-200 dark:border-indigo-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-md">
              📖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-600 text-white">
                  Active Lesson
                </span>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Machine Learning & Statistics
                </span>
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                Simple Linear Regression (Video, PDF, Audio & Quiz)
              </h4>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('student-lesson')}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5 transition-all shrink-0"
          >
            <span>Open Student Lesson Screen</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 11. Student Progress Feature Card */}
        <div className="p-5 rounded-2xl bg-slate-950 text-white border border-slate-800 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4 font-mono">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-black uppercase">
                11. Student Progress
              </span>
              <span className="text-xs font-sans font-bold text-slate-300">
                Machine Learning Curriculum
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1 text-xs">
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[11px]">Chapter 1</div>
                <div className="text-emerald-400 font-bold mt-0.5 flex items-center justify-between">
                  <span>██████████</span>
                  <span>100%</span>
                </div>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[11px]">Chapter 2</div>
                <div className="text-indigo-400 font-bold mt-0.5 flex items-center justify-between">
                  <span>███████░░░</span>
                  <span>70%</span>
                </div>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[11px]">Chapter 3</div>
                <div className="text-amber-400 font-bold mt-0.5 flex items-center justify-between">
                  <span>███░░░░░░░</span>
                  <span>30%</span>
                </div>
              </div>
              <div className="bg-indigo-950/40 p-2.5 rounded-xl border border-indigo-500/30">
                <div className="text-indigo-300 text-[11px] font-bold">Overall</div>
                <div className="text-amber-300 font-bold mt-0.5 flex items-center justify-between">
                  <span>███████░░░</span>
                  <span>68%</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('student-progress')}
            className="px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-sans text-xs font-black shadow-md flex items-center justify-center gap-1.5 transition-all shrink-0 cursor-pointer"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Open Progress View</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Continue Learning
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('courses')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>My Courses</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inProgressCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => setActiveTab('courses')}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-400 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div className="flex items-start gap-3">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-14 h-14 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    {course.subject}
                  </span>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-indigo-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    Next: {course.modules[0]?.title || 'Lesson 1'}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  <span>Course Progress</span>
                  <span>{course.progressPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${course.progressPercent}%` }}
                  />
                </div>
              </div>

              <button className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors">
                <PlayCircle className="w-3.5 h-3.5" />
                <span>Resume Lesson</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Recommended Courses & 5. Recent Activity / Weak Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recommended Courses (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Recommended Courses
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Curated specifically for {educationLevel}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('courses')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Explore All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {displayCourses.map((course: Course) => (
              <div
                key={course.id}
                onClick={() => setActiveTab('courses')}
                className="group cursor-pointer rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold">
                    {course.subject}
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px] font-bold">
                    ★ {course.rating}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {course.level}
                    </span>
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                      {course.description}
                    </p>
                  </div>

                  <div>
                    {course.progressPercent !== undefined && (
                      <div className="space-y-1 mb-2">
                        <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                          <span>Progress</span>
                          <span>{course.progressPercent}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full"
                            style={{ width: `${course.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                      <span className="flex items-center gap-1">
                        <PlayCircle className="w-3.5 h-3.5 text-indigo-500" />
                        {course.videoCount} Videos
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-purple-500" />
                        {course.pdfCount} PDFs
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side Column: 5. Recent Activity & AI Weak Topics */}
        <div className="space-y-6">
          
          {/* 5. Recent Activity Log */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                Recent Activity
              </h3>
            </div>

            <div className="space-y-3 pt-1">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${act.bg}`}>
                    <span className="text-sm">{act.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-800 dark:text-slate-100 truncate">
                      {act.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {act.detail}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                      {act.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Weak Topic Diagnostic */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                  Weak Topics Analysis
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  AI detected topics needing review
                </p>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Quadratic Formula Step-by-Step</span>
                  <span className="text-rose-500 font-bold">58% Accuracy</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 mt-1">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '58%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Telugu Samasalu (సమాసాలు)</span>
                  <span className="text-amber-500 font-bold">65% Accuracy</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 mt-1">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '65%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Python Array Recursion</span>
                  <span className="text-emerald-500 font-bold">78% Accuracy</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 mt-1">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '78%' }} />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                addChatMessage({
                  id: `m-${Date.now()}`,
                  role: 'user',
                  text: 'Please generate a revision plan and 3 practice problems with step-by-step solutions for Quadratic Formula and Telugu Samasalu.',
                  timestamp: 'Just now',
                });
                setActiveTab('ai-tutor');
              }}
              className="w-full py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-amber-100 transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Practice Weak Topics with AI</span>
            </button>
          </div>

        </div>

      </div>

      {/* Floating AI Tutor FAB Button */}
      <button
        onClick={() => setActiveTab('ai-tutor')}
        className="fixed bottom-20 md:bottom-8 right-6 z-30 p-4 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl shadow-indigo-600/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
      >
        <Sparkles className="w-5 h-5 animate-spin-slow" />
        <span className="text-xs font-black pr-1 hidden sm:inline">Ask AI Tutor</span>
      </button>

    </div>
  );
};
