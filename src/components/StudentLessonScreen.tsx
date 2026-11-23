import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Video,
  FileText,
  Volume2,
  VolumeX,
  Bot,
  HelpCircle,
  CheckCircle2,
  Check,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Download,
  Share2,
  ChevronRight,
  ChevronDown,
  Layers,
  Award,
  Clock,
  ArrowRight,
  Send,
  Zap,
  ExternalLink,
  Flame,
  ThumbsUp,
  Bookmark,
  Languages,
  BarChart3,
  Globe,
  Mic,
  Camera,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  auth,
  db,
  callCloudFunction,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
} from '../lib/firebase';
import { LessonAiAssistant } from './LessonAiAssistant';

interface LessonData {
  id: string;
  subjectId?: string;
  chapterId?: string;
  title: string;
  subject: string;
  chapter: string;
  level: string;
  duration: string;
  summary: string;
  content: string[];
  equation: {
    formula: string;
    description: string;
    variables: { symbol: string; meaning: string }[];
  };
  video: {
    title: string;
    duration: string;
    url: string;
    timestamps: { time: string; label: string }[];
  };
  pdf: {
    title: string;
    pages: number;
    size: string;
    sections: string[];
  };
  pdfUrl?: string;
  audioExplanation: {
    englishText: string;
    teluguText: string;
  };
  quiz: {
    id: string;
    title: string;
    passingScore: number;
    questions: {
      id: string;
      question: string;
      options: { key: 'A' | 'B' | 'C' | 'D'; text: string }[];
      correctAnswer: 'A' | 'B' | 'C' | 'D';
      explanation: string;
    }[];
  };
}

const LESSON_DATABASE: Record<string, LessonData> = {
  'simple-linear-regression': {
    id: 'simple-linear-regression',
    subjectId: 'machine-learning',
    chapterId: 'chapter-1',
    title: 'Simple Linear Regression',
    subject: 'Machine Learning & Statistics',
    chapter: 'Linear Models',
    level: 'Degree (BTech / BSc)',
    duration: '25 Mins',
    summary:
      'Linear regression is a supervised learning technique used to model and quantify the linear relationship between a continuous predictor feature (X) and an outcome variable (Y).',
    content: [
      'Linear regression is a supervised learning technique used to summarize and study relationships between two continuous quantitative variables. In Simple Linear Regression, we model the relationship between a single independent variable (X) and a dependent target variable (Y).',
      'The primary objective is to find the best-fitting straight line through the observed data points—known as the "Line of Best Fit" or regression line. This line allows us to make reliable quantitative predictions for unseen data.',
      'We find the optimal line parameters by minimizing the distance between the actual observed values and our predicted line. This optimization criterion is called Ordinary Least Squares (OLS), which minimizes the sum of squared residuals (SSR).',
    ],
    equation: {
      formula: 'Y = β₀ + β₁X + ε   (or  y = mx + c)',
      description: 'The standard algebraic formulation of simple linear regression:',
      variables: [
        { symbol: 'Y (or y)', meaning: 'Dependent / Response variable (the continuous value to predict)' },
        { symbol: 'X (or x)', meaning: 'Independent / Predictor variable (the input feature)' },
        { symbol: 'β₁ (or m)', meaning: 'Slope coefficient (rate of change in Y for every 1-unit increase in X)' },
        { symbol: 'β₀ (or c)', meaning: 'Y-Intercept (the expected value of Y when X equals zero)' },
        { symbol: 'ε', meaning: 'Random error / Residual term (unexplained variance)' },
      ],
    },
    video: {
      title: 'Simple Linear Regression - Intuition, Math & Code',
      duration: '22:15 mins',
      url: 'https://www.youtube.com/embed/7ArmBVF2dCs',
      timestamps: [
        { time: '00:00', label: 'Introduction & Real-World Intuition' },
        { time: '05:20', label: 'Scatter Plots & The Line of Best Fit' },
        { time: '11:45', label: 'Ordinary Least Squares (OLS) Derivation' },
        { time: '17:30', label: 'R-Squared Score & Residual Diagnostics' },
      ],
    },
    pdf: {
      title: 'Simple_Linear_Regression_Master_Handbook.pdf',
      pages: 4,
      size: '3.2 MB',
      sections: [
        'Page 1: Concept Mindmap & Derivation of Slope (m) and Intercept (c)',
        'Page 2: Comprehensive Formula Cheat Sheet (SSR, SSE, SST, and R²)',
        'Page 3: Step-by-Step Solved Textbook Numerical Problems',
        'Page 4: Top 10 University & Technical Interview Questions',
      ],
    },
    audioExplanation: {
      englishText:
        'Linear regression is a fundamental supervised machine learning technique. It models the relationship between an independent variable X and a dependent variable Y using the linear equation y equals m x plus c. Here, m represents the slope or gradient of the line, while c represents the y-intercept. We optimize this line using Ordinary Least Squares, minimizing the squared vertical distances between the actual data points and the regression line.',
      teluguText:
        'సింపుల్ లీనియర్ రిగ్రెషన్ అనేది మెషిన్ లెర్నింగ్ లో ఒక ముఖ్యమైన పద్ధతి. ఇందులో స్వతంత్ర వేరియబుల్ X మరియు ఆధారపడే వేరియబుల్ Y మధ్య గల సంబంధాన్ని y = mx + c సూత్రం ద్వారా అంచనా వేస్తాము. ఇక్కడ m అంటే లైన్ యొక్క వాలు (Slope), మరియు c అంటే Y-ఇంటర్‌సెప్ట్. ఆర్డినరీ లీస్ట్ స్క్వేర్స్ (OLS) ద్వారా వాస్తవ పాయింట్లు మరియు లైన్ మధ్య ఉన్న వ్యత్యాసాన్ని తగ్గించి ఉత్తమ లైన్‌ను గుర్తిస్తాము.',
    },
    quiz: {
      id: 'quiz_slr_1',
      title: 'Simple Linear Regression Assessment',
      passingScore: 70,
      questions: [
        {
          id: 'q1',
          question: 'What is the primary objective of regression analysis?',
          options: [
            { key: 'A', text: 'Classification into discrete categorical labels' },
            { key: 'B', text: 'Prediction of continuous numerical target values' },
            { key: 'C', text: 'Unsupervised clustering of multi-dimensional points' },
            { key: 'D', text: 'Lexical sorting and indexing of database records' },
          ],
          correctAnswer: 'B',
          explanation:
            'Regression models estimate the quantitative relationship between predictors and continuous numeric outcome targets.',
        },
        {
          id: 'q2',
          question: 'In the simple linear regression formula y = mx + c, what does "m" represent?',
          options: [
            { key: 'A', text: 'The Y-intercept where the line crosses the axis' },
            { key: 'B', text: 'The dependent variable to be forecasted' },
            { key: 'C', text: 'The slope or gradient of the regression line' },
            { key: 'D', text: 'The residual variance and random error' },
          ],
          correctAnswer: 'C',
          explanation:
            'In slope-intercept form, m represents the slope (change in Y divided by change in X).',
        },
        {
          id: 'q3',
          question: 'Which optimization criterion is minimized to obtain the line of best fit?',
          options: [
            { key: 'A', text: 'Ordinary Least Squares (minimizing sum of squared residuals)' },
            { key: 'B', text: 'Maximum entropy thresholding' },
            { key: 'C', text: 'Binary cross-entropy loss' },
            { key: 'D', text: 'Gini impurity index' },
          ],
          correctAnswer: 'A',
          explanation:
            'Ordinary Least Squares (OLS) minimizes the sum of squared differences between observed values and predictions.',
        },
        {
          id: 'q4',
          question: 'What does a coefficient of determination (R²) value of 0.85 indicate?',
          options: [
            { key: 'A', text: 'The model has an error margin of 85%' },
            { key: 'B', text: '85% of variance in the dependent variable is explained by the model' },
            { key: 'C', text: 'The slope of the regression line is 0.85 degrees' },
            { key: 'D', text: 'Only 15% of the data points are valid' },
          ],
          correctAnswer: 'B',
          explanation:
            'R² indicates the proportion of the total variance in the dependent variable explained by the independent variable.',
        },
      ],
    },
  },
};

