'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { useTranslations, useLocale } from 'next-intl';
import { useTheme } from '@/hooks/useTheme';
import { usePathname, useRouter } from 'next/navigation';
import {
  UtensilsCrossed,
  Phone,
  MapPin,
  Clock,
  Mail,
  Users,
  ExternalLink,
  Settings,
  Sun,
  Moon,
  Monitor,
  Globe,
  Check,
} from 'lucide-react';
import { storeInfo, isStoreOpen } from '@/data/storeInfo';
import {
  THEME_STORAGE_KEY,
} from '@/config/theme';
import { i18n } from '@/config/i18n';
import { useLocaleTransition } from '@/context/LocaleTransitionContext';
import { useStore } from '@/store/storeHooks';

// ─── Helpers ───────────────────────────────────────────────

function formatTimeLocalized(time24: string, locale: string): string {
  const [h, m] = time24.split(':').map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);

  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: locale === 'ar' ? false : true,
  };
  return new Intl.DateTimeFormat(locale, options).format(date);
}

function getTodayHours() {
  const today = new Date().getDay();
  const entry = storeInfo.workingHours.find((wh) => wh.day === today);
  return entry || null;
}

const socialColorMap: Record<string, string> = {
  whatsapp: 'var(--color-primary)',
  instagram: 'var(--color-secondary)',
  facebook: 'var(--color-accent)',
  tiktok: 'var(--color-text-primary)',
};

function SocialIcon({ platform, className }: { platform: string; className?: string }) {
  const paths: Record<string, string> = {
    whatsapp:
      'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z',
    instagram:
      'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
    facebook:
      'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
    tiktok:
      'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  };
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d={paths[platform] || ''} />
    </svg>
  );
}

// ─── Shared Popover ────────────────────────────────────────

function Popover({
  trigger,
  children,
  open,
  onToggle,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
  open: boolean;
  onToggle: () => void;
}) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const popoverWidth = 240;

  useEffect(() => {
    if (!open) return;
    const updatePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;

      let left = rect.right - popoverWidth + window.scrollX;
      let top = rect.bottom + window.scrollY + 8;

      const margin = 8;
      const minLeft = margin;
      const maxLeft = window.innerWidth - popoverWidth - margin;
      left = Math.max(minLeft, Math.min(left, maxLeft));

      top = Math.max(margin + window.scrollY, top);
      setPosition({ top, left });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleScroll = (e: Event) => {
      const target = e.target as Node;
      if (popoverRef.current?.contains(target)) return;
      onToggle();
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [open, onToggle]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        popoverRef.current?.contains(target)
      ) {
        return;
      }
      onToggle();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onToggle]);

  return (
    <div className="relative inline-block">
      <div ref={triggerRef} onClick={onToggle} className="cursor-pointer">
        {trigger}
      </div>
      {open &&
        createPortal(
          <div
            ref={popoverRef}
            className="fixed w-60 max-h-[calc(100vh-120px)] overflow-y-auto rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl p-3 z-[9999] animate-scale-in origin-top-right text-[var(--color-text-primary)]"
            style={{
              top: position.top,
              left: position.left,
            }}
          >
            {children}
          </div>,
          document.body
        )}
    </div>
  );
}

// ─── Settings Content ──────────────────────────────────────

