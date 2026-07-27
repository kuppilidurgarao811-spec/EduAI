import React, { useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  PlayCircle,
  FileText,
  HelpCircle,
  Star,
  Search,
  Filter,
  CheckCircle2,
  X,
  Sparkles,
  Download,
  Bookmark,
  BookmarkCheck,
  Code,
  Terminal,
  Cpu,
  Layers,
  Database,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Course, EducationLevel, CourseModule } from '../types';
import { EDUCATION_LEVELS, SUBJECT_LIST } from '../data/mockData';

export const CourseLibrary: React.FC = () => {
  const {
    courses,
    addCourse,
    educationLevel,
    setEducationLevel,
    bookmarks,
    toggleBookmark,
    setActiveTab,
    addChatMessage,
    downloadOfflineItem,
    offlineItems,
  } = useAuth();

  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeModule, setActiveModule] = useState<CourseModule | null>(null);
  const [modalTab, setModalTab] = useState<'video' | 'pdf' | 'practice' | 'quiz'>('video');
  const [quizAnswers, setQuizAnswers] = useState<{ [qIndex: number]: number }>({});
  const [showQuizResult, setShowQuizResult] = useState<boolean>(false);

  // Custom AI Programming Course Generator State
  const [customCourseInput, setCustomCourseInput] = useState<string>('');
  const [isGeneratingCourse, setIsGeneratingCourse] = useState<boolean>(false);

  const handleGenerateCustomCourse = async (topicOverride?: string) => {
    const topicToUse = topicOverride || customCourseInput;
    if (!topicToUse.trim()) return;

    setIsGeneratingCourse(true);

    try {
      const res = await fetch('/api/ai/generate-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicToUse,
          level: educationLevel,
          subject: 'Programming',
        }),
      });

      const newCourse = await res.json();
      if (newCourse && newCourse.title) {
        addCourse(newCourse);
        setActiveCourse(newCourse);
        setActiveModule(newCourse.modules[0] || null);
        setCustomCourseInput('');
      }
    } catch (err) {
      console.error('Failed to generate course:', err);
    } finally {
      setIsGeneratingCourse(false);
    }
  };

  // Filter courses
  const filteredCourses = courses.filter((c) => {
    const matchesLevel =
      c.level === educationLevel ||
      educationLevel === 'Degree (BSc, BCom, BA, BTech)' ||
      c.subject.toLowerCase().includes('programming');
    const matchesSubject =
      selectedSubject === 'All' ||
      c.subject.toLowerCase().includes(selectedSubject.toLowerCase()) ||
      c.title.toLowerCase().includes(selectedSubject.toLowerCase());
    const matchesSearch = searchQuery
      ? c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesLevel && matchesSubject && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-in fade-in duration-200">
      
      {/* Header & Learning Module Capability Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Learning Modules Hub</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <span>LKG to Degree Syllabus & Subject Lessons</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Access subject-wise lessons, HD video classes, downloadable PDF notes, interactive practice questions, and chapter-wise quizzes.
          </p>
        </div>

        {/* Level Dropdown (LKG to Degree) */}
        <div className="flex items-center gap-2 shrink-0">
          <GraduationCap className="w-4 h-4 text-indigo-500" />
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Syllabus Grade</span>
            <select
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none border border-slate-200 dark:border-slate-600"
            >
              {EDUCATION_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* AI Dynamic Programming & Course Builder Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl space-y-4 border border-indigo-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> AI Course Generator Engine
            </span>
            <h2 className="text-lg font-black mt-2 flex items-center gap-2 text-white">
              <Terminal className="w-5 h-5 text-indigo-400" />
              Request or Generate ANY Programming Course
            </h2>
            <p className="text-xs text-slate-300">
              Need Rust, Go, Flutter, Spring Boot, Solidity, Assembly, Microservices, System Design or iOS Swift? AI builds custom modules, code notebooks & quizzes instantly!
            </p>
          </div>
        </div>

        {/* Course Generation Input Form */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={customCourseInput}
            onChange={(e) => setCustomCourseInput(e.target.value)}
            placeholder="Type any programming language or tech course name (e.g. Full Stack Rust & WebAssembly, Spring Boot Microservices)..."
            onKeyDown={(e) => e.key === 'Enter' && handleGenerateCustomCourse()}
            className="flex-1 px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-xs text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-400 font-medium"
          />
          <button
            type="button"
            onClick={() => handleGenerateCustomCourse()}
            disabled={isGeneratingCourse || !customCourseInput.trim()}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
          >
            {isGeneratingCourse ? (
              <>
                <Zap className="w-4 h-4 animate-spin text-amber-300" />
                <span>Generating Programming Course...</span>
              </>
            ) : (
              <>
                <Code className="w-4 h-4 text-amber-300" />
                <span>⚡ Build Course Now</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Instant Programming Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-slate-400 font-bold shrink-0 text-[11px]">Instant Programming Stack:</span>
          {[
            { label: '🐍 Python Full Stack', topic: 'Python Django & Automation' },
            { label: '☕ Java & Spring Boot', topic: 'Java 17 & Spring Boot Microservices' },
            { label: '⚡ C++ Systems & DSA', topic: 'C++ Systems Programming & Memory Management' },
            { label: '⚛️ React & TypeScript', topic: 'Full Stack React 18 & TypeScript' },
            { label: '🦀 Rust Systems Safety', topic: 'Rust Systems & WebAssembly' },
            { label: '📱 Flutter Mobile Apps', topic: 'Flutter & Dart Cross Platform Mobile Dev' },
            { label: '🐬 SQL & PostgreSQL DBMS', topic: 'SQL & Database Architecture' },
            { label: '🤖 PyTorch & AI Engineering', topic: 'AI Engineering & Deep Learning PyTorch' },
            { label: '☁️ AWS & DevOps Docker', topic: 'Cloud DevOps Docker & Kubernetes' },
          ].map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setCustomCourseInput(item.topic);
                handleGenerateCustomCourse(item.topic);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-200 font-bold border border-white/10 text-[11px] shrink-0 transition-all"
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search course title, language, or topic..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none"
          />
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 text-xs no-scrollbar">
          <button
            onClick={() => setSelectedSubject('All')}
            className={`px-3 py-1.5 rounded-full font-bold shrink-0 transition-colors ${
              selectedSubject === 'All'
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            All Subjects
          </button>
          {[
            'Programming',
            'Python',
            'Java',
            'C/C++',
            'Web Tech',
            'Databases',
            'Security & Cloud',
            'Mathematics',
            'Science',
            'English',
            'Telugu',
          ].map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 rounded-full font-bold shrink-0 transition-colors ${
                selectedSubject === sub
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const isBookmarked = bookmarks.includes(course.id);
          return (
            <div
              key={course.id}
              className="group rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider">
                  {course.level}
                </div>
                <button
                  onClick={() => toggleBookmark(course.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:bg-white transition-colors"
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="w-4 h-4 text-indigo-600" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    <span>{course.subject}</span>
                    <span className="flex items-center gap-1 text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      {course.rating} ({course.enrolledCount.toLocaleString()} students)
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 mt-1 line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {course.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <PlayCircle className="w-4 h-4 text-indigo-500" />
                      {course.videoCount} Video Lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4 text-purple-500" />
                      {course.pdfCount} PDF Notes
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setActiveCourse(course);
                      setActiveModule(course.modules[0] || null);
                    }}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>Start Learning Lesson</span>
                    <PlayCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Course Interactive Player & Notes Modal */}
      {activeCourse && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
                  {activeCourse.level} • {activeCourse.subject}
                </span>
                <h2 className="text-lg font-black text-slate-800 dark:text-slate-100">
                  {activeCourse.title}
                </h2>
              </div>
              <button
                onClick={() => {
                  setActiveCourse(null);
                  setActiveModule(null);
                }}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Module Player & Content */}
            <div className="p-6 space-y-4">
              
              {/* Module Sub-Tabs (Video Classes, PDF Notes, Practice Questions, Chapter Quizzes) */}
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setModalTab('video')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                    modalTab === 'video'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Video Classes</span>
                </button>

                <button
                  onClick={() => setModalTab('pdf')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                    modalTab === 'pdf'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>PDF Notes</span>
                </button>

                <button
                  onClick={() => setModalTab('practice')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                    modalTab === 'practice'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Practice Questions</span>
                </button>

                <button
                  onClick={() => setModalTab('quiz')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                    modalTab === 'quiz'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Chapter Quiz</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Main Content View (2 cols) */}
                <div className="md:col-span-2 space-y-4">
                  
                  {/* 1. Video Classes Tab */}
                  {modalTab === 'video' && (
                    <div className="space-y-4">
                      <div className="relative aspect-video rounded-2xl bg-slate-950 overflow-hidden flex items-center justify-center text-white p-6 shadow-inner border border-slate-800">
                        <img
                          src={activeCourse.thumbnail}
                          alt={activeCourse.title}
                          className="absolute inset-0 w-full h-full object-cover opacity-30"
                        />
                        <div className="relative z-10 text-center space-y-3">
                          <div className="w-16 h-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center mx-auto shadow-xl ring-4 ring-white/30 cursor-pointer hover:scale-110 transition-transform">
                            <PlayCircle className="w-8 h-8" />
                          </div>
                          <div className="font-bold text-sm">
                            {activeModule ? activeModule.title : 'Select a lesson module'}
                          </div>
                          <p className="text-xs text-slate-300 max-w-sm mx-auto">
                            HD Video Class with AI Audio Explanation & Telugu/English Subtitles
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                            Video Summary & Notes
                          </h3>
                          <button
                            onClick={() => {
                              addChatMessage({
                                id: `m-${Date.now()}`,
                                role: 'user',
                                text: `Explain ${activeModule?.title || activeCourse.title} in detail with step-by-step examples.`,
                                timestamp: 'Just now',
                              });
                              setActiveCourse(null);
                              setActiveTab('ai-tutor');
                            }}
                            className="px-3 py-1 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-indigo-700"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Ask AI Tutor</span>
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex-1">
                            Lesson covers syllabus requirements for {activeCourse.level} ({activeCourse.subject}). Watch the video to master key concepts.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              downloadOfflineItem({
                                id: `off-vid-${activeCourse.id}-${activeModule?.id || 'm1'}`,
                                title: `${activeCourse.title} - ${activeModule?.title || 'Video Lesson'}`,
                                type: 'video',
                                subject: activeCourse.subject,
                                educationLevel: activeCourse.level,
                                fileSize: '16.5 MB',
                                downloadedAt: 'Just now',
                                chapterTitle: activeModule?.title || activeCourse.title,
                                videoDuration: activeModule?.duration || '12:00',
                                contentOrUrl: `Offline Video Stream for ${activeCourse.title}. Complete lesson with Telugu & English audio explanations.`,
                              });
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-xs shrink-0"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Save Offline Video</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. PDF Notes Tab */}
                  {modalTab === 'pdf' && (
                    <div className="space-y-4">
                      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                          <FileText className="w-8 h-8" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                            PDF Revision Notes & Formula Cheat Sheet
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                            Comprehensive, expert-verified PDF study materials for {activeCourse.title} ({activeCourse.level}).
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border text-left text-xs space-y-2">
                          <div className="font-bold text-slate-800 dark:text-slate-100">
                            📄 Included in this PDF Download:
                          </div>
                          <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-1">
                            <li>Complete Chapter Mindmaps & Concept Diagrams</li>
                            <li>Important Exam Formulas & Short Cut Tricks</li>
                            <li>Previous 10 Years Solved Board/University Questions</li>
                          </ul>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            downloadOfflineItem({
                              id: `off-pdf-${activeCourse.id}`,
                              title: `${activeCourse.title} - Complete PDF Study Handbook`,
                              type: 'pdf',
                              subject: activeCourse.subject,
                              educationLevel: activeCourse.level,
                              fileSize: '8.4 MB',
                              downloadedAt: 'Just now',
                              chapterTitle: activeCourse.title,
                              pdfPagesCount: 28,
                              contentOrUrl: `OFFLINE PDF HANDBOOK for ${activeCourse.title} (${activeCourse.level}). Contains all chapter formulas, solved examples, mindmaps, and board exam solutions.`,
                            });
                          }}
                          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 mx-auto shadow-md"
                        >
                          <Download className="w-4 h-4" />
                          <span>Save PDF to Offline Vault</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 3. Practice Questions Tab */}
                  {modalTab === 'practice' && (
                    <div className="space-y-3">
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-indigo-600" />
                        <span>Interactive Practice Questions</span>
                      </div>

                      {[
                        {
                          q: 'Q1. Explain the fundamental principle behind this topic.',
                          ans: 'The fundamental principle relies on law of conservation and step-by-step logic.',
                        },
                        {
                          q: 'Q2. Solve the standard textbook numerical problem for this chapter.',
                          ans: 'Substitute given values into formula: Result = 42 units (verified).',
                        },
                        {
                          q: 'Q3. What are the top 3 errors students make in board exams for this section?',
                          ans: '1. Forgetting units. 2. Calculation errors in signs. 3. Missing diagram labels.',
                        },
                      ].map((p, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2">
                          <div className="font-bold text-xs text-slate-800 dark:text-slate-100">{p.q}</div>
                          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300 border">
                            <strong className="text-emerald-600 dark:text-emerald-400">Step-by-Step Solution:</strong> {p.ans}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 4. Chapter-wise Quizzes Tab */}
                  {modalTab === 'quiz' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span>Chapter Quick Assessment Quiz</span>
                        </div>
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full">
                          3 Questions
                        </span>
                      </div>

                      {[
                        {
                          id: 0,
                          q: 'Which of the following best describes the main concept of this module?',
                          options: ['Option A: Core Logical Rule', 'Option B: Secondary Derivative', 'Option C: Empirical Assumption', 'Option D: None of the above'],
                          correct: 0,
                        },
                        {
                          id: 1,
                          q: 'What is the recommended practice for solving problems in this topic?',
                          options: ['Skip formulas', 'Apply step-by-step verification', 'Guess blindly', 'Memorize without understanding'],
                          correct: 1,
                        },
                        {
                          id: 2,
                          q: 'How frequently should you review these revision PDF notes?',
                          options: ['Once a year', 'Weekly active recall', 'Never', 'Only during exam hour'],
                          correct: 1,
                        },
                      ].map((item) => (
                        <div key={item.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-100">{item.q}</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {item.options.map((opt, optIdx) => {
                              const isSelected = quizAnswers[item.id] === optIdx;
                              return (
                                <button
                                  key={optIdx}
                                  onClick={() => setQuizAnswers({ ...quizAnswers, [item.id]: optIdx })}
                                  className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all border ${
                                    isSelected
                                      ? 'bg-indigo-600 text-white border-indigo-600'
                                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={() => setShowQuizResult(true)}
                        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                      >
                        Submit Chapter Quiz Answers
                      </button>

                      {showQuizResult && (
                        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 font-bold space-y-1">
                          <div>🎉 Quiz Completed! You scored 100% on {activeCourse.title}.</div>
                          <div className="text-[11px] font-normal text-emerald-700 dark:text-emerald-300">
                            Great job! +50 Gamification XP added to your student profile.
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>

                {/* Module List Sidebar (1 col) */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                    Syllabus Modules ({activeCourse.modules.length})
                  </h3>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {activeCourse.modules.map((m, idx) => (
                      <div
                        key={m.id}
                        onClick={() => {
                          setActiveModule(m);
                          setModalTab('video');
                        }}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          activeModule?.id === m.id
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 font-bold text-indigo-900 dark:text-indigo-200'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>Lesson {idx + 1}</span>
                          <span className="text-[10px] text-slate-400">{m.duration}</span>
                        </div>
                        <div className="font-semibold text-slate-800 dark:text-slate-100 mt-1">
                          {m.title}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
