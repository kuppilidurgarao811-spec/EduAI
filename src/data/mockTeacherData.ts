export interface TeacherLecture {
  id: string;
  title: string;
  subject: string;
  level: string;
  type: 'video' | 'pdf' | 'audio';
  durationOrPages: string;
  uploadDate: string;
  viewsCount: number;
  likesCount: number;
  description: string;
  fileUrl?: string;
  videoUrl?: string;
}

export interface TeacherAssignment {
  id: string;
  title: string;
  subject: string;
  level: string;
  dueDate: string;
  totalPoints: number;
  assignedCount: number;
  submittedCount: number;
  gradedCount: number;
  instructions: string;
  status: 'Active' | 'Closed' | 'Draft';
}

export interface StudentSubmission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  avatar: string;
  level: string;
  submittedDate: string;
  status: 'Pending Review' | 'Graded';
  studentAnswerText: string;
  attachmentName?: string;
  grade?: number;
  maxGrade: number;
  teacherFeedback?: string;
  aiSuggestedGrade?: number;
  aiFeedbackHint?: string;
}

export interface StudentDoubtMessage {
  id: string;
  studentName: string;
  studentAvatar: string;
  level: string;
  subject: string;
  topic: string;
  questionText: string;
  timeAgo: string;
  status: 'Unanswered' | 'Replied';
  replyText?: string;
}

export interface ClassAnnouncement {
  id: string;
  title: string;
  targetLevel: string;
  subject: string;
  content: string;
  postedDate: string;
  author: string;
  isImportant?: boolean;
}

export const INITIAL_TEACHER_LECTURES: TeacherLecture[] = [
  {
    id: 'lec-1',
    title: 'Class 10 Mathematics: Trigonometric Identities & Step-by-Step Proofs',
    subject: 'Mathematics',
    level: 'Class 6–10',
    type: 'video',
    durationOrPages: '28 mins',
    uploadDate: '2026-08-08',
    viewsCount: 342,
    likesCount: 89,
    description: 'Detailed proof of sin²θ + cos²θ = 1, tan²θ + 1 = sec²θ with Board exam trick questions.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  {
    id: 'lec-2',
    title: 'Download Board Exam Formula Sheet & Revision PDF',
    subject: 'Mathematics',
    level: 'Class 6–10',
    type: 'pdf',
    durationOrPages: '12 Pages PDF',
    uploadDate: '2026-08-07',
    viewsCount: 512,
    likesCount: 140,
    description: 'Consolidated formulas for Polynomials, Quadratic Equations, Surface Areas & Volumes.',
  },
  {
    id: 'lec-3',
    title: 'Intermediate Physics: Electromagnetic Induction & Lenz Law',
    subject: 'Physics',
    level: 'Intermediate (11–12)',
    type: 'video',
    durationOrPages: '35 mins',
    uploadDate: '2026-08-05',
    viewsCount: 210,
    likesCount: 64,
    description: 'Faraday laws, direction of induced current, and step-up transformer calculations.',
  },
];

export const INITIAL_TEACHER_ASSIGNMENTS: TeacherAssignment[] = [
  {
    id: 'asg-1',
    title: 'Class 10 Board Prep: Trigonometry & Heights and Distances Homework',
    subject: 'Mathematics',
    level: 'Class 6–10',
    dueDate: '2026-08-15',
    totalPoints: 50,
    assignedCount: 45,
    submittedCount: 38,
    gradedCount: 22,
    instructions: 'Solve all 10 questions attached in the worksheet. Show complete step-by-step calculations and diagram sketches.',
    status: 'Active',
  },
  {
    id: 'asg-2',
    title: 'Intermediate Physics: Numerical Problems on Electric Field & Flux',
    subject: 'Physics',
    level: 'Intermediate (11–12)',
    dueDate: '2026-08-18',
    totalPoints: 30,
    assignedCount: 35,
    submittedCount: 29,
    gradedCount: 15,
    instructions: 'Calculate electric flux using Gauss Law. Apply vector components for point charges.',
    status: 'Active',
  },
  {
    id: 'asg-3',
    title: 'Class 10 Science: Chemical Equations & Balance Quiz Worksheet',
    subject: 'Science',
    level: 'Class 6–10',
    dueDate: '2026-08-05',
    totalPoints: 20,
    assignedCount: 42,
    submittedCount: 42,
    gradedCount: 42,
    instructions: 'Balance 15 chemical redox reactions and classify combinations vs decompositions.',
    status: 'Closed',
  },
];

