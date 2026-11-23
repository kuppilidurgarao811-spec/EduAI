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
  UserPlus,
  UserCheck,
  Video,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Calendar,
  Clock,
  Star,
  Globe,
  Radio,
  Lock,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { EducationLevel, ForumPost, ForumCategory, Teacher, StudyGroup, DiscussionGroup } from '../types';
import { INITIAL_TEACHERS, INITIAL_STUDY_GROUPS, INITIAL_DISCUSSION_GROUPS } from '../data/mockData';

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

  // Primary Tab State
  const [activeTab, setActiveTab] = useState<'qa' | 'notes' | 'discussion_groups' | 'teachers' | 'study_groups'>('qa');

  // Q&A & Notes Filters
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('All');

  // Teachers State
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [teacherSearch, setTeacherSearch] = useState('');

  // Study Groups State
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>(INITIAL_STUDY_GROUPS);
  const [activeStudyCall, setActiveStudyCall] = useState<StudyGroup | null>(null);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

  // New Group Form State
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupSubject, setNewGroupSubject] = useState('Mathematics');
  const [newGroupLevel, setNewGroupLevel] = useState<EducationLevel>(educationLevel);
  const [newGroupSchedule, setNewGroupSchedule] = useState('Daily at 8:00 PM IST');
  const [newGroupTopic, setNewGroupTopic] = useState('');

  // Discussion Groups State
  const [discussionGroups, setDiscussionGroups] = useState<DiscussionGroup[]>(INITIAL_DISCUSSION_GROUPS);
  const [selectedDiscussionGroup, setSelectedDiscussionGroup] = useState<DiscussionGroup | null>(null);

  // Modal States for Q&A and Notes
  const [showAskDoubtModal, setShowAskDoubtModal] = useState(false);
  const [showShareNoteModal, setShowShareNoteModal] = useState(false);
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  // Forms State
  const [doubtTitle, setDoubtTitle] = useState('');
  const [doubtContent, setDoubtContent] = useState('');
  const [doubtSubject, setDoubtSubject] = useState('Mathematics');
  const [doubtLevel, setDoubtLevel] = useState<EducationLevel>(educationLevel);

  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteSubject, setNoteSubject] = useState('Physics');
  const [noteLevel, setNoteLevel] = useState<EducationLevel>(educationLevel);
  const [noteFileName, setNoteFileName] = useState('');
  const [noteFileType, setNoteFileType] = useState<'pdf' | 'image' | 'text'>('pdf');

  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postSubject, setPostSubject] = useState('General');
  const [postLevel, setPostLevel] = useState<EducationLevel>(educationLevel);

  // Expanded Replies State
  const [expandedPostIds, setExpandedPostIds] = useState<string[]>([]);
  const [replyInputText, setReplyInputText] = useState<{ [postId: string]: string }>({});

  // Live Study Call Controls
  const [micMuted, setMicMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [callChatMessage, setCallChatMessage] = useState('');
  const [callChatList, setCallChatList] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'AI Assistant', text: 'Welcome to the live study circle! Share your doubts or notes here.', time: '7:00 PM' },
    { sender: 'Ananya Varma', text: 'Hey everyone! Ready for calculus questions practice.', time: '7:01 PM' },
  ]);

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

  // Follow / Unfollow Teacher Toggle
  const toggleFollowTeacher = (teacherId: string) => {
    setTeachers((prev) =>
      prev.map((t) => {
        if (t.id === teacherId) {
          const nextState = !t.isFollowing;
          return {
            ...t,
            isFollowing: nextState,
            followersCount: nextState ? t.followersCount + 1 : t.followersCount - 1,
          };
        }
        return t;
      })
    );
    addXp(15);
  };

  // Join / Leave Study Group Toggle
  const toggleJoinStudyGroup = (groupId: string) => {
    setStudyGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const nextJoined = !g.isJoined;
          return {
            ...g,
            isJoined: nextJoined,
            membersCount: nextJoined ? g.membersCount + 1 : g.membersCount - 1,
          };
        }
        return g;
      })
    );
    addXp(25);
  };

  // Join / Leave Discussion Group Toggle
  const toggleJoinDiscussionGroup = (groupId: string) => {
    setDiscussionGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const nextJoined = !g.isJoined;
          return {
            ...g,
            isJoined: nextJoined,
            membersCount: nextJoined ? g.membersCount + 1 : g.membersCount - 1,
          };
        }
        return g;
      })
    );
    addXp(20);
  };

  // Create Custom Study Group
  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim() || !newGroupDesc.trim()) return;

    const newGroup: StudyGroup = {
      id: `sg-user-${Date.now()}`,
      name: newGroupName,
      description: newGroupDesc,
      subject: newGroupSubject,
      educationLevel: newGroupLevel,
      membersCount: 1,
      maxMembers: 30,
      isJoined: true,
      hostName: user.name,
      hostAvatar: user.avatar,
      meetingSchedule: newGroupSchedule,
      nextSessionTopic: newGroupTopic || 'First Live Group Study Session',
      chatLink: `https://meet.eduai.in/${newGroupName.toLowerCase().replace(/\s+/g, '-')}`,
      tags: ['Custom Circle', newGroupSubject, newGroupLevel],
    };

    setStudyGroups((prev) => [newGroup, ...prev]);
    setShowCreateGroupModal(false);
    setNewGroupName('');
    setNewGroupDesc('');
    setNewGroupTopic('');
    addXp(50);
  };

  // Send Call Chat Message
  const handleSendCallMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callChatMessage.trim()) return;
    setCallChatList((prev) => [
      ...prev,
      { sender: `${user.name} (You)`, text: callChatMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
    setCallChatMessage('');
  };

  // Filter Q&A Posts
  const filteredQaPosts = forumPosts.filter((post) => {
    const isDoubt = post.category === 'doubt' || post.category === 'general';
    const matchesSubject = selectedSubject === 'All' || post.subject === selectedSubject;
    const matchesLevel = filterLevel === 'All' || post.educationLevel === filterLevel;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return isDoubt && matchesSubject && matchesLevel && matchesSearch;
  });

  // Filter Shared Notes
  const filteredNotesPosts = forumPosts.filter((post) => {
    const isNote = post.category === 'shared_note';
    const matchesSubject = selectedSubject === 'All' || post.subject === selectedSubject;
    const matchesLevel = filterLevel === 'All' || post.educationLevel === filterLevel;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return isNote && matchesSubject && matchesLevel && matchesSearch;
  });

  // Filter Teachers
  const filteredTeachers = teachers.filter((t) => {
    return (
      t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
      t.subject.toLowerCase().includes(teacherSearch.toLowerCase()) ||
      t.title.toLowerCase().includes(teacherSearch.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-in fade-in duration-200 select-none">
      
      {/* Top Banner Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white relative overflow-hidden shadow-xl border border-indigo-500/30">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> EduAI Social & Community
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Bot className="w-3.5 h-3.5" /> AI & Peer Verified
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Student Discussion, Notes & Educator Hub
            </h1>
            <p className="text-xs md:text-sm text-indigo-200/90 leading-relaxed">
              Ask questions, share handwritten notes, follow top verified teachers, join peer study groups, and collaborate with students nationwide.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowAskDoubtModal(true)}
              className="px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-transform active:scale-95 shadow-md flex items-center gap-2 shrink-0"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Ask Question (AI Instant)</span>
            </button>

            <button
              type="button"
              onClick={() => setShowShareNoteModal(true)}
              className="px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition-transform active:scale-95 shadow-md flex items-center gap-2 shrink-0"
            >
              <Upload className="w-4 h-4" />
              <span>Share Notes / PDF</span>
            </button>

            <button
              type="button"
              onClick={() => setShowCreateGroupModal(true)}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all border border-white/20 flex items-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create Study Circle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Social Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('qa')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shrink-0 transition-all ${
            activeTab === 'qa'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>Ask & Answer Questions ({forumPosts.filter((p) => p.category === 'doubt').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shrink-0 transition-all ${
            activeTab === 'notes'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>Shared Notes Vault ({forumPosts.filter((p) => p.category === 'shared_note').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('discussion_groups')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shrink-0 transition-all ${
            activeTab === 'discussion_groups'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-purple-400" />
          <span>Discussion Groups ({discussionGroups.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('teachers')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shrink-0 transition-all ${
            activeTab === 'teachers'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
          }`}
        >
          <UserCheck className="w-4 h-4 text-sky-400" />
          <span>Follow Teachers ({teachers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('study_groups')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shrink-0 transition-all ${
            activeTab === 'study_groups'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
          }`}
        >
          <Users className="w-4 h-4 text-amber-500" />
          <span>Study Circles & Live Calls ({studyGroups.length})</span>
        </button>
      </div>

      {/* SUB-TAB 1: Q&A FORUM */}
      {activeTab === 'qa' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search questions or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100 placeholder-slate-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
              >
                <option value="All">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Telugu">Telugu</option>
                <option value="English">English</option>
              </select>

              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
              >
                <option value="All">All Grades</option>
                <option value="LKG">LKG / UKG</option>
                <option value="Class 1–5">Class 1–5</option>
                <option value="Class 6–10">Class 6–10</option>
                <option value="Intermediate (11–12)">Intermediate (11–12)</option>
                <option value="Degree (BSc, BCom, BA, BTech)">Degree / BTech</option>
              </select>

              <button
                type="button"
                onClick={() => setShowAskDoubtModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-sm flex items-center gap-1.5 ml-auto"
              >
                <Plus className="w-4 h-4" /> Ask Question
              </button>
            </div>
          </div>

          {/* Questions Feed */}
          {filteredQaPosts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
              <HelpCircle className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No questions match your filter</h3>
              <p className="text-xs text-slate-400">Ask the first doubt and get instant AI + teacher verified solutions!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQaPosts.map((post) => {
                const isExpanded = expandedPostIds.includes(post.id);

                return (
                  <div
                    key={post.id}
                    className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4"
                  >
                    {/* Author & Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img src={post.authorAvatar} alt={post.authorName} className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/30" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black text-slate-800 dark:text-slate-100">{post.authorName}</h4>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                              {post.authorRole}
                            </span>
                          </div>
                          <p className="text-[11px] font-bold text-slate-400">{post.subject} • {post.educationLevel} • {post.createdAt}</p>
                        </div>
                      </div>

                      <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[11px] font-black uppercase tracking-wider border border-amber-300 dark:border-amber-800">
                        🙋‍♂️ Question
                      </span>
                    </div>

                    {/* Question Title & Content */}
                    <div className="space-y-2">
                      <h3 className="text-base font-black text-slate-800 dark:text-slate-100">{post.title}</h3>
                      <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                    </div>

                    {/* AI Verified Answer Card if present */}
                    {post.isAiResolved && post.aiAnswer && (
                      <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-xs font-black text-emerald-800 dark:text-emerald-300">
                            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            AI Tutor Instant Verified Solution
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> 100% Accuracy
                          </span>
                        </div>
                        <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed whitespace-pre-wrap font-medium">
                          {post.aiAnswer}
                        </p>
                      </div>
                    )}

                    {/* Bottom Action Footer */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => toggleUpvotePost(post.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                            post.userUpvoted
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{post.upvotes} Upvotes</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleExpandPost(post.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-200"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{post.replies.length} Answers</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleExpandPost(post.id)}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        <span>{isExpanded ? 'Hide Thread' : 'Answer Question'}</span>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </button>
                    </div>

                    {/* Expanded Replies Section */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in duration-200">
                        {/* List of Replies */}
                        <div className="space-y-3">
                          {post.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className={`p-4 rounded-2xl border text-xs space-y-2 ${
                                reply.isAcceptedAnswer
                                  ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700'
                                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <img src={reply.authorAvatar} alt={reply.authorName} className="w-7 h-7 rounded-full object-cover" />
                                  <span className="font-extrabold text-slate-800 dark:text-slate-100">{reply.authorName}</span>
                                  {reply.isAcceptedAnswer && (
                                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3" /> Accepted Solution
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-400">{reply.createdAt}</span>
                              </div>
                              <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                              <div className="pt-1 flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => toggleUpvoteReply(post.id, reply.id)}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 ${
                                    reply.userUpvoted ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                  }`}
                                >
                                  <ThumbsUp className="w-3 h-3" /> {reply.upvotes}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Reply Input Box */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Write your answer or explanation here..."
                            value={replyInputText[post.id] || ''}
                            onChange={(e) =>
                              setReplyInputText((prev) => ({ ...prev, [post.id]: e.target.value }))
                            }
                            onKeyDown={(e) => e.key === 'Enter' && handleAddReplySubmit(post.id)}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddReplySubmit(post.id)}
                            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shrink-0"
                          >
                            <Send className="w-3.5 h-3.5" /> Post Answer
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: SHARED NOTES VAULT */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search PDF notes or summary sheets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100 placeholder-slate-400"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowShareNoteModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-sm flex items-center gap-1.5 ml-auto"
            >
              <Upload className="w-4 h-4" /> Upload Study Material
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredNotesPosts.map((note) => (
              <div
                key={note.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img src={note.authorAvatar} alt={note.authorName} className="w-9 h-9 rounded-full object-cover border-2 border-indigo-500/30" />
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-100">{note.authorName}</h4>
                        <p className="text-[10px] text-slate-400">{note.subject} • {note.educationLevel}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 text-[10px] font-black uppercase">
                      {note.attachmentType?.toUpperCase() || 'PDF'}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-800 dark:text-slate-100">{note.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">{note.content}</p>

                  {note.attachmentName && (
                    <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center gap-3">
                      <FileText className="w-5 h-5 text-indigo-600 shrink-0" />
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{note.attachmentName}</div>
                        <div className="text-[10px] text-slate-400">Verified Study Resource</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-500 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500" /> 4.9 (120+ Downloads)
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      downloadOfflineItem({
                        id: `off-note-${note.id}`,
                        title: note.title,
                        type: 'pdf',
                        subject: note.subject,
                        educationLevel: note.educationLevel,
                        fileSize: '4.2 MB',
                        downloadedAt: 'Just now',
                        chapterTitle: note.attachmentName || note.title,
                        contentOrUrl: note.content,
                      });
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Save to Vault
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: STUDENT DISCUSSION GROUPS */}
      {activeTab === 'discussion_groups' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {discussionGroups.map((group) => (
              <div
                key={group.id}
                className={`p-6 rounded-3xl border flex flex-col justify-between space-y-4 transition-all ${
                  group.isJoined
                    ? 'bg-gradient-to-br from-indigo-50/60 to-purple-50/40 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-300 dark:border-indigo-800/80 shadow-md'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="text-3xl p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-sm">
                      {group.icon}
                    </div>
                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-extrabold flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{group.membersCount} Students</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-800 dark:text-slate-100">{group.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{group.description}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-500 animate-pulse shrink-0" />
                    <span>Active Topic: <strong>{group.activeTopic}</strong></span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-3">
                  <span className="text-[10px] font-bold text-slate-400">Active {group.lastActive}</span>
                  
                  <button
                    type="button"
                    onClick={() => toggleJoinDiscussionGroup(group.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-transform active:scale-95 flex items-center gap-1.5 ${
                      group.isJoined
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                    }`}
                  >
                    {group.isJoined ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Joined Group
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" /> Join Discussion Squad
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: FOLLOW TEACHERS DIRECTORY */}
      {activeTab === 'teachers' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm flex items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search verified teachers by name or subject..."
                value={teacherSearch}
                onChange={(e) => setTeacherSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100 placeholder-slate-400"
              />
            </div>
            <span className="text-xs font-bold text-slate-500 hidden sm:block">
              Showing {filteredTeachers.length} Certified Educators
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={teacher.avatar} alt={teacher.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/40 shadow-sm" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-base font-black text-slate-800 dark:text-slate-100">{teacher.name}</h3>
                          {teacher.verified && <ShieldCheck className="w-4 h-4 text-sky-500 fill-sky-500 text-white" />}
                        </div>
                        <p className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">{teacher.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{teacher.subject} • {teacher.educationLevel}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{teacher.bio}</p>

                  <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs font-bold bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Rating</div>
                      <div className="text-amber-500 font-extrabold flex items-center justify-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-500" /> {teacher.rating}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Students</div>
                      <div className="text-slate-800 dark:text-slate-100 font-extrabold">{teacher.studentsCount.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Followers</div>
                      <div className="text-indigo-600 dark:text-indigo-400 font-extrabold">{teacher.followersCount.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSubject(teacher.subject);
                      setActiveTab('notes');
                    }}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>View Published Notes ({teacher.recentMaterialsCount})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleFollowTeacher(teacher.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-transform active:scale-95 flex items-center gap-1.5 ${
                      teacher.isFollowing
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                    }`}
                  >
                    {teacher.isFollowing ? (
                      <>
                        <UserCheck className="w-4 h-4 text-emerald-500" /> Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" /> Follow Educator
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: STUDY CIRCLES & LIVE CALLS */}
      {activeTab === 'study_groups' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm">
            <div>
              <h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-500" />
                <span>Peer Study Circles & Interactive Live Rooms</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Join focused study groups to practice numerical problems, solve formula doubts, and hold live group voice/video calls.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowCreateGroupModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs shadow-md flex items-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" /> Create New Study Circle
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {studyGroups.map((group) => (
              <div
                key={group.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-black uppercase">
                        {group.subject}
                      </span>
                      <h3 className="text-base font-black text-slate-800 dark:text-slate-100 mt-1">{group.name}</h3>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200">
                      <Users className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{group.membersCount} / {group.maxMembers}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{group.description}</p>

                  <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-bold">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Schedule: {group.meetingSchedule}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>Next Topic: <strong>{group.nextSessionTopic}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <img src={group.hostAvatar} alt={group.hostName} className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-[11px] font-bold text-slate-500">Host: {group.hostName}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => toggleJoinStudyGroup(group.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      group.isJoined
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {group.isJoined ? 'Member' : 'Join Circle'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveStudyCall(group)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
                  >
                    <Video className="w-4 h-4" /> Join Live Call Room
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LIVE STUDY CALL MODAL */}
      {activeStudyCall && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 text-white max-w-4xl w-full rounded-3xl shadow-2xl border border-slate-800 p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-600 text-white">
                  <Video className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-base font-black">{activeStudyCall.name}</h2>
                  <p className="text-xs text-indigo-300">Topic: {activeStudyCall.nextSessionTopic}</p>
                </div>
              </div>
              <button onClick={() => setActiveStudyCall(null)} className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Call Stage + Chat */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Video Stage */}
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {/* Speaker 1 */}
                  <div className="relative aspect-video rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
                    <img src={activeStudyCall.hostAvatar} alt={activeStudyCall.hostName} className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1">
                      <Mic className="w-3 h-3 text-emerald-400" /> {activeStudyCall.hostName} (Host)
                    </div>
                  </div>

                  {/* You */}
                  <div className="relative aspect-video rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
                    {cameraOff ? (
                      <div className="text-center space-y-2">
                        <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full mx-auto object-cover border-2 border-indigo-500" />
                        <span className="text-xs font-bold text-slate-400">Camera Off</span>
                      </div>
                    ) : (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1">
                      {micMuted ? <MicOff className="w-3 h-3 text-red-400" /> : <Mic className="w-3 h-3 text-emerald-400" />} {user.name} (You)
                    </div>
                  </div>
                </div>

                {/* Call Control Toolbar */}
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center gap-4">
                  <button
                    onClick={() => setMicMuted(!micMuted)}
                    className={`p-3 rounded-2xl transition-all ${micMuted ? 'bg-red-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
                  >
                    {micMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={() => setCameraOff(!cameraOff)}
                    className={`p-3 rounded-2xl transition-all ${cameraOff ? 'bg-red-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
                  >
                    {cameraOff ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={() => setActiveStudyCall(null)}
                    className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg"
                  >
                    Leave Room
                  </button>
                </div>
              </div>

              {/* Right Live Group Chat */}
              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 flex flex-col justify-between h-80 lg:h-auto">
                <h3 className="text-xs font-black uppercase tracking-wider text-indigo-400 border-b border-slate-700 pb-2">
                  Live Study Chat
                </h3>

                <div className="flex-1 overflow-y-auto space-y-2.5 my-3 pr-1 text-xs">
                  {callChatList.map((m, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-900/80 space-y-1">
                      <div className="flex items-center justify-between font-bold text-[10px] text-indigo-300">
                        <span>{m.sender}</span>
                        <span className="text-slate-500">{m.time}</span>
                      </div>
                      <p className="text-slate-200">{m.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendCallMessage} className="flex gap-2 pt-2 border-t border-slate-700">
                  <input
                    type="text"
                    placeholder="Type message..."
                    value={callChatMessage}
                    onChange={(e) => setCallChatMessage(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  <button type="submit" className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE STUDY CIRCLE MODAL */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 max-w-lg w-full p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-black flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span>Create Peer Study Circle</span>
              </h2>
              <button onClick={() => setShowCreateGroupModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroupSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Study Circle Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EAPCET Physics Numerical Solvers"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Description</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Explain group goals and study topics..."
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Subject</label>
                  <select
                    value={newGroupSubject}
                    onChange={(e) => setNewGroupSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="General Board">General Board</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Meeting Schedule</label>
                  <input
                    type="text"
                    placeholder="e.g. Daily at 8:00 PM IST"
                    value={newGroupSchedule}
                    onChange={(e) => setNewGroupSchedule(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">First Topic</label>
                <input
                  type="text"
                  placeholder="e.g. Integration by parts & trigonometric formulas"
                  value={newGroupTopic}
                  onChange={(e) => setNewGroupTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateGroupModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md"
                >
                  Launch Study Circle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASK DOUBT MODAL */}
      {showAskDoubtModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 max-w-lg w-full p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-black flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-500" />
                <span>Ask Question (AI + Peer Answer)</span>
              </h2>
              <button onClick={() => setShowAskDoubtModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAskDoubtSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Question Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How to derive quadratic formula step by step?"
                  value={doubtTitle}
                  onChange={(e) => setDoubtTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Detailed Explanation / Problem Statement</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe your doubt or post formula code..."
                  value={doubtContent}
                  onChange={(e) => setDoubtContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Subject</label>
                  <select
                    value={doubtSubject}
                    onChange={(e) => setDoubtSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Telugu">Telugu</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Grade Level</label>
                  <select
                    value={doubtLevel}
                    onChange={(e) => setDoubtLevel(e.target.value as EducationLevel)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  >
                    <option value="Class 6–10">Class 6–10</option>
                    <option value="Intermediate (11–12)">Intermediate (11–12)</option>
                    <option value="Degree (BSc, BCom, BA, BTech)">Degree / BTech</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAskDoubtModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-md flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" /> Ask & Get AI Answer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SHARE NOTE MODAL */}
      {showShareNoteModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 max-w-lg w-full p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-black flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-600" />
                <span>Upload Study Material / Handwritten Notes</span>
              </h2>
              <button onClick={() => setShowShareNoteModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleShareNoteSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Magnetism & Matter Short Formula Sheet"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Notes Summary / Key Points</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Summarize what is inside this document..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Subject</label>
                  <select
                    value={noteSubject}
                    onChange={(e) => setNoteSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">File Type</label>
                  <select
                    value={noteFileType}
                    onChange={(e) => setNoteFileType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="image">Image Scan / Photo</option>
                    <option value="text">Text Notes</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowShareNoteModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md"
                >
                  Upload & Share
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
