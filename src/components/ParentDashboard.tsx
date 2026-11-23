import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  MessageSquare,
  AlertCircle,
  Calendar as CalendarIcon,
  BookOpen,
  FileText,
  Download,
  Printer,
  Check,
  X,
  PhoneCall,
  Bell,
  Sliders,
  Send,
  BarChart3,
  Flame,
  ShieldCheck,
  HelpCircle,
  GraduationCap,
  PieChart,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ChildProfile {
  id: string;
  name: string;
  avatar: string;
  grade: string;
  schoolName: string;
  rollNumber: string;
  classRank: number;
  totalClassStudents: number;
  syllabusPercent: number;
  streak: number;
  attendancePercent: number;
  daysPresent: number;
  daysAbsent: number;
  daysLate: number;
  totalWorkingDays: number;
  learningHoursThisWeek: number;
  studyGoalHours: number;
  averageGrade: string;
  gpa: number;
  aiConductRemark: string;
  attendanceLog: { date: string; day: string; status: 'Present' | 'Late' | 'Absent' | 'Holiday'; topicCovered: string }[];
  subjectProgress: { subject: string; scorePercent: number; completedModules: number; totalModules: number; status: string }[];
  testScores: { testName: string; subject: string; date: string; scoredMarks: number; maxMarks: number; scorePercent: number; percentile: number; teacherFeedback: string }[];
  homeworkStatus: { title: string; subject: string; dueDate: string; status: 'Graded' | 'Submitted' | 'Pending'; score?: string }[];
  weeklyLearningTime: { day: string; hours: number; aiQueries: number; videosWatched: number }[];
  weakTopics: { topic: string; subject: string; score: number; aiRecommendation: string }[];
  strongTopics: { topic: string; subject: string; score: number }[];
}

