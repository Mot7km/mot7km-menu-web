'use client';

import { useLocale } from 'next-intl';
import { 
  QrCode, 
  Sparkles, 
  Palette, 
  Zap, 
  Globe2, 
  Moon, 
  BarChart3, 
  Search,
  CheckCircle2
} from 'lucide-react';

export function LandingFeatures() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const features = [
    {
      icon: QrCode,
      color: 'from-blue-500 to-cyan-500',
      tag: isRTL ? 'توصيل فوري' : 'Instant Access',
      title: isRTL ? 'مسح فوري بـ QR Code ذكي' : 'Instant Smart QR Code Scanning',
      desc: isRTL
        ? 'رموز استجابة سريعة مخصصة لطاولاتك أو بطاقات التوصيل، تفتح مباشرة في متصفح العميل بدون الحاجة لتحميل أي تطبيق.'
        : 'Custom branded QR codes for tables and delivery packaging. Opens straight in the mobile browser without installing anything.',
    },
    {
      icon: Sparkles,
      color: 'from-amber-500 to-orange-500',
      tag: isRTL ? 'تأثير سينمائي' : 'Cinematic 3D',
      title: isRTL ? 'سلايدر عروض ترويجية سينمائي' : '3D Coverflow Promotional Sliders',
      desc: isRTL
        ? 'استعرض وجباتك الأكثر ربحاً وعروض اليوم عبر سلايدر تفاعلي ثلاثي الأبعاد مستوحى من واجهات Apple يضاعف تفاعل الزوار.'
        : 'Highlight today’s specials and high-margin dishes with a smooth, responsive 3D coverflow carousel inspired by Apple.',
    },
    {
      icon: Palette,
      color: 'from-purple-500 to-pink-500',
      tag: isRTL ? 'هوية متكاملة' : 'Full Customization',
      title: isRTL ? 'تخصيص كامل للهوية البصرية' : 'Custom Brand Palette & Typography',
      desc: isRTL
        ? 'تحكّم بألوان متجرك، لوجو علامتك، صور الغلاف البانورامية، وأسلوب العرض بما يعكس روح مطعمك بكل فخامة.'
        : 'Fine-tune your brand colors, custom logo, cinematic cover photography, and typography to match your restaurant aura.',
    },
    {
      icon: Zap,
      color: 'from-emerald-500 to-teal-500',
      tag: isRTL ? 'إدارة لحظية' : 'Live Sync',
      title: isRTL ? 'تحديث الأسعار والمخزون فورياً' : 'Live Inventory & Price Updates',
      desc: isRTL
        ? 'نفد صنف من المطبخ؟ أخفه فوراً بضغطة زر. غيّرت السعر؟ ينعكس في ثانية واحدة أمام جميع رواد المطعم دون طباعة.'
        : 'Run out of an ingredient? Hide dishes instantly. Update pricing and seasonal items without any reprinting hassle.',
    },
    {
      icon: Globe2,
      color: 'from-indigo-500 to-blue-500',
      tag: isRTL ? 'ثنائي اللغة' : 'Bilingual Native',
      title: isRTL ? 'دعم كامل للعربية والإنجليزية' : 'Native Arabic & English Support',
      desc: isRTL
        ? 'دعم متقن لاتجاه الكتابة (RTL و LTR) مع خطوط عربية مدروسة مثل القاهرة (Cairo) لخدمة جميع الزوار والسياح بسهولة.'
        : 'Seamless RTL and LTR directionality paired with elegant typography (Cairo & Roboto) for locals and tourists alike.',
    },
    {
      icon: Moon,
      color: 'from-slate-700 to-zinc-900',
      tag: isRTL ? 'أجواء مريحة' : 'Adaptive Themes',
      title: isRTL ? 'الوضع الليلي والنهاري التلقائي' : 'Dark & Light Mode Integration',
      desc: isRTL
        ? 'تصميم راقٍ يتكيف مع إضاءة مقهاك أو مطعمك الهادئة ليلاً لتوفير تجربة قراءة ممتعة وأنيقة على عيون الضيوف.'
        : 'Adaptive theme support designed to blend seamlessly with dimly-lit dining atmospheres and daylight cafes.',
    },
  ];

  return (
    <section id="features" className="relative py-16 sm:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[var(--color-primary)]">
            {isRTL ? 'مميزات المنصة' : 'Core Features'}
          </span>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-4xl md:text-5xl">
            {isRTL ? 'كل ما تحتاجه لإدارة منيو استثنائي' : 'Everything You Need for an Elite Menu'}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed">
            {isRTL
              ? 'مجموعة من الأدوات الذكية والمصممة بعناية لتمنح عملاءك تجربة طلب سلسة وتمنح فريقك تحكماً كاملاً.'
              : 'Engineered with cutting-edge tools to elevate customer ordering and give operators effortless control.'}
          </p>
        </div>

        {/* Features Bento Grid */}
        <div className="mt-12 sm:mt-16 grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-[var(--color-primary)]/40 hover:-translate-y-1.5"
              >
                {/* Top Icon & Tag */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/15 to-[var(--color-secondary)]/15 text-[var(--color-primary)] shadow-inner transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-6 w-6 text-[var(--color-primary)]" />
                    </div>
                    <span className="rounded-full bg-[var(--color-surface-subtle)] border border-[var(--color-border)] px-3 py-1 text-[11px] font-bold text-[var(--color-text-secondary)]">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                    {feat.title}
                  </h3>

                  <p className="mt-3 text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                {/* Bottom Highlight Line */}
                <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{isRTL ? 'مشمول في جميع الباقات' : 'Included in platform'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
