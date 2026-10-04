'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  ArrowUp, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Zap,
  Star,
  Store
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

const BASE_URL = 'https://mot7km.store';

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const Facebook = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const FOOTER_TRANSLATIONS: Record<string, { ar: string; en: string }> = {
  'footer.ctaTitle': {
    ar: 'هل أنت جاهز لتطوير أعمالك؟',
    en: 'Ready to take your business to the next level?',
  },
  'footer.ctaDesc': {
    ar: 'انضم إلى مئات المطاعم والكافيهات التي تثق بمنصة مُتحكّم لإدارة وتطوير عملياتها التشغيلية والمالية.',
    en: 'Join hundreds of dining brands that rely on Mot7km for lightning-fast digital menus and effortless growth.',
  },
  'footer.trustBadge1': {
    ar: 'إعداد فوري بدون تعقيد',
    en: 'Instant Setup',
  },
  'footer.trustBadge2': {
    ar: 'سحابي وسريع 100%',
    en: '100% Cloud & Fast',
  },
  'footer.trustBadge3': {
    ar: 'حماية وتشفير متكامل',
    en: 'Enterprise Security',
  },
  'footer.emailPlaceholder': {
    ar: 'أدخل بريدك الإلكتروني...',
    en: 'Enter your email address...',
  },
  'footer.subscribe': {
    ar: 'اشترك الآن',
    en: 'Subscribe',
  },
  'footer.subSuccess': {
    ar: 'تم الاشتراك بنجاح! سنبقيك على اطلاع دائم.',
    en: "Subscribed successfully! We'll keep you updated.",
  },
  'footer.desc': {
    ar: 'المنظومة السحابية المتكاملة لإدارة ونشر القوائم الرقمية للمطاعم والكافيهات. حلول ذكية سريعة تلهم عملاءك وتزيد مبيعاتك.',
    en: 'Next-generation cloud digital menu ecosystem for restaurants and cafes. Fast, intuitive, and conversion-focused.',
  },
  'footer.statusOperational': {
    ar: 'جميع الأنظمة تعمل بكفاءة',
    en: 'All systems operational 99.9%',
  },
  'footer.links': {
    ar: 'روابط سريعة',
    en: 'Quick Links',
  },
  'nav.features': {
    ar: 'المميزات',
    en: 'Features',
  },
  'nav.pricing': {
    ar: 'باقات الاشتراك',
    en: 'Pricing Plans',
  },
  'footer.solutions': {
    ar: 'الحلول المتخصصة',
    en: 'Solutions',
  },
  'footer.solutionCafe': {
    ar: 'للمقاهي والكافيهات',
    en: 'For Cafes',
  },
  'footer.solutionGaming': {
    ar: 'لصالات الألعاب والترفيه',
    en: 'For Gaming Lounges',
  },
  'footer.solutionJuice': {
    ar: 'لمحلات العصائر والمشروبات',
    en: 'For Juice Bars',
  },
  'footer.solutionRestaurant': {
    ar: 'للمطاعم والوجبات السريعة',
    en: 'For Restaurants',
  },
  'footer.aboutUs': {
    ar: 'من نحن',
    en: 'About Us',
  },
  'footer.blog': {
    ar: 'المدونة',
    en: 'Blog',
  },
  'footer.contact': {
    ar: 'اتصل بنا',
    en: 'Contact Us',
  },
  'footer.address': {
    ar: 'المملكة العربية السعودية، الرياض',
    en: 'Riyadh, Saudi Arabia',
  },
  'footer.rights': {
    ar: `© ${new Date().getFullYear()} مُتحكّم (MOT7KM). جميع الحقوق محفوظة.`,
    en: `© ${new Date().getFullYear()} MOT7KM Cloud Systems. All rights reserved.`,
  },
  'footer.backToTop': {
    ar: 'العودة للأعلى',
    en: 'Back to top',
  },
};

