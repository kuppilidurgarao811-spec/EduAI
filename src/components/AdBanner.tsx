import React from 'react';
import { Sparkles, Crown, ExternalLink, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AdBannerProps {
  type?: 'banner' | 'card' | 'inline';
}

export const AdBanner: React.FC<AdBannerProps> = ({ type = 'banner' }) => {
  const { isPremium, setShowPremiumModal } = useAuth();
  const [dismissed, setDismissed] = React.useState(false);

  // If user is premium, completely suppress ads
  if (isPremium) {
    return null;
  }

  if (dismissed) {
    return null;
  }

  if (type === 'card') {
    return (
      <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-indigo-500/10 to-purple-500/10 border border-amber-500/30 dark:border-amber-500/20 relative space-y-2">
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          title="Dismiss Ad"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider">
          <Sparkles className="w-3 h-3" /> Sponsored Partner Offer
        </div>

        <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">
          AP & TS EAMCET / JEE 2026 Master Question Bank
        </h4>
        <p className="text-[11px] text-slate-500 font-medium">
          Get 5000+ Solved PYQs with step-by-step video solutions from expert faculty.
        </p>

        <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-200/60 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setShowPremiumModal(true)}
            className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <Crown className="w-3 h-3 text-amber-500" /> Go Ad-Free with Premium
          </button>
          <a
            href="#courses"
            className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[10px] hover:bg-indigo-700 transition-colors"
          >
            View Book
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-indigo-600/15 to-purple-600/15 border border-indigo-500/20 dark:border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <Crown className="w-4 h-4 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500 text-white">
              Sponsored Ad
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              EAMCET / NEET / Board Exam Sample Test Papers
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Free tier is ad-supported. Upgrade to EduAI Premium to disable all ads & unlock Unlimited AI Chat!
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => setShowPremiumModal(true)}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 text-white font-black text-xs shadow-md hover:scale-105 transition-all flex items-center gap-1.5"
        >
          <Crown className="w-3.5 h-3.5 text-amber-200" />
          <span>Remove Ads (₹199)</span>
        </button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          title="Close ad"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
