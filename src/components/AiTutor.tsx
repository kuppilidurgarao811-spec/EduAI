import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Camera,
  Paperclip,
  Volume2,
  VolumeX,
  Languages,
  Calculator,
  Code,
  FileText,
  HelpCircle,
  RotateCcw,
  Download,
  Loader2,
  BookOpen,
  X,
  Check,
  Bot,
  User as UserIcon,
  Trash2,
  Crown,
  Zap,
  Infinity as InfinityIcon,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ChatMessage } from '../types';
import { PersonalizedStudyPlan } from './PersonalizedStudyPlan';
import { AdBanner } from './AdBanner';

export const AiTutor: React.FC = () => {
  const {
    user,
    educationLevel,
    language,
    chatHistory,
    addChatMessage,
    updateChatMessage,
    deleteChatMessage,
    clearChatHistory,
    isPremium,
    dailyAiMessagesCount,
    incrementAiMessageCount,
    setShowPremiumModal,
  } = useAuth();

  const [activeView, setActiveView] = useState<'chat' | 'study-plan'>('chat');
  const [inputPrompt, setInputPrompt] = useState('');
  const [selectedMode, setSelectedMode] = useState<string>('ask');
  const [selectedLang, setSelectedLang] = useState<string>(language);
  const [speedMode, setSpeedMode] = useState<'quick' | 'detailed'>('quick');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingAudioId, setIsPlayingAudioId] = useState<string | null>(null);

  // Attachment states
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  // Handle Speech-to-Text via Web Speech API if available
  const handleVoiceToggle = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser tab. You can type your question.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = selectedLang === 'Telugu' ? 'te-IN' : selectedLang === 'Hindi' ? 'hi-IN' : 'en-US';

      setIsRecording(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputPrompt((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (e) {
      console.error('Speech recognition error:', e);
      setIsRecording(false);
    }
  };

  // Text-To-Speech playback
  const handlePlayAudio = (msgId: string, text: string) => {
    if (isPlayingAudioId === msgId) {
      window.speechSynthesis.cancel();
      setIsPlayingAudioId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*#`]/g, ''));
    if (selectedLang === 'Telugu') utterance.lang = 'te-IN';
    else if (selectedLang === 'Hindi') utterance.lang = 'hi-IN';
    else utterance.lang = 'en-US';

    utterance.onend = () => setIsPlayingAudioId(null);
    utterance.onerror = () => setIsPlayingAudioId(null);

    setIsPlayingAudioId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Image Upload for OCR / Diagram / Handwritten question
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachedImage(reader.result as string);
      setAttachedFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const triggerSendMessageWithText = (text: string) => {
    setInputPrompt(text);
    setTimeout(() => {
      handleSendMessageCustom(text);
    }, 50);
  };

  const handleSendMessageCustom = async (promptOverride?: string) => {
    const textToSend = promptOverride ?? inputPrompt;
    if (!textToSend.trim() && !attachedImage) return;

    // Check message count limit for free users
    const canSend = incrementAiMessageCount();
    if (!canSend) {
      return;
    }

    const userText = textToSend;
    const imagePayload = attachedImage;
    const fileName = attachedFileName;

    // Reset local inputs
    setInputPrompt('');
    setAttachedImage(null);
    setAttachedFileName(null);

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: userText || (imagePayload ? 'Scanned image/document' : ''),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments: imagePayload
        ? [{ type: 'image', url: imagePayload, name: fileName || 'Uploaded Image' }]
        : undefined,
    };

    addChatMessage(userMsg);
    setIsLoading(true);

    const aiMsgId = `ai-${Date.now()}`;
    addChatMessage({
      id: aiMsgId,
      role: 'model',
      text: speedMode === 'quick' ? '⚡ *Generating quick answer...*' : '🧠 *Thinking step-by-step...*',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    try {
      if (imagePayload) {
        const res = await fetch('/api/ai/multimodal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: imagePayload,
            prompt: userText,
            taskType: selectedMode === 'math' ? 'handwritten' : 'ocr',
            educationLevel,
            subject: 'General',
            language: selectedLang,
          }),
        });
        const data = await res.json();
        updateChatMessage(aiMsgId, data.text || 'Unable to analyze image.');
      } else {
        const res = await fetch('/api/ai/ask-stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: userText,
            educationLevel,
            subject: 'General',
            language: selectedLang,
            mode: selectedMode,
            speedMode,
            history: chatHistory.slice(-6).map((m) => ({
              role: m.role,
              content: m.text,
            })),
          }),
        });

        if (!res.ok || !res.body) {
          throw new Error('Streaming failed');
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let fullText = '';
        let done = false;

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.replace('data: ', '').trim();
                if (dataStr === '[DONE]') break;
                try {
                  const parsed = JSON.parse(dataStr);
                  if (parsed.text) {
                    fullText += parsed.text;
                    updateChatMessage(aiMsgId, fullText);
                  }
                } catch (err) {
                  // Ignore JSON chunk parse error
                }
              }
            }
          }
        }

        if (!fullText) {
          updateChatMessage(aiMsgId, 'I was unable to generate a response. Please try asking again.');
        }
      }
    } catch (err: any) {
      console.error('Error contacting AI Tutor API:', err);
      updateChatMessage(
        aiMsgId,
        `💡 **Quick Answer for ${educationLevel}:**\n\n- **Core Concept:** Here is an instant summary for your query "${userText}".\n- **Key Point:** Make sure to check standard definitions and step-by-step formulas in your ${educationLevel} curriculum.\n- **Need More Details?** Switch mode to 🧠 Deep Explanation or try one of the quick preset questions below!`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    handleSendMessageCustom();
  };

  const handleExportNotes = () => {
    const textContent = chatHistory
      .map((m) => `[${m.role.toUpperCase()} - ${m.timestamp}]\n${m.text}\n`)
      .join('\n----------------------------------------\n\n');

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EduAI_Notes_${educationLevel.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto animate-in fade-in duration-200">
      
      {/* Top Workspace Tab Bar */}
      <div className="flex items-center justify-between gap-3 p-2 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveView('chat')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeView === 'chat'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>AI Chat Assistant & Doubt Solver</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('study-plan')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              activeView === 'study-plan'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Calendar className="w-4 h-4 text-amber-500" />
            <span>Personalized Study Plans</span>
          </button>
        </div>

        {/* Premium Status Pill */}
        {isPremium ? (
          <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-black flex items-center gap-1.5 shrink-0">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>PRO UNLIMITED CHAT ACTIVE</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              Free Daily Limits: <strong>{dailyAiMessagesCount}/10</strong> msgs
            </span>
            <button
              type="button"
              onClick={() => setShowPremiumModal(true)}
              className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-indigo-600 text-white text-xs font-black shadow-xs hover:scale-105 transition-all flex items-center gap-1"
            >
              <Crown className="w-3 h-3 text-amber-200" />
              <span>Upgrade</span>
            </button>
          </div>
        )}
      </div>

      {activeView === 'study-plan' && <PersonalizedStudyPlan />}

      {activeView === 'chat' && (
        <div className="flex flex-col h-[calc(100vh-10rem)] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          
          {/* Header Bar */}
          <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">
                    AI Chat Assistant & Doubt Solver
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Grade Level: <strong className="text-slate-700 dark:text-slate-200">{educationLevel}</strong>
                </p>
              </div>
            </div>

            {/* Toolbar Controls */}
            <div className="flex flex-wrap items-center gap-2">
              
              {/* Speed Mode Toggle */}
              <button
                type="button"
                onClick={() => setSpeedMode((prev) => (prev === 'quick' ? 'detailed' : 'quick'))}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs ${
                  speedMode === 'quick'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-700'
                    : 'bg-indigo-100 text-indigo-900 border border-indigo-300 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-700'
                }`}
                title="Toggle between Quick ⚡ fast answer and Detailed 🧠 in-depth step-by-step answer"
              >
                {speedMode === 'quick' ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-bounce" />
                    <span>⚡ Quick Answer (Fast)</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>🧠 In-Depth Mode</span>
                  </>
                )}
              </button>

              {/* Mode Selector */}
              <select
                value={selectedMode}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'advanced' && !isPremium) {
                    setShowPremiumModal(true);
                  }
                  setSelectedMode(val);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none"
              >
                <option value="ask">💬 Ask Any Question</option>
                <option value="advanced">⚡ Advanced Step-by-Step Proofs & Derivations (PRO)</option>
                <option value="math">🧮 Math Step-by-Step</option>
                <option value="diagram">🔬 Science Diagram Explainer</option>
                <option value="translate">🌐 Telugu/Hindi Translation</option>
                <option value="code">💻 Programming Assistant</option>
                <option value="notes">📝 Generate Summary Notes</option>
                <option value="quiz">🎯 Create Practice Quiz</option>
              </select>

          {/* Language Selector */}
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none"
          >
            <option value="English">🇬🇧 English</option>
            <option value="Telugu">🇮🇳 Telugu (తెలుగు)</option>
            <option value="Hindi">🇮🇳 Hindi (हिंदी)</option>
          </select>

          {/* Export Notes */}
          <button
            onClick={handleExportNotes}
            className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1 text-xs font-semibold"
            title="Download Notes as File"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Delete History Button */}
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete all chat history?')) {
                clearChatHistory();
              }
            }}
            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 transition-all flex items-center gap-1.5 text-xs font-extrabold shadow-xs"
            title="Delete Entire Chat History"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>Delete History</span>
          </button>

        </div>
      </div>

      {/* Feature Capabilities Highlight Bar */}
      <div className="px-5 py-2 bg-indigo-50/60 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between overflow-x-auto gap-3 text-[11px] font-semibold text-slate-700 dark:text-slate-300 shrink-0 no-scrollbar">
        <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="font-extrabold uppercase tracking-wider text-[10px]">AI Assistant Capabilities:</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
            💬 Ask Any Question
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
            ⚡ Instant AI Responses
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
            🎙️ Voice Input (Speech-to-Text)
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
            🔊 Text-to-Speech (Audio Player)
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
            📷 Image Upload for Problem Solving
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
            🌐 English, Telugu & Hindi Support
          </span>
        </div>
      </div>

      {/* Messages Stream Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {chatHistory.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-sm ${
                  isUser
                    ? 'bg-gradient-to-tr from-blue-600 to-indigo-600'
                    : 'bg-gradient-to-tr from-purple-600 to-indigo-600'
                }`}
              >
                {isUser ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Content Box */}
              <div
                className={`group relative p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
                }`}
              >
                {/* Individual Message Delete Button on hover */}
                <button
                  onClick={() => deleteChatMessage(msg.id)}
                  className={`absolute top-2 ${isUser ? 'left-2 text-white/70 hover:text-white' : 'right-2 text-slate-400 hover:text-rose-500'} opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md`}
                  title="Delete this message"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Image Attachments */}
                {msg.attachments && (
                  <div className="mb-2">
                    {msg.attachments.map((att, i) => (
                      <img
                        key={i}
                        src={att.url}
                        alt="Attached file"
                        className="max-w-xs max-h-48 rounded-xl object-contain border border-white/20"
                      />
                    ))}
                  </div>
                )}

                {/* Formatted Markdown-like text output */}
                <div className="whitespace-pre-wrap font-sans pr-4">
                  {msg.text}
                </div>

                {/* Audio TTS Button for Model answers */}
                {!isUser && (
                  <div className="pt-2 border-t border-slate-200/40 dark:border-slate-700/40 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{msg.timestamp}</span>
                    <button
                      onClick={() => handlePlayAudio(msg.id, msg.text)}
                      className="flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {isPlayingAudioId === msg.id ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                          <span>Stop Voice</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Listen Voice</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-3 mr-auto">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span>EduAI is thinking step-by-step in {selectedLang}...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Attachment Preview Drawer */}
      {attachedImage && (
        <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/40 border-t border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <Camera className="w-4 h-4" />
            <span>Image Attached: {attachedFileName || 'Scanned Document'}</span>
          </div>
          <button
            onClick={() => {
              setAttachedImage(null);
              setAttachedFileName(null);
            }}
            className="p-1 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-900 text-indigo-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input Action Bar */}
      <div className="p-3 md:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        <form onSubmit={handleSendMessage} className="space-y-2">
          
          <div className="flex items-center gap-2">
            
            {/* File / Image Attachment Button */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*,.pdf"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title="Upload Image or Document for OCR"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Camera Scanner Button */}
            <input
              type="file"
              ref={cameraInputRef}
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title="Take Photo of Textbook / Homework Question"
            >
              <Camera className="w-4 h-4" />
            </button>

            {/* Voice Mic Record Button */}
            <button
              type="button"
              onClick={handleVoiceToggle}
              className={`p-2.5 rounded-2xl transition-all ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
              title="Speak Question"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={
                isRecording
                  ? 'Listening... Speak now...'
                  : `Ask a question in ${selectedLang} for ${educationLevel}...`
              }
              className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs sm:text-sm outline-none transition-all"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={isLoading || (!inputPrompt.trim() && !attachedImage)}
              className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md disabled:opacity-50 transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>

          </div>

          {/* Quick Preset Prompts Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
            <span className="text-amber-500 font-extrabold shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Quick Questions:
            </span>
            <button
              type="button"
              onClick={() => triggerSendMessageWithText('Solve quadratic equation 2x² + 5x - 3 = 0 step by step')}
              className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200/80 dark:border-indigo-800 hover:bg-indigo-100 shrink-0"
            >
              ⚡ Quadratic Formula
            </button>
            <button
              type="button"
              onClick={() => triggerSendMessageWithText('Explain Photosynthesis concept in 3 clear bullet points')}
              className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200/80 dark:border-indigo-800 hover:bg-indigo-100 shrink-0"
            >
              🔬 Photosynthesis Summary
            </button>
            <button
              type="button"
              onClick={() => triggerSendMessageWithText('Translate to Telugu: "Hard work and consistency lead to academic success"')}
              className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200/80 dark:border-indigo-800 hover:bg-indigo-100 shrink-0"
            >
              🌐 Telugu Translation
            </button>
            <button
              type="button"
              onClick={() => triggerSendMessageWithText('Write Python binary search algorithm with line comments')}
              className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200/80 dark:border-indigo-800 hover:bg-indigo-100 shrink-0"
            >
              💻 Python Code
            </button>
            <button
              type="button"
              onClick={() => triggerSendMessageWithText('Explain Newton second law of motion with formula and example')}
              className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200/80 dark:border-indigo-800 hover:bg-indigo-100 shrink-0"
            >
              ⚡ Newton Physics Law
            </button>
          </div>

        </form>
      </div>
    </div>
  )}

    </div>
  );
};
