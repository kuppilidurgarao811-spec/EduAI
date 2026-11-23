import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  Smartphone,
  Share2,
  Gift,
  Star,
  Sparkles,
  Search,
  CheckCircle2,
  Copy,
  ExternalLink,
  MessageCircle,
  Instagram,
  Youtube,
  Linkedin,
  Facebook,
  Twitter,
  Award,
  Users,
  TrendingUp,
  Download,
  Play,
  QrCode,
  ThumbsUp,
  MessageSquare,
  BarChart3,
  Send,
  Zap,
  ShieldCheck,
  ChevronRight,
  Eye,
  FileText,
  Filter,
  Check,
  Sparkle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Mock ASO Keywords List
const ASO_KEYWORDS = [
  { keyword: '10th Class SSC AP Board AI App', volume: '125K/mo', difficulty: 'Medium', rank: '#2' },
  { keyword: 'AI Study Tutor Telugu Voice', volume: '88K/mo', difficulty: 'Low', rank: '#1' },
  { keyword: 'B.Tech JNTU Syllabus Notes', volume: '210K/mo', difficulty: 'High', rank: '#3' },
  { keyword: 'Free Online Classes LKG to Degree', volume: '340K/mo', difficulty: 'Medium', rank: '#1' },
  { keyword: 'CBSE Class 10 Model Papers', volume: '180K/mo', difficulty: 'High', rank: '#4' },
];

// Mock Referral Rewards
const REFERRAL_REWARDS = [
  { level: 'Bronze', invitesNeeded: 3, reward: '1 Month Free EduAI Pro Access', unlocked: true },
  { level: 'Silver', invitesNeeded: 5, reward: '500 Extra AI Voice Tutor Minutes', unlocked: true },
  { level: 'Gold', invitesNeeded: 10, reward: 'Official EduAI Student Ambassador Badge + Certificate', unlocked: false },
  { level: 'Platinum', invitesNeeded: 25, reward: 'EduAI School Backpack & Swag Kit Delivered', unlocked: false },
];

// Mock Reviews Data
const MOCK_REVIEWS = [
  {
    id: 'rev-1',
    author: 'K. Sai Teja',
    role: 'Class 10 Student (Visakhapatnam)',
    rating: 5,
    date: '2026-08-08',
    comment: 'The AI Voice tutor in Telugu helped me clear all my Trigonometry doubts before my board mock exam. I jumped from 60% to 92%!',
    sentiment: 'Highly Positive',
    verified: true,
  },
  {
    id: 'rev-2',
    author: 'P. Lakshmi Devi',
    role: 'Parent of Class 7 Student',
    rating: 5,
    date: '2026-08-05',
    comment: 'The Parent Dashboard keeps me updated via WhatsApp alerts every day. I can see my daughter’s attendance and test scores instantly.',
    sentiment: 'Highly Positive',
    verified: true,
  },
  {
    id: 'rev-3',
    author: 'Dr. M. V. Ramana',
    role: 'Physics Lecturer',
    rating: 5,
    date: '2026-08-01',
    comment: 'Creating unit test question papers with AI takes only 30 seconds. The SCERT curriculum alignment is 100% accurate.',
    sentiment: 'Positive',
    verified: true,
  },
];

