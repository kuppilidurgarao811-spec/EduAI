import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  BookOpen,
  GraduationCap,
  MessageSquare,
  Award,
  ChevronRight,
  ChevronLeft,
  Languages,
  Radio,
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Users,
  Lightbulb,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { getLanguageInfo } from '../utils/translations';

interface LessonSlide {
  title: string;
  subtitle: string;
  speechText: string;
  bulletPoints: string[];
  keyFormulaOrCode?: string;
  diagramOrVisual?: string;
}

interface VoiceClass {
  id: string;
  title: string;
  subject: string;
  level: string;
  language: string;
  teacherName: string;
  teacherTitle: string;
  durationMinutes: number;
  description: string;
  slides: LessonSlide[];
  quizQuestions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

const VOICE_LESSONS_CATALOG: VoiceClass[] = [
  {
    id: 'math-quadratic-class10',
    title: 'Quadratic Equations Masterclass',
    subject: 'Mathematics',
    level: 'High School (Class 9-10)',
    language: 'English',
    teacherName: 'Prof. Ramanujan AI',
    teacherTitle: 'Lead Mathematics AI Educator',
    durationMinutes: 12,
    description: 'Master quadratic formulas, discriminant analysis, and nature of roots through interactive audio step-by-step explanations.',
    slides: [
      {
        title: 'Introduction to Quadratic Equations',
        subtitle: 'Standard Form & Degree of Polynomial',
        speechText:
          'Welcome to today’s AI Voice Masterclass on Quadratic Equations! A quadratic equation is a polynomial equation of second degree in a single variable x, written in standard form as a x squared plus b x plus c equals zero, where a is not equal to zero.',
        bulletPoints: [
          'Standard Form: ax² + bx + c = 0',
          'a, b, c are real numbers and a ≠ 0',
          'Degree of polynomial is always 2 (gives max 2 real roots)',
          'Examples: 2x² - 5x + 3 = 0, x² - 9 = 0',
        ],
        keyFormulaOrCode: 'ax² + bx + c = 0',
      },
      {
        title: 'The Quadratic Formula',
        subtitle: 'Universal Solution Method',
        speechText:
          'To solve any quadratic equation effortlessly, we use the famous Quadratic Formula: x equals minus b plus or minus square root of b squared minus 4 a c, all divided by 2 a. The value inside the square root is called the Discriminant D.',
        bulletPoints: [
          'Formula: x = [-b ± √(b² - 4ac)] / (2a)',
          'Discriminant D = b² - 4ac',
          'If D > 0: Two distinct real roots',
          'If D = 0: Two equal real roots (-b / 2a)',
          'If D < 0: Complex conjugate roots',
        ],
        keyFormulaOrCode: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
      },
      {
        title: 'Live Example Problem Breakdown',
        subtitle: 'Solving 2x² - 7x + 3 = 0',
        speechText:
          'Let us solve 2 x squared minus 7 x plus 3 equals zero. Here a is 2, b is minus 7, and c is 3. D equals minus 7 squared minus 4 times 2 times 3, which is 49 minus 24 equals 25. Thus square root of 25 is 5. Solving yields x equals 3 or x equals 1 over 2!',
        bulletPoints: [
          'Given: 2x² - 7x + 3 = 0',
          'Identify: a = 2, b = -7, c = 3',
          'Calculate D: (-7)² - 4(2)(3) = 49 - 24 = 25',
          'Apply Formula: x = [7 ± 5] / 4',
          'Roots: x = 12/4 = 3 and x = 2/4 = 1/2',
        ],
        keyFormulaOrCode: 'Roots: x₁ = 3, x₂ = 0.5',
      },
    ],
    quizQuestions: [
      {
        question: 'What is the Discriminant D of the quadratic equation ax² + bx + c = 0?',
        options: ['b - 4ac', 'b² - 4ac', '√(b² + 4ac)', 'b² + 4ac'],
        correctIndex: 1,
        explanation: 'Discriminant D is defined as b² - 4ac. It determines the nature of the roots.',
      },
      {
        question: 'If Discriminant D = 0, what can you conclude about the roots?',
        options: ['No real roots exist', 'Two distinct real roots', 'Two equal real roots', 'Infinite roots'],
        correctIndex: 2,
        explanation: 'When D = 0, the square root term becomes 0, yielding two equal real roots x = -b / (2a).',
      },
    ],
  },
  {
    id: 'phonics-lkg-primary',
    title: 'Phonics & Alphabet Story Time',
    subject: 'English & Phonics',
    level: 'LKG / UKG / Primary',
    language: 'English',
    teacherName: 'Teacher Daisy AI',
    teacherTitle: 'Early Childhood Specialist',
    durationMinutes: 8,
    description: 'Fun audio phonics lesson with cheerful sound cues, letter pronunciation, and playful word associations for young learners.',
    slides: [
      {
        title: 'Letter A & Letter B Sound Fun!',
        subtitle: 'Phonics Sounds & Words',
        speechText:
          'Hello little super star! Welcome to Phonics Voice Class! Today we learn Letter A and Letter B! Letter A says "Ah Ah Apple"! Letter B says "Buh Buh Ball"! Let us say it together: Ah Ah Apple, Buh Buh Ball!',
        bulletPoints: [
          '🍎 Letter A says /æ/ as in Apple, Ant, Astronaut',
          '⚽ Letter B says /b/ as in Ball, Bear, Banana',
          '🎵 Sing along: Ah Ah Apple, Buh Buh Ball!',
          '🌟 Practice tracing A and B on your screen!',
        ],
        keyFormulaOrCode: 'A -> /æ/ | B -> /b/',
      },
      {
        title: 'Animal Friends Phonics Story',
        subtitle: 'The Brave Bear & Friendly Ant',
        speechText:
          'Once upon a time, an Ant named Andy met a Bear named Benny. Andy brought a sweet Apple, and Benny brought a bouncy Ball! They played together under the big green tree!',
        bulletPoints: [
          '🐜 Andy the Ant brought an Apple 🍎',
          '🐻 Benny the Bear played with a Ball ⚽',
          '🌳 They became best phonics friends forever!',
        ],
      },
    ],
    quizQuestions: [
      {
        question: 'What sound does Letter A make in "Apple"?',
        options: ['/buh/', '/ah/', '/ch/', '/doh/'],
        correctIndex: 1,
        explanation: 'Letter A makes the /ah/ sound as in Apple, Ant, and Alligator!',
      },
    ],
  },
  {
    id: 'python-degree-btech',
    title: 'Python OOP & Data Structures',
    subject: 'Computer Science & Coding',
    level: 'Degree / B.Tech / Diploma',
    language: 'English',
    teacherName: 'Prof. Ada Lovelace AI',
    teacherTitle: 'AI Computer Science Faculty',
    durationMinutes: 15,
    description: 'Audio explanation of Python Classes, Objects, Inheritance, Encapsulation, and Memory layout.',
    slides: [
      {
        title: 'Object-Oriented Programming Core Concepts',
        subtitle: 'Classes, Objects & Attributes',
        speechText:
          'Welcome to Python Object-Oriented Programming! In Python, everything is an object. A Class acts as a blueprint, specifying variables and methods. An Object is an instance created from that class blueprint residing in memory.',
        bulletPoints: [
          'Class: Blueprint defining structure and behavior',
          'Object: Instance of a class in memory',
          '__init__() constructor initializes instance variables',
          'self parameter binds attributes to the current object instance',
        ],
        keyFormulaOrCode: `class Student:\n    def __init__(self, name, level):\n        self.name = name\n        self.level = level\n\ns1 = Student("Raju", "Class 10")\nprint(s1.name)`,
      },
      {
        title: 'Four Pillars of OOP',
        subtitle: 'Encapsulation, Abstraction, Inheritance, Polymorphism',
        speechText:
          'OOP rests on four main pillars: Encapsulation wraps data and methods together; Abstraction hides implementation details; Inheritance enables reusability; and Polymorphism allows uniform method interfaces for different object types.',
        bulletPoints: [
          'Encapsulation: Private members with _ or __ prefix',
          'Inheritance: Single, Multiple, Multilevel class inheritance',
          'Polymorphism: Method overriding and dynamic dispatch',
          'Abstraction: Abstract Base Classes (ABC module)',
        ],
        keyFormulaOrCode: `class Animal:\n    def speak(self):\n        pass\n\nclass Dog(Animal):\n    def speak(self):\n        return "Woof!"`,
      },
    ],
    quizQuestions: [
      {
        question: 'Which method in Python acts as the class constructor?',
        options: ['__new__()', '__init__()', '__main__()', '__build__()'],
        correctIndex: 1,
        explanation: '__init__() is automatically called when a new instance of a class is created in Python.',
      },
    ],
  },
  {
    id: 'constitution-upsc-telugu',
    title: 'Indian Constitution & Fundamental Rights (తెలుగు / English)',
    subject: 'General Knowledge & Polity',
    level: 'Competitive Exams (UPSC/SSC/APPSC)',
    language: 'Telugu',
    teacherName: 'Dr. Ambedkar AI',
    teacherTitle: 'Constitutional Law Expert',
    durationMinutes: 14,
    description: 'Bilingual Telugu & English voice lecture covering Articles 12-35, Fundamental Rights, Writs, and Land mark Supreme Court rulings.',
    slides: [
      {
        title: 'Fundamental Rights Overview (ప్రాథమిక హక్కులు)',
        subtitle: 'Part III of Indian Constitution (Articles 12 to 35)',
        speechText:
          'భారత రాజ్యాంగం భాగం 3 లో ఉన్న ఆర్టికల్స్ 12 నుండి 35 వరకు ప్రాథమిక హక్కుల గురించి వివరిస్తాయి. Fundamental Rights act as the Magna Carta of India, ensuring civil liberties and equality to all citizens.',
        bulletPoints: [
          'Part III Articles 12-35: Magna Carta of India',
          'Right to Equality (Articles 14-18)',
          'Right to Freedom (Articles 19-22)',
          'Right against Exploitation (Articles 23-24)',
          'Right to Constitutional Remedies (Article 32 - Heart & Soul)',
        ],
        keyFormulaOrCode: 'Article 32: Constitutional Remedies (Writs)',
      },
    ],
    quizQuestions: [
      {
        question: 'Which Article of the Indian Constitution is called the "Heart and Soul" of the Constitution?',
        options: ['Article 14', 'Article 19', 'Article 21', 'Article 32'],
        correctIndex: 3,
        explanation: 'Dr. B.R. Ambedkar termed Article 32 (Right to Constitutional Remedies) as the Heart and Soul of the Constitution.',
      },
    ],
  },
];

export const VoiceClassroom: React.FC = () => {
  const { user, educationLevel, language, addXp } = useAuth();
  
  // State
  const [mainSubTab, setMainSubTab] = useState<'classroom' | 'talk' | 'pronunciation'>('classroom');

  const [selectedClass, setSelectedClass] = useState<VoiceClass>(VOICE_LESSONS_CATALOG[0]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [selectedAccent, setSelectedAccent] = useState<string>('en-IN');
  const [isListeningStudent, setIsListeningStudent] = useState<boolean>(false);
  const [studentQuestionText, setStudentQuestionText] = useState<string>('');
  const [qaLog, setQaLog] = useState<{ question: string; answer: string; time: string }[]>([]);
  const [isAnsweringQA, setIsAnsweringQA] = useState<boolean>(false);
  const [activeTabMode, setActiveTabMode] = useState<'classroom' | 'whiteboard' | 'quiz' | 'catalog'>('classroom');

  // Pronunciation Practice State
  const [pronunciationList] = useState([
    { id: 1, phrase: 'Quadratic Discriminant', subject: 'Mathematics', phonetic: '/kwɑːˈdrætɪk dɪˈskrɪmɪnənt/', difficulty: 'Intermediate' },
    { id: 2, phrase: 'Photosynthesis Process', subject: 'Biology', phonetic: '/ˌfoʊtoʊˈsɪnθəsɪs ˈprɑːsɛs/', difficulty: 'Easy' },
    { id: 3, phrase: 'Object Oriented Encapsulation', subject: 'Computer Science', phonetic: '/ˈɑːbdʒɛkt ˈɔːriɛntɪd ɪnˌkæpsəˈleɪʃn/', difficulty: 'Advanced' },
    { id: 4, phrase: 'Constitutional Remedies', subject: 'Civics & Polity', phonetic: '/ˌkɑːnstəˈtuːʃənl ˈrɛmədiz/', difficulty: 'Intermediate' },
    { id: 5, phrase: 'Electromagnetic Induction', subject: 'Physics', phonetic: '/ɪˌlɛktroʊmæɡˈnɛtɪk ɪnˈdʌkʃn/', difficulty: 'Advanced' },
  ]);
  const [selectedPronunciationIndex, setSelectedPronunciationIndex] = useState(0);
  const [userSpokenText, setUserSpokenText] = useState('');
  const [isRecordingPronunciation, setIsRecordingPronunciation] = useState(false);
  const [pronunciationScore, setPronunciationScore] = useState<number | null>(null);
  const [pronunciationFeedback, setPronunciationFeedback] = useState<string>('');

  // Talk with AI Conversational State
  const [talkMessages, setTalkMessages] = useState<{ sender: 'user' | 'ai'; text: string; time: string }[]>([
    {
      sender: 'ai',
      text: `Hello ${user.name}! I am your AI Voice Tutor. Speak directly to me using the microphone or type below. What topic would you like to discuss today?`,
      time: 'Just now',
    },
  ]);
  
  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  // On-demand Custom Subject Voice Class Generator State
  const [customTopicInput, setCustomTopicInput] = useState<string>('');
  const [customSubjectInput, setCustomSubjectInput] = useState<string>('');
  const [isGeneratingCustomClass, setIsGeneratingCustomClass] = useState<boolean>(false);

  // Audio Synth Ref
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Filter lessons based on education level matching if possible
  useEffect(() => {
    const matched = VOICE_LESSONS_CATALOG.find(
      (c) => c.level.toLowerCase().includes(educationLevel.toLowerCase()) || c.subject.toLowerCase().includes('math')
    );
    if (matched) {
      setSelectedClass(matched);
      setCurrentSlideIndex(0);
    }
  }, [educationLevel]);

  // Generate Custom AI Voice Class for Any Subject
  const handleGenerateCustomVoiceClass = async (topicOverride?: string) => {
    const topicToUse = topicOverride || customTopicInput;
    if (!topicToUse.trim()) return;

    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
    }

    setIsGeneratingCustomClass(true);

    try {
      const res = await fetch('/api/ai/generate-voice-class', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicToUse,
          subject: customSubjectInput || 'General Knowledge',
          educationLevel,
          language,
        }),
      });