export function LandingFooter() {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const tLanding = useTranslations('landing');

  const t = (key: string): string => {
    try {
      if (tLanding && tLanding.has(key)) {
        return tLanding(key);
      }
    } catch {
      // Fallback
    }
    const item = FOOTER_TRANSLATIONS[key];
    if (item) {
      return isRtl ? item.ar : item.en;
    }
    return key;
  };

  const footerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ['start end', 'end end']
  });

  // Jisr-style scroll unveil transform for MOT7KM background watermark
  const watermarkY = useTransform(scrollYProgress, [0.1, 1], ['80px', '0px']);
  const watermarkOpacity = useTransform(scrollYProgress, [0.1, 0.6, 1], [0.05, 0.25, 0.45]);
  const watermarkScale = useTransform(scrollYProgress, [0.1, 1], [0.9, 1.05]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const rawCtaTitle = t('footer.ctaTitle');
  const ctaTitlePrefix = rawCtaTitle.includes('؟')
    ? rawCtaTitle.split('؟')[0]
    : rawCtaTitle.includes('?')
      ? rawCtaTitle.split('?')[0]
      : rawCtaTitle;

  return (
    <footer ref={footerRef} className="relative bg-[#060c18] border-t border-white/10 pt-16 sm:pt-24 md:pt-28 pb-8 overflow-hidden z-0">
      
      {/* Background Lighting Orbs */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#2B9FD9]/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] opacity-[0.08] pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2B9FD9] via-[#10B981] to-transparent blur-[140px] rounded-full" />
      </div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#0B529E]/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      {/* JISR-STYLE GIANT BACKDROP WATERMARK "MOT7KM" (Placed behind links and unveiled on scroll) */}
      <motion.div 
        style={{ 
          y: watermarkY, 
          opacity: watermarkOpacity, 
          scale: watermarkScale 
        }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-none select-none overflow-hidden w-full flex justify-center z-0"
      >
        <h1 className="text-[22vw] sm:text-[20vw] md:text-[18vw] leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-white/25 via-white/10 to-transparent tracking-tighter drop-shadow-[0_20px_50px_rgba(43,159,217,0.35)]">
          MOT7KM
        </h1>
      </motion.div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        
        {/* Masterpiece Premium SaaS Banner CTA */}
        <div className="relative mb-16 md:mb-24 p-8 sm:p-12 md:p-14 rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-[#0c1626] via-[#09111e] to-[#0d1c30] border border-white/15 backdrop-blur-3xl shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden group">
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#2B9FD9]/20 blur-[100px] rounded-full pointer-events-none group-hover:bg-[#2B9FD9]/30 transition-all duration-700" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#10B981]/15 blur-[100px] rounded-full pointer-events-none group-hover:bg-[#10B981]/25 transition-all duration-700" />
          
          <div 
            className="absolute inset-0 opacity-[0.04] pointer-events-none" 
            style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
            
            <div className="max-w-2xl text-center lg:text-start flex flex-col items-center lg:items-start">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2B9FD9]/15 border border-[#2B9FD9]/35 text-[#38BDF8] text-xs font-extrabold mb-5 shadow-sm backdrop-blur-md">
                <Sparkles size={14} className="text-[#38BDF8] animate-pulse" />
                <span className="tracking-wider uppercase">Mot7km SaaS Platform v1.1</span>
              </div>

              <h3 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-4 tracking-tight leading-[1.2]">
                {ctaTitlePrefix}
                <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-[#2B9FD9] via-[#38BDF8] to-[#10B981]">
                  {isRtl ? ' في مكان واحد؟' : ' in one place?'}
                </span>
              </h3>
              
              <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                {t('footer.ctaDesc')}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs font-bold">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-emerald-300 backdrop-blur-md shadow-sm">
                  <CheckCircle2 size={16} />
                  <span>{t('footer.trustBadge1')}</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#2B9FD9]/15 border border-[#2B9FD9]/30 text-[#38BDF8] backdrop-blur-md shadow-sm">
                  <Zap size={16} />
                  <span>{t('footer.trustBadge2')}</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 backdrop-blur-md shadow-sm">
                  <ShieldCheck size={16} />
                  <span>{t('footer.trustBadge3')}</span>
                </div>
              </div>

            </div>

            <div className="flex flex-col w-full lg:w-auto min-w-[300px] sm:min-w-[420px] max-w-full">
              
              <form onSubmit={handleSubscribe} className="relative p-2 rounded-2xl bg-white/[0.06] border border-white/15 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] focus-within:border-[#2B9FD9] focus-within:ring-2 focus-within:ring-[#2B9FD9]/30 transition-all duration-300 flex items-center">
                <div className="pl-3 rtl:pl-0 rtl:pr-3 text-slate-400 flex-shrink-0">
                  <Mail size={20} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('footer.emailPlaceholder')}
                  required
                  className="w-full bg-transparent border-none outline-none text-sm text-white px-3 py-2.5 placeholder:text-slate-400 flex-1 font-medium"
                />
                <button 
                  type="submit"
                  className="group bg-gradient-to-r from-[#2B9FD9] to-[#10B981] hover:from-[#38BDF8] hover:to-[#2B9FD9] text-white font-bold px-6 py-3.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(43,159,217,0.45)] hover:shadow-[0_0_35px_rgba(43,159,217,0.75)] transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer whitespace-nowrap flex-shrink-0"
                >
                  <span>{t('footer.subscribe')}</span>
                  <ArrowRight size={16} className="rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform duration-200" />
                </button>
              </form>

              <div className="flex items-center justify-between mt-4 px-2 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-2 rtl:space-x-reverse">
                    <div className="w-6 h-6 rounded-full bg-[#2B9FD9]/30 border border-white/20 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                      ☕
                    </div>
                    <div className="w-6 h-6 rounded-full bg-[#0B529E]/40 border border-white/20 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                      🍕
                    </div>
                    <div className="w-6 h-6 rounded-full bg-[#10B981]/30 border border-white/20 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                      🧃
                    </div>
                  </div>
                  <span className="font-semibold text-slate-300 ml-1 rtl:mr-1">
                    {isRtl ? 'انضم لـ 500+ مطعم وكافيه' : 'Join 500+ food businesses'}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star size={13} className="fill-amber-400" />
                  <span>4.9/5</span>
                </div>
              </div>

              <AnimatePresence>
                {subscribed && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold text-center backdrop-blur-md"
                  >
                    {t('footer.subSuccess')}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* Main Footer Content Grid (Covers upper MOT7KM text initially, reveals on scroll) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16 relative z-10">
          
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-start">
            <Link href={`${BASE_URL}/`} className="flex items-center gap-3 mb-5 group">
              <div className="relative">
                <div className="absolute inset-0 bg-[#2B9FD9]/30 blur-xl rounded-full group-hover:bg-[#2B9FD9]/60 transition-colors duration-500" />
                <img 
                  src="/assets/logo/mot7km_logo%20(2).png" 
                  alt="Mot7km Logo" 
                  className="h-11 sm:h-12 w-auto relative z-10 group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="font-black text-2xl sm:text-3xl tracking-tight text-white group-hover:text-[#38BDF8] transition-colors duration-300">
                Mot7km
              </span>
            </Link>
            
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
              {t('footer.desc')}
            </p>

            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold mb-6 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span>{t('footer.statusOperational')}</span>
            </div>

            <div className="flex items-center gap-3">
              {[
                { Icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61591358790071', label: 'Facebook' },
                { Icon: Instagram, href: 'https://www.instagram.com/mot7km', label: 'Instagram' },
                { Icon: XIcon, href: '#', label: 'X' },
                { Icon: Linkedin, href: '#', label: 'LinkedIn' }
              ].map((item, idx) => (
                <a 
                  key={idx} 
                  href={item.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={item.label}
                  className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#2B9FD9] hover:border-[#38BDF8] hover:shadow-[0_0_20px_rgba(43,159,217,0.7)] hover:-translate-y-1 transition-all duration-300 shadow-sm cursor-pointer active:scale-95"
                >
                  <item.Icon width={18} height={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Product Column */}
          <div className="lg:col-span-2 sm:col-span-1">
            <h4 className="font-extrabold text-[#2B9FD9] mb-5 text-xs uppercase tracking-wider">
              {t('footer.links')}
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              {[
                { label: t('nav.features'), href: `${BASE_URL}/#features` },
                { label: t('nav.pricing'), href: `${BASE_URL}/#pricing` },
                { label: isRtl ? 'التكاملات والربط' : 'Integrations', href: `${BASE_URL}/integrations` },
                { label: isRtl ? 'سجل التحديثات' : 'Changelog', href: `${BASE_URL}/changelog` },
              ].map((link, i) => (
                <li key={i}>
                  <Link 
                    href={link.href} 
                    className="text-slate-400 hover:text-[#38BDF8] transition-all duration-200 inline-flex items-center gap-2.5 group hover:translate-x-1.5 rtl:hover:-translate-x-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2B9FD9]/50 group-hover:bg-[#38BDF8] group-hover:scale-150 group-hover:shadow-[0_0_8px_#38BDF8] transition-all duration-300 flex-shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions Column */}
          <div className="lg:col-span-2 sm:col-span-1">
            <h4 className="font-extrabold text-[#2B9FD9] mb-5 text-xs uppercase tracking-wider">
              {t('footer.solutions')}
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              {[
                { label: t('footer.solutionCafe'), href: `${BASE_URL}/solutions/cafe` },
                { label: t('footer.solutionGaming'), href: `${BASE_URL}/solutions/gaming` },
                { label: t('footer.solutionJuice'), href: `${BASE_URL}/solutions/juice` },
                { label: t('footer.solutionRestaurant'), href: `${BASE_URL}/solutions/restaurant` }
              ].map((link, i) => (
                <li key={i}>
                  <Link 
                    href={link.href} 
                    className="text-slate-400 hover:text-[#38BDF8] transition-all duration-200 inline-flex items-center gap-2.5 group hover:translate-x-1.5 rtl:hover:-translate-x-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2B9FD9]/50 group-hover:bg-[#38BDF8] group-hover:scale-150 group-hover:shadow-[0_0_8px_#38BDF8] transition-all duration-300 flex-shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources & Company Column */}
          <div className="lg:col-span-2 sm:col-span-1">
            <h4 className="font-extrabold text-[#2B9FD9] mb-5 text-xs uppercase tracking-wider">
              {isRtl ? 'الموارد والشركة' : 'Resources & Company'}
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              {[
                { label: t('footer.aboutUs'), href: `${BASE_URL}/about` },
                { label: t('footer.blog'), href: `${BASE_URL}/blog` },
                { label: isRtl ? 'مركز المساعدة والتوثيق' : 'Docs & Help', href: `${BASE_URL}/docs` },
                { label: isRtl ? 'الوظائف' : 'Careers', href: `${BASE_URL}/careers` },
                { label: isRtl ? 'طلب عرض تجريبي' : 'Request Demo', href: `${BASE_URL}/demo` },
                { label: isRtl ? 'اتصل بنا' : 'Contact Us', href: `${BASE_URL}/contact` },
              ].map((link, i) => (
                <li key={i}>
                  <Link 
                    href={link.href} 
                    className="text-slate-400 hover:text-[#38BDF8] transition-all duration-200 inline-flex items-center gap-2.5 group hover:translate-x-1.5 rtl:hover:-translate-x-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2B9FD9]/50 group-hover:bg-[#38BDF8] group-hover:scale-150 group-hover:shadow-[0_0_8px_#38BDF8] transition-all duration-300 flex-shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-2 sm:col-span-1">
            <h4 className="font-extrabold text-[#2B9FD9] mb-5 text-xs uppercase tracking-wider">
              {t('footer.contact')}
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm font-medium">
              <li>
                <a 
                  href="#" 
                  className="flex items-center gap-2.5 text-slate-400 hover:text-white transition-all duration-200 group hover:translate-x-1.5 rtl:hover:-translate-x-1.5"
                >
                  <MapPin size={16} className="text-[#2B9FD9] group-hover:text-[#38BDF8] group-hover:scale-110 transition-all duration-200 flex-shrink-0" />
                  <span>{t('footer.address')}</span>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+966501234567" 
                  className="flex items-center gap-2.5 text-slate-400 hover:text-white transition-all duration-200 group hover:translate-x-1.5 rtl:hover:-translate-x-1.5"
                >
                  <Phone size={16} className="text-[#2B9FD9] group-hover:text-[#38BDF8] group-hover:scale-110 transition-all duration-200 flex-shrink-0" />
                  <span dir="ltr">+966 50 123 4567</span>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:mot7km@gmail.com" 
                  className="flex items-center gap-2.5 text-slate-400 hover:text-white transition-all duration-200 group hover:translate-x-1.5 rtl:hover:-translate-x-1.5"
                >
                  <Mail size={16} className="text-[#2B9FD9] group-hover:text-[#38BDF8] group-hover:scale-110 transition-all duration-200 flex-shrink-0" />
                  <span>mot7km@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Utility Bar (Privacy / Rights / Back to top) */}
        <div className="relative z-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-xs sm:text-sm font-medium">
            {t('footer.rights')}
          </p>

          <div className="flex items-center gap-4">
            <button 
              onClick={scrollToTop}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-slate-300 hover:text-white hover:bg-[#2B9FD9]/20 hover:border-[#2B9FD9]/60 hover:shadow-[0_0_20px_rgba(43,159,217,0.4)] transition-all duration-200 text-xs font-bold cursor-pointer active:scale-95 group"
            >
              <span>{t('footer.backToTop')}</span>
              <ArrowUp size={14} className="group-hover:-translate-y-1 transition-transform duration-200 text-[#38BDF8]" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}

export const Footer = LandingFooter;
export default LandingFooter;
