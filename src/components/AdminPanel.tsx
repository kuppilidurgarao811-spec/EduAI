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
} from 'lucide-react';
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

  // Primary Tab state: 'analytics' | 'users' | 'courses' | 'uploads' | 'notifications'
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'courses' | 'uploads' | 'notifications'>('analytics');

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
      </div>

      {/* ==================== TAB 1: ANALYTICS & INSIGHTS ==================== */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Executive KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400 font-bold uppercase">Active Students</p>
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">1,480+</h3>
              <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% this month
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400 font-bold uppercase">Avg Completion Rate</p>
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">78.4%</h3>
              <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +5.2% vs target
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400 font-bold uppercase">Video Streamed</p>
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                  <Video className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">14,250h</h3>
              <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                120 FPS HD Smooth
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400 font-bold uppercase">PDF Handbooks Saved</p>
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                  <Download className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">8,920</h3>
              <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                Offline Ready Vault
              </p>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Growth Chart */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" /> User Growth & Engagement
                  </h3>
                  <p className="text-xs text-slate-400">Active students and PDF downloads over time</p>
                </div>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={USER_GROWTH_DATA}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
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
                    <Area type="monotone" dataKey="activeUsers" name="Active Students" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                    <Area type="monotone" dataKey="downloads" name="PDF Downloads" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorDownloads)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Content Type Pie Chart */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-purple-600" /> Content Type Usage
                </h3>
                <p className="text-xs text-slate-400">Distribution across learning modes</p>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={CONTENT_TYPE_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                      {CONTENT_TYPE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 pt-2">
                {CONTENT_TYPE_DATA.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.name}
                    </span>
                    <span>{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subject Engagement Bar Chart */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-500" /> Subject Watch Hours
                </h3>
                <p className="text-xs text-slate-400">Total student time spent per subject</p>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SUBJECT_ENGAGEMENT_DATA}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
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
                    <Bar dataKey="hours" name="Streamed Hours" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Grade Level Distribution Chart */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-500" /> Student Enrollment by Grade
                </h3>
                <p className="text-xs text-slate-400">Distribution across education levels</p>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={GRADE_DISTRIBUTION_DATA}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="grade" stroke="#94a3b8" fontSize={11} />
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
                    <Bar dataKey="students" name="Enrolled Students" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
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
