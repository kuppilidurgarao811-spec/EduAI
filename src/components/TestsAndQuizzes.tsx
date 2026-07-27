import React, { useState, useEffect } from 'react';
import {
  FileQuestion,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Award,
  Layers,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Download,
  BookOpen,
  Trophy,
  BarChart3,
  Flame,
  Zap,
  TrendingUp,
  Target,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Test, QuizQuestion } from '../types';
import { INITIAL_FLASHCARDS } from '../data/mockData';

export const TestsAndQuizzes: React.FC = () => {
  const { tests, addXp, user, setActiveTab, addChatMessage } = useAuth();

  const [activeTabSub, setActiveTabSub] = useState<'daily' | 'mock' | 'leaderboard' | 'analysis' | 'flashcards' | 'papers'>('daily');
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);

  // Test Taking State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const [testScore, setTestScore] = useState(0);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(600);
  const [lastTestAnalysis, setLastTestAnalysis] = useState<{
    testTitle: string;
    total: number;
    score: number;
    timeSpentMin: number;
    accuracyPercent: number;
    subject: string;
    weakTopics: string[];
    strongTopics: string[];
  } | null>({
    testTitle: 'APPSC Group 2 & State Board Mock Test',
    total: 10,
    score: 8,
    timeSpentMin: 12,
    accuracyPercent: 80,
    subject: 'General Studies & Science',
    weakTopics: ['Electromagnetism formulas', 'State Budget 2025 numericals'],
    strongTopics: ['Algebraic identities', 'Indian Polity basics'],
  });

  // Daily Quiz State
  const [dailyQuizAnswers, setDailyQuizAnswers] = useState<number[]>([-1, -1, -1]);
  const [dailySubmitted, setDailySubmitted] = useState(false);
  const [dailyScore, setDailyScore] = useState(0);

  // Flashcards state
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    let timer: any;
    if (selectedTest && !isTestSubmitted && timeLeftSeconds > 0) {
      timer = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            submitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [selectedTest, isTestSubmitted, timeLeftSeconds]);

  const startTest = (test: Test) => {
    setSelectedTest(test);
    setCurrentQIndex(0);
    setUserAnswers(new Array(test.questions.length).fill(-1));
    setIsTestSubmitted(false);
    setTimeLeftSeconds(test.durationMinutes * 60);
  };

  const selectOption = (optIndex: number) => {
    if (isTestSubmitted) return;
    const updated = [...userAnswers];
    updated[currentQIndex] = optIndex;
    setUserAnswers(updated);
  };

  const submitTest = () => {
    if (!selectedTest) return;
    let score = 0;
    selectedTest.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        score += 1;
      }
    });
    setTestScore(score);
    setIsTestSubmitted(true);
    addXp(score * 20 + 50);

    const accuracy = Math.round((score / selectedTest.questions.length) * 100);
    setLastTestAnalysis({
      testTitle: selectedTest.title,
      total: selectedTest.questions.length,
      score,
      timeSpentMin: Math.max(1, Math.round((selectedTest.durationMinutes * 60 - timeLeftSeconds) / 60)),
      accuracyPercent: accuracy,
      subject: selectedTest.subject,
      weakTopics: accuracy < 70 ? ['Formula Applications', 'Time Management'] : ['Complex word problems'],
      strongTopics: ['Fundamental definitions', 'Core concepts'],
    });
  };

  const submitDailyQuiz = () => {
    const dailyQuestions = [
      { correct: 1 },
      { correct: 0 },
      { correct: 2 },
    ];
    let score = 0;
    dailyQuestions.forEach((q, idx) => {
      if (dailyQuizAnswers[idx] === q.correct) score++;
    });
    setDailyScore(score);
    setDailySubmitted(true);
    addXp(score * 30 + 30);
  };

  const currentFlashcard = INITIAL_FLASHCARDS[flashcardIndex];

  // Mock Leaderboard Data
  const LEADERBOARD_USERS = [
    { rank: 1, name: 'Sravani K.', xp: 3450, testsTaken: 28, accuracy: '94%', avatar: '👑' },
    { rank: 2, name: 'Rahul Varma', xp: 3120, testsTaken: 25, accuracy: '91%', avatar: '⭐' },
    { rank: 3, name: 'Ananya Reddy', xp: 2980, testsTaken: 22, accuracy: '89%', avatar: '🏅' },
    { rank: 4, name: user ? user.name : 'You (Current Student)', xp: user ? user.xp : 2150, testsTaken: 18, accuracy: '85%', avatar: '🚀', isCurrent: true },
    { rank: 5, name: 'Karthik Rao', xp: 1950, testsTaken: 15, accuracy: '82%', avatar: '📚' },
    { rank: 6, name: 'Priya Sharma', xp: 1820, testsTaken: 14, accuracy: '80%', avatar: '💡' },
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-in fade-in duration-200">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Interactive Quiz & Assessment Portal</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FileQuestion className="w-6 h-6 text-indigo-600" />
            <span>Daily Quiz, Mock Exams & Score Analysis</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Test your speed with interactive timers, compete on the student leaderboard, and track weak areas.
          </p>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-700/60 text-xs font-bold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTabSub('daily')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTabSub === 'daily'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Daily Quiz</span>
          </button>

          <button
            onClick={() => {
              setActiveTabSub('mock');
              setSelectedTest(null);
            }}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTabSub === 'mock'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Mock Tests</span>
          </button>

          <button
            onClick={() => setActiveTabSub('leaderboard')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTabSub === 'leaderboard'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Leaderboard</span>
          </button>

          <button
            onClick={() => setActiveTabSub('analysis')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTabSub === 'analysis'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Score Analysis</span>
          </button>

          <button
            onClick={() => setActiveTabSub('flashcards')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 ${
              activeTabSub === 'flashcards'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Flashcards</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: Daily Quiz */}
      {activeTabSub === 'daily' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
                <Flame className="w-4 h-4 text-amber-200 fill-amber-200" />
                <span>Today's Daily Challenge Quiz</span>
              </div>
              <h2 className="text-xl font-extrabold">3 Quick Questions • Earn 120 XP</h2>
              <p className="text-xs text-amber-100 max-w-xl">
                Maintain your study streak! Answer daily questions on General Knowledge, Science & Aptitude to top the student rankings.
              </p>
            </div>
            <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0">
              <div className="text-[10px] font-bold text-amber-200 uppercase">Streak Bonus</div>
              <div className="text-xl font-black">🔥 5 Day Streak</div>
            </div>
          </div>

          {!dailySubmitted ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-6">
              {[
                {
                  id: 0,
                  q: 'Q1. What is the unit of electrical resistance in Physics?',
                  opts: ['Ampere', 'Ohm', 'Volt', 'Joule'],
                },
                {
                  id: 1,
                  q: 'Q2. Which river is known as the "Sorrow of Bengal"?',
                  opts: ['Damodar River', 'Ganges', 'Godavari', 'Krishna'],
                },
                {
                  id: 2,
                  q: 'Q3. What will be the time complexity of searching an element in a balanced Binary Search Tree (BST)?',
                  opts: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
                },
              ].map((qItem) => (
                <div key={qItem.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 space-y-3">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">{qItem.q}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {qItem.opts.map((opt, oIdx) => {
                      const isSelected = dailyQuizAnswers[qItem.id] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => {
                            const updated = [...dailyQuizAnswers];
                            updated[qItem.id] = oIdx;
                            setDailyQuizAnswers(updated);
                          }}
                          className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <button
                onClick={submitDailyQuiz}
                disabled={dailyQuizAnswers.includes(-1)}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md disabled:opacity-50 transition-all"
              >
                Submit Daily Quiz Answers
              </button>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-4 shadow-md">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <Trophy className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
                Daily Quiz Completed!
              </h2>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                You scored {dailyScore} out of 3 (+{dailyScore * 30 + 30} XP Earned)
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setDailySubmitted(false);
                    setDailyQuizAnswers([-1, -1, -1]);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold"
                >
                  Retry Quiz
                </button>
                <button
                  onClick={() => setActiveTabSub('leaderboard')}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm"
                >
                  View Leaderboard Rank
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 2: Mock Tests */}
      {activeTabSub === 'mock' && (
        <>
          {!selectedTest ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tests.map((test) => (
                <div
                  key={test.id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-400 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      <span>{test.subject}</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        {test.durationMinutes} Mins
                      </span>
                    </div>
                    <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 mt-1">
                      {test.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Level: {test.level} • {test.totalQuestions} Questions • Live Interactive Timer
                    </p>
                  </div>

                  <button
                    onClick={() => startTest(test)}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
                  >
                    <span>Start Mock Exam</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            /* Active Test Taker View */
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-lg space-y-6">
              
              {/* Test Status Bar with Timer */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4">
                <div>
                  <div className="text-xs font-bold text-indigo-600">{selectedTest.subject}</div>
                  <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                    {selectedTest.title}
                  </h2>
                </div>

                {!isTestSubmitted ? (
                  <div className="px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-2 border border-amber-200 dark:border-amber-800">
                    <Clock className="w-4 h-4 animate-pulse text-amber-500" />
                    <span>
                      Timer Left: {Math.floor(timeLeftSeconds / 60)}:
                      {String(timeLeftSeconds % 60).padStart(2, '0')}
                    </span>
                  </div>
                ) : (
                  <div className="px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 border border-emerald-200 dark:border-emerald-800">
                    <Award className="w-4 h-4 text-emerald-500" />
                    <span>
                      Score: {testScore} / {selectedTest.questions.length} (
                      {Math.round((testScore / selectedTest.questions.length) * 100)}%)
                    </span>
                  </div>
                )}
              </div>

              {/* Question Stepper */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {selectedTest.questions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentQIndex(idx)}
                    className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 transition-all ${
                      currentQIndex === idx
                        ? 'bg-indigo-600 text-white shadow-md'
                        : userAnswers[idx] !== -1
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              {/* Question Body */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700 space-y-4">
                <div className="text-xs font-bold text-slate-400">
                  Question {currentQIndex + 1} of {selectedTest.questions.length}
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-slate-100">
                  {selectedTest.questions[currentQIndex].question}
                </h3>

                {/* Options List */}
                <div className="space-y-2 pt-2">
                  {selectedTest.questions[currentQIndex].options.map((opt, optIdx) => {
                    const isSelected = userAnswers[currentQIndex] === optIdx;
                    const isCorrect = selectedTest.questions[currentQIndex].correctIndex === optIdx;

                    let optionBg = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700';
                    if (isTestSubmitted) {
                      if (isCorrect) optionBg = 'bg-emerald-100 dark:bg-emerald-950 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                      else if (isSelected) optionBg = 'bg-rose-100 dark:bg-rose-950 border-rose-500 text-rose-900 dark:text-rose-200 font-bold';
                    } else if (isSelected) {
                      optionBg = 'bg-indigo-50 dark:bg-indigo-950 border-indigo-500 text-indigo-900 dark:text-indigo-200 font-bold';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => selectOption(optIdx)}
                        className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${optionBg}`}
                      >
                        <span>{opt}</span>
                        {isTestSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        {isTestSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Box on Submit */}
                {isTestSubmitted && (
                  <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs space-y-2">
                    <div className="font-bold text-indigo-800 dark:text-indigo-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span>Step-by-Step AI Explanation:</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {selectedTest.questions[currentQIndex].explanation}
                    </p>
                  </div>
                )}
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <button
                  disabled={currentQIndex === 0}
                  onClick={() => setCurrentQIndex((prev) => prev - 1)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-xs font-bold disabled:opacity-40"
                >
                  Previous
                </button>

                {!isTestSubmitted ? (
                  currentQIndex === selectedTest.questions.length - 1 ? (
                    <button
                      onClick={submitTest}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                    >
                      Submit Exam & View Score Analysis
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentQIndex((prev) => prev + 1)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                    >
                      Next
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => setActiveTabSub('analysis')}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>View Detailed Score Analysis</span>
                  </button>
                )}
              </div>

            </div>
          )}
        </>
      )}

      {/* Sub-Tab 3: Leaderboard */}
      {activeTabSub === 'leaderboard' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>Student Gamification Leaderboard</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Top performing students based on quiz accuracy and total XP accumulated
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-full">
              Weekly Ranking
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {LEADERBOARD_USERS.map((usr) => (
              <div
                key={usr.rank}
                className={`py-3.5 px-4 rounded-2xl flex items-center justify-between transition-all ${
                  usr.isCurrent
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 font-bold'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full font-extrabold text-xs flex items-center justify-center ${
                    usr.rank === 1 ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300' :
                    usr.rank === 2 ? 'bg-slate-300 text-slate-800' :
                    usr.rank === 3 ? 'bg-amber-700 text-amber-100' : 'bg-slate-100 dark:bg-slate-700 text-slate-600'
                  }`}>
                    #{usr.rank}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <span>{usr.avatar}</span>
                      <span>{usr.name}</span>
                      {usr.isCurrent && (
                        <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold">You</span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {usr.testsTaken} Tests • {usr.accuracy} Accuracy
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 justify-end">
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{usr.xp} XP</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Score Analysis */}
      {activeTabSub === 'analysis' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <span>Comprehensive Score & Performance Analysis</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                AI Diagnostic breakdown of your test accuracy, time efficiency, and weak areas.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full">
              Live AI Report
            </span>
          </div>

          {lastTestAnalysis ? (
            <div className="space-y-6">
              {/* Summary Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Test Score</div>
                  <div className="text-xl font-black text-indigo-700 dark:text-indigo-300 mt-1">
                    {lastTestAnalysis.score} / {lastTestAnalysis.total}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Accuracy Rate</div>
                  <div className="text-xl font-black text-emerald-700 dark:text-emerald-300 mt-1">
                    {lastTestAnalysis.accuracyPercent}%
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Time Spent</div>
                  <div className="text-xl font-black text-amber-700 dark:text-amber-300 mt-1">
                    {lastTestAnalysis.timeSpentMin} Mins
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Subject Area</div>
                  <div className="text-xs font-extrabold text-purple-700 dark:text-purple-300 mt-2 truncate">
                    {lastTestAnalysis.subject}
                  </div>
                </div>
              </div>

              {/* Strong vs Weak Diagnostics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    <Target className="w-4 h-4 text-emerald-600" />
                    <span>Strong Mastery Topics</span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    {lastTestAnalysis.strongTopics.map((st, sI) => (
                      <li key={sI}>{st}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-300">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Weak Areas Needing Revision</span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    {lastTestAnalysis.weakTopics.map((wt, wI) => (
                      <li key={wI}>{wt}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-600 text-white flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xs">Want step-by-step revision on weak topics?</h3>
                  <p className="text-[11px] text-indigo-100 mt-0.5">
                    Ask AI Tutor to generate practice problems specifically for {lastTestAnalysis.weakTopics.join(', ')}
                  </p>
                </div>
                <button
                  onClick={() => {
                    addChatMessage({
                      id: `a-${Date.now()}`,
                      role: 'user',
                      text: `Please explain and give practice questions for my weak topics: ${lastTestAnalysis.weakTopics.join(', ')}.`,
                      timestamp: 'Just now',
                    });
                    setActiveTab('ai-tutor');
                  }}
                  className="px-4 py-2 rounded-xl bg-white text-indigo-700 text-xs font-bold hover:bg-slate-100 shrink-0"
                >
                  Ask AI Tutor
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">Take a mock test or daily quiz to see your performance score analysis here.</p>
          )}
        </div>
      )}

      {/* Sub-Tab 5: Flashcards */}
      {activeTabSub === 'flashcards' && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-extrabold uppercase text-indigo-600 dark:text-indigo-400">
              {currentFlashcard.subject} Flashcard
            </span>
            <p className="text-xs text-slate-500">Tap card to flip front / back</p>
          </div>

          {/* Flip Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="h-64 rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 text-white p-8 shadow-xl cursor-pointer flex flex-col items-center justify-center text-center select-none transition-all hover:scale-102"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 mb-4">
              {isFlipped ? 'Answer / Explanation' : 'Concept / Question'}
            </span>

            <h3 className="text-lg sm:text-xl font-black">
              {isFlipped ? currentFlashcard.back : currentFlashcard.front}
            </h3>

            {isFlipped && currentFlashcard.formula && (
              <div className="mt-4 px-4 py-2 rounded-xl bg-white/10 font-mono text-sm font-bold border border-white/20">
                Formula: {currentFlashcard.formula}
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setIsFlipped(false);
                setFlashcardIndex((prev) => (prev > 0 ? prev - 1 : INITIAL_FLASHCARDS.length - 1));
              }}
              className="p-3 rounded-full bg-white dark:bg-slate-800 border shadow-sm text-slate-700 dark:text-slate-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              {flashcardIndex + 1} of {INITIAL_FLASHCARDS.length}
            </span>

            <button
              onClick={() => {
                setIsFlipped(false);
                setFlashcardIndex((prev) => (prev < INITIAL_FLASHCARDS.length - 1 ? prev + 1 : 0));
              }}
              className="p-3 rounded-full bg-white dark:bg-slate-800 border shadow-sm text-slate-700 dark:text-slate-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Sub-Tab 6: Previous Question Papers */}
      {activeTabSub === 'papers' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Class 10 State Board Mathematics Paper 2025', size: '2.4 MB', downloads: '14,200' },
              { title: 'APPSC Group 2 General Studies Paper 2025', size: '4.1 MB', downloads: '28,500' },
              { title: 'B.Tech CS Data Structures & Algorithms Paper', size: '1.8 MB', downloads: '9,800' },
              { title: 'Intermediate Physics 2nd Year IPE Paper', size: '3.0 MB', downloads: '18,300' },
            ].map((p, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-xs text-slate-800 dark:text-slate-100">{p.title}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    PDF • {p.size} • {p.downloads} downloads
                  </div>
                </div>
                <button
                  onClick={() => alert(`Downloading ${p.title}...`)}
                  className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