export const StudentLessonScreen: React.FC = () => {
  const { user, addXp, addNotification, downloadOfflineItem, setActiveTab } = useAuth();

  // Active Lesson state (defaults to Simple Linear Regression)
  const [currentLessonKey, setCurrentLessonKey] = useState<string>('simple-linear-regression');
  const lesson = LESSON_DATABASE[currentLessonKey] || LESSON_DATABASE['simple-linear-regression'];

  // Completion State
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  // Active Interactive Panels (Toggleable sections)
  const [activeSection, setActiveSection] = useState<'video' | 'pdf' | 'audio' | 'ai' | 'quiz' | null>(null);

  // Video State
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [videoSpeed, setVideoSpeed] = useState<number>(1);

  // Audio / Speech State
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [audioLanguage, setAudioLanguage] = useState<'en' | 'te'>('en');
  const [speechRate, setSpeechRate] = useState<number>(1);

  // Interactive Equation Slider Simulation
  const [simSlope, setSimSlope] = useState<number>(2.5);
  const [simIntercept, setSimIntercept] = useState<number>(10);
  const [simInputX, setSimInputX] = useState<number>(5);

  // 12. AI Integration Action Trigger
  const [aiAssistantAction, setAiAssistantAction] = useState<
    'explain' | 'translate' | 'notes' | 'questions' | 'voice' | 'image' | null
  >(null);

  // AI Q&A State
  const [aiQuestion, setAiQuestion] = useState<string>('');
  const [aiChat, setAiChat] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    {
      sender: 'ai',
      text: `Hello ${user.name || 'Student'}! I am your AI Tutor for **${lesson.title}**. Ask me any doubt about slopes, intercepts, residuals, or exam derivations!`,
    },
  ]);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);
  const [quizSavedToCloud, setQuizSavedToCloud] = useState<boolean>(false);
  const [firestoreQuiz, setFirestoreQuiz] = useState<
    (LessonData['quiz'] & {
      subjectId?: string;
      chapterId?: string;
      totalMarks?: number;
      passMarks?: number;
      marksByQuestionId?: Record<string, number>;
    }) | null
  >(null);
  const [unlockedAnswerKeys, setUnlockedAnswerKeys] = useState<
    Record<string, { correctAnswer: 'A' | 'B' | 'C' | 'D'; explanation: string }>
  >({});

  // Load published & active quiz from Firestore if attached to this lesson (NO answer keys fetched here)
  useEffect(() => {
    const loadPublishedQuiz = async () => {
      if (!auth.currentUser) {
        setFirestoreQuiz(null);
        setUnlockedAnswerKeys({});
        return;
      }
      try {
        const candidateLessonIds =
          lesson.id === 'simple-linear-regression'
            ? [lesson.id, 'LES001', 'les_ml_simple_linear_regression']
            : [lesson.id];
        const qSnap = await getDocs(
          query(
            collection(db, 'quizzes'),
            where('isPublished', '==', true),
            where('isActive', '==', true),
            where('lessonId', 'in', candidateLessonIds)
          )
        );
        if (qSnap.empty) {
          setFirestoreQuiz(null);
          return;
        }
        const quizDoc = qSnap.docs[0];
        const qData = quizDoc.data();
        const questionsSnap = await getDocs(
          query(collection(db, 'quizzes', quizDoc.id, 'questions'), orderBy('order', 'asc'))
        );
        if (questionsSnap.empty) {
          setFirestoreQuiz(null);
          return;
        }
        const optKeys: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
        const marksByQuestionId: Record<string, number> = {};
        let computedTotalMarks = 0;

        const loadedQs = questionsSnap.docs
          .map((d) => {
            const raw = d.data();
            const rawOpts = Array.isArray(raw.options) ? raw.options.map(String) : [];
            const opts: { key: 'A' | 'B' | 'C' | 'D'; text: string }[] = rawOpts
              .slice(0, 4)
              .map((text, idx) => ({
                key: optKeys[idx] || 'A',
                text,
              }));
            const qMarks = typeof raw.marks === 'number' && raw.marks > 0 ? raw.marks : 1;
            marksByQuestionId[d.id] = qMarks;
            computedTotalMarks += qMarks;
            return {
              order: typeof raw.order === 'number' ? raw.order : 999,
              id: d.id,
              question: raw.questionText || '',
              options: opts,
              // Intentionally empty placeholder until unlocked post-submission from answerKeys
              correctAnswer: 'A' as 'A' | 'B' | 'C' | 'D',
              explanation: '',
            };
          })
          .sort((a, b) => a.order - b.order)
          .map(({ order: _o, ...rest }) => rest);

        const totalMarks =
          typeof qData.totalMarks === 'number' && qData.totalMarks > 0
            ? qData.totalMarks
            : computedTotalMarks;
        const passMarks = typeof qData.passMarks === 'number' ? qData.passMarks : Math.ceil(totalMarks * 0.7);
        const derivedPassingPct =
          typeof qData.passingScore === 'number'
            ? qData.passingScore
            : totalMarks > 0
            ? Math.round((passMarks / totalMarks) * 100)
            : 70;

        setUnlockedAnswerKeys({});
        setFirestoreQuiz({
          id: quizDoc.id,
          subjectId: qData.subjectId || lesson.subjectId || 'ML001',
          chapterId: qData.chapterId || lesson.chapterId || 'CH001',
          title: qData.title || lesson.quiz.title,
          passingScore: derivedPassingPct,
          totalMarks,
          passMarks,
          marksByQuestionId,
          questions: loadedQs,
        });
      } catch {
        setFirestoreQuiz(null);
      }
    };
    loadPublishedQuiz();
  }, [lesson.id, lesson.subjectId, lesson.chapterId, lesson.quiz.title]);

  const activeQuiz = firestoreQuiz || lesson.quiz;

  // Load completion status from Firestore or LocalStorage
  useEffect(() => {
    const checkCompletion = async () => {
      try {
        const localStatus = localStorage.getItem(`lesson_complete_${lesson.id}`);
        if (localStatus === 'true') {
          setIsCompleted(true);
        }

        if (user?.id) {
          // Check progress collection first
          const progressDocRef = doc(db, 'progress', `${user.id}_${lesson.id}`);
          const snap = await getDoc(progressDocRef);
          if (snap.exists() && snap.data()?.completed) {
            setIsCompleted(true);
          } else {
            // Fallback to user_progress
            const userDocRef = doc(db, 'user_progress', `${user.id}_${lesson.id}`);
            const userSnap = await getDoc(userDocRef);
            if (userSnap.exists() && userSnap.data()?.completed) {
              setIsCompleted(true);
            }
          }
        }
      } catch (e) {
        console.warn('Could not read lesson completion:', e);
      }
    };
    checkCompletion();
  }, [lesson.id, user?.id]);

  // Handle Mark Complete toggle - writes to Firestore progress collection:
  // progress
  //  └── progressId
  //       ├── userId
  //       ├── subjectId
  //       ├── chapterId
  //       ├── lessonId
  //       ├── completed
  //       ├── percentage
  //       └── completedAt
  const handleToggleComplete = async () => {
    const nextState = !isCompleted;
    setIsCompleted(nextState);

    try {
      localStorage.setItem(`lesson_complete_${lesson.id}`, String(nextState));

      if (user?.id) {
        const progressId = `${user.id}_${lesson.id}`;
        const nowIso = nextState ? new Date().toISOString() : null;

        // 1. Primary Firestore progress collection matching user specification
        await setDoc(
          doc(db, 'progress', progressId),
          {
            userId: user.id,
            subjectId: lesson.subjectId || 'machine-learning',
            chapterId: lesson.chapterId || 'chapter-1',
            lessonId: lesson.id,
            completed: nextState,
            percentage: nextState ? 100 : 0,
            completedAt: nowIso,
          },
          { merge: true }
        );

        // 2. Auxiliary user_progress for backwards compatibility
        await setDoc(
          doc(db, 'user_progress', progressId),
          {
            userId: user.id,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            completed: nextState,
            completedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }

      if (nextState) {
        // Award XP and show celebration
        addXp(50);
        setShowCelebration(true);
        addNotification({
          id: `notif-comp-${Date.now()}`,
          title: '🎓 Lesson Completed!',
          message: `Congratulations! You completed "${lesson.title}" and earned +50 XP. Check progress in 11. Student Progress.`,
          timestamp: 'Just now',
          read: false,
          type: 'achievement',
        });
        setTimeout(() => setShowCelebration(false), 6000);
      }
    } catch (err) {
      console.error('Failed to update lesson completion:', err);
    }
  };

  // Audio Speech Synthesis
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const textToSpeak =
        audioLanguage === 'te'
          ? lesson.audioExplanation.teluguText
          : lesson.audioExplanation.englishText;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = speechRate;
      utterance.lang = audioLanguage === 'te' ? 'te-IN' : 'en-US';

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Stop speaking when component unmounts
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // AI Question Handler
  const handleSendAiQuestion = (customPrompt?: string) => {
    const query = customPrompt || aiQuestion;
    if (!query.trim()) return;

    const userMessage = { sender: 'user' as const, text: query };
    setAiChat((prev) => [...prev, userMessage]);
    setAiQuestion('');
    setIsAiThinking(true);

    setTimeout(() => {
      let replyText = '';
      const lower = query.toLowerCase();

      if (lower.includes('slope') || lower.includes('beta 1') || lower.includes('m')) {
        replyText = `**Slope (β₁ or m)** measures how steeply the regression line rises or falls. Formula: \n$$m = \\frac{\\sum (X - \\bar{X})(Y - \\bar{Y})}{\\sum (X - \\bar{X})^2}$$\nIn plain terms, if slope $m = 2.5$, it means for every 1-hour increase in study time ($X$), the exam score ($Y$) increases by 2.5 marks!`;
      } else if (lower.includes('intercept') || lower.includes('beta 0') || lower.includes('c')) {
        replyText = `**Y-Intercept (β₀ or c)** represents the predicted value of $Y$ when $X = 0$. Formula: \n$$c = \\bar{Y} - m\\bar{X}$$\nFor instance, if study hours $X = 0$, the baseline score might be $c = 10$ marks.`;
      } else if (lower.includes('residual') || lower.includes('ols') || lower.includes('least square')) {
        replyText = `**Residuals ($e_i$)** are the vertical errors: actual value minus predicted value ($y_i - \\hat{y}_i$). **Ordinary Least Squares (OLS)** squares each residual and finds the exact line parameters that minimize this total squared error!`;
      } else if (lower.includes('r2') || lower.includes('r squared') || lower.includes('determination')) {
        replyText = `**R² (Coefficient of Determination)** ranges between 0.0 and 1.0. An $R^2 = 0.85$ indicates that **85% of the variation** in the outcome variable is successfully explained by our linear predictor!`;
      } else if (lower.includes('telugu') || lower.includes('తెలుగు')) {
        replyText = `**లీనియర్ రిగ్రెషన్ వివరణ:**\n$y = mx + c$ సమీకరణంలో $m$ అనేది వాలు (Slope) మరియు $c$ అనేది Y-ఇంటర్‌సెప్ట్. డేటా పాయింట్లకు సరిపోయే అత్యుత్తమ రేఖను (Best Fit Line) గుర్తించడానికి OLS పద్ధతిని ఉపయోగిస్తారు.`;
      } else {
        replyText = `In **${lesson.title}**, we predict $Y$ from $X$ using the linear equation $Y = \\beta_0 + \\beta_1 X$. Every point $(x_i, y_i)$ contributes to minimizing the sum of squared errors. Is there a specific formula, code snippet, or textbook problem you want me to solve?`;
      }

      setAiChat((prev) => [...prev, { sender: 'ai', text: replyText }]);
      setIsAiThinking(false);
    }, 650);
  };

  // Quiz Grading via trusted `submitEduAIQuiz` Cloud Function (never reads answerKeys on client)
  const handleGradeQuiz = async () => {
    const keyToIndex: Record<'A' | 'B' | 'C' | 'D', number> = { A: 0, B: 1, C: 2, D: 3 };

    if (firestoreQuiz && auth.currentUser) {
      const answerList = activeQuiz.questions
        .filter((q) => Boolean(selectedAnswers[q.id]))
        .map((q) => ({
          questionId: q.id,
          selectedOptionIndex: keyToIndex[selectedAnswers[q.id]],
        }));

      if (answerList.length !== activeQuiz.questions.length) {
        return;
      }

      try {
        const data = await callCloudFunction<
          { quizId: string; answers: { questionId: string; selectedOptionIndex: number }[] },
          { attemptId: string; score: number; totalMarks: number; percentage: number; passed: boolean }
        >('submitEduAIQuiz', {
          quizId: firestoreQuiz.id,
          answers: answerList,
        });
        const earnedScore = Number(data?.score) || 0;
        const totalMarks = Number(data?.totalMarks) || firestoreQuiz.totalMarks || 0;
        const percentage = Math.round(Number(data?.percentage) || 0);
        const passed = Boolean(data?.passed);

        setUnlockedAnswerKeys({});
        setQuizScore(percentage);
        setIsQuizSubmitted(true);
        setQuizSavedToCloud(true);

        if (passed) {
          addXp(30);
          addNotification({
            id: `notif-quiz-${Date.now()}`,
            title: 'Quiz Passed',
            message: `You passed "${activeQuiz.title}" with ${earnedScore}/${totalMarks} marks (${percentage}%). (+30 XP)`,
            timestamp: 'Just now',
            read: false,
            type: 'achievement',
          });
        }
        return;
      } catch {
        setQuizSavedToCloud(false);
        return;
      }
    }

    // Local built-in demo quiz fallback (when no Firestore quiz is attached)
    let correctCount = 0;
    activeQuiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const totalQuestions = activeQuiz.questions.length;
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = percentage >= activeQuiz.passingScore;
    setQuizScore(percentage);
    setIsQuizSubmitted(true);
    setQuizSavedToCloud(false);

    if (passed) {
      addXp(30);
      addNotification({
        id: `notif-quiz-${Date.now()}`,
        title: 'Quiz Passed',
        message: `You passed "${activeQuiz.title}" with ${percentage}% score. (+30 XP)`,
        timestamp: 'Just now',
        read: false,
        type: 'achievement',
      });
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setQuizScore(null);
    setIsQuizSubmitted(false);
    setQuizSavedToCloud(false);
    setUnlockedAnswerKeys({});
  };

  // Calculated simulation value
  const simY = (simSlope * simInputX + simIntercept).toFixed(2);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-24 px-3 sm:px-4">
      {/* Celebration Banner when completed */}
      {showCelebration && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-bounce">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl">
              🎉
            </div>
            <div>
              <h4 className="text-sm font-black">Lesson Mastered! +50 XP Awarded</h4>
              <p className="text-xs text-emerald-100">
                You have successfully completed &quot;{lesson.title}&quot;!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('student-progress')}
              className="text-xs font-black px-3.5 py-1.5 rounded-xl bg-amber-400 text-slate-950 hover:bg-amber-300 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>View 11. Student Progress</span>
            </button>
            <button
              type="button"
              onClick={() => setShowCelebration(false)}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* TOP NAVIGATION / BREADCRUMB */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800 dark:text-slate-200">{lesson.subject}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span>{lesson.chapter}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-indigo-600 dark:text-indigo-400">Lesson 1</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('student-progress')}
            className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-black text-[11px] flex items-center gap-1 border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer"
          >
            <BarChart3 className="w-3 h-3" />
            <span>11. Student Progress</span>
          </button>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold text-[11px] flex items-center gap-1">
            <Clock className="w-3 h-3" /> {lesson.duration}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-[11px]">
            {lesson.level}
          </span>
        </div>
      </div>

      {/* 
        ╔══════════════════════════════════╗
        ║ Simple Linear Regression         ║
        ╠══════════════════════════════════╣
      */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Header: Title */}
        <div className="p-6 md:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white border-b border-indigo-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-black text-[10px] uppercase tracking-wider">
                10. Student Lesson Screen
              </span>
              {isCompleted && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-black text-[10px] flex items-center gap-1">
                  <Check className="w-3 h-3" /> Completed
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">{lesson.title}</h1>
            <p className="text-xs text-indigo-200/80 max-w-xl leading-relaxed">{lesson.summary}</p>
          </div>

          {/* Quick status pill */}
          <div className="self-start sm:self-auto flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleToggleComplete}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 border ${
                isCompleted
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{isCompleted ? '✓ Completed' : 'Mark Complete'}</span>
            </button>
          </div>
        </div>

        {/* 
          ║                                  ║
          ║ 📖 Lesson                        ║
          ║                                  ║
          ║ Linear regression is a supervised║
          ║ learning technique used to...    ║
          ║                                  ║
        */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
              <span className="text-lg">📖</span> Lesson
            </h2>
            <span className="text-xs font-bold text-slate-400">Core Curriculum Text</span>
          </div>

          {/* Educational Content Paragraphs */}
          <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            {lesson.content.map((paragraph, idx) => (
              <p key={idx} className="text-justify">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Mathematical Formulation Card */}
          <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-indigo-900 dark:text-indigo-300 tracking-wider">
                Mathematical Model Formulation
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-mono">
                Slope-Intercept Form
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 text-center shadow-inner border border-indigo-100 dark:border-indigo-900">
              <span className="text-lg md:text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono tracking-wide">
                {lesson.equation.formula}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {lesson.equation.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
              {lesson.equation.variables.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-indigo-100 dark:border-indigo-900 flex items-start gap-2"
                >
                  <span className="font-mono font-black text-indigo-700 dark:text-indigo-300 shrink-0">
                    {item.symbol}:
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 text-[11px] leading-snug">
                    {item.meaning}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Equation Playground (Adjust Slope & Intercept) */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Interactive Linear Model Simulator
                </h4>
              </div>
              <span className="text-[11px] font-mono font-black text-purple-600 dark:text-purple-400">
                y = ({simSlope}) · ({simInputX}) + {simIntercept} = {simY}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  <span>Slope (m)</span>
                  <span className="font-mono text-indigo-600">{simSlope}</span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="10"
                  step="0.5"
                  value={simSlope}
                  onChange={(e) => setSimSlope(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  <span>Y-Intercept (c)</span>
                  <span className="font-mono text-indigo-600">{simIntercept}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={simIntercept}
                  onChange={(e) => setSimIntercept(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  <span>Input Feature (X)</span>
                  <span className="font-mono text-indigo-600">{simInputX}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  value={simInputX}
                  onChange={(e) => setSimInputX(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">
                Target Outcome Prediction (<strong className="text-indigo-600 dark:text-indigo-400">Y</strong>):
              </span>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {simY} Units
              </span>
            </div>
          </div>

          {/* 
            ╔═══════════════════════════════════════════════════════════╗
            ║ 12. AI INTEGRATION - IN-LESSON AI ASSISTANT               ║
            ║ Features:                                                 ║
            ║ 🤖 Explain with AI                                        ║
            ║ 🌐 Translate (Telugu default)                             ║
            ║ 📝 Generate Notes                                         ║
            ║ ❓ Generate Questions                                     ║
            ║ 🎤 Ask by Voice                                           ║
            ║ 📷 Ask from Image                                         ║
            ╚═══════════════════════════════════════════════════════════╝
          */}
          <div id="lesson-ai-hub" className="scroll-mt-6">
            <LessonAiAssistant
              lesson={{
                id: lesson.id,
                title: lesson.title,
                subject: lesson.subject,
                chapter: lesson.chapter,
                level: lesson.level,
                content: lesson.content,
                summary: lesson.summary,
                equation: lesson.equation,
              }}
              initialAction={aiAssistantAction}
            />
          </div>

          {/* 
            ────────────────────────────────
            DIVIDER LINE
          */}
          <div className="relative py-2">
            <div className="border-t-2 border-dashed border-slate-200 dark:border-slate-800" />
            <span className="absolute left-1/2 -translate-x-1/2 -top-1.5 px-3 bg-white dark:bg-slate-900 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Interactive Resources & Tools
            </span>
          </div>

          {/* 
            ║ 🎥 Watch Video                   ║
            ║ 📄 Study PDF                     ║
            ║ 🔊 Listen to Explanation        ║
            ║ 🤖 Ask AI                        ║
            ║ 📝 Take Quiz                     ║
          */}
          <div className="space-y-3">
            {/* 1. 🎥 WATCH VIDEO */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => setActiveSection(activeSection === 'video' ? null : 'video')}
                className={`w-full p-4 text-left font-black text-sm flex items-center justify-between transition-colors ${
                  activeSection === 'video'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">🎥</span>
                  <span>Watch Video</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                      activeSection === 'video'
                        ? 'bg-white/20 text-white'
                        : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                    }`}
                  >
                    HD Lecture (22:15)
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${activeSection === 'video' ? 'rotate-180 text-white' : 'text-slate-400'}`}
                />
              </button>

              {activeSection === 'video' && (
                <div className="p-5 bg-white dark:bg-slate-900 space-y-4 border-t border-slate-100 dark:border-slate-800">
                  {/* Video Player Mockup / Embed */}
                  <div className="relative aspect-video rounded-2xl bg-slate-950 overflow-hidden shadow-xl border border-slate-800 flex items-center justify-center">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube-nocookie.com/embed/7ArmBVF2dCs?rel=0"
                      title="Simple Linear Regression Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  {/* Video Info & Timestamps */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Lecture Timestamps & Chapters:
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Click any section to jump to that key concept in the curriculum.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          downloadOfflineItem({
                            id: `off-vid-${lesson.id}`,
                            title: `${lesson.title} - Video Lecture`,
                            type: 'video',
                            subject: lesson.subject,
                            educationLevel: lesson.level,
                            fileSize: '18.4 MB',
                            downloadedAt: 'Just now',
                            chapterTitle: lesson.chapter,
                            videoDuration: lesson.video.duration,
                            contentOrUrl: `Offline video stream for ${lesson.title}`,
                          });
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-sm shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Save Offline Video</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {lesson.video.timestamps.map((ts, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-2 cursor-pointer hover:border-indigo-400"
                        >
                          <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                            {ts.time}
                          </span>
                          <span className="text-slate-700 dark:text-slate-300 truncate">
                            {ts.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. 📄 STUDY PDF */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => setActiveSection(activeSection === 'pdf' ? null : 'pdf')}
                className={`w-full p-4 text-left font-black text-sm flex items-center justify-between transition-colors ${
                  activeSection === 'pdf'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">📄</span>
                  <span>Study PDF</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                      activeSection === 'pdf'
                        ? 'bg-white/20 text-white'
                        : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                    }`}
                  >
                    4-Page Revision Notes
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${activeSection === 'pdf' ? 'rotate-180 text-white' : 'text-slate-400'}`}
                />
              </button>

              {activeSection === 'pdf' && (
                <div className="p-5 bg-white dark:bg-slate-900 space-y-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border border-purple-200 dark:border-purple-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-xl shrink-0 shadow-md">
                        📄
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">
                          {lesson.pdf.title}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {lesson.pdf.pages} Pages • {lesson.pdf.size} • Verified Exam Notes
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          const targetUrl = lesson.pdfUrl;
                          if (targetUrl && targetUrl.trim() !== '') {
                            window.open(targetUrl, '_blank', 'noopener,noreferrer');
                          } else {
                            // Fallback notification matching StudentLessonActivity.kt
                            downloadOfflineItem({
                              id: `off-pdf-${lesson.id}`,
                              title: lesson.pdf.title,
                              type: 'pdf',
                              subject: lesson.subject,
                              educationLevel: lesson.level,
                              fileSize: lesson.pdf.size,
                              downloadedAt: 'Just now',
                              chapterTitle: lesson.chapter,
                              pdfPagesCount: lesson.pdf.pages,
                              contentOrUrl: `Full PDF Study Handbook for ${lesson.title}. Contains formulas, mindmaps, and solved board exam questions.`,
                            });
                          }
                        }}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                      >
                        <FileText className="w-4 h-4" />
                        <span>OPEN PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          downloadOfflineItem({
                            id: `off-pdf-${lesson.id}`,
                            title: lesson.pdf.title,
                            type: 'pdf',
                            subject: lesson.subject,
                            educationLevel: lesson.level,
                            fileSize: lesson.pdf.size,
                            downloadedAt: 'Just now',
                            chapterTitle: lesson.chapter,
                            pdfPagesCount: lesson.pdf.pages,
                            contentOrUrl: `Full PDF Study Handbook for ${lesson.title}. Contains formulas, mindmaps, and solved board exam questions.`,
                          });
                        }}
                        className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
                      >
                        <Download className="w-4 h-4" />
                        <span>Offline Vault</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Included Study Materials & Cheat Sheets:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {lesson.pdf.sections.map((sec, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs flex items-start gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-slate-700 dark:text-slate-200 font-medium">{sec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. 🔊 LISTEN TO EXPLANATION */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => setActiveSection(activeSection === 'audio' ? null : 'audio')}
                className={`w-full p-4 text-left font-black text-sm flex items-center justify-between transition-colors ${
                  activeSection === 'audio'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">🔊</span>
                  <span>Listen to Explanation</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                      activeSection === 'audio'
                        ? 'bg-white/20 text-white'
                        : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                    }`}
                  >
                    AI Voice Classroom (Telugu & English)
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${activeSection === 'audio' ? 'rotate-180 text-white' : 'text-slate-400'}`}
                />
              </button>

              {activeSection === 'audio' && (
                <div className="p-5 bg-white dark:bg-slate-900 space-y-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white space-y-4 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-lg ${
                            isSpeaking
                              ? 'bg-amber-400 text-slate-950 animate-pulse ring-4 ring-amber-400/30'
                              : 'bg-white/10 text-white'
                          }`}
                        >
                          🔊
                        </div>
                        <div>
                          <h4 className="text-sm font-black">AI Voice Narration Engine</h4>
                          <p className="text-xs text-indigo-200">
                            {audioLanguage === 'en' ? 'English Narration' : 'తెలుగు వివరణ (Telugu Narration)'}
                          </p>
                        </div>
                      </div>

                      {/* Language Switcher */}
                      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/10 border border-white/20">
                        <button
                          type="button"
                          onClick={() => {
                            if (isSpeaking) window.speechSynthesis?.cancel();
                            setIsSpeaking(false);
                            setAudioLanguage('en');
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            audioLanguage === 'en' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300'
                          }`}
                        >
                          English
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (isSpeaking) window.speechSynthesis?.cancel();
                            setIsSpeaking(false);
                            setAudioLanguage('te');
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            audioLanguage === 'te' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-300'
                          }`}
                        >
                          తెలుగు (Telugu)
                        </button>
                      </div>
                    </div>

                    {/* Audio Transcript Card */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-indigo-100 leading-relaxed max-h-36 overflow-y-auto">
                      {audioLanguage === 'en'
                        ? lesson.audioExplanation.englishText
                        : lesson.audioExplanation.teluguText}
                    </div>

                    {/* Play Controls & Speed */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleToggleSpeech}
                          className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg transition-all"
                        >
                          {isSpeaking ? (
                            <>
                              <Pause className="w-4 h-4" /> Pause Voice
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4" /> Listen Now
                            </>
                          )}
                        </button>

                        {isSpeaking && (
                          <div className="flex items-center gap-1 pl-2">
                            <span className="w-1.5 h-6 bg-amber-400 rounded-full animate-bounce" />
                            <span className="w-1.5 h-8 bg-amber-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <span className="w-1.5 h-4 bg-amber-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                            <span className="w-1.5 h-7 bg-amber-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-indigo-200">
                        <span>Speed:</span>
                        {[0.8, 1, 1.25].map((rate) => (
                          <button
                            key={rate}
                            type="button"
                            onClick={() => {
                              setSpeechRate(rate);
                              if (isSpeaking) {
                                window.speechSynthesis?.cancel();
                                setIsSpeaking(false);
                              }
                            }}
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              speechRate === rate ? 'bg-white text-slate-950' : 'bg-white/10 text-white'
                            }`}
                          >
                            {rate}x
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. 🤖 ASK AI */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => setActiveSection(activeSection === 'ai' ? null : 'ai')}
                className={`w-full p-4 text-left font-black text-sm flex items-center justify-between transition-colors ${
                  activeSection === 'ai'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">🤖</span>
                  <span>Ask AI</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                      activeSection === 'ai'
                        ? 'bg-white/20 text-white'
                        : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                    }`}
                  >
                    Interactive Doubt Clearing
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${activeSection === 'ai' ? 'rotate-180 text-white' : 'text-slate-400'}`}
                />
              </button>

              {activeSection === 'ai' && (
                <div className="p-5 bg-white dark:bg-slate-900 space-y-4 border-t border-slate-100 dark:border-slate-800">
                  {/* Quick suggested chips */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Quick Questions for this lesson:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'How is slope (m) calculated?',
                        'What does R² represent?',
                        'Explain OLS and residuals',
                        'Explain in Telugu (తెలుగులో)',
                      ].map((promptText, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSendAiQuestion(promptText)}
                          className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-colors"
                        >
                          {promptText}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Chat message bubbles */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 max-h-64 overflow-y-auto space-y-3">
                    {aiChat.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {msg.sender === 'ai' && (
                          <div className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                            🤖
                          </div>
                        )}
                        <div
                          className={`p-3.5 rounded-2xl text-xs max-w-lg leading-relaxed ${
                            msg.sender === 'user'
                              ? 'bg-indigo-600 text-white font-medium rounded-tr-none'
                              : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs rounded-tl-none'
                          }`}
                        >
                          <div className="whitespace-pre-line">{msg.text}</div>
                        </div>
                      </div>
                    ))}

                    {isAiThinking && (
                      <div className="flex items-center gap-2 text-xs text-slate-500 italic pl-9">
                        <Sparkles className="w-3.5 h-3.5 animate-spin text-purple-600" />
                        AI is thinking...
                      </div>
                    )}
                  </div>

                  {/* Question Input Form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendAiQuestion();
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={aiQuestion}
                      onChange={(e) => setAiQuestion(e.target.value)}
                      placeholder={`Ask any question about ${lesson.title}...`}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      type="submit"
                      disabled={isAiThinking || !aiQuestion.trim()}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Ask</span>
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* 5. 📝 TAKE QUIZ */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => setActiveSection(activeSection === 'quiz' ? null : 'quiz')}
                className={`w-full p-4 text-left font-black text-sm flex items-center justify-between transition-colors ${
                  activeSection === 'quiz'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">📝</span>
                  <span>Take Quiz</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                      activeSection === 'quiz'
                        ? 'bg-white/20 text-white'
                        : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                    }`}
                  >
                    {activeQuiz.questions.length} Questions (Pass: {activeQuiz.passingScore}%)
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${activeSection === 'quiz' ? 'rotate-180 text-white' : 'text-slate-400'}`}
                />
              </button>

              {activeSection === 'quiz' && (
                <div className="p-5 bg-white dark:bg-slate-900 space-y-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">
                        {activeQuiz.title}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {firestoreQuiz
                          ? 'Live published quiz loaded from Firestore.'
                          : 'Test your understanding of this lesson.'}
                      </p>
                    </div>

                    {quizScore !== null && (
                      <div className="text-right">
                        <span
                          className={`text-sm font-black tabular-nums ${
                            quizScore >= activeQuiz.passingScore ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          Score: {quizScore}%{' '}
                          {quizScore >= activeQuiz.passingScore ? 'PASSED' : 'RETRY'}
                        </span>
                        {quizSavedToCloud && (
                          <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            Result saved to Firestore
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Question items */}
                  <div className="space-y-6">
                    {activeQuiz.questions.map((q, qIndex) => {
                      const selectedOpt = selectedAnswers[q.id];
                      const resolvedCorrectAnswer = firestoreQuiz
                        ? unlockedAnswerKeys[q.id]?.correctAnswer
                        : q.correctAnswer;
                      const resolvedExplanation = firestoreQuiz
                        ? unlockedAnswerKeys[q.id]?.explanation
                        : q.explanation;
                      const isCorrect =
                        isQuizSubmitted &&
                        resolvedCorrectAnswer !== undefined &&
                        selectedOpt === resolvedCorrectAnswer;

                      return (
                        <div
                          key={q.id}
                          className={`p-4 rounded-2xl border transition-all ${
                            isQuizSubmitted
                              ? isCorrect
                                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                                : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800'
                              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-black text-slate-900 dark:text-white">
                              <span className="text-indigo-600 dark:text-indigo-400 mr-1 tabular-nums">
                                Q{qIndex + 1}.
                              </span>
                              {q.question}
                            </p>
                            {isQuizSubmitted && resolvedCorrectAnswer && (
                              <span
                                className={`text-[10px] font-black px-2 py-0.5 rounded shrink-0 ${
                                  isCorrect
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                                    : 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                                }`}
                              >
                                {isCorrect
                                  ? `Correct (+${firestoreQuiz?.marksByQuestionId?.[q.id] || 1})`
                                  : `Ans: ${resolvedCorrectAnswer}`}
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                            {q.options.map((opt) => {
                              const isChosen = selectedOpt === opt.key;
                              const isActualCorrect =
                                isQuizSubmitted && resolvedCorrectAnswer === opt.key;

                              return (
                                <button
                                  key={opt.key}
                                  type="button"
                                  disabled={isQuizSubmitted}
                                  onClick={() =>
                                    setSelectedAnswers({ ...selectedAnswers, [q.id]: opt.key })
                                  }
                                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2.5 transition-all ${
                                    isActualCorrect
                                      ? 'bg-emerald-100 dark:bg-emerald-900/60 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-bold'
                                      : isChosen
                                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
                                  }`}
                                >
                                  <span
                                    className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${
                                      isActualCorrect
                                        ? 'bg-emerald-600 text-white'
                                        : isChosen
                                        ? 'bg-white text-indigo-600'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                                    }`}
                                  >
                                    {opt.key}
                                  </span>
                                  <span className="truncate">{opt.text}</span>
                                </button>
                              );
                            })}
                          </div>

                          {isQuizSubmitted && resolvedExplanation && (
                            <div className="mt-2.5 p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300">
                              <strong className="text-slate-900 dark:text-slate-100">
                                Explanation:{' '}
                              </strong>
                              {resolvedExplanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-slate-500 font-medium tabular-nums">
                      {Object.keys(selectedAnswers).length} of {activeQuiz.questions.length} answered
                    </span>

                    {isQuizSubmitted ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveTab('tests')}
                          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold"
                        >
                          All Quizzes
                        </button>
                        <button
                          type="button"
                          onClick={handleResetQuiz}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleGradeQuiz}
                        disabled={Object.keys(selectedAnswers).length === 0}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-black shadow-md flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" /> Submit Answers
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 
            [ ✓ Mark Complete ]
            PROMINENT BOTTOM COMPLETION BUTTON (Exact wireframe spec)
          */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                Status: {isCompleted ? '✓ Lesson Completed & Verified' : 'In Progress (Not Completed)'}
              </span>
            </div>

            <button
              type="button"
              id="btn-mark-lesson-complete"
              onClick={handleToggleComplete}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2.5 shadow-xl ${
                isCompleted
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 scale-[1.02]'
                  : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 hover:from-purple-700 hover:to-emerald-700 text-white shadow-indigo-600/30 hover:scale-[1.02]'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{isCompleted ? '✓ Completed' : '✓ Mark Complete'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
