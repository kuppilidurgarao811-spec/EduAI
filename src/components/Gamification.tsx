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
  BookCheck,
  Zap,
  Shield,
  Gift,
  Crown,
  Printer,
  X,
  Lock,
  ChevronRight,
  TrendingUp,
  Clock,
  Check,
  RotateCcw,
  Medal,
  Coins,
  Sparkle,
  Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { INITIAL_BADGES } from '../data/mockData';
import { Certificate } from '../types';

export const Gamification: React.FC = () => {
  const { user, addXp } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<
    'overview' | 'streaks' | 'badges' | 'leaderboard' | 'rewards' | 'certificates'
  >('overview');

  // Streak state
  const [streakDays, setStreakDays] = useState([
    { day: 'Mon', completed: true, date: 'Aug 04' },
    { day: 'Tue', completed: true, date: 'Aug 05' },
    { day: 'Wed', completed: true, date: 'Aug 06' },
    { day: 'Thu', completed: true, date: 'Aug 07' },
    { day: 'Fri', completed: true, date: 'Aug 08' },
    { day: 'Sat', completed: true, date: 'Aug 09' },
    { day: 'Sun', completed: false, date: 'Today' },
  ]);
  const [streakClaimedToday, setStreakClaimedToday] = useState(false);
  const [streakFreezeCount, setStreakFreezeCount] = useState(1);

  // Leaderboard state
  const [leaderboardTimeframe, setLeaderboardTimeframe] = useState<'weekly' | 'monthly' | 'alltime'>('weekly');
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  // Rewards Store State
  const [redeemedPerks, setRedeemedPerks] = useState<string[]>([]);
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);

  // Certificate Modal State
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  // Level Calculation (500 XP per level)
  const currentLevel = Math.floor(user.xp / 500) + 1;
  const currentLevelXp = user.xp % 500;
  const xpNeededForNext = 500 - currentLevelXp;
  const levelProgressPercent = Math.min(100, Math.round((currentLevelXp / 500) * 100));

  // Handle Daily Check-in
  const handleClaimStreak = () => {
    if (streakClaimedToday) return;
    setStreakDays((prev) =>
      prev.map((d) => (d.day === 'Sun' ? { ...d, completed: true } : d))
    );
    setStreakClaimedToday(true);
    addXp(50);
    setRewardMessage('🎉 Streak claimed! You earned +50 XP and maintained your study fire!');
    setTimeout(() => setRewardMessage(null), 4000);
  };

  // Mock Leaderboards based on timeframe
  const leaderboardData = {
    weekly: [
      { rank: 1, name: 'Ananya Varma', level: 'Intermediate', xp: 2850, streak: 14, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', badge: '🥇 Weekly Topper', crown: 'gold' },
      { rank: 2, name: `${user.name} (You)`, level: user.educationLevel, xp: user.xp, streak: user.streak, avatar: user.avatar, badge: '🥈 Silver Scholar', crown: 'silver', isUser: true },
      { rank: 3, name: 'Karthik Raja', level: 'Degree', xp: 2180, streak: 9, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', badge: '🥉 Bronze Master', crown: 'bronze' },
      { rank: 4, name: 'Priya Reddy', level: 'Class 6–10', xp: 1950, streak: 7, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', badge: 'Star Student' },
      { rank: 5, name: 'Srinivas Rao', level: 'Competitive Exams', xp: 1720, streak: 5, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', badge: 'Quiz Genius' },
      { rank: 6, name: 'Bhavana K.', level: 'Degree', xp: 1540, streak: 6, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', badge: 'Python Pro' },
    ],
    monthly: [
      { rank: 1, name: 'Ananya Varma', level: 'Intermediate', xp: 8950, streak: 28, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', badge: '👑 Monthly Grandmaster', crown: 'gold' },
      { rank: 2, name: 'Srinivas Rao', level: 'Competitive Exams', xp: 7420, streak: 22, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', badge: '🥈 Top Contender', crown: 'silver' },
      { rank: 3, name: `${user.name} (You)`, level: user.educationLevel, xp: user.xp + 1200, streak: user.streak, avatar: user.avatar, badge: '🥉 Rising Legend', crown: 'bronze', isUser: true },
      { rank: 4, name: 'Karthik Raja', level: 'Degree', xp: 5800, streak: 18, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', badge: 'Code Ninja' },
    ],
    alltime: [
      { rank: 1, name: 'Dr. Ramesh Kumar', level: 'Faculty Alumni', xp: 24800, streak: 120, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', badge: '🏆 Legend of EduAI', crown: 'gold' },
      { rank: 2, name: 'Ananya Varma', level: 'Intermediate', xp: 18500, streak: 65, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', badge: '🥈 All-Time Topper', crown: 'silver' },
      { rank: 3, name: 'Karthik Raja', level: 'Degree', xp: 14200, streak: 42, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', badge: '🥉 Senior Scholar', crown: 'bronze' },
      { rank: 12, name: `${user.name} (You)`, level: user.educationLevel, xp: user.xp, streak: user.streak, avatar: user.avatar, badge: 'Active Scholar', isUser: true },
    ]
  };

  // Rewards items available for purchase with XP
  const rewardStore = [
    {
      id: 'reward-freeze',
      title: 'Streak Freeze Shield',
      cost: 200,
      icon: '🛡️',
      description: 'Protects your streak for 1 day if you miss logging in.',
      type: 'consumable',
    },
    {
      id: 'reward-frame',
      title: 'Golden Scholar Avatar Ring',
      cost: 400,
      icon: '👑',
      description: 'Unlock an exclusive glowing gold border around your profile picture.',
      type: 'cosmetic',
    },
    {
      id: 'reward-speed',
      title: 'AI Priority Speed Booster',
      cost: 600,
      icon: '⚡',
      description: 'Get instant, zero-latency responses for all AI Voice & Tutor chats for 7 days.',
      type: 'powerup',
    },
    {
      id: 'reward-hardcopy',
      title: 'Printed Hardcopy Certificate Pass',
      cost: 800,
      icon: '📜',
      description: 'Get your verified EduAI course completion certificate mailed to your physical address.',
      type: 'physical',
    },
    {
      id: 'reward-masterclass',
      title: '1-on-1 AI Masterclass Ticket',
      cost: 1000,
      icon: '🎟️',
      description: 'Unlock 60 minutes of uninterrupted, deep-dive personalized voice tutoring.',
      type: 'pass',
    },
  ];

  const handleRedeemReward = (rewardId: string, cost: number, title: string) => {
    if (user.xp < cost) {
      setRewardMessage(`❌ You need ${cost - user.xp} more XP to redeem "${title}". Complete daily quizzes!`);
      setTimeout(() => setRewardMessage(null), 4000);
      return;
    }
    if (redeemedPerks.includes(rewardId)) {
      setRewardMessage(`ℹ️ You have already unlocked "${title}"!`);
      setTimeout(() => setRewardMessage(null), 3000);
      return;
    }

    addXp(-cost);
    setRedeemedPerks((prev) => [...prev, rewardId]);
    if (rewardId === 'reward-freeze') {
      setStreakFreezeCount((prev) => prev + 1);
    }
    setRewardMessage(`🎉 Successfully redeemed "${title}" for ${cost} XP!`);
    setTimeout(() => setRewardMessage(null), 4000);
  };

  // Filtered badges
  const filteredBadges = INITIAL_BADGES.filter((b) => {
    const isUnlocked = user.badges.includes(b.id);
    if (badgeFilter === 'unlocked') return isUnlocked;
    if (badgeFilter === 'locked') return !isUnlocked;
    return true;
  });

  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-in fade-in duration-200 select-none">
      
      {/* Top Banner & Level Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 text-white shadow-xl shadow-orange-500/20 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-amber-200" />
            <span>EduAI Gamification & Progress Hub</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black">Level {currentLevel}: Student Scholar</h1>
          <p className="text-xs text-amber-100 max-w-xl">
            Complete daily streaks, solve AI quizzes, earn XP, unlock exclusive badges, climb the student leaderboard, and redeem rewards!
          </p>
        </div>

        {/* XP & Streak Floating Card */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shrink-0 flex flex-col sm:flex-row items-center gap-6 z-10">
          <div className="space-y-1.5 w-full sm:w-44">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-amber-100 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" /> Level {currentLevel}
              </span>
              <span className="text-white">{currentLevelXp} / 500 XP</span>
            </div>
            <div className="w-full h-3 rounded-full bg-black/20 overflow-hidden p-0.5 border border-white/20">
              <div
                className="h-full bg-gradient-to-r from-amber-300 to-yellow-400 rounded-full transition-all duration-500"
                style={{ width: `${levelProgressPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-amber-200 font-semibold text-right">
              {xpNeededForNext} XP to Level {currentLevel + 1}
            </p>
          </div>

          <div className="h-10 w-px bg-white/20 hidden sm:block" />

          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-[10px] text-amber-100 font-extrabold uppercase">Total XP</div>
              <div className="text-2xl font-black text-white">{user.xp}</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-amber-100 font-extrabold uppercase">Daily Streak</div>
              <div className="text-2xl font-black text-amber-300 flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" /> {user.streak}d
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Toast Alert */}
      {rewardMessage && (
        <div className="p-4 rounded-2xl bg-indigo-900 text-white border border-indigo-700 shadow-lg flex items-center justify-between text-xs font-bold animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{rewardMessage}</span>
          </div>
          <button onClick={() => setRewardMessage(null)} className="text-indigo-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shrink-0 transition-all ${
            activeSubTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Gamification Overview</span>
        </button>

        <button
          onClick={() => setActiveSubTab('streaks')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shrink-0 transition-all ${
            activeSubTab === 'streaks'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>Daily Streaks ({user.streak}d)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('badges')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shrink-0 transition-all ${
            activeSubTab === 'badges'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>Badges ({user.badges.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('leaderboard')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shrink-0 transition-all ${
            activeSubTab === 'leaderboard'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
          }`}
        >
          <Trophy className="w-4 h-4 text-indigo-400" />
          <span>Leaderboard</span>
        </button>

        <button
          onClick={() => setActiveSubTab('rewards')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shrink-0 transition-all ${
            activeSubTab === 'rewards'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
          }`}
        >
          <Gift className="w-4 h-4 text-emerald-400" />
          <span>Rewards Store</span>
        </button>

        <button
          onClick={() => setActiveSubTab('certificates')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shrink-0 transition-all ${
            activeSubTab === 'certificates'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-amber-400" />
          <span>Certificates ({user.certificates.length})</span>
        </button>
      </div>

      {/* Sub-Tab 1: Overview Dashboard */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Daily Quick Missions to Earn XP */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700/60 pb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span>Today's XP Quests & Missions</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Complete daily activities to gain extra XP, increase level rank, and unlock rewards store passes.
                </p>
              </div>

              <button
                onClick={() => {
                  addXp(75);
                  setRewardMessage('🎉 Bonus Claimed! +75 XP added to your total!');
                  setTimeout(() => setRewardMessage(null), 3000);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold flex items-center gap-2 shadow-md shrink-0 transition-transform active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Claim Daily Bonus (+75 XP)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Complete 1 Quiz Practice', xp: '+100 XP', icon: BookCheck, progress: '1/1 Done', done: true },
                { title: 'Ask AI Tutor 3 Questions', xp: '+60 XP', icon: Zap, progress: '3/3 Done', done: true },
                { title: 'Practice Voice Classroom', xp: '+80 XP', icon: Clock, progress: '10 / 15 Mins', done: false },
              ].map((m, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                    m.done
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60'
                      : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl text-lg ${m.done ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-600'}`}>
                      <m.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-xs text-slate-800 dark:text-slate-100">{m.title}</h3>
                      <p className="text-[11px] text-slate-500">{m.progress}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full ${m.done ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-800'}`}>
                    {m.xp}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Grid of Badges + Leaderboard Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Badges Preview */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
                <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>Unlocked Badges ({user.badges.length} / {INITIAL_BADGES.length})</span>
                </h2>
                <button
                  onClick={() => setActiveSubTab('badges')}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>View All Badges</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {INITIAL_BADGES.slice(0, 4).map((b) => {
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
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-extrabold text-xs text-slate-800 dark:text-slate-100">{b.title}</h3>
                          {isUnlocked && <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{b.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Leaderboard Snippet */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
                <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-indigo-500" />
                  <span>Top Scholars</span>
                </h2>
                <button
                  onClick={() => setActiveSubTab('leaderboard')}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>Full Board</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {leaderboardData.weekly.slice(0, 4).map((item) => (
                  <div
                    key={item.rank}
                    className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                      item.isUser
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
                      <div className="text-[10px] text-slate-400">🔥 {item.streak}d</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Sub-Tab 2: Daily Streaks Tracker */}
      {activeSubTab === 'streaks' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700/60 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span>Weekly Learning Streak Tracker</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Maintain your continuous study streak by checking in or solving 1 practice lesson daily.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-indigo-500" />
                <span>{streakFreezeCount} Streak Freeze Pass</span>
              </div>

              <button
                onClick={handleClaimStreak}
                disabled={streakClaimedToday}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold flex items-center gap-2 shadow-md disabled:opacity-60 shrink-0 transition-transform active:scale-95"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>{streakClaimedToday ? 'Today Claimed (+50 XP)' : 'Check-In Today (+50 XP)'}</span>
              </button>
            </div>
          </div>

          {/* 7 Days Row */}
          <div className="grid grid-cols-2 sm:grid-cols-7 gap-3">
            {streakDays.map((sd, i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl text-center border flex flex-col items-center justify-center transition-all ${
                  sd.completed
                    ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400'
                }`}
              >
                <span className="text-[10px] font-extrabold uppercase tracking-wider">{sd.day}</span>
                <div className="my-2">
                  {sd.completed ? (
                    <Flame className="w-8 h-8 text-amber-500 fill-amber-500 animate-bounce" />
                  ) : (
                    <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs font-bold">
                      ?
                    </div>
                  )}
                </div>
                <span className="text-[11px] font-bold">{sd.date}</span>
                {sd.completed && <span className="text-[9px] text-amber-600 dark:text-amber-400 font-black mt-1">+50 XP</span>}
              </div>
            ))}
          </div>

          {/* Streak Rewards Milestones */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Upcoming Streak Milestones</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { goal: '7 Days Streak', bonus: '+100 XP + Bronze Flame', achieved: user.streak >= 7 },
                { goal: '14 Days Streak', bonus: '+250 XP + Streak Master Badge', achieved: user.streak >= 14 },
                { goal: '30 Days Streak', bonus: '+500 XP + Gold Crown Avatar', achieved: user.streak >= 30 },
              ].map((m, mI) => (
                <div
                  key={mI}
                  className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-bold ${
                    m.achieved
                      ? 'bg-amber-100/60 dark:bg-amber-950/40 border-amber-300 text-amber-900 dark:text-amber-200'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-extrabold">{m.goal}</div>
                    <div className="text-[10px] text-slate-500">{m.bonus}</div>
                  </div>
                  {m.achieved ? (
                    <CheckCircle2 className="w-5 h-5 text-amber-600" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Badges Showcase */}
      {activeSubTab === 'badges' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700/60 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>Achievement Badges Showcase</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Earn badges by excelling in mock exams, maintaining streaks, solving AI voice questions, and mastering courses.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
              <button
                onClick={() => setBadgeFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  badgeFilter === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                All ({INITIAL_BADGES.length})
              </button>
              <button
                onClick={() => setBadgeFilter('unlocked')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  badgeFilter === 'unlocked' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Unlocked ({user.badges.length})
              </button>
              <button
                onClick={() => setBadgeFilter('locked')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  badgeFilter === 'locked' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Locked ({INITIAL_BADGES.length - user.badges.length})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredBadges.map((badge) => {
              const isUnlocked = user.badges.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-amber-50/60 to-orange-50/40 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-300 dark:border-amber-700/60 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="text-4xl p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm">
                      {badge.icon}
                    </div>
                    {isUnlocked ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-black flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Unlocked
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-black flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{badge.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{badge.description}</p>
                  </div>

                  <div className="text-[10px] font-bold text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex justify-between">
                    <span>Category: {badge.category}</span>
                    {badge.unlockedAt && <span>Date: {badge.unlockedAt}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Full Leaderboard */}
      {activeSubTab === 'leaderboard' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700/60 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-indigo-500" />
                <span>EduAI Student Leaderboard</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Compete with students across AP, Telangana, and All-India levels to climb the rank podium.
              </p>
            </div>

            {/* Timeframe selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
              {(['weekly', 'monthly', 'alltime'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setLeaderboardTimeframe(tf)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                    leaderboardTimeframe === tf
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {leaderboardData[leaderboardTimeframe].slice(0, 3).map((top, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-3xl border text-center flex flex-col items-center justify-between space-y-3 relative overflow-hidden ${
                  top.crown === 'gold'
                    ? 'bg-gradient-to-b from-amber-500/10 to-amber-500/5 border-amber-300 dark:border-amber-700/80 shadow-lg'
                    : top.crown === 'silver'
                    ? 'bg-gradient-to-b from-slate-300/10 to-slate-300/5 border-slate-300 dark:border-slate-700/80 shadow-md'
                    : 'bg-gradient-to-b from-orange-400/10 to-orange-400/5 border-orange-300 dark:border-orange-800/80 shadow-sm'
                }`}
              >
                <div className="text-2xl font-black mb-1">
                  {top.crown === 'gold' && '🥇'}
                  {top.crown === 'silver' && '🥈'}
                  {top.crown === 'bronze' && '🥉'}
                </div>

                <div className="relative">
                  <img src={top.avatar} alt={top.name} className="w-16 h-16 rounded-full object-cover ring-4 ring-white dark:ring-slate-800 shadow-md" />
                  <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-black">
                    #{top.rank}
                  </span>
                </div>

                <div>
                  <h3 className="font-black text-sm text-slate-800 dark:text-slate-100">{top.name}</h3>
                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">{top.badge}</span>
                </div>

                <div className="w-full pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex justify-around text-xs font-bold">
                  <div>
                    <div className="text-[10px] text-slate-400">Total XP</div>
                    <div className="text-amber-500 font-extrabold">{top.xp}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Streak</div>
                    <div className="text-slate-700 dark:text-slate-200">🔥 {top.streak}d</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Full Rankings List */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
              Student Rankings Table
            </h3>
            {leaderboardData[leaderboardTimeframe].map((item) => (
              <div
                key={item.rank}
                className={`p-4 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                  item.isUser
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 font-bold shadow-md'
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="font-black text-slate-400 w-6 text-center">#{item.rank}</span>
                  <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="font-extrabold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                      <span>{item.name}</span>
                      {item.isUser && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[9px] font-black">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">{item.level} • {item.badge}</div>
                  </div>
                </div>

                <div className="text-right flex items-center gap-6">
                  <div>
                    <div className="text-[10px] text-slate-400">Streak</div>
                    <div className="font-bold text-slate-700 dark:text-slate-300">🔥 {item.streak}d</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Score</div>
                    <div className="text-sm font-black text-amber-500">{item.xp} XP</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 5: Rewards Store */}
      {activeSubTab === 'rewards' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700/60 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Gift className="w-5 h-5 text-emerald-500" />
                <span>EduAI Rewards & XP Store</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Redeem your earned XP points for valuable perks, avatar frames, streak freeze passes, and masterclass tickets.
              </p>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs font-black flex items-center gap-2 shrink-0">
              <Coins className="w-4 h-4 text-amber-500" />
              <span>Available XP Balance: {user.xp} XP</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewardStore.map((reward) => {
              const isPurchased = redeemedPerks.includes(reward.id);
              const canAfford = user.xp >= reward.cost;

              return (
                <div
                  key={reward.id}
                  className={`p-6 rounded-3xl border flex flex-col justify-between space-y-4 transition-all ${
                    isPurchased
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="text-4xl p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm">
                        {reward.icon}
                      </div>
                      <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-black flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>{reward.cost} XP</span>
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{reward.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{reward.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRedeemReward(reward.id, reward.cost, reward.title)}
                    disabled={isPurchased}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 ${
                      isPurchased
                        ? 'bg-emerald-600 text-white cursor-default'
                        : canAfford
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {isPurchased ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Unlocked & Active</span>
                      </>
                    ) : (
                      <>
                        <Coins className="w-4 h-4" />
                        <span>Redeem for {reward.cost} XP</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-Tab 6: Verified Certificates */}
      {activeSubTab === 'certificates' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700/60 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <span>My Verified EduAI Achievement Certificates ({user.certificates.length})</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Official verified certificates issued upon passing board level modules and mock exams.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.certificates.map((cert) => (
              <div
                key={cert.id}
                className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white border border-indigo-800/80 shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
                    <Sparkles className="w-3 h-3" />
                    <span>EduAI Official Certificate of Honor</span>
                  </div>
                  <h3 className="text-lg font-black">{cert.title}</h3>
                  <p className="text-xs text-indigo-200">
                    Awarded to <strong className="text-white">{user.name}</strong> ({cert.level}) for outstanding exam performance of {cert.score}%.
                  </p>
                </div>

                <div className="pt-4 border-t border-indigo-800/60 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-indigo-300">Issue Date: {cert.issueDate}</span>
                  <button
                    onClick={() => setSelectedCert(cert)}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition-transform active:scale-95"
                  >
                    <Printer className="w-4 h-4" />
                    <span>View & Print Certificate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Official Certificate Full Screen Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 max-w-2xl w-full p-8 md:p-12 rounded-3xl shadow-2xl relative border-8 border-indigo-900 space-y-6">
            
            {/* Close button */}
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute right-4 top-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Header */}
            <div className="text-center space-y-2 border-b-2 border-indigo-900 pb-6">
              <div className="flex justify-center mb-2">
                <div className="w-16 h-16 rounded-full bg-indigo-900 text-amber-400 flex items-center justify-center text-2xl font-black shadow-lg ring-4 ring-amber-400">
                  <GraduationCap className="w-8 h-8" />
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-widest text-indigo-950 uppercase">
                Certificate of Academic Excellence
              </h1>
              <p className="text-xs font-bold text-indigo-700 tracking-wider uppercase">
                EduAI Smart Learning Platform • Official Board Certification
              </p>
            </div>

            {/* Certificate Body */}
            <div className="text-center space-y-4 py-4">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">This is proudly presented to</p>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-indigo-950 border-b-2 border-dashed border-slate-300 pb-2 inline-block px-8">
                {user.name}
              </h2>

              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed pt-2">
                For successfully mastering the course module <strong className="text-indigo-900 font-bold">{selectedCert.title}</strong> in the <strong className="text-indigo-900 font-bold">{selectedCert.level}</strong> curriculum, securing an official assessment score of <strong className="text-emerald-700 font-black">{selectedCert.score}%</strong>.
              </p>
            </div>

            {/* Signatures & Seal Footer */}
            <div className="pt-6 border-t-2 border-slate-200 flex items-end justify-between text-center text-xs">
              <div>
                <div className="font-serif italic text-base text-slate-800 font-bold">Prof. Srinivasa Rao</div>
                <div className="text-[10px] text-slate-500 font-extrabold uppercase border-t border-slate-400 pt-1 mt-1">
                  Academic Director
                </div>
              </div>

              {/* Gold Seal */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 text-slate-950 flex flex-col items-center justify-center shadow-lg ring-4 ring-amber-200/80 p-1 shrink-0">
                <Medal className="w-6 h-6 text-slate-900" />
                <span className="text-[8px] font-black uppercase text-center leading-tight">OFFICIAL VERIFIED SEAL</span>
              </div>

              <div>
                <div className="font-serif italic text-base text-slate-800 font-bold">{selectedCert.issueDate}</div>
                <div className="text-[10px] text-slate-500 font-extrabold uppercase border-t border-slate-400 pt-1 mt-1">
                  Date of Issue
                </div>
              </div>
            </div>

            {/* Certificate ID & Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-mono text-slate-500">
                VERIFICATION ID: <strong className="text-slate-800">EDUAI-CERT-{selectedCert.id.toUpperCase()}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save PDF</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
