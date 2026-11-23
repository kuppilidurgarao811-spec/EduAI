import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Server,
  Cloud,
  Cpu,
  Database,
  Zap,
  Activity,
  HardDrive,
  RefreshCw,
  Video,
  Globe,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowUpRight,
  Gauge,
  TrendingUp,
  Layers,
  Clock,
  Download,
  Upload,
  Lock,
  Wifi,
  Radio,
  Sliders,
  Sparkles,
  BarChart2,
  Trash2,
  RotateCcw,
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
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';

// Mock Telemetry Performance Data over 24 Hours
const TELEMETRY_24H = [
  { time: '00:00', rps: 180, latencyMs: 18, cpuPercent: 22, memoryPercent: 35, cacheHitRatio: 98.2 },
  { time: '03:00', rps: 90, latencyMs: 14, cpuPercent: 15, memoryPercent: 32, cacheHitRatio: 99.1 },
  { time: '06:00', rps: 210, latencyMs: 20, cpuPercent: 28, memoryPercent: 38, cacheHitRatio: 97.8 },
  { time: '09:00', rps: 520, latencyMs: 26, cpuPercent: 52, memoryPercent: 48, cacheHitRatio: 96.4 },
  { time: '12:00', rps: 680, latencyMs: 31, cpuPercent: 64, memoryPercent: 55, cacheHitRatio: 95.8 },
  { time: '15:00', rps: 750, latencyMs: 34, cpuPercent: 71, memoryPercent: 61, cacheHitRatio: 95.1 },
  { time: '18:00', rps: 890, latencyMs: 38, cpuPercent: 78, memoryPercent: 66, cacheHitRatio: 94.6 },
  { time: '21:00', rps: 610, latencyMs: 28, cpuPercent: 58, memoryPercent: 50, cacheHitRatio: 96.9 },
];

// CDN Edge Nodes Performance Data
const CDN_NODES = [
  { region: 'Visakhapatnam (Local Edge)', code: 'VTZ-01', latency: '4 ms', cacheHit: '99.4%', status: 'Healthy', activeStreams: 1420 },
  { region: 'Hyderabad (Central South)', code: 'HYD-02', latency: '8 ms', cacheHit: '98.8%', status: 'Healthy', activeStreams: 3250 },
  { region: 'Chennai (Coastal Hub)', code: 'MAA-01', latency: '11 ms', cacheHit: '98.1%', status: 'Healthy', activeStreams: 2180 },
  { region: 'Mumbai (Primary DC)', code: 'BOM-01', latency: '16 ms', cacheHit: '97.5%', status: 'Healthy', activeStreams: 4890 },
  { region: 'Bengaluru (Cloud Edge)', code: 'BLR-02', latency: '12 ms', cacheHit: '98.6%', status: 'Healthy', activeStreams: 2940 },
];

// Microservices Cluster Health
const SERVICES_HEALTH = [
  { name: 'Authentication & Role Service', instances: 4, rps: 180, uptime: '99.99%', latency: '12 ms', status: 'Optimal' },
  { name: 'Gemini AI Proxy & Stream Engine', instances: 8, rps: 340, uptime: '99.95%', latency: '42 ms', status: 'Optimal' },
  { name: 'HLS Video CDN Streaming Server', instances: 12, rps: 820, uptime: '100.0%', latency: '8 ms', status: 'Optimal' },
  { name: 'Real-Time Voice WebSocket Gateway', instances: 6, rps: 210, uptime: '99.98%', latency: '18 ms', status: 'Optimal' },
  { name: 'Firestore & Vector DB Sync Engine', instances: 5, rps: 450, uptime: '99.99%', latency: '15 ms', status: 'Optimal' },
];

