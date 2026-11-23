import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Smartphone,
  Server,
  ShieldAlert,
  Bot,
  BookOpen,
  FileQuestion,
  Video,
  FileText,
  TrendingUp,
  Bell,
  Database,
  HardDrive,
  Lock,
  Cpu,
  BarChart3,
  Users,
  Upload,
  PlusCircle,
  FileCheck2,
  Send,
  Zap,
  CheckCircle2,
  ArrowRight,
  ArrowDown,
  Activity,
  Play,
  RefreshCw,
  Terminal,
  Code2,
  Sparkles,
  ExternalLink,
  Layers,
  Globe,
  Radio,
} from 'lucide-react';

interface SystemArchitectureProps {
  onNavigate?: (tabId: string) => void;
}

export const SystemArchitecture: React.FC<SystemArchitectureProps> = ({ onNavigate }) => {
  // Selected Node for detailed inspection
  const [selectedNode, setSelectedNode] = useState<'app' | 'backend' | 'admin' | null>('app');

  // Simulated Live Trace Action
  const [activeTraceAction, setActiveTraceAction] = useState<string | null>(null);
  const [traceLogs, setTraceLogs] = useState<string[]>([]);
  const [isTracing, setIsTracing] = useState(false);

  const handleSimulateFlow = (actionName: string, logs: string[]) => {
    setActiveTraceAction(actionName);
    setIsTracing(true);
    setTraceLogs([]);

    logs.forEach((log, index) => {
      setTimeout(() => {
        setTraceLogs((prev) => [...prev, log]);
        if (index === logs.length - 1) {
          setIsTracing(false);
        }
      }, (index + 1) * 600);
    });
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-200">
      {/* HEADER BANNER */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden shadow-2xl border border-indigo-500/30">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" /> Full-Stack Architecture Visualizer
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> End-to-End System Connected
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              EduAI Complete Ecosystem Architecture & Data Flow
            </h1>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Interactive map connecting Student Android App, Cloud Backend Services (Firebase, Gemini 2.5 Flash API, Offline Storage), and Admin Control Center. Simulate real-time request packets and inspect underlying system pipelines.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() =>
                handleSimulateFlow('Student Doubt -> Gemini AI Voice API', [
                  '[1/4] Android App: Student speaks question in Telugu on mobile device...',
                  '[2/4] App Gateway: Audio stream compressed & sent over secure WebSocket...',
                  '[3/4] Backend (Gemini API): Gemini 2.5 Flash processes question & generates Telugu audio response...',
                  '[4/4] Firestore: Conversation logged & progress analytics updated instantly!',
                ])
              }
              disabled={isTracing}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Trace Live AI Doubt Query</span>
            </button>
          </div>
        </div>
      </div>

      {/* SYSTEM ARCHITECTURE INTERACTIVE DIAGRAM FLOW */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              System Topology Map
            </h3>
            <p className="text-xs text-slate-500">Click any block to inspect components or trigger a live telemetry simulation.</p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>All Systems Operational (100% Uptime)</span>
          </div>
        </div>

        {/* DIAGRAM NODES LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
          {/* ================================================================= */}
          {/* NODE 1: ANDROID APP (CLIENT LAYER) */}
          {/* ================================================================= */}
          <div
            onClick={() => setSelectedNode('app')}
            className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative ${
              selectedNode === 'app'
                ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-500 shadow-xl'
                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-base text-slate-900 dark:text-slate-100">Android App</h4>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                    STUDENT CLIENT LAYER
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              Mobile application with offline caching, local SQLite vault, and multi-lingual voice rendering.
            </p>

            {/* Sub-Components Grid */}
            <div className="space-y-2">
              {[
                { icon: Bot, name: 'AI Chat', desc: 'Telugu & English Voice Assistant', tab: 'ai-tutor' },
                { icon: BookOpen, name: 'Courses', desc: 'LKG to B.Tech Curriculum', tab: 'courses' },
                { icon: FileQuestion, name: 'Quizzes', desc: 'SCERT & CBSE Mock Tests', tab: 'tests' },
                { icon: Video, name: 'Videos', desc: 'Video Lessons & Lectures', tab: 'courses' },
                { icon: FileText, name: 'PDFs', desc: 'Textbooks & PYQ Model Papers', tab: 'study-materials' },
                { icon: TrendingUp, name: 'Progress Tracking', desc: 'Streaks & Topic Mastery', tab: 'dashboard' },
                { icon: Bell, name: 'Notifications', desc: 'Study Alerts & Reminders', tab: 'notifications' },
              ].map((sub, idx) => {
                const Icon = sub.icon;
                return (
                  <div
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onNavigate) onNavigate(sub.tab);
                    }}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200 block">{sub.name}</span>
                        <span className="text-[10px] text-slate-400">{sub.desc}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================================================================= */}
          {/* NODE 2: BACKEND (FIREBASE / SERVER) */}
          {/* ================================================================= */}
          <div
            onClick={() => setSelectedNode('backend')}
            className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative ${
              selectedNode === 'backend'
                ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-500 shadow-xl'
                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-amber-300'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-base text-slate-900 dark:text-slate-100">Backend Server</h4>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300">
                    FIREBASE & CLOUD API
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              Cloud architecture powered by Firebase Firestore, Storage, Gemini API, and Express API proxies.
            </p>

            {/* Sub-Components Grid */}
            <div className="space-y-2">
              {[
                { icon: Database, name: 'Database', desc: 'Firestore NoSQL Collections' },
                { icon: HardDrive, name: 'Storage', desc: 'PDFs & Media Content Buckets' },
                { icon: Lock, name: 'Authentication', desc: 'Firebase Auth & OAuth 2.0' },
                { icon: Cpu, name: 'AI API Gateway', desc: 'Gemini 2.5 Flash & Voice Synthesizer' },
                { icon: BarChart3, name: 'Analytics', desc: 'Real-time Learning Telemetry' },
              ].map((sub, idx) => {
                const Icon = sub.icon;
                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <div>
                        <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200 block">{sub.name}</span>
                        <span className="text-[10px] text-slate-400">{sub.desc}</span>
                      </div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================================================================= */}
          {/* NODE 3: ADMIN PANEL (CONTROL CENTER) */}
          {/* ================================================================= */}
          <div
            onClick={() => setSelectedNode('admin')}
            className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative ${
              selectedNode === 'admin'
                ? 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-500 shadow-xl'
                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-rose-300'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/30">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-base text-slate-900 dark:text-slate-100">Admin Control Panel</h4>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300">
                    MANAGEMENT LAYER
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              Central operational console for school admins, teachers, and content creators.
            </p>

            {/* Sub-Components Grid */}
            <div className="space-y-2">
              {[
                { icon: Users, name: 'Manage Users', desc: 'Ban/Activate & Role Settings', tab: 'admin_panel' },
                { icon: Upload, name: 'Upload Content', desc: 'Syllabi, PDFs & Video Lessons', tab: 'admin_panel' },
                { icon: PlusCircle, name: 'Create Quizzes', desc: 'AI Exam Generator & Keys', tab: 'admin_panel' },
                { icon: FileCheck2, name: 'View Reports', desc: 'School & Student Insights', tab: 'admin_panel' },
                { icon: Send, name: 'Send Notifications', desc: 'Push & WhatsApp Broadcasts', tab: 'admin_panel' },
              ].map((sub, idx) => {
                const Icon = sub.icon;
                return (
                  <div
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onNavigate) onNavigate(sub.tab);
                    }}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200 block">{sub.name}</span>
                        <span className="text-[10px] text-slate-400">{sub.desc}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* REAL-TIME DATA FLOW SIMULATOR CONSOLE */}
        <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-xs font-bold text-slate-300 uppercase">
                Real-Time Data Pipeline Trace Log
              </span>
            </div>
            {isTracing && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold animate-pulse flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" /> TRACING PACKET...
              </span>
            )}
          </div>

          <div className="space-y-2 font-mono text-xs min-h-[100px] max-h-[180px] overflow-y-auto">
            {traceLogs.length === 0 ? (
              <p className="text-slate-500 italic">
                No active trace. Click "Trace Live AI Doubt Query" or select an action above to view packet logs.
              </p>
            ) : (
              traceLogs.map((log, i) => (
                <div key={i} className="text-emerald-400 flex items-start gap-2">
                  <span className="text-slate-600 select-none">&gt;</span>
                  <span>{log}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
