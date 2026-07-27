import React, { useState } from 'react';
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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MOCK_STUDENT_REPORTS, EDUCATION_LEVELS } from '../data/mockData';
import { Course, EducationLevel } from '../types';

export const TeacherDashboard: React.FC = () => {
  const { addCourse, setActiveTab, addChatMessage } = useAuth();

  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseLevel, setCourseLevel] = useState<EducationLevel>('Class 6–10');
  const [courseSubject, setCourseSubject] = useState('Mathematics');
  const [courseDesc, setCourseDesc] = useState('');

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle) return;

    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title: courseTitle,
      level: courseLevel,
      subject: courseSubject,
      description: courseDesc || 'Interactive curriculum designed by faculty with AI notes and video lessons.',
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
      pdfCount: 4,
      videoCount: 10,
      enrolledCount: 1,
      rating: 5.0,
      instructor: 'Dr. Anitha Rao',
      category: 'Teacher Created',
      modules: [
        { id: 'm1', title: 'Chapter 1: Core Fundamentals & Formulas', duration: '15 mins', type: 'video' },
        { id: 'm2', title: 'Chapter 1: Download Printable PDF Smart Notes', duration: 'PDF', type: 'pdf' },
      ],
    };

    addCourse(newCourse);
    setShowAddCourseModal(false);
    setCourseTitle('');
    alert('Course created successfully and published to student library!');
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-700 text-white shadow-xl shadow-indigo-600/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold">
            Dr. Anitha Rao • Faculty Portal
          </span>
          <h1 className="text-2xl font-black mt-2">Teacher & Educator Dashboard</h1>
          <p className="text-xs text-indigo-100 mt-1">
            Create courses, upload PDFs & videos, review student performance reports, and use AI to auto-generate exam papers.
          </p>
        </div>

        <button
          onClick={() => setShowAddCourseModal(true)}
          className="px-5 py-3 rounded-2xl bg-white text-indigo-900 font-bold text-xs flex items-center gap-2 shadow-lg hover:bg-indigo-50 transition-transform active:scale-95 shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-indigo-600" />
          <span>Publish New Course</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="text-2xl font-black text-slate-800 dark:text-slate-100">142</div>
          <div className="text-xs text-slate-500">Enrolled Students</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="text-2xl font-black text-emerald-600">94.8%</div>
          <div className="text-xs text-slate-500">Average Class Attendance</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="text-2xl font-black text-amber-500">18</div>
          <div className="text-xs text-slate-500">Assignments Pending Review</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="text-2xl font-black text-indigo-600">8</div>
          <div className="text-xs text-slate-500">Active Courses Published</div>
        </div>
      </div>

      {/* Student Performance Reports Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <span>Student Performance & Weak Topic Reports</span>
          </h2>
          <button
            onClick={() => {
              addChatMessage({
                id: `m-${Date.now()}`,
                role: 'user',
                text: 'Help me draft a 10-question math assignment for Class 10 Board exam with step-by-step answer keys.',
                timestamp: 'Just now',
              });
              setActiveTab('ai-tutor');
            }}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-xs font-bold flex items-center gap-1.5 hover:bg-indigo-100"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate AI Assignment</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-200">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3 rounded-l-xl">Student Name</th>
                <th className="p-3">Level</th>
                <th className="p-3">Attendance</th>
                <th className="p-3">Average Grade</th>
                <th className="p-3">AI Identified Weak Topics</th>
                <th className="p-3 rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {MOCK_STUDENT_REPORTS.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="p-3 font-bold flex items-center gap-2">
                    <img src={s.avatar} alt={s.studentName} className="w-7 h-7 rounded-full object-cover" />
                    <span>{s.studentName}</span>
                  </td>
                  <td className="p-3">{s.level}</td>
                  <td className="p-3 font-bold text-emerald-600">{s.attendancePercent}%</td>
                  <td className="p-3 font-bold">{s.averageGrade}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {s.weakTopics.map((w, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[10px] font-semibold">
                          {w.topic} ({w.score}%)
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => alert(`Sending personalized AI study plan to ${s.studentName}...`)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[10px]"
                    >
                      Send Plan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Publish New Course */}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4">
            <h2 className="text-lg font-black text-slate-800 dark:text-slate-100">
              Publish New Course / Curriculum
            </h2>

            <form onSubmit={handleCreateCourse} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Course Title:</label>
                <input
                  type="text"
                  required
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="e.g. Class 10 Trigonometry & Applications"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Level:</label>
                  <select
                    value={courseLevel}
                    onChange={(e) => setCourseLevel(e.target.value as EducationLevel)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs outline-none"
                  >
                    {EDUCATION_LEVELS.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Subject:</label>
                  <input
                    type="text"
                    value={courseSubject}
                    onChange={(e) => setCourseSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Course Description:</label>
                <textarea
                  rows={3}
                  value={courseDesc}
                  onChange={(e) => setCourseDesc(e.target.value)}
                  placeholder="Overview of lessons, video topics, and formula sheets..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md"
                >
                  Publish Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
