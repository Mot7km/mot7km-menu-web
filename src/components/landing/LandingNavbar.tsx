'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  Moon,
  Sun,
  ArrowRight,
  ArrowLeft,
  Languages,
} from 'lucide-react';
import { applyThemePalette } from '@/config/theme';

interface LandingNavbarProps {
  onScrollTo?: (sectionId: string) => void;
}

export function LandingNavbar({ onScrollTo }: LandingNavbarProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const pathname = usePathname();
  const router = useRouter();

  const [isDark, setIsDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');

  // List of real page sections in order
  const sections = useMemo(
    () => [
      { id: 'hero', label: isRTL ? 'الرئيسية' : 'Home' },
      { id: 'summary', label: isRTL ? 'عن المنصة' : 'About' },
      { id: 'features', label: isRTL ? 'المميزات' : 'Features' },
      { id: 'clients', label: isRTL ? 'شركاؤنا' : 'Featured Menus' },
      { id: 'plans', label: isRTL ? 'الأسعار' : 'Pricing' },
    ],
    [isRTL]
  );

  // Initialize theme state from DOM
  useEffect(() => {
    if (typeof document !== 'undefined') {
      setIsDark(document.documentElement.classList.contains('dark'));
    }
  }, []);

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
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  // Smooth scroll handler with offset for sticky navbar
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
        const navHeight = 85;
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
    if (typeof document === 'undefined') return;
    const nextDark = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', nextDark);
    applyThemePalette();
    setIsDark(nextDark);
    try {
      localStorage.setItem('mot7km-theme-mode', nextDark ? 'dark' : 'light');
    } catch {}
  };

  const toggleLanguage = () => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    const cleanPath = pathname.replace(/^\/(ar|en)/, '');
    router.push(`/${nextLocale}${cleanPath || ''}`);
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <header className="sticky top-0 z-50 w-full py-3 px-4 sm:px-6 lg:px-8 bg-transparent">
      {/* Container holding brand, centered pill navbar, and action buttons */}
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        
        {/* ================= 1. Brand Logo (Left) ================= */}
        <Link
          href={`/${locale}`}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('hero');
          }}
          className="group flex items-center gap-2.5 shrink-0"
        >
          {/* Stylized Interlocking Ribbon / Knot Icon */}
          <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <svg
              className="h-8 w-8 sm:h-9 sm:w-9 text-[#00A3FF]"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="11"
                y="7"
                width="19"
                height="19"
                rx="4.5"
                transform="rotate(22 20.5 16.5)"
                stroke="currentColor"
                strokeWidth="2.8"
                className="drop-shadow-[0_0_8px_rgba(0,163,255,0.6)]"
              />
              <rect
                x="8"
                y="13"
                width="19"
                height="19"
                rx="4.5"
                transform="rotate(-22 17.5 22.5)"
                stroke="currentColor"
                strokeWidth="2.8"
                className="opacity-80"
              />
            </svg>
          </div>

          {/* Brand Name + Pulsing Green Live Indicator */}
          <div className="flex items-center gap-1.5">
            <span className="text-lg sm:text-xl font-black tracking-tight text-white dark:text-white [text-shadow:_0_1px_8px_rgba(0,0,0,0.5)]">
              Mot7km
            </span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#10B981]"></span>
            </span>
          </div>
        </Link>

        {/* ================= 2. Center Island Pill Navigation (Desktop ScrollSpy) ================= */}
        <nav className="hidden md:flex items-center rounded-full border border-white/10 bg-[#081226]/85 dark:bg-[#070e1e]/90 backdrop-blur-xl px-2 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.36)]">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`relative rounded-full px-4 py-1.5 text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-[#162746] text-[#38BDF8] shadow-inner shadow-[#38BDF8]/20 scale-100'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>{section.label}</span>
              </button>
            );
          })}
        </nav>

        {/* ================= 3. Right Action Controls ================= */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle (Moon / Sun) */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-300 hover:text-white transition-colors cursor-pointer hover:bg-white/10"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-[#38BDF8]" />
            )}
          </button>

          {/* Language Switcher (Translate Icon 文A) */}
          <button
            onClick={toggleLanguage}
            title={locale === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-300 hover:text-white transition-colors cursor-pointer hover:bg-white/10"
          >
            <Languages className="h-4 w-4" />
          </button>

          {/* Primary Gradient CTA Pill Button: "Request Demo →" */}
          <Link
            href={`/${locale}/menu`}
            className="relative hidden sm:inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#0094FF] via-[#0080FF] to-[#0066FE] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-[0_0_20px_rgba(0,148,255,0.4)] transition-all duration-300 hover:shadow-[0_0_28px_rgba(0,148,255,0.6)] hover:scale-105 active:scale-95"
          >
            <span>{isRTL ? 'طلب تجربة' : 'Request Demo'}</span>
            <ArrowIcon className="h-3.5 w-3.5" />
          </Link>

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white md:hidden cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ================= Mobile Expandable Drawer ================= */}
      {mobileMenuOpen && (
        <div className="mt-3 rounded-3xl border border-white/10 bg-[#091328]/95 backdrop-blur-2xl p-5 shadow-2xl md:hidden animate-in slide-in-from-top-3 duration-200">
          <div className="flex flex-col gap-1.5">
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-start text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-[#162746] text-[#38BDF8]'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{section.label}</span>
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#38BDF8] shadow-[0_0_6px_#38BDF8]" />
                  )}
                </button>
              );
            })}

            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-4">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 text-xs font-bold text-slate-300"
              >
                <Languages className="h-4 w-4 text-[#38BDF8]" />
                <span>{locale === 'ar' ? 'English' : 'العربية'}</span>
              </button>

              <Link
                href={`/${locale}/menu`}
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#0094FF] to-[#0066FE] px-4 py-2 text-xs font-bold text-white shadow-md"
              >
                <span>{isRTL ? 'طلب تجربة' : 'Request Demo'}</span>
                <ArrowIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
