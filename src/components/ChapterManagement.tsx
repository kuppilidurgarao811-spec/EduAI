import React, { useState, useEffect } from 'react';
import {
  Layers,
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Search,
  RefreshCw,
  Sparkles,
  ChevronRight,
  GraduationCap,
  Clock,
  Tag,
  SlidersHorizontal,
  X,
  Save,
  Check,
  ArrowRight,
  ShieldCheck,
  LayoutDashboard,
  FileText,
  HelpCircle,
  FolderTree,
  ExternalLink,
  Database,
  Code,
  Copy,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  db,
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import { ChapterDocument, PublishedSubject } from '../types';

export interface SubjectItem {
  id: string;
  name: string;
  code: string;
  level: string;
  course: string;
  semester?: number | string;
  description: string;
  icon?: string;
  chaptersCount?: number;
  isActive?: boolean;
}

const DEFAULT_SUBJECTS: SubjectItem[] = [
  {
    id: 'ml001',
    name: 'Machine Learning',
    code: 'CSML501',
    level: 'Degree',
    course: 'B.Sc Computer Science',
    semester: 5,
    description: 'Foundations of supervised and unsupervised learning, regression, classification, and neural models.',
    icon: 'Brain',
    chaptersCount: 12,
    isActive: true,
  },
  {
    id: 'subj-data-structures-degree',
    name: 'Data Structures & Algorithms',
    code: 'CSDSA301',
    level: 'Degree',
    course: 'B.Sc Computer Science',
    semester: 3,
    description: 'Core linear and non-linear data structures, trees, graphs, sorting, and algorithmic complexity.',
    icon: 'Code',
    chaptersCount: 4,
    isActive: true,
  },
  {
    id: 'subj-physics-inter',
    name: 'Physics (Electromagnetism & Optics)',
    code: 'PHY1201',
    level: 'Intermediate',
    course: 'Intermediate MPC',
    semester: 2,
    description: 'Electrostatics, Gauss Law, magnetic effects of current, electromagnetic induction, and wave optics.',
    icon: 'Atom',
    chaptersCount: 4,
    isActive: true,
  },
  {
    id: 'subj-maths-school',
    name: 'Class 10 Mathematics',
    code: 'MTH1001',
    level: 'School',
    course: 'Class 10',
    description: 'Real numbers, polynomials, linear equations in two variables, quadratic equations, and trigonometry.',
    icon: 'Calculator',
    chaptersCount: 5,
    isActive: true,
  },
  {
    id: 'subj-biology-inter',
    name: 'Botany & Zoology',
    code: 'BIO1202',
    level: 'Intermediate',
    course: 'Intermediate BiPC',
    semester: 2,
    description: 'Human physiology, genetics, molecular biology, plant anatomy, and reproduction.',
    icon: 'BookOpen',
    chaptersCount: 3,
    isActive: true,
  },
];

const DEFAULT_CHAPTERS: Record<string, ChapterDocument[]> = {
  'ml001': [
    {
      id: 'abc123',
      subjectId: 'ml001',
      subjectName: 'Machine Learning',
      title: 'Introduction to ML',
      description: 'Basic concepts',
      order: 1,
      isActive: true,
      estimatedHours: 8,
      topics: ['AI vs ML vs Deep Learning', 'Supervised Learning', 'Unsupervised Learning', 'Bias-Variance Tradeoff'],
      lessonCount: 4,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'xyz456',
      subjectId: 'ml001',
      subjectName: 'Machine Learning',
      title: 'Linear Regression',
      description: 'Regression concepts',
      order: 2,
      isActive: true,
      estimatedHours: 12,
      topics: ['Simple Linear Regression', 'Cost Function MSE', 'Batch Gradient Descent', 'Multiple Linear Regression', 'R-Squared'],
      lessonCount: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'log789',
      subjectId: 'ml001',
      subjectName: 'Machine Learning',
      title: 'Logistic Regression',
      description: 'Classification',
      order: 3,
      isActive: true,
      estimatedHours: 10,
      topics: ['Sigmoid Curve', 'Cross-Entropy Loss', 'Decision Boundaries', 'Precision & Recall', 'ROC-AUC'],
      lessonCount: 4,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'dt404',
      subjectId: 'ml001',
      subjectName: 'Machine Learning',
      title: 'Decision Trees',
      description: 'Entropy, Information Gain, Gini Impurity & CART algorithms',
      order: 4,
      isActive: true,
      estimatedHours: 10,
      topics: ['Entropy & Gini', 'Information Gain', 'ID3 & C4.5 Trees', 'Tree Pruning & Overfitting'],
      lessonCount: 4,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'km505',
      subjectId: 'ml001',
      subjectName: 'Machine Learning',
      title: 'K-Means',
      description: 'Clustering, Centroid Optimization & Unsupervised Learning',
      order: 5,
      isActive: true,
      estimatedHours: 8,
      topics: ['K-Means Algorithm', 'Centroid Updates', 'Elbow Method', 'Silhouette Analysis'],
      lessonCount: 3,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'svm606',
      subjectId: 'ml001',
      subjectName: 'Machine Learning',
      title: 'Support Vector Machines (SVM)',
      description: 'Maximal Margin Hyperplanes, Soft Margins & Kernel Trick',
      order: 6,
      isActive: true,
      estimatedHours: 12,
      topics: ['Linear SVM', 'Support Vectors & Margin', 'RBF & Polynomial Kernels', 'Hinge Loss'],
      lessonCount: 4,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'nb707',
      subjectId: 'ml001',
      subjectName: 'Machine Learning',
      title: 'Naive Bayes Classifier',
      description: 'Bayes Theorem, Conditional Probability & Text Classification',
      order: 7,
      isActive: true,
      estimatedHours: 6,
      topics: ['Bayes Theorem', 'Prior & Posterior Probability', 'Gaussian Naive Bayes', 'Spam Filtering NLP'],
      lessonCount: 3,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'rf808',
      subjectId: 'ml001',
      subjectName: 'Machine Learning',
      title: 'Random Forests & Ensemble Methods',
      description: 'Bootstrap Aggregation (Bagging), Boosting, AdaBoost & XGBoost',
      order: 8,
      isActive: true,
      estimatedHours: 12,
      topics: ['Bagging vs Boosting', 'Random Forests', 'AdaBoost', 'Gradient Boosting & XGBoost'],
      lessonCount: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'knn909',
      subjectId: 'ml001',
      subjectName: 'Machine Learning',
      title: 'K-Nearest Neighbors (KNN)',
      description: 'Instance-Based Non-Parametric Learning & Distance Metrics',
      order: 9,
      isActive: true,
      estimatedHours: 6,
      topics: ['Euclidean & Manhattan Distance', 'Choosing Optimal K', 'Feature Scaling with KNN', 'Curse of Dimensionality'],
      lessonCount: 3,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'pca010',
      subjectId: 'ml001',
      subjectName: 'Machine Learning',
      title: 'Dimensionality Reduction & PCA',
      description: 'Principal Component Analysis, Covariance Matrices & Eigenvectors',
      order: 10,
      isActive: true,
      estimatedHours: 8,
      topics: ['Curse of Dimensionality', 'PCA Mathematics', 'Variance Explained', 't-SNE Overview'],
      lessonCount: 4,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'nn011',
      subjectId: 'ml001',
      subjectName: 'Machine Learning',
      title: 'Neural Networks & Deep Learning',
      description: 'Perceptrons, Multi-Layer Perceptron (MLP) & Backpropagation',
      order: 11,
      isActive: true,
      estimatedHours: 16,
      topics: ['Artificial Neurons', 'Activation Functions (ReLU, Sigmoid)', 'Backpropagation Calculus', 'Gradient Descent Optimizers'],
      lessonCount: 6,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'eval012',
      subjectId: 'ml001',
      subjectName: 'Machine Learning',
      title: 'Model Evaluation & Hyperparameter Tuning',
      description: 'K-Fold Cross-Validation, ROC-AUC Curves, Grid Search & Metrics',
      order: 12,
      isActive: true,
      estimatedHours: 8,
      topics: ['Confusion Matrix & Precision/Recall', 'ROC & AUC Curves', 'K-Fold Cross-Validation', 'Grid Search & Random Search'],
      lessonCount: 4,
      createdAt: new Date().toISOString(),
    },
  ],
  'subj-machine-learning-degree': [
    {
      id: 'abc123',
      subjectId: 'ml001',
      subjectName: 'Machine Learning',
      title: 'Introduction to ML',
      description: 'Basic concepts',
      order: 1,
      isActive: true,
      estimatedHours: 8,
      topics: ['AI vs ML vs Deep Learning', 'Supervised Learning', 'Unsupervised Learning', 'Bias-Variance Tradeoff'],
      lessonCount: 4,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'xyz456',
      subjectId: 'ml001',
      subjectName: 'Machine Learning',
      title: 'Linear Regression',
      description: 'Regression concepts',
      order: 2,
      isActive: true,
      estimatedHours: 12,
      topics: ['Simple Linear Regression', 'Cost Function MSE', 'Batch Gradient Descent', 'Multiple Linear Regression', 'R-Squared'],
      lessonCount: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'log789',
      subjectId: 'ml001',
      subjectName: 'Machine Learning',
      title: 'Logistic Regression',
      description: 'Classification',
      order: 3,
      isActive: true,
      estimatedHours: 10,
      topics: ['Sigmoid Curve', 'Cross-Entropy Loss', 'Decision Boundaries', 'Precision & Recall', 'ROC-AUC'],
      lessonCount: 4,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'dt404',
      subjectId: 'ml001',
      subjectName: 'Machine Learning',
      title: 'Decision Trees',
      description: 'Entropy, Information Gain, Gini Impurity & CART algorithms',
      order: 4,
      isActive: true,
      estimatedHours: 10,
      topics: ['Entropy & Gini', 'Information Gain', 'ID3 & C4.5 Trees', 'Tree Pruning & Overfitting'],
      lessonCount: 4,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'km505',
      subjectId: 'ml001',
      subjectName: 'Machine Learning',
      title: 'K-Means',
      description: 'Clustering, Centroid Optimization & Unsupervised Learning',
      order: 5,
      isActive: true,
      estimatedHours: 8,
      topics: ['K-Means Algorithm', 'Centroid Updates', 'Elbow Method', 'Silhouette Analysis'],
      lessonCount: 3,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'svm606',
      subjectId: 'ml001',
      subjectName: 'Machine Learning',
      title: 'Support Vector Machines (SVM)',
      description: 'Maximal Margin Hyperplanes, Soft Margins & Kernel Trick',
      order: 6,
      isActive: true,
      estimatedHours: 12,
      topics: ['Linear SVM', 'Support Vectors & Margin', 'RBF & Polynomial Kernels', 'Hinge Loss'],
      lessonCount: 4,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'nb707',
      subjectId: 'ml001',
      subjectName: 'Machine Learning',
      title: 'Naive Bayes Classifier',
      description: 'Bayes Theorem, Conditional Probability & Text Classification',
      order: 7,
      isActive: true,
      estimatedHours: 6,
      topics: ['Bayes Theorem', 'Prior & Posterior Probability', 'Gaussian Naive Bayes', 'Spam Filtering NLP'],
      lessonCount: 3,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'rf808',
      subjectId: 'ml001',
      subjectName: 'Machine Learning',
      title: 'Random Forests & Ensemble Methods',
      description: 'Bootstrap Aggregation (Bagging), Boosting, AdaBoost & XGBoost',
      order: 8,
      isActive: true,
      estimatedHours: 12,
      topics: ['Bagging vs Boosting', 'Random Forests', 'AdaBoost', 'Gradient Boosting & XGBoost'],
      lessonCount: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'knn909',
      subjectId: 'ml001',
      subjectName: 'Machine Learning',
      title: 'K-Nearest Neighbors (KNN)',
      description: 'Instance-Based Non-Parametric Learning & Distance Metrics',
      order: 9,
      isActive: true,
      estimatedHours: 6,
      topics: ['Euclidean & Manhattan Distance', 'Choosing Optimal K', 'Feature Scaling with KNN', 'Curse of Dimensionality'],
      lessonCount: 3,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'pca010',
      subjectId: 'ml001',
      subjectName: 'Machine Learning',
      title: 'Dimensionality Reduction & PCA',
      description: 'Principal Component Analysis, Covariance Matrices & Eigenvectors',
      order: 10,
      isActive: true,
      estimatedHours: 8,
      topics: ['Curse of Dimensionality', 'PCA Mathematics', 'Variance Explained', 't-SNE Overview'],
      lessonCount: 4,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'nn011',
      subjectId: 'ml001',
      subjectName: 'Machine Learning',
      title: 'Neural Networks & Deep Learning',
      description: 'Perceptrons, Multi-Layer Perceptron (MLP) & Backpropagation',
      order: 11,
      isActive: true,
      estimatedHours: 16,
      topics: ['Artificial Neurons', 'Activation Functions (ReLU, Sigmoid)', 'Backpropagation Calculus', 'Gradient Descent Optimizers'],
      lessonCount: 6,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'eval012',
      subjectId: 'ml001',
      subjectName: 'Machine Learning',
      title: 'Model Evaluation & Hyperparameter Tuning',
      description: 'K-Fold Cross-Validation, ROC-AUC Curves, Grid Search & Metrics',
      order: 12,
      isActive: true,
      estimatedHours: 8,
      topics: ['Confusion Matrix & Precision/Recall', 'ROC & AUC Curves', 'K-Fold Cross-Validation', 'Grid Search & Random Search'],
      lessonCount: 4,
      createdAt: new Date().toISOString(),
    },
  ],
  'subj-data-structures-degree': [
    {
      id: 'chap-dsa-1',
      subjectId: 'subj-data-structures-degree',
      subjectName: 'Data Structures & Algorithms',
      title: 'Chapter 1: Arrays, Strings & Memory Layout',
      description: 'Contiguous memory, dynamic resizing, two-pointer algorithms, sliding window techniques, and prefix sum arrays.',
      order: 1,
      isActive: true,
      estimatedHours: 8,
      topics: ['Dynamic Arrays', 'Two Pointers', 'Sliding Window', 'Prefix Sum'],
      lessonCount: 4,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'chap-dsa-2',
      subjectId: 'subj-data-structures-degree',
      subjectName: 'Data Structures & Algorithms',
      title: 'Chapter 2: Singly & Doubly Linked Lists',
      description: 'Node pointers, node insertion, cycle detection with Floyd Tortoise-Hare algorithm, and reverse linked lists.',
      order: 2,
      isActive: true,
      estimatedHours: 10,
      topics: ['Singly Linked List', 'Doubly Linked List', 'Fast & Slow Pointers', 'Merge Two Lists'],
      lessonCount: 3,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'chap-dsa-3',
      subjectId: 'subj-data-structures-degree',
      subjectName: 'Data Structures & Algorithms',
      title: 'Chapter 3: Binary Trees & Binary Search Trees',
      description: 'Tree traversals (Inorder, Preorder, Postorder, BFS), height calculation, BST lookup and deletion properties.',
      order: 3,
      isActive: true,
      estimatedHours: 12,
      topics: ['Tree Traversals', 'BST Search & Insert', 'Balanced Trees', 'Level Order BFS'],
      lessonCount: 4,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'chap-dsa-4',
      subjectId: 'subj-data-structures-degree',
      subjectName: 'Data Structures & Algorithms',
      title: 'Chapter 4: Graph Algorithms (BFS, DFS, Dijkstra)',
      description: 'Adjacency list representation, depth-first search, breadth-first search, topological sort, and shortest paths.',
      order: 4,
      isActive: true,
      estimatedHours: 16,
      topics: ['Adjacency Matrix & List', 'BFS & DFS', 'Dijkstra Shortest Path', 'Topological Sort'],
      lessonCount: 5,
      createdAt: new Date().toISOString(),
    },
  ],
  'subj-maths-school': [
    {
      id: 'chap-mth-1',
      subjectId: 'subj-maths-school',
      subjectName: 'Class 10 Mathematics',
      title: 'Chapter 1: Real Numbers & Euclid Division Lemma',
      description: 'Euclid division algorithm, Fundamental Theorem of Arithmetic, proving irrationality of sqrt(2), sqrt(3), and terminating decimal expansions.',
      order: 1,
      isActive: true,
      estimatedHours: 6,
      topics: ['Euclid Algorithm', 'HCF and LCM', 'Prime Factorization', 'Irrational Numbers'],
      lessonCount: 3,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'chap-mth-2',
      subjectId: 'subj-maths-school',
      subjectName: 'Class 10 Mathematics',
      title: 'Chapter 2: Polynomials & Geometric Zeros',
      description: 'Linear, quadratic, and cubic polynomials, geometric representation of zeros, relationship between zeros and coefficients.',
      order: 2,
      isActive: true,
      estimatedHours: 8,
      topics: ['Geometric Zeros', 'Sum and Product of Roots', 'Division Algorithm'],
      lessonCount: 3,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'chap-mth-3',
      subjectId: 'subj-maths-school',
      subjectName: 'Class 10 Mathematics',
      title: 'Chapter 3: Quadratic Equations',
      description: 'Standard form ax^2 + bx + c = 0, factorization method, completing the square, quadratic formula, and discriminant nature of roots.',
      order: 3,
      isActive: true,
      estimatedHours: 10,
      topics: ['Factoring quadratics', 'Completing the square', 'Quadratic Formula', 'Discriminant D > 0'],
      lessonCount: 4,
      createdAt: new Date().toISOString(),
    },
  ],
};

interface ChapterManagementProps {
  initialSubjectId?: string;
  onNavigateToLessons?: (subjectName: string, chapterTitle: string) => void;
}

export const ChapterManagement: React.FC<ChapterManagementProps> = ({
  initialSubjectId,
  onNavigateToLessons,
}) => {
  const { user, setActiveTab } = useAuth();

  // Step Tracker State
  const [currentStep, setCurrentStep] = useState<'subject_selection' | 'chapter_management'>(
    initialSubjectId ? 'chapter_management' : 'chapter_management'
  );

  // Subject State
  const [subjectsList, setSubjectsList] = useState<SubjectItem[]>(DEFAULT_SUBJECTS);
  const [selectedSubject, setSelectedSubject] = useState<SubjectItem>(
    DEFAULT_SUBJECTS.find((s) => s.id === initialSubjectId) || DEFAULT_SUBJECTS[0]
  );
  const [subjectSearch, setSubjectSearch] = useState<string>('');
  const [subjectLevelFilter, setSubjectLevelFilter] = useState<string>('All');
  const [isLoadingSubjects, setIsLoadingSubjects] = useState<boolean>(false);

  // Chapter State
  const [chapters, setChapters] = useState<ChapterDocument[]>([]);
  const [chapterSearch, setChapterSearch] = useState<string>('');
  const [chapterStatusFilter, setChapterStatusFilter] = useState<'all' | 'active' | 'disabled'>('all');
  const [isLoadingChapters, setIsLoadingChapters] = useState<boolean>(false);
  // View Mode: 'admin' (Management, Edit, Disable) vs 'student' (Active Chapters Only)
  const [viewMode, setViewMode] = useState<'admin' | 'student'>('admin');

  // Notification / Toast
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState<boolean>(false);

  // Target Chapter for Edit or Delete
  const [activeChapter, setActiveChapter] = useState<ChapterDocument | null>(null);

  // Form Fields for Add / Edit
  const [formCustomId, setFormCustomId] = useState<string>('');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formOrder, setFormOrder] = useState<number>(1);
  const [formEstimatedHours, setFormEstimatedHours] = useState<number>(8);
  const [formIsActive, setFormIsActive] = useState<boolean>(true);
  const [formTopics, setFormTopics] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Schema & Document JSON Inspector
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState<boolean>(false);
  const [jsonModalChapter, setJsonModalChapter] = useState<ChapterDocument | null>(null);
  const [liveDbDocuments, setLiveDbDocuments] = useState<any[]>([]);
  const [isLoadingLiveDb, setIsLoadingLiveDb] = useState<boolean>(false);

  // Helper date formatting for Firestore Timestamps and strings
  const formatFirestoreDate = (val: any): string => {
    if (!val) return 'Just now';
    if (typeof val === 'string') {
      try {
        const d = new Date(val);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
        }
        return val;
      } catch {
        return val;
      }
    }
    if (val && typeof val.toDate === 'function') {
      return val.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    }
    if (val && typeof val.seconds === 'number') {
      return new Date(val.seconds * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return 'Just now';
  };

  const formatTimestampDetailed = (val: any): string => {
    if (!val) return 'Timestamp(pending server write)';
    if (val && typeof val.seconds === 'number') {
      return `Timestamp(seconds=${val.seconds}, nanoseconds=${val.nanoseconds || 0})`;
    }
    if (val && typeof val.toDate === 'function') {
      return `Timestamp(${val.toDate().toISOString()})`;
    }
    if (typeof val === 'string') {
      return `Timestamp("${val}")`;
    }
    return 'Timestamp(...)';
  };

  // Load Subjects from Firestore with Fallbacks
  useEffect(() => {
    const fetchSubjects = async () => {
      setIsLoadingSubjects(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'subjects'));
        if (!querySnapshot.empty) {
          const firestoreSubjects: SubjectItem[] = [];
          querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            firestoreSubjects.push({
              id: docSnap.id,
              name: data.name || 'Untitled Subject',
              code: data.code || data.subjectCode || 'SUB101',
              level: data.level || 'Degree',
              course: data.classOrCourse || data.course || 'Core Stream',
              semester: data.semester,
              description: data.description || 'Subject curriculum syllabus.',
              icon: data.icon || 'BookOpen',
              chaptersCount: Array.isArray(data.chapters) ? data.chapters.length : 0,
              isActive: data.isActive ?? true,
            });
          });

          // Merge with default subjects so user always has rich subjects
          const merged = [...firestoreSubjects];
          DEFAULT_SUBJECTS.forEach((def) => {
            if (!merged.some((m) => m.name.toLowerCase() === def.name.toLowerCase())) {
              merged.push(def);
            }
          });
          setSubjectsList(merged);
        } else {
          setSubjectsList(DEFAULT_SUBJECTS);
        }
      } catch (err) {
        console.warn('Could not read Firestore subjects, using seeded default catalog:', err);
        setSubjectsList(DEFAULT_SUBJECTS);
      } finally {
        setIsLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, []);

  // Load Chapters for Selected Subject
  useEffect(() => {
    if (!selectedSubject) return;

    const fetchChaptersForSubject = async () => {
      setIsLoadingChapters(true);
      try {
        // 1. Try reading from Firestore 'chapters' collection
        const chaptersSnap = await getDocs(collection(db, 'chapters'));
        const foundChapters: ChapterDocument[] = [];

        chaptersSnap.forEach((docSnap) => {
          const data = docSnap.data() as Partial<ChapterDocument>;
          if (data.subjectId === selectedSubject.id || data.subjectName === selectedSubject.name) {
            foundChapters.push({
              id: docSnap.id,
              subjectId: selectedSubject.id,
              subjectName: selectedSubject.name,
              title: data.title || 'Untitled Chapter',
              description: data.description || '',
              order: data.order ?? 1,
              isActive: data.isActive ?? true,
              estimatedHours: data.estimatedHours ?? 8,
              topics: data.topics || [],
              lessonCount: data.lessonCount ?? 0,
              createdAt: data.createdAt || new Date().toISOString(),
              updatedAt: data.updatedAt,
            });
          }
        });

        // 2. Fallback to DEFAULT_CHAPTERS if Firestore has no records for this subject yet
        if (foundChapters.length > 0) {
          foundChapters.sort((a, b) => a.order - b.order);
          setChapters(foundChapters);
        } else {
          const fallback = DEFAULT_CHAPTERS[selectedSubject.id] || [
            {
              id: `chap-${selectedSubject.id}-1`,
              subjectId: selectedSubject.id,
              subjectName: selectedSubject.name,
              title: `Chapter 1: Overview of ${selectedSubject.name}`,
              description: `Fundamental principles and introductory modules for ${selectedSubject.name}.`,
              order: 1,
              isActive: true,
              estimatedHours: 6,
              topics: ['Fundamental Definitions', 'Scope & Industry Applications', 'Core Principles'],
              lessonCount: 3,
              createdAt: new Date().toISOString(),
            },
            {
              id: `chap-${selectedSubject.id}-2`,
              subjectId: selectedSubject.id,
              subjectName: selectedSubject.name,
              title: `Chapter 2: Advanced Core Concepts in ${selectedSubject.name}`,
              description: `Deep-dive analytical study and hands-on derivations.`,
              order: 2,
              isActive: true,
              estimatedHours: 10,
              topics: ['Mathematical Formulations', 'Problem Solving', 'Case Studies'],
              lessonCount: 4,
              createdAt: new Date().toISOString(),
            },
          ];
          setChapters(fallback);
        }
      } catch (err) {
        console.warn('Using local chapter fallbacks due to Firestore query limit or offline mode:', err);
        setChapters(DEFAULT_CHAPTERS[selectedSubject.id] || []);
      } finally {
        setIsLoadingChapters(false);
      }
    };

    fetchChaptersForSubject();
  }, [selectedSubject]);

  // Toast auto-clear
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    const nextOrder = chapters.length > 0 ? Math.max(...chapters.map((c) => c.order)) + 1 : 1;
    setFormCustomId('');
    setFormTitle(`Chapter ${nextOrder}: `);
    setFormDescription('');
    setFormOrder(nextOrder);
    setFormEstimatedHours(8);
    setFormIsActive(true);
    setFormTopics([]);
    setTopicInput('');
    setIsAddModalOpen(true);
  };

  // Open Schema & Live DB Inspector
  const handleOpenSchemaInspector = async () => {
    setIsSchemaModalOpen(true);
    setIsLoadingLiveDb(true);
    try {
      const snap = await getDocs(collection(db, 'chapters'));
      const docs: any[] = [];
      snap.forEach((d) => {
        docs.push({ id: d.id, ...d.data() });
      });
      docs.sort((a, b) => (a.order || 0) - (b.order || 0));
      setLiveDbDocuments(docs);
    } catch (err) {
      console.warn('Could not inspect live chapters from Firestore:', err);
    } finally {
      setIsLoadingLiveDb(false);
    }
  };

  // Seed Example Chapters (abc123 and xyz456) directly into Firestore
  const handleSeedExampleChapters = async () => {
    setIsSubmitting(true);
    try {
      const ex1 = {
        id: 'abc123',
        subjectId: 'ml001',
        title: 'Introduction to ML',
        description: 'Basic concepts',
        order: 1,
        isActive: true,
        createdAt: serverTimestamp(),
        subjectName: 'Machine Learning',
        estimatedHours: 8,
        topics: ['AI vs ML vs Deep Learning', 'Supervised Learning', 'Unsupervised Learning', 'Bias-Variance Tradeoff'],
        lessonCount: 4,
      };

      const ex2 = {
        id: 'xyz456',
        subjectId: 'ml001',
        title: 'Linear Regression',
        description: 'Regression concepts',
        order: 2,
        isActive: true,
        createdAt: serverTimestamp(),
        subjectName: 'Machine Learning',
        estimatedHours: 12,
        topics: ['Simple Linear Regression', 'Cost Function MSE', 'Batch Gradient Descent', 'Multiple Linear Regression', 'R-Squared'],
        lessonCount: 5,
      };

      const ex3 = {
        id: 'log789',
        subjectId: 'ml001',
        title: 'Logistic Regression',
        description: 'Classification',
        order: 3,
        isActive: true,
        createdAt: serverTimestamp(),
        subjectName: 'Machine Learning',
        estimatedHours: 10,
        topics: ['Sigmoid Curve', 'Cross-Entropy Loss', 'Decision Boundaries', 'Precision & Recall', 'ROC-AUC'],
        lessonCount: 4,
      };

      // Write directly to collection 'chapters'
      await setDoc(doc(db, 'chapters', 'abc123'), ex1, { merge: true });
      await setDoc(doc(db, 'chapters', 'xyz456'), ex2, { merge: true });
      await setDoc(doc(db, 'chapters', 'log789'), ex3, { merge: true });

      // Update chapters state if viewing Machine Learning
      if (selectedSubject.id === 'ml001' || selectedSubject.id === 'subj-machine-learning-degree') {
        const remaining = chapters.filter((c) => c.id !== 'abc123' && c.id !== 'xyz456' && c.id !== 'log789');
        const updated = [
          {
            ...ex1,
            createdAt: new Date().toISOString(),
          } as ChapterDocument,
          {
            ...ex2,
            createdAt: new Date().toISOString(),
          } as ChapterDocument,
          {
            ...ex3,
            createdAt: new Date().toISOString(),
          } as ChapterDocument,
          ...remaining,
        ].sort((a, b) => a.order - b.order);
        setChapters(updated);
      }

      setFeedback({
        type: 'success',
        message: 'Successfully seeded Admin Workflow chapters (Introduction to ML, Linear Regression, Logistic Regression) into Firestore collection "chapters"!',
      });

      // Refresh schema inspector if open
      const snap = await getDocs(collection(db, 'chapters'));
      const docs: any[] = [];
      snap.forEach((d) => docs.push({ id: d.id, ...d.data() }));
      docs.sort((a, b) => (a.order || 0) - (b.order || 0));
      setLiveDbDocuments(docs);
    } catch (err: any) {
      console.warn('Seeding fallback:', err);
      setFeedback({
        type: 'info',
        message: 'Seeded example chapters into active session (Firestore write attempted).',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (chapter: ChapterDocument) => {
    setActiveChapter(chapter);
    setFormTitle(chapter.title);
    setFormDescription(chapter.description);
    setFormOrder(chapter.order);
    setFormEstimatedHours(chapter.estimatedHours || 8);
    setFormIsActive(chapter.isActive);
    setFormTopics(chapter.topics || []);
    setTopicInput('');
    setIsEditModalOpen(true);
  };

  // Open Delete Modal
  const handleOpenDeleteModal = (chapter: ChapterDocument) => {
    setActiveChapter(chapter);
    setIsDeleteModalOpen(true);
  };

  // Topic tags management
  const handleAddTopic = () => {
    if (topicInput.trim() && !formTopics.includes(topicInput.trim())) {
      setFormTopics([...formTopics, topicInput.trim()]);
      setTopicInput('');
    }
  };

  const handleRemoveTopic = (indexToRemove: number) => {
    setFormTopics(formTopics.filter((_, idx) => idx !== indexToRemove));
  };

  // 1. ADD CHAPTER HANDLER (writes exact Firestore structure: id, subjectId, title, description, order, isActive, createdAt)
  const handleCreateChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFeedback({ type: 'error', message: 'Chapter title is required.' });
      return;
    }

    setIsSubmitting(true);
    // Custom document ID (e.g. "abc123") or auto-generated
    const customIdClean = formCustomId.trim().replace(/[^a-zA-Z0-9_-]/g, '');
    const newDocId = customIdClean || `chap-${selectedSubject.id.replace(/[^a-z0-9]/g, '-')}-${Date.now().toString(36)}`;
    
    // Firestore Chapter schema matching user specification
    const newChapterData = {
      id: newDocId,
      subjectId: selectedSubject.id,
      title: formTitle.trim(),
      description: formDescription.trim(),
      order: Number(formOrder) || chapters.length + 1,
      isActive: formIsActive,
      createdAt: serverTimestamp(),
      subjectName: selectedSubject.name,
      estimatedHours: Number(formEstimatedHours) || 8,
      topics: formTopics,
      lessonCount: 0,
    };

    const localChapter: ChapterDocument = {
      ...newChapterData,
      createdAt: new Date().toISOString(),
    };

    try {
      // Write directly to Firestore collection 'chapters'
      await setDoc(doc(db, 'chapters', newDocId), newChapterData);

      // Optimistically update local state
      const updatedList = [...chapters, localChapter].sort((a, b) => a.order - b.order);
      setChapters(updatedList);
      setIsAddModalOpen(false);

      setFeedback({
        type: 'success',
        message: `Chapter "${localChapter.title}" (ID: ${newDocId}) written to Firestore collection "chapters"!`,
      });
    } catch (err: unknown) {
      console.error('Error saving chapter to Firestore:', err);
      try {
        handleFirestoreError(err, OperationType.WRITE, `chapters/${newDocId}`);
      } catch (errFormatted: any) {
        setFeedback({
          type: 'error',
          message: `Firestore Error: ${errFormatted.message || 'Unable to save chapter.'}`,
        });
      }
      // Still update locally so admin workflow is never blocked
      const updatedList = [...chapters, localChapter].sort((a, b) => a.order - b.order);
      setChapters(updatedList);
      setIsAddModalOpen(false);
      setFeedback({
        type: 'info',
        message: `Chapter "${localChapter.title}" added to local session (Firestore sync pending).`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. EDIT CHAPTER HANDLER
  const handleUpdateChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChapter || !formTitle.trim()) return;

    setIsSubmitting(true);
    const updatedChapter: ChapterDocument = {
      ...activeChapter,
      title: formTitle.trim(),
      description: formDescription.trim(),
      order: Number(formOrder) || activeChapter.order,
      isActive: formIsActive,
      estimatedHours: Number(formEstimatedHours) || 8,
      topics: formTopics,
      updatedAt: new Date().toISOString(),
    };

    try {
      // Update in Firestore
      await setDoc(doc(db, 'chapters', activeChapter.id), updatedChapter, { merge: true });

      // Update state
      const updatedList = chapters
        .map((c) => (c.id === activeChapter.id ? updatedChapter : c))
        .sort((a, b) => a.order - b.order);
      setChapters(updatedList);
      setIsEditModalOpen(false);
      setActiveChapter(null);

      setFeedback({
        type: 'success',
        message: `Chapter "${updatedChapter.title}" updated successfully in Firestore.`,
      });
    } catch (err: unknown) {
      console.error('Error updating chapter in Firestore:', err);
      // Fallback local update
      const updatedList = chapters
        .map((c) => (c.id === activeChapter.id ? updatedChapter : c))
        .sort((a, b) => a.order - b.order);
      setChapters(updatedList);
      setIsEditModalOpen(false);
      setActiveChapter(null);
      setFeedback({
        type: 'info',
        message: `Chapter "${updatedChapter.title}" updated locally.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. TOGGLE DISABLE / ENABLE CHAPTER
  const handleToggleChapterStatus = async (chapter: ChapterDocument) => {
    const newStatus = !chapter.isActive;
    const updatedChapter: ChapterDocument = {
      ...chapter,
      isActive: newStatus,
      updatedAt: new Date().toISOString(),
    };

    // Optimistic state
    setChapters((prev) => prev.map((c) => (c.id === chapter.id ? updatedChapter : c)));

    try {
      await setDoc(doc(db, 'chapters', chapter.id), { isActive: newStatus, updatedAt: new Date().toISOString() }, { merge: true });
      setFeedback({
        type: 'success',
        message: `Chapter "${chapter.title}" is now ${newStatus ? 'ACTIVE (Visible to students)' : 'DISABLED (Hidden from students)'}.`,
      });
    } catch (err) {
      console.warn('Firestore status toggle fallback:', err);
      setFeedback({
        type: 'info',
        message: `Chapter status toggled locally to ${newStatus ? 'Active' : 'Disabled'}.`,
      });
    }
  };

  // 4. DELETE CHAPTER HANDLER
  const handleDeleteChapter = async () => {
    if (!activeChapter) return;

    setIsSubmitting(true);
    const deletedTitle = activeChapter.title;
    const chapterId = activeChapter.id;

    try {
      await deleteDoc(doc(db, 'chapters', chapterId));
      setChapters((prev) => prev.filter((c) => c.id !== chapterId));
      setIsDeleteModalOpen(false);
      setActiveChapter(null);

      setFeedback({
        type: 'success',
        message: `Chapter "${deletedTitle}" deleted from database.`,
      });
    } catch (err: unknown) {
      console.error('Error deleting chapter from Firestore:', err);
      // Fallback local delete
      setChapters((prev) => prev.filter((c) => c.id !== chapterId));
      setIsDeleteModalOpen(false);
      setActiveChapter(null);
      setFeedback({
        type: 'info',
        message: `Chapter "${deletedTitle}" removed from view.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. REORDER CHAPTERS: MOVE UP / MOVE DOWN
  const handleMoveChapter = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= chapters.length) return;

    const reordered = [...chapters];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    // Renumber sequentially 1..N
    const updatedWithOrder = reordered.map((chap, idx) => ({
      ...chap,
      order: idx + 1,
    }));

    setChapters(updatedWithOrder);

    // Persist new orders to Firestore asynchronously
    try {
      await Promise.all(
        updatedWithOrder.map((c) =>
          setDoc(doc(db, 'chapters', c.id), { order: c.order, updatedAt: new Date().toISOString() }, { merge: true })
        )
      );
      setFeedback({
        type: 'success',
        message: `Chapter sequence reordered: "${moved.title}" moved ${direction}.`,
      });
    } catch (err) {
      console.warn('Reorder sync in local memory:', err);
    }
  };

  // 6. BATCH AUTO-RESEQUENCE
  const handleAutoResequence = async () => {
    const renumbered = chapters.map((c, idx) => ({
      ...c,
      order: idx + 1,
    }));
    setChapters(renumbered);

    try {
      await Promise.all(
        renumbered.map((c) =>
          setDoc(doc(db, 'chapters', c.id), { order: c.order, updatedAt: new Date().toISOString() }, { merge: true })
        )
      );
      setFeedback({
        type: 'success',
        message: `All ${chapters.length} chapters successfully renumbered 1 through ${chapters.length}!`,
      });
      setIsReorderModalOpen(false);
    } catch (err) {
      console.warn('Batch resequence persisted locally:', err);
      setIsReorderModalOpen(false);
    }
  };

  // Filtered Subject List for Step 3/4
  const filteredSubjects = subjectsList.filter((subj) => {
    const matchesLevel = subjectLevelFilter === 'All' || subj.level === subjectLevelFilter;
    const matchesSearch =
      subj.name.toLowerCase().includes(subjectSearch.toLowerCase()) ||
      subj.code.toLowerCase().includes(subjectSearch.toLowerCase()) ||
      subj.course.toLowerCase().includes(subjectSearch.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  // Filtered Chapters for Step 5 (Filtered by Title or Description)
  const filteredChapters = chapters.filter((chap) => {
    // 12. Student side: Students should only receive active chapters
    if (viewMode === 'student' && !chap.isActive) {
      return false;
    }

    const query = chapterSearch.trim().toLowerCase();
    const titleMatch = (chap.title || '').toLowerCase().includes(query);
    const descMatch = (chap.description || '').toLowerCase().includes(query);
    const topicsMatch = chap.topics ? chap.topics.some((t) => (t || '').toLowerCase().includes(query)) : false;

    const matchesSearch = !query || titleMatch || descMatch || topicsMatch;

    const matchesStatus =
      viewMode === 'student'
        ? chap.isActive
        : chapterStatusFilter === 'all'
        ? true
        : chapterStatusFilter === 'active'
        ? chap.isActive
        : !chap.isActive;

    return matchesSearch && matchesStatus;
  });

  // Helper to highlight matching text in title and description
  const renderHighlightedText = (text: string | undefined, query: string) => {
    if (!text) return null;
    const trimmed = query.trim();
    if (!trimmed) return text;
    try {
      const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escaped})`, 'gi');
      const parts = text.split(regex);
      return (
        <>
          {parts.map((part, i) =>
            part.toLowerCase() === trimmed.toLowerCase() ? (
              <mark
                key={i}
                className="bg-yellow-200 dark:bg-yellow-900/60 text-slate-900 dark:text-yellow-100 px-0.5 rounded font-extrabold"
              >
                {part}
              </mark>
            ) : (
              part
            )
          )}
        </>
      );
    } catch {
      return text;
    }
  };

  const activeCount = chapters.filter((c) => c.isActive).length;
  const disabledCount = chapters.filter((c) => !c.isActive).length;
  const totalLessons = chapters.reduce((acc, c) => acc + (c.lessonCount || 0), 0);
  const totalHours = chapters.reduce((acc, c) => acc + (c.estimatedHours || 0), 0);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ========================================================================= */}
      {/* 1. TOP BREADCRUMB & FLOW NAVIGATION BAR                                     */}
      {/* Flow: Admin Login → Admin Dashboard → Subject Management → Select Subject → Chapter Management */}
      {/* ========================================================================= */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Breadcrumb Steps */}
          <div className="flex items-center flex-wrap gap-2 text-xs font-black">
            {/* Node 1: Admin Login */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>1. Admin Login: {user?.email || 'admin@eduai.edu'}</span>
              <Check className="w-3 h-3 text-emerald-600" />
            </div>

            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

            {/* Node 2: Admin Dashboard */}
            <button
              type="button"
              onClick={() => setActiveTab('admin_panel')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>2. Admin Dashboard</span>
            </button>

            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

            {/* Node 3: Subject Management */}
            <button
              type="button"
              onClick={() => setCurrentStep('subject_selection')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                currentStep === 'subject_selection'
                  ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>3. Subject Management</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
                {subjectsList.length}
              </span>
            </button>

            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

            {/* Node 4: Selected Subject */}
            <button
              type="button"
              onClick={() => setCurrentStep('chapter_management')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                currentStep === 'chapter_management'
                  ? 'bg-purple-600 text-white shadow-xs ring-2 ring-purple-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-amber-300" />
              <span className="max-w-[140px] truncate">{selectedSubject.name}</span>
            </button>

            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

            {/* Node 5: Chapter Management (Active Hub) */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm font-black">
              <Layers className="w-3.5 h-3.5 text-cyan-300" />
              <span>Chapter Management ({chapters.length})</span>
            </div>
          </div>

          {/* Quick Action Switcher */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenSchemaInspector}
              className="px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer border border-indigo-200 dark:border-indigo-800"
              title="Inspect Firestore chapters schema & live documents"
            >
              <Database className="w-3.5 h-3.5 text-indigo-600" />
              <span>Firestore Structure</span>
            </button>

            {currentStep === 'chapter_management' ? (
              <button
                type="button"
                onClick={() => setCurrentStep('subject_selection')}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                <span>Switch Subject</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentStep('chapter_management')}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Go to Chapters ({chapters.length})</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Chapter</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADMIN EXPERIENCE WORKFLOW: 4-STAGE PIPELINE BANNER                         */}
      {/* ADMIN DASHBOARD ↓ SUBJECT MANAGEMENT ↓ Machine Learning ↓ CHAPTER MGMT    */}
      {/* ========================================================================= */}
      <div className="p-3.5 sm:p-4 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-300 font-black uppercase text-[10px] tracking-wider border border-purple-400/30 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>Workflow 11: Admin Experience</span>
          </span>

          <span className="text-slate-500 hidden sm:inline">•</span>

          <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab('admin_panel')}
              className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-all cursor-pointer hover:text-white"
              title="Step 1: Admin Dashboard"
            >
              ADMIN DASHBOARD
            </button>
            <span className="text-purple-400 font-extrabold">↓</span>
            <button
              type="button"
              onClick={() => setCurrentStep('subject_selection')}
              className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                currentStep === 'subject_selection'
                  ? 'bg-indigo-600 text-white shadow-xs font-black'
                  : 'bg-white/10 hover:bg-white/20 text-slate-200'
              }`}
              title="Step 2: Subject Management"
            >
              SUBJECT MANAGEMENT
            </button>
            <span className="text-purple-400 font-extrabold">↓</span>
            <button
              type="button"
              onClick={() => {
                const ml = subjectsList.find((s) => s.id === 'ml001') || subjectsList[0];
                setSelectedSubject(ml);
                setCurrentStep('chapter_management');
              }}
              className="px-2 py-0.5 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30 hover:bg-amber-400/30 font-black transition-all cursor-pointer"
              title="Step 3: Machine Learning"
            >
              Machine Learning
            </button>
            <span className="text-purple-400 font-extrabold">↓</span>
            <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-black">
              CHAPTER MANAGEMENT
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto flex-wrap">
          {/* Mode Switcher: Admin View vs Student Side */}
          <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => setViewMode('admin')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'admin'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Admin View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('student')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'student'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student Side (Active Only)</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleOpenSchemaInspector}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5"
            title="View complete Admin Experience & Student Side workflow diagram"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-300" />
            <span>Workflow Diagram</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 12. STUDENT SIDE BANNER (ACTIVE CHAPTERS ONLY)                            */}
      {/* Machine Learning ↓ Chapters ↓ Active Chapter List                         */}
      {/* ========================================================================= */}
      {viewMode === 'student' && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-500/30 text-white shadow-lg space-y-3 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold uppercase tracking-wider border border-emerald-400/30">
                    12. Student Side View
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Students only receive active chapters</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <span>{selectedSubject.name}</span>
                  <span className="text-emerald-400">➔</span>
                  <span className="text-emerald-300">Chapters (Active Only)</span>
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold">
                {filteredChapters.length} Active Chapters Available
              </span>
              <button
                type="button"
                onClick={() => setViewMode('admin')}
                className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white font-sans text-xs transition-all cursor-pointer"
              >
                Switch to Admin
              </button>
            </div>
          </div>

          {/* Student Flow Breadcrumb */}
          <div className="p-3 rounded-2xl bg-black/30 border border-white/5 font-mono text-xs flex flex-wrap items-center gap-2 text-slate-300">
            <span className="font-bold text-amber-300">{selectedSubject.name}</span>
            <span className="text-emerald-400">↓</span>
            <span className="font-bold text-indigo-300">Chapters</span>
            <span className="text-emerald-400">↓</span>
            <span className="text-emerald-200">
              {filteredChapters.slice(0, 5).map((c) => `${c.order}. ${c.title}`).join(' • ')}
              {filteredChapters.length > 5 && ` • and ${filteredChapters.length - 5} more chapters`}
            </span>
          </div>

          <div className="text-[11px] text-emerald-200/80 flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-emerald-500/20">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                Kotlin Firestore Query: <code className="font-mono bg-emerald-950/90 px-1.5 py-0.5 rounded text-emerald-300 border border-emerald-800">FirebaseFirestore.getInstance().collection(&quot;chapters&quot;).whereEqualTo(&quot;subjectId&quot;, &quot;{selectedSubject.id}&quot;).whereEqualTo(&quot;isActive&quot;, true).get()</code>
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                const queryCode = `FirebaseFirestore.getInstance()
    .collection("chapters")
    .whereEqualTo("subjectId", "${selectedSubject.id}")
    .whereEqualTo("isActive", true)
    .get()`;
                navigator.clipboard?.writeText(queryCode);
                setFeedback({ type: 'success', message: 'Copied Kotlin student query to clipboard!' });
              }}
              className="px-2 py-0.5 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-400/30 flex items-center gap-1 transition-all cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              <span>Copy Query</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TOP CHAPTER SEARCH BAR (FILTER BY TITLE OR DESCRIPTION)                 */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-purple-300 dark:hover:border-purple-800/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <input
              type="text"
              id="top-chapter-search-bar"
              aria-label="Filter chapters by title or description"
              placeholder="Search chapters by title or description..."
              value={chapterSearch}
              onChange={(e) => {
                setChapterSearch(e.target.value);
                if (currentStep !== 'chapter_management' && e.target.value) {
                  setCurrentStep('chapter_management');
                }
              }}
              className="w-full pl-11 pr-10 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 transition-all shadow-inner"
            />
            {chapterSearch && (
              <button
                type="button"
                onClick={() => setChapterSearch('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                title="Clear chapter search"
              >
                <X className="w-4 h-4 bg-slate-200 dark:bg-slate-700 rounded-full p-0.5" />
              </button>
            )}
          </div>

          {/* Search Status & Match Count Badges */}
          <div className="flex items-center flex-wrap gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 shrink-0">
            {chapterSearch.trim() ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                  <span>
                    Searching: &ldquo;<span className="max-w-[130px] truncate inline-block align-bottom">{chapterSearch}</span>&rdquo;
                  </span>
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold">
                  {filteredChapters.length} of {chapters.length} chapters
                </span>
                <button
                  type="button"
                  onClick={() => setChapterSearch('')}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition-all cursor-pointer"
                >
                  Clear Filter
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-wrap text-slate-500 dark:text-slate-400">
                <span className="text-xs">
                  Filtering <strong className="text-slate-700 dark:text-slate-200 font-bold">{selectedSubject.name}</strong>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                  Title &amp; Description
                </span>
                <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-[11px] font-bold">
                  {chapters.length} Total
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-md transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
              : feedback.type === 'error'
              ? 'bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
              : 'bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-300 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
            {feedback.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            {feedback.type === 'info' && <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3 & 4: SUBJECT MANAGEMENT & SELECT SUBJECT VIEW                        */}
      {/* Displayed when admin is selecting or managing subjects                   */}
      {/* ========================================================================= */}
      {currentStep === 'subject_selection' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 animate-fadeIn">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-black uppercase">
                  Step 3 & 4 of Pipeline
                </span>
                <span className="text-xs text-slate-400 font-bold">
                  {filteredSubjects.length} of {subjectsList.length} Subjects Available
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-indigo-600" />
                <span>Subject Management — Select Subject</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose a subject to view, create, edit, disable, or reorder its chapter modules.
              </p>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search subjects or codes..."
                  value={subjectSearch}
                  onChange={(e) => setSubjectSearch(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <select
                value={subjectLevelFilter}
                onChange={(e) => setSubjectLevelFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200"
              >
                <option value="All">All Education Levels</option>
                <option value="Degree">Degree (B.Sc, BCA, B.Tech)</option>
                <option value="Intermediate">Intermediate (MPC, BiPC)</option>
                <option value="School">School (Class 1-10)</option>
                <option value="Early Childhood">Early Childhood</option>
              </select>
            </div>
          </div>

          {/* Subjects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSubjects.map((subject) => {
              const isSelected = selectedSubject.id === subject.id;
              return (
                <div
                  key={subject.id}
                  onClick={() => {
                    setSelectedSubject(subject);
                    setCurrentStep('chapter_management');
                    setFeedback({
                      type: 'info',
                      message: `Opened Chapter Management via Intent for "${subject.name}" (subjectId: "${subject.id}")`,
                    });
                  }}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 hover:shadow-md ${
                    isSelected
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 dark:border-indigo-500 ring-2 ring-indigo-400/40'
                      : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-black uppercase tracking-wider">
                        {subject.level} • {subject.course}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-black">
                        {subject.code}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                        {subject.name}
                      </h3>
                      {subject.semester && (
                        <p className="text-[11px] font-bold text-purple-600 dark:text-purple-400">
                          Semester {subject.semester}
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {subject.description}
                    </p>

                    {/* Android Intent Extra Preview */}
                    <div className="pt-1">
                      <div className="flex items-center justify-between text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-1 rounded-lg border border-emerald-200/80 dark:border-emerald-800/60">
                        <span className="truncate">putExtra("subjectId", "{subject.id}")</span>
                        <span className="font-bold text-[9px] uppercase tracking-wider text-emerald-800 dark:text-emerald-300 shrink-0 ml-1">Intent</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                    <span className="text-xs font-black text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-purple-600" />
                      <span>
                        {subject.id === selectedSubject.id
                          ? `${chapters.length} Chapters`
                          : `${subject.chaptersCount || 4} Chapters`}
                      </span>
                    </span>

                    <button
                      type="button"
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-indigo-600 hover:text-white'
                      }`}
                    >
                      <span>Manage Chapters</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 5: CHAPTER MANAGEMENT WORKSPACE                                        */}
      {/* Modules: Add Chapter, View Chapters, Edit Chapter, Disable, Reorder      */}
      {/* ========================================================================= */}
      {currentStep === 'chapter_management' && (
        <div className="space-y-6">
          {/* Active Subject Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider">
                  {selectedSubject.level} Level
                </span>
                <span className="px-2.5 py-0.5 rounded bg-purple-500/30 text-purple-200 font-mono text-[11px] font-bold border border-purple-400/30">
                  {selectedSubject.code}
                </span>
                {selectedSubject.semester && (
                  <span className="px-2.5 py-0.5 rounded bg-indigo-500/30 text-indigo-200 text-[11px] font-bold border border-indigo-400/30">
                    Semester {selectedSubject.semester}
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase">
                  Live Firestore Model
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-3">
                <span>{selectedSubject.name}</span>
                <span className="text-sm font-extrabold px-3 py-1 rounded-full bg-white/10 text-purple-200">
                  {selectedSubject.course}
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-indigo-200 max-w-2xl">
                {selectedSubject.description}
              </p>
            </div>

            {/* Subject Summary Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
              <div className="p-3 rounded-2xl bg-white/10 border border-white/10 text-center">
                <p className="text-xl font-black text-white">{chapters.length}</p>
                <p className="text-[10px] uppercase font-extrabold text-indigo-200">Total Chapters</p>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/20 text-center">
                <p className="text-xl font-black text-emerald-300">{activeCount}</p>
                <p className="text-[10px] uppercase font-extrabold text-emerald-200">Active Live</p>
              </div>

              <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/20 text-center">
                <p className="text-xl font-black text-amber-300">{disabledCount}</p>
                <p className="text-[10px] uppercase font-extrabold text-amber-200">Disabled</p>
              </div>

              <div className="p-3 rounded-2xl bg-white/10 border border-white/10 text-center">
                <p className="text-xl font-black text-cyan-300">{totalHours}h</p>
                <p className="text-[10px] uppercase font-extrabold text-indigo-200">Total Est. Time</p>
              </div>
            </div>
          </div>

          {/* Chapters Management Controls Toolbar */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search & Filter */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter chapters by title or description..."
                  value={chapterSearch}
                  onChange={(e) => setChapterSearch(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
                {chapterSearch && (
                  <button
                    type="button"
                    onClick={() => setChapterSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    title="Clear filter"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status Filter Buttons */}
              <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                {(['all', 'active', 'disabled'] as const).map((filterVal) => (
                  <button
                    key={filterVal}
                    type="button"
                    onClick={() => setChapterStatusFilter(filterVal)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black capitalize transition-all cursor-pointer ${
                      chapterStatusFilter === filterVal
                        ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {filterVal}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions: Firestore Schema, Seed Examples, Reorder Sequence, Add Chapter */}
            <div className="flex flex-wrap items-center gap-2.5 self-end md:self-auto">
              <button
                type="button"
                onClick={handleOpenSchemaInspector}
                className="px-3.5 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-black flex items-center gap-1.5 border border-indigo-200 dark:border-indigo-800 transition-all cursor-pointer"
                title="Inspect Firestore chapters schema & live documents"
              >
                <Database className="w-4 h-4 text-indigo-600" />
                <span>Firestore Schema</span>
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSeedExampleChapters}
                className="px-3.5 py-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-xs font-black flex items-center gap-1.5 border border-purple-200 dark:border-purple-800 transition-all cursor-pointer disabled:opacity-50"
                title="Seed abc123 (Introduction to Machine Learning) and xyz456 (Linear Regression) to Firestore collection chapters"
              >
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Seed (abc123 & xyz456)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsReorderModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 text-purple-600" />
                <span>Reorder Sequence</span>
              </button>

              <button
                type="button"
                onClick={handleOpenAddModal}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black flex items-center gap-2 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Chapter</span>
              </button>
            </div>
          </div>

          {/* Firestore Schema Status Banner */}
          <div className="px-5 py-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-indigo-900 dark:text-indigo-200 shadow-xs">
            <div className="flex items-center gap-2.5">
              <Database className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <span className="font-black">Firestore Collection:</span>{' '}
                <code className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 font-mono text-[11px] font-bold text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-900">
                  chapters
                </code>
                <span className="text-slate-400 mx-2">•</span>
                <span className="font-black">Document:</span>{' '}
                <code className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900">
                  chapters/{'{chapterId}'}
                </code>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 flex-wrap font-medium">
              <span className="font-bold text-slate-700 dark:text-slate-300">Fields:</span>
              <code className="font-mono bg-white dark:bg-slate-800 px-1 rounded text-[10px] text-slate-700 dark:text-slate-300">id</code>
              <code className="font-mono bg-white dark:bg-slate-800 px-1 rounded text-[10px] text-slate-700 dark:text-slate-300">subjectId</code>
              <code className="font-mono bg-white dark:bg-slate-800 px-1 rounded text-[10px] text-slate-700 dark:text-slate-300">title</code>
              <code className="font-mono bg-white dark:bg-slate-800 px-1 rounded text-[10px] text-slate-700 dark:text-slate-300">description</code>
              <code className="font-mono bg-white dark:bg-slate-800 px-1 rounded text-[10px] text-slate-700 dark:text-slate-300">order</code>
              <code className="font-mono bg-white dark:bg-slate-800 px-1 rounded text-[10px] text-slate-700 dark:text-slate-300">isActive</code>
              <code className="font-mono bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded text-[10px] text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">createdAt: Timestamp</code>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CHAPTERS LIST (VIEW CHAPTERS)                                             */}
          {/* ========================================================================= */}
          {filteredChapters.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
              <Layers className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-200">
                {chapterSearch ? `No chapters match "${chapterSearch}"` : 'No chapters created for this subject yet'}
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {chapterSearch
                  ? `No chapter titles or descriptions match your query. Try a different keyword or reset the search filter.`
                  : `Get started by clicking the "Add Chapter" button to create modular units for ${selectedSubject.name}.`}
              </p>
              {chapterSearch ? (
                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setChapterSearch('')}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-md cursor-pointer transition-all"
                  >
                    Clear Search Filter
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenAddModal}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-black text-xs cursor-pointer transition-all"
                  >
                    + Add New Chapter
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="mt-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-md cursor-pointer"
                >
                  + Add First Chapter
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredChapters.map((chapter, index) => {
                const isFirst = index === 0;
                const isLast = index === filteredChapters.length - 1;

                return (
                  <div
                    key={chapter.id}
                    className={`p-5 sm:p-6 rounded-3xl border transition-all space-y-4 ${
                      chapter.isActive
                        ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs hover:border-purple-300 dark:hover:border-purple-800'
                        : 'bg-slate-50/80 dark:bg-slate-900/50 border-amber-300/60 dark:border-amber-900/60 opacity-80'
                    }`}
                  >
                    {/* Top Row: Order Badge, Status Badge, Title, Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {/* Sequence Number Pill */}
                        <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 flex flex-col items-center justify-center shrink-0">
                          <span className="text-[10px] font-black uppercase text-purple-500">No.</span>
                          <span className="text-lg font-black text-purple-700 dark:text-purple-300 leading-none">
                            {chapter.order}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                              {renderHighlightedText(chapter.title, chapterSearch)}
                            </h3>

                            {/* Status Badge */}
                            {chapter.isActive ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Active (Live)
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                <EyeOff className="w-3 h-3 text-amber-600" />
                                Disabled (Hidden)
                              </span>
                            )}

                            {chapter.estimatedHours && (
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-bold flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {chapter.estimatedHours} Hours
                              </span>
                            )}

                            <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold">
                              {chapter.lessonCount || 0} Lessons
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            {renderHighlightedText(chapter.description, chapterSearch)}
                          </p>

                          {/* Key Topics Tags */}
                          {chapter.topics && chapter.topics.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <span className="text-[11px] font-extrabold text-slate-400 mr-1">Topics:</span>
                              {chapter.topics.map((topic, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold border border-slate-200 dark:border-slate-700"
                                >
                                  {renderHighlightedText(topic, chapterSearch)}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Action Buttons */}
                      {viewMode === 'student' ? (
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-start flex-wrap">
                          <button
                            type="button"
                            onClick={() => {
                              if (onNavigateToLessons) {
                                onNavigateToLessons(selectedSubject.name, chapter.title);
                              } else {
                                setFeedback({
                                  type: 'info',
                                  message: `Student started learning "${chapter.title}"! Loading curriculum lessons...`,
                                });
                              }
                            }}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Start Chapter</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setFeedback({
                                type: 'info',
                                message: `Opening student quiz for "${chapter.title}"...`,
                              });
                            }}
                            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                            <span>Quiz</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-start">
                          {/* Reorder Up */}
                          <button
                            type="button"
                            disabled={isFirst}
                            onClick={() => handleMoveChapter(index, 'up')}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            title="Move Chapter Up"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>

                          {/* Reorder Down */}
                          <button
                            type="button"
                            disabled={isLast}
                            onClick={() => handleMoveChapter(index, 'down')}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            title="Move Chapter Down"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>

                          {/* Edit Button [Edit] */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(chapter)}
                            className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center gap-1.5 border border-indigo-200 dark:border-indigo-800 transition-all cursor-pointer shadow-xs"
                            title="Edit Chapter title, description, or order"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                            <span>Edit</span>
                          </button>

                          {/* Toggle Active / Disable [Disable] */}
                          <button
                            type="button"
                            onClick={() => handleToggleChapterStatus(chapter)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border shadow-xs ${
                              chapter.isActive
                                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 border-amber-200 dark:border-amber-800'
                                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border-emerald-200 dark:border-emerald-800'
                            }`}
                            title={chapter.isActive ? "Hide chapter from students (isActive: false)" : "Enable chapter for students (isActive: true)"}
                          >
                            {chapter.isActive ? (
                              <>
                                <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                                <span>Disable</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Enable</span>
                              </>
                            )}
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenDeleteModal(chapter)}
                            className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer"
                            title="Delete Chapter"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Bottom Metadata & Tools Bar: Exact Firestore Fields Representation */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
                      {/* Document Details & Fields */}
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                          <span className="text-slate-400 font-bold text-[10px]">ID:</span>
                          <code className="font-mono text-[11px] font-black text-purple-600 dark:text-purple-300">
                            {chapter.id}
                          </code>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(chapter.id);
                              setFeedback({ type: 'success', message: `Copied ID "${chapter.id}" to clipboard!` });
                            }}
                            className="text-slate-400 hover:text-purple-600 p-0.5 cursor-pointer"
                            title="Copy Document ID"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-lg text-[10px] font-bold">
                          <span className="text-indigo-400">subjectId:</span>
                          <code className="font-mono font-bold">{chapter.subjectId}</code>
                        </div>

                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-lg text-[10px] font-bold">
                          <span className="text-slate-400">order:</span>
                          <code className="font-mono font-bold">{chapter.order}</code>
                        </div>

                        <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-lg text-[10px] font-bold">
                          <span className="text-emerald-500">createdAt:</span>
                          <span>{formatFirestoreDate(chapter.createdAt)}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setJsonModalChapter(chapter)}
                          className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-black flex items-center gap-1 transition-colors cursor-pointer"
                          title="Inspect raw Firestore Document JSON"
                        >
                          <Code className="w-3 h-3 text-indigo-500" />
                          <span>View JSON</span>
                        </button>
                      </div>

                      {/* Lesson Bridge */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            if (onNavigateToLessons) {
                              onNavigateToLessons(selectedSubject.name, chapter.title);
                            } else {
                              setActiveTab('lesson-management');
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-purple-200/60 dark:border-purple-800/60"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Manage Lessons</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD CHAPTER MODAL                                                */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleUp my-8">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-purple-900 to-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/10">
                  <Plus className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h3 className="text-base font-black">Add New Chapter</h3>
                  <p className="text-xs text-purple-200">Subject: {selectedSubject.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateChapter} className="p-6 space-y-4">
              {/* Firestore Schema Mapping Banner */}
              <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-[11px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-black text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-indigo-600" />
                    Firestore Document Mapping
                  </span>
                  <span className="text-[10px] font-mono text-indigo-500 font-bold">
                    collection('chapters')
                  </span>
                </div>
                <code className="block font-mono text-[10px] text-indigo-700 dark:text-indigo-300 overflow-x-auto whitespace-nowrap bg-white/60 dark:bg-slate-900/60 p-1.5 rounded-lg border border-indigo-100 dark:border-indigo-900">
                  chapters/{formCustomId.trim() || '{auto-generated-id}'} ➔ &#123; id, subjectId: "{selectedSubject.id}", title, description, order: {formOrder}, isActive: {formIsActive ? 'true' : 'false'}, createdAt: Timestamp &#125;
                </code>
              </div>

              {/* Document ID (Optional / Custom) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
                    Document ID <span className="text-slate-400 font-normal">(Optional Firestore Doc ID)</span>
                  </label>
                  <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold">
                    e.g. abc123 or xyz456
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Leave empty to auto-generate, or enter specific ID (e.g. abc123)"
                  value={formCustomId}
                  onChange={(e) => setFormCustomId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Chapter Title */}
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                  Chapter Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chapter 6: Deep Learning & Neural Networks"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Chapter Description */}
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                  Chapter Description & Learning Scope <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Summarize the concepts, real-world utility, and learning outcomes for this chapter..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Row: Order Sequence & Estimated Hours */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                    Sequence Order #
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formOrder}
                    onChange={(e) => setFormOrder(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                    Estimated Study Hours
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formEstimatedHours}
                    onChange={(e) => setFormEstimatedHours(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Topics / Key Concepts Tag Builder */}
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                  Key Concepts & Topics
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Backpropagation, Activation Functions..."
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTopic();
                      }
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={handleAddTopic}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shrink-0 cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                {formTopics.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {formTopics.map((top, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center gap-1 border border-purple-200 dark:border-purple-800"
                      >
                        <span>{top}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTopic(idx)}
                          className="hover:text-rose-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Toggle Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded accent-purple-600"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-100">
                      Active & Visible to Students
                    </span>
                    <p className="text-[11px] text-slate-400">
                      If unchecked, chapter will be saved as disabled / draft and hidden from the student app.
                    </p>
                  </div>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving Chapter...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Chapter to Database</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EDIT CHAPTER MODAL                                               */}
      {/* ========================================================================= */}
      {isEditModalOpen && activeChapter && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleUp my-8">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/10">
                  <Edit3 className="w-5 h-5 text-indigo-300" />
                </div>
                <div>
                  <h3 className="text-base font-black">Edit Chapter: {activeChapter.title}</h3>
                  <p className="text-xs text-indigo-200">ID: {activeChapter.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdateChapter} className="p-6 space-y-4">
              {/* Chapter Title */}
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                  Chapter Title
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* Row: Order Sequence & Hours */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                    Sequence Order #
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formOrder}
                    onChange={(e) => setFormOrder(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formEstimatedHours}
                    onChange={(e) => setFormEstimatedHours(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Topics Tag Builder */}
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                  Key Concepts & Topics
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add topic..."
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTopic();
                      }
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={handleAddTopic}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shrink-0 cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                {formTopics.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {formTopics.map((top, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center gap-1 border border-indigo-200 dark:border-indigo-800"
                      >
                        <span>{top}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTopic(idx)}
                          className="hover:text-rose-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded accent-indigo-600"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-100">
                      Active & Visible to Students
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Toggle whether this chapter appears in student lesson lists.
                    </p>
                  </div>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: DELETE CONFIRMATION MODAL                                        */}
      {/* ========================================================================= */}
      {isDeleteModalOpen && activeChapter && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900 shadow-2xl overflow-hidden animate-scaleUp">
            <div className="p-5 bg-rose-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <h3 className="text-base font-black">Confirm Chapter Deletion</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="p-1 rounded-full text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Are you sure you want to permanently delete this chapter from Firebase Firestore?
              </p>

              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs space-y-1">
                <p className="font-black text-rose-900 dark:text-rose-200">
                  {activeChapter.title}
                </p>
                <p className="text-rose-700 dark:text-rose-300 text-[11px]">
                  Subject: {selectedSubject.name} • Order #{activeChapter.order}
                </p>
                <p className="text-rose-600 dark:text-rose-400 text-[10px]">
                  This action cannot be undone. Associated lessons should be reassigned or deleted.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleDeleteChapter}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  <span>Delete Chapter</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: REORDER CHAPTERS MODAL                                           */}
      {/* ========================================================================= */}
      {isReorderModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleUp my-8">
            <div className="p-5 bg-gradient-to-r from-purple-900 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-purple-300" />
                <h3 className="text-base font-black">Reorder Chapters Sequence</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsReorderModalOpen(false)}
                className="p-1 rounded-full text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Use the Move Up and Move Down buttons to order chapters. When finished, click "Renumber Sequentially" to persist the 1..N order.
              </p>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {chapters.map((chap, idx) => (
                  <div
                    key={chap.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-black flex items-center justify-center text-xs shrink-0">
                        #{idx + 1}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[240px]">
                        {chap.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveChapter(idx, 'up')}
                        className="p-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === chapters.length - 1}
                        onClick={() => handleMoveChapter(idx, 'down')}
                        className="p-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setIsReorderModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={handleAutoResequence}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Renumber 1 to {chapters.length}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ========================================================================= */}
      {/* MODAL 5: FIRESTORE SCHEMA & LIVE DB INSPECTOR MODAL                       */}
      {/* ========================================================================= */}
      {isSchemaModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleUp my-8">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/10">
                  <Database className="w-5 h-5 text-indigo-300" />
                </div>
                <div>
                  <h3 className="text-base font-black">Firestore Structure & DB Inspector</h3>
                  <p className="text-xs text-indigo-200 font-mono">
                    Collection: <span className="text-purple-300 font-bold">chapters</span> • Document: <span className="text-cyan-300 font-bold">chapters/{'{chapterId}'}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSchemaModalOpen(false)}
                className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Architecture & Hierarchy Visual Diagram */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <FolderTree className="w-3.5 h-3.5 text-indigo-500" />
                  <span>1. Firestore Collection Hierarchy</span>
                </h4>
                <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed overflow-x-auto border border-slate-800 shadow-inner">
                  <div className="text-purple-400 font-bold">chapters</div>
                  <div className="text-slate-500 pl-3">│</div>
                  <div className="text-slate-400 pl-3">└── <span className="text-cyan-400 font-bold">chapterId</span></div>
                  <div className="text-slate-400 pl-9">├── <span className="text-indigo-300 font-bold">id</span>: <span className="text-emerald-400">string</span> <span className="text-slate-500">// e.g. "abc123", "xyz456"</span></div>
                  <div className="text-slate-400 pl-9">├── <span className="text-indigo-300 font-bold">subjectId</span>: <span className="text-emerald-400">string</span> <span className="text-slate-500">// e.g. "ml001"</span></div>
                  <div className="text-slate-400 pl-9">├── <span className="text-indigo-300 font-bold">title</span>: <span className="text-emerald-400">string</span> <span className="text-slate-500">// e.g. "Introduction to Machine Learning"</span></div>
                  <div className="text-slate-400 pl-9">├── <span className="text-indigo-300 font-bold">description</span>: <span className="text-emerald-400">string</span> <span className="text-slate-500">// e.g. "Basic concepts of ML"</span></div>
                  <div className="text-slate-400 pl-9">├── <span className="text-indigo-300 font-bold">order</span>: <span className="text-amber-400">number</span> <span className="text-slate-500">// 1, 2, 3...</span></div>
                  <div className="text-slate-400 pl-9">├── <span className="text-indigo-300 font-bold">isActive</span>: <span className="text-rose-400">boolean</span> <span className="text-slate-500">// true | false</span></div>
                  <div className="text-slate-400 pl-9">└── <span className="text-indigo-300 font-bold">createdAt</span>: <span className="text-purple-400 font-bold">Timestamp</span> <span className="text-slate-500">// Firebase Timestamp</span></div>
                </div>
              </div>

              {/* Exact Examples Defined in Specification */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                    <span>2. Example Documents (abc123 & xyz456)</span>
                  </h4>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSeedExampleChapters}
                    className="px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSubmitting ? 'animate-spin' : ''}`} />
                    <span>Write Examples to Firestore</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Doc 1: abc123 */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-purple-600 dark:text-purple-400 font-mono">
                        chapters / abc123
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const json = JSON.stringify(
                            {
                              id: 'abc123',
                              subjectId: 'ml001',
                              title: 'Introduction to Machine Learning',
                              description: 'Basic concepts of ML',
                              order: 1,
                              isActive: true,
                              createdAt: 'Timestamp(...)',
                            },
                            null,
                            2
                          );
                          navigator.clipboard?.writeText(json);
                          setFeedback({ type: 'success', message: 'Copied abc123 JSON to clipboard!' });
                        }}
                        className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        title="Copy abc123 JSON"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <pre className="font-mono text-[11px] text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
{`{
  "id": "abc123",
  "subjectId": "ml001",
  "title": "Introduction to Machine Learning",
  "description": "Basic concepts of ML",
  "order": 1,
  "isActive": true,
  "createdAt": Timestamp
}`}
                    </pre>
                  </div>

                  {/* Doc 2: xyz456 */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-purple-600 dark:text-purple-400 font-mono">
                        chapters / xyz456
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const json = JSON.stringify(
                            {
                              id: 'xyz456',
                              subjectId: 'ml001',
                              title: 'Linear Regression',
                              description: 'Regression techniques',
                              order: 2,
                              isActive: true,
                              createdAt: 'Timestamp(...)',
                            },
                            null,
                            2
                          );
                          navigator.clipboard?.writeText(json);
                          setFeedback({ type: 'success', message: 'Copied xyz456 JSON to clipboard!' });
                        }}
                        className="p-1 rounded-text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        title="Copy xyz456 JSON"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <pre className="font-mono text-[11px] text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
{`{
  "id": "xyz456",
  "subjectId": "ml001",
  "title": "Linear Regression",
  "description": "Regression techniques",
  "order": 2,
  "isActive": true,
  "createdAt": Timestamp
}`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* 3. Live Firestore Documents Query */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-500" />
                    <span>3. Live Documents in Firestore ({liveDbDocuments.length} found)</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleOpenSchemaInspector}
                    className="p-1 text-slate-400 hover:text-indigo-600 flex items-center gap-1 text-xs"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoadingLiveDb ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>

                {isLoadingLiveDb ? (
                  <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                    <RefreshCw className="w-6 h-6 animate-spin text-indigo-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">Querying collection('chapters')...</p>
                  </div>
                ) : liveDbDocuments.length === 0 ? (
                  <div className="p-6 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 space-y-2">
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-bold">
                      No live documents currently returned from Firestore query.
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Click "Write Examples to Firestore" to seed abc123 and xyz456 immediately.
                    </p>
                    <button
                      type="button"
                      onClick={handleSeedExampleChapters}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs cursor-pointer shadow-xs"
                    >
                      + Seed Example Chapters Now
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {liveDbDocuments.map((docItem) => (
                      <div
                        key={docItem.id}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <code className="font-mono text-[11px] font-black text-purple-600 dark:text-purple-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 shrink-0">
                            {docItem.id}
                          </code>
                          <div className="truncate">
                            <span className="font-bold text-slate-900 dark:text-slate-100">
                              {docItem.title || 'Untitled'}
                            </span>
                            <span className="text-slate-400 text-[10px] ml-2">
                              subjectId: {docItem.subjectId} • order: #{docItem.order}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              docItem.isActive
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {docItem.isActive ? 'Active' : 'Disabled'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setJsonModalChapter(docItem)}
                            className="p-1 text-slate-400 hover:text-indigo-600"
                            title="Inspect JSON"
                          >
                            <Code className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. Kotlin Model: Chapter.kt */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-emerald-500" />
                    <span>4. Kotlin Data Model (Chapter.kt)</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const kotlinCode = `package com.eduai.model

import com.google.firebase.Timestamp

data class Chapter(
    val id: String = "",
    val subjectId: String = "",
    val title: String = "",
    val description: String = "",
    val order: Int = 0,
    val isActive: Boolean = true,
    val createdAt: Timestamp? = null
)`;
                      navigator.clipboard?.writeText(kotlinCode);
                      setFeedback({ type: 'success', message: 'Copied Chapter.kt Kotlin code to clipboard!' });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Chapter.kt</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800/80 pb-2">
                    <span className="text-purple-400 font-bold">com/eduai/model/Chapter.kt</span>
                    <span className="text-emerald-400">Kotlin Data Class</span>
                  </div>
                  <pre className="font-mono text-xs text-emerald-400 leading-relaxed overflow-x-auto p-1">
{`package com.eduai.model

import com.google.firebase.Timestamp

data class Chapter(
    val id: String = "",
    val subjectId: String = "",
    val title: String = "",
    val description: String = "",
    val order: Int = 0,
    val isActive: Boolean = true,
    val createdAt: Timestamp? = null
)`}
                  </pre>
                </div>
              </div>

              {/* 5. Kotlin Repository: ChapterRepository.kt */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-cyan-400" />
                    <span>5. Kotlin Repository (ChapterRepository.kt)</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const repoCode = `package com.eduai.repository

import com.eduai.model.Chapter
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.google.firebase.firestore.FieldValue

class ChapterRepository {

    private val db = FirebaseFirestore.getInstance()

    private val chapters =
        db.collection("chapters")

    fun addChapter(
        subjectId: String,
        title: String,
        description: String,
        order: Int,
        onSuccess: () -> Unit,
        onError: (Exception) -> Unit
    ) {

        val document = chapters.document()

        val chapter = hashMapOf(
            "id" to document.id,
            "subjectId" to subjectId,
            "title" to title,
            "description" to description,
            "order" to order,
            "isActive" to true,
            "createdAt" to FieldValue.serverTimestamp()
        )

        document.set(chapter)
            .addOnSuccessListener {
                onSuccess()
            }
            .addOnFailureListener {
                onError(it)
            }
    }

    fun updateChapter(
        chapterId: String,
        title: String,
        description: String,
        order: Int,
        onSuccess: () -> Unit,
        onError: (Exception) -> Unit
    ) {

        val updateData = hashMapOf<String, Any>(
            "title" to title,
            "description" to description,
            "order" to order
        )

        chapters.document(chapterId)
            .update(updateData)
            .addOnSuccessListener {
                onSuccess()
            }
            .addOnFailureListener {
                onError(it)
            }
    }

    fun disableChapter(
        chapterId: String,
        onSuccess: () -> Unit,
        onError: (Exception) -> Unit
    ) {

        chapters.document(chapterId)
            .update("isActive", false)
            .addOnSuccessListener {
                onSuccess()
            }
            .addOnFailureListener {
                onError(it)
            }
    }

    fun getChapters(
        subjectId: String,
        onSuccess: (List<Chapter>) -> Unit,
        onError: (Exception) -> Unit
    ) {

        chapters
            .whereEqualTo("subjectId", subjectId)
            .whereEqualTo("isActive", true)
            .orderBy("order", Query.Direction.ASCENDING)
            .get()
            .addOnSuccessListener { snapshot ->

                val list = snapshot.documents.mapNotNull {
                    it.toObject(Chapter::class.java)
                }

                onSuccess(list)
            }
            .addOnFailureListener {
                onError(it)
            }
    }
}`;
                      navigator.clipboard?.writeText(repoCode);
                      setFeedback({ type: 'success', message: 'Copied ChapterRepository.kt code to clipboard!' });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy ChapterRepository.kt</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800/80 pb-2">
                    <span className="text-purple-400 font-bold">com/eduai/repository/ChapterRepository.kt</span>
                    <span className="text-cyan-400">Kotlin Repository Class</span>
                  </div>
                  <pre className="font-mono text-xs text-cyan-300 leading-relaxed overflow-x-auto p-1 max-h-72">
{`package com.eduai.repository

import com.eduai.model.Chapter
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.google.firebase.firestore.FieldValue

class ChapterRepository {

    private val db = FirebaseFirestore.getInstance()

    private val chapters =
        db.collection("chapters")

    fun addChapter(
        subjectId: String,
        title: String,
        description: String,
        order: Int,
        onSuccess: () -> Unit,
        onError: (Exception) -> Unit
    ) {
        val document = chapters.document()
        val chapter = hashMapOf(
            "id" to document.id,
            "subjectId" to subjectId,
            "title" to title,
            "description" to description,
            "order" to order,
            "isActive" to true,
            "createdAt" to FieldValue.serverTimestamp()
        )
        document.set(chapter)
            .addOnSuccessListener { onSuccess() }
            .addOnFailureListener { onError(it) }
    }

    fun updateChapter(
        chapterId: String,
        title: String,
        description: String,
        order: Int,
        onSuccess: () -> Unit,
        onError: (Exception) -> Unit
    ) {
        val updateData = hashMapOf<String, Any>(
            "title" to title,
            "description" to description,
            "order" to order
        )
        chapters.document(chapterId)
            .update(updateData)
            .addOnSuccessListener { onSuccess() }
            .addOnFailureListener { onError(it) }
    }

    fun disableChapter(
        chapterId: String,
        onSuccess: () -> Unit,
        onError: (Exception) -> Unit
    ) {
        chapters.document(chapterId)
            .update("isActive", false)
            .addOnSuccessListener { onSuccess() }
            .addOnFailureListener { onError(it) }
    }

    fun getChapters(
        subjectId: String,
        onSuccess: (List<Chapter>) -> Unit,
        onError: (Exception) -> Unit
    ) {
        chapters
            .whereEqualTo("subjectId", subjectId)
            .whereEqualTo("isActive", true)
            .orderBy("order", Query.Direction.ASCENDING)
            .get()
            .addOnSuccessListener { snapshot ->
                val list = snapshot.documents.mapNotNull {
                    it.toObject(Chapter::class.java)
                }
                onSuccess(list)
            }
            .addOnFailureListener { onError(it) }
    }
}`}
                  </pre>
                </div>
              </div>

              {/* 6. Android Layout: activity_chapter_management.xml */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-500" />
                    <span>6. Android XML Layout (activity_chapter_management.xml)</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const xmlCode = `<?xml version="1.0" encoding="utf-8"?>

<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="16dp">

    <TextView
        android:id="@+id/txtSubjectName"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Machine Learning"
        android:textSize="24sp"
        android:textStyle="bold"
        android:paddingBottom="12dp"/>

    <Button
        android:id="@+id/btnAddChapter"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="+ Add Chapter"/>

    <androidx.recyclerview.widget.RecyclerView
        android:id="@+id/recyclerChapters"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="1"
        android:layout_marginTop="16dp"/>

</LinearLayout>`;
                      navigator.clipboard?.writeText(xmlCode);
                      setFeedback({ type: 'success', message: 'Copied activity_chapter_management.xml to clipboard!' });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy XML Layout</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800/80 pb-2">
                    <span className="text-purple-400 font-bold">res/layout/activity_chapter_management.xml</span>
                    <span className="text-amber-400">Android XML Layout</span>
                  </div>
                  <pre className="font-mono text-xs text-amber-300 leading-relaxed overflow-x-auto p-1 max-h-60">
{`<?xml version="1.0" encoding="utf-8"?>

<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="16dp">

    <TextView
        android:id="@+id/txtSubjectName"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Machine Learning"
        android:textSize="24sp"
        android:textStyle="bold"
        android:paddingBottom="12dp"/>

    <Button
        android:id="@+id/btnAddChapter"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="+ Add Chapter"/>

    <androidx.recyclerview.widget.RecyclerView
        android:id="@+id/recyclerChapters"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="1"
        android:layout_marginTop="16dp"/>

</LinearLayout>`}
                  </pre>
                </div>
              </div>

              {/* 7. Dialog Layout: dialog_add_chapter.xml */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                    <span>7. Add Chapter Dialog (dialog_add_chapter.xml)</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const dialogXmlCode = `<?xml version="1.0" encoding="utf-8"?>

<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="vertical"
    android:padding="20dp">

    <EditText
        android:id="@+id/edtChapterTitle"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:hint="Chapter title"/>

    <EditText
        android:id="@+id/edtChapterDescription"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:hint="Description"
        android:inputType="textMultiLine"
        android:minLines="3"
        android:layout_marginTop="10dp"/>

    <EditText
        android:id="@+id/edtChapterOrder"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:hint="Order"
        android:inputType="number"
        android:layout_marginTop="10dp"/>

</LinearLayout>`;
                      navigator.clipboard?.writeText(dialogXmlCode);
                      setFeedback({ type: 'success', message: 'Copied dialog_add_chapter.xml to clipboard!' });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Dialog XML</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800/80 pb-2">
                    <span className="text-purple-400 font-bold">res/layout/dialog_add_chapter.xml</span>
                    <span className="text-pink-400">Android Dialog XML</span>
                  </div>
                  <pre className="font-mono text-xs text-pink-300 leading-relaxed overflow-x-auto p-1 max-h-60">
{`<?xml version="1.0" encoding="utf-8"?>

<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="vertical"
    android:padding="20dp">

    <EditText
        android:id="@+id/edtChapterTitle"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:hint="Chapter title"/>

    <EditText
        android:id="@+id/edtChapterDescription"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:hint="Description"
        android:inputType="textMultiLine"
        android:minLines="3"
        android:layout_marginTop="10dp"/>

    <EditText
        android:id="@+id/edtChapterOrder"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:hint="Order"
        android:inputType="number"
        android:layout_marginTop="10dp"/>

</LinearLayout>`}
                  </pre>
                </div>
              </div>

              {/* 8. RecyclerView Item Layout: item_chapter.xml */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-500" />
                    <span>8. RecyclerView Item Layout (item_chapter.xml)</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const itemXmlCode = `<?xml version="1.0" encoding="utf-8"?>

<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="vertical"
    android:padding="16dp">

    <TextView
        android:id="@+id/txtChapterTitle"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:textSize="18sp"
        android:textStyle="bold"/>

    <TextView
        android:id="@+id/txtChapterDescription"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="4dp"/>

    <TextView
        android:id="@+id/txtChapterOrder"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="4dp"/>

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal">

        <Button
            android:id="@+id/btnEdit"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:text="Edit"/>

        <Button
            android:id="@+id/btnDelete"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:text="Disable"/>

    </LinearLayout>

</LinearLayout>`;
                      navigator.clipboard?.writeText(itemXmlCode);
                      setFeedback({ type: 'success', message: 'Copied item_chapter.xml to clipboard!' });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Item XML</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800/80 pb-2">
                    <span className="text-purple-400 font-bold">res/layout/item_chapter.xml</span>
                    <span className="text-blue-400">Android Item Layout</span>
                  </div>
                  <pre className="font-mono text-xs text-blue-300 leading-relaxed overflow-x-auto p-1 max-h-60">
{`<?xml version="1.0" encoding="utf-8"?>

<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="vertical"
    android:padding="16dp">

    <TextView
        android:id="@+id/txtChapterTitle"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:textSize="18sp"
        android:textStyle="bold"/>

    <TextView
        android:id="@+id/txtChapterDescription"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="4dp"/>

    <TextView
        android:id="@+id/txtChapterOrder"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="4dp"/>

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal">

        <Button
            android:id="@+id/btnEdit"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:text="Edit"/>

        <Button
            android:id="@+id/btnDelete"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:text="Disable"/>

    </LinearLayout>

</LinearLayout>`}
                  </pre>
                </div>
              </div>

              {/* 9. Android Adapter: ChapterAdapter.kt */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-teal-400" />
                    <span>9. Android RecyclerView Adapter (ChapterAdapter.kt)</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const adapterCode = `package com.eduai.admin

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.eduai.R
import com.eduai.model.Chapter

class ChapterAdapter(
    private var chapters: List<Chapter>,
    private val onEdit: (Chapter) -> Unit,
    private val onDelete: (Chapter) -> Unit
) : RecyclerView.Adapter<ChapterAdapter.ChapterViewHolder>() {

    class ChapterViewHolder(view: View) :
        RecyclerView.ViewHolder(view) {

        val title: TextView =
            view.findViewById(R.id.txtChapterTitle)

        val description: TextView =
            view.findViewById(R.id.txtChapterDescription)

        val order: TextView =
            view.findViewById(R.id.txtChapterOrder)

        val edit: Button =
            view.findViewById(R.id.btnEdit)

        val delete: Button =
            view.findViewById(R.id.btnDelete)
    }

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): ChapterViewHolder {

        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_chapter, parent, false)

        return ChapterViewHolder(view)
    }

    override fun onBindViewHolder(
        holder: ChapterViewHolder,
        position: Int
    ) {

        val chapter = chapters[position]

        holder.title.text =
            "\${chapter.order}. \${chapter.title}"

        holder.description.text =
            chapter.description

        holder.order.text =
            "Chapter \${chapter.order}"

        holder.edit.setOnClickListener {
            onEdit(chapter)
        }

        holder.delete.setOnClickListener {
            onDelete(chapter)
        }
    }

    override fun getItemCount(): Int =
        chapters.size

    fun updateData(newList: List<Chapter>) {
        chapters = newList
        notifyDataSetChanged()
    }
}`;
                      navigator.clipboard?.writeText(adapterCode);
                      setFeedback({ type: 'success', message: 'Copied ChapterAdapter.kt to clipboard!' });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Adapter.kt</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800/80 pb-2">
                    <span className="text-purple-400 font-bold">com/eduai/admin/ChapterAdapter.kt</span>
                    <span className="text-teal-400">Kotlin Adapter Class</span>
                  </div>
                  <pre className="font-mono text-xs text-teal-300 leading-relaxed overflow-x-auto p-1 max-h-72">
{`package com.eduai.admin

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.eduai.R
import com.eduai.model.Chapter

class ChapterAdapter(
    private var chapters: List<Chapter>,
    private val onEdit: (Chapter) -> Unit,
    private val onDelete: (Chapter) -> Unit
) : RecyclerView.Adapter<ChapterAdapter.ChapterViewHolder>() {

    class ChapterViewHolder(view: View) :
        RecyclerView.ViewHolder(view) {

        val title: TextView =
            view.findViewById(R.id.txtChapterTitle)

        val description: TextView =
            view.findViewById(R.id.txtChapterDescription)

        val order: TextView =
            view.findViewById(R.id.txtChapterOrder)

        val edit: Button =
            view.findViewById(R.id.btnEdit)

        val delete: Button =
            view.findViewById(R.id.btnDelete)
    }

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): ChapterViewHolder {

        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_chapter, parent, false)

        return ChapterViewHolder(view)
    }

    override fun onBindViewHolder(
        holder: ChapterViewHolder,
        position: Int
    ) {

        val chapter = chapters[position]

        holder.title.text =
            "\${chapter.order}. \${chapter.title}"

        holder.description.text =
            chapter.description

        holder.order.text =
            "Chapter \${chapter.order}"

        holder.edit.setOnClickListener {
            onEdit(chapter)
        }

        holder.delete.setOnClickListener {
            onDelete(chapter)
        }
    }

    override fun getItemCount(): Int =
        chapters.size

    fun updateData(newList: List<Chapter>) {
        chapters = newList
        notifyDataSetChanged()
    }
}`}
                  </pre>
                </div>
              </div>

              {/* 10. Android Activity: ChapterManagementActivity.kt */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-indigo-400" />
                    <span>10. Android Activity (ChapterManagementActivity.kt)</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const activityCode = `package com.eduai.admin

import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.eduai.R
import com.eduai.model.Chapter
import com.eduai.repository.ChapterRepository

class ChapterManagementActivity :
    AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: ChapterAdapter

    private val repository =
        ChapterRepository()

    private lateinit var subjectId: String

    override fun onCreate(savedInstanceState: Bundle?) {

        super.onCreate(savedInstanceState)

        setContentView(
            R.layout.activity_chapter_management
        )

        subjectId =
            intent.getStringExtra("subjectId") ?: ""

        val subjectName =
            intent.getStringExtra("subjectName")
                ?: "Subject"

        findViewById<TextView>(
            R.id.txtSubjectName
        ).text = subjectName

        recyclerView =
            findViewById(R.id.recyclerChapters)

        recyclerView.layoutManager =
            LinearLayoutManager(this)

        adapter = ChapterAdapter(
            emptyList(),
            onEdit = { chapter ->
                showChapterDialog(chapter)
            },
            onDelete = { chapter ->
                disableChapter(chapter)
            }
        )

        recyclerView.adapter = adapter

        findViewById<Button>(
            R.id.btnAddChapter
        ).setOnClickListener {

            showChapterDialog(null)
        }

        loadChapters()
    }

    private fun loadChapters() {

        repository.getChapters(
            subjectId,

            onSuccess = {
                adapter.updateData(it)
            },

            onError = {
                Toast.makeText(
                    this,
                    it.message,
                    Toast.LENGTH_LONG
                ).show()
            }
        )
    }

    private fun showChapterDialog(
        existingChapter: Chapter?
    ) {

        val view = layoutInflater.inflate(
            R.layout.dialog_add_chapter,
            null
        )

        val title =
            view.findViewById<EditText>(
                R.id.edtChapterTitle
            )

        val description =
            view.findViewById<EditText>(
                R.id.edtChapterDescription
            )

        val order =
            view.findViewById<EditText>(
                R.id.edtChapterOrder
            )

        existingChapter?.let {

            title.setText(it.title)
            description.setText(it.description)
            order.setText(it.order.toString())
        }

        val dialog = AlertDialog.Builder(this)
            .setTitle(
                if (existingChapter == null)
                    "Add Chapter"
                else
                    "Edit Chapter"
            )
            .setView(view)
            .setNegativeButton("Cancel", null)
            .setPositiveButton(
                if (existingChapter == null)
                    "Save"
                else
                    "Update",
                null
            )
            .create()

        dialog.setOnShowListener {

            dialog.getButton(
                AlertDialog.BUTTON_POSITIVE
            ).setOnClickListener {

                val chapterTitle =
                    title.text.toString().trim()

                val chapterDescription =
                    description.text.toString().trim()

                val chapterOrder =
                    order.text.toString()
                        .toIntOrNull()

                if (chapterTitle.isEmpty()) {
                    title.error =
                        "Enter chapter title"
                    return@setOnClickListener
                }

                if (chapterOrder == null) {
                    order.error =
                        "Enter valid order"
                    return@setOnClickListener
                }

                if (existingChapter == null) {

                    repository.addChapter(
                        subjectId,
                        chapterTitle,
                        chapterDescription,
                        chapterOrder,

                        onSuccess = {
                            dialog.dismiss()
                            loadChapters()

                            Toast.makeText(
                                this,
                                "Chapter added",
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

                } else {

                    repository.updateChapter(
                        existingChapter.id,
                        chapterTitle,
                        chapterDescription,
                        chapterOrder,

                        onSuccess = {
                            dialog.dismiss()
                            loadChapters()

                            Toast.makeText(
                                this,
                                "Chapter updated",
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
                }
            }
        }

        dialog.show()
    }

    private fun disableChapter(
        chapter: Chapter
    ) {

        AlertDialog.Builder(this)
            .setTitle("Disable Chapter")
            .setMessage(
                "Hide '\${chapter.title}' from students?"
            )
            .setNegativeButton("Cancel", null)
            .setPositiveButton("Disable") { _, _ ->

                repository.disableChapter(
                    chapter.id,

                    onSuccess = {
                        loadChapters()

                        Toast.makeText(
                            this,
                            "Chapter disabled",
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
            }
            .show()
    }
}`;
                      navigator.clipboard?.writeText(activityCode);
                      setFeedback({ type: 'success', message: 'Copied ChapterManagementActivity.kt to clipboard!' });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Activity.kt</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800/80 pb-2">
                    <span className="text-purple-400 font-bold">com/eduai/admin/ChapterManagementActivity.kt</span>
                    <span className="text-indigo-400">Kotlin Activity Class</span>
                  </div>
                  <pre className="font-mono text-xs text-indigo-300 leading-relaxed overflow-x-auto p-1 max-h-72">
{`package com.eduai.admin

import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.eduai.R
import com.eduai.model.Chapter
import com.eduai.repository.ChapterRepository

class ChapterManagementActivity :
    AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: ChapterAdapter
    private val repository = ChapterRepository()
    private lateinit var subjectId: String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_chapter_management)

        subjectId = intent.getStringExtra("subjectId") ?: ""
        val subjectName = intent.getStringExtra("subjectName") ?: "Subject"

        findViewById<TextView>(R.id.txtSubjectName).text = subjectName
        recyclerView = findViewById(R.id.recyclerChapters)
        recyclerView.layoutManager = LinearLayoutManager(this)

        adapter = ChapterAdapter(
            emptyList(),
            onEdit = { chapter -> showChapterDialog(chapter) },
            onDelete = { chapter -> disableChapter(chapter) }
        )
        recyclerView.adapter = adapter

        findViewById<Button>(R.id.btnAddChapter).setOnClickListener {
            showChapterDialog(null)
        }
        loadChapters()
    }
    // ... loadChapters(), showChapterDialog(), disableChapter()
}`}
                  </pre>
                </div>
              </div>

              {/* 11. Intent Navigation: Open Chapter Management from Subject Management */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                    <span>11. Open Chapter Management from Subject Management</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const intentCode = `// 10. Open Chapter Management from Subject Management
// When the admin clicks a subject:

val intent = Intent(
    this,
    ChapterManagementActivity::class.java
)

intent.putExtra(
    "subjectId",
    subject.id
)

intent.putExtra(
    "subjectName",
    subject.name
)

startActivity(intent)`;
                      navigator.clipboard?.writeText(intentCode);
                      setFeedback({ type: 'success', message: 'Copied Intent code snippet to clipboard!' });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Intent Code</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800/80 pb-2">
                    <span className="text-emerald-400 font-bold">SubjectManagementActivity.kt ➔ ChapterManagementActivity</span>
                    <span className="text-purple-400">Android Intent Navigation</span>
                  </div>
                  <pre className="font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto p-1 max-h-72">
{`// When the admin clicks a subject:
val intent = Intent(
    this,
    ChapterManagementActivity::class.java
)

intent.putExtra(
    "subjectId",
    subject.id
)

intent.putExtra(
    "subjectName",
    subject.name
)

startActivity(intent)`}
                  </pre>
                  <p className="text-[11px] text-slate-400 leading-normal pt-1">
                    Passes <code className="text-emerald-300 font-mono">subjectId</code> and <code className="text-emerald-300 font-mono">subjectName</code> into ChapterManagementActivity, which extracts them via <code className="text-indigo-300 font-mono">intent.getStringExtra("subjectId")</code> to query Firestore.
                  </p>
                </div>
              </div>

              {/* 12. Admin Experience Workflow (End-to-End Pipeline) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <FolderTree className="w-3.5 h-3.5 text-cyan-400" />
                    <span>12. Admin Experience Workflow</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const workflowText = `11. Admin experience

Your final workflow becomes:

ADMIN DASHBOARD
       ↓
SUBJECT MANAGEMENT
       ↓
Machine Learning
       ↓
CHAPTER MANAGEMENT
       ↓
┌─────────────────────────────────┐
│ Machine Learning                │
│                                 │
│ [+ Add Chapter]                 │
│                                 │
│ 1. Introduction to ML           │
│    Basic concepts               │
│    [Edit] [Disable]             │
│                                 │
│ 2. Linear Regression            │
│    Regression concepts          │
│    [Edit] [Disable]             │
│                                 │
│ 3. Logistic Regression           │
│    Classification               │
│    [Edit] [Disable]             │
└─────────────────────────────────┘`;
                      navigator.clipboard?.writeText(workflowText);
                      setFeedback({ type: 'success', message: 'Copied Admin Experience workflow diagram to clipboard!' });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Workflow Diagram</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800/80 pb-2">
                    <span className="text-cyan-400 font-bold">EduAI Admin Pipeline Architecture</span>
                    <span className="text-emerald-400">4-Stage End-to-End Workflow</span>
                  </div>
                  <pre className="font-mono text-xs text-cyan-300 leading-relaxed overflow-x-auto p-3 bg-slate-900/80 rounded-xl border border-slate-800">
{`ADMIN DASHBOARD
       ↓
SUBJECT MANAGEMENT
       ↓
Machine Learning
       ↓
CHAPTER MANAGEMENT
       ↓
┌─────────────────────────────────┐
│ Machine Learning                │
│                                 │
│ [+ Add Chapter]                 │
│                                 │
│ 1. Introduction to ML           │
│    Basic concepts               │
│    [Edit] [Disable]             │
│                                 │
│ 2. Linear Regression            │
│    Regression concepts          │
│    [Edit] [Disable]             │
│                                 │
│ 3. Logistic Regression           │
│    Classification               │
│    [Edit] [Disable]             │
└─────────────────────────────────┘`}
                  </pre>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    This represents the complete administrator lifecycle: transitioning from the primary <strong className="text-white">Admin Dashboard</strong> into <strong className="text-white">Subject Management</strong>, selecting <strong className="text-white">Machine Learning</strong>, and opening <strong className="text-white">Chapter Management</strong> with modular controls to Add, Edit, and Disable curriculum chapters in real-time Firestore.
                  </p>
                </div>
              </div>

              {/* 13. Student Side: Active Chapters Pipeline */}
              <div>
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                    <span>13. Student Side (Active Chapters Pipeline)</span>
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const studentFlow = `12. Student side

Students should only receive active chapters.

Machine Learning
       ↓
Chapters
       ↓
1. Introduction to ML
2. Linear Regression
3. Logistic Regression
4. Decision Trees
5. K-Means
6. Support Vector Machines (SVM)
7. Naive Bayes Classifier
8. Random Forests & Ensemble Methods
9. K-Nearest Neighbors (KNN)
10. Dimensionality Reduction & PCA
11. Neural Networks & Deep Learning
12. Model Evaluation & Hyperparameter Tuning`;
                        navigator.clipboard?.writeText(studentFlow);
                        setFeedback({ type: 'success', message: 'Copied Student Side diagram to clipboard!' });
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Student Flow</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const studentCode = `package com.eduai.student

import android.os.Bundle
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.eduai.R
import com.eduai.model.Chapter
import com.eduai.repository.ChapterRepository

class StudentChapterActivity : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: StudentChapterAdapter
    private val repository = ChapterRepository()
    private lateinit var subjectId: String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_student_chapters)

        subjectId = intent.getStringExtra("subjectId") ?: "ml001"
        val subjectName = intent.getStringExtra("subjectName") ?: "Machine Learning"

        findViewById<TextView>(R.id.txtSubjectName).text = subjectName
        recyclerView = findViewById(R.id.recyclerStudentChapters)
        recyclerView.layoutManager = LinearLayoutManager(this)

        adapter = StudentChapterAdapter(emptyList()) { chapter ->
            Toast.makeText(this, "Opening \${chapter.title}", Toast.LENGTH_SHORT).show()
        }
        recyclerView.adapter = adapter

        loadActiveChapters()
    }

    private fun loadActiveChapters() {
        repository.getChapters(
            subjectId,
            onSuccess = { activeChapters ->
                // Students should only receive active chapters
                val studentList = activeChapters.filter { it.isActive }
                adapter.updateData(studentList)
            },
            onError = {
                Toast.makeText(this, it.message, Toast.LENGTH_LONG).show()
            }
        )
    }
}`;
                        navigator.clipboard?.writeText(studentCode);
                        setFeedback({ type: 'success', message: 'Copied StudentChapterActivity.kt to clipboard!' });
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-emerald-200 dark:border-emerald-800"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Student Activity</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800/80 pb-2">
                    <span className="text-emerald-400 font-bold">Machine Learning ➔ Student Side Delivery</span>
                    <span className="text-cyan-400">whereEqualTo(&quot;isActive&quot;, true)</span>
                  </div>

                  <pre className="font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto p-3 bg-slate-900/80 rounded-xl border border-slate-800">
{`Machine Learning
       ↓
Chapters
       ↓
1. Introduction to ML
2. Linear Regression
3. Logistic Regression
4. Decision Trees
5. K-Means
6. Support Vector Machines (SVM)
7. Naive Bayes Classifier
8. Random Forests & Ensemble Methods
9. K-Nearest Neighbors (KNN)
10. Dimensionality Reduction & PCA
11. Neural Networks & Deep Learning
12. Model Evaluation & Hyperparameter Tuning`}
                  </pre>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400 uppercase font-black tracking-wider">Kotlin Firestore Query:</span>
                      <button
                        type="button"
                        onClick={() => {
                          const kotlinQuery = `FirebaseFirestore.getInstance()
    .collection("chapters")
    .whereEqualTo("subjectId", subjectId)
    .whereEqualTo("isActive", true)
    .get()`;
                          navigator.clipboard?.writeText(kotlinQuery);
                          setFeedback({ type: 'success', message: 'Copied Kotlin student query to clipboard!' });
                        }}
                        className="px-2 py-0.5 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-400/30 flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy Kotlin</span>
                      </button>
                    </div>
                    <pre className="font-mono text-xs text-emerald-400 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800 overflow-x-auto">
{`FirebaseFirestore.getInstance()
    .collection("chapters")
    .whereEqualTo("subjectId", subjectId)
    .whereEqualTo("isActive", true)
    .get()`}
                    </pre>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-normal">
                    Ensures students exclusively receive active chapters. When an administrator disables a chapter in <strong className="text-white">ChapterManagementActivity</strong>, Firestore sets <code className="text-amber-300 font-mono">isActive = false</code>, which immediately hides that unit from all student queries and client devices.
                  </p>
                </div>
              </div>

              {/* 14. Firestore Security Rules & Admin Custom Claim Architecture */}
              <div>
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>14. Production Firestore Security Rules & Admin Custom Claim</span>
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const rulesCode = `rules_version = '2';

service cloud.firestore {

    match /databases/{database}/documents {

        match /chapters/{chapterId} {

            allow read: if request.auth != null;

            allow create, update, delete:
                if request.auth != null
                && request.auth.token.admin == true;
        }
    }
}`;
                        navigator.clipboard?.writeText(rulesCode);
                        setFeedback({ type: 'success', message: 'Copied Firestore Security Rules to clipboard!' });
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-amber-200 dark:border-amber-800"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Rules</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const serverClaimCode = `// Trusted Server Environment (Firebase Admin SDK)
import * as admin from 'firebase-admin';

export async function setAdminClaim(targetUid: string) {
  // Sets cryptographically signed custom claim inside Firebase Auth token
  await admin.auth().setCustomUserClaims(targetUid, { admin: true });
}`;
                        navigator.clipboard?.writeText(serverClaimCode);
                        setFeedback({ type: 'success', message: 'Copied Server Admin Claim Script to clipboard!' });
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Server Script</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800/80 pb-2">
                    <span className="text-amber-400 font-bold">firestore.rules (Production Deployment)</span>
                    <span className="text-emerald-400">request.auth.token.admin == true</span>
                  </div>

                  <pre className="font-mono text-xs text-amber-300 leading-relaxed overflow-x-auto p-3 bg-slate-900/80 rounded-xl border border-slate-800">
{`rules_version = '2';

service cloud.firestore {

    match /databases/{database}/documents {

        match /chapters/{chapterId} {

            allow read: if request.auth != null;

            allow create, update, delete:
                if request.auth != null
                && request.auth.token.admin == true;
        }
    }
}`}
                  </pre>

                  {/* Security Notice Card */}
                  <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/60 text-xs space-y-2">
                    <div className="flex items-center gap-2 text-amber-300 font-bold">
                      <Lock className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>Critical Production Security Principle</span>
                    </div>
                    <p className="text-[11px] text-amber-200/90 leading-relaxed">
                      <strong>The admin custom claim must be assigned securely from a trusted server environment; don't let users set their own admin claim from the Android app.</strong>
                    </p>
                    <ul className="text-[11px] text-slate-300 space-y-1.5 pl-4 list-disc">
                      <li>
                        <strong>Tamper-Proof JWT:</strong> Custom claims are sealed inside the Firebase Auth JWT ID Token by Google's authentication servers. Android or web clients cannot forge or edit claims.
                      </li>
                      <li>
                        <strong>Server-Only Assignment:</strong> The <code className="text-amber-300 font-mono">admin.auth().setCustomUserClaims(uid, &#123; admin: true &#125;)</code> method requires privileged service account credentials (available only in Cloud Functions or trusted server environments).
                      </li>
                      <li>
                        <strong>Token Refresh:</strong> After server assignment, the Android app calls <code className="text-cyan-300 font-mono">user.getIdToken(true)</code> to force-refresh the ID token and read the new admin privileges.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsSchemaModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-black hover:opacity-90 transition-all cursor-pointer"
                >
                  Close Inspector
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: SINGLE CHAPTER FIRESTORE DOCUMENT JSON VIEWER                     */}
      {/* ========================================================================= */}
      {jsonModalChapter && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleUp">
            <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-indigo-400" />
                <h4 className="text-xs font-black font-mono">
                  chapters / {jsonModalChapter.id}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setJsonModalChapter(null)}
                className="p-1 rounded-full text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-bold">Firestore Document Schema Payload</span>
                <button
                  type="button"
                  onClick={() => {
                    const rawJson = JSON.stringify(
                      {
                        id: jsonModalChapter.id,
                        subjectId: jsonModalChapter.subjectId,
                        title: jsonModalChapter.title,
                        description: jsonModalChapter.description,
                        order: jsonModalChapter.order,
                        isActive: jsonModalChapter.isActive,
                        createdAt: formatTimestampDetailed(jsonModalChapter.createdAt),
                        estimatedHours: jsonModalChapter.estimatedHours,
                        topics: jsonModalChapter.topics,
                      },
                      null,
                      2
                    );
                    navigator.clipboard?.writeText(rawJson);
                    setFeedback({ type: 'success', message: 'Document JSON copied to clipboard!' });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy JSON</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto max-h-80 border border-slate-800">
                {JSON.stringify(
                  {
                    id: jsonModalChapter.id,
                    subjectId: jsonModalChapter.subjectId,
                    title: jsonModalChapter.title,
                    description: jsonModalChapter.description,
                    order: jsonModalChapter.order,
                    isActive: jsonModalChapter.isActive,
                    createdAt: formatTimestampDetailed(jsonModalChapter.createdAt),
                    estimatedHours: jsonModalChapter.estimatedHours,
                    topics: jsonModalChapter.topics,
                  },
                  null,
                  2
                )}
              </pre>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setJsonModalChapter(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
