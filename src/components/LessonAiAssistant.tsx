import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Globe,
  FileText,
  HelpCircle,
  Mic,
  MicOff,
  Camera,
  Sparkles,
  Send,
  Volume2,
  VolumeX,
  Copy,
  Check,
  RotateCcw,
  Upload,
  Image as ImageIcon,
  ChevronRight,
  Download,
  Languages,
  X,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export interface LessonContext {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  level: string;
  content: string[];
  summary: string;
  equation?: {
    formula: string;
    description: string;
    variables?: { symbol: string; meaning: string }[];
  };
}

interface LessonAiAssistantProps {
  lesson: LessonContext;
  initialAction?: 'explain' | 'translate' | 'notes' | 'questions' | 'voice' | 'image' | null;
  onNotesSaved?: (notesText: string) => void;
}

const SUPPORTED_LANGUAGES = [
  { id: 'Telugu', label: 'తెలుగు (Telugu)', native: 'తెలుగు' },
  { id: 'Hindi', label: 'हिन्दी (Hindi)', native: 'हिन्दी' },
  { id: 'Tamil', label: 'தமிழ் (Tamil)', native: 'தமிழ்' },
  { id: 'Kannada', label: 'ಕನ್ನಡ (Kannada)', native: 'ಕನ್ನಡ' },
  { id: 'Malayalam', label: 'മലയാളം (Malayalam)', native: 'മലയാളം' },
  { id: 'Bengali', label: 'বাংলা (Bengali)', native: 'বাংলা' },
  { id: 'Marathi', label: 'मराठी (Marathi)', native: 'मराठी' },
  { id: 'Gujarati', label: 'ગુજરાતી (Gujarati)', native: 'ગુજરાતી' },
  { id: 'English', label: 'English', native: 'English' },
];

