export interface SubjectDocument {
  id?: string;
  name: string;
  level: string;
  class?: string;
  course?: string;
  semester?: number;
  language: Language | string;
  description?: string;
  icon?: string;
  isActive: boolean;
}

export interface FirestoreSubject {
  id: string;
  name: string;
  educationLevel: string;
  courseClass: string;
  semester?: string;
  description: string;
  icon?: string;
  language?: string;
  chapters?: Array<{
    id: string;
    title: string;
    description?: string;
  }>;
  lessons?: Array<{
    id: string;
    title: string;
    durationMinutes?: number;
    summary?: string;
  }>;
  videos?: Array<{
    id: string;
    title: string;
    url: string;
    durationMinutes?: number;
  }>;
  pdfs?: Array<{
    id: string;
    title: string;
    url: string;
    sizeMb?: string;
  }>;
  quizQuestions?: Array<{
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }>;
}

export interface ChapterDocument {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  order: number;
  isActive: boolean;
  createdAt?: any; // Firestore Timestamp | ISO string | FieldValue
  updatedAt?: any;
  subjectName?: string;
  estimatedHours?: number;
  topics?: string[];
  lessonCount?: number;
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
  language?: string;
  order?: number;
  displayOrder?: number;
  isActive: boolean;
  createdAt?: string;
  createdBy?: string;
  icon?: string;
  chapters?: any[];
  lessons?: any[];
  videos?: any[];
  pdfs?: any[];
  quizQuestions?: any[];
}

export type UserRole = 'student' | 'teacher' | 'parent' | 'admin';

export type EducationLevel =
  | 'LKG'
  | 'UKG'
  | 'Primary School'
  | 'Class 1–5'
  | 'High School'
  | 'Class 6–10'
  | 'Intermediate'
  | 'Intermediate (11–12)'
  | 'Degree'
  | 'Degree (BSc, BCom, BA, BTech)'
  | 'Diploma'
  | 'Competitive Exams (UPSC, APPSC, Banking, Railways)';

export type Language =
  | 'English'
  | 'Telugu'
  | 'Hindi'
  | 'Tamil'
  | 'Kannada'
  | 'Malayalam'
  | 'Marathi'
  | 'Bengali'
  | 'Gujarati'
  | 'Odia'
  | 'Punjabi'
  | 'Urdu';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  role: UserRole;
  avatar: string;
  educationLevel: EducationLevel;
  streak: number;
  xp: number;
  badges: string[]; // Badge IDs
  certificates: Certificate[];
  activeCourseId?: string;
  savedBookmarks: string[];
  isPremium?: boolean;
  subscriptionPlan?: 'Free' | 'Pro Monthly' | 'Ultra Annual';
  dailyAiMessagesCount?: number;
  maxDailyAiMessages?: number;
}

export interface Certificate {
  id: string;
  title: string;
  issueDate: string;
  score: number;
  level: string;
  downloadUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  attachments?: {
    type: 'image' | 'pdf' | 'audio';
    url: string;
    name?: string;
  }[];
  subject?: string;
  level?: string;
  isAudioPlaying?: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'pdf' | 'quiz' | 'interactive';
  contentUrl?: string;
  pdfNotesUrl?: string;
  summary?: string;
  completed?: boolean;
}

export interface Course {
  id: string;
  title: string;
  level: EducationLevel;
  subject: string;
  description: string;
  thumbnail: string;
  modules: CourseModule[];
  pdfCount: number;
  videoCount: number;
  enrolledCount: number;
  rating: number;
  instructor: string;
  category: string;
  progressPercent?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Test {
  id: string;
  title: string;
  subject: string;
  level: EducationLevel;
  durationMinutes: number;
  totalQuestions: number;
  questions: QuizQuestion[];
  completed?: boolean;
  score?: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  unlockedAt?: string;
}

export type NotificationType =
  | 'study_reminder'
  | 'quiz_reminder'
  | 'course_update'
  | 'info'
  | 'success'
  | 'alert'
  | 'assignment';

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: NotificationType;
  category?: string;
  actionTab?: string;
}

export interface ReminderSettings {
  dailyStudyReminder: boolean;
  dailyStudyTime: string;
  targetDailyMinutes: number;
  quizReminders: boolean;
  quizAdvanceNoticeMins: number;
  courseUpdates: boolean;
  soundAlerts: boolean;
}

export interface Chapter {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
}

