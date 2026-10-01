'use client';

import { useTranslations } from 'next-intl';
import { 
  QrCode, 
  Sparkles, 
  Palette, 
  Zap, 
  Globe2, 
  Moon, 
  CheckCircle2
} from 'lucide-react';

interface FeatureConfig {
  id: 'qr' | 'cinematic' | 'customization' | 'sync' | 'bilingual' | 'themes';
  icon: typeof QrCode;
}

const FEATURE_CONFIGS: FeatureConfig[] = [
  { id: 'qr', icon: QrCode },
  { id: 'cinematic', icon: Sparkles },
  { id: 'customization', icon: Palette },
  { id: 'sync', icon: Zap },
  { id: 'bilingual', icon: Globe2 },
  { id: 'themes', icon: Moon },
];

export function LandingFeatures() {
  const t = useTranslations('landing.features');

  return (
    <section id="features" className="relative py-16 sm:py-24 overflow-hidden">
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

        {/* Features Bento Grid */}
        <div className="mt-12 sm:mt-16 grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURE_CONFIGS.map((feat) => {
            const Icon = feat.icon;
            const tag = t(`items.${feat.id}.tag`);
            const title = t(`items.${feat.id}.title`);
            const desc = t(`items.${feat.id}.description`);

            return (
              <div
                key={feat.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-[var(--color-primary)]/40 hover:-translate-y-1.5"
              >
                {/* Top Icon & Tag */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] shadow-inner transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-6 w-6 text-[var(--color-primary)]" />
                    </div>
                    <span className="rounded-full bg-[var(--color-surface-subtle)] border border-[var(--color-border)] px-3 py-1 text-[11px] font-bold text-[var(--color-text-secondary)]">
                      {tag}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
                    {desc}
                  </p>
                </div>

                {/* Bottom Highlight Line */}
                <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{t('includedBadge')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
