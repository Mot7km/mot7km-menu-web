'use client';

import { useTranslations } from 'next-intl';
import { CheckCircle2, XCircle, Zap, Compass, Users } from 'lucide-react';

export function LandingSummary() {
  const t = useTranslations('landing.summary');

  const pillars = [
    {
      icon: Zap,
      title: t('pillars.speed.title'),
      desc: t('pillars.speed.description'),
    },
    {
      icon: Compass,
      title: t('pillars.control.title'),
      desc: t('pillars.control.description'),
    },
    {
      icon: Users,
      title: t('pillars.growth.title'),
      desc: t('pillars.growth.description'),
    },
  ];

  const oldWayPoints = [
    t('comparison.oldWayPoints.0'),
    t('comparison.oldWayPoints.1'),
    t('comparison.oldWayPoints.2'),
    t('comparison.oldWayPoints.3'),
  ];

  const newWayPoints = [
    t('comparison.newWayPoints.0'),
    t('comparison.newWayPoints.1'),
    t('comparison.newWayPoints.2'),
    t('comparison.newWayPoints.3'),
  ];

  return (
    <section id="summary" className="relative py-16 sm:py-24 bg-[var(--color-surface)]/50 border-y border-[var(--color-border)]/60">
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
        </div>

        {/* 3 Pillars Cards */}
        <div className="mt-12 sm:mt-16 grid gap-6 sm:gap-8 md:grid-cols-3">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-[var(--color-primary)]/40 hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary)]/15 text-[var(--color-primary)] mb-5">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)]">
                  {pillar.title}
                </h3>
                <p className="mt-2.5 text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Comparison Showcase (Traditional PDF vs MOT7KM) */}
        <div className="mt-14 sm:mt-20 overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-10 shadow-md">
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
              {t('comparison.title')}
            </h3>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              {t('comparison.subtitle')}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* The Old Way (PDF) */}
            <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-5 sm:p-6">
              <div className="flex items-center gap-2.5 text-red-500 font-bold mb-4">
                <XCircle className="h-5 w-5" />
                <h4 className="text-base sm:text-lg">{t('comparison.oldWayTitle')}</h4>
              </div>
              <ul className="space-y-3 text-sm text-[var(--color-text-secondary)]">
                {oldWayPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-red-500 font-bold">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* The MOT7KM Way */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.04] p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2.5 text-emerald-500 font-bold mb-4">
                <CheckCircle2 className="h-5 w-5" />
                <h4 className="text-base sm:text-lg">{t('comparison.newWayTitle')}</h4>
              </div>
              <ul className="space-y-3 text-sm text-[var(--color-text-primary)]">
                {newWayPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
