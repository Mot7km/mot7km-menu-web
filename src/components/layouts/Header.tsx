'use client';

import { useState, useEffect, memo, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import {
  UtensilsCrossed,
  Phone,
  Clock,
  ChevronDown,
  Store,
  Check,
  Calendar,
  AlertCircle,
  MapPin,
  X,
  AtSign,
  Copy,
  ExternalLink,
  Navigation,
} from 'lucide-react';
import { useStore, parseWorkingHours } from '@/store/storeHooks';
import { isStoreOpen, type WorkingHours } from '@/data/storeInfo';
import type { ApiBranch } from '@/lib/types/menuApi';
import { SettingsMenu } from '@/components/common/SettingsMenu';
import {
  InstagramIcon,
  FacebookIcon,
  TikTokIcon,
  WhatsAppIcon,
  TwitterIcon,
  SnapchatIcon,
  formatSocialUrl,
  SOCIAL_CONFIG,
} from '@/components/icons';

// Retrieve authentic platform brand styling from icons definition
const getSocialBrandStyle = (id: string) => {
  const config = SOCIAL_CONFIG[id];
  const isDarkMonochrome = id === 'tiktok' || id === 'twitter' || id === 'x';
  const isSnapchat = id === 'snapchat';

  // Authentic brand color from icons config (using accessible tone for snapchat on light backgrounds)
  const brandColor = isSnapchat ? '#D97706' : (config?.brandColor || 'var(--color-primary)');

  return {
    iconColor: isDarkMonochrome ? 'currentColor' : brandColor,
    iconBg: isDarkMonochrome
      ? 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-primary)]'
      : undefined,
    style: !isDarkMonochrome
      ? {
          backgroundColor: isSnapchat ? 'rgba(245, 158, 11, 0.12)' : `${brandColor}18`,
          borderColor: isSnapchat ? 'rgba(245, 158, 11, 0.35)' : `${brandColor}38`,
          color: brandColor,
        }
      : undefined,
  };
};


function formatTimeLocalized(time24?: string | null, locale = 'en'): string {
  if (!time24 || typeof time24 !== 'string') return '';
  const parts = time24.split(':').map(Number);
  if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return time24;
  const [h, m] = parts;
  const date = new Date();
  date.setHours(h, m, 0, 0);

  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: locale !== 'ar',
  };
  try {
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch {
    return time24;
  }
}

function getLocalizedDayName(dayIndex: number, locale = 'en'): string {
  const date = new Date(Date.UTC(2023, 0, 1 + dayIndex, 12, 0, 0));
  try {
    return new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' }).format(date);
  } catch {
    const enDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return enDays[dayIndex] ?? `Day ${dayIndex}`;
  }
}

