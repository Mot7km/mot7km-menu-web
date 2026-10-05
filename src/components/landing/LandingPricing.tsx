'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap,
  ChevronDown,
  ShieldCheck,
  Clock,
  Layers,
  Calculator,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { getPricingPlans, getComparisonCategories, type PricingPlan } from '@/data/pricing';

const PRICING_DICTIONARY: Record<string, { ar: string; en: string }> = {
  // Pricing section headers
  'pricing.badge': {
    ar: 'أسعار شفافة وبسيطة',
    en: 'Simple, Transparent Pricing',
  },
  'pricing.title1': {
    ar: 'باقات',
    en: 'Pricing',
  },
  'pricing.title2': {
    ar: 'تناسب حجم عملك',
    en: 'That Fits Your Business',
  },
  'pricing.desc': {
    ar: 'ابدأ مجاناً وقم بترقية باقتك متى ما احتجت لمميزات أقوى وإدارة أعمق.',
    en: 'Start for free and upgrade your plan whenever you need stronger features and deeper management.',
  },

  // Calculator
  'pricing.calculatorTitle': {
    ar: 'حاسبة التوفير والعائد السنوي المتوقع',
    en: 'Interactive ROI & Branch Savings Calculator',
  },
  'pricing.calculatorDesc': {
    ar: 'حدد عدد الفروع أو الأجهزة للاستكشاف التلقائي للباقة والتوفير',
    en: 'Select your branch count to calculate monthly time and money saved',
  },
  'pricing.branchesLabel': {
    ar: 'عدد الفروع / النقاط النشطة:',
    en: 'Number of Branches / POS:',
  },
  'pricing.branchesUnit': {
    ar: 'فروع / أجهزة',
    en: 'branches / POS',
  },
  'pricing.monthlyTimeSaved': {
    ar: 'توفير وقت شهري',
    en: 'Monthly Time Saved',
  },
  'pricing.hoursUnit': {
    ar: 'ساعة',
    en: 'hrs',
  },
  'pricing.annualRoi': {
    ar: 'توفير سنوي متوقع',
    en: 'Est. Annual ROI',
  },
  'pricing.currency': {
    ar: 'ج.م',
    en: 'EGP',
  },
  'pricing.recommendedBadge': {
    ar: '🎯 الباقة المرشحة لفروعك',
    en: '🎯 Recommended For You',
  },
  'pricing.sliderTick1': {
    ar: '1 فرع',
    en: '1 Branch',
  },
  'pricing.sliderTick5': {
    ar: '5 فروع',
    en: '5 Branches',
  },
  'pricing.sliderTick10': {
    ar: '10 فروع',
    en: '10 Branches',
  },
  'pricing.sliderTick15': {
    ar: '15+ فرع',
    en: '15+ Branches',
  },

  // Billing toggle
  'pricing.monthly': {
    ar: 'شهري',
    en: 'Monthly',
  },
  'pricing.annually': {
    ar: 'سنوي',
    en: 'Annually',
  },
  'pricing.save': {
    ar: 'وفر 20% سنوياً',
    en: 'Save 20% Annually',
  },

  // Plan general
  'plan.popular': {
    ar: 'الأكثر طلباً',
    en: 'Most Popular',
  },
  'plan.choose': {
    ar: 'اختر الباقة',
    en: 'Choose Plan',
  },
  'plan.custom': {
    ar: 'تواصل معنا',
    en: 'Contact Us',
  },
  'plan.month': {
    ar: 'جنيه / شهر',
    en: 'EGP / month',
  },
  'plan.free': {
    ar: 'مجاناً',
    en: 'Free',
  },

  // Starter (p1)
  'p1.name': {
    ar: 'Starter',
    en: 'Starter',
  },
  'p1.sub': {
    ar: 'Smart QR Menu',
    en: 'Smart QR Menu',
  },
  'p1.desc': {
    ar: 'مثالي لبناء هوية رقمية احترافية بدون إعلانات.',
    en: 'Ideal for building a professional digital identity without ads.',
  },
  'p1.f1': {
    ar: 'منيو رقمي (QR Menu) بدون إعلانات',
    en: 'Ad-free Digital Menu (QR Menu)',
  },
  'p1.f2': {
    ar: 'إضافة تصنيفات ومنتجات غير محدودة',
    en: 'Unlimited categories and products',
  },
  'p1.f3': {
    ar: 'بحث متقدم وتخصيص هوية العلامة التجارية (Basic Branding)',
    en: 'Advanced search and basic branding',
  },
  'p1.f4': {
    ar: 'لوحة تحكم وتطبيق الجوال للمالك',
    en: 'Dashboard & mobile app for the owner',
  },
  'p1.f5': {
    ar: 'دعم فرع واحد (1 Branch)',
    en: '1 Branch support',
  },
  'p1.m1': {
    ar: 'بدون نقاط بيع (POS)',
    en: 'No POS terminal engine',
  },
  'p1.m2': {
    ar: 'بدون تقارير مبيعات متقدمة',
    en: 'No advanced sales reports',
  },

  // Pro (p3)
  'p3.name': {
    ar: 'Pro',
    en: 'Pro',
  },
  'p3.sub': {
    ar: 'Full POS & Staff',
    en: 'Full POS & Staff',
  },
  'p3.desc': {
    ar: 'نظام كاشير متكامل لإدارة العمليات اليومية.',
    en: 'A full POS system for daily operations.',
  },
  'p3.f1': {
    ar: 'كل مميزات باقة Business',
    en: 'All Business features',
  },
  'p3.f2': {
    ar: 'نظام كاشير (Full POS) يعمل بدون إنترنت',
    en: 'Offline-first POS cashier system',
  },
  'p3.f3': {
    ar: 'إدارة الموظفين والورديات (Shift Management)',
    en: 'Staff and shift management',
  },
  'p3.f4': {
    ar: 'تطبيق خاص لمدير الفرع',
    en: 'Branch manager mobile app',
  },
  'p3.f5': {
    ar: 'تقارير متقدمة',
    en: 'Advanced real-time reports',
  },
  'p3.f6': {
    ar: 'دعم فرع أو فرعين (حسب التغليف)',
    en: 'Support for 1-2 branches (by package)',
  },
  'p3.m1': {
    ar: 'صلاحيات مركزية متقدمة',
    en: 'No centralised advanced permissions',
  },

  // Enterprise (p5)
  'p5.name': {
    ar: 'Enterprise',
    en: 'Enterprise',
  },
  'p5.sub': {
    ar: 'Custom Solutions',
    en: 'Custom Solutions',
  },
  'p5.desc': {
    ar: 'للشركات الكبرى التي تحتاج حلولاً وتكاملات مخصصة.',
    en: 'For large enterprises needing custom solutions and integrations.',
  },
  'p5.f1': {
    ar: 'دعم عدد كبير من الفروع',
    en: 'Support for large number of branches',
  },
  'p5.f2': {
    ar: 'تدريب مخصص (Custom Onboarding)',
    en: 'Custom dedicated onboarding',
  },
  'p5.f3': {
    ar: 'دعم فني مخصص (Dedicated Support & SLA)',
    en: 'Dedicated support & SLA guarantee',
  },
  'p5.f4': {
    ar: 'مساعدة في نقل البيانات (Migration)',
    en: 'Data migration assistance',
  },
  'p5.f5': {
    ar: 'تكاملات مخصصة مستقبلاً (Custom Integrations)',
    en: 'Custom integrations & API webhooks',
  },

  // Trust badges
  'pricing.instantSetup': {
    ar: 'تفعيل فوري خلال 5 دقائق',
    en: 'Instant 5-Min Setup',
  },
  'pricing.moneyBack': {
    ar: 'ضمان تجربة بدون مخاطر 14 يوماً',
    en: '14-Day Money Back Guarantee',
  },
  'pricing.noCommission': {
    ar: 'صفر عمولات خفية على المبيعات',
    en: '0% Sales Commission Fee',
  },

  // Matrix comparison
  'pricing.showComparison': {
    ar: 'عرض جدول المقارنة الشامل للميزات',
    en: 'Show Full Feature Comparison Matrix',
  },
  'pricing.hideComparison': {
    ar: 'إخفاء جدول المقارنة الشامل',
    en: 'Hide Detailed Comparison Table',
  },
  'pricing.featureColumn': {
    ar: 'الميزة / الإمكانية',
    en: 'Feature / Capability',
  },

  // Free Plan (pf)
  'pf.name': {
    ar: 'الباقة المجانية',
    en: 'Free Plan',
  },
  'pf.sub': {
    ar: 'Free QR Menu',
    en: 'Free QR Menu',
  },
  'pf.heading': {
    ar: 'هل تبحث عن منيو إلكتروني فقط؟',
    en: 'Just looking for a Digital Menu?',
  },
  'pf.desc': {
    ar: 'ابدأ مجاناً بخطوات بسيطة واعرض منتجاتك لعملائك بطريقة عصرية تليق بعلامتك التجارية.',
    en: 'Start for free in simple steps and showcase your products to your customers in a modern way that fits your brand.',
  },
  'pf.f1': {
    ar: 'منيو رقمي (QR Menu)',
    en: 'Digital Menu (QR Menu)',
  },
  'pf.f2': {
    ar: 'لوحة تحكم وتطبيق الجوال للمالك',
    en: 'Dashboard & mobile app for the owner',
  },
  'pf.freeNote': {
    ar: 'مدى الحياة، متضمن إعلانات بسيطة',
    en: 'Free forever, includes basic ads',
  },
  'pf.cta': {
    ar: 'ابدأ مجاناً الآن',
    en: 'Start for Free Now',
  },
};

