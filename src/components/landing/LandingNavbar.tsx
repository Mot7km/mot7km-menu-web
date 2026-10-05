'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Moon,
  Sun,
  ArrowRight,
  Languages,
  Check,
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface LandingNavbarProps {
  onScrollTo?: (sectionId: string) => void;
}

export function LandingNavbar({ onScrollTo }: LandingNavbarProps) {
  const t = useTranslations('landing.navbar');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');

  useEffect(() => {
    setMounted(true);
  }, []);

  // List of real page sections in order with next-intl translation keys
  const sections = useMemo(
    () => [
      { id: 'hero', label: t('home') },
      { id: 'summary', label: t('about') },
      { id: 'features', label: t('features') },
      { id: 'clients', label: t('clients') },
      { id: 'plans', label: t('plans') },
    ],
    [t]
  );

  // ScrollSpy: Detect which section is currently visible on scroll
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY + 160;

          // If at the very top of page
          if (window.scrollY < 100) {
            setActiveSection('hero');
            ticking = false;
            return;
          }

          // Check sections in reverse order to find the active one
          for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            const el = document.getElementById(section.id);
            if (el) {
              const top = el.offsetTop;
              if (scrollPosition >= top) {
                setActiveSection(section.id);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      setIsLangMenuOpen(false);
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Smooth scroll handler with offset for floating navbar
  const scrollToSection = useCallback(
    (sectionId: string) => {
      setActiveSection(sectionId);
      setMobileMenuOpen(false);

      if (onScrollTo) {
        onScrollTo(sectionId);
        return;
      }

      const el = document.getElementById(sectionId);
      if (el) {
        const navHeight = 90;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navHeight;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    },
    [onScrollTo]
  );

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) {
      setIsLangMenuOpen(false);
      return;
    }
    const cleanPath = pathname.replace(/^\/(ar|en)/, '');
    router.push(`/${newLocale}${cleanPath || ''}`);
    setIsLangMenuOpen(false);
  };

  return (
    <header className="fixed top-3 sm:top-4 left-0 right-0 z-50 flex justify-center px-4 sm:px-8 pointer-events-none transition-all duration-300">
      <div className="container mx-auto flex items-center justify-between pointer-events-auto relative max-w-7xl">
        
        {/* ================= 1. Left (RTL: Right): Brand Logo & Name ================= */}
        <Link
          href={`/${locale}`}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('hero');
          }}
          className="flex items-center gap-3 shrink-0 group py-1"
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-[#2B9FD9]/30 blur-md rounded-full group-hover:bg-[#2B9FD9]/50 transition-all duration-500 scale-125" />
            <img
              src="/assets/logo/mot7km_logo%20(2).png"
              alt="Mot7km Logo"
              className="h-8 sm:h-9 w-auto relative z-10 group-hover:rotate-12 transition-transform duration-300"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-[#2B9FD9] transition-colors">
              Mot7km
            </span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#10B981]" />
            </span>
          </div>
        </Link>

        {/* ================= 2. Center: Floating Island Pill Navigation ================= */}
        <nav className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 shadow-lg dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] bg-white/85 dark:bg-[#090d16]/85 backdrop-blur-2xl relative">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-white bg-[#2B9FD9] shadow-[0_2px_12px_rgba(43,159,217,0.45)]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
                }`}
              >
                <span>{section.label}</span>
              </button>
            );
          })}
        </nav>

        {/* ================= 3. Right (RTL: Left): Controls & CTA Button ================= */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center w-9 h-9 cursor-pointer"
            aria-label={t('toggleTheme')}
          >
            {mounted && (
              <motion.div
                key={resolvedTheme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {isDark ? (
                  <Sun size={18} className="text-amber-400" />
                ) : (
                  <Moon size={18} className="text-[#2B9FD9]" />
                )}
              </motion.div>
            )}
          </motion.button>

          {/* Language Selector */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsLangMenuOpen(!isLangMenuOpen);
              }}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center w-9 h-9 cursor-pointer"
              aria-label={t('toggleLanguage')}
            >
              <Languages size={18} />
            </motion.button>

            <AnimatePresence>
              {isLangMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-32 bg-white/95 dark:bg-[#0c1626]/95 backdrop-blur-2xl border border-black/10 dark:border-white/15 rounded-2xl shadow-xl py-1.5 z-50 overflow-hidden"
                >
                  <button
                    onClick={() => switchLocale('ar')}
                    className={`w-full text-start px-4 py-2 text-xs font-bold transition-colors flex items-center justify-between hover:bg-[#2B9FD9]/10 cursor-pointer ${
                      locale === 'ar' ? 'text-[#2B9FD9]' : 'text-slate-800 dark:text-white'
                    }`}
                  >
                    <span>العربية</span>
                    {locale === 'ar' && <Check size={14} className="text-[#2B9FD9]" />}
                  </button>
                  <button
                    onClick={() => switchLocale('en')}
                    className={`w-full text-start px-4 py-2 text-xs font-bold transition-colors flex items-center justify-between hover:bg-[#2B9FD9]/10 cursor-pointer ${
                      locale === 'en' ? 'text-[#2B9FD9]' : 'text-slate-800 dark:text-white'
                    }`}
                  >
                    <span>English</span>
                    {locale === 'en' && <Check size={14} className="text-[#2B9FD9]" />}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Prominent High-Converting SaaS Demo CTA Button */}
          <button
            onClick={() => scrollToSection('plans')}
            className="group hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#2B9FD9] via-[#38BDF8] to-[#10B981] text-white font-extrabold text-xs sm:text-sm shadow-[0_0_20px_rgba(43,159,217,0.4)] hover:shadow-[0_0_30px_rgba(43,159,217,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <span>{t('requestDemo')}</span>
            <ArrowRight size={15} className="rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            className="md:hidden p-2 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={t('toggleMenu')}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

        </div>

      </div>

      {/* ================= Mobile Expandable Drawer ================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md pointer-events-auto z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="md:hidden pointer-events-auto absolute top-16 left-4 right-4 bg-white/95 dark:bg-[#090d16]/95 backdrop-blur-3xl border border-black/10 dark:border-white/15 rounded-3xl p-5 flex flex-col gap-3 shadow-2xl z-50 overflow-y-auto max-h-[85vh]"
            >
              <div className="flex flex-col gap-1.5">
                {sections.map((section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`flex items-center justify-between rounded-2xl px-4 py-3 text-start text-sm font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#2B9FD9] text-white shadow-md shadow-[#2B9FD9]/25'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span>{section.label}</span>
                      {isActive && (
                        <span className="h-2 w-2 rounded-full bg-white shadow-sm" />
                      )}
                    </button>
                  );
                })}
              </div>

              <hr className="border-black/10 dark:border-white/10 my-1" />

              <div className="flex items-center justify-between px-2">
                <button
                  onClick={() => switchLocale(locale === 'ar' ? 'en' : 'ar')}
                  className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer py-1"
                >
                  <Languages size={16} className="text-[#2B9FD9]" />
                  <span>{locale === 'ar' ? 'English' : 'العربية'}</span>
                </button>
              </div>

              <button
                onClick={() => scrollToSection('plans')}
                className="w-full text-center py-3.5 rounded-2xl bg-gradient-to-r from-[#2B9FD9] via-[#38BDF8] to-[#10B981] text-white font-extrabold text-sm shadow-[0_0_20px_rgba(43,159,217,0.4)] hover:shadow-[0_0_30px_rgba(43,159,217,0.7)] cursor-pointer"
              >
                {t('requestDemo')}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </header>
  );
}

export default LandingNavbar;
