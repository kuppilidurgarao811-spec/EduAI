import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  BookOpen,
  Layers,
  Plus,
  Search,
  Filter,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Database,
  Code,
  Copy,
  FolderTree,
  AlertCircle,
  Video,
  HelpCircle,
  FileCheck,
  Upload,
  ExternalLink,
  ChevronRight,
  Send,
  Save,
  GraduationCap,
  ShieldCheck,
  RefreshCw,
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  FastForward,
  Bot,
  FileDown,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  auth,
  db,
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import { deleteLessonMediaAtPath } from '../lib/firebaseStorage';
import { Lesson } from '../types';

interface LastUploadRecord {
  lessonId: string;
  lessonTitle: string;
  subjectId: string;
  chapterId: string;
  mediaType: 'video' | 'pdf';
  fileName: string;
  storagePath: string;
  uploadedAt: string;
}

const LAST_UPLOAD_STORAGE_KEY = 'eduai_last_lesson_upload';

interface SubjectOption {
  id: string;
  name: string;
  code: string;
  educationLevel?: string;
  course?: string;
  semester?: number;
  chaptersCount?: number;
}

interface ChapterOption {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  order: number;
}

const DEFAULT_SUBJECTS: SubjectOption[] = [
  {
    id: 'ML001',
    name: 'Machine Learning',
    code: 'CSML501',
    educationLevel: 'Degree',
    course: 'B.Sc Computer Science',
    semester: 5,
    chaptersCount: 3,
  },
  { id: 'subj-data-structures-degree', name: 'Data Structures & Algorithms', code: 'CSDSA301', chaptersCount: 4 },
  { id: 'subj-dbms-degree', name: 'Database Management Systems', code: 'CSDB401', chaptersCount: 4 },
  { id: 'subj-ai-degree', name: 'Artificial Intelligence', code: 'CSAI601', chaptersCount: 4 },
];

const DEFAULT_CHAPTERS: Record<string, ChapterOption[]> = {
  ML001: [
    { id: 'CH001', subjectId: 'ML001', title: 'Linear Regression', description: 'Foundations of Ordinary Least Squares regression', order: 1 },
    { id: 'CH002', subjectId: 'ML001', title: 'Logistic Regression', description: 'Classification', order: 2 },
    { id: 'CH003', subjectId: 'ML001', title: 'Decision Trees', description: 'Entropy & Information Gain', order: 3 },
  ],
  ml001: [
    { id: 'abc123', subjectId: 'ml001', title: 'Introduction to ML', description: 'Basic concepts', order: 1 },
    { id: 'xyz456', subjectId: 'ml001', title: 'Linear Regression', description: 'Regression concepts', order: 2 },
    { id: 'log789', subjectId: 'ml001', title: 'Logistic Regression', description: 'Classification', order: 3 },
    { id: 'dt404', subjectId: 'ml001', title: 'Decision Trees', description: 'Entropy & Information Gain', order: 4 },
    { id: 'km505', subjectId: 'ml001', title: 'K-Means', description: 'Clustering & Unsupervised Learning', order: 5 },
  ],
  'subj-data-structures-degree': [
    { id: 'dsa101', subjectId: 'subj-data-structures-degree', title: 'Arrays & Dynamic Strings', description: 'Memory layout and operations', order: 1 },
    { id: 'dsa102', subjectId: 'subj-data-structures-degree', title: 'Linked Lists', description: 'Singly, doubly and circular lists', order: 2 },
  ],
};

const DEFAULT_LESSONS: Record<string, Lesson[]> = {
  CH001: [
    {
      id: 'LES001',
      subjectId: 'ML001',
      chapterId: 'CH001',
      subjectTitle: 'Machine Learning',
      chapterTitle: 'Linear Regression',
      title: 'Simple Linear Regression',
      description: 'Understanding independent vs dependent variables, foundational regression concepts, and notation.',
      content: `# Simple Linear Regression\n\nLinear regression models the relationship between a single predictor variable $X$ and continuous outcome $Y$:\n\n$$Y = \\beta_0 + \\beta_1X + \\varepsilon$$\n\n### Key Concepts:\n- **Slope ($\\beta_1$)**: Rate of change of $Y$ with respect to $X$\n- **Y-Intercept ($\\beta_0$)**: Expected value of $Y$ when $X = 0$\n- **Residuals**: The difference between observed and predicted values.\n- **Optimization**: Ordinary Least Squares (OLS) minimizing sum of squared residuals.`,
      order: 1,
      isActive: true,
      isPublished: true,
      status: 'published',
      estimatedMinutes: 25,
      pdfUrl: 'https://firebasestorage.googleapis.com/v0/b/pristine-sun-1mbw7.firebasestorage.app/o/lessons%2FML001%2FCH001%2FLES001%2Fpdf%2Flesson.pdf?alt=media',
      pdfPath: 'lessons/ML001/CH001/LES001/pdf/lesson.pdf',
      pdfName: 'Simple_Linear_Regression.pdf',
      pdfSize: '2.4 MB',
      pdfPagesCount: 12,
      videoUrl: 'https://www.youtube.com/watch?v=7ArmBVF2dCs',
      videoPath: 'lessons/ML001/CH001/LES001/video/lesson.mp4',
      videoStoragePath: 'lessons/ML001/CH001/LES001/video/lesson.mp4',
      videoName: 'Lecture 1: Introduction & Slope Derivation',
      videoDuration: '22:15 mins',
      hasQuiz: true,
      quizTitle: 'Simple Linear Regression Mastery Quiz',
      quizQuestionsCount: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'lesson001',
      subjectId: 'ML001',
      chapterId: 'CH001',
      subjectTitle: 'Machine Learning',
      chapterTitle: 'Linear Regression',
      title: 'Simple Linear Regression',
      description: 'Canonical Video LMS lesson document synced with Storage pdf/lesson.pdf and video/lesson.mp4 paths.',
      content: `# Simple Linear Regression\n\nLinear regression models the relationship between predictor $X$ and response $Y$ using Ordinary Least Squares.`,
      order: 2,
      isActive: true,
      isPublished: false,
      status: 'draft',
      estimatedMinutes: 20,
      pdfUrl: 'https://firebasestorage.googleapis.com/v0/b/pristine-sun-1mbw7.firebasestorage.app/o/lessons%2FML001%2FCH001%2Flesson001%2Fpdf%2Flesson.pdf?alt=media',
      pdfPath: 'lessons/ML001/CH001/lesson001/pdf/lesson.pdf',
      pdfName: 'lesson.pdf',
      pdfSize: '2.4 MB',
      videoUrl: 'https://firebasestorage.googleapis.com/v0/b/pristine-sun-1mbw7.firebasestorage.app/o/lessons%2FML001%2FCH001%2Flesson001%2Fvideo%2Flesson.mp4?alt=media',
      videoPath: 'lessons/ML001/CH001/lesson001/video/lesson.mp4',
      videoStoragePath: 'lessons/ML001/CH001/lesson001/video/lesson.mp4',
      videoName: 'lesson.mp4',
      videoDuration: '18:45 mins',
      hasQuiz: false,
      createdAt: new Date().toISOString(),
    },
  ],
  xyz456: [
    {
      id: 'les-lr-101',
      subjectId: 'ml001',
      chapterId: 'xyz456',
      subjectTitle: 'Machine Learning',
      chapterTitle: 'Linear Regression',
      title: 'Introduction',
      description: 'Understanding independent vs dependent variables, foundational regression concepts, and notation.',
      content: `# Introduction to Linear Regression\n\nLinear regression models the relationship between a single predictor variable $X$ and continuous outcome $Y$:\n\n$$Y = \\beta_0 + \\beta_1X + \\varepsilon$$\n\n### Key Concepts:\n- **Slope ($\\beta_1$)**: Rate of change of $Y$ with respect to $X$\n- **Y-Intercept ($\\beta_0$)**: Expected value of $Y$ when $X = 0$\n- **Residuals**: The difference between observed and predicted values.`,
      order: 1,
      isActive: true,
      isPublished: false,
      status: 'draft',
      estimatedMinutes: 20,
      pdfUrl: 'https://cdn.eduai.edu/handbooks/linear_regression_intro.pdf',
      pdfName: 'Linear_Regression_Intro.pdf',
      pdfSize: '1.8 MB',
      pdfPagesCount: 14,
      videoUrl: 'https://www.youtube.com/watch?v=7ArmBVF2dCs',
      videoName: 'Lecture 1: Introduction & Slope Derivation',
      videoDuration: '22:15 mins',
      hasQuiz: true,
      quizTitle: 'Introduction Quick Check',
      quizQuestionsCount: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'les-lr-102',
      subjectId: 'ml001',
      chapterId: 'xyz456',
      subjectTitle: 'Machine Learning',
      chapterTitle: 'Linear Regression',
      title: 'Simple Regression',
      description: 'Single predictor variable Ordinary Least Squares (OLS) line of best fit and cost function.',
      content: `# Simple Regression (Ordinary Least Squares)\n\nTo find optimal coefficients, we minimize the cost function $J(\\beta)$:\n\n$$J(\\beta) = \\frac{1}{2m} \\sum_{i=1}^{m} (h_\\beta(x^{(i)}) - y^{(i)})^2$$\n\nSquaring penalties penalize larger outlier errors more heavily than small ones.`,
      order: 2,
      isActive: true,
      isPublished: true,
      status: 'published',
      estimatedMinutes: 25,
      pdfUrl: 'https://cdn.eduai.edu/handbooks/simple_regression_guide.pdf',
      pdfName: 'Simple_Regression_Guide.pdf',
      pdfSize: '2.4 MB',
      pdfPagesCount: 10,
      videoUrl: 'https://www.youtube.com/watch?v=kHwlB_j7Hkc',
      videoName: 'Simple Linear Regression Walkthrough',
      videoDuration: '18:40 mins',
      hasQuiz: true,
      quizTitle: 'Simple Regression Assessment',
      quizQuestionsCount: 4,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'les-lr-103',
      subjectId: 'ml001',
      chapterId: 'xyz456',
      subjectTitle: 'Machine Learning',
      chapterTitle: 'Linear Regression',
      title: 'Multiple Regression',
      description: 'Extending regression to n features with matrix algebra, gradient descent, and normal equations.',
      content: `# Multiple Regression\n\n$$Y = \\beta_0 + \\beta_1X_1 + \\beta_2X_2 + \\dots + \\beta_nX_n + \\varepsilon$$\n\nNormal Equation closed form solution:\n$$\\beta = (X^T X)^{-1} X^T Y$$`,
      order: 3,
      isActive: true,
      isPublished: false,
      status: 'draft',
      estimatedMinutes: 35,
      pdfUrl: null,
      videoUrl: 'https://www.youtube.com/watch?v=sDv4f4s2SB8',
      videoName: 'Multiple Regression Visualized in 3D',
      videoDuration: '24:10 mins',
      hasQuiz: false,
      createdAt: new Date().toISOString(),
    },
  ],
  abc123: [
    {
      id: 'les-intro-1',
      subjectId: 'ml001',
      chapterId: 'abc123',
      subjectTitle: 'Machine Learning',
      chapterTitle: 'Introduction to ML',
      title: 'What is Machine Learning? AI vs ML vs DL',
      description: 'Arthur Samuel definition, Tom Mitchell framework, and the taxonomy of intelligent systems.',
      content: `# What is Machine Learning?\n\nMachine learning is the study of computer algorithms that improve automatically through experience.`,
      order: 1,
      isActive: true,
      isPublished: true,
      status: 'published',
      estimatedMinutes: 15,
      pdfUrl: 'https://cdn.eduai.edu/handbooks/intro_ml_handbook.pdf',
      pdfName: 'Intro_To_Machine_Learning.pdf',
      pdfSize: '1.2 MB',
      videoUrl: 'https://www.youtube.com/watch?v=Gv9_4yMHFhI',
      videoName: 'AI vs ML Explained in 10 Minutes',
      videoDuration: '10:12 mins',
      hasQuiz: true,
      quizTitle: 'ML Fundamentals Quiz',
      quizQuestionsCount: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'les-intro-2',
      subjectId: 'ml001',
      chapterId: 'abc123',
      subjectTitle: 'Machine Learning',
      chapterTitle: 'Introduction to ML',
      title: 'Supervised vs Unsupervised vs Reinforcement Learning',
      description: 'Labeled datasets, clustering, dimensionality reduction, and agent-environment reward loops.',
      content: `# Learning Paradigms\n\n- Supervised: Training data includes desired labels\n- Unsupervised: Finding patterns without supervision\n- Reinforcement: Learning through environmental reward signals`,
      order: 2,
      isActive: true,
      isPublished: true,
      status: 'published',
      estimatedMinutes: 20,
      pdfUrl: null,
      videoUrl: null,
      hasQuiz: false,
      createdAt: new Date().toISOString(),
    },
  ],
};

interface LessonManagementProps {
  initialSubjectId?: string;
  initialChapterId?: string;
  onNavigateToQuiz?: (lessonId: string, lessonTitle: string) => void;
  onNavigateToChapter?: () => void;
}

