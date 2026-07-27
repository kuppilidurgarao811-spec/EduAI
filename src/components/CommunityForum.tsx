import React, { useState } from 'react';
import {
  MessageSquare,
  HelpCircle,
  FileText,
  Upload,
  ThumbsUp,
  MessageCircle,
  Sparkles,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  Share2,
  Download,
  Tag,
  User,
  Users,
  BookOpen,
  Award,
  Send,
  X,
  FileCode,
  Image,
  Paperclip,
  TrendingUp,
  BrainCircuit,
  Bot,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { EducationLevel, ForumPost, ForumCategory } from '../types';

export const CommunityForum: React.FC = () => {
  const {
    user,
    educationLevel,
    forumPosts,
    addForumPost,
    addForumReply,
    toggleUpvotePost,
    toggleUpvoteReply,
    askAiDoubt,
    downloadOfflineItem,
    addXp,
  } = useAuth();

  const [activeCategory, setActiveCategory] = useState<ForumCategory>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('All');

  // Modal States
  const [showAskDoubtModal, setShowAskDoubtModal] = useState(false);
  const [showShareNoteModal, setShowShareNoteModal] = useState(false);
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  // Ask Doubt Form State
  const [doubtTitle, setDoubtTitle] = useState('');
  const [doubtContent, setDoubtContent] = useState('');
  const [doubtSubject, setDoubtSubject] = useState('Mathematics');
  const [doubtLevel, setDoubtLevel] = useState<EducationLevel>(educationLevel);

  // Share Note Form State
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteSubject, setNoteSubject] = useState('Physics');
  const [noteLevel, setNoteLevel] = useState<EducationLevel>(educationLevel);
  const [noteFileName, setNoteFileName] = useState('');
  const [noteFileType, setNoteFileType] = useState<'pdf' | 'image' | 'text'>('pdf');

  // New General Post Form State
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postSubject, setPostSubject] = useState('General');
  const [postLevel, setPostLevel] = useState<EducationLevel>(educationLevel);

  // Active expanded reply threads
  const [expandedPostIds, setExpandedPostIds] = useState<string[]>([]);
  const [replyInputText, setReplyInputText] = useState<{ [postId: string]: string }>({});

  const toggleExpandPost = (id: string) => {
    setExpandedPostIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleAskDoubtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtTitle.trim() || !doubtContent.trim()) return;

    askAiDoubt(doubtTitle, doubtContent, doubtSubject, doubtLevel);

    setDoubtTitle('');
    setDoubtContent('');
    setShowAskDoubtModal(false);
  };

  const handleShareNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;

    addForumPost({
      title: noteTitle,
      content: noteContent,
      subject: noteSubject,
      educationLevel: noteLevel,
      category: 'shared_note',
      tags: ['Notes', noteSubject, noteLevel, noteFileType.toUpperCase()],
      attachmentName: noteFileName || `${noteTitle.replace(/\s+/g, '_')}.${noteFileType}`,
      attachmentType: noteFileType,
      attachmentUrl: `sample-${noteFileType}`,
    });

    setNoteTitle('');
    setNoteContent('');
    setNoteFileName('');
    setShowShareNoteModal(false);
  };

  const handleGeneralPostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    addForumPost({
      title: postTitle,
      content: postContent,
      subject: postSubject,
      educationLevel: postLevel,
      category: 'general',
      tags: ['Discussion', postSubject, postLevel],
    });

    setPostTitle('');
    setPostContent('');
    setShowNewPostModal(false);
  };

  const handleAddReplySubmit = (postId: string) => {
    const text = replyInputText[postId];
    if (!text || !text.trim()) return;

    addForumReply(postId, text);
    setReplyInputText((prev) => ({ ...prev, [postId]: '' }));
  };

  // Filter posts
  const filteredPosts = forumPosts.filter((post) => {
    const matchesCategory =
      activeCategory === 'all'
        ? true
        : activeCategory === 'doubts'
        ? post.category === 'doubt'
        : activeCategory === 'notes'
        ? post.category === 'shared_note'
        : activeCategory === 'discussions'
        ? post.category === 'general'
        : true;

    const matchesSubject = selectedSubject === 'All' || post.subject === selectedSubject;
    const matchesLevel = filterLevel === 'All' || post.educationLevel === filterLevel;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSubject && matchesLevel && matchesSearch;
  });

  const doubtsCount = forumPosts.filter((p) => p.category === 'doubt').length;
  const notesCount = forumPosts.filter((p) => p.category === 'shared_note').length;
  const discussionsCount = forumPosts.filter((p) => p.category === 'general').length;

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* Top Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white relative overflow-hidden shadow-xl border border-indigo-500/30">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Student & Peer Community
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Bot className="w-3.5 h-3.5" /> EduAI Tutor Active
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Student Discussion Forum & Notes Vault
            </h1>
            <p className="text-xs md:text-sm text-indigo-200/90 leading-relaxed">
              Ask doubts, get instant AI & peer verified answers, download handwritten study notes, and collaborate with students across AP/TS and India.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowAskDoubtModal(true)}
              className="px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Ask Doubt (AI Instant)</span>
            </button>

            <button
              type="button"
              onClick={() => setShowShareNoteModal(true)}
              className="px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition-all shadow-md flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Share Notes / PDF</span>
            </button>

            <button
              type="button"
              onClick={() => setShowNewPostModal(true)}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all border border-white/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Discussion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase">Doubts Solved</p>
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">{doubtsCount} Active</h3>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase">Notes Shared</p>
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">{notesCount} PDFs</h3>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase">Discussions</p>
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">{discussionsCount} Posts</h3>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase">Your Community XP</p>
            <h3 className="text-lg font-black text-indigo-600 dark:text-indigo-400">{user.xp} XP</h3>
          </div>
        </div>
      </div>

      {/* Category Tabs & Search Filter */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/80 dark:border-slate-700/80 shadow-inner overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`py-2 px-3.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>All Posts ({forumPosts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('doubts')}
            className={`py-2 px-3.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeCategory === 'doubts'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-amber-500" />
            <span>Doubts & AI Solutions ({doubtsCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('notes')}
            className={`py-2 px-3.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeCategory === 'notes'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-500" />
            <span>Shared Notes & PDFs ({notesCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('discussions')}
            className={`py-2 px-3.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeCategory === 'discussions'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-purple-500" />
            <span>General Discussions ({discussionsCount})</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Grade Level Select */}
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
          >
            <option value="All">All Grades</option>
            <option value="LKG">LKG</option>
            <option value="UKG">UKG</option>
            <option value="Class 1–5">Class 1–5</option>
            <option value="Class 6–10">Class 6–10</option>
            <option value="Intermediate (11–12)">Intermediate (11–12)</option>
            <option value="Degree (BSc, BCom, BA, BTech)">Degree / BTech</option>
          </select>

          {/* Search Input */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search doubts or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100 placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      {/* POSTS FEED */}
      {filteredPosts.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
            No community posts found for this filter
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Be the first student to ask a doubt or upload study notes for your peers!
          </p>
          <button
            type="button"
            onClick={() => setShowAskDoubtModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md inline-flex items-center gap-2"
          >
            <HelpCircle className="w-4 h-4" /> Ask a Doubt Now
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map((post) => {
            const isExpanded = expandedPostIds.includes(post.id);

            return (
              <div
                key={post.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                {/* Post Author Info & Category Badge */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/30"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-slate-800 dark:text-slate-100">
                          {post.authorName}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          post.authorRole === 'Teacher'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                            : post.authorRole === 'AI Tutor'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {post.authorRole}
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-slate-400">
                        {post.subject} • {post.educationLevel} • {post.createdAt}
                      </p>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                    post.category === 'doubt'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                      : post.category === 'shared_note'
                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800'
                      : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {post.category === 'doubt' ? '🙋‍♂️ Doubt' : post.category === 'shared_note' ? '📚 Shared Note' : '💬 Discussion'}
                  </span>
                </div>

                {/* Title & Body Content */}
                <div className="space-y-2">
                  <h3 className="text-base font-black text-slate-800 dark:text-slate-100">
                    {post.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>
                </div>

                {/* Attachment Section (if shared note) */}
                {post.attachmentName && (
                  <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-indigo-600 text-white">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">
                          {post.attachmentName}
                        </h4>
                        <p className="text-[10px] font-bold text-slate-400">
                          {post.attachmentType?.toUpperCase()} File • Ready for study
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        downloadOfflineItem({
                          id: `off-forum-${post.id}`,
                          title: post.title,
                          type: post.attachmentType === 'pdf' ? 'pdf' : 'lesson',
                          subject: post.subject,
                          educationLevel: post.educationLevel,
                          fileSize: '3.5 MB',
                          downloadedAt: 'Just now',
                          chapterTitle: post.attachmentName,
                          contentOrUrl: `Shared Note Content:\n${post.content}`,
                        });
                      }}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Save to Offline Vault</span>
                    </button>
                  </div>
                )}

                {/* Tags list */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {post.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* AI Tutor Answer Card if resolved */}
                {post.isAiResolved && post.aiAnswer && (
                  <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs font-black text-emerald-800 dark:text-emerald-300">
                        <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        AI Tutor Verified Answer
                      </span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100">
                        Instant Solution
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">
                      {post.aiAnswer}
                    </p>
                  </div>
                )}

                {/* Post Footer Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleUpvotePost(post.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                        post.userUpvoted
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{post.upvotes} Upvotes</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleExpandPost(post.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{post.repliesCount} Answers / Comments</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleExpandPost(post.id)}
                    className="text-xs font-black text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {isExpanded ? 'Hide Replies' : 'View Replies & Answer'}
                  </button>
                </div>

                {/* EXPANDED REPLIES & REPLY INPUT */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4 animate-fadeIn">
                    <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Discussion Thread ({post.replies.length} replies)
                    </h4>

                    {/* Replies List */}
                    <div className="space-y-3">
                      {post.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className={`p-4 rounded-2xl border ${
                            reply.isAcceptedAnswer
                              ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                              : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60'
                          } space-y-2`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <img
                                src={reply.authorAvatar}
                                alt={reply.authorName}
                                className="w-7 h-7 rounded-full object-cover"
                              />
                              <span className="text-xs font-black text-slate-800 dark:text-slate-100">
                                {reply.authorName}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                {reply.authorRole}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {reply.isAcceptedAnswer && (
                                <span className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                                  <ShieldCheck className="w-3 h-3" /> Accepted Answer
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400">{reply.createdAt}</span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">
                            {reply.content}
                          </p>

                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => toggleUpvoteReply(post.id, reply.id)}
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                                reply.userUpvoted
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              <ThumbsUp className="w-3 h-3" /> {reply.upvotes}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Reply Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Write your answer or discussion reply..."
                        value={replyInputText[post.id] || ''}
                        onChange={(e) =>
                          setReplyInputText({ ...replyInputText, [post.id]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddReplySubmit(post.id);
                        }}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddReplySubmit(post.id)}
                        className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs transition-all flex items-center gap-1.5 shadow-xs shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ASK DOUBT MODAL */}
      {showAskDoubtModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800 dark:text-slate-100">
                    Ask Doubt (AI Instant Solution)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Get an immediate AI Tutor verification & peer discussion
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAskDoubtModal(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAskDoubtSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Question / Doubt Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., How to calculate electric flux using Gauss Law?"
                  value={doubtTitle}
                  onChange={(e) => setDoubtTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Subject *
                  </label>
                  <select
                    value={doubtSubject}
                    onChange={(e) => setDoubtSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="English">English</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Social Studies">Social Studies</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Grade Level *
                  </label>
                  <select
                    value={doubtLevel}
                    onChange={(e) => setDoubtLevel(e.target.value as EducationLevel)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                  >
                    <option value="LKG">LKG</option>
                    <option value="UKG">UKG</option>
                    <option value="Class 1–5">Class 1–5</option>
                    <option value="Class 6–10">Class 6–10</option>
                    <option value="Intermediate (11–12)">Intermediate (11–12)</option>
                    <option value="Degree (BSc, BCom, BA, BTech)">Degree / BTech</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Doubt Details / Problem Statement *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Paste the problem statement, given values, or step where you got stuck..."
                  value={doubtContent}
                  onChange={(e) => setDoubtContent(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
                <Sparkles className="w-4 h-4 shrink-0 text-amber-600" />
                <span>EduAI Tutor will auto-analyze your question and generate step-by-step logic!</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAskDoubtModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md flex items-center gap-2"
                >
                  <Bot className="w-4 h-4" />
                  <span>Submit Doubt & AI Solve (+20 XP)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SHARE NOTE MODAL */}
      {showShareNoteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800 dark:text-slate-100">
                    Share Study Notes / PDF Handbook
                  </h3>
                  <p className="text-xs text-slate-400">Upload your handwritten or typed study materials</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowShareNoteModal(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleShareNoteSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Notes Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Intermediate 2nd Year Chemistry Organic Reaction Mechanisms"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Subject *
                  </label>
                  <select
                    value={noteSubject}
                    onChange={(e) => setNoteSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Telugu">Telugu</option>
                    <option value="English">English</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Grade Level *
                  </label>
                  <select
                    value={noteLevel}
                    onChange={(e) => setNoteLevel(e.target.value as EducationLevel)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                  >
                    <option value="LKG">LKG</option>
                    <option value="UKG">UKG</option>
                    <option value="Class 1–5">Class 1–5</option>
                    <option value="Class 6–10">Class 6–10</option>
                    <option value="Intermediate (11–12)">Intermediate (11–12)</option>
                    <option value="Degree (BSc, BCom, BA, BTech)">Degree / BTech</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  File Attachment Name / Summary *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Organic_Chemistry_Summary.pdf"
                  value={noteFileName}
                  onChange={(e) => setNoteFileName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Notes Description & Key Chapter Outline *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe what chapters, formulas, or solved questions are in this note file..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowShareNoteModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Publish Note (+15 XP)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW GENERAL POST MODAL */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800 dark:text-slate-100">
                    Start Peer Discussion
                  </h3>
                  <p className="text-xs text-slate-400">Discuss exam strategy, study tips, and group learning</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowNewPostModal(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGeneralPostSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Discussion Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Best 30-day revision schedule for Class 10 Board Exams?"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Discussion Content *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share your thoughts or ask peers for advice..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Post Discussion (+15 XP)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