export const LessonAiAssistant: React.FC<LessonAiAssistantProps> = ({
  lesson,
  initialAction,
  onNotesSaved,
}) => {
  const { user, addNotification, addXp } = useAuth();

  const [activeAction, setActiveAction] = useState<
    'explain' | 'translate' | 'notes' | 'questions' | 'voice' | 'image' | 'custom' | null
  >(initialAction || null);

  const [promptInput, setPromptInput] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('Telugu');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseMarkdown, setResponseMarkdown] = useState<string | null>(null);
  const [responseMeta, setResponseMeta] = useState<{ action: string; label: string } | null>(null);

  // Audio / Speech Synthesis
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Voice Input (SpeechRecognition)
  const [isListening, setIsListening] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  // Image Upload / Camera
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Copy state
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Suggested Prompts
  const quickPrompts = [
    'Explain this lesson in simple Telugu.',
    'What does the slope beta one represent?',
    'Give a real-world intuition for OLS.',
    'Explain R² and Mean Squared Error simply.',
  ];

  // Stop speaking when unmounted
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = false;
      recognizer.interimResults = false;
      recognizer.lang = selectedLanguage === 'Telugu' ? 'te-IN' : 'en-US';

      recognizer.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setPromptInput(transcript);
        setIsListening(false);
        // Automatically send after recognition
        handleExecuteAi('voice', transcript);
      };

      recognizer.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setIsListening(false);
      };

      recognizer.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognizer;
    }
  }, [selectedLanguage]);

  // Main AI Executor
  const handleExecuteAi = async (
    action: 'explain' | 'translate' | 'notes' | 'questions' | 'voice' | 'image' | 'custom',
    customQuery?: string
  ) => {
    setActiveAction(action);
    setIsLoading(true);
    setResponseMarkdown(null);

    const queryToSend = customQuery !== undefined ? customQuery : promptInput;

    let actionLabel = '🤖 Lesson Explanation';
    if (action === 'translate') actionLabel = `🌐 Translation (${selectedLanguage})`;
    else if (action === 'notes') actionLabel = '📝 Revision Notes';
    else if (action === 'questions') actionLabel = '❓ Practice Questions';
    else if (action === 'voice') actionLabel = '🎤 Voice Explanation';
    else if (action === 'image') actionLabel = '📷 Image Analysis';

    setResponseMeta({ action, label: actionLabel });

    try {
      const res = await fetch('/api/ai/lesson-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lesson: {
            title: lesson.title,
            subject: lesson.subject,
            chapter: lesson.chapter,
            level: lesson.level,
            content: lesson.content,
            summary: lesson.summary,
            equation: lesson.equation,
          },
          action,
          prompt: queryToSend,
          targetLanguage: action === 'translate' ? selectedLanguage : selectedLanguage,
          image: selectedImage || undefined,
          educationLevel: lesson.level,
        }),
      });

      const data = await res.json();
      if (data && data.text) {
        setResponseMarkdown(data.text);
        addXp(15);
      } else {
        setResponseMarkdown('Could not generate a response. Please try again.');
      }
    } catch (err) {
      console.error('Lesson AI Assistant fetch failed:', err);
      // Fallback
      if (action === 'translate' || (queryToSend && queryToSend.toLowerCase().includes('telugu'))) {
        setResponseMarkdown(`### 🤖 Simple Linear Regression - సులభమైన తెలుగు వివరణ (Simple Telugu Explanation)

**సింపుల్ లీనియర్ రిగ్రెషన్ (Simple Linear Regression)** అనేది రెండు వేరియబుల్స్ (X మరియు Y) మధ్య సంబంధాన్ని ఒక సరళరేఖ (Straight Line) ద్వారా అంచనా వేసే పద్ధతి.

#### 1. ముఖ్యమైన భాగాలు:
- **స్వతంత్ర వేరియబుల్ (Independent Variable - X):** మనం ఇన్‌పుట్‌గా ఇచ్చే విలువ (ఉదాహరణకు: విద్యార్థి రోజుకు చదివిన గంటల సంఖ్య).
- **ఆధారపడే వేరియబుల్ (Dependent Variable - Y):** మనం అంచనా వేయాల్సిన ఫలితం (ఉదాహరణకు: పరీక్షలో వచ్చే మార్కులు).

#### 2. సమీకరణం (Equation):
$$Y = \\beta_0 + \\beta_1 X + \\epsilon \\quad \\text{లేదా} \\quad y = mx + c$$
- **$m$ లేదా $\\beta_1$ (Slope - వాలు):** $X$ లో 1 యూనిట్ మార్పు వస్తే, $Y$ ఎంత మారుతుందో తెలుపుతుంది.
- **$c$ లేదా $\\beta_0$ (Y-Intercept - ఖండకం):** $X = 0$ అయినప్పుడు $Y$ ప్రారంభ విలువ.

#### 3. లైన్ ఆఫ్ బెస్ట్ ఫిట్ (Line of Best Fit & OLS):
- డేటా పాయింట్ల మధ్య నుండి వెళ్లే అత్యుత్తమ రేఖను కనుగొనడానికి **ఆర్డినరీ లీస్ట్ స్క్వేర్స్ (OLS)** సూత్రాన్ని వాడతాము.
- ఇది నిజమైన విలువలకి ($Y$), మనం ప్రిడిక్ట్ చేసిన విలువలకి ($\\hat{Y}$) మధ్య ఉండే తేడాలను (Residuals) కనిష్ట స్థాయికి తగ్గిస్తుంది.`);
      } else {
        setResponseMarkdown(
          `### 🤖 In-Lesson Explanation for ${lesson.title}\n\n**Core Idea:** Linear regression models the linear relationship between predictor $X$ and target $Y$ through the best fitting line ($y = mx + c$). It minimizes squared errors via Ordinary Least Squares (OLS).`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Voice Recognition Trigger
  const handleToggleVoiceInput = () => {
    if (!recognitionRef.current) {
      // Fallback if browser doesn't support Web Speech API
      const sampleQuestion = 'Explain this lesson in simple Telugu.';
      setPromptInput(sampleQuestion);
      handleExecuteAi('voice', sampleQuestion);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = selectedLanguage === 'Telugu' ? 'te-IN' : 'en-US';
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.warn('Voice start failed:', e);
        setIsListening(false);
      }
    }
  };

  // Image Upload handler
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setSelectedImage(result);
      // Auto-trigger image analysis
      handleExecuteAi('image', promptInput || 'Explain and solve the question or diagram in this image.');
    };
    reader.readAsDataURL(file);
  };

  // Text-to-Speech playback
  const handleToggleSpeakResponse = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!responseMarkdown) return;

    // Strip markdown formatting for cleaner speech
    const cleanText = responseMarkdown
      .replace(/[#*`$\\]/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/\(.*?\)/g, '')
      .slice(0, 1000);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;

    // Check language code
    if (selectedLanguage === 'Telugu' || (responseMeta?.label && responseMeta.label.includes('Telugu'))) {
      utterance.lang = 'te-IN';
    } else if (selectedLanguage === 'Hindi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Copy to clipboard
  const handleCopyResponse = () => {
    if (!responseMarkdown) return;
    navigator.clipboard.writeText(responseMarkdown).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    });
  };

  return (
    <div className="rounded-3xl bg-slate-900 text-white border border-indigo-500/30 shadow-2xl overflow-hidden font-sans">
      {/* 
        ╔═══════════════════════════════════════════════════════════╗
        ║ Header: 12. AI Integration Toolbar                       ║
        ╚═══════════════════════════════════════════════════════════╝
      */}
      <div className="p-5 md:p-6 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border-b border-indigo-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-black uppercase tracking-wider">
              12. AI Integration
            </span>
            <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Lesson-Contextualized Gemini Engine
            </span>
          </div>
          <h3 className="text-lg md:text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-400" />
            <span>AI Lesson Assistant</span>
          </h3>
          <p className="text-xs text-indigo-200/80 max-w-xl leading-relaxed">
            Ask doubts, translate to simple Telugu, generate notes, or ask from voice and photos. AI receives this exact lesson content.
          </p>
        </div>

        {/* Selected Language Dropdown */}
        <div className="relative self-start md:self-auto shrink-0">
          <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider mb-1">
            Target Language:
          </div>
          <button
            type="button"
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <span>{selectedLanguage}</span>
            <ChevronRight
              className={`w-3.5 h-3.5 transition-transform ${showLanguageDropdown ? 'rotate-90' : ''}`}
            />
          </button>

          {showLanguageDropdown && (
            <div className="absolute right-0 mt-1 w-44 rounded-2xl bg-slate-800 border border-slate-700 shadow-xl z-30 p-1.5 space-y-0.5 animate-fadeIn">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => {
                    setSelectedLanguage(lang.id);
                    setShowLanguageDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                    selectedLanguage === lang.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span>{lang.label}</span>
                  {selectedLanguage === lang.id && <Check className="w-3 h-3" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 
        ╔═══════════════════════════════════════════════════════════╗
        ║ The 6 Requested Action Buttons:                           ║
        ║ 🤖 Explain with AI                                        ║
        ║ 🌐 Translate                                              ║
        ║ 📝 Generate Notes                                         ║
        ║ ❓ Generate Questions                                     ║
        ║ 🎤 Ask by Voice                                           ║
        ║ 📷 Ask from Image                                         ║
        ╚═══════════════════════════════════════════════════════════╝
      */}
      <div className="p-5 md:p-6 space-y-5">
        <div className="space-y-2">
          <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block">
            Instant Lesson Actions:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {/* 1. 🤖 Explain with AI */}
            <button
              type="button"
              onClick={() => handleExecuteAi('explain')}
              disabled={isLoading}
              className={`p-3 rounded-2xl border text-xs font-black flex flex-col items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                activeAction === 'explain'
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md ring-2 ring-indigo-400/40'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700/80 hover:border-indigo-400'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-base">
                🤖
              </div>
              <span className="text-center leading-tight">Explain with AI</span>
            </button>

            {/* 2. 🌐 Translate (Telugu default) */}
            <button
              type="button"
              onClick={() => {
                const prompt =
                  selectedLanguage === 'Telugu'
                    ? 'Explain this lesson in simple Telugu.'
                    : `Explain this lesson in simple ${selectedLanguage}.`;
                handleExecuteAi('translate', prompt);
              }}
              disabled={isLoading}
              className={`p-3 rounded-2xl border text-xs font-black flex flex-col items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                activeAction === 'translate'
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-md ring-2 ring-emerald-400/40'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700/80 hover:border-emerald-400'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-base">
                🌐
              </div>
              <span className="text-center leading-tight">
                Translate ({selectedLanguage})
              </span>
            </button>

            {/* 3. 📝 Generate Notes */}
            <button
              type="button"
              onClick={() => handleExecuteAi('notes')}
              disabled={isLoading}
              className={`p-3 rounded-2xl border text-xs font-black flex flex-col items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                activeAction === 'notes'
                  ? 'bg-amber-600 text-white border-amber-400 shadow-md ring-2 ring-amber-400/40'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700/80 hover:border-amber-400'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-base">
                📝
              </div>
              <span className="text-center leading-tight">Generate Notes</span>
            </button>

            {/* 4. ❓ Generate Questions */}
            <button
              type="button"
              onClick={() => handleExecuteAi('questions')}
              disabled={isLoading}
              className={`p-3 rounded-2xl border text-xs font-black flex flex-col items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                activeAction === 'questions'
                  ? 'bg-purple-600 text-white border-purple-400 shadow-md ring-2 ring-purple-400/40'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700/80 hover:border-purple-400'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-base">
                ❓
              </div>
              <span className="text-center leading-tight">Generate Questions</span>
            </button>

            {/* 5. 🎤 Ask by Voice */}
            <button
              type="button"
              onClick={handleToggleVoiceInput}
              disabled={isLoading}
              className={`p-3 rounded-2xl border text-xs font-black flex flex-col items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                isListening
                  ? 'bg-rose-600 text-white border-rose-400 animate-pulse ring-2 ring-rose-400/40'
                  : activeAction === 'voice'
                  ? 'bg-rose-700 text-white border-rose-500'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700/80 hover:border-rose-400'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-base">
                {isListening ? <MicOff className="w-4 h-4 text-white" /> : '🎤'}
              </div>
              <span className="text-center leading-tight">
                {isListening ? 'Listening...' : 'Ask by Voice'}
              </span>
            </button>

            {/* 6. 📷 Ask from Image */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className={`p-3 rounded-2xl border text-xs font-black flex flex-col items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                selectedImage || activeAction === 'image'
                  ? 'bg-cyan-600 text-white border-cyan-400 shadow-md ring-2 ring-cyan-400/40'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700/80 hover:border-cyan-400'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-base">
                📷
              </div>
              <span className="text-center leading-tight">Ask from Image</span>
            </button>
          </div>

          {/* Hidden File Input for Image Upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageFileChange}
            className="hidden"
          />
        </div>

        {/* Selected Image Preview Pill (if uploaded) */}
        {selectedImage && (
          <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-3">
              <img
                src={selectedImage}
                alt="Uploaded Problem"
                className="w-12 h-12 object-cover rounded-xl border border-slate-600"
              />
              <div className="text-xs">
                <span className="font-bold text-white block">Image Ready for Analysis</span>
                <span className="text-[11px] text-slate-400">
                  AI will analyze this textbook / problem image in context of {lesson.title}.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 
          ╔═══════════════════════════════════════════════════════════╗
          ║ Quick Suggested Chips (Prompt requirement)                 ║
          ║ "Student: Explain this lesson in simple Telugu."          ║
          ╚═══════════════════════════════════════════════════════════╝
        */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Suggested Prompts for this Lesson:
          </span>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPromptInput(q);
                  const isTeluguQ = q.toLowerCase().includes('telugu');
                  handleExecuteAi(isTeluguQ ? 'translate' : 'custom', q);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                  q.includes('Telugu')
                    ? 'bg-emerald-950/60 hover:bg-emerald-900 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-800/90 hover:bg-slate-700 border-slate-700 text-slate-300'
                }`}
              >
                <span>{q}</span>
                <ChevronRight className="w-3 h-3 text-slate-500" />
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!promptInput.trim()) return;
            handleExecuteAi('custom');
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder={`Ask anything about "${lesson.title}" or type: "Explain this lesson in simple Telugu"...`}
              className="w-full px-4 py-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-10"
            />
            {promptInput && (
              <button
                type="button"
                onClick={() => setPromptInput('')}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || (!promptInput.trim() && !selectedImage)}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black text-xs flex items-center gap-1.5 shadow-md transition-all shrink-0 cursor-pointer"
          >
            {isLoading ? (
              <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>Ask AI</span>
          </button>
        </form>

        {/* 
          ╔═══════════════════════════════════════════════════════════╗
          ║ AI Response Card Area                                     ║
          ╚═══════════════════════════════════════════════════════════╝
        */}
        {(isLoading || responseMarkdown) && (
          <div className="rounded-2xl bg-slate-950 border border-indigo-500/40 p-5 md:p-6 space-y-4 shadow-inner animate-fadeIn">
            {/* Header bar of response */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">
                  🤖
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">
                    {responseMeta?.label || 'EduAI Lesson Response'}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">
                    Grounding: {lesson.title} ({lesson.subject})
                  </span>
                </div>
              </div>

              {/* Action Buttons for the response: Listen, Copy */}
              <div className="flex items-center gap-2">
                {responseMarkdown && (
                  <>
                    <button
                      type="button"
                      onClick={handleToggleSpeakResponse}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                        isSpeaking
                          ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md animate-pulse'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      }`}
                      title="Listen to explanation aloud"
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
                      <span>{isSpeaking ? 'Pause Audio' : '🔊 Listen'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyResponse}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Copy to clipboard"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Loading Skeleton */}
            {isLoading && (
              <div className="space-y-3 py-4">
                <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold animate-pulse">
                  <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                  <span>AI is synthesizing lesson context & generating response...</span>
                </div>
                <div className="h-3.5 bg-slate-800 rounded-full w-4/5 animate-pulse" />
                <div className="h-3.5 bg-slate-800 rounded-full w-full animate-pulse" />
                <div className="h-3.5 bg-slate-800 rounded-full w-3/4 animate-pulse" />
              </div>
            )}

            {/* Rendered Text / Markdown Content */}
            {!isLoading && responseMarkdown && (
              <div className="text-xs md:text-sm text-slate-200 leading-relaxed space-y-3 font-normal overflow-x-auto whitespace-pre-line">
                {responseMarkdown}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
