export type UserRole = 'student' | 'teacher' | 'parent' | 'admin';

export type EducationLevel =
  | 'LKG'
  | 'UKG'
  | 'Class 1–5'
  | 'Class 6–10'
  | 'Intermediate (11–12)'
  | 'Diploma'
  | 'Degree (BSc, BCom, BA, BTech)'
  | 'Competitive Exams (UPSC, APPSC, Banking, Railways)';

export type Language = 'English' | 'Telugu' | 'Hindi';

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


