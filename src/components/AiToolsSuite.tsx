import React, { useState, useRef } from 'react';
import {
  Wrench,
  Camera,
  FileText,
  Code,
  CheckCircle2,
  Briefcase,
  Layers,
  Presentation,
  Compass,
  HelpCircle,
  Sparkles,
  Loader2,
  Copy,
  Check,
  Download,
  BookOpen,
  Volume2,
  RefreshCw,
  X,
  Upload,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type ToolType =
  | 'homework_solver'
  | 'ocr_scanner'
  | 'notes_generator'
  | 'flashcards_generator'
  | 'essay_writer'
  | 'code_generator'
  | 'code_debugger'
  | 'code_practice'
  | 'grammar_checker'
  | 'resume_builder'
  | 'placement_prep'
  | 'mind_map'
  | 'presentation'
  | 'career_guidance'
  | 'interview_prep';

export const AiToolsSuite: React.FC = () => {
  const { educationLevel, language } = useAuth();

  const [activeTool, setActiveTool] = useState<ToolType>('homework_solver');
  const [isLoading, setIsLoading] = useState(false);
  const [resultText, setResultText] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Camera State for Live Camera Scanning
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Form Inputs
  const [inputs, setInputs] = useState<Record<string, string>>({
    problem: 'Solve x² - 5x + 6 = 0 step by step and explain the factors simply.',
    topic: 'Impact of Artificial Intelligence on Future Education',
    wordCount: '350',
    codeLanguage: 'Python',
    task: 'Write a program to find the second largest element in an array',
    codeToDebug: 'def add_numbers(a, b):\nreturn a + b',
    textToGrammar: 'I goes to school yesterday and see a nice dog.',
    targetRole: 'Junior Software Engineer / Data Analyst',
    skills: 'Python, SQL, Problem Solving, Data Structures',
    careerInterest: 'Artificial Intelligence & Machine Learning',
  });

  const [ocrImage, setOcrImage] = useState<string | null>(null);

  const handleInputChange = (key: string, value: string) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setOcrImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Live Camera Controls
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      alert('Camera access unavailable or denied. Please upload an image photo instead.');
    }
  };

  const captureCameraPhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      const width = videoRef.current.videoWidth || 640;
      const height = videoRef.current.videoHeight || 480;
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      context?.drawImage(videoRef.current, 0, 0, width, height);
      const dataUrl = canvasRef.current.toDataURL('image/jpeg');
      setOcrImage(dataUrl);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const handleRunTool = async () => {
    setIsLoading(true);
    setResultText('');

    try {
      let res;
      if ((activeTool === 'ocr_scanner' || activeTool === 'homework_solver') && ocrImage) {
        res = await fetch('/api/ai/multimodal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: ocrImage,
            prompt: inputs.problem || 'Scan this homework question, provide step-by-step solutions, and explain concepts simply.',
            taskType: 'handwritten',
            educationLevel,
            language,
          }),
        });
      } else {
        res = await fetch('/api/ai/tools', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tool: activeTool,
            inputs,
            educationLevel,
            language,
          }),
        });
      }

      const data = await res.json();
      setResultText(data.text || 'Tool completed generation.');
    } catch (err: any) {
      console.error('Tool error:', err);
      setResultText('⚠️ Error generating response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const playTTS = async () => {
    if (!resultText) return;
    try {
      const res = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: resultText.slice(0, 400), voice: 'Kore' }),
      });
      const data = await res.json();
      if (data.audio) {
        const audio = new Audio(`data:audio/wav;base64,${data.audio}`);
        audio.play();
      } else if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(resultText.slice(0, 300));
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(resultText.slice(0, 300));
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toolsList = [
    { id: 'homework_solver', name: 'Homework & Doubt Solver', icon: HelpCircle, desc: 'Step-by-step math, science & image solution' },
    { id: 'ocr_scanner', name: 'OCR & Camera Scanner', icon: Camera, desc: 'Scan textbook questions with camera/photo' },
    { id: 'notes_generator', name: 'AI Notes Generator', icon: BookOpen, desc: 'Instant high-yield revision study notes' },
    { id: 'flashcards_generator', name: 'Interactive Flashcards', icon: Sparkles, desc: 'Generate Q&A cards for quick memory revision' },
    { id: 'code_practice', name: 'Coding Practice & DSA', icon: Code, desc: 'Problem statements, hints & optimal code' },
    { id: 'placement_prep', name: 'Placement Preparation', icon: Briefcase, desc: 'Aptitude, technical MCQs & HR prep' },
    { id: 'resume_builder', name: 'AI Resume Builder', icon: FileText, desc: 'Professional student CV & portfolio builder' },
    { id: 'career_guidance', name: 'AI Career Guidance', icon: Compass, desc: 'Career roadmap & skill recommendations' },
    { id: 'interview_prep', name: 'Interview Q&A Prep', icon: CheckCircle2, desc: 'Top company questions & sample answers' },
    { id: 'essay_writer', name: 'AI Essay Writer', icon: FileText, desc: 'Generate academic essays & reports' },
    { id: 'code_generator', name: 'AI Code Generator', icon: Code, desc: 'Write code in Python, C++, Java' },
    { id: 'code_debugger', name: 'AI Code Debugger', icon: Wrench, desc: 'Fix syntax and logic errors' },
    { id: 'grammar_checker', name: 'Grammar Checker', icon: CheckCircle2, desc: 'Correct grammar & polish writing' },
    { id: 'mind_map', name: 'Mind Map Generator', icon: Layers, desc: 'Visual tree outline for any subject' },
    { id: 'presentation', name: 'Presentation Generator', icon: Presentation, desc: 'Generate 5-slide deck outline' },
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Wrench className="w-6 h-6 text-indigo-600" />
            <span>EduAI Smart Productivity Tools</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            12 Specialized AI Utilities for homework, camera scanning, coding, resume, mind maps, and career growth
          </p>
        </div>
      </div>

      {/* Grid: Tools Selector Sidebar & Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tool Selector List (1 col) */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
            Select Tool
          </div>
          <div className="grid grid-cols-1 gap-2 max-h-[500px] overflow-y-auto pr-1">
            {toolsList.map((t) => {
              const Icon = t.icon;
              const isActive = activeTool === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTool(t.id as ToolType);
                    setResultText('');
                  }}
                  className={`p-3.5 rounded-2xl text-left border transition-all flex items-center gap-3 ${
                    isActive
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-white/20 text-white' : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-bold text-xs truncate">{t.name}</div>
                    <div
                      className={`text-[10px] truncate ${
                        isActive ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {t.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Workspace Form & Result Output (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
              <h2 className="font-extrabold text-base text-slate-800 dark:text-slate-100 capitalize">
                {activeTool.replace('_', ' ')}
              </h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                Level: {educationLevel}
              </span>
            </div>

            {/* Dynamic Inputs depending on selected tool */}
            {activeTool === 'homework_solver' && (
              <div className="space-y-4">
                
                {/* Mode Selector / Scan Buttons */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-indigo-600" />
                      <span>Scan Homework using Camera or Photo</span>
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                      Step-by-Step & Simple Concept Explanation
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {!isCameraActive ? (
                      <button
                        onClick={startCamera}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Open Camera to Scan</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={captureCameraPhoto}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Snap Photo</span>
                        </button>
                        <button
                          onClick={stopCamera}
                          className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Close Camera</span>
                        </button>
                      </div>
                    )}

                    <label className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-slate-50">
                      <Upload className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Upload Photo</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>

                  {/* Camera Live Stream Preview */}
                  {isCameraActive && (
                    <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-700 aspect-video max-h-56 flex items-center justify-center">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-red-600/90 text-white text-[10px] font-bold animate-pulse">
                        LIVE CAMERA
                      </div>
                    </div>
                  )}
                  <canvas ref={canvasRef} className="hidden" />

                  {/* Uploaded Scan Preview */}
                  {ocrImage && (
                    <div className="relative inline-block border rounded-xl overflow-hidden bg-slate-900 p-1">
                      <img src={ocrImage} alt="Homework Scan" className="max-h-36 rounded-lg object-contain" />
                      <button
                        onClick={() => setOcrImage(null)}
                        className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-white hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Text Problem Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Type / Edit Homework Question:
                    </label>
                    <span className="text-[10px] text-slate-400">Math, Physics, Chemistry, Biology & Programming</span>
                  </div>
                  <textarea
                    rows={3}
                    value={inputs.problem || ''}
                    onChange={(e) => handleInputChange('problem', e.target.value)}
                    placeholder="Enter equation, textbook question, or paste text..."
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>

                {/* Quick Sample Prompts */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Try Sample Problems:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Solve x² - 5x + 6 = 0 step by step',
                      'Find kinetic energy of 5kg mass moving at 10 m/s',
                      'Explain photosynthesis chemical equation simply',
                      'Factorize 3x² + 7x + 2 with formula',
                    ].map((sample, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleInputChange('problem', sample)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950 border border-slate-200 dark:border-slate-700"
                      >
                        {sample}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {activeTool === 'ocr_scanner' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Scan or Upload Photo of Textbook Question:
                  </label>
                  {!isCameraActive ? (
                    <button
                      onClick={startCamera}
                      className="px-3 py-1 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-1"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Use Camera</span>
                    </button>
                  ) : (
                    <button
                      onClick={captureCameraPhoto}
                      className="px-3 py-1 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Snap Capture</span>
                    </button>
                  )}
                </div>

                {isCameraActive && (
                  <div className="relative rounded-2xl overflow-hidden bg-black border aspect-video max-h-56 flex items-center justify-center">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {ocrImage && (
                  <img src={ocrImage} alt="Uploaded Scan" className="max-h-40 rounded-xl object-contain border" />
                )}
              </div>
            )}

            {activeTool === 'essay_writer' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Topic:</label>
                  <input
                    type="text"
                    value={inputs.topic || ''}
                    onChange={(e) => handleInputChange('topic', e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Word Count:</label>
                  <input
                    type="number"
                    value={inputs.wordCount || '300'}
                    onChange={(e) => handleInputChange('wordCount', e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>
              </div>
            )}

            {activeTool === 'code_generator' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Language:</label>
                  <select
                    value={inputs.codeLanguage || 'Python'}
                    onChange={(e) => handleInputChange('codeLanguage', e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 outline-none"
                  >
                    <option value="Python">Python</option>
                    <option value="C++">C++</option>
                    <option value="Java">Java</option>
                    <option value="JavaScript">JavaScript</option>
                  </select>
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Coding Task:</label>
                  <input
                    type="text"
                    value={inputs.task || ''}
                    onChange={(e) => handleInputChange('task', e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>
              </div>
            )}

            {activeTool === 'code_debugger' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Paste Code to Debug:</label>
                <textarea
                  rows={4}
                  value={inputs.codeToDebug || ''}
                  onChange={(e) => handleInputChange('codeToDebug', e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs outline-none"
                />
              </div>
            )}

            {activeTool === 'grammar_checker' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Paste Sentence / Essay:</label>
                <textarea
                  rows={3}
                  value={inputs.textToGrammar || ''}
                  onChange={(e) => handleInputChange('textToGrammar', e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>
            )}

            {(activeTool === 'notes_generator' || activeTool === 'flashcards_generator' || activeTool === 'code_practice' || activeTool === 'mind_map' || activeTool === 'presentation') && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Subject / Topic / Language:</label>
                <input
                  type="text"
                  value={inputs.topic || ''}
                  onChange={(e) => handleInputChange('topic', e.target.value)}
                  placeholder="e.g. Organic Chemistry, Python Data Structures, World War II..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>
            )}

            {(activeTool === 'resume_builder' || activeTool === 'career_guidance' || activeTool === 'interview_prep' || activeTool === 'placement_prep') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Role / Industry / Company:</label>
                  <input
                    type="text"
                    value={inputs.targetRole || ''}
                    onChange={(e) => handleInputChange('targetRole', e.target.value)}
                    placeholder="e.g. Software Engineer, Data Analyst, TCS, Infosys..."
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Key Skills / Focus Areas:</label>
                  <input
                    type="text"
                    value={inputs.skills || ''}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                    placeholder="e.g. Python, SQL, Communication, Aptitude..."
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>
              </div>
            )}

            {/* Run Button */}
            <button
              onClick={handleRunTool}
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Output with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Solution with EduAI</span>
                </>
              )}
            </button>

          </div>

          {/* Generated Result Output Box */}
          {resultText && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-md space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>AI Result Generated</span>
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={playTTS}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen Audio</span>
                  </button>
                  <button
                    onClick={copyResult}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Result'}</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 text-slate-800 dark:text-slate-100 text-xs leading-relaxed font-sans whitespace-pre-wrap">
                {resultText}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
