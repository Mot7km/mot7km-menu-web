'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <section
      id="hero"
      className="relative overflow-hidden bg-[var(--color-background)] py-16 sm:py-20 lg:py-28"
    >
      {/* Ambient background glows — matches Pricing */}
      <div className="absolute top-1/4 start-0 w-[600px] h-[600px] bg-[#2B9FD9]/10 dark:bg-[#2B9FD9]/15 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 end-0 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-indigo-600/15 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Copy */}
          <div className="lg:col-span-6 text-center lg:text-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100/90 dark:bg-white/[0.06] border border-slate-200/90 dark:border-white/15 text-slate-800 dark:text-white text-xs font-extrabold mb-6 backdrop-blur-md shadow-sm uppercase tracking-widest"
            >
              <span>{t('pillTag')}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.25rem] font-black leading-[1.05] tracking-tight text-slate-900 dark:text-white"
            >
              {t('titlePart1')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2B9FD9] via-[#38BDF8] to-emerald-400">
                {t('titleGradient')}
              </span>{' '}
              {t('titlePart2')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0"
            >
              {t('subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-9 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4"
            >
              <button
                onClick={onExploreClick}
                className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-gradient-to-r from-[#2B9FD9] to-emerald-500 hover:from-[#2181B5] hover:to-[#0D9668] px-7 py-4 text-sm font-extrabold text-white shadow-md shadow-[#2B9FD9]/25 hover:shadow-lg hover:shadow-[#2B9FD9]/40 hover:-translate-y-0.5 transition-all"
              >
                {t('exploreMenus')}
                <ArrowIcon className="h-4 w-4" />
              </button>

              <button
                onClick={onPlansClick}
                className="cursor-pointer inline-flex items-center px-6 py-4 rounded-2xl bg-slate-100/90 dark:bg-white/[0.06] hover:bg-slate-200/90 dark:hover:bg-white/10 border border-slate-200/90 dark:border-white/15 text-slate-900 dark:text-white text-sm font-extrabold transition-colors"
              >
                {t('viewPlans')}
              </button>
            </motion.div>
          </div>

          {/* Images — hidden on mobile, shown lg+ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block lg:col-span-6 relative"
          >
            <div className="relative mx-auto max-w-[560px]">
              {/* Ambient glow behind the images */}
              <div
                aria-hidden
                className="absolute -inset-12 -z-10 bg-[#2B9FD9]/15 dark:bg-[#2B9FD9]/25 blur-[80px] rounded-full"
              />

              {/* Gradient frame around main image */}
              <div className="relative rounded-[2rem] p-1.5 bg-gradient-to-br from-[#2B9FD9]/40 via-slate-200/50 to-emerald-400/40 dark:from-[#2B9FD9]/50 dark:via-white/10 dark:to-emerald-500/40 shadow-2xl">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] bg-white dark:bg-[#0c1626]">
                  <Image
                    src="/images/hero-main.jpg"
                    alt={t('mockup.storeName')}
                    fill
                    sizes="(min-width: 1024px) 560px, 100vw"
                    priority
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Overlapping detail image */}
              <div className="absolute -bottom-8 -start-8 w-[220px] aspect-square overflow-hidden rounded-3xl border-4 border-[var(--color-background)] shadow-2xl">
                <Image
                  src="/images/hero-detail.jpg"
                  alt=""
                  fill
                  sizes="220px"
                  className="object-cover"
                />
              </div>

              {/* Floating status chip */}
              <div className="absolute -bottom-4 end-4 hidden xl:flex items-center gap-3 rounded-2xl border border-slate-200/90 dark:border-white/15 bg-white/95 dark:bg-[#0c1626]/95 backdrop-blur-2xl px-4 py-3 shadow-xl">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#2B9FD9]">
                    {t('mockup.storeName')}
                  </p>
                  <p className="mt-0.5 text-[12px] font-bold text-slate-900 dark:text-white">
                    {t('mockup.status')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}