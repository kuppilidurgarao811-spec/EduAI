import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  BookOpen,
  Video,
  FileText,
  Bell,
  BarChart3,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit3,
  UserCheck,
  UserX,
  Upload,
  CheckCircle2,
  TrendingUp,
  Award,
  Sparkles,
  ChevronRight,
  X,
  Download,
  Eye,
  Send,
  Layers,
  Radio,
  Clock,
  PieChart as PieChartIcon,
  Activity,
  ArrowUpRight,
  Settings,
  AlertTriangle,
  Bug,
  RefreshCw,
  Smartphone,
  Copy,
  ExternalLink,
  ShieldCheck,
  FileCode,
  Check,
  History,
  MessageSquare,
  Flame,
  ThumbsUp,
} from 'lucide-react';
import { analytics } from '../lib/analytics';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import {
  EducationLevel,
  UserRole,
  Course,
  CourseModule,
  ManagedUser,
  NotificationType,
} from '../types';

// Mock chart data for Analytics
const USER_GROWTH_DATA = [
  { month: 'Jan', activeUsers: 850, newRegistrations: 220, downloads: 1200 },
  { month: 'Feb', activeUsers: 980, newRegistrations: 290, downloads: 1540 },
  { month: 'Mar', activeUsers: 1120, newRegistrations: 340, downloads: 1890 },
  { month: 'Apr', activeUsers: 1280, newRegistrations: 410, downloads: 2300 },
  { month: 'May', activeUsers: 1390, newRegistrations: 480, downloads: 2750 },
  { month: 'Jun', activeUsers: 1480, newRegistrations: 520, downloads: 3100 },
];

const SUBJECT_ENGAGEMENT_DATA = [
  { subject: 'Mathematics', hours: 4200, completions: 890 },
  { subject: 'Physics', hours: 3800, completions: 760 },
  { subject: 'Chemistry', hours: 3100, completions: 640 },
  { subject: 'Telugu', hours: 2400, completions: 520 },
  { subject: 'Biology', hours: 2900, completions: 610 },
  { subject: 'Computer Sci', hours: 3600, completions: 810 },
];

const CONTENT_TYPE_DATA = [
  { name: 'Video Lessons', value: 45, color: '#6366f1' },
  { name: 'PDF Handbooks', value: 30, color: '#10b981' },
  { name: 'Interactive Quizzes', value: 15, color: '#f59e0b' },
  { name: 'AI Voice Classes', value: 10, color: '#8b5cf6' },
];

const GRADE_DISTRIBUTION_DATA = [
  { grade: 'Class 1–5', students: 280 },
  { grade: 'Class 6–10', students: 510 },
  { grade: 'Inter (11–12)', students: 430 },
  { grade: 'Degree / BTech', students: 260 },
];