export const Header = memo(function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const { storeInfo, header, identity, displayBusinessName } = useStore();

  // --- Modals / Popups States ---
  const [showHoursPopup, setShowHoursPopup] = useState(false);
  const [showBranchesPopup, setShowBranchesPopup] = useState(false);
  const [showSocialPopup, setShowSocialPopup] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hoursRef = useRef<HTMLDivElement>(null);
  const branchesRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);

  // Close any popup on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target) return;

      // Ignore clicks inside any open modal dialog (including portaled modals)
      if (target.closest('[role="dialog"]')) return;

      // On mobile viewports, the portaled backdrop handles outside clicks
      if (window.innerWidth < 640) return;

      if (hoursRef.current && !hoursRef.current.contains(target)) {
        setShowHoursPopup(false);
      }
      if (branchesRef.current && !branchesRef.current.contains(target)) {
        setShowBranchesPopup(false);
      }
      if (socialRef.current && !socialRef.current.contains(target)) {
        setShowSocialPopup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close popups on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowHoursPopup(false);
        setShowBranchesPopup(false);
        setShowSocialPopup(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scroll when any popup is open on mobile without layout thrashing
  const isAnyPopupOpen = showHoursPopup || showBranchesPopup || showSocialPopup;
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isAnyPopupOpen && window.innerWidth < 640) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [isAnyPopupOpen]);

  // --- Branches Resolution from API ---
  const branches = useMemo<ApiBranch[]>(() => {
    const rawBranches = header?.branches || (storeInfo as unknown as { branches?: ApiBranch[] })?.branches || [];
    return Array.isArray(rawBranches) ? rawBranches : [];
  }, [header, storeInfo]);

  const [activeBranchId, setActiveBranchId] = useState<number | string | null>(() => {
    const rawBranches = header?.branches || (storeInfo as unknown as { branches?: ApiBranch[] })?.branches || [];
    if (!Array.isArray(rawBranches) || rawBranches.length === 0) return null;
    const main = rawBranches.find((b) => b.isMainBranch) || rawBranches[0];
    return main?.id ?? null;
  });

  useEffect(() => {
    if (activeBranchId === null && branches.length > 0) {
      const main = branches.find((b) => b.isMainBranch) || branches[0];
      if (main?.id !== undefined) {
        setActiveBranchId(main.id);
      }
    }
  }, [branches, activeBranchId]);

  const currentBranch = useMemo<ApiBranch | null>(() => {
    if (branches.length === 0) return null;
    return (
      branches.find((b) => String(b.id) === String(activeBranchId)) ||
      branches.find((b) => b.isMainBranch) ||
      branches[0] ||
      null
    );
  }, [branches, activeBranchId]);

  // --- Working Hours Resolution ---
  const activeSchedule: WorkingHours[] = useMemo(() => {
    if (currentBranch?.workingHours) {
      const parsedBranchHours = parseWorkingHours(currentBranch.workingHours);
      if (parsedBranchHours.length > 0) return parsedBranchHours;
    }
    if (storeInfo?.workingHours && storeInfo.workingHours.length > 0) {
      return storeInfo.workingHours;
    }
    return parseWorkingHours(header?.workingHours, header?.openClosedTimes);
  }, [currentBranch, storeInfo, header]);

  const fullWeeklySchedule = useMemo(() => {
    const map = new Map<number, WorkingHours>();
    for (const item of activeSchedule) {
      map.set(item.day, item);
    }
    return [0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
      const existing = map.get(dayIndex);
      return (
        existing || {
          day: dayIndex,
          open: '',
          close: '',
          isClosed: true,
          dayName: getLocalizedDayName(dayIndex, locale),
        }
      );
    });
  }, [activeSchedule, locale]);

  const todayIndex = new Date().getDay();
  const todaySchedule = useMemo(() => {
    return activeSchedule.find((h) => h.day === todayIndex) || null;
  }, [activeSchedule, todayIndex]);

  const isTemporarilyClosed = Boolean(
    currentBranch?.workingHours?.isTemporarilyClosed ??
    header?.isTemporarilyClosed ??
    storeInfo?.isTemporarilyClosed
  );

  const isOpenNow = useMemo(() => {
    if (isTemporarilyClosed) return false;
    if (currentBranch?.workingHours?.isCurrentlyOpen !== undefined) {
      return Boolean(currentBranch.workingHours.isCurrentlyOpen);
    }
    if (header?.isCurrentlyOpen !== undefined) {
      return Boolean(header.isCurrentlyOpen);
    }
    if (storeInfo?.isCurrentlyOpen !== undefined) {
      return Boolean(storeInfo.isCurrentlyOpen);
    }
    if (activeSchedule.length > 0) {
      return isStoreOpen({ workingHours: activeSchedule } as unknown as Parameters<typeof isStoreOpen>[0]);
    }
    return true;
  }, [isTemporarilyClosed, currentBranch, header, storeInfo, activeSchedule]);

  // Comprehensive store status with consistent contrast across dark header and light/dark popups
  const storeStatusInfo = useMemo(() => {
    if (isTemporarilyClosed) {
      return {
        label: t('storeInfo.temporarilyClosed'),
        dotColor: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-pulse',
        headerTriggerClass: 'bg-amber-500/25 hover:bg-amber-500/35 text-amber-200 border-amber-400/50 shadow-[0_2px_14px_rgba(245,158,11,0.35)]',
        popupBadgeClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
      };
    }

    if (!todaySchedule || todaySchedule.isClosed || !todaySchedule.open || !todaySchedule.close) {
      return isOpenNow
        ? {
          label: t('storeInfo.open'),
          dotColor: 'bg-[var(--color-primary)] shadow-[0_0_8px_var(--color-primary)] animate-pulse',
          headerTriggerClass: 'bg-[var(--color-primary)]/25 hover:bg-[var(--color-primary)]/35 text-white border-[var(--color-primary)]/50 shadow-sm',
          popupBadgeClass: 'bg-[var(--color-primary)]/15 text-[var(--color-primary)] border-[var(--color-primary)]/30',
        }
        : {
          label: t('storeInfo.closed'),
          dotColor: 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]',
          headerTriggerClass: 'bg-rose-500/25 hover:bg-rose-500/35 text-rose-200 border-rose-400/50 shadow-[0_2px_14px_rgba(244,63,94,0.3)]',
          popupBadgeClass: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
        };
    }

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const parseTimeToMinutes = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      return (isNaN(h) ? 0 : h) * 60 + (isNaN(m) ? 0 : m);
    };

    const openMinutes = parseTimeToMinutes(todaySchedule.open);
    const closeMinutes = parseTimeToMinutes(todaySchedule.close);

    if (isOpenNow) {
      const diffToClose = closeMinutes - currentMinutes;
      if (diffToClose > 0 && diffToClose <= 45) {
        return {
          label: t('header.aboutToClose'),
          dotColor: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-pulse',
          headerTriggerClass: 'bg-amber-500/25 hover:bg-amber-500/35 text-amber-200 border-amber-400/50 shadow-[0_2px_14px_rgba(245,158,11,0.35)]',
          popupBadgeClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
        };
      }
      return {
        label: t('storeInfo.open'),
        dotColor: 'bg-[var(--color-primary)] shadow-[0_0_8px_var(--color-primary)] animate-pulse',
        headerTriggerClass: 'bg-[var(--color-primary)]/25 hover:bg-[var(--color-primary)]/35 text-white border-[var(--color-primary)]/50 shadow-sm',
        popupBadgeClass: 'bg-[var(--color-primary)]/15 text-[var(--color-primary)] border-[var(--color-primary)]/30',
      };
    } else {
      const diffToOpen = openMinutes - currentMinutes;
      if (diffToOpen > 0 && diffToOpen <= 45) {
        return {
          label: t('header.aboutToOpen'),
          dotColor: 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)] animate-pulse',
          headerTriggerClass: 'bg-sky-500/25 hover:bg-sky-500/35 text-sky-200 border-sky-400/50 shadow-[0_2px_14px_rgba(56,189,248,0.35)]',
          popupBadgeClass: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30',
        };
      }
      return {
        label: t('storeInfo.closed'),
        dotColor: 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]',
        headerTriggerClass: 'bg-rose-500/25 hover:bg-rose-500/35 text-rose-200 border-rose-400/50 shadow-[0_2px_14px_rgba(244,63,94,0.3)]',
        popupBadgeClass: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
      };
    }
  }, [isTemporarilyClosed, todaySchedule, isOpenNow, t]);

  // Social Links Extraction
  const socialList = useMemo(() => {
    const rawSocials = header?.socialLinks || header?.socials;
    const list: Array<{
      id: string;
      name: string;
      url: string;
      icon: React.ComponentType<{ size?: number; className?: string; color?: string; style?: React.CSSProperties }>;
      badgeText: string;
    }> = [];

    // WhatsApp
    const wa = rawSocials?.whatsapp || (rawSocials as Record<string, string>)?.whatsApp || storeInfo?.socials?.find((s) => s.platform === 'whatsapp')?.url;
    if (wa) {
      list.push({
        id: 'whatsapp',
        name: 'WhatsApp',
        url: formatSocialUrl('whatsapp', wa),
        icon: WhatsAppIcon,
        badgeText: t('header.directChat'),
      });
    }

    // Instagram
    const insta = rawSocials?.instagram || storeInfo?.socials?.find((s) => s.platform === 'instagram')?.url;
    if (insta) {
      list.push({
        id: 'instagram',
        name: 'Instagram',
        url: formatSocialUrl('instagram', insta),
        icon: InstagramIcon,
        badgeText: t('header.follow'),
      });
    }

    // TikTok
    const tt = rawSocials?.tiktok || storeInfo?.socials?.find((s) => s.platform === 'tiktok')?.url;
    if (tt) {
      list.push({
        id: 'tiktok',
        name: 'TikTok',
        url: formatSocialUrl('tiktok', tt),
        icon: TikTokIcon,
        badgeText: t('header.watch'),
      });
    }

    // Facebook
    const fb = rawSocials?.facebook || storeInfo?.socials?.find((s) => s.platform === 'facebook')?.url;
    if (fb) {
      list.push({
        id: 'facebook',
        name: 'Facebook',
        url: formatSocialUrl('facebook', fb),
        icon: FacebookIcon,
        badgeText: t('header.visitPage'),
      });
    }

    // Twitter / X
    const tw = rawSocials?.twitter || rawSocials?.x || storeInfo?.socials?.find((s) => s.platform === 'twitter' || s.platform === 'x')?.url;
    if (tw) {
      list.push({
        id: 'twitter',
        name: 'X (Twitter)',
        url: formatSocialUrl('twitter', tw),
        icon: TwitterIcon,
        badgeText: t('header.follow'),
      });
    }

    // Snapchat
    const snap = rawSocials?.snapchat || storeInfo?.socials?.find((s) => s.platform === 'snapchat')?.url;
    if (snap) {
      list.push({
        id: 'snapchat',
        name: 'Snapchat',
        url: formatSocialUrl('snapchat', snap),
        icon: SnapchatIcon,
        badgeText: t('header.add'),
      });
    }

    return list;
  }, [header, storeInfo, t]);

  const phone = storeInfo?.phone || header?.phoneNumber || '';

  const brandName =
    displayBusinessName ||
    header?.displayBusinessName ||
    header?.businessName ||
    identity?.businessName ||
    storeInfo?.name ||
    '';

  const slogan =
    header?.slogan ||
    identity?.businessDescription ||
    identity?.slogan ||
    t('header.tagline');

  const logoUrl = header?.logo || header?.logoUrl || identity?.logo;
  const rawBg =
    header?.coverUrl ||
    header?.backGroundImage ||
    (header as Record<string, unknown>)?.backgroundImage ||
    (header as Record<string, unknown>)?.cover;
  const backgroundImage = typeof rawBg === 'string' && rawBg.trim() ? rawBg.trim() : null;

  const notes = currentBranch?.workingHours?.notes || (header?.workingHours as { notes?: string })?.notes;

  // Handle URL Copy
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      try {
        navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2200);
      } catch {
        // Fallback
      }
    }
  };

  return (
    <header
      className="
        relative isolate z-30 w-full
        flex items-center justify-center
        rounded-b-[2rem] sm:rounded-b-[2.5rem]
        px-4 sm:px-8 lg:px-10
        pt-5 pb-4 sm:pt-7 sm:pb-6
        shadow-[0_16px_40px_-12px_rgba(0,0,0,0.35)]
      "
      style={{
        backgroundColor: 'var(--color-secondary)',
        minHeight: 'clamp(160px, 20vw, 210px)',
      }}
    >
      {/* ─── Background Layer with Rich Multi-Tone Depth ─────────────────────── */}
      {backgroundImage ? (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-b-[2rem] sm:rounded-b-[2.5rem]">
          <Image
            src={backgroundImage}
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Neutral photographic scrim - avoids color distortion on food photography */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent rtl:from-black/80 rtl:via-black/40 rtl:to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[var(--color-secondary)]/80 to-transparent" />
        </div>
      ) : (
        <div
          className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-b-[2rem] sm:rounded-b-[2.5rem]"
          style={{
            background:
              'linear-gradient(135deg, var(--color-secondary) 0%, #151b26 55%, var(--color-secondary) 100%)',
          }}
        >
          {/* Luminous brand aura glows (Primary emerald green & Accent cyan) */}
          <div className="absolute -top-20 -end-20 w-80 h-80 rounded-full bg-[var(--color-accent)]/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -start-16 w-80 h-80 rounded-full bg-[var(--color-primary)]/25 blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/35 pointer-events-none" />
        </div>
      )}

      {/* ─── Settings Gear ──────────────────────────────── */}
      <div className="absolute end-4 top-4 z-20 sm:end-6 sm:top-4">
        <SettingsMenu />
      </div>

      {/* ─── Main Content Container ─────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center">
        <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">

          {/* Logo & Interactive Operating Hours Trigger Column */}
          <div className="flex flex-col items-center flex-shrink-0 gap-2">
            <div
              className="
                flex items-center justify-center
                h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24
                rounded-2xl
                border border-white/25
                bg-white/10 dark:bg-black/25 backdrop-blur-2xl
                shadow-[0_10px_28px_rgba(0,0,0,0.3)]
                ring-1 ring-white/15
                transition-all duration-300
                hover:scale-105 hover:border-[var(--color-primary)] hover:shadow-lg
                overflow-hidden relative
              "
            >
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={brandName}
                  width={120}
                  height={120}
                  priority
                  className="w-full h-full object-cover"
                />
              ) : (
                <UtensilsCrossed
                  strokeWidth={2.2}
                  className="h-8 w-8 sm:h-10 sm:w-10 drop-shadow-lg text-white"
                />
              )}
            </div>

            {/* Interactive Status & Working Hours Trigger Badge */}
            <div className="relative" ref={hoursRef}>
              <button
                type="button"
                onClick={() => {
                  setShowHoursPopup((prev) => !prev);
                  setShowBranchesPopup(false);
                  setShowSocialPopup(false);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold backdrop-blur-xl shadow-md border transition-all cursor-pointer hover:scale-105 active:scale-95 group ${storeStatusInfo.headerTriggerClass}`}
                aria-expanded={showHoursPopup}
                aria-haspopup="dialog"
                title={t('header.hoursTooltip')}
              >
                <span className={`h-2 w-2 rounded-full shadow-sm flex-shrink-0 ${storeStatusInfo.dotColor}`} />
                <span className="whitespace-nowrap">{storeStatusInfo.label}</span>
                <Clock size={11} className="opacity-75 group-hover:rotate-12 transition-transform duration-300" />
              </button>

              {/* ─── DESKTOP DROPDOWN: OPERATING HOURS ─── */}
              {showHoursPopup && (
                <div
                  className={`
                    hidden sm:block absolute top-full mt-2.5 z-50 max-h-[580px] sm:w-[410px] md:w-[440px] overflow-y-auto overscroll-contain touch-pan-y custom-scrollbar
                    rounded-3xl bg-[var(--color-surface)]/95 dark:bg-[var(--color-surface)]/95
                    backdrop-blur-2xl border border-[var(--color-border)]/90 dark:border-white/[0.12]
                    p-5 sm:p-6 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.25),0_0_0_1px_rgba(0,0,0,0.05)]
                    dark:shadow-[0_25px_65px_-12px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.08)]
                    text-[var(--color-text-primary)] animate-popup-dropdown
                    ${isRTL ? 'right-0 left-auto' : 'left-0 right-auto'}
                  `}
                  role="dialog"
                  aria-modal="true"
                >
                  <div
                    className="absolute inset-x-0 top-0 h-[2.5px] rounded-t-3xl pointer-events-none"
                    style={{ background: 'var(--gradient-primary)' }}
                  />

                  {/* Header with Integrated Live Status */}
                  <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[var(--color-border)]/60">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-xl bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 flex items-center justify-center text-[var(--color-primary)] shadow-sm">
                        <Clock size={17} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold tracking-tight text-[var(--color-text-primary)]">
                          {t('header.operatingHours')}
                        </h3>
                        <p className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                          {currentBranch?.name || brandName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1.5 ${storeStatusInfo.popupBadgeClass}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${storeStatusInfo.dotColor}`} />
                        <span>{storeStatusInfo.label}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowHoursPopup(false)}
                        className="h-7 w-7 rounded-full bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-elevated)] border border-[var(--color-border)]/60 active:scale-90 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all cursor-pointer"
                        aria-label={t('header.close')}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Temporary Closure Warning */}
                  {isTemporarilyClosed && (
                    <div className="mb-3.5 p-3 rounded-2xl bg-amber-500/15 border border-amber-500/35 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-200">
                      <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-amber-500" />
                      <div>
                        <p className="font-bold text-xs">{t('storeInfo.temporarilyClosed')}</p>
                        {notes && <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5 leading-relaxed">{notes}</p>}
                      </div>
                    </div>
                  )}

                  {/* Today Highlight Card */}
                  <div className="mb-3.5 p-3.5 rounded-2xl bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border)]/80 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-medium text-[var(--color-text-muted)] block">
                        {t('header.todaySchedule')} • {getLocalizedDayName(todayIndex, locale)}
                      </span>
                      <span className="font-mono text-sm sm:text-base font-bold text-[var(--color-text-primary)] tracking-tight block mt-0.5">
                        {todaySchedule && !todaySchedule.isClosed && todaySchedule.open && todaySchedule.close
                          ? `${formatTimeLocalized(todaySchedule.open, locale)} – ${formatTimeLocalized(todaySchedule.close, locale)}`
                          : t('header.closedToday')}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-sm">
                      {t('header.today')}
                    </span>
                  </div>

                  {/* ─── 7-Day Times Table ─── */}
                  <div>
                    <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[var(--color-border)]/40 text-[11px] font-semibold text-[var(--color-text-muted)]">
                      <span>{t('header.weeklySchedule')}</span>
                      <span className="font-normal">{t('header.localTime')}</span>
                    </div>

                    {activeSchedule.length > 0 ? (
                      <div className="space-y-1 max-h-56 overflow-y-auto overscroll-contain touch-pan-y pe-1 text-xs">
                        {fullWeeklySchedule.map((item) => {
                          const isToday = item.day === todayIndex;
                          const dayLabel = getLocalizedDayName(item.day, locale);
                          const isClosedDay = item.isClosed || (!item.open && !item.close);

                          return (
                            <div
                              key={item.day}
                              className={`flex items-center justify-between py-2 px-3 rounded-xl transition-colors ${isToday
                                  ? 'bg-[var(--color-primary)]/10 text-[var(--color-text-primary)] font-bold border-s-2 border-[var(--color-primary)]'
                                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-subtle)]/60'
                                }`}
                            >
                              <span className={`capitalize truncate text-xs ${isToday ? 'font-bold text-[var(--color-primary)]' : 'font-medium'}`}>
                                {dayLabel}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs tabular-nums">
                                  {isClosedDay
                                    ? t('storeInfo.closed')
                                    : `${formatTimeLocalized(item.open, locale)} – ${formatTimeLocalized(item.close, locale)}`}
                                </span>
                                <span
                                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isClosedDay ? 'bg-rose-500' : 'bg-emerald-400'
                                    }`}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-[var(--color-text-muted)] py-3 text-center">
                        {todaySchedule && todaySchedule.open && todaySchedule.close
                          ? `${t('header.today')}: ${formatTimeLocalized(todaySchedule.open, locale)} – ${formatTimeLocalized(todaySchedule.close, locale)}`
                          : t('header.hoursNotAvailable')}
                      </p>
                    )}
                  </div>

                  {notes && !isTemporarilyClosed && (
                    <div className="mt-3 pt-2.5 border-t border-[var(--color-border)]/60 text-xs text-[var(--color-text-secondary)] leading-relaxed bg-[var(--color-surface-subtle)]/60 p-2.5 rounded-xl">
                      <span className="font-bold text-[var(--color-text-primary)]">{t('header.importantNotes')}</span>
                      {notes}
                    </div>
                  )}
                </div>
              )}

              {/* ─── MOBILE MODAL PORTAL: OPERATING HOURS ─── */}
              {mounted && showHoursPopup && createPortal(
                <div className="fixed inset-0 z-[998] sm:hidden">
                  <button
                    type="button"
                    aria-label={t('header.close')}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-popup-backdrop w-full h-full cursor-default border-none outline-none touch-none"
                    onClick={() => setShowHoursPopup(false)}
                    onTouchMove={(e) => e.preventDefault()}
                  />

                  <div
                    className="fixed inset-x-0 bottom-0 z-[999] max-h-[85dvh] overflow-y-auto overscroll-contain touch-pan-y rounded-t-[2rem] bg-[var(--color-surface)] dark:bg-[var(--color-surface)] border-t border-[var(--color-border)] dark:border-white/[0.12] p-5 pb-9 shadow-2xl text-[var(--color-text-primary)] animate-popup-sheet custom-scrollbar"
                    role="dialog"
                    aria-modal="true"
                  >
                    <div className="w-12 h-1.5 bg-[var(--color-border-strong)] rounded-full mx-auto mb-4 opacity-50" />

                    <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[var(--color-border)]/60">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 flex items-center justify-center text-[var(--color-primary)] shadow-sm">
                          <Clock size={17} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold tracking-tight text-[var(--color-text-primary)]">
                            {t('header.operatingHours')}
                          </h3>
                          <p className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                            {currentBranch?.name || brandName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1.5 ${storeStatusInfo.popupBadgeClass}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${storeStatusInfo.dotColor}`} />
                          <span>{storeStatusInfo.label}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowHoursPopup(false)}
                          className="h-7 w-7 rounded-full bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-elevated)] border border-[var(--color-border)]/60 active:scale-90 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all cursor-pointer"
                          aria-label={t('header.close')}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>

                    {isTemporarilyClosed && (
                      <div className="mb-3.5 p-3 rounded-2xl bg-amber-500/15 border border-amber-500/35 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-200">
                        <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-amber-500" />
                        <div>
                          <p className="font-bold text-xs">{t('storeInfo.temporarilyClosed')}</p>
                          {notes && <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5 leading-relaxed">{notes}</p>}
                        </div>
                      </div>
                    )}

                    <div className="mb-3.5 p-3.5 rounded-2xl bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border)]/80 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-medium text-[var(--color-text-muted)] block">
                          {t('header.todaySchedule')} • {getLocalizedDayName(todayIndex, locale)}
                        </span>
                        <span className="font-mono text-sm sm:text-base font-bold text-[var(--color-text-primary)] tracking-tight block mt-0.5">
                          {todaySchedule && !todaySchedule.isClosed && todaySchedule.open && todaySchedule.close
                            ? `${formatTimeLocalized(todaySchedule.open, locale)} – ${formatTimeLocalized(todaySchedule.close, locale)}`
                            : t('header.closedToday')}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-sm">
                        {t('header.today')}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[var(--color-border)]/40 text-[11px] font-semibold text-[var(--color-text-muted)]">
                        <span>{t('header.weeklySchedule')}</span>
                        <span className="font-normal">{t('header.localTime')}</span>
                      </div>

                      {activeSchedule.length > 0 ? (
                        <div className="space-y-1 max-h-56 overflow-y-auto pe-1 text-xs">
                          {fullWeeklySchedule.map((item) => {
                            const isToday = item.day === todayIndex;
                            const dayLabel = getLocalizedDayName(item.day, locale);
                            const isClosedDay = item.isClosed || (!item.open && !item.close);

                            return (
                              <div
                                key={item.day}
                                className={`flex items-center justify-between py-2 px-3 rounded-xl transition-colors ${isToday
                                    ? 'bg-[var(--color-primary)]/10 text-[var(--color-text-primary)] font-bold border-s-2 border-[var(--color-primary)]'
                                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-subtle)]/60'
                                  }`}
                              >
                                <span className={`capitalize truncate text-xs ${isToday ? 'font-bold text-[var(--color-primary)]' : 'font-medium'}`}>
                                  {dayLabel}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs tabular-nums">
                                    {isClosedDay
                                      ? t('storeInfo.closed')
                                      : `${formatTimeLocalized(item.open, locale)} – ${formatTimeLocalized(item.close, locale)}`}
                                  </span>
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isClosedDay ? 'bg-rose-500' : 'bg-[var(--color-primary)]'
                                      }`}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-[var(--color-text-muted)] py-3 text-center">
                          {todaySchedule && todaySchedule.open && todaySchedule.close
                            ? `${t('header.today')}: ${formatTimeLocalized(todaySchedule.open, locale)} – ${formatTimeLocalized(todaySchedule.close, locale)}`
                            : t('header.hoursNotAvailable')}
                        </p>
                      )}
                    </div>

                    {notes && !isTemporarilyClosed && (
                      <div className="mt-3 pt-2.5 border-t border-[var(--color-border)]/60 text-xs text-[var(--color-text-secondary)] leading-relaxed bg-[var(--color-surface-subtle)]/60 p-2.5 rounded-xl">
                        <span className="font-bold text-[var(--color-text-primary)]">{t('header.importantNotes')}</span>
                        {notes}
                      </div>
                    )}
                  </div>
                </div>,
                document.body
              )}
            </div>
          </div>

          {/* Details & Info Stack */}
          <div className="flex flex-col justify-center min-w-0 flex-1">
            <div>
              {/* Brand Name */}
              <h1
                className="
                text-2xl xs:text-3xl sm:text-4xl lg:text-5xl
                font-black tracking-tight leading-tight
                text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]
                truncate max-w-[220px] xs:max-w-xs sm:max-w-md lg:max-w-xl
              "
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {brandName}
              </h1>

              {/* Slogan */}
              {slogan && (
                <p className="text-xs sm:text-sm font-semibold text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)] mt-0.5 truncate">
                  {slogan}
                </p>
              )}
            </div>

            {/* Separator Beneath Slogan with Dynamic Glowing Ambient Aura */}
            <div className="my-2 h-[2px] max-w-xs sm:max-w-xs rounded-full bg-gradient-to-r rtl:bg-gradient-to-l from-[var(--color-primary)] via-[var(--color-primary)]/40 to-transparent shadow-sm opacity-90" />

            {/* ─── ONE-ROW MODERN TOOLBAR ─── */}
            <div className="flex flex-wrap items-center gap-2 text-xs">

              {/* 1. Master Branches Hub Button */}
              {branches.length > 0 && (
                <div className="relative flex-shrink-0" ref={branchesRef}>
                  <button
                    onClick={() => {
                      setShowBranchesPopup((prev) => !prev);
                      setShowHoursPopup(false);
                      setShowSocialPopup(false);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl backdrop-blur-xl border font-bold transition-all duration-200 cursor-pointer shadow-sm active:scale-95 group ${showBranchesPopup
                      ? 'bg-white/20 text-white border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/40 shadow-md'
                      : 'bg-white/10 hover:bg-white/15 text-white/95 border-white/20 hover:border-white/35'
                      }`}
                    aria-expanded={showBranchesPopup}
                    aria-haspopup="dialog"
                    aria-label={t('storeInfo.selectBranch')}
                  >
                    <Store size={14} className="text-[var(--color-primary)] group-hover:scale-110 transition-transform flex-shrink-0" />
                    <span className="truncate max-w-[130px] xs:max-w-[180px] sm:max-w-[260px] md:max-w-[320px]">
                      {currentBranch?.name || t('header.branches')}
                    </span>
                    {branches.length > 1 && (
                      <span className="ms-1 px-1.5 py-0.5 rounded-md text-[10px] font-black bg-[var(--color-primary)] text-[var(--color-on-primary)] flex-shrink-0 shadow-sm">
                        {branches.length}
                      </span>
                    )}
                    <ChevronDown
                      size={12}
                      className={`opacity-80 transition-transform duration-200 flex-shrink-0 ${showBranchesPopup ? 'rotate-180' : 'group-hover:translate-y-0.5'
                        }`}
                    />
                  </button>

                  {/* ─── DESKTOP DROPDOWN: BRANCHES ─── */}
                  {showBranchesPopup && (
                    <div
                      className={`
                        hidden sm:block absolute top-full mt-2.5 z-50 max-h-[580px] sm:w-[450px] md:w-[490px] overflow-y-auto overscroll-contain touch-pan-y custom-scrollbar
                        rounded-3xl bg-[var(--color-surface)]/95 dark:bg-[var(--color-surface)]/95
                        backdrop-blur-2xl border border-[var(--color-border)]/90 dark:border-white/[0.12]
                        p-5 sm:p-6 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.25),0_0_0_1px_rgba(0,0,0,0.05)]
                        dark:shadow-[0_25px_65px_-12px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.08)]
                        text-[var(--color-text-primary)] animate-popup-dropdown
                        ${isRTL ? 'right-0 left-auto' : 'left-0 right-auto'}
                      `}
                      role="dialog"
                      aria-modal="true"
                    >
                      <div
                        className="absolute inset-x-0 top-0 h-[2.5px] rounded-t-3xl pointer-events-none"
                        style={{ background: 'var(--gradient-primary)' }}
                      />

                      {/* Branches Header */}
                      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[var(--color-border)]/60">
                        <div className="flex items-center gap-2.5">
                          <div className="h-9 w-9 rounded-xl bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 flex items-center justify-center text-[var(--color-primary)] shadow-sm">
                            <Store size={17} />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold tracking-tight text-[var(--color-text-primary)]">
                              {t('header.branchesTitle')}
                            </h3>
                            <p className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                              {branches.length} {branches.length === 1 ? t('header.availableBranchSingle') : t('header.availableBranchPlural')}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowBranchesPopup(false)}
                          className="h-7 w-7 rounded-full bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-elevated)] border border-[var(--color-border)]/60 active:scale-90 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all cursor-pointer"
                          aria-label={t('header.close')}
                        >
                          <X size={14} />
                        </button>
                      </div>

                      {/* Instructions Hint */}
                      <p className="text-xs text-[var(--color-text-muted)] mb-3 px-0.5">
                        {t('header.selectBranchHint')}
                      </p>

                      {/* Branches List */}
                      <div className="space-y-2.5 max-h-[380px] overflow-y-auto overscroll-contain touch-pan-y pe-1">
                        {branches.map((b) => {
                          const isSelected = String(b.id) === String(activeBranchId);
                          const branchLoc = b.address?.formattedAddress || b.location;
                          const mapsUrl =
                            b.address?.mapsUrl?.trim() ||
                            (branchLoc ? `https://maps.google.com/?q=${encodeURIComponent(branchLoc)}` : null);
                          const branchPhone = b.phone || b.phoneNumber;

                          return (
                            <div
                              key={b.id}
                              className={`w-full flex flex-col text-start p-3.5 rounded-2xl transition-all duration-200 cursor-pointer border ${isSelected
                                  ? 'bg-[var(--color-primary)]/8 border-[var(--color-primary)] shadow-md ring-1 ring-[var(--color-primary)]/30'
                                  : 'bg-[var(--color-surface-subtle)]/50 hover:bg-[var(--color-surface-subtle)] border-[var(--color-border)]/70 hover:border-[var(--color-primary)]/40'
                                }`}
                              onClick={() => {
                                setActiveBranchId(b.id);
                                setShowBranchesPopup(false);
                              }}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className={`font-bold text-sm leading-snug truncate ${isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-primary)]'
                                      }`}>
                                      {b.name}
                                    </h4>
                                    {b.isMainBranch && (
                                      <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-[var(--color-primary)]/15 text-[var(--color-primary)] border border-[var(--color-primary)]/30 flex-shrink-0">
                                        {t('header.mainBranch')}
                                      </span>
                                    )}
                                  </div>
                                  {branchLoc && (
                                    <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5 truncate">
                                      <MapPin size={12} className="text-[var(--color-text-muted)] flex-shrink-0" />
                                      <span className="truncate">{branchLoc}</span>
                                    </p>
                                  )}
                                </div>

                                <div className="flex-shrink-0 pt-0.5">
                                  <div
                                    className={`h-5 w-5 rounded-full flex items-center justify-center border transition-all ${isSelected
                                        ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-[var(--color-on-primary)] shadow-sm'
                                        : 'border-[var(--color-border-strong)] bg-[var(--color-surface)]'
                                      }`}
                                  >
                                    {isSelected && <Check size={12} strokeWidth={3} />}
                                  </div>
                                </div>
                              </div>

                              {(mapsUrl || (typeof branchPhone === 'string' && branchPhone.trim())) && (
                                <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-[var(--color-border)]/40">
                                  {mapsUrl && (
                                    <a
                                      href={mapsUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[var(--color-surface)] hover:bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-border)]/80 transition-colors cursor-pointer"
                                    >
                                      <Navigation size={11} />
                                      <span>{t('header.directionsAndMap')}</span>
                                    </a>
                                  )}
                                  {typeof branchPhone === 'string' && branchPhone.trim() && (
                                    <a
                                      href={`tel:${branchPhone.trim()}`}
                                      onClick={(e) => e.stopPropagation()}
                                      className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[var(--color-surface)] hover:bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-border)]/80 transition-colors cursor-pointer"
                                      dir="ltr"
                                    >
                                      <Phone size={11} />
                                      <span>{branchPhone.trim()}</span>
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ─── MOBILE MODAL PORTAL: BRANCHES ─── */}
                  {mounted && showBranchesPopup && createPortal(
                    <div className="fixed inset-0 z-[998] sm:hidden">
                      <button
                        type="button"
                        aria-label={t('header.close')}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-popup-backdrop w-full h-full cursor-default border-none outline-none touch-none"
                        onClick={() => setShowBranchesPopup(false)}
                        onTouchMove={(e) => e.preventDefault()}
                      />

                      <div
                        className="fixed inset-x-0 bottom-0 z-[999] max-h-[85dvh] overflow-y-auto overscroll-contain touch-pan-y rounded-t-[2rem] bg-[var(--color-surface)] dark:bg-[var(--color-surface)] border-t border-[var(--color-border)] dark:border-white/[0.12] p-5 pb-9 shadow-2xl text-[var(--color-text-primary)] animate-popup-sheet custom-scrollbar"
                        role="dialog"
                        aria-modal="true"
                      >
                        <div className="w-12 h-1.5 bg-[var(--color-border-strong)] rounded-full mx-auto mb-4 opacity-50" />

                        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[var(--color-border)]/60">
                          <div className="flex items-center gap-2.5">
                            <div className="h-9 w-9 rounded-xl bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 flex items-center justify-center text-[var(--color-primary)] shadow-sm">
                              <Store size={17} />
                            </div>
                            <div>
                              <h3 className="text-sm font-bold tracking-tight text-[var(--color-text-primary)]">
                                {t('header.branchesTitle')}
                              </h3>
                              <p className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                                {branches.length} {branches.length === 1 ? t('header.availableBranchSingle') : t('header.availableBranchPlural')}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowBranchesPopup(false)}
                            className="h-7 w-7 rounded-full bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-elevated)] border border-[var(--color-border)]/60 active:scale-90 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all cursor-pointer"
                            aria-label={t('header.close')}
                          >
                            <X size={14} />
                          </button>
                        </div>

                        <p className="text-xs text-[var(--color-text-muted)] mb-3 px-0.5">
                          {t('header.selectBranchHint')}
                        </p>

                        <div className="space-y-2.5 max-h-[50vh] overflow-y-auto overscroll-contain touch-pan-y pe-1">
                          {branches.map((b) => {
                            const isSelected = String(b.id) === String(activeBranchId);
                            const branchLoc = b.address?.formattedAddress || b.location;
                            const mapsUrl =
                              b.address?.mapsUrl?.trim() ||
                              (branchLoc ? `https://maps.google.com/?q=${encodeURIComponent(branchLoc)}` : null);
                            const branchPhone = b.phone || b.phoneNumber;

                            return (
                              <div
                                key={b.id}
                                className={`w-full flex flex-col text-start p-3.5 rounded-2xl transition-all duration-200 cursor-pointer border ${isSelected
                                    ? 'bg-[var(--color-primary)]/8 border-[var(--color-primary)] shadow-md ring-1 ring-[var(--color-primary)]/30'
                                    : 'bg-[var(--color-surface-subtle)]/50 hover:bg-[var(--color-surface-subtle)] border-[var(--color-border)]/70 hover:border-[var(--color-primary)]/40'
                                  }`}
                                onClick={() => {
                                  setActiveBranchId(b.id);
                                  setShowBranchesPopup(false);
                                }}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className={`font-bold text-sm leading-snug truncate ${isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-primary)]'
                                        }`}>
                                        {b.name}
                                      </h4>
                                      {b.isMainBranch && (
                                        <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-[var(--color-primary)]/15 text-[var(--color-primary)] border border-[var(--color-primary)]/30 flex-shrink-0">
                                          {t('header.mainBranch')}
                                        </span>
                                      )}
                                    </div>
                                    {branchLoc && (
                                      <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1.5 truncate">
                                        <MapPin size={12} className="text-[var(--color-text-muted)] flex-shrink-0" />
                                        <span className="truncate">{branchLoc}</span>
                                      </p>
                                    )}
                                  </div>

                                  <div className="flex-shrink-0 pt-0.5">
                                    <div
                                      className={`h-5 w-5 rounded-full flex items-center justify-center border transition-all ${isSelected
                                          ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-[var(--color-on-primary)] shadow-sm'
                                          : 'border-[var(--color-border-strong)] bg-[var(--color-surface)]'
                                        }`}
                                    >
                                      {isSelected && <Check size={12} strokeWidth={3} />}
                                    </div>
                                  </div>
                                </div>

                                {(mapsUrl || (typeof branchPhone === 'string' && branchPhone.trim())) && (
                                  <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-[var(--color-border)]/40">
                                    {mapsUrl && (
                                      <a
                                        href={mapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[var(--color-surface)] hover:bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-border)]/80 transition-colors cursor-pointer"
                                      >
                                        <Navigation size={11} />
                                        <span>{t('header.directionsAndMap')}</span>
                                      </a>
                                    )}
                                    {typeof branchPhone === 'string' && branchPhone.trim() && (
                                      <a
                                        href={`tel:${branchPhone.trim()}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[var(--color-surface)] hover:bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-border)]/80 transition-colors cursor-pointer"
                                        dir="ltr"
                                      >
                                        <Phone size={11} />
                                        <span>{branchPhone.trim()}</span>
                                      </a>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>,
                    document.body
                  )}
                </div>
              )}

              {/* 2. Dedicated Social Media Popover Trigger Button */}
              <div className="relative flex-shrink-0" ref={socialRef}>
                <button
                  type="button"
                  onClick={() => {
                    setShowSocialPopup((prev) => !prev);
                    setShowHoursPopup(false);
                    setShowBranchesPopup(false);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl backdrop-blur-xl border font-bold transition-all duration-200 cursor-pointer shadow-sm active:scale-95 group ${showSocialPopup
                    ? 'bg-white/20 text-white border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/40 shadow-md'
                    : 'bg-white/10 hover:bg-white/15 text-white/95 border-white/20 hover:border-white/35'
                    }`}
                  aria-expanded={showSocialPopup}
                  aria-haspopup="dialog"
                  aria-label={t('header.socialChannels')}
                  title={t('header.socialChannels')}
                >
                  <AtSign size={13} className="text-[var(--color-primary)] group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span className="hidden xs:inline text-xs">
                    {t('header.socials')}
                  </span>
                </button>

                {/* ─── DESKTOP DROPDOWN: SOCIAL MEDIA & SHARE ─── */}
                {showSocialPopup && (
                  <div
                    className={`
                      hidden sm:block absolute top-full mt-2.5 z-50 max-h-[580px] w-[370px] md:w-[400px] overflow-y-auto overscroll-contain touch-pan-y custom-scrollbar
                      rounded-3xl bg-[var(--color-surface)]/95 dark:bg-[var(--color-surface)]/95
                      backdrop-blur-2xl border border-[var(--color-border)]/90 dark:border-white/[0.12]
                      p-5 sm:p-6 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.25),0_0_0_1px_rgba(0,0,0,0.05)]
                      dark:shadow-[0_25px_65px_-12px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.08)]
                      text-[var(--color-text-primary)] animate-popup-dropdown
                      ${isRTL ? 'right-0 left-auto' : 'left-0 right-auto'}
                    `}
                  >
                    <div
                      className="absolute inset-x-0 top-0 h-[2.5px] rounded-t-3xl pointer-events-none"
                      style={{ background: 'var(--gradient-primary)' }}
                    />

                    {/* Header */}
                    <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[var(--color-border)]/60">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 flex items-center justify-center text-[var(--color-primary)] shadow-sm">
                          <AtSign size={17} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold tracking-tight text-[var(--color-text-primary)]">
                            {t('header.socialChannels')}
                          </h3>
                          <p className="text-[11px] text-[var(--color-text-secondary)] font-medium truncate max-w-[200px]">
                            {brandName}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowSocialPopup(false)}
                        className="h-7 w-7 rounded-full bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-elevated)] border border-[var(--color-border)]/60 active:scale-90 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all cursor-pointer"
                        aria-label={t('header.close')}
                      >
                        <X size={14} />
                      </button>
                    </div>

                    {/* Direct Phone Call Row (SINGLE, CLEAN, UNIFIED ACTION - NO DUPLICATE ICONS) */}
                    {phone && (
                      <a
                        href={`tel:${phone.trim()}`}
                        className="mb-3.5 flex items-center justify-between p-2.5 px-3 rounded-2xl bg-[var(--color-surface-subtle)]/70 hover:bg-[var(--color-surface-subtle)] border border-[var(--color-border)]/80 hover:border-[var(--color-primary)]/40 transition-all shadow-sm group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-[var(--color-primary)]/15 text-[var(--color-primary)] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                            <Phone size={14} />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-medium text-[var(--color-text-muted)] block">
                              {t('header.directPhoneCall')}
                            </span>
                            <span dir="ltr" className="font-mono text-xs font-bold text-[var(--color-text-primary)] block truncate">
                              {phone.trim()}
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] px-2.5 py-1 rounded-lg bg-[var(--color-primary)]/15 hover:bg-[var(--color-primary)]/25 text-[var(--color-primary)] font-bold border border-[var(--color-primary)]/30 flex-shrink-0 transition-colors">
                          {t('header.callNow')}
                        </span>
                      </a>
                    )}

                    {/* Digital Menu Link Share (CLEAN INTEGRATED INPUT GROUP) */}
                    <div className="mb-3.5">
                      <div className="text-[11px] font-bold text-[var(--color-text-secondary)] mb-1.5 flex items-center justify-between px-0.5">
                        <span>{t('header.digitalMenuLink')}</span>
                        {copiedLink && (
                          <span className="text-[10px] font-bold text-[var(--color-primary)] flex items-center gap-1 animate-pulse">
                            <Check size={11} />
                            {t('header.copiedToClipboard')}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border)]/80 focus-within:border-[var(--color-primary)]/60 focus-within:ring-2 focus-within:ring-[var(--color-primary)]/15 transition-all">
                        <input
                          type="text"
                          readOnly
                          value={typeof window !== 'undefined' ? window.location.href : ''}
                          className="flex-1 bg-transparent px-2.5 py-1 text-xs text-[var(--color-text-secondary)] select-all focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleCopyLink}
                          className="px-3 py-1 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] active:scale-95 text-[var(--color-on-primary)] font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer flex-shrink-0"
                        >
                          {copiedLink ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedLink ? t('header.copied') : t('header.copy')}</span>
                        </button>
                      </div>
                    </div>

                    {/* Social Media Channels Grid */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] px-0.5">
                        {t('header.socialChannelsList')}
                      </div>

                      {socialList.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {socialList.map((item) => {
                            const IconComponent = item.icon;
                            const brandStyle = getSocialBrandStyle(item.id);
                            return (
                              <a
                                key={item.id}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-2.5 rounded-2xl border border-[var(--color-border)]/80 bg-[var(--color-surface-subtle)]/60 hover:bg-[var(--color-surface)] hover:border-[var(--color-primary)]/50 transition-all duration-200 group cursor-pointer shadow-sm"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div
                                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-sm border ${brandStyle.iconBg || ''}`}
                                    style={brandStyle.style}
                                  >
                                    <IconComponent size={15} color={brandStyle.iconColor} />
                                  </div>
                                  <div className="min-w-0">
                                    <span className="font-bold text-xs text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] block truncate transition-colors">
                                      {item.name}
                                    </span>
                                    <span className="text-[10px] text-[var(--color-text-muted)] block truncate">
                                      {item.badgeText}
                                    </span>
                                  </div>
                                </div>
                                <ExternalLink size={12} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors flex-shrink-0 ms-1" />
                              </a>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)]/60 text-center text-xs text-[var(--color-text-muted)]">
                          {t('header.shareHint')}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ─── MOBILE MODAL PORTAL: SOCIAL MEDIA & SHARE ─── */}
                {mounted && showSocialPopup && createPortal(
                  <div className="fixed inset-0 z-[998] sm:hidden">
                    <button
                      type="button"
                      aria-label={t('header.close')}
                      className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-popup-backdrop w-full h-full cursor-default border-none outline-none touch-none"
                      onClick={() => setShowSocialPopup(false)}
                      onTouchMove={(e) => e.preventDefault()}
                    />

                    <div
                      className="fixed inset-x-0 bottom-0 z-[999] max-h-[85dvh] overflow-y-auto overscroll-contain touch-pan-y rounded-t-[2rem] bg-[var(--color-surface)] dark:bg-[var(--color-surface)] border-t border-[var(--color-border)] dark:border-white/[0.12] p-5 pb-9 shadow-2xl text-[var(--color-text-primary)] animate-popup-sheet custom-scrollbar"
                      role="dialog"
                      aria-modal="true"
                    >
                      <div className="w-12 h-1.5 bg-[var(--color-border-strong)] rounded-full mx-auto mb-4 opacity-50" />

                      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[var(--color-border)]/60">
                        <div className="flex items-center gap-2.5">
                          <div className="h-9 w-9 rounded-xl bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/30 flex items-center justify-center text-[var(--color-primary)] shadow-sm">
                            <AtSign size={17} />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold tracking-tight text-[var(--color-text-primary)]">
                              {t('header.socialChannels')}
                            </h3>
                            <p className="text-[11px] text-[var(--color-text-secondary)] font-medium truncate max-w-[200px]">
                              {brandName}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowSocialPopup(false)}
                          className="h-7 w-7 rounded-full bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-elevated)] border border-[var(--color-border)]/60 active:scale-90 flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all cursor-pointer"
                          aria-label={t('header.close')}
                        >
                          <X size={14} />
                        </button>
                      </div>

                      {/* Direct Phone Call Row */}
                      {phone && (
                        <a
                          href={`tel:${phone.trim()}`}
                          className="mb-3.5 flex items-center justify-between p-2.5 px-3 rounded-2xl bg-[var(--color-surface-subtle)]/70 hover:bg-[var(--color-surface-subtle)] border border-[var(--color-border)]/80 hover:border-[var(--color-primary)]/40 transition-all shadow-sm group cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-[var(--color-primary)]/15 text-[var(--color-primary)] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                              <Phone size={14} />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[10px] font-medium text-[var(--color-text-muted)] block">
                                {t('header.directPhoneCall')}
                              </span>
                              <span dir="ltr" className="font-mono text-xs font-bold text-[var(--color-text-primary)] block truncate">
                                {phone.trim()}
                              </span>
                            </div>
                          </div>
                          <span className="text-[11px] px-2.5 py-1 rounded-lg bg-[var(--color-primary)]/15 hover:bg-[var(--color-primary)]/25 text-[var(--color-primary)] font-bold border border-[var(--color-primary)]/30 flex-shrink-0 transition-colors">
                            {t('header.callNow')}
                          </span>
                        </a>
                      )}

                      {/* Digital Menu Link Share */}
                      <div className="mb-3.5">
                        <div className="text-[11px] font-bold text-[var(--color-text-secondary)] mb-1.5 flex items-center justify-between px-0.5">
                          <span>{t('header.digitalMenuLink')}</span>
                          {copiedLink && (
                            <span className="text-[10px] font-bold text-[var(--color-primary)] flex items-center gap-1 animate-pulse">
                              <Check size={11} />
                              {t('header.copiedToClipboard')}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--color-surface-subtle)]/70 border border-[var(--color-border)]/80 focus-within:border-[var(--color-primary)]/60 focus-within:ring-2 focus-within:ring-[var(--color-primary)]/15 transition-all">
                          <input
                            type="text"
                            readOnly
                            value={typeof window !== 'undefined' ? window.location.href : ''}
                            className="flex-1 bg-transparent px-2.5 py-1 text-xs text-[var(--color-text-secondary)] select-all focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleCopyLink}
                            className="px-3 py-1 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] active:scale-95 text-[var(--color-on-primary)] font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer flex-shrink-0"
                          >
                            {copiedLink ? <Check size={12} /> : <Copy size={12} />}
                            <span>{copiedLink ? t('header.copied') : t('header.copy')}</span>
                          </button>
                        </div>
                      </div>

                      {/* Social Media Channels Grid */}
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] px-0.5">
                          {t('header.socialChannelsList')}
                        </div>

                        {socialList.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {socialList.map((item) => {
                              const IconComponent = item.icon;
                              const brandStyle = getSocialBrandStyle(item.id);
                              return (
                                <a
                                  key={item.id}
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between p-2.5 rounded-2xl border border-[var(--color-border)]/80 bg-[var(--color-surface-subtle)]/60 hover:bg-[var(--color-surface)] hover:border-[var(--color-primary)]/50 transition-all duration-200 group cursor-pointer shadow-sm"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div
                                      className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-sm border ${brandStyle.iconBg || ''}`}
                                      style={brandStyle.style}
                                    >
                                      <IconComponent size={15} color={brandStyle.iconColor} />
                                    </div>
                                    <div className="min-w-0">
                                      <span className="font-bold text-xs text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] block truncate transition-colors">
                                        {item.name}
                                      </span>
                                      <span className="text-[10px] text-[var(--color-text-muted)] block truncate">
                                        {item.badgeText}
                                      </span>
                                    </div>
                                  </div>
                                  <ExternalLink size={12} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors flex-shrink-0 ms-1" />
                                </a>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="p-3 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)]/60 text-center text-xs text-[var(--color-text-muted)]">
                            {t('header.shareHint')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>,
                  document.body
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
});