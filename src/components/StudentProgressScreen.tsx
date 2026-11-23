import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Layers,
  Award,
  Terminal,
  Database,
  Copy,
  Check,
  RotateCcw,
  Flame,
  ChevronRight,
  TrendingUp,
  Sliders,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db, doc, setDoc, getDoc, collection, onSnapshot, query, where, serverTimestamp } from '../lib/firebase';
import { StudentProgress, ChapterProgressSummary, SubjectProgressSummary } from '../types';

interface LessonProgressItem {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  percentage: number;
  completedAt?: string | null;
}

interface ChapterData {
  id: string;
  chapterNumber: number;
  title: string;
  description: string;
  lessons: LessonProgressItem[];
}

interface SubjectCurriculum {
  id: string;
  title: string;
  code: string;
  level: string;
  instructor: string;
  chapters: ChapterData[];
}

// Default initial curriculum matching the exact prompt example
const INITIAL_CURRICULUM: SubjectCurriculum[] = [
  {
    id: 'machine-learning',
    title: 'Machine Learning',
    code: 'CS-401',
    level: 'Degree (B.Tech / B.Sc)',
    instructor: 'Dr. Ramesh Sharma, IIT Hyderabad',
    chapters: [
      {
        id: 'chapter-1',
        chapterNumber: 1,
        title: 'Linear Models & Regression',
        description: 'Supervised learning formulation, Simple Linear Regression, OLS minimization, and R² evaluation metrics.',
        lessons: [
          {
            id: 'simple-linear-regression',
            title: 'Simple Linear Regression (Core Theory & OLS)',
            duration: '25 Mins',
            completed: true,
            percentage: 100,
            completedAt: '2026-09-07T08:30:00Z',
          },
          {
            id: 'cost-function-ols',
            title: 'Cost Function & Ordinary Least Squares Derivation',
            duration: '20 Mins',
            completed: true,
            percentage: 100,
            completedAt: '2026-09-07T09:15:00Z',
          },
          {
            id: 'r2-residual-diagnostics',
            title: 'R² Score, Residual Analysis & Assumptions',
            duration: '18 Mins',
            completed: true,
            percentage: 100,
            completedAt: '2026-09-07T10:00:00Z',
          },
        ],
      },
      {
        id: 'chapter-2',
        chapterNumber: 2,
        title: 'Multiple Features & Loss Optimization',
        description: 'Multi-variate regression, feature scaling, Gradient Descent convergence, and regularization techniques.',
        lessons: [
          {
            id: 'multiple-linear-regression',
            title: 'Multiple Linear Regression & Matrix Form',
            duration: '30 Mins',
            completed: true,
            percentage: 100,
            completedAt: '2026-09-07T11:20:00Z',
          },
          {
            id: 'gradient-descent-algo',
            title: 'Batch & Stochastic Gradient Descent',
            duration: '25 Mins',
            completed: true,
            percentage: 100,
            completedAt: '2026-09-07T13:45:00Z',
          },
          {
            id: 'feature-scaling-norm',
            title: 'Feature Normalization & Standardization',
            duration: '20 Mins',
            completed: true,
            percentage: 80,
            completedAt: '2026-09-07T14:10:00Z',
          },
          {
            id: 'regularization-ridge-lasso',
            title: 'Ridge (L2) & Lasso (L1) Regularization',
            duration: '25 Mins',
            completed: false,
            percentage: 0,
            completedAt: null,
          },
        ],
      },
      {
        id: 'chapter-3',
        chapterNumber: 3,
        title: 'Classification & Decision Boundaries',
        description: 'Logistic Regression, Sigmoid activation, Binary Cross-Entropy Loss, and ROC-AUC evaluation.',
        lessons: [
          {
            id: 'logistic-regression-intro',
            title: 'Logistic Regression & Sigmoid Curve',
            duration: '25 Mins',
            completed: true,
            percentage: 90,
            completedAt: '2026-09-07T15:00:00Z',
          },
          {
            id: 'binary-cross-entropy',
            title: 'Binary Cross-Entropy & Maximum Likelihood',
            duration: '22 Mins',
            completed: false,
            percentage: 0,
            completedAt: null,
          },
          {
            id: 'roc-auc-confusion-matrix',
            title: 'Confusion Matrix, Precision, Recall & ROC-AUC',
            duration: '28 Mins',
            completed: false,
            percentage: 0,
            completedAt: null,
          },
        ],
      },
    ],
  },
  {
    id: 'data-structures',
    title: 'Data Structures & Algorithms',
    code: 'CS-201',
    level: 'Degree (B.Tech / B.Sc)',
    instructor: 'Prof. Ananya Sen, IISc Bengaluru',
    chapters: [
      {
        id: 'ds-ch1',
        chapterNumber: 1,
        title: 'Arrays & Two Pointers',
        description: 'Memory allocation, dynamic arrays, sliding window, and two pointer mechanics.',
        lessons: [
          { id: 'ds-l1', title: 'Dynamic Array Implementation', duration: '20 Mins', completed: true, percentage: 100, completedAt: '2026-09-06T10:00:00Z' },
          { id: 'ds-l2', title: 'Two-Pointer Technique in Linear Time', duration: '25 Mins', completed: true, percentage: 100, completedAt: '2026-09-06T11:00:00Z' },
        ],
      },
      {
        id: 'ds-ch2',
        chapterNumber: 2,
        title: 'Linked Lists & Stacks',
        description: 'Singly and doubly linked lists, monotonic stacks, and balanced parentheses parsing.',
        lessons: [
          { id: 'ds-l3', title: 'Reversing Linked Lists Recursively', duration: '22 Mins', completed: true, percentage: 100, completedAt: '2026-09-06T12:00:00Z' },
          { id: 'ds-l4', title: 'Monotonic Stack Optimization', duration: '26 Mins', completed: false, percentage: 20, completedAt: null },
        ],
      },
      {
        id: 'ds-ch3',
        chapterNumber: 3,
        title: 'Binary Search Trees & Heaps',
        description: 'Tree traversals, binary search invariant, and priority queue implementations.',
        lessons: [
          { id: 'ds-l5', title: 'BST Inorder Traversal & Validation', duration: '24 Mins', completed: false, percentage: 0, completedAt: null },
        ],
      },
    ],
  },
];