export const AdminPanel: React.FC = () => {
  const {
    user,
    courses,
    addCourse,
    deleteCourse,
    addModuleToCourse,
    managedUsers,
    addManagedUser,
    updateManagedUser,
    deleteManagedUser,
    broadcastNotification,
    notifications,
    downloadOfflineItem,
  } = useAuth();

  // Primary Tab state: 'analytics' | 'users' | 'courses' | 'uploads' | 'notifications' | 'publish' | 'feedback_updates'
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'courses' | 'uploads' | 'notifications' | 'publish' | 'feedback_updates'>('analytics');
  const [publishCopied, setPublishCopied] = useState<string | null>(null);
  const [checklistCompleted, setChecklistCompleted] = useState<Record<string, boolean>>({
    signed_build: true,
    test_version: true,
    play_account: false,
    app_icon: true,
    screenshots: true,
    feature_graphic: true,
    privacy_policy: true,
    app_description: true,
    upload_aab: false,
    submit_review: false,
  });

  // --- USER FEEDBACK & RELEASE UPDATES STATE ---
  const [feedbackList, setFeedbackList] = useState([
    {
      id: 'fb-1',
      author: 'Ananya Sharma',
      role: 'Student',
      category: 'Feature Request',
      title: 'Add dark mode toggle to PDF handbook reader',
      content: 'When reading long 50-page physics PDFs at night, an inverted dark mode background for PDFs would reduce eye strain.',
      upvotes: 42,
      status: 'In Progress', // 'In Review' | 'Planned' | 'In Progress' | 'Shipped'
      date: '2026-07-28',
    },
    {
      id: 'fb-2',
      author: 'Prof. R. K. Varma',
      role: 'Teacher',
      category: 'Course Request',
      title: 'Include AP EAPCET Organic Chemistry previous 10-year solved papers',
      content: 'Students are requesting year-wise solved question sets with step-by-step video solutions for JEE/EAPCET.',
      upvotes: 68,
      status: 'Shipped',
      date: '2026-07-26',
    },
    {
      id: 'fb-3',
      author: 'Karthik Raja',
      role: 'Student',
      category: 'UI Improvement',
      title: 'Allow custom voice speed controls in AI Voice Classroom',
      content: 'Adding 1.25x and 1.5x audio speed options in the AI Voice teacher stream would help quick revision.',
      upvotes: 35,
      status: 'Planned',
      date: '2026-07-27',
    },
  ]);

  const [releaseHistory, setReleaseHistory] = useState([
    {
      version: 'v1.2.0',
      title: 'Major Release: 12 AI Tools Suite & Play Store TWA Packaging',
      date: '2026-07-28',
      type: 'Major Update',
      highlights: [
        'Added 12 AI Tools Suite including Math Solver, Essay Grader, Diagram Analyzer, and Voice Classes.',
        'Integrated Google Play Console AAB Publishing Kit and Web App Manifest.',
        'Enhanced offline PDF vault with fast instant local caching.',
        'Added real-time DAU and Crash Report Analytics in Admin Dashboard.',
      ],
    },
    {
      version: 'v1.1.0',
      title: 'AI Voice Classroom & Multilingual Support',
      date: '2026-07-20',
      type: 'Feature Release',
      highlights: [
        'Real-time voice synthesis in 12 Indian regional languages.',
        'Parent & Teacher live attendance & streak tracking dashboard.',
        'Dark & Light mode adaptive theme polish across all devices.',
      ],
    },
  ]);

  // Form state for publishing new release
  const [showNewReleaseModal, setShowNewReleaseModal] = useState(false);
  const [newReleaseVersion, setNewReleaseVersion] = useState('v1.2.1');
  const [newReleaseTitle, setNewReleaseTitle] = useState('');
  const [newReleaseType, setNewReleaseType] = useState('Feature Release');
  const [newReleaseHighlights, setNewReleaseHighlights] = useState('');
  const [newFeedbackTitle, setNewFeedbackTitle] = useState('');
  const [newFeedbackContent, setNewFeedbackContent] = useState('');
  const [newFeedbackCategory, setNewFeedbackCategory] = useState('Feature Request');
  const [showAddFeedbackModal, setShowAddFeedbackModal] = useState(false);

  const handleUpdateFeedbackStatus = (id: string, newStatus: string) => {
    setFeedbackList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const handlePublishRelease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReleaseTitle.trim() || !newReleaseVersion.trim()) return;

    const highlightsArray = newReleaseHighlights
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean);

    const newRelease = {
      version: newReleaseVersion,
      title: newReleaseTitle,
      date: new Date().toISOString().split('T')[0],
      type: newReleaseType,
      highlights: highlightsArray.length > 0 ? highlightsArray : ['General performance improvements and bug fixes.'],
    };

    setReleaseHistory([newRelease, ...releaseHistory]);

    // Automatically send broadcast announcement to all users
    broadcastNotification({
      title: `🚀 Update Released (${newReleaseVersion}): ${newReleaseTitle}`,
      message: `We've released a new update! Highlights: ${newRelease.highlights[0]} Check out what's new.`,
      targetAudience: 'All',
      type: 'system',
    });

    setNewReleaseVersion('');
    setNewReleaseTitle('');
    setNewReleaseHighlights('');
    setShowNewReleaseModal(false);
  };

  const handleAddFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedbackTitle.trim() || !newFeedbackContent.trim()) return;

    const newItem = {
      id: `fb-${Date.now()}`,
      author: user?.name || 'Administrator',
      role: 'Admin',
      category: newFeedbackCategory,
      title: newFeedbackTitle,
      content: newFeedbackContent,
      upvotes: 1,
      status: 'In Review',
      date: new Date().toISOString().split('T')[0],
    };

    setFeedbackList([newItem, ...feedbackList]);
    setNewFeedbackTitle('');
    setNewFeedbackContent('');
    setShowAddFeedbackModal(false);
  };

  // --- ANALYTICS & CRASHES STATE ---
  const [analyticsData, setAnalyticsData] = useState(() => analytics.getSummary());
  const [crashFilter, setCrashFilter] = useState<'all' | 'unresolved' | 'resolved'>('all');
  const [expandedCrashId, setExpandedCrashId] = useState<string | null>(null);

  const handleToggleResolveCrash = (id: string) => {
    analytics.resolveCrash(id);
    setAnalyticsData(analytics.getSummary());
  };

  const handleClearCrashes = () => {
    if (confirm('Clear all crash logs?')) {
      analytics.clearCrashes();
      setAnalyticsData(analytics.getSummary());
    }
  };

  // --- MANAGE USERS STATE ---
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('All');
  const [userStatusFilter, setUserStatusFilter] = useState<string>('All');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Add User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserMobile, setNewUserMobile] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('student');
  const [newUserLevel, setNewUserLevel] = useState<EducationLevel>('Class 6–10');

  // --- UPLOAD COURSES STATE ---
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseSubject, setCourseSubject] = useState('Mathematics');
  const [courseLevel, setCourseLevel] = useState<EducationLevel>('Class 6–10');
  const [courseCategory, setCourseCategory] = useState('Core Curriculum');
  const [courseInstructor, setCourseInstructor] = useState('Dr. Kuppili Durga Rao');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseColor, setCourseColor] = useState('from-indigo-600 to-purple-800');

  // --- UPLOAD VIDEOS / PDFS STATE ---
  const [uploadTargetCourseId, setUploadTargetCourseId] = useState<string>(courses[0]?.id || '');
  const [uploadType, setUploadType] = useState<'video' | 'pdf'>('video');
  const [contentTitle, setContentTitle] = useState('');
  const [contentDuration, setContentDuration] = useState('15 mins');
  const [contentUrl, setContentUrl] = useState('');
  const [contentSummary, setContentSummary] = useState('');
  const [pdfPageCount, setPdfPageCount] = useState<number>(12);
  const [pdfFileSize, setPdfFileSize] = useState('4.5 MB');

  // --- NOTIFICATIONS STATE ---
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifType, setNotifType] = useState<NotificationType>('alert');
  const [notifTargetRole, setNotifTargetRole] = useState<UserRole | 'all'>('all');
  const [notifTargetLevel, setNotifTargetLevel] = useState<EducationLevel | 'all'>('all');

  // Filtered Users
  const filteredUsers = managedUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.mobile && u.mobile.includes(userSearch));
    const matchesRole = userRoleFilter === 'All' || u.role === userRoleFilter;
    const matchesStatus = userStatusFilter === 'All' || u.status === userStatusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handlers
  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    addManagedUser({
      name: newUserName,
      email: newUserEmail,
      mobile: newUserMobile || '+91 90000 00000',
      role: newUserRole,
      educationLevel: newUserLevel,
      status: 'active',
    });

    setNewUserName('');
    setNewUserEmail('');
    setNewUserMobile('');
    setShowAddUserModal(false);
  };

  const handleCreateCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;

    const newCourse: Course = {
      id: `course-admin-${Date.now()}`,
      title: courseTitle,
      subject: courseSubject,
      level: courseLevel,
      category: courseCategory,
      instructor: courseInstructor,
      description: courseDescription || 'Comprehensive curriculum aligned lesson series.',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      pdfCount: 2,
      videoCount: 5,
      enrolledCount: 150,
      rating: 4.9,
      progressPercent: 0,
      modules: [
        { id: `m1-${Date.now()}`, title: `${courseSubject} Chapter 1 Overview`, duration: '12 mins', type: 'video' },
        { id: `m2-${Date.now()}`, title: 'Practice Exercises & PDF Handbook', duration: '20 mins', type: 'pdf' },
      ],
    };

    addCourse(newCourse);
    setCourseTitle('');
    setCourseDescription('');
    setShowAddCourseModal(false);
  };

  const handleUploadContentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentTitle.trim()) return;

    const newModule: CourseModule = {
      id: `mod-${Date.now()}`,
      title: contentTitle,
      duration: contentDuration,
      type: uploadType,
      contentUrl: contentUrl || 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      summary: contentSummary,
    };

    if (uploadTargetCourseId) {
      addModuleToCourse(uploadTargetCourseId, newModule);
    }

    // If PDF, also create an Offline Item
    if (uploadType === 'pdf') {
      const selectedCourse = courses.find((c) => c.id === uploadTargetCourseId);
      downloadOfflineItem({
        id: `off-pdf-${Date.now()}`,
        title: contentTitle,
        type: 'pdf',
        subject: selectedCourse?.subject || 'General Study',
        educationLevel: selectedCourse?.level || 'Class 6–10',
        fileSize: pdfFileSize,
        downloadedAt: 'Just now',
        chapterTitle: contentTitle,
        pdfPagesCount: pdfPageCount,
        thumbnailColor: 'from-emerald-600 to-indigo-800',
        contentOrUrl: contentSummary || `PDF Document: ${contentTitle}`,
      });
    }

    setContentTitle('');
    setContentUrl('');
    setContentSummary('');
    alert(`Successfully uploaded ${uploadType.toUpperCase()} module: "${contentTitle}"!`);
  };

  const handleSendNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) return;

    broadcastNotification({
      title: notifTitle,
      message: notifMessage,
      type: notifType,
      category: 'Admin Broadcast',
      targetRole: notifTargetRole,
      targetLevel: notifTargetLevel,
    });

    setNotifTitle('');
    setNotifMessage('');
    alert('Broadcast Notification dispatched successfully to target audience!');
  };

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white relative overflow-hidden shadow-2xl border border-indigo-500/30">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Admin Command Center
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" /> System Status: 100% Operational
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              EduAI Portal Management & Control Panel
            </h1>
            <p className="text-xs md:text-sm text-indigo-200/90 leading-relaxed">
              Manage users, upload structured video courses & PDF handbooks, monitor platform engagement analytics, and broadcast push announcements.
            </p>
          </div>

          {/* Quick Header Metric Pills */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Total Users</p>
              <p className="text-xl font-black text-white">{managedUsers.length} Enrolled</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Active Courses</p>
              <p className="text-xl font-black text-amber-400">{courses.length} Live</p>
            </div>
          </div>
        </div>
      </div>

      {/* ADMIN NAVIGATION TABS */}
      <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/80 dark:border-slate-700/80 shadow-inner overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics & Insights</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Manage Users ({managedUsers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('courses')}
          className={`py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'courses'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Upload Courses ({courses.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('uploads')}
          className={`py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'uploads'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Upload Videos / PDFs</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('notifications')}
          className={`py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'notifications'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Broadcast Alerts</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('publish')}
          className={`py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'publish'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span className="flex items-center gap-1">
            Play Store Publishing Kit <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[9px] font-black">AAB</span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('feedback_updates')}
          className={`py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'feedback_updates'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Feedback & Version Updates</span>
        </button>
      </div>

      {/* ==================== TAB 1: ANALYTICS & INSIGHTS ==================== */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Executive KPI Cards with Real-Time Analytics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400 font-bold uppercase">Daily Active Users (DAU)</p>
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">{analyticsData.todayDAU} Active</h3>
              <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% vs 7-day avg
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400 font-bold uppercase">Avg Session Duration</p>
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">{analyticsData.sessionMetrics.avgDurationMinutes} Mins</h3>
              <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" /> {analyticsData.sessionMetrics.activeSessionsNow} live users online
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400 font-bold uppercase">User Retention (D1 / D7)</p>
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">{analyticsData.retention.day1}% / {analyticsData.retention.day7}%</h3>
              <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                {analyticsData.retention.day30}% Day-30 Cohort
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400 font-bold uppercase">Crash & Error Health</p>
                <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                  <Bug className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">
                {analyticsData.crashReports.filter(c => !c.resolved).length} Unresolved
              </h3>
              <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                99.98% Crash-Free Rate
              </p>
            </div>
          </div>

          {/* Charts Row 1: Daily Active Users & Most-Used Features */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Daily Active Users (DAU) Trend Chart */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" /> Daily Active Users (DAU) - Past 7 Days
                  </h3>
                  <p className="text-xs text-slate-400">Unique active students and teachers engaging daily</p>
                </div>
                <button
                  onClick={() => setAnalyticsData(analytics.getSummary())}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all"
                  title="Refresh metrics"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.dailyActiveUsers}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="count" name="Daily Active Users" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Most-Used Features Leaderboard */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-600" /> Most-Used Features
                </h3>
                <p className="text-xs text-slate-400">Ranked by total user interactions</p>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-72 pr-1 no-scrollbar">
                {analyticsData.mostUsedFeatures.map((feat, idx) => {
                  const maxCount = analyticsData.mostUsedFeatures[0]?.count || 1;
                  const pct = Math.round((feat.count / maxCount) * 100);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                        <span className="truncate pr-2">{idx + 1}. {feat.label}</span>
                        <span className="text-indigo-600 dark:text-indigo-400 shrink-0">{feat.count} ops</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section: Crash Reports & Error Tracking */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Bug className="w-5 h-5 text-rose-500" /> Crash Reports & Error Tracking
                </h3>
                <p className="text-xs text-slate-400">Automatically logged JS runtime exceptions & network crashes</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-xs font-bold">
                  <button
                    onClick={() => setCrashFilter('all')}
                    className={`px-3 py-1 rounded-lg transition-all ${crashFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
                  >
                    All ({analyticsData.crashReports.length})
                  </button>
                  <button
                    onClick={() => setCrashFilter('unresolved')}
                    className={`px-3 py-1 rounded-lg transition-all ${crashFilter === 'unresolved' ? 'bg-rose-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
                  >
                    Unresolved ({analyticsData.crashReports.filter(c => !c.resolved).length})
                  </button>
                  <button
                    onClick={() => setCrashFilter('resolved')}
                    className={`px-3 py-1 rounded-lg transition-all ${crashFilter === 'resolved' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}
                  >
                    Resolved ({analyticsData.crashReports.filter(c => c.resolved).length})
                  </button>
                </div>

                <button
                  onClick={handleClearCrashes}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-600 dark:text-slate-300 hover:text-rose-600 text-xs font-bold transition-all border border-slate-200/80 dark:border-slate-700/80"
                >
                  Clear Logs
                </button>
              </div>
            </div>

            {/* Crash List */}
            {analyticsData.crashReports.length === 0 ? (
              <div className="p-8 text-center text-slate-400 dark:text-slate-500 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-xs font-bold">No crashes or exceptions logged! System is completely healthy.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {analyticsData.crashReports
                  .filter((c) => {
                    if (crashFilter === 'unresolved') return !c.resolved;
                    if (crashFilter === 'resolved') return c.resolved;
                    return true;
                  })
                  .map((crash) => {
                    const isExpanded = expandedCrashId === crash.id;
                    return (
                      <div
                        key={crash.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          crash.resolved
                            ? 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800'
                            : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                  crash.resolved
                                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                    : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                                }`}
                              >
                                {crash.resolved ? 'Resolved' : 'Active Crash'}
                              </span>
                              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                {new Date(crash.timestamp).toLocaleString()}
                              </span>
                              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                                • {crash.url}
                              </span>
                              {crash.userEmail && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300">
                                  {crash.userEmail} ({crash.userRole})
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-black text-slate-800 dark:text-slate-200 font-mono">
                              {crash.message}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => setExpandedCrashId(isExpanded ? null : crash.id)}
                              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                            >
                              {isExpanded ? 'Hide Trace' : 'View Trace'}
                            </button>

                            <button
                              onClick={() => handleToggleResolveCrash(crash.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                crash.resolved
                                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                              }`}
                            >
                              {crash.resolved ? 'Mark Unresolved' : 'Resolve Issue'}
                            </button>
                          </div>
                        </div>

                        {/* Expandable Stack Trace */}
                        {isExpanded && (
                          <div className="mt-3 p-3 rounded-xl bg-slate-900 text-rose-300 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                            <p className="text-slate-400 font-bold mb-1">Stack Trace:</p>
                            <pre className="whitespace-pre-wrap">{crash.stack}</pre>
                            <p className="text-slate-500 text-[10px] mt-2">User Agent: {crash.userAgent}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== TAB 2: MANAGE USERS ==================== */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search user name, email, mobile..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                />
              </div>

              {/* Role Filter */}
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
              >
                <option value="All">All Roles</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
                <option value="admin">Admin</option>
              </select>

              {/* Status Filter */}
              <select
                value={userStatusFilter}
                onChange={(e) => setUserStatusFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
              >
                <option value="All">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setShowAddUserModal(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New User Account</span>
            </button>
          </div>

          {/* Users Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-black uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 px-4">User Details</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Grade Level</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Joined / Last Active</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-black text-sm border border-indigo-300 dark:border-indigo-800">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-black text-slate-800 dark:text-slate-100">{u.name}</h4>
                            <p className="text-[11px] text-slate-400 font-medium">{u.email} • {u.mobile}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role Dropdown */}
                      <td className="py-3.5 px-4">
                        <select
                          value={u.role}
                          onChange={(e) => updateManagedUser(u.id, { role: e.target.value as UserRole })}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${
                            u.role === 'admin'
                              ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                              : u.role === 'teacher'
                              ? 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300'
                              : u.role === 'parent'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300'
                          }`}
                        >
                          <option value="student">Student</option>
                          <option value="teacher">Teacher</option>
                          <option value="parent">Parent</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>

                      {/* Education Level */}
                      <td className="py-3.5 px-4 font-bold text-slate-600 dark:text-slate-300">
                        {u.educationLevel}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase inline-flex items-center gap-1 ${
                          u.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {u.status === 'active' ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                          {u.status}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 text-slate-400 font-medium text-[11px]">
                        Joined: {u.joinedDate}<br />Active: {u.lastActive}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Toggle Suspend/Activate */}
                          <button
                            type="button"
                            onClick={() =>
                              updateManagedUser(u.id, {
                                status: u.status === 'active' ? 'suspended' : 'active',
                              })
                            }
                            className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                              u.status === 'active'
                                ? 'bg-amber-50 dark:bg-amber-950 text-amber-600 hover:bg-amber-100'
                                : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 hover:bg-emerald-100'
                            }`}
                            title={u.status === 'active' ? 'Suspend Account' : 'Activate Account'}
                          >
                            {u.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>

                          {/* Delete User */}
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete user account "${u.name}"?`)) {
                                deleteManagedUser(u.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 hover:bg-rose-100 transition-all"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: UPLOAD COURSES ==================== */}
      {activeTab === 'courses' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-800 dark:text-slate-100">
                Course Catalog Management
              </h3>
              <p className="text-xs text-slate-400">Add new courses or edit existing curriculum</p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddCourseModal(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Course</span>
            </button>
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col"
              >
                {/* Thumbnail Header */}
                <div className="relative h-36 bg-gradient-to-r from-indigo-900 to-purple-900 p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-white/20 backdrop-blur-md text-white border border-white/20">
                      {course.level}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete course "${course.title}"?`)) {
                          deleteCourse(course.id);
                        }
                      }}
                      className="p-1.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-all shadow-xs"
                      title="Delete Course"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                      {course.subject}
                    </span>
                    <h4 className="text-sm font-black text-white line-clamp-1">{course.title}</h4>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-center">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Videos</p>
                      <p className="text-xs font-black text-slate-800 dark:text-slate-100">{course.videoCount}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">PDFs</p>
                      <p className="text-xs font-black text-slate-800 dark:text-slate-100">{course.pdfCount}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Enrolled</p>
                      <p className="text-xs font-black text-indigo-600 dark:text-indigo-400">{course.enrolledCount}</p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-slate-400 border-t border-slate-100 dark:border-slate-800">
                    <span>Instructor: {course.instructor}</span>
                    <span className="text-amber-500 font-black">★ {course.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 4: UPLOAD VIDEOS / PDFS ==================== */}
      {activeTab === 'uploads' && (
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h3 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-600" /> Video & PDF Content Studio
            </h3>
            <p className="text-xs text-slate-400">
              Upload video lessons or PDF handbooks directly into existing course modules or offline study vault
            </p>
          </div>

          <form onSubmit={handleUploadContentSubmit} className="space-y-5">
            {/* Target Course Selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Select Target Course *
                </label>
                <select
                  value={uploadTargetCourseId}
                  onChange={(e) => setUploadTargetCourseId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.level} • {c.subject})
                    </option>
                  ))}
                </select>
              </div>

              {/* Content Type Toggle */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Content Format *
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setUploadType('video')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                      uploadType === 'video'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Video className="w-4 h-4" /> Video Lesson
                  </button>

                  <button
                    type="button"
                    onClick={() => setUploadType('pdf')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                      uploadType === 'pdf'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <FileText className="w-4 h-4" /> PDF Handbook
                  </button>
                </div>
              </div>
            </div>

            {/* Title & Duration/Page info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {uploadType === 'video' ? 'Video Lesson Title *' : 'PDF Handbook Title *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    uploadType === 'video'
                      ? 'e.g., Step-by-Step Trigonometric Identity Proofs'
                      : 'e.g., Complete Formula Cheat-Sheet PDF'
                  }
                  value={contentTitle}
                  onChange={(e) => setContentTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                />
              </div>

              {uploadType === 'video' ? (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Video Duration *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 18 mins"
                    value={contentDuration}
                    onChange={(e) => setContentDuration(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    File Size & Pages *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="e.g., 4.5 MB"
                      value={pdfFileSize}
                      onChange={(e) => setPdfFileSize(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                    />
                    <input
                      type="number"
                      placeholder="Pages"
                      value={pdfPageCount}
                      onChange={(e) => setPdfPageCount(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Video or PDF Link */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {uploadType === 'video' ? 'Video File Stream URL / Embed Link' : 'PDF Document Download Link / Storage URL'}
              </label>
              <input
                type="text"
                placeholder={
                  uploadType === 'video'
                    ? 'https://cdn.eduai.in/videos/trig-chapter-1.mp4'
                    : 'https://cdn.eduai.in/pdfs/formula-handbook.pdf'
                }
                value={contentUrl}
                onChange={(e) => setContentUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Description / Key Points */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Chapter Outline & Key Takeaways
              </label>
              <textarea
                rows={3}
                placeholder="Describe key topics, formulas covered, or problem solutions..."
                value={contentSummary}
                onChange={(e) => setContentSummary(e.target.value)}
                className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-100"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Publish & Sync to Student Apps</span>
            </button>
          </form>
        </div>
      )}

      {/* ==================== TAB 5: BROADCAST NOTIFICATIONS ==================== */}
      {activeTab === 'notifications' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Broadcaster Form */}
          <div className="lg:col-span-2 p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" /> Broadcast Push Notification
              </h3>
              <p className="text-xs text-slate-400">
                Send instant announcements, exam updates, or course release reminders to all students
              </p>
            </div>

            <form onSubmit={handleSendNotificationSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Notification Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 📢 AP/TS State Board Exam Date Announcement!"
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Alert Type *
                  </label>
                  <select
                    value={notifType}
                    onChange={(e) => setNotifType(e.target.value as NotificationType)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                  >
                    <option value="alert">Alert (Urgent)</option>
                    <option value="course_update">Course Update</option>
                    <option value="quiz_reminder">Quiz Reminder</option>
                    <option value="assignment">Assignment</option>
                    <option value="info">General Info</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Target Role *
                  </label>
                  <select
                    value={notifTargetRole}
                    onChange={(e) => setNotifTargetRole(e.target.value as UserRole | 'all')}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                  >
                    <option value="all">All Roles (Everyone)</option>
                    <option value="student">Students Only</option>
                    <option value="teacher">Teachers Only</option>
                    <option value="parent">Parents Only</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Grade Level Target *
                  </label>
                  <select
                    value={notifTargetLevel}
                    onChange={(e) => setNotifTargetLevel(e.target.value as EducationLevel | 'all')}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                  >
                    <option value="all">All Grades</option>
                    <option value="Class 1–5">Class 1–5</option>
                    <option value="Class 6–10">Class 6–10</option>
                    <option value="Intermediate (11–12)">Intermediate (11–12)</option>
                    <option value="Degree (BSc, BCom, BA, BTech)">Degree / BTech</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Message Details *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type full notification details here..."
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Push Notification</span>
              </button>
            </form>
          </div>

          {/* Live Preview & Recent Log */}
          <div className="space-y-6">
            {/* Preview Card */}
            <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-3 border border-slate-800 shadow-md">
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> Live Student Preview
              </span>
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {notifType.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-400">Just now</span>
                </div>
                <h4 className="text-xs font-black text-white">
                  {notifTitle || 'Sample Title Preview'}
                </h4>
                <p className="text-[11px] text-slate-300 line-clamp-3">
                  {notifMessage || 'Notification text will appear here on student devices.'}
                </p>
              </div>
            </div>

            {/* Broadcast History */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                Recent Sent Broadcasts ({notifications.length})
              </h4>
              <div className="space-y-2.5 max-h-72 overflow-y-auto no-scrollbar">
                {notifications.slice(0, 5).map((n) => (
                  <div key={n.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">{n.category || 'Alert'}</span>
                      <span className="text-[10px] text-slate-400">{n.date}</span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">{n.title}</h5>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 6: GOOGLE PLAY PUBLISHING KIT ==================== */}
      {activeTab === 'publish' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Card */}
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider">
                    Release Ready
                  </span>
                  <span className="text-xs text-indigo-200 font-medium">Bundle ID: com.eduai.learning</span>
                </div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Smartphone className="w-6 h-6 text-indigo-400" /> Google Play Console Publishing Kit
                </h2>
                <p className="text-xs text-indigo-200">
                  Step-by-step guide, asset generator, and TWA build instructions to publish EduAI on Google Play Store.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const text = `https://${window.location.host}/manifest.json`;
                    navigator.clipboard.writeText(text);
                    setPublishCopied('manifest');
                    setTimeout(() => setPublishCopied(null), 2000);
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 backdrop-blur-md flex items-center gap-2"
                >
                  <FileCode className="w-4 h-4 text-amber-400" />
                  <span>{publishCopied === 'manifest' ? 'Manifest URL Copied!' : 'Copy Web Manifest URL'}</span>
                </button>

                <a
                  href="https://play.google.com/console"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2"
                >
                  <span>Open Play Console</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10">
                <p className="text-[10px] text-indigo-200 uppercase font-bold">Target Platform</p>
                <p className="text-sm font-black text-white">Android & Web (TWA)</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10">
                <p className="text-[10px] text-indigo-200 uppercase font-bold">App Version</p>
                <p className="text-sm font-black text-white">1.0.0 (Build 1)</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10">
                <p className="text-[10px] text-indigo-200 uppercase font-bold">Required Icons</p>
                <p className="text-sm font-black text-emerald-400">512 x 512 Vector Ready</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10">
                <p className="text-[10px] text-indigo-200 uppercase font-bold">Bundle Format</p>
                <p className="text-sm font-black text-amber-400">Android App Bundle (.aab)</p>
              </div>
            </div>
          </div>

          {/* Interactive Step-by-Step Checklist */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" /> Play Store Launch Checklist
                </h3>
                <p className="text-xs text-slate-400">Mark off steps as you complete your Google Play submission</p>
              </div>
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950">
                {Object.values(checklistCompleted).filter(Boolean).length} / {Object.keys(checklistCompleted).length} Completed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                {
                  key: 'signed_build',
                  title: '1. Generate Signed Release Build (.aab)',
                  desc: 'Bundle PWA into native Trusted Web Activity (.aab) with keytool signing.',
                },
                {
                  key: 'test_version',
                  title: '2. Test Release Version',
                  desc: 'Run closed testing track on physical Android devices to verify offline vault & audio.',
                },
                {
                  key: 'play_account',
                  title: '3. Create Google Play Console Account',
                  desc: 'Register developer account ($25 one-time fee) at play.google.com/console.',
                },
                {
                  key: 'app_icon',
                  title: '4. Hi-Res App Icon (512x512)',
                  desc: '32-bit PNG with transparent/solid background, no rounded corners.',
                },
                {
                  key: 'screenshots',
                  title: '5. Phone & Tablet Screenshots',
                  desc: 'At least 4 phone screenshots (min 1080px width) & 7"/10" tablet screenshots.',
                },
                {
                  key: 'feature_graphic',
                  title: '6. Feature Graphic Banner (1024x500)',
                  desc: 'PNG/JPEG promotional banner showing EduAI core features without device mockups.',
                },
                {
                  key: 'privacy_policy',
                  title: '7. Privacy Policy & Data Safety',
                  desc: 'Copy and host public Privacy Policy link; declare data encryption in transit.',
                },
                {
                  key: 'app_description',
                  title: '8. App Description & Metadata',
                  desc: 'Prepare short description (<80 chars) and detailed feature breakdown (<4000 chars).',
                },
                {
                  key: 'upload_aab',
                  title: '9. Upload .aab to Production Track',
                  desc: 'Upload generated release bundle, configure targeted countries & pricing (Free).',
                },
                {
                  key: 'submit_review',
                  title: '10. Submit for Review',
                  desc: 'Send release to Google review team (typical approval within 24–48 hours).',
                },
              ].map((item) => {
                const isChecked = !!checklistCompleted[item.key];
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() =>
                      setChecklistCompleted((prev) => ({
                        ...prev,
                        [item.key]: !prev[item.key],
                      }))
                    }
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                      isChecked
                        ? 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-lg shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                        isChecked
                          ? 'bg-indigo-600 text-white'
                          : 'border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div className="space-y-0.5">
                      <h4
                        className={`text-xs font-bold ${
                          isChecked ? 'text-indigo-900 dark:text-indigo-200 line-through' : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Asset & Metadata Generator Box */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Privacy Policy Copy Generator */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" /> Privacy Policy Generator
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    const text = `Privacy Policy for EduAI

EduAI ("we", "our") is committed to protecting your privacy. This policy explains how we handle user data in our application.

1. Information We Collect
- Account Information: Name, email address, role (Student, Teacher, Parent, Admin), and grade level.
- Usage Data: Selected courses, quiz results, study plan progress, and AI tutor chat history.
- Device Data: Device type, browser type, and optional crash logs for debugging purposes.

2. How We Use Data
- To personalize learning content and AI tutoring recommendations.
- To maintain your learning streak and XP leaderboards.
- To enable offline caching of study materials and videos.

3. Data Security & Storage
- Data is encrypted in transit via SSL/TLS.
- User data is securely managed via Google Firebase Authentication and Cloud Firestore.
- We do NOT sell or rent your personal information to third parties.

4. Contact Us
For privacy inquiries, contact support@eduai.com.`;
                    navigator.clipboard.writeText(text);
                    setPublishCopied('privacy');
                    setTimeout(() => setPublishCopied(null), 2000);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{publishCopied === 'privacy' ? 'Copied!' : 'Copy Policy Text'}</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-[11px] font-mono text-slate-700 dark:text-slate-300 h-52 overflow-y-auto leading-relaxed">
                <p className="font-bold text-slate-900 dark:text-white mb-2">Privacy Policy for EduAI</p>
                <p className="mb-2">EduAI is committed to protecting user privacy. This policy covers account info, learning progress, and AI chat interactions.</p>
                <p className="mb-2"><strong>Data Storage:</strong> Secured via Google Firebase Firestore with TLS 1.3 encryption in transit.</p>
                <p className="mb-2"><strong>No Third-Party Sharing:</strong> Personal data is strictly used for educational functionality and streak tracking.</p>
              </div>
            </div>

            {/* Play Store App Description Copy Generator */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Play Store App Description
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    const text = `EduAI: All-in-One AI Learning Platform (LKG to Degree)

Transform your education with EduAI! Designed for Students, Teachers, and Parents across all education levels from LKG to Degree programs.

🌟 Key Features:
- 🤖 24/7 AI Tutor & Voice Classroom: Step-by-step doubt solving and voice lessons in 12 languages.
- 📚 Complete Curriculum: State Board, CBSE, ICSE, Degree & Competitive Exams (JEE, NEET, AP EAPCET).
- 📁 Offline Vault: Download PDF textbooks, formula handbooks, and previous year question papers.
- 📝 Mock Tests & Flashcards: Interactive quizzes with detailed explanations and instant scoring.
- 🎯 Gamification: Track daily learning streaks, earn XP, and climb the student leaderboards.
- 📊 Parent & Teacher Dashboards: Monitor real-time student progress, attendance, and exam analytics.

Download EduAI today and supercharge your academic success!`;
                    navigator.clipboard.writeText(text);
                    setPublishCopied('desc');
                    setTimeout(() => setPublishCopied(null), 2000);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{publishCopied === 'desc' ? 'Copied!' : 'Copy Description'}</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-[11px] text-slate-700 dark:text-slate-300 h-52 overflow-y-auto leading-relaxed">
                <p className="font-bold text-slate-900 dark:text-white mb-2">Short Description (&lt;80 chars):</p>
                <p className="mb-3 text-indigo-600 dark:text-indigo-400 font-bold">EduAI: AI Tutor, Courses, Mock Tests & PDF Study Materials (LKG to Degree)</p>
                <p className="font-bold text-slate-900 dark:text-white mb-1">Full Description Preview:</p>
                <p className="text-slate-600 dark:text-slate-400">Transform your education with EduAI! Includes 24/7 AI Tutor, Voice Classes, Offline PDF Vault, and Mock Tests for State Board, CBSE, ICSE, and Competitive Exams.</p>
              </div>
            </div>
          </div>

          {/* CLI Command Generator Box for Bubblewrap / TWA */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-black text-amber-400 flex items-center gap-2">
                  <FileCode className="w-4 h-4" /> Trusted Web Activity (TWA) .AAB Build Command
                </h3>
                <p className="text-xs text-slate-400">Run Bubblewrap CLI to automatically package this PWA into an Android App Bundle (.aab)</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const cmd = `npx @bubblewrap/cli init --manifest=https://${window.location.host}/manifest.json\nnpx @bubblewrap/cli build`;
                  navigator.clipboard.writeText(cmd);
                  setPublishCopied('cli');
                  setTimeout(() => setPublishCopied(null), 2000);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5 shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{publishCopied === 'cli' ? 'Commands Copied!' : 'Copy Terminal Commands'}</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 font-mono text-xs text-emerald-400 space-y-2 border border-slate-800 overflow-x-auto">
              <p className="text-slate-500"># 1. Install Bubblewrap CLI & initialize project from live web manifest</p>
              <p className="text-emerald-300 font-bold">npx @bubblewrap/cli init --manifest=https://{typeof window !== 'undefined' ? window.location.host : 'ais-dev-sc3isu754flmt7x7g6jcys-485642152592.asia-east1.run.app'}/manifest.json</p>
              <p className="text-slate-500 pt-1"># 2. Build signed release bundle (.aab) ready for Google Play Console</p>
              <p className="text-emerald-300 font-bold">npx @bubblewrap/cli build</p>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 7: USER FEEDBACK & RELEASE UPDATES ==================== */}
      {activeTab === 'feedback_updates' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Card */}
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-black uppercase tracking-wider">
                    Continuous Improvement Cycle
                  </span>
                  <span className="text-xs text-indigo-200 font-medium">Live App Version: v1.2.0</span>
                </div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <History className="w-6 h-6 text-purple-400" /> User Feedback & Version Updates Hub
                </h2>
                <p className="text-xs text-indigo-200">
                  Listen to student & teacher feedback, fix reported issues, and release regular updates with automated changelog broadcasts.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddFeedbackModal(true)}
                  className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 backdrop-blur-md flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 text-purple-300" />
                  <span>Log User Feedback</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowNewReleaseModal(true)}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2 hover:brightness-105 transition-all"
                >
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>Publish New App Update</span>
                </button>
              </div>
            </div>

            {/* Metrics row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10">
                <p className="text-[10px] text-indigo-200 uppercase font-bold">Total Feedback Logged</p>
                <p className="text-sm font-black text-white">{feedbackList.length} Items</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10">
                <p className="text-[10px] text-indigo-200 uppercase font-bold">Features Shipped</p>
                <p className="text-sm font-black text-emerald-400">
                  {feedbackList.filter((f) => f.status === 'Shipped').length} Completed
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10">
                <p className="text-[10px] text-indigo-200 uppercase font-bold">In Active Development</p>
                <p className="text-sm font-black text-amber-400">
                  {feedbackList.filter((f) => f.status === 'In Progress' || f.status === 'Planned').length} Items
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10">
                <p className="text-[10px] text-indigo-200 uppercase font-bold">Release History</p>
                <p className="text-sm font-black text-purple-300">{releaseHistory.length} Live Versions</p>
              </div>
            </div>
          </div>

          {/* Section 1: User Feedback & Feature Request Backlog */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-600" /> Student & Teacher Feedback Backlog
                </h3>
                <p className="text-xs text-slate-400">Upvoted suggestions and feature requests directly from users</p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddFeedbackModal(true)}
                className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Feedback Item</span>
              </button>
            </div>

            <div className="space-y-3">
              {feedbackList.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                        {item.category}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {item.author} ({item.role})
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">• {item.date}</span>
                    </div>

                    {/* Status Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-400">Status:</span>
                      <select
                        value={item.status}
                        onChange={(e) => handleUpdateFeedbackStatus(item.id, e.target.value)}
                        className={`px-3 py-1 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                          item.status === 'Shipped'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300'
                            : item.status === 'In Progress'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300'
                            : item.status === 'Planned'
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-300'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300'
                        }`}
                      >
                        <option value="In Review">In Review</option>
                        <option value="Planned">Planned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Shipped">Shipped & Live</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                      <ThumbsUp className="w-3.5 h-3.5" /> {item.upvotes} Community Upvotes
                    </span>
                    {item.status === 'Shipped' && (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Released in v1.2.0
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Release Updates & Changelog History */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" /> Release Changelog History
                </h3>
                <p className="text-xs text-slate-400">Regular app updates broadcasted to all students and teachers</p>
              </div>

              <button
                type="button"
                onClick={() => setShowNewReleaseModal(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Draft New Version</span>
              </button>
            </div>

            <div className="space-y-4">
              {releaseHistory.map((rel, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black">
                        {rel.version}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                        {rel.type}
                      </span>
                      <span className="text-xs font-bold text-slate-400">• {rel.date}</span>
                    </div>

                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Broadcasted to All Users
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
                    {rel.title}
                  </h4>

                  <ul className="space-y-1.5 pt-1">
                    {rel.highlights.map((item, hIdx) => (
                      <li key={hIdx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 1: PUBLISH NEW VERSION UPDATE --- */}
      {showNewReleaseModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800 dark:text-slate-100">
                    Publish Regular App Update
                  </h3>
                  <p className="text-xs text-slate-400">Broadcast changelog to all users & log version history</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNewReleaseModal(false)}
                className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePublishRelease} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Version Code
                  </label>
                  <input
                    type="text"
                    value={newReleaseVersion}
                    onChange={(e) => setNewReleaseVersion(e.target.value)}
                    placeholder="e.g. v1.2.1"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Release Type
                  </label>
                  <select
                    value={newReleaseType}
                    onChange={(e) => setNewReleaseType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Feature Release">Feature Release</option>
                    <option value="Major Update">Major Update</option>
                    <option value="Maintenance & Patches">Maintenance & Patches</option>
                    <option value="Performance Polish">Performance Polish</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Release Title
                </label>
                <input
                  type="text"
                  value={newReleaseTitle}
                  onChange={(e) => setNewReleaseTitle(e.target.value)}
                  placeholder="e.g. Speed Optimizations & Offline Vault PDF Sync"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Changelog Highlights (1 per line)
                </label>
                <textarea
                  rows={4}
                  value={newReleaseHighlights}
                  onChange={(e) => setNewReleaseHighlights(e.target.value)}
                  placeholder={`- Added instant PDF offline cache toggle.\n- Fixed Voice Classroom audio stream reconnects.\n- Improved quiz score calculation precision.`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewReleaseModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Broadcast & Publish Update</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: LOG USER FEEDBACK --- */}
      {showAddFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800 dark:text-slate-100">
                    Log User Feedback / Request
                  </h3>
                  <p className="text-xs text-slate-400">Track suggestions from student, teacher, or parent feedback</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddFeedbackModal(false)}
                className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddFeedbackSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={newFeedbackCategory}
                  onChange={(e) => setNewFeedbackCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Feature Request">Feature Request</option>
                  <option value="Course Request">Course / Subject Request</option>
                  <option value="UI Improvement">UI & Accessibility</option>
                  <option value="Bug Report">Bug Report</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Feedback Title
                </label>
                <input
                  type="text"
                  value={newFeedbackTitle}
                  onChange={(e) => setNewFeedbackTitle(e.target.value)}
                  placeholder="e.g. Add chapter-wise formula quick reference cards"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Description
                </label>
                <textarea
                  rows={3}
                  value={newFeedbackContent}
                  onChange={(e) => setNewFeedbackContent(e.target.value)}
                  placeholder="Describe the requested feature, feedback, or subject material..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddFeedbackModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Feedback</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD USER MODAL --- */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800 dark:text-slate-100">
                    Create New User Account
                  </h3>
                  <p className="text-xs text-slate-400">Add a student, teacher, or parent account</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAddUserModal(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Anusha Rao"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@eduai.in"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={newUserMobile}
                    onChange={(e) => setNewUserMobile(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Account Role *
                  </label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="parent">Parent</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Grade Level *
                  </label>
                  <select
                    value={newUserLevel}
                    onChange={(e) => setNewUserLevel(e.target.value as EducationLevel)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                  >
                    <option value="LKG">LKG</option>
                    <option value="UKG">UKG</option>
                    <option value="Class 1–5">Class 1–5</option>
                    <option value="Class 6–10">Class 6–10</option>
                    <option value="Intermediate (11–12)">Intermediate (11–12)</option>
                    <option value="Degree (BSc, BCom, BA, BTech)">Degree / BTech</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create User Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD COURSE MODAL --- */}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800 dark:text-slate-100">
                    Create New Course
                  </h3>
                  <p className="text-xs text-slate-400">Add a new curriculum course to the catalog</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAddCourseModal(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCourseSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Course Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Advanced Calculus & Vector Algebra"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Subject *
                  </label>
                  <select
                    value={courseSubject}
                    onChange={(e) => setCourseSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Telugu">Telugu</option>
                    <option value="English">English</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Target Grade Level *
                  </label>
                  <select
                    value={courseLevel}
                    onChange={(e) => setCourseLevel(e.target.value as EducationLevel)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                  >
                    <option value="LKG">LKG</option>
                    <option value="UKG">UKG</option>
                    <option value="Class 1–5">Class 1–5</option>
                    <option value="Class 6–10">Class 6–10</option>
                    <option value="Intermediate (11–12)">Intermediate (11–12)</option>
                    <option value="Degree (BSc, BCom, BA, BTech)">Degree / BTech</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Instructor Name *
                </label>
                <input
                  type="text"
                  required
                  value={courseInstructor}
                  onChange={(e) => setCourseInstructor(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Course Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Overview of curriculum chapters, solved examples, and textbook alignment..."
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Course</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
