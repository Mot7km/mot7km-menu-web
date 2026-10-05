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
  MessageCircle,
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
} from '@/components/icons';

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

  // Comprehensive store status including "About to close" & "About to open"
  const storeStatusInfo = useMemo(() => {
    if (isTemporarilyClosed) {
      return {
        label: t('storeInfo.temporarilyClosed'),
        dotColor: 'bg-amber-400',
        badgeClass: 'bg-amber-950/85 text-amber-200 border-amber-500/50',
      };
    }

    if (!todaySchedule || todaySchedule.isClosed || !todaySchedule.open || !todaySchedule.close) {
      return isOpenNow
        ? { label: t('storeInfo.open'), dotColor: 'bg-emerald-400 animate-pulse', badgeClass: 'bg-emerald-950/80 text-emerald-200 border-emerald-500/50' }
        : { label: t('storeInfo.closed'), dotColor: 'bg-rose-400', badgeClass: 'bg-rose-950/80 text-rose-200 border-rose-500/50' };
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
          dotColor: 'bg-amber-400 animate-pulse',
          badgeClass: 'bg-amber-950/85 text-amber-200 border-amber-500/50',
        };
      }
      return {
        label: t('storeInfo.open'),
        dotColor: 'bg-emerald-400 animate-pulse',
        badgeClass: 'bg-emerald-950/80 text-emerald-200 border-emerald-500/50',
      };
    } else {
      const diffToOpen = openMinutes - currentMinutes;
      if (diffToOpen > 0 && diffToOpen <= 45) {
        return {
          label: t('header.aboutToOpen'),
          dotColor: 'bg-sky-400 animate-pulse',
          badgeClass: 'bg-sky-950/80 text-sky-200 border-sky-500/50',
        };
      }
      return {
        label: t('storeInfo.closed'),
        dotColor: 'bg-rose-400',
        badgeClass: 'bg-rose-950/80 text-rose-200 border-rose-500/50',
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
        shadow-2xl
      "
      style={{
        backgroundColor: 'var(--color-secondary)',
        minHeight: 'clamp(160px, 20vw, 210px)',
      }}
    >
      {/* ─── Background Layer with Multi-Tone Depth ─────────────────────── */}
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
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-black/60 rtl:bg-gradient-to-l" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-transparent to-[var(--color-secondary)]/90" />
        </div>
      ) : (
        <div
          className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-b-[2rem] sm:rounded-b-[2.5rem]"
          style={{
            background:
              'linear-gradient(135deg, var(--color-secondary) 0%, #090d16 60%, var(--color-primary) 100%)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60" />
          <div className="absolute -top-28 -end-28 w-80 h-80 rounded-full bg-[var(--color-accent)]/20 blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -start-20 w-64 h-64 rounded-full bg-[var(--color-primary)]/40 blur-3xl" />
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
                border-2 border-white/25
                bg-white/10 backdrop-blur-2xl
                shadow-[0_12px_30px_rgba(0,0,0,0.4)]
                transition-all duration-300
                hover:scale-105 hover:border-[var(--color-accent)]/90
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
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold backdrop-blur-xl shadow-md border transition-all cursor-pointer hover:scale-105 active:scale-95 group ${storeStatusInfo.badgeClass}`}
                aria-expanded={showHoursPopup}
                aria-haspopup="dialog"
                title={t('header.hoursTooltip')}
              >
                <span className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full shadow-sm flex-shrink-0 ${storeStatusInfo.dotColor}`} />
                <span className="whitespace-nowrap">{storeStatusInfo.label}</span>
                <Clock size={11} className="opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0 ms-0.5" />
              </button>

              {/* ─── DESKTOP DROPDOWN (Anchored under trigger on sm: and up) ─── */}
              {showHoursPopup && (
                <div
                  className={`
                    hidden sm:block absolute top-full mt-2.5 z-50 max-h-[580px] sm:w-[420px] md:w-[460px] overflow-y-auto overscroll-contain touch-pan-y
                    rounded-3xl bg-zinc-950/98 border border-white/[0.12]
                    p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)]
                    text-white animate-popup-dropdown
                    ${isRTL ? 'right-0 left-auto' : 'left-0 right-auto'}
                  `}
                  role="dialog"
                  aria-modal="true"
                >
                  {/* Hours Header */}
                  <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-xl bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/40 flex items-center justify-center text-[var(--color-accent)] shadow-sm">
                        <Clock size={18} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black tracking-tight text-white">
                          {t('header.operatingHours')}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {currentBranch?.name || brandName}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowHoursPopup(false)}
                      className="h-7 w-7 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
                      aria-label={t('header.close')}
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {/* Temporary Closure Warning */}
                  {isTemporarilyClosed && (
                    <div className="mb-4 p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-start gap-2.5 text-xs text-amber-200">
                      <AlertCircle size={17} className="flex-shrink-0 mt-0.5 text-amber-400" />
                      <div>
                        <p className="font-black text-sm">{t('storeInfo.temporarilyClosed')}</p>
                        {notes && <p className="text-[11px] text-amber-300/90 mt-1 leading-relaxed">{notes}</p>}
                      </div>
                    </div>
                  )}

                  {/* Today Highlight Card */}
                  <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-[var(--color-primary)]/20 via-white/5 to-transparent border border-[var(--color-primary)]/30 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-accent)]">
                        <span>{t('header.todaySchedule')}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-accent)] text-slate-950 font-black">
                          {getLocalizedDayName(todayIndex, locale)}
                        </span>
                      </div>
                      <div className="mt-1 font-mono text-sm sm:text-base font-black text-white">
                        {todaySchedule && !todaySchedule.isClosed && todaySchedule.open && todaySchedule.close
                          ? `${formatTimeLocalized(todaySchedule.open, locale)} – ${formatTimeLocalized(todaySchedule.close, locale)}`
                          : t('header.closedToday')}
                      </div>
                    </div>
                    <div className={`px-2.5 py-1 rounded-full text-xs font-black border ${storeStatusInfo.badgeClass}`}>
                      {storeStatusInfo.label}
                    </div>
                  </div>

                  {/* ─── 7-Day Times Table ─── */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-white/10 text-xs font-bold text-slate-300">
                      <div className="flex items-center gap-1.5 text-slate-300 font-extrabold">
                        <Calendar size={13} className="text-[var(--color-accent)]" />
                        <span>{t('header.weeklySchedule')}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {t('header.localTime')}
                      </span>
                    </div>

                    {activeSchedule.length > 0 ? (
                      <div className="space-y-1.5 max-h-56 overflow-y-auto overscroll-contain touch-pan-y pe-1 text-xs">
                        {fullWeeklySchedule.map((item) => {
                          const isToday = item.day === todayIndex;
                          const dayLabel = getLocalizedDayName(item.day, locale);
                          const isClosedDay = item.isClosed || (!item.open && !item.close);

                          return (
                            <div
                              key={item.day}
                              className={`flex items-center justify-between py-2 px-3 rounded-xl transition-colors duration-150 ${isToday
                                ? 'bg-[var(--color-accent)]/20 font-bold text-white border border-[var(--color-accent)]/40 shadow-sm'
                                : 'text-slate-300 hover:bg-white/5 border border-white/5'
                                }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className={`capitalize truncate text-xs ${isToday ? 'font-black text-[var(--color-accent)]' : 'font-medium'}`}>
                                  {dayLabel}
                                </span>
                                {isToday && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[var(--color-accent)] text-slate-950 font-black flex-shrink-0">
                                    {t('header.today')}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs tracking-wide font-semibold text-white/90">
                                  {isClosedDay
                                    ? t('storeInfo.closed')
                                    : `${formatTimeLocalized(item.open, locale)} – ${formatTimeLocalized(item.close, locale)}`}
                                </span>
                                <span
                                  className={`w-2 h-2 rounded-full flex-shrink-0 ${isClosedDay ? 'bg-rose-500' : 'bg-emerald-400'
                                    }`}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 py-4 text-center">
                        {todaySchedule && todaySchedule.open && todaySchedule.close
                          ? `${t('header.today')}: ${formatTimeLocalized(todaySchedule.open, locale)} – ${formatTimeLocalized(todaySchedule.close, locale)}`
                          : t('header.hoursNotAvailable')}
                      </p>
                    )}
                  </div>

                  {notes && !isTemporarilyClosed && (
                    <div className="mt-4 pt-3 border-t border-white/10 text-xs text-slate-300 leading-relaxed bg-white/5 p-3 rounded-2xl">
                      <span className="font-black text-white">{t('header.importantNotes')}</span>
                      {notes}
                    </div>
                  )}
                </div>
              )}

              {/* ─── MOBILE FULL-SCREEN MODAL PORTAL (Covers 100% viewport) ─── */}
              {mounted && showHoursPopup && createPortal(
                <div className="fixed inset-0 z-[998] sm:hidden">
                  {/* Full Page Mobile Backdrop */}
                  <button
                    type="button"
                    aria-label={t('header.close')}
                    className="fixed inset-0 bg-black/75 animate-popup-backdrop w-full h-full cursor-default border-none outline-none touch-none"
                    onClick={() => setShowHoursPopup(false)}
                    onTouchMove={(e) => e.preventDefault()}
                  />

                  {/* Mobile Bottom Sheet Card */}
                  <div
                    className="fixed inset-x-0 bottom-0 z-[999] max-h-[85dvh] overflow-y-auto overscroll-contain touch-pan-y rounded-t-3xl bg-zinc-950 border-t border-white/[0.12] p-5 pb-8 shadow-2xl text-white animate-popup-sheet"
                    role="dialog"
                    aria-modal="true"
                  >
                    <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-3" />

                    {/* Hours Header */}
                    <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/10">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/40 flex items-center justify-center text-[var(--color-accent)] shadow-sm">
                          <Clock size={18} />
                        </div>
                        <div>
                          <h3 className="text-sm font-black tracking-tight text-white">
                            {t('header.operatingHours')}
                          </h3>
                          <p className="text-[11px] text-slate-400 font-medium">
                            {currentBranch?.name || brandName}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowHoursPopup(false)}
                        className="h-7 w-7 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
                        aria-label={t('header.close')}
                      >
                        <X size={14} />
                      </button>
                    </div>

                    {/* Temporary Closure Warning */}
                    {isTemporarilyClosed && (
                      <div className="mb-4 p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-start gap-2.5 text-xs text-amber-200">
                        <AlertCircle size={17} className="flex-shrink-0 mt-0.5 text-amber-400" />
                        <div>
                          <p className="font-black text-sm">{t('storeInfo.temporarilyClosed')}</p>
                          {notes && <p className="text-[11px] text-amber-300/90 mt-1 leading-relaxed">{notes}</p>}
                        </div>
                      </div>
                    )}

                    {/* Today Highlight Card */}
                    <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-[var(--color-primary)]/20 via-white/5 to-transparent border border-[var(--color-primary)]/30 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-accent)]">
                          <span>{t('header.todaySchedule')}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-accent)] text-slate-950 font-black">
                            {getLocalizedDayName(todayIndex, locale)}
                          </span>
                        </div>
                        <div className="mt-1 font-mono text-sm sm:text-base font-black text-white">
                          {todaySchedule && !todaySchedule.isClosed && todaySchedule.open && todaySchedule.close
                            ? `${formatTimeLocalized(todaySchedule.open, locale)} – ${formatTimeLocalized(todaySchedule.close, locale)}`
                            : t('header.closedToday')}
                        </div>
                      </div>
                      <div className={`px-2.5 py-1 rounded-full text-xs font-black border ${storeStatusInfo.badgeClass}`}>
                        {storeStatusInfo.label}
                      </div>
                    </div>

                    {/* ─── 7-Day Times Table ─── */}
                    <div className="mb-2">
                      <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-white/10 text-xs font-bold text-slate-300">
                        <div className="flex items-center gap-1.5 text-slate-300 font-extrabold">
                          <Calendar size={13} className="text-[var(--color-accent)]" />
                          <span>{t('header.weeklySchedule')}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {t('header.localTime')}
                        </span>
                      </div>

                      {activeSchedule.length > 0 ? (
                        <div className="space-y-1.5 max-h-56 overflow-y-auto pe-1 text-xs">
                          {fullWeeklySchedule.map((item) => {
                            const isToday = item.day === todayIndex;
                            const dayLabel = getLocalizedDayName(item.day, locale);
                            const isClosedDay = item.isClosed || (!item.open && !item.close);

                            return (
                              <div
                                key={item.day}
                                className={`flex items-center justify-between py-2 px-3 rounded-xl transition-all ${isToday
                                  ? 'bg-[var(--color-accent)]/20 font-bold text-white border border-[var(--color-accent)]/40 shadow-sm'
                                  : 'text-slate-300 hover:bg-white/5 border border-white/5'
                                  }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className={`capitalize truncate text-xs ${isToday ? 'font-black text-[var(--color-accent)]' : 'font-medium'}`}>
                                    {dayLabel}
                                  </span>
                                  {isToday && (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[var(--color-accent)] text-slate-950 font-black flex-shrink-0">
                                      {t('header.today')}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs tracking-wide font-semibold text-white/90">
                                    {isClosedDay
                                      ? t('storeInfo.closed')
                                      : `${formatTimeLocalized(item.open, locale)} – ${formatTimeLocalized(item.close, locale)}`}
                                  </span>
                                  <span
                                    className={`w-2 h-2 rounded-full flex-shrink-0 ${isClosedDay ? 'bg-rose-500' : 'bg-emerald-400'
                                      }`}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 py-4 text-center">
                          {todaySchedule && todaySchedule.open && todaySchedule.close
                            ? `${t('header.today')}: ${formatTimeLocalized(todaySchedule.open, locale)} – ${formatTimeLocalized(todaySchedule.close, locale)}`
                            : t('header.hoursNotAvailable')}
                        </p>
                      )}
                    </div>

                    {notes && !isTemporarilyClosed && (
                      <div className="mt-4 pt-3 border-t border-white/10 text-xs text-slate-300 leading-relaxed bg-white/5 p-3 rounded-2xl">
                        <span className="font-black text-white">{t('header.importantNotes')}</span>
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
                text-4xl sm:text-5xl
                font-black tracking-tight leading-tight
                text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.7)]
                truncate max-w-[220px] xs:max-w-xs sm:max-w-md lg:max-w-xl
              "
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {brandName}
              </h1>

              {/* Slogan */}
              {slogan && (
                <p className="text-xs sm:text-sm font-medium text-slate-200/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
                  {slogan}
                </p>
              )}
            </div>

            {/* Separator Beneath Slogan */}
            <div className="my-2 h-[2px] max-w-xs sm:max-w-xs rounded-full bg-gradient-to-r rtl:bg-gradient-to-l from-[var(--color-accent)] via-[var(--color-accent)]/50 to-transparent shadow-md" />

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
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl backdrop-blur-2xl border text-white font-bold transition-all cursor-pointer shadow-sm group ${showBranchesPopup
                      ? 'bg-white/25 border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/50'
                      : 'bg-white/15 hover:bg-white/25 border-white/25'
                      }`}
                    aria-expanded={showBranchesPopup}
                    aria-haspopup="dialog"
                    aria-label={t('storeInfo.selectBranch')}
                  >
                    <Store size={14} className="text-[var(--color-accent)] group-hover:scale-110 transition-transform flex-shrink-0" />
                    <span className="truncate max-w-[130px] xs:max-w-[180px] sm:max-w-[260px] md:max-w-[320px]">
                      {currentBranch?.name || t('header.branches')}
                    </span>
                    {branches.length > 1 && (
                      <span className="ms-1 px-1.5 py-0.5 rounded-md text-[10px] font-black bg-white/20 text-white flex-shrink-0">
                        {branches.length}
                      </span>
                    )}
                    <ChevronDown
                      size={12}
                      className={`opacity-80 transition-transform duration-200 flex-shrink-0 ${showBranchesPopup ? 'rotate-180' : 'group-hover:translate-y-0.5'
                        }`}
                    />
                  </button>

                  {/* ─── DESKTOP DROPDOWN (Anchored under trigger on sm: and up) ─── */}
                  {showBranchesPopup && (
                    <div
                      className={`
                        hidden sm:block absolute top-full mt-2.5 z-50 max-h-[580px] sm:w-[480px] md:w-[540px] overflow-y-auto overscroll-contain touch-pan-y
                        rounded-3xl bg-zinc-950/98 border border-white/[0.12]
                        p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)]
                        text-white animate-popup-dropdown
                        ${isRTL ? 'right-0 left-auto' : 'left-0 right-auto'}
                      `}
                      role="dialog"
                      aria-modal="true"
                    >
                      {/* Branches Header */}
                      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/[0.08]">
                        <div className="flex items-center gap-2.5">
                          <div className="h-9 w-9 rounded-xl bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/30 flex items-center justify-center text-[var(--color-accent)] shadow-sm">
                            <Store size={18} />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold tracking-tight text-zinc-100">
                              {t('header.branchesTitle')}
                            </h3>
                            <p className="text-[11px] text-zinc-400 font-medium">
                              {branches.length} {branches.length === 1 ? t('header.availableBranchSingle') : t('header.availableBranchPlural')}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowBranchesPopup(false)}
                          className="h-7 w-7 rounded-full bg-white/10 hover:bg-white/15 active:scale-90 flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer"
                          aria-label={t('header.close')}
                        >
                          <X size={14} />
                        </button>
                      </div>

                      {/* Instructions Hint */}
                      <p className="text-xs text-zinc-400 mb-3 px-1">
                        {t('header.selectBranchHint')}
                      </p>

                      {/* Spacious Branches List */}
                      <div className="space-y-2.5 max-h-[380px] overflow-y-auto overscroll-contain touch-pan-y pe-1.5">
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
                              className={`w-full flex flex-col text-start p-3.5 rounded-2xl transition-colors duration-150 cursor-pointer border ${isSelected
                                ? 'bg-white/[0.08] border-[var(--color-accent)] shadow-lg ring-1 ring-[var(--color-accent)]/30'
                                : 'hover:bg-white/[0.08] text-zinc-200 bg-white/[0.04] border-white/[0.08] hover:border-white/[0.15]'
                                }`}
                              onClick={() => {
                                setActiveBranchId(b.id);
                                setShowBranchesPopup(false);
                              }}
                            >
                              {/* Top Row: Name, Main Badge, Checkmark */}
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-2 mb-1">
                                    {b.isMainBranch && (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30">
                                        {t('header.mainBranch')}
                                      </span>
                                    )}
                                    {isSelected && (
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--color-accent)] text-zinc-950">
                                        {t('header.activeBranch')}
                                      </span>
                                    )}
                                  </div>
                                  <h4 className="font-bold text-sm text-zinc-100 leading-snug break-words">
                                    {b.name}
                                  </h4>
                                </div>

                                <div className="flex-shrink-0 pt-0.5">
                                  <div
                                    className={`h-6 w-6 rounded-full flex items-center justify-center border transition-all ${isSelected
                                      ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-zinc-950 shadow-md'
                                      : 'border-white/20 bg-white/5'
                                      }`}
                                  >
                                    {isSelected ? (
                                      <Check size={14} strokeWidth={3} />
                                    ) : (
                                      <span className="h-2 w-2 rounded-full bg-white/40" />
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Middle Row: Address & Location */}
                              {branchLoc && (
                                <div className="flex items-start gap-2 mt-2 pt-2 border-t border-white/[0.08] text-xs text-zinc-400">
                                  <MapPin size={13} className="text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
                                  <span className="leading-relaxed break-words flex-1">
                                    {branchLoc}
                                  </span>
                                </div>
                              )}

                              {/* Bottom Action Row: Directions & Map Link + Phone */}
                              <div className="flex flex-wrap items-center justify-between gap-2 mt-2.5 pt-2 border-t border-white/[0.08]">
                                {mapsUrl ? (
                                  <a
                                    href={mapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-[var(--color-accent)] border border-white/[0.08] transition-colors shadow-sm cursor-pointer"
                                  >
                                    <Navigation size={12} className="flex-shrink-0" />
                                    <span>{t('header.directionsAndMap')}</span>
                                    <ExternalLink size={10} className="opacity-70 flex-shrink-0" />
                                  </a>
                                ) : (
                                  <span />
                                )}

                                {typeof branchPhone === 'string' && branchPhone.trim() && (
                                  <a
                                    href={`tel:${branchPhone.trim()}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-zinc-200 border border-white/[0.08] transition-colors shadow-sm cursor-pointer"
                                    dir="ltr"
                                  >
                                    <Phone size={12} className="text-emerald-400 flex-shrink-0" />
                                    <span>{branchPhone.trim()}</span>
                                  </a>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ─── MOBILE FULL-SCREEN MODAL PORTAL (Covers 100% viewport) ─── */}
                  {mounted && showBranchesPopup && createPortal(
                    <div className="fixed inset-0 z-[998] sm:hidden">
                      {/* Full Page Mobile Backdrop */}
                      <button
                        type="button"
                        aria-label={t('header.close')}
                        className="fixed inset-0 bg-black/75 animate-popup-backdrop w-full h-full cursor-default border-none outline-none touch-none"
                        onClick={() => setShowBranchesPopup(false)}
                        onTouchMove={(e) => e.preventDefault()}
                      />

                      {/* Mobile Bottom Sheet Card */}
                      <div
                        className="fixed inset-x-0 bottom-0 z-[999] max-h-[85dvh] overflow-y-auto overscroll-contain touch-pan-y rounded-t-3xl bg-zinc-950 border-t border-white/[0.12] p-5 pb-8 shadow-2xl text-white animate-popup-sheet"
                        role="dialog"
                        aria-modal="true"
                      >
                        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-3" />

                        {/* Branches Header */}
                        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/[0.08]">
                          <div className="flex items-center gap-2.5">
                            <div className="h-9 w-9 rounded-xl bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/30 flex items-center justify-center text-[var(--color-accent)] shadow-sm">
                              <Store size={18} />
                            </div>
                            <div>
                              <h3 className="text-sm font-bold tracking-tight text-zinc-100">
                                {t('header.branchesTitle')}
                              </h3>
                              <p className="text-[11px] text-zinc-400 font-medium">
                                {branches.length} {branches.length === 1 ? t('header.availableBranchSingle') : t('header.availableBranchPlural')}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowBranchesPopup(false)}
                            className="h-7 w-7 rounded-full bg-white/10 hover:bg-white/15 active:scale-90 flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer"
                            aria-label={t('header.close')}
                          >
                            <X size={14} />
                          </button>
                        </div>

                        {/* Instructions Hint */}
                        <p className="text-xs text-zinc-400 mb-3 px-1">
                          {t('header.selectBranchHint')}
                        </p>

                        {/* Spacious Branches List */}
                        <div className="space-y-2.5 max-h-[50vh] overflow-y-auto overscroll-contain touch-pan-y pe-1.5">
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
                                className={`w-full flex flex-col text-start p-3.5 rounded-2xl transition-colors duration-150 cursor-pointer border ${isSelected
                                  ? 'bg-white/[0.08] border-[var(--color-accent)] shadow-lg ring-1 ring-[var(--color-accent)]/30'
                                  : 'hover:bg-white/[0.08] text-zinc-200 bg-white/[0.04] border-white/[0.08] hover:border-white/[0.15]'
                                  }`}
                                onClick={() => {
                                  setActiveBranchId(b.id);
                                  setShowBranchesPopup(false);
                                }}
                              >
                                {/* Top Row: Name, Main Badge, Checkmark */}
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                      {b.isMainBranch && (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30">
                                          {t('header.mainBranch')}
                                        </span>
                                      )}
                                      {isSelected && (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--color-accent)] text-zinc-950">
                                          {t('header.activeBranch')}
                                        </span>
                                      )}
                                    </div>
                                    <h4 className="font-bold text-sm text-zinc-100 leading-snug break-words">
                                      {b.name}
                                    </h4>
                                  </div>

                                  <div className="flex-shrink-0 pt-0.5">
                                    <div
                                      className={`h-6 w-6 rounded-full flex items-center justify-center border transition-all ${isSelected
                                        ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-zinc-950 shadow-md'
                                        : 'border-white/20 bg-white/5'
                                        }`}
                                    >
                                      {isSelected ? (
                                        <Check size={14} strokeWidth={3} />
                                      ) : (
                                        <span className="h-2 w-2 rounded-full bg-white/40" />
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Middle Row: Address & Location */}
                                {branchLoc && (
                                  <div className="flex items-start gap-2 mt-2 pt-2 border-t border-white/[0.08] text-xs text-zinc-400">
                                    <MapPin size={13} className="text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
                                    <span className="leading-relaxed break-words flex-1">
                                      {branchLoc}
                                    </span>
                                  </div>
                                )}

                                {/* Bottom Action Row: Directions & Map Link + Phone */}
                                <div className="flex flex-wrap items-center justify-between gap-2 mt-2.5 pt-2 border-t border-white/[0.08]">
                                  {mapsUrl ? (
                                    <a
                                      href={mapsUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-[var(--color-accent)] border border-white/[0.08] transition-colors shadow-sm cursor-pointer"
                                    >
                                      <Navigation size={12} className="flex-shrink-0" />
                                      <span>{t('header.directionsAndMap')}</span>
                                      <ExternalLink size={10} className="opacity-70 flex-shrink-0" />
                                    </a>
                                  ) : (
                                    <span />
                                  )}

                                  {typeof branchPhone === 'string' && branchPhone.trim() && (
                                    <a
                                      href={`tel:${branchPhone.trim()}`}
                                      onClick={(e) => e.stopPropagation()}
                                      className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-zinc-200 border border-white/[0.08] transition-colors shadow-sm cursor-pointer"
                                      dir="ltr"
                                    >
                                      <Phone size={12} className="text-emerald-400 flex-shrink-0" />
                                      <span>{branchPhone.trim()}</span>
                                    </a>
                                  )}
                                </div>
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
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl backdrop-blur-2xl border text-white font-bold transition-all cursor-pointer shadow-sm group ${showSocialPopup
                    ? 'bg-white/25 border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/50'
                    : 'bg-white/15 hover:bg-white/25 border-white/25'
                    }`}
                  aria-expanded={showSocialPopup}
                  aria-haspopup="dialog"
                  aria-label={t('header.socialChannels')}
                  title={t('header.socialChannels')}
                >
                  <AtSign size={13} className="text-[var(--color-accent)] group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span className="hidden xs:inline text-xs">
                    {t('header.socials')}
                  </span>
                </button>

                {/* ─── DESKTOP DROPDOWN (Anchored under trigger on sm: and up) ─── */}
                {showSocialPopup && (
                  <div
                    className={`
                      hidden sm:block absolute top-full mt-2.5 z-50 max-h-[580px] w-[380px] md:w-[420px] overflow-y-auto overscroll-contain touch-pan-y
                      rounded-3xl bg-zinc-950/98 border border-white/[0.12]
                      p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)]
                      text-white animate-popup-dropdown
                      ${isRTL ? 'right-0 left-auto' : 'left-0 right-auto'}
                    `}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-white/[0.08]">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/30 flex items-center justify-center text-[var(--color-accent)] shadow-sm">
                          <AtSign size={16} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold tracking-tight text-zinc-100">
                            {t('header.socialChannels')}
                          </h3>
                          <p className="text-[11px] text-zinc-400 font-medium truncate max-w-[200px]">
                            {brandName}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowSocialPopup(false)}
                        className="h-7 w-7 rounded-full bg-white/10 hover:bg-white/15 active:scale-90 flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer"
                        aria-label={t('header.close')}
                      >
                        <X size={14} />
                      </button>
                    </div>

                    {/* Direct Phone Call Button */}
                    {phone && (
                      <div className="mb-3 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                        <div className="text-[11px] font-bold text-zinc-300 mb-2 flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-zinc-200">
                            <Phone size={12} className="text-[var(--color-accent)]" />
                            <span>{t('header.directPhoneCall')}</span>
                          </span>
                          <span className="text-[10px] text-zinc-400 font-medium">
                            {t('header.directOrders')}
                          </span>
                        </div>
                        <a
                          href={`tel:${phone.trim()}`}
                          className="flex items-center justify-between p-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-[var(--color-accent)]/40 text-white font-bold text-xs transition-all shadow-sm group cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="p-1.5 rounded-lg bg-[var(--color-accent)]/15 text-[var(--color-accent)] group-hover:scale-105 transition-transform flex-shrink-0">
                              <Phone size={13} />
                            </div>
                            <span dir="ltr" className="font-mono text-xs sm:text-sm tracking-wide font-bold text-zinc-100 group-hover:text-white truncate">
                              {phone.trim()}
                            </span>
                          </div>
                          <span className="text-[11px] px-2.5 py-1 rounded-lg bg-[var(--color-accent)] text-zinc-950 font-bold group-hover:brightness-105 transition-all flex-shrink-0">
                            {t('header.callNow')}
                          </span>
                        </a>
                      </div>
                    )}

                    {/* Quick Link Copy Section */}
                    <div className="mb-3 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                      <div className="text-[11px] font-bold text-zinc-300 mb-2 flex items-center justify-between">
                        <span>{t('header.digitalMenuLink')}</span>
                        {copiedLink && (
                          <span className="text-[10px] font-bold text-[var(--color-accent)] flex items-center gap-1 animate-pulse">
                            <Check size={11} />
                            {t('header.copiedToClipboard')}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={typeof window !== 'undefined' ? window.location.href : ''}
                          className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-xs text-zinc-300 select-all focus:outline-none focus:border-[var(--color-accent)]/50"
                        />
                        <button
                          onClick={handleCopyLink}
                          className="px-3 py-1.5 rounded-xl bg-[var(--color-primary)] hover:brightness-110 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer flex-shrink-0"
                        >
                          {copiedLink ? <Check size={13} /> : <Copy size={13} />}
                          <span>{copiedLink ? t('header.copied') : t('header.copy')}</span>
                        </button>
                      </div>
                    </div>

                    {/* Social Media Channels Grid */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 px-1 mb-2">
                        {t('header.socialChannelsList')}
                      </div>

                      {socialList.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {socialList.map((item) => {
                            const IconComponent = item.icon;
                            return (
                              <a
                                key={item.id}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-2.5 rounded-2xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] hover:border-[var(--color-accent)]/40 transition-all duration-200 group cursor-pointer shadow-sm"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="p-2 rounded-xl bg-white/[0.06] group-hover:bg-white/[0.1] text-zinc-300 group-hover:text-white transition-all flex-shrink-0">
                                    <IconComponent size={15} />
                                  </div>
                                  <div className="min-w-0">
                                    <span className="font-bold text-xs text-zinc-200 group-hover:text-white block truncate">
                                      {item.name}
                                    </span>
                                    <span className="text-[10px] text-zinc-400 block truncate">
                                      {item.badgeText}
                                    </span>
                                  </div>
                                </div>
                                <ExternalLink size={12} className="text-zinc-500 group-hover:text-zinc-300 transition-colors flex-shrink-0 ms-1" />
                              </a>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-center text-xs text-zinc-400">
                          {t('header.shareHint')}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ─── MOBILE FULL-SCREEN MODAL PORTAL (Covers 100% viewport) ─── */}
                {mounted && showSocialPopup && createPortal(
                  <div className="fixed inset-0 z-[998] sm:hidden">
                    {/* Full Page Mobile Backdrop */}
                    <button
                      type="button"
                      aria-label={t('header.close')}
                      className="fixed inset-0 bg-black/75 animate-popup-backdrop w-full h-full cursor-default border-none outline-none touch-none"
                      onClick={() => setShowSocialPopup(false)}
                      onTouchMove={(e) => e.preventDefault()}
                    />

                    {/* Mobile Bottom Sheet Card */}
                    <div
                      className="fixed inset-x-0 bottom-0 z-[999] max-h-[85dvh] overflow-y-auto overscroll-contain touch-pan-y rounded-t-3xl bg-zinc-950 border-t border-white/[0.12] p-5 pb-8 shadow-2xl text-white animate-popup-sheet"
                      role="dialog"
                      aria-modal="true"
                    >
                      <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-3" />

                      {/* Header */}
                      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-white/[0.08]">
                        <div className="flex items-center gap-2.5">
                          <div className="h-9 w-9 rounded-xl bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/30 flex items-center justify-center text-[var(--color-accent)] shadow-sm">
                            <AtSign size={16} />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold tracking-tight text-zinc-100">
                              {t('header.socialChannels')}
                            </h3>
                            <p className="text-[11px] text-zinc-400 font-medium truncate max-w-[200px]">
                              {brandName}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowSocialPopup(false)}
                          className="h-7 w-7 rounded-full bg-white/10 hover:bg-white/15 active:scale-90 flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer"
                          aria-label={t('header.close')}
                        >
                          <X size={14} />
                        </button>
                      </div>

                      {/* Direct Phone Call Button */}
                      {phone && (
                        <div className="mb-3 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                          <div className="text-[11px] font-bold text-zinc-300 mb-2 flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-zinc-200">
                              <Phone size={12} className="text-[var(--color-accent)]" />
                              <span>{t('header.directPhoneCall')}</span>
                            </span>
                            <span className="text-[10px] text-zinc-400 font-medium">
                              {t('header.directOrders')}
                            </span>
                          </div>
                          <a
                            href={`tel:${phone.trim()}`}
                            className="flex items-center justify-between p-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-[var(--color-accent)]/40 text-white font-bold text-xs transition-all shadow-sm group cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="p-1.5 rounded-lg bg-[var(--color-accent)]/15 text-[var(--color-accent)] group-hover:scale-105 transition-transform flex-shrink-0">
                                <Phone size={13} />
                              </div>
                              <span dir="ltr" className="font-mono text-xs sm:text-sm tracking-wide font-bold text-zinc-100 group-hover:text-white truncate">
                                {phone.trim()}
                              </span>
                            </div>
                            <span className="text-[11px] px-2.5 py-1 rounded-lg bg-[var(--color-accent)] text-zinc-950 font-bold group-hover:brightness-105 transition-all flex-shrink-0">
                              {t('header.callNow')}
                            </span>
                          </a>
                        </div>
                      )}

                      {/* Quick Link Copy Section */}
                      <div className="mb-3 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                        <div className="text-[11px] font-bold text-zinc-300 mb-2 flex items-center justify-between">
                          <span>{t('header.digitalMenuLink')}</span>
                          {copiedLink && (
                            <span className="text-[10px] font-bold text-[var(--color-accent)] flex items-center gap-1 animate-pulse">
                              <Check size={11} />
                              {t('header.copiedToClipboard')}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={typeof window !== 'undefined' ? window.location.href : ''}
                            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-xs text-zinc-300 select-all focus:outline-none focus:border-[var(--color-accent)]/50"
                          />
                          <button
                            onClick={handleCopyLink}
                            className="px-3 py-1.5 rounded-xl bg-[var(--color-primary)] hover:brightness-110 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer flex-shrink-0"
                          >
                            {copiedLink ? <Check size={13} /> : <Copy size={13} />}
                            <span>{copiedLink ? t('header.copied') : t('header.copy')}</span>
                          </button>
                        </div>
                      </div>

                      {/* Social Media Channels Grid */}
                      <div className="space-y-2">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 px-1 mb-2">
                          {t('header.socialChannelsList')}
                        </div>

                        {socialList.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {socialList.map((item) => {
                              const IconComponent = item.icon;
                              return (
                                <a
                                  key={item.id}
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between p-2.5 rounded-2xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] hover:border-[var(--color-accent)]/40 transition-all duration-200 group cursor-pointer shadow-sm"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="p-2 rounded-xl bg-white/[0.06] group-hover:bg-white/[0.1] text-zinc-300 group-hover:text-white transition-all flex-shrink-0">
                                      <IconComponent size={15} />
                                    </div>
                                    <div className="min-w-0">
                                      <span className="font-bold text-xs text-zinc-200 group-hover:text-white block truncate">
                                        {item.name}
                                      </span>
                                      <span className="text-[10px] text-zinc-400 block truncate">
                                        {item.badgeText}
                                      </span>
                                    </div>
                                  </div>
                                  <ExternalLink size={12} className="text-zinc-500 group-hover:text-zinc-300 transition-colors flex-shrink-0 ms-1" />
                                </a>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-center text-xs text-zinc-400">
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