// Helper to generate the exact 10-block ASCII bar as requested:
// Example: ██████████ 100%, ███████░░░ 70%, ███░░░░░░░ 30%
export const generateAsciiBar = (percentage: number, totalBlocks: number = 10): string => {
  const clamped = Math.max(0, Math.min(100, Math.round(percentage)));
  const filledCount = Math.round((clamped / 100) * totalBlocks);
  const emptyCount = totalBlocks - filledCount;
  const filled = '█'.repeat(filledCount);
  const empty = '░'.repeat(emptyCount);
  return `${filled}${empty}`;
};

export const StudentProgressScreen: React.FC = () => {
  const { user, setActiveTab, addNotification, addXp } = useAuth();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('machine-learning');
  const [curriculumData, setCurriculumData] = useState<SubjectCurriculum[]>(INITIAL_CURRICULUM);
  const [dbRecords, setDbRecords] = useState<Record<string, StudentProgress>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copiedAscii, setCopiedAscii] = useState<boolean>(false);
  const [displayMode, setDisplayMode] = useState<'both' | 'ascii' | 'graphical'>('both');
  const [syncTimestamp, setSyncTimestamp] = useState<string>('Just now');
  const [selectedDocToInspect, setSelectedDocToInspect] = useState<StudentProgress | null>(null);

  // Active Subject
  const currentSubject = useMemo(() => {
    return curriculumData.find((s) => s.id === selectedSubjectId) || curriculumData[0];
  }, [curriculumData, selectedSubjectId]);

  // Load progress from Firestore `progress` collection in real-time
  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      // Query all progress documents for this user
      const progressCol = collection(db, 'progress');
      const q = query(progressCol, where('userId', '==', user.id));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const records: Record<string, StudentProgress> = {};
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as StudentProgress;
            const key = data.lessonId || docSnap.id;
            records[key] = {
              ...data,
              id: docSnap.id,
              progressId: docSnap.id,
            };
          });

          setDbRecords(records);
          setSyncTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
          setIsLoading(false);
        },
        (error) => {
          console.warn('Realtime progress snapshot notice:', error);
          // Fallback to localStorage
          loadLocalStorageProgress();
          setIsLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (e) {
      console.warn('Could not initialize firestore progress listener:', e);
      loadLocalStorageProgress();
      setIsLoading(false);
    }
  }, [user?.id]);

  const loadLocalStorageProgress = () => {
    try {
      const raw = localStorage.getItem(`eduai_progress_${user.id}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        setDbRecords(parsed);
      }
    } catch (err) {
      console.warn('Failed to parse local storage progress:', err);
    }
  };

  // Synchronize curriculum completion with current dbRecords
  // If the lesson exists in dbRecords, update its state
  const computedCurriculum = useMemo(() => {
    return curriculumData.map((subject) => {
      const updatedChapters = subject.chapters.map((ch) => {
        const updatedLessons = ch.lessons.map((lesson) => {
          // Check if there is an active record for this lesson
          const record = dbRecords[lesson.id];
          if (record) {
            return {
              ...lesson,
              completed: record.completed,
              percentage: record.percentage,
              completedAt: record.completedAt || lesson.completedAt,
            };
          }
          return lesson;
        });

        return {
          ...ch,
          lessons: updatedLessons,
        };
      });

      return {
        ...subject,
        chapters: updatedChapters,
      };
    });
  }, [curriculumData, dbRecords]);

  const activeCurriculum = useMemo(() => {
    return computedCurriculum.find((s) => s.id === selectedSubjectId) || computedCurriculum[0];
  }, [computedCurriculum, selectedSubjectId]);

  // Calculate Chapter and Overall Percentages dynamically
  const chapterPercentages = useMemo(() => {
    return activeCurriculum.chapters.map((ch) => {
      if (ch.lessons.length === 0) return 0;
      const totalPct = ch.lessons.reduce((acc, l) => acc + (l.completed ? 100 : l.percentage), 0);
      return Math.round(totalPct / ch.lessons.length);
    });
  }, [activeCurriculum]);

  // Overall Percentage
  // Example for ML: Chapter 1: 100%, Chapter 2: 70%, Chapter 3: 30% -> Overall 68%
  const overallPercentage = useMemo(() => {
    if (chapterPercentages.length === 0) return 0;
    const sum = chapterPercentages.reduce((a, b) => a + b, 0);
    return Math.round(sum / chapterPercentages.length);
  }, [chapterPercentages]);

  // Toggle Completion of a Lesson directly
  const handleToggleLesson = async (
    subjectId: string,
    chapterId: string,
    lessonId: string,
    currentCompleted: boolean
  ) => {
    const nextCompleted = !currentCompleted;
    const nextPercentage = nextCompleted ? 100 : 0;
    const nowIso = nextCompleted ? new Date().toISOString() : null;

    const progressId = `${user.id}_${lessonId}`;

    // Update local state optimistic
    const updatedRecord: StudentProgress = {
      id: progressId,
      progressId: progressId,
      userId: user.id,
      subjectId,
      chapterId,
      lessonId,
      completed: nextCompleted,
      percentage: nextPercentage,
      completedAt: nowIso,
    };

    setDbRecords((prev) => ({
      ...prev,
      [lessonId]: updatedRecord,
    }));

    try {
      localStorage.setItem(`lesson_complete_${lessonId}`, String(nextCompleted));

      // Update Firestore `progress` collection as required:
      // progress
      //  └── progressId
      //       ├── userId
      //       ├── subjectId
      //       ├── chapterId
      //       ├── lessonId
      //       ├── completed
      //       ├── percentage
      //       └── completedAt
      await setDoc(
        doc(db, 'progress', progressId),
        {
          userId: user.id,
          subjectId,
          chapterId,
          lessonId,
          completed: nextCompleted,
          percentage: nextPercentage,
          completedAt: nowIso,
        },
        { merge: true }
      );

      if (nextCompleted) {
        addXp(30);
        addNotification({
          id: `prog-${Date.now()}`,
          title: '📈 Progress Recorded!',
          message: `Saved completion for lesson in ${subjectId}. +30 XP!`,
          timestamp: 'Just now',
          read: false,
          type: 'achievement',
        });
      }
    } catch (err) {
      console.error('Failed to sync lesson progress to Firestore:', err);
    }
  };

  // Copy Exact ASCII Example to Clipboard
  const handleCopyAsciiReport = () => {
    let report = `${activeCurriculum.title}\n\n`;
    activeCurriculum.chapters.forEach((ch, idx) => {
      const pct = chapterPercentages[idx];
      const bar = generateAsciiBar(pct, 10);
      report += `Chapter ${ch.chapterNumber}       ${bar}  ${pct}%\n`;
    });
    const overallBar = generateAsciiBar(overallPercentage, 10);
    report += `\nOverall         ${overallBar}  ${overallPercentage}%\n`;

    navigator.clipboard.writeText(report).then(() => {
      setCopiedAscii(true);
      setTimeout(() => setCopiedAscii(false), 3000);
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-24 px-3 sm:px-4">
      {/* 
        ╔═══════════════════════════════════════════════════════════╗
        ║ Header: 11. Student Progress                              ║
        ╚═══════════════════════════════════════════════════════════╝
      */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-black text-xs uppercase tracking-wider border border-indigo-200 dark:border-indigo-800">
              11. Student Progress
            </span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Synced {syncTimestamp}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            <span>Student Curriculum Progress</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Real-time mastery tracking by subject, chapter, and individual lessons. Progress updates automatically save to the{' '}
            <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-[11px] font-bold">
              progress
            </code>{' '}
            collection.
          </p>
        </div>

        {/* Quick Top Actions */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('student-lesson')}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-all active:scale-95"
          >
            <BookOpen className="w-4 h-4" />
            <span>Open Current Lesson</span>
          </button>

          <button
            type="button"
            onClick={handleCopyAsciiReport}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-300 dark:border-slate-700"
            title="Copy ASCII Progress Report"
          >
            {copiedAscii ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAscii ? 'Copied ASCII' : 'Copy ASCII'}</span>
          </button>
        </div>
      </div>

      {/* 
        ╔═══════════════════════════════════════════════════════════╗
        ║ Subject Selector Tabs                                     ║
        ╚═══════════════════════════════════════════════════════════╝
      */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
            Select Subject:
          </span>
          {curriculumData.map((subj) => {
            const isSelected = subj.id === selectedSubjectId;
            return (
              <button
                key={subj.id}
                type="button"
                onClick={() => setSelectedSubjectId(subj.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{subj.title}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {subj.code}
                </span>
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setDisplayMode('both')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              displayMode === 'both' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
            }`}
          >
            Hybrid
          </button>
          <button
            type="button"
            onClick={() => setDisplayMode('ascii')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              displayMode === 'ascii' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
            }`}
          >
            <Terminal className="w-3 h-3" />
            <span>ASCII</span>
          </button>
          <button
            type="button"
            onClick={() => setDisplayMode('graphical')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              displayMode === 'graphical' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
            }`}
          >
            Graphical
          </button>
        </div>
      </div>

      {/* 
        ╔═══════════════════════════════════════════════════════════╗
        ║ 🌟 CORE PROMPT SHOWCASE: PROGRESS SPECIFICATION CARD       ║
        ║                                                           ║
        ║ Machine Learning                                          ║
        ║                                                           ║
        ║ Chapter 1       ██████████ 100%                           ║
        ║ Chapter 2       ███████░░░  70%                           ║
        ║ Chapter 3       ███░░░░░░░  30%                           ║
        ║                                                           ║
        ║ Overall         ███████░░░  68%                           ║
        ╚═══════════════════════════════════════════════════════════╝
      */}
      <div className="rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-2xl overflow-hidden">
        {/* Terminal / Spec Header */}
        <div className="px-6 py-4 bg-slate-900/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="h-4 w-[1px] bg-slate-700 mx-1" />
            <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              eduai://progress/{activeCurriculum.id}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-400">Student:</span>
            <span className="font-bold text-indigo-300">{user.name}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Target Level:</span>
            <span className="text-amber-300 font-bold">{activeCurriculum.level}</span>
          </div>
        </div>

        {/* Card Body: The Exact Prompt Layout */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-800/80 pb-4">
            <div>
              <span className="text-[10px] font-mono font-black uppercase text-indigo-400 tracking-widest block mb-1">
                Subject Progress Dashboard
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight font-sans">
                {activeCurriculum.title}
              </h2>
            </div>
            <div className="text-xs font-mono text-slate-400">
              Course Code: <span className="text-emerald-400 font-bold">{activeCurriculum.code}</span>
            </div>
          </div>

          {/* CHAPTER BARS */}
          <div className="space-y-4 py-2 font-mono text-sm md:text-base">
            {activeCurriculum.chapters.map((ch, idx) => {
              const pct = chapterPercentages[idx];
              const asciiBar = generateAsciiBar(pct, 10);

              return (
                <div
                  key={ch.id}
                  className="p-3.5 rounded-2xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800/60 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-[150px]">
                    <span className="font-black text-slate-200">
                      Chapter {ch.chapterNumber}
                    </span>
                    <span className="text-xs font-sans text-slate-400 truncate max-w-[200px] hidden sm:inline">
                      ({ch.title})
                    </span>
                  </div>

                  {/* The Progress Bar (ASCII and/or Graphical) */}
                  <div className="flex-1 flex items-center justify-end gap-4">
                    {/* ASCII Block Bar (Prompt representation) */}
                    {(displayMode === 'both' || displayMode === 'ascii') && (
                      <div className="text-indigo-300 font-black tracking-widest text-base select-all">
                        {asciiBar}
                      </div>
                    )}

                    {/* Graphical Fluid Bar */}
                    {(displayMode === 'both' || displayMode === 'graphical') && (
                      <div className="w-36 md:w-48 h-3 rounded-full bg-slate-800 overflow-hidden shrink-0">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            pct === 100
                              ? 'bg-emerald-400'
                              : pct >= 50
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
                              : 'bg-amber-400'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    )}

                    {/* Percentage Label */}
                    <div className="w-14 text-right">
                      <span
                        className={`font-black text-sm md:text-base ${
                          pct === 100
                            ? 'text-emerald-400'
                            : pct >= 50
                            ? 'text-indigo-300'
                            : 'text-amber-300'
                        }`}
                      >
                        {pct}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* DIVIDER */}
            <div className="border-t border-dashed border-slate-800 my-2" />

            {/* OVERALL BAR */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/40 to-slate-900 border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-inner">
              <div className="flex items-center gap-3">
                <Flame className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <span className="text-base md:text-lg font-black text-white tracking-wide">
                    Overall
                  </span>
                  <span className="text-xs font-sans text-indigo-300 block font-normal">
                    Aggregate Subject Completion
                  </span>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-end gap-4">
                {(displayMode === 'both' || displayMode === 'ascii') && (
                  <div className="text-amber-300 font-black tracking-widest text-base md:text-lg select-all">
                    {generateAsciiBar(overallPercentage, 10)}
                  </div>
                )}

                {(displayMode === 'both' || displayMode === 'graphical') && (
                  <div className="w-36 md:w-48 h-3.5 rounded-full bg-slate-800 overflow-hidden shrink-0">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 via-purple-400 to-indigo-400 transition-all duration-700"
                      style={{ width: `${overallPercentage}%` }}
                    />
                  </div>
                )}

                <div className="w-14 text-right">
                  <span className="text-base md:text-lg font-black text-amber-300">
                    {overallPercentage}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Raw ASCII Export Snippet */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 font-mono text-xs text-slate-300 space-y-1 relative group">
            <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1 font-sans">
              <span>Terminal ASCII Representation:</span>
              <button
                type="button"
                onClick={handleCopyAsciiReport}
                className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedAscii ? 'Copied to Clipboard!' : 'Copy snippet'}</span>
              </button>
            </div>
            <pre className="text-slate-300 whitespace-pre overflow-x-auto leading-relaxed">
              {activeCurriculum.title}
              {'\n\n'}
              {activeCurriculum.chapters
                .map((ch, idx) => `Chapter ${ch.chapterNumber}       ${generateAsciiBar(chapterPercentages[idx], 10)}  ${chapterPercentages[idx]}%`)
                .join('\n')}
              {'\n\n'}
              Overall         {generateAsciiBar(overallPercentage, 10)}  {overallPercentage}%
            </pre>
          </div>
        </div>
      </div>

      {/* 
        ╔═══════════════════════════════════════════════════════════╗
        ║ Firestore Schema & Live Cloud Invariant Card              ║
        ╚═══════════════════════════════════════════════════════════╝
      */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Firestore Data Schema Invariant
              </h3>
              <p className="text-xs text-slate-500">
                Triggered on lesson completion into collection:{' '}
                <code className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">progress/{'{progressId}'}</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
              {Object.keys(dbRecords).length} Active Records Stored
            </span>
          </div>
        </div>

        {/* Schema Tree Diagram (Directly matches user prompt schema) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-slate-950 text-slate-300 font-mono text-xs space-y-2 border border-slate-800">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
              Required Data Tree Structure:
            </span>
            <pre className="text-emerald-400 leading-relaxed">
{`progress
 └── progressId
      ├── userId: "${user.id.substring(0, 16)}..."
      ├── subjectId: "${activeCurriculum.id}"
      ├── chapterId: "chapter-1"
      ├── lessonId: "simple-linear-regression"
      ├── completed: true
      ├── percentage: 100
      └── completedAt: "${new Date().toISOString()}"`}
            </pre>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs space-y-3">
            <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              Automated Lifecycle Triggers:
            </span>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Lesson Screen Toggle:</strong> Clicking <em>&quot;Mark Complete&quot;</em> in Lesson Screen immediately persists to Firestore and awards +50 XP.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Dynamic Aggregation:</strong> Chapter scores and Overall percentage recalculate on every snapshot change without manual refreshes.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Interactive Sandbox:</strong> Below you can toggle individual lessons to verify real-time Firestore synchronization.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 
        ╔═══════════════════════════════════════════════════════════╗
        ║ Detailed Chapter-by-Chapter Lessons Interactive Drilldown ║
        ╚═══════════════════════════════════════════════════════════╝
      */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Curriculum Lessons & Completion Controls
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-400">
            Click toggle to test live Firestore progress mutation
          </span>
        </div>

        {activeCurriculum.chapters.map((chapter, chIdx) => {
          const chPercentage = chapterPercentages[chIdx];
          const completedLessonsCount = chapter.lessons.filter((l) => l.completed).length;

          return (
            <div
              key={chapter.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
            >
              {/* Chapter Header */}
              <div className="p-5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-mono font-black text-[10px] uppercase">
                      Chapter {chapter.chapterNumber}
                    </span>
                    <h4 className="text-base font-black text-slate-900 dark:text-white">
                      {chapter.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
                    {chapter.description}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200 block font-mono">
                      {completedLessonsCount}/{chapter.lessons.length} Completed
                    </span>
                    <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {chPercentage}% Mastery
                    </span>
                  </div>
                  <div className="w-20 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all"
                      style={{ width: `${chPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Lesson Rows */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {chapter.lessons.map((lesson) => {
                  const isCurrentLessonActive = lesson.id === 'simple-linear-regression';

                  return (
                    <div
                      key={lesson.id}
                      className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleLesson(activeCurriculum.id, chapter.id, lesson.id, lesson.completed)
                          }
                          className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all mt-0.5 shrink-0 ${
                            lesson.completed
                              ? 'bg-emerald-500 text-white shadow-xs'
                              : 'border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-500'
                          }`}
                          title={lesson.completed ? 'Click to unmark' : 'Click to complete'}
                        >
                          {lesson.completed && <Check className="w-4 h-4" />}
                        </button>

                        <div>
                          <div className="flex items-center gap-2">
                            <h5
                              className={`text-sm font-bold ${
                                lesson.completed
                                  ? 'text-slate-900 dark:text-white line-through decoration-slate-400/50'
                                  : 'text-slate-800 dark:text-slate-200'
                              }`}
                            >
                              {lesson.title}
                            </h5>
                            {isCurrentLessonActive && (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-400/30 uppercase tracking-wider">
                                Live Interactive
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {lesson.duration}
                            </span>
                            {lesson.completedAt && (
                              <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
                                Completed: {new Date(lesson.completedAt).toLocaleDateString()}
                              </span>
                            )}
                            <span className="font-mono text-[11px] text-slate-500">
                              ID: {lesson.id}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
                        {isCurrentLessonActive ? (
                          <button
                            type="button"
                            onClick={() => setActiveTab('student-lesson')}
                            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black flex items-center gap-1 shadow-sm transition-all"
                          >
                            <span>Open Lesson Screen</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleLesson(activeCurriculum.id, chapter.id, lesson.id, lesson.completed)
                            }
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                              lesson.completed
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                                : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100'
                            }`}
                          >
                            {lesson.completed ? '✓ Done (Toggle)' : 'Mark Done'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Summary Bar */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-emerald-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-emerald-950/30 border border-indigo-200 dark:border-indigo-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Award className="w-8 h-8 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">
              Curriculum Mastery: {overallPercentage}% Complete
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Keep progressing through all chapters to unlock your official Course Completion Certificate!
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('student-lesson')}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md flex items-center justify-center gap-2 transition-all"
        >
          <span>Continue Next Lesson</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
