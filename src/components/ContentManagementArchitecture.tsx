import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  BookOpen,
  FolderTree,
  FileText,
  FileCode,
  Video,
  Upload,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Eye,
  Save,
  Send,
  Database,
  Layers,
  Sparkles,
  ArrowRight,
  ArrowDown,
  Check,
  RefreshCw,
  Clock,
  Play,
  Share2,
  ExternalLink,
  ChevronRight,
  Plus,
  Trash2,
  BarChart3,
  Bot,
  Languages,
  Mic,
  Camera,
  Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db, setDoc, doc, serverTimestamp } from '../lib/firebase';

interface ContentManagementArchitectureProps {
  onNavigate?: (tabId: string) => void;
}

export type PipelineStep =
  | 'admin'
  | 'subject'
  | 'chapter'
  | 'lesson'
  | 'resources'
  | 'quiz'
  | 'draft'
  | 'review'
  | 'publish'
  | 'firebase'
  | 'student_app';

export const ContentManagementArchitecture: React.FC<ContentManagementArchitectureProps> = ({
  onNavigate,
}) => {
  const { user, setActiveTab } = useAuth();

  // Active highlighted or selected step in the architecture pipeline
  const [currentStep, setCurrentStep] = useState<PipelineStep>('lesson');
  const [activeTabMode, setActiveTabMode] = useState<'pipeline' | 'diagram' | 'catalog'>('pipeline');

  // STEP 1: SUBJECT SELECTION / CREATION
  const [selectedSubject, setSelectedSubject] = useState<string>('Machine Learning');
  const [newSubjectTitle, setNewSubjectTitle] = useState<string>('');
  const [isCreatingCustomSubject, setIsCreatingCustomSubject] = useState<boolean>(false);
  const [subjectLevel, setSubjectLevel] = useState<string>('Degree / B.Tech CSE');

  // STEP 2: CHAPTER SELECTION / CREATION
  const [selectedChapter, setSelectedChapter] = useState<string>('Linear Regression');
  const [newChapterTitle, setNewChapterTitle] = useState<string>('');
  const [isCreatingCustomChapter, setIsCreatingCustomChapter] = useState<boolean>(false);
  const [chapterOrder, setChapterOrder] = useState<number>(1);

  // STEP 3: LESSON METADATA
  const [lessonTitle, setLessonTitle] = useState<string>('Simple Linear Regression');
  const [lessonSummary, setLessonSummary] = useState<string>(
    'Master the fundamentals of slope (m), y-intercept (c), Ordinary Least Squares (OLS), and R² coefficient.'
  );
  const [lessonOrder, setLessonOrder] = useState<number>(1);

  // STEP 4: TRIPARTITE RESOURCES (CONTENT, PDF, VIDEO)
  const [activeResourceSubTab, setActiveResourceSubTab] = useState<'content' | 'pdf' | 'video'>('content');
  const [lessonContent, setLessonContent] = useState<string>(
`# Simple Linear Regression

Simple Linear Regression is a foundational supervised learning algorithm that models the linear relationship between a continuous predictor variable ($X$) and a continuous target response ($Y$).

### Mathematical Formulation
$$Y = \\beta_0 + \\beta_1X + \\varepsilon$$

Where:
- **$\\beta_0$ (Intercept)**: Expected value of $Y$ when $X = 0$.
- **$\\beta_1$ (Slope)**: Rate of change in $Y$ per unit change in $X$.
- **$\\varepsilon$ (Residual Error)**: Gaussian deviation between predicted $\\hat{Y}$ and true $Y$.

### Ordinary Least Squares (OLS)
The regression parameters are estimated by minimizing the Residual Sum of Squares (RSS):
$$RSS = \\sum_{i=1}^{n} (y_i - \\hat{y}_i)^2 = \\sum_{i=1}^{n} (y_i - (\\beta_0 + \\beta_1x_i))^2$$

### Coefficient of Determination ($R^2$)
$$R^2 = 1 - \\frac{SS_{res}}{SS_{tot}} = 1 - \\frac{\\sum(y_i - \\hat{y}_i)^2}{\\sum(y_i - \\bar{y})^2}$$`
  );

  const [pdfName, setPdfName] = useState<string>('Simple_Linear_Regression_Handbook.pdf');
  const [pdfUrl, setPdfUrl] = useState<string>('https://cdn.eduai.edu/handbooks/simple_linear_regression.pdf');
  const [pdfSize, setPdfSize] = useState<string>('2.4 MB');
  const [pdfPages, setPdfPages] = useState<number>(18);

  const [videoTitle, setVideoTitle] = useState<string>('Lecture 2: Simple Linear Regression & Gradient Descent');
  const [videoUrl, setVideoUrl] = useState<string>('https://www.youtube.com/watch?v=7ArmBVF2dCs');
  const [videoDuration, setVideoDuration] = useState<string>('22:15 mins');

  // STEP 5: QUIZ INTEGRATION
  const [quizTitle, setQuizTitle] = useState<string>('Simple Linear Regression Mastery Check');
  const [quizPassingScore, setQuizPassingScore] = useState<number>(70);
  const [quizQuestions, setQuizQuestions] = useState<
    Array<{
      id: string;
      question: string;
      optionA: string;
      optionB: string;
      optionC: string;
      optionD: string;
      correctAnswer: string;
      explanation: string;
    }>
  >([
    {
      id: 'q1',
      question: 'In Simple Linear Regression $Y = mx + c$, what does $m$ physically represent?',
      optionA: 'The value of Y when X is 0',
      optionB: 'The slope or rate of change in Y per unit increase in X',
      optionC: 'The total sum of squared residuals',
      optionD: 'The variance of the dependent variable',
      correctAnswer: 'B',
      explanation: 'Slope (m) dictates the steepness and direction of the linear relationship.',
    },
    {
      id: 'q2',
      question: 'What is the primary objective of Ordinary Least Squares (OLS)?',
      optionA: 'Maximize the slope coefficient',
      optionB: 'Minimize the sum of squared differences between observed and predicted values',
      optionC: 'Eliminate all outlier data points',
      optionD: 'Equalize variance between X and Y',
      correctAnswer: 'B',
      explanation: 'OLS fits a line that minimizes RSS: $\\sum (y_i - \\hat{y}_i)^2$.',
    },
  ]);

  // STEP 6, 7, 8: LIFECYCLE STATE (DRAFT, REVIEW, PUBLISH)
  const [publicationStatus, setPublicationStatus] = useState<'draft' | 'in_review' | 'published'>('draft');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);
  const [lastFirestoreDocId, setLastFirestoreDocId] = useState<string>('les-ml-linreg-01');
  const [lastSyncedAt, setLastSyncedAt] = useState<string>('Recently synced');

  // Pre-configured Subject & Chapter taxonomy
  const subjectTaxonomy: Record<string, string[]> = {
    'Machine Learning': [
      'Linear Regression',
      'Logistic Regression',
      'Decision Trees & Random Forests',
      'K-Means Clustering',
      'Neural Networks & Deep Learning',
    ],
    'Mathematics (Class 10)': [
      'Real Numbers',
      'Polynomials',
      'Pair of Linear Equations in Two Variables',
      'Quadratic Equations',
      'Arithmetic Progressions',
      'Coordinate Geometry',
    ],
    'Physics (Class 12 / MPC)': [
      'Electric Charges & Fields',
      'Electrostatic Potential & Capacitance',
      'Current Electricity',
      'Moving Charges & Magnetism',
      'Electromagnetic Induction',
    ],
    'Data Structures & Algorithms': [
      'Arrays & Two Pointers',
      'Singly & Doubly Linked Lists',
      'Binary Trees & BSTs',
      'Dynamic Programming',
      'Graph Traversal (BFS / DFS)',
    ],
  };

  // HANDLER: SAVE AS DRAFT
  const handleSaveAsDraft = async () => {
    setIsProcessing(true);
    setStatusMessage(null);
    try {
      const generatedId = `draft-${Date.now().toString().slice(-6)}`;
      const docPayload = {
        id: generatedId,
        subjectId: selectedSubject.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        subjectTitle: selectedSubject,
        chapterId: selectedChapter.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        chapterTitle: selectedChapter,
        title: lessonTitle,
        description: lessonSummary,
        content: lessonContent,
        pdfUrl,
        pdfName,
        pdfSize,
        videoUrl,
        videoPath: `lessons/${selectedSubject.toLowerCase().replace(/[^a-z0-9]/g, '_')}/${selectedChapter.toLowerCase().replace(/[^a-z0-9]/g, '_')}/${generatedId}/video/lesson.mp4`,
        videoTitle,
        videoDuration,
        quiz: {
          title: quizTitle,
          passingScore: quizPassingScore,
          questionsCount: quizQuestions.length,
          questions: quizQuestions,
        },
        order: Number(lessonOrder) || 1,
        status: 'draft',
        isPublished: false,
        authorEmail: user?.email || 'admin@eduai.edu',
        updatedAt: serverTimestamp(),
      };

      try {
        await setDoc(doc(db, 'lessons', generatedId), docPayload, { merge: true });
      } catch (err) {
        console.warn('Draft persisted locally in cache:', err);
      }

      setLastFirestoreDocId(generatedId);
      setPublicationStatus('draft');
      setLastSyncedAt(new Date().toLocaleTimeString());
      setStatusMessage({
        type: 'info',
        text: `💾 Saved as Draft in Firestore ("lessons/${generatedId}")! Status: Draft. Ready for Review.`,
      });
      setCurrentStep('draft');
    } catch (e) {
      setStatusMessage({
        type: 'error',
        text: `Error saving draft: ${String(e)}`,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // HANDLER: MOVE TO REVIEW
  const handleEnterReview = () => {
    setPublicationStatus('in_review');
    setCurrentStep('review');
    setStatusMessage({
      type: 'info',
      text: `👀 Review Mode activated! Previewing content exactly as viewed in Student App (Learn, AI, Quiz).`,
    });
  };

  // HANDLER: PUBLISH TO FIREBASE
  const handlePublishToFirebase = async () => {
    setIsProcessing(true);
    setStatusMessage(null);
    try {
      const liveDocId = `les-${selectedSubject.toLowerCase().slice(0, 3)}-${Date.now().toString().slice(-5)}`;
      const publishedPayload = {
        id: liveDocId,
        subjectId: selectedSubject.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        subjectTitle: selectedSubject,
        chapterId: selectedChapter.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        chapterTitle: selectedChapter,
        title: lessonTitle,
        description: lessonSummary,
        content: lessonContent,
        pdfUrl,
        pdfName,
        pdfSize,
        videoUrl,
        videoPath: `lessons/${selectedSubject.toLowerCase().replace(/[^a-z0-9]/g, '_')}/${selectedChapter.toLowerCase().replace(/[^a-z0-9]/g, '_')}/${liveDocId}/video/lesson.mp4`,
        videoTitle,
        videoDuration,
        quiz: {
          title: quizTitle,
          passingScore: quizPassingScore,
          questionsCount: quizQuestions.length,
          questions: quizQuestions,
        },
        order: Number(lessonOrder) || 1,
        status: 'published',
        isPublished: true,
        authorEmail: user?.email || 'admin@eduai.edu',
        publishedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'lessons', liveDocId), publishedPayload, { merge: true });

      setLastFirestoreDocId(liveDocId);
      setPublicationStatus('published');
      setLastSyncedAt(new Date().toLocaleTimeString());
      setCurrentStep('publish');
      setStatusMessage({
        type: 'success',
        text: `🚀 Successfully Published to Firebase Firestore! Document live at "lessons/${liveDocId}". Students can now Learn, use In-Lesson AI, take the Quiz, and track Progress!`,
      });
    } catch (e: any) {
      console.error('Publish error:', e);
      setStatusMessage({
        type: 'error',
        text: `Firestore Publish Error: ${e?.message || String(e)}`,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // NAVIGATION TO STUDENT APP
  const handleLaunchStudentApp = (target: 'learn' | 'ai' | 'quiz' | 'progress') => {
    if (target === 'progress') {
      if (onNavigate) onNavigate('student-progress');
      else setActiveTab('student-progress');
      return;
    }
    // For learn, ai, quiz: navigate to student-lesson
    if (onNavigate) onNavigate('student-lesson');
    else setActiveTab('student-lesson');
  };

  return (
    <div className="space-y-6">
      {/* 
        TOP BANNER: ARCHITECTURE IDENTIFIER & OVERVIEW 
      */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/50 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              13. Final Content Management Architecture
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              End-to-End Educational Publishing Pipeline
            </h1>
            <p className="text-sm text-indigo-200/80 leading-relaxed">
              Unified lifecycle connecting Admin authoring ➔ Curriculum structuring ➔ Tripartite resources (Content, PDF, Video) ➔ Lesson Quiz ➔ Draft, Review & Publish ➔ Cloud Firebase ➔ Student App (Learn, AI, Quiz, Progress).
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex flex-wrap gap-2 bg-white/10 p-1.5 rounded-2xl backdrop-blur-xs shrink-0 self-start md:self-center border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTabMode('pipeline')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTabMode === 'pipeline'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Live Pipeline Runner
            </button>
            <button
              type="button"
              onClick={() => setActiveTabMode('diagram')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTabMode === 'diagram'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              Interactive Topology Map
            </button>
            <button
              type="button"
              onClick={() => setActiveTabMode('catalog')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTabMode === 'catalog'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              Published Catalog
            </button>
          </div>
        </div>
      </div>

      {/* 
        VISUAL INTERACTIVE TOPOLOGY PIPELINE (MATCHING USER ARCHITECTURE DIAGRAM)
      */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Layers className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Interactive Architecture Tree
              </h2>
              <p className="text-xs text-slate-500">
                Click on any node to inspect its live stage or trigger actions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                publicationStatus === 'published'
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                  : publicationStatus === 'in_review'
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              Status: {publicationStatus.toUpperCase()}
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Doc: {lastFirestoreDocId}
            </span>
          </div>
        </div>

        {/* FLOW GRAPH CONTAINER */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[840px] flex flex-col items-center py-4 text-xs font-bold text-slate-700 dark:text-slate-300">
            {/* LEVEL 1: ADMIN */}
            <button
              type="button"
              onClick={() => setCurrentStep('admin')}
              className={`px-6 py-2.5 rounded-2xl border transition-all flex items-center gap-2 shadow-xs ${
                currentStep === 'admin'
                  ? 'bg-purple-600 text-white border-purple-500 ring-2 ring-purple-400 shadow-md scale-105'
                  : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-100'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>ADMIN</span>
            </button>

            <ArrowDown className="w-4 h-4 text-slate-400 my-1.5 animate-bounce" />

            {/* LEVEL 2: SELECT SUBJECT */}
            <button
              type="button"
              onClick={() => setCurrentStep('subject')}
              className={`px-6 py-2.5 rounded-2xl border transition-all flex items-center gap-2 shadow-xs ${
                currentStep === 'subject'
                  ? 'bg-blue-600 text-white border-blue-500 ring-2 ring-blue-400 shadow-md scale-105'
                  : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>SELECT SUBJECT: {selectedSubject}</span>
            </button>

            <ArrowDown className="w-4 h-4 text-slate-400 my-1.5" />

            {/* LEVEL 3: CREATE CHAPTER */}
            <button
              type="button"
              onClick={() => setCurrentStep('chapter')}
              className={`px-6 py-2.5 rounded-2xl border transition-all flex items-center gap-2 shadow-xs ${
                currentStep === 'chapter'
                  ? 'bg-indigo-600 text-white border-indigo-500 ring-2 ring-indigo-400 shadow-md scale-105'
                  : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100'
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span>CREATE CHAPTER: {selectedChapter}</span>
            </button>

            <ArrowDown className="w-4 h-4 text-slate-400 my-1.5" />

            {/* LEVEL 4: CREATE LESSON */}
            <button
              type="button"
              onClick={() => setCurrentStep('lesson')}
              className={`px-6 py-2.5 rounded-2xl border transition-all flex items-center gap-2 shadow-xs ${
                currentStep === 'lesson'
                  ? 'bg-indigo-700 text-white border-indigo-600 ring-2 ring-indigo-400 shadow-md scale-105'
                  : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-900 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700 hover:bg-indigo-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>CREATE LESSON: {lessonTitle}</span>
            </button>

            <ArrowDown className="w-4 h-4 text-slate-400 my-1.5" />

            {/* LEVEL 5: TRIPARTITE FORK (CONTENT | PDF | VIDEO) */}
            <div className="w-full max-w-2xl px-4 py-2 relative">
              <div className="border-t-2 border-slate-300 dark:border-slate-700 w-full mb-3" />
              <div className="grid grid-cols-3 gap-4 text-center">
                {/* Content */}
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep('resources');
                    setActiveResourceSubTab('content');
                  }}
                  className={`p-3 rounded-2xl border transition-all flex flex-col items-center gap-1.5 ${
                    currentStep === 'resources' && activeResourceSubTab === 'content'
                      ? 'bg-emerald-600 text-white border-emerald-500 ring-2 ring-emerald-400 shadow-md'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  }`}
                >
                  <FileCode className="w-4 h-4" />
                  <span className="font-black">CONTENT</span>
                  <span className="text-[10px] opacity-80">Text & Formulas</span>
                </button>

                {/* PDF */}
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep('resources');
                    setActiveResourceSubTab('pdf');
                  }}
                  className={`p-3 rounded-2xl border transition-all flex flex-col items-center gap-1.5 ${
                    currentStep === 'resources' && activeResourceSubTab === 'pdf'
                      ? 'bg-rose-600 text-white border-rose-500 ring-2 ring-rose-400 shadow-md'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span className="font-black">PDF</span>
                  <span className="text-[10px] opacity-80">{pdfSize} Handbook</span>
                </button>

                {/* Video */}
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep('resources');
                    setActiveResourceSubTab('video');
                  }}
                  className={`p-3 rounded-2xl border transition-all flex flex-col items-center gap-1.5 ${
                    currentStep === 'resources' && activeResourceSubTab === 'video'
                      ? 'bg-red-600 text-white border-red-500 ring-2 ring-red-400 shadow-md'
                      : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span className="font-black">VIDEO</span>
                  <span className="text-[10px] opacity-80">{videoDuration} HD</span>
                </button>
              </div>
            </div>

            <ArrowDown className="w-4 h-4 text-slate-400 my-1.5" />

            {/* LEVEL 6: QUIZ */}
            <button
              type="button"
              onClick={() => setCurrentStep('quiz')}
              className={`px-6 py-2.5 rounded-2xl border transition-all flex items-center gap-2 shadow-xs ${
                currentStep === 'quiz'
                  ? 'bg-amber-600 text-white border-amber-500 ring-2 ring-amber-400 shadow-md scale-105'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>QUIZ ({quizQuestions.length} Questions)</span>
            </button>

            <ArrowDown className="w-4 h-4 text-slate-400 my-1.5" />

            {/* LEVEL 7: SAVE AS DRAFT */}
            <button
              type="button"
              onClick={() => {
                setCurrentStep('draft');
                handleSaveAsDraft();
              }}
              className={`px-6 py-2.5 rounded-2xl border transition-all flex items-center gap-2 shadow-xs ${
                currentStep === 'draft'
                  ? 'bg-slate-700 text-white border-slate-600 ring-2 ring-slate-400 shadow-md scale-105'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>SAVE AS DRAFT</span>
            </button>

            <ArrowDown className="w-4 h-4 text-slate-400 my-1.5" />

            {/* LEVEL 8: REVIEW */}
            <button
              type="button"
              onClick={() => {
                setCurrentStep('review');
                handleEnterReview();
              }}
              className={`px-6 py-2.5 rounded-2xl border transition-all flex items-center gap-2 shadow-xs ${
                currentStep === 'review'
                  ? 'bg-cyan-600 text-white border-cyan-500 ring-2 ring-cyan-400 shadow-md scale-105'
                  : 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800 hover:bg-cyan-100'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>REVIEW (Student Perspective)</span>
            </button>

            <ArrowDown className="w-4 h-4 text-slate-400 my-1.5" />

            {/* LEVEL 9: PUBLISH */}
            <button
              type="button"
              onClick={() => {
                setCurrentStep('publish');
                handlePublishToFirebase();
              }}
              className={`px-6 py-2.5 rounded-2xl border transition-all flex items-center gap-2 shadow-xs ${
                currentStep === 'publish'
                  ? 'bg-emerald-600 text-white border-emerald-500 ring-2 ring-emerald-400 shadow-md scale-105'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>PUBLISH</span>
            </button>

            <ArrowDown className="w-4 h-4 text-slate-400 my-1.5" />

            {/* LEVEL 10: FIREBASE */}
            <button
              type="button"
              onClick={() => setCurrentStep('firebase')}
              className={`px-6 py-2.5 rounded-2xl border transition-all flex items-center gap-2 shadow-xs ${
                currentStep === 'firebase'
                  ? 'bg-orange-600 text-white border-orange-500 ring-2 ring-orange-400 shadow-md scale-105'
                  : 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800 hover:bg-orange-100'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>FIREBASE (Firestore Cloud & Rules)</span>
            </button>

            <ArrowDown className="w-4 h-4 text-slate-400 my-1.5 animate-bounce" />

            {/* LEVEL 11: STUDENT APP */}
            <div className="w-full max-w-2xl p-4 rounded-3xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border-2 border-indigo-500/30 flex flex-col items-center">
              <button
                type="button"
                onClick={() => setCurrentStep('student_app')}
                className={`px-6 py-2.5 rounded-2xl border font-black transition-all flex items-center gap-2 mb-3 shadow-xs ${
                  currentStep === 'student_app'
                    ? 'bg-indigo-600 text-white border-indigo-500 ring-2 ring-indigo-400 shadow-md'
                    : 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>STUDENT APP</span>
              </button>

              <div className="border-t-2 border-indigo-200 dark:border-indigo-800 w-full mb-3" />

              {/* STUDENT APP THREE PILLARS: LEARN, AI, QUIZ */}
              <div className="grid grid-cols-3 gap-3 w-full text-center">
                <button
                  type="button"
                  onClick={() => handleLaunchStudentApp('learn')}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-center gap-1 group"
                >
                  <BookOpen className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">Learn</span>
                  <span className="text-[10px] text-slate-400">Content, PDF, Video</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLaunchStudentApp('ai')}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 hover:shadow-md transition-all flex flex-col items-center gap-1 group"
                >
                  <Bot className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">AI</span>
                  <span className="text-[10px] text-slate-400">Explain, Telugu, Voice</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLaunchStudentApp('quiz')}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 hover:shadow-md transition-all flex flex-col items-center gap-1 group"
                >
                  <HelpCircle className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">Quiz</span>
                  <span className="text-[10px] text-slate-400">Interactive Test</span>
                </button>
              </div>

              <ArrowDown className="w-4 h-4 text-indigo-400 my-2" />

              {/* LEVEL 12: PROGRESS */}
              <button
                type="button"
                onClick={() => handleLaunchStudentApp('progress')}
                className="w-full py-2.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <BarChart3 className="w-4 h-4" />
                <span>11. Progress (███████░░░ 68% Tracked in Firestore)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FEEDBACK STATUS ALERT */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between gap-3 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              : statusMessage.type === 'info'
              ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />}
            {statusMessage.type === 'info' && <Sparkles className="w-4 h-4 shrink-0 text-indigo-600" />}
            {statusMessage.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />}
            <span>{statusMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="text-xs uppercase tracking-wider font-bold opacity-60 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 
        TAB VIEW 1: LIVE PIPELINE RUNNER (ADMIN WORKBENCH)
      */}
      {activeTabMode === 'pipeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT 7 COLS: STEP FORM CONTROLS */}
          <div className="lg:col-span-7 space-y-6">
            {/* STAGE 1: SELECT SUBJECT */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                    1
                  </span>
                  <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                    Select Subject
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">
                  Curriculum Mapping
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.keys(subjectTaxonomy).map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => {
                      setSelectedSubject(sub);
                      setSelectedChapter(subjectTaxonomy[sub][0]);
                      setIsCreatingCustomSubject(false);
                    }}
                    className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all ${
                      selectedSubject === sub && !isCreatingCustomSubject
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="line-clamp-2">{sub}</div>
                  </button>
                ))}
              </div>

              {isCreatingCustomSubject ? (
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <input
                    type="text"
                    value={newSubjectTitle}
                    onChange={(e) => setNewSubjectTitle(e.target.value)}
                    placeholder="Enter new subject name (e.g. Artificial Intelligence)"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCreatingCustomSubject(false)}
                      className="px-3 py-1 text-xs text-slate-500 hover:text-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (newSubjectTitle.trim()) {
                          setSelectedSubject(newSubjectTitle.trim());
                          setIsCreatingCustomSubject(false);
                        }
                      }}
                      className="px-3 py-1 rounded-xl bg-blue-600 text-white text-xs font-bold"
                    >
                      Use Subject
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsCreatingCustomSubject(true)}
                  className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  + Create custom subject
                </button>
              )}
            </div>

            {/* STAGE 2: CREATE CHAPTER */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                    2
                  </span>
                  <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                    Create Chapter under "{selectedSubject}"
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">
                  Chapter Hierarchy
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {(subjectTaxonomy[selectedSubject] || ['Linear Regression', 'Classification']).map((ch, idx) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => {
                      setSelectedChapter(ch);
                      setChapterOrder(idx + 1);
                      setIsCreatingCustomChapter(false);
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                      selectedChapter === ch && !isCreatingCustomChapter
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Ch {idx + 1}: {ch}
                  </button>
                ))}
              </div>

              {isCreatingCustomChapter ? (
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <input
                    type="text"
                    value={newChapterTitle}
                    onChange={(e) => setNewChapterTitle(e.target.value)}
                    placeholder="Enter new chapter title"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCreatingCustomChapter(false)}
                      className="px-3 py-1 text-xs text-slate-500 hover:text-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (newChapterTitle.trim()) {
                          setSelectedChapter(newChapterTitle.trim());
                          setIsCreatingCustomChapter(false);
                        }
                      }}
                      className="px-3 py-1 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                    >
                      Add Chapter
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsCreatingCustomChapter(true)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  + Create custom chapter
                </button>
              )}
            </div>

            {/* STAGE 3: CREATE LESSON */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs">
                    3
                  </span>
                  <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                    Create Lesson Metadata
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">
                  Lesson Details
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-3 space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Lesson Title
                  </label>
                  <input
                    type="text"
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Lesson Order
                  </label>
                  <input
                    type="number"
                    value={lessonOrder}
                    onChange={(e) => setLessonOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Summary / Student Outcome
                </label>
                <textarea
                  rows={2}
                  value={lessonSummary}
                  onChange={(e) => setLessonSummary(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>
            </div>

            {/* STAGE 4: TRIPARTITE RESOURCES (CONTENT, PDF, VIDEO) */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                    4
                  </span>
                  <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                    Tripartite Resources
                  </h3>
                </div>

                {/* Subtabs for Content, PDF, Video */}
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setActiveResourceSubTab('content')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      activeResourceSubTab === 'content'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <FileCode className="w-3 h-3" />
                    Content
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveResourceSubTab('pdf')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      activeResourceSubTab === 'pdf'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <FileText className="w-3 h-3" />
                    PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveResourceSubTab('video')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      activeResourceSubTab === 'video'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Video className="w-3 h-3" />
                    Video
                  </button>
                </div>
              </div>

              {/* TAB A: CONTENT (MARKDOWN & FORMULAS) */}
              {activeResourceSubTab === 'content' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Supports Markdown, LaTeX formulas, and equations ($Y = mx + c$)</span>
                    <button
                      type="button"
                      onClick={() =>
                        setLessonContent(
                          `# Simple Linear Regression\n\nSimple Linear Regression models the linear relationship between continuous predictor ($X$) and outcome ($Y$).\n\n### Equation\n$$Y = \\beta_0 + \\beta_1X + \\varepsilon$$\n\n### Ordinary Least Squares\nMinimizes residual sum of squares: $\\sum (y_i - \\hat{y}_i)^2$.`
                        )
                      }
                      className="text-emerald-600 font-bold hover:underline"
                    >
                      Reset to ML Template
                    </button>
                  </div>
                  <textarea
                    rows={8}
                    value={lessonContent}
                    onChange={(e) => setLessonContent(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}

              {/* TAB B: PDF */}
              {activeResourceSubTab === 'pdf' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">PDF Handbook Name</label>
                      <input
                        type="text"
                        value={pdfName}
                        onChange={(e) => setPdfName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">File Size & Pages</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={pdfSize}
                          onChange={(e) => setPdfSize(e.target.value)}
                          placeholder="e.g. 2.4 MB"
                          className="w-1/2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                        />
                        <input
                          type="number"
                          value={pdfPages}
                          onChange={(e) => setPdfPages(Number(e.target.value))}
                          placeholder="Pages"
                          className="w-1/2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">CDN / Storage URL</label>
                    <input
                      type="url"
                      value={pdfUrl}
                      onChange={(e) => setPdfUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {/* TAB C: VIDEO */}
              {activeResourceSubTab === 'video' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Lecture Video Title</label>
                      <input
                        type="text"
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Duration</label>
                      <input
                        type="text"
                        value={videoDuration}
                        onChange={(e) => setVideoDuration(e.target.value)}
                        placeholder="e.g. 22:15 mins"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Streaming / YouTube URL</label>
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* STAGE 5: QUIZ BUILDER */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                    5
                  </span>
                  <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                    Quiz Integration ({quizQuestions.length} Questions)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextNum = quizQuestions.length + 1;
                    setQuizQuestions([
                      ...quizQuestions,
                      {
                        id: `q${nextNum}`,
                        question: `New Question ${nextNum} regarding ${lessonTitle}?`,
                        optionA: 'Option A statement',
                        optionB: 'Option B statement',
                        optionC: 'Option C statement',
                        optionD: 'Option D statement',
                        correctAnswer: 'A',
                        explanation: 'Explanation for correct choice.',
                      },
                    ]);
                  }}
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  + Add Question
                </button>
              </div>

              {quizQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Q{idx + 1}: {q.question}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold">
                      Ans: {q.correctAnswer}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-500">
                    <div>A: {q.optionA}</div>
                    <div>B: {q.optionB}</div>
                    <div>C: {q.optionC}</div>
                    <div>D: {q.optionD}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* STAGE 6, 7, 8: ACTION BUTTONS (SAVE AS DRAFT, REVIEW, PUBLISH) */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 text-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Lifecycle Publishing Controls
                </span>
                <span className="text-xs font-mono text-emerald-400">
                  Target: Firestore /lessons/{lastFirestoreDocId}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* 6. SAVE AS DRAFT */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleSaveAsDraft}
                  className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-black flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4 text-slate-300" />
                  <span>Save as Draft</span>
                </button>

                {/* 7. REVIEW */}
                <button
                  type="button"
                  onClick={handleEnterReview}
                  className="py-3 px-4 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <Eye className="w-4 h-4" />
                  <span>Review Preview</span>
                </button>

                {/* 8. PUBLISH */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handlePublishToFirebase}
                  className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isProcessing ? 'Publishing...' : 'Publish to Firebase'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT 5 COLS: STUDENT VIEW PREVIEW & FIREBASE MIRROR */}
          <div className="lg:col-span-5 space-y-6">
            {/* LIVE FIREBASE CLOUD MIRROR */}
            <div className="p-5 rounded-3xl bg-slate-950 text-slate-200 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-orange-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                    Firebase Firestore Document
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Synced: {lastSyncedAt}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-[11px] space-y-1 text-slate-300 overflow-x-auto max-h-56">
                <div>{'{'}</div>
                <div className="pl-4 text-emerald-400">"id": "{lastFirestoreDocId}",</div>
                <div className="pl-4 text-blue-400">"subject": "{selectedSubject}",</div>
                <div className="pl-4 text-indigo-400">"chapter": "{selectedChapter}",</div>
                <div className="pl-4 text-purple-400">"title": "{lessonTitle}",</div>
                <div className="pl-4 text-amber-400">"status": "{publicationStatus}",</div>
                <div className="pl-4 text-rose-400">"pdfUrl": "{pdfUrl.slice(0, 30)}...",</div>
                <div className="pl-4 text-red-400">"videoUrl": "{videoUrl.slice(0, 30)}...",</div>
                <div className="pl-4 text-cyan-400">"quizQuestions": {quizQuestions.length},</div>
                <div className="pl-4 text-slate-500">"rules": "Authenticated Admin write / Student read"</div>
                <div>{'}'}</div>
              </div>
            </div>

            {/* STUDENT APP PREVIEW (LEARN, AI, QUIZ, PROGRESS) */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                      Student App Mirror
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Live interactive consumer view
                    </p>
                  </div>
                </div>

                <span className="text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Ready
                </span>
              </div>

              {/* CARD PREVIEW */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-200 dark:border-indigo-800 space-y-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                    {selectedSubject} • Chapter {chapterOrder}
                  </span>
                  <h4 className="text-base font-black text-slate-900 dark:text-white">
                    {lessonTitle}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1">
                    {lessonSummary}
                  </p>
                </div>

                {/* 4 ACTION BUTTONS FOR STUDENT */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-indigo-200/60 dark:border-indigo-800/60">
                  <button
                    type="button"
                    onClick={() => handleLaunchStudentApp('learn')}
                    className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-700 text-left hover:border-indigo-500 transition-all"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      <span>Learn</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Video, PDF & Math</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLaunchStudentApp('ai')}
                    className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-700 text-left hover:border-purple-500 transition-all"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <Bot className="w-3.5 h-3.5 text-purple-600" />
                      <span>AI Doubt</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Telugu, Voice, Notes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLaunchStudentApp('quiz')}
                    className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-700 text-left hover:border-amber-500 transition-all"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Quiz</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{quizQuestions.length} Questions</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLaunchStudentApp('progress')}
                    className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-700 text-left hover:border-emerald-500 transition-all"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Progress</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Syncs to 68%</span>
                  </button>
                </div>
              </div>

              {/* DIRECT QUICK LAUNCH BAR */}
              <button
                type="button"
                onClick={() => handleLaunchStudentApp('learn')}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <span>Launch in Student App</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 
        TAB VIEW 2: TOPOLOGY DIAGRAM & ASCII ARCHITECTURE SPECIFICATION
      */}
      {activeTabMode === 'diagram' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-950 text-white border border-slate-800 font-mono space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                System Specification: Architecture Tree
              </span>
              <span className="text-xs text-slate-400">EduAI Content Flow v2.0</span>
            </div>

            <pre className="text-xs text-indigo-300 leading-relaxed overflow-x-auto p-4 bg-slate-900/80 rounded-2xl border border-slate-800">
{`                         ADMIN
                           │
                           ▼
                    SELECT SUBJECT
                           │
                           ▼
                    CREATE CHAPTER
                           │
                           ▼
                     CREATE LESSON
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
          CONTENT         PDF           VIDEO
             │
             ▼
           QUIZ
             │
             ▼
        SAVE AS DRAFT
             │
             ▼
          REVIEW
             │
             ▼
          PUBLISH
             │
             ▼
          FIREBASE
             │
             ▼
        STUDENT APP
             │
       ┌─────┼─────┐
       ▼     ▼     ▼
     Learn  AI    Quiz
       │
       ▼
    Progress`}
            </pre>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 pt-2">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="font-bold text-emerald-400 uppercase block">1. Authoring & Storage</span>
                <p className="text-slate-400 leading-relaxed">
                  Admin manages curriculum hierarchy in Firestore. Binary PDFs and video streams are stored with optimized CDNs and referenced by URL and storagePath.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="font-bold text-indigo-400 uppercase block">2. Student Consumption</span>
                <p className="text-slate-400 leading-relaxed">
                  The Student App binds directly to Firestore live documents. In-lesson AI executes contextual explanations, Telugu translation, and notes. Progress updates Firestore `progress` collection with percentage mastery.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 
        TAB VIEW 3: PUBLISHED CATALOG
      */}
      {activeTabMode === 'catalog' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
              Curriculum Catalog Matrix
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Filtered by Active Subjects
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {[
              {
                subject: 'Machine Learning',
                chapter: 'Linear Regression',
                lesson: 'Simple Linear Regression',
                status: 'published',
                resources: ['Content (Math)', 'PDF (2.4 MB)', 'Video (22m)'],
                quiz: '2 Questions',
              },
              {
                subject: 'Mathematics (Class 10)',
                chapter: 'Quadratic Equations',
                lesson: 'Solving by Factoring & Quadratic Formula',
                status: 'published',
                resources: ['Content (Algebra)', 'PDF (1.8 MB)', 'Video (18m)'],
                quiz: '5 Questions',
              },
              {
                subject: 'Physics (Class 12 / MPC)',
                chapter: 'Electromagnetic Induction',
                lesson: "Faraday's Law & Lenz's Law",
                status: 'published',
                resources: ['Content (Flux)', 'PDF (3.1 MB)', 'Video (25m)'],
                quiz: '4 Questions',
              },
            ].map((item, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {item.lesson}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                      {item.status}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {item.subject} • {item.chapter}
                  </span>
                  <div className="flex gap-2 text-[10px] text-slate-400 mt-1">
                    {item.resources.map((r, rIdx) => (
                      <span key={rIdx} className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {r}
                      </span>
                    ))}
                    <span className="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded font-bold">
                      {item.quiz}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleLaunchStudentApp('learn')}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-colors"
                  >
                    Open Lesson
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLaunchStudentApp('ai')}
                    className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-bold transition-colors"
                  >
                    Test AI
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
