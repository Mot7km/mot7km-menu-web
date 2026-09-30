'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Check, Sparkles, ArrowRight, ArrowLeft, HelpCircle } from 'lucide-react';

export function LandingPricing() {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const [isAnnual, setIsAnnual] = useState(true);

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const plans = [
    {
      id: 'starter',
      name: isRTL ? 'باقة البداية' : 'Starter Plan',
      tagline: isRTL ? 'مثالية لعربات الأطعمة والمقاهي الناشئة' : 'Ideal for food trucks & emerging cafes',
      monthlyPrice: 149,
      annualPrice: 119,
      isPopular: false,
      ctaText: isRTL ? 'ابدأ تجربة مجانية' : 'Start Free Trial',
      features: [
        isRTL ? 'منيو رقمي سريع حتى 60 صنفاً' : 'Digital menu for up to 60 items',
        isRTL ? 'مسح QR Code غير محدود للطاولات' : 'Unlimited QR code scans',
        isRTL ? 'تعديل فوري للأسعار والتوافر' : 'Instant price & stock updates',
        isRTL ? 'دعم كامل للغتين (عربي / إنجليزي)' : 'Bilingual support (AR / EN)',
        isRTL ? 'الوضع الليلي والنهاري التلقائي' : 'Adaptive Dark & Light mode',
        isRTL ? 'دعم فني عبر البريد الإلكتروني' : 'Standard email support',
      ],
    },
    {
      id: 'pro',
      name: isRTL ? 'باقة الأعمال الاحترافية' : 'Pro Business Plan',
      tagline: isRTL ? 'الخيار الأكثر طلباً للمطاعم والكافيهات النشطة' : 'Most popular for thriving restaurants & cafes',
      monthlyPrice: 299,
      annualPrice: 239,
      isPopular: true,
      popularBadge: isRTL ? 'الأكثر طلباً ⭐' : 'Most Popular ⭐',
      ctaText: isRTL ? 'اشترك في باقة برو' : 'Subscribe to Pro',
      features: [
        isRTL ? 'أصناف وقوائم وتصنيفات غير محدودة' : 'Unlimited products & categories',
        isRTL ? 'سلايدر عروض ترويجية سينمائي 3D' : '3D Coverflow promotional slider',
        isRTL ? 'تخصيص كامل للهوية والألوان والشعار' : 'Custom branding, colors & logo',
        isRTL ? 'إحصائيات وتحليلات الأطباق الأكثر طلباً' : 'Analytics & customer dish trends',
        isRTL ? 'QR كود مخصص بشعار هويتك قابل للطباعة' : 'Custom branded vector QR codes',
        isRTL ? 'إمكانية إخفاء/إظهار المكونات والسعرات' : 'Nutritional & calorie details',
        isRTL ? 'دعم فني ذو أولوية عبر الواتساب' : 'Priority WhatsApp & phone support',
      ],
    },
    {
      id: 'enterprise',
      name: isRTL ? 'باقة السلاسل والشركات' : 'Enterprise Chain',
      tagline: isRTL ? 'حلول متكاملة لسلاسل الفروع والامتيازات' : 'Custom enterprise solutions for multi-branch chains',
      monthlyPrice: 599,
      annualPrice: 479,
      isPopular: false,
      ctaText: isRTL ? 'تواصل مع فريق المبيعات' : 'Talk to Sales',
      features: [
        isRTL ? 'إدارة مركزية لجميع الفروع بحساب واحد' : 'Centralized multi-branch control',
        isRTL ? 'ربط النطاق الخاص (menu.yourbrand.com)' : 'Custom domain setup support',
        isRTL ? 'تكامل مع أنظمة الكاشير والـ POS / ERP' : 'POS & ERP backend integrations',
        isRTL ? 'صلاحيات متعددة للمدراء والموظفين' : 'Role-based access & permissions',
        isRTL ? 'مدير حساب مخصص وتدريب شامل للفريق' : 'Dedicated account manager & onboarding',
        isRTL ? 'ضمان جاهزية سحابية 99.9% (SLA)' : '99.9% SLA & custom contracts',
      ],
    },
  ];

  return (
    <section id="plans" className="relative py-16 sm:py-24 bg-[var(--color-surface)]/50 border-t border-[var(--color-border)]/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[var(--color-primary)]">
            {isRTL ? 'الأسعار والاشتراكات' : 'Pricing & Plans'}
          </span>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-4xl md:text-5xl">
            {isRTL ? 'خطط مرنة تناسب طموح مشروعك' : 'Transparent, Scalable Plans for Every Stage'}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed">
            {isRTL
              ? 'اختر الخطة المناسبة لحجم نشاطك، بدون أي رسوم خفية أو عقود معقدة.'
              : 'Simple, predictable pricing with zero hidden fees. Upgrade or pause anytime.'}
          </p>

          {/* Billing Interval Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] p-1.5 shadow-sm">
            <button
              onClick={() => setIsAnnual(false)}
              className={`rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                !isAnnual
                  ? 'bg-[var(--color-primary)] text-white shadow-md'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {isRTL ? 'دفع شهري' : 'Monthly'}
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`relative rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                isAnnual
                  ? 'bg-[var(--color-primary)] text-white shadow-md'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              <span>{isRTL ? 'دفع سنوي' : 'Annual'}</span>
              <span className="ms-2 rounded-full bg-emerald-500/20 text-emerald-400 px-2 py-0.5 text-[10px] font-black uppercase">
                {isRTL ? 'وفّر 20%' : 'Save 20%'}
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-12 sm:mt-16 grid gap-8 lg:grid-cols-3 items-stretch">
          {plans.map((plan) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-3xl p-7 sm:p-9 transition-all duration-300 ${
                  plan.isPopular
                    ? 'border-2 border-[var(--color-primary)] bg-[var(--color-surface)] shadow-2xl shadow-[var(--color-primary)]/15 scale-100 lg:-translate-y-2'
                    : 'border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm hover:shadow-lg hover:border-[var(--color-primary)]/40'
                }`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-4 start-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-4 py-1 text-xs font-black text-white shadow-md">
                    {plan.popularBadge}
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                    {plan.name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-[var(--color-text-secondary)] min-h-[40px]">
                    {plan.tagline}
                  </p>

                  {/* Price */}
                  <div className="mt-6 flex items-baseline gap-1.5 border-b border-[var(--color-border)]/60 pb-6">
                    <span className="text-4xl sm:text-5xl font-black text-[var(--color-text-primary)]">
                      {price}
                    </span>
                    <span className="text-xs font-bold text-[var(--color-text-muted)]">
                      {isRTL ? 'ر.س / شهر' : 'SAR / mo'}
                    </span>
                    {isAnnual && (
                      <span className="ms-auto text-[11px] font-semibold text-emerald-500">
                        {isRTL ? 'تُفوتر سنوياً' : 'Billed annually'}
                      </span>
                    )}
                  </div>

                  {/* Features List */}
                  <ul className="mt-6 space-y-3.5 text-sm text-[var(--color-text-primary)]">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500 mt-0.5">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                        <span className="text-xs sm:text-sm leading-relaxed">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="mt-8 pt-4">
                  <button
                    className={`w-full inline-flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold transition-all duration-200 cursor-pointer ${
                      plan.isPopular
                        ? 'bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/30 hover:bg-[var(--color-primary-dark)] hover:shadow-lg'
                        : 'border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