export const INITIAL_STUDENT_SUBMISSIONS: StudentSubmission[] = [
  {
    id: 'sub-1',
    assignmentId: 'asg-1',
    assignmentTitle: 'Class 10 Board Prep: Trigonometry & Heights and Distances Homework',
    studentId: 'st-101',
    studentName: 'K. Sai Varma',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
    level: 'Class 6–10',
    submittedDate: '2026-08-10 09:30 AM',
    status: 'Pending Review',
    studentAnswerText: 'Q1: Proven sin²θ + cos²θ = 1 using Pythagoras theorem in ΔABC. Q2: Height of tower = 50√3 meters = 86.6 meters. Q3: Angle of elevation = 45 degrees.',
    attachmentName: 'Sai_Varma_Trig_Homework.pdf',
    maxGrade: 50,
    aiSuggestedGrade: 48,
    aiFeedbackHint: 'Excellent step-by-step proofs and correct final numerical values. Minor units missing in Q4.',
  },
  {
    id: 'sub-2',
    assignmentId: 'asg-1',
    assignmentTitle: 'Class 10 Board Prep: Trigonometry & Heights and Distances Homework',
    studentId: 'st-102',
    studentName: 'P. Ananya',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    level: 'Class 6–10',
    submittedDate: '2026-08-09 08:15 PM',
    status: 'Pending Review',
    studentAnswerText: 'Q1: Verified identity. Q2: Height = 50m (Calculation error in tan60). Q3: Angle = 45 deg.',
    attachmentName: 'Ananya_Maths_Assignment.pdf',
    maxGrade: 50,
    aiSuggestedGrade: 40,
    aiFeedbackHint: 'Good attempt. Needs to re-check tan(60°) = √3 instead of 1.',
  },
  {
    id: 'sub-3',
    assignmentId: 'asg-2',
    assignmentTitle: 'Intermediate Physics: Numerical Problems on Electric Field & Flux',
    studentId: 'st-103',
    studentName: 'V. Rahul Varma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    level: 'Intermediate (11–12)',
    submittedDate: '2026-08-09 04:00 PM',
    status: 'Graded',
    studentAnswerText: 'Gauss Law Applied: Φ = Q_enclosed / ε₀. Total flux through sphere = 3.6 x 10^5 N·m²/C.',
    maxGrade: 30,
    grade: 29,
    teacherFeedback: 'Outstanding work Rahul! Flawless vector algebra and precise physical units.',
    aiSuggestedGrade: 30,
  },
];

export const INITIAL_STUDENT_DOUBTS: StudentDoubtMessage[] = [
  {
    id: 'd-1',
    studentName: 'M. Tejaswi',
    studentAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    level: 'Class 6–10',
    subject: 'Mathematics',
    topic: 'Trigonometry Exercise 8.4 Q5',
    questionText: 'Madam, in question 5(iii), how do we substitute (1 - cotθ) in terms of sinθ and cosθ? I am getting stuck in the denominator simplification.',
    timeAgo: '15 mins ago',
    status: 'Unanswered',
  },
  {
    id: 'd-2',
    studentName: 'B. Karthik',
    studentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    level: 'Intermediate (11–12)',
    subject: 'Physics',
    topic: 'Lenz Law Direction',
    questionText: 'When a magnet approaches a closed copper ring, does the ring repel or attract the magnet? Please clarify Lenz Law rule.',
    timeAgo: '2 hours ago',
    status: 'Replied',
    replyText: 'Hi Karthik! By Lenz Law, the induced current creates a magnetic pole that opposes the motion. So an approaching North pole induces a North pole on the facing side, causing REPULSION.',
  },
];

export const INITIAL_ANNOUNCEMENTS: ClassAnnouncement[] = [
  {
    id: 'anc-1',
    title: 'Class 10 Mathematics Board Mock Exam Scheduled for Friday',
    targetLevel: 'Class 6–10',
    subject: 'Mathematics',
    content: 'Dear students, a 50-mark timed mock exam on Chapters 1-8 will take place this Friday at 10:00 AM. Please revise formula sheets in the Study Materials tab.',
    postedDate: '2026-08-09',
    author: 'Dr. Anitha Rao',
    isImportant: true,
  },
  {
    id: 'anc-2',
    title: 'Special Live Doubt Resolution Session for Intermediate Physics',
    targetLevel: 'Intermediate (11–12)',
    subject: 'Physics',
    content: 'Live interactive doubt clearing session on Electrostatics & DC Circuits will be conducted tomorrow at 5:00 PM. Keep your numerical doubts ready.',
    postedDate: '2026-08-07',
    author: 'Dr. Anitha Rao',
  },
];
