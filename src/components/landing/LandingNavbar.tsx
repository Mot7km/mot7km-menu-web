'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
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
import { useTheme } from '@/hooks/useTheme';

interface LandingNavbarProps {
  onScrollTo?: (sectionId: string) => void;
}

export function LandingNavbar({ onScrollTo }: LandingNavbarProps) {
  const t = useTranslations('landing.navbar');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');

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
    setTheme(isDark ? 'light' : 'dark');
  };

  const toggleLanguage = () => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    const cleanPath = pathname.replace(/^\/(ar|en)/, '');
    router.push(`/${nextLocale}${cleanPath || ''}`);
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <header className="sticky top-0 z-50 w-full py-3 px-4 sm:px-6 lg:px-8 backdrop-blur-xl border-b border-[var(--color-border)]/50 transition-colors duration-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between">

        {/* ================= 1. Brand Logo ================= */}
        <Link
          href={`/${locale}`}
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('hero');
          }}
          className="group flex items-center gap-2.5 shrink-0"
        >
          {/* Stylized Interlocking Logo Knot */}
          <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <svg
              className="h-8 w-8 sm:h-9 sm:w-9 text-[var(--color-primary)]"
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
                className="drop-shadow-[0_0_8px_rgba(var(--color-primary-rgb,0,163,255),0.6)]"
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
                className="opacity-75"
              />
            </svg>
          </div>

          {/* Brand Name + Pulsing Status Indicator */}
          <div className="flex items-center gap-1.5">
            <span className="text-lg sm:text-xl font-black tracking-tight text-[var(--color-text-primary)]">
              Mot7km
            </span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#10B981]" />
            </span>
          </div>
        </Link>

        {/* ================= 2. Center Island Pill Navigation ================= */}
        <nav className="hidden md:flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur-xl px-2 py-1.5 shadow-sm">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`relative rounded-full px-4 py-1.5 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${isActive
                    ? 'bg-[var(--color-primary)] text-white shadow-sm'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-subtle)]'
                  }`}
              >
                <span>{section.label}</span>
              </button>
            );
          })}
        </nav>

        {/* ================= 3. Right Action Controls ================= */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={t('toggleTheme')}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-subtle)] transition-colors cursor-pointer shadow-sm"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-[var(--color-primary)]" />
            )}
          </button>

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            title={t('toggleLanguage')}
            aria-label={t('toggleLanguage')}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-subtle)] transition-colors cursor-pointer shadow-sm"
          >
            <Languages className="h-4 w-4" />
          </button>

          {/* Primary CTA Button: "Request Demo" scrolls to plans or demo */}
          <button
            onClick={() => scrollToSection('plans')}
            className="relative hidden sm:inline-flex items-center gap-2 overflow-hidden rounded-full bg-[var(--color-primary)] px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-md shadow-[var(--color-primary)]/25 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--color-primary)]/35 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
          >
            <span>{t('requestDemo')}</span>
            <ArrowIcon className="h-3.5 w-3.5" />
          </button>

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] md:hidden cursor-pointer"
            aria-label={t('toggleMenu')}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ================= Mobile Expandable Drawer ================= */}
      {mobileMenuOpen && (
        <div className="mt-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/98 backdrop-blur-2xl p-4 shadow-xl md:hidden animate-in slide-in-from-top-3 duration-200">
          <div className="flex flex-col gap-1.5">
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-start text-sm font-bold transition-all cursor-pointer ${isActive
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-primary)]'
                    }`}
                >
                  <span>{section.label}</span>
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-white shadow-sm" />
                  )}
                </button>
              );
            })}

            <div className="mt-3 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 text-xs font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer"
              >
                <Languages className="h-4 w-4 text-[var(--color-primary)]" />
                <span>{locale === 'ar' ? 'English' : 'العربية'}</span>
              </button>

              <button
                onClick={() => scrollToSection('plans')}
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)] px-4 py-2 text-xs font-bold text-white shadow-md cursor-pointer"
              >
                <span>{t('requestDemo')}</span>
                <ArrowIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
