'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Sparkles, Check, ShieldCheck, Clock, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

const COPY: Record<string, { ar: string; en: string }> = {
  badge: { ar: 'ما هو مُتحكّم', en: 'What is Mot7km' },
  titleLead: { ar: 'قائمتك الرقمية،', en: 'Your digital menu,' },
  titleTail: { ar: 'جاهزة قبل وصول الضيف.', en: 'ready before the guest arrives.' },
  desc: {
    ar: 'منصة قوائم QR للمطاعم والمقاهي ومحلات العصائر. الضيوف يمسحون الرمز، يتصفّحون القائمة كاملة بلغتهم، وأنت تحدّث الأسعار والصور والأطباق من هاتفك — والتغيير يظهر فوراً على كل طاولة.',
    en: 'A QR menu platform for restaurants, cafés, and juice bars. Guests scan the code and browse your full menu in their language, while you update prices, photos, and dishes from your phone — live, on every table.',
  },

  // Feature bullets
  b1Title: { ar: 'بدون تطبيق، بدون تسجيل', en: 'No app, no signup' },
  b1Body: {
    ar: 'يفتح مباشرة في متصفح الهاتف بمجرد مسح الرمز.',
    en: 'Opens straight in the phone browser the moment the code is scanned.',
  },
  b2Title: { ar: 'تحديثات فورية', en: 'Live updates' },
  b2Body: {
    ar: 'غيّر سعراً أو علّم طبقاً كنفد، فيظهر ذلك على كل الطاولات خلال ثوانٍ.',
    en: 'Change a price or mark a dish sold out — it shows on every table in seconds.',
  },
  b3Title: { ar: 'عربي وإنجليزي بشكل افتراضي', en: 'Arabic and English by default' },
  b3Body: {
    ar: 'كل قائمة تأتي باللغتين مع دعم كامل للاتجاه من اليمين لليسار.',
    en: 'Every menu ships bilingual with full right-to-left support out of the box.',
  },

  // Trust bar
  trust1: { ar: 'تفعيل خلال ٥ دقائق', en: 'Set up in 5 minutes' },
  trust2: { ar: 'يعمل على أي هاتف', en: 'Works on any phone' },
  trust3: { ar: 'بدون عمولات على الطلبات', en: 'Zero commission on orders' },

  // Image alt + floating chip
  imageAlt: { ar: 'قائمة رقمية لمقهى النخيل', en: 'Digital menu at Al Nakheel Café' },
  chipTitle: { ar: 'تم التحديث الآن', en: 'Just updated' },
  chipBody: { ar: 'فلات وايت ← ٥٫٠٠', en: 'Flat White → 5.00' },
};

export function LandingSummary() {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const t = (key: string): string => {
    const item = COPY[key];
    return item ? (isRtl ? item.ar : item.en) : key;
  };

  const bullets = [
    { title: t('b1Title'), body: t('b1Body') },
    { title: t('b2Title'), body: t('b2Body') },
    { title: t('b3Title'), body: t('b3Body') },
  ];

  return (
    <section
      id="summary"
      className="relative py-16 sm:py-24 md:py-32 bg-[var(--color-background)] overflow-hidden border-t border-[var(--color-border)]"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 start-0 w-[500px] h-[500px] bg-[#2B9FD9]/10 dark:bg-[#2B9FD9]/15 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 end-0 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-indigo-600/15 blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100/90 dark:bg-white/[0.06] border border-slate-200/90 dark:border-white/15 text-slate-800 dark:text-white text-xs font-extrabold mb-6 backdrop-blur-md shadow-sm uppercase tracking-widest">
            <Sparkles size={14} className="text-[#2B9FD9]" />
            <span>{t('badge')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            {t('titleLead')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2B9FD9] via-[#38BDF8] to-emerald-400">
              {t('titleTail')}
            </span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
            {t('desc')}
          </p>
        </div>

        {/* Two-column body */}
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14 mb-16">
          {/* Left: feature bullets in a glass card */}
          <div className="lg:col-span-6">
            <div className="bg-white/90 dark:bg-[#0c1626]/90 backdrop-blur-2xl border border-slate-200/90 dark:border-white/15 rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-2xl space-y-6">
              {bullets.map((b, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-[#2B9FD9] to-emerald-500 flex items-center justify-center shadow-md shadow-[#2B9FD9]/20">
                    <Check size={18} strokeWidth={3} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {b.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {b.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: image inside a glass frame with floating chip */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto flex max-w-[520px] justify-center">
              {/* Ambient glow behind image */}
              <div
                aria-hidden
                className="absolute -inset-12 -z-10 bg-[#2B9FD9]/15 dark:bg-[#2B9FD9]/25 blur-[80px] rounded-full"
              />

              {/* Gradient frame */}
              <div className="relative w-full rounded-[2.25rem] p-1.5 bg-gradient-to-br from-[#2B9FD9]/40 via-slate-200/50 to-emerald-400/40 dark:from-[#2B9FD9]/50 dark:via-white/10 dark:to-emerald-500/40 shadow-2xl">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.75rem] bg-white dark:bg-[#0c1626]">
                  <Image
                    src="/images/summary-preview.jpg"
                    alt={t('imageAlt')}
                    fill
                    sizes="(min-width: 1024px) 520px, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Floating live-update chip */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute -bottom-4 end-0 hidden sm:flex items-center gap-3 rounded-2xl border border-slate-200/90 dark:border-white/15 bg-white/95 dark:bg-[#0c1626]/95 backdrop-blur-2xl px-4 py-3 shadow-xl dark:shadow-2xl"
              >
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#2B9FD9]">
                    {t('chipTitle')}
                  </p>
                  <p className="mt-0.5 text-[12px] font-bold text-slate-900 dark:text-white tabular-nums">
                    {t('chipBody')}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}