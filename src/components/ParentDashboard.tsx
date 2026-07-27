import React from 'react';
import {
  Users,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MOCK_STUDENT_REPORTS } from '../data/mockData';

export const ParentDashboard: React.FC = () => {
  const { addChatMessage, setActiveTab } = useAuth();
  const child = MOCK_STUDENT_REPORTS[0]; // Raju Sharma

  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white shadow-xl shadow-amber-600/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold">
            Srinivas Sharma • Parent Portal
          </span>
          <h1 className="text-2xl font-black mt-2">Child Learning & Attendance Monitor</h1>
          <p className="text-xs text-amber-100 mt-1">
            Real-time insights on Raju Sharma's daily study streak, test scores, AI doubts solved, and weak topics.
          </p>
        </div>

        <button
          onClick={() => {
            addChatMessage({
              id: `m-${Date.now()}`,
              role: 'user',
              text: "As Raju's parent, please summarize his learning progress over the past week and suggest how I can help him improve in Quadratic Math equations.",
              timestamp: 'Just now',
            });
            setActiveTab('ai-tutor');
          }}
          className="px-5 py-3 rounded-2xl bg-white text-amber-900 font-bold text-xs flex items-center gap-2 shadow-lg hover:bg-amber-50 shrink-0 transition-transform active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Ask AI Parent Advisor</span>
        </button>
      </div>

      {/* Child Summary KPI Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Daily Streak</div>
          <div className="text-2xl font-black text-amber-500">🔥 {child.streak} Days</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Attendance Rate</div>
          <div className="text-2xl font-black text-emerald-600">{child.attendancePercent}%</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Average Grade</div>
          <div className="text-2xl font-black text-indigo-600">{child.averageGrade}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Study Time This Week</div>
          <div className="text-2xl font-black text-purple-600">14.5 Hours</div>
        </div>
      </div>

      {/* Test Scores History & Weak Topic Diagnostic */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Test Scores */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
          <h2 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <span>Recent Test & Quiz Results</span>
          </h2>

          <div className="space-y-3">
            {child.testScores.map((t, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-800 dark:text-slate-100">{t.testName}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{t.date}</div>
                </div>
                <div className="font-extrabold text-emerald-600 text-sm">{t.score}% Score</div>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Topics Insights */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
          <h2 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            <span>AI Attention Areas for Raju</span>
          </h2>

          <div className="space-y-3">
            {child.weakTopics.map((w, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 space-y-1">
                <div className="flex items-center justify-between font-bold text-xs text-rose-900 dark:text-rose-200">
                  <span>{w.topic}</span>
                  <span>{w.score}% Mastery</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  AI Recommendation: Needs 15 mins step-by-step practice on factor formula.
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
