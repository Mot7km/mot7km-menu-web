'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ArrowRight, ArrowLeft, ChevronDown } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
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
    ar: 'الباقة المقترحة',
    en: 'Recommended',
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
  'p1.name': { ar: 'Starter', en: 'Starter' },
  'p1.sub': { ar: 'Smart QR Menu', en: 'Smart QR Menu' },
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
  'p3.name': { ar: 'Pro', en: 'Pro' },
  'p3.sub': { ar: 'Full POS & Staff', en: 'Full POS & Staff' },
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
  'p5.name': { ar: 'Enterprise', en: 'Enterprise' },
  'p5.sub': { ar: 'Custom Solutions', en: 'Custom Solutions' },
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
  'pf.name': { ar: 'الباقة المجانية', en: 'Free Plan' },
  'pf.sub': { ar: 'Free QR Menu', en: 'Free QR Menu' },
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
  const annualSavingsEgp = branches * 6400;

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
    <section
      id="plans"
      className="py-16 sm:py-24 md:py-32 bg-[var(--color-background)] relative overflow-hidden"
    >
      {/* Anchor for #pricing links as well */}
      <div id="pricing" className="absolute -top-24 pointer-events-none" />

      {/* Atmospheric Background Ambient Glows */}
      <div className="absolute top-1/4 start-0 w-[550px] h-[550px] bg-[#2B9FD9]/10 dark:bg-[#2B9FD9]/15 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 end-0 w-[550px] h-[550px] bg-emerald-500/10 dark:bg-indigo-600/15 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block px-3 py-1 rounded-full bg-slate-100/90 dark:bg-white/[0.06] border border-slate-200/90 dark:border-white/10 text-slate-600 dark:text-slate-300 text-xs font-semibold mb-6 uppercase tracking-wider">
            {t('pricing.badge')}
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight"
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
            className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
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
          className="max-w-4xl mx-auto mb-12 sm:mb-16 bg-white/90 dark:bg-[#0c1626]/90 backdrop-blur-2xl border border-slate-200/90 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm"
        >
          <div className="mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {t('pricing.calculatorTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              {t('pricing.calculatorDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Slider Column */}
            <div className="md:col-span-7 space-y-4">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-slate-800 dark:text-slate-200">
                  {t('pricing.branchesLabel')}
                </span>
                <span className="text-lg font-bold text-[#2B9FD9] px-3 py-1 bg-[#2B9FD9]/10 rounded-xl border border-[#2B9FD9]/20 tabular-nums">
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
              <div className="flex justify-between text-xs font-medium text-slate-400">
                <span>{t('pricing.sliderTick1')}</span>
                <span>{t('pricing.sliderTick5')}</span>
                <span>{t('pricing.sliderTick10')}</span>
                <span>{t('pricing.sliderTick15')}</span>
              </div>
            </div>

            {/* Metrics Output Column */}
            <div className="md:col-span-5 grid grid-cols-2 gap-4 bg-slate-100/90 dark:bg-white/[0.04] p-4 rounded-2xl border border-slate-200/80 dark:border-white/10">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                  {t('pricing.monthlyTimeSaved')}
                </span>
                <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                  {hoursSavedPerMonth} {t('pricing.hoursUnit')}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                  {t('pricing.annualRoi')}
                </span>
                <span className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {annualSavingsEgp.toLocaleString()} {t('pricing.currency')}
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
          <div className="relative flex items-center p-1.5 bg-slate-100 dark:bg-[#090d16] rounded-full border border-slate-200 dark:border-white/10">
            <button
              onClick={() => setIsAnnual(false)}
              className={`relative z-10 px-7 py-3 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-300 cursor-pointer ${
                !isAnnual
                  ? 'text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {!isAnnual && (
                <motion.div
                  layoutId="billingToggle"
                  className="absolute inset-0 bg-gradient-to-r from-[#2B9FD9] to-emerald-500 rounded-full shadow-sm -z-10"
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                />
              )}
              {t('pricing.monthly')}
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`relative z-10 px-7 py-3 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-300 cursor-pointer ${
                isAnnual
                  ? 'text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isAnnual && (
                <motion.div
                  layoutId="billingToggle"
                  className="absolute inset-0 bg-gradient-to-r from-[#2B9FD9] to-emerald-500 rounded-full shadow-sm -z-10"
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                />
              )}
              {t('pricing.annually')}
            </button>
          </div>

          <div className="text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-semibold">
            {t('pricing.save')}
          </div>
        </motion.div>

        {/* Main Pricing Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mb-16 sm:mb-20 items-center">
          {plans.map((plan, i) => {
            const isCustom = plan.price === 'Custom';
            const displayPrice = getDisplayPrice(plan);
            const originalPrice = isCustom ? null : parseInt(plan.price.replace(',', ''));
            const isAutoRecommended = plan.id === recommendedPlanId;
            const badgeText = isAutoRecommended
              ? t('pricing.recommendedBadge')
              : plan.popular
                ? t('plan.popular')
                : null;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`group relative flex flex-col rounded-3xl md:rounded-[2.5rem] p-6 sm:p-8 md:p-10 transition-all duration-500 ${plan.color} ${plan.glow} ${
                  plan.popular || isAutoRecommended
                    ? 'lg:-translate-y-6 z-20 lg:scale-[1.03] ring-2 ring-[#2B9FD9] shadow-lg shadow-[#2B9FD9]/10'
                    : 'hover:-translate-y-2 z-10 shadow-sm hover:shadow-md'
                }`}
              >
                {badgeText && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#2B9FD9] text-white px-4 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider shadow-sm whitespace-nowrap z-30">
                    {badgeText}
                  </div>
                )}

                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm min-h-[40px] leading-relaxed mt-1">
                    {plan.description}
                  </p>

                  <div className="flex items-end gap-2 mt-4">
                    <span
                      className={`font-bold text-slate-900 dark:text-white tabular-nums ${
                        isCustom
                          ? 'text-2xl sm:text-3xl'
                          : 'text-4xl sm:text-5xl tracking-tight'
                      }`}
                    >
                      {displayPrice}
                    </span>
                    {!isCustom && (
                      <div className="flex flex-col pb-1.5">
                        {isAnnual && originalPrice && (
                          <span className="text-xs text-slate-400 dark:text-slate-500 line-through font-medium mb-0.5 tabular-nums">
                            {originalPrice.toLocaleString()}
                          </span>
                        )}
                        <span className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium">
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
                        <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                          <Check size={12} strokeWidth={3} />
                        </div>
                        <span className="text-slate-800 dark:text-slate-100 text-sm leading-relaxed font-medium">
                          {feature}
                        </span>
                      </li>
                    ))}
                    {plan.missing.map((feature, j) => (
                      <li key={`missing-${j}`} className="flex items-start gap-3 opacity-60">
                        <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-400 dark:text-slate-500">
                          <X size={12} strokeWidth={2} />
                        </div>
                        <span className="text-slate-400 dark:text-slate-500 text-sm leading-relaxed line-through">
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
                    className={`w-full py-3.5 rounded-2xl font-semibold text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer ${
                      plan.popular || isAutoRecommended
                        ? 'bg-gradient-to-r from-[#2B9FD9] to-emerald-500 hover:from-[#2181B5] hover:to-[#0D9668] text-white shadow-sm hover:shadow-md hover:-translate-y-0.5'
                        : 'bg-slate-900 hover:bg-black text-white dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:border dark:border-white/10'
                    }`}
                  >
                    <span>{t('plan.choose')}</span>
                    <ArrowIcon
                      size={16}
                      className="group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1"
                    />
                  </button>
                </a>
              </motion.div>
            );
          })}
        </div>

        {/* Trust bar */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 max-w-4xl mx-auto mb-16 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
          <span>{t('pricing.instantSetup')}</span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
          <span>{t('pricing.moneyBack')}</span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
          <span>{t('pricing.noCommission')}</span>
        </div>

        {/* Expandable Feature Comparison Matrix Toggle */}
        <div className="max-w-6xl mx-auto mb-16 text-center">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-semibold text-sm transition-colors cursor-pointer"
          >
            <span>
              {showComparison ? t('pricing.hideComparison') : t('pricing.showComparison')}
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${showComparison ? 'rotate-180' : ''}`}
            />
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
                <div className="bg-white/95 dark:bg-[#0c1626]/95 border border-slate-200/90 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm overflow-x-auto">
                  <table className="w-full text-sm text-slate-800 dark:text-slate-200 border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold text-sm">
                        <th className="py-4 px-4 text-start w-1/3">
                          {t('pricing.featureColumn')}
                        </th>
                        <th className="py-4 px-4 text-center w-1/5">{t('p1.name')}</th>
                        <th className="py-4 px-4 text-center w-1/5 text-[#2B9FD9]">
                          {t('p3.name')}
                        </th>
                        <th className="py-4 px-4 text-center w-1/5">{t('p5.name')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonCategories.map((cat, catIdx) => (
                        <tr key={catIdx} className="contents">
                          <td
                            colSpan={4}
                            className="py-3 px-4 bg-slate-100/90 dark:bg-white/[0.04] font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider"
                          >
                            {cat.category}
                          </td>
                          {cat.items.map((item, itemIdx) => (
                            <tr
                              key={itemIdx}
                              className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors"
                            >
                              <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                                {item.name}
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                {typeof item.starter === 'boolean' ? (
                                  item.starter ? (
                                    <Check size={16} className="text-emerald-500 mx-auto" />
                                  ) : (
                                    <X
                                      size={16}
                                      className="text-slate-300 dark:text-slate-600 mx-auto"
                                    />
                                  )
                                ) : (
                                  <span className="text-slate-800 dark:text-slate-200 font-medium">
                                    {item.starter}
                                  </span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-center font-semibold text-[#2B9FD9] bg-[#2B9FD9]/5 dark:bg-[#2B9FD9]/10">
                                {typeof item.pro === 'boolean' ? (
                                  item.pro ? (
                                    <Check size={16} className="text-emerald-500 mx-auto" />
                                  ) : (
                                    <X
                                      size={16}
                                      className="text-slate-300 dark:text-slate-600 mx-auto"
                                    />
                                  )
                                ) : (
                                  <span>{item.pro}</span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                {typeof item.enterprise === 'boolean' ? (
                                  item.enterprise ? (
                                    <Check size={16} className="text-emerald-500 mx-auto" />
                                  ) : (
                                    <X
                                      size={16}
                                      className="text-slate-300 dark:text-slate-600 mx-auto"
                                    />
                                  )
                                ) : (
                                  <span className="text-slate-800 dark:text-slate-200 font-medium">
                                    {item.enterprise}
                                  </span>
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
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative bg-white/95 dark:bg-[#0c1626]/95 border border-slate-200/90 dark:border-white/10 rounded-2xl md:rounded-[2.5rem] p-6 sm:p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 shadow-sm">
            {/* Left content */}
            <div className="flex-1 relative z-10">
              <div className="inline-block px-3 py-1 rounded-full bg-slate-100/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-300 text-[11px] font-semibold mb-4 uppercase tracking-wider">
                {t('pf.name')}
              </div>

              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                {t('pf.heading')}
              </h3>

              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base md:text-lg mb-6 max-w-2xl leading-relaxed">
                {t('pf.desc')}
              </p>

              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {[t('pf.f1'), t('pf.f2')].map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium"
                  >
                    <Check size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right block (Price + CTA) */}
            <div className="flex flex-col items-center gap-4 shrink-0 w-full md:w-auto mt-4 md:mt-0 relative z-10">
              <div className="text-center">
                <span className="block text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
                  {t('plan.free')}
                </span>
                <span className="block text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-2 max-w-[200px] mx-auto">
                  {t('pf.freeNote')}
                </span>
              </div>

              <a
                href="https://mot7km.store/#demo"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto"
              >
                <button className="w-full md:w-auto px-8 sm:px-10 py-3.5 rounded-2xl bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold text-sm sm:text-base transition-colors shadow-sm hover:shadow-md cursor-pointer">
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