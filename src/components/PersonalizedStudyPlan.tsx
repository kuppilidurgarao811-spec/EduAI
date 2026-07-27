import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  Target,
  Trophy,
  Trash2,
  Crown,
  ChevronRight,
  Zap,
  Check,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StudyPlan, StudyPlanTask, EducationLevel } from '../types';
import { EDUCATION_LEVELS } from '../data/mockData';

export const PersonalizedStudyPlan: React.FC = () => {
  const {
    user,
    educationLevel,
    isPremium,
    setShowPremiumModal,
    studyPlans,
    addStudyPlan,
    toggleStudyTaskComplete,
    deleteStudyPlan,
  } = useAuth();

  const [showGenerator, setShowGenerator] = useState(false);
  const [targetExam, setTargetExam] = useState('AP/TS Board Exam 2026');
  const [durationDays, setDurationDays] = useState<number>(7);
  const [dailyHours, setDailyHours] = useState<number>(3);
  const [selectedWeakSubjects, setSelectedWeakSubjects] = useState<string[]>(['Mathematics', 'Physics']);
  const [customSubjectInput, setCustomSubjectInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activePlanId, setActivePlanId] = useState<string>(studyPlans[0]?.id || '');

  const AVAILABLE_SUBJECTS = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English Grammar & Vocabulary',
    'Telugu Language & Literature',
    'Hindi',
    'Computer Science & Python',
    'Social Studies & Civics',
    'General Studies & Current Affairs',
    'Quantitative Aptitude & Reasoning',
  ];

  const toggleSubjectSelection = (subj: string) => {
    setSelectedWeakSubjects((prev) =>
      prev.includes(subj) ? prev.filter((s) => s !== subj) : [...prev, subj]
    );
  };

  const handleGeneratePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPremium && studyPlans.length >= 2) {
      setShowPremiumModal(true);
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const generatedTasks: StudyPlanTask[] = [];
      let taskIdCounter = 1;

      for (let day = 1; day <= durationDays; day++) {
        selectedWeakSubjects.forEach((subj, idx) => {
          const taskTypes: ('concept_video' | 'practice_quiz' | 'formula_revision' | 'mock_test' | 'notes_summary')[] = [
            'concept_video',
            'practice_quiz',
            'formula_revision',
            'notes_summary',
            'mock_test',
          ];

          const topicsBySubject: Record<string, string[]> = {
            Mathematics: [
              'Real Numbers & Polynomial Factorization',
              'Quadratic Equations & Quadratic Formula Proofs',
              'Trigonometric Identities & Height-Distance Problems',
              'Coordinate Geometry & Straight Line Distance',
              'Calculus Limits, Derivatives & Integration Techniques',
            ],
            Physics: [
              'Light Reflection, Refraction & Lens Formula',
              'Electricity, Ohm’s Law & Resistors in Series',
              'Electromagnetism, Faraday’s Law & Induction',
              'Kinematics, Laws of Motion & Projectile Equations',
            ],
            Chemistry: [
              'Chemical Reactions & Balancing Equations',
              'Acids, Bases & pH Scale Calculations',
              'Periodic Table Trends & Chemical Bonding',
              'Organic Chemistry & Hydrocarbon Nomenclature',
            ],
            Default: [
              'Core Concept Mastery & Key Definitions',
              'Practice Exercises & Solved Examples',
              'Important Formulas & Diagram Review',
              'Previous Year Question Papers Practice',
            ],
          };

          const topics = topicsBySubject[subj] || topicsBySubject.Default;
          const topicName = topics[(day + idx) % topics.length];

          generatedTasks.push({
            id: `task-gen-${Date.now()}-${taskIdCounter++}`,
            dayNumber: day,
            subject: subj,
            topic: topicName,
            durationMinutes: Math.round((dailyHours * 60) / selectedWeakSubjects.length),
            taskType: taskTypes[(day + idx) % taskTypes.length],
            completed: false,
          });
        });
      }

      const newPlan: StudyPlan = {
        id: `plan-${Date.now()}`,
        title: `${durationDays}-Day ${targetExam} Goal Plan`,
        targetExam,
        educationLevel,
        durationDays,
        dailyHours,
        weakSubjects: selectedWeakSubjects,
        createdAt: new Date().toISOString().split('T')[0],
        overallProgressPercent: 0,
        tasks: generatedTasks,
      };

      addStudyPlan(newPlan);
      setActivePlanId(newPlan.id);
      setIsGenerating(false);
      setShowGenerator(false);
    }, 1200);
  };

  const currentPlan = studyPlans.find((p) => p.id === activePlanId) || studyPlans[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-300" /> AI Study Assistant
              </span>
              {isPremium ? (
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 uppercase flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-300" /> Premium Unlimited Generator Active
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  Free Plan: 1 Active Plan
                </span>
              )}
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Personalized AI Study Timetables
            </h2>
            <p className="text-xs md:text-sm text-indigo-200/90 leading-relaxed">
              Target your weak subjects, set exam deadlines, and let AI structure your day-by-day study schedule with interactive checklists and revision milestones.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowGenerator(!showGenerator)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-105 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Generate New AI Study Plan</span>
          </button>
        </div>
      </div>

      {/* AI Generator Modal / Form Drawer */}
      {showGenerator && (
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-500/40 shadow-xl space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" /> Create Custom AI Study Plan
              </h3>
              <p className="text-xs text-slate-500">
                Tailored for {educationLevel}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowGenerator(false)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleGeneratePlan} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Target Exam */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Target Exam / Goal
                </label>
                <input
                  type="text"
                  required
                  value={targetExam}
                  onChange={(e) => setTargetExam(e.target.value)}
                  placeholder="e.g. Board Exam 2026, EAMCET, JEE Mains"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold outline-none focus:border-indigo-500"
                />
              </div>

              {/* Duration Days */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Plan Duration (Days)
                </label>
                <select
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold outline-none"
                >
                  <option value={7}>7 Days (Sprint Crash Course)</option>
                  <option value={14}>14 Days (Two-Week Revision)</option>
                  <option value={30}>30 Days (Full Exam Prep)</option>
                  <option value={60}>60 Days (Comprehensive Mastery)</option>
                </select>
              </div>

              {/* Daily Study Commitment */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Daily Study Hours Target
                </label>
                <select
                  value={dailyHours}
                  onChange={(e) => setDailyHours(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold outline-none"
                >
                  <option value={2}>2 Hours / Day (Light Revision)</option>
                  <option value={3}>3 Hours / Day (Standard)</option>
                  <option value={5}>5 Hours / Day (Intensive Prep)</option>
                </select>
              </div>
            </div>

            {/* Select Weak Subjects */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Select Weak Subjects to Focus On</span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                  {selectedWeakSubjects.length} selected
                </span>
              </label>

              <div className="flex flex-wrap gap-2">
                {AVAILABLE_SUBJECTS.map((subj) => {
                  const isSelected = selectedWeakSubjects.includes(subj);
                  return (
                    <button
                      key={subj}
                      type="button"
                      onClick={() => toggleSubjectSelection(subj)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{subj}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowGenerator(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isGenerating || selectedWeakSubjects.length === 0}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>AI Generating Timetable...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Build AI Study Plan</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Plan Navigation Tabs */}
      {studyPlans.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
          {studyPlans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setActivePlanId(plan.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 ${
                currentPlan?.id === plan.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>{plan.title}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white/20 text-white">
                {plan.overallProgressPercent}%
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Active Plan Detail Dashboard */}
      {currentPlan ? (
        <div className="space-y-6">
          
          {/* Plan Header Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {currentPlan.targetExam}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Created on {currentPlan.createdAt}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">
                  {currentPlan.title}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Delete this study plan?')) {
                      deleteStudyPlan(currentPlan.id);
                    }
                  }}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Delete Study Plan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-500" /> Plan Completion Progress
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 font-black">
                  {currentPlan.overallProgressPercent}% Complete
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${currentPlan.overallProgressPercent}%` }}
                />
              </div>
            </div>

            {/* Plan Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Duration</p>
                <p className="text-sm font-black text-slate-800 dark:text-slate-100">{currentPlan.durationDays} Days</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Daily Goal</p>
                <p className="text-sm font-black text-slate-800 dark:text-slate-100">{currentPlan.dailyHours} Hours / Day</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Total Tasks</p>
                <p className="text-sm font-black text-slate-800 dark:text-slate-100">{currentPlan.tasks.length} Checklists</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Focus Subjects</p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                  {currentPlan.weakSubjects.join(', ')}
                </p>
              </div>
            </div>
          </div>

          {/* Daily Schedule Task Checklist Grouped by Day */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500" /> Day-by-Day Study Schedule & Checklists
            </h4>

            {Array.from({ length: currentPlan.durationDays }, (_, i) => i + 1).map((dayNum) => {
              const dayTasks = currentPlan.tasks.filter((t) => t.dayNumber === dayNum);
              if (dayTasks.length === 0) return null;

              const allCompleted = dayTasks.every((t) => t.completed);

              return (
                <div
                  key={dayNum}
                  className={`p-5 rounded-3xl border transition-all ${
                    allCompleted
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                        allCompleted ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white'
                      }`}>
                        D{dayNum}
                      </span>
                      <h5 className="text-xs font-black text-slate-800 dark:text-slate-100">
                        Day {dayNum} Schedule
                      </h5>
                    </div>

                    {allCompleted && (
                      <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> Day Complete!
                      </span>
                    )}
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800/80 pt-1">
                    {dayTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => toggleStudyTaskComplete(currentPlan.id, task.id)}
                        className="py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded-xl transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors shrink-0"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-300 dark:text-slate-700" />
                            )}
                          </button>

                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                                {task.subject}
                              </span>
                              <span className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {task.durationMinutes} mins
                              </span>
                            </div>

                            <p className={`text-xs font-bold ${
                              task.completed
                                ? 'line-through text-slate-400'
                                : 'text-slate-800 dark:text-slate-100'
                            }`}>
                              {task.topic}
                            </p>

                            {task.notes && (
                              <p className="text-[11px] text-slate-500 italic">
                                Note: {task.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold capitalize bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                          {task.taskType.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">
            No Study Plans Created Yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click "Generate New AI Study Plan" to build a customized timetable tailored to your upcoming exams and weak subjects.
          </p>
        </div>
      )}
    </div>
  );
};