export function LandingPricing() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const rawT = useTranslations();

  const [isAnnual, setIsAnnual] = useState(true);
  const [branches, setBranches] = useState(2);
  const [showComparison, setShowComparison] = useState(false);

  // Localization helper that safely falls back to PRICING_DICTIONARY
  const t = (key: string): string => {
    if (PRICING_DICTIONARY[key]) {
      return isRtl ? PRICING_DICTIONARY[key].ar : PRICING_DICTIONARY[key].en;
    }
    try {
      const translated = rawT(key as any);
      if (translated && translated !== key) return translated;
    } catch {
      // fallback to key
    }
    return key;
  };

  const plans = getPricingPlans(t);
  const comparisonCategories = getComparisonCategories(isRtl);

  // Dynamic ROI calculation metrics
  const hoursSavedPerMonth = branches * 12;
  const annualSavingsRiyal = branches * 6400;

  // Recommended plan based on branches count
  const recommendedPlanId = branches === 1 ? 'starter' : branches <= 5 ? 'pro' : 'enterprise';

  // Helper to compute discounted price
  const getDisplayPrice = (plan: PricingPlan) => {
    if (plan.price === 'Custom') return t('plan.custom');
    const numeric = parseInt(plan.price.replace(',', ''));
    if (isAnnual) {
      return Math.floor(numeric * 0.8).toLocaleString();
    }
    return plan.price;
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section id="plans" className="py-16 sm:py-24 md:py-32 bg-[var(--color-background)] relative overflow-hidden">
      {/* Anchor for #pricing links as well */}
      <div id="pricing" className="absolute -top-24 pointer-events-none" />

      {/* Atmospheric Background Ambient Glows */}
      <div className="absolute top-1/4 start-0 w-[550px] h-[550px] bg-[#2B9FD9]/10 dark:bg-[#2B9FD9]/15 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 end-0 w-[550px] h-[550px] bg-emerald-500/10 dark:bg-indigo-600/15 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100/90 dark:bg-white/[0.06] border border-slate-200/90 dark:border-white/15 text-slate-800 dark:text-white text-xs font-extrabold mb-6 backdrop-blur-md shadow-sm uppercase tracking-widest">
            <Zap size={14} className="text-[#2B9FD9] animate-pulse" />
            <span>{t('pricing.badge')}</span>
          </div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight drop-shadow-sm"
          >
            {t('pricing.title1')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2B9FD9] via-[#38BDF8] to-emerald-400">
              {t('pricing.title2')}
            </span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            {t('pricing.desc')}
          </motion.p>
        </div>

        {/* Interactive ROI & Branch Calculator Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="max-w-4xl mx-auto mb-12 sm:mb-16 bg-white/90 dark:bg-[#0c1626]/90 backdrop-blur-2xl border border-slate-200/90 dark:border-white/15 rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#2B9FD9]/10 text-[#2B9FD9] flex items-center justify-center border border-[#2B9FD9]/20 shrink-0">
              <Calculator size={20} />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {t('pricing.calculatorTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                {t('pricing.calculatorDesc')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Slider Column */}
            <div className="md:col-span-7 space-y-4">
              <div className="flex justify-between items-center text-sm font-extrabold">
                <span className="text-slate-800 dark:text-slate-200">
                  {t('pricing.branchesLabel')}
                </span>
                <span className="text-xl font-black text-[#2B9FD9] px-3 py-1 bg-[#2B9FD9]/10 rounded-xl border border-[#2B9FD9]/20">
                  {branches} {t('pricing.branchesUnit')}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={15}
                value={branches}
                onChange={(e) => setBranches(Number(e.target.value))}
                className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#2B9FD9]"
              />
              <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>{t('pricing.sliderTick1')}</span>
                <span>{t('pricing.sliderTick5')}</span>
                <span>{t('pricing.sliderTick10')}</span>
                <span>{t('pricing.sliderTick15')}</span>
              </div>
            </div>

            {/* Metrics Output Column */}
            <div className="md:col-span-5 grid grid-cols-2 gap-3 bg-slate-100/90 dark:bg-white/[0.04] p-4 rounded-2xl border border-slate-200/80 dark:border-white/10">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <Clock size={13} className="text-[#2B9FD9]" />
                  {t('pricing.monthlyTimeSaved')}
                </span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {hoursSavedPerMonth} {t('pricing.hoursUnit')}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <Sparkles size={13} className="text-emerald-500" />
                  {t('pricing.annualRoi')}
                </span>
                <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  +{annualSavingsRiyal.toLocaleString()} {t('pricing.currency')}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Billing Interval Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16 sm:mb-20"
        >
          <div className="relative flex items-center p-1.5 bg-slate-100 dark:bg-[#090d16] rounded-full border border-slate-200 dark:border-white/15 shadow-sm">
            <button
              onClick={() => setIsAnnual(false)}
              className={`relative z-10 px-7 py-3 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-300 cursor-pointer ${
                !isAnnual ? 'text-white' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {!isAnnual && (
                <motion.div
                  layoutId="billingToggle"
                  className="absolute inset-0 bg-gradient-to-r from-[#2B9FD9] to-emerald-500 rounded-full shadow-md shadow-[#2B9FD9]/25 -z-10"
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                />
              )}
              {t('pricing.monthly')}
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`relative z-10 px-7 py-3 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-300 cursor-pointer ${
                isAnnual ? 'text-white' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isAnnual && (
                <motion.div
                  layoutId="billingToggle"
                  className="absolute inset-0 bg-gradient-to-r from-[#2B9FD9] to-emerald-500 rounded-full shadow-md shadow-[#2B9FD9]/25 -z-10"
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                />
              )}
              {t('pricing.annually')}
            </button>
          </div>
          
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold rounded-full flex items-center gap-1.5 shadow-sm animate-pulse">
            <Sparkles size={14} />
            {t('pricing.save')}
          </div>
        </motion.div>

        {/* Main 3D Pricing Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mb-16 sm:mb-20 items-center [perspective:1200px]">
          {plans.map((plan, i) => {
            const isCustom = plan.price === 'Custom';
            const displayPrice = getDisplayPrice(plan);
            const originalPrice = isCustom ? null : parseInt(plan.price.replace(',', ''));
            const isAutoRecommended = plan.id === recommendedPlanId;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`group relative flex flex-col rounded-3xl md:rounded-[2.5rem] p-6 sm:p-8 md:p-10 transition-all duration-500 ${plan.color} ${plan.glow} transform-gpu [transform-style:preserve-3d] ${
                  plan.popular || isAutoRecommended
                    ? 'lg:-translate-y-6 z-20 lg:scale-105 shadow-xl shadow-[#2B9FD9]/20 dark:shadow-[0_0_50px_rgba(43,159,217,0.3)] ring-2 ring-[#2B9FD9] [transform:translateZ(30px)]'
                    : 'hover:-translate-y-2 z-10 shadow-md hover:shadow-xl hover:[transform:translateZ(20px)_rotateY(-2deg)]'
                }`}
              >
                {/* Sleek Top-Scoped Metallic Glass Reflection Glow */}
                <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-white/30 via-white/5 to-transparent dark:from-white/15 dark:via-white/[0.02] dark:to-transparent pointer-events-none rounded-t-[inherit] z-0" />

                {(plan.popular || isAutoRecommended) && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#2B9FD9] to-emerald-500 text-white px-6 py-1.5 rounded-full text-xs sm:text-sm font-extrabold shadow-md shadow-[#2B9FD9]/30 whitespace-nowrap z-30 tracking-wide">
                    {isAutoRecommended ? t('pricing.recommendedBadge') : t('plan.popular')}
                  </div>
                )}
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">{plan.name}</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm min-h-[40px] leading-relaxed font-medium mt-1">
                    {plan.description}
                  </p>
                  
                  <div className="flex items-end gap-2 mt-4">
                    <span className={`font-black text-slate-900 dark:text-white ${isCustom ? 'text-3xl sm:text-4xl' : 'text-5xl sm:text-6xl tracking-tighter'}`}>
                      {displayPrice}
                    </span>
                    {!isCustom && (
                      <div className="flex flex-col pb-2">
                        {isAnnual && originalPrice && (
                          <span className="text-xs text-slate-400 dark:text-slate-500 line-through font-bold mb-0.5">
                            {originalPrice.toLocaleString()}
                          </span>
                        )}
                        <span className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-bold">
                          {plan.priceNote}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-full h-px bg-slate-200 dark:bg-white/10 my-6" />

                <div className="flex-1 relative z-10">
                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                          <Check size={14} strokeWidth={3} />
                        </div>
                        <span className="text-slate-900 dark:text-slate-100 text-sm leading-relaxed font-extrabold">
                          {feature}
                        </span>
                      </li>
                    ))}
                    {plan.missing.map((feature, j) => (
                      <li key={`missing-${j}`} className="flex items-start gap-3 opacity-60">
                        <div className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-400 dark:text-slate-500">
                          <X size={14} strokeWidth={2} />
                        </div>
                        <span className="text-slate-400 dark:text-slate-500 text-sm leading-relaxed line-through font-medium">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="https://mot7km.store/#demo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-auto relative z-10"
                >
                  <button 
                    className={`w-full py-4 rounded-2xl font-extrabold text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer ${
                      plan.popular || isAutoRecommended
                        ? 'bg-gradient-to-r from-[#2B9FD9] to-emerald-500 hover:from-[#2181B5] hover:to-[#0D9668] text-white shadow-md shadow-[#2B9FD9]/25 hover:shadow-lg hover:shadow-[#2B9FD9]/40 hover:-translate-y-0.5' 
                        : 'bg-slate-900 hover:bg-black text-white dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:border dark:border-white/15'
                    }`}
                  >
                    <span>{t('plan.choose')}</span>
                    <ArrowIcon size={18} className="group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1" />
                  </button>
                </a>
              </motion.div>
            );
          })}
        </div>

        {/* Micro Trust Badges Bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 max-w-4xl mx-auto mb-16 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-extrabold">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100/90 dark:bg-white/[0.04] rounded-full border border-slate-200/80 dark:border-white/10 shadow-sm">
            <Zap size={16} className="text-amber-500 shrink-0" />
            <span>{t('pricing.instantSetup')}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100/90 dark:bg-white/[0.04] rounded-full border border-slate-200/80 dark:border-white/10 shadow-sm">
            <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
            <span>{t('pricing.moneyBack')}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100/90 dark:bg-white/[0.04] rounded-full border border-slate-200/80 dark:border-white/10 shadow-sm">
            <Layers size={16} className="text-[#2B9FD9] shrink-0" />
            <span>{t('pricing.noCommission')}</span>
          </div>
        </div>

        {/* Expandable Feature Comparison Matrix Toggle */}
        <div className="max-w-6xl mx-auto mb-16 text-center">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white font-extrabold text-sm sm:text-base transition-all shadow-md cursor-pointer"
          >
            <span>
              {showComparison ? t('pricing.hideComparison') : t('pricing.showComparison')}
            </span>
            <ChevronDown size={18} className={`transition-transform duration-300 ${showComparison ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showComparison && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="overflow-hidden mt-8 text-start"
              >
                <div className="bg-white/95 dark:bg-[#0c1626]/95 backdrop-blur-3xl border border-slate-200/90 dark:border-white/15 rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-2xl overflow-x-auto">
                  <table className="w-full text-sm text-slate-800 dark:text-slate-200 border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-black text-base">
                        <th className="py-4 px-4 text-start w-1/3">{t('pricing.featureColumn')}</th>
                        <th className="py-4 px-4 text-center w-1/5">{t('p1.name')}</th>
                        <th className="py-4 px-4 text-center w-1/5 text-[#2B9FD9]">{t('p3.name')}</th>
                        <th className="py-4 px-4 text-center w-1/5">{t('p5.name')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonCategories.map((cat, catIdx) => (
                        <tr key={catIdx} className="contents">
                          <td colSpan={4} className="py-4 px-4 bg-slate-100/90 dark:bg-white/[0.04] font-black text-slate-900 dark:text-white text-sm rounded-lg mt-4">
                            {cat.category}
                          </td>
                          {cat.items.map((item, itemIdx) => (
                            <tr key={itemIdx} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                              <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300">{item.name}</td>
                              <td className="py-3.5 px-4 text-center font-bold">
                                {typeof item.starter === 'boolean' ? (
                                  item.starter ? (
                                    <Check size={18} className="text-emerald-500 mx-auto" />
                                  ) : (
                                    <X size={18} className="text-slate-300 dark:text-slate-600 mx-auto" />
                                  )
                                ) : (
                                  <span className="text-slate-800 dark:text-slate-200">{item.starter}</span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-center font-extrabold text-[#2B9FD9] bg-[#2B9FD9]/5 dark:bg-[#2B9FD9]/10 rounded-lg">
                                {typeof item.pro === 'boolean' ? (
                                  item.pro ? (
                                    <Check size={18} className="text-emerald-500 mx-auto" />
                                  ) : (
                                    <X size={18} className="text-slate-300 dark:text-slate-600 mx-auto" />
                                  )
                                ) : (
                                  <span>{item.pro}</span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-center font-bold">
                                {typeof item.enterprise === 'boolean' ? (
                                  item.enterprise ? (
                                    <Check size={18} className="text-emerald-500 mx-auto" />
                                  ) : (
                                    <X size={18} className="text-slate-300 dark:text-slate-600 mx-auto" />
                                  )
                                ) : (
                                  <span className="text-slate-800 dark:text-slate-200">{item.enterprise}</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Free Plan Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative bg-white/95 dark:bg-[#0c1626]/95 backdrop-blur-3xl border border-slate-200/90 dark:border-white/15 rounded-2xl md:rounded-[2.5rem] p-6 sm:p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 shadow-xl dark:shadow-2xl overflow-hidden group transform-gpu">
            
            {/* Subtle animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#2B9FD9]/0 via-[#2B9FD9]/10 to-[#2B9FD9]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            
            {/* Left content */}
            <div className="flex-1 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-800 dark:text-white text-[11px] sm:text-xs font-extrabold mb-4 sm:mb-6 uppercase tracking-widest shadow-sm">
                <Sparkles size={14} className="text-[#2B9FD9] animate-pulse" />
                <span>{t('pf.name')}</span>
              </div>
              
              <h3 className="text-xl sm:text-2xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 sm:mb-4">
                {t('pf.heading')}
              </h3>
              
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-2xl leading-relaxed font-medium">
                {t('pf.desc')}
              </p>
              
              <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6">
                {[t('pf.f1'), t('pf.f2')].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-extrabold bg-slate-100/90 dark:bg-white/5 px-3.5 sm:px-4 py-2 rounded-full border border-slate-200/80 dark:border-white/10 backdrop-blur-md">
                    <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right block (Price + CTA) */}
            <div className="flex flex-col items-center gap-4 shrink-0 w-full md:w-auto mt-4 md:mt-0 relative z-10">
              <div className="text-center">
                <span className="block text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white drop-shadow-sm">
                  {t('plan.free')}
                </span>
                <span className="block text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold mt-1 sm:mt-2 max-w-[200px] mx-auto">
                  {t('pf.freeNote')}
                </span>
              </div>
              
              <a
                href="https://mot7km.store/#demo"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto"
              >
                <button className="w-full md:w-auto px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-black text-sm sm:text-base transition-all shadow-lg hover:shadow-xl cursor-pointer">
                  {t('pf.cta')}
                </button>
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
