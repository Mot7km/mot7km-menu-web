'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Sparkles, ArrowRight, ArrowLeft, MessageSquare, CheckCircle2 } from 'lucide-react';

export function LandingCTA() {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-[var(--color-primary)] via-[#1877A8] to-[var(--color-secondary)] px-6 py-12 sm:px-12 sm:py-16 md:py-20 text-white shadow-2xl shadow-[var(--color-primary)]/20">
          {/* Ambient Decorative Elements */}
          <div className="pointer-events-none absolute -top-24 -end-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -start-24 h-96 w-96 rounded-full bg-black/20 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-white shadow-sm mb-6 border border-white/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isRTL ? 'إطلاق فوري خلال دقائق' : 'Launch in Minutes'}</span>
            </div>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
              {isRTL ? 'جاهز لترقية تجربة ضيوفك وزيادة مبيعاتك؟' : 'Ready to Elevate Your Dining Experience?'}
            </h2>

            <p className="mt-5 text-base sm:text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
              {isRTL
                ? 'انضم إلى نخبة المطاعم والمقاهي التي تثق بمنصة مُتحكّم لتقديم قائمة طعام رقمية سريعة، تفاعلية وعصرية.'
                : 'Join top hospitality brands using MOT7KM for lightning-fast, high-converting digital menus.'}
            </p>

            {/* Action Buttons */}
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={`/${locale}/menu`}
                className="inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-sm sm:text-base font-bold text-[var(--color-primary)] shadow-xl transition-all duration-300 hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{isRTL ? 'ابدأ تجربتك الآن' : 'Get Started Now'}</span>
                <ArrowIcon className="h-4 w-4" />
              </Link>

              <a
                href="https://wa.me/966500000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-7 py-4 text-sm sm:text-base font-bold text-white transition-all duration-200 hover:bg-white/20 hover:border-white/50"
              >
                <MessageSquare className="h-4 w-4" />
                <span>{isRTL ? 'تحدث مع مستشار المبيعات' : 'Chat with Sales'}</span>
              </a>
            </div>

            {/* Quick Guarantees */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-white/85">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-white" />
                <span>{isRTL ? 'بدون بطاقة ائتمانية للبدء' : 'No credit card required'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-white" />
                <span>{isRTL ? 'إعداد سريع في نفس اليوم' : 'Same-day setup assistance'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-white" />
                <span>{isRTL ? 'دعم فني وتدريب مجاني' : 'Free onboarding & support'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