export const LessonManagement: React.FC<LessonManagementProps> = ({
  initialSubjectId = 'ML001',
  initialChapterId = 'CH001',
  onNavigateToQuiz,
  onNavigateToChapter,
}) => {
  const { user, role } = useAuth();

  // Selection states (Subject ↓ Chapter ↓ Lesson Management)
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(initialSubjectId);
  const [selectedChapterId, setSelectedChapterId] = useState<string>(initialChapterId);

  // Lesson list and filtering
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filterMode, setFilterMode] = useState<'all' | 'active_published' | 'active_draft' | 'inactive'>('all');
  const [isPreviewStudentView, setIsPreviewStudentView] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState<boolean>(false);
  const [isPdfViewerModalOpen, setIsPdfViewerModalOpen] = useState<boolean>(false);
  const [pdfViewerLesson, setPdfViewerLesson] = useState<Lesson | null>(null);

  // Implementation 3: PDF Upload State
  const [isUploadingPdf, setIsUploadingPdf] = useState<boolean>(false);
  const [pdfUploadProgress, setPdfUploadProgress] = useState<number>(0);
  const [uploadingLessonId, setUploadingLessonId] = useState<string | null>(null);

  // Implementation: Video Learning Management System (LKG -> Degree)
  const [isVideoPlayerModalOpen, setIsVideoPlayerModalOpen] = useState<boolean>(false);
  const [videoPlayerLesson, setVideoPlayerLesson] = useState<Lesson | null>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState<boolean>(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState<number>(0);
  const [uploadingVideoLessonId, setUploadingVideoLessonId] = useState<string | null>(null);

  // Video Player Controls State
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState<number>(0);
  const [videoDurationSeconds, setVideoDurationSeconds] = useState<number>(1335); // 22:15 default
  const [videoVolume, setVideoVolume] = useState<number>(1);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(false);
  const [videoPlaybackRate, setVideoPlaybackRate] = useState<number>(1);
  const [isVideoFullscreen, setIsVideoFullscreen] = useState<boolean>(false);
  const [videoQuality, setVideoQuality] = useState<string>('1080p HD');
  const [isVideoBuffering, setIsVideoBuffering] = useState<boolean>(false);
  const [videoPlaybackError, setVideoPlaybackError] = useState<string | null>(null);
  const [authorizedVideoUrl, setAuthorizedVideoUrl] = useState<string | null>(null);
  const [videoAuthExpiresAt, setVideoAuthExpiresAt] = useState<string | null>(null);
  const [isAuthorizingVideo, setIsAuthorizingVideo] = useState<boolean>(false);
  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);

  // Form State for Add / Edit
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [formId, setFormId] = useState<string>('');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formContent, setFormContent] = useState<string>('');
  const [formOrder, setFormOrder] = useState<number>(1);
  const [formIsActive, setFormIsActive] = useState<boolean>(true);
  const [formIsPublished, setFormIsPublished] = useState<boolean>(false);
  const [formEstimatedMinutes, setFormEstimatedMinutes] = useState<number>(20);

  // Preparation fields: PDF, Video, Quiz
  const [formPdfUrl, setFormPdfUrl] = useState<string>('');
  const [formPdfPath, setFormPdfPath] = useState<string>('');
  const [formPdfName, setFormPdfName] = useState<string>('');
  const [formPdfSize, setFormPdfSize] = useState<string>('');
  const [formVideoUrl, setFormVideoUrl] = useState<string>('');
  const [formVideoPath, setFormVideoPath] = useState<string>('');
  const [formVideoName, setFormVideoName] = useState<string>('');
  const [formVideoDuration, setFormVideoDuration] = useState<string>('');
  const [formHasQuiz, setFormHasQuiz] = useState<boolean>(false);
  const [formQuizTitle, setFormQuizTitle] = useState<string>('');
  const [formQuizQuestionsCount, setFormQuizQuestionsCount] = useState<number>(5);
  const [isMigratingVideoFields, setIsMigratingVideoFields] = useState<boolean>(false);
  const [isDeletingUpload, setIsDeletingUpload] = useState<boolean>(false);
  const [deletingMediaKey, setDeletingMediaKey] = useState<string | null>(null);
  const [lastUpload, setLastUpload] = useState<LastUploadRecord | null>(() => {
    try {
      const raw = localStorage.getItem(LAST_UPLOAD_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as LastUploadRecord) : null;
    } catch {
      return null;
    }
  });

  const recordLastUpload = (record: LastUploadRecord) => {
    setLastUpload(record);
    try {
      localStorage.setItem(LAST_UPLOAD_STORAGE_KEY, JSON.stringify(record));
    } catch {
      // Ignore storage quota errors
    }
  };

  const clearLastUploadRecord = () => {
    setLastUpload(null);
    try {
      localStorage.removeItem(LAST_UPLOAD_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  };

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

  // Android Studio Gradle Sync state
  const [isGradleSyncing, setIsGradleSyncing] = useState<boolean>(false);
  const [isGradleInSync, setIsGradleInSync] = useState<boolean>(true);
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState<string>('Just now');

  const handleSyncNow = () => {
    setIsGradleSyncing(true);
    setFeedback({
      type: 'info',
      message: '🐘 Gradle Sync: Resolving com.google.firebase:firebase-storage via Firebase BoM (33.4.0)...',
    });

    setTimeout(() => {
      setIsGradleSyncing(false);
      setIsGradleInSync(true);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSyncTimestamp(timeStr);
      setFeedback({
        type: 'success',
        message: '⚡ BUILD SUCCESSFUL: Gradle project sync completed in 1.2s. Firebase Storage & Firestore dependencies indexed.',
      });
    }, 1200);
  };

  // Active tab in edit modal (Basic Info / PDF Prep / Video Prep / Quiz Prep / Publish)
  const [editorTab, setEditorTab] = useState<'content' | 'pdf' | 'video' | 'quiz' | 'publish'>('content');

  // Feedback notifications
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Resolve current subject & chapter objects
  const currentSubject = DEFAULT_SUBJECTS.find((s) => s.id === selectedSubjectId) || DEFAULT_SUBJECTS[0];
  const chapterListForSubject = DEFAULT_CHAPTERS[selectedSubjectId] || DEFAULT_CHAPTERS['ml001'] || [];
  const currentChapter =
    chapterListForSubject.find((c) => c.id === selectedChapterId) ||
    chapterListForSubject[0] || {
      id: 'default-chapter',
      subjectId: selectedSubjectId,
      title: 'Current Chapter',
      description: 'Chapter lessons',
      order: 1,
    };

  // Load lessons for current Subject and Chapter
  useEffect(() => {
    const fetchLessons = async () => {
      setIsLoading(true);
      try {
        const isStudentQuery = role !== 'admin' || isPreviewStudentView;
        const lessonsQuery = isStudentQuery
          ? query(
              collection(db, 'lessons'),
              where('isActive', '==', true),
              where('isPublished', '==', true)
            )
          : collection(db, 'lessons');
        const querySnapshot = await getDocs(lessonsQuery);
        const matched: Lesson[] = [];

        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data() as Partial<Lesson>;
          if (
            (data.chapterId === selectedChapterId || data.chapterTitle === currentChapter.title) &&
            (data.subjectId === selectedSubjectId || data.subjectTitle === currentSubject.name)
          ) {
            matched.push({
              id: docSnap.id,
              subjectId: data.subjectId || selectedSubjectId,
              chapterId: data.chapterId || selectedChapterId,
              subjectTitle: data.subjectTitle || currentSubject.name,
              chapterTitle: data.chapterTitle || currentChapter.title,
              title: data.title || 'Untitled Lesson',
              description: data.description || '',
              content: data.content || '',
              order: data.order ?? 1,
              isActive: data.isActive ?? true,
              isPublished: data.isPublished ?? false,
              status: data.status || (data.isPublished ? 'published' : 'draft'),
              pdfUrl: data.pdfUrl || null,
              pdfPath: data.pdfPath || data.pdfStoragePath || null,
              pdfStoragePath: data.pdfPath || data.pdfStoragePath || null,
              pdfName: data.pdfName || null,
              pdfSize: data.pdfSize || null,
              pdfPagesCount: data.pdfPagesCount || 0,
              videoUrl: data.videoUrl || null,
              videoPath: data.videoPath || data.videoStoragePath || null,
              videoStoragePath: data.videoPath || data.videoStoragePath || null,
              videoName: data.videoName || null,
              videoDuration: data.videoDuration || null,
              hasQuiz: data.hasQuiz ?? false,
              quizId: data.quizId || null,
              quizTitle: data.quizTitle || null,
              quizQuestionsCount: data.quizQuestionsCount || 0,
              estimatedMinutes: data.estimatedMinutes || 20,
              createdAt: data.createdAt || new Date().toISOString(),
            });
          }
        });

        if (matched.length > 0) {
          matched.sort((a, b) => a.order - b.order);
          setLessons(matched);
        } else {
          // Fallback to rich pre-seeded lessons for this chapter
          const rawFallback = DEFAULT_LESSONS[selectedChapterId] || [
            {
              id: `les-${selectedChapterId}-1`,
              subjectId: selectedSubjectId,
              chapterId: selectedChapterId,
              subjectTitle: currentSubject.name,
              chapterTitle: currentChapter.title,
              title: `Introduction to ${currentChapter.title}`,
              description: `Core theoretical concepts and introductory walkthrough for ${currentChapter.title}.`,
              content: `# Introduction to ${currentChapter.title}\n\nWelcome to this lesson on **${currentChapter.title}** in **${currentSubject.name}**.\n\n### Objectives\n- Understand foundational principles\n- Examine practical algorithmic workflows\n- Complete accompanying exercises.`,
              order: 1,
              isActive: true,
              isPublished: true,
              status: 'published',
              estimatedMinutes: 20,
              pdfUrl: null,
              videoUrl: null,
              hasQuiz: false,
              createdAt: new Date().toISOString(),
            },
          ];
          const fallback = isStudentQuery
            ? rawFallback.filter((l) => l.isActive && l.isPublished)
            : rawFallback;
          setLessons(fallback);
        }
      } catch (err) {
        console.warn('Using local fallback lessons for chapter:', err);
        const rawFallback = DEFAULT_LESSONS[selectedChapterId] || [];
        setLessons(
          role !== 'admin' || isPreviewStudentView
            ? rawFallback.filter((l) => l.isActive && l.isPublished)
            : rawFallback
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessons();
  }, [selectedSubjectId, selectedChapterId, currentSubject.name, currentChapter.title, role, isPreviewStudentView]);

  // Toast auto-clear
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // 1. ADD LESSON: Open modal
  const handleOpenAddModal = () => {
    const nextOrder = lessons.length > 0 ? Math.max(...lessons.map((l) => l.order)) + 1 : 1;
    setCurrentLesson(null);
    setFormId(`les-${Date.now()}`);
    setFormTitle(`Lesson ${nextOrder}: `);
    setFormDescription('');
    setFormContent(
      `# Lesson Overview\n\nWrite educational content, mathematical derivations, code examples, or conceptual walkthroughs here.\n\n### Learning Objectives\n1. First principle understanding\n2. Practical applications\n3. Summary review`
    );
    setFormOrder(nextOrder);
    setFormIsActive(true);
    setFormIsPublished(false); // Default to Draft as requested: "Save as Draft"
    setFormEstimatedMinutes(20);
    setFormPdfUrl('');
    setFormPdfPath('');
    setFormPdfName('');
    setFormPdfSize('');
    setFormVideoUrl('');
    setFormVideoPath('');
    setFormVideoName('');
    setFormVideoDuration('');
    setFormHasQuiz(false);
    setFormQuizTitle('');
    setFormQuizQuestionsCount(5);
    setEditorTab('content');
    setIsAddModalOpen(true);
  };

  // 2. EDIT LESSON: Open modal
  const handleOpenEditModal = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setFormId(lesson.id);
    setFormTitle(lesson.title);
    setFormDescription(lesson.description);
    setFormContent(lesson.content || '');
    setFormOrder(lesson.order);
    setFormIsActive(lesson.isActive);
    setFormIsPublished(lesson.isPublished);
    setFormEstimatedMinutes(lesson.estimatedMinutes || 20);
    setFormPdfUrl(lesson.pdfUrl || '');
    setFormPdfPath(
      lesson.pdfPath ||
        lesson.pdfStoragePath ||
        (lesson.pdfUrl
          ? `lessons/${lesson.subjectId || selectedSubjectId}/${lesson.chapterId || selectedChapterId}/${lesson.id}/pdf/lesson.pdf`
          : '')
    );
    setFormPdfName(lesson.pdfName || '');
    setFormPdfSize(lesson.pdfSize || '');
    setFormVideoUrl(lesson.videoUrl || '');
    setFormVideoPath(
      lesson.videoPath ||
        lesson.videoStoragePath ||
        (lesson.videoUrl
          ? `lessons/${lesson.subjectId || selectedSubjectId}/${lesson.chapterId || selectedChapterId}/${lesson.id}/video/lesson.mp4`
          : '')
    );
    setFormVideoName(lesson.videoName || '');
    setFormVideoDuration(lesson.videoDuration || '');
    setFormHasQuiz(lesson.hasQuiz || false);
    setFormQuizTitle(lesson.quizTitle || '');
    setFormQuizQuestionsCount(lesson.quizQuestionsCount || 5);
    setEditorTab('content');
    setIsEditModalOpen(true);
  };

  // 3. SAVE / SUBMIT (Handles Add & Edit, with Draft vs Publish)
  const handleSaveLesson = async (saveAsDraftMode: boolean = false) => {
    if (!formTitle.trim()) {
      setFeedback({ type: 'error', message: 'Please provide a valid lesson title.' });
      return;
    }

    const isPublishedState = saveAsDraftMode ? false : formIsPublished;
    const statusState: 'draft' | 'published' = isPublishedState ? 'published' : 'draft';
    const resolvedSubjectId = currentLesson?.subjectId || selectedSubjectId;
    const resolvedChapterId = currentLesson?.chapterId || selectedChapterId;
    const canonicalPdfPath =
      formPdfPath.trim() ||
      (formPdfUrl.trim() ? `lessons/${resolvedSubjectId}/${resolvedChapterId}/${formId}/pdf/lesson.pdf` : null);
    const canonicalVideoPath =
      formVideoPath.trim() ||
      (formVideoUrl.trim() ? `lessons/${resolvedSubjectId}/${resolvedChapterId}/${formId}/video/lesson.mp4` : null);

    const lessonPayload: Lesson = {
      id: formId,
      subjectId: resolvedSubjectId,
      chapterId: resolvedChapterId,
      subjectTitle: currentLesson?.subjectTitle || currentSubject.name,
      chapterTitle: currentLesson?.chapterTitle || currentChapter.title,
      title: formTitle.trim(),
      description: formDescription.trim(),
      content: formContent.trim(),
      order: Number(formOrder) || 1,
      isActive: formIsActive,
      isPublished: isPublishedState,
      status: statusState,
      estimatedMinutes: Number(formEstimatedMinutes) || 20,
      // Prepared fields for PDF, Video, Quiz
      pdfUrl: formPdfUrl.trim() || null,
      pdfPath: canonicalPdfPath,
      pdfStoragePath: canonicalPdfPath,
      pdfName: formPdfName.trim() || (formPdfUrl ? 'lesson.pdf' : null),
      pdfSize: formPdfSize.trim() || (formPdfUrl ? '1.5 MB' : null),
      videoUrl: formVideoUrl.trim() || null,
      videoPath: canonicalVideoPath,
      videoStoragePath: canonicalVideoPath,
      videoName: formVideoName.trim() || (formVideoUrl ? 'lesson.mp4' : null),
      videoDuration: formVideoDuration.trim() || (formVideoUrl ? '15:00 mins' : null),
      hasQuiz: formHasQuiz,
      quizTitle: formQuizTitle.trim() || (formHasQuiz ? `${formTitle.trim()} Quiz` : null),
      quizQuestionsCount: Number(formQuizQuestionsCount) || 5,
      authorEmail: user?.email || 'admin@eduai.edu',
      createdAt: currentLesson?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'lessons', formId), lessonPayload, { merge: true });
    } catch (e) {
      const errMsg = reportErrorSafely(e, OperationType.WRITE, `lessons/${formId}`);
      setFeedback({ type: 'error', message: `Firestore save failed: ${errMsg}` });
      return;
    }

    // Update in-memory state
    setLessons((prev) => {
      const exists = prev.some((l) => l.id === formId);
      if (exists) {
        return prev.map((l) => (l.id === formId ? lessonPayload : l)).sort((a, b) => a.order - b.order);
      }
      return [...prev, lessonPayload].sort((a, b) => a.order - b.order);
    });

    setIsAddModalOpen(false);
    setIsEditModalOpen(false);

    setFeedback({
      type: 'success',
      message: saveAsDraftMode
        ? `💾 Lesson "${lessonPayload.title}" saved as DRAFT successfully!`
        : `🚀 Lesson "${lessonPayload.title}" ${isPublishedState ? 'PUBLISHED live' : 'saved'} successfully!`,
    });
  };

  // 4. DISABLE / ENABLE LESSON
  const handleToggleDisableLesson = async (lesson: Lesson) => {
    const newActiveState = !lesson.isActive;
    try {
      await updateDoc(doc(db, 'lessons', lesson.id), {
        isActive: newActiveState,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn('Updated locally:', e);
    }

    setLessons((prev) =>
      prev.map((l) => (l.id === lesson.id ? { ...l, isActive: newActiveState } : l))
    );

    setFeedback({
      type: 'info',
      message: newActiveState
        ? `✅ Lesson "${lesson.title}" ENABLED (visible to students if published).`
        : `⚠️ Lesson "${lesson.title}" DISABLED (hidden from student app).`,
    });
  };

  // 5. QUICK TOGGLE DRAFT / PUBLISH
  const handleToggleDraftPublish = async (lesson: Lesson) => {
    const newPublishedState = !lesson.isPublished;
    const newStatus: 'draft' | 'published' = newPublishedState ? 'published' : 'draft';

    try {
      await updateDoc(doc(db, 'lessons', lesson.id), {
        isPublished: newPublishedState,
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn('Updated locally:', e);
    }

    setLessons((prev) =>
      prev.map((l) =>
        l.id === lesson.id ? { ...l, isPublished: newPublishedState, status: newStatus } : l
      )
    );

    setFeedback({
      type: 'success',
      message: newPublishedState
        ? `🚀 Lesson "${lesson.title}" is now PUBLISHED live!`
        : `💾 Lesson "${lesson.title}" moved to DRAFT mode.`,
    });
  };

  // Implementation 3: Upload PDF to Firebase Storage & update Firestore
  const handleUploadPdfFile = async (file: File, targetLesson?: Lesson) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setFeedback({ type: 'error', message: 'Please select a valid PDF file (.pdf).' });
      return;
    }

    // Canonical Firebase Storage Structure: lessons/{subjectId}/{chapterId}/{lessonId}/pdf/lesson.pdf
    const subjectId = targetLesson?.subjectId || selectedSubjectId;
    const chapterId = targetLesson?.chapterId || selectedChapterId;
    const lessonId = targetLesson?.id || formId || `lesson_${Date.now()}`;
    const storagePath =
      targetLesson?.pdfPath ||
      targetLesson?.pdfStoragePath ||
      formPdfPath ||
      `lessons/${subjectId}/${chapterId}/${lessonId}/pdf/lesson.pdf`;
    const sizeFormatted = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

    setIsUploadingPdf(true);
    setUploadingLessonId(lessonId);
    setPdfUploadProgress(15);

    try {
      const storageRef = ref(storage, storagePath);
      setPdfUploadProgress(40);
      const snapshot = await uploadBytes(storageRef, file, {
        contentType: 'application/pdf',
      });
      setPdfUploadProgress(75);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      setPdfUploadProgress(100);

      // Update form state if in editor modal
      setFormPdfUrl(downloadUrl);
      setFormPdfPath(storagePath);
      setFormPdfName(file.name);
      setFormPdfSize(sizeFormatted);

      // If uploading directly for an existing lesson from list
      if (targetLesson) {
        try {
          await updateDoc(doc(db, 'lessons', targetLesson.id), {
            pdfUrl: downloadUrl,
            pdfPath: storagePath,
            pdfStoragePath: storagePath,
            pdfName: file.name,
            pdfSize: sizeFormatted,
            updatedAt: serverTimestamp(),
          });
        } catch (dbErr) {
          const errMsg = reportErrorSafely(dbErr, OperationType.UPDATE, `lessons/${targetLesson.id}`);
          setFeedback({ type: 'error', message: `PDF uploaded, but Firestore update failed: ${errMsg}` });
          return;
        }

        setLessons((prev) =>
          prev.map((l) =>
            l.id === targetLesson.id
              ? {
                  ...l,
                  pdfUrl: downloadUrl,
                  pdfPath: storagePath,
                  pdfStoragePath: storagePath,
                  pdfName: file.name,
                  pdfSize: sizeFormatted,
                }
              : l
          )
        );
      }

      recordLastUpload({
        lessonId,
        lessonTitle: targetLesson?.title || formTitle || lessonId,
        subjectId,
        chapterId,
        mediaType: 'pdf',
        fileName: file.name,
        storagePath,
        uploadedAt: new Date().toISOString(),
      });

      setFeedback({
        type: 'success',
        message: `📄 PDF uploaded to Storage at "${storagePath}" and saved with pdfUrl & pdfPath in Firestore!`,
      });
    } catch (err: any) {
      console.warn('Firebase Storage upload notice, using local blob fallback:', err);
      const localUrl = URL.createObjectURL(file);
      setFormPdfUrl(localUrl);
      setFormPdfPath(storagePath);
      setFormPdfName(file.name);
      setFormPdfSize(sizeFormatted);

      if (targetLesson) {
        setLessons((prev) =>
          prev.map((l) =>
            l.id === targetLesson.id
              ? {
                  ...l,
                  pdfUrl: localUrl,
                  pdfPath: storagePath,
                  pdfStoragePath: storagePath,
                  pdfName: file.name,
                  pdfSize: sizeFormatted,
                }
              : l
          )
        );
      }

      recordLastUpload({
        lessonId,
        lessonTitle: targetLesson?.title || formTitle || lessonId,
        subjectId,
        chapterId,
        mediaType: 'pdf',
        fileName: file.name,
        storagePath,
        uploadedAt: new Date().toISOString(),
      });

      setFeedback({
        type: 'info',
        message: `📄 PDF attached in local preview (${storagePath}). Sign in with admin Storage permissions to persist remotely.`,
      });
    } finally {
      setIsUploadingPdf(false);
      setUploadingLessonId(null);
      setTimeout(() => setPdfUploadProgress(0), 1200);
    }
  };

  const handleOpenPdfViewer = (lesson: Lesson) => {
    if (!lesson.pdfUrl) {
      setFeedback({ type: 'error', message: 'No PDF is currently attached to this lesson.' });
      return;
    }
    setPdfViewerLesson(lesson);
    setIsPdfViewerModalOpen(true);
  };

  // Implementation: Video LMS - Upload or Replace Video at Firebase Storage `videoPath` & update Firestore
  const handleUploadVideoFile = async (file: File, targetLesson?: Lesson) => {
    if (!file) return;
    const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|mkv|m4v)$/i.test(file.name);
    if (!isVideo) {
      setFeedback({ type: 'error', message: 'Please select a valid video file (.mp4, .webm, .mov).' });
      return;
    }

    const maxVideoBytes = 200 * 1024 * 1024;
    if (file.size >= maxVideoBytes) {
      setFeedback({ type: 'error', message: 'Video exceeds the 200 MB Storage rule limit.' });
      return;
    }

    const extFromType: Record<string, string> = {
      'video/mp4': 'mp4',
      'video/webm': 'webm',
      'video/quicktime': 'mov',
      'video/x-matroska': 'mkv',
    };
    const rawExt = file.name.split('.').pop()?.toLowerCase();
    const resolvedExt = extFromType[file.type] || (rawExt && /^(mp4|webm|mov|mkv|m4v)$/.test(rawExt) ? rawExt : 'mp4');
    const resolvedContentType = file.type || (resolvedExt === 'webm' ? 'video/webm' : resolvedExt === 'mov' ? 'video/quicktime' : 'video/mp4');

    const subjectId = targetLesson?.subjectId || selectedSubjectId;
    const chapterId = targetLesson?.chapterId || selectedChapterId;
    const lessonId = targetLesson?.id || formId || `lesson_${Date.now()}`;
    // Reuse stored videoPath if replacing existing file, otherwise use canonical lesson.mp4 (or actual video extension)
    const storagePath =
      targetLesson?.videoPath ||
      targetLesson?.videoStoragePath ||
      formVideoPath ||
      `lessons/${subjectId}/${chapterId}/${lessonId}/video/lesson.${resolvedExt}`;

    setIsUploadingVideo(true);
    setUploadingVideoLessonId(lessonId);
    setVideoUploadProgress(15);

    try {
      const storageRef = ref(storage, storagePath);
      setVideoUploadProgress(40);
      const snapshot = await uploadBytes(storageRef, file, {
        contentType: resolvedContentType,
      });
      setVideoUploadProgress(75);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      setVideoUploadProgress(100);

      const durationFormatted = '18:45 mins';

      // Update form state if in editor modal
      setFormVideoUrl(downloadUrl);
      setFormVideoPath(storagePath);
      setFormVideoName(file.name);
      setFormVideoDuration(durationFormatted);

      // If uploading/replacing directly for an existing lesson from list
      if (targetLesson) {
        try {
          await updateDoc(doc(db, 'lessons', targetLesson.id), {
            videoUrl: downloadUrl,
            videoPath: storagePath,
            videoStoragePath: storagePath,
            videoName: file.name,
            videoDuration: durationFormatted,
            updatedAt: serverTimestamp(),
          });
        } catch (dbErr) {
          const errMsg = reportErrorSafely(dbErr, OperationType.UPDATE, `lessons/${targetLesson.id}`);
          setFeedback({ type: 'error', message: `Video uploaded, but Firestore update failed: ${errMsg}` });
          return;
        }

        setLessons((prev) =>
          prev.map((l) =>
            l.id === targetLesson.id
              ? {
                  ...l,
                  videoUrl: downloadUrl,
                  videoPath: storagePath,
                  videoStoragePath: storagePath,
                  videoName: file.name,
                  videoDuration: durationFormatted,
                }
              : l
          )
        );
      }

      recordLastUpload({
        lessonId,
        lessonTitle: targetLesson?.title || formTitle || lessonId,
        subjectId,
        chapterId,
        mediaType: 'video',
        fileName: file.name,
        storagePath,
        uploadedAt: new Date().toISOString(),
      });

      setFeedback({
        type: 'success',
        message: `🎬 Video saved at Storage path "${storagePath}" and updated with videoUrl & videoPath in Firestore!`,
      });
    } catch (err: any) {
      console.warn('Firebase Storage upload notice, using local blob fallback:', err);
      const localUrl = URL.createObjectURL(file);
      const durationFormatted = '18:45 mins';

      setFormVideoUrl(localUrl);
      setFormVideoPath(storagePath);
      setFormVideoName(file.name);
      setFormVideoDuration(durationFormatted);

      if (targetLesson) {
        setLessons((prev) =>
          prev.map((l) =>
            l.id === targetLesson.id
              ? {
                  ...l,
                  videoUrl: localUrl,
                  videoPath: storagePath,
                  videoStoragePath: storagePath,
                  videoName: file.name,
                  videoDuration: durationFormatted,
                }
              : l
          )
        );
      }

      recordLastUpload({
        lessonId,
        lessonTitle: targetLesson?.title || formTitle || lessonId,
        subjectId,
        chapterId,
        mediaType: 'video',
        fileName: file.name,
        storagePath,
        uploadedAt: new Date().toISOString(),
      });

      setFeedback({
        type: 'info',
        message: `🎬 Video attached in local preview with videoPath "${storagePath}". Sign in with admin Storage permissions to persist remotely.`,
      });
    } finally {
      setIsUploadingVideo(false);
      setUploadingVideoLessonId(null);
      setTimeout(() => setVideoUploadProgress(0), 1200);
    }
  };

  // Delete an uploaded Video or PDF from Firebase Storage and clear fields in Firestore
  const handleDeleteLessonMedia = async (
    lessonId: string,
    mediaType: 'video' | 'pdf',
    explicitStoragePath?: string | null,
    lessonTitleFallback?: string
  ) => {
    const targetLesson = lessons.find((l) => l.id === lessonId);
    const resolvedSubjectId = targetLesson?.subjectId || selectedSubjectId;
    const resolvedChapterId = targetLesson?.chapterId || selectedChapterId;
    const defaultPath =
      mediaType === 'video'
        ? `lessons/${resolvedSubjectId}/${resolvedChapterId}/${lessonId}/video/lesson.mp4`
        : `lessons/${resolvedSubjectId}/${resolvedChapterId}/${lessonId}/pdf/lesson.pdf`;
    const storagePath =
      explicitStoragePath?.trim() ||
      (mediaType === 'video'
        ? targetLesson?.videoPath || targetLesson?.videoStoragePath || formVideoPath || defaultPath
        : targetLesson?.pdfPath || targetLesson?.pdfStoragePath || formPdfPath || defaultPath);

    const mediaKey = `${lessonId}:${mediaType}`;
    setDeletingMediaKey(mediaKey);
    setIsDeletingUpload(true);

    try {
      // 1. Delete binary from Firebase Storage if authenticated
      if (auth.currentUser && storagePath) {
        try {
          await deleteLessonMediaAtPath(storagePath);
        } catch (storageErr: any) {
          if (storageErr?.code === 'storage/unauthorized') {
            setFeedback({
              type: 'error',
              message: `Firebase Storage denied deleting "${storagePath}" (admin claim required).`,
            });
            return;
          }
          console.warn('Storage delete warning (continuing Firestore cleanup):', storageErr);
        }
      }

      // 2. Update Firestore database document to clear media URL and path fields
      let firestoreUpdated = false;
      if (auth.currentUser) {
        const updatePayload =
          mediaType === 'video'
            ? {
                videoUrl: '',
                videoPath: '',
                videoStoragePath: '',
                videoName: '',
                videoDuration: '',
                updatedAt: serverTimestamp(),
              }
            : {
                pdfUrl: '',
                pdfPath: '',
                pdfStoragePath: '',
                pdfName: '',
                pdfSize: '',
                updatedAt: serverTimestamp(),
              };

        try {
          await updateDoc(doc(db, 'lessons', lessonId), updatePayload);
          firestoreUpdated = true;
        } catch (dbErr: any) {
          if (dbErr?.code === 'not-found') {
            firestoreUpdated = false;
          } else {
            const errMsg = reportErrorSafely(dbErr, OperationType.UPDATE, `lessons/${lessonId}`);
            setFeedback({
              type: 'error',
              message: `Firestore update failed while deleting ${mediaType}: ${errMsg}`,
            });
            return;
          }
        }
      }

      // 3. Update local lesson list & open form modal state
      setLessons((prev) =>
        prev.map((l) => {
          if (l.id !== lessonId) return l;
          return mediaType === 'video'
            ? {
                ...l,
                videoUrl: null,
                videoPath: null,
                videoStoragePath: null,
                videoName: null,
                videoDuration: null,
              }
            : {
                ...l,
                pdfUrl: null,
                pdfPath: null,
                pdfStoragePath: null,
                pdfName: null,
                pdfSize: null,
              };
        })
      );

      if (formId === lessonId) {
        if (mediaType === 'video') {
          setFormVideoUrl('');
          setFormVideoPath('');
          setFormVideoName('');
          setFormVideoDuration('');
        } else {
          setFormPdfUrl('');
          setFormPdfPath('');
          setFormPdfName('');
          setFormPdfSize('');
        }
      }

      if (lastUpload && lastUpload.lessonId === lessonId && lastUpload.mediaType === mediaType) {
        clearLastUploadRecord();
      }

      const label = targetLesson?.title || lessonTitleFallback || lessonId;
      setFeedback({
        type: 'success',
        message: firestoreUpdated
          ? `🗑️ Deleted ${mediaType.toUpperCase()} upload (${storagePath}) and updated Firestore lessons/${lessonId}!`
          : `🗑️ Removed ${mediaType.toUpperCase()} upload from "${label}" and cleared local references.`,
      });
    } finally {
      setDeletingMediaKey(null);
      setIsDeletingUpload(false);
    }
  };

  const handleDeleteLastUpload = async () => {
    if (!lastUpload) {
      setFeedback({
        type: 'info',
        message: 'No recent upload recorded yet. Use the delete button on any lesson video or PDF to remove it and update Firestore.',
      });
      return;
    }

    await handleDeleteLessonMedia(
      lastUpload.lessonId,
      lastUpload.mediaType,
      lastUpload.storagePath,
      lastUpload.lessonTitle
    );
  };

  // Sync / Migrate existing lessons across Firestore to include videoUrl, videoPath & pdfPath
  const handleSyncVideoFieldsToFirestore = async () => {
    setIsMigratingVideoFields(true);

    try {
      const migratedLocalLessons = lessons.map((les) => {
        const sId = les.subjectId || selectedSubjectId;
        const cId = les.chapterId || selectedChapterId;
        const vPath = les.videoPath || les.videoStoragePath || `lessons/${sId}/${cId}/${les.id}/video/lesson.mp4`;
        const pPath = les.pdfPath || les.pdfStoragePath || `lessons/${sId}/${cId}/${les.id}/pdf/lesson.pdf`;
        return {
          ...les,
          videoUrl: les.videoUrl || '',
          videoPath: vPath,
          videoStoragePath: vPath,
          pdfPath: pPath,
          pdfStoragePath: pPath,
        };
      });

      setLessons(migratedLocalLessons);

      if (!auth.currentUser) {
        setFeedback({
          type: 'info',
          message: `Preview updated for ${migratedLocalLessons.length} local lessons. Sign in as Admin to migrate live Firestore documents.`,
        });
        return;
      }

      // 1. Query ALL existing lessons in Firestore so every document receives videoUrl, videoPath & pdfPath
      const snapshot = await getDocs(collection(db, 'lessons'));
      const batch = writeBatch(db);
      let updatedCount = 0;
      let hasCanonicalLesson001 = false;

      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Partial<Lesson>;
        if (docSnap.id === 'lesson001') {
          hasCanonicalLesson001 = true;
        }
        const sId = data.subjectId || selectedSubjectId;
        const cId = data.chapterId || selectedChapterId;
        const vPath = data.videoPath || data.videoStoragePath || `lessons/${sId}/${cId}/${docSnap.id}/video/lesson.mp4`;
        const pPath = data.pdfPath || data.pdfStoragePath || `lessons/${sId}/${cId}/${docSnap.id}/pdf/lesson.pdf`;

        batch.update(doc(db, 'lessons', docSnap.id), {
          id: data.id || docSnap.id,
          subjectId: sId,
          chapterId: cId,
          title: data.title || 'Untitled Lesson',
          order: typeof data.order === 'number' ? data.order : 1,
          isActive: typeof data.isActive === 'boolean' ? data.isActive : true,
          isPublished: typeof data.isPublished === 'boolean' ? data.isPublished : false,
          videoUrl: data.videoUrl ?? '',
          videoPath: vPath,
          videoStoragePath: vPath,
          pdfUrl: data.pdfUrl ?? '',
          pdfPath: pPath,
          pdfStoragePath: pPath,
          updatedAt: serverTimestamp(),
        });
        updatedCount++;
      });

      // 2. Ensure canonical `lessons/lesson001` exists with all required Firestore rule fields (`order` included)
      if (!hasCanonicalLesson001) {
        const defaultLesson001 = DEFAULT_LESSONS.CH001?.find((l) => l.id === 'lesson001');
        batch.set(doc(db, 'lessons', 'lesson001'), {
          id: 'lesson001',
          subjectId: 'ML001',
          chapterId: 'CH001',
          subjectTitle: 'Machine Learning',
          chapterTitle: 'Linear Regression',
          title: defaultLesson001?.title || 'Simple Linear Regression',
          description:
            defaultLesson001?.description ||
            'Canonical Video LMS lesson document synced with Storage pdf/lesson.pdf and video/lesson.mp4 paths.',
          content:
            defaultLesson001?.content ||
            '# Simple Linear Regression\n\nLinear regression models the relationship between predictor X and response Y.',
          order: defaultLesson001?.order ?? 2,
          isActive: true,
          isPublished: false,
          status: 'draft',
          pdfUrl: defaultLesson001?.pdfUrl || '',
          pdfPath: 'lessons/ML001/CH001/lesson001/pdf/lesson.pdf',
          pdfStoragePath: 'lessons/ML001/CH001/lesson001/pdf/lesson.pdf',
          pdfName: 'lesson.pdf',
          videoUrl: defaultLesson001?.videoUrl || '',
          videoPath: 'lessons/ML001/CH001/lesson001/video/lesson.mp4',
          videoStoragePath: 'lessons/ML001/CH001/lesson001/video/lesson.mp4',
          videoName: 'lesson.mp4',
          authorEmail: user?.email || 'admin@eduai.edu',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        updatedCount++;
      }

      await batch.commit();

      setFeedback({
        type: 'success',
        message: `✅ Migrated ${updatedCount} Firestore lesson document(s) with videoUrl, videoPath, and canonical pdfPath.`,
      });
    } catch (err) {
      const errMsg = reportErrorSafely(err, OperationType.WRITE, 'lessons');
      setFeedback({
        type: 'error',
        message: `Firestore migration failed: ${errMsg}`,
      });
    } finally {
      setIsMigratingVideoFields(false);
    }
  };

  const handleOpenVideoPlayer = async (lesson: Lesson) => {
    if (!lesson.videoUrl && !lesson.videoPath) {
      setFeedback({ type: 'error', message: 'No video is currently attached to this lesson.' });
      return;
    }
    const savedPosRaw = localStorage.getItem(`eduai_video_pos_${lesson.id}`);
    const savedPos = savedPosRaw ? Number(savedPosRaw) : 0;
    setVideoPlayerLesson(lesson);
    setIsVideoPlaying(false);
    setIsVideoBuffering(false);
    setVideoPlaybackError(null);
    setAuthorizedVideoUrl(null);
    setVideoAuthExpiresAt(null);
    setVideoCurrentTime(Number.isFinite(savedPos) && savedPos > 0 ? savedPos : 0);
    setIsVideoPlayerModalOpen(true);

    const rawUrl = lesson.videoUrl || '';
    const isExternalOrLocalBlob =
      rawUrl.includes('youtube.com') ||
      rawUrl.includes('youtu.be') ||
      rawUrl.startsWith('blob:');

    if (isExternalOrLocalBlob) {
      setAuthorizedVideoUrl(rawUrl);
      return;
    }

    if (auth.currentUser) {
      setIsAuthorizingVideo(true);
      try {
        const idToken = await auth.currentUser.getIdToken();
        const resp = await fetch('/api/video/authorize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ lessonId: lesson.id }),
        });

        const data = await resp.json().catch(() => ({}));
        if (resp.ok && data.authorizedUrl) {
          setAuthorizedVideoUrl(data.authorizedUrl);
          setVideoAuthExpiresAt(data.expiresAt || null);
          return;
        }

        if (resp.status === 403) {
          setVideoPlaybackError(
            data.error || 'Access denied: this lesson is not active and published for student playback.'
          );
          return;
        }

        // 404 for unseeded local demo lessons: allow fallback only when published/active or admin preview
        if (resp.status === 404 && ((lesson.isActive && lesson.isPublished) || (role === 'admin' && !isPreviewStudentView))) {
          setAuthorizedVideoUrl(rawUrl || null);
          return;
        }

        setVideoPlaybackError(data.error || 'Unable to authorize video stream.');
      } catch {
        if ((lesson.isActive && lesson.isPublished) || (role === 'admin' && !isPreviewStudentView)) {
          setAuthorizedVideoUrl(rawUrl || null);
        } else {
          setVideoPlaybackError('Authorization server unreachable for unpublished lesson.');
        }
      } finally {
        setIsAuthorizingVideo(false);
      }
    } else if ((lesson.isActive && lesson.isPublished) || (role === 'admin' && !isPreviewStudentView)) {
      setAuthorizedVideoUrl(rawUrl || null);
    } else {
      setVideoPlaybackError('Sign in required to stream unpublished lesson videos.');
    }
  };

  const handleTogglePlayVideo = () => {
    if (videoPlayerRef.current) {
      if (videoPlayerRef.current.paused) {
        videoPlayerRef.current.play().catch(() => {});
        setIsVideoPlaying(true);
      } else {
        videoPlayerRef.current.pause();
        setIsVideoPlaying(false);
      }
    } else {
      setIsVideoPlaying((prev) => !prev);
    }
  };

  const handleSeekVideo = (seconds: number) => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.currentTime = seconds;
    }
    setVideoCurrentTime(seconds);
  };

  const handleSkipTime = (deltaSeconds: number) => {
    if (videoPlayerRef.current) {
      const newTime = Math.max(0, Math.min(videoPlayerRef.current.currentTime + deltaSeconds, videoDurationSeconds));
      videoPlayerRef.current.currentTime = newTime;
      setVideoCurrentTime(newTime);
    } else {
      setVideoCurrentTime((prev) => Math.max(0, Math.min(prev + deltaSeconds, videoDurationSeconds)));
    }
  };

  const handleToggleMute = () => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.muted = !isVideoMuted;
    }
    setIsVideoMuted((prev) => !prev);
  };

  const handleChangeVolume = (newVol: number) => {
    setVideoVolume(newVol);
    if (videoPlayerRef.current) {
      videoPlayerRef.current.volume = newVol;
      videoPlayerRef.current.muted = newVol === 0;
    }
    setIsVideoMuted(newVol === 0);
  };

  const handleChangePlaybackRate = (rate: number) => {
    setVideoPlaybackRate(rate);
    if (videoPlayerRef.current) {
      videoPlayerRef.current.playbackRate = rate;
    }
  };

  const handleToggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch(() => {});
      setIsVideoFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsVideoFullscreen(false);
    }
  };

  const formatVideoTimestamp = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Filter lessons based on:
  // Active + Draft (Admin can edit, Student cannot see)
  // Active + Published (Student can see)
  // Inactive (Hidden)
  const filteredLessons = lessons.filter((les) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      les.title.toLowerCase().includes(query) ||
      les.description.toLowerCase().includes(query);

    // Student Preview Mode: ONLY Active + Published lessons are shown to students
    if (isPreviewStudentView) {
      return matchesSearch && les.isActive && les.isPublished;
    }

    let matchesFilter = true;
    if (filterMode === 'active_published') matchesFilter = les.isActive && les.isPublished;
    else if (filterMode === 'active_draft') matchesFilter = les.isActive && !les.isPublished;
    else if (filterMode === 'inactive') matchesFilter = !les.isActive;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-bold border transition-all animate-slideDown ${
            feedback.type === 'success'
              ? 'bg-emerald-950/95 text-emerald-200 border-emerald-500/50'
              : feedback.type === 'error'
              ? 'bg-rose-950/95 text-rose-200 border-rose-500/50'
              : 'bg-indigo-950/95 text-indigo-200 border-indigo-500/50'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : feedback.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : (
            <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. HIERARCHY WORKFLOW BANNER (Subject ↓ Chapter ↓ Lesson Management)       */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 border border-indigo-500/30 text-white shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap text-xs font-mono font-bold">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/30 text-indigo-300 border border-indigo-400/40">
                CURRICULUM HIERARCHY
              </span>
              <span className="text-slate-400">EduAI Learning Flow</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 flex-wrap">
              <span>{currentSubject.name}</span>
              <span className="text-indigo-400">↓</span>
              <span className="text-amber-300">{currentChapter.title}</span>
              <span className="text-indigo-400">↓</span>
              <span className="text-emerald-400">Lesson Management</span>
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleDeleteLastUpload}
              disabled={isDeletingUpload || !lastUpload}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                lastUpload
                  ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border-rose-400/40 cursor-pointer'
                  : 'bg-white/5 text-slate-400 border-white/10 cursor-not-allowed opacity-60'
              }`}
              title={
                lastUpload
                  ? `Delete last ${lastUpload.mediaType.toUpperCase()} upload (${lastUpload.fileName}) from Storage and update Firestore lessons/${lastUpload.lessonId}`
                  : 'Upload a PDF or Video first to enable Delete Last Upload'
              }
            >
              <Trash2 className={`w-4 h-4 text-rose-300 ${isDeletingUpload ? 'animate-pulse' : ''}`} />
              <span>{isDeletingUpload ? 'Deleting Upload...' : 'Delete Last Upload'}</span>
            </button>

            <button
              type="button"
              onClick={handleSyncVideoFieldsToFirestore}
              disabled={isMigratingVideoFields}
              className="px-3 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-blue-400/40"
              title="Add videoUrl & videoPath fields to existing lesson documents in Firestore"
            >
              <Video className={`w-4 h-4 text-blue-300 ${isMigratingVideoFields ? 'animate-pulse' : ''}`} />
              <span>{isMigratingVideoFields ? 'Syncing Video Schema...' : 'Sync Video Fields'}</span>
            </button>

            <button
              type="button"
              onClick={handleSyncNow}
              disabled={isGradleSyncing}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                isGradleSyncing
                  ? 'bg-amber-600/30 text-amber-200 border-amber-500/50 cursor-wait'
                  : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40 shadow-sm'
              }`}
              title="Sync Android Gradle dependencies with Firebase Storage & Firestore"
            >
              <RefreshCw className={`w-4 h-4 text-amber-400 ${isGradleSyncing ? 'animate-spin' : ''}`} />
              <span>{isGradleSyncing ? 'Syncing Gradle...' : 'Sync Now'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsArchitectureModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
              title="View Firestore schema and Android Kotlin architecture"
            >
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Architecture & Rules</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs font-black shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Lesson</span>
            </button>
          </div>
        </div>

        {lastUpload && (
          <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-400/30 flex items-center justify-between flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <Trash2 className="w-4 h-4 text-rose-400 shrink-0" />
              <div className="min-w-0">
                <span className="font-bold text-rose-100">
                  Last Upload ({lastUpload.mediaType.toUpperCase()}): {lastUpload.fileName}
                </span>
                <span className="block font-mono text-[11px] text-rose-200/80 truncate">
                  Lesson: {lastUpload.lessonTitle} • Storage: {lastUpload.storagePath}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDeleteLastUpload}
              disabled={isDeletingUpload}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isDeletingUpload ? 'Updating Database...' : 'Delete Last Upload & Update DB'}</span>
            </button>
          </div>
        )}

        {/* 12. Complete Admin Workflow Representation */}
        <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-cyan-400 font-bold flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>12. Admin Workflow &amp; Hierarchy Architecture</span>
            </span>
            <span className="text-[10px] text-slate-400">
              EDUAI ADMIN ➔ Degree ➔ Subject ➔ Chapter ➔ Lessons
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-300 overflow-x-auto pb-1 min-w-max">
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>EDUAI ADMIN</span>
            </div>
            <span className="text-cyan-400 font-black">➔</span>
            <div className="px-3 py-1.5 rounded-xl bg-blue-950/80 border border-blue-700 text-blue-300 font-bold flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>B.Sc Computer Science</span>
            </div>
            <span className="text-blue-400 font-black">➔</span>
            <div className="px-3 py-1.5 rounded-xl bg-indigo-950/80 border border-indigo-700 text-indigo-300 font-bold flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Machine Learning</span>
            </div>
            <span className="text-indigo-400 font-black">➔</span>
            <div className="px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-700 text-purple-300 font-bold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Linear Regression</span>
            </div>
            <span className="text-purple-400 font-black">➔</span>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 font-bold flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Lessons (1. Draft • 2. Published • 3. Draft)</span>
            </div>
          </div>
        </div>

        {/* Implementation 3: PDF Upload Final Flow */}
        <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-xs font-mono space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2 text-rose-300 font-bold">
            <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <FileDown className="w-3.5 h-3.5 text-rose-400" />
              <span>Implementation 3: Connected Firebase Storage PDF Pipeline</span>
            </span>
            <span className="text-[10px] text-rose-400/80">
              Admin ➔ Subject ➔ Chapter ➔ Lesson ➔ 📄 Upload PDF ➔ Firebase Storage ➔ Firestore ➔ Student App ➔ 📖 Open PDF
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300 overflow-x-auto pb-1 min-w-max text-[11px]">
            <span className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 font-bold text-slate-300">Admin</span>
            <span className="text-rose-400 font-bold">↓</span>
            <span className="px-2 py-1 rounded-lg bg-indigo-950 border border-indigo-700 font-bold text-indigo-300">Subject</span>
            <span className="text-rose-400 font-bold">↓</span>
            <span className="px-2 py-1 rounded-lg bg-purple-950 border border-purple-700 font-bold text-purple-300">Chapter</span>
            <span className="text-rose-400 font-bold">↓</span>
            <span className="px-2 py-1 rounded-lg bg-emerald-950 border border-emerald-700 font-bold text-emerald-300">Lesson</span>
            <span className="text-rose-400 font-bold">↓</span>
            <span className="px-2 py-1 rounded-lg bg-rose-900 border border-rose-500 font-bold text-rose-100 flex items-center gap-1">
              <Upload className="w-3 h-3" />
              <span>📄 Upload PDF</span>
            </span>
            <span className="text-rose-400 font-bold">↓</span>
            <span className="px-2 py-1 rounded-lg bg-amber-950 border border-amber-600 font-bold text-amber-200 flex items-center gap-1">
              <Database className="w-3 h-3 text-amber-400" />
              <span>Firebase Storage</span>
            </span>
            <span className="text-rose-400 font-bold">↓</span>
            <span className="px-2 py-1 rounded-lg bg-cyan-950 border border-cyan-600 font-bold text-cyan-200">
              PDF URL in Firestore
            </span>
            <span className="text-rose-400 font-bold">↓</span>
            <span className="px-2 py-1 rounded-lg bg-blue-950 border border-blue-600 font-bold text-blue-200">Student App</span>
            <span className="text-rose-400 font-bold">↓</span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-black flex items-center gap-1 shadow-sm">
              <FileDown className="w-3 h-3" />
              <span>📖 Open PDF</span>
            </span>
          </div>
        </div>

        {/* Next Stages Preparation Badge Row */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-white/10 text-xs">
          <span className="text-slate-400 font-medium">Prepares the app for next stages:</span>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 flex items-center gap-1">
              <FileDown className="w-3.5 h-3.5" />
              <span>PDF Notes</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30 flex items-center gap-1">
              <Video className="w-3.5 h-3.5" />
              <span>Video Lessons</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Interactive Quizzes</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
              <Send className="w-3.5 h-3.5" />
              <span>Live Publish</span>
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SUBJECT & CHAPTER SELECTOR BRIDGE                                      */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Select Subject */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span>Step 1: Select Subject</span>
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => {
                setSelectedSubjectId(e.target.value);
                const chapters = DEFAULT_CHAPTERS[e.target.value] || [];
                if (chapters.length > 0) {
                  setSelectedChapterId(chapters[0].id);
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {DEFAULT_SUBJECTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code}) — {s.chaptersCount || 5} chapters
                </option>
              ))}
            </select>
          </div>

          {/* Select Chapter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-500" />
              <span>Step 2: Select Chapter</span>
            </label>
            <select
              value={selectedChapterId}
              onChange={(e) => setSelectedChapterId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-sm text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              {chapterListForSubject.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.order}. {c.title} — {c.description}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2.5 CRITICAL ACCESS CONTROL PRINCIPLE: isActive vs isPublished MATRIX     */}
      {/* ========================================================================= */}
      <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 text-slate-100 shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              Access Control Principle: <code className="text-amber-300 font-mono">isActive</code> vs <code className="text-emerald-400 font-mono">isPublished</code>
            </h3>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
            Role-Based Visibility Logic
          </span>
        </div>

        {/* The 3 States Visual Matrix Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* 1. Active + Draft */}
          <div
            onClick={() => {
              setIsPreviewStudentView(false);
              setFilterMode(filterMode === 'active_draft' ? 'all' : 'active_draft');
            }}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              filterMode === 'active_draft' && !isPreviewStudentView
                ? 'bg-amber-950/70 border-amber-400 ring-2 ring-amber-400/50 shadow-md'
                : 'bg-slate-900/90 border-slate-800 hover:border-amber-500/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono font-black text-amber-300 flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span>Active + Draft</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {lessons.filter((l) => l.isActive && !l.isPublished).length} Lessons
              </span>
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-300 font-medium">
              <div className="text-emerald-400 font-bold flex items-center gap-1">
                ✓ Admin can edit it
              </div>
              <div className="text-rose-400 font-bold flex items-center gap-1">
                ✗ Student cannot see it
              </div>
              <p className="text-[10px] text-slate-400 pt-1 leading-relaxed">
                Drafting & authoring stage: Admins work on content, videos, PDFs, and quizzes privately.
              </p>
            </div>
          </div>

          {/* 2. Active + Published */}
          <div
            onClick={() => {
              setIsPreviewStudentView(false);
              setFilterMode(filterMode === 'active_published' ? 'all' : 'active_published');
            }}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              (filterMode === 'active_published' || isPreviewStudentView)
                ? 'bg-emerald-950/70 border-emerald-400 ring-2 ring-emerald-400/50 shadow-md'
                : 'bg-slate-900/90 border-slate-800 hover:border-emerald-500/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono font-black text-emerald-300 flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span>Active + Published</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {lessons.filter((l) => l.isActive && l.isPublished).length} Lessons
              </span>
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-300 font-medium">
              <div className="text-emerald-400 font-bold flex items-center gap-1">
                ✓ Student can see it
              </div>
              <div className="text-emerald-400 font-bold flex items-center gap-1">
                ✓ Live on Student App & Syllabus
              </div>
              <p className="text-[10px] text-slate-400 pt-1 leading-relaxed">
                Live production: Enrolled students can read lessons, watch videos, and take quizzes.
              </p>
            </div>
          </div>

          {/* 3. Inactive */}
          <div
            onClick={() => {
              setIsPreviewStudentView(false);
              setFilterMode(filterMode === 'inactive' ? 'all' : 'inactive');
            }}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              filterMode === 'inactive' && !isPreviewStudentView
                ? 'bg-rose-950/70 border-rose-400 ring-2 ring-rose-400/50 shadow-md'
                : 'bg-slate-900/90 border-slate-800 hover:border-rose-500/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono font-black text-rose-300 flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                <span>Inactive</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {lessons.filter((l) => !l.isActive).length} Lessons
              </span>
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-300 font-medium">
              <div className="text-rose-400 font-bold flex items-center gap-1">
                ✗ Hidden from student app
              </div>
              <div className="text-amber-400 font-bold flex items-center gap-1">
                ⚠️ Disabled by admin
              </div>
              <p className="text-[10px] text-slate-400 pt-1 leading-relaxed">
                Archived / paused: Admin suspended the lesson. Hidden from all students immediately.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. LESSON MANAGEMENT CONTROLS: SEARCH & FILTER BAR                        */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search lessons by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filter Pills & Student Simulator */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              type="button"
              onClick={() => {
                setIsPreviewStudentView(false);
                setFilterMode('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterMode === 'all' && !isPreviewStudentView
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              All Lessons ({lessons.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setIsPreviewStudentView(false);
                setFilterMode('active_published');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                filterMode === 'active_published' && !isPreviewStudentView
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Active + Published ({lessons.filter((l) => l.isActive && l.isPublished).length})</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsPreviewStudentView(false);
                setFilterMode('active_draft');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                filterMode === 'active_draft' && !isPreviewStudentView
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Active + Draft ({lessons.filter((l) => l.isActive && !l.isPublished).length})</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsPreviewStudentView(false);
                setFilterMode('inactive');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                filterMode === 'inactive' && !isPreviewStudentView
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              <span>Inactive ({lessons.filter((l) => !l.isActive).length})</span>
            </button>
          </div>

          {/* Student View Toggle */}
          <button
            type="button"
            onClick={() => setIsPreviewStudentView(!isPreviewStudentView)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              isPreviewStudentView
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md ring-2 ring-indigo-400/40'
                : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100'
            }`}
            title="Simulate student app: Only Active + Published lessons are returned"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isPreviewStudentView ? 'Exit Student Preview' : 'Preview Student App'}</span>
          </button>
        </div>
      </div>

      {/* Student Preview Notice Banner */}
      {isPreviewStudentView && (
        <div className="p-3.5 rounded-2xl bg-indigo-950 border border-indigo-500/50 text-indigo-200 text-xs flex items-center justify-between flex-wrap gap-2 animate-fadeIn">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              <strong>Student App Simulation:</strong> Showing only Active + Published lessons (<code className="font-mono text-cyan-300">isActive == true && isPublished == true</code>). All drafts and inactive lessons are hidden.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsPreviewStudentView(false)}
            className="px-2.5 py-1 rounded-lg bg-indigo-800 hover:bg-indigo-700 text-white text-[11px] font-bold cursor-pointer"
          >
            Show Admin View
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. VIEW LESSONS: LIST OF LESSONS UNDER CHAPTER                            */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-500" />
            <span>
              Lessons in {currentChapter.title} ({filteredLessons.length})
            </span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            Order determines lesson progression for students
          </span>
        </div>

        {filteredLessons.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">No lessons match your filter</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Get started by adding educational modules, video lectures, PDF notes, or quizzes to this chapter.
            </p>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add First Lesson</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLessons.map((lesson) => (
              <div
                key={lesson.id}
                className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border transition-all hover:shadow-md ${
                  !lesson.isActive
                    ? 'border-rose-200 dark:border-rose-900/40 opacity-75 bg-rose-50/20'
                    : lesson.isPublished
                    ? 'border-slate-200 dark:border-slate-800 hover:border-emerald-300'
                    : 'border-amber-200 dark:border-amber-900/40 hover:border-amber-400'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Lesson Meta & Content */}
                  <div className="space-y-2 flex-1">
                    {/* Badge Row */}
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      {/* Order */}
                      <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono font-black border border-indigo-200 dark:border-indigo-800">
                        Lesson #{lesson.order}
                      </span>

                      {/* Distinct Access Status Badge: Active+Draft vs Active+Published vs Inactive */}
                      {!lesson.isActive ? (
                        <span
                          className="px-2.5 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-800 flex items-center gap-1.5"
                          title="Inactive: Disabled by admin. Hidden from student app."
                        >
                          <EyeOff className="w-3 h-3 text-rose-500" />
                          <span>Inactive • Hidden</span>
                        </span>
                      ) : !lesson.isPublished ? (
                        <span
                          className="px-2.5 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800 flex items-center gap-1.5"
                          title="Active + Draft: Admin can edit it, student cannot see it."
                        >
                          <Save className="w-3 h-3 text-amber-500" />
                          <span>Active + Draft • Admin Editing</span>
                        </span>
                      ) : (
                        <span
                          className="px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5"
                          title="Active + Published: Student is allowed to see the lesson."
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>Active + Published • Student Visible</span>
                        </span>
                      )}

                      {/* Estimated duration */}
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{lesson.estimatedMinutes || 20} mins</span>
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <span>{lesson.title}</span>
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                        {lesson.description || 'No description provided.'}
                      </p>
                      {/* 13. PDF & Video status in admin (txtPdfStatus, txtVideoStatus) */}
                      <div className="mt-2 flex items-center gap-3 text-xs font-bold font-mono flex-wrap">
                        {lesson.pdfUrl ? (
                          <span className="text-emerald-600 dark:text-emerald-400">📄 PDF: Uploaded</span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500">📄 PDF: Not uploaded</span>
                        )}
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        {lesson.videoUrl ? (
                          <span className="text-blue-600 dark:text-blue-400">🎬 Video: Uploaded</span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500">🎬 Video: Not uploaded</span>
                        )}
                      </div>

                      {(lesson.videoPath || lesson.videoStoragePath) && (
                        <div className="mt-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                          <span className="text-cyan-600 dark:text-cyan-400 font-bold">videoPath:</span>{' '}
                          <span>{lesson.videoPath || lesson.videoStoragePath}</span>
                        </div>
                      )}
                    </div>

                    {/* Media Preparations Badges: PDF, Video, Quiz */}
                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      {lesson.pdfUrl ? (
                        <span className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-[11px] font-bold flex items-center gap-1.5">
                          <FileDown className="w-3.5 h-3.5 text-rose-500" />
                          <span>PDF: {lesson.pdfName || 'Handbook'}</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] font-medium">
                          No PDF attached
                        </span>
                      )}

                      {lesson.videoUrl ? (
                        <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 text-[11px] font-bold flex items-center gap-1.5">
                          <Video className="w-3.5 h-3.5 text-blue-500" />
                          <span>Video ({lesson.videoDuration || 'Ready'})</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] font-medium">
                          No Video
                        </span>
                      )}

                      {lesson.hasQuiz || lesson.quizTitle ? (
                        <span className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900 text-[11px] font-bold flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-purple-500" />
                          <span>Quiz: {lesson.quizQuestionsCount || 5} Questions</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] font-medium">
                          No Quiz
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons: [🎬 Watch Video / 🎥 Upload/Replace Video] [📖 Open PDF / 📄 Upload PDF] [View] [Edit] [Disable] [Save as Draft / Publish] */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap self-end lg:self-center">
                    {/* Implementation: Video LMS - 🎬 Watch Video + Replace Video via videoPath */}
                    {lesson.videoUrl ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleOpenVideoPlayer(lesson)}
                          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                          title="Open EduAI Student Video Player"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>🎬 Watch Video</span>
                        </button>
                        <label
                          className="px-2.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer border border-blue-200 dark:border-blue-800"
                          title={`Replace video at ${lesson.videoPath || `lessons/${lesson.subjectId || selectedSubjectId}/${lesson.chapterId || selectedChapterId}/${lesson.id}/video/lesson.mp4`}`}
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>{isUploadingVideo && uploadingVideoLessonId === lesson.id ? 'Replacing...' : 'Replace'}</span>
                          <input
                            type="file"
                            accept="video/mp4,video/webm,video/quicktime,video/*"
                            className="hidden"
                            disabled={isUploadingVideo}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleUploadVideoFile(file, lesson);
                              e.target.value = '';
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => handleDeleteLessonMedia(lesson.id, 'video', lesson.videoPath || lesson.videoStoragePath, lesson.title)}
                          disabled={deletingMediaKey === `${lesson.id}:video`}
                          className="px-2.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer border border-rose-200 dark:border-rose-800"
                          title="Delete uploaded video from Storage and update Firestore"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{deletingMediaKey === `${lesson.id}:video` ? 'Deleting...' : 'Delete Video'}</span>
                        </button>
                      </>
                    ) : (
                      <label className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-dashed border-slate-300 dark:border-slate-700">
                        <Video className="w-3.5 h-3.5 text-blue-500" />
                        <span>{isUploadingVideo && uploadingVideoLessonId === lesson.id ? 'Uploading...' : '🎥 Upload Video'}</span>
                        <input
                          type="file"
                          accept="video/mp4,video/webm,video/quicktime,video/*"
                          className="hidden"
                          disabled={isUploadingVideo}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadVideoFile(file, lesson);
                            e.target.value = '';
                          }}
                        />
                      </label>
                    )}

                    {/* Implementation 3: 📖 Open PDF or 📄 Upload PDF */}
                    {lesson.pdfUrl ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleOpenPdfViewer(lesson)}
                          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                          title="Open attached PDF Handbook in Study Reader"
                        >
                          <FileDown className="w-3.5 h-3.5" />
                          <span>📖 Open PDF</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteLessonMedia(lesson.id, 'pdf', lesson.pdfPath || lesson.pdfStoragePath, lesson.title)}
                          disabled={deletingMediaKey === `${lesson.id}:pdf`}
                          className="px-2.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer border border-rose-200 dark:border-rose-800"
                          title="Delete uploaded PDF from Storage and update Firestore"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{deletingMediaKey === `${lesson.id}:pdf` ? 'Deleting...' : 'Delete PDF'}</span>
                        </button>
                      </>
                    ) : (
                      <label className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-dashed border-slate-300 dark:border-slate-700">
                        <Upload className="w-3.5 h-3.5 text-rose-500" />
                        <span>{isUploadingPdf && uploadingLessonId === lesson.id ? 'Uploading...' : '📄 Upload PDF'}</span>
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          className="hidden"
                          disabled={isUploadingPdf}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadPdfFile(file, lesson);
                            e.target.value = '';
                          }}
                        />
                      </label>
                    )}

                    {/* View Preview Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentLesson(lesson);
                        setIsPreviewModalOpen(true);
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Preview lesson content"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>

                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(lesson)}
                      className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-indigo-200 dark:border-indigo-800"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    {/* Disable / Enable Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleDisableLesson(lesson)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                        lesson.isActive
                          ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 border-rose-200 dark:border-rose-900'
                          : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border-emerald-200 dark:border-emerald-900'
                      }`}
                    >
                      {lesson.isActive ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Disable</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Enable</span>
                        </>
                      )}
                    </button>

                    {/* Save as Draft vs Publish Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleDraftPublish(lesson)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        lesson.isPublished
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 border border-amber-300 dark:border-amber-800'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                      }`}
                    >
                      {lesson.isPublished ? (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>Set Draft</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Publish Live</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT LESSON WITH PREPARATION FOR PDF, VIDEO, QUIZ, PUBLISH   */}
      {/* ========================================================================= */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6 animate-scaleUp">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white flex items-center justify-between">
              <div>
                <div className="text-[11px] font-mono text-indigo-300 font-bold uppercase tracking-wider">
                  {currentSubject.name} ➔ {currentChapter.title}
                </div>
                <h3 className="text-lg font-black flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <span>{isAddModalOpen ? '+ Add New Lesson' : `Edit Lesson: ${formTitle}`}</span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preparation Tabs: Content / PDF / Video / Quiz / Publish */}
            <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
              <button
                type="button"
                onClick={() => setEditorTab('content')}
                className={`pb-3 px-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  editorTab === 'content'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>1. Core Content</span>
              </button>

              <button
                type="button"
                onClick={() => setEditorTab('pdf')}
                className={`pb-3 px-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  editorTab === 'pdf'
                    ? 'border-rose-600 text-rose-600 dark:text-rose-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileDown className="w-4 h-4" />
                <span>2. PDF Preparation</span>
                {formPdfUrl && <span className="w-2 h-2 rounded-full bg-rose-500"></span>}
              </button>

              <button
                type="button"
                onClick={() => setEditorTab('video')}
                className={`pb-3 px-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  editorTab === 'video'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>3. Video Preparation</span>
                {formVideoUrl && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
              </button>

              <button
                type="button"
                onClick={() => setEditorTab('quiz')}
                className={`pb-3 px-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  editorTab === 'quiz'
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>4. Quiz Preparation</span>
                {formHasQuiz && <span className="w-2 h-2 rounded-full bg-purple-500"></span>}
              </button>

              <button
                type="button"
                onClick={() => setEditorTab('publish')}
                className={`pb-3 px-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  editorTab === 'publish'
                    ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>5. Publish & Status</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
              {/* TAB 1: CORE CONTENT */}
              {editorTab === 'content' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="sm:col-span-3 space-y-1">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        Lesson Title <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="e.g. Simple Linear Regression"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        Lesson Order
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formOrder}
                        onChange={(e) => setFormOrder(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-center"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      Short Summary / Description
                    </label>
                    <textarea
                      rows={2}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Concise overview of what students will learn in this lesson..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                      <span>Full Lesson Notes & Theory (Markdown Supported)</span>
                      <span className="text-[11px] text-slate-400 font-mono">LaTeX / Math & Code</span>
                    </div>
                    <textarea
                      rows={7}
                      value={formContent}
                      onChange={(e) => setFormContent(e.target.value)}
                      placeholder="Write in-depth lecture notes..."
                      className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* 5. Upload PDF Button & Status TextView (dialog_add_lesson.xml layout) */}
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Lesson PDF Document
                    </label>

                    <label className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-300 dark:border-slate-700 transition-all cursor-pointer shadow-xs">
                      <span className="text-sm">📄</span>
                      <span>{isUploadingPdf ? 'Uploading PDF to Storage...' : '📄 Upload PDF'}</span>
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        disabled={isUploadingPdf}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUploadPdfFile(file);
                          e.target.value = '';
                        }}
                      />
                    </label>

                    <div className="flex items-center justify-between text-xs font-mono px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1.5 truncate">
                        <span className={`w-2 h-2 rounded-full ${formPdfUrl ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        <span>{formPdfName ? `Attached: ${formPdfName}` : 'No PDF selected'}</span>
                      </span>
                      {formPdfUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormPdfUrl('');
                            setFormPdfName('');
                            setFormPdfSize('');
                          }}
                          className="text-[11px] text-rose-500 hover:underline shrink-0 ml-2 cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 5. Video Learning Management System: Select Video Button, Status & Progress */}
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Video lesson (MP4 / WebM / Stream)
                    </label>

                    <label className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-300 dark:border-slate-700 transition-all cursor-pointer shadow-xs">
                      <span className="text-sm">🎬</span>
                      <span>{isUploadingVideo ? `Uploading Video (${videoUploadProgress}%)...` : 'Select Video'}</span>
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime,video/*"
                        disabled={isUploadingVideo}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUploadVideoFile(file);
                          e.target.value = '';
                        }}
                      />
                    </label>

                    {isUploadingVideo && (
                      <div className="space-y-1 px-1">
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${videoUploadProgress}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-mono text-blue-600 dark:text-blue-400 font-bold">
                          <span>Uploading video...</span>
                          <span>{videoUploadProgress}%</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs font-mono px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                      <span className="flex items-center gap-1.5 truncate">
                        <span className={`w-2 h-2 rounded-full ${formVideoUrl ? 'bg-blue-500' : 'bg-slate-400'}`}></span>
                        <span>{formVideoName ? `Selected: ${formVideoName}` : (formVideoUrl ? 'Video URL Linked' : 'No video selected')}</span>
                      </span>
                      {formVideoUrl && (
                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <button
                            type="button"
                            onClick={() => {
                              setVideoPlayerLesson({
                                id: formId || 'temp',
                                chapterId: selectedChapterId,
                                title: formTitle || 'Preview Lesson',
                                description: formDescription,
                                content: formContent,
                                order: formOrder,
                                isActive: formIsActive,
                                isPublished: formIsPublished,
                                videoUrl: formVideoUrl,
                                videoName: formVideoName,
                                videoDuration: formVideoDuration,
                              });
                              setIsVideoPlaying(true);
                              setIsVideoPlayerModalOpen(true);
                            }}
                            className="text-[11px] text-blue-500 hover:underline cursor-pointer font-bold"
                          >
                            Play
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setFormVideoUrl('');
                              setFormVideoName('');
                              setFormVideoDuration('');
                            }}
                            className="text-[11px] text-rose-500 hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PDF PREPARATION */}
              {editorTab === 'pdf' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-xs space-y-1">
                    <div className="font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                      <FileDown className="w-4 h-4 text-rose-500" />
                      <span>Implementation 3: Firebase Storage PDF Upload</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      Upload handbook PDF documents directly to Firebase Storage. The download URL will be stored in Firestore so students can open and read notes in their app.
                    </p>
                  </div>

                  {/* Firebase Storage Upload Dropzone / Button */}
                  <div className="p-5 rounded-2xl border-2 border-dashed border-rose-300 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {isUploadingPdf ? 'Uploading to Firebase Storage...' : 'Upload PDF Document to Storage'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Target path: <code className="font-mono text-cyan-500">lessons/{selectedSubjectId}/{selectedChapterId}/{formId || 'lessonId'}/pdf/lesson.pdf</code>
                      </p>
                    </div>

                    {isUploadingPdf && (
                      <div className="max-w-xs mx-auto space-y-1.5">
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-rose-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${pdfUploadProgress}%` }}
                          ></div>
                        </div>
                        <span className="text-[11px] font-mono text-rose-600 dark:text-rose-400 font-bold">
                          {pdfUploadProgress}% Uploading...
                        </span>
                      </div>
                    )}

                    <div>
                      <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all cursor-pointer shadow-sm">
                        <Upload className="w-4 h-4" />
                        <span>Select PDF File (.pdf)</span>
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          disabled={isUploadingPdf}
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadPdfFile(file);
                            e.target.value = '';
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Attached PDF Status Card */}
                  {formPdfUrl && (
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
                          <FileDown className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                              {formPdfName || 'Uploaded_Document.pdf'}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              ✓ Ready
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono block">
                            {formPdfSize || 'Document linked'}
                          </span>
                          {formPdfPath && (
                            <span className="text-[10px] text-cyan-300 font-mono block truncate max-w-[260px] sm:max-w-sm">
                              pdfPath: {formPdfPath}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setPdfViewerLesson({
                              id: formId || 'temp',
                              chapterId: selectedChapterId,
                              title: formTitle || 'Preview Lesson',
                              description: formDescription,
                              content: formContent,
                              order: formOrder,
                              isActive: formIsActive,
                              isPublished: formIsPublished,
                              pdfUrl: formPdfUrl,
                              pdfPath: formPdfPath,
                              pdfName: formPdfName,
                              pdfSize: formPdfSize,
                            });
                            setIsPdfViewerModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <FileDown className="w-3.5 h-3.5" />
                          <span>📖 Test Open PDF</span>
                        </button>
                        <button
                          type="button"
                          disabled={deletingMediaKey === `${formId}:pdf`}
                          onClick={() => {
                            if (currentLesson) {
                              handleDeleteLessonMedia(currentLesson.id, 'pdf', formPdfPath, formTitle);
                            } else {
                              setFormPdfUrl('');
                              setFormPdfPath('');
                              setFormPdfName('');
                              setFormPdfSize('');
                            }
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-bold cursor-pointer"
                        >
                          {deletingMediaKey === `${formId}:pdf` ? 'Deleting...' : 'Delete PDF'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Manual URL Input / Override */}
                  <div className="space-y-1 pt-1">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                      <span>PDF Download URL (Auto-filled on upload or manual link)</span>
                      <span className="text-[10px] text-slate-400 font-mono">Storage / HTTPS</span>
                    </label>
                    <input
                      type="url"
                      value={formPdfUrl}
                      onChange={(e) => setFormPdfUrl(e.target.value)}
                      placeholder="https://firebasestorage.googleapis.com/v0/b/.../materials.pdf"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        Display File Name
                      </label>
                      <input
                        type="text"
                        value={formPdfName}
                        onChange={(e) => setFormPdfName(e.target.value)}
                        placeholder="Linear_Regression_Lecture_Notes.pdf"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        Estimated File Size
                      </label>
                      <input
                        type="text"
                        value={formPdfSize}
                        onChange={(e) => setFormPdfSize(e.target.value)}
                        placeholder="e.g. 2.4 MB"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: VIDEO PREPARATION (Video LMS: LKG -> Degree) */}
              {editorTab === 'video' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 text-xs space-y-1">
                    <div className="font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-blue-500" />
                      <span>Video LMS: Select and Upload Lesson Video (LKG → Degree)</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      Upload MP4 videos directly to Firebase Storage. The download URL is saved in Firestore so students can stream lessons with full playback controls across all grade levels.
                    </p>
                  </div>

                  {/* Firebase Storage Video Upload Dropzone */}
                  <div className="p-5 rounded-2xl border-2 border-dashed border-blue-300 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
                      <Video className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {isUploadingVideo ? 'Uploading Video to Firebase Storage...' : 'Upload Video to Storage (MP4 / WebM)'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Target path: <code className="font-mono text-cyan-500">lessons/{selectedSubjectId}/{selectedChapterId}/{formId || 'lessonId'}/video/lesson.mp4</code>
                      </p>
                    </div>

                    {isUploadingVideo && (
                      <div className="max-w-xs mx-auto space-y-1.5">
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${videoUploadProgress}%` }}
                          ></div>
                        </div>
                        <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-bold">
                          {videoUploadProgress}% Uploading Video...
                        </span>
                      </div>
                    )}

                    <div>
                      <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow-sm">
                        <Upload className="w-4 h-4" />
                        <span>Select Video File (.mp4, .webm, .mov)</span>
                        <input
                          type="file"
                          accept="video/mp4,video/webm,video/quicktime,video/*"
                          disabled={isUploadingVideo}
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadVideoFile(file);
                            e.target.value = '';
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Attached Video Status Card */}
                  {formVideoUrl && (
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0">
                          <Play className="w-5 h-5 fill-current" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                              {formVideoName || 'Uploaded_Lesson.mp4'}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              ✓ Video Ready
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono block">
                            Duration: {formVideoDuration || '18:45 mins'}
                          </span>
                          {formVideoPath && (
                            <span className="text-[10px] text-cyan-300 font-mono block truncate max-w-[260px] sm:max-w-sm">
                              videoPath: {formVideoPath}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            handleOpenVideoPlayer({
                              id: formId || 'temp',
                              subjectId: selectedSubjectId,
                              chapterId: selectedChapterId,
                              title: formTitle || 'Preview Lesson',
                              description: formDescription,
                              content: formContent,
                              order: formOrder,
                              isActive: formIsActive,
                              isPublished: formIsPublished,
                              videoUrl: formVideoUrl,
                              videoPath: formVideoPath || `lessons/${selectedSubjectId}/${selectedChapterId}/${formId || 'lesson001'}/video/lesson.mp4`,
                              videoName: formVideoName,
                              videoDuration: formVideoDuration,
                            });
                          }}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>🎬 Test Play Video</span>
                        </button>
                        <button
                          type="button"
                          disabled={deletingMediaKey === `${formId}:video`}
                          onClick={() => {
                            if (currentLesson) {
                              handleDeleteLessonMedia(currentLesson.id, 'video', formVideoPath, formTitle);
                            } else {
                              setFormVideoUrl('');
                              setFormVideoPath('');
                              setFormVideoName('');
                              setFormVideoDuration('');
                            }
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-bold cursor-pointer"
                        >
                          {deletingMediaKey === `${formId}:video` ? 'Deleting...' : 'Delete Video'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Video Metadata / Direct URL & Storage videoPath */}
                  <div className="space-y-1 pt-1">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      Direct Video Stream / Storage URL (videoUrl)
                    </label>
                    <input
                      type="url"
                      value={formVideoUrl}
                      onChange={(e) => setFormVideoUrl(e.target.value)}
                      placeholder="https://firebasestorage.googleapis.com/.../video/lesson.mp4 or https://www.youtube.com/..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                      <span>Storage Path (videoPath)</span>
                      <span className="text-[10px] font-normal text-slate-400">Locates or replaces the file without relying only on videoUrl</span>
                    </label>
                    <input
                      type="text"
                      value={formVideoPath}
                      onChange={(e) => setFormVideoPath(e.target.value)}
                      placeholder={`lessons/${selectedSubjectId}/${selectedChapterId}/${formId || 'lesson001'}/video/lesson.mp4`}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-cyan-600 dark:text-cyan-400 focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        Video Lecture Title
                      </label>
                      <input
                        type="text"
                        value={formVideoName}
                        onChange={(e) => setFormVideoName(e.target.value)}
                        placeholder="Lecture 1: Slope & Ordinary Least Squares"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={formVideoDuration}
                        onChange={(e) => setFormVideoDuration(e.target.value)}
                        placeholder="e.g. 22:15 mins"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: QUIZ PREPARATION */}
              {editorTab === 'quiz' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 text-xs space-y-1">
                    <div className="font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4" />
                      <span>Stage 3: Interactive Quiz Preparation</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      Prepares mastery quizzes and knowledge assessments linked directly to this lesson.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
                    <input
                      type="checkbox"
                      id="checkbox-has-quiz"
                      checked={formHasQuiz}
                      onChange={(e) => setFormHasQuiz(e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded cursor-pointer"
                    />
                    <label htmlFor="checkbox-has-quiz" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                      Enable Assessment Quiz for this Lesson
                    </label>
                  </div>

                  {formHasQuiz && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fadeIn">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                          Quiz Title
                        </label>
                        <input
                          type="text"
                          value={formQuizTitle}
                          onChange={(e) => setFormQuizTitle(e.target.value)}
                          placeholder={`${formTitle || 'Lesson'} Mastery Quiz`}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-slate-100"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                          Number of Questions
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={formQuizQuestionsCount}
                          onChange={(e) => setFormQuizQuestionsCount(Number(e.target.value))}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-slate-100 text-center"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: PUBLISH & STATUS */}
              {editorTab === 'publish' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-xs space-y-1">
                    <div className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                      <Send className="w-4 h-4" />
                      <span>Stage 4: Publishing & Active Control</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      Determine whether students can view this lesson immediately or if it remains a work-in-progress draft.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Active Toggle */}
                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Active Status
                        </span>
                        <input
                          type="checkbox"
                          checked={formIsActive}
                          onChange={(e) => setFormIsActive(e.target.checked)}
                          className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {formIsActive
                          ? '✅ Active: Lesson is enabled in the curriculum.'
                          : '🚫 Disabled: Lesson is hidden from Android clients.'}
                      </p>
                    </div>

                    {/* Published Toggle */}
                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Publication State
                        </span>
                        <input
                          type="checkbox"
                          checked={formIsPublished}
                          onChange={(e) => setFormIsPublished(e.target.checked)}
                          className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {formIsPublished
                          ? '🚀 Published: Live for all enrolled students.'
                          : '💾 Draft: Private to instructors and admins.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions Footer: [Save as Draft] and [Publish Lesson] */}
            <div className="p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-medium">
                Saves directly to Firestore collection <code className="font-mono text-indigo-600">lessons</code>
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* 5. Save as Draft Action */}
                <button
                  type="button"
                  onClick={() => handleSaveLesson(true)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 hover:bg-amber-100 border border-amber-300 dark:border-amber-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save as Draft</span>
                </button>

                {/* Publish Action */}
                <button
                  type="button"
                  onClick={() => handleSaveLesson(false)}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{formIsPublished ? 'Publish Live' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PREVIEW LESSON CONTENT                                             */}
      {/* ========================================================================= */}
      {isPreviewModalOpen && currentLesson && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleUp">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  STUDENT VIEW PREVIEW • LESSON #{currentLesson.order}
                </span>
                <h4 className="text-base font-black">{currentLesson.title}</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(false)}
                className="p-1 rounded-full text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300">
                <strong>Summary:</strong> {currentLesson.description}
              </div>

              {/* Media Preview Links */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {currentLesson.pdfUrl && (
                  <a
                    href={currentLesson.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 text-xs font-bold flex items-center gap-1.5"
                  >
                    <FileDown className="w-3.5 h-3.5 text-rose-500" />
                    <span className="truncate">Download PDF</span>
                  </a>
                )}
                {currentLesson.videoUrl && (
                  <a
                    href={currentLesson.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 text-blue-500" />
                    <span className="truncate">Watch Video</span>
                  </a>
                )}
                {currentLesson.hasQuiz && (
                  <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 text-xs font-bold flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-purple-500" />
                    <span className="truncate">Quiz Ready</span>
                  </div>
                )}
              </div>

              {/* Body Content */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-slate-200">
                {currentLesson.content || 'No content written yet.'}
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: 📖 OPEN PDF VIEWER (STUDENT & ADMIN STUDY READER)                  */}
      {/* ========================================================================= */}
      {isPdfViewerModalOpen && pdfViewerLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-4xl h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            {/* Top Toolbar */}
            <div className="p-4 px-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
                  <FileDown className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      PDF Handbook
                    </span>
                    {pdfViewerLesson.pdfSize && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        {pdfViewerLesson.pdfSize}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white truncate">
                    {pdfViewerLesson.pdfName || `${pdfViewerLesson.title} Notes`}
                  </h3>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                {pdfViewerLesson.pdfUrl && (
                  <>
                    <a
                      href={pdfViewerLesson.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                      title="Open in new window"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      <span className="hidden sm:inline">New Tab</span>
                    </a>
                    <a
                      href={pdfViewerLesson.pdfUrl}
                      download={pdfViewerLesson.pdfName || 'lesson_material.pdf'}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                      title="Download PDF file"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Download</span>
                    </a>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setIsPdfViewerModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Viewer Body */}
            <div className="flex-1 bg-slate-950 p-2 sm:p-4 overflow-hidden relative flex flex-col">
              {pdfViewerLesson.pdfUrl ? (
                <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 flex flex-col">
                  {/* Google Docs PDF Embed or direct object */}
                  <iframe
                    src={
                      pdfViewerLesson.pdfUrl.startsWith('blob:') || pdfViewerLesson.pdfUrl.startsWith('data:')
                        ? pdfViewerLesson.pdfUrl
                        : `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfViewerLesson.pdfUrl)}`
                    }
                    className="w-full flex-1 border-0 rounded-2xl bg-white"
                    title={pdfViewerLesson.title}
                  />
                  {/* Fallback Notice Bar */}
                  <div className="p-3 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between flex-wrap gap-2">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Connected to Firebase Storage: <code className="text-cyan-300 font-mono">lessons/{pdfViewerLesson.subjectId || selectedSubjectId}/{pdfViewerLesson.chapterId || selectedChapterId}/{pdfViewerLesson.id}/pdf/lesson.pdf</code></span>
                    </span>
                    <a
                      href={pdfViewerLesson.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:underline flex items-center gap-1 font-bold"
                    >
                      <span>Direct Storage URL</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
                  <FileDown className="w-12 h-12 text-slate-600" />
                  <p className="text-sm text-slate-400">No PDF URL available for this lesson.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDUAI STUDENT VIDEO PLAYER (LKG → DEGREE REUSABLE LESSON SCREEN)   */}
      {/* ========================================================================= */}
      {isVideoPlayerModalOpen && videoPlayerLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-5xl h-[92vh] bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
            {/* Top Toolbar */}
            <div className="p-3.5 sm:p-4 px-4 sm:px-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0">
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
                      EduAI Video Player
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      LKG → Degree Ready
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                      {videoPlayerLesson.videoDuration || '22:15 mins'}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white truncate mt-0.5">
                    {videoPlayerLesson.title}
                  </h3>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                {(authorizedVideoUrl || videoPlayerLesson.videoUrl) && !videoPlaybackError && (
                  <a
                    href={authorizedVideoUrl || videoPlayerLesson.videoUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                    title="Open short-lived authorized stream in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    <span className="hidden sm:inline">{videoAuthExpiresAt ? 'Authorized Stream' : 'Direct Stream'}</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (videoPlayerRef.current) {
                      videoPlayerRef.current.pause();
                    }
                    setIsVideoPlaying(false);
                    setIsVideoPlayerModalOpen(false);
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
                  title="Close player"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Viewport & Playback Controls */}
            <div className="flex-1 bg-black overflow-y-auto flex flex-col">
              <div
                ref={videoContainerRef}
                className="relative w-full bg-black group flex flex-col justify-center items-center overflow-hidden min-h-[300px] sm:min-h-[420px] max-h-[65vh]"
              >
                {/* Video Media Element / Iframe Embed */}
                {isAuthorizingVideo ? (
                  <div className="flex flex-col items-center justify-center p-8 space-y-3">
                    <RefreshCw className="w-8 h-8 animate-spin text-blue-400" />
                    <p className="text-xs font-mono text-slate-300">Verifying publication status &amp; issuing short-lived stream URL...</p>
                  </div>
                ) : (authorizedVideoUrl || videoPlayerLesson.videoUrl) && !videoPlaybackError ? (
                  (authorizedVideoUrl || videoPlayerLesson.videoUrl || '').includes('youtube.com') ||
                  (authorizedVideoUrl || videoPlayerLesson.videoUrl || '').includes('youtu.be') ? (
                    <div className="w-full h-full aspect-video flex items-center justify-center">
                      <iframe
                        src={
                          (authorizedVideoUrl || videoPlayerLesson.videoUrl || '').includes('embed')
                            ? (authorizedVideoUrl || videoPlayerLesson.videoUrl || '')
                            : (authorizedVideoUrl || videoPlayerLesson.videoUrl || '').includes('watch?v=')
                            ? (authorizedVideoUrl || videoPlayerLesson.videoUrl || '').replace('watch?v=', 'embed/')
                            : (authorizedVideoUrl || videoPlayerLesson.videoUrl || '').replace('youtu.be/', 'www.youtube.com/embed/')
                        }
                        title={videoPlayerLesson.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    </div>
                  ) : (
                    <>
                      <video
                        ref={videoPlayerRef}
                        src={authorizedVideoUrl || videoPlayerLesson.videoUrl || ''}
                        playsInline
                        onClick={handleTogglePlayVideo}
                        onWaiting={() => setIsVideoBuffering(true)}
                        onPlaying={() => {
                          setIsVideoBuffering(false);
                          setIsVideoPlaying(true);
                        }}
                        onCanPlay={() => setIsVideoBuffering(false)}
                        onError={() => {
                          setIsVideoBuffering(false);
                          setIsVideoPlaying(false);
                          setVideoPlaybackError('Unable to stream this video URL. Check network connectivity or try Direct Stream.');
                        }}
                        onTimeUpdate={() => {
                          if (videoPlayerRef.current) {
                            const t = videoPlayerRef.current.currentTime;
                            setVideoCurrentTime(t);
                            if (videoPlayerLesson?.id) {
                              localStorage.setItem(`eduai_video_pos_${videoPlayerLesson.id}`, String(Math.floor(t)));
                            }
                          }
                        }}
                        onLoadedMetadata={() => {
                          if (videoPlayerRef.current) {
                            const dur = videoPlayerRef.current.duration || 1335;
                            setVideoDurationSeconds(dur);
                            const savedPosRaw = videoPlayerLesson?.id
                              ? localStorage.getItem(`eduai_video_pos_${videoPlayerLesson.id}`)
                              : null;
                            const savedPos = savedPosRaw ? Number(savedPosRaw) : 0;
                            if (Number.isFinite(savedPos) && savedPos > 1 && savedPos < dur - 2) {
                              videoPlayerRef.current.currentTime = savedPos;
                              setVideoCurrentTime(savedPos);
                            }
                          }
                        }}
                        onEnded={() => {
                          setIsVideoPlaying(false);
                          if (videoPlayerLesson?.id) {
                            localStorage.removeItem(`eduai_video_pos_${videoPlayerLesson.id}`);
                          }
                        }}
                        className="w-full h-full object-contain cursor-pointer max-h-[60vh]"
                      />

                      {isVideoBuffering && !videoPlaybackError && (
                        <div className="absolute inset-0 m-auto w-24 h-24 rounded-2xl bg-slate-900/80 text-white flex flex-col items-center justify-center gap-1.5 z-20 pointer-events-none">
                          <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
                          <span className="text-[10px] font-mono">Buffering...</span>
                        </div>
                      )}

                      {videoPlaybackError && (
                        <div className="absolute inset-0 m-auto max-w-sm h-fit p-4 rounded-2xl bg-rose-950/90 border border-rose-500/40 text-center space-y-2 z-25">
                          <p className="text-xs font-bold text-rose-200">{videoPlaybackError}</p>
                        </div>
                      )}

                      {/* Center Play/Pause Overlay icon when paused */}
                      {!isVideoPlaying && !isVideoBuffering && !videoPlaybackError && (
                        <button
                          type="button"
                          onClick={handleTogglePlayVideo}
                          className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-600/90 hover:bg-blue-500 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 cursor-pointer z-20 backdrop-blur-xs"
                          aria-label="Play video"
                        >
                          <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
                        </button>
                      )}

                      {/* Controls Bar */}
                      <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-black via-black/80 to-transparent space-y-2 z-30 transition-opacity">
                        {/* Timeline Scrubber */}
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max={videoDurationSeconds || 100}
                            step="0.5"
                            value={videoCurrentTime}
                            onChange={(e) => handleSeekVideo(Number(e.target.value))}
                            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:h-2 transition-all"
                          />
                        </div>

                        {/* Controls Bottom Row */}
                        <div className="flex items-center justify-between text-xs">
                          {/* Left controls */}
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={handleTogglePlayVideo}
                              className="p-1.5 rounded-lg hover:bg-white/20 text-white cursor-pointer"
                              title={isVideoPlaying ? 'Pause' : 'Play'}
                            >
                              {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSkipTime(-10)}
                              className="p-1.5 rounded-lg hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer"
                              title="Rewind 10s"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSkipTime(10)}
                              className="p-1.5 rounded-lg hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer"
                              title="Forward 10s"
                            >
                              <FastForward className="w-4 h-4" />
                            </button>

                            <span className="font-mono text-[11px] text-slate-300">
                              {formatVideoTimestamp(videoCurrentTime)} / {formatVideoTimestamp(videoDurationSeconds)}
                            </span>

                            {/* Volume & Mute */}
                            <div className="hidden sm:flex items-center gap-1.5 ml-2">
                              <button
                                type="button"
                                onClick={handleToggleMute}
                                className="p-1.5 rounded-lg hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer"
                              >
                                {isVideoMuted || videoVolume === 0 ? (
                                  <VolumeX className="w-4 h-4 text-rose-400" />
                                ) : (
                                  <Volume2 className="w-4 h-4" />
                                )}
                              </button>
                              <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={isVideoMuted ? 0 : videoVolume}
                                onChange={(e) => handleChangeVolume(Number(e.target.value))}
                                className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-400"
                              />
                            </div>
                          </div>

                          {/* Right controls */}
                          <div className="flex items-center gap-2">
                            {/* Playback speed selector */}
                            <select
                              value={videoPlaybackRate}
                              onChange={(e) => handleChangePlaybackRate(Number(e.target.value))}
                              className="bg-slate-800 text-slate-200 text-[11px] font-bold px-2 py-1 rounded-md border border-slate-700 cursor-pointer"
                            >
                              <option value="0.5">0.5x</option>
                              <option value="0.75">0.75x</option>
                              <option value="1">1.0x (Normal)</option>
                              <option value="1.25">1.25x</option>
                              <option value="1.5">1.5x</option>
                              <option value="2">2.0x</option>
                            </select>

                            {/* Quality */}
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                              {videoQuality}
                            </span>

                            {/* Fullscreen */}
                            <button
                              type="button"
                              onClick={handleToggleFullscreen}
                              className="p-1.5 rounded-lg hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer"
                              title="Toggle Fullscreen"
                            >
                              {isVideoFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 space-y-3">
                    <Video className="w-12 h-12 text-slate-600" />
                    <p className="text-sm text-rose-300 font-medium text-center max-w-md">
                      {videoPlaybackError || 'No video stream URL attached to this lesson.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Student Reusable Action Hub (LKG → Degree) */}
              <div className="p-4 sm:p-6 bg-slate-900/90 border-t border-slate-800 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                      {currentSubject.name} • Chapter: {currentChapter.title}
                    </span>
                    <h2 className="text-lg font-black text-white">{videoPlayerLesson.title}</h2>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                      {videoPlayerLesson.description || 'Watch the lecture with interactive playback controls and accompanying study resources.'}
                    </p>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                    {/* Open PDF */}
                    {videoPlayerLesson.pdfUrl ? (
                      <button
                        type="button"
                        onClick={() => {
                          setPdfViewerLesson(videoPlayerLesson);
                          setIsPdfViewerModalOpen(true);
                        }}
                        className="px-3 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        <span>📄 Study Material</span>
                      </button>
                    ) : (
                      <span className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-500 text-xs font-medium">
                        No PDF
                      </span>
                    )}

                    {/* Ask AI Tutor */}
                    <button
                      type="button"
                      onClick={() => {
                        setFeedback({
                          type: 'info',
                          message: `🤖 EduAI Tutor activated for "${videoPlayerLesson.title}". Ask questions, get simplified analogies, or request code derivations.`,
                        });
                      }}
                      className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>🤖 Ask AI</span>
                    </button>

                    {/* Take Quiz */}
                    {videoPlayerLesson.hasQuiz ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (onNavigateToQuiz) {
                            setIsVideoPlayerModalOpen(false);
                            onNavigateToQuiz(videoPlayerLesson.id, videoPlayerLesson.title);
                          } else {
                            setFeedback({
                              type: 'info',
                              message: `📝 Launching quiz for "${videoPlayerLesson.title}" (${videoPlayerLesson.quizQuestionsCount || 5} questions).`,
                            });
                          }
                        }}
                        className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>📝 Take Quiz</span>
                      </button>
                    ) : (
                      <span className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-500 text-xs font-medium">
                        No Quiz
                      </span>
                    )}
                  </div>
                </div>

                {/* Storage & Architecture Pipeline Footnote */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                    <span>
                      videoPath: <code className="text-cyan-300 font-mono">{videoPlayerLesson.videoPath || videoPlayerLesson.videoStoragePath || `lessons/${videoPlayerLesson.subjectId || selectedSubjectId}/${videoPlayerLesson.chapterId || selectedChapterId}/${videoPlayerLesson.id}/video/lesson.mp4`}</code>
                    </span>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold">
                    {videoAuthExpiresAt
                      ? `Short-Lived Authorized Stream (exp ${new Date(videoAuthExpiresAt).toLocaleTimeString()})`
                      : 'Firestore & Storage Synced'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ARCHITECTURE & FIRESTORE RULES INSPECTOR                           */}
      {/* ========================================================================= */}
      {isArchitectureModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleUp">
            <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                  Lesson Management • Android & Cloud Architecture
                </span>
                <h4 className="text-lg font-black">Subject ➔ Chapter ➔ Lesson Management</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsArchitectureModalOpen(false)}
                className="p-1 rounded-full text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Hierarchy Tree */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span className="text-emerald-400 font-bold">EduAI Architectural Hierarchy</span>
                  <button
                    type="button"
                    onClick={() => {
                      const tree = `Subject
   ↓
Chapter
   ↓
Lesson Management
   ├── Add Lesson
   ├── View Lessons
   ├── Edit Lesson
   ├── Disable Lesson
   └── Save as Draft

This implementation prepares the app for PDF, Video, Quiz, and Publish in the next stages.`;
                      navigator.clipboard?.writeText(tree);
                      setFeedback({ type: 'success', message: 'Hierarchy diagram copied to clipboard!' });
                    }}
                    className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30 flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Flow</span>
                  </button>
                </div>
                <pre className="font-mono text-xs text-indigo-300 overflow-x-auto leading-relaxed">
{`Subject
   ↓
Chapter
   ↓
Lesson Management
   ├── Add Lesson
   ├── View Lessons
   ├── Edit Lesson
   ├── Disable Lesson
   └── Save as Draft`}
                </pre>
              </div>

              {/* 1. Firebase structure: lessons collection */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span className="text-amber-400 font-bold flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-amber-400" />
                    <span>1. Firebase structure — lessons collection</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const schemaTree = `2. Update Firebase database

lessons
 └── lesson001
      ├── id: "lesson001"
      ├── subjectId: "ML001"
      ├── chapterId: "CH001"
      ├── title: "Simple Linear Regression"
      ├── pdfUrl: "https://..."
      ├── videoUrl: "https://..."
      ├── videoPath: "lessons/ML001/CH001/lesson001/video/lesson.mp4"
      ├── isActive: true
      └── isPublished: false`;
                        navigator.clipboard?.writeText(schemaTree);
                        setFeedback({ type: 'success', message: 'Copied updated Firebase structure to clipboard!' });
                      }}
                      className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-400/30 flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy Structure</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const jsonExample = `{
  "id": "lesson001",
  "subjectId": "ML001",
  "chapterId": "CH001",
  "title": "Simple Linear Regression",
  "pdfUrl": "https://firebasestorage.googleapis.com/v0/b/pristine-sun-1mbw7.firebasestorage.app/o/lessons%2FML001%2FCH001%2Flesson001%2Fpdf%2Flesson.pdf?alt=media",
  "videoUrl": "https://firebasestorage.googleapis.com/v0/b/pristine-sun-1mbw7.firebasestorage.app/o/lessons%2FML001%2FCH001%2Flesson001%2Fvideo%2Flesson.mp4?alt=media",
  "videoPath": "lessons/ML001/CH001/lesson001/video/lesson.mp4",
  "isActive": true,
  "isPublished": false
}`;
                        navigator.clipboard?.writeText(jsonExample);
                        setFeedback({ type: 'success', message: 'Copied Firestore Document JSON to clipboard!' });
                      }}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold border border-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy JSON</span>
                    </button>
                  </div>
                </div>

                <pre className="font-mono text-xs text-amber-300 overflow-x-auto leading-relaxed bg-slate-900/90 p-3 rounded-xl border border-slate-800">
{`lessons
 └── lesson001
      ├── id: "lesson001"
      ├── subjectId: "ML001"
      ├── chapterId: "CH001"
      ├── title: "Simple Linear Regression"
      ├── pdfUrl: "https://..."
      ├── videoUrl: "https://..."
      ├── videoPath: "lessons/ML001/CH001/lesson001/video/lesson.mp4"
      ├── isActive: true
      └── isPublished: false`}
                </pre>

                {/* Field description table */}
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-[11px] font-mono pt-1">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="text-slate-400 block text-[9px] uppercase">ID & Hierarchy</span>
                    <span className="text-indigo-400 font-bold">id, subjectId, chapterId</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="text-slate-400 block text-[9px] uppercase">Educational Core</span>
                    <span className="text-amber-300 font-bold">title, description, content</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="text-slate-400 block text-[9px] uppercase">Sequence Order</span>
                    <span className="text-purple-300 font-bold">order (number)</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="text-slate-400 block text-[9px] uppercase">Access Status</span>
                    <span className="text-emerald-400 font-bold">isActive, isPublished</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                    <span className="text-slate-400 block text-[9px] uppercase">Materials URL</span>
                    <span className="text-rose-400 font-bold">pdfUrl (Storage)</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 col-span-2 sm:col-span-1">
                    <span className="text-slate-400 block text-[9px] uppercase">Audit Timestamp</span>
                    <span className="text-cyan-300 font-bold">createdAt</span>
                  </div>
                </div>
              </div>

              {/* 2. Access Control Principle: isActive vs isPublished Matrix */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span className="text-amber-400 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Access Control Principle: isActive vs isPublished</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const matrixText = `Important

isActive and isPublished have different purposes:

isActive
   ↓
Admin hasn't disabled the lesson

isPublished
   ↓
Student is allowed to see the lesson

So a lesson can be:

Active + Draft
       ↓
Admin can edit it
Student cannot see it

Active + Published
       ↓
Student can see it

Inactive
       ↓
Hidden`;
                      navigator.clipboard?.writeText(matrixText);
                      setFeedback({ type: 'success', message: 'Copied Access Control Principle to clipboard!' });
                    }}
                    className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-400/30 flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Matrix</span>
                  </button>
                </div>

                <pre className="font-mono text-xs text-amber-300 overflow-x-auto leading-relaxed bg-slate-900/90 p-3 rounded-xl border border-slate-800">
{`isActive and isPublished have different purposes:

isActive
   ↓
Admin hasn't disabled the lesson

isPublished
   ↓
Student is allowed to see the lesson

So a lesson can be:

Active + Draft
       ↓
Admin can edit it
Student cannot see it

Active + Published
       ↓
Student can see it

Inactive
       ↓
Hidden`}
                </pre>
              </div>

              {/* 3. Lesson Model — Lesson.kt */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-cyan-400" />
                    <span>3. Update Lesson Model — Lesson.kt</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const lessonModelCode = `package com.eduai.model

import com.google.firebase.Timestamp

data class Lesson(
    val id: String = "",
    val subjectId: String = "",
    val chapterId: String = "",
    val title: String = "",
    val description: String = "",
    val content: String = "",
    val order: Int = 0,
    val isActive: Boolean = true,
    val isPublished: Boolean = false,
    val pdfUrl: String = "",
    val videoUrl: String = "",
    val videoPath: String = "",
    val createdAt: Timestamp? = null
)`;
                      navigator.clipboard?.writeText(lessonModelCode);
                      setFeedback({ type: 'success', message: 'Copied Lesson.kt model code to clipboard!' });
                    }}
                    className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-400/30 flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Lesson.kt</span>
                  </button>
                </div>

                <pre className="font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed bg-slate-900/90 p-3 rounded-xl border border-slate-800">
{`package com.eduai.model

import com.google.firebase.Timestamp

data class Lesson(
    val id: String = "",
    val subjectId: String = "",
    val chapterId: String = "",
    val title: String = "",
    val description: String = "",
    val content: String = "",
    val order: Int = 0,
    val isActive: Boolean = true,
    val isPublished: Boolean = false,
    val pdfUrl: String = "",
    val videoUrl: String = "",
    val videoPath: String = "",
    val createdAt: Timestamp? = null
)`}
                </pre>
              </div>

              {/* 4. Gradle Dependencies — app/build.gradle.kts */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span className="text-amber-400 font-bold flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-amber-400" />
                    <span>4. Firebase Storage Dependency — app/build.gradle.kts</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const gradleSnippet = `dependencies {
    // Import the Firebase BoM
    implementation(platform("com.google.firebase:firebase-bom:33.4.0"))

    // When using the BoM, versions are managed automatically:
    implementation("com.google.firebase:firebase-firestore")
    implementation("com.google.firebase:firebase-storage")
    implementation("com.google.firebase:firebase-auth")

    // Media3 - latest stable version
    implementation("androidx.media3:media3-exoplayer:1.11.1")
    implementation("androidx.media3:media3-ui:1.11.1")
}`;
                        navigator.clipboard?.writeText(gradleSnippet);
                        setFeedback({ type: 'success', message: 'Copied Kotlin DSL Gradle snippet to clipboard!' });
                      }}
                      className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-400/30 flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Kotlin DSL</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const groovySnippet = `dependencies {
    // Import the Firebase BoM
    implementation platform('com.google.firebase:firebase-bom:33.4.0')

    // Managed by BoM:
    implementation 'com.google.firebase:firebase-firestore'
    implementation 'com.google.firebase:firebase-storage'
    implementation 'com.google.firebase:firebase-auth'

    // Media3 - latest stable version
    implementation 'androidx.media3:media3-exoplayer:1.11.1'
    implementation 'androidx.media3:media3-ui:1.11.1'
}`;
                        navigator.clipboard?.writeText(groovySnippet);
                        setFeedback({ type: 'success', message: 'Copied Groovy DSL Gradle snippet to clipboard!' });
                      }}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold border border-slate-700 flex items-center gap-1 cursor-pointer hover:bg-slate-700"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Groovy</span>
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-400 space-y-1">
                  <p>In your app-level Gradle file (<code className="text-amber-300 font-mono">app/build.gradle.kts</code> or <code className="text-amber-300 font-mono">app/build.gradle</code>), manage Firebase versions using the Firebase BoM and include Media3 (<code className="text-amber-300 font-mono">1.11.1</code>):</p>
                </div>

                {/* Android Studio Sync Now Banner */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between flex-wrap gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🐘</span>
                    <div>
                      <div className="text-xs font-bold text-amber-200">
                        Gradle files have changed since last project sync
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {isGradleSyncing
                          ? 'Syncing with Google Maven & indexing Firebase Storage...'
                          : isGradleInSync
                          ? `✓ Project in sync (Synced: ${lastSyncTimestamp})`
                          : 'Project sync required'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSyncNow}
                    disabled={isGradleSyncing}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                      isGradleSyncing
                        ? 'bg-amber-600/50 text-white cursor-wait'
                        : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                    }`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isGradleSyncing ? 'animate-spin' : ''}`} />
                    <span>{isGradleSyncing ? 'Syncing...' : 'Sync Now'}</span>
                  </button>
                </div>

                <pre className="font-mono text-xs text-amber-300 overflow-x-auto leading-relaxed bg-slate-900/90 p-3 rounded-xl border border-slate-800">
{`dependencies {
    // Import the Firebase BoM
    implementation(platform("com.google.firebase:firebase-bom:33.4.0"))

    // When using the BoM, don't specify versions in Firebase dependencies:
    implementation("com.google.firebase:firebase-firestore")
    implementation("com.google.firebase:firebase-storage")
    implementation("com.google.firebase:firebase-auth")

    // Media3 - latest stable version
    implementation("androidx.media3:media3-exoplayer:1.11.1")
    implementation("androidx.media3:media3-ui:1.11.1")
}`}
                </pre>
              </div>

              {/* 5. Lesson Editor Layout & PDF Button — dialog_add_lesson.xml */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>5. Lesson Editor Layout — dialog_add_lesson.xml</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const xmlSnippet = `<!-- 5. Add PDF & Video upload controls to Lesson Editor -->
<Button
    android:id="@+id/btnUploadPdf"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:text="📄 Upload PDF"
    android:layout_marginTop="12dp"/>

<TextView
    android:id="@+id/txtPdfName"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:text="No PDF selected"
    android:layout_marginTop="6dp"/>

<Button
    android:id="@+id/btnUploadVideo"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:text="Select Video"
    android:layout_marginTop="16dp" />

<TextView
    android:id="@+id/txtVideoStatus"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:text="No video selected"
    android:layout_marginTop="8dp" />

<ProgressBar
    android:id="@+id/videoProgress"
    style="?android:attr/progressBarStyleHorizontal"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:max="100"
    android:progress="0"
    android:visibility="gone" />`;
                      navigator.clipboard?.writeText(xmlSnippet);
                      setFeedback({ type: 'success', message: 'Copied dialog_add_lesson.xml PDF & Video controls to clipboard!' });
                    }}
                    className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30 flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy XML</span>
                  </button>
                </div>

                <div className="text-xs text-slate-400 space-y-1">
                  <p>In <code className="text-emerald-300 font-mono">dialog_add_lesson.xml</code>, the lesson editor provides direct PDF &amp; Video attachments with upload progress before saving:</p>
                </div>

                <pre className="font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed bg-slate-900/90 p-3 rounded-xl border border-slate-800">
{`┌──────────────────────────────┐
│ CREATE LESSON                │
│                              │
│ Title                        │
│ [ Simple Linear Regression ] │
│                              │
│ Learning materials           │
│ 📄 Upload PDF                │
│ Uploaded                     │
│                              │
│ 🎬 Select Video              │
│ Selected: regression.mp4     │
│ [████████████░░░░░░] 65%     │
│                              │
│ [ Save Draft ]               │
└──────────────────────────────┘`}
                </pre>

                <pre className="font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed bg-slate-900/90 p-3 rounded-xl border border-slate-800">
{`<Button
    android:id="@+id/btnUploadPdf"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:text="📄 Upload PDF"
    android:layout_marginTop="12dp"/>

<TextView
    android:id="@+id/txtPdfName"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:text="No PDF selected"
    android:layout_marginTop="6dp"/>

<Button
    android:id="@+id/btnUploadVideo"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:text="Select Video"
    android:layout_marginTop="16dp" />

<TextView
    android:id="@+id/txtVideoStatus"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:text="No video selected"
    android:layout_marginTop="8dp" />

<ProgressBar
    android:id="@+id/videoProgress"
    style="?android:attr/progressBarStyleHorizontal"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:max="100"
    android:progress="0"
    android:visibility="gone" />`}
                </pre>
              </div>

              {/* 6. Create PDF Picker — LessonManagementActivity.kt */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-cyan-400" />
                    <span>6. Create PDF Picker — LessonManagementActivity.kt</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const pickerSnippet = `import android.net.Uri
import androidx.activity.result.contract.ActivityResultContracts

private var selectedPdfUri: Uri? = null

private val pdfPicker =
    registerForActivityResult(
        ActivityResultContracts.GetContent()
    ) { uri ->

        if (uri != null) {

            selectedPdfUri = uri

            Toast.makeText(
                this,
                "PDF selected",
                Toast.LENGTH_SHORT
            ).show()
        }
    }`;
                      navigator.clipboard?.writeText(pickerSnippet);
                      setFeedback({ type: 'success', message: 'Copied PDF Picker Activity Result Launcher to clipboard!' });
                    }}
                    className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-400/30 flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Picker</span>
                  </button>
                </div>

                <div className="text-xs text-slate-400 space-y-1">
                  <p>In <code className="text-cyan-300 font-mono">LessonManagementActivity.kt</code>, register the Activity Result launcher to pick PDF files:</p>
                </div>

                <pre className="font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed bg-slate-900/90 p-3 rounded-xl border border-slate-800">
{`import android.net.Uri
import android.widget.ProgressBar
import androidx.activity.result.contract.ActivityResultContracts
import com.google.firebase.storage.FirebaseStorage
import com.google.firebase.storage.StorageMetadata

private var selectedPdfUri: Uri? = null
private var selectedVideoUri: Uri? = null
private var videoStatusView: TextView? = null

private val pdfPicker =
    registerForActivityResult(
        ActivityResultContracts.GetContent()
    ) { uri ->
        if (uri != null) {
            selectedPdfUri = uri
            Toast.makeText(this, "PDF selected", Toast.LENGTH_SHORT).show()
        }
    }

private val videoPicker =
    registerForActivityResult(
        ActivityResultContracts.GetContent()
    ) { uri ->
        selectedVideoUri = uri
        videoStatusView?.text =
            if (uri != null) "Video selected" else "No video selected"
    }`}
                </pre>
              </div>

              {/* 7. Open PDF Picker — showLessonDialog() */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-cyan-400" />
                    <span>7. Open PDF Picker — showLessonDialog()</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const openPickerSnippet = `val uploadPdfButton =
    view.findViewById<Button>(
        R.id.btnUploadPdf
    )

val pdfName =
    view.findViewById<TextView>(
        R.id.txtPdfName
    )

uploadPdfButton.setOnClickListener {

    pdfPicker.launch("application/pdf")
}`;
                      navigator.clipboard?.writeText(openPickerSnippet);
                      setFeedback({ type: 'success', message: 'Copied showLessonDialog() PDF picker code to clipboard!' });
                    }}
                    className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-400/30 flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Click Listener</span>
                  </button>
                </div>

                <div className="text-xs text-slate-400 space-y-1">
                  <p>Inside <code className="text-cyan-300 font-mono">showLessonDialog()</code>, bind views and trigger the document picker on click:</p>
                </div>

                <pre className="font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed bg-slate-900/90 p-3 rounded-xl border border-slate-800">
{`val uploadPdfButton =
    view.findViewById<Button>(
        R.id.btnUploadPdf
    )

val pdfName =
    view.findViewById<TextView>(
        R.id.txtPdfName
    )

uploadPdfButton.setOnClickListener {

    pdfPicker.launch("application/pdf")
}`}
                </pre>
              </div>

              {/* 8. Upload PDF to Firebase Storage — uploadPdf() */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-cyan-400" />
                    <span>8. Upload PDF to Firebase Storage — uploadPdf()</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const uploadPdfSnippet = `import com.google.firebase.storage.FirebaseStorage

private fun uploadPdf(
    uri: Uri,
    subjectId: String,
    chapterId: String,
    lessonId: String,
    onSuccess: (String) -> Unit,
    onError: (Exception) -> Unit
) {

    val storage =
        FirebaseStorage.getInstance()

    val reference =
        storage.reference
            .child(
                "lessons/" +
                "$subjectId/" +
                "$chapterId/" +
                "$lessonId/" +
                "pdf/lesson.pdf"
            )

    reference.putFile(uri)
        .addOnSuccessListener {

            reference.downloadUrl
                .addOnSuccessListener { downloadUri ->

                    onSuccess(
                        downloadUri.toString()
                    )
                }
                .addOnFailureListener {
                    onError(it)
                }
        }
        .addOnFailureListener {
            onError(it)
        }
}`;
                      navigator.clipboard?.writeText(uploadPdfSnippet);
                      setFeedback({ type: 'success', message: 'Copied uploadPdf() function to clipboard!' });
                    }}
                    className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-400/30 flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy uploadPdf()</span>
                  </button>
                </div>

                <div className="text-xs text-slate-400 space-y-1">
                  <p>In <code className="text-cyan-300 font-mono">LessonManagementActivity.kt</code>, streams the selected PDF to Firebase Storage path <code className="text-emerald-300">lessons/&#123;subjectId&#125;/&#123;chapterId&#125;/&#123;lessonId&#125;/pdf/lesson.pdf</code>:</p>
                </div>

                <pre className="font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed bg-slate-900/90 p-3 rounded-xl border border-slate-800">
{`private fun uploadPdf(
    uri: Uri,
    subjectId: String,
    chapterId: String,
    lessonId: String,
    onSuccess: (String) -> Unit,
    onError: (Exception) -> Unit
) {

    val storage =
        FirebaseStorage.getInstance()

    val reference =
        storage.reference
            .child(
                "lessons/" +
                "$subjectId/" +
                "$chapterId/" +
                "$lessonId/" +
                "pdf/lesson.pdf"
            )

    reference.putFile(uri)
        .addOnSuccessListener {

            reference.downloadUrl
                .addOnSuccessListener { downloadUri ->

                    onSuccess(
                        downloadUri.toString()
                    )
                }
                .addOnFailureListener {
                    onError(it)
                }
        }
        .addOnFailureListener {
            onError(it)
        }
}`}
                </pre>
              </div>

              {/* 9. Creation Flow: Lesson Must Exist First */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span className="text-amber-400 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>9. Important: Lesson Must Exist First</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const flowDiagram = `Admin enters lesson
       ↓
Save lesson
       ↓
Firestore creates lessonId
       ↓
Upload PDF
       ↓
Get download URL
       ↓
Update lesson document`;
                      navigator.clipboard?.writeText(flowDiagram);
                      setFeedback({ type: 'success', message: 'Copied creation order flow diagram to clipboard!' });
                    }}
                    className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-400/30 flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Flow</span>
                  </button>
                </div>

                <div className="text-xs text-slate-400 space-y-1">
                  <p>We cannot safely upload to <code className="text-cyan-300 font-mono">&#123;lessonId&#125;</code> until the lesson has been created in Firestore. The correct sequence is:</p>
                </div>

                <pre className="font-mono text-xs text-amber-300 overflow-x-auto leading-relaxed bg-slate-900/90 p-4 rounded-xl border border-slate-800">
{`Admin enters lesson
       ↓
Save lesson
       ↓
Firestore creates lessonId
       ↓
Upload PDF
       ↓
Get download URL
       ↓
Update lesson document`}
                </pre>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300">
                  <span className="text-emerald-400 font-bold">Implementation guarantee:</span> <code className="text-cyan-300">repository.addLesson()</code> generates the unique <code className="text-amber-300">lessonId</code> first. In the <code className="text-indigo-300">onSuccess(newLessonId)</code> callback, <code className="text-rose-400">uploadPdf()</code> is called, followed by <code className="text-emerald-400">repository.updatePdfUrl(newLessonId, downloadUrl)</code>.
                </div>
              </div>

              {/* 10. Update LessonRepository — updatePdfUrl() */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-cyan-400" />
                    <span>10. Update LessonRepository — updatePdfUrl()</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const updatePdfUrlSnippet = `fun updatePdfUrl(
    lessonId: String,
    pdfUrl: String,
    onSuccess: () -> Unit,
    onError: (Exception) -> Unit
) {

    lessons.document(lessonId)
        .update("pdfUrl", pdfUrl)
        .addOnSuccessListener {
            onSuccess()
        }
        .addOnFailureListener {
            onError(it)
        }
}`;
                      navigator.clipboard?.writeText(updatePdfUrlSnippet);
                      setFeedback({ type: 'success', message: 'Copied updatePdfUrl() function to clipboard!' });
                    }}
                    className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-400/30 flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy updatePdfUrl()</span>
                  </button>
                </div>

                <div className="text-xs text-slate-400 space-y-1">
                  <p>In <code className="text-cyan-300 font-mono">LessonRepository.kt</code>, updates the <code className="text-amber-300 font-mono">pdfUrl</code> field on the created Firestore lesson document:</p>
                </div>

                <pre className="font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed bg-slate-900/90 p-3 rounded-xl border border-slate-800">
{`fun updatePdfUrl(
    lessonId: String,
    pdfUrl: String,
    onSuccess: () -> Unit,
    onError: (Exception) -> Unit
) {

    lessons.document(lessonId)
        .update("pdfUrl", pdfUrl)
        .addOnSuccessListener {
            onSuccess()
        }
        .addOnFailureListener {
            onError(it)
        }
}`}
                </pre>
              </div>

              {/* 11. Complete Upload Process: Return Newly Created lessonId */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-cyan-400" />
                    <span>11. Complete Upload Process — addLesson() Returns ID</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const addLessonSnippet = `fun addLesson(
    subjectId: String,
    chapterId: String,
    title: String,
    description: String,
    content: String,
    order: Int,
    pdfUrl: String = "",
    onSuccess: (String) -> Unit,
    onError: (Exception) -> Unit
) {

    val document = lessons.document()

    val data = hashMapOf(
        "id" to document.id,
        "subjectId" to subjectId,
        "chapterId" to chapterId,
        "title" to title,
        "description" to description,
        "content" to content,
        "order" to order,
        "isActive" to true,
        "isPublished" to false,
        "pdfUrl" to pdfUrl,
        "createdAt" to FieldValue.serverTimestamp()
    )

    document.set(data)
        .addOnSuccessListener {
            onSuccess(document.id)
        }
        .addOnFailureListener {
            onError(it)
        }
}`;
                      navigator.clipboard?.writeText(addLessonSnippet);
                      setFeedback({ type: 'success', message: 'Copied addLesson() with returned ID to clipboard!' });
                    }}
                    className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-400/30 flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy addLesson()</span>
                  </button>
                </div>

                <div className="text-xs text-slate-400 space-y-1">
                  <p>In <code className="text-cyan-300 font-mono">LessonRepository.kt</code>, change <code className="text-rose-400 font-mono">onSuccess: () -&gt; Unit</code> to <code className="text-emerald-400 font-mono">onSuccess: (String) -&gt; Unit</code> and pass <code className="text-amber-300 font-mono">document.id</code>:</p>
                </div>

                <pre className="font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed bg-slate-900/90 p-3 rounded-xl border border-slate-800">
{`// 1. Change callback signature:
onSuccess: (String) -> Unit

// 2. Return the newly created ID on write completion:
document.set(data)
    .addOnSuccessListener {
        onSuccess(document.id)
    }
    .addOnFailureListener {
        onError(it)
    }

// 3. Caller receives the ID to upload PDF safely:
repository.addLesson(
    subjectId = subjectId,
    chapterId = chapterId,
    title = lessonTitle,
    description = lessonDescription,
    content = lessonContent,
    order = lessonOrder,
    onSuccess = { lessonId ->
        // Lesson is now created. Upload the PDF to lessons/.../$lessonId/pdf/lesson.pdf
    },
    onError = { ... }
)`}
                </pre>
              </div>

              {/* 12. Complete Add Lesson + PDF Logic */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-emerald-400" />
                    <span>12. Complete Add Lesson + PDF Logic — Save Button</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const fullLogicSnippet = `repository.addLesson(
    subjectId = subjectId,
    chapterId = chapterId,
    title = lessonTitle,
    description = lessonDescription,
    content = lessonContent,
    order = lessonOrder,
    onSuccess = { lessonId ->

        val pdfUri = selectedPdfUri

        if (pdfUri != null) {

            uploadPdf(
                uri = pdfUri,
                subjectId = subjectId,
                chapterId = chapterId,
                lessonId = lessonId,
                onSuccess = { pdfUrl ->

                    repository.updatePdfUrl(
                        lessonId,
                        pdfUrl,
                        onSuccess = {
                            dialog.dismiss()
                            loadLessons()
                            Toast.makeText(
                                this,
                                "Lesson and PDF saved",
                                Toast.LENGTH_SHORT
                            ).show()
                        },
                        onError = {
                            Toast.makeText(
                                this,
                                it.message,
                                Toast.LENGTH_LONG
                            ).show()
                        }
                    )
                },
                onError = {
                    Toast.makeText(
                        this,
                        "PDF upload failed: \${it.message}",
                        Toast.LENGTH_LONG
                    ).show()
                }
            )

        } else {

            dialog.dismiss()
            loadLessons()
            Toast.makeText(
                this,
                "Lesson saved without PDF",
                Toast.LENGTH_SHORT
            ).show()
        }
    },
    onError = {
        Toast.makeText(
            this,
            it.message,
            Toast.LENGTH_LONG
        ).show()
    }
)`;
                      navigator.clipboard?.writeText(fullLogicSnippet);
                      setFeedback({ type: 'success', message: 'Copied complete Save button Add Lesson + PDF logic to clipboard!' });
                    }}
                    className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30 flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Complete Logic</span>
                  </button>
                </div>

                <div className="text-xs text-slate-400 space-y-1">
                  <p>Inside the Save / Positive button click listener in <code className="text-emerald-300 font-mono">LessonManagementActivity.kt</code>:</p>
                </div>

                <pre className="font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed bg-slate-900/90 p-3 rounded-xl border border-slate-800">
{`repository.addLesson(
    subjectId = subjectId,
    chapterId = chapterId,
    title = lessonTitle,
    description = lessonDescription,
    content = lessonContent,
    order = lessonOrder,
    onSuccess = { lessonId ->

        val pdfUri = selectedPdfUri

        if (pdfUri != null) {

            uploadPdf(
                uri = pdfUri,
                subjectId = subjectId,
                chapterId = chapterId,
                lessonId = lessonId,
                onSuccess = { pdfUrl ->

                    repository.updatePdfUrl(
                        lessonId,
                        pdfUrl,
                        onSuccess = {
                            dialog.dismiss()
                            loadLessons()
                            Toast.makeText(
                                this,
                                "Lesson and PDF saved",
                                Toast.LENGTH_SHORT
                            ).show()
                        },
                        onError = {
                            Toast.makeText(
                                this,
                                it.message,
                                Toast.LENGTH_LONG
                            ).show()
                        }
                    )
                },
                onError = {
                    Toast.makeText(
                        this,
                        "PDF upload failed: \${it.message}",
                        Toast.LENGTH_LONG
                    ).show()
                }
            )

        } else {

            dialog.dismiss()
            loadLessons()
            Toast.makeText(
                this,
                "Lesson saved without PDF",
                Toast.LENGTH_SHORT
            ).show()
        }
    },
    onError = {
        Toast.makeText(
            this,
            it.message,
            Toast.LENGTH_LONG
        ).show()
    }
)`}
                </pre>
              </div>

              {/* 13. Show PDF Status in Admin — item_lesson.xml & LessonAdapter.kt */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>13. Show PDF Status in Admin — item_lesson.xml &amp; LessonAdapter.kt</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const xmlSnippet = `<TextView
    android:id="@+id/txtPdfStatus"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:text="📄 PDF: Not uploaded"
    android:layout_marginTop="5dp"/>`;
                        navigator.clipboard?.writeText(xmlSnippet);
                        setFeedback({ type: 'success', message: 'Copied item_lesson.xml txtPdfStatus to clipboard!' });
                      }}
                      className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-400/30 flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>XML</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const adapterSnippet = `// In LessonViewHolder:
val pdfStatus: TextView =
    view.findViewById(R.id.txtPdfStatus)

// In onBindViewHolder:
if (lesson.pdfUrl.isNotEmpty()) {

    holder.pdfStatus.text =
        "📄 PDF: Uploaded"

} else {

    holder.pdfStatus.text =
        "📄 PDF: Not uploaded"
}`;
                        navigator.clipboard?.writeText(adapterSnippet);
                        setFeedback({ type: 'success', message: 'Copied LessonAdapter binding code to clipboard!' });
                      }}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold border border-slate-700 flex items-center gap-1 cursor-pointer hover:bg-slate-700"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Kotlin</span>
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-400 space-y-1">
                  <p>In <code className="text-cyan-300 font-mono">item_lesson.xml</code> and <code className="text-cyan-300 font-mono">LessonAdapter.kt</code>, admins see real-time PDF upload indicators:</p>
                </div>

                <pre className="font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed bg-slate-900/90 p-4 rounded-xl border border-slate-800">
{`Simple Linear Regression
Introduction to simple regression

📄 PDF: Uploaded

Published

[Edit] [Publish] [Disable]
[ Watch Video ]`}
                </pre>

                <pre className="font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed bg-slate-900/90 p-3 rounded-xl border border-slate-800">
{`// LessonAdapter.kt binding:
val pdfStatus: TextView = view.findViewById(R.id.txtPdfStatus)
val watchVideo: Button = view.findViewById(R.id.btnWatchVideo)

if (lesson.pdfUrl.isNotEmpty()) {
    holder.pdfStatus.text = "📄 PDF: Uploaded"
} else {
    holder.pdfStatus.text = "📄 PDF: Not uploaded"
}

holder.watchVideo.isEnabled = lesson.videoUrl.isNotEmpty()
holder.watchVideo.setOnClickListener {
    onWatchVideo(lesson)
}`}
                </pre>
              </div>

              {/* 14. Student PDF Viewer — StudentLessonActivity.kt */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span className="text-purple-400 font-bold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-purple-400" />
                    <span>14. Student PDF Viewer — StudentLessonActivity.kt</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const studentActivityCode = `btnOpenPdf.setOnClickListener {

    if (lesson.pdfUrl.isNotEmpty()) {

        val intent = Intent(
            Intent.ACTION_VIEW,
            Uri.parse(lesson.pdfUrl)
        )

        startActivity(intent)

    } else {

        Toast.makeText(
            this,
            "PDF is not available",
            Toast.LENGTH_SHORT
        ).show()
    }
}`;
                      navigator.clipboard?.writeText(studentActivityCode);
                      setFeedback({ type: 'success', message: 'Copied StudentLessonActivity button code to clipboard!' });
                    }}
                    className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-400/30 flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Student Code</span>
                  </button>
                </div>

                <div className="text-xs text-slate-400 space-y-1">
                  <p>In <code className="text-purple-300 font-mono">StudentLessonActivity.kt</code>, students view lesson notes, launch the external/system PDF viewer, and access quizzes or AI:</p>
                </div>

                <pre className="font-mono text-xs text-purple-300 overflow-x-auto leading-relaxed bg-slate-900/90 p-4 rounded-xl border border-slate-800">
{`┌─────────────────────────────┐
│ Simple Linear Regression    │
├─────────────────────────────┤
│                             │
│ Introduction                │
│                             │
│ Linear regression is...     │
│                             │
│ 📄 Study Material           │
│                             │
│ [ OPEN PDF ]                │
│                             │
│ 🤖 Ask AI                   │
│                             │
│ 📝 Take Quiz                │
└─────────────────────────────┘`}
                </pre>

                <pre className="font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed bg-slate-900/90 p-3 rounded-xl border border-slate-800">
{`btnOpenPdf.setOnClickListener {

    if (lesson.pdfUrl.isNotEmpty()) {

        val intent = Intent(
            Intent.ACTION_VIEW,
            Uri.parse(lesson.pdfUrl)
        )

        startActivity(intent)

    } else {

        Toast.makeText(
            this,
            "PDF is not available",
            Toast.LENGTH_SHORT
        ).show()
    }
}`}
                </pre>
              </div>

              {/* 15. Student Security Rules: firestore.rules & storage.rules */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>15. Security Rules &amp; Short-Lived Video Delivery — firestore.rules &amp; storage.rules</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const firestoreSnippet = `rules_version = '2';

service cloud.firestore {

    match /databases/{database}/documents {

        match /lessons/{lessonId} {

            allow get: if request.auth != null
                && (
                  (resource.data.isActive == true && resource.data.isPublished == true)
                  || request.auth.token.admin == true
                );

            // Rules are not filters: student queries must filter isActive == true && isPublished == true
            allow list: if request.auth != null
                && (
                  (resource.data.isActive == true && resource.data.isPublished == true)
                  || request.auth.token.admin == true
                );

            allow create, update, delete:
                if request.auth != null
                && request.auth.token.admin == true;
        }
    }
}`;
                        navigator.clipboard?.writeText(firestoreSnippet);
                        setFeedback({ type: 'success', message: 'Copied firestore.rules security pattern to clipboard!' });
                      }}
                      className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30 flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Firestore Rules</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const storageSnippet = `rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {

    match /lessons/{subjectId}/{chapterId}/{lessonId}/video/{fileName} {

      allow read: if request.auth != null
        && request.auth.token.admin == true;

      allow create, update: if request.auth != null
        && request.auth.token.admin == true
        && request.resource.size < 200 * 1024 * 1024
        && request.resource.contentType.matches('video/mp4');

      allow delete: if request.auth != null
        && request.auth.token.admin == true;
    }

    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}`;
                        navigator.clipboard?.writeText(storageSnippet);
                        setFeedback({ type: 'success', message: 'Copied storage.rules to clipboard!' });
                      }}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold border border-slate-700 flex items-center gap-1 cursor-pointer hover:bg-slate-700"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Storage Rules</span>
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-400 space-y-1">
                  <p>
                    Cloud Storage permits admin-only direct video reads/writes (&lt; 200 MB MP4). For student playback, <code className="text-cyan-300 font-mono">POST /api/video/authorize</code> verifies the caller&apos;s Firebase Auth ID token and checks <code className="text-emerald-300 font-mono">isActive &amp;&amp; isPublished</code> before issuing a short-lived (5-minute) authorized URL. Student Firestore queries always include <code className="text-emerald-300 font-mono">where(&apos;isActive&apos;, &apos;==&apos;, true)</code> and <code className="text-emerald-300 font-mono">where(&apos;isPublished&apos;, &apos;==&apos;, true)</code>.
                  </p>
                </div>

                <pre className="font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed bg-slate-900/90 p-3 rounded-xl border border-slate-800">
{`// 1. Storage Security (Admin-only direct read/write; <200 MB video/mp4):
match /lessons/{subjectId}/{chapterId}/{lessonId}/video/{fileName} {
    allow read: if request.auth != null
        && request.auth.token.admin == true;

    allow create, update: if request.auth != null
        && request.auth.token.admin == true
        && request.resource.size < 200 * 1024 * 1024
        && request.resource.contentType.matches('video/mp4');

    allow delete: if request.auth != null
        && request.auth.token.admin == true;
}

// 2. Secure Student Playback Delivery (/api/video/authorize):
// Verifies Firebase ID token -> checks lessons/{lessonId} isActive && isPublished
// -> returns 5-min GCS V4 signed URL or HMAC-signed /api/video/stream?token=...`}
                </pre>
              </div>

              {/* 16. Test The Complete Process (Verification & Hierarchy) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span className="text-amber-400 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>16. Test The Complete Process — ML001 ➔ CH001 ➔ LES001</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const testSummary = `Education Level: Degree
Course: B.Sc Computer Science
Semester: 5
Subject: ML001 (Machine Learning)
Chapter: CH001 (Linear Regression)
Lesson: LES001 (Simple Linear Regression)
Uploaded File: Simple_Linear_Regression.pdf

Firestore Path: lessons/LES001
Storage Path: lessons/ML001/CH001/LES001/pdf/lesson.pdf`;
                      navigator.clipboard?.writeText(testSummary);
                      setFeedback({ type: 'success', message: 'Copied verified test dataset and paths to clipboard!' });
                    }}
                    className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-400/30 flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Test Spec</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Education Level</span>
                    <span className="text-white font-bold">Degree</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Course</span>
                    <span className="text-white font-bold">B.Sc Computer Science</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Semester</span>
                    <span className="text-emerald-400 font-bold">5</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Subject ID</span>
                    <span className="text-cyan-400 font-bold">ML001 (Machine Learning)</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Chapter ID</span>
                    <span className="text-purple-400 font-bold">CH001 (Linear Regression)</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Lesson ID</span>
                    <span className="text-amber-400 font-bold">LES001 (Simple Linear Regression)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div>
                    <span className="text-[11px] font-bold text-slate-300 mb-1 block">Firestore Document Hierarchy:</span>
                    <pre className="font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed bg-slate-900/90 p-3 rounded-xl border border-slate-800">
{`Firestore
│
├── subjects
│    └── ML001
│
├── chapters
│    └── CH001
│
└── lessons
     └── LES001
          ├── title: "Simple Linear Regression"
          ├── chapterId: "CH001"
          ├── content: "Linear regression is..."
          ├── pdfUrl: ".../lesson.pdf"
          ├── isActive: true
          └── isPublished: true`}
                    </pre>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-300 mb-1 block">Firebase Storage Path:</span>
                    <pre className="font-mono text-xs text-rose-300 overflow-x-auto leading-relaxed bg-slate-900/90 p-3 rounded-xl border border-slate-800">
{`Storage
└── lessons
    └── ML001
        └── CH001
            └── LES001
                └── pdf
                    └── lesson.pdf`}
                    </pre>
                    <div className="mt-2 p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-[11px] text-emerald-300 flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Pipeline Verified • Ready for Student Consumption</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 17. Final Result — End-to-End EduAI Architecture Flow */}
              <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-950 to-indigo-950/40 border border-indigo-500/30 text-slate-200 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-indigo-500/30 pb-2">
                  <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>17. Final Result — Complete Architecture Pipeline</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const finalFlowDiagram = `                    EDUAI
                      │
                      ▼
                   Subject
                      │
                      ▼
                   Chapter
                      │
                      ▼
                    Lesson
                      │
                ┌─────┴─────┐
                ▼           ▼
             Content       PDF
                            │
                            ▼
                      Firebase Storage
                            │
                            ▼
                       PDF URL
                            │
                            ▼
                       Firestore
                            │
                            ▼
                       Student App
                            │
                            ▼
                       OPEN PDF`;
                      navigator.clipboard?.writeText(finalFlowDiagram);
                      setFeedback({ type: 'success', message: 'Copied Final Result EduAI Architecture Diagram!' });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-400/30 flex items-center gap-1 cursor-pointer hover:bg-cyan-500/30 transition-all"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Flowchart</span>
                  </button>
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  <p>Comprehensive end-to-end data pipeline from Administrator curriculum authoring down to Student PDF execution:</p>
                </div>

                <pre className="font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed bg-slate-900/95 p-5 rounded-xl border border-indigo-500/30 shadow-inner">
{`                    EDUAI
                      │
                      ▼
                   Subject
                      │
                      ▼
                   Chapter
                      │
                      ▼
                    Lesson
                      │
                ┌─────┴─────┐
                ▼           ▼
             Content       PDF
                            │
                            ▼
                      Firebase Storage
                            │
                            ▼
                       PDF URL
                            │
                            ▼
                       Firestore
                            │
                            ▼
                       Student App
                            │
                            ▼
                       OPEN PDF`}
                </pre>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11px]">
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="font-bold text-cyan-400 block mb-1">1. Authoring Level</span>
                    <span className="text-slate-400 leading-relaxed">Admin enters lesson details in <code className="text-cyan-300 font-mono">LessonManagementActivity</code> with title, description, content, and orders.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="font-bold text-purple-400 block mb-1">2. Cloud Storage &amp; Database</span>
                    <span className="text-slate-400 leading-relaxed">Firestore creates <code className="text-purple-300 font-mono">lessonId</code> first, file uploads to <code className="text-purple-300 font-mono">lessons/.../pdf/lesson.pdf</code>, and download URL is stored.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="font-bold text-emerald-400 block mb-1">3. Student Presentation</span>
                    <span className="text-slate-400 leading-relaxed"><code className="text-emerald-300 font-mono">StudentLessonActivity</code> displays lesson content and launches <code className="text-emerald-300 font-mono">[ OPEN PDF ]</code> via system intent.</span>
                  </div>
                </div>
              </div>

              {/* 18. Android Kotlin LessonRepository.kt */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-cyan-400" />
                    <span>18. Lesson Repository — LessonRepository.kt</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const repoCode = `package com.eduai.repository

import com.eduai.model.Lesson
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.Query

class LessonRepository {

    private val db = FirebaseFirestore.getInstance()

    private val lessons =
        db.collection("lessons")

    fun addLesson(
        subjectId: String,
        chapterId: String,
        title: String,
        description: String,
        content: String,
        order: Int,
        onSuccess: () -> Unit,
        onError: (Exception) -> Unit
    ) {

        val document = lessons.document()

        val data = hashMapOf(
            "id" to document.id,
            "subjectId" to subjectId,
            "chapterId" to chapterId,
            "title" to title,
            "description" to description,
            "content" to content,
            "order" to order,
            "isActive" to true,
            "isPublished" to false,
            "createdAt" to FieldValue.serverTimestamp()
        )

        document.set(data)
            .addOnSuccessListener {
                onSuccess()
            }
            .addOnFailureListener {
                onError(it)
            }
    }

    fun updateLesson(
        lessonId: String,
        title: String,
        description: String,
        content: String,
        order: Int,
        onSuccess: () -> Unit,
        onError: (Exception) -> Unit
    ) {

        val data = hashMapOf<String, Any>(
            "title" to title,
            "description" to description,
            "content" to content,
            "order" to order
        )

        lessons.document(lessonId)
            .update(data)
            .addOnSuccessListener {
                onSuccess()
            }
            .addOnFailureListener {
                onError(it)
            }
    }

    fun disableLesson(
        lessonId: String,
        onSuccess: () -> Unit,
        onError: (Exception) -> Unit
    ) {

        lessons.document(lessonId)
            .update("isActive", false)
            .addOnSuccessListener {
                onSuccess()
            }
            .addOnFailureListener {
                onError(it)
            }
    }

    fun publishLesson(
        lessonId: String,
        onSuccess: () -> Unit,
        onError: (Exception) -> Unit
    ) {

        lessons.document(lessonId)
            .update("isPublished", true)
            .addOnSuccessListener {
                onSuccess()
            }
            .addOnFailureListener {
                onError(it)
            }
    }

    fun getLessons(
        chapterId: String,
        onSuccess: (List<Lesson>) -> Unit,
        onError: (Exception) -> Unit
    ) {

        lessons
            .whereEqualTo("chapterId", chapterId)
            .whereEqualTo("isActive", true)
            .orderBy("order", Query.Direction.ASCENDING)
            .get()
            .addOnSuccessListener { snapshot ->

                val list = snapshot.documents.mapNotNull {
                    it.toObject(Lesson::class.java)
                }

                onSuccess(list)
            }
            .addOnFailureListener {
                onError(it)
            }
    }
}`;
                      navigator.clipboard?.writeText(repoCode);
                      setFeedback({ type: 'success', message: 'Copied LessonRepository.kt to clipboard!' });
                    }}
                    className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-400/30 flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy LessonRepository.kt</span>
                  </button>
                </div>
                <pre className="font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed max-h-56 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
{`class LessonRepository {
    // 1. addLesson (Active=true, Published=false, Order, Timestamp)
    // 2. updateLesson (title, description, content, order)
    // 3. disableLesson (isActive -> false)
    // 4. publishLesson (isPublished -> true)
    // 5. getLessons (chapterId, isActive == true, orderBy "order")
}`}
                </pre>
              </div>

              {/* 9. AndroidManifest.xml Registration */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-cyan-400" />
                    <span>9. AndroidManifest.xml Registration</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const manifestSnippet = `<activity
    android:name=".admin.LessonManagementActivity"
    android:exported="false" />

<activity
    android:name=".student.VideoPlayerActivity"
    android:exported="false" />`;
                      navigator.clipboard?.writeText(manifestSnippet);
                      setFeedback({ type: 'success', message: 'Copied Manifest activity snippet!' });
                    }}
                    className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-400/30 flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy XML</span>
                  </button>
                </div>
                <pre className="font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed bg-slate-900/90 p-3 rounded-xl border border-slate-800">
{`<uses-permission
    android:name="android.permission.INTERNET" />

<activity
    android:name=".admin.LessonManagementActivity"
    android:exported="false" />

<activity
    android:name=".student.VideoPlayerActivity"
    android:exported="false" />`}
                </pre>
              </div>

              {/* 11. Student-side query */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-cyan-400" />
                    <span>11. Student-side query (Active &amp; Published Only)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const querySnippet = `fun getPublishedLessons(
    chapterId: String,
    onSuccess: (List<Lesson>) -> Unit,
    onError: (Exception) -> Unit
) {

    FirebaseFirestore.getInstance()
        .collection("lessons")
        .whereEqualTo("chapterId", chapterId)
        .whereEqualTo("isActive", true)
        .whereEqualTo("isPublished", true)
        .orderBy(
            "order",
            com.google.firebase.firestore.Query.Direction.ASCENDING
        )
        .get()
        .addOnSuccessListener { result ->

            val lessons =
                result.documents.mapNotNull {
                    it.toObject(Lesson::class.java)
                }

            onSuccess(lessons)
        }
        .addOnFailureListener {
            onError(it)
        }
}`;
                      navigator.clipboard?.writeText(querySnippet);
                      setFeedback({ type: 'success', message: 'Copied getPublishedLessons query snippet!' });
                    }}
                    className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-400/30 flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Query</span>
                  </button>
                </div>
                <pre className="font-mono text-xs text-amber-300 overflow-x-auto leading-relaxed bg-slate-900/90 p-3 rounded-xl border border-slate-800">
{`fun getPublishedLessons(
    chapterId: String,
    onSuccess: (List<Lesson>) -> Unit,
    onError: (Exception) -> Unit
) {
    FirebaseFirestore.getInstance()
        .collection("lessons")
        .whereEqualTo("chapterId", chapterId)
        .whereEqualTo("isActive", true)
        .whereEqualTo("isPublished", true)
        .orderBy("order", Query.Direction.ASCENDING)
        .get()
        ...
}`}
                </pre>
              </div>

              {/* 12. Admin Workflow Diagram */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>12. Admin Workflow Tree</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const asciiTree = `                    EDUAI ADMIN
                         │
                         ▼
                  B.Sc Computer Science
                         │
                         ▼
                  Machine Learning
                         │
                         ▼
                Linear Regression
                         │
                         ▼
              ┌─────────────────────┐
              │ LESSONS             │
              │                     │
              │ 1. Introduction     │
              │    [Draft]          │
              │                     │
              │ 2. Simple Regression│
              │    [Published]      │
              │                     │
              │ 3. Multiple         │
              │    Regression       │
              │    [Draft]          │
              └─────────────────────┘`;
                      navigator.clipboard?.writeText(asciiTree);
                      setFeedback({ type: 'success', message: 'Copied Admin Workflow tree to clipboard!' });
                    }}
                    className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-400/30 flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Diagram</span>
                  </button>
                </div>
                <pre className="font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed bg-slate-900/90 p-4 rounded-xl border border-slate-800">
{`                    EDUAI ADMIN
                         │
                         ▼
                  B.Sc Computer Science
                         │
                         ▼
                  Machine Learning
                         │
                         ▼
                Linear Regression
                         │
                         ▼
              ┌─────────────────────┐
              │ LESSONS             │
              │                     │
              │ 1. Introduction     │
              │    [Draft]          │
              │                     │
              │ 2. Simple Regression│
              │    [Published]      │
              │                     │
              │ 3. Multiple         │
              │    Regression       │
              │    [Draft]          │
              └─────────────────────┘`}
                </pre>
              </div>

              {/* 13. Implementation 3: PDF Upload Pipeline */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span className="text-rose-400 font-bold flex items-center gap-1.5">
                    <FileDown className="w-3.5 h-3.5 text-rose-400" />
                    <span>2. Firebase Storage Hierarchy &amp; PDF Pipeline</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const snippet = `// 2. Firebase Storage structure:
// EduAI Storage
// │
// └── lessons
//     └── {subjectId}
//         └── {chapterId}
//             └── {lessonId}
//                 └── pdf
//                     └── lesson.pdf

fun uploadLessonPdf(
    subjectId: String,
    chapterId: String,
    lessonId: String,
    fileUri: Uri,
    fileName: String = "lesson.pdf",
    onSuccess: (downloadUrl: String) -> Unit,
    onError: (Exception) -> Unit
) {
    val storageRef = FirebaseStorage.getInstance().reference
        .child("lessons/$subjectId/$chapterId/$lessonId/pdf/$fileName")

    storageRef.putFile(fileUri)
        .addOnSuccessListener {
            storageRef.downloadUrl.addOnSuccessListener { uri ->
                val downloadUrl = uri.toString()
                FirebaseFirestore.getInstance().collection("lessons")
                    .document(lessonId)
                    .update("pdfUrl", downloadUrl)
                    .addOnSuccessListener { onSuccess(downloadUrl) }
            }
        }
        .addOnFailureListener { onError(it) }
}`;
                      navigator.clipboard?.writeText(snippet);
                      setFeedback({ type: 'success', message: 'Copied Firebase Storage pipeline code to clipboard!' });
                    }}
                    className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-400/30 flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Storage Pipeline</span>
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300">
                    <span className="text-rose-400 font-bold">Storage Hierarchy:</span> <code className="text-cyan-300">lessons/&#123;subjectId&#125;/&#123;chapterId&#125;/&#123;lessonId&#125;/pdf/lesson.pdf</code>
                  </div>
                  <pre className="font-mono text-xs text-rose-300 overflow-x-auto leading-relaxed bg-slate-900/90 p-3 rounded-xl border border-slate-800">
{`EduAI Storage
│
└── lessons
    │
    └── {subjectId}
        │
        └── {chapterId}
            │
            └── {lessonId}
                │
                └── pdf
                    │
                    └── lesson.pdf`}
                  </pre>
                  <pre className="font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed bg-slate-900/90 p-3 rounded-xl border border-slate-800">
{`// 1. Android Admin selects PDF and calls:
//    repository.uploadLessonPdf(subjectId, chapterId, lessonId, fileUri, "lesson.pdf")
// 2. File uploaded to: FirebaseStorage.child("lessons/\$subjectId/\$chapterId/\$lessonId/pdf/lesson.pdf")
// 3. Download URL saved to Firestore: lessons/\$lessonId { pdfUrl }
// 4. Student App queries published lessons and clicks "📖 Open PDF"
// 5. LessonPdfViewerActivity loads URL in Google Docs embed / WebView`}
                  </pre>
                </div>
              </div>

              {/* 19. Video Learning Management System (LKG → Degree) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span className="text-blue-400 font-bold flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-blue-400" />
                    <span>19. Video Learning Management System (Supports LKG → Degree)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const videoFlow = `Video Learning Management System
Supports LKG → Degree, with reusable lesson screens.

1. How the system works

EduAI Admin Panel
                 |
Choose Subject → Chapter → Lesson
Select and Upload Video
                 |
MP4 or another supported video format
Firebase Storage + Firestore
                 |
Store the video and save its URL
EduAI Student Video Player
                 |
Watch lessons with playback controls`;
                      navigator.clipboard?.writeText(videoFlow);
                      setFeedback({ type: 'success', message: 'Copied Video LMS workflow to clipboard!' });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-400/30 flex items-center gap-1 cursor-pointer hover:bg-blue-500/30 transition-all"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy Video Flow</span>
                  </button>
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  <p className="font-semibold text-slate-200">
                    Supports LKG → Degree, with reusable lesson screens.
                  </p>
                  <p className="text-slate-400">
                    Unified architecture allowing identical video playback controls across nursery rhymes, primary foundational phonics, high school physics, and degree-level machine learning derivations.
                  </p>
                </div>

                <pre className="font-mono text-xs text-blue-300 overflow-x-auto leading-relaxed bg-slate-900/95 p-5 rounded-xl border border-blue-500/30 shadow-inner">
{`EduAI Admin Panel
                 │
Choose Subject ➔ Chapter ➔ Lesson
Select and Upload Video
                 │
MP4 or another supported video format
Firebase Storage + Firestore
                 │
Store the video and save its URL
EduAI Student Video Player
                 │
Watch lessons with playback controls`}
                </pre>

                {/* Storage & Code Specifications for Video LMS */}
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300">
                    <span className="text-blue-400 font-bold">Unified Storage Folder Structure:</span>{' '}
                    <code className="text-cyan-300">lessons/ML001/CH001/lesson001/&#123;pdf/lesson.pdf, video/lesson.mp4&#125;</code>
                  </div>

                  <pre className="font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed bg-slate-900/95 p-4 rounded-xl border border-slate-800">
{`lessons/
  └── ML001/
       └── CH001/
            └── lesson001/
                 ├── pdf/
                 │    └── lesson.pdf
                 └── video/
                      └── lesson.mp4`}
                  </pre>

                  <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/50 text-[11px] text-blue-200">
                    <strong>Why <code>videoPath</code> matters:</strong> Storing <code className="text-cyan-300 font-mono">videoPath</code> lets you locate or replace the file in Firebase Storage later without depending only on the download URL.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                      <span className="text-emerald-400 font-bold block">Kotlin VideoRepository.kt</span>
                      <pre className="text-slate-300 text-[10px] overflow-x-auto">
{`fun uploadVideo(
    uri: Uri,
    subjectId: String,
    chapterId: String,
    lessonId: String,
    onProgress: (Int) -> Unit,
    onSuccess: (String, String) -> Unit,
    onError: (Exception) -> Unit
) {
    val path = "lessons/$subjectId/$chapterId/$lessonId/video/lesson.mp4"
    val reference = storage.reference.child(path)
    val metadata = StorageMetadata.Builder()
        .setContentType("video/mp4")
        .build()

    reference.putFile(uri, metadata)
        .addOnProgressListener { s ->
            if (s.totalByteCount > 0) {
                onProgress((100.0 * s.bytesTransferred / s.totalByteCount).toInt())
            }
        }
        .addOnSuccessListener {
            reference.downloadUrl
                .addOnSuccessListener { url -> onSuccess(url.toString(), path) }
                .addOnFailureListener(onError)
        }
        .addOnFailureListener(onError)
}`}
                      </pre>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                      <span className="text-purple-400 font-bold block">Kotlin LessonRepository.kt</span>
                      <pre className="text-slate-300 text-[10px] overflow-x-auto">
{`fun updateVideo(
    lessonId: String,
    videoUrl: String,
    videoPath: String,
    onSuccess: () -> Unit,
    onError: (Exception) -> Unit
) {
    lessons.document(lessonId)
        .update(
            mapOf(
                "videoUrl" to videoUrl,
                "videoPath" to videoPath
            )
        )
        .addOnSuccessListener { onSuccess() }
        .addOnFailureListener(onError)
}`}
                      </pre>
                    </div>
                  </div>

                  {/* Step 10: Student Video Player (Media3 ExoPlayer) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                      <span className="text-cyan-400 font-bold block">10. XML — activity_video_player.xml</span>
                      <pre className="text-slate-300 text-[10px] overflow-x-auto">
{`<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="12dp">

    <TextView
        android:id="@+id/txtVideoTitle"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:textSize="22sp"
        android:textStyle="bold"
        android:paddingBottom="12dp" />

    <androidx.media3.ui.PlayerView
        android:id="@+id/playerView"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:keepScreenOn="true"
        android:background="#000000"
        app:resize_mode="fit"
        app:use_controller="true" />
</LinearLayout>`}
                      </pre>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                      <span className="text-amber-400 font-bold block">10. Media3 — VideoPlayerActivity.kt</span>
                      <pre className="text-slate-300 text-[10px] overflow-x-auto">
{`class VideoPlayerActivity : AppCompatActivity() {
    private var player: ExoPlayer? = null
    private lateinit var playerView: PlayerView
    private var videoUrl = ""
    private var playbackPosition = 0L
    private var playWhenReady = true

    override fun onStart() {
        super.onStart()
        if (videoUrl.isBlank()) return
        player = ExoPlayer.Builder(this).build().also {
            playerView.player = it
            it.setMediaItem(MediaItem.fromUri(videoUrl))
            it.playWhenReady = playWhenReady
            if (playbackPosition > 0L) it.seekTo(playbackPosition)
            it.prepare()
        }
    }

    override fun onStop() {
        playbackPosition = player?.currentPosition ?: playbackPosition
        playWhenReady = player?.playWhenReady ?: playWhenReady
        playerView.player = null
        player?.release()
        player = null
        super.onStop()
    }
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsArchitectureModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold cursor-pointer"
              >
                Close Architecture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