export interface Lesson {
  id: string;
  lessonId?: string;
  chapterId: string;
  subjectId?: string;
  subjectTitle?: string;
  chapterTitle?: string;
  title: string;
  description: string;
  content: string;
  order: number;
  isActive: boolean;
  isPublished: boolean;
  status?: 'draft' | 'published' | 'archived';
  // Preparation for PDF
  pdfUrl?: string | null;
  pdfPath?: string | null;
  pdfName?: string | null;
  pdfSize?: string | null;
  pdfStoragePath?: string | null;
  pdfPagesCount?: number;
  // Preparation for Video
  videoUrl?: string | null;
  videoPath?: string | null;
  videoName?: string | null;
  videoDuration?: string | null;
  videoStoragePath?: string | null;
  thumbnailUrl?: string | null;
  thumbnailStoragePath?: string | null;
  // Preparation for Quiz
  hasQuiz?: boolean;
  quizId?: string | null;
  quizTitle?: string | null;
  quizQuestionsCount?: number;
  // Metadata
  estimatedMinutes?: number;
  authorEmail?: string;
  createdAt?: string;
  updatedAt?: any;
}

export type OfflineItemType = 'lesson' | 'pdf' | 'video';

export interface OfflineItem {
  id: string;
  title: string;
  type: OfflineItemType;
  subject: string;
  educationLevel: EducationLevel;
  fileSize: string;
  downloadedAt: string;
  contentOrUrl: string;
  videoDuration?: string;
  pdfPagesCount?: number;
  chapterTitle?: string;
  thumbnailColor?: string;
}

export type ForumCategory = 'all' | 'doubts' | 'notes' | 'discussions' | 'exam_prep';

export interface ForumReply {
  id: string;
  authorName: string;
  authorRole: UserRole | 'AI Tutor';
  authorAvatar: string;
  content: string;
  createdAt: string;
  upvotes: number;
  userUpvoted?: boolean;
  isAcceptedAnswer?: boolean;
}

export interface ForumPost {
  id: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar: string;
  title: string;
  content: string;
  subject: string;
  educationLevel: EducationLevel;
  category: 'doubt' | 'shared_note' | 'general';
  createdAt: string;
  upvotes: number;
  userUpvoted?: boolean;
  tags: string[];
  repliesCount: number;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: 'pdf' | 'image' | 'text';
  isAiResolved?: boolean;
  aiAnswer?: string;
  replies: ForumReply[];
}

export interface StudentReport {
  id: string;
  studentName: string;
  avatar: string;
  level: EducationLevel;
  attendancePercent: number;
  averageGrade: string;
  weakTopics: { topic: string; score: number }[];
  streak: number;
  testScores: { testName: string; score: number; date: string }[];
}

export interface Flashcard {
  id: string;
  subject: string;
  front: string;
  back: string;
  formula?: string;
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  role: UserRole;
  educationLevel: EducationLevel;
  status: 'active' | 'suspended' | 'pending';
  joinedDate: string;
  lastActive: string;
  coursesEnrolled: number;
}

export interface StudyPlanTask {
  id: string;
  dayNumber: number;
  subject: string;
  topic: string;
  durationMinutes: number;
  taskType: 'concept_video' | 'practice_quiz' | 'formula_revision' | 'mock_test' | 'notes_summary';
  completed: boolean;
  notes?: string;
}

export interface StudyPlan {
  id: string;
  title: string;
  targetExam: string;
  educationLevel: EducationLevel;
  durationDays: number;
  dailyHours: number;
  weakSubjects: string[];
  createdAt: string;
  tasks: StudyPlanTask[];
  overallProgressPercent: number;
}

export type FontSize = 'small' | 'medium' | 'large' | 'xlarge';

export interface PrivacySettings {
  allowAnalytics: boolean;
  publicLeaderboard: boolean;
  saveAiChatHistory: boolean;
  shareProgressWithTeachers: boolean;
  incognitoMode: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  title: string;
  avatar: string;
  subject: string;
  educationLevel: EducationLevel;
  rating: number;
  studentsCount: number;
  followersCount: number;
  isFollowing?: boolean;
  bio: string;
  verified: boolean;
  recentMaterialsCount: number;
  email?: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  subject: string;
  educationLevel: EducationLevel;
  membersCount: number;
  maxMembers: number;
  isJoined?: boolean;
  hostName: string;
  hostAvatar: string;
  meetingSchedule: string;
  nextSessionTopic: string;
  chatLink?: string;
  tags: string[];
}

export interface DiscussionGroup {
  id: string;
  title: string;
  description: string;
  subject: string;
  educationLevel: EducationLevel;
  membersCount: number;
  postsCount: number;
  isJoined?: boolean;
  icon: string;
  activeTopic: string;
  lastActive: string;
}

export type CareerTab = 'resume' | 'interview' | 'coding' | 'placement' | 'internships' | 'jobs';

export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string;
  education: {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    grade: string;
  }[];
  experience: {
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    highlights: string[];
  }[];
  projects: {
    title: string;
    technologies: string;
    link: string;
    description: string;
  }[];
  skills: string[];
  certifications: string[];
  achievements: string[];
}

export interface InterviewRole {
  id: string;
  title: string;
  category: 'Tech' | 'Core' | 'Government' | 'Management' | 'Banking';
  icon: string;
  sampleQuestionsCount: number;
}