export const MarketingHub: React.FC = () => {
  const { user } = useAuth();

  // Active Sub-Tab
  const [activeTab, setActiveTab] = useState<'website' | 'aso' | 'social' | 'referrals' | 'reviews'>('website');

  // 1. Website Live Preview Modal State
  const [showWebsitePreviewModal, setShowWebsitePreviewModal] = useState(false);
  const [websiteTheme, setWebsiteTheme] = useState<'modern' | 'dark' | 'vibrant'>('modern');

  // 2. ASO Language State
  const [asoLanguage, setAsoLanguage] = useState<'English' | 'Telugu' | 'Hindi'>('English');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // 3. Social Media Campaign Generator State
  const [socialPlatform, setSocialPlatform] = useState<'whatsapp' | 'instagram' | 'youtube' | 'linkedin' | 'facebook'>('whatsapp');
  const [aiPostTopic, setAiPostTopic] = useState('10th Board Exam Revision Tips with AI Voice Tutor');
  const [generatedPostText, setGeneratedPostText] = useState('');
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);

  // 4. Referral Program State
  const [referralCode] = useState(`EDUAI-${user.name ? user.name.toUpperCase().slice(0, 4) : 'RAJU'}2026`);
  const referralLink = `https://eduai.in/download?ref=${referralCode}`;
  const [copiedLink, setCopiedLink] = useState(false);
  const [referralsCount, setReferralsCount] = useState(6);

  // 5. User Review Collection State
  const [reviewsList, setReviewsList] = useState(MOCK_REVIEWS);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRole, setNewReviewRole] = useState('Student');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmittedSuccess, setReviewSubmittedSuccess] = useState(false);
  const [showInAppReviewDialog, setShowInAppReviewDialog] = useState(false);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleGenerateAiSocialPost = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingPost(true);
    setTimeout(() => {
      let content = '';
      if (socialPlatform === 'whatsapp') {
        content = `🚀 *Ace Your Exams with EduAI - India's #1 AI Learning Platform!* 📚\n\nStruggling with Math proofs or Science formulas? Get 24/7 Telugu & English Voice AI Tutoring for Class 10 Board Exams & B.Tech!\n\n✨ *Features:*\n- SCERT & CBSE Board PYQs & Notes\n- Voice AI Teacher in Telugu & English\n- Offline Video & PDF Vault\n\n👉 *Download Free Now:* ${referralLink}`;
      } else if (socialPlatform === 'instagram') {
        content = `🔥 POV: You stopped memorizing and started learning with a 24/7 Telugu AI Voice Tutor! 🤖✨\n\nEduAI brings LKG to Degree syllabus directly to your phone with zero internet lag!\n\nTap link in bio to claim your 1 Month FREE EduAI Pro! 🚀\n\n#EduAI #APBoard #Class10BoardExam #AITutor #TeluguEducation #EngineeringStudents #SSC2026`;
      } else if (socialPlatform === 'youtube') {
        content = `🎬 *YouTube Shorts Script:* "How I Got 98% in 10th Class Boards with AI"\n\n[0-5s]: "If you are studying for AP or Telangana 10th Board exams, stop scrolling!"\n[5-20s]: Show EduAI app answering a tough Trigonometry doubt in spoken Telugu voice.\n[20-40s]: "You get free model question papers, career roadmap, and offline PDFs."\n[40-60s]: "Link in comment section to download EduAI app!"`;
      } else if (socialPlatform === 'linkedin') {
        content = `Transforming Vernacular K-12 and Higher Education in India with Generative AI 🎓\n\nWe are excited to share how EduAI is bridging the educational divide for millions of students across Andhra Pradesh and Telangana. With multi-lingual voice tutoring and lightweight offline caching, every student gets personalized 1-on-1 mentorship.\n\nLearn more & explore our platform: https://eduai.in`;
      } else {
        content = `📢 Parents & Students! Join over 50,000+ students mastering SCERT & CBSE Board exams with EduAI. Get instant daily progress reports on WhatsApp and personalized AI tutoring in Telugu! Download today: ${referralLink}`;
      }

      setGeneratedPostText(content);
      setIsGeneratingPost(false);
    }, 1200);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor,
      role: `${newReviewRole} (Verified)`,
      rating: newReviewRating,
      date: new Date().toISOString().split('T')[0],
      comment: newReviewComment,
      sentiment: newReviewRating >= 4 ? 'Highly Positive' : 'Constructive',
      verified: true,
    };

    setReviewsList([newRev, ...reviewsList]);
    setReviewSubmittedSuccess(true);
    setNewReviewAuthor('');
    setNewReviewComment('');
    setTimeout(() => setReviewSubmittedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-200">
      {/* HEADER BANNER */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-950 text-white relative overflow-hidden shadow-2xl border border-rose-500/30">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-white/20 text-rose-100 border border-white/30 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Marketing, ASO & Growth Suite (Phase 21)
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Growth Engine Ready
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Public Website, ASO, Viral Referrals, Social Media & User Reviews
            </h1>
            <p className="text-xs md:text-sm text-rose-100/90 leading-relaxed">
              Complete growth marketing hub to scale EduAI to 1,000,000+ students. Manage promotional landing pages, Play Store keyword optimization, automated social media campaigns, student referral rewards, and verified user testimonials.
            </p>
          </div>

          {/* Quick Header Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <p className="text-[10px] font-bold text-rose-200 uppercase">ASO Score</p>
              <p className="text-xl font-black text-white">96 / 100</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <p className="text-[10px] font-bold text-rose-200 uppercase">Referral Conversion</p>
              <p className="text-xl font-black text-amber-300">38.4%</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center col-span-2 sm:col-span-1">
              <p className="text-[10px] font-bold text-rose-200 uppercase">User Rating</p>
              <p className="text-xl font-black text-emerald-300">4.9 ★</p>
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION SUB-TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'website', label: '1. Promo Website & Live Demo', icon: Globe, badge: 'Landing Page' },
          { id: 'aso', label: '2. App Store Optimization (ASO)', icon: Smartphone, badge: 'Play Store' },
          { id: 'social', label: '3. Social Media Campaigns', icon: Share2, badge: 'Viral Posts' },
          { id: 'referrals', label: '4. Referral Program & Rewards', icon: Gift, badge: `${referralsCount} Invites` },
          { id: 'reviews', label: '5. User Reviews & Testimonials', icon: Star, badge: `${reviewsList.length} Verified` },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-rose-500'}`} />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
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
        {/* MODULE 1: CREATE A WEBSITE */}
        {/* ==================================================================== */}
        {activeTab === 'website' && (
          <motion.div
            key="mod-website"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Promo Website Header & Preview Controls */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-rose-600" />
                  Official EduAI Promotional Landing Website
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Public landing page built for student acquisition, SEO organic search, and parent conversion.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setShowWebsitePreviewModal(true)}
                  className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition-all"
                >
                  <Eye className="w-4 h-4" />
                  <span>Launch Live Fullscreen Website Preview</span>
                </button>
              </div>
            </div>

            {/* Embedded Interactive Website Preview Frame */}
            <div className="rounded-3xl border border-slate-300 dark:border-slate-800 bg-slate-950 text-slate-100 overflow-hidden shadow-2xl space-y-0">
              {/* Fake Browser Toolbar */}
              <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                </div>
                <div className="bg-slate-950 px-6 py-1 rounded-full border border-slate-800 text-slate-400 font-mono text-[11px] flex items-center gap-2">
                  <Globe className="w-3 h-3 text-emerald-400" /> https://eduai.in (Official Web Portal)
                </div>
                <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full">
                  LIVE WEBSITE
                </span>
              </div>

              {/* Promo Website Body */}
              <div className="p-8 md:p-12 space-y-12 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950">
                {/* Website Hero */}
                <div className="text-center space-y-5 max-w-3xl mx-auto">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-amber-400" /> AP & TS #1 AI Learning Platform
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
                    Learn SCERT, CBSE & B.Tech with Your <span className="text-rose-400">Telugu AI Voice Tutor</span>
                  </h2>
                  <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
                    24/7 personal AI mentor for LKG to Degree students. Get instant doubt answers in spoken Telugu, model question papers, career guidance, and offline local cache.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                    <button className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-rose-600/30">
                      <Download className="w-4 h-4" /> Download Android App (Google Play)
                    </button>
                    <button className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-sm border border-white/20 flex items-center gap-2">
                      <Play className="w-4 h-4 text-amber-400" /> Try Web Interactive Demo
                    </button>
                  </div>
                </div>

                {/* Website Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                  <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-black">
                      🎙️
                    </div>
                    <h4 className="font-extrabold text-base text-white">Telugu Voice AI Tutor</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Ask complex Physics or Math doubts by speaking in Telugu. Get step-by-step audio explanations.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black">
                      📚
                    </div>
                    <h4 className="font-extrabold text-base text-white">LKG to B.Tech Curriculum</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Complete state board textbooks, SCERT PYQ solutions, Gate preparation, and ATS resume builder.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                      ⚡
                    </div>
                    <h4 className="font-extrabold text-base text-white">100% Offline Caching</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Download video lectures & PDF question banks once and study anywhere without internet.
                    </p>
                  </div>
                </div>

                {/* Pricing Plans */}
                <div className="pt-8 border-t border-slate-800 space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-black text-white">Affordable Learning Plans for Every Student</h3>
                    <p className="text-xs text-slate-400 mt-1">Start free forever with option to unlock unlimited AI Voice hours</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                      <div className="font-bold text-xs text-slate-400 uppercase">Freemium Tier</div>
                      <div className="text-3xl font-black text-white">₹0 <span className="text-xs font-normal text-slate-400">/ forever</span></div>
                      <ul className="text-xs text-slate-300 space-y-2">
                        <li>✓ LKG to Class 12 Textbooks</li>
                        <li>✓ 15 AI Voice Queries / Day</li>
                        <li>✓ Offline PDF Download</li>
                      </ul>
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-b from-rose-900/60 to-slate-900 border-2 border-rose-500 space-y-4 relative">
                      <span className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-rose-500 text-white font-black text-[10px] uppercase">
                        Most Popular
                      </span>
                      <div className="font-bold text-xs text-rose-300 uppercase">EduAI Pro Pass</div>
                      <div className="text-3xl font-black text-white">₹199 <span className="text-xs font-normal text-slate-400">/ month</span></div>
                      <ul className="text-xs text-slate-200 space-y-2">
                        <li>✓ Unlimited Telugu AI Voice Tutor</li>
                        <li>✓ SCERT Board Model Papers & Keys</li>
                        <li>✓ WhatsApp Parent Live Alerts</li>
                        <li>✓ Placement ATS Resume Tool</li>
                      </ul>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                      <div className="font-bold text-xs text-slate-400 uppercase">School Enterprise</div>
                      <div className="text-3xl font-black text-white">₹499 <span className="text-xs font-normal text-slate-400">/ student / yr</span></div>
                      <ul className="text-xs text-slate-300 space-y-2">
                        <li>✓ Full School Admin Dashboard</li>
                        <li>✓ Automated Exam Generator</li>
                        <li>✓ Bulk Student Analytics</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* MODULE 2: OPTIMIZE FOR APP STORES (ASO) */}
        {/* ==================================================================== */}
        {activeTab === 'aso' && (
          <motion.div
            key="mod-aso"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* ASO Performance Audit Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center text-2xl font-black ring-4 ring-emerald-500/20">
                  96%
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                    Google Play Store ASO Audit Score
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    High keyword density for "10th Class AP Board", "Telugu AI Study", and "B.Tech Notes".
                  </p>
                </div>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
                {(['English', 'Telugu', 'Hindi'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setAsoLanguage(lang)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                      asoLanguage === lang
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Play Store Metadata Generator */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-rose-600" />
                  App Store Listing Metadata ({asoLanguage})
                </h3>

                {/* Title */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>APP TITLE (MAX 30 CHARS)</span>
                    <button
                      onClick={() =>
                        handleCopy(
                          asoLanguage === 'Telugu'
                            ? 'EduAI - తెలుగు AI స్టడీ ట్యూటర్'
                            : asoLanguage === 'Hindi'
                            ? 'EduAI - AI स्टडी ट्यूटर ऐप'
                            : 'EduAI - Telugu AI Study Tutor App',
                          'title'
                        )
                      }
                      className="text-rose-600 font-extrabold flex items-center gap-1 hover:underline"
                    >
                      <Copy className="w-3.5 h-3.5" /> {copiedText === 'title' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="font-black text-sm text-slate-900 dark:text-slate-100">
                    {asoLanguage === 'Telugu'
                      ? 'EduAI - తెలుగు AI స్టడీ ట్యూటర్'
                      : asoLanguage === 'Hindi'
                      ? 'EduAI - AI स्टडी ट्यूटर ऐप'
                      : 'EduAI - Telugu AI Study Tutor App'}
                  </div>
                </div>

                {/* Short Description */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>SHORT DESCRIPTION (MAX 80 CHARS)</span>
                    <button
                      onClick={() =>
                        handleCopy(
                          asoLanguage === 'Telugu'
                            ? '10వ తరగతి బోర్డ్ పరీక్షలు & B.Tech పాఠ్యాంశాలకు తెలుగు AI వాయిస్ ట్యూటర్!'
                            : '24/7 Telugu Voice AI Tutor for 10th Board Exams, SCERT & B.Tech Syllabus!',
                          'short'
                        )
                      }
                      className="text-rose-600 font-extrabold flex items-center gap-1 hover:underline"
                    >
                      <Copy className="w-3.5 h-3.5" /> {copiedText === 'short' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="font-semibold text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                    {asoLanguage === 'Telugu'
                      ? '10వ తరగతి బోర్డ్ పరీక్షలు & B.Tech పాఠ్యాంశాలకు తెలుగు AI వాయిస్ ట్యూటర్!'
                      : '24/7 Telugu Voice AI Tutor for 10th Board Exams, SCERT & B.Tech Syllabus!'}
                  </div>
                </div>

                {/* Long Description */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>FULL STORE DESCRIPTION (OPTIMIZED)</span>
                    <button
                      onClick={() => handleCopy('EduAI is India’s top AI-powered study assistant...', 'full')}
                      className="text-rose-600 font-extrabold flex items-center gap-1 hover:underline"
                    >
                      <Copy className="w-3.5 h-3.5" /> {copiedText === 'full' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    EduAI is Andhra Pradesh & Telangana’s #1 educational app designed for LKG to Degree students. Featuring interactive AI Voice tutors in spoken Telugu, SCERT model papers, career guidance, and offline PDF caching.
                  </p>
                </div>
              </div>

              {/* Keywords Ranking Matrix */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Search className="w-5 h-5 text-indigo-600" />
                  Target High-Volume Keywords
                </h3>

                <div className="space-y-3 text-xs">
                  {ASO_KEYWORDS.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-extrabold text-slate-800 dark:text-slate-100">{item.keyword}</div>
                        <div className="text-[11px] text-slate-400">
                          Search Vol: {item.volume} • Difficulty: {item.difficulty}
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-black text-xs">
                        Rank {item.rank}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* MODULE 3: SHARE ON SOCIAL MEDIA */}
        {/* ==================================================================== */}
        {activeTab === 'social' && (
          <motion.div
            key="mod-social"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Social Platform Switcher */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-rose-600" />
                    Viral Campaign Social Media Content Generator
                  </h3>
                  <p className="text-xs text-slate-500">Auto-craft formatted posts for WhatsApp, Instagram, YouTube, and LinkedIn.</p>
                </div>
              </div>

              {/* Platform Selector Buttons */}
              <div className="flex flex-wrap gap-3">
                {[
                  { id: 'whatsapp', label: 'WhatsApp Broadcast', icon: MessageCircle, color: 'bg-emerald-600' },
                  { id: 'instagram', label: 'Instagram Reel/Post', icon: Instagram, color: 'bg-pink-600' },
                  { id: 'youtube', label: 'YouTube Shorts Script', icon: Youtube, color: 'bg-red-600' },
                  { id: 'linkedin', label: 'LinkedIn Article', icon: Linkedin, color: 'bg-blue-600' },
                  { id: 'facebook', label: 'Facebook Group Post', icon: Facebook, color: 'bg-indigo-600' },
                ].map((p) => {
                  const Icon = p.icon;
                  const isSel = socialPlatform === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSocialPlatform(p.id as any)}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${
                        isSel
                          ? `${p.color} text-white shadow-md scale-105`
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{p.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Campaign Topic Prompt Form */}
              <form onSubmit={handleGenerateAiSocialPost} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                    Campaign Focus Topic or Promotion
                  </label>
                  <input
                    type="text"
                    value={aiPostTopic}
                    onChange={(e) => setAiPostTopic(e.target.value)}
                    placeholder="e.g. Class 10 Trigonometry Revision Tips in Telugu"
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isGeneratingPost}
                  className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md disabled:opacity-50"
                >
                  <Sparkles className={`w-4 h-4 ${isGeneratingPost ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingPost ? 'Generating Viral Post...' : 'Generate AI Post Content'}</span>
                </button>
              </form>

              {/* Generated Post Box */}
              {generatedPostText && (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                    <span className="text-xs font-extrabold text-slate-500 uppercase">
                      Generated {socialPlatform.toUpperCase()} Post
                    </span>
                    <button
                      onClick={() => handleCopy(generatedPostText, 'socialPost')}
                      className="px-3 py-1 rounded-xl bg-rose-600 text-white font-extrabold text-xs flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedText === 'socialPost' ? 'Copied!' : 'Copy Post Text'}</span>
                    </button>
                  </div>
                  <pre className="text-xs text-slate-800 dark:text-slate-200 font-sans whitespace-pre-wrap leading-relaxed">
                    {generatedPostText}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* MODULE 4: RUN REFERRAL PROGRAMS */}
        {/* ==================================================================== */}
        {activeTab === 'referrals' && (
          <motion.div
            key="mod-referrals"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Unique Referral Link Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
                  <Gift className="w-3.5 h-3.5 text-amber-200" /> Student & Parent Viral Referral Program
                </div>
                <h3 className="text-xl font-black">Invite Friends & Earn Free EduAI Pro Months!</h3>
                <p className="text-xs text-amber-100 leading-relaxed">
                  Share your custom invite link with classmates or parent groups. You and your friend both get 500 bonus AI Voice Tutor minutes!
                </p>

                {/* Referral Code Box */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <div className="bg-slate-900/80 px-4 py-2 rounded-2xl border border-white/20 text-amber-300 font-mono font-black text-sm">
                    {referralCode}
                  </div>
                  <button
                    onClick={handleCopyReferralLink}
                    className="px-4 py-2 rounded-2xl bg-white text-slate-950 font-extrabold text-xs flex items-center gap-1.5 hover:bg-amber-50 shadow-md"
                  >
                    <Copy className="w-3.5 h-3.5 text-amber-600" />
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Invite Link'}</span>
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0">
                <span className="text-3xl font-black text-amber-300">{referralsCount} Students</span>
                <span className="text-xs block font-bold text-amber-100">Successfully Joined</span>
              </div>
            </div>

            {/* Reward Tiers Unlocked */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Referral Reward Milestones & Badges
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {REFERRAL_REWARDS.map((rew, idx) => (
                  <div
                    key={idx}
                    className={`p-5 rounded-3xl border space-y-3 ${
                      rew.unlocked
                        ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-black uppercase">
                        {rew.level} Tier
                      </span>
                      {rew.unlocked ? (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-slate-400">Locked</span>
                      )}
                    </div>

                    <div>
                      <div className="font-black text-sm text-slate-900 dark:text-slate-100">{rew.reward}</div>
                      <p className="text-[11px] text-slate-500 mt-0.5">Requires {rew.invitesNeeded} Successful Invites</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ==================================================================== */}
        {/* MODULE 5: COLLECT USER REVIEWS */}
        {/* ==================================================================== */}
        {activeTab === 'reviews' && (
          <motion.div
            key="mod-reviews"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Reviews Summary Banner */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 flex flex-col items-center justify-center font-black">
                  <span className="text-2xl leading-none">4.9</span>
                  <span className="text-[10px] uppercase font-bold">★★★★★</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                    50,000+ Verified Student & Parent Reviews
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Rated #1 Educational App in Andhra Pradesh & Telangana on Google Play Store.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowInAppReviewDialog(true)}
                className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md shrink-0"
              >
                <Star className="w-4 h-4 fill-slate-950" />
                <span>Simulate In-App Google Play Review Dialog</span>
              </button>
            </div>

            {/* Review Submission Form & Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Submission Form */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                  Submit Your EduAI Learning Review
                </h3>

                {reviewSubmittedSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 text-xs font-bold animate-in fade-in">
                    ✓ Thank you! Your verified review has been published.
                  </div>
                )}

                <form onSubmit={handleAddReview} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Role</label>
                      <select
                        value={newReviewRole}
                        onChange={(e) => setNewReviewRole(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                      >
                        <option value="Student">Student</option>
                        <option value="Parent">Parent</option>
                        <option value="Teacher">Teacher / Educator</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Rating Stars</label>
                      <select
                        value={newReviewRating}
                        onChange={(e) => setNewReviewRating(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-amber-500"
                      >
                        <option value={5}>5 Stars (★★★★★)</option>
                        <option value={4}>4 Stars (★★★★☆)</option>
                        <option value={3}>3 Stars (★★★☆☆)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Your Testimonial</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="How has EduAI helped your studies or teaching?"
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md transition-all"
                  >
                    Publish Verified Review
                  </button>
                </form>
              </div>

              {/* Reviews List Feed */}
              <div className="lg:col-span-7 space-y-4">
                {reviewsList.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900 dark:text-slate-100">{rev.author}</span>
                        <span className="text-amber-500 font-bold text-xs">{'★'.repeat(rev.rating)}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                        {rev.role}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 text-[10px] font-bold">
                        ✓ Verified Review
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: FULLSCREEN LIVE PROMO WEBSITE PREVIEW */}
      {showWebsitePreviewModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-rose-500" />
                <span className="text-xs font-black text-white">Full Promo Website Preview Mode</span>
              </div>
              <button
                onClick={() => setShowWebsitePreviewModal(false)}
                className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs"
              >
                Close Preview
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8 bg-gradient-to-b from-slate-950 to-indigo-950 text-white">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-black">EduAI • India's Vernacular AI Platform</h2>
                <p className="text-sm text-slate-300 max-w-xl mx-auto">
                  Over 100,000+ students across AP & Telangana trust EduAI for daily study, AI voice tutoring, and exam preparation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: IN-APP GOOGLE PLAY REVIEW DIALOG SIMULATOR */}
      {showInAppReviewDialog && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 mx-auto flex items-center justify-center text-xl font-black">
              ★
            </div>

            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
              Enjoying EduAI Learning App?
            </h3>
            <p className="text-xs text-slate-500">
              Tap a star to leave a review on Google Play Store. Your feedback helps us build better free AI tools for students!
            </p>

            <div className="flex justify-center gap-2 text-2xl text-amber-500 cursor-pointer py-2">
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowInAppReviewDialog(false)}
                className="w-1/2 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-extrabold"
              >
                Not Now
              </button>
              <button
                onClick={() => setShowInAppReviewDialog(false)}
                className="w-1/2 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
