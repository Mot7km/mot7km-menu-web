'use client';

import { useLocale } from 'next-intl';
import { Layers, CheckCircle2, XCircle, ArrowUpRight, Award, Zap, Compass, Users } from 'lucide-react';

export function LandingSummary() {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const pillars = [
    {
      icon: Zap,
      title: isRTL ? 'سرعة فائقة ومرونة تامة' : 'Lightning-Fast Agility',
      desc: isRTL
        ? 'تحميل القائمة خلال أجزاء من الثانية من أي هاتف دون الحاجة لتنزيل أي تطبيق خارجي أو تسجيل دخول معقد.'
        : 'Menus load in fractions of a second on any smartphone with zero app downloads or complicated sign-ups.',
    },
    {
      icon: Compass,
      title: isRTL ? 'إدارة سحابية مركزية' : 'Centralized Cloud Control',
      desc: isRTL
        ? 'تعديل فوري للأسعار، إضافة صور الأطباق، وإخفاء الأصناف غير المتوفرة فوراً بنقرة واحدة من لوحة التحكم.'
        : 'Update prices instantly, upload rich food photography, and toggle out-of-stock items in real time with one click.',
    },
    {
      icon: Users,
      title: isRTL ? 'زيادة ولاء العملاء والمبيعات' : 'Higher Average Order Value',
      desc: isRTL
        ? 'عروض ترويجية متحركة وسلايدرات ذكية تلفت انتباه الضيف لأطباقك المربحة وترفع متوسط الفاتورة بنسبة تصل إلى 35%.'
        : 'Dynamic promotional sliders and featured highlights drive customer interest toward high-margin menu items.',
    },
  ];

  return (
    <section id="summary" className="relative py-16 sm:py-24 bg-[var(--color-surface)]/50 border-y border-[var(--color-border)]/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[var(--color-primary)]">
            {isRTL ? 'عن المنصة' : 'About the Platform'}
          </span>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-4xl md:text-5xl">
            {isRTL ? 'ما هي منصة مُتـحكّـم (MOT7KM)؟' : 'What is MOT7KM Platform?'}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed">
            {isRTL
              ? 'مُتحكّم هي منظومة سحابية متطورة صُممت لقطاع المطاعم والمقاهي وصناع الضيافة في العالم العربي، لتحل محل القوائم الورقية المرهقة وملفات الـ PDF البطيئة، وتحولها إلى تجربة ويب تفاعلية تجمع بين سرعة الأداء وفخامة الهوية البصرية.'
              : 'MOT7KM is an enterprise-grade cloud ecosystem built for restaurants, cafes, and hospitality businesses. It transforms static paper menus and clunky PDFs into interactive, high-performance web experiences.'}
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
              {isRTL ? 'لماذا تختار مُتحكّم بدلاً من القوائم التقليدية و الـ PDF؟' : 'Why Choose MOT7KM Over Static PDF Menus?'}
            </h3>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              {isRTL ? 'مقارنة سريعة بين تجربة المنيو القديمة والحل السحابي الحديث' : 'A quick glance at traditional menus versus the modern MOT7KM experience'}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* The Old Way (PDF) */}
            <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-5 sm:p-6">
              <div className="flex items-center gap-2.5 text-red-500 font-bold mb-4">
                <XCircle className="h-5 w-5" />
                <h4 className="text-base sm:text-lg">{isRTL ? 'القوائم الورقية وملفات PDF' : 'Traditional Paper & PDF Menus'}</h4>
              </div>
              <ul className="space-y-3 text-sm text-[var(--color-text-secondary)]">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold">•</span>
                  <span>{isRTL ? 'ملفات ثقيلة تتطلب وقتاً طويلاً للتحميل واستهلاك باقة الإنترنت.' : 'Heavy file sizes take forever to download on cellular data.'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold">•</span>
                  <span>{isRTL ? 'صعوبة التكبير والتصغير على شاشات الموبايل وتجربة قراءة مزعجة.' : 'Awkward pinching and zooming on mobile screens.'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold">•</span>
                  <span>{isRTL ? 'تكلفة طباعة متكررة عند كل تعديل في الأسعار أو قائمة الأطباق.' : 'Expensive reprinting costs every time a price or item changes.'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold">•</span>
                  <span>{isRTL ? 'انعدام أي إحصائيات حول ما يفضله زوار مطعمك.' : 'Zero data insights on which dishes customers actually browse.'}</span>
                </li>
              </ul>
            </div>

            {/* The MOT7KM Way */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.04] p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2.5 text-emerald-500 font-bold mb-4">
                <CheckCircle2 className="h-5 w-5" />
                <h4 className="text-base sm:text-lg">{isRTL ? 'منصة مُتحكّـم السحابية الذكية' : 'MOT7KM Smart Cloud Experience'}</h4>
              </div>
              <ul className="space-y-3 text-sm text-[var(--color-text-primary)]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{isRTL ? 'فتح فوري خلال أجزاء من الثانية بمجرد مسح كود الـ QR.' : 'Opens in fractions of a second right upon scanning table QR.'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{isRTL ? 'واجهة متجاوبة 100% مصممة خصيصاً للجوال مع وضع ليلي ونهاري.' : 'Fully responsive UI tailored for mobile with dark & light modes.'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{isRTL ? 'تعديل الأسعار والعروض لحظياً بدون أي تكلفة طباعة إضافية.' : 'Instant price, offer, and stock updates with zero printing overhead.'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{isRTL ? 'سلايدر إعلاني سينمائي يبرز العروض ويزيد المبيعات الفورية.' : 'Cinematic 3D promotional sliders driving up impulse orders.'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
