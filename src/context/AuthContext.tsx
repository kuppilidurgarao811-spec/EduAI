import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  EducationLevel,
  Language,
  ChatMessage,
  Notification,
  NotificationType,
  ReminderSettings,
  Course,
  CourseModule,
  Test,
  OfflineItem,
  ForumPost,
  ForumReply,
  ManagedUser,
  StudyPlan,
  StudyPlanTask,
  FontSize,
  PrivacySettings,
} from '../types';
import {
  INITIAL_COURSES,
  INITIAL_TESTS,
  INITIAL_BADGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_OFFLINE_ITEMS,
  INITIAL_FORUM_POSTS,
  INITIAL_MANAGED_USERS,
} from '../data/mockData';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  firebaseSignOut,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from '../lib/firebase';

interface AuthContextType {
  user: User;
  updateUser: (updatedFields: Partial<User>) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  educationLevel: EducationLevel;
  setEducationLevel: (level: EducationLevel) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  themeMode: 'light' | 'dark' | 'system';
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  privacySettings: PrivacySettings;
  updatePrivacySettings: (settings: Partial<PrivacySettings>) => void;
  clearAllUserData: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  courses: Course[];
  addCourse: (course: Course) => void;
  tests: Test[];
  chatHistory: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  updateChatMessage: (id: string, newText: string) => void;
  deleteChatMessage: (id: string) => void;
  clearChatHistory: () => void;
  notifications: Notification[];
  addNotification: (notif: Notification) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  reminderSettings: ReminderSettings;
  updateReminderSettings: (settings: Partial<ReminderSettings>) => void;
  offlineItems: OfflineItem[];
  isOfflineMode: boolean;
  toggleOfflineMode: () => void;
  downloadOfflineItem: (item: OfflineItem) => void;
  removeOfflineItem: (id: string) => void;
  clearOfflineVault: () => void;
  addXp: (amount: number) => void;
  bookmarks: string[];
  toggleBookmark: (id: string) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  login: (email: string, role: UserRole, name?: string) => void;
  loginWithFirebase: (email: string, pass: string, targetRole: UserRole) => Promise<void>;
  registerWithFirebase: (email: string, pass: string, name: string, targetRole: UserRole) => Promise<void>;
  signInWithGoogle: (targetRole: UserRole) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  authError: string | null;
  setAuthError: (err: string | null) => void;
  logout: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  forumPosts: ForumPost[];
  addForumPost: (postData: Omit<ForumPost, 'id' | 'createdAt' | 'upvotes' | 'replies' | 'repliesCount' | 'authorName' | 'authorRole' | 'authorAvatar'>) => void;
  addForumReply: (postId: string, content: string) => void;
  toggleUpvotePost: (postId: string) => void;
  toggleUpvoteReply: (postId: string, replyId: string) => void;
  askAiDoubt: (title: string, doubtContent: string, subject: string, level: EducationLevel) => void;
  managedUsers: ManagedUser[];
  addManagedUser: (userData: Omit<ManagedUser, 'id' | 'joinedDate' | 'lastActive' | 'coursesEnrolled'>) => void;
  updateManagedUser: (id: string, updates: Partial<ManagedUser>) => void;
  deleteManagedUser: (id: string) => void;
  deleteCourse: (courseId: string) => void;
  addModuleToCourse: (courseId: string, module: CourseModule) => void;
  broadcastNotification: (notifData: {
    title: string;
    message: string;
    type: NotificationType;
    category?: string;
    targetRole?: UserRole | 'all';
    targetLevel?: EducationLevel | 'all';
  }) => void;
  isPremium: boolean;
  subscriptionPlan: 'Free' | 'Pro Monthly' | 'Ultra Annual';
  showPremiumModal: boolean;
  setShowPremiumModal: (show: boolean) => void;
  upgradeToPremium: (planName?: 'Pro Monthly' | 'Ultra Annual') => void;
  cancelPremium: () => void;
  dailyAiMessagesCount: number;
  incrementAiMessageCount: () => boolean;
  studyPlans: StudyPlan[];
  addStudyPlan: (plan: StudyPlan) => void;
  toggleStudyTaskComplete: (planId: string, taskId: string) => void;
  deleteStudyPlan: (planId: string) => void;
}

