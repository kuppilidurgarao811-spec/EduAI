import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Layers,
  Search,
  CheckCircle2,
  Award,
  BookMarked,
  Baby,
  School,
  ArrowRight,
  Brain,
  Download,
  Play,
  FileText,
  Filter,
  Check,
  Zap,
  Info,
  Building2,
  Cpu,
  Share2,
  HelpCircle,
  Volume2,
  ListOrdered,
  FolderTree,
  RotateCcw,
  Clock,
  Video,
  FileQuestion,
  CheckCircle,
  XCircle,
  BarChart2,
  ArrowDown,
} from 'lucide-react';
import {
  EDUAI_6_TIER_CURRICULUM,
  EducationLevel,
  CurriculumClass,
  CurriculumSubject,
  CurriculumChapter,
  CurriculumLesson,
  QuizQuestion,
} from '../data/curriculumData';
import { useAuth } from '../context/AuthContext';

interface CurriculumHierarchyProps {
  onNavigate?: (tabId: string) => void;
}

export const CurriculumHierarchy: React.FC<CurriculumHierarchyProps> = ({ onNavigate }) => {
  const { educationLevel, setEducationLevel, setActiveTab } = useAuth();

  // Tier 1 to 6 Active Selections
  const [selectedLevelId, setSelectedLevelId] = useState<string>('school');
  const [selectedClassId, setSelectedClassId] = useState<string>('class-10');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('c10-math');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('c10-mth-ch1');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('c10-mth-ch1-l1');

  // Search & View Mode State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'drill-down' | 'tree-overview'>('drill-down');
  const [teluguLanguageToggle, setTeluguLanguageToggle] = useState<boolean>(true);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<{ [questionId: string]: number }>({});
  const [showQuizExpl, setShowQuizExpl] = useState<{ [questionId: string]: boolean }>({});
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Derive Current Objects
  const currentLevel =
    EDUAI_6_TIER_CURRICULUM.find((l) => l.id === selectedLevelId) || EDUAI_6_TIER_CURRICULUM[0];

  const currentClass =
    currentLevel.classes.find((c) => c.id === selectedClassId) || currentLevel.classes[0] || null;

  const currentSubject =
    currentClass?.subjects.find((s) => s.id === selectedSubjectId) || currentClass?.subjects[0] || null;

  const currentChapter =
    currentSubject?.chapters.find((ch) => ch.id === selectedChapterId) || currentSubject?.chapters[0] || null;

  const currentLesson =
    currentChapter?.lessons.find((les) => les.id === selectedLessonId) || currentChapter?.lessons[0] || null;

  // Level Icon Mapping
  const getLevelIcon = (iconName: string) => {
    switch (iconName) {
      case 'Baby':
        return Baby;
      case 'Sparkles':
        return Sparkles;
      case 'School':
        return School;
      case 'GraduationCap':
        return GraduationCap;
      case 'BookMarked':
        return BookMarked;
      case 'Award':
      default:
        return Award;
    }
  };

  // Text-To-Speech Reader
  const handleSpeakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Handle Quiz Option Selection
  const handleSelectQuizOption = (qId: string, optIndex: number) => {
    setQuizAnswers((prev) => ({ ...prev, [qId]: optIndex }));
    setShowQuizExpl((prev) => ({ ...prev, [qId]: true }));
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-200">
      {/* HEADER BANNER */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden shadow-2xl border border-indigo-500/30">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider flex items-center gap-1.5">
                <FolderTree className="w-3.5 h-3.5 text-amber-400" /> 6-Tier Curriculum Database Schema
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Full Drill-Down Active
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <span>EduAI Hierarchical Learning Engine</span>
            </h1>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Drill down sequentially from <strong className="text-indigo-300">Education Levels</strong> ➔ <strong className="text-indigo-300">Classes</strong> ➔ <strong className="text-indigo-300">Subjects</strong> ➔ <strong className="text-indigo-300">Chapters</strong> ➔ <strong className="text-indigo-300">Lessons</strong> ➔ <strong className="text-amber-300">Quiz Questions</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setViewMode(viewMode === 'drill-down' ? 'tree-overview' : 'drill-down')}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Layers className="w-4 h-4" />
              <span>{viewMode === 'drill-down' ? 'Switch to Full Tree Overview' : 'Switch to Interactive Drill-Down'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6-TIER VISUAL PIPELINE FLOW SCHEMATIC */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <span className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" /> 6-Tier Curriculum Structural Mapping
          </span>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            Click any tier below to inspect
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center">
          {[
            { level: '1', title: 'education_levels', count: '5 Levels', active: true, color: 'bg-indigo-600' },
            { level: '2', title: 'classes', count: '16 Grades', active: !!currentClass, color: 'bg-blue-600' },
            { level: '3', title: 'subjects', count: '45 Subjects', active: !!currentSubject, color: 'bg-cyan-600' },
            { level: '4', title: 'chapters', count: '180+ Chapters', active: !!currentChapter, color: 'bg-emerald-600' },
            { level: '5', title: 'lessons', count: '500+ Lessons', active: !!currentLesson, color: 'bg-amber-600' },
            { level: '6', title: 'quiz_questions', count: '2000+ Questions', active: !!currentLesson?.quizQuestions.length, color: 'bg-rose-600' },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl border text-left space-y-1 transition-all ${
                item.active
                  ? 'bg-slate-50 dark:bg-slate-800/80 border-indigo-500/50 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`w-5 h-5 rounded-full text-[10px] font-black text-white flex items-center justify-center ${item.color}`}>
                  {item.level}
                </span>
                <span className="text-[9px] font-bold text-slate-400">{item.count}</span>
              </div>
              <p className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* DRILL DOWN INTERACTIVE SECTION */}
      {viewMode === 'drill-down' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT SIDEBAR: TIER 1, 2 & 3 SELECTION */}
          <div className="lg:col-span-4 space-y-6">
            {/* TIER 1: EDUCATION LEVELS */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-lg bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center">1</span>
                Education Levels (education_levels)
              </h3>

              <div className="space-y-1.5">
                {EDUAI_6_TIER_CURRICULUM.map((lvl) => {
                  const IconComp = getLevelIcon(lvl.icon);
                  const isSelected = selectedLevelId === lvl.id;

                  return (
                    <button
                      key={lvl.id}
                      onClick={() => {
                        setSelectedLevelId(lvl.id);
                        const firstCls = lvl.classes[0];
                        if (firstCls) {
                          setSelectedClassId(firstCls.id);
                          const firstSubj = firstCls.subjects[0];
                          if (firstSubj) {
                            setSelectedSubjectId(firstSubj.id);
                            const firstCh = firstSubj.chapters[0];
                            if (firstCh) {
                              setSelectedChapterId(firstCh.id);
                              if (firstCh.lessons[0]) setSelectedLessonId(firstCh.lessons[0].id);
                            }
                          }
                        }
                      }}
                      className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-md scale-[1.01]'
                          : 'bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSelected ? 'bg-white/20' : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600'}`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-extrabold text-xs block">{lvl.name}</span>
                          <span className={`text-[10px] ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                            {lvl.classes.length} Classes Available
                          </span>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TIER 2: CLASSES / STREAMS */}
            {currentLevel && (
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <h3 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-lg bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">2</span>
                  Classes / Streams (classes)
                </h3>

                <div className="space-y-1.5">
                  {currentLevel.classes.map((cls) => {
                    const isSelected = selectedClassId === cls.id;

                    return (
                      <button
                        key={cls.id}
                        onClick={() => {
                          setSelectedClassId(cls.id);
                          const firstSubj = cls.subjects[0];
                          if (firstSubj) {
                            setSelectedSubjectId(firstSubj.id);
                            const firstCh = firstSubj.chapters[0];
                            if (firstCh) {
                              setSelectedChapterId(firstCh.id);
                              if (firstCh.lessons[0]) setSelectedLessonId(firstCh.lessons[0].id);
                            }
                          }
                        }}
                        className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                            : 'bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-blue-400'
                        }`}
                      >
                        <div>
                          <span className="font-extrabold text-xs block">{cls.name}</span>
                          <span className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                            {cls.subjects.length} Subjects
                          </span>
                        </div>
                        <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TIER 3: SUBJECTS */}
            {currentClass && (
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <h3 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-lg bg-cyan-600 text-white text-[10px] font-black flex items-center justify-center">3</span>
                  Subjects (subjects)
                </h3>

                <div className="space-y-1.5">
                  {currentClass.subjects.map((subj) => {
                    const isSelected = selectedSubjectId === subj.id;

                    return (
                      <button
                        key={subj.id}
                        onClick={() => {
                          setSelectedSubjectId(subj.id);
                          const firstCh = subj.chapters[0];
                          if (firstCh) {
                            setSelectedChapterId(firstCh.id);
                            if (firstCh.lessons[0]) setSelectedLessonId(firstCh.lessons[0].id);
                          }
                        }}
                        className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-cyan-600 text-white border-cyan-500 shadow-md'
                            : 'bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-cyan-400'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-xs block">{subj.name}</span>
                            {subj.semester && (
                              <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300'
                              }`}>
                                {subj.semester}
                              </span>
                            )}
                          </div>
                          <span className={`text-[10px] ${isSelected ? 'text-cyan-100' : 'text-slate-400'}`}>
                            {subj.chapters.length} Chapters {subj.code ? `• ${subj.code}` : ''}
                          </span>
                        </div>
                        <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT MAIN PANEL: TIER 4 (CHAPTERS), TIER 5 (LESSONS), TIER 6 (QUIZ QUESTIONS) */}
          <div className="lg:col-span-8 space-y-6">
            {/* ACTIVE DRILL-DOWN HEADER */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {currentLevel?.name}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    {currentClass?.name}
                  </span>
                  {currentSubject?.semester && (
                    <>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                        {currentSubject.semester}
                      </span>
                    </>
                  )}
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
                    {currentSubject?.name}
                  </span>
                </div>

                <button
                  onClick={() => {
                    if (currentLevel?.name) setEducationLevel(currentLevel.name as any);
                    if (setActiveTab) setActiveTab('ai-tutor');
                    else if (onNavigate) onNavigate('ai-tutor');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Brain className="w-3.5 h-3.5" /> Start AI Voice Doubt
                </button>
              </div>

              {/* TIER 4: CHAPTER SELECTOR */}
              {currentSubject && (
                <div className="space-y-3">
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-lg bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center">4</span>
                    Chapters (chapters) in {currentSubject.name}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentSubject.chapters.map((ch) => {
                      const isSelected = selectedChapterId === ch.id;

                      return (
                        <div
                          key={ch.id}
                          onClick={() => {
                            setSelectedChapterId(ch.id);
                            if (ch.lessons[0]) setSelectedLessonId(ch.lessons[0].id);
                          }}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-md'
                              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-emerald-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-black text-xs text-emerald-700 dark:text-emerald-400">
                              Chapter {ch.chapterNumber}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {ch.estimatedHours} Hours
                            </span>
                          </div>
                          <h5 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 mb-1">
                            {ch.title}
                          </h5>
                          <p className="text-[11px] text-slate-500 line-clamp-2">{ch.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* TIER 5: LESSON READER */}
            {currentChapter && (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-lg bg-amber-600 text-white text-[10px] font-black flex items-center justify-center">5</span>
                  Lessons (lessons) in Chapter {currentChapter.chapterNumber}: {currentChapter.title}
                </h4>

                <div className="flex flex-wrap gap-2">
                  {currentChapter.lessons.map((les) => {
                    const isSelected = selectedLessonId === les.id;

                    return (
                      <button
                        key={les.id}
                        onClick={() => setSelectedLessonId(les.id)}
                        className={`px-4 py-2 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2 ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>{les.title}</span>
                      </button>
                    );
                  })}
                </div>

                {/* LESSON DETAILS CARD */}
                {currentLesson && (
                  <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-black text-base text-slate-900 dark:text-slate-100">
                        {currentLesson.title}
                      </h5>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                        {currentLesson.type} • {currentLesson.durationMinutes} mins
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {currentLesson.summary}
                    </p>

                    <div>
                      <span className="text-[10px] font-black uppercase text-amber-800 dark:text-amber-300 tracking-wider block mb-1.5">
                        Key Takeaways:
                      </span>
                      <ul className="space-y-1">
                        {currentLesson.keyTakeaways.map((point, idx) => (
                          <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => onNavigate?.('student-lesson')}
                        className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>Launch Full Student Lesson Screen (Video, PDF, Audio & Quiz)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TIER 6: QUIZ QUESTIONS INTERACTIVE RUNNER */}
            {currentLesson && currentLesson.quizQuestions.length > 0 && (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-5 h-5 rounded-lg bg-rose-600 text-white text-[10px] font-black flex items-center justify-center">6</span>
                      Quiz Questions (quiz_questions) Practice Engine
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Practice interactive questions for {currentLesson.title} with real-time feedback and explanations.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setTeluguLanguageToggle(!teluguLanguageToggle)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                        teluguLanguageToggle
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 border-slate-300'
                      }`}
                    >
                      {teluguLanguageToggle ? 'TELUGU ENABLED (తెలుగు)' : 'ENGLISH ONLY'}
                    </button>
                  </div>
                </div>

                {/* QUESTIONS LIST */}
                <div className="space-y-6">
                  {currentLesson.quizQuestions.map((q, qIndex) => {
                    const selectedOpt = quizAnswers[q.id];
                    const isAnswered = selectedOpt !== undefined;
                    const isCorrect = selectedOpt === q.correctIndex;

                    return (
                      <div
                        key={q.id}
                        className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-4"
                      >
                        {/* QUESTION TEXT & VOICE */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                              Question {qIndex + 1} • {q.difficulty || 'Medium'}
                            </span>
                            <h5 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                              {q.question}
                            </h5>
                            {teluguLanguageToggle && q.teluguQuestion && (
                              <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 italic">
                                {q.teluguQuestion}
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() => handleSpeakText(q.question + (q.teluguQuestion ? `. ${q.teluguQuestion}` : ''))}
                            className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shrink-0"
                            title="Listen to Question Audio"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* OPTIONS */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {q.options.map((option, optIdx) => {
                            let optStyle =
                              'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-400';

                            if (isAnswered) {
                              if (optIdx === q.correctIndex) {
                                optStyle = 'bg-emerald-500 text-white border-emerald-600 font-bold shadow-md';
                              } else if (selectedOpt === optIdx) {
                                optStyle = 'bg-rose-500 text-white border-rose-600 font-bold';
                              } else {
                                optStyle = 'bg-slate-100 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800 opacity-50';
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleSelectQuizOption(q.id, optIdx)}
                                className={`p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${optStyle}`}
                              >
                                <span className="flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-md bg-slate-200/50 dark:bg-slate-800 text-[10px] font-black flex items-center justify-center">
                                    {String.fromCharCode(65 + optIdx)}
                                  </span>
                                  <span>{option}</span>
                                </span>

                                {isAnswered && optIdx === q.correctIndex && (
                                  <CheckCircle className="w-4 h-4 text-white shrink-0" />
                                )}
                                {isAnswered && selectedOpt === optIdx && optIdx !== q.correctIndex && (
                                  <XCircle className="w-4 h-4 text-white shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* EXPLANATION */}
                        {isAnswered && (
                          <div
                            className={`p-4 rounded-xl border text-xs space-y-1 ${
                              isCorrect
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-200'
                                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-900 dark:text-rose-200'
                            }`}
                          >
                            <span className="font-extrabold uppercase text-[10px] tracking-wider block">
                              {isCorrect ? '✓ Correct Answer!' : '✗ Incorrect'}
                            </span>
                            <p>{q.explanation}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FULL TREE OVERVIEW MODE */}
      {viewMode === 'tree-overview' && (
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-indigo-600" />
              Full System Tree Representation
            </h3>
            <p className="text-xs text-slate-500">
              Interactive structural view of all 5 level categories, 16 classes, 45 subjects, chapters, and quiz banks.
            </p>
          </div>

          <div className="space-y-6">
            {EDUAI_6_TIER_CURRICULUM.map((level) => {
              const IconComp = getLevelIcon(level.icon);

              return (
                <div key={level.id} className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-700 pb-3">
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${level.color} text-white flex items-center justify-center`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-base text-slate-900 dark:text-slate-100">{level.name}</h4>
                      <span className="text-[10px] font-bold text-slate-400">{level.category}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {level.classes.map((cls) => (
                      <div key={cls.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                        <h5 className="font-extrabold text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{cls.name}</h5>
                        <div className="space-y-1">
                          {cls.subjects.map((subj) => (
                            <div key={subj.id} className="text-xs text-slate-700 dark:text-slate-300 font-bold flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                              <span>• {subj.name}</span>
                              <span className="text-[10px] text-slate-400">{subj.chapters.length} Ch.</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