const CHILDREN_DATA: ChildProfile[] = [
  {
    id: 'ch-1',
    name: 'Raju Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    grade: 'Class 10 (SSC Board Prep)',
    schoolName: 'Govt Model High School, Visakhapatnam',
    rollNumber: '10-A-42',
    classRank: 3,
    totalClassStudents: 48,
    syllabusPercent: 88,
    streak: 12,
    attendancePercent: 96,
    daysPresent: 48,
    daysAbsent: 1,
    daysLate: 1,
    totalWorkingDays: 50,
    learningHoursThisWeek: 16.5,
    studyGoalHours: 18.0,
    averageGrade: 'A+ (92.4%)',
    gpa: 9.6,
    aiConductRemark: 'Raju is exceptionally punctual and active in STEM video lectures. Daily streak is strong. Focused effort needed in Quadratic Formula factor proofs.',
    attendanceLog: [
      { date: '2026-08-10', day: 'Mon', status: 'Present', topicCovered: 'Trigonometry & Heights and Distances' },
      { date: '2026-08-08', day: 'Sat', status: 'Present', topicCovered: 'Electromagnetic Induction & Lenz Law' },
      { date: '2026-08-07', day: 'Fri', status: 'Present', topicCovered: 'Organic Chemistry Reactions' },
      { date: '2026-08-06', day: 'Thu', status: 'Late', topicCovered: 'Telugu Grammar (సంధులు)' },
      { date: '2026-08-05', day: 'Wed', status: 'Present', topicCovered: 'Social Studies Board PYQ Review' },
      { date: '2026-08-04', day: 'Tue', status: 'Present', topicCovered: 'English Prose & Grammar' },
      { date: '2026-08-03', day: 'Mon', status: 'Absent', topicCovered: 'Medical Leave (Submitted slip)' },
    ],
    subjectProgress: [
      { subject: 'Mathematics', scorePercent: 95, completedModules: 18, totalModules: 20, status: 'Mastered' },
      { subject: 'Science (Physics & Chem)', scorePercent: 91, completedModules: 15, totalModules: 18, status: 'On Track' },
      { subject: 'Social Studies', scorePercent: 88, completedModules: 14, totalModules: 16, status: 'On Track' },
      { subject: 'Telugu Language', scorePercent: 90, completedModules: 12, totalModules: 14, status: 'Good' },
      { subject: 'English & Grammar', scorePercent: 94, completedModules: 16, totalModules: 16, status: 'Mastered' },
    ],
    testScores: [
      {
        testName: 'Class 10 Trigonometry Mock Board Exam',
        subject: 'Mathematics',
        date: '2026-08-08',
        scoredMarks: 48,
        maxMarks: 50,
        scorePercent: 96,
        percentile: 98,
        teacherFeedback: 'Outstanding step-by-step proofs! Keep up the speed.',
      },
      {
        testName: 'Physics Electromagnetic Quiz 3',
        subject: 'Physics',
        date: '2026-08-04',
        scoredMarks: 26,
        maxMarks: 30,
        scorePercent: 86.6,
        percentile: 90,
        teacherFeedback: 'Solid understanding of Lenz law. Re-verify sign conventions.',
      },
      {
        testName: 'Telugu Grammar (సంధులు) Weekly Test',
        subject: 'Telugu',
        date: '2026-07-28',
        scoredMarks: 45,
        maxMarks: 50,
        scorePercent: 90,
        percentile: 92,
        teacherFeedback: 'Very good vocabulary and sandhi splits.',
      },
      {
        testName: 'Social Studies Model Paper 1',
        subject: 'Social Studies',
        date: '2026-07-20',
        scoredMarks: 42,
        maxMarks: 50,
        scorePercent: 84,
        percentile: 88,
        teacherFeedback: 'Draw map keys clearly for 5 marks bonus.',
      },
    ],
    homeworkStatus: [
      { title: 'Class 10 Board Prep: Heights and Distances Homework', subject: 'Mathematics', dueDate: '2026-08-15', status: 'Submitted', score: 'Pending Grade' },
      { title: 'Chemical Equations Redox Balancing Worksheet', subject: 'Science', dueDate: '2026-08-05', status: 'Graded', score: '20/20' },
      { title: 'Telugu Article Essay Writing', subject: 'Telugu', dueDate: '2026-08-02', status: 'Graded', score: '18/20' },
    ],
    weeklyLearningTime: [
      { day: 'Mon', hours: 2.8, aiQueries: 14, videosWatched: 3 },
      { day: 'Tue', hours: 2.4, aiQueries: 8, videosWatched: 2 },
      { day: 'Wed', hours: 1.5, aiQueries: 5, videosWatched: 1 },
      { day: 'Thu', hours: 2.9, aiQueries: 12, videosWatched: 4 },
      { day: 'Fri', hours: 3.1, aiQueries: 18, videosWatched: 3 },
      { day: 'Sat', hours: 2.2, aiQueries: 9, videosWatched: 2 },
      { day: 'Sun', hours: 1.6, aiQueries: 4, videosWatched: 1 },
    ],
    weakTopics: [
      { topic: 'Quadratic Formula Factor Proofs', subject: 'Mathematics', score: 62, aiRecommendation: 'Complete 15 mins guided AI practice on split-the-middle term steps.' },
      { topic: 'Ray Optics Lens Formula Sign Convention', subject: 'Physics', score: 70, aiRecommendation: 'Watch 3D ray diagram simulation video in Study Vault.' },
    ],
    strongTopics: [
      { topic: 'Trigonometric Identities & Heights', subject: 'Mathematics', score: 98 },
      { topic: 'Electric Current & Ohm Law', subject: 'Physics', score: 95 },
      { topic: 'Telugu Grammar (సంధులు)', subject: 'Telugu', score: 92 },
    ],
  },
  {
    id: 'ch-2',
    name: 'Ananya Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    grade: 'Class 7 (Middle School)',
    schoolName: 'St. Marys High School, Visakhapatnam',
    rollNumber: '07-B-14',
    classRank: 1,
    totalClassStudents: 42,
    syllabusPercent: 94,
    streak: 21,
    attendancePercent: 100,
    daysPresent: 50,
    daysAbsent: 0,
    daysLate: 0,
    totalWorkingDays: 50,
    learningHoursThisWeek: 19.2,
    studyGoalHours: 15.0,
    averageGrade: 'O Grade (97.8%)',
    gpa: 10.0,
    aiConductRemark: 'Ananya is an top-performing student with a perfect attendance record. Excellent speed in mental arithmetic & English essay writing.',
    attendanceLog: [
      { date: '2026-08-10', day: 'Mon', status: 'Present', topicCovered: 'Algebraic Expressions & Identities' },
      { date: '2026-08-08', day: 'Sat', status: 'Present', topicCovered: 'Plant Cell Structure & Photosynthesis' },
      { date: '2026-08-07', day: 'Fri', status: 'Present', topicCovered: 'English Grammar & Speech' },
      { date: '2026-08-06', day: 'Thu', status: 'Present', topicCovered: 'History: Mughal Empire Timeline' },
    ],
    subjectProgress: [
      { subject: 'Mathematics', scorePercent: 99, completedModules: 15, totalModules: 15, status: 'Mastered' },
      { subject: 'Science', scorePercent: 97, completedModules: 14, totalModules: 14, status: 'Mastered' },
      { subject: 'English', scorePercent: 98, completedModules: 12, totalModules: 12, status: 'Mastered' },
    ],
    testScores: [
      {
        testName: 'Algebra & Linear Equations Term Test',
        subject: 'Mathematics',
        date: '2026-08-07',
        scoredMarks: 50,
        maxMarks: 50,
        scorePercent: 100,
        percentile: 100,
        teacherFeedback: 'Flawless performance! Class topper.',
      },
    ],
    homeworkStatus: [
      { title: 'Algebra Equations Exercise 4.2', subject: 'Mathematics', dueDate: '2026-08-12', status: 'Graded', score: '20/20' },
    ],
    weeklyLearningTime: [
      { day: 'Mon', hours: 3.0, aiQueries: 10, videosWatched: 4 },
      { day: 'Tue', hours: 2.8, aiQueries: 12, videosWatched: 3 },
      { day: 'Wed', hours: 2.5, aiQueries: 8, videosWatched: 2 },
      { day: 'Thu', hours: 3.2, aiQueries: 15, videosWatched: 4 },
      { day: 'Fri', hours: 3.5, aiQueries: 20, videosWatched: 5 },
      { day: 'Sat', hours: 2.2, aiQueries: 9, videosWatched: 2 },
      { day: 'Sun', hours: 2.0, aiQueries: 6, videosWatched: 2 },
    ],
    weakTopics: [
      { topic: 'Symmetry & Rotational Geometry', subject: 'Mathematics', score: 82, aiRecommendation: 'Interactive shape 3D tools in AI Studio.' },
    ],
    strongTopics: [
      { topic: 'Algebraic Expressions', subject: 'Mathematics', score: 100 },
      { topic: 'Cell Biology', subject: 'Science', score: 98 },
    ],
  },
];