export const PlatformScaling: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    'cloud' | 'cdn' | 'backups' | 'performance' | 'caching'
  >('cloud');

  // Cloud Autoscaling state
  const [minInstances, setMinInstances] = useState(3);
  const [maxInstances, setMaxInstances] = useState(50);
  const [cpuScaleThreshold, setCpuScaleThreshold] = useState(70);
  const [isScalingSimulated, setIsScalingSimulated] = useState(false);
  const [autoscalingLogs, setAutoscalingLogs] = useState<string[]>([
    '2026-08-10 02:15:00 - Autoscaler: Scaled from 6 to 8 instances due to evening study traffic spike (+450 users).',
    '2026-08-10 01:00:00 - Healthcheck: All 8 container replicas passed 100% probe checks.',
    '2026-08-09 23:30:00 - Deployment: Rolling update to v1.2.5 completed with zero downtime.',
  ]);

  // CDN State
  const [cdnQuality, setCdnQuality] = useState<'Auto (4K/1080p)' | '1080p 60fps' | '720p Mobile' | '480p Low Data'>('Auto (4K/1080p)');
  const [videoPurgeUrl, setVideoPurgeUrl] = useState('');
  const [purgeSuccess, setPurgeSuccess] = useState(false);

  // Backup State
  const [backupSchedule, setBackupSchedule] = useState<'hourly' | 'daily' | 'weekly'>('hourly');
  const [backupLogs, setBackupLogs] = useState([
    { id: 'bk-104', date: '2026-08-10 02:00:00', size: '4.25 GB', type: 'Automated Snapshot (Hourly)', status: 'Verified & Encrypted' },
    { id: 'bk-103', date: '2026-08-10 01:00:00', size: '4.22 GB', type: 'Automated Snapshot (Hourly)', status: 'Verified & Encrypted' },
    { id: 'bk-102', date: '2026-08-09 23:00:00', size: '4.18 GB', type: 'Full Database Backup (Daily)', status: 'Verified & Encrypted' },
  ]);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [selectedBackupToRestore, setSelectedBackupToRestore] = useState<any>(null);
  const [restoreSuccess, setRestoreSuccess] = useState(false);

  // Performance Telemetry State
  const [liveMetrics, setLiveMetrics] = useState({
    activeReplicas: 12,
    avgLatencyMs: 24,
    rps: 485,
    cpuLoad: 38,
    memoryLoad: 42,
    redisCacheHitRate: 98.4,
    bandwidthSavedGb: 1420,
  });

  // Caching State
  const [cachePurgedMsg, setCachePurgedMsg] = useState(false);
  const [cacheWarmupMsg, setCacheWarmupMsg] = useState(false);
  const [autoPrefetchOffline, setAutoPrefetchOffline] = useState(true);

  // Simulate real-time metrics fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics((prev) => ({
        ...prev,
        rps: Math.floor(450 + Math.random() * 80),
        avgLatencyMs: Math.floor(22 + Math.random() * 6),
        cpuLoad: Math.floor(36 + Math.random() * 8),
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateLoadTest = () => {
    setIsScalingSimulated(true);
    const newLog = `2026-08-10 ${new Date().toLocaleTimeString()} - Load Test: Simulated 2,500 simultaneous users. Autoscaler triggered +4 instances (8 -> 12 instances).`;
    setAutoscalingLogs((prev) => [newLog, ...prev]);
    setTimeout(() => {
      setIsScalingSimulated(false);
    }, 3000);
  };

  const handleTriggerManualBackup = () => {
    setIsCreatingBackup(true);
    setTimeout(() => {
      const newBk = {
        id: `bk-${Date.now().toString().slice(-3)}`,
        date: new Date().toISOString().replace('T', ' ').slice(0, 19),
        size: '4.28 GB',
        type: 'Manual Instant Backup (Admin)',
        status: 'Verified & Encrypted',
      };
      setBackupLogs((prev) => [newBk, ...prev]);
      setIsCreatingBackup(false);
    }, 2500);
  };

  const handlePurgeCdnVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoPurgeUrl.trim()) return;
    setPurgeSuccess(true);
    setTimeout(() => {
      setPurgeSuccess(false);
      setVideoPurgeUrl('');
    }, 3000);
  };

  const handlePurgeAllCaches = () => {
    setCachePurgedMsg(true);
    setTimeout(() => setCachePurgedMsg(false), 3000);
  };

  const handleWarmupCaches = () => {
    setCacheWarmupMsg(true);
    setTimeout(() => setCacheWarmupMsg(false), 3000);
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-200">
      {/* HEADER BANNER */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white relative overflow-hidden shadow-2xl border border-indigo-500/30">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider flex items-center gap-1.5">
                <Cloud className="w-3.5 h-3.5 text-amber-400" /> Platform Scaling & Infrastructure (Phase 20)
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> High Availability Cluster Active
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Cloud Services, CDN, Automated Backups & Performance Tuning
            </h1>
            <p className="text-xs md:text-sm text-indigo-200/90 leading-relaxed">
              Enterprise scaling engine powering EduAI platform across regional edge nodes in Visakhapatnam, Hyderabad, Chennai, and Mumbai. Monitors autoscaling instances, video CDN hit rates, automated point-in-time database backups, and multi-tier memory caching.
            </p>
          </div>

          {/* Quick Header Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <p className="text-[10px] font-bold text-indigo-300 uppercase">Live RPS</p>
              <p className="text-xl font-black text-white">{liveMetrics.rps} req/s</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <p className="text-[10px] font-bold text-indigo-300 uppercase">CDN Hit Ratio</p>
              <p className="text-xl font-black text-amber-400">{liveMetrics.redisCacheHitRate}%</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center col-span-2 sm:col-span-1">
              <p className="text-[10px] font-bold text-indigo-300 uppercase">P95 Latency</p>
              <p className="text-xl font-black text-emerald-400">{liveMetrics.avgLatencyMs} ms</p>
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION SUB-TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'cloud', label: '1. Cloud Hosting & Autoscaling', icon: Cloud, badge: `${liveMetrics.activeReplicas} Replicas` },
          { id: 'cdn', label: '2. Video CDN & Streaming', icon: Video, badge: 'Edge 98.4%' },
          { id: 'backups', label: '3. Automatic Backups', icon: Database, badge: 'Point-In-Time' },
          { id: 'performance', label: '4. Server Telemetry & Latency', icon: Activity, badge: `${liveMetrics.avgLatencyMs}ms` },
          { id: 'caching', label: '5. Caching & Fast Loading', icon: Zap, badge: 'Redis + PWA' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
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
        {/* MODULE 1: CLOUD HOSTING & AUTOSCALING */}
        {/* ==================================================================== */}
        {activeSubTab === 'cloud' && (
          <motion.div
            key="mod-cloud"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    {liveMetrics.activeReplicas} Containers
                  </div>
                  <div className="text-xs font-semibold text-slate-500">Active Container Replicas</div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold">
                  <Server className="w-5 h-5" />
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-2xl font-black text-emerald-600">{liveMetrics.cpuLoad}%</div>
                  <div className="text-xs font-semibold text-slate-500">Container CPU Load</div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                  <Cpu className="w-5 h-5" />
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
                    {liveMetrics.memoryLoad}%
                  </div>
                  <div className="text-xs font-semibold text-slate-500">RAM Memory Footprint</div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">
                  <HardDrive className="w-5 h-5" />
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-2xl font-black text-amber-500">Zero-Downtime</div>
                  <div className="text-xs font-semibold text-slate-500">Rolling Deployments</div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-500 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Autoscaling Config & Test Control Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-indigo-600" />
                    Cloud Run Container Autoscaler Configuration
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                    Auto-Scale Active
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700 dark:text-slate-300">Minimum Container Instances (Idle Floor)</span>
                      <span className="text-indigo-600">{minInstances} Replicas</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={minInstances}
                      onChange={(e) => setMinInstances(Number(e.target.value))}
                      className="w-full accent-indigo-600 h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
                    />
                    <p className="text-[11px] text-slate-400">Ensures instant response times with zero cold start delay.</p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700 dark:text-slate-300">Maximum Container Scale Ceiling</span>
                      <span className="text-indigo-600">{maxInstances} Replicas</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={maxInstances}
                      onChange={(e) => setMaxInstances(Number(e.target.value))}
                      className="w-full accent-indigo-600 h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
                    />
                    <p className="text-[11px] text-slate-400">Protects budget while auto-scaling to handle peak exam traffic.</p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700 dark:text-slate-300">Target CPU Utilization Scale Trigger</span>
                      <span className="text-indigo-600">{cpuScaleThreshold}% CPU</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="90"
                      value={cpuScaleThreshold}
                      onChange={(e) => setCpuScaleThreshold(Number(e.target.value))}
                      className="w-full accent-indigo-600 h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
                    />
                    <p className="text-[11px] text-slate-400">Triggers horizontal pod auto-scaling when CPU exceeds threshold.</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={handleSimulateLoadTest}
                    disabled={isScalingSimulated}
                    className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isScalingSimulated ? 'animate-spin' : ''}`} />
                    <span>{isScalingSimulated ? 'Simulating Spike Traffic...' : 'Run Simulated Traffic Spike Load Test'}</span>
                  </button>

                  <span className="text-xs text-slate-500 font-bold">Engine: GCP Cloud Run Container Cluster</span>
                </div>
              </div>

              {/* Autoscaling Live Event Logs */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900 text-slate-100 shadow-sm space-y-4 font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-extrabold text-xs uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Live Infrastructure Logs
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </div>

                <div className="space-y-2.5 text-[11px] text-slate-300 max-h-64 overflow-y-auto no-scrollbar">
                  {autoscalingLogs.map((log, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 leading-relaxed">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* MODULE 2: USE CDN FOR VIDEOS */}
        {/* ==================================================================== */}
        {activeSubTab === 'cdn' && (
          <motion.div
            key="mod-cdn"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* CDN Summary */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
                  <Globe className="w-3.5 h-3.5 text-amber-300" /> Multi-Region HLS Video CDN Network
                </div>
                <h3 className="text-xl font-black">Ultra-Low Latency Video Edge Streaming</h3>
                <p className="text-xs text-amber-100 leading-relaxed">
                  Video lectures and AI animated explanations are cached at 5 regional edge POPs in Andhra Pradesh & Telangana for instant playback on 2G/3G/4G networks.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
                  <span className="text-2xl font-black text-amber-300">1,420 GB</span>
                  <span className="text-[10px] block font-bold text-amber-100">Monthly CDN Savings</span>
                </div>
              </div>
            </div>

            {/* Edge POP Locations Table */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Radio className="w-5 h-5 text-indigo-600" />
                Regional Video Edge CDN Nodes
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-200">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3 rounded-l-xl">Edge POP Region</th>
                      <th className="p-3">POP ID</th>
                      <th className="p-3">Average Latency</th>
                      <th className="p-3">Video Cache Hit Rate</th>
                      <th className="p-3">Active Video Streams</th>
                      <th className="p-3 rounded-r-xl">Node Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {CDN_NODES.map((node, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-extrabold text-slate-800 dark:text-slate-100">{node.region}</td>
                        <td className="p-3 font-mono text-slate-400">{node.code}</td>
                        <td className="p-3 font-bold text-emerald-600">{node.latency}</td>
                        <td className="p-3 font-bold text-indigo-600">{node.cacheHit}</td>
                        <td className="p-3 font-black text-amber-500">{node.activeStreams.toLocaleString()} streams</td>
                        <td className="p-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                            ✓ {node.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CDN Video Purge Tool & Quality Switcher */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Trash2 className="w-5 h-5 text-rose-500" />
                  Instant Video CDN Cache Purge Tool
                </h3>
                <p className="text-xs text-slate-500">Purge stale or updated course video files across all edge POPs globally.</p>

                <form onSubmit={handlePurgeCdnVideo} className="space-y-3">
                  <input
                    type="text"
                    placeholder="e.g. https://cdn.eduai.in/courses/class10/maths/ch4.m3u8"
                    value={videoPurgeUrl}
                    onChange={(e) => setVideoPurgeUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                  />
                  <div className="flex items-center justify-between">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Purge CDN Video Edge Cache
                    </button>

                    {purgeSuccess && (
                      <span className="text-xs font-bold text-emerald-600 animate-in fade-in">
                        ✓ Edge cache purged globally!
                      </span>
                    )}
                  </div>
                </form>
              </div>

              {/* HLS Adaptive Bitrate Stream Config */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Video className="w-5 h-5 text-purple-600" />
                  Adaptive Bitrate Stream Transcoding Strategy
                </h3>
                <div className="space-y-3 text-xs">
                  {[
                    { title: 'Default Playback Quality', desc: 'Auto-adjusts based on user network speed (1080p -> 480p fallback).' },
                    { title: 'Video Compression Codec', desc: 'AV1 & H.265 (HEVC) dual-encoding for 40% smaller payload size.' },
                    { title: 'Segment Length', desc: '4-second HLS chunk size for rapid video start time (< 0.8s).' },
                  ].map((item, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <div className="font-extrabold text-slate-800 dark:text-slate-100">{item.title}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* MODULE 3: AUTOMATIC BACKUPS & POINT-IN-TIME RECOVERY */}
        {/* ==================================================================== */}
        {activeSubTab === 'backups' && (
          <motion.div
            key="mod-backups"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Automated Backup Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
                  <Database className="w-3.5 h-3.5 text-emerald-200" /> Firestore & Database Backup Engine
                </div>
                <h3 className="text-xl font-black">Automated Scheduled Database Snapshots & Recovery</h3>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  Continuous WAL point-in-time recovery logging protects student study records, exam scores, and offline progress. Encrypted with AES-256 in multi-region cloud storage.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handleTriggerManualBackup}
                  disabled={isCreatingBackup}
                  className="px-5 py-3 rounded-2xl bg-white text-slate-900 font-extrabold text-xs flex items-center gap-2 hover:bg-emerald-50 transition-all shadow-md disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 text-emerald-600 ${isCreatingBackup ? 'animate-spin' : ''}`} />
                  <span>{isCreatingBackup ? 'Creating Snapshot...' : 'Create Instant Snapshot Now'}</span>
                </button>
              </div>
            </div>

            {/* Backup Schedule Config & Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  Recent Database Backup Snapshot Log
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700 dark:text-slate-200">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3 rounded-l-xl">Snapshot ID</th>
                        <th className="p-3">Timestamp</th>
                        <th className="p-3">Backup Type</th>
                        <th className="p-3">Size</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 rounded-r-xl">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {backupLogs.map((bk, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-3 font-mono font-bold text-indigo-600">{bk.id}</td>
                          <td className="p-3 text-slate-500">{bk.date}</td>
                          <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{bk.type}</td>
                          <td className="p-3 font-black text-slate-700 dark:text-slate-300">{bk.size}</td>
                          <td className="p-3">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                              ✓ {bk.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => {
                                setSelectedBackupToRestore(bk);
                                setRestoreModalOpen(true);
                              }}
                              className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-bold text-[11px] hover:bg-indigo-100"
                            >
                              Test Restore
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Schedule Settings & Retention */}
              <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-emerald-600" />
                  Backup Policy & Frequency
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Automated Frequency</label>
                    <select
                      value={backupSchedule}
                      onChange={(e) => setBackupSchedule(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                    >
                      <option value="hourly">Hourly Incremental Snapshots (Recommended)</option>
                      <option value="daily">Daily Full Database Backup</option>
                      <option value="weekly">Weekly Cold Archive Storage</option>
                    </select>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="font-bold text-slate-800 dark:text-slate-100 block">Retention Period</span>
                    <span className="text-slate-500 text-[11px]">Snapshots kept for 30 days before auto-archiving.</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="font-bold text-slate-800 dark:text-slate-100 block">Encryption Standard</span>
                    <span className="text-slate-500 text-[11px]">AES-256 Customer Managed Encryption Keys (CMEK).</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* MODULE 4: SERVER PERFORMANCE & REAL-TIME TELEMETRY */}
        {/* ==================================================================== */}
        {activeSubTab === 'performance' && (
          <motion.div
            key="mod-performance"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Performance KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-[11px] font-bold text-slate-400">Current Requests / Sec</div>
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{liveMetrics.rps} RPS</div>
                <div className="text-[11px] text-emerald-600 font-bold mt-1">↑ 12% vs last hour</div>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-[11px] font-bold text-slate-400">P95 API Response Time</div>
                <div className="text-2xl font-black text-emerald-600 mt-1">{liveMetrics.avgLatencyMs} ms</div>
                <div className="text-[11px] text-emerald-600 font-bold mt-1">✓ Below 50ms SLA Target</div>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-[11px] font-bold text-slate-400">HTTP 200 Success Rate</div>
                <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">99.998%</div>
                <div className="text-[11px] text-slate-500 font-bold mt-1">0.002% Error Rate</div>
              </div>

              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="text-[11px] font-bold text-slate-400">Active WebSocket Streams</div>
                <div className="text-2xl font-black text-amber-500 mt-1">1,840 Sessions</div>
                <div className="text-[11px] text-slate-500 font-bold mt-1">Live AI Voice & Chat</div>
              </div>
            </div>

            {/* Recharts Area Chart for RPS & Latency */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-indigo-600" />
                24-Hour Server Load & Request Latency Profile
              </h3>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={TELEMETRY_24H}>
                    <defs>
                      <linearGradient id="colorRps" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorLat" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Area type="monotone" dataKey="rps" name="Requests/Sec (RPS)" stroke="#6366f1" fillOpacity={1} fill="url(#colorRps)" />
                    <Area type="monotone" dataKey="latencyMs" name="Latency (ms)" stroke="#10b981" fillOpacity={1} fill="url(#colorLat)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Microservices Cluster Matrix */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                Microservices Health Matrix
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-200">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3 rounded-l-xl">Service Name</th>
                      <th className="p-3">Container Replicas</th>
                      <th className="p-3">Traffic RPS</th>
                      <th className="p-3">Average Latency</th>
                      <th className="p-3">SLA Uptime</th>
                      <th className="p-3 rounded-r-xl">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {SERVICES_HEALTH.map((svc, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-extrabold text-slate-800 dark:text-slate-100">{svc.name}</td>
                        <td className="p-3 font-bold text-indigo-600">{svc.instances} Pods</td>
                        <td className="p-3 text-slate-500">{svc.rps} req/s</td>
                        <td className="p-3 font-bold text-emerald-600">{svc.latency}</td>
                        <td className="p-3 font-black text-amber-500">{svc.uptime}</td>
                        <td className="p-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                            ✓ {svc.status}
                          </span>
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
        {/* MODULE 5: CACHING & FAST LOADING OPTIMIZATIONS */}
        {/* ==================================================================== */}
        {activeSubTab === 'caching' && (
          <motion.div
            key="mod-caching"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Multi-tier Caching Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5 text-amber-300" /> Multi-Tier In-Memory Caching Engine
                </div>
                <h3 className="text-xl font-black">Redis & Service Worker Edge Memory Caching</h3>
                <p className="text-xs text-indigo-200/90 leading-relaxed">
                  Reduces database hits by 96.4%. Combines Redis L1/L2 memory caching, Brotli 11 payload compression, and PWA Service Worker offline asset prefetching.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={handlePurgeAllCaches}
                  className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs flex items-center gap-2 border border-white/20 shadow-md"
                >
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  <span>Purge Redis Caches</span>
                </button>

                <button
                  onClick={handleWarmupCaches}
                  className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Warmup Top 50 Courses</span>
                </button>
              </div>
            </div>

            {cachePurgedMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold animate-in fade-in">
                ✓ Redis and Service Worker memory caches purged successfully across all edge nodes!
              </div>
            )}

            {cacheWarmupMsg && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-bold animate-in fade-in">
                ⚡ Cache Warmup complete! Top 50 Video Lessons & PDF handbooks pre-warmed into Redis memory.
              </div>
            )}

            {/* Caching Architecture Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-black">
                  L1
                </div>
                <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-100">Service Worker PWA Cache</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Caches core React bundle, CSS stylesheets, and icons inside client browser storage for zero latency on navigation.
                </p>
                <div className="pt-2 text-xs font-extrabold text-indigo-600">Hit Rate: 100% Client Offline</div>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-black">
                  L2
                </div>
                <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-100">Edge CDN Static Assets</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Brotli level-11 compressed static JS chunks, SVGs, and PDF documents served directly from regional edge POPs.
                </p>
                <div className="pt-2 text-xs font-extrabold text-emerald-600">Payload Reduced: -74% Size</div>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-500 flex items-center justify-center font-black">
                  L3
                </div>
                <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-100">Redis In-Memory Database Cache</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Stores user session tokens, active leaderboard ranks, course metadata, and PYQ solutions in RAM.
                </p>
                <div className="pt-2 text-xs font-extrabold text-amber-500">Query Time: 1.2 ms</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RESTORE BACKUP MODAL */}
      {restoreModalOpen && selectedBackupToRestore && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-600" />
                Test Backup Restoration
              </h3>
              <button
                onClick={() => setRestoreModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-300">
                You are about to test restoring snapshot <strong>{selectedBackupToRestore.id}</strong> ({selectedBackupToRestore.size}) taken on {selectedBackupToRestore.date}.
              </p>

              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-semibold">
                ⚠️ Test restoration will spin up an isolated staging database replica to verify data integrity without affecting live students.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setRestoreModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setRestoreSuccess(true);
                  setTimeout(() => {
                    setRestoreSuccess(false);
                    setRestoreModalOpen(false);
                  }, 2000);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md"
              >
                {restoreSuccess ? '✓ Staging Replica Restored!' : 'Run Staging Test Restore'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
