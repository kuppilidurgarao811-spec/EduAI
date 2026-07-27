import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Flame,
  Star,
  CheckCircle2,
  Download,
  Share2,
  Sparkles,
  GraduationCap,
  BarChart3,
  BookOpen,
  Calendar,
  Check,
  TrendingUp,
  Clock,
  CheckSquare,
  FileCheck,
  Zap,
  BookCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { INITIAL_BADGES } from '../data/mockData';

export const Gamification: React.FC = () => {
  const { user, addXp } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'lessons' | 'graphs' | 'certificates'>('overview');
  const [streakDays, setStreakDays] = useState([
    { day: 'Mon', completed: true, date: 'Jul 21' },
    { day: 'Tue', completed: true, date: 'Jul 22' },
    { day: 'Wed', completed: true, date: 'Jul 23' },
    { day: 'Thu', completed: true, date: 'Jul 24' },
    { day: 'Fri', completed: true, date: 'Jul 25' },
    { day: 'Sat', completed: true, date: 'Jul 26' },
    { day: 'Sun', completed: false, date: 'Today' },
  ]);
  const [streakClaimedToday, setStreakClaimedToday] = useState(false);

  const leaderboard = [
    { rank: 1, name: 'Ananya Varma', xp: 2450, streak: 14, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', badge: '🥇 Gold Topper' },
    { rank: 2, name: `${user.name} (You)`, xp: user.xp, streak: user.streak, avatar: user.avatar, badge: '🥈 Silver Master' },
    { rank: 3, name: 'Karthik Raja', xp: 1180, streak: 6, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', badge: '🥉 Bronze Scholar' },
    { rank: 4, name: 'Priya Reddy', xp: 950, streak: 5, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', badge: 'Star Student' },
  ];

  const handleClaimStreak = () => {
    if (streakClaimedToday) return;
    setStreakDays((prev) =>
      prev.map((d) => (d.day === 'Sun' ? { ...d, completed: true } : d))
    );
    setStreakClaimedToday(true);
    addXp(50);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 text-white shadow-xl shadow-orange-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-extrabold mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>Progress Tracking & Student Gamification</span>
          </div>
          <h1 className="text-2xl font-black">Your Learning Progress & Certificates</h1>
          <p className="text-xs text-amber-100 mt-1">
            Track daily learning streaks, monitor completed lessons, analyze performance graphs & download official certificates.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/20 shrink-0">
          <div>
            <div className="text-[10px] text-amber-100 font-bold uppercase">Total XP</div>
            <div className="text-2xl font-black">{user.xp} XP</div>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div>
            <div className="text-[10px] text-amber-100 font-bold uppercase">Active Streak</div>
            <div className="text-2xl font-black">🔥 {user.streak} Days</div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shrink-0 transition-all ${
            activeSubTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-400" />
          <span>Learning Streak</span>
        </button>

        <button
          onClick={() => setActiveSubTab('lessons')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shrink-0 transition-all ${
            activeSubTab === 'lessons'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
          }`}
        >
          <BookCheck className="w-4 h-4" />
          <span>Completed Lessons</span>
        </button>

        <button
          onClick={() => setActiveSubTab('graphs')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shrink-0 transition-all ${
            activeSubTab === 'graphs'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Performance Graphs</span>
        </button>

        <button
          onClick={() => setActiveSubTab('certificates')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shrink-0 transition-all ${
            activeSubTab === 'certificates'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-amber-400" />
          <span>Certificates ({user.certificates.length})</span>
        </button>
      </div>

      {/* Tab 1: Learning Streak Overview & Badges */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Interactive Learning Streak Calendar */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700/60 pb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span>Weekly Learning Streak Tracker</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Study at least 15 minutes daily to maintain your streak fire and unlock bonus XP badges.
                </p>
              </div>

              <button
                onClick={handleClaimStreak}
                disabled={streakClaimedToday}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md disabled:opacity-60 shrink-0"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>{streakClaimedToday ? 'Today Streak Claimed (+50 XP)' : 'Check-In Today (+50 XP)'}</span>
              </button>
            </div>

            {/* Streak Days Row */}
            <div className="grid grid-cols-7 gap-2 sm:gap-4 pt-2">
              {streakDays.map((sd, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl text-center border flex flex-col items-center justify-center transition-all ${
                    sd.completed
                      ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200'
                      : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase">{sd.day}</span>
                  <div className="my-1.5">
                    {sd.completed ? (
                      <Flame className="w-6 h-6 text-amber-500 fill-amber-500 animate-bounce" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700" />
                    )}
                  </div>
                  <span className="text-[10px] font-medium">{sd.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Badges & Leaderboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>Badges Unlocked ({user.badges.length} / {INITIAL_BADGES.length})</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {INITIAL_BADGES.map((b) => {
                  const isUnlocked = user.badges.includes(b.id);
                  return (
                    <div
                      key={b.id}
                      className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                        isUnlocked
                          ? 'bg-white dark:bg-slate-800 border-amber-300 dark:border-amber-700/60 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="text-3xl p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 shrink-0">
                        {b.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-xs text-slate-800 dark:text-slate-100">
                            {b.title}
                          </h3>
                          {isUnlocked && <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {b.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Global Leaderboard */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
              <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-indigo-500" />
                <span>EduAI Student Leaderboard</span>
              </h2>

              <div className="space-y-3">
                {leaderboard.map((item) => (
                  <div
                    key={item.rank}
                    className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                      item.rank === 2
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 font-bold'
                        : 'bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-black text-slate-400 w-4">#{item.rank}</span>
                      <img src={item.avatar} alt={item.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-100">{item.name}</div>
                        <div className="text-[10px] text-indigo-600 dark:text-indigo-400">{item.badge}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-extrabold text-amber-500">{item.xp} XP</div>
                      <div className="text-[10px] text-slate-400">🔥 {item.streak} d</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Completed Lessons */}
      {activeSubTab === 'lessons' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <BookCheck className="w-5 h-5 text-emerald-600" />
                <span>Syllabus Completed Lessons Breakdown</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Detailed record of video classes watched, PDF notes reviewed, and chapter quizzes passed for {user.educationLevel}.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full">
              45 / 52 Lessons Completed (86%)
            </span>
          </div>

          <div className="space-y-4">
            {[
              { subject: 'Mathematics & Calculus', total: 15, completed: 13, percent: 86, icon: '🧮' },
              { subject: 'Physical Sciences & Physics', total: 12, completed: 10, percent: 83, icon: '🔬' },
              { subject: 'English Grammar & Literature', total: 10, completed: 10, percent: 100, icon: '📖' },
              { subject: 'Computer Science & Python', total: 15, completed: 12, percent: 80, icon: '💻' },
            ].map((sub, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-100">
                  <span className="flex items-center gap-2">
                    <span className="text-base">{sub.icon}</span>
                    <span>{sub.subject}</span>
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400">
                    {sub.completed} of {sub.total} lessons ({sub.percent}%)
                  </span>
                </div>

                <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${sub.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Performance Graphs */}
      {activeSubTab === 'graphs' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Graph 1: Weekly Study Minutes */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span>Weekly Study Minutes</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">Total: 420 mins studied this week</p>
                </div>
                <span className="text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 px-2.5 py-1 rounded-full">
                  +18% vs Last Week
                </span>
              </div>

              {/* Bar Chart SVG */}
              <div className="h-44 flex items-end justify-between gap-3 pt-6 border-b border-slate-100 dark:border-slate-700/60 pb-2">
                {[
                  { day: 'M', mins: 45, h: '45%' },
                  { day: 'T', mins: 60, h: '60%' },
                  { day: 'W', mins: 75, h: '75%' },
                  { day: 'T', mins: 90, h: '90%' },
                  { day: 'F', mins: 50, h: '50%' },
                  { day: 'S', mins: 40, h: '40%' },
                  { day: 'S', mins: 60, h: '60%' },
                ].map((bar, bI) => (
                  <div key={bI} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <span className="text-[9px] font-bold text-slate-400">{bar.mins}m</span>
                    <div
                      className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-xl transition-all duration-500 hover:brightness-110"
                      style={{ height: bar.h }}
                    />
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 mt-1">{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Graph 2: Quiz Score Trajectory */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>Quiz Accuracy Trend</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">Average accuracy: 88% over 10 quizzes</p>
                </div>
                <span className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 px-2.5 py-1 rounded-full">
                  Upward Trend 🚀
                </span>
              </div>

              {/* Line Graph representation */}
              <div className="h-44 flex flex-col justify-between pt-4">
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="w-6">100%</span>
                  <div className="h-px bg-slate-100 dark:bg-slate-700/60 flex-1" />
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="w-6">80%</span>
                  <div className="h-px bg-slate-100 dark:bg-slate-700/60 flex-1" />
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="w-6">60%</span>
                  <div className="h-px bg-slate-100 dark:bg-slate-700/60 flex-1" />
                </div>

                {/* Score Dots */}
                <div className="flex justify-between items-center px-4 pt-2">
                  {[72, 80, 85, 90, 94].map((sc, sI) => (
                    <div key={sI} className="flex flex-col items-center">
                      <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">{sc}%</span>
                      <div className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950 my-1" />
                      <span className="text-[9px] text-slate-400">Quiz {sI + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 4: Generated Certificates */}
      {activeSubTab === 'certificates' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <span>My Verified EduAI Certificates ({user.certificates.length})</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Official certificates issued upon completing course modules and achieving over 80% on syllabus exams.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {user.certificates.map((cert) => (
              <div
                key={cert.id}
                className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white border border-indigo-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold border border-amber-400/30 mb-2">
                    <Sparkles className="w-3 h-3" />
                    <span>EduAI Official Certificate of Excellence</span>
                  </div>
                  <h3 className="text-lg font-black">{cert.title}</h3>
                  <p className="text-xs text-indigo-200 mt-1">
                    Issued to <strong className="text-white">{user.name}</strong> for scoring {cert.score}% in {cert.level} Board Assessment on {cert.issueDate}.
                  </p>
                </div>

                <button
                  onClick={() => alert(`Downloading verified certificate for ${cert.title}...`)}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 shrink-0 transition-transform active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Certificate</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

