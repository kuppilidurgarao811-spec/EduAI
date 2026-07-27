import React, { useState } from 'react';
import {
  Wifi,
  WifiOff,
  Download,
  FileText,
  Video,
  BookOpen,
  Trash2,
  Play,
  Pause,
  Maximize2,
  HardDrive,
  Sparkles,
  CheckCircle2,
  Filter,
  Search,
  ArrowLeft,
  Volume2,
  Clock,
  Layers,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  FolderDown,
  FileCode,
  BookMarked,
  Eye,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { OfflineItem, OfflineItemType } from '../types';

export const OfflineVault: React.FC = () => {
  const {
    offlineItems,
    isOfflineMode,
    toggleOfflineMode,
    removeOfflineItem,
    clearOfflineVault,
    downloadOfflineItem,
    educationLevel,
    setActiveTab,
    addXp,
  } = useAuth();

  const [activeType, setActiveType] = useState<'all' | 'lesson' | 'pdf' | 'video'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeViewerItem, setActiveViewerItem] = useState<OfflineItem | null>(null);

  // Simulated Video Player Controls
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [videoPlaybackSpeed, setVideoPlaybackSpeed] = useState('1.0x');
  const [pdfZoomLevel, setPdfZoomLevel] = useState(100);

  // Calculate total offline storage used
  const calculateTotalStorageMB = () => {
    let total = 0;
    offlineItems.forEach((item) => {
      const match = item.fileSize.match(/([\d.]+)\s*MB/i);
      if (match) {
        total += parseFloat(match[1]);
      }
    });
    return total.toFixed(1);
  };

  const totalMBUsed = calculateTotalStorageMB();

  // Filtered list
  const filteredItems = offlineItems.filter((item) => {
    const matchesType = activeType === 'all' || item.type === activeType;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.chapterTitle && item.chapterTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const lessonItemsCount = offlineItems.filter((i) => i.type === 'lesson').length;
  const pdfItemsCount = offlineItems.filter((i) => i.type === 'pdf').length;
  const videoItemsCount = offlineItems.filter((i) => i.type === 'video').length;

  // Batch download grade pack
  const handleDownloadGradeSyllabusPack = () => {
    const packItems: OfflineItem[] = [
      {
        id: `grade-pack-video-${Date.now()}`,
        title: `${educationLevel} Core Subjects Rapid Revision Video Pack`,
        type: 'video',
        subject: 'All Subjects',
        educationLevel,
        fileSize: '32.5 MB',
        downloadedAt: 'Just now',
        chapterTitle: 'Grade Master Syllabus Revision',
        videoDuration: '28:40',
        thumbnailColor: 'from-indigo-600 to-purple-800',
        contentOrUrl: `Offline Video Pack: High-impact video walkthrough covering all core textbook chapters for ${educationLevel}. Downloaded for complete offline exam prep.`,
      },
      {
        id: `grade-pack-pdf-${Date.now()}`,
        title: `${educationLevel} Solved PYQs & Formula PDF Handbook`,
        type: 'pdf',
        subject: 'Exam Prep',
        educationLevel,
        fileSize: '14.2 MB',
        downloadedAt: 'Just now',
        chapterTitle: 'Previous Year Papers & Solutions',
        pdfPagesCount: 45,
        thumbnailColor: 'from-amber-600 to-rose-700',
        contentOrUrl: `OFFLINE PDF: Complete solved question papers with model answers, diagrammatic step-by-step proofs, and subject formula sheets for ${educationLevel}.`,
      },
      {
        id: `grade-pack-lesson-${Date.now()}`,
        title: `${educationLevel} AI Summary & Concept Flashcards Notes`,
        type: 'lesson',
        subject: 'General Science & Math',
        educationLevel,
        fileSize: '2.8 MB',
        downloadedAt: 'Just now',
        chapterTitle: 'Key Definitions & Formulas',
        thumbnailColor: 'from-teal-600 to-emerald-800',
        contentOrUrl: `### Offline Grade Revision Notes\n\n- **Grade Level**: ${educationLevel}\n- **Cached AI Concepts**: 50 key definitions, formulas, and Telugu/English translations.\n- **Zero Bandwidth**: Ready to read anywhere without internet!`,
      },
    ];

    packItems.forEach((item) => downloadOfflineItem(item));
    addXp(30);
  };

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* Top Banner & Offline Status Indicator */}
      <div className={`p-6 md:p-8 rounded-3xl transition-all duration-300 shadow-xl relative overflow-hidden ${
        isOfflineMode
          ? 'bg-gradient-to-br from-slate-900 via-amber-950 to-orange-950 text-white border-2 border-amber-500/40'
          : 'bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white'
      }`}>
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md ${
                isOfflineMode
                  ? 'bg-amber-500 text-slate-950 font-black animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {isOfflineMode ? (
                  <>
                    <WifiOff className="w-4 h-4" />
                    Offline Mode Active (Zero Internet Required)
                  </>
                ) : (
                  <>
                    <Wifi className="w-4 h-4" />
                    Online - Offline Sync Enabled
                  </>
                )}
              </span>

              <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-slate-200">
                Grade: {educationLevel}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Offline Mode & Downloaded Library
            </h1>
            <p className="text-xs md:text-sm text-indigo-200/90 leading-relaxed">
              Study without internet! Download interactive video lessons, NCERT textbooks/PDFs, and step-by-step lesson guides directly to your local device cache.
            </p>
          </div>

          {/* Network Switcher Card */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-white/10 dark:bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold text-indigo-200">Network Simulation</span>
              <p className="text-xs font-bold text-white">
                {isOfflineMode ? 'Simulating No Internet' : 'Connected to Internet'}
              </p>
            </div>

            <button
              type="button"
              onClick={toggleOfflineMode}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md flex items-center gap-2 ${
                isOfflineMode
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              {isOfflineMode ? (
                <>
                  <Wifi className="w-4 h-4" />
                  <span>Switch Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4" />
                  <span>Simulate Offline Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Storage Meter & Grade Pack Quick Download */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Storage Meter */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">
                  Local Device Storage
                </h3>
                <p className="text-xs text-slate-400">{offlineItems.length} items saved offline</p>
              </div>
            </div>
            <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
              {totalMBUsed} MB / 500 MB
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (parseFloat(totalMBUsed) / 500) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-400">
              <span>Used: {totalMBUsed} MB</span>
              <span>Free Quota: {(500 - parseFloat(totalMBUsed)).toFixed(1)} MB</span>
            </div>
          </div>
        </div>

        {/* Grade Pack Download */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/20 border border-indigo-200 dark:border-indigo-800/60 shadow-sm flex flex-col justify-between gap-4 md:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-200 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-200 inline-block">
                1-Click Grade Offline Pack
              </span>
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">
                Download All Lessons, PDFs & Videos for {educationLevel}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Bundles essential chapter notes, formula sheets, and top revision videos into local storage in one tap.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadGradeSyllabusPack}
              className="px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 shrink-0"
            >
              <FolderDown className="w-4 h-4" />
              <span>Download Grade Pack (~49.5 MB)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Type Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/80 dark:border-slate-700/80 shadow-inner overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveType('all')}
            className={`py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
              activeType === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
            }`}
          >
            <FolderDown className="w-4 h-4" />
            <span>All Downloads ({offlineItems.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveType('video')}
            className={`py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
              activeType === 'video'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
            }`}
          >
            <Video className="w-4 h-4 text-rose-500" />
            <span>Offline Videos ({videoItemsCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveType('pdf')}
            className={`py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
              activeType === 'pdf'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
            }`}
          >
            <BookMarked className="w-4 h-4 text-amber-500" />
            <span>Offline PDFs & Textbooks ({pdfItemsCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveType('lesson')}
            className={`py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
              activeType === 'lesson'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-500" />
            <span>Downloaded Lessons ({lessonItemsCount})</span>
          </button>
        </div>

        {/* Search Bar & Clear All */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search offline files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100 placeholder-slate-400"
            />
          </div>

          {offlineItems.length > 0 && (
            <button
              type="button"
              onClick={clearOfflineVault}
              className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 font-bold text-xs transition-all shrink-0"
              title="Clear all offline downloads"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ITEMS LIST GRID */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <WifiOff className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
            No offline downloads found in this view
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click "Download Grade Pack" above or visit Course Lessons & Study Materials to save PDFs and video lessons for offline access.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all shadow-sm hover:shadow-md flex flex-col justify-between gap-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {item.type === 'video' && (
                      <span className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                        <Video className="w-4 h-4" />
                      </span>
                    )}
                    {item.type === 'pdf' && (
                      <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                        <BookMarked className="w-4 h-4" />
                      </span>
                    )}
                    {item.type === 'lesson' && (
                      <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                        <FileText className="w-4 h-4" />
                      </span>
                    )}

                    <div>
                      <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
                        {item.subject} • {item.educationLevel}
                      </span>
                      <p className="text-[10px] font-bold text-slate-400">Size: {item.fileSize}</p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Offline Saved
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h3>
                  {item.chapterTitle && (
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      Chapter: {item.chapterTitle}
                    </p>
                  )}
                </div>

                {/* Extra Metadata Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  {item.videoDuration && (
                    <span className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-rose-500" /> Duration: {item.videoDuration}
                    </span>
                  )}
                  {item.pdfPagesCount && (
                    <span className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                      <FileText className="w-3.5 h-3.5 text-amber-500" /> {item.pdfPagesCount} Pages PDF
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400">Saved: {item.downloadedAt}</span>
                </div>
              </div>

              {/* Action Controls */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setActiveViewerItem(item)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5"
                >
                  {item.type === 'video' ? <Play className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{item.type === 'video' ? 'Play Offline Video' : 'Read Offline'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => removeOfflineItem(item.id)}
                  className="p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 transition-all"
                  title="Remove from Offline Vault"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* OFFLINE VIEWER / PLAYER MODAL */}
      {activeViewerItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            {/* Modal Top Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 sticky top-0 bg-white dark:bg-slate-900 z-20">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Offline Mode Player
                </span>
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 line-clamp-1">
                  {activeViewerItem.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveViewerItem(null);
                  setIsPlayingVideo(false);
                }}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-bold text-xs"
              >
                Close
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 flex-1">
              {/* VIDEO PLAYER VIEW */}
              {activeViewerItem.type === 'video' && (
                <div className="space-y-4">
                  {/* Simulated Offline Video Screen */}
                  <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${
                    activeViewerItem.thumbnailColor || 'from-slate-900 to-indigo-950'
                  } aspect-video flex flex-col justify-between p-6 text-white shadow-xl`}>
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-black/40 text-xs font-bold backdrop-blur-md">
                        Offline Cache • {activeViewerItem.fileSize}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-rose-600 text-xs font-bold">
                        1080p HD
                      </span>
                    </div>

                    <div className="text-center space-y-2 py-8">
                      <button
                        type="button"
                        onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                        className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center mx-auto transition-transform hover:scale-110 shadow-lg"
                      >
                        {isPlayingVideo ? (
                          <Pause className="w-8 h-8 fill-current" />
                        ) : (
                          <Play className="w-8 h-8 fill-current ml-1" />
                        )}
                      </button>
                      <p className="text-xs font-bold text-slate-200">
                        {isPlayingVideo ? 'Playing Offline Video Stream' : 'Click to Play'}
                      </p>
                    </div>

                    {/* Scrub Bar Controls */}
                    <div className="space-y-2 bg-black/50 p-3 rounded-2xl backdrop-blur-md">
                      <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                        <div
                          className={`bg-rose-500 h-full rounded-full transition-all ${
                            isPlayingVideo ? 'w-2/3' : 'w-1/3'
                          }`}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs font-bold">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                            className="hover:text-amber-300"
                          >
                            {isPlayingVideo ? 'Pause' : 'Play'}
                          </button>
                          <span>{isPlayingVideo ? '08:42' : '02:15'} / {activeViewerItem.videoDuration || '15:00'}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-300">Speed:</span>
                          <select
                            value={videoPlaybackSpeed}
                            onChange={(e) => setVideoPlaybackSpeed(e.target.value)}
                            className="bg-black/60 text-xs px-2 py-0.5 rounded-lg border border-white/20 text-white font-bold"
                          >
                            <option value="0.5x">0.5x</option>
                            <option value="1.0x">1.0x (Normal)</option>
                            <option value="1.5x">1.5x</option>
                            <option value="2.0x">2.0x</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                      Video Lesson Overview & Transcript
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {activeViewerItem.contentOrUrl}
                    </p>
                  </div>
                </div>
              )}

              {/* PDF READER VIEW */}
              {activeViewerItem.type === 'pdf' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-100 dark:bg-slate-800">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Offline PDF Book Reader • {activeViewerItem.pdfPagesCount || 20} Pages
                    </span>

                    <div className="flex items-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setPdfZoomLevel((z) => Math.max(75, z - 25))}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 font-bold"
                      >
                        - Zoom
                      </button>
                      <span className="font-bold text-slate-600 dark:text-slate-300">{pdfZoomLevel}%</span>
                      <button
                        type="button"
                        onClick={() => setPdfZoomLevel((z) => Math.min(175, z + 25))}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 font-bold"
                      >
                        + Zoom
                      </button>
                    </div>
                  </div>

                  <div
                    className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-100 space-y-4 min-h-[350px] overflow-x-auto shadow-inner"
                    style={{ transform: `scale(${pdfZoomLevel / 100})`, transformOrigin: 'top left' }}
                  >
                    <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                      <span className="text-xs font-black uppercase text-amber-600 dark:text-amber-400">
                        {activeViewerItem.subject} Textbook
                      </span>
                      <h2 className="text-lg font-black">{activeViewerItem.title}</h2>
                    </div>

                    <p className="text-sm leading-relaxed whitespace-pre-wrap font-serif">
                      {activeViewerItem.contentOrUrl}
                    </p>
                  </div>
                </div>
              )}

              {/* LESSON TEXT VIEW */}
              {activeViewerItem.type === 'lesson' && (
                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                  <div className="border-b border-slate-200 dark:border-slate-700 pb-3">
                    <span className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400">
                      {activeViewerItem.subject} Lesson Guide
                    </span>
                    <h2 className="text-lg font-black text-slate-800 dark:text-slate-100">
                      {activeViewerItem.title}
                    </h2>
                  </div>

                  <div className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">
                    {activeViewerItem.contentOrUrl}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
