import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Laptop,
  Languages,
  Type,
  Shield,
  Eye,
  Trash2,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Info,
  Sliders,
  UserCheck,
  History,
  HardDrive,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Language, FontSize } from '../types';
import { SUPPORTED_LANGUAGES, getLanguageInfo } from '../utils/translations';

export const SettingsComponent: React.FC = () => {
  const {
    themeMode,
    setThemeMode,
    darkMode,
    language,
    setLanguage,
    fontSize,
    setFontSize,
    privacySettings,
    updatePrivacySettings,
    clearAllUserData,
    clearChatHistory,
    user,
    updateUser,
    educationLevel,
    setEducationLevel,
  } = useAuth();

  const [activeSection, setActiveSection] = useState<'all' | 'theme' | 'language' | 'font' | 'privacy'>('all');
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const sampleTexts = {
    English: 'EduAI provides step-by-step solutions for Math, Science & Competitive Exams.',
    Telugu: 'EduAI గణితం, సైన్స్ మరియు పోటీ పరీక్షల కొరకు ప్రతి దశలో వివరాలతో సహాయం చేస్తుంది.',
    Hindi: 'EduAI गणित, विज्ञान और प्रतियोगी परीक्षाओं के लिए चरण-दर-चरण समाधान प्रदान करता है।',
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <SettingsIcon className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black text-white">Application Settings</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-black border border-indigo-500/30">
                  SYSTEM CONTROL
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Customize appearance, regional language, text size, and data privacy options.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60 text-xs font-bold text-slate-300">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>{user.name} ({user.role})</span>
          </div>
        </div>
      </div>

      {/* Toast Banner */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-500 text-white text-xs font-bold shadow-lg flex items-center justify-between animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-100" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: '⚙️ All Settings', icon: Sliders },
          { id: 'theme', label: '🌙 Dark / Light Mode', icon: Moon },
          { id: 'language', label: '🌐 Language Selection', icon: Languages },
          { id: 'font', label: '🔤 Font Size Scaling', icon: Type },
          { id: 'privacy', label: '🛡️ Privacy & Security', icon: Shield },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeSection === tab.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 1. DARK / LIGHT MODE SECTION */}
        {(activeSection === 'all' || activeSection === 'theme') && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">
                  Theme Appearance
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Switch between Light, Dark, or System Sync mode
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { id: 'light', label: 'Light Mode', icon: Sun, desc: 'Clean high contrast' },
                { id: 'dark', label: 'Dark Mode', icon: Moon, desc: 'Eye-friendly twilight' },
                { id: 'system', label: 'System Auto', icon: Laptop, desc: 'Follow OS theme' },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = themeMode === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setThemeMode(item.id as any);
                      triggerToast(`Theme mode set to ${item.label}!`);
                    }}
                    className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between h-28 ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-600 dark:border-indigo-500 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-500/30'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                    </div>
                    <div>
                      <div className="font-black text-xs">{item.label}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{item.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
              <span>Current Status: <strong className="text-slate-900 dark:text-white uppercase">{darkMode ? 'Dark Canvas Active' : 'Light Canvas Active'}</strong></span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                Live Reactivity
              </span>
            </div>
          </div>
        )}

        {/* 2. LANGUAGE SELECTION SECTION */}
        {(activeSection === 'all' || activeSection === 'language') && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Languages className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">
                    Regional Language Preference (12 Supported)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Select your primary language for AI explanations, voice classes, and lesson notes
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-black border border-indigo-200 dark:border-indigo-800 hidden sm:block">
                Active: {getLanguageInfo(language).nativeName}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 max-h-96 overflow-y-auto p-1">
              {SUPPORTED_LANGUAGES.map((langItem) => {
                const isSelected = language === langItem.id;
                return (
                  <button
                    key={langItem.id}
                    type="button"
                    onClick={() => {
                      setLanguage(langItem.id);
                      triggerToast(`Language changed to ${langItem.nativeName}!`);
                    }}
                    className={`p-3.5 rounded-2xl text-left border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-600 dark:border-blue-500 text-blue-950 dark:text-blue-200 ring-2 ring-blue-500/30 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="font-black text-xs text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                        <span>{langItem.nativeName}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{langItem.description}</div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>

            {/* Language Live Preview Box */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-indigo-700 dark:text-indigo-300">
                  Live AI Output Sample ({getLanguageInfo(language).label}):
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  Voice Speech Code: {getLanguageInfo(language).speechCode}
                </span>
              </div>
              <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs leading-relaxed">
                "{getLanguageInfo(language).sampleText}"
              </p>
            </div>
          </div>
        )}

        {/* 3. FONT SIZE SCALING SECTION */}
        {(activeSection === 'all' || activeSection === 'font') && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                <Type className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">
                  Text Font Size Scaling
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Adjust UI text readability across the entire app
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
              {[
                { id: 'small', label: 'Small', px: '14px', sample: 'Aa' },
                { id: 'medium', label: 'Standard', px: '16px', sample: 'Aa' },
                { id: 'large', label: 'Large', px: '18px', sample: 'Aa' },
                { id: 'xlarge', label: 'Extra Large', px: '20px', sample: 'Aa' },
              ].map((fItem) => {
                const isSelected = fontSize === fItem.id;
                return (
                  <button
                    key={fItem.id}
                    type="button"
                    onClick={() => {
                      setFontSize(fItem.id as FontSize);
                      triggerToast(`Font size set to ${fItem.label} (${fItem.px})!`);
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? 'bg-purple-50 dark:bg-purple-950/50 border-purple-600 dark:border-purple-500 text-purple-950 dark:text-purple-200 ring-2 ring-purple-500/30'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <span className="font-black" style={{ fontSize: fItem.px }}>
                      {fItem.sample}
                    </span>
                    <span className="font-extrabold text-xs">{fItem.label}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">{fItem.px}</span>
                  </button>
                );
              })}
            </div>

            {/* Font Preview Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
              <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400 block">
                Live Typography Scaling Test:
              </span>
              <h4 className="font-black text-slate-900 dark:text-slate-100">
                Pythagoras Theorem: a² + b² = c²
              </h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                In a right-angled triangle, the square of the hypotenuse side is equal to the sum of squares of the other two sides.
              </p>
            </div>
          </div>
        )}

        {/* 4. PRIVACY & SECURITY SECTION */}
        {(activeSection === 'all' || activeSection === 'privacy') && (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">
                  Privacy & Data Controls
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage your data retention, profile visibility & history
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              {[
                {
                  key: 'saveAiChatHistory',
                  title: 'Save AI Chat & Doubt History',
                  desc: 'Store solved doubts & generated revision notes locally for review.',
                },
                {
                  key: 'publicLeaderboard',
                  title: 'Public Community Leaderboard',
                  desc: 'Show my XP, badge progress, and streak on class rankings.',
                },
                {
                  key: 'shareProgressWithTeachers',
                  title: 'Share Progress with Educators',
                  desc: 'Allow verified teachers & parents to view quiz performance.',
                },
                {
                  key: 'allowAnalytics',
                  title: 'Improve EduAI Analytics',
                  desc: 'Send anonymous error logs to optimize AI model accuracy.',
                },
                {
                  key: 'incognitoMode',
                  title: 'Incognito AI Doubt Mode 🕶️',
                  desc: 'Ask questions without logging them into session history.',
                },
              ].map((setting) => {
                const val = (privacySettings as any)[setting.key] ?? false;
                return (
                  <div
                    key={setting.key}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-extrabold text-xs text-slate-800 dark:text-slate-200">
                        {setting.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {setting.desc}
                      </div>
                    </div>

                    {/* Toggle switch */}
                    <button
                      type="button"
                      onClick={() => {
                        updatePrivacySettings({ [setting.key]: !val });
                        triggerToast(`Updated ${setting.title}!`);
                      }}
                      className={`w-12 h-6.5 rounded-full p-1 transition-colors relative shrink-0 ${
                        val ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform ${
                          val ? 'translate-x-5.5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Clear Data Action Area */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  clearChatHistory();
                  triggerToast('AI Chat History cleared successfully!');
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4 text-amber-500" />
                <span>Clear AI Chat History</span>
              </button>

              <button
                type="button"
                onClick={() => setShowClearConfirmModal(true)}
                className="w-full sm:w-auto px-4 py-2 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset Local Session Cache</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Clear Cache Modal */}
      {showClearConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-black text-slate-800 dark:text-slate-100 text-base">
                Reset Local Cache & Data?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                This will clear saved offline AI chats, search query histories, and local preferences stored on this device.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirmModal(false)}
                className="flex-1 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clearAllUserData();
                  setShowClearConfirmModal(false);
                  triggerToast('Local cache and user history reset!');
                }}
                className="flex-1 py-2.5 rounded-2xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-all shadow-md"
              >
                Yes, Reset Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
