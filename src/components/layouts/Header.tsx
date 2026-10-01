'use client';

import { useState, useEffect, memo } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import {
  UtensilsCrossed,
  Phone,
  MapPin,
} from 'lucide-react';
import { isStoreOpen } from '@/data/storeInfo';
import { useStore } from '@/store/storeHooks';
import { SettingsMenu } from '@/components/common/SettingsMenu';

function formatTimeLocalized(time24: string, locale: string): string {
  const [h, m] = time24.split(':').map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);

  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: locale !== 'ar',
  };
  return new Intl.DateTimeFormat(locale, options).format(date);
}

export const Header = memo(function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const { storeInfo, header, identity, displayBusinessName } = useStore();

  const [open, setOpen] = useState(() => isStoreOpen(storeInfo));
  const [todayHours, setTodayHours] = useState<{ open: string; close: string } | null>(() => {
    const today = new Date().getDay();
    return storeInfo.workingHours.find((wh) => wh.day === today) || null;
  });

  useEffect(() => {
    const updateStatus = () => {
      setOpen(isStoreOpen(storeInfo));
      const curToday = new Date().getDay();
      const curEntry = storeInfo.workingHours.find((wh) => wh.day === curToday);
      setTodayHours(curEntry || null);
    };

    const timer = setInterval(updateStatus, 60_000);
    return () => clearInterval(timer);
  }, [storeInfo]);

  const displayAddress = isRTL ? (storeInfo.addressAr || storeInfo.address) : storeInfo.address;
  const brandName = displayBusinessName || header?.businessName || identity?.businessName || storeInfo.name;
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

  return (
    <header
      className="
        relative isolate w-full overflow-hidden
        flex items-center justify-center
        rounded-b-[1.75rem] sm:rounded-b-[2.25rem]
        px-4 sm:px-6 lg:px-8
        pt-7 pb-5 sm:pt-9 sm:pb-6 lg:pt-10 lg:pb-7
      "
      style={{
        backgroundColor: 'var(--color-secondary)',
        minHeight: 'clamp(145px, 18vw, 195px)',
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
            fetchPriority="high"
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Scrim gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20 rtl:bg-gradient-to-l" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[var(--color-secondary)]/70" />
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
          flex items-center
        "
      >
        {/* Brand identity row: Logo + Name, Slogan & Essential Info */}
        <div className="flex items-center gap-3.5 sm:gap-5 min-w-0 flex-1">
          {/* Logo with minimal live presence status dot */}
          <div className="relative flex-shrink-0">
            <div
              className="
                flex items-center justify-center
                h-16 w-16 sm:h-20 sm:w-20 lg:h-22 lg:w-22
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

            {/* Smart presence indicator dot */}
            <div
              className="absolute -bottom-1 -end-1 z-10 pointer-events-auto"
              title={
                todayHours
                  ? open
                    ? `${t('storeInfo.open')} - ${t('storeInfo.todayFromTo', {
                        from: formatTimeLocalized(todayHours.open, locale),
                        to: formatTimeLocalized(todayHours.close, locale),
                      })}`
                    : `${t('storeInfo.closed')} - ${t('storeInfo.todayClosed')}`
                  : open
                  ? t('storeInfo.open')
                  : t('storeInfo.closed')
              }
            >
              <span className="relative flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-black/60 backdrop-blur-md ring-2 ring-white/30 shadow-md">
                <span
                  className={`animate-ping absolute inline-flex h-2 w-2 rounded-full opacity-75 ${
                    open ? 'bg-emerald-400' : 'bg-rose-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    open ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />
              </span>
            </div>
          </div>

          {/* Name & Slogan Column with Address & Phone */}
          <div className="flex flex-col justify-center min-w-0 flex-1">
            <h1
              className="
                text-xl sm:text-2xl lg:text-3xl
                font-extrabold tracking-tight leading-tight
                text-white
                drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]
                truncate
              "
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {brandName}
            </h1>

            {slogan && (
              <p
                className="
                  mt-0.5
                  text-xs sm:text-sm
                  font-medium
                  text-white/85
                  drop-shadow-[0_1px_4px_rgba(0,0,0,0.55)]
                  line-clamp-1
                "
              >
                {slogan}
              </p>
            )}

            {/* Essential Contact Meta: Address & Phone */}
            {(displayAddress || storeInfo.phone) && (
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] sm:text-xs text-white/85 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                {displayAddress && (
                  storeInfo.mapUrl ? (
                    <a
                      href={storeInfo.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                      title={displayAddress}
                    >
                      <MapPin size={12} className="text-[var(--color-accent)] flex-shrink-0" />
                      <span className="truncate max-w-[170px] sm:max-w-xs">{displayAddress}</span>
                    </a>
                  ) : (
                    <div className="inline-flex items-center gap-1" title={displayAddress}>
                      <MapPin size={12} className="text-[var(--color-accent)] flex-shrink-0" />
                      <span className="truncate max-w-[170px] sm:max-w-xs">{displayAddress}</span>
                    </div>
                  )
                )}

                {displayAddress && storeInfo.phone && (
                  <span className="inline-block w-1 h-1 rounded-full bg-white/40 flex-shrink-0" />
                )}

                {storeInfo.phone && (
                  <a
                    href={`tel:${storeInfo.phone}`}
                    className="inline-flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                    dir="ltr"
                    title={storeInfo.phone}
                  >
                    <Phone size={12} className="text-[var(--color-accent)] flex-shrink-0" />
                    <span className="font-semibold tracking-wide">{storeInfo.phone}</span>
                  </a>
                )}
              </div>
            )}

            {/* Decorative accent line */}
            <div className="mt-1.5 h-[2px] w-12 sm:w-16 rounded-full bg-gradient-to-r from-[var(--color-accent)] to-transparent shadow-sm" />
          </div>
        </div>
      </div>

      {/* Shimmer */}
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
});