const DEFAULT_USER: User = {
  id: 'usr-1',
  name: 'Kuppili Durga Rao',
  email: 'kuppilidurgarao811@gmail.com',
  role: 'student',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  educationLevel: 'Degree (BSc, BCom, BA, BTech)',
  streak: 12,
  xp: 2850,
  badges: ['badge-1', 'badge-2', 'badge-3'],
  certificates: [
    {
      id: 'cert-1',
      title: 'Full Stack Web & Programming Certificate',
      issueDate: '2026-07-20',
      score: 98,
      level: 'Degree (BSc, BCom, BA, BTech)',
    },
  ],
  savedBookmarks: ['course-class10-math', 'course-prog-python-mastery'],
  isPremium: false,
  subscriptionPlan: 'Free',
  dailyAiMessagesCount: 3,
  maxDailyAiMessages: 10,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('eduai_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          !parsed.name ||
          parsed.name.toLowerCase().includes('durgarao') ||
          parsed.name.toLowerCase().includes('raju') ||
          parsed.email === 'kuppilidurgarao811@gmail.com' ||
          parsed.email === 'raju.sharma@eduai.edu'
        ) {
          parsed.email = 'kuppilidurgarao811@gmail.com';
          parsed.name = 'Kuppili Durga Rao';
        }
        return parsed;
      } catch (e) {
        return DEFAULT_USER;
      }
    }
    return DEFAULT_USER;
  });

  useEffect(() => {
    localStorage.setItem('eduai_user', JSON.stringify(user));
  }, [user]);

  const updateUser = (updatedFields: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...updatedFields }));
  };

  const [role, setRoleState] = useState<UserRole>(user.role);
  const [educationLevel, setEducationLevelState] = useState<EducationLevel>(user.educationLevel);
  const [language, setLanguageState] = useState<Language>('English');
  const [themeMode, setThemeModeState] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem('eduai_theme_mode') as 'light' | 'dark' | 'system') || (localStorage.getItem('eduai_theme') === 'dark' ? 'dark' : 'light');
  });
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('eduai_theme') === 'dark';
  });
  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    return (localStorage.getItem('eduai_font_size') as FontSize) || 'medium';
  });
  const [privacySettings, setPrivacySettingsState] = useState<PrivacySettings>(() => {
    const saved = localStorage.getItem('eduai_privacy_settings');
    return saved
      ? JSON.parse(saved)
      : {
          allowAnalytics: true,
          publicLeaderboard: true,
          saveAiChatHistory: true,
          shareProgressWithTeachers: true,
          incognitoMode: false,
        };
  });
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [tests] = useState<Test[]>(INITIAL_TESTS);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('eduai_chat_history');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'c-welcome',
            role: 'model',
            text: 'Hello Kuppili Durga Rao! I am EduAI, your personal AI tutor. Ask me anything about Mathematics, Science, Telugu, Programming, or Competitive Exams. I can solve homework, explain concepts step-by-step, translate to Telugu, and create practice quizzes for you!',
            timestamp: 'Just now',
          },
        ];
  });
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [bookmarks, setBookmarks] = useState<string[]>(user.savedBookmarks || []);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  const [offlineItems, setOfflineItems] = useState<OfflineItem[]>(() => {
    const saved = localStorage.getItem('eduai_offline_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_OFFLINE_ITEMS;
  });

  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>(() => {
    const saved = localStorage.getItem('eduai_study_plans');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 'plan-default-1',
        title: '7-Day AP/TS Board Exam Boost',
        targetExam: 'Board Exam 2026',
        educationLevel: 'Class 6–10',
        durationDays: 7,
        dailyHours: 3,
        weakSubjects: ['Mathematics', 'Physics'],
        createdAt: '2026-07-25',
        overallProgressPercent: 35,
        tasks: [
          {
            id: 'task-101',
            dayNumber: 1,
            subject: 'Mathematics',
            topic: 'Real Numbers & Polynomial Factorization',
            durationMinutes: 45,
            taskType: 'concept_video',
            completed: true,
            notes: 'Mastered Euclid division lemma and prime factor trees',
          },
          {
            id: 'task-102',
            dayNumber: 1,
            subject: 'Physics',
            topic: 'Light Reflection & Refraction Formulas',
            durationMinutes: 45,
            taskType: 'formula_revision',
            completed: true,
          },
          {
            id: 'task-103',
            dayNumber: 2,
            subject: 'Mathematics',
            topic: 'Quadratic Equations & Discriminant Proofs',
            durationMinutes: 60,
            taskType: 'practice_quiz',
            completed: false,
          },
          {
            id: 'task-104',
            dayNumber: 2,
            subject: 'Chemistry',
            topic: 'Chemical Reactions & Balancing Equations',
            durationMinutes: 60,
            taskType: 'concept_video',
            completed: false,
          },
        ],
      },
    ];
  });

  // Listen to Firebase auth state changes & hydrate complete user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            setUser((prev) => ({
              ...prev,
              id: fbUser.uid,
              name: data.name || fbUser.displayName || prev.name,
              email: fbUser.email || prev.email,
              avatar: fbUser.photoURL || data.avatar || prev.avatar,
              role: (data.role as UserRole) || prev.role,
              educationLevel: (data.educationLevel as EducationLevel) || prev.educationLevel,
              streak: typeof data.streak === 'number' ? data.streak : prev.streak,
              xp: typeof data.xp === 'number' ? data.xp : prev.xp,
            }));
            if (data.role) setRoleState(data.role as UserRole);
            if (data.educationLevel) setEducationLevelState(data.educationLevel as EducationLevel);

            // Hydrate bookmarks
            if (Array.isArray(data.savedBookmarks)) {
              setBookmarks(data.savedBookmarks);
            }
            // Hydrate chat history
            if (Array.isArray(data.chatHistory) && data.chatHistory.length > 0) {
              setChatHistory(data.chatHistory);
            }
            // Hydrate downloaded courses (offline items)
            if (Array.isArray(data.downloadedCourses) && data.downloadedCourses.length > 0) {
              setOfflineItems(data.downloadedCourses);
            }
            // Hydrate study plans / learning progress
            if (data.learningProgress && Array.isArray(data.learningProgress.studyPlans)) {
              setStudyPlans(data.learningProgress.studyPlans);
            }
          } else {
            // First time login for this firebase user
            const newUserDoc = {
              id: fbUser.uid,
              name: fbUser.displayName || user.name || 'Kuppili Durga Rao',
              email: fbUser.email || 'kuppilidurgarao811@gmail.com',
              avatar: fbUser.photoURL || user.avatar,
              role: role || 'student',
              educationLevel: educationLevel || 'Degree (BSc, BCom, BA, BTech)',
              streak: user.streak || 12,
              xp: user.xp || 2850,
              savedBookmarks: bookmarks,
              chatHistory: chatHistory,
              downloadedCourses: offlineItems,
              learningProgress: {
                studyPlans: studyPlans,
              },
            };
            await setDoc(userDocRef, newUserDoc, { merge: true });
            setUser((prev) => ({ ...prev, ...newUserDoc }));
          }
        } catch (err) {
          console.warn('Firestore fetch user doc error:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync User Profile & Stats to Firestore
  useEffect(() => {
    localStorage.setItem('eduai_user', JSON.stringify({ ...user, role, educationLevel }));
    if (auth.currentUser) {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      setDoc(userDocRef, {
        id: auth.currentUser.uid,
        name: user.name,
        email: user.email,
        role: role,
        avatar: user.avatar,
        educationLevel: educationLevel,
        streak: user.streak,
        xp: user.xp,
        updatedAt: new Date().toISOString(),
      }, { merge: true }).catch(err => console.warn('Sync profile to firestore failed:', err));
    }
  }, [user, role, educationLevel]);

  // Sync Chat History to Firestore
  useEffect(() => {
    localStorage.setItem('eduai_chat_history', JSON.stringify(chatHistory));
    if (auth.currentUser) {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      setDoc(userDocRef, {
        chatHistory: chatHistory.slice(-50), // keep recent 50 messages in firestore
      }, { merge: true }).catch(err => console.warn('Sync chat history to firestore failed:', err));
    }
  }, [chatHistory]);

  // Sync Bookmarks to Firestore
  useEffect(() => {
    if (auth.currentUser) {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      setDoc(userDocRef, {
        savedBookmarks: bookmarks,
      }, { merge: true }).catch(err => console.warn('Sync bookmarks to firestore failed:', err));
    }
  }, [bookmarks]);

  // Sync Downloaded Courses (Offline Items) to Firestore
  useEffect(() => {
    localStorage.setItem('eduai_offline_items', JSON.stringify(offlineItems));
    if (auth.currentUser) {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      setDoc(userDocRef, {
        downloadedCourses: offlineItems,
      }, { merge: true }).catch(err => console.warn('Sync downloaded courses to firestore failed:', err));
    }
  }, [offlineItems]);

  // Sync Learning Progress & Study Plans to Firestore
  useEffect(() => {
    localStorage.setItem('eduai_study_plans', JSON.stringify(studyPlans));
    if (auth.currentUser) {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      setDoc(userDocRef, {
        learningProgress: {
          studyPlans: studyPlans,
          lastUpdated: new Date().toISOString(),
        }
      }, { merge: true }).catch(err => console.warn('Sync study plans to firestore failed:', err));
    }
  }, [studyPlans]);

  useEffect(() => {
    localStorage.setItem('eduai_theme_mode', themeMode);
    let isDark = false;
    if (themeMode === 'dark') {
      isDark = true;
    } else if (themeMode === 'light') {
      isDark = false;
    } else if (themeMode === 'system') {
      isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (isDark) {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
      localStorage.setItem('eduai_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
      localStorage.setItem('eduai_theme', 'light');
    }
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem('eduai_font_size', fontSize);
    let sizePx = '16px';
    if (fontSize === 'small') sizePx = '14px';
    if (fontSize === 'medium') sizePx = '16px';
    if (fontSize === 'large') sizePx = '18px';
    if (fontSize === 'xlarge') sizePx = '20px';
    document.documentElement.style.fontSize = sizePx;
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('eduai_privacy_settings', JSON.stringify(privacySettings));
  }, [privacySettings]);

  const toggleDarkMode = () => {
    setThemeModeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setThemeMode = (mode: 'light' | 'dark' | 'system') => {
    setThemeModeState(mode);
  };

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
  };

  const updatePrivacySettings = (updated: Partial<PrivacySettings>) => {
    setPrivacySettingsState((prev) => ({ ...prev, ...updated }));
  };

  const clearAllUserData = () => {
    setChatHistory([]);
    setNotifications([]);
    setBookmarks([]);
    localStorage.removeItem('eduai_chat_history');
    localStorage.removeItem('eduai_user');
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    setUser((prev) => ({
      ...prev,
      role: newRole,
      name:
        newRole === 'teacher'
          ? 'Prof. Kuppili Durga Rao'
          : newRole === 'parent'
          ? 'Kuppili Durga Rao (Parent)'
          : newRole === 'admin'
          ? 'EduAI Admin (Kuppili Durga Rao)'
          : 'Kuppili Durga Rao',
      email: prev.email || 'kuppilidurgarao811@gmail.com',
    }));
  };

  const setEducationLevel = (lvl: EducationLevel) => {
    setEducationLevelState(lvl);
    setUser((prev) => ({ ...prev, educationLevel: lvl }));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const addCourse = (course: Course) => {
    setCourses((prev) => [course, ...prev]);
  };

  const addChatMessage = (msg: ChatMessage) => {
    setChatHistory((prev) => [...prev, msg]);
  };

  const updateChatMessage = (id: string, newText: string) => {
    setChatHistory((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, text: newText } : msg))
    );
  };

  const deleteChatMessage = (id: string) => {
    setChatHistory((prev) => prev.filter((msg) => msg.id !== id));
  };

  const clearChatHistory = () => {
    setChatHistory([
      {
        id: 'c-fresh',
        role: 'model',
        text: 'Chat history cleared. How can EduAI assist your studies today?',
        timestamp: 'Just now',
      },
    ]);
  };

  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>(() => {
    const saved = localStorage.getItem('eduai_reminder_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      dailyStudyReminder: true,
      dailyStudyTime: '18:00',
      targetDailyMinutes: 30,
      quizReminders: true,
      quizAdvanceNoticeMins: 30,
      courseUpdates: true,
      soundAlerts: true,
    };
  });

  useEffect(() => {
    localStorage.setItem('eduai_reminder_settings', JSON.stringify(reminderSettings));
  }, [reminderSettings]);

  const updateReminderSettings = (newSettings: Partial<ReminderSettings>) => {
    setReminderSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const addNotification = (notif: Notification) => {
    setNotifications((prev) => [notif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(() => {
    return localStorage.getItem('eduai_is_offline_mode') === 'true';
  });

  const [forumPosts, setForumPosts] = useState<ForumPost[]>(() => {
    const saved = localStorage.getItem('eduai_forum_posts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_FORUM_POSTS;
  });

  const [managedUsers, setManagedUsers] = useState<ManagedUser[]>(() => {
    const saved = localStorage.getItem('eduai_managed_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_MANAGED_USERS;
  });

  const [showPremiumModal, setShowPremiumModal] = useState<boolean>(false);
  const [isPremium, setIsPremium] = useState<boolean>(() => {
    return localStorage.getItem('eduai_is_premium') === 'true';
  });
  const [subscriptionPlan, setSubscriptionPlan] = useState<'Free' | 'Pro Monthly' | 'Ultra Annual'>(() => {
    return (localStorage.getItem('eduai_sub_plan') as any) || 'Free';
  });

  const [dailyAiMessagesCount, setDailyAiMessagesCount] = useState<number>(() => {
    const saved = localStorage.getItem('eduai_ai_msg_count');
    return saved ? parseInt(saved, 10) : 3;
  });

  useEffect(() => {
    localStorage.setItem('eduai_is_offline_mode', isOfflineMode ? 'true' : 'false');
  }, [isOfflineMode]);

  useEffect(() => {
    localStorage.setItem('eduai_offline_items', JSON.stringify(offlineItems));
  }, [offlineItems]);

  useEffect(() => {
    localStorage.setItem('eduai_forum_posts', JSON.stringify(forumPosts));
  }, [forumPosts]);

  useEffect(() => {
    localStorage.setItem('eduai_managed_users', JSON.stringify(managedUsers));
  }, [managedUsers]);

  useEffect(() => {
    localStorage.setItem('eduai_is_premium', isPremium ? 'true' : 'false');
    localStorage.setItem('eduai_sub_plan', subscriptionPlan);
    setUser((prev) => ({
      ...prev,
      isPremium,
      subscriptionPlan,
      maxDailyAiMessages: isPremium ? 999999 : 10,
    }));
  }, [isPremium, subscriptionPlan]);

  useEffect(() => {
    localStorage.setItem('eduai_ai_msg_count', dailyAiMessagesCount.toString());
  }, [dailyAiMessagesCount]);

  useEffect(() => {
    localStorage.setItem('eduai_study_plans', JSON.stringify(studyPlans));
  }, [studyPlans]);

  const toggleOfflineMode = () => {
    setIsOfflineMode((prev) => !prev);
  };

  const downloadOfflineItem = (item: OfflineItem) => {
    setOfflineItems((prev) => {
      if (prev.some((existing) => existing.id === item.id)) {
        return prev;
      }
      return [item, ...prev];
    });
  };

  const removeOfflineItem = (id: string) => {
    setOfflineItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearOfflineVault = () => {
    setOfflineItems([]);
  };

  const addForumPost = (postData: Omit<ForumPost, 'id' | 'createdAt' | 'upvotes' | 'replies' | 'repliesCount' | 'authorName' | 'authorRole' | 'authorAvatar'>) => {
    const newPost: ForumPost = {
      ...postData,
      id: `post-${Date.now()}`,
      authorName: user.name,
      authorRole: user.role,
      authorAvatar: user.avatar,
      createdAt: 'Just now',
      upvotes: 0,
      repliesCount: 0,
      replies: [],
    };
    setForumPosts((prev) => [newPost, ...prev]);
    addXp(15);
  };

  const addForumReply = (postId: string, content: string) => {
    const newReply: ForumReply = {
      id: `reply-${Date.now()}`,
      authorName: user.name,
      authorRole: user.role,
      authorAvatar: user.avatar,
      content,
      createdAt: 'Just now',
      upvotes: 0,
    };

    setForumPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            repliesCount: post.repliesCount + 1,
            replies: [...post.replies, newReply],
          };
        }
        return post;
      })
    );
    addXp(10);
  };

  const toggleUpvotePost = (postId: string) => {
    setForumPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isUpvoted = post.userUpvoted;
          return {
            ...post,
            userUpvoted: !isUpvoted,
            upvotes: isUpvoted ? post.upvotes - 1 : post.upvotes + 1,
          };
        }
        return post;
      })
    );
  };

  const toggleUpvoteReply = (postId: string, replyId: string) => {
    setForumPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            replies: post.replies.map((reply) => {
              if (reply.id === replyId) {
                const isUpvoted = reply.userUpvoted;
                return {
                  ...reply,
                  userUpvoted: !isUpvoted,
                  upvotes: isUpvoted ? reply.upvotes - 1 : reply.upvotes + 1,
                };
              }
              return reply;
            }),
          };
        }
        return post;
      })
    );
  };

  const askAiDoubt = (title: string, doubtContent: string, subject: string, level: EducationLevel) => {
    const aiAnswerText = `🤖 **EduAI Tutor Verification**: Regarding "${title}" in ${subject} (${level}):\n\n1. **Core Concept**: ${doubtContent.slice(0, 100)}...\n2. **Step-by-Step Logic**: Standard curriculum proofs and methods apply for ${level}.\n3. **Recommended Action**: Review relevant textbook notes or practice mock test questions in EduAI.`;

    const aiReply: ForumReply = {
      id: `reply-ai-${Date.now()}`,
      authorName: 'EduAI Tutor',
      authorRole: 'AI Tutor',
      authorAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      content: aiAnswerText,
      createdAt: 'Just now',
      upvotes: 5,
      isAcceptedAnswer: true,
    };

    const doubtPost: ForumPost = {
      id: `post-doubt-${Date.now()}`,
      authorName: user.name,
      authorRole: user.role,
      authorAvatar: user.avatar,
      title,
      content: doubtContent,
      subject,
      educationLevel: level,
      category: 'doubt',
      createdAt: 'Just now',
      upvotes: 1,
      userUpvoted: true,
      tags: ['Doubt', subject, level, 'AI Resolved'],
      repliesCount: 1,
      isAiResolved: true,
      aiAnswer: aiAnswerText,
      replies: [aiReply],
    };

    setForumPosts((prev) => [doubtPost, ...prev]);
    addXp(20);
  };

  const addManagedUser = (userData: Omit<ManagedUser, 'id' | 'joinedDate' | 'lastActive' | 'coursesEnrolled'>) => {
    const newUser: ManagedUser = {
      ...userData,
      id: `usr-${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: 'Just now',
      coursesEnrolled: 1,
    };
    setManagedUsers((prev) => [newUser, ...prev]);
  };

  const updateManagedUser = (id: string, updates: Partial<ManagedUser>) => {
    setManagedUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates } : u))
    );
  };

  const deleteManagedUser = (id: string) => {
    setManagedUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const deleteCourse = (courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
  };

  const addModuleToCourse = (courseId: string, module: CourseModule) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const isVideo = module.type === 'video';
          const isPdf = module.type === 'pdf';
          return {
            ...c,
            modules: [...c.modules, module],
            videoCount: isVideo ? c.videoCount + 1 : c.videoCount,
            pdfCount: isPdf ? c.pdfCount + 1 : c.pdfCount,
          };
        }
        return c;
      })
    );
  };

  const broadcastNotification = (notifData: {
    title: string;
    message: string;
    type: NotificationType;
    category?: string;
    targetRole?: UserRole | 'all';
    targetLevel?: EducationLevel | 'all';
  }) => {
    const newNotif: Notification = {
      id: `notif-broadcast-${Date.now()}`,
      title: notifData.title,
      message: notifData.message,
      date: 'Just now',
      read: false,
      type: notifData.type,
      category: notifData.category || 'Broadcast Alert',
      actionTab: 'courses',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const upgradeToPremium = (planName: 'Pro Monthly' | 'Ultra Annual' = 'Pro Monthly') => {
    setIsPremium(true);
    setSubscriptionPlan(planName);
    setShowPremiumModal(false);
    
    // Dispatch celebration notification
    const newNotif: Notification = {
      id: `notif-premium-${Date.now()}`,
      title: '👑 Welcome to EduAI Premium!',
      message: `Your ${planName} subscription is active! Enjoy Unlimited AI Chat, Advanced Explanations, Personalized Study Plans, and an Ad-Free experience.`,
      date: 'Just now',
      read: false,
      type: 'success',
      category: 'Subscription Upgrade',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const cancelPremium = () => {
    setIsPremium(false);
    setSubscriptionPlan('Free');
  };

  const incrementAiMessageCount = (): boolean => {
    if (isPremium) return true; // Unlimited for premium
    if (dailyAiMessagesCount >= 10) {
      setShowPremiumModal(true); // Open upgrade modal if cap reached
      return false;
    }
    setDailyAiMessagesCount((prev) => prev + 1);
    return true;
  };

  const addStudyPlan = (newPlan: StudyPlan) => {
    setStudyPlans((prev) => [newPlan, ...prev]);
  };

  const toggleStudyTaskComplete = (planId: string, taskId: string) => {
    setStudyPlans((prev) =>
      prev.map((plan) => {
        if (plan.id === planId) {
          const updatedTasks = plan.tasks.map((t) =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
          );
          const completedCount = updatedTasks.filter((t) => t.completed).length;
          const overallProgressPercent = Math.round((completedCount / updatedTasks.length) * 100);
          return {
            ...plan,
            tasks: updatedTasks,
            overallProgressPercent,
          };
        }
        return plan;
      })
    );
  };

  const deleteStudyPlan = (planId: string) => {
    setStudyPlans((prev) => prev.filter((p) => p.id !== planId));
  };

  const addXp = (amount: number) => {
    setUser((prev) => ({ ...prev, xp: prev.xp + amount }));
  };

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const login = (email: string, targetRole: UserRole, customName?: string) => {
    const formattedName = customName
      ? customName
      : email === 'kuppilidurgarao811@gmail.com'
      ? 'Kuppili Durga Rao'
      : email.split('@')[0];

    setUser((prev) => ({
      ...prev,
      email,
      role: targetRole,
      name: formattedName,
    }));
    setRoleState(targetRole);
    setShowAuthModal(false);
  };

  const loginWithFirebase = async (email: string, pass: string, targetRole: UserRole) => {
    setAuthError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      setRoleState(targetRole);
      setShowAuthModal(false);
      // Sync user profile in Firestore
      if (cred.user) {
        const userRef = doc(db, 'users', cred.user.uid);
        await setDoc(
          userRef,
          {
            id: cred.user.uid,
            email: cred.user.email,
            role: targetRole,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      }
    } catch (err: any) {
      setAuthError(err.message || 'Firebase sign-in failed.');
      throw err;
    }
  };

  const registerWithFirebase = async (
    email: string,
    pass: string,
    name: string,
    targetRole: UserRole
  ) => {
    setAuthError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      setRoleState(targetRole);
      setShowAuthModal(false);
      if (cred.user) {
        const userRef = doc(db, 'users', cred.user.uid);
        const newUser: User = {
          ...DEFAULT_USER,
          id: cred.user.uid,
          name: name || 'Kuppili Durga Rao',
          email: email,
          role: targetRole,
        };
        await setDoc(userRef, newUser);
        setUser(newUser);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Firebase registration failed.');
      throw err;
    }
  };

  const signInWithGoogle = async (targetRole: UserRole) => {
    setAuthError(null);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        setRoleState(targetRole);
        setShowAuthModal(false);
        const userRef = doc(db, 'users', res.user.uid);
        const userData = {
          id: res.user.uid,
          name: res.user.displayName || 'Kuppili Durga Rao',
          email: res.user.email || 'kuppilidurgarao811@gmail.com',
          avatar: res.user.photoURL || DEFAULT_USER.avatar,
          role: targetRole,
        };
        await setDoc(userRef, userData, { merge: true });
        setUser((prev) => ({ ...prev, ...userData }));
      }
    } catch (err: any) {
      setAuthError(err.message || 'Google authentication failed.');
      throw err;
    }
  };

  const sendPasswordReset = async (email: string) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      setAuthError(err.message || 'Password reset request failed.');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Firebase signout error:', e);
    }
    setUser(DEFAULT_USER);
    setRoleState('student');
    setShowAuthModal(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        updateUser,
        role,
        setRole,
        educationLevel,
        setEducationLevel,
        language,
        setLanguage,
        darkMode,
        toggleDarkMode,
        themeMode,
        setThemeMode,
        fontSize,
        setFontSize,
        privacySettings,
        updatePrivacySettings,
        clearAllUserData,
        activeTab,
        setActiveTab,
        courses,
        addCourse,
        tests,
        chatHistory,
        addChatMessage,
        updateChatMessage,
        deleteChatMessage,
        clearChatHistory,
        notifications,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        clearAllNotifications,
        reminderSettings,
        updateReminderSettings,
        offlineItems,
        isOfflineMode,
        toggleOfflineMode,
        downloadOfflineItem,
        removeOfflineItem,
        clearOfflineVault,
        addXp,
        bookmarks,
        toggleBookmark,
        showAuthModal,
        setShowAuthModal,
        login,
        loginWithFirebase,
        registerWithFirebase,
        signInWithGoogle,
        sendPasswordReset,
        authError,
        setAuthError,
        logout,
        searchTerm,
        setSearchTerm,
        forumPosts,
        addForumPost,
        addForumReply,
        toggleUpvotePost,
        toggleUpvoteReply,
        askAiDoubt,
        managedUsers,
        addManagedUser,
        updateManagedUser,
        deleteManagedUser,
        deleteCourse,
        addModuleToCourse,
        broadcastNotification,
        isPremium,
        subscriptionPlan,
        showPremiumModal,
        setShowPremiumModal,
        upgradeToPremium,
        cancelPremium,
        dailyAiMessagesCount,
        incrementAiMessageCount,
        studyPlans,
        addStudyPlan,
        toggleStudyTaskComplete,
        deleteStudyPlan,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
