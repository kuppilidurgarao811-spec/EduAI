import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  FileQuestion,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Award,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Download,
  BookOpen,
  Trophy,
  BarChart3,
  Flame,
  Zap,
  Target,
  AlertTriangle,
  RefreshCw,
  Check,
  AlertCircle,
  Play,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  auth,
  db,
  callCloudFunction,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import {
  Test,
  QuizDocument,
  QuizQuestionItem,
  QuizAttemptDocument,
} from '../types';
import { INITIAL_FLASHCARDS } from '../data/mockData';

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const;

export const TestsAndQuizzes: React.FC = () => {
  const { tests, addXp, user, setActiveTab, addChatMessage, addNotification, setShowAuthModal } = useAuth();

  const [activeTabSub, setActiveTabSub] = useState<'live' | 'daily' | 'mock' | 'leaderboard' | 'analysis' | 'flashcards' | 'papers'>('live');
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);

  // Live Published Firestore Quizzes State
  const [publishedQuizzes, setPublishedQuizzes] = useState<QuizDocument[]>([]);
  const [myQuizResults, setMyQuizResults] = useState<QuizAttemptDocument[]>([]);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState<boolean>(false);
  const [quizPortalMessage, setQuizPortalMessage] = useState<{ type: 'info' | 'error' | 'success'; text: string } | null>(null);

  // Active Firestore Quiz Runner State (NO answer keys ever downloaded to client)
  const [activeLiveQuiz, setActiveLiveQuiz] = useState<QuizDocument | null>(null);
  const [activeLiveQuestions, setActiveLiveQuestions] = useState<QuizQuestionItem[]>([]);
  const [liveQIndex, setLiveQIndex] = useState<number>(0);
  const [liveAnswers, setLiveAnswers] = useState<Record<string, number>>({});
  const [liveTimeLeftSec, setLiveTimeLeftSec] = useState<number>(900);
  const [liveTotalDurationSec, setLiveTotalDurationSec] = useState<number>(900);
  const [isSubmittingLiveQuiz, setIsSubmittingLiveQuiz] = useState<boolean>(false);
  const [liveQuizResult, setLiveQuizResult] = useState<QuizAttemptDocument | null>(null);
  const [liveResultSavedToCloud, setLiveResultSavedToCloud] = useState<boolean>(false);

  // Mock Test Taking State
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

  const reportErrorSafely = (err: unknown, op: OperationType, path: string): string => {
    try {
      handleFirestoreError(err, op, path);
    } catch (wrappedErr: unknown) {
      if (wrappedErr instanceof Error) {
        try {
          const parsed = JSON.parse(wrappedErr.message);
          return parsed.error || 'Firestore access error.';
        } catch {
          return wrappedErr.message;
        }
      }
    }
    return err instanceof Error ? err.message : 'Unexpected Firestore error.';
  };

  // Fetch published quizzes & student's own past results
  const fetchPublishedQuizzes = useCallback(async () => {
    if (!auth.currentUser) {
      setPublishedQuizzes([]);
      setMyQuizResults([]);
      return;
    }

    setIsLoadingQuizzes(true);
    setQuizPortalMessage(null);
    try {
      const qQuery = query(
        collection(db, 'quizzes'),
        where('isPublished', '==', true),
        where('isActive', '==', true)
      );
      const qSnap = await getDocs(qQuery);
      const loadedQuizzes: QuizDocument[] = [];
      qSnap.forEach((docItem) => {
        const d = docItem.data();
        const totalMarks = typeof d.totalMarks === 'number' ? d.totalMarks : 0;
        const passMarks = typeof d.passMarks === 'number' ? d.passMarks : 0;
        const durationMinutes =
          typeof d.durationMinutes === 'number'
            ? d.durationMinutes
            : typeof d.timeLimit === 'number'
            ? d.timeLimit
            : 30;
        loadedQuizzes.push({
          id: docItem.id,
          subjectId: d.subjectId || 'ML001',
          chapterId: d.chapterId || 'CH001',
          lessonId: d.lessonId || '',
          lessonTitle: d.lessonTitle || '',
          subjectTitle: d.subjectTitle || '',
          chapterTitle: d.chapterTitle || '',
          title: d.title || 'Untitled Quiz',
          description: d.description || '',
          totalMarks,
          passMarks,
          durationMinutes,
          timeLimit: durationMinutes,
          passingScore:
            typeof d.passingScore === 'number'
              ? d.passingScore
              : totalMarks > 0
              ? Math.round((passMarks / totalMarks) * 100)
              : 0,
          questionsCount: typeof d.questionsCount === 'number' ? d.questionsCount : undefined,
          isPublished: true,
          isActive: true,
          createdAt: d.createdAt,
          updatedAt: d.updatedAt,
        });
      });
      loadedQuizzes.sort((a, b) => {
        const tA = a.updatedAt?.toMillis?.() || a.createdAt?.toMillis?.() || 0;
        const tB = b.updatedAt?.toMillis?.() || b.createdAt?.toMillis?.() || 0;
        return tB - tA;
      });
      setPublishedQuizzes(loadedQuizzes);

      const rQuery = query(
        collection(db, 'quizAttempts'),
        where('userId', '==', auth.currentUser.uid)
      );
      const rSnap = await getDocs(rQuery);
      const loadedAttempts: QuizAttemptDocument[] = [];
      rSnap.forEach((docItem) => {
        const d = docItem.data();
        loadedAttempts.push({
          id: docItem.id,
          quizId: d.quizId || '',
          subjectId: d.subjectId || '',
          chapterId: d.chapterId || '',
          lessonId: d.lessonId || '',
          quizTitle: d.quizTitle || 'Quiz',
          userId: d.userId || '',
          userName: d.userName || user.name || 'Student',
          userEmail: d.userEmail || '',
          score: Number(d.score) || 0,
          totalMarks: Number(d.totalMarks) || 0,
          passMarks: typeof d.passMarks === 'number' ? d.passMarks : undefined,
          percentage: Number(d.percentage) || 0,
          passed: Boolean(d.passed),
          answers: (d.answers as Record<string, number>) || {},
          graded: d.graded !== false,
          timeSpentSeconds: typeof d.timeSpentSeconds === 'number' ? d.timeSpentSeconds : undefined,
          submittedAt: d.submittedAt,
        });
      });
      loadedAttempts.sort((a, b) => {
        const tA = a.submittedAt?.toMillis?.() || 0;
        const tB = b.submittedAt?.toMillis?.() || 0;
        return tB - tA;
      });
      setMyQuizResults(loadedAttempts);
    } catch (err) {
      const msg = reportErrorSafely(err, OperationType.LIST, 'quizzes');
      setQuizPortalMessage({
        type: 'error',
        text: `Unable to load published quizzes: ${msg}`,
      });
    } finally {
      setIsLoadingQuizzes(false);
    }
  }, [user.name]);

  useEffect(() => {
    fetchPublishedQuizzes();
  }, [fetchPublishedQuizzes]);

  const handleStartLiveQuiz = async (quiz: QuizDocument) => {
    if (!quiz.id) return;
    if (!auth.currentUser) {
      setShowAuthModal(true);
      return;
    }

    setQuizPortalMessage(null);
    setIsLoadingQuizzes(true);

    try {
      // Load ONLY student-safe questions from `quizzes/{quizId}/questions` (zero answer keys)
      const questionsQuery = query(
        collection(db, 'quizzes', quiz.id, 'questions'),
        orderBy('order', 'asc')
      );
      const qSnap = await getDocs(questionsQuery);
      const loadedQuestions: QuizQuestionItem[] = [];
      qSnap.forEach((docItem) => {
        const d = docItem.data();
        const opts = Array.isArray(d.options) ? d.options.map(String) : [];
        loadedQuestions.push({
          id: docItem.id,
          questionText: d.questionText || '',
          options: opts,
          marks: typeof d.marks === 'number' && d.marks > 0 ? d.marks : 1,
          order: typeof d.order === 'number' ? d.order : 999,
        });
      });

      loadedQuestions.sort((a, b) => a.order - b.order);

      if (loadedQuestions.length === 0) {
        setQuizPortalMessage({
          type: 'error',
          text: `No published questions found for "${quiz.title}". Ask your instructor to verify the quiz questions.`,
        });
        return;
      }

      const durationSec = (quiz.durationMinutes || quiz.timeLimit || 30) * 60;
      setActiveLiveQuiz(quiz);
      setActiveLiveQuestions(loadedQuestions);
      setLiveQIndex(0);
      setLiveAnswers({});
      setLiveQuizResult(null);
      setLiveResultSavedToCloud(false);
      setLiveTimeLeftSec(durationSec);
      setLiveTotalDurationSec(durationSec);
    } catch (err) {
      const msg = reportErrorSafely(err, OperationType.LIST, `quizzes/${quiz.id}/questions`);
      setQuizPortalMessage({
        type: 'error',
        text: `Failed to load quiz questions: ${msg}`,
      });
    } finally {
      setIsLoadingQuizzes(false);
    }
  };

  // Secure Server-Side Grading via `submitEduAIQuiz` Cloud Function
  const submitLiveQuiz = useCallback(async () => {
    if (
      !activeLiveQuiz ||
      !activeLiveQuiz.id ||
      activeLiveQuestions.length === 0 ||
      liveQuizResult ||
      isSubmittingLiveQuiz
    ) {
      return;
    }

    if (!auth.currentUser) {
      setShowAuthModal(true);
      return;
    }

    const unansweredCount = activeLiveQuestions.filter(
      (q) => typeof liveAnswers[q.id] !== 'number'
    ).length;

    if (unansweredCount > 0) {
      setQuizPortalMessage({
        type: 'error',
        text: `Please answer all questions before submitting (${unansweredCount} remaining).`,
      });
      return;
    }

    setIsSubmittingLiveQuiz(true);
    setQuizPortalMessage(null);

    const quizId = activeLiveQuiz.id;
    const uid = auth.currentUser.uid;
    const cleanedAnswers: Record<string, number> = {};
    const answerList = activeLiveQuestions.map((q) => {
      const chosen = liveAnswers[q.id];
      cleanedAnswers[q.id] = chosen;
      return {
        questionId: q.id,
        selectedOptionIndex: chosen,
      };
    });

    const timeSpentSeconds = Math.max(1, liveTotalDurationSec - liveTimeLeftSec);

    try {
      const data = await callCloudFunction<
        { quizId: string; answers: { questionId: string; selectedOptionIndex: number }[] },
        { attemptId: string; score: number; totalMarks: number; percentage: number; passed: boolean }
      >('submitEduAIQuiz', {
        quizId,
        answers: answerList,
      });
      const earnedScore = Number(data?.score) || 0;
      const totalMarks = Number(data?.totalMarks) || activeLiveQuiz.totalMarks || 0;
      const percentage = Number(data?.percentage) || 0;
      const passed = Boolean(data?.passed);
      const attemptId = data?.attemptId || `${uid}_${quizId}_${Date.now()}`;

      const finalResult: QuizAttemptDocument = {
        id: attemptId,
        quizId,
        subjectId: activeLiveQuiz.subjectId || '',
        chapterId: activeLiveQuiz.chapterId || '',
        lessonId: activeLiveQuiz.lessonId || '',
        quizTitle: activeLiveQuiz.title.slice(0, 200),
        userId: uid,
        userName: (auth.currentUser.displayName || user.name || 'Student').slice(0, 150),
        userEmail: (auth.currentUser.email || user.email || '').slice(0, 254),
        score: earnedScore,
        totalMarks,
        passMarks: activeLiveQuiz.passMarks,
        percentage,
        passed,
        answers: cleanedAnswers,
        graded: true,
        timeSpentSeconds,
        submittedAt: { toMillis: () => Date.now() },
      };

      setLiveQuizResult(finalResult);
      setLiveResultSavedToCloud(true);
      setMyQuizResults((prev) => [finalResult, ...prev]);

      // Award XP & update Score Analysis
      const earnedXp = earnedScore * 10 + (passed ? 50 : 15);
      addXp(earnedXp);
      setLastTestAnalysis({
        testTitle: activeLiveQuiz.title,
        total: totalMarks,
        score: earnedScore,
        timeSpentMin: Math.max(1, Math.round(timeSpentSeconds / 60)),
        accuracyPercent: Math.round(percentage),
        subject: activeLiveQuiz.subjectTitle || activeLiveQuiz.lessonTitle || 'Course Assessment',
        weakTopics: passed
          ? ['Advanced edge-case questions']
          : [activeLiveQuiz.lessonTitle || activeLiveQuiz.title],
        strongTopics: passed
          ? [activeLiveQuiz.lessonTitle || 'Core Quiz Concepts']
          : ['Basic definitions'],
      });

      addNotification({
        id: `notif-quiz-${Date.now()}`,
        title: passed ? 'Quiz Passed' : 'Quiz Completed',
        message: `You scored ${earnedScore}/${totalMarks} marks (${Math.round(percentage)}%) on "${activeLiveQuiz.title}". (+${earnedXp} XP)`,
        timestamp: 'Just now',
        read: false,
        type: 'achievement',
      });
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Secure quiz grading requires the deployed submitEduAIQuiz Cloud Function.';
      setQuizPortalMessage({
        type: 'error',
        text: `Quiz submission failed: ${msg}`,
      });
    } finally {
      setIsSubmittingLiveQuiz(false);
    }
  }, [
    activeLiveQuiz,
    activeLiveQuestions,
    liveQuizResult,
    isSubmittingLiveQuiz,
    liveAnswers,
    liveTotalDurationSec,
    liveTimeLeftSec,
    user.name,
    user.email,
    addXp,
    addNotification,
    setShowAuthModal,
  ]);

  const submitLiveQuizRef = useRef(submitLiveQuiz);
  useEffect(() => {
    submitLiveQuizRef.current = submitLiveQuiz;
  }, [submitLiveQuiz]);

  // Ref-safe Live Quiz Countdown Timer
  useEffect(() => {
    if (!activeLiveQuiz || liveQuizResult || liveTimeLeftSec <= 0) return;
    const timer = setInterval(() => {
      setLiveTimeLeftSec((prev) => {
        if (prev <= 1) {
          setTimeout(() => submitLiveQuizRef.current(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activeLiveQuiz, liveQuizResult, liveTimeLeftSec]);

  // Mock test submit handler (ref-safe for timer)
  const submitTest = useCallback(() => {
    if (!selectedTest || isTestSubmitted) return;
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
  }, [selectedTest, isTestSubmitted, userAnswers, addXp, timeLeftSeconds]);

  const submitTestRef = useRef(submitTest);
  useEffect(() => {
    submitTestRef.current = submitTest;
  }, [submitTest]);

  useEffect(() => {
    if (!selectedTest || isTestSubmitted || timeLeftSeconds <= 0) return;
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          setTimeout(() => submitTestRef.current(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Student Assessment</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{publishedQuizzes.length} Live Quizzes</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{myQuizResults.length} Completed</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileQuestion className="w-5 h-5 text-indigo-600" />
            <span>Quizzes, Mock Exams &amp; Automatic Results</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Attempt quizzes published by your instructors, get instant mark breakdowns, and track your saved Firestore history.
          </p>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold overflow-x-auto no-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveTabSub('live');
              setActiveLiveQuiz(null);
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTabSub === 'live'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Published Quizzes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSub('daily')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTabSub === 'daily'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Daily Quiz</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTabSub('mock');
              setSelectedTest(null);
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTabSub === 'mock'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Mock Tests</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSub('analysis')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTabSub === 'analysis'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Score Analysis</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSub('leaderboard')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTabSub === 'leaderboard'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Leaderboard</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSub('flashcards')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTabSub === 'flashcards'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Flashcards</span>
          </button>
        </div>
      </div>

      {/* Inline Portal Messages */}
      {quizPortalMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between ${
            quizPortalMessage.type === 'error'
              ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
              : quizPortalMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
              : 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{quizPortalMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setQuizPortalMessage(null)}
            className="text-xs underline ml-4 shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* SUB-TAB 0: PUBLISHED FIRESTORE QUIZZES (END-TO-END STUDENT QUIZ SCREEN) */}
      {activeTabSub === 'live' && (
        <div className="space-y-6">
          {!auth.currentUser ? (
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
              <Award className="w-10 h-10 text-indigo-600 mx-auto" />
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Sign in to access published quizzes
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Sign in with your student Google account to view quizzes published by your instructors and save your automatic marks to Firestore.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold inline-flex items-center gap-2"
              >
                <span>Sign In to Take Quizzes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : !activeLiveQuiz ? (
            <>
              {/* Published Quizzes List */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      Available Published Quizzes
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Only quizzes marked as Published in the Admin Panel appear here.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={fetchPublishedQuizzes}
                    disabled={isLoadingQuizzes}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingQuizzes ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>

                {isLoadingQuizzes ? (
                  <div className="py-12 text-center text-xs text-slate-500">
                    Loading published quizzes...
                  </div>
                ) : publishedQuizzes.length === 0 ? (
                  <div className="py-12 text-center space-y-2 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                    <FileQuestion className="w-8 h-8 text-slate-400 mx-auto" />
                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      No published quizzes available right now
                    </div>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Once an administrator publishes a quiz from the Admin Quiz Manager, it will appear here automatically. You can also practice with the Daily Quiz or Mock Tests tabs above.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {publishedQuizzes.map((quiz) => {
                      const priorAttempts = myQuizResults.filter((r) => r.quizId === quiz.id);
                      const bestAttempt = priorAttempts.reduce<QuizAttemptDocument | null>(
                        (best, cur) => (!best || cur.percentage > best.percentage ? cur : best),
                        null
                      );

                      return (
                        <div
                          key={quiz.id}
                          className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-4 hover:border-indigo-400 transition-colors"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                              <span className="font-semibold text-indigo-600 dark:text-indigo-400 truncate">
                                {quiz.lessonTitle || quiz.subjectTitle || 'Lesson Quiz'}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="tabular-nums">{quiz.totalMarks} Marks</span>
                              <span aria-hidden="true">·</span>
                              <span className="tabular-nums">{quiz.durationMinutes} mins</span>
                            </div>

                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                              {quiz.title}
                            </h3>

                            {quiz.description && (
                              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                                {quiz.description}
                              </p>
                            )}

                            <div className="flex items-center gap-2 text-xs pt-1 tabular-nums">
                              <span className="text-slate-500">
                                Pass mark: {quiz.passMarks}/{quiz.totalMarks}
                              </span>
                              {bestAttempt && (
                                <>
                                  <span aria-hidden="true" className="text-slate-400">·</span>
                                  <span
                                    className={`font-semibold ${
                                      bestAttempt.passed
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : 'text-amber-600 dark:text-amber-400'
                                    }`}
                                  >
                                    Best: {bestAttempt.score}/{bestAttempt.totalMarks} ({Math.round(bestAttempt.percentage)}%)
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleStartLiveQuiz(quiz)}
                            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                          >
                            <span>{bestAttempt ? 'Retake Quiz' : 'Start Quiz'}</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* My Past Quiz Attempts History */}
              {myQuizResults.length > 0 && (
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      My Saved Quiz Attempts
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Automatically graded marks stored in your <code className="font-mono">quizAttempts</code> record.
                    </p>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {myQuizResults.map((res) => (
                      <div
                        key={res.id}
                        className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-white">
                            {res.quizTitle || res.quizId}
                          </div>
                          <div className="text-xs text-slate-500 tabular-nums">
                            Marks: {res.score} / {res.totalMarks}
                            {typeof res.passMarks === 'number' ? ` · Pass threshold: ${res.passMarks} marks` : ''}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 tabular-nums">
                          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                            {Math.round(res.percentage)}%
                          </span>
                          <span
                            className={`text-xs font-semibold flex items-center gap-1 ${
                              res.passed
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {res.passed ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5" /> Needs Retry
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* ACTIVE LIVE QUIZ RUNNER & AUTOMATIC RESULT SCREEN */
            <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              {/* Runner Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveLiveQuiz(null);
                      setLiveQuizResult(null);
                    }}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 mb-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Back to Published Quizzes
                  </button>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {activeLiveQuiz.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                    {activeLiveQuiz.lessonTitle || 'Syllabus Assessment'} · Pass Mark: {activeLiveQuiz.passMarks}/{activeLiveQuiz.totalMarks}
                  </p>
                </div>

                {!liveQuizResult ? (
                  <div className="px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800 text-xs font-semibold flex items-center gap-2 tabular-nums self-start sm:self-auto">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>
                      Time Remaining: {Math.floor(liveTimeLeftSec / 60)}:
                      {String(liveTimeLeftSec % 60).padStart(2, '0')}
                    </span>
                  </div>
                ) : (
                  <div
                    className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 tabular-nums self-start sm:self-auto ${
                      liveQuizResult.passed
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                        : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    <span>
                      Marks: {liveQuizResult.score}/{liveQuizResult.totalMarks} ({Math.round(liveQuizResult.percentage)}%) ·{' '}
                      {liveQuizResult.passed ? 'Passed' : 'Needs Retry'}
                    </span>
                  </div>
                )}
              </div>

              {/* Automatic Result Summary Card */}
              {liveQuizResult ? (
                <div className="space-y-6">
                  <div
                    className={`p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      liveQuizResult.passed
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/25 border-emerald-200 dark:border-emerald-800'
                        : 'bg-rose-50/60 dark:bg-rose-950/25 border-rose-200 dark:border-rose-800'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2">
                        <span>Server-Verified Result</span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {liveResultSavedToCloud
                            ? 'Saved to quizAttempts by Cloud Function'
                            : 'Calculated'}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                        {liveQuizResult.score} / {liveQuizResult.totalMarks} Marks ({Math.round(liveQuizResult.percentage)}%)
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {liveQuizResult.passed
                          ? `You met the ${liveQuizResult.passMarks ?? activeLiveQuiz.passMarks} mark passing requirement.`
                          : `Passing mark is ${liveQuizResult.passMarks ?? activeLiveQuiz.passMarks}. Review your submitted responses below and try again.`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartLiveQuiz(activeLiveQuiz)}
                        className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retake Quiz</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTabSub('analysis')}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold whitespace-nowrap"
                      >
                        View Analysis
                      </button>
                    </div>
                  </div>

                  {/* Submitted Responses Summary (Answer keys remain private on the server) */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Submitted Responses
                    </h4>
                    {activeLiveQuestions.map((q, idx) => {
                      const selectedOptIdx = liveQuizResult.answers?.[q.id];

                      return (
                        <div
                          key={q.id}
                          className="p-5 rounded-2xl border bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 space-y-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                              <span className="text-indigo-600 dark:text-indigo-400 mr-1.5 tabular-nums">
                                Q{idx + 1}.
                              </span>
                              {q.questionText}
                            </p>
                            <span className="text-xs font-semibold shrink-0 tabular-nums text-slate-500">
                              {q.marks} {q.marks === 1 ? 'mark' : 'marks'}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {q.options.map((optText, optIdx) => {
                              const label = OPTION_LABELS[optIdx] || String(optIdx + 1);
                              const isChosen = selectedOptIdx === optIdx;

                              return (
                                <div
                                  key={optIdx}
                                  className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                                    isChosen
                                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-900 dark:text-indigo-100 font-semibold'
                                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                                  }`}
                                >
                                  <span>
                                    <strong className="mr-1.5">{label}.</strong>
                                    {optText}
                                  </span>
                                  {isChosen && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* ACTIVE QUESTION VIEW */
                <>
                  {/* Question Stepper */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {activeLiveQuestions.map((q, idx) => {
                      const answered = typeof liveAnswers[q.id] === 'number';
                      return (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => setLiveQIndex(idx)}
                          className={`w-8 h-8 rounded-xl font-bold text-xs tabular-nums flex items-center justify-center shrink-0 transition-colors ${
                            liveQIndex === idx
                              ? 'bg-indigo-600 text-white'
                              : answered
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>

                  {/* Current Question Card */}
                  {(() => {
                    const currentQ = activeLiveQuestions[liveQIndex];
                    const selectedOptIdx = liveAnswers[currentQ.id];

                    return (
                      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
                        <div className="flex items-center justify-between text-xs text-slate-500 tabular-nums">
                          <span>
                            Question {liveQIndex + 1} of {activeLiveQuestions.length} · {currentQ.marks}{' '}
                            {currentQ.marks === 1 ? 'mark' : 'marks'}
                          </span>
                          <span>
                            {Object.keys(liveAnswers).length} of {activeLiveQuestions.length} answered
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {currentQ.questionText}
                        </h3>

                        <div className="grid grid-cols-1 gap-2.5 pt-1">
                          {currentQ.options.map((optText, optIdx) => {
                            const label = OPTION_LABELS[optIdx] || String(optIdx + 1);
                            const isSelected = selectedOptIdx === optIdx;

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() => setLiveAnswers({ ...liveAnswers, [currentQ.id]: optIdx })}
                                className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium flex items-center gap-3 transition-colors min-h-[44px] ${
                                  isSelected
                                    ? 'bg-indigo-600 border-indigo-600 text-white font-semibold'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-400'
                                }`}
                              >
                                <span
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                                    isSelected
                                      ? 'bg-white text-indigo-600'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                  }`}
                                >
                                  {label}
                                </span>
                                <span>{optText}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Footer Controls */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      disabled={liveQIndex === 0}
                      onClick={() => setLiveQIndex((prev) => prev - 1)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold disabled:opacity-40 whitespace-nowrap"
                    >
                      Previous
                    </button>

                    <div className="flex items-center gap-2.5">
                      {liveQIndex < activeLiveQuestions.length - 1 ? (
                        <button
                          type="button"
                          onClick={() => setLiveQIndex((prev) => prev + 1)}
                          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold whitespace-nowrap"
                        >
                          Next Question
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={isSubmittingLiveQuiz || Object.keys(liveAnswers).length === 0}
                          onClick={submitLiveQuiz}
                          className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 whitespace-nowrap"
                        >
                          <Check className="w-4 h-4" />
                          <span>{isSubmittingLiveQuiz ? 'Calculating Result...' : 'Submit Quiz & Save Result'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 1: Daily Quiz */}
      {activeTabSub === 'daily' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-100 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-200 fill-amber-200" />
                <span>Today&apos;s Daily Challenge Quiz</span>
              </div>
              <h2 className="text-xl font-bold">3 Quick Questions · Earn 120 XP</h2>
              <p className="text-xs text-amber-100 max-w-xl">
                Maintain your study streak! Answer daily questions on General Knowledge, Science &amp; Aptitude to top the student rankings.
              </p>
            </div>
            <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0">
              <div className="text-[11px] font-bold text-amber-100">Streak Bonus</div>
              <div className="text-xl font-black tabular-nums">{user.streak || 5} Day Streak</div>
            </div>
          </div>

          {!dailySubmitted ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
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
                <div key={qItem.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">{qItem.q}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {qItem.opts.map((opt, oIdx) => {
                      const isSelected = dailyQuizAnswers[qItem.id] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => {
                            const updated = [...dailyQuizAnswers];
                            updated[qItem.id] = oIdx;
                            setDailyQuizAnswers(updated);
                          }}
                          className={`p-3 rounded-xl border text-left text-xs font-semibold transition-colors ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
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
                type="button"
                onClick={submitDailyQuiz}
                disabled={dailyQuizAnswers.includes(-1)}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm disabled:opacity-50 transition-colors"
              >
                Submit Daily Quiz Answers
              </button>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <Trophy className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Daily Quiz Completed
              </h2>
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                You scored {dailyScore} out of 3 (+{dailyScore * 30 + 30} XP Earned)
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setDailySubmitted(false);
                    setDailyQuizAnswers([-1, -1, -1]);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold"
                >
                  Retry Quiz
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTabSub('leaderboard')}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-xs"
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
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-400 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      <span>{test.subject}</span>
                      <span className="flex items-center gap-1 text-slate-500 tabular-nums">
                        <Clock className="w-3.5 h-3.5" />
                        {test.durationMinutes} Mins
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1">
                      {test.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 tabular-nums">
                      {test.level} · {test.totalQuestions} Questions · Interactive Timer
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => startTest(test)}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Start Mock Exam</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="text-xs font-semibold text-indigo-600">{selectedTest.subject}</div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedTest.title}
                  </h2>
                </div>

                {!isTestSubmitted ? (
                  <div className="px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center gap-2 border border-amber-200 dark:border-amber-800 tabular-nums">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>
                      Timer: {Math.floor(timeLeftSeconds / 60)}:
                      {String(timeLeftSeconds % 60).padStart(2, '0')}
                    </span>
                  </div>
                ) : (
                  <div className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 border border-emerald-200 dark:border-emerald-800 tabular-nums">
                    <Award className="w-4 h-4 text-emerald-500" />
                    <span>
                      Score: {testScore} / {selectedTest.questions.length} (
                      {Math.round((testScore / selectedTest.questions.length) * 100)}%)
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {selectedTest.questions.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentQIndex(idx)}
                    className={`w-8 h-8 rounded-xl font-bold text-xs tabular-nums flex items-center justify-center shrink-0 transition-colors ${
                      currentQIndex === idx
                        ? 'bg-indigo-600 text-white'
                        : userAnswers[idx] !== -1
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="text-xs font-semibold text-slate-400 tabular-nums">
                  Question {currentQIndex + 1} of {selectedTest.questions.length}
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  {selectedTest.questions[currentQIndex].question}
                </h3>

                <div className="space-y-2 pt-2">
                  {selectedTest.questions[currentQIndex].options.map((opt, optIdx) => {
                    const isSelected = userAnswers[currentQIndex] === optIdx;
                    const isCorrect = selectedTest.questions[currentQIndex].correctIndex === optIdx;

                    let optionBg = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700';
                    if (isTestSubmitted) {
                      if (isCorrect) optionBg = 'bg-emerald-100 dark:bg-emerald-950 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                      else if (isSelected) optionBg = 'bg-rose-100 dark:bg-rose-950 border-rose-500 text-rose-900 dark:text-rose-200 font-bold';
                    } else if (isSelected) {
                      optionBg = 'bg-indigo-50 dark:bg-indigo-950 border-indigo-500 text-indigo-900 dark:text-indigo-200 font-bold';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => selectOption(optIdx)}
                        className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-colors flex items-center justify-between ${optionBg}`}
                      >
                        <span>{opt}</span>
                        {isTestSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        {isTestSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600" />}
                      </button>
                    );
                  })}
                </div>

                {isTestSubmitted && (
                  <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs space-y-2">
                    <div className="font-bold text-indigo-800 dark:text-indigo-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span>Step-by-Step Explanation:</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {selectedTest.questions[currentQIndex].explanation}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  disabled={currentQIndex === 0}
                  onClick={() => setCurrentQIndex((prev) => prev - 1)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold disabled:opacity-40"
                >
                  Previous
                </button>

                {!isTestSubmitted ? (
                  currentQIndex === selectedTest.questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={submitTest}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
                    >
                      Submit Exam &amp; View Score Analysis
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setCurrentQIndex((prev) => prev + 1)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
                    >
                      Next
                    </button>
                  )
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveTabSub('analysis')}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold flex items-center gap-1.5"
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
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>Student Gamification Leaderboard</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Top performing students based on quiz accuracy and total XP accumulated
              </p>
            </div>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              Weekly Ranking
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {LEADERBOARD_USERS.map((usr) => (
              <div
                key={usr.rank}
                className={`py-3.5 px-4 rounded-2xl flex items-center justify-between transition-colors ${
                  usr.isCurrent
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 font-bold'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full font-bold text-xs tabular-nums flex items-center justify-center ${
                    usr.rank === 1 ? 'bg-amber-400 text-amber-950' :
                    usr.rank === 2 ? 'bg-slate-300 text-slate-800' :
                    usr.rank === 3 ? 'bg-amber-700 text-amber-100' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                  }`}>
                    #{usr.rank}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <span>{usr.avatar}</span>
                      <span>{usr.name}</span>
                      {usr.isCurrent && (
                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">(You)</span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                      {usr.testsTaken} Tests · {usr.accuracy} Accuracy
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 justify-end tabular-nums">
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
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                <span>Comprehensive Score &amp; Performance Analysis</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Diagnostic breakdown of your test accuracy, time efficiency, and areas for review.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Latest Report
            </span>
          </div>

          {lastTestAnalysis ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
                  <div className="text-[11px] font-semibold text-slate-500">Test Score</div>
                  <div className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mt-1 tabular-nums">
                    {lastTestAnalysis.score} / {lastTestAnalysis.total}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50">
                  <div className="text-[11px] font-semibold text-slate-500">Accuracy Rate</div>
                  <div className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mt-1 tabular-nums">
                    {lastTestAnalysis.accuracyPercent}%
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50">
                  <div className="text-[11px] font-semibold text-slate-500">Time Spent</div>
                  <div className="text-xl font-bold text-amber-700 dark:text-amber-300 mt-1 tabular-nums">
                    {lastTestAnalysis.timeSpentMin} Mins
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50">
                  <div className="text-[11px] font-semibold text-slate-500">Subject Area</div>
                  <div className="text-xs font-bold text-purple-700 dark:text-purple-300 mt-2 truncate">
                    {lastTestAnalysis.subject}
                  </div>
                </div>
              </div>

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

              <div className="p-4 rounded-2xl bg-indigo-600 text-white flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-xs">Want step-by-step revision on weak topics?</h3>
                  <p className="text-[11px] text-indigo-100 mt-0.5">
                    Ask AI Tutor to generate practice problems specifically for {lastTestAnalysis.weakTopics.join(', ')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    addChatMessage({
                      id: `a-${Date.now()}`,
                      role: 'user',
                      text: `Please explain and give practice questions for my weak topics: ${lastTestAnalysis.weakTopics.join(', ')}.`,
                      timestamp: 'Just now',
                    });
                    setActiveTab('ai-tutor');
                  }}
                  className="px-4 py-2 rounded-xl bg-white text-indigo-700 text-xs font-semibold hover:bg-slate-100 shrink-0 whitespace-nowrap"
                >
                  Ask AI Tutor
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">Take a quiz or mock test to see your performance score analysis here.</p>
          )}
        </div>
      )}

      {/* Sub-Tab 5: Flashcards */}
      {activeTabSub === 'flashcards' && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase text-indigo-600 dark:text-indigo-400">
              {currentFlashcard.subject} Flashcard
            </span>
            <p className="text-xs text-slate-500">Tap card to flip front / back</p>
          </div>

          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="h-64 rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 text-white p-8 shadow-lg cursor-pointer flex flex-col items-center justify-center text-center select-none transition-transform"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-100 mb-4">
              {isFlipped ? 'Answer / Explanation' : 'Concept / Question'}
            </span>

            <h3 className="text-lg sm:text-xl font-bold">
              {isFlipped ? currentFlashcard.back : currentFlashcard.front}
            </h3>

            {isFlipped && currentFlashcard.formula && (
              <div className="mt-4 px-4 py-2 rounded-xl bg-white/10 font-mono text-sm font-bold border border-white/20">
                Formula: {currentFlashcard.formula}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setIsFlipped(false);
                setFlashcardIndex((prev) => (prev > 0 ? prev - 1 : INITIAL_FLASHCARDS.length - 1));
              }}
              className="p-3 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-slate-700 dark:text-slate-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 tabular-nums">
              {flashcardIndex + 1} of {INITIAL_FLASHCARDS.length}
            </span>

            <button
              type="button"
              onClick={() => {
                setIsFlipped(false);
                setFlashcardIndex((prev) => (prev < INITIAL_FLASHCARDS.length - 1 ? prev + 1 : 0));
              }}
              className="p-3 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-slate-700 dark:text-slate-200"
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
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-xs text-slate-800 dark:text-slate-100">{p.title}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 tabular-nums">
                    PDF · {p.size} · {p.downloads} downloads
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setQuizPortalMessage({
                      type: 'info',
                      text: `Prepared "${p.title}" (${p.size}) for offline study.`,
                    })
                  }
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
