import React, { useState, useEffect, useCallback } from 'react';
import {
  HelpCircle,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Award,
  BookOpen,
  Eye,
  Edit3,
  Layers,
  Save,
  ChevronDown,
  Play,
  RotateCcw,
  Globe,
  RefreshCw,
  BarChart3,
  Check,
  X,
  Search,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  auth,
  db,
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  limit,
  writeBatch,
  serverTimestamp,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import {
  QuizDocument,
  QuizQuestionItem,
  QuizAnswerKey,
  QuizAttemptDocument,
} from '../types';

interface QuizQuestionEditorState {
  id: string;
  questionText: string;
  options: [string, string, string, string];
  correctOptionIndex: 0 | 1 | 2 | 3;
  marks: number;
  explanation?: string;
}

interface AvailableLesson {
  id: string;
  subjectId: string;
  chapterId: string;
  title: string;
  subjectTitle?: string;
  chapterTitle?: string;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const;

const sanitizeDocId = (raw: string): string => {
  const cleaned = raw.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120);
  return cleaned || `id_${Date.now()}`;
};

const DEFAULT_LESSONS: AvailableLesson[] = [
  {
    id: 'LES001',
    subjectId: 'ML001',
    chapterId: 'CH001',
    title: 'Simple Linear Regression',
    subjectTitle: 'Machine Learning',
    chapterTitle: 'Linear Regression',
  },
  {
    id: 'les_ml_simple_linear_regression',
    subjectId: 'ML001',
    chapterId: 'CH001',
    title: 'Simple Linear Regression (Core)',
    subjectTitle: 'Machine Learning',
    chapterTitle: 'Linear Regression',
  },
  {
    id: 'les_ml_multiple_linear_regression',
    subjectId: 'ML001',
    chapterId: 'CH001',
    title: 'Multiple Linear Regression',
    subjectTitle: 'Machine Learning',
    chapterTitle: 'Linear Regression',
  },
  {
    id: 'les_dsa_binary_search',
    subjectId: 'DSA001',
    chapterId: 'CH_DSA_01',
    title: 'Binary Search Algorithm',
    subjectTitle: 'Data Structures & Algorithms',
    chapterTitle: 'Searching & Sorting',
  },
  {
    id: 'les_dbms_normalization',
    subjectId: 'DBMS001',
    chapterId: 'CH_DBMS_01',
    title: 'Database Normalization (1NF to BCNF)',
    subjectTitle: 'Database Management Systems',
    chapterTitle: 'Relational Model',
  },
];

export const QuizManager: React.FC = () => {
  const { role, setShowAuthModal } = useAuth();

  // Sub-views
  const [activeView, setActiveView] = useState<'editor' | 'manage' | 'results' | 'preview'>('editor');

  // Lessons list for dropdown
  const [lessons, setLessons] = useState<AvailableLesson[]>(DEFAULT_LESSONS);

  // Saved Quizzes & Attempts from Firestore
  const [savedQuizzes, setSavedQuizzes] = useState<QuizDocument[]>([]);
  const [recentAttempts, setRecentAttempts] = useState<QuizAttemptDocument[]>([]);
  const [isLoadingDirectory, setIsLoadingDirectory] = useState<boolean>(false);
  const [quizFilter, setQuizFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [quizSearch, setQuizSearch] = useState<string>('');
  const [confirmDeleteQuizId, setConfirmDeleteQuizId] = useState<string | null>(null);
  const [togglingQuizId, setTogglingQuizId] = useState<string | null>(null);

  // Editor State (supports both Create & Edit)
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string>('LES001');
  const [quizTitle, setQuizTitle] = useState<string>('Simple Linear Regression Quiz');
  const [quizDescription, setQuizDescription] = useState<string>(
    'Test your understanding of linear models, residual sum of squares (RSS), slope, and intercept.'
  );
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [passMarks, setPassMarks] = useState<number>(6);
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(true);

  // Questions List (options stored as 0..3 array; correctOptionIndex saved separately to answerKeys)
  const [questions, setQuestions] = useState<QuizQuestionEditorState[]>([
    {
      id: 'q1',
      questionText: 'What is the primary objective of regression analysis?',
      options: [
        'Classification into discrete categories',
        'Prediction of continuous numerical values',
        'Unsupervised clustering of data points',
        'Lexical sorting of datasets',
      ],
      correctOptionIndex: 1,
      marks: 5,
      explanation:
        'Regression is used for estimating relationships between dependent and independent continuous target variables.',
    },
    {
      id: 'q2',
      questionText: 'In the formula y = mx + c, what does "m" represent?',
      options: [
        'Y-intercept',
        'Dependent variable',
        'Slope of the regression line',
        'Residual error variance',
      ],
      correctOptionIndex: 2,
      marks: 5,
      explanation: 'In slope-intercept form, m denotes the gradient or slope of the line.',
    },
  ]);

  const computedTotalMarks = questions.reduce(
    (sum, q) => sum + Math.max(1, Number(q.marks) || 1),
    0
  );

  // UI state
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'draft';
    text: string;
  } | null>(null);

  // Student Preview simulation state (stores option index 0..3)
  const [previewUserAnswers, setPreviewUserAnswers] = useState<Record<string, number>>({});
  const [previewResult, setPreviewResult] = useState<{
    score: number;
    totalMarks: number;
    percentage: number;
    passed: boolean;
  } | null>(null);

  const reportErrorSafely = (err: unknown, op: OperationType, path: string): string => {
    try {
      handleFirestoreError(err, op, path);
    } catch (wrappedErr: unknown) {
      if (wrappedErr instanceof Error) {
        try {
          const parsed = JSON.parse(wrappedErr.message);
          return parsed.error || 'Firestore permission or network error.';
        } catch {
          return wrappedErr.message;
        }
      }
    }
    return err instanceof Error ? err.message : 'Unexpected Firestore error.';
  };

  // Load lessons, saved quizzes, and student attempts from Firestore
  const fetchDirectoryData = useCallback(async () => {
    if (!auth.currentUser) return;
    setIsLoadingDirectory(true);
    try {
      // 1. Fetch Lessons
      const lessonsQuery =
        role === 'admin'
          ? collection(db, 'lessons')
          : query(
              collection(db, 'lessons'),
              where('isActive', '==', true),
              where('isPublished', '==', true)
            );
      const lessonsSnap = await getDocs(lessonsQuery);
      if (!lessonsSnap.empty) {
        const loaded: AvailableLesson[] = [];
        lessonsSnap.forEach((docItem) => {
          const data = docItem.data();
          loaded.push({
            id: docItem.id,
            subjectId: data.subjectId || 'ML001',
            chapterId: data.chapterId || 'CH001',
            title: data.title || docItem.id,
            subjectTitle: data.subjectTitle,
            chapterTitle: data.chapterTitle,
          });
        });
        setLessons(() => {
          const combined = [...loaded];
          DEFAULT_LESSONS.forEach((p) => {
            if (!combined.some((c) => c.id === p.id)) {
              combined.push(p);
            }
          });
          return combined;
        });
      }

      // 2. Fetch Quizzes (Admins see Draft & Published; Students only Published + Active)
      const quizzesQuery =
        role === 'admin'
          ? collection(db, 'quizzes')
          : query(
              collection(db, 'quizzes'),
              where('isPublished', '==', true),
              where('isActive', '==', true)
            );
      const quizzesSnap = await getDocs(quizzesQuery);
      const loadedQuizzes: QuizDocument[] = [];
      quizzesSnap.forEach((docItem) => {
        const data = docItem.data();
        const totalMarksVal = typeof data.totalMarks === 'number' ? data.totalMarks : 0;
        const passMarksVal = typeof data.passMarks === 'number' ? data.passMarks : 0;
        const durVal =
          typeof data.durationMinutes === 'number'
            ? data.durationMinutes
            : typeof data.timeLimit === 'number'
            ? data.timeLimit
            : 30;
        loadedQuizzes.push({
          id: docItem.id,
          subjectId: data.subjectId || 'ML001',
          chapterId: data.chapterId || 'CH001',
          lessonId: data.lessonId || '',
          lessonTitle: data.lessonTitle || '',
          subjectTitle: data.subjectTitle || '',
          chapterTitle: data.chapterTitle || '',
          title: data.title || 'Untitled Quiz',
          description: data.description || '',
          totalMarks: totalMarksVal,
          passMarks: passMarksVal,
          durationMinutes: durVal,
          timeLimit: durVal,
          passingScore:
            typeof data.passingScore === 'number'
              ? data.passingScore
              : totalMarksVal > 0
              ? Math.round((passMarksVal / totalMarksVal) * 100)
              : 0,
          questionsCount: typeof data.questionsCount === 'number' ? data.questionsCount : undefined,
          isPublished: Boolean(data.isPublished),
          isActive: data.isActive !== false,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
      });

      loadedQuizzes.sort((a, b) => {
        const tA = a.updatedAt?.toMillis?.() || a.createdAt?.toMillis?.() || 0;
        const tB = b.updatedAt?.toMillis?.() || b.createdAt?.toMillis?.() || 0;
        return tB - tA;
      });
      setSavedQuizzes(loadedQuizzes);

      // 3. Fetch Recent Student Quiz Attempts (`quizAttempts`)
      const attemptsQuery =
        role === 'admin'
          ? query(collection(db, 'quizAttempts'), limit(50))
          : query(
              collection(db, 'quizAttempts'),
              where('userId', '==', auth.currentUser.uid),
              limit(50)
            );
      const attemptsSnap = await getDocs(attemptsQuery);
      const loadedAttempts: QuizAttemptDocument[] = [];
      attemptsSnap.forEach((docItem) => {
        const d = docItem.data();
        loadedAttempts.push({
          id: docItem.id,
          quizId: d.quizId || '',
          subjectId: d.subjectId || '',
          chapterId: d.chapterId || '',
          lessonId: d.lessonId || '',
          quizTitle: d.quizTitle || 'Quiz',
          userId: d.userId || '',
          userName: d.userName || 'Student',
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
      setRecentAttempts(loadedAttempts);
    } catch (err) {
      const msg = reportErrorSafely(err, OperationType.LIST, 'quizzes');
      if (msg.toLowerCase().includes('permission')) {
        setStatusMessage({
          type: 'error',
          text: 'Admin Firebase authentication is required to manage draft quizzes and review all student attempts.',
        });
      }
    } finally {
      setIsLoadingDirectory(false);
    }
  }, [role]);

  useEffect(() => {
    fetchDirectoryData();
  }, [fetchDirectoryData]);

  const handleStartNewQuiz = () => {
    setEditingQuizId(null);
    setQuizTitle('');
    setQuizDescription('');
    setDurationMinutes(30);
    setPassMarks(3);
    setIsPublished(false);
    setIsActive(true);
    setQuestions([
      {
        id: `q_${Date.now()}_1`,
        questionText: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0,
        marks: 5,
        explanation: '',
      },
    ]);
    setStatusMessage(null);
    setActiveView('editor');
  };

  const handleAddQuestion = () => {
    const newQ: QuizQuestionEditorState = {
      id: `q_${Date.now()}_${questions.length + 1}`,
      questionText: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0,
      marks: 5,
      explanation: '',
    };
    setQuestions([...questions, newQ]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) {
      setStatusMessage({
        type: 'error',
        text: 'A quiz must contain at least one multiple-choice question.',
      });
      return;
    }
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionFieldChange = <K extends keyof QuizQuestionEditorState>(
    index: number,
    field: K,
    value: QuizQuestionEditorState[K]
  ) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, optIndex: 0 | 1 | 2 | 3, value: string) => {
    const updated = [...questions];
    const cur = updated[qIndex].options;
    const nextOptions: [string, string, string, string] = [cur[0], cur[1], cur[2], cur[3]];
    nextOptions[optIndex] = value;
    updated[qIndex] = { ...updated[qIndex], options: nextOptions };
    setQuestions(updated);
  };

  const handleSaveQuiz = async (publishState: boolean) => {
    if (!auth.currentUser) {
      setStatusMessage({
        type: 'error',
        text: 'Please sign in with your Admin Google account before saving or publishing quizzes.',
      });
      setShowAuthModal(true);
      return;
    }

    const cleanTitle = quizTitle.trim().slice(0, 200);
    const cleanDescription = quizDescription.trim().slice(0, 2000);
    const cleanLessonId = sanitizeDocId(selectedLessonId);

    if (!cleanTitle) {
      setStatusMessage({ type: 'error', text: 'Quiz title is required.' });
      return;
    }
    if (!cleanLessonId) {
      setStatusMessage({ type: 'error', text: 'Please select a parent lesson.' });
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) {
        setStatusMessage({
          type: 'error',
          text: `Question ${i + 1} requires question text.`,
        });
        return;
      }
      if (q.options.some((opt) => !opt.trim())) {
        setStatusMessage({
          type: 'error',
          text: `Question ${i + 1} requires all 4 answer options (A, B, C, D) to be filled.`,
        });
        return;
      }
      if (!Number.isFinite(q.marks) || q.marks < 1) {
        setStatusMessage({
          type: 'error',
          text: `Question ${i + 1} marks must be at least 1.`,
        });
        return;
      }
    }

    const totalMarks = questions.reduce((sum, q) => sum + Math.max(1, Math.round(q.marks)), 0);
    const safePassMarks = Math.min(totalMarks, Math.max(0, Math.round(Number(passMarks) || 0)));
    const safeDuration = Math.min(300, Math.max(1, Math.round(Number(durationMinutes) || 30)));
    const derivedPassingPct = totalMarks > 0 ? Math.round((safePassMarks / totalMarks) * 100) : 0;

    setIsSaving(true);
    setStatusMessage(null);

    const quizId = editingQuizId
      ? sanitizeDocId(editingQuizId)
      : sanitizeDocId(`quiz_${cleanLessonId}_${Date.now()}`);
    const parentLesson = lessons.find((l) => l.id === selectedLessonId);
    const cleanSubjectId = sanitizeDocId(parentLesson?.subjectId || 'ML001');
    const cleanChapterId = sanitizeDocId(parentLesson?.chapterId || 'CH001');

    try {
      const batch = writeBatch(db);

      // 1. Clean up removed subcollection questions & answerKeys if editing an existing quiz
      const nextQuestionIds = questions.map((_, i) => sanitizeDocId(`q_${i + 1}`));
      if (editingQuizId) {
        const keepIds = new Set(nextQuestionIds);
        const [existingQSnap, existingKeySnap] = await Promise.all([
          getDocs(collection(db, 'quizzes', quizId, 'questions')),
          getDocs(collection(db, 'quizzes', quizId, 'answerKeys')),
        ]);
        existingQSnap.forEach((docSnap) => {
          if (!keepIds.has(docSnap.id)) {
            batch.delete(docSnap.ref);
          }
        });
        existingKeySnap.forEach((docSnap) => {
          if (!keepIds.has(docSnap.id)) {
            batch.delete(docSnap.ref);
          }
        });
      }

      // 2. Write Quiz metadata document at `quizzes/{quizId}`
      const quizDocData: QuizDocument = {
        id: quizId,
        subjectId: cleanSubjectId,
        chapterId: cleanChapterId,
        lessonId: cleanLessonId,
        lessonTitle: (parentLesson?.title || '').slice(0, 250),
        subjectTitle: (parentLesson?.subjectTitle || '').slice(0, 150),
        chapterTitle: (parentLesson?.chapterTitle || '').slice(0, 200),
        title: cleanTitle,
        description: cleanDescription,
        totalMarks,
        passMarks: safePassMarks,
        durationMinutes: safeDuration,
        timeLimit: safeDuration,
        passingScore: derivedPassingPct,
        questionsCount: questions.length,
        isPublished: publishState,
        isActive,
        ...(editingQuizId ? {} : { createdAt: serverTimestamp() }),
        updatedAt: serverTimestamp(),
      };

      batch.set(doc(db, 'quizzes', quizId), quizDocData, { merge: true });

      // 3. Write student-safe questions to `quizzes/{quizId}/questions/{questionId}`
      //    and protected answer keys to `quizzes/{quizId}/answerKeys/{questionId}`
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const questionDocId = nextQuestionIds[i];

        const questionPayload: QuizQuestionItem = {
          id: questionDocId,
          questionText: q.questionText.trim().slice(0, 1000),
          options: q.options.map((opt) => opt.trim().slice(0, 500)),
          marks: Math.max(1, Math.round(q.marks)),
          order: i + 1,
          isPublished: publishState,
          isActive,
        };
        batch.set(doc(db, 'quizzes', quizId, 'questions', questionDocId), questionPayload);

        const answerKeyPayload: QuizAnswerKey = {
          id: questionDocId,
          correctOptionIndex: q.correctOptionIndex,
          ...(q.explanation?.trim()
            ? { explanation: q.explanation.trim().slice(0, 2000) }
            : {}),
        };
        batch.set(doc(db, 'quizzes', quizId, 'answerKeys', questionDocId), answerKeyPayload);
      }

      // 4. If parent lesson exists in Firestore, link quiz summary metadata
      try {
        const lessonRef = doc(db, 'lessons', cleanLessonId);
        const lessonSnap = await getDoc(lessonRef);
        if (lessonSnap.exists()) {
          batch.update(lessonRef, {
            hasQuiz: true,
            quizId,
            quizTitle: cleanTitle,
            quizQuestionsCount: questions.length,
            updatedAt: serverTimestamp(),
          });
        }
      } catch {
        // Non-fatal if parent lesson is a local preset rather than Firestore document
      }

      await batch.commit();

      setEditingQuizId(quizId);
      setPassMarks(safePassMarks);
      setIsPublished(publishState);
      setStatusMessage({
        type: publishState ? 'success' : 'draft',
        text: publishState
          ? `Quiz "${cleanTitle}" (${questions.length} questions, ${totalMarks} marks) published. Answer keys are isolated in quizzes/${quizId}/answerKeys.`
          : `Draft "${cleanTitle}" saved with separated questions & answerKeys subcollections.`,
      });

      await fetchDirectoryData();
    } catch (err) {
      const msg = reportErrorSafely(err, OperationType.WRITE, `quizzes/${quizId}`);
      setStatusMessage({
        type: 'error',
        text: `Could not save quiz to Firestore: ${msg}`,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublishQuiz = async (quiz: QuizDocument) => {
    if (!quiz.id) return;
    if (!auth.currentUser) {
      setShowAuthModal(true);
      return;
    }

    const nextPublishState = !quiz.isPublished;
    setTogglingQuizId(quiz.id);
    setStatusMessage(null);

    try {
      const qSnap = await getDocs(collection(db, 'quizzes', quiz.id, 'questions'));

      if (nextPublishState) {
        if (qSnap.empty) {
          setStatusMessage({
            type: 'error',
            text: 'Add at least one question before publishing this quiz.',
          });
          return;
        }

        let totalQuestionMarks = 0;
        qSnap.forEach((qDoc) => {
          const m = Number(qDoc.data().marks);
          totalQuestionMarks += Number.isFinite(m) ? m : 0;
        });

        const quizSnap = await getDoc(doc(db, 'quizzes', quiz.id));
        const expectedMarks = Number(quizSnap.data()?.totalMarks) || 0;

        if (totalQuestionMarks !== expectedMarks) {
          setStatusMessage({
            type: 'error',
            text: `Question marks (${totalQuestionMarks}) must equal quiz total marks (${expectedMarks}) before publishing.`,
          });
          return;
        }
      }

      const batch = writeBatch(db);
      batch.update(doc(db, 'quizzes', quiz.id), {
        isPublished: nextPublishState,
        updatedAt: serverTimestamp(),
      });

      qSnap.forEach((qDoc) => {
        batch.update(qDoc.ref, { isPublished: nextPublishState });
      });

      await batch.commit();

      setSavedQuizzes((prev) =>
        prev.map((item) =>
          item.id === quiz.id ? { ...item, isPublished: nextPublishState } : item
        )
      );

      if (editingQuizId === quiz.id) {
        setIsPublished(nextPublishState);
      }

      setStatusMessage({
        type: nextPublishState ? 'success' : 'draft',
        text: nextPublishState
          ? `Published "${quiz.title}" — now visible on the Student Quiz Screen (answer keys stay hidden until submission).`
          : `Unpublished "${quiz.title}" — reverted to draft and hidden from students.`,
      });
    } catch (err) {
      const msg = reportErrorSafely(err, OperationType.UPDATE, `quizzes/${quiz.id}`);
      setStatusMessage({
        type: 'error',
        text: `Failed to update publish status: ${msg}`,
      });
    } finally {
      setTogglingQuizId(null);
    }
  };

  const handleLoadQuizForEdit = async (quiz: QuizDocument) => {
    if (!quiz.id) return;
    setStatusMessage(null);

    try {
      const [qSnap, keySnap] = await Promise.all([
        getDocs(collection(db, 'quizzes', quiz.id, 'questions')),
        getDocs(collection(db, 'quizzes', quiz.id, 'answerKeys')),
      ]);

      const keyMap = new Map<string, QuizAnswerKey>();
      keySnap.forEach((docSnap) => {
        const d = docSnap.data();
        const idx = Number(d.correctOptionIndex);
        keyMap.set(docSnap.id, {
          id: docSnap.id,
          correctOptionIndex: (idx >= 0 && idx <= 3 ? idx : 0) as 0 | 1 | 2 | 3,
          explanation: typeof d.explanation === 'string' ? d.explanation : '',
        });
      });

      const loadedQuestions: (QuizQuestionEditorState & { order: number })[] = [];
      qSnap.forEach((docSnap) => {
        const d = docSnap.data();
        const rawOpts = Array.isArray(d.options) ? d.options.map(String) : [];
        const paddedOpts: [string, string, string, string] = [
          rawOpts[0] || '',
          rawOpts[1] || '',
          rawOpts[2] || '',
          rawOpts[3] || '',
        ];
        const keyInfo = keyMap.get(docSnap.id);
        loadedQuestions.push({
          id: docSnap.id,
          order: typeof d.order === 'number' ? d.order : 999,
          questionText: d.questionText || '',
          options: paddedOpts,
          correctOptionIndex: keyInfo?.correctOptionIndex ?? 0,
          marks: typeof d.marks === 'number' && d.marks > 0 ? d.marks : 1,
          explanation: keyInfo?.explanation || '',
        });
      });

      loadedQuestions.sort((a, b) => a.order - b.order);

      setEditingQuizId(quiz.id);
      setSelectedLessonId(quiz.lessonId || 'LES001');
      setQuizTitle(quiz.title);
      setQuizDescription(quiz.description || '');
      setDurationMinutes(quiz.durationMinutes || quiz.timeLimit || 30);
      setPassMarks(quiz.passMarks ?? 0);
      setIsPublished(Boolean(quiz.isPublished));
      setIsActive(quiz.isActive !== false);

      if (loadedQuestions.length > 0) {
        setQuestions(loadedQuestions.map(({ order: _order, ...rest }) => rest));
      } else {
        setQuestions([
          {
            id: `q_${Date.now()}_1`,
            questionText: '',
            options: ['', '', '', ''],
            correctOptionIndex: 0,
            marks: 5,
            explanation: '',
          },
        ]);
      }

      setPreviewUserAnswers({});
      setPreviewResult(null);
      setActiveView('editor');
    } catch (err) {
      const msg = reportErrorSafely(err, OperationType.GET, `quizzes/${quiz.id}`);
      setStatusMessage({
        type: 'error',
        text: `Unable to load quiz questions and answer keys: ${msg}`,
      });
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!auth.currentUser) {
      setShowAuthModal(true);
      return;
    }

    try {
      const batch = writeBatch(db);
      const [qSnap, keySnap] = await Promise.all([
        getDocs(collection(db, 'quizzes', quizId, 'questions')),
        getDocs(collection(db, 'quizzes', quizId, 'answerKeys')),
      ]);
      qSnap.forEach((docSnap) => batch.delete(docSnap.ref));
      keySnap.forEach((docSnap) => batch.delete(docSnap.ref));
      batch.delete(doc(db, 'quizzes', quizId));
      await batch.commit();

      setSavedQuizzes((prev) => prev.filter((q) => q.id !== quizId));
      setConfirmDeleteQuizId(null);
      if (editingQuizId === quizId) {
        handleStartNewQuiz();
      }
      setStatusMessage({
        type: 'draft',
        text: 'Quiz, questions, and answer keys deleted from Firestore.',
      });
    } catch (err) {
      const msg = reportErrorSafely(err, OperationType.DELETE, `quizzes/${quizId}`);
      setStatusMessage({
        type: 'error',
        text: `Failed to delete quiz: ${msg}`,
      });
    }
  };

  const handleCalculatePreviewScore = () => {
    let earnedScore = 0;
    let totalMarks = 0;
    questions.forEach((q) => {
      const qMarks = Math.max(1, Number(q.marks) || 1);
      totalMarks += qMarks;
      if (previewUserAnswers[q.id] === q.correctOptionIndex) {
        earnedScore += qMarks;
      }
    });
    const pct = totalMarks > 0 ? Math.round((earnedScore / totalMarks) * 100) : 0;
    setPreviewResult({
      score: earnedScore,
      totalMarks,
      percentage: pct,
      passed: earnedScore >= passMarks,
    });
  };

  const handleResetPreview = () => {
    setPreviewUserAnswers({});
    setPreviewResult(null);
  };

  const selectedLessonObj = lessons.find((l) => l.id === selectedLessonId);

  const filteredQuizzes = savedQuizzes.filter((q) => {
    const matchesStatus =
      quizFilter === 'all' ||
      (quizFilter === 'published' && q.isPublished) ||
      (quizFilter === 'draft' && !q.isPublished);
    const matchesSearch =
      !quizSearch.trim() ||
      q.title.toLowerCase().includes(quizSearch.toLowerCase()) ||
      (q.lessonTitle || '').toLowerCase().includes(quizSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const publishedCount = savedQuizzes.filter((q) => q.isPublished).length;
  const draftCount = savedQuizzes.length - publishedCount;

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto pb-16">
      {/* Workspace Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Admin Panel</span>
            <span aria-hidden="true">·</span>
            <span>Separated Answer Keys</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">
              {publishedCount} Published / {draftCount} Drafts
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Quiz Builder &amp; Publishing
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
            Store student-safe questions in <code className="font-mono">questions</code>, isolate answer keys in{' '}
            <code className="font-mono">answerKeys</code>, and record graded marks in{' '}
            <code className="font-mono">quizAttempts</code>.
          </p>
        </div>

        {/* Segmented Control */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-x-auto no-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => setActiveView('editor')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeView === 'editor'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{editingQuizId ? 'Edit Quiz' : 'Create Quiz'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('manage')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeView === 'manage'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="tabular-nums">Saved Quizzes ({savedQuizzes.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('results')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeView === 'results'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="tabular-nums">Quiz Attempts ({recentAttempts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('preview')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeView === 'preview'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Auth Warning when signed out of Firebase */}
      {!auth.currentUser && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs font-medium text-amber-900 dark:text-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Sign in with your Admin Firebase account to create, publish, and manage quizzes in Firestore.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowAuthModal(true)}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold whitespace-nowrap shrink-0"
          >
            Sign In Now
          </button>
        </div>
      )}

      {/* Status Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : statusMessage.type === 'draft'
              ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {statusMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
            {statusMessage.type === 'draft' && <Clock className="w-4 h-4 text-amber-600 shrink-0" />}
            {statusMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="text-xs underline opacity-75 hover:opacity-100 ml-4 shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* VIEW 1: SAVED QUIZZES DIRECTORY */}
      {activeView === 'manage' && (
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Saved Quizzes Directory
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Publish quizzes to make them available on the Student Quiz Screen while keeping answer keys protected until submission.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={fetchDirectoryData}
                disabled={isLoadingDirectory}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 whitespace-nowrap"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDirectory ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                type="button"
                onClick={handleStartNewQuiz}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Quiz</span>
              </button>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-start">
              {(['all', 'published', 'draft'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setQuizFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors whitespace-nowrap ${
                    quizFilter === status
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {status === 'all'
                    ? `All (${savedQuizzes.length})`
                    : status === 'published'
                    ? `Published (${publishedCount})`
                    : `Drafts (${draftCount})`}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={quizSearch}
                onChange={(e) => setQuizSearch(e.target.value)}
                placeholder="Search quizzes or lessons..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {isLoadingDirectory ? (
            <div className="py-12 text-center text-xs text-slate-500">Loading quizzes from Firestore...</div>
          ) : filteredQuizzes.length === 0 ? (
            <div className="py-12 text-center space-y-3 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
              <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">No quizzes found</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Create your first lesson-linked quiz and publish it to make it accessible to students.
              </p>
              <button
                type="button"
                onClick={handleStartNewQuiz}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Create Quiz
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredQuizzes.map((quiz) => {
                const isToggling = togglingQuizId === quiz.id;
                const isConfirmingDelete = confirmDeleteQuizId === quiz.id;
                const parentTitle =
                  quiz.lessonTitle ||
                  lessons.find((l) => l.id === quiz.lessonId)?.title ||
                  quiz.lessonId;

                return (
                  <div
                    key={quiz.id}
                    className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span
                          className={`font-semibold ${
                            quiz.isPublished
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {quiz.isPublished ? 'Published Live' : 'Draft Only'}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{parentTitle}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{quiz.questionsCount ?? '—'} Questions</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">
                          Pass {quiz.passMarks}/{quiz.totalMarks} marks
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{quiz.durationMinutes} mins</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                        {quiz.title}
                      </h3>
                      {quiz.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                          {quiz.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      <button
                        type="button"
                        disabled={isToggling}
                        onClick={() => handleTogglePublishQuiz(quiz)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                          quiz.isPublished
                            ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>
                          {isToggling
                            ? 'Updating...'
                            : quiz.isPublished
                            ? 'Unpublish'
                            : 'Publish Quiz'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleLoadQuizForEdit(quiz)}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 whitespace-nowrap"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      {isConfirmingDelete ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => quiz.id && handleDeleteQuiz(quiz.id)}
                            className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold whitespace-nowrap"
                          >
                            Confirm Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteQuizId(null)}
                            className="px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => quiz.id && setConfirmDeleteQuizId(quiz.id)}
                          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          title="Delete quiz"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: STUDENT ATTEMPTS MONITOR (`quizAttempts`) */}
      {activeView === 'results' && (
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Student Quiz Attempts
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Graded marks persisted in <code className="font-mono">quizAttempts</code> after post-submission verification.
              </p>
            </div>
            <button
              type="button"
              onClick={fetchDirectoryData}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 whitespace-nowrap"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDirectory ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {recentAttempts.length === 0 ? (
            <div className="py-12 text-center space-y-2 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
              <Award className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                No quiz attempts recorded yet
              </div>
              <p className="text-xs text-slate-500">
                Published quiz submissions from students will appear here with automatic pass/fail marks.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <th className="py-3 pr-4">Student</th>
                    <th className="py-3 pr-4">Quiz</th>
                    <th className="py-3 pr-4">Marks</th>
                    <th className="py-3 pr-4">Percentage</th>
                    <th className="py-3 pr-4">Outcome</th>
                    <th className="py-3">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {recentAttempts.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="py-3 pr-4">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {res.userName || res.userId}
                        </div>
                        {res.userEmail && (
                          <div className="text-[11px] text-slate-500">{res.userEmail}</div>
                        )}
                      </td>
                      <td className="py-3 pr-4 font-medium text-slate-800 dark:text-slate-200">
                        {res.quizTitle || res.quizId}
                      </td>
                      <td className="py-3 pr-4 font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                        {res.score} / {res.totalMarks}
                      </td>
                      <td className="py-3 pr-4 font-mono tabular-nums font-bold text-indigo-600 dark:text-indigo-400">
                        {Math.round(res.percentage)}%
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-flex items-center gap-1 font-semibold ${
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
                              <X className="w-3.5 h-3.5" /> Needs Retry
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3 font-mono tabular-nums text-slate-500">
                        {typeof res.timeSpentSeconds === 'number'
                          ? `${Math.floor(res.timeSpentSeconds / 60)}m ${res.timeSpentSeconds % 60}s`
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: INTERACTIVE STUDENT PREVIEW */}
      {activeView === 'preview' && (
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                Interactive Student Preview · {selectedLessonObj?.title || selectedLessonId}
              </p>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {quizTitle || 'Untitled Quiz'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 tabular-nums">
                {questions.length} Questions · {computedTotalMarks} Total Marks · Pass Mark: {passMarks} · {durationMinutes} mins
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveView('editor')}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 self-start sm:self-auto"
            >
              Back to Editor
            </button>
          </div>

          <div className="space-y-4">
            {questions.map((q, idx) => {
              const selectedIdx = previewUserAnswers[q.id];
              const isGraded = previewResult !== null;
              const isCorrect = selectedIdx === q.correctOptionIndex;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border ${
                    isGraded
                      ? isCorrect
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                        : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'
                      : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      <span className="text-indigo-600 dark:text-indigo-400 mr-1.5 tabular-nums">
                        Q{idx + 1}.
                      </span>
                      {q.questionText || '(Untitled question)'}
                    </p>
                    <span className="text-xs font-semibold text-slate-500 tabular-nums shrink-0">
                      {q.marks} {q.marks === 1 ? 'mark' : 'marks'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4">
                    {q.options.map((optText, optIdx) => {
                      const label = OPTION_LABELS[optIdx];
                      const isChosen = selectedIdx === optIdx;
                      const isTargetCorrect = isGraded && q.correctOptionIndex === optIdx;

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={isGraded}
                          onClick={() =>
                            setPreviewUserAnswers({ ...previewUserAnswers, [q.id]: optIdx })
                          }
                          className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center gap-3 transition-all ${
                            isTargetCorrect
                              ? 'bg-emerald-100 dark:bg-emerald-900/60 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-bold'
                              : isChosen
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-400'
                          }`}
                        >
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 ${
                              isTargetCorrect
                                ? 'bg-emerald-600 text-white'
                                : isChosen
                                ? 'bg-white text-indigo-600'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {label}
                          </span>
                          <span className="truncate">{optText || `Option ${label}`}</span>
                        </button>
                      );
                    })}
                  </div>

                  {isGraded && q.explanation && (
                    <div className="mt-3 p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-bold text-slate-800 dark:text-slate-100">Explanation: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {previewResult !== null ? (
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Simulation Complete
                </p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5 tabular-nums">
                  Marks:{' '}
                  <span className={previewResult.passed ? 'text-emerald-600' : 'text-rose-600'}>
                    {previewResult.score} / {previewResult.totalMarks} ({previewResult.percentage}%)
                  </span>
                  <span className="text-xs font-semibold text-slate-500 ml-2">
                    ({previewResult.passed ? 'Passed' : `Needs ${passMarks} Marks to Pass`})
                  </span>
                </h3>
              </div>

              <button
                type="button"
                onClick={handleResetPreview}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-2 self-start sm:self-auto whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4" /> Retake Simulation
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleCalculatePreviewScore}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-2 whitespace-nowrap"
              >
                <Play className="w-4 h-4" /> Grade Preview Answers
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW 4: CREATE / EDIT QUIZ FORM */}
      {activeView === 'editor' && (
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>{editingQuizId ? `Editing ID: ${editingQuizId}` : 'New Quiz'}</span>
                <span aria-hidden="true">·</span>
                <span className={isPublished ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'}>
                  {isPublished ? 'Published' : 'Draft'}
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">Total: {computedTotalMarks} marks</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {editingQuizId ? 'Update Quiz & Answer Keys' : 'Create Lesson Quiz'}
              </h2>
            </div>

            {editingQuizId && (
              <button
                type="button"
                onClick={handleStartNewQuiz}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 self-start sm:self-auto whitespace-nowrap"
              >
                + Create Another Quiz
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lesson Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Parent Lesson <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedLessonId}
                  onChange={(e) => setSelectedLessonId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none pr-10"
                >
                  {lessons.map((les) => (
                    <option key={les.id} value={les.id}>
                      {les.subjectTitle ? `[${les.subjectTitle}] ` : ''}
                      {les.title} ({les.subjectId}/{les.chapterId})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Quiz Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Quiz Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                maxLength={200}
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="e.g. Simple Linear Regression Mastery Quiz"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Description & Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Instructions / Description
              </label>
              <input
                type="text"
                maxLength={2000}
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
                placeholder="Short instructions shown before students start..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Pass Marks (of {computedTotalMarks})
              </label>
              <input
                type="number"
                min={0}
                max={computedTotalMarks}
                value={passMarks}
                onChange={(e) => setPassMarks(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold tabular-nums text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Duration (Mins)
              </label>
              <input
                type="number"
                min={1}
                max={300}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold tabular-nums text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* QUESTIONS LIST */}
          <div className="space-y-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 tabular-nums">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>
                  Questions ({questions.length}) · {computedTotalMarks} Total Marks
                </span>
              </h3>

              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" /> Add Question
              </button>
            </div>

            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 tabular-nums">
                    Question {idx + 1}
                  </span>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                      <span>Marks:</span>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={q.marks}
                        onChange={(e) =>
                          handleQuestionFieldChange(idx, 'marks', Math.max(1, Number(e.target.value) || 1))
                        }
                        className="w-16 px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold tabular-nums text-slate-800 dark:text-slate-100"
                      />
                    </label>

                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(idx)}
                        className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Question Input */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Question Text <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={1000}
                    value={q.questionText}
                    onChange={(e) => handleQuestionFieldChange(idx, 'questionText', e.target.value)}
                    placeholder="Enter your multiple-choice question..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Options Grid: 0, 1, 2, 3 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {([0, 1, 2, 3] as const).map((optIdx) => (
                    <div key={optIdx} className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                        Option {OPTION_LABELS[optIdx]} (Index {optIdx}){' '}
                        <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={500}
                        value={q.options[optIdx]}
                        onChange={(e) => handleOptionChange(idx, optIdx, e.target.value)}
                        placeholder={`Choice ${OPTION_LABELS[optIdx]}`}
                        className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  ))}
                </div>

                {/* Protected Answer Key & Explanation */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="flex items-center gap-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                      <Lock className="w-3 h-3" />
                      <span>Correct Answer (answerKeys)</span>
                    </label>
                    <div className="relative">
                      <select
                        value={q.correctOptionIndex}
                        onChange={(e) =>
                          handleQuestionFieldChange(
                            idx,
                            'correctOptionIndex',
                            Number(e.target.value) as 0 | 1 | 2 | 3
                          )
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-400 dark:border-indigo-600 text-xs font-bold text-indigo-900 dark:text-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none pr-8"
                      >
                        {([0, 1, 2, 3] as const).map((optIdx) => (
                          <option key={optIdx} value={optIdx}>
                            {OPTION_LABELS[optIdx]} ({q.options[optIdx] || `Index ${optIdx}`})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-indigo-500 absolute right-2.5 top-3 pointer-events-none" />
                    </div>
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                      Explanation (Stored in answerKeys, revealed after submission)
                    </label>
                    <input
                      type="text"
                      maxLength={2000}
                      value={q.explanation || ''}
                      onChange={(e) => handleQuestionFieldChange(idx, 'explanation', e.target.value)}
                      placeholder="Explain why the correct answer is right..."
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddQuestion}
              className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Another Question
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Saves atomically to{' '}
              <span className="font-mono text-slate-700 dark:text-slate-300">quizzes</span>,{' '}
              <span className="font-mono text-slate-700 dark:text-slate-300">questions</span> &amp;{' '}
              <span className="font-mono text-slate-700 dark:text-slate-300">answerKeys</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleSaveQuiz(false)}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Save className="w-4 h-4 text-amber-500" />
                <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
              </button>

              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleSaveQuiz(true)}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
              >
                <Check className="w-4 h-4" />
                <span>
                  {isSaving ? 'Publishing...' : editingQuizId ? 'Save & Publish' : 'Publish Quiz'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