function SettingsContent() {
  const t = useTranslations();
  const { theme, setTheme } = useTheme();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { startLocaleTransition } = useLocaleTransition();
  const currentTheme = theme || 'system';

  const applyTheme = (name: 'light' | 'dark' | 'system') => {
    try {
      if (name === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', prefersDark);
      } else {
        document.documentElement.classList.toggle('dark', name === 'dark');
      }
      localStorage.setItem(THEME_STORAGE_KEY, name);
    } catch (e) {}
  };

  const handleThemeChange = (mode: 'light' | 'dark' | 'system') => {
    setTheme(mode);
    applyTheme(mode);
  };

  const segments = pathname.split('/').filter(Boolean);
  const currentLocale = segments[0] && i18n.locales.includes(segments[0] as (typeof i18n.locales)[number])
    ? segments[0]
    : locale;

  const getLocalizedPath = (newLocale: string) => {
    const segs = pathname.split('/').filter(Boolean);
    const hasLocalePrefix = segs[0] && i18n.locales.includes(segs[0] as (typeof i18n.locales)[number]);
    if (hasLocalePrefix) {
      segs[0] = newLocale;
    } else {
      segs.unshift(newLocale);
    }
    return `/${segs.join('/')}`;
  };

  const switchLocale = (newLocale: string) => {
    if (newLocale === currentLocale) return;
    startLocaleTransition();
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax; Secure`;
    router.push(getLocalizedPath(newLocale));
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
      {/* Language */}
      <div className="px-3 pt-3 pb-1">
        <div className="flex items-center gap-2 px-1 pb-2">
          <Globe className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            {t('settings.language')}
          </span>
        </div>
        <div className="flex gap-1.5">
          {languageOptions.map((lang) => {
            const isActive = currentLocale === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => switchLocale(lang.id)}
                className={`
                  flex-1 flex items-center justify-center gap-1.5
                  py-2 rounded-xl text-sm font-medium
                  transition-all duration-200 ease-out
                  cursor-pointer
                  ${isActive
                    ? 'text-[var(--color-text-on-primary)] shadow-md'
                    : 'bg-[var(--color-primary-50)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-100)]'
                  }
                `}
                style={isActive ? { background: 'var(--gradient-primary)' } : undefined}
              >
                {isActive && <Check className="h-3 w-3" />}
                {lang.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="section-divider mx-3 my-2" />

      {/* Theme */}
      <div className="px-3 pt-1 pb-3">
        <div className="flex items-center gap-2 px-1 pb-2">
          <Sun className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            {t('settings.theme')}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          {themeOptions.map(({ id, icon: Icon, label }) => {
            const isActive = currentTheme === id;
            return (
              <button
                key={id}
                onClick={() => handleThemeChange(id)}
                className={`
                  flex items-center gap-3
                  w-full px-3 py-2.5 rounded-xl
                  text-sm font-medium
                  transition-all duration-200 ease-out
                  cursor-pointer
                  ${isActive
                    ? 'text-[var(--color-text-on-primary)] shadow-md'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-50)]'
                  }
                `}
                style={isActive ? { background: 'var(--gradient-primary)' } : undefined}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="flex-1 text-start">{label}</span>
                {isActive && <Check className="h-3.5 w-3.5 flex-shrink-0" />}
              </button>
            );
          })}
        </div>

      </div>
    </>
  );
}

// ─── SettingsMenu ──────────────────────────────────────────

export function SettingsMenu() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  const trigger = (
    <div
      className={`
        flex items-center justify-center
        w-8 h-8 sm:w-9 sm:h-9 rounded-full
        bg-[var(--color-surface)]/20 border border-[var(--color-border-strong)]/30
        text-[var(--color-on-secondary)] hover:bg-[var(--color-surface)]/30
        transition-all duration-250 ease-out
        cursor-pointer hover:scale-105 active:scale-95
        ${open ? 'bg-[var(--color-surface)]/30' : ''}
      `}
      role="button"
      tabIndex={0}
      aria-label={t('settings.title')}
      aria-expanded={open}
    >
      <Settings className={`h-[15px] w-[15px] transition-transform duration-300 ${open ? 'rotate-90' : ''}`} />
    </div>
  );

  return (
    <Popover trigger={trigger} open={open} onToggle={() => setOpen(!open)}>
      <SettingsContent />
    </Popover>
  );
}

// ─── Header ────────────────────────────────────────────────

export function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const { storeInfo, header, identity, displayBusinessName } = useStore();

  const [open, setOpen] = useState(true);
  const [popoverOpen, setPopoverOpen] = useState<string | null>(null);
  const [todayHours, setTodayHours] = useState<{ open: string; close: string } | null>(null);

  useEffect(() => {
    setOpen(isStoreOpen(storeInfo));
    const today = new Date().getDay();
    const entry = storeInfo.workingHours.find((wh) => wh.day === today);
    setTodayHours(entry || null);

    const timer = setInterval(() => {
      setOpen(isStoreOpen(storeInfo));
      const curToday = new Date().getDay();
      const curEntry = storeInfo.workingHours.find((wh) => wh.day === curToday);
      setTodayHours(curEntry || null);
    }, 60_000);
    return () => clearInterval(timer);
  }, [storeInfo]);

  const displayAddress = isRTL ? (storeInfo.addressAr || storeInfo.address) : storeInfo.address;
  const brandName = displayBusinessName || header?.businessName || identity?.businessName || storeInfo.name;
  const slogan = header?.slogan || identity?.slogan || t('header.tagline');
  const logoUrl = header?.logo || header?.logoUrl || identity?.logo;
  const rawBg =
    header?.coverUrl ||
    header?.backGroundImage ||
    (header as Record<string, unknown>)?.backgroundImage ||
    (header as Record<string, unknown>)?.cover;
  const backgroundImage = typeof rawBg === 'string' && rawBg.trim() ? rawBg.trim() : null;

  const togglePopover = (id: string) => {
    setPopoverOpen((prev) => (prev === id ? null : id));
  };

  const simpleContent = (
    icon: React.ReactNode,
    label: string,
    value?: string | null,
    href?: string | null
  ) => (
    <>
      <div className="flex items-center gap-2 px-1 pb-2">
        {icon}
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          {label}
        </span>
      </div>
      {value ? (
        href ? (
          <a
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="flex items-center gap-1 text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors"
          >
            {value}
            {href.startsWith('http') && <ExternalLink size={12} />}
          </a>
        ) : (
          <span className="text-sm font-medium text-[var(--color-text-primary)]">{value}</span>
        )
      ) : (
        <span className="text-sm text-[var(--color-text-muted)]">Not available</span>
      )}
    </>
  );

  const iconButton = (icon: React.ReactNode) => (
    <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[var(--color-surface)]/20 border border-[var(--color-border-strong)]/30 text-[var(--color-on-secondary)] hover:bg-[var(--color-surface)]/30 transition-colors group">
      {icon}
    </div>
  );

  const statusIndicator = (
    <div
      className={`flex items-center gap-2 px-2.5 py-1 rounded-full border backdrop-blur-md transition-all
        ${open
          ? 'border-[var(--color-success)]/40 bg-[var(--color-success)]/20 text-[var(--color-success)]'
          : 'border-[var(--color-danger)]/40 bg-[var(--color-danger)]/20 text-[var(--color-danger)]'
        }`}
    >
      <span
        className={`inline-block w-2 h-2 rounded-full animate-pulse ${
          open ? 'bg-[var(--color-success)]' : 'bg-[var(--color-danger)]'
        }`}
      />
      <span className="text-xs font-medium whitespace-nowrap">
        {open ? t('storeInfo.open') : t('storeInfo.closed')}
        {todayHours && open && (
          <span className="ml-1 opacity-80">
            {t('storeInfo.todayFromTo', {
              from: formatTimeLocalized(todayHours.open, locale),
              to: formatTimeLocalized(todayHours.close, locale),
            })}
          </span>
        )}
        {todayHours && !open && (
          <span className="ml-1 opacity-80">
            {t('storeInfo.todayClosed')}
          </span>
        )}
      </span>
    </div>
  );

  const socialsContent = (
    <>
      <div className="flex items-center gap-2 px-1 pb-2">
        <Users className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          {t('storeInfo.socials')}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {storeInfo.socials.map((social) => (
          <a
            key={social.platform}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-[var(--color-primary-50)] px-3 py-1.5 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-100)] transition-colors"
            style={{ color: socialColorMap[social.platform] || 'currentColor' }}
          >
            <SocialIcon platform={social.platform} className="w-4 h-4" />
            <span className="capitalize">{social.platform}</span>
          </a>
        ))}
      </div>
    </>
  );

  return (
    <header
      className="
        relative isolate w-full overflow-hidden
        flex items-center justify-center
        rounded-b-[1.75rem] sm:rounded-b-[2.25rem]
        px-4 sm:px-6 lg:px-8
        py-5 sm:py-6
        transition-colors duration-300
      "
      style={{
        backgroundColor: 'var(--color-secondary)',
        minHeight: 'clamp(170px, 22vw, 240px)',
      }}
    >
      {/* ─── Background ─────────────────────────────────── */}
      {backgroundImage ? (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <Image
            src={backgroundImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Horizontal scrim so the text column is always readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20 rtl:bg-gradient-to-l" />
          {/* Vertical scrim to blend top/bottom into the rounded edges */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[var(--color-secondary)]/70" />
          {/* Subtle vignette for depth */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(120% 80% at 20% 50%, transparent 40%, rgba(0,0,0,0.35) 100%)',
            }}
          />
        </div>
      ) : (
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/25" />
          <div className="absolute -top-20 -end-20 w-64 h-64 rounded-full bg-[var(--color-accent)]/20 opacity-50 animate-orb-1" />
          <div className="absolute -bottom-12 -start-12 w-48 h-48 rounded-full bg-[var(--color-primary)]/25 opacity-40 animate-orb-2" />
          <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-black/15 to-transparent" />
        </div>
      )}

      {/* ─── Settings gear ──────────────────────────────── */}
      <div className="absolute end-3 top-3 z-20 sm:end-5 sm:top-4">
        <SettingsMenu />
      </div>

      {/* ─── Content ────────────────────────────────────── */}
      <div
        className="
          relative z-10 w-full max-w-7xl mx-auto
          flex flex-row items-center
          gap-4 sm:gap-6 lg:gap-8
        "
      >
        {/* Logo */}
        <div className="flex-shrink-0">
          <div
            className="
              flex items-center justify-center
              h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24
              rounded-2xl
              border border-white/25
              bg-white/10 backdrop-blur-md
              shadow-[0_8px_24px_rgba(0,0,0,0.25)]
              transition-all duration-300
              hover:scale-105 hover:border-[var(--color-accent)]/70
              hover:shadow-[var(--shadow-glow-strong)]
              overflow-hidden relative
            "
          >
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={brandName}
                width={137}
                height={137}
                priority
                className="w-full h-full object-cover"
              />
            ) : (
              <UtensilsCrossed
                strokeWidth={2.2}
                className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 drop-shadow-lg text-[var(--color-on-secondary)]"
              />
            )}
          </div>
        </div>

        {/* Text + controls column */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Brand name + desktop status */}
          <div className="flex items-center gap-3 flex-wrap">
            <h1
              className="
                text-2xl sm:text-3xl lg:text-4xl
                font-extrabold tracking-tight leading-none
                text-white
                drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]
                truncate
              "
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {brandName}
            </h1>
            <div className="hidden lg:inline-flex">{statusIndicator}</div>
          </div>

          {/* Tagline */}
          {slogan && (
            <p
              className="
                mt-1.5
                text-sm sm:text-base
                font-medium
                text-white/90
                drop-shadow-[0_1px_4px_rgba(0,0,0,0.55)]
                line-clamp-1
              "
            >
              {slogan}
            </p>
          )}

          {/* Decorative accent line */}
          <div className="mt-2 h-[3px] w-14 sm:w-20 rounded-full bg-gradient-to-r from-[var(--color-accent)] to-transparent shadow-sm" />

          {/* Bottom row: mobile status + icon bar */}
          <div className="flex flex-wrap items-center gap-2 mt-2.5">
            <div className="lg:hidden">{statusIndicator}</div>

            <div
              className="
                flex items-center gap-1 sm:gap-1.5 flex-wrap
                rounded-full
                bg-black/20 backdrop-blur-sm
                px-1.5 py-1
                border border-white/10
              "
            >
              {storeInfo.phone && (
                <Popover
                  open={popoverOpen === 'phone'}
                  onToggle={() => togglePopover('phone')}
                  trigger={iconButton(<Phone size={15} className="group-hover:scale-110 transition-transform" />)}
                >
                  {simpleContent(
                    <Phone className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />,
                    t('storeInfo.phone'),
                    storeInfo.phone,
                    `tel:${storeInfo.phone}`
                  )}
                </Popover>
              )}

              {storeInfo.email && (
                <Popover
                  open={popoverOpen === 'email'}
                  onToggle={() => togglePopover('email')}
                  trigger={iconButton(<Mail size={15} className="group-hover:scale-110 transition-transform" />)}
                >
                  {simpleContent(
                    <Mail className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />,
                    t('storeInfo.email'),
                    storeInfo.email,
                    `mailto:${storeInfo.email}`
                  )}
                </Popover>
              )}

              {displayAddress && (
                <Popover
                  open={popoverOpen === 'address'}
                  onToggle={() => togglePopover('address')}
                  trigger={iconButton(<MapPin size={15} className="group-hover:scale-110 transition-transform" />)}
                >
                  {simpleContent(
                    <MapPin className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />,
                    t('storeInfo.address'),
                    displayAddress,
                    storeInfo.mapUrl || null
                  )}
                </Popover>
              )}

              {storeInfo.socials && storeInfo.socials.length > 0 && (
                <Popover
                  open={popoverOpen === 'socials'}
                  onToggle={() => togglePopover('socials')}
                  trigger={iconButton(<Users size={15} className="group-hover:scale-110 transition-transform" />)}
                >
                  {socialsContent}
                </Popover>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Shimmer (subtle) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-0 w-1/3 h-full
            bg-gradient-to-r from-transparent via-white/[0.03] to-transparent
            -skew-x-12"
          style={{ animation: 'shimmerLine 8s ease-in-out infinite' }}
        />
      </div>
    </header>
  );
}