export const ParentDashboard: React.FC = () => {
  const { addChatMessage, setActiveTab, user } = useAuth();

  // Active Child Selection
  const [selectedChildId, setSelectedChildId] = useState<string>(CHILDREN_DATA[0].id);
  const currentChild = CHILDREN_DATA.find((c) => c.id === selectedChildId) || CHILDREN_DATA[0];

  // Active Tab View
  const [activeTab, setActiveTabSection] = useState<
    'progress' | 'attendance' | 'quizzes' | 'time' | 'reports'
  >('progress');

  // SMS & WhatsApp Alerts Toggles State
  const [smsAttendance, setSmsAttendance] = useState(true);
  const [smsLowScores, setSmsLowScores] = useState(true);
  const [whatsappDigest, setWhatsappDigest] = useState(true);
  const [teacherCallAlerts, setTeacherCallAlerts] = useState(false);
  const [settingsSavedSuccess, setSettingsSavedSuccess] = useState(false);

  // Teacher Direct Note Modal
  const [showTeacherMessageModal, setShowTeacherMessageModal] = useState(false);
  const [teacherNoteText, setTeacherNoteText] = useState('');
  const [teacherNoteSentSuccess, setTeacherNoteSentSuccess] = useState(false);

  // Official PDF Report Card Modal
  const [showReportCardModal, setShowReportCardModal] = useState(false);

  const handleSaveAlertSettings = () => {
    setSettingsSavedSuccess(true);
    setTimeout(() => setSettingsSavedSuccess(false), 4000);
  };

  const handleSendTeacherNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherNoteText.trim()) return;
    setTeacherNoteSentSuccess(true);
    setTimeout(() => {
      setTeacherNoteSentSuccess(false);
      setShowTeacherMessageModal(false);
      setTeacherNoteText('');
    }, 2000);
  };

  const triggerAiAdvisorPrompt = (promptText: string) => {
    addChatMessage({
      id: `m-${Date.now()}`,
      role: 'user',
      text: promptText,
      timestamp: 'Just now',
    });
    setActiveTab('ai-tutor');
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-in fade-in duration-200">
      {/* TOP PARENT PORTAL HEADER BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-slate-900 text-white shadow-xl border border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5 text-amber-300" />
            Official Parent & Guardian Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {user.name || 'Srinivas Sharma'} • Parent Dashboard
          </h1>
          <p className="text-amber-100/90 text-xs sm:text-sm leading-relaxed">
            Monitor real-time academic progress, daily classroom attendance, exam scores, AI study hours, and download official weekly report cards.
          </p>
        </div>

        {/* CHILD SWITCHER PILLS & AI ADVISOR BUTTON */}
        <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <div className="bg-slate-900/60 p-1.5 rounded-2xl border border-white/10 flex items-center gap-1">
            {CHILDREN_DATA.map((child) => {
              const isSelected = child.id === currentChild.id;
              return (
                <button
                  key={child.id}
                  onClick={() => setSelectedChildId(child.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <img src={child.avatar} alt={child.name} className="w-5 h-5 rounded-full object-cover" />
                  <span>{child.name}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() =>
              triggerAiAdvisorPrompt(
                `As the parent of ${currentChild.name} (${currentChild.grade}), please analyze his/her weekly study performance, test scores in ${currentChild.subjectProgress[0].subject}, attendance (${currentChild.attendancePercent}%), and give me 3 actionable parenting tips to boost revision.`
              )
            }
            className="px-4 py-2.5 rounded-2xl bg-white text-slate-900 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg hover:bg-amber-50 transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Ask AI Parent Advisor</span>
          </button>
        </div>
      </div>

      {/* SELECTED CHILD QUICK IDENTIFIER CARD */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentChild.avatar}
            alt={currentChild.name}
            className="w-14 h-14 rounded-2xl object-cover ring-4 ring-amber-500/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">{currentChild.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase">
                {currentChild.grade}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {currentChild.schoolName} • Roll No: <strong>{currentChild.rollNumber}</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 block font-bold">Class Rank</span>
            <span className="text-sm font-black text-amber-500">
              #{currentChild.classRank} <span className="text-[10px] text-slate-400">/ {currentChild.totalClassStudents}</span>
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 block font-bold">Overall GPA</span>
            <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{currentChild.gpa} / 10</span>
          </div>

          <button
            onClick={() => setShowTeacherMessageModal(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs flex items-center gap-1.5 hover:bg-indigo-100 transition-all ml-auto sm:ml-0"
          >
            <MessageSquare className="w-4 h-4" /> Message Teacher
          </button>
        </div>
      </div>

      {/* PARENT DASHBOARD SUB-NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'progress', label: 'Monitor Progress', icon: BarChart3, badge: `${currentChild.syllabusPercent}% Covered` },
          { id: 'attendance', label: 'Attendance Meter', icon: CalendarIcon, badge: `${currentChild.attendancePercent}% Present` },
          { id: 'quizzes', label: 'Quiz & Homework Scores', icon: Award, badge: `${currentChild.testScores.length} Tests` },
          { id: 'time', label: 'Learning Time Analytics', icon: Clock, badge: `${currentChild.learningHoursThisWeek} hrs/wk` },
          { id: 'reports', label: 'Weekly AI Reports & Alerts', icon: FileText, badge: 'PDF & SMS' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabSection(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-amber-500'}`} />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENTS */}
      <AnimatePresence mode="wait">
        {/* ==================================================================== */}
        {/* SECTION 1: MONITOR STUDENT PROGRESS */}
        {/* ==================================================================== */}
        {activeTab === 'progress' && (
          <motion.div
            key="section-progress"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* KPI Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-2xl font-black text-amber-500">🔥 {currentChild.streak} Days</div>
                  <div className="text-xs font-semibold text-slate-500">Active Study Streak</div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-500 flex items-center justify-center font-bold">
                  <Flame className="w-5 h-5" />
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-2xl font-black text-emerald-600">{currentChild.syllabusPercent}%</div>
                  <div className="text-xs font-semibold text-slate-500">Syllabus Completed</div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    {currentChild.averageGrade}
                  </div>
                  <div className="text-xs font-semibold text-slate-500">Average Grade Performance</div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
                    {currentChild.learningHoursThisWeek} hrs
                  </div>
                  <div className="text-xs font-semibold text-slate-500">Weekly Learning Hours</div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* AI Conduct & Study Recommendation Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-900 text-white shadow-md border border-indigo-700/40 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-sm text-indigo-100">AI Pedagogical Conduct & Progress Summary</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{currentChild.aiConductRemark}"
              </p>
            </div>

            {/* Subject Mastery Progress Bars */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  Subject-wise Syllabus Completion & Mastery
                </h3>

                <div className="space-y-4">
                  {currentChild.subjectProgress.map((sub, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-800 dark:text-slate-200">{sub.subject}</span>
                        <span className="text-slate-500">
                          {sub.completedModules} / {sub.totalModules} Modules ({sub.scorePercent}%)
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-amber-500 rounded-full transition-all duration-500"
                          style={{ width: `${sub.scorePercent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths vs Weak Topics Diagnostic */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-rose-500" />
                    Topics Requiring Parent Attention
                  </h3>

                  <div className="space-y-3">
                    {currentChild.weakTopics.map((w, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 space-y-2"
                      >
                        <div className="flex items-center justify-between font-extrabold text-xs text-rose-900 dark:text-rose-200">
                          <span>{w.topic}</span>
                          <span className="px-2 py-0.5 rounded bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 text-[10px]">
                            {w.score}% Score
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                          <strong>AI Plan:</strong> {w.aiRecommendation}
                        </p>
                        <button
                          onClick={() =>
                            triggerAiAdvisorPrompt(
                              `Explain ${w.topic} in very simple terms so I can explain it to my child ${currentChild.name}. Include 2 practice questions with solutions.`
                            )
                          }
                          className="text-[11px] font-extrabold text-rose-700 dark:text-rose-300 hover:underline flex items-center gap-1 pt-1"
                        >
                          <Sparkles className="w-3.5 h-3.5" /> Explain this topic to me →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strong Topics */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <h3 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Top Performing Strengths
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentChild.strongTopics.map((s, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800"
                      >
                        🌟 {s.topic} ({s.score}%)
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* SECTION 2: ATTENDANCE METER & CALENDAR */}
        {/* ==================================================================== */}
        {activeTab === 'attendance' && (
          <motion.div
            key="section-attendance"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Attendance Meter & Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-lg space-y-4 text-center flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/40 flex items-center justify-center text-3xl font-black">
                  {currentChild.attendancePercent}%
                </div>
                <div>
                  <h3 className="text-lg font-black">Class Attendance Status</h3>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    {currentChild.attendancePercent >= 90
                      ? 'Excellent Attendance Record (On Track for SCERT Board Hall Ticket)'
                      : 'Needs Improvement'}
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 md:col-span-2">
                <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                  Monthly Attendance Breakdown
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center">
                    <span className="text-xl font-black text-emerald-600">{currentChild.daysPresent} Days</span>
                    <span className="text-[11px] text-slate-500 block font-bold">Present</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-center">
                    <span className="text-xl font-black text-amber-600">{currentChild.daysLate} Days</span>
                    <span className="text-[11px] text-slate-500 block font-bold">Late Arrival</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-center">
                    <span className="text-xl font-black text-rose-600">{currentChild.daysAbsent} Days</span>
                    <span className="text-[11px] text-slate-500 block font-bold">Absences</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                    <span className="text-xl font-black text-slate-700 dark:text-slate-300">
                      {currentChild.totalWorkingDays} Days
                    </span>
                    <span className="text-[11px] text-slate-500 block font-bold">Total Working Days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Attendance Log Table */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-indigo-600" />
                Recent Daily Class Attendance & Topic Log
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-200">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3 rounded-l-xl">Date & Day</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 rounded-r-xl">Class Topic Covered That Day</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {currentChild.attendanceLog.map((log, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-bold">
                          {log.date} ({log.day})
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                              log.status === 'Present'
                                ? 'bg-emerald-500/10 text-emerald-600'
                                : log.status === 'Late'
                                ? 'bg-amber-500/10 text-amber-600'
                                : 'bg-rose-500/10 text-rose-600'
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="p-3 font-medium text-slate-600 dark:text-slate-300">{log.topicCovered}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* SECTION 3: QUIZ & HOMEWORK SCORES */}
        {/* ==================================================================== */}
        {activeTab === 'quizzes' && (
          <motion.div
            key="section-quizzes"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Test History Table */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                Exam & Quiz Score Log
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-200">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3 rounded-l-xl">Test Name</th>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Score Marks</th>
                      <th className="p-3">Percentile</th>
                      <th className="p-3 rounded-r-xl">Teacher Comments</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {currentChild.testScores.map((t, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-extrabold text-slate-800 dark:text-slate-100">{t.testName}</td>
                        <td className="p-3 font-bold text-indigo-600">{t.subject}</td>
                        <td className="p-3 text-slate-400">{t.date}</td>
                        <td className="p-3 font-black text-emerald-600 text-sm">
                          {t.scoredMarks} / {t.maxMarks} ({t.scorePercent}%)
                        </td>
                        <td className="p-3 font-bold text-amber-500">{t.percentile}th Percentile</td>
                        <td className="p-3 text-slate-500 italic">"{t.teacherFeedback}"</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Homework Status */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Homework Submissions & Grades
              </h3>

              <div className="space-y-3">
                {currentChild.homeworkStatus.map((hw, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-extrabold text-xs text-slate-800 dark:text-slate-100">{hw.title}</div>
                      <div className="text-[11px] text-slate-400">
                        Subject: {hw.subject} • Due Date: {hw.dueDate}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black ${
                          hw.status === 'Graded'
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-amber-500/10 text-amber-600'
                        }`}
                      >
                        {hw.status} ({hw.score})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* SECTION 4: LEARNING TIME ANALYTICS */}
        {/* ==================================================================== */}
        {activeTab === 'time' && (
          <motion.div
            key="section-time"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Weekly Hours Bar Chart */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    Weekly Digital Learning Time ({currentChild.learningHoursThisWeek} / {currentChild.studyGoalHours} hrs)
                  </h3>
                  <p className="text-xs text-slate-500">Daily breakdown of study time spent on lectures and AI tutor</p>
                </div>

                <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full">
                  Target 92% Achieved
                </span>
              </div>

              {/* Graphical Bar Representation */}
              <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 pt-6 pb-2 border-b border-slate-100 dark:border-slate-800">
                {currentChild.weeklyLearningTime.map((d, i) => {
                  const heightPercent = Math.min(100, (d.hours / 4.0) * 100);
                  return (
                    <div key={i} className="flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] font-extrabold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        {d.hours}h
                      </span>
                      <div className="w-full max-w-[36px] bg-slate-100 dark:bg-slate-800 rounded-t-xl h-full flex items-end overflow-hidden">
                        <div
                          className="w-full bg-gradient-to-t from-purple-600 to-indigo-500 rounded-t-xl transition-all duration-500 group-hover:from-purple-500 group-hover:to-amber-400"
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                      <span className="text-xs font-black text-slate-700 dark:text-slate-300">{d.day}</span>
                    </div>
                  );
                })}
              </div>

              {/* Detailed Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[11px] text-slate-400 font-bold block">AI Tutor Doubts Asked</span>
                  <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                    {currentChild.weeklyLearningTime.reduce((acc, curr) => acc + curr.aiQueries, 0)} Questions
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[11px] text-slate-400 font-bold block">Video Lectures Completed</span>
                  <span className="text-lg font-black text-purple-600 dark:text-purple-400">
                    {currentChild.weeklyLearningTime.reduce((acc, curr) => acc + curr.videosWatched, 0)} Videos
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[11px] text-slate-400 font-bold block">Daily Average Focus</span>
                  <span className="text-lg font-black text-emerald-600">
                    {(currentChild.learningHoursThisWeek / 7).toFixed(1)} Hours / Day
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* SECTION 5: WEEKLY REPORTS, PDF & SMS CONTROLS */}
        {/* ==================================================================== */}
        {activeTab === 'reports' && (
          <motion.div
            key="section-reports"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Download Official Report Card Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black">Official Weekly Performance Certificate & Report Card</h3>
                <p className="text-xs text-amber-100 mt-1">
                  Generate a verified, printable report card PDF for {currentChild.name} with subject marks, attendance slip, and teacher sign-off.
                </p>
              </div>

              <button
                onClick={() => setShowReportCardModal(true)}
                className="px-5 py-3 rounded-2xl bg-white text-slate-900 font-extrabold text-xs flex items-center gap-2 hover:bg-amber-50 transition-all shrink-0 shadow-md"
              >
                <Printer className="w-4 h-4 text-amber-600" />
                <span>View & Print Report Card PDF</span>
              </button>
            </div>

            {/* Automated SMS & WhatsApp Alerts Setup */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-indigo-600" />
                    Automated SMS & WhatsApp Parent Notification Rules
                  </h3>
                  <p className="text-xs text-slate-500">Configure instant mobile alerts sent directly to registered phone number</p>
                </div>

                {settingsSavedSuccess && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full animate-in fade-in">
                    ✓ Notification rules saved!
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: 'Daily Attendance SMS Alert',
                    desc: 'Receive immediate SMS at 10:15 AM if child is marked Late or Absent.',
                    state: smsAttendance,
                    setter: setSmsAttendance,
                  },
                  {
                    title: 'Low Quiz Score Warning (< 75%)',
                    desc: 'Instant WhatsApp message when exam score falls below passing threshold.',
                    state: smsLowScores,
                    setter: setSmsLowScores,
                  },
                  {
                    title: 'Weekly Performance Digest (Sunday 6:00 PM)',
                    desc: 'Comprehensive summary of study hours, rank changes, and teacher notes.',
                    state: whatsappDigest,
                    setter: setWhatsappDigest,
                  },
                  {
                    title: 'Teacher Urgent Voice Call Callback',
                    desc: 'Allow class teacher to initiate direct urgent voice callback regarding conduct.',
                    state: teacherCallAlerts,
                    setter: setTeacherCallAlerts,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="font-extrabold text-xs text-slate-800 dark:text-slate-100">{item.title}</div>
                      <div className="text-[11px] text-slate-500">{item.desc}</div>
                    </div>

                    <button
                      onClick={() => {
                        item.setter(!item.state);
                        handleSaveAlertSettings();
                      }}
                      className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                        item.state ? 'bg-amber-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          item.state ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* MODAL 1: MESSAGE CLASS TEACHER */}
      {/* ==================================================================== */}
      {showTeacherMessageModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                Send Direct Message to Class Teacher
              </h3>
              <button
                onClick={() => setShowTeacherMessageModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {teacherNoteSentSuccess ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">Message Delivered!</h4>
                <p className="text-xs text-slate-500">Class teacher Dr. Anitha Rao has been notified via priority faculty portal.</p>
              </div>
            ) : (
              <form onSubmit={handleSendTeacherNote} className="space-y-4">
                <div className="text-xs text-slate-500">
                  Recipient: <strong>Dr. Anitha Rao (Class Teacher - {currentChild.grade})</strong>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Your Question or Conduct Request:
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={teacherNoteText}
                    onChange={(e) => setTeacherNoteText(e.target.value)}
                    placeholder={`Respected Teacher, I wanted to discuss ${currentChild.name}'s progress in Quadratic Math...`}
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowTeacherMessageModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-extrabold text-xs hover:bg-indigo-700 flex items-center gap-1.5"
                  >
                    <Send className="w-4 h-4" /> Send Note
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: OFFICIAL PRINTABLE REPORT CARD PDF */}
      {/* ==================================================================== */}
      {showReportCardModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-300 space-y-6 my-8 print:p-0">
            {/* Action Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 print:hidden">
              <span className="text-xs font-black text-amber-600 uppercase tracking-widest">
                Official SCERT / Board Format Weekly Certificate
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-amber-600 text-white font-extrabold text-xs flex items-center gap-1.5 hover:bg-amber-700 shadow-sm"
                >
                  <Printer className="w-4 h-4" /> Print Report Card
                </button>
                <button
                  onClick={() => setShowReportCardModal(false)}
                  className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 font-extrabold text-xs hover:bg-slate-200"
                >
                  Close
                </button>
              </div>
            </div>

            {/* REPORT CARD CERTIFICATE BODY */}
            <div className="border-4 border-amber-600 p-6 rounded-2xl space-y-6 bg-amber-50/20">
              {/* School & Platform Branding */}
              <div className="text-center space-y-1 border-b border-amber-200 pb-4">
                <div className="text-xs font-black text-amber-700 uppercase tracking-widest">
                  EduAI Smart Learning Platform & State Board System
                </div>
                <h2 className="text-2xl font-black text-slate-900">WEEKLY STUDENT PERFORMANCE REPORT CARD</h2>
                <p className="text-xs text-slate-600">Academic Session 2026–2027 • Visakhapatnam District</p>
              </div>

              {/* Student Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-white p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block font-bold">Student Name</span>
                  <strong className="text-slate-800 text-sm">{currentChild.name}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">Grade Level</span>
                  <strong className="text-slate-800">{currentChild.grade}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">Roll Number</span>
                  <strong className="text-slate-800">{currentChild.rollNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">Class Rank</span>
                  <strong className="text-amber-600">#{currentChild.classRank} / {currentChild.totalClassStudents}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">Attendance</span>
                  <strong className="text-emerald-600">{currentChild.attendancePercent}% Present</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">Average Grade</span>
                  <strong className="text-indigo-600">{currentChild.averageGrade}</strong>
                </div>
              </div>

              {/* Subject Marks Table */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">Subject Progress & Scores</h4>
                <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-2 border-b">Subject</th>
                      <th className="p-2 border-b">Syllabus Covered</th>
                      <th className="p-2 border-b">Score %</th>
                      <th className="p-2 border-b">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentChild.subjectProgress.map((sub, i) => (
                      <tr key={i} className="border-b border-slate-100">
                        <td className="p-2 font-bold text-slate-800">{sub.subject}</td>
                        <td className="p-2">{sub.completedModules} / {sub.totalModules} Modules</td>
                        <td className="p-2 font-black text-indigo-600">{sub.scorePercent}%</td>
                        <td className="p-2 font-bold text-emerald-600">{sub.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Conduct Remark */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed italic">
                <strong>Faculty & AI Conduct Remark:</strong> "{currentChild.aiConductRemark}"
              </div>

              {/* Signatures */}
              <div className="pt-6 border-t border-slate-200 flex items-end justify-between text-center text-xs text-slate-500">
                <div>
                  <div className="font-extrabold text-slate-800 text-sm italic">Dr. Anitha Rao</div>
                  <span className="text-[10px]">Class Faculty Signature</span>
                </div>
                <div>
                  <div className="font-extrabold text-amber-600 text-sm">EduAI Certified</div>
                  <span className="text-[10px]">Digital Verification Stamp</span>
                </div>
                <div>
                  <div className="font-extrabold text-slate-800 text-sm italic">{user.name || 'Srinivas Sharma'}</div>
                  <span className="text-[10px]">Parent / Guardian Signature</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
