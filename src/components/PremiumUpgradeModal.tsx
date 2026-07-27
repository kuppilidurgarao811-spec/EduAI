import React, { useState } from 'react';
import {
  Crown,
  Sparkles,
  Zap,
  CheckCircle2,
  X,
  ShieldCheck,
  Infinity as InfinityIcon,
  BookOpen,
  Calendar,
  Volume2,
  Lock,
  ArrowRight,
  Star,
  Check,
  CreditCard,
  QrCode,
  Smartphone,
  Gift,
  Flame,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PremiumUpgradeModal: React.FC = () => {
  const {
    showPremiumModal,
    setShowPremiumModal,
    isPremium,
    subscriptionPlan,
    upgradeToPremium,
    cancelPremium,
  } = useAuth();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('student@upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!showPremiumModal) return null;

  const handlePayment = (planName: 'Pro Monthly' | 'Ultra Annual') => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        upgradeToPremium(planName);
        setPaymentSuccess(false);
      }, 1500);
    }, 1200);
  };

  const FEATURES_COMPARISON = [
    {
      feature: 'Unlimited AI Chat & Voice Tutor',
      description: 'Zero daily limits, zero rate limits, instantaneous priority responses',
      free: '10 msgs / day',
      pro: '⚡ Unlimited',
      ultra: '⚡ Unlimited + Priority',
      icon: InfinityIcon,
    },
    {
      feature: 'Advanced AI Explanations',
      description: 'Step-by-step derivations, real-world analogies, conceptual diagrams & exam tips',
      free: 'Basic Only',
      pro: '✅ Full Access',
      ultra: '✅ Deep Multi-Step',
      icon: Sparkles,
    },
    {
      feature: 'Personalized AI Study Plans',
      description: 'Tailored 7-day to 60-day schedules for Board Exams, EAMCET, JEE, UPSC & SSC',
      free: '1 Default Plan',
      pro: '✅ Custom Generator',
      ultra: '✅ Unlimited + Adaptive AI',
      icon: Calendar,
    },
    {
      feature: '100% Ad-Free Experience',
      description: 'Zero promotional ads, zero video delays, clean distraction-free study space',
      free: 'Ad-Supported',
      pro: '✨ 100% Ad-Free',
      ultra: '✨ 100% Ad-Free',
      icon: ShieldCheck,
    },
    {
      feature: 'Offline Handbook PDF Downloads',
      description: 'Download formula sheets, chapter notes & solved PYQs for offline study',
      free: '3 PDFs',
      pro: '20 PDFs / Mo',
      ultra: '⚡ Unlimited PDFs',
      icon: BookOpen,
    },
    {
      feature: 'AI Voice Classroom & Audio Lessons',
      description: 'Interactive natural voice dialogs with instant Telugu / Hindi switching',
      free: '2 Mins Preview',
      pro: '30 Mins / Day',
      ultra: '⚡ Unlimited Voice',
      icon: Volume2,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setShowPremiumModal(false)}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {paymentSuccess ? (
          /* Payment Success Screen */
          <div className="p-12 text-center space-y-6 animate-scaleUp">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Crown className="w-10 h-10 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100">
                Payment Successful! 🎉
              </h2>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                EduAI Premium Subscription Activated
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                You now have Unlimited AI Chat, Advanced Explanations, Personalized AI Study Plans, and an Ad-Free learning experience!
              </p>
            </div>
          </div>
        ) : (
          <div>
            {/* Top Gradient Banner */}
            <div className="p-6 md:p-8 bg-gradient-to-r from-amber-600 via-indigo-700 to-purple-800 text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400/20 text-amber-200 border border-amber-300/30 uppercase tracking-widest flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-amber-300" /> Unlock Superpowers
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20">
                    Special Student Offer • Save 50%
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                  EduAI Premium Membership
                </h2>
                <p className="text-xs md:text-sm text-indigo-100/90 leading-relaxed">
                  Supercharge your studies with Unlimited AI Chat, Advanced Step-by-Step Explanations, AI Personalized Study Plans, and a 100% Ad-Free experience.
                </p>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              {/* Highlighted 4 Key Features Pill Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/80 space-y-1">
                  <div className="p-2 rounded-xl bg-indigo-600 text-white w-fit">
                    <InfinityIcon className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">
                    Unlimited AI Chat
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">Zero daily message limits or rate caps</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/80 space-y-1">
                  <div className="p-2 rounded-xl bg-purple-600 text-white w-fit">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">
                    Advanced Explanations
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">Deep mathematical proofs & derivations</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 space-y-1">
                  <div className="p-2 rounded-xl bg-amber-500 text-white w-fit">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">
                    Personalized Plans
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">AI-tailored exam study timetables</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 space-y-1">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white w-fit">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">
                    100% Ad-Free
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">Zero sponsored ads or video delays</p>
                </div>
              </div>

              {/* Billing Cycle Selector */}
              <div className="flex items-center justify-center gap-3">
                <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-indigo-600 dark:text-indigo-400 font-black' : 'text-slate-500'}`}>
                  Monthly Billing
                </span>
                <button
                  type="button"
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                  className="w-14 h-7 rounded-full bg-indigo-600 p-1 transition-all relative flex items-center"
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${billingCycle === 'annual' ? 'translate-x-7' : 'translate-x-0'}`} />
                </button>
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-bold ${billingCycle === 'annual' ? 'text-indigo-600 dark:text-indigo-400 font-black' : 'text-slate-500'}`}>
                    Annual Billing
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white uppercase tracking-wider animate-pulse">
                    Save 50%
                  </span>
                </div>
              </div>

              {/* Pricing Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pro Monthly Plan */}
                <div className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                  billingCycle === 'monthly'
                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-lg ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        Monthly Pass
                      </span>
                      {subscriptionPlan === 'Pro Monthly' && isPremium && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500 text-white flex items-center gap-1">
                          <Check className="w-3 h-3" /> CURRENT PLAN
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">
                      EduAI Pro
                    </h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">₹199</span>
                      <span className="text-xs text-slate-500 font-bold">/ month</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Perfect for students preparing for school exams, class tests, and weekly homework assignments.
                    </p>
                  </div>

                  <ul className="space-y-2 text-xs font-medium text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-200/80 dark:border-slate-800">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span><strong>Unlimited AI Chat</strong> (Zero daily message cap)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span><strong>Advanced Explanations</strong> & proofs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span><strong>Personalized AI Study Plans</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span><strong>100% Ad-Free Experience</strong></span>
                    </li>
                  </ul>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handlePayment('Pro Monthly')}
                    className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <span>Processing Payment...</span>
                    ) : (
                      <>
                        <span>Activate Pro Monthly (₹199)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Ultra Annual Plan (Best Value) */}
                <div className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 relative ${
                  billingCycle === 'annual'
                    ? 'border-amber-500 dark:border-amber-500 bg-gradient-to-b from-amber-50/80 via-white to-amber-50/30 dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900 shadow-xl ring-2 ring-amber-500/30'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}>
                  <div className="absolute -top-3 right-6 px-3 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-500 to-orange-500 text-white uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Crown className="w-3 h-3" /> BEST VALUE • MOST POPULAR
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                        Annual All-Access Pass
                      </span>
                      {subscriptionPlan === 'Ultra Annual' && isPremium && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500 text-white flex items-center gap-1">
                          <Check className="w-3 h-3" /> CURRENT PLAN
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      EduAI Ultra Annual <Sparkles className="w-4 h-4 text-amber-500" />
                    </h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-amber-600 dark:text-amber-400">₹1,499</span>
                      <span className="text-xs text-slate-500 font-bold">/ year (~₹124/mo)</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      All Pro features plus Unlimited Offline PDF Handbook downloads & AI Voice Classroom access.
                    </p>
                  </div>

                  <ul className="space-y-2 text-xs font-medium text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-200/80 dark:border-slate-800">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                      <span><strong>All EduAI Pro Features Included</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                      <span><strong>Unlimited Offline PDF Vault Unlocks</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                      <span><strong>Unlimited Live AI Voice Classes</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                      <span><strong>Priority Parent Telemetry Reports</strong></span>
                    </li>
                  </ul>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handlePayment('Ultra Annual')}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <span>Activating Ultra Membership...</span>
                    ) : (
                      <>
                        <Crown className="w-4 h-4 text-amber-200" />
                        <span>Unlock Ultra Annual (₹1,499)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Instant Simulated Payment Method Selector */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-indigo-500" /> Instant Checkout Method
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">256-Bit Encrypted</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('upi')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      selectedMethod === 'upi'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" /> UPI / GPay / PhonePe
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('card')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      selectedMethod === 'card'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" /> Debit / Credit Card
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('netbanking')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      selectedMethod === 'netbanking'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" /> Net Banking
                  </button>
                </div>

                {selectedMethod === 'upi' && (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="Enter VPA / UPI ID (e.g., student@upi)"
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-bold"
                    />
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-950/80">
                      Auto-Verified
                    </span>
                  </div>
                )}
              </div>

              {/* Feature Comparison Matrix */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">
                  Detailed Feature Comparison Matrix
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 font-black uppercase text-[10px]">
                        <th className="py-3 px-4 rounded-l-xl">Feature</th>
                        <th className="py-3 px-4">Free Tier</th>
                        <th className="py-3 px-4 text-indigo-600 dark:text-indigo-400">Pro Monthly (₹199)</th>
                        <th className="py-3 px-4 text-amber-600 dark:text-amber-400 rounded-r-xl">Ultra Annual (₹1,499)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {FEATURES_COMPARISON.map((row, index) => {
                        const Icon = row.icon;
                        return (
                          <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-100">
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4 text-indigo-500 shrink-0" />
                                <div>
                                  <p>{row.feature}</p>
                                  <p className="text-[10px] text-slate-400 font-normal">{row.description}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-500 font-medium">{row.free}</td>
                            <td className="py-3 px-4 font-black text-indigo-600 dark:text-indigo-400">{row.pro}</td>
                            <td className="py-3 px-4 font-black text-amber-600 dark:text-amber-400">{row.ultra}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Guarantee Disclaimer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 text-xs text-indigo-900 dark:text-indigo-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                  <span>7-Day Money-Back Guarantee. Cancel anytime with 1-click in account settings.</span>
                </div>
                {isPremium && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Downgrade account back to Free plan?')) {
                        cancelPremium();
                        setShowPremiumModal(false);
                      }
                    }}
                    className="text-xs font-bold text-rose-600 hover:underline shrink-0"
                  >
                    Downgrade to Free
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
