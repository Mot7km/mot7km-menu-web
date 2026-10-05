'use client';

import { useState, useEffect, memo, useRef, useMemo } from 'react';
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
  Info,
  MapPin,
  X,
} from 'lucide-react';
import { useStore, parseWorkingHours } from '@/store/storeHooks';
import { isStoreOpen, type WorkingHours } from '@/data/storeInfo';
import type { ApiBranch } from '@/lib/types/menuApi';
import { SettingsMenu } from '@/components/common/SettingsMenu';

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

  // --- Unified Store Hub Dropdown State ---
  const [showStoreHub, setShowStoreHub] = useState(false);
  const hubRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (hubRef.current && !hubRef.current.contains(event.target as Node)) {
        setShowStoreHub(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when popup is open on mobile
  useEffect(() => {
    if (showStoreHub && window.innerWidth < 640) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showStoreHub]);

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
          label: locale === 'ar' ? 'يوشك على الإغلاق' : 'About to close',
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
          label: locale === 'ar' ? 'يوشك على الفتح' : 'About to open',
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
  }, [isTemporarilyClosed, todaySchedule, isOpenNow, locale, t]);

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

          {/* Logo & Status Badge Column */}
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

            {/* Status Badge directly under the header logo */}
            <div
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold backdrop-blur-xl shadow-sm border ${storeStatusInfo.badgeClass}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full shadow-sm flex-shrink-0 ${storeStatusInfo.dotColor}`} />
              <span className="whitespace-nowrap">{storeStatusInfo.label}</span>
            </div>
          </div>

          {/* Details & Info Stack */}
          <div className="flex flex-col justify-center min-w-0 flex-1">
            <div>
              {/* Brand Name */}
              <h1
                className="
                text-2xl sm:text-3xl lg:text-5xl
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

            {/* ONE-ROW FLEX TOOLBAR */}
            <div className="flex flex-wrap items-center gap-2 text-xs">

              {/* Master Store & Branch Hub Button */}
              <div className="relative flex-shrink-0" ref={hubRef}>
                <button
                  onClick={() => setShowStoreHub((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-2xl border border-white/25 text-white font-bold transition-all cursor-pointer shadow-sm group"
                  aria-expanded={showStoreHub}
                  aria-haspopup="dialog"
                  aria-label={t('storeInfo.selectBranch')}
                >
                  <Store size={13} className="text-[var(--color-accent)] group-hover:scale-110 transition-transform flex-shrink-0" />
                  <span className="truncate max-w-[130px] xs:max-w-[170px] sm:max-w-[220px]">
                    {currentBranch?.name || (locale === 'ar' ? 'الفروع والمواعيد' : 'Our Branches')}
                  </span>
                  <ChevronDown size={12} className="opacity-80 transition-transform group-hover:translate-y-0.5 flex-shrink-0" />
                </button>

                {/* --- MOBILE BACKDROP OVERLAY --- */}
                {showStoreHub && (
                  <div
                    className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40 sm:hidden transition-opacity"
                    onClick={() => setShowStoreHub(false)}
                  />
                )}

                {/* --- REDESIGNED POPUP CARD (Viewport-Safe & Edge-Proof) --- */}
                {showStoreHub && (
                  <div
                    className={`
                      fixed inset-x-4 top-20 z-50 max-h-[85vh] overflow-y-auto
                      sm:absolute sm:inset-x-auto sm:top-full sm:mt-2.5 sm:max-h-[550px] sm:w-[420px]
                      rounded-3xl bg-slate-950/95 border border-white/20
                      backdrop-blur-3xl p-5 shadow-[0_25px_60px_rgba(0,0,0,0.8)]
                      text-white transition-all animate-in fade-in zoom-in-95 duration-200
                      ${isRTL ? 'sm:right-0 sm:left-auto' : 'sm:left-0 sm:right-auto'}
                    `}
                  >
                    {/* Hub Header */}
                    <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-xl bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/40 flex items-center justify-center text-[var(--color-accent)]">
                          <Store size={16} />
                        </div>
                        <div>
                          <h3 className="text-sm font-black tracking-tight text-white">
                            {locale === 'ar' ? 'الفروع ومواعيد العمل' : 'Our Branches & Hours'}
                          </h3>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {branches.length} {branches.length === 1 ? 'Available Branch' : 'Available Branches'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowStoreHub(false)}
                        className="h-7 w-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                        aria-label="Close"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    {/* Branch Switcher Section */}
                    {branches.length > 0 && (
                      <div className="mb-4">
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 px-1">
                          {branches.length > 1 ? t('storeInfo.selectLocation') : (locale === 'ar' ? 'الفرع النشط' : 'Active Branch')}
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto pe-1">
                          {branches.map((b) => {
                            const isSelected = String(b.id) === String(activeBranchId);
                            const branchLoc = b.address?.formattedAddress || b.location;
                            const mapsUrl = b.address?.mapsUrl?.trim() || (branchLoc ? `https://maps.google.com/?q=${encodeURIComponent(branchLoc)}` : null);

                            return (
                              <div
                                key={b.id}
                                className={`w-full flex flex-col text-start p-3 rounded-2xl text-xs transition-all cursor-pointer border ${isSelected
                                  ? 'bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent)]/80 text-slate-950 font-extrabold shadow-lg border-[var(--color-accent)]'
                                  : 'hover:bg-white/10 text-slate-200 bg-white/5 border-white/10'
                                  }`}
                                onClick={() => setActiveBranchId(b.id)}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="truncate font-bold text-xs">{b.name}</span>
                                  {isSelected && (
                                    <span className="flex items-center justify-center h-5 w-5 rounded-full bg-slate-950 text-[var(--color-accent)]">
                                      <Check size={12} strokeWidth={3} />
                                    </span>
                                  )}
                                </div>
                                {branchLoc && (
                                  <div className="flex items-center justify-between mt-1.5 gap-2 pt-1.5 border-t border-black/10">
                                    <span className={`text-[11px] truncate flex items-center gap-1.5 ${isSelected ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                                      <MapPin size={11} className="flex-shrink-0" />
                                      {branchLoc}
                                    </span>
                                    {mapsUrl && (
                                      <a
                                        href={mapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-colors ${isSelected
                                          ? 'bg-slate-950 text-white hover:bg-slate-900'
                                          : 'bg-white/10 text-[var(--color-accent)] hover:bg-white/20'
                                          }`}
                                      >
                                        {locale === 'ar' ? 'الخريطة ↗' : 'Map ↗'}
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

                    {/* Temporary Closure Alert */}
                    {isTemporarilyClosed && (
                      <div className="mb-4 p-3 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-start gap-2.5 text-xs text-amber-200">
                        <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-amber-400" />
                        <div>
                          <p className="font-bold">{t('storeInfo.temporarilyClosed')}</p>
                          {notes && <p className="text-[11px] text-amber-300/80 mt-0.5">{notes}</p>}
                        </div>
                      </div>
                    )}

                    {/* Working Hours Schedule */}
                    <div className="mb-1">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-xs font-bold text-slate-300">
                        <div className="flex items-center gap-1.5 text-[var(--color-accent)] font-black">
                          <Calendar size={14} />
                          <span>{t('storeInfo.operatingHours')}</span>
                        </div>
                        <Clock size={13} className="opacity-70" />
                      </div>

                      {activeSchedule.length > 0 ? (
                        <div className="space-y-1 max-h-44 overflow-y-auto pe-1 text-xs">
                          {fullWeeklySchedule.map((item) => {
                            const isToday = item.day === todayIndex;
                            const dayLabel = getLocalizedDayName(item.day, locale);
                            const isClosedDay = item.isClosed || (!item.open && !item.close);

                            return (
                              <div
                                key={item.day}
                                className={`flex items-center justify-between py-1.5 px-3 rounded-xl transition-all ${isToday
                                  ? 'bg-[var(--color-accent)]/20 font-bold text-[var(--color-accent)] border border-[var(--color-accent)]/30 shadow-sm'
                                  : 'text-slate-300 hover:bg-white/5 border border-transparent'
                                  }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="capitalize truncate font-medium">{dayLabel}</span>
                                  {isToday && (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[var(--color-accent)] text-slate-950 font-black flex-shrink-0">
                                      {locale === 'ar' ? 'اليوم' : 'Today'}
                                    </span>
                                  )}
                                </div>
                                <span className="font-mono text-[11px] tracking-wide flex-shrink-0 ms-2 font-semibold">
                                  {isClosedDay
                                    ? t('storeInfo.closed')
                                    : `${formatTimeLocalized(item.open, locale)} – ${formatTimeLocalized(item.close, locale)}`}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 py-3 text-center">
                          {todaySchedule && todaySchedule.open && todaySchedule.close
                            ? `${locale === 'ar' ? 'اليوم' : 'Today'}: ${formatTimeLocalized(todaySchedule.open, locale)} – ${formatTimeLocalized(todaySchedule.close, locale)}`
                            : t('storeInfo.hoursNotAvailable')}
                        </p>
                      )}
                    </div>

                    {notes && !isTemporarilyClosed && (
                      <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-slate-300/90 leading-relaxed bg-white/5 p-3 rounded-2xl">
                        <span className="font-bold text-white">{locale === 'ar' ? 'ملاحظات: ' : 'Note: '}</span>
                        {notes}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Phone Quick Button
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-2xl border border-white/15 text-slate-200 hover:text-white transition-all cursor-pointer shadow-sm flex-shrink-0"
                  dir="ltr"
                  title={phone}
                >
                  <Phone size={12} className="text-[var(--color-accent)] flex-shrink-0" />
                  <span className="font-bold tracking-wide">{phone}</span>
                </a>
              )} */}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
});