      const newVoiceClass = await res.json();
      if (newVoiceClass && newVoiceClass.slides && newVoiceClass.slides.length > 0) {
        setSelectedClass(newVoiceClass);
        setCurrentSlideIndex(0);
        setSelectedAnswers({});
        setQuizSubmitted(false);
        setQaLog([]);
        setCustomTopicInput('');

        // Automatically start speaking the first slide of the generated class
        setTimeout(() => {
          if (synthRef.current) {
            const firstSlideSpeech = newVoiceClass.slides[0]?.speechText;
            if (firstSlideSpeech) {
              const utterance = new SpeechSynthesisUtterance(firstSlideSpeech);
              utterance.rate = playbackRate;
              utterance.lang = getLanguageInfo(language).speechCode;
              setIsPlaying(true);
              synthRef.current.speak(utterance);
            }
          }
        }, 300);
      }
    } catch (err) {
      console.error('Failed to generate custom Voice Class:', err);
    } finally {
      setIsGeneratingCustomClass(false);
    }
  };

  // Handle Speech Synthesis
  const speakCurrentSlideText = (textOverride?: string) => {
    if (!synthRef.current) return;

    // Cancel ongoing speech
    synthRef.current.cancel();

    const slide = selectedClass.slides[currentSlideIndex];
    const textToSpeak = textOverride || slide?.speechText || '';

    if (!textToSpeak) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = playbackRate;
    
    // Set voice language accent
    utterance.lang = getLanguageInfo(language).speechCode;

    // Pick best voice if available
    const voices = synthRef.current.getVoices();
    const matchedVoice = voices.find(
      (v) => v.lang.includes('IN') || v.lang.includes('en-US') || v.lang.includes('te') || v.lang.includes('hi')
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
      // Auto advance to next slide if available
      if (!textOverride && currentSlideIndex < selectedClass.slides.length - 1) {
        setTimeout(() => {
          setCurrentSlideIndex((prev) => prev + 1);
        }, 1200);
      }
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      setIsPlaying(false);
    };

    currentUtteranceRef.current = utterance;
    setIsPlaying(true);
    synthRef.current.speak(utterance);
  };

  const handleTogglePlay = () => {
    if (!synthRef.current) {
      alert('Text-to-speech voice engine is initializing in your browser.');
      return;
    }

    if (isPlaying) {
      synthRef.current.pause();
      setIsPlaying(false);
    } else {
      if (synthRef.current.paused) {
        synthRef.current.resume();
        setIsPlaying(true);
      } else {
        speakCurrentSlideText();
      }
    }
  };

  const handleRestartLesson = () => {
    if (synthRef.current) synthRef.current.cancel();
    setCurrentSlideIndex(0);
    setIsPlaying(false);
    setTimeout(() => {
      speakCurrentSlideText();
    }, 200);
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < selectedClass.slides.length - 1) {
      if (synthRef.current) synthRef.current.cancel();
      setCurrentSlideIndex((prev) => prev + 1);
      setIsPlaying(false);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      if (synthRef.current) synthRef.current.cancel();
      setCurrentSlideIndex((prev) => prev - 1);
      setIsPlaying(false);
    }
  };

  // Student Voice Q&A Recognition (Web Speech API)
  const handleStartStudentVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is supported in Chrome, Edge & Safari. You can also type your question!');
      return;
    }

    try {
      if (isPlaying && synthRef.current) {
        synthRef.current.pause();
        setIsPlaying(false);
      }

      const recognition = new SpeechRecognition();
      recognition.lang = selectedClass.language === 'Telugu' ? 'te-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      setIsListeningStudent(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setStudentQuestionText(transcript);
        setIsListeningStudent(false);
        handleAskQuestionToTeacher(transcript);
      };

      recognition.onerror = () => {
        setIsListeningStudent(false);
      };

      recognition.onend = () => {
        setIsListeningStudent(false);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListeningStudent(false);
    }
  };

  const handleAskQuestionToTeacher = async (questionTextOverride?: string) => {
    const qText = questionTextOverride || studentQuestionText;
    if (!qText.trim()) return;

    if (isPlaying && synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
    }

    setIsAnsweringQA(true);

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Student asked during Voice Class on "${selectedClass.title}": "${qText}". Provide a warm, 2-3 sentence audio response directly answering this.`,
          educationLevel,
          subject: selectedClass.subject,
          language: selectedClass.language,
          speedMode: 'quick',
        }),
      });

      const data = await res.json();
      const aiAnswer = data.text || `Great question! In ${selectedClass.subject}, this concept is crucial. Let us review the key steps together.`;

      setQaLog((prev) => [
        ...prev,
        {
          question: qText,
          answer: aiAnswer,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      setStudentQuestionText('');
      
      // Speak AI Answer
      speakCurrentSlideText(`Hello ${user.name}! Here is the answer to your question: ${aiAnswer}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnsweringQA(false);
    }
  };

  // Pronunciation Practice Handlers
  const handleListenPronunciationNative = (phraseText: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(phraseText);
    utterance.rate = 0.85;
    utterance.lang = 'en-US';
    synthRef.current.speak(utterance);
  };

  const handleRecordPronunciation = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is supported in Chrome, Edge & Safari browsers.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      setIsRecordingPronunciation(true);
      setPronunciationScore(null);
      setPronunciationFeedback('Listening... Speak the phrase clearly into your microphone now.');

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setUserSpokenText(transcript);
        setIsRecordingPronunciation(false);

        const target = pronunciationList[selectedPronunciationIndex].phrase.toLowerCase();
        const spoken = transcript.toLowerCase();

        if (spoken.includes(target) || target.includes(spoken)) {
          setPronunciationScore(98);
          setPronunciationFeedback('🌟 Outstanding Pronunciation! Accent and phonetics are spot-on.');
          addXp(40);
        } else {
          const targetWords = target.split(' ');
          const spokenWords = spoken.split(' ');
          let matches = 0;
          targetWords.forEach((w) => {
            if (spokenWords.some((sw) => sw.includes(w) || w.includes(sw))) matches++;
          });
          const calcScore = Math.min(95, Math.max(50, Math.round((matches / Math.max(1, targetWords.length)) * 90)));
          setPronunciationScore(calcScore);
          setPronunciationFeedback(
            calcScore >= 75
              ? '👍 Good Effort! Minor accent tweak recommended.'
              : '💡 Practice makes perfect! Click "Listen Native Audio" to review the sound.'
          );
          if (calcScore >= 70) addXp(25);
        }
      };

      recognition.onerror = () => {
        setIsRecordingPronunciation(false);
        setPronunciationFeedback('Audio detection timed out. Click record and try again!');
      };

      recognition.start();
    } catch (e) {
      setIsRecordingPronunciation(false);
    }
  };

  // Talk with AI Conversation Handler
  const handleTalkWithAI = async (spokenTextOverride?: string) => {
    const inputMsg = spokenTextOverride || studentQuestionText;
    if (!inputMsg.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTalkMessages((prev) => [...prev, { sender: 'user', text: inputMsg, time: userTime }]);
    setStudentQuestionText('');

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `User said in AI Voice Conversation: "${inputMsg}". Respond conversationally in 2 short sentences as a friendly voice tutor.`,
          educationLevel,
          subject: 'Voice Conversation Practice',
          language,
        }),
      });
      const data = await res.json();
      const aiReply = data.text || "That's a fascinating topic! Let's explore more together.";
      const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setTalkMessages((prev) => [...prev, { sender: 'ai', text: aiReply, time: aiTime }]);
      speakCurrentSlideText(aiReply);
    } catch (e) {
      console.error(e);
    }
  };

  // Quiz submission
  const handleAnswerSelect = (qIdx: number, oIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: oIdx }));
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    selectedClass.quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score += 1;
      }
    });

    setQuizScore(score);
    setQuizSubmitted(true);

    if (score > 0) {
      addXp(score * 25);
    }
  };

  const currentSlide = selectedClass.slides[currentSlideIndex] || selectedClass.slides[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* Top Header & Live AI Teacher Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
        {/* Glowing background circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-slate-950 flex items-center gap-1.5 shadow-sm">
              <Radio className="w-3.5 h-3.5 animate-pulse text-slate-950" />
              LIVE VOICE CLASSROOM
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-indigo-200 border border-white/10">
              {selectedClass.level}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            {selectedClass.title}
          </h1>

          <p className="text-xs md:text-sm text-indigo-200/90 max-w-2xl leading-relaxed">
            {selectedClass.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-indigo-300 pt-1">
            <span className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              Instructor: <strong className="text-white">{selectedClass.teacherName}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              Subject: <strong className="text-white">{selectedClass.subject}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-indigo-400" />
              Language: <strong className="text-white">{selectedClass.language}</strong>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTabMode('catalog')}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            Preset Catalog
          </button>
        </div>
      </div>

      {/* Voice Mode Selector Navigation Bar */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/80 dark:border-slate-700/80 shadow-inner overflow-x-auto">
        <button
          type="button"
          onClick={() => setMainSubTab('classroom')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
            mainSubTab === 'classroom'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>🎙️ Voice Classroom & AI Lectures</span>
        </button>

        <button
          type="button"
          onClick={() => setMainSubTab('talk')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
            mainSubTab === 'talk'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>💬 Talk with AI Voice Tutor</span>
        </button>

        <button
          type="button"
          onClick={() => setMainSubTab('pronunciation')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
            mainSubTab === 'pronunciation'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>🗣️ Pronunciation Practice</span>
        </button>
      </div>

      {/* Main Interactive Classroom Stage Grid */}
      {mainSubTab === 'classroom' && (
        <div className="space-y-6">
          {/* Instant Custom Voice Class Generator Card (ANY SUBJECT) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500 animate-bounce" />
                  Ask AI to Provide Voice Class on ANY Subject or Topic!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Type any topic or chapter for <strong className="text-indigo-600 dark:text-indigo-400">{user.educationLevel}</strong> level ({language}). AI will construct custom blackboard slides, speech script, and quiz questions instantly!
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shrink-0 self-start sm:self-auto">
                ⚡ Custom Voice AI Engine
              </span>
            </div>

            {/* Search / Topic Input Form */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={customTopicInput}
                onChange={(e) => setCustomTopicInput(e.target.value)}
                placeholder="e.g. Quantum Physics, Organic Chemistry, Phonics Letter C, Python Trees, Indian History, Financial Ratios..."
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateCustomVoiceClass()}
                className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => handleGenerateCustomVoiceClass()}
                disabled={isGeneratingCustomClass || !customTopicInput.trim()}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
              >
                {isGeneratingCustomClass ? (
                  <>
                    <Radio className="w-4 h-4 text-slate-950 animate-spin" />
                    <span>Generating Custom Class...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>🎙️ Generate Voice Class Now</span>
                  </>
                )}
              </button>
            </div>

            {/* Popular Instant Preset Topic Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
              <span className="text-slate-400 font-bold shrink-0 text-[11px]">Popular Subjects:</span>
              {[
                { label: '🧮 Quantum Mechanics', topic: 'Quantum Mechanics & Wave Functions' },
                { label: '🧬 DNA Replication & Genetics', topic: 'DNA Structure & Replication Process' },
                { label: '💻 Python Object Oriented Programming', topic: 'Python Classes, Objects, Inheritance' },
                { label: '📜 Indian Constitution Articles 12-35', topic: 'Indian Constitution Fundamental Rights' },
                { label: '🍎 Phonics Vowels & Consonants', topic: 'Phonics Vowel Sounds & Simple Words' },
                { label: '📊 Financial Ratios & Accounting', topic: 'Financial Accounting Ratios & Balance Sheet' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setCustomTopicInput(item.topic);
                    handleGenerateCustomVoiceClass(item.topic);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700 hover:border-indigo-300 text-[11px] shrink-0 transition-all flex items-center gap-1"
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2-Cols: AI Teacher Audio Stage & Whiteboard */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* AI Teacher Avatar & Live Visualizer Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
                
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  
                  {/* Teacher Info & Avatar */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-lg ring-4 ${isPlaying ? 'ring-emerald-400 dark:ring-emerald-500 animate-pulse' : 'ring-indigo-100 dark:ring-indigo-950'}`}>
                        {selectedClass.teacherName.charAt(0)}
                      </div>
                      {isPlaying && (
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                          🎙️
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-slate-800 dark:text-slate-100">
                          {selectedClass.teacherName}
                        </h3>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                          AI Faculty
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {selectedClass.teacherTitle}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge & Speed Controls */}
                  <div className="flex items-center gap-3">
                    
                    {/* Audio Speed Rate */}
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300">
                      {[0.8, 1.0, 1.25, 1.5].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => {
                            setPlaybackRate(rate);
                            if (isPlaying) speakCurrentSlideText();
                          }}
                          className={`px-2 py-1 rounded-lg transition-all ${playbackRate === rate ? 'bg-indigo-600 text-white shadow-xs' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>

                    {/* Status Indicator */}
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-2 ${isPlaying ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                      <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
                      {isPlaying ? 'Speaking Lesson...' : 'Paused'}
                    </span>
                  </div>

                </div>

                {/* Audio Wave Visualizer Animation */}
                <div className="h-16 rounded-2xl bg-slate-900 dark:bg-slate-950 p-4 flex items-center justify-center gap-1.5 overflow-hidden shadow-inner border border-slate-800">
                  {isPlaying ? (
                    [40, 70, 30, 90, 100, 60, 80, 50, 95, 45, 85, 30, 75, 90, 50, 80, 40, 60, 90, 70].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-gradient-to-t from-indigo-500 via-purple-400 to-amber-300 rounded-full transition-all duration-150 animate-pulse"
                        style={{
                          height: `${Math.max(15, (h * Math.random()) + 10)}%`,
                          animationDelay: `${(i % 5) * 100}ms`,
                        }}
                      />
                    ))
                  ) : (
                    <div className="flex items-center gap-2 text-slate-500 font-semibold text-xs">
                      <Volume2 className="w-4 h-4 text-slate-400" />
                      Click <strong className="text-indigo-400">Play Audio Class</strong> to start live teacher voice narration
                    </div>
                  )}
                </div>

                {/* Slide Control Bar & Play / Pause Button */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevSlide}
                      disabled={currentSlideIndex === 0}
                      className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-300 font-bold transition-all flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Prev Slide
                    </button>

                    <span className="text-xs font-black text-slate-500 dark:text-slate-400 px-2">
                      Slide {currentSlideIndex + 1} of {selectedClass.slides.length}
                    </span>

                    <button
                      onClick={handleNextSlide}
                      disabled={currentSlideIndex === selectedClass.slides.length - 1}
                      className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-300 font-bold transition-all flex items-center gap-1"
                    >
                      Next Slide
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRestartLesson}
                      className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all"
                      title="Restart Audio Lesson"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={handleTogglePlay}
                      className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg transition-all ${isPlaying ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/25' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30'}`}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-5 h-5 fill-current" />
                          Pause Voice
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5 fill-current" />
                          Play Audio Class
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>

              {/* Interactive Digital Whiteboard Slide View */}
              <div className="p-6 md:p-8 rounded-3xl bg-slate-900 text-slate-100 shadow-xl border border-slate-800 relative overflow-hidden">
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-mono text-slate-400 ml-2">
                      Interactive Blackboard Slide {currentSlideIndex + 1}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800">
                    {currentSlide.subtitle}
                  </span>
                </div>

                {/* Slide Title & Key Content */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                      {currentSlide.title}
                    </h2>
                    <p className="text-xs md:text-sm text-indigo-200/90 italic mt-1 bg-indigo-950/40 p-3 rounded-2xl border border-indigo-900/60">
                      🔊 Speech Script: "{currentSlide.speechText}"
                    </p>
                  </div>

                  {/* Bullet Points */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Key Teaching Points:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentSlide.bulletPoints.map((pt, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-xs font-medium text-slate-200 flex items-start gap-2.5"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Formula or Code Snippet Box */}
                  {currentSlide.keyFormulaOrCode && (
                    <div className="p-4 rounded-2xl bg-black/80 border border-indigo-500/40 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                        <span>⚡ Formula / Code Highlight</span>
                        <span>Class 10+ Standard</span>
                      </div>
                      <pre className="text-sm md:text-base font-mono text-amber-300 font-bold overflow-x-auto whitespace-pre-wrap">
                        {currentSlide.keyFormulaOrCode}
                      </pre>
                    </div>
                  )}
                </div>

              </div>

            </div>

            {/* Right 1-Col: Live Voice Q&A & Quick Quiz Sidebar */}
            <div className="space-y-6">
              
              {/* Ask Teacher Live by Voice or Text */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    Ask Teacher Live Question
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                    AI Voice Active
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Have a doubt on this slide? Click the microphone to speak your question or type it below.
                </p>

                {/* Voice Mic Input Button */}
                <button
                  type="button"
                  onClick={handleStartStudentVoice}
                  disabled={isListeningStudent || isAnsweringQA}
                  className={`w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-md ${
                    isListeningStudent
                      ? 'bg-rose-600 text-white animate-pulse shadow-rose-600/30'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-600/25'
                  }`}
                >
                  {isListeningStudent ? (
                    <>
                      <MicOff className="w-4 h-4 animate-bounce" />
                      <span>Listening... Speak your question now!</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 text-amber-300" />
                      <span>🎙️ Speak Question into Microphone</span>
                    </>
                  )}
                </button>

                {/* Text Question Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={studentQuestionText}
                    onChange={(e) => setStudentQuestionText(e.target.value)}
                    placeholder="Or type doubt here..."
                    onKeyDown={(e) => e.key === 'Enter' && handleAskQuestionToTeacher()}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleAskQuestionToTeacher()}
                    disabled={isAnsweringQA || !studentQuestionText.trim()}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs disabled:opacity-50 transition-all"
                  >
                    {isAnsweringQA ? 'Thinking...' : 'Ask'}
                  </button>
                </div>

                {/* Q&A Chat Log */}
                {qaLog.length > 0 && (
                  <div className="pt-2 space-y-3 max-h-56 overflow-y-auto no-scrollbar border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                        Live Class Q&A Thread ({qaLog.length}):
                      </span>
                      <button
                        onClick={() => {
                          if (window.confirm('Delete all live Q&A history for this voice lesson?')) {
                            setQaLog([]);
                          }
                        }}
                        className="text-[10px] font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Clear History</span>
                      </button>
                    </div>
                    {qaLog.map((log, idx) => (
                      <div key={idx} className="group relative p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs space-y-1">
                        <button
                          onClick={() => setQaLog((prev) => prev.filter((_, i) => i !== idx))}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-opacity"
                          title="Delete question from history"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <p className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center justify-between pr-5">
                          <span>🙋 Question: "{log.question}"</span>
                          <span className="text-[9px] font-normal text-indigo-400 shrink-0">{log.time}</span>
                        </p>
                        <p className="text-slate-700 dark:text-slate-300 leading-snug">
                          👨‍🏫 <strong>{selectedClass.teacherName}:</strong> {log.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

              </div>

              {/* Quick End-of-Class Quiz */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    End of Class Pop Quiz (+50 XP)
                  </h3>
                </div>

                {quizSubmitted ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
                    <span className="text-2xl">🎉</span>
                    <h4 className="text-sm font-black text-emerald-800 dark:text-emerald-300">
                      Quiz Completed! Score: {quizScore} / {selectedClass.quizQuestions.length}
                    </h4>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400">
                      You earned +{quizScore * 25} XP towards your leaderboard rank!
                    </p>
                    <button
                      onClick={() => {
                        setQuizSubmitted(false);
                        setSelectedAnswers({});
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                    >
                      Try Quiz Again
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedClass.quizQuestions.map((q, qIdx) => (
                      <div key={qIdx} className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-3 last:border-0">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {qIdx + 1}. {q.question}
                        </p>
                        <div className="space-y-1.5">
                          {q.options.map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              type="button"
                              onClick={() => handleAnswerSelect(qIdx, oIdx)}
                              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                                selectedAnswers[qIdx] === oIdx
                                  ? 'bg-indigo-600 text-white font-bold'
                                  : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={handleSubmitQuiz}
                      disabled={Object.keys(selectedAnswers).length < selectedClass.quizQuestions.length}
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs disabled:opacity-50 transition-all shadow-md"
                    >
                      Submit & Earn +50 XP
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Talk with AI Conversational Mode */}
      {mainSubTab === 'talk' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Talk with AI Voice Tutor
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Engage in natural voice-based dialogue. Ask doubts, request examples, or practice audio Q&A!
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
              🎙️ Interactive Speech Active
            </span>
          </div>

          {/* Chat Stream */}
          <div className="space-y-4 max-h-[450px] overflow-y-auto p-2 no-scrollbar">
            {talkMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white font-black flex items-center justify-center shrink-0 text-sm shadow-md">
                    AI
                  </div>
                )}
                <div
                  className={`p-4 rounded-3xl max-w-xl text-xs leading-relaxed space-y-1.5 shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none font-medium'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <p>{msg.text}</p>
                  <div className="flex items-center justify-between pt-1 text-[10px] opacity-75">
                    <span>{msg.time}</span>
                    {msg.sender === 'ai' && (
                      <button
                        type="button"
                        onClick={() => speakCurrentSlideText(msg.text)}
                        className="hover:underline flex items-center gap-1 text-indigo-500 font-bold"
                      >
                        <Volume2 className="w-3 h-3" /> Replay Voice
                      </button>
                    )}
                  </div>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-9 h-9 rounded-2xl bg-purple-600 text-white font-black flex items-center justify-center shrink-0 text-sm shadow-md">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Controls */}
          <div className="pt-2 space-y-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleStartStudentVoice}
                disabled={isListeningStudent}
                className={`px-5 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition-all ${
                  isListeningStudent
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                }`}
              >
                <Mic className="w-4 h-4 text-amber-300" />
                <span>{isListeningStudent ? 'Listening...' : 'Speak'}</span>
              </button>

              <input
                type="text"
                value={studentQuestionText}
                onChange={(e) => setStudentQuestionText(e.target.value)}
                placeholder="Type your message to talk with AI..."
                onKeyDown={(e) => e.key === 'Enter' && handleTalkWithAI()}
                className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />

              <button
                type="button"
                onClick={() => handleTalkWithAI()}
                disabled={!studentQuestionText.trim()}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs disabled:opacity-50 transition-all shadow-md"
              >
                Send
              </button>
            </div>

            {/* Quick Starters */}
            <div className="flex items-center gap-2 overflow-x-auto text-xs no-scrollbar pt-1">
              <span className="text-slate-400 font-bold shrink-0 text-[11px]">Quick Prompt Starters:</span>
              {[
                'Explain Quadratic Discriminant simply',
                'What are Fundamental Rights in Constitution?',
                'Give me 3 Python OOP interview questions',
                'How does Photosynthesis work in plants?',
              ].map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => handleTalkWithAI(prompt)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700 text-[11px] shrink-0 transition-all"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pronunciation Practice Mode */}
      {mainSubTab === 'pronunciation' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Pronunciation Practice & Accent Training
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Listen to native audio pronunciations, speak into your microphone, and receive real-time accuracy scoring!
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300">
              🎯 Earn +40 XP per Perfect Score
            </span>
          </div>

          {/* Word List Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Phrase Selector List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Term to Practice:</h4>
              <div className="space-y-2">
                {pronunciationList.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedPronunciationIndex(idx);
                      setPronunciationScore(null);
                      setPronunciationFeedback('');
                      setUserSpokenText('');
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs space-y-1 ${
                      selectedPronunciationIndex === idx
                        ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold">{item.phrase}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${selectedPronunciationIndex === idx ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                        {item.difficulty}
                      </span>
                    </div>
                    <p className={`text-[11px] font-mono ${selectedPronunciationIndex === idx ? 'text-indigo-100' : 'text-slate-400'}`}>
                      {item.phonetic}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Pronunciation Deck Stage */}
            <div className="md:col-span-2 p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 flex flex-col justify-between space-y-6 relative overflow-hidden">
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                    {pronunciationList[selectedPronunciationIndex].subject}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Phonetic Practice Card
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-amber-300 tracking-tight">
                  "{pronunciationList[selectedPronunciationIndex].phrase}"
                </h2>

                <p className="text-sm font-mono text-indigo-200">
                  Phonetics: {pronunciationList[selectedPronunciationIndex].phonetic}
                </p>
              </div>

              {/* Action Buttons: Listen vs Record */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleListenPronunciationNative(pronunciationList[selectedPronunciationIndex].phrase)}
                  className="py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Volume2 className="w-4 h-4 text-amber-300" />
                  <span>🔊 Listen Native Audio</span>
                </button>

                <button
                  type="button"
                  onClick={handleRecordPronunciation}
                  disabled={isRecordingPronunciation}
                  className={`py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                    isRecordingPronunciation
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <Mic className="w-4 h-4 text-amber-300" />
                  <span>{isRecordingPronunciation ? 'Recording Speech...' : '🎙️ Record My Pronunciation'}</span>
                </button>
              </div>

              {/* Real-time Accuracy Feedback Box */}
              {(pronunciationFeedback || pronunciationScore !== null) && (
                <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>Spoken Detection:</span>
                    {pronunciationScore !== null && (
                      <span className="text-emerald-400 font-extrabold text-sm">
                        Accuracy Score: {pronunciationScore}%
                      </span>
                    )}
                  </div>

                  {userSpokenText && (
                    <p className="text-xs text-amber-200 font-mono italic">
                      "{userSpokenText}"
                    </p>
                  )}

                  <p className="text-xs text-slate-200 font-medium">
                    {pronunciationFeedback}
                  </p>

                  {pronunciationScore !== null && (
                    <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-500"
                        style={{ width: `${pronunciationScore}%` }}
                      />
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* Voice Lessons Catalog Modal / Drawer */}
      {activeTabMode === 'catalog' && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-2xl w-full space-y-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Select AI Voice Lesson
              </h3>
              <button
                onClick={() => setActiveTabMode('classroom')}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 font-bold text-xs"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {VOICE_LESSONS_CATALOG.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedClass(c);
                    setCurrentSlideIndex(0);
                    setActiveTabMode('classroom');
                    if (synthRef.current) synthRef.current.cancel();
                    setIsPlaying(false);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    selectedClass.id === c.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 shadow-md ring-2 ring-indigo-500'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                      {c.subject}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      ⏱️ {c.durationMinutes} mins
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-slate-800 dark:text-slate-100">
                    {c.title}
                  </h4>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {c.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 text-[10px] font-bold text-slate-400">
                    <span>👨‍🏫 {c.teacherName}</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">
                      Start Voice Class →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
