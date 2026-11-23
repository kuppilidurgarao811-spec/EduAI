import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  PlusCircle,
  Upload,
  FileText,
  BarChart3,
  CheckCircle2,
  Sparkles,
  Search,
  BookOpen,
  Video,
  FileDown,
  MessageSquare,
  Bell,
  Award,
  Clock,
  Send,
  AlertCircle,
  Calendar,
  Check,
  Edit3,
  HelpCircle,
  ChevronRight,
  Filter,
  Eye,
  Trash2,
  UserCheck,
  PhoneCall,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MOCK_STUDENT_REPORTS, EDUCATION_LEVELS } from '../data/mockData';
import { Course, EducationLevel } from '../types';
import {
  TeacherLecture,
  TeacherAssignment,
  StudentSubmission,
  StudentDoubtMessage,
  ClassAnnouncement,
  INITIAL_TEACHER_LECTURES,
  INITIAL_TEACHER_ASSIGNMENTS,
  INITIAL_STUDENT_SUBMISSIONS,
  INITIAL_STUDENT_DOUBTS,
  INITIAL_ANNOUNCEMENTS,
} from '../data/mockTeacherData';

export const TeacherDashboard: React.FC = () => {
  const { addCourse, setActiveTab, addChatMessage, user, language } = useAuth();

  // Active Sub-Tab
  const [activeTabName, setActiveTabName] = useState<
    'overview' | 'lectures' | 'assignments' | 'progress' | 'grading' | 'communication'
  >('overview');

  // --- 1. LECTURES STATE ---
  const [lectures, setLectures] = useState<TeacherLecture[]>(INITIAL_TEACHER_LECTURES);
  const [showUploadLectureModal, setShowUploadLectureModal] = useState(false);
  const [lecTitle, setLecTitle] = useState('');
  const [lecSubject, setLecSubject] = useState('Mathematics');
  const [lecLevel, setLecLevel] = useState<EducationLevel>('Class 6–10');
  const [lecType, setLecType] = useState<'video' | 'pdf' | 'audio'>('video');
  const [lecDuration, setLecDuration] = useState('20 mins');
  const [lecDesc, setLecDesc] = useState('');
  const [lecUrl, setLecUrl] = useState('');

  // --- 2. ASSIGNMENTS STATE ---
  const [assignments, setAssignments] = useState<TeacherAssignment[]>(INITIAL_TEACHER_ASSIGNMENTS);
  const [showCreateAssignmentModal, setShowCreateAssignmentModal] = useState(false);
  const [asgTitle, setAsgTitle] = useState('');
  const [asgSubject, setAsgSubject] = useState('Mathematics');
  const [asgLevel, setAsgLevel] = useState<EducationLevel>('Class 6–10');
  const [asgDueDate, setAsgDueDate] = useState('2026-08-20');
  const [asgPoints, setAsgPoints] = useState(50);
  const [asgInstructions, setAsgInstructions] = useState('');
  const [isGeneratingAiQuestions, setIsGeneratingAiQuestions] = useState(false);

  // --- 3. STUDENT PROGRESS STATE ---
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [studentLevelFilter, setStudentLevelFilter] = useState<string>('All');

  // --- 4. GRADING STATE ---
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(INITIAL_STUDENT_SUBMISSIONS);
  const [selectedSubForGrading, setSelectedSubForGrading] = useState<StudentSubmission | null>(null);
  const [gradeInput, setGradeInput] = useState<number>(0);
  const [feedbackInput, setFeedbackInput] = useState<string>('');

  // --- 5. COMMUNICATION STATE ---
  const [announcements, setAnnouncements] = useState<ClassAnnouncement[]>(INITIAL_ANNOUNCEMENTS);
  const [doubts, setDoubts] = useState<StudentDoubtMessage[]>(INITIAL_STUDENT_DOUBTS);
  const [showNewAnnouncementModal, setShowNewAnnouncementModal] = useState(false);
  const [ancTitle, setAncTitle] = useState('');
  const [ancLevel, setAncLevel] = useState<EducationLevel>('Class 6–10');
  const [ancSubject, setAncSubject] = useState('Mathematics');
  const [ancContent, setAncContent] = useState('');

  const [selectedDoubtForReply, setSelectedDoubtForReply] = useState<StudentDoubtMessage | null>(null);
  const [doubtReplyText, setDoubtReplyText] = useState('');

  // Broadcast Alert Notification
  const [broadcastAlertSuccess, setBroadcastAlertSuccess] = useState<string | null>(null);

  // --- HANDLERS ---

  // Upload Lecture
  const handleUploadLecture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lecTitle.trim()) return;

    const newLec: TeacherLecture = {
      id: `lec-${Date.now()}`,
      title: lecTitle,
      subject: lecSubject,
      level: lecLevel,
      type: lecType,
      durationOrPages: lecDuration || (lecType === 'pdf' ? '10 Pages PDF' : '15 mins'),
      uploadDate: new Date().toISOString().split('T')[0],
      viewsCount: 1,
      likesCount: 0,
      description: lecDesc || 'Faculty published lecture notes & interactive resource.',
      videoUrl: lecUrl,
    };

    setLectures([newLec, ...lectures]);
    setShowUploadLectureModal(false);
    setLecTitle('');
    setLecDesc('');
    setLecUrl('');
    alert('Lecture published successfully to student libraries!');
  };

  // AI Assistance for Assignment Questions
  const handleGenerateAiAssignment = async () => {
    setIsGeneratingAiQuestions(true);
    try {
      const response = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Create a 5-question homework assignment for Subject: ${asgSubject}, Grade Level: ${asgLevel}. Include question title, instructions, and target points. Format as clean text instructions.`,
          educationLevel: asgLevel,
          subject: asgSubject,
          language,
          speedMode: 'quick',
        }),
      });
      const data = await response.json();
      if (data.answer) {
        setAsgInstructions(data.answer);
      }
    } catch {
      setAsgInstructions(`1. Prove the trigonometric identity: sin²θ + cos²θ = 1.\n2. A tower stands vertically on the ground. From a point on the ground 15m away from foot of tower, angle of elevation is 60°. Find height.\n3. Solve the quadratic equation 2x² - 5x + 3 = 0 using factorization.`);
    } finally {
      setIsGeneratingAiQuestions(false);
    }
  };

  // Create Assignment
  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asgTitle.trim()) return;

    const newAsg: TeacherAssignment = {
      id: `asg-${Date.now()}`,
      title: asgTitle,
      subject: asgSubject,
      level: asgLevel,
      dueDate: asgDueDate,
      totalPoints: Number(asgPoints) || 50,
      assignedCount: 45,
      submittedCount: 0,
      gradedCount: 0,
      instructions: asgInstructions || 'Complete all questions in your homework notebook and submit PDF photo.',
      status: 'Active',
    };

    setAssignments([newAsg, ...assignments]);
    setShowCreateAssignmentModal(false);
    setAsgTitle('');
    setAsgInstructions('');
    alert('Assignment created & published to students!');
  };

  // Submit Grade
  const handleSaveGrade = () => {
    if (!selectedSubForGrading) return;

    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === selectedSubForGrading.id
          ? {
              ...sub,
              status: 'Graded',
              grade: Number(gradeInput),
              teacherFeedback: feedbackInput,
            }
          : sub
      )
    );

    setSelectedSubForGrading(null);
    alert('Grade and personalized teacher feedback saved & notified to student!');
  };

  // Submit Announcement
  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ancTitle.trim()) return;

    const newAnc: ClassAnnouncement = {
      id: `anc-${Date.now()}`,
      title: ancTitle,
      targetLevel: ancLevel,
      subject: ancSubject,
      content: ancContent,
      postedDate: new Date().toISOString().split('T')[0],
      author: user.name || 'Dr. Anitha Rao',
      isImportant: true,
    };

    setAnnouncements([newAnc, ...announcements]);
    setShowNewAnnouncementModal(false);
    setAncTitle('');
    setAncContent('');
    alert('Announcement published & sent via instant app alert!');
  };

  // Submit Doubt Reply
  const handleSendDoubtReply = () => {
    if (!selectedDoubtForReply || !doubtReplyText.trim()) return;

    setDoubts((prev) =>
      prev.map((d) =>
        d.id === selectedDoubtForReply.id
          ? {
              ...d,
              status: 'Replied',
              replyText: doubtReplyText,
            }
          : d
      )
    );

    setSelectedDoubtForReply(null);
    setDoubtReplyText('');
    alert('Doubt response sent directly to student portal!');
  };

  // Trigger Parent Broadcast SMS
  const handleTriggerParentBroadcast = (level: string) => {
    setBroadcastAlertSuccess(`SMS & WhatsApp attendance/progress summary broadcast sent to all parents of ${level}!`);
    setTimeout(() => setBroadcastAlertSuccess(null), 5000);
  };

  // Filtered Student Progress Reports
  const filteredStudents = MOCK_STUDENT_REPORTS.filter((s) => {
    const matchesSearch = s.studentName.toLowerCase().includes(studentSearchTerm.toLowerCase());
    const matchesLevel = studentLevelFilter === 'All' || s.level === studentLevelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* HEADER BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-800 via-purple-900 to-slate-900 text-white shadow-xl border border-indigo-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
            Faculty & Educator Management Suite
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {user.name || 'Dr. Anitha Rao'} • Faculty Portal
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Upload lectures, draft AI assignments, grade homework submissions, track student weak topics, and communicate directly with students & parents.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => setShowUploadLectureModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 text-white font-extrabold text-xs flex items-center gap-2 shadow-md hover:bg-indigo-500 transition-all active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Lecture</span>
          </button>
          <button
            onClick={() => setShowCreateAssignmentModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-white text-indigo-900 font-extrabold text-xs flex items-center gap-2 shadow-md hover:bg-slate-100 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-indigo-600" />
            <span>Create Assignment</span>
          </button>
        </div>
      </div>

      {/* BROADCAST SUCCESS TOAST */}
      {broadcastAlertSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{broadcastAlertSuccess}</span>
          </div>
          <button onClick={() => setBroadcastAlertSuccess(null)} className="text-emerald-500 hover:underline text-[11px]">
            Dismiss
          </button>
        </div>
      )}

      {/* SUB-NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: BarChart3, badge: 'KPIs' },
          { id: 'lectures', label: 'Upload Lectures', icon: Video, badge: `${lectures.length} Active` },
          { id: 'assignments', label: 'Create Assignments', icon: FileText, badge: `${assignments.length} Total` },
          { id: 'progress', label: 'Track Student Progress', icon: Users, badge: 'Analytics' },
          {
            id: 'grading',
            label: 'Grade Submissions',
            icon: CheckCircle2,
            badge: `${submissions.filter((s) => s.status === 'Pending Review').length} Pending`,
          },
          {
            id: 'communication',
            label: 'Student & Parent Chat',
            icon: MessageSquare,
            badge: `${doubts.filter((d) => d.status === 'Unanswered').length} Doubts`,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTabName === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabName(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-500'}`} />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT PANELS */}
      <AnimatePresence mode="wait">
        {/* ==================================================================== */}
        {/* SUB-TAB 1: OVERVIEW & KPIS */}
        {/* ==================================================================== */}
        {activeTabName === 'overview' && (
          <motion.div
            key="tab-overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* KPI Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-2xl font-black text-slate-900 dark:text-slate-100">142</div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Enrolled Students</div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">94.8%</div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Average Class Attendance</div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-2xl font-black text-amber-500">
                    {submissions.filter((s) => s.status === 'Pending Review').length}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pending Review Homework</div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-500 flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{lectures.length}</div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Published Lectures</div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                  <Video className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Doubts Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Quick Teacher Actions */}
              <div className="lg:col-span-6 space-y-4">
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    Quick Faculty Actions
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => setShowUploadLectureModal(true)}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left hover:border-indigo-500 transition-all space-y-1 group"
                    >
                      <Video className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                      <div className="font-extrabold text-xs text-slate-800 dark:text-slate-100">Upload Video / PDF</div>
                      <div className="text-[11px] text-slate-500">Publish study materials for students</div>
                    </button>

                    <button
                      onClick={() => setShowCreateAssignmentModal(true)}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left hover:border-indigo-500 transition-all space-y-1 group"
                    >
                      <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                      <div className="font-extrabold text-xs text-slate-800 dark:text-slate-100">Create AI Assignment</div>
                      <div className="text-[11px] text-slate-500">Draft homework with answer keys</div>
                    </button>

                    <button
                      onClick={() => setActiveTabName('grading')}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left hover:border-indigo-500 transition-all space-y-1 group"
                    >
                      <CheckCircle2 className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
                      <div className="font-extrabold text-xs text-slate-800 dark:text-slate-100">Grade Submissions</div>
                      <div className="text-[11px] text-slate-500">Review homework & enter marks</div>
                    </button>

                    <button
                      onClick={() => setShowNewAnnouncementModal(true)}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left hover:border-indigo-500 transition-all space-y-1 group"
                    >
                      <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
                      <div className="font-extrabold text-xs text-slate-800 dark:text-slate-100">Post Announcement</div>
                      <div className="text-[11px] text-slate-500">Send instant class notifications</div>
                    </button>
                  </div>
                </div>

                {/* Parent WhatsApp Broadcast trigger */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 to-slate-900 text-white space-y-3 shadow-md border border-emerald-700/40">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-extrabold text-sm text-emerald-100">BroadCast Class Reports to Parents</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Send automated weekly SMS/WhatsApp report cards containing attendance percentages and AI weak topic alerts directly to registered parents.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {['Class 6–10', 'Intermediate (11–12)', 'Diploma / Degree'].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => handleTriggerParentBroadcast(lvl)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-extrabold hover:bg-emerald-500 transition-all shadow-sm"
                      >
                        Broadcast {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Recent Student Doubts Inbox */}
              <div className="lg:col-span-6 space-y-4">
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      Recent Student Doubts Inbox
                    </h2>
                    <button
                      onClick={() => setActiveTabName('communication')}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      View All Inbox
                    </button>
                  </div>

                  <div className="space-y-3">
                    {doubts.map((doubt) => (
                      <div
                        key={doubt.id}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={doubt.studentAvatar}
                              alt={doubt.studentName}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                            <div>
                              <span className="font-extrabold text-xs text-slate-800 dark:text-slate-100">
                                {doubt.studentName}
                              </span>
                              <span className="text-[10px] text-slate-400 block">{doubt.level} • {doubt.topic}</span>
                            </div>
                          </div>
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                              doubt.status === 'Unanswered'
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                : 'bg-emerald-500/10 text-emerald-600'
                            }`}
                          >
                            {doubt.status}
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug">"{doubt.questionText}"</p>

                        {doubt.status === 'Unanswered' ? (
                          <button
                            onClick={() => {
                              setSelectedDoubtForReply(doubt);
                              setActiveTabName('communication');
                            }}
                            className="px-3 py-1 rounded-xl bg-indigo-600 text-white text-[11px] font-extrabold hover:bg-indigo-700 transition-all"
                          >
                            Reply Now
                          </button>
                        ) : (
                          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 italic bg-indigo-50 dark:bg-indigo-950/60 p-2 rounded-xl">
                            <strong>Your Reply:</strong> "{doubt.replyText}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* SUB-TAB 2: UPLOAD LECTURES */}
        {/* ==================================================================== */}
        {activeTabName === 'lectures' && (
          <motion.div
            key="tab-lectures"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                  Faculty Video & PDF Lecture Library
                </h2>
                <p className="text-xs text-slate-500">
                  Manage published video lectures, formula PDFs, and audio revision modules
                </p>
              </div>

              <button
                onClick={() => setShowUploadLectureModal(true)}
                className="px-4 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-extrabold hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-md"
              >
                <Upload className="w-4 h-4" /> Publish New Lecture
              </button>
            </div>

            {/* Lecture Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lectures.map((lec) => (
                <div
                  key={lec.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase">
                        {lec.type} • {lec.durationOrPages}
                      </span>
                      <span className="text-[10px] text-slate-400">{lec.uploadDate}</span>
                    </div>

                    <h3 className="font-extrabold text-xs text-slate-800 dark:text-slate-100 leading-snug">
                      {lec.title}
                    </h3>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      {lec.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-500">
                    <span>👁️ {lec.viewsCount} Views</span>
                    <span>❤️ {lec.likesCount} Likes</span>
                    <button
                      onClick={() => alert(`Opening preview of ${lec.title}`)}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 text-[10px] font-extrabold hover:bg-indigo-50"
                    >
                      Preview
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* SUB-TAB 3: CREATE ASSIGNMENTS */}
        {/* ==================================================================== */}
        {activeTabName === 'assignments' && (
          <motion.div
            key="tab-assignments"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                  Course Assignments & Exam Worksheets
                </h2>
                <p className="text-xs text-slate-500">
                  Draft problem sets, set submission deadlines, and track completion status
                </p>
              </div>

              <button
                onClick={() => setShowCreateAssignmentModal(true)}
                className="px-4 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-extrabold hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-md"
              >
                <PlusCircle className="w-4 h-4" /> Create New Assignment
              </button>
            </div>

            {/* Assignments List */}
            <div className="space-y-4">
              {assignments.map((asg) => (
                <div
                  key={asg.id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                          {asg.title}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                            asg.status === 'Active'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {asg.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block">
                        Subject: {asg.subject} • Target Level: {asg.level} • Max Marks: {asg.totalPoints}
                      </span>
                    </div>

                    <div className="text-right text-xs">
                      <span className="text-slate-500 block">Due Date: <strong>{asg.dueDate}</strong></span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                    {asg.instructions}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-1 text-xs">
                    <div className="flex gap-4">
                      <span>Assigned: <strong>{asg.assignedCount} Students</strong></span>
                      <span>Submitted: <strong className="text-emerald-600">{asg.submittedCount}</strong></span>
                      <span>Graded: <strong className="text-indigo-600">{asg.gradedCount}</strong></span>
                    </div>

                    <button
                      onClick={() => setActiveTabName('grading')}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs hover:bg-indigo-100"
                    >
                      Review & Grade Submissions →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* SUB-TAB 4: TRACK STUDENT PROGRESS */}
        {/* ==================================================================== */}
        {activeTabName === 'progress' && (
          <motion.div
            key="tab-progress"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Filter Bar */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search student name..."
                  value={studentSearchTerm}
                  onChange={(e) => setStudentSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-500">Class Level:</span>
                <select
                  value={studentLevelFilter}
                  onChange={(e) => setStudentLevelFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none"
                >
                  <option value="All">All Levels</option>
                  {EDUCATION_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Student Performance Table */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                Student Roster, Attendance & AI Weak Topics
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-200">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3 rounded-l-xl">Student Name</th>
                      <th className="p-3">Level</th>
                      <th className="p-3">Attendance</th>
                      <th className="p-3">Average Grade</th>
                      <th className="p-3">AI Identified Weak Topics</th>
                      <th className="p-3 rounded-r-xl">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-bold flex items-center gap-2">
                          <img src={s.avatar} alt={s.studentName} className="w-8 h-8 rounded-full object-cover" />
                          <span>{s.studentName}</span>
                        </td>
                        <td className="p-3">{s.level}</td>
                        <td className="p-3 font-bold text-emerald-600">{s.attendancePercent}%</td>
                        <td className="p-3 font-bold">{s.averageGrade}</td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {s.weakTopics.map((w, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[10px] font-semibold"
                              >
                                {w.topic} ({w.score}%)
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() =>
                              alert(`Personalized AI remedial study plan dispatched to ${s.studentName}!`)
                            }
                            className="px-3 py-1 rounded-xl bg-indigo-600 text-white font-extrabold text-[10px] hover:bg-indigo-700"
                          >
                            Send AI Study Plan
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* SUB-TAB 5: GRADE QUIZZES & SUBMISSIONS */}
        {/* ==================================================================== */}
        {activeTabName === 'grading' && (
          <motion.div
            key="tab-grading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left Column: Submissions Inbox List */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Submissions Grading Queue
                </h2>

                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {submissions.map((sub) => {
                    const isSelected = selectedSubForGrading?.id === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setSelectedSubForGrading(sub);
                          setGradeInput(sub.grade || sub.aiSuggestedGrade || 45);
                          setFeedbackInput(sub.teacherFeedback || sub.aiFeedbackHint || '');
                        }}
                        className={`w-full p-4 rounded-2xl text-left border transition-all ${
                          isSelected
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 ring-2 ring-indigo-500/30'
                            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <img src={sub.avatar} alt={sub.studentName} className="w-6 h-6 rounded-full object-cover" />
                            <span className="font-extrabold text-xs text-slate-800 dark:text-slate-100">
                              {sub.studentName}
                            </span>
                          </div>

                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                              sub.status === 'Pending Review'
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                : 'bg-emerald-500/10 text-emerald-600'
                            }`}
                          >
                            {sub.status}
                          </span>
                        </div>

                        <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 line-clamp-1">
                          {sub.assignmentTitle}
                        </p>

                        <div className="text-[10px] text-slate-400 mt-1">
                          Submitted: {sub.submittedDate}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Grading Inspector & AI Evaluation */}
            <div className="lg:col-span-7 space-y-4">
              {selectedSubForGrading ? (
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedSubForGrading.avatar}
                        alt={selectedSubForGrading.studentName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">
                          {selectedSubForGrading.studentName}
                        </h3>
                        <p className="text-[11px] text-slate-400">{selectedSubForGrading.assignmentTitle}</p>
                      </div>
                    </div>

                    <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                      Max Marks: {selectedSubForGrading.maxGrade}
                    </span>
                  </div>

                  {/* Student Submission Text */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                      Student Answer Script / Text Response:
                    </label>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-mono">
                      {selectedSubForGrading.studentAnswerText}
                    </div>
                  </div>

                  {/* AI Suggested Grade Hint */}
                  {selectedSubForGrading.aiSuggestedGrade && (
                    <div className="p-4 rounded-2xl bg-indigo-950 text-white border border-indigo-800 space-y-1">
                      <div className="flex items-center gap-2 text-amber-300 font-extrabold text-xs">
                        <Sparkles className="w-4 h-4" /> AI Auto-Grading Recommendation: {selectedSubForGrading.aiSuggestedGrade} / {selectedSubForGrading.maxGrade}
                      </div>
                      <p className="text-xs text-slate-300 italic">
                        "{selectedSubForGrading.aiFeedbackHint}"
                      </p>
                    </div>
                  )}

                  {/* Grade Entry Form */}
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block mb-1">
                        Enter Final Score (Out of {selectedSubForGrading.maxGrade}):
                      </label>
                      <input
                        type="number"
                        max={selectedSubForGrading.maxGrade}
                        value={gradeInput}
                        onChange={(e) => setGradeInput(Number(e.target.value))}
                        className="w-full sm:w-48 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-black text-indigo-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block mb-1">
                        Personalized Remarks & Feedback:
                      </label>
                      <textarea
                        rows={3}
                        value={feedbackInput}
                        onChange={(e) => setFeedbackInput(e.target.value)}
                        placeholder="Write constructive guidance for student..."
                        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium outline-none"
                      />
                    </div>

                    <button
                      onClick={handleSaveGrade}
                      className="px-5 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-extrabold hover:bg-indigo-700 transition-all shadow-md"
                    >
                      Save Grade & Send Feedback
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-slate-400 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-indigo-500 mx-auto" />
                  <p className="text-xs font-bold">Select a submission from queue on left to begin grading</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* SUB-TAB 6: COMMUNICATE WITH STUDENTS & PARENTS */}
        {/* ==================================================================== */}
        {activeTabName === 'communication' && (
          <motion.div
            key="tab-communication"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Announcements Panel */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    Class Announcements
                  </h2>
                  <button
                    onClick={() => setShowNewAnnouncementModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-extrabold hover:bg-indigo-500 transition-all flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Post Notice
                  </button>
                </div>

                <div className="space-y-3">
                  {announcements.map((anc) => (
                    <div
                      key={anc.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-slate-800 dark:text-slate-100">
                          {anc.title}
                        </span>
                        <span className="text-[10px] text-slate-400">{anc.postedDate}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{anc.content}</p>
                      <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                        Target: {anc.targetLevel} • Posted by {anc.author}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Student Doubt Resolution Box */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Direct Student Doubts Inbox
                </h2>

                <div className="space-y-3">
                  {doubts.map((d) => (
                    <div
                      key={d.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={d.studentAvatar} alt={d.studentName} className="w-7 h-7 rounded-full object-cover" />
                          <span className="font-extrabold text-xs text-slate-800 dark:text-slate-100">
                            {d.studentName} ({d.level})
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">{d.timeAgo}</span>
                      </div>

                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug">"{d.questionText}"</p>

                      {selectedDoubtForReply?.id === d.id ? (
                        <div className="space-y-2 pt-2">
                          <textarea
                            rows={3}
                            value={doubtReplyText}
                            onChange={(e) => setDoubtReplyText(e.target.value)}
                            placeholder="Write clear explanation to student..."
                            className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium outline-none"
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => setSelectedDoubtForReply(null)}
                              className="px-3 py-1 rounded-xl bg-slate-200 text-xs font-bold text-slate-600"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSendDoubtReply}
                              className="px-4 py-1 rounded-xl bg-indigo-600 text-white text-xs font-extrabold"
                            >
                              Send Response
                            </button>
                          </div>
                        </div>
                      ) : d.status === 'Unanswered' ? (
                        <button
                          onClick={() => setSelectedDoubtForReply(d)}
                          className="px-3 py-1 rounded-xl bg-indigo-600 text-white text-[11px] font-extrabold"
                        >
                          Reply to Student
                        </button>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-xs text-indigo-900 dark:text-indigo-200">
                          <strong>Your Answer:</strong> {d.replyText}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 1: UPLOAD LECTURE */}
      {showUploadLectureModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-600" /> Upload Faculty Lecture / Notes
            </h2>

            <form onSubmit={handleUploadLecture} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Lecture Title:</label>
                <input
                  type="text"
                  required
                  value={lecTitle}
                  onChange={(e) => setLecTitle(e.target.value)}
                  placeholder="e.g. Class 10 Trigonometry Step-by-Step Proofs"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Format Type:</label>
                  <select
                    value={lecType}
                    onChange={(e) => setLecType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none"
                  >
                    <option value="video">🎥 Video Lecture</option>
                    <option value="pdf">📄 PDF Notes</option>
                    <option value="audio">🎙️ Audio Lesson</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Level:</label>
                  <select
                    value={lecLevel}
                    onChange={(e) => setLecLevel(e.target.value as EducationLevel)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none"
                  >
                    {EDUCATION_LEVELS.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Description:</label>
                <textarea
                  rows={2}
                  value={lecDesc}
                  onChange={(e) => setLecDesc(e.target.value)}
                  placeholder="Overview of core learning objectives..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadLectureModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md"
                >
                  Publish Lecture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE ASSIGNMENT */}
      {showCreateAssignmentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" /> Create Assignment
              </h2>
              <button
                type="button"
                onClick={handleGenerateAiAssignment}
                disabled={isGeneratingAiQuestions}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isGeneratingAiQuestions ? 'AI Drafting...' : 'AI Auto-Draft'}
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Assignment Title:</label>
                <input
                  type="text"
                  required
                  value={asgTitle}
                  onChange={(e) => setAsgTitle(e.target.value)}
                  placeholder="e.g. Class 10 Trigonometric Equations Homework"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Due Date:</label>
                  <input
                    type="date"
                    value={asgDueDate}
                    onChange={(e) => setAsgDueDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Max Points:</label>
                  <input
                    type="number"
                    value={asgPoints}
                    onChange={(e) => setAsgPoints(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Instructions & Problem Statements:</label>
                <textarea
                  rows={4}
                  value={asgInstructions}
                  onChange={(e) => setAsgInstructions(e.target.value)}
                  placeholder="Detail step-by-step problem statements or questions..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateAssignmentModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: NEW ANNOUNCEMENT */}
      {showNewAnnouncementModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-600" /> Post Class Announcement
            </h2>

            <form onSubmit={handleCreateAnnouncement} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Notice Title:</label>
                <input
                  type="text"
                  required
                  value={ancTitle}
                  onChange={(e) => setAncTitle(e.target.value)}
                  placeholder="e.g. Schedule for Board Exam Practice Test"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Notice Content:</label>
                <textarea
                  rows={3}
                  value={ancContent}
                  onChange={(e) => setAncContent(e.target.value)}
                  placeholder="Write message details for students..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewAnnouncementModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md"
                >
                  Post Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
