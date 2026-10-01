'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Settings, Sun, Moon, Monitor, Globe, Check } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { i18n } from '@/config/i18n';
import { useLocaleTransition } from '@/context/LocaleTransitionContext';

function setLocaleCookie(newLocale: string) {
  if (typeof document !== 'undefined') {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax; Secure`;
  }
}

export function SettingsMenu() {
  const t = useTranslations();
  const { theme, setTheme } = useTheme();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { startLocaleTransition } = useLocaleTransition();

  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const currentTheme = theme || 'system';

  const segments = pathname.split('/').filter(Boolean);
  const currentLocale = segments[0] && i18n.locales.includes(segments[0] as (typeof i18n.locales)[number])
    ? segments[0]
    : locale;

  const updatePosition = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const popoverWidth = 240;
    const padding = 12;
    const isRtl = document.documentElement.dir === 'rtl';

    let left = isRtl
      ? rect.left
      : rect.right - popoverWidth;

    // Viewport bounds clamp
    left = Math.max(padding, Math.min(left, window.innerWidth - popoverWidth - padding));
    const top = rect.bottom + 8;

    setPosition({ top, left });
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, updatePosition]);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        popoverRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [open]);

  // Escape key to close
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const switchLocale = (newLocale: string) => {
    if (newLocale === currentLocale) return;
    startLocaleTransition();
    setLocaleCookie(newLocale);

    const segs = pathname.split('/').filter(Boolean);
    const hasLocalePrefix = segs[0] && i18n.locales.includes(segs[0] as (typeof i18n.locales)[number]);
    if (hasLocalePrefix) {
      segs[0] = newLocale;
    } else {
      segs.unshift(newLocale);
    }

    setOpen(false);
    router.push(`/${segs.join('/')}`);
    router.refresh();
  };

  const themeOptions = [
    { id: 'light' as const, icon: Sun, label: t('settings.light') },
    { id: 'dark' as const, icon: Moon, label: t('settings.dark') },
    { id: 'system' as const, icon: Monitor, label: t('settings.system') },
  ];

  const languageOptions = i18n.locales.map((loc) => ({
    id: loc,
    label: loc === 'en' ? t('languages.en') : t('languages.ar'),
  }));

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          flex items-center justify-center
          h-9 w-9 sm:h-10 sm:w-10
          rounded-xl
          bg-[var(--color-surface)]/80 backdrop-blur-md
          border border-[var(--color-border)]/60
          text-[var(--color-text-secondary)]
          hover:text-[var(--color-text-primary)]
          hover:bg-[var(--color-surface)]
          hover:border-[var(--color-border-strong)]
          transition-all duration-200
          shadow-sm
          cursor-pointer
        "
        aria-label={t('settings.title')}
        aria-expanded={open}
      >
        <Settings className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
      </button>

      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={popoverRef}
            className="fixed z-50 animate-scale-in"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              width: '240px',
            }}
          >
            <div
              className="
                rounded-2xl p-1.5
                bg-[var(--color-surface)]/95 backdrop-blur-xl
                border border-[var(--color-border)]/80
                shadow-2xl shadow-black/15
                space-y-1 text-sm
              "
            >
              {/* Language Section */}
              <div className="px-3 pt-2.5 pb-1">
                <div className="flex items-center gap-1.5 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  <Globe className="h-3.5 w-3.5" />
                  <span>{t('settings.language')}</span>
                </div>
                <div className="flex gap-1.5">
                  {languageOptions.map((lang) => {
                    const isActive = currentLocale === lang.id;
                    return (
                      <button
                        key={lang.id}
                        type="button"
                        onClick={() => switchLocale(lang.id)}
                        className={`
                          flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer
                          ${
                            isActive
                              ? 'bg-[var(--color-primary)] text-[var(--color-text-on-primary)] shadow-sm'
                              : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)]'
                          }
                        `}
                      >
                        {isActive && <Check className="h-3 w-3 stroke-[2.5]" />}
                        <span>{lang.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[var(--color-border)]/40 my-1" />

              {/* Theme Section */}
              <div className="px-3 pt-1 pb-2">
                <div className="flex items-center gap-1.5 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  <span>{t('settings.theme')}</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {themeOptions.map((mode) => {
                    const Icon = mode.icon;
                    const isActive = currentTheme === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setTheme(mode.id)}
                        className={`
                          flex flex-col items-center justify-center gap-1 py-2 px-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer
                          ${
                            isActive
                              ? 'bg-[var(--color-primary)] text-[var(--color-text-on-primary)] shadow-sm'
                              : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)]'
                          }
                        `}
                        title={mode.label}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="truncate max-w-full">{mode.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}