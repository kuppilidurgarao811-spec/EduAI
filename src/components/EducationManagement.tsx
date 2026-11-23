import React, { useState, useEffect } from 'react';
import { LessonEditor } from './LessonEditor';
import { QuizManager } from './QuizManager';
import { ChapterManagement } from './ChapterManagement';
import {
  BookOpen,
  Plus,
  Trash2,
  CheckCircle2,
  Layers,
  Video,
  FileText,
  HelpCircle,
  Sparkles,
  ChevronRight,
  RefreshCw,
  FolderPlus,
  Globe,
  GraduationCap,
  Calendar,
  AlertCircle,
  Database,
  ExternalLink,
  Edit3,
  FileSpreadsheet,
  Upload,
  Download,
  Check,
  Copy,
  FileCode,
  Search,
  SlidersHorizontal,
  X,
  Save,
} from 'lucide-react';
import { db, setDoc, doc, collection, getDocs, deleteDoc, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { EducationLevel } from '../types';

interface ChapterItem {
  id: string;
  chapterId?: string;
  subjectId?: string;
  title: string;
  description: string;
  order?: number;
  isActive?: boolean;
  createdAt?: string;
}

interface LessonItem {
  id: string;
  lessonId?: string;
  chapterId?: string;
  chapterTitle?: string;
  title: string;
  description?: string;
  content?: string;
  duration?: string;
  summary?: string;
  videoUrl?: string;
  pdfUrl?: string;
  thumbnailUrl?: string;
  order?: number;
  isPublished?: boolean;
}

interface VideoItem {
  id: string;
  title: string;
  url: string;
  duration: string;
  summary: string;
}

interface PdfItem {
  id: string;
  title: string;
  url: string;
  fileSize: string;
  pageCount: number;
}

interface QuizItem {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index
  explanation: string;
}

export interface PublishedSubject {
  id: string;
  name: string;
  code?: string;
  subjectCode?: string;
  levelId?: string;
  courseId?: string;
  className?: string;
  yearOrClass?: string;
  level?: string;
  classOrCourse?: string;
  course?: string;
  semester?: number;
  description: string;
  language: string;
  order?: number;
  displayOrder?: number;
  isActive: boolean;
  createdAt?: string;
  createdBy?: string;
  icon?: string;
  chapters?: ChapterItem[];
  lessons?: LessonItem[];
  videos?: VideoItem[];
  pdfs?: PdfItem[];
  quizQuestions?: QuizItem[];
}

const PRESET_ICONS = [
  { name: 'Brain', label: 'AI / Machine Learning' },
  { name: 'Calculator', label: 'Mathematics' },
  { name: 'Atom', label: 'Physics / Science' },
  { name: 'Code', label: 'Computer Science / Programming' },
  { name: 'BookOpen', label: 'General / Languages' },
  { name: 'Globe', label: 'Geography / Social' },
  { name: 'GraduationCap', label: 'Higher Education' },
  { name: 'Cpu', label: 'Electronics & Tech' },
];

export interface CsvSubjectRow {
  level: string;
  class?: string;
  course?: string;
  semester?: string;
  subject: string;
  chapter: string;
  lesson: string;
}

const DEFAULT_SAMPLE_CSV = `level,class,course,semester,subject,chapter,lesson
LKG,LKG,,,English,Alphabet,A to Z
School,10,,,Mathematics,Algebra,Quadratic Equations
Degree,,B.Sc CS,5,Machine Learning,Regression,Linear Regression
Degree,,B.Tech CSE,6,Deep Learning,Neural Networks,CNN Architecture
Intermediate,12,MPC,,Physics,Electromagnetism,Faraday Law
Early Childhood,UKG,,,Rhymes & Stories,Nursery Rhymes,Twinkle Twinkle Little Star`;

export type AdminContentTab =
  | 'subjects'
  | 'chapters'
  | 'lessons'
  | 'pdfs'
  | 'videos'
  | 'quizzes'
  | 'published'
  | 'csv-import'
  | 'add'
  | 'list';

export const EducationManagement: React.FC = () => {
  const { user, addCourse } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<AdminContentTab>('subjects');

  // CSV Batch Import State
  const [csvRawText, setCsvRawText] = useState<string>(DEFAULT_SAMPLE_CSV);
  const [csvSuccess, setCsvSuccess] = useState<string | null>(null);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [isImportingCsv, setIsImportingCsv] = useState<boolean>(false);
  const [csvCopied, setCsvCopied] = useState<boolean>(false);

  // Form State
  const [educationLevel, setEducationLevel] = useState<string>('Degree');
  const [classOrCourse, setClassOrCourse] = useState<string>('B.Sc Computer Science');
  const [yearOrClass, setYearOrClass] = useState<string>('3rd Year');
  const [semester, setSemester] = useState<string>('5');
  const [subjectName, setSubjectName] = useState<string>('Machine Learning');
  const [subjectCode, setSubjectCode] = useState<string>('CSML501');
  const [subjectDescription, setSubjectDescription] = useState<string>(
    'Comprehensive degree course covering supervised learning, neural networks, decision trees, and deep learning algorithms.'
  );
  const [subjectIcon, setSubjectIcon] = useState<string>('Brain');
  const [language, setLanguage] = useState<string>('English');
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState<boolean>(true);

  // Chapters list (Default Machine Learning sequence)
  const [chapters, setChapters] = useState<ChapterItem[]>([
    {
      id: 'chap-1',
      title: '1. Introduction to Machine Learning',
      description: 'Foundational concepts, supervised vs unsupervised learning, machine learning lifecycle and workflow.',
      order: 1,
      isActive: true,
    },
    {
      id: 'chap-2',
      title: '2. Linear Regression',
      description: 'Simple and multiple linear regression, ordinary least squares, cost function, and gradient descent optimization.',
      order: 2,
      isActive: true,
    },
    {
      id: 'chap-3',
      title: '3. Logistic Regression',
      description: 'Binary and multiclass classification, sigmoid function, cross-entropy loss, decision boundaries, and evaluation metrics.',
      order: 3,
      isActive: true,
    },
    {
      id: 'chap-4',
      title: '4. Decision Trees',
      description: 'Entropy, information gain, Gini impurity, tree pruning, ID3/CART algorithms, and random forest fundamentals.',
      order: 4,
      isActive: true,
    },
    {
      id: 'chap-5',
      title: '5. K-Means Clustering',
      description: 'Unsupervised partitioning, Euclidean distance metric, centroid optimization, elbow method, and silhouette analysis.',
      order: 5,
      isActive: true,
    },
  ]);

  // Lessons list (Linear Regression 5-lesson sequence)
  const [lessons, setLessons] = useState<LessonItem[]>([
    {
      id: 'les-1',
      title: '1. Introduction',
      duration: '15 mins',
      summary: 'Intuition behind regression, continuous vs discrete targets, and basic assumptions.',
      chapterTitle: '2. Linear Regression',
      content: 'Linear regression models the relationship between a scalar response and one or more explanatory variables.',
      videoUrl: 'https://www.youtube.com/watch?v=nk2CQITm_eo',
      pdfUrl: 'https://cdn.eduai.edu/handbooks/intro_linear_regression.pdf',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
      order: 1,
      isPublished: true,
    },
    {
      id: 'les-2',
      title: '2. Simple Linear Regression',
      duration: '20 mins',
      summary: 'Single variable slope calculation, y-intercept formulation, and line of best fit.',
      chapterTitle: '2. Linear Regression',
      content: 'Equation: y = mx + c. Where m is the slope, c is the y-intercept, and residuals represent vertical distances.',
      videoUrl: 'https://www.youtube.com/watch?v=7ArmBVF2dCs',
      pdfUrl: 'https://cdn.eduai.edu/handbooks/simple_linear_regression.pdf',
      thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&q=80',
      order: 2,
      isPublished: true,
    },
    {
      id: 'les-3',
      title: '3. Multiple Linear Regression',
      duration: '25 mins',
      summary: 'Multi-feature regression matrices, multicollinearity, and adjusted R-squared.',
      chapterTitle: '2. Linear Regression',
      content: 'Multiple linear regression extends simple regression to multiple input variables: Y = beta_0 + beta_1*X_1 + ... + epsilon.',
      videoUrl: 'https://www.youtube.com/watch?v=dQNpSa-BQ4M',
      pdfUrl: 'https://cdn.eduai.edu/handbooks/multiple_linear_regression.pdf',
      thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80',
      order: 3,
      isPublished: true,
    },
    {
      id: 'les-4',
      title: '4. Least Squares Method',
      duration: '22 mins',
      summary: 'Ordinary Least Squares (OLS) derivation, cost function minimization, and closed-form normal equation.',
      chapterTitle: '2. Linear Regression',
      content: 'Normal Equation: theta = (X^T * X)^(-1) * X^T * y computes optimal weights directly without iterations.',
      videoUrl: 'https://www.youtube.com/watch?v=JvS2U30765w',
      pdfUrl: 'https://cdn.eduai.edu/handbooks/least_squares_method.pdf',
      thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80',
      order: 4,
      isPublished: true,
    },
    {
      id: 'les-5',
      title: '5. Model Evaluation',
      duration: '18 mins',
      summary: 'R-Squared, Adjusted R2, Mean Squared Error (MSE), Root Mean Squared Error (RMSE), and Mean Absolute Error (MAE).',
      chapterTitle: '2. Linear Regression',
      content: 'Evaluating predictive accuracy with MSE, RMSE, MAE, and R-squared variance metrics.',
      videoUrl: 'https://www.youtube.com/watch?v=L-Lflxbh43A',
      pdfUrl: 'https://cdn.eduai.edu/handbooks/model_evaluation_metrics.pdf',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&q=80',
      order: 5,
      isPublished: true,
    },
  ]);

  // Videos list
  const [videos, setVideos] = useState<VideoItem[]>([
    {
      id: 'vid-1',
      title: 'Lecture 1: Gradient Descent Proof & Vectorization',
      url: 'https://www.youtube.com/watch?v=aircAruvnKk',
      duration: '22 mins',
      summary: 'Step-by-step vector derivation of batch gradient descent algorithms.',
    },
  ]);

  // PDFs list
  const [pdfs, setPdfs] = useState<PdfItem[]>([
    {
      id: 'pdf-1',
      title: 'Machine Learning Complete Lecture Notes (Semester 5)',
      url: 'https://cdn.eduai.edu/handbooks/ml_sem5_handbook.pdf',
      fileSize: '6.8 MB',
      pageCount: 48,
    },
  ]);

  // Quiz questions list
  const [quizQuestions, setQuizQuestions] = useState<QuizItem[]>([
    {
      id: 'qz-1',
      question: 'Which loss function is commonly used for multi-class classification problems?',
      options: ['Mean Squared Error (MSE)', 'Cross-Entropy Loss', 'Mean Absolute Error (MAE)', 'Hinge Loss'],
      correctAnswer: 1,
      explanation: 'Cross-Entropy Loss measures performance of classification models whose output is a probability value between 0 and 1.',
    },
  ]);

  // Publishing State
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);

  // Firestore Saved Subjects
  const [savedSubjects, setSavedSubjects] = useState<PublishedSubject[]>([]);
  const [isLoadingList, setIsLoadingList] = useState<boolean>(false);
  const [searchSubjectQuery, setSearchSubjectQuery] = useState<string>('');
  const [filterLevel, setFilterLevel] = useState<string>('All');
  const [editingSubject, setEditingSubject] = useState<PublishedSubject | null>(null);
  const [isUpdatingSubject, setIsUpdatingSubject] = useState<boolean>(false);

  // Load Firestore published subjects
  const fetchPublishedSubjects = async () => {
    setIsLoadingList(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'subjects'));
      const list: PublishedSubject[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as PublishedSubject);
      });
      setSavedSubjects(list);
    } catch (err) {
      console.warn('Could not fetch published subjects from Firestore:', err);
    } finally {
      setIsLoadingList(false);
    }
  };

  // CSV Parser Helper
  const parseCsvRows = (text: string): CsvSubjectRow[] => {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const rows: CsvSubjectRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;

      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let c = 0; c < line.length; c++) {
        const char = line[c];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      const obj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        obj[h] = values[idx] || '';
      });

      if (obj['subject'] && (obj['level'] || obj['class'] || obj['course'])) {
        rows.push({
          level: obj['level'] || 'School',
          class: obj['class'] || '',
          course: obj['course'] || '',
          semester: obj['semester'] || '',
          subject: obj['subject'] || '',
          chapter: obj['chapter'] || 'Chapter 1',
          lesson: obj['lesson'] || 'Lesson 1',
        });
      }
    }
    return rows;
  };

  // Group rows into PublishedSubject objects
  const parsedCsvRows = parseCsvRows(csvRawText);

  const getGroupedSubjectsFromRows = (rows: CsvSubjectRow[]): PublishedSubject[] => {
    const map = new Map<string, PublishedSubject>();

    rows.forEach((row) => {
      const level = row.level.trim();
      const classOrCourse = (row.class || row.course || 'General').trim();
      const semesterNum = row.semester ? parseInt(row.semester, 10) : undefined;
      const subjName = row.subject.trim();

      const key = `${level}___${classOrCourse}___${semesterNum || ''}___${subjName}`;

      if (!map.has(key)) {
        const docId = `subj-${subjName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.random().toString(36).substring(2, 7)}`;
        map.set(key, {
          id: docId,
          name: subjName,
          level,
          classOrCourse,
          course: classOrCourse,
          semester: semesterNum,
          language: 'English',
          description: `Auto-imported subject curriculum for ${subjName} (${classOrCourse}).`,
          icon: 'BookOpen',
          isActive: true,
          createdAt: new Date().toISOString(),
          createdBy: user?.email || 'admin@eduai.edu',
          chapters: [],
          lessons: [],
          videos: [
            {
              id: `vid-${Date.now()}-1`,
              title: `${subjName} Introduction & Overview`,
              url: 'https://www.youtube.com/watch?v=aircAruvnKk',
              duration: '15 mins',
              summary: `Fundamental video lecture on ${subjName}.`,
            },
          ],
          pdfs: [
            {
              id: `pdf-${Date.now()}-1`,
              title: `${subjName} Study Handbook`,
              url: 'https://cdn.eduai.edu/handbooks/subject_notes.pdf',
              fileSize: '4.2 MB',
              pageCount: 30,
            },
          ],
          quizQuestions: [
            {
              id: `qz-${Date.now()}-1`,
              question: `What is the core topic studied in ${subjName}?`,
              options: [
                'Fundamental definitions and principles',
                'Arbitrary historical dates',
                'Unrelated memorization',
                'None of the above',
              ],
              correctAnswer: 0,
              explanation: `${subjName} focuses on fundamental definitions, principles, and analytical problem solving.`,
            },
          ],
        });
      }

      const existingSub = map.get(key)!;

      // Add Chapter if not exists
      const chapTitle = row.chapter.trim();
      if (chapTitle) {
        let chapObj = existingSub.chapters?.find((c) => c.title === chapTitle);
        if (!chapObj) {
          chapObj = {
            id: `chap-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            title: chapTitle,
            description: `Core module for ${chapTitle}.`,
          };
          existingSub.chapters = [...(existingSub.chapters || []), chapObj];
        }
      }

      // Add Lesson if not exists
      const lesTitle = row.lesson.trim();
      if (lesTitle) {
        const lesExists = existingSub.lessons?.some((l) => l.title === lesTitle);
        if (!lesExists) {
          existingSub.lessons = [
            ...(existingSub.lessons || []),
            {
              id: `les-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              title: lesTitle,
              duration: '15 mins',
              summary: `Lesson on ${lesTitle} in chapter ${row.chapter}.`,
              chapterTitle: row.chapter,
            },
          ];
        }
      }
    });

    return Array.from(map.values());
  };

  const groupedSubjectsToImport = getGroupedSubjectsFromRows(parsedCsvRows);

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCsvRawText(content);
        setCsvSuccess(`Loaded file "${file.name}" (${file.size} bytes) successfully!`);
      }
    };
    reader.onerror = () => {
      setCsvError('Failed to read CSV file. Please make sure it is a valid text or CSV file.');
    };
    reader.readAsText(file);
  };

  // Download Sample CSV
  const handleDownloadSampleCsv = () => {
    const blob = new Blob([DEFAULT_SAMPLE_CSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'eduai_subjects_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import to Firebase Execute
  const handleExecuteCsvImport = async () => {
    setCsvError(null);
    setCsvSuccess(null);

    if (groupedSubjectsToImport.length === 0) {
      setCsvError('No valid subject rows found in CSV. Please verify header and rows.');
      return;
    }

    setIsImportingCsv(true);

    try {
      let importedCount = 0;

      for (const sub of groupedSubjectsToImport) {
        // Save to Firestore
        await setDoc(doc(db, 'subjects', sub.id), sub);

        // Also add to local Course Context
        addCourse({
          id: sub.id,
          title: `${sub.name} (${sub.classOrCourse}${sub.semester ? `, Sem ${sub.semester}` : ''})`,
          subject: sub.name,
          level: (sub.level as EducationLevel) || 'School',
          category: 'Curriculum Import',
          instructor: 'EduAI Faculty',
          description: sub.description,
          thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
          pdfCount: sub.pdfs?.length || 1,
          videoCount: sub.videos?.length || 1,
          enrolledCount: 1,
          rating: 5.0,
          progressPercent: 0,
          modules: (sub.lessons || []).map((l, i) => ({
            id: l.id,
            title: l.title || `Lesson ${i + 1}`,
            duration: l.duration || '15 mins',
            type: 'video' as const,
            summary: l.summary,
          })),
        });

        importedCount++;
      }

      setCsvSuccess(
        `🎉 Successfully imported ${importedCount} subjects (${parsedCsvRows.length} CSV rows) directly into Firebase Firestore!`
      );

      // Refresh list
      fetchPublishedSubjects();
    } catch (err: any) {
      console.error('CSV import failed:', err);
      try {
        handleFirestoreError(err, OperationType.WRITE, 'subjects/csv-import');
      } catch (formatted: any) {
        setCsvError(`CSV Import Error: ${formatted.message}`);
      }
    } finally {
      setIsImportingCsv(false);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'list') {
      fetchPublishedSubjects();
    }
  }, [activeSubTab]);

  // Chapter Helpers
  const addChapter = () => {
    setChapters((prev) => [
      ...prev,
      {
        id: `chap-${Date.now()}`,
        title: `Chapter ${prev.length + 1}: `,
        description: '',
      },
    ]);
  };

  const updateChapter = (id: string, fields: Partial<ChapterItem>) => {
    setChapters((prev) => prev.map((c) => (c.id === id ? { ...c, ...fields } : c)));
  };

  const removeChapter = (id: string) => {
    setChapters((prev) => prev.filter((c) => c.id !== id));
  };

  // Lesson Helpers
  const addLesson = () => {
    setLessons((prev) => [
      ...prev,
      {
        id: `les-${Date.now()}`,
        title: '',
        duration: '15 mins',
        summary: '',
      },
    ]);
  };

  const updateLesson = (id: string, fields: Partial<LessonItem>) => {
    setLessons((prev) => prev.map((l) => (l.id === id ? { ...l, ...fields } : l)));
  };

  const removeLesson = (id: string) => {
    setLessons((prev) => prev.filter((l) => l.id !== id));
  };

  // Video Helpers
  const addVideo = () => {
    setVideos((prev) => [
      ...prev,
      {
        id: `vid-${Date.now()}`,
        title: '',
        url: '',
        duration: '20 mins',
        summary: '',
      },
    ]);
  };

  const updateVideo = (id: string, fields: Partial<VideoItem>) => {
    setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, ...fields } : v)));
  };

  const removeVideo = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  // PDF Helpers
  const addPdf = () => {
    setPdfs((prev) => [
      ...prev,
      {
        id: `pdf-${Date.now()}`,
        title: '',
        url: '',
        fileSize: '3.5 MB',
        pageCount: 20,
      },
    ]);
  };

  const updatePdf = (id: string, fields: Partial<PdfItem>) => {
    setPdfs((prev) => prev.map((p) => (p.id === id ? { ...p, ...fields } : p)));
  };

  const removePdf = (id: string) => {
    setPdfs((prev) => prev.filter((p) => p.id !== id));
  };

  // Quiz Helpers
  const addQuizQuestion = () => {
    setQuizQuestions((prev) => [
      ...prev,
      {
        id: `qz-${Date.now()}`,
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
      },
    ]);
  };

  const updateQuizQuestion = (id: string, fields: Partial<QuizItem>) => {
    setQuizQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...fields } : q)));
  };

  const updateQuizOption = (qId: string, optIndex: number, val: string) => {
    setQuizQuestions((prev) =>
      prev.map((q) => {
        if (q.id === qId) {
          const newOpts = [...q.options];
          newOpts[optIndex] = val;
          return { ...q, options: newOpts };
        }
        return q;
      })
    );
  };

  const removeQuizQuestion = (id: string) => {
    setQuizQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // Submit Handler: Publish Subject to Firebase
  const handlePublishSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishError(null);
    setPublishSuccess(null);

    if (!subjectName.trim()) {
      setPublishError('Please enter a valid Subject Name.');
      return;
    }

    setIsPublishing(true);

    const docId = `subj-${subjectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;

    // Format clean IDs according to convention
    const formatLevelId = (lvl: string) => {
      const lower = lvl.toLowerCase();
      if (lower.includes('degree')) return 'degree';
      if (lower.includes('inter')) return 'intermediate';
      if (lower.includes('school')) return 'school';
      if (lower.includes('childhood') || lower.includes('lkg') || lower.includes('ukg')) return 'early_childhood';
      return lower.replace(/[^a-z0-9]/g, '_');
    };

    const formatCourseId = (crs: string) => {
      const lower = crs.toLowerCase();
      if (lower.includes('b.sc') || lower.includes('bsc')) return 'bsc_cs';
      if (lower.includes('b.com') || lower.includes('bcom')) return 'bcom';
      if (lower.includes('bca')) return 'bca';
      if (lower.includes('bba')) return 'bba';
      if (lower.includes('b.tech') || lower.includes('btech')) return 'btech_cse';
      if (lower.includes('mpc')) return 'inter_mpc';
      if (lower.includes('bipc')) return 'inter_bipc';
      return lower.replace(/[^a-z0-9]/g, '_');
    };

    const levelIdVal = formatLevelId(educationLevel);
    const courseIdVal = formatCourseId(classOrCourse);
    const classNameVal = yearOrClass.trim() || '3rd Year';
    const codeVal = (subjectCode.trim() || 'CSML501').toUpperCase();
    const orderVal = Number(displayOrder) || 1;
    const semesterVal = semester ? parseInt(semester, 10) : 5;

    const subjectDocumentPayload: PublishedSubject = {
      id: docId,
      name: subjectName.trim(),
      code: codeVal,
      subjectCode: codeVal,
      levelId: levelIdVal,
      courseId: courseIdVal,
      className: classNameVal,
      yearOrClass: classNameVal,
      level: educationLevel,
      classOrCourse: classOrCourse.trim(),
      course: classOrCourse.trim(),
      semester: semesterVal,
      description: subjectDescription.trim(),
      language,
      order: orderVal,
      displayOrder: orderVal,
      isActive,
      createdAt: new Date().toISOString(),
      createdBy: user?.email || 'admin@eduai.edu',
      icon: subjectIcon,
      chapters: chapters.filter((c) => c.title.trim()),
      lessons: lessons.filter((l) => l.title.trim()),
      videos: videos.filter((v) => v.title.trim()),
      pdfs: pdfs.filter((p) => p.title.trim()),
      quizQuestions: quizQuestions.filter((q) => q.question.trim()),
    };

    try {
      // 1. Store in Firestore collection 'subjects'
      const docPath = `subjects/${docId}`;
      await setDoc(doc(db, 'subjects', docId), subjectDocumentPayload);

      // 2. Also register in local Course context for instant live platform updates
      addCourse({
        id: docId,
        title: `${subjectName} (${classOrCourse}${semester ? `, Sem ${semester}` : ''})`,
        subject: subjectName,
        level: (educationLevel as EducationLevel) || 'Degree (BSc, BCom, BA, BTech)',
        category: 'Core Curriculum',
        instructor: user?.name || 'EduAI Faculty',
        description: subjectDescription,
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
        pdfCount: pdfs.length,
        videoCount: videos.length,
        enrolledCount: 1,
        rating: 5.0,
        progressPercent: 0,
        modules: [
          ...lessons.map((l, i) => ({
            id: l.id,
            title: l.title || `Lesson ${i + 1}`,
            duration: l.duration,
            type: 'video' as const,
            summary: l.summary,
          })),
          ...pdfs.map((p, i) => ({
            id: p.id,
            title: p.title || `PDF Handbook ${i + 1}`,
            duration: `${p.pageCount || 10} Pages`,
            type: 'pdf' as const,
            contentUrl: p.url,
          })),
        ],
      });

      setPublishSuccess(
        `🎉 Subject "${subjectName}" published successfully to Firebase Firestore database!`
      );

      // Refresh list
      fetchPublishedSubjects();
    } catch (err: unknown) {
      console.error('Failed to publish subject to Firebase:', err);
      try {
        handleFirestoreError(err, OperationType.WRITE, `subjects/${docId}`);
      } catch (errFormatted: any) {
        setPublishError(`Firestore Write Error: ${errFormatted.message}`);
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeleteSubject = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from Firebase Firestore?`)) return;
    try {
      await deleteDoc(doc(db, 'subjects', id));
      setSavedSubjects((prev) => prev.filter((s) => s.id !== id));
      alert(`Subject "${name}" deleted from Firebase.`);
    } catch (err) {
      alert(`Error deleting subject: ${String(err)}`);
    }
  };

  const handleOpenEditSubject = (subject: PublishedSubject) => {
    setEditingSubject({ ...subject });
  };

  const handleSaveEditedSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject || !editingSubject.name.trim()) return;

    setIsUpdatingSubject(true);
    try {
      await setDoc(doc(db, 'subjects', editingSubject.id), editingSubject, { merge: true });
      setSavedSubjects((prev) =>
        prev.map((s) => (s.id === editingSubject.id ? editingSubject : s))
      );
      setEditingSubject(null);
      alert(`Subject "${editingSubject.name}" updated successfully!`);
    } catch (err) {
      alert(`Error updating subject: ${String(err)}`);
    } finally {
      setIsUpdatingSubject(false);
    }
  };

  // Filtered Subjects for Subject Management view
  const filteredPublishedSubjects = savedSubjects.filter((sub) => {
    const matchesSearch =
      sub.name.toLowerCase().includes(searchSubjectQuery.toLowerCase()) ||
      (sub.classOrCourse || sub.course || '').toLowerCase().includes(searchSubjectQuery.toLowerCase()) ||
      (sub.description || '').toLowerCase().includes(searchSubjectQuery.toLowerCase());
    const matchesLevel = filterLevel === 'All' || sub.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Breadcrumb Path Header */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2 text-xs font-bold text-slate-500">
        <span className="text-indigo-600 dark:text-indigo-400">Dashboard</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-indigo-600 dark:text-indigo-400">Education Management</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 dark:text-slate-100 font-black">Add Subject & Curriculum</span>
      </div>

      {/* Top Action Header & EDUAI ADMIN Hub */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-[10px] font-black text-indigo-300 uppercase tracking-wider flex items-center gap-1">
                <Database className="w-3 h-3 text-amber-400" /> Firestore Database Connected
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black">
                {savedSubjects.length} Published Live
              </span>
            </div>
            <h1 className="text-2xl font-black">EDUAI ADMIN — Content Management Dashboard</h1>
            <p className="text-xs text-indigo-200">
              Manage all 7 curriculum layers: Subjects, Chapters, Lessons, PDFs, Videos, Quizzes, and Live Firestore Content.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setActiveSubTab('csv-import')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                activeSubTab === 'csv-import'
                  ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/50'
                  : 'bg-white/10 text-indigo-100 hover:bg-white/20'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>Excel / CSV Importer</span>
            </button>
          </div>
        </div>

        {/* EDUAI ADMIN Content Navigation Bar (7 Core Modules) */}
        <div className="p-2 rounded-2xl bg-black/30 border border-white/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'subjects', icon: '📚', label: 'Subjects', count: `${savedSubjects.length || 64}` },
            { id: 'chapters', icon: '📑', label: 'Chapters', count: `${chapters.length}` },
            { id: 'lessons', icon: '📖', label: 'Lessons', count: `${lessons.length}` },
            { id: 'pdfs', icon: '📄', label: 'PDFs', count: `${pdfs.length}` },
            { id: 'videos', icon: '🎥', label: 'Videos', count: `${videos.length}` },
            { id: 'quizzes', icon: '📝', label: 'Quizzes', count: `${quizQuestions.length}` },
            { id: 'published', icon: '🚀', label: 'Published Content', count: `${savedSubjects.length}` },
          ].map((tab) => {
            const isSelected = activeSubTab === tab.id || (tab.id === 'published' && activeSubTab === 'list') || (tab.id === 'subjects' && activeSubTab === 'add');
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id as AdminContentTab)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md scale-105'
                    : 'text-indigo-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="text-sm">{tab.icon}</span>
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-indigo-900/60 text-indigo-300'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-TAB: STANDALONE LESSON EDITOR SCREEN (CREATE LESSON FORM) */}
      {activeSubTab === 'lessons' && <LessonEditor />}

      {/* SUB-TAB: STANDALONE QUIZ MANAGER SCREEN (CREATE QUIZ FORM) */}
      {activeSubTab === 'quizzes' && <QuizManager />}

      {/* SUB-TAB: STANDALONE CHAPTER MANAGEMENT MODULE */}
      {activeSubTab === 'chapters' && (
        <ChapterManagement
          onNavigateToLessons={(subjectName, chapterTitle) => {
            setActiveSubTab('lessons');
          }}
        />
      )}

      {/* SUB-TAB: CURRICULUM BUILDER / FORM (Subjects, PDFs, Videos) */}
      {(activeSubTab === 'subjects' ||
        activeSubTab === 'pdfs' ||
        activeSubTab === 'videos' ||
        activeSubTab === 'add') && (
        <form onSubmit={handlePublishSubject} className="space-y-8">
          {/* Success / Error Alerts */}
          {publishSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{publishSuccess}</span>
              </div>
              <button
                type="button"
                onClick={() => setPublishSuccess(null)}
                className="text-emerald-600 hover:underline text-[11px]"
              >
                Dismiss
              </button>
            </div>
          )}

          {publishError && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-bold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>{publishError}</span>
              </div>
              <button
                type="button"
                onClick={() => setPublishError(null)}
                className="text-rose-600 hover:underline text-[11px]"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* SECTION 1: ADD SUBJECT FORM CARD */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-black text-sm">
                  📚
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                    ADD SUBJECT
                  </h2>
                  <p className="text-xs text-slate-400">
                    Define subject classification, codes, hierarchy, and visibility settings
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPublishing}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-2 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                {isPublishing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>SAVING SUBJECT...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>SAVE SUBJECT</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-4">
              {/* Row 1: Education Level & Course */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Education Level */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    <span>Education Level</span>
                  </label>
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value="Degree">Degree</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="School">School</option>
                    <option value="Early Childhood">Early Childhood (LKG / UKG)</option>
                    <option value="Competitive Exams">Competitive Exams</option>
                    <option value="Skill Development">Skill Development & Coding</option>
                  </select>
                </div>

                {/* Course */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>Course</span>
                  </label>
                  <select
                    value={classOrCourse}
                    onChange={(e) => setClassOrCourse(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value="B.Sc Computer Science">B.Sc Computer Science</option>
                    <option value="B.Com General">B.Com General</option>
                    <option value="B.Com Computer Applications">B.Com Computer Applications</option>
                    <option value="B.A History / Politics">B.A History / Politics</option>
                    <option value="BCA">BCA (Bachelor of Computer Applications)</option>
                    <option value="BBA">BBA (Bachelor of Business Admin)</option>
                    <option value="B.Tech CSE">B.Tech Computer Science Engineering</option>
                    <option value="Intermediate MPC">Intermediate MPC</option>
                    <option value="Intermediate BiPC">Intermediate BiPC</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 9">Class 9</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Year / Class & Semester */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Year / Class */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <span>Year / Class</span>
                  </label>
                  <select
                    value={yearOrClass}
                    onChange={(e) => setYearOrClass(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 8">Class 8</option>
                    <option value="Class 7">Class 7</option>
                  </select>
                </div>

                {/* Semester */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <span>Semester</span>
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value="1">Semester 1</option>
                    <option value="2">Semester 2</option>
                    <option value="3">Semester 3</option>
                    <option value="4">Semester 4</option>
                    <option value="5">Semester 5</option>
                    <option value="6">Semester 6</option>
                    <option value="7">Semester 7</option>
                    <option value="8">Semester 8</option>
                    <option value="">N/A (Not Applicable)</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Subject Name & Subject Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Subject Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Machine Learning"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    required
                  />
                </div>

                {/* Subject Code */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300">
                    Subject Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CSML501"
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Detailed syllabus overview and subject learning outcomes..."
                  value={subjectDescription}
                  onChange={(e) => setSubjectDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              {/* Row 4: Language, Display Order, Active Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* Language */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-indigo-600" />
                    <span>Language</span>
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value="English">English</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Bilingual">Bilingual (English + Telugu)</option>
                  </select>
                </div>

                {/* Display Order */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-700 dark:text-slate-300">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                {/* Active Checkbox */}
                <div className="pt-5 flex items-center">
                  <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 cursor-pointer w-full">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    />
                    <div>
                      <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                        Active
                      </span>
                      <p className="text-[10px] text-slate-400">Visible to enrolled students</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Subject Icon Selector */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300">
                  Subject Icon Preset
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESET_ICONS.map((ico) => (
                    <button
                      key={ico.name}
                      type="button"
                      onClick={() => setSubjectIcon(ico.name)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
                        subjectIcon === ico.name
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 text-indigo-700 dark:text-indigo-300 font-black shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-300'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div className="truncate">
                        <p className="text-xs font-bold">{ico.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{ico.label}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Action: [ SAVE SUBJECT ] */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isPublishing}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  {isPublishing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>SAVING SUBJECT...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>[ SAVE SUBJECT ]</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 2: CHAPTERS BUILDER */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 font-black text-sm">
                  2
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-600" /> Chapters Builder ({chapters.length})
                  </h2>
                  <p className="text-xs text-slate-400">Organize subject into modules & unit chapters</p>
                </div>
              </div>

              <button
                type="button"
                onClick={addChapter}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" /> Add Chapter
              </button>
            </div>

            <div className="space-y-3">
              {chapters.map((chap, idx) => (
                <div
                  key={chap.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      Chapter {idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeChapter(chap.id)}
                      className="p-1 rounded bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300 hover:bg-rose-200 transition-all text-xs"
                      title="Remove Chapter"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Chapter Title (e.g. Chapter 1: Introduction to Machine Learning)"
                    value={chap.title}
                    onChange={(e) => updateChapter(chap.id, { title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                  />

                  <input
                    type="text"
                    placeholder="Chapter Description summary..."
                    value={chap.description}
                    onChange={(e) => updateChapter(chap.id, { description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: LESSONS BUILDER */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-black text-sm">
                  3
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" /> Lessons Builder ({lessons.length})
                  </h2>
                  <p className="text-xs text-slate-400">Detailed lessons, topics, and duration breakdowns</p>
                </div>
              </div>

              <button
                type="button"
                onClick={addLesson}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" /> Add Lesson
              </button>
            </div>

            <div className="space-y-3">
              {lessons.map((les, idx) => (
                <div
                  key={les.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        Lesson {idx + 1}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">
                        Chapter: {les.chapterTitle || '2. Linear Regression'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={les.isPublished ?? true}
                          onChange={(e) => updateLesson(les.id, { isPublished: e.target.checked })}
                          className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                        />
                        <span>Published</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => removeLesson(les.id)}
                        className="p-1 rounded bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300 hover:bg-rose-200 transition-all text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Lesson Title (e.g. 1. Introduction)"
                      value={les.title}
                      onChange={(e) => updateLesson(les.id, { title: e.target.value })}
                      className="sm:col-span-2 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g. 15 mins)"
                      value={les.duration}
                      onChange={(e) => updateLesson(les.id, { duration: e.target.value })}
                      className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Lesson Summary / Key Learning Outcomes..."
                    value={les.summary}
                    onChange={(e) => updateLesson(les.id, { summary: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="🎥 Video URL (optional)"
                      value={les.videoUrl || ''}
                      onChange={(e) => updateLesson(les.id, { videoUrl: e.target.value })}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[11px] text-slate-600 dark:text-slate-300"
                    />
                    <input
                      type="text"
                      placeholder="📄 PDF Handbook URL (optional)"
                      value={les.pdfUrl || ''}
                      onChange={(e) => updateLesson(les.id, { pdfUrl: e.target.value })}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[11px] text-slate-600 dark:text-slate-300"
                    />
                    <input
                      type="text"
                      placeholder="🖼️ Thumbnail URL (optional)"
                      value={les.thumbnailUrl || ''}
                      onChange={(e) => updateLesson(les.id, { thumbnailUrl: e.target.value })}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[11px] text-slate-600 dark:text-slate-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: VIDEOS BUILDER */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-black text-sm">
                  4
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Video className="w-4 h-4 text-rose-600" /> Videos Builder ({videos.length})
                  </h2>
                  <p className="text-xs text-slate-400">Video lectures, streaming URLs, and length</p>
                </div>
              </div>

              <button
                type="button"
                onClick={addVideo}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" /> Add Video Lecture
              </button>
            </div>

            <div className="space-y-3">
              {videos.map((vid, idx) => (
                <div
                  key={vid.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
                      Video Lecture {idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeVideo(vid.id)}
                      className="p-1 rounded bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300 hover:bg-rose-200 transition-all text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Video Title (e.g. Gradient Descent Vectorization)"
                      value={vid.title}
                      onChange={(e) => updateVideo(vid.id, { title: e.target.value })}
                      className="sm:col-span-2 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g. 22 mins)"
                      value={vid.duration}
                      onChange={(e) => updateVideo(vid.id, { duration: e.target.value })}
                      className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <input
                    type="url"
                    placeholder="Video Streaming URL (YouTube / Vimeo / Cloud Run MP4)"
                    value={vid.url}
                    onChange={(e) => updateVideo(vid.id, { url: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-indigo-600 dark:text-indigo-400"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5: PDFS BUILDER */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-black text-sm">
                  5
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" /> PDF Handbooks ({pdfs.length})
                  </h2>
                  <p className="text-xs text-slate-400">Downloadable textbook handbooks & notes</p>
                </div>
              </div>

              <button
                type="button"
                onClick={addPdf}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" /> Add PDF Handbook
              </button>
            </div>

            <div className="space-y-3">
              {pdfs.map((pdf, idx) => (
                <div
                  key={pdf.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      PDF Document {idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removePdf(pdf.id)}
                      className="p-1 rounded bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300 hover:bg-rose-200 transition-all text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <input
                      type="text"
                      placeholder="PDF Document Title"
                      value={pdf.title}
                      onChange={(e) => updatePdf(pdf.id, { title: e.target.value })}
                      className="sm:col-span-2 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                    />
                    <input
                      type="text"
                      placeholder="File Size (e.g. 4.5 MB)"
                      value={pdf.fileSize}
                      onChange={(e) => updatePdf(pdf.id, { fileSize: e.target.value })}
                      className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                    />
                    <input
                      type="number"
                      placeholder="Pages"
                      value={pdf.pageCount || ''}
                      onChange={(e) => updatePdf(pdf.id, { pageCount: parseInt(e.target.value, 10) || 0 })}
                      className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <input
                    type="url"
                    placeholder="PDF Download / CDN Link"
                    value={pdf.url}
                    onChange={(e) => updatePdf(pdf.id, { url: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-emerald-600 dark:text-emerald-400"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 6: QUIZ QUESTIONS BUILDER */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 font-black text-sm">
                  6
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600" /> Quiz Questions ({quizQuestions.length})
                  </h2>
                  <p className="text-xs text-slate-400">Multiple choice practice test questions with explanations</p>
                </div>
              </div>

              <button
                type="button"
                onClick={addQuizQuestion}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" /> Add Quiz Question
              </button>
            </div>

            <div className="space-y-4">
              {quizQuestions.map((qz, idx) => (
                <div
                  key={qz.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      Question {idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeQuizQuestion(qz.id)}
                      className="p-1 rounded bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300 hover:bg-rose-200 transition-all text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Enter question text..."
                    value={qz.question}
                    onChange={(e) => updateQuizQuestion(qz.id, { question: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                  />

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {qz.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${qz.id}`}
                          checked={qz.correctAnswer === oIdx}
                          onChange={() => updateQuizQuestion(qz.id, { correctAnswer: oIdx })}
                          className="accent-indigo-600"
                        />
                        <input
                          type="text"
                          placeholder={`Option ${oIdx + 1}`}
                          value={opt}
                          onChange={(e) => updateQuizOption(qz.id, oIdx, e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100"
                        />
                      </div>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="Answer Explanation / Solution Proof..."
                    value={qz.explanation}
                    onChange={(e) => updateQuizQuestion(qz.id, { explanation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* PUBLISH BUTTON */}
          <div className="sticky bottom-6 z-20 p-4 rounded-3xl bg-slate-900/90 backdrop-blur-md border border-slate-700 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-white text-xs">
              <span className="font-extrabold text-amber-400">Ready to Publish:</span> {subjectName} (
              {classOrCourse}
              {semester ? `, Sem ${semester}` : ''})
              <p className="text-[11px] text-slate-400">
                {chapters.length} Chapters • {lessons.length} Lessons • {videos.length} Videos •{' '}
                {pdfs.length} PDFs • {quizQuestions.length} Quiz Questions
              </p>
            </div>

            <button
              type="submit"
              disabled={isPublishing}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-indigo-600 to-purple-600 hover:from-emerald-400 hover:to-purple-500 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2.5 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shrink-0 cursor-pointer"
            >
              {isPublishing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Publishing to Firestore...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Publish Subject to Firebase</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* SUB-TAB 2: EXCEL / CSV BATCH IMPORT */}
      {activeSubTab === 'csv-import' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-400/30 text-[10px] font-black text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" /> Step 6: CSV / Excel Automated Importer
              </span>
            </div>
            <h2 className="text-xl font-black">Excel / CSV → Firebase Firestore Import Engine</h2>
            <p className="text-xs text-emerald-200/90 leading-relaxed max-w-3xl">
              Eliminate manual data entry! Upload or paste your curriculum spreadsheet with the standard column header structure: <br />
              <code className="bg-slate-950/80 px-2 py-0.5 rounded border border-emerald-500/30 font-mono text-emerald-300 text-[11px] select-all">
                level,class,course,semester,subject,chapter,lesson
              </code>
            </p>
          </div>

          {/* Alerts */}
          {csvSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{csvSuccess}</span>
              </div>
              <button onClick={() => setCsvSuccess(null)} className="text-emerald-600 hover:underline text-[11px]">
                Dismiss
              </button>
            </div>
          )}

          {csvError && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-bold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>{csvError}</span>
              </div>
              <button onClick={() => setCsvError(null)} className="text-rose-600 hover:underline text-[11px]">
                Dismiss
              </button>
            </div>
          )}

          {/* Upload & Controls Bar */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-emerald-600" />
                  <span>Choose Import Method</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Upload a <code>.csv</code> file, download our ready sample template, or paste raw CSV content below.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadSampleCsv}
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Sample CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCsvRawText(DEFAULT_SAMPLE_CSV);
                    setCsvSuccess('Reset editor to default sample dataset.');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-extrabold flex items-center gap-1.5 hover:bg-slate-200 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Sample</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* File Upload Drop Zone */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 transition-all flex flex-col items-center justify-center text-center space-y-2">
                <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
                <div className="space-y-0.5">
                  <p className="text-xs font-black text-slate-800 dark:text-slate-200">
                    Upload .CSV File
                  </p>
                  <p className="text-[10px] text-slate-400">Drag & drop or click to select file</p>
                </div>
                <label className="mt-2 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-xs">
                  Browse File
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* CSV Raw Editor */}
              <div className="md:col-span-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-emerald-600" />
                    <span>Raw CSV Content Editor</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {parsedCsvRows.length} valid rows parsed
                  </span>
                </div>
                <textarea
                  rows={6}
                  value={csvRawText}
                  onChange={(e) => setCsvRawText(e.target.value)}
                  placeholder="level,class,course,semester,subject,chapter,lesson..."
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-950 text-emerald-400 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* LIVE PARSED PREVIEW SECTION */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>Real-Time Grouped Import Preview</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Rows automatically grouped into {groupedSubjectsToImport.length} unique subject document(s) for Firebase Firestore.
                </p>
              </div>

              <button
                type="button"
                onClick={handleExecuteCsvImport}
                disabled={isImportingCsv || groupedSubjectsToImport.length === 0}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
              >
                {isImportingCsv ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Importing to Firebase...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Import All ({groupedSubjectsToImport.length}) Subjects to Firebase</span>
                  </>
                )}
              </button>
            </div>

            {/* Grouped Subjects Cards */}
            {groupedSubjectsToImport.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No valid subjects detected. Please ensure your CSV header starts with <br />
                <code className="font-mono text-emerald-600">level,class,course,semester,subject,chapter,lesson</code>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedSubjectsToImport.map((sub, idx) => (
                  <div
                    key={sub.id || idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-[10px] uppercase">
                          {sub.level} • {sub.classOrCourse}
                        </span>
                        {sub.semester && (
                          <span className="px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[9px] font-bold">
                            Sem {sub.semester}
                          </span>
                        )}
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                        {sub.name}
                      </h4>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Chapters ({sub.chapters?.length || 0}):
                      </p>
                      <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                        {sub.chapters?.map((ch, cIdx) => (
                          <li key={cIdx} className="flex items-start gap-1.5 text-[11px]">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span className="font-semibold">{ch.title}</span>
                          </li>
                        ))}
                      </ul>

                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pt-2">
                        Lessons ({sub.lessons?.length || 0}):
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {sub.lessons?.map((les, lIdx) => (
                          <span
                            key={lIdx}
                            className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] text-slate-600 dark:text-slate-300 font-medium"
                          >
                            {les.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB: PUBLISHED CONTENT & SUBJECT MANAGEMENT (SEARCH, ALL SUBJECTS, EDIT & DELETE) */}
      {(activeSubTab === 'list' || activeSubTab === 'published') && (
        <div className="space-y-6">
          {/* Top Bar with + Add Subject & Counts */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-600" />
                  <span>SUBJECT MANAGEMENT</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage all curriculum subjects across School, Intermediate, and Degree.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveSubTab('add')}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-2 shadow-sm transition-all hover:scale-105 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Subject</span>
                </button>

                <button
                  type="button"
                  onClick={fetchPublishedSubjects}
                  disabled={isLoadingList}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-200"
                  title="Refresh subjects from Firestore"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingList ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>

            {/* Search Subject & Filter Bar */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchSubjectQuery}
                  onChange={(e) => setSearchSubjectQuery(e.target.value)}
                  placeholder="Search Subject (e.g. Mathematics, Physics, Machine Learning)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                {searchSubjectQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchSubjectQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Level Filter Dropdown */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-400 shrink-0">Level:</span>
                <select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
                >
                  <option value="All">All Levels</option>
                  <option value="School">School</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Degree">Degree</option>
                  <option value="Early Childhood">Early Childhood</option>
                </select>
              </div>
            </div>
          </div>

          {/* All Subjects Header */}
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span>All Subjects</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-black">
                {filteredPublishedSubjects.length}
              </span>
            </h3>
            {searchSubjectQuery && (
              <span className="text-xs text-slate-400 font-medium">
                Filtering by "{searchSubjectQuery}"
              </span>
            )}
          </div>

          {/* List of Subjects: Mathematics, Physics, Machine Learning etc. with [Edit] and [Delete] */}
          {savedSubjects.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
              <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="text-base font-extrabold text-slate-700 dark:text-slate-200">
                No subjects published yet in Firestore
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Click "+ Add Subject" to publish your first subject (e.g. Mathematics, Physics, Machine Learning).
              </p>
              <button
                type="button"
                onClick={() => setActiveSubTab('add')}
                className="mt-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm"
              >
                + Add Subject
              </button>
            </div>
          ) : filteredPublishedSubjects.length === 0 ? (
            <div className="p-10 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
              <Search className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                No subjects matching "{searchSubjectQuery}"
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchSubjectQuery('');
                  setFilterLevel('All');
                }}
                className="text-xs text-indigo-600 font-bold hover:underline"
              >
                Clear search filter
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPublishedSubjects.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-800 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-lg shrink-0">
                      📘
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base font-black text-slate-900 dark:text-slate-100">
                          {sub.name}
                        </h4>

                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase">
                          {sub.level} • {sub.classOrCourse || sub.course}
                        </span>

                        {sub.semester && (
                          <span className="px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
                            Sem {sub.semester}
                          </span>
                        )}

                        <span className="text-[10px] text-slate-400 font-medium">
                          ({sub.language || 'English'})
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {sub.description || 'Core subject curriculum and modules.'}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400 pt-0.5">
                        <span>{sub.chapters?.length || 0} Chapters</span>
                        <span>•</span>
                        <span>{sub.lessons?.length || 0} Lessons</span>
                        <span>•</span>
                        <span>{sub.videos?.length || 0} Videos</span>
                        <span>•</span>
                        <span>{sub.pdfs?.length || 0} PDFs</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: [Manage Chapters] [Edit] [Delete] */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setSubjectName(sub.name);
                        setActiveSubTab('chapters');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-950 text-purple-700 dark:text-purple-300 font-black text-xs flex items-center gap-1.5 border border-purple-200 dark:border-purple-800 transition-colors cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5 text-purple-600" />
                      <span>Chapters</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEditSubject(sub)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-200 hover:text-indigo-600 font-black text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteSubject(sub.id, sub.name)}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-600 dark:text-rose-400 font-black text-xs flex items-center gap-1.5 border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EDIT SUBJECT MODAL */}
          {editingSubject && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleUp">
                <div className="p-5 bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-indigo-300" />
                    <h3 className="text-base font-black">Edit Subject: {editingSubject.name}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingSubject(null)}
                    className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveEditedSubject} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                      Subject Name
                    </label>
                    <input
                      type="text"
                      value={editingSubject.name}
                      onChange={(e) =>
                        setEditingSubject({ ...editingSubject, name: e.target.value })
                      }
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                        Level
                      </label>
                      <input
                        type="text"
                        value={editingSubject.level}
                        onChange={(e) =>
                          setEditingSubject({ ...editingSubject, level: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                        Course / Class
                      </label>
                      <input
                        type="text"
                        value={editingSubject.classOrCourse || editingSubject.course || ''}
                        onChange={(e) =>
                          setEditingSubject({
                            ...editingSubject,
                            classOrCourse: e.target.value,
                            course: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                        Semester (optional)
                      </label>
                      <input
                        type="number"
                        value={editingSubject.semester || ''}
                        onChange={(e) =>
                          setEditingSubject({
                            ...editingSubject,
                            semester: e.target.value ? parseInt(e.target.value, 10) : undefined,
                          })
                        }
                        placeholder="e.g. 5"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                        Language
                      </label>
                      <input
                        type="text"
                        value={editingSubject.language || 'English'}
                        onChange={(e) =>
                          setEditingSubject({ ...editingSubject, language: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={editingSubject.description || ''}
                      onChange={(e) =>
                        setEditingSubject({ ...editingSubject, description: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingSubject(null)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdatingSubject}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      {isUpdatingSubject ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <span>Save Changes</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

