'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Sparkles, ArrowRight, ArrowLeft, Zap, QrCode, TrendingUp, ShieldCheck } from 'lucide-react';

interface LandingHeroProps {
  onExploreClick: () => void;
  onPlansClick: () => void;
}

export function LandingHero({ onExploreClick, onPlansClick }: LandingHeroProps) {
  const t = useTranslations('landing.hero');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section id="hero" className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 lg:pt-20 lg:pb-32">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -top-24 start-1/2 -translate-x-1/2 h-96 w-[700px] rounded-full bg-gradient-to-tr from-[var(--color-primary)]/15 via-[var(--color-secondary)]/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 end-0 h-80 w-80 rounded-full bg-[var(--color-accent)]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left / Text Column */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-start lg:col-span-7">
            {/* Top Tag Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/25 bg-[var(--color-primary)]/10 px-3.5 py-1.5 text-xs font-bold text-[var(--color-primary)] backdrop-blur-md shadow-sm mb-6">
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-[var(--color-primary)]" />
              <span>{t('pillTag')}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-5xl md:text-6xl xl:text-7xl leading-[1.12]">
              {t('titlePart1')}{' '}
              <span className="bg-gradient-to-r from-[var(--color-primary)] via-[#2B9FD9] to-[var(--color-accent)] bg-clip-text text-transparent">
                {t('titleGradient')}
              </span>{' '}
              {t('titlePart2')}
            </h1>

            {/* Subtitle */}
            <p className="mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-[var(--color-text-secondary)] leading-relaxed">
              {t('subtitle')}
            </p>

            {/* Action Buttons */}
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full">
              <button
                onClick={onExploreClick}
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[var(--color-primary)] px-7 py-3.5 text-sm sm:text-base font-bold text-white shadow-lg shadow-[var(--color-primary)]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--color-primary)]/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>{t('exploreMenus')}</span>
                <ArrowIcon className="h-4 w-4" />
              </button>

              <button
                onClick={onPlansClick}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3.5 text-sm sm:text-base font-bold text-[var(--color-text-primary)] shadow-sm transition-all duration-200 hover:bg-[var(--color-surface-subtle)] hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)] cursor-pointer"
              >
                <span>{t('viewPlans')}</span>
              </button>
            </div>

            {/* Trust Mini Metrics */}
            <div className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-6 border-t border-[var(--color-border)]/60 pt-6 text-xs sm:text-sm text-[var(--color-text-secondary)]">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                <span className="font-semibold">{t('metrics.loadTime')}</span>
              </div>
              <div className="flex items-center gap-2">
                <QrCode className="h-4 w-4 text-[var(--color-primary)]" />
                <span className="font-semibold">{t('metrics.noApp')}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span className="font-semibold">{t('metrics.uptime')}</span>
              </div>
            </div>
          </div>

          {/* Right Column / Interactive Mockup Showcase */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Phone/Tablet Device Stage */}
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] rounded-[36px] border-4 border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-2xl shadow-[var(--color-primary)]/15">
              {/* Device Notch / Header Speaker */}
              <div className="mx-auto mb-3 h-4 w-28 rounded-full bg-[var(--color-surface-subtle)] border border-[var(--color-border)]/50" />

              {/* Mockup Inside Screen */}
              <div className="overflow-hidden rounded-[26px] bg-[var(--color-background)] border border-[var(--color-border)]/40 p-4">
                {/* Store Header Mock */}
                <div className="flex items-center justify-between border-b border-[var(--color-border)]/50 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-[var(--color-primary)]/15 flex items-center justify-center font-bold text-[var(--color-primary)] text-sm">
                      M7
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[var(--color-text-primary)]">
                        {t('mockup.storeName')}
                      </h4>
                      <p className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {t('mockup.status')}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] p-1.5 shadow-sm">
                    <QrCode className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                  </div>
                </div>

                {/* Promotional Mini Banner Mock */}
                <div className="relative mt-3 h-28 overflow-hidden rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-3 text-white shadow-md">
                  <div className="relative z-10 flex h-full flex-col justify-between">
                    <span className="w-fit rounded-full bg-black/40 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold text-amber-200">
                      {t('mockup.specialOfferTag')}
                    </span>
                    <div>
                      <p className="text-xs font-black leading-tight">
                        {t('mockup.specialOfferTitle')}
                      </p>
                      <p className="text-[10px] text-white/80">
                        {t('mockup.specialOfferSubtitle')}
                      </p>
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-white/10 blur-sm pointer-events-none" />
                </div>

                {/* Categories Pills Mock */}
                <div className="mt-3 flex gap-1.5 overflow-x-hidden pb-1">
                  <span className="rounded-full bg-[var(--color-primary)] px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
                    {t('mockup.bestSellers')}
                  </span>
                  <span className="rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] px-2.5 py-1 text-[10px] font-semibold text-[var(--color-text-secondary)]">
                    {t('mockup.coldBrews')}
                  </span>
                  <span className="rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] px-2.5 py-1 text-[10px] font-semibold text-[var(--color-text-secondary)]">
                    {t('mockup.desserts')}
                  </span>
                </div>

                {/* Sample Product Card Mock */}
                <div className="mt-2.5 flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2.5 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="h-11 w-11 rounded-lg bg-[var(--color-surface-subtle)] flex items-center justify-center text-lg">
                      ☕
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--color-text-primary)]">
                        {t('mockup.sampleProductTitle')}
                      </p>
                      <p className="text-[10px] text-[var(--color-primary)] font-bold">
                        {t('mockup.sampleProductPrice')}
                      </p>
                    </div>
                  </div>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-primary)]/15 text-[var(--color-primary)] font-bold text-xs">
                    +
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Metric 1 */}
            <div className="absolute -bottom-4 -start-4 sm:-start-6 hidden sm:flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-xl p-3 shadow-xl">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500 font-bold">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="text-start">
                <p className="text-xs font-bold text-[var(--color-text-primary)]">{t('mockup.salesMetric')}</p>
                <p className="text-[10px] text-[var(--color-text-muted)]">{t('mockup.salesMetricSub')}</p>
              </div>
            </div>

            {/* Floating Metric 2 */}
            <div className="absolute -top-4 -end-4 sm:-end-6 hidden sm:flex items-center gap-2.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-xl px-3.5 py-2.5 shadow-xl">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
              <p className="text-xs font-bold text-[var(--color-text-primary)]">
                {t('mockup.liveMenuBadge')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
