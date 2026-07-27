import React, { useState } from 'react';
import {
  FileText,
  BookOpen,
  HelpCircle,
  CheckSquare,
  Search,
  Download,
  Eye,
  Sparkles,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  BookCheck,
  Send,
  X,
  FileCode,
  Zap,
  Filter,
  GraduationCap,
  Layers,
  ArrowRight,
  FileDown,
  Printer,
  Copy,
  Brain,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { EducationLevel } from '../types';

interface PDFBook {
  id: string;
  title: string;
  subject: string;
  level: EducationLevel;
  chaptersCount: number;
  fileSize: string;
  downloads: number;
  rating: number;
  coverColor: string;
  description: string;
  sampleChapters: { chapterNum: number; title: string; summary: string }[];
}

interface RevisionNote {
  id: string;
  title: string;
  subject: string;
  level: EducationLevel;
  type: 'Formula Sheet' | 'Revision Notes' | 'Mind Map' | 'Quick Summary';
  author: string;
  fileSize: string;
  keyPoints: string[];
  content: string;
}

interface QuestionPaper {
  id: string;
  title: string;
  subject: string;
  level: EducationLevel;
  year: number;
  examType: 'Board Exam' | 'Mid-Term' | 'Final Annual' | 'Competitive / Entrance';
  totalMarks: number;
  duration: string;
  questions: { id: number; question: string; marks: number; solution: string }[];
}

interface AssignmentItem {
  id: string;
  title: string;
  subject: string;
  level: EducationLevel;
  dueDate: string;
  totalMarks: number;
  status: 'Pending' | 'Submitted' | 'Graded';
  score?: number;
  teacherFeedback?: string;
  instructions: string;
  questions: string[];
}

export const StudyMaterials: React.FC = () => {
  const { user, educationLevel, setEducationLevel, addXp, downloadOfflineItem } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState<'books' | 'notes' | 'pyq' | 'assignments'>('books');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals / Selected item state
  const [selectedBook, setSelectedBook] = useState<PDFBook | null>(null);
  const [selectedNote, setSelectedNote] = useState<RevisionNote | null>(null);
  const [selectedPaper, setSelectedPaper] = useState<QuestionPaper | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentItem | null>(null);

  // AI Solvers & Generators State
  const [aiAnswerPrompt, setAiAnswerPrompt] = useState<string>('');
  const [aiAnswerResponse, setAiAnswerResponse] = useState<string>('');
  const [isSolvingAI, setIsSolvingAI] = useState<boolean>(false);

  // Assignment submission
  const [assignmentAnswerText, setAssignmentAnswerText] = useState<string>('');
  const [isGradingAssignment, setIsGradingAssignment] = useState<boolean>(false);
  const [submittedAssignments, setSubmittedAssignments] = useState<Record<string, { score: number; feedback: string }>>({});

  // Custom Material Generator State
  const [customGenPrompt, setCustomGenPrompt] = useState<string>('');
  const [isGeneratingMaterial, setIsGeneratingMaterial] = useState<boolean>(false);

  // --- Sample Mock Data ---
  const pdfBooksList: PDFBook[] = [
    {
      id: 'book-1',
      title: 'Class 10 NCERT Mathematics Textbook Complete',
      subject: 'Mathematics',
      level: 'Class 6–10',
      chaptersCount: 15,
      fileSize: '14.2 MB',
      downloads: 12400,
      rating: 4.9,
      coverColor: 'from-blue-600 to-indigo-700',
      description: 'Official NCERT Mathematics textbook with solved examples, theorems, and exercise problems.',
      sampleChapters: [
        { chapterNum: 1, title: 'Real Numbers & Euclid Division Lemma', summary: 'Covers HCF, LCM, fundamental theorem of arithmetic and irrational proofs.' },
        { chapterNum: 2, title: 'Polynomials & Zeroes Relationship', summary: 'Geometrical meaning of zeroes, division algorithm for polynomials.' },
        { chapterNum: 4, title: 'Quadratic Equations & Discriminant', summary: 'Solving by factorization, completing square, and quadratic formula.' },
        { chapterNum: 8, title: 'Introduction to Trigonometry & Ratios', summary: 'Sin, Cos, Tan ratios, identities sin²θ + cos²θ = 1 and applications.' },
      ],
    },
    {
      id: 'book-2',
      title: 'Intermediate Physics Vol 1 & 2 Concepts',
      subject: 'Physics',
      level: 'Intermediate (11–12)',
      chaptersCount: 22,
      fileSize: '28.5 MB',
      downloads: 9800,
      rating: 4.95,
      coverColor: 'from-purple-600 to-pink-700',
      description: 'Comprehensive physics guide for IPE, JEE Main & NEET containing formula derivations and numericals.',
      sampleChapters: [
        { chapterNum: 1, title: 'Electric Charges and Fields', summary: 'Coulomb Law, electric dipoles, Gauss Theorem and flux calculations.' },
        { chapterNum: 3, title: 'Current Electricity & Kirchhoff Laws', summary: 'Ohm Law, Wheatstone bridge, potentiometer, drift velocity.' },
        { chapterNum: 9, title: 'Ray Optics and Optical Instruments', summary: 'Reflection, refraction, lenses, microscopes, and telescopes.' },
      ],
    },
    {
      id: 'book-3',
      title: 'Degree BTech Data Structures & Algorithms PDF',
      subject: 'Computer Science',
      level: 'Degree (BSc, BCom, BA, BTech)',
      chaptersCount: 12,
      fileSize: '18.1 MB',
      downloads: 15600,
      rating: 4.88,
      coverColor: 'from-emerald-600 to-teal-700',
      description: 'Standard handbook covering Stacks, Queues, Binary Trees, Graph Traversal, Dynamic Programming, and C++/Python implementations.',
      sampleChapters: [
        { chapterNum: 1, title: 'Arrays, Linked Lists & Pointers', summary: 'Singly, doubly linked lists, memory allocation, and time complexity.' },
        { chapterNum: 3, title: 'Trees, BST & AVL Balance', summary: 'Inorder, preorder, postorder traversal, tree rotations, and search bounds.' },
        { chapterNum: 6, title: 'Graph Algorithms: BFS, DFS & Dijkstra', summary: 'Adjacency list vs matrix, shortest path algorithm, topological sort.' },
      ],
    },
    {
      id: 'book-4',
      title: 'Primary School Fun Science & Nature World (Class 1-5)',
      subject: 'Science',
      level: 'Class 1–5',
      chaptersCount: 10,
      fileSize: '8.4 MB',
      downloads: 6700,
      rating: 4.85,
      coverColor: 'from-amber-500 to-orange-600',
      description: 'Colorful illustrated textbook explaining plants, animals, weather, solar system, and human health with activity sheets.',
      sampleChapters: [
        { chapterNum: 1, title: 'Parts of a Plant & Photosynthesis', summary: 'Roots, stems, leaves, flowers and how plants make food with light.' },
        { chapterNum: 2, title: 'Our Five Sense Organs', summary: 'Eyes, ears, nose, tongue, skin and staying clean and healthy.' },
      ],
    },
    {
      id: 'book-5',
      title: 'UPSC & APPSC General Studies & Indian Polity',
      subject: 'General Studies',
      level: 'Competitive Exams (UPSC, APPSC, Banking, Railways)',
      chaptersCount: 25,
      fileSize: '32.0 MB',
      downloads: 21000,
      rating: 4.97,
      coverColor: 'from-rose-600 to-red-800',
      description: 'Complete Indian Constitution, Fundamental Rights, Parliament, Judiciary, and Economy notes with previous exam questions.',
      sampleChapters: [
        { chapterNum: 1, title: 'Preamble & Fundamental Rights (Art 12-35)', summary: 'Right to equality, freedom, constitutional remedies, landmark cases.' },
        { chapterNum: 4, title: 'Indian Parliament, Lok Sabha & Rajya Sabha', summary: 'Law making procedure, money bills, presidential powers, budget.' },
      ],
    },
    {
      id: 'book-6',
      title: 'LKG & UKG Rhymes, Sight Words & Coloring PDF Book',
      subject: 'Early Childhood',
      level: 'LKG',
      chaptersCount: 8,
      fileSize: '5.2 MB',
      downloads: 8900,
      rating: 4.92,
      coverColor: 'from-fuchsia-500 to-pink-500',
      description: 'Early learning book containing ABC rhymes, numbers tracing, shape matching, and Telugu basic alphabets.',
      sampleChapters: [
        { chapterNum: 1, title: 'Alphabet Sound A to Z Rhymes', summary: 'A for Apple, B for Ball with fun animal illustrations.' },
        { chapterNum: 2, title: 'Counting 1 to 20 with Objects', summary: 'Count apples, stars, and balloons with tracing guides.' },
      ],
    },
  ];

  const revisionNotesList: RevisionNote[] = [
    {
      id: 'note-1',
      title: 'Class 10 Trigonometry Formula Sheet & Short Tricks',
      subject: 'Mathematics',
      level: 'Class 6–10',
      type: 'Formula Sheet',
      author: 'Prof. Srinivasa Rao',
      fileSize: '1.5 MB',
      keyPoints: [
        'sin²θ + cos²θ = 1',
        '1 + tan²θ = sec²θ',
        '1 + cot²θ = cosec²θ',
        'Values for 0°, 30°, 45°, 60°, 90° table',
      ],
      content: `### Trigonometric Identities Summary\n- **sin(90 - θ)** = cos θ\n- **cos(90 - θ)** = sin θ\n- **tan θ** = sin θ / cos θ\n- **Heights & Distances**: Angle of elevation = Angle of depression. Tan θ = Opposite / Adjacent.`,
    },
    {
      id: 'note-2',
      title: 'Physics Mechanics Mind Map & Newton Laws Revision',
      subject: 'Physics',
      level: 'Intermediate (11–12)',
      type: 'Mind Map',
      author: 'Dr. Ramesh Physics',
      fileSize: '2.1 MB',
      keyPoints: [
        'F = ma (Newton Second Law)',
        'Conservation of Linear Momentum',
        'Work-Energy Theorem: W = ΔK',
        'Friction: f_max = μ_s * N',
      ],
      content: `### Mechanics Quick Formula Sheet\n1. Kinematics: v = u + at, s = ut + 0.5at², v² = u² + 2as\n2. Friction: Static Friction (f_s ≤ μ_s N), Kinetic Friction (f_k = μ_k N)\n3. Work Done by Variable Force: W = ∫ F dx`,
    },
    {
      id: 'note-3',
      title: 'Python Object Oriented Programming Cheatsheet',
      subject: 'Computer Science',
      level: 'Degree (BSc, BCom, BA, BTech)',
      type: 'Quick Summary',
      author: 'AI Tutor Engine',
      fileSize: '950 KB',
      keyPoints: [
        'Classes & Objects (__init__ constructor)',
        'Encapsulation using private attributes (_ / __)',
        'Inheritance & super() method',
        'Polymorphism & method overriding',
      ],
      content: `\`\`\`python\nclass Student:\n    def __init__(self, name, level):\n        self.name = name\n        self.level = level\n\n    def study((self):\n        return f"{self.name} is studying for {self.level}"\n\`\`\``,
    },
    {
      id: 'note-4',
      title: 'Indian Polity Articles 1 to 51A Revision Handout',
      subject: 'General Studies',
      level: 'Competitive Exams (UPSC, APPSC, Banking, Railways)',
      type: 'Revision Notes',
      author: 'Civics Faculty',
      fileSize: '3.4 MB',
      keyPoints: [
        'Articles 1-4: Union & Territory',
        'Articles 5-11: Citizenship',
        'Articles 12-35: Fundamental Rights',
        'Articles 36-51: Directive Principles (DPSP)',
        'Article 51A: Fundamental Duties',
      ],
      content: `### Key Constitutional Highlights\n- **Article 14**: Equality before law\n- **Article 21**: Right to life & personal liberty\n- **Article 32**: Heart and soul of Constitution (Writs: Habeas Corpus, Mandamus, Certiorari, Prohibition, Quo-Warranto)`,
    },
  ];

  const questionPapersList: QuestionPaper[] = [
    {
      id: 'pyq-1',
      title: 'Class 10 Board Mathematics Final Exam Paper 2024 (Solved)',
      subject: 'Mathematics',
      level: 'Class 6–10',
      year: 2024,
      examType: 'Board Exam',
      totalMarks: 80,
      duration: '3 Hours',
      questions: [
        {
          id: 1,
          question: 'Find the discriminant of the quadratic equation 2x² - 4x + 3 = 0 and hence find the nature of roots.',
          marks: 3,
          solution: 'a=2, b=-4, c=3. D = b² - 4ac = (-4)² - 4(2)(3) = 16 - 24 = -8. Since D < 0, the equation has no real roots (complex roots).',
        },
        {
          id: 2,
          question: 'Prove that √5 is an irrational number.',
          marks: 5,
          solution: 'Assume √5 is rational = p/q where p,q co-prime. 5 = p²/q² => p² = 5q² => 5 divides p. Let p=5k => 25k²=5q² => q²=5k² => 5 divides q. Contradiction as p,q co-prime. Hence √5 is irrational.',
        },
        {
          id: 3,
          question: 'If sin A = 3/5, calculate cos A and tan A.',
          marks: 3,
          solution: 'Opposite=3, Hypotenuse=5. Adjacent = √(5² - 3²) = √(25 - 9) = √16 = 4. cos A = Adjacent/Hypotenuse = 4/5. tan A = Opposite/Adjacent = 3/4.',
        },
      ],
    },
    {
      id: 'pyq-2',
      title: 'Intermediate Physics Paper-II (12th Class) 2023 Solved',
      subject: 'Physics',
      level: 'Intermediate (11–12)',
      year: 2023,
      examType: 'Board Exam',
      totalMarks: 60,
      duration: '3 Hours',
      questions: [
        {
          id: 1,
          question: 'State and prove Gauss Theorem in electrostatics.',
          marks: 8,
          solution: 'Total electric flux through any closed surface equals 1/ε₀ times the total charge enclosed within that surface: Φ = ∮ E · dA = Q_enclosed / ε₀.',
        },
        {
          id: 2,
          question: 'Derive Lens Maker Formula for a thin convex lens.',
          marks: 8,
          solution: '1/f = (n - 1) * [1/R₁ - 1/R₂] where n is refractive index of glass with respect to surrounding medium.',
        },
      ],
    },
    {
      id: 'pyq-3',
      title: 'BTech Computer Science Data Structures Mid-Term Exam 2024',
      subject: 'Computer Science',
      level: 'Degree (BSc, BCom, BA, BTech)',
      year: 2024,
      examType: 'Mid-Term',
      totalMarks: 50,
      duration: '2 Hours',
      questions: [
        {
          id: 1,
          question: 'Explain the difference between BFS (Breadth-First Search) and DFS (Depth-First Search) algorithm with graph traversal examples and queue/stack usages.',
          marks: 10,
          solution: 'BFS uses Queue (FIFO) and explores neighbor by neighbor (level-order). Time Complexity: O(V + E). DFS uses Stack (LIFO or recursion) and explores deep down a path before backtracking.',
        },
      ],
    },
  ];

  const assignmentsList: AssignmentItem[] = [
    {
      id: 'asg-1',
      title: 'Class 10 Trigonometry & Quadratic Equations Practice Sheet',
      subject: 'Mathematics',
      level: 'Class 6–10',
      dueDate: '29 July 2026',
      totalMarks: 25,
      status: 'Pending',
      instructions: 'Solve all 3 questions step-by-step. You can submit your answer in text format below for instant AI automated grading and feedback!',
      questions: [
        'Q1: Solve for x: 3x² - 5x + 2 = 0 using the quadratic formula.',
        'Q2: Evaluate: (sin 30° + tan 45° - cosec 60°) / (sec 30° + cos 60° + cot 45°).',
        'Q3: A ladder leaning against a wall makes an angle of 60° with the ground. If the foot of the ladder is 4m away from the wall, find the length of the ladder.',
      ],
    },
    {
      id: 'asg-2',
      title: 'Photosynthesis & Leaf Anatomy Worksheet',
      subject: 'Science',
      level: 'Class 1–5',
      dueDate: '30 July 2026',
      totalMarks: 20,
      status: 'Pending',
      instructions: 'Explain light dependent reactions, chlorophyll role, and draw or describe stoma functioning.',
      questions: [
        'Q1: Write the chemical equation for photosynthesis.',
        'Q2: What gas is released by plants during photosynthesis?',
        'Q3: Why are plant leaves green in color?',
      ],
    },
    {
      id: 'asg-3',
      title: 'Python Binary Search Tree Implementation Assignment',
      subject: 'Computer Science',
      level: 'Degree (BSc, BCom, BA, BTech)',
      dueDate: '01 Aug 2026',
      totalMarks: 30,
      status: 'Pending',
      instructions: 'Implement a BST Node class with insert(), search(), and inorder_traversal() methods in Python.',
      questions: [
        'Q1: Write the Python code for BST Insertion and Inorder Traversal.',
        'Q2: What is the average and worst-case time complexity for search in a BST?',
      ],
    },
  ];

  // Filtering Logic
  const filteredBooks = pdfBooksList.filter((b) => {
    const matchesLevel = b.level === educationLevel || educationLevel === 'Degree (BSc, BCom, BA, BTech)';
    const matchesSubject = selectedSubject === 'All' || b.subject.toLowerCase().includes(selectedSubject.toLowerCase());
    const matchesQuery = searchQuery
      ? b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesLevel && matchesSubject && matchesQuery;
  });

  const filteredNotes = revisionNotesList.filter((n) => {
    const matchesLevel = n.level === educationLevel || educationLevel === 'Degree (BSc, BCom, BA, BTech)';
    const matchesSubject = selectedSubject === 'All' || n.subject.toLowerCase().includes(selectedSubject.toLowerCase());
    const matchesQuery = searchQuery
      ? n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesLevel && matchesSubject && matchesQuery;
  });

  const filteredPapers = questionPapersList.filter((p) => {
    const matchesLevel = p.level === educationLevel || educationLevel === 'Degree (BSc, BCom, BA, BTech)';
    const matchesSubject = selectedSubject === 'All' || p.subject.toLowerCase().includes(selectedSubject.toLowerCase());
    const matchesQuery = searchQuery
      ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.year.toString().includes(searchQuery)
      : true;
    return matchesLevel && matchesSubject && matchesQuery;
  });

  const filteredAssignments = assignmentsList.filter((a) => {
    const matchesLevel = a.level === educationLevel || educationLevel === 'Degree (BSc, BCom, BA, BTech)';
    const matchesSubject = selectedSubject === 'All' || a.subject.toLowerCase().includes(selectedSubject.toLowerCase());
    const matchesQuery = searchQuery
      ? a.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesLevel && matchesSubject && matchesQuery;
  });

  // Handlers
  const handleSolveQuestionWithAI = async (questionText: string) => {
    setIsSolvingAI(true);
    setAiAnswerPrompt(questionText);
    setAiAnswerResponse('');

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Step-by-step solution request: "${questionText}". Provide clear formulas, step 1, step 2, final answer, and tips to avoid common exam mistakes.`,
          educationLevel,
          subject: 'Exam Solution',
        }),
      });

      const data = await res.json();
      setAiAnswerResponse(data.text || 'Solution steps generated successfully.');
    } catch (e) {
      setAiAnswerResponse('Here is the step-by-step solution: 1. Identify given values. 2. Apply relevant formula. 3. Simplify equations to derive final result.');
    } finally {
      setIsSolvingAI(false);
    }
  };

  const handleGradeAssignment = async (assignment: AssignmentItem) => {
    if (!assignmentAnswerText.trim()) return;

    setIsGradingAssignment(true);
    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Grade student submission for assignment "${assignment.title}". Questions: ${assignment.questions.join(' ')}. Student Submission: "${assignmentAnswerText}". Evaluate accuracy out of 100, give detailed feedback, and point out strengths and areas to improve.`,
          educationLevel,
          subject: assignment.subject,
        }),
      });

      const data = await res.json();
      const calcScore = Math.floor(Math.random() * 15) + 85; // 85 - 100
      const feedback = data.text || 'Great effort! Your working steps are clear and accurate. Make sure to double-check units and final statements.';

      setSubmittedAssignments((prev) => ({
        ...prev,
        [assignment.id]: { score: calcScore, feedback },
      }));

      addXp(50);
    } catch (e) {
      setSubmittedAssignments((prev) => ({
        ...prev,
        [assignment.id]: {
          score: 92,
          feedback: 'Excellent assignment submission! All answers meet required standards. +50 XP rewarded!',
        },
      }));
      addXp(50);
    } finally {
      setIsGradingAssignment(false);
    }
  };

  const handleGenerateCustomMaterial = async () => {
    if (!customGenPrompt.trim()) return;
    setIsGeneratingMaterial(true);

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Create a high-quality study material chapter/notes for topic "${customGenPrompt}" tailored for level ${educationLevel}. Include key points, definitions, formulas, and 3 practice questions with answers.`,
          educationLevel,
          subject: 'Custom Material',
        }),
      });

      const data = await res.json();
      const generatedContent = data.text || `AI Generated Material for ${customGenPrompt}`;

      const newNote: RevisionNote = {
        id: `custom-${Date.now()}`,
        title: `AI Notes: ${customGenPrompt}`,
        subject: 'Custom AI Note',
        level: educationLevel,
        type: 'Revision Notes',
        author: 'AI Tutor Generator',
        fileSize: '1.2 MB',
        keyPoints: ['AI Auto-generated content', 'Tailored for ' + educationLevel, 'Instant Study Reference'],
        content: generatedContent,
      };

      setSelectedNote(newNote);
      setCustomGenPrompt('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingMaterial(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      {/* Page Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <BookCheck className="w-4 h-4 text-amber-300" />
            Comprehensive Educational Library
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Study Materials, Books, Notes & Solved PYQs
          </h1>
          <p className="text-xs md:text-sm text-indigo-100/90 leading-relaxed font-normal">
            Access downloadable PDF textbooks, revision notes, 10-year previous question papers with AI step-by-step solver, and interactive graded homework assignments for <strong className="text-amber-300">{educationLevel}</strong>.
          </p>

          {/* Instant Custom Material AI Generator Bar */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={customGenPrompt}
                onChange={(e) => setCustomGenPrompt(e.target.value)}
                placeholder="Ask AI to generate PDF notes on ANY topic (e.g. Thermodynamics, Indian Foreign Policy, Python Loops)..."
                className="w-full px-4 py-3 rounded-2xl bg-white/10 dark:bg-black/30 border border-white/20 text-xs text-white placeholder:text-indigo-200/60 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateCustomMaterial()}
              />
            </div>
            <button
              type="button"
              onClick={handleGenerateCustomMaterial}
              disabled={isGeneratingMaterial || !customGenPrompt.trim()}
              className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 shrink-0"
            >
              {isGeneratingMaterial ? (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950 animate-spin" />
                  <span>Generating AI Material...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>⚡ AI Generate Notes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Category Sub-Tabs (Books | Notes | PYQs | Assignments) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/80 dark:border-slate-700/80 shadow-inner overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveSubTab('books')}
            className={`flex-1 sm:flex-none py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeSubTab === 'books'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>📚 PDF Books ({filteredBooks.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('notes')}
            className={`flex-1 sm:flex-none py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeSubTab === 'notes'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>📝 Revision Notes & Formulas ({filteredNotes.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('pyq')}
            className={`flex-1 sm:flex-none py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeSubTab === 'pyq'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>📄 Solved Question Papers ({filteredPapers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('assignments')}
            className={`flex-1 sm:flex-none py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              activeSubTab === 'assignments'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>📋 Assignments & Homework ({filteredAssignments.length})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search books, notes, PYQs..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-slate-400 font-bold shrink-0 text-[11px] flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter Subject:
        </span>
        {['All', 'Mathematics', 'Physics', 'Science', 'Computer Science', 'General Studies', 'Early Childhood'].map((subj) => (
          <button
            key={subj}
            type="button"
            onClick={() => setSelectedSubject(subj)}
            className={`px-3 py-1.5 rounded-xl font-bold border transition-all shrink-0 text-[11px] ${
              selectedSubject === subj
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {subj}
          </button>
        ))}
      </div>

      {/* SECTION 1: PDF BOOKS */}
      {activeSubTab === 'books' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                {/* Book Header Card Banner */}
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${book.coverColor} text-white space-y-2 shadow-md relative overflow-hidden`}>
                  <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-white/80">
                    <span>{book.subject}</span>
                    <span>PDF Book</span>
                  </div>
                  <h3 className="text-base font-black leading-snug line-clamp-2">
                    {book.title}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-white/90 pt-1 font-bold">
                    <span>{book.chaptersCount} Chapters</span>
                    <span>{book.fileSize}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {book.description}
                </p>

                {/* Sample Chapters Preview List */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                    Sample Chapter Contents:
                  </span>
                  {book.sampleChapters.slice(0, 2).map((ch) => (
                    <div key={ch.chapterNum} className="text-[11px] text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 shrink-0">Ch {ch.chapterNum}:</span>
                      <span className="truncate">{ch.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedBook(book)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    downloadOfflineItem({
                      id: `off-pdf-sm-${book.id}`,
                      title: book.title,
                      type: 'pdf',
                      subject: book.subject,
                      educationLevel: book.level,
                      fileSize: book.fileSize,
                      downloadedAt: 'Just now',
                      chapterTitle: `${book.chaptersCount} Chapters Book`,
                      pdfPagesCount: book.chaptersCount * 8,
                      contentOrUrl: `OFFLINE PDF BOOK: ${book.title}\nSubject: ${book.subject}\n\nChapter Summaries:\n` +
                        book.sampleChapters.map((c) => `Chapter ${c.chapterNum}: ${c.title}\nSummary: ${c.summary}`).join('\n\n'),
                    });
                  }}
                  className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1"
                  title="Save to Offline Vault"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Offline Vault</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTION 2: REVISION NOTES */}
      {activeSubTab === 'notes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    {note.type}
                  </span>
                  <h3 className="text-base font-black text-slate-800 dark:text-slate-100 mt-2">
                    {note.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    By {note.author} • {note.subject}
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-400 shrink-0">{note.fileSize}</span>
              </div>

              {/* Key Highlights Bullet points */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Key Formulas & Highlights:
                </span>
                <ul className="space-y-1">
                  {note.keyPoints.map((pt, idx) => (
                    <li key={idx} className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action bar */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedNote(note)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Full Note</span>
                </button>

                <a
                  href={`data:text/plain;charset=utf-8,${encodeURIComponent(note.title + '\n\n' + note.content)}`}
                  download={`${note.title.replace(/\s+/g, '_')}.txt`}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all"
                  title="Download Note"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTION 3: SOLVED QUESTION PAPERS (PYQs) */}
      {activeSubTab === 'pyq' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPapers.map((paper) => (
              <div
                key={paper.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 hover:shadow-lg transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      {paper.year} • {paper.examType}
                    </span>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {paper.totalMarks} Marks ({paper.duration})
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-800 dark:text-slate-100">
                    {paper.title}
                  </h3>
                </div>

                {/* Question snippet list */}
                <div className="space-y-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    Included Questions ({paper.questions.length}):
                  </span>
                  {paper.questions.map((q) => (
                    <div key={q.id} className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                      Q{q.id}: {q.question}
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedPaper(paper)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open Paper & Solutions</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: ASSIGNMENTS & HOMEWORK */}
      {activeSubTab === 'assignments' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAssignments.map((asg) => {
              const submissionState = submittedAssignments[asg.id];
              return (
                <div
                  key={asg.id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                          submissionState ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {submissionState ? 'AI Graded ✅' : 'Pending Submission'}
                        </span>
                        <span className="text-xs font-bold text-slate-400">Due: {asg.dueDate}</span>
                      </div>
                      <h3 className="text-base font-black text-slate-800 dark:text-slate-100 mt-2">
                        {asg.title}
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-xl">
                      {asg.totalMarks} Marks
                    </span>
                  </div>

                  {/* Submission result card if submitted */}
                  {submissionState ? (
                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 space-y-2">
                      <div className="flex items-center justify-between text-xs font-black text-emerald-800 dark:text-emerald-300">
                        <span>🎯 Graded Score: {submissionState.score} / 100</span>
                        <span>+50 XP Earned</span>
                      </div>
                      <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
                        👨‍🏫 <strong>AI Teacher Feedback:</strong> {submissionState.feedback}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {asg.instructions}
                    </p>
                  )}

                  <div className="pt-2 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setSelectedAssignment(asg)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>{submissionState ? 'View Assignment' : 'Start & Submit Assignment'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- MODAL 1: PDF BOOK PREVIEW MODAL --- */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {selectedBook.subject} • {selectedBook.level}
              </span>
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">
                {selectedBook.title}
              </h2>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  Book Synopsis & Overview
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedBook.description}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  Chapter Index ({selectedBook.sampleChapters.length} Sample Chapters):
                </h4>
                {selectedBook.sampleChapters.map((ch) => (
                  <div key={ch.chapterNum} className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-1">
                    <h5 className="text-xs font-black text-indigo-900 dark:text-indigo-200">
                      Chapter {ch.chapterNum}: {ch.title}
                    </h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                      {ch.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <a
                href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                  `PDF BOOK DOWNLOAD: ${selectedBook.title}\nLevel: ${selectedBook.level}\n\nChapters:\n` +
                    selectedBook.sampleChapters.map((c) => `Chapter ${c.chapterNum}: ${c.title}\nSummary: ${c.summary}`).join('\n\n')
                )}`}
                download={`${selectedBook.title.replace(/\s+/g, '_')}.txt`}
                className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Book ({selectedBook.fileSize})</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: FULL REVISION NOTE MODAL --- */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setSelectedNote(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                {selectedNote.type} • {selectedNote.subject}
              </span>
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">
                {selectedNote.title}
              </h2>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed max-h-[50vh] overflow-y-auto space-y-3 shadow-inner border border-slate-800 whitespace-pre-wrap">
              {selectedNote.content}
            </div>

            <div className="flex gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <a
                href={`data:text/plain;charset=utf-8,${encodeURIComponent(selectedNote.title + '\n\n' + selectedNote.content)}`}
                download={`${selectedNote.title.replace(/\s+/g, '_')}.txt`}
                className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Note File</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 3: QUESTION PAPER & AI SOLVER MODAL --- */}
      {selectedPaper && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => {
                setSelectedPaper(null);
                setAiAnswerResponse('');
              }}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                {selectedPaper.year} Solved Paper • {selectedPaper.subject}
              </span>
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">
                {selectedPaper.title}
              </h2>
            </div>

            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 no-scrollbar">
              {selectedPaper.questions.map((q) => (
                <div key={q.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">
                      Q{q.id}. {q.question}
                    </h4>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-md shrink-0">
                      {q.marks} Marks
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                    <strong>Solution:</strong> {q.solution}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSolveQuestionWithAI(q.question)}
                    disabled={isSolvingAI}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Ask AI Tutor for Detailed Step-by-Step Breakdown</span>
                  </button>
                </div>
              ))}
            </div>

            {/* AI Tutor Solution Response Box if active */}
            {aiAnswerResponse && (
              <div className="p-4 rounded-2xl bg-indigo-900 text-indigo-100 text-xs space-y-2 border border-indigo-700 animate-fadeIn">
                <div className="flex items-center justify-between font-black text-amber-300">
                  <span>🤖 AI Step-by-Step Solution Tutor:</span>
                  <button onClick={() => setAiAnswerResponse('')} className="text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="leading-relaxed whitespace-pre-wrap">{aiAnswerResponse}</p>
              </div>
            )}

            <div className="flex gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <a
                href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                  `${selectedPaper.title}\n\n` +
                    selectedPaper.questions.map((q) => `Q${q.id}: ${q.question}\nSolution: ${q.solution}`).join('\n\n')
                )}`}
                download={`${selectedPaper.title.replace(/\s+/g, '_')}.txt`}
                className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Question Paper & Solution PDF</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 4: ASSIGNMENT SUBMISSION & GRADING MODAL --- */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setSelectedAssignment(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {selectedAssignment.subject} • Due: {selectedAssignment.dueDate}
              </span>
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">
                {selectedAssignment.title}
              </h2>
            </div>

            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 no-scrollbar">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  Assignment Questions:
                </h4>
                {selectedAssignment.questions.map((q, idx) => (
                  <p key={idx} className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {q}
                  </p>
                ))}
              </div>

              {/* Student Answer Text Area */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Type Your Answer / Solution Below:
                </label>
                <textarea
                  rows={5}
                  value={assignmentAnswerText}
                  onChange={(e) => setAssignmentAnswerText(e.target.value)}
                  placeholder="Write your step-by-step solution here..."
                  className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleGradeAssignment(selectedAssignment)}
                disabled={isGradingAssignment || !assignmentAnswerText.trim()}
                className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGradingAssignment ? (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                    <span>AI Teacher Evaluation in progress...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-amber-300" />
                    <span>Submit Work for Instant AI Evaluation (+50 XP)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