export interface InterviewQuestion {
  id: string;
  roleId: string;
  question: string;
  category: 'Technical' | 'Behavioral' | 'System Design' | 'HR';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  hints: string[];
  sampleAnswer: string;
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Array & String' | 'Linked List' | 'Trees & Graphs' | 'Dynamic Programming' | 'SQL & Databases';
  acceptanceRate: string;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  starterCode: Record<string, string>; // e.g. { python: "...", cpp: "...", java: "...", javascript: "..." }
  testCases: { input: string; expectedOutput: string }[];
  solutionHints: string[];
  fullSolution: Record<string, string>;
}

export interface PlacementTrack {
  id: string;
  companyName: string;
  logo: string;
  category: 'IT Service' | 'Product Tech' | 'Core Engineering' | 'Government/Banking';
  targetRoles: string[];
  salaryPackage: string;
  selectionRounds: string[];
  examPattern: {
    section: string;
    questionsCount: number;
    timeMinutes: number;
  }[];
  prepMaterialsCount: number;
  syllabus: string[];
  previousYearQuestionsCount: number;
}

export interface InternshipListing {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  workMode: 'Remote' | 'On-Site' | 'Hybrid';
  stipend: string;
  duration: string;
  startDate: string;
  postedDate: string;
  deadline: string;
  skillsRequired: string[];
  description: string;
  openings: number;
  applied?: boolean;
}

export interface JobUpdate {
  id: string;
  title: string;
  organization: string;
  category: 'IT & Software' | 'Core Engineering' | 'Government Exam' | 'Banking & Railway' | 'PSU';
  location: string;
  eligibility: string;
  salaryOrPayScale: string;
  batchEligible: string;
  postedDate: string;
  lastDateToApply: string;
  officialNotificationUrl: string;
  isGovernment: boolean;
  totalVacancies?: number;
  urgentHiring?: boolean;
}

export interface QuizDocument {
  id?: string;
  subjectId: string;
  chapterId: string;
  lessonId: string;
  lessonTitle?: string;
  subjectTitle?: string;
  chapterTitle?: string;
  title: string;
  description?: string;
  totalMarks: number;
  passMarks: number;
  durationMinutes: number;
  timeLimit?: number; // legacy alias for durationMinutes
  passingScore?: number; // derived pass percentage
  questionsCount?: number;
  isPublished: boolean;
  isActive: boolean;
  createdAt?: any;
  updatedAt?: any;
}

// Student-safe question stored at quizzes/{quizId}/questions/{questionId} (NO correctOptionIndex)
export interface QuizQuestionItem {
  id: string;
  questionText: string;
  options: string[];
  marks: number;
  order: number;
  isPublished?: boolean;
  isActive?: boolean;
}

// Protected answer key stored separately at quizzes/{quizId}/answerKeys/{questionId}
export interface QuizAnswerKey {
  id?: string;
  correctOptionIndex: 0 | 1 | 2 | 3;
  explanation?: string;
}

// Persisted student quiz attempt stored at quizAttempts/{attemptId}
export interface QuizAttemptDocument {
  id?: string;
  quizId: string;
  subjectId?: string;
  chapterId?: string;
  lessonId?: string;
  quizTitle?: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  score: number;
  totalMarks: number;
  passMarks?: number;
  percentage: number;
  passed: boolean;
  answers?: Record<string, number>;
  graded?: boolean;
  timeSpentSeconds?: number;
  submittedAt?: any;
}

// Legacy flat quiz interfaces (preserved for backward compatibility)
export interface QuizQuestionDocument {
  id?: string;
  quizId: string;
  order?: number;
  isPublished?: boolean;
  question: string;
  optionA: string;
  optionB: string;
  optionC?: string;
  optionD?: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
}

export interface QuizResultDocument {
  id?: string;
  quizId: string;
  lessonId?: string;
  quizTitle: string;
  userId: string;
  userName: string;
  userEmail?: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passingScore: number;
  passed: boolean;
  answers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  timeSpentSeconds?: number;
  submittedAt?: any;
}

export interface StudentProgress {
  id?: string;
  progressId?: string;
  userId: string;
  subjectId: string;
  chapterId: string;
  lessonId: string;
  completed: boolean;
  percentage: number;
  completedAt?: any;
}

export interface ChapterProgressSummary {
  chapterId: string;
  chapterNumber: number;
  title: string;
  percentage: number;
  completedLessons: number;
  totalLessons: number;
  lessons: {
    id: string;
    title: string;
    completed: boolean;
    percentage: number;
    completedAt?: string | null;
  }[];
}

export interface SubjectProgressSummary {
  subjectId: string;
  subjectName: string;
  icon?: string;
  overallPercentage: number;
  chapters: ChapterProgressSummary[];
}
