'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';

interface PlanDefinition {
  id: 'starter' | 'pro' | 'enterprise';
  monthlyPrice: number;
  annualPrice: number;
  isPopular?: boolean;
  featureCount: number;
}

const PLANS: PlanDefinition[] = [
  {
    id: 'starter',
    monthlyPrice: 149,
    annualPrice: 119,
    featureCount: 6,
  },
  {
    id: 'pro',
    monthlyPrice: 299,
    annualPrice: 239,
    isPopular: true,
    featureCount: 7,
  },
  {
    id: 'enterprise',
    monthlyPrice: 599,
    annualPrice: 479,
    featureCount: 6,
  },
];

export function LandingPricing() {
  const t = useTranslations('landing.pricing');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const [isAnnual, setIsAnnual] = useState(true);

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section id="plans" className="relative py-16 sm:py-24 bg-[var(--color-surface)]/50 border-t border-[var(--color-border)]/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[var(--color-primary)]">
            {t('sectionTag')}
          </span>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-4xl md:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed">
            {t('description')}
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
              {t('monthly')}
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`relative rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                isAnnual
                  ? 'bg-[var(--color-primary)] text-white shadow-md'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              <span>{t('annual')}</span>
              <span className="ms-2 rounded-full bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 px-2 py-0.5 text-[10px] font-black uppercase">
                {t('savePercent')}
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-12 sm:mt-16 grid gap-8 lg:grid-cols-3 items-stretch">
          {PLANS.map((plan) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            const name = t(`plans.${plan.id}.name`);
            const tagline = t(`plans.${plan.id}.tagline`);
            const ctaText = t(`plans.${plan.id}.cta`);
            const features = Array.from({ length: plan.featureCount }, (_, i) =>
              t(`plans.${plan.id}.features.${i}`)
            );

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
                    {t('popularBadge')}
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                    {name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-[var(--color-text-secondary)] min-h-[40px]">
                    {tagline}
                  </p>

                  {/* Price */}
                  <div className="mt-6 flex items-baseline gap-1.5 border-b border-[var(--color-border)]/60 pb-6">
                    <span className="text-4xl sm:text-5xl font-black text-[var(--color-text-primary)]">
                      {price}
                    </span>
                    <span className="text-xs font-bold text-[var(--color-text-muted)]">
                      {t('perMonth')}
                    </span>
                    {isAnnual && (
                      <span className="ms-auto text-[11px] font-semibold text-emerald-500">
                        {t('billedAnnually')}
                      </span>
                    )}
                  </div>

                  {/* Features List */}
                  <ul className="mt-6 space-y-3.5 text-sm text-[var(--color-text-primary)]">
                    {features.map((feat, idx) => (
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
                  <a
                    href="https://wa.me/966500000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full inline-flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold transition-all duration-200 cursor-pointer ${
                      plan.isPopular
                        ? 'bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/30 hover:brightness-105 hover:shadow-lg'
                        : 'border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                    }`}
                  >
                    <span>{ctaText}</span>
                    <ArrowIcon className="h-4 w-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
