'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { MapPin, Phone, UtensilsCrossed, ArrowRight, ArrowLeft, Store } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { parseThemePalettes, withAlpha } from '@/config/theme';
import { loadGoogleFont } from '@/helpers/fontLoader';
import { useGetBusinessInfosQuery } from '@/store/menuApi';

// TikTok Icon Helper
function TikTokIcon({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.45v13.67a2.892 2.892 0 0 1-5.201 1.745l-.002-.005a2.895 2.895 0 0 1 2.751-3.91c.298 0 .59.044.867.13V10.1a6.34 6.34 0 0 0-.867-.063A6.344 6.344 0 0 0 3.25 16.38a6.344 6.344 0 0 0 10.84 4.485 6.345 6.345 0 0 0 1.84-4.485V8.59a8.196 8.196 0 0 0 4.75 1.513V6.65a4.793 4.793 0 0 1-1.091.036z" />
    </svg>
  );
}

// Facebook Icon Helper
function FacebookIcon({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

// Instagram Icon Helper
function InstagramIcon({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.555.556.9 1.112 1.153 1.772.248.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.88 4.88 0 0 1-1.153 1.772c-.556.555-1.112.9-1.772 1.153-.637.248-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.065.218-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772c.556-.555 1.112-.9 1.772-1.153.637-.248 1.363-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
    </svg>
  );
}

export function LandingFeaturedMenus() {
  const t = useTranslations('landing.featuredMenus');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === 'dark' : false;

  const [pageNumber, setPageNumber] = useState<number>(1);
  const pageSize = 12;

  // Real API paginated business info endpoint: GET /api/menu/infos?pageNumber=&pageSize=
  const { data: apiData, isLoading } = useGetBusinessInfosQuery({
    pageNumber,
    pageSize,
  });

  const businesses = apiData?.items || [];

  // Preload any custom Google Fonts returned for the businesses
  useEffect(() => {
    if (!businesses.length) return;
    businesses.forEach((item) => {
      const typo = item.businessIdentity?.typography;
      if (typo?.arabicFont) loadGoogleFont(typo.arabicFont);
      if (typo?.englishFont) loadGoogleFont(typo.englishFont);
    });
  }, [businesses]);

  return (
    <section id="clients" className="relative py-16 sm:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[var(--color-primary)]">
            {t('sectionTag')}
          </span>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-4xl md:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed">
            {t('description')}
          </p>
        </div>

        {/* Loading Skeletons */}
        {isLoading && !apiData ? (
          <div className="mt-12 sm:mt-16 grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="flex flex-col w-full h-96 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden animate-pulse shadow-sm"
              >
                <div className="relative w-full aspect-[4/2.2] bg-[var(--color-surface-subtle)]" />
                <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <div className="h-6 w-3/4 bg-[var(--color-surface-subtle)] rounded-md" />
                    <div className="h-4 w-full bg-[var(--color-surface-subtle)] rounded-md" />
                  </div>
                  <div className="h-10 w-full bg-[var(--color-surface-subtle)] rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : businesses.length === 0 ? (
          /* Empty State when no businesses found */
          <div className="mt-12 sm:mt-16 flex flex-col items-center justify-center rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] mb-4">
              <Store className="h-8 w-8 text-[var(--color-primary)]" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)]">
              {t('emptyTitle')}
            </h3>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)] max-w-md">
              {t('emptyDescription')}
            </p>
          </div>
        ) : (
          /* Businesses Cards Grid */
          <div className="mt-12 sm:mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {businesses.map((item) => {
              const menuUrl = `/${locale}/${encodeURIComponent(item.businessName)}`;
              const displayName = item.displayBusinessName || item.businessName;
              const description = item.businessDescription || '';

              // Resolve full semantic color palette using the central theme system
              const palettes = parseThemePalettes(item.businessIdentity?.colors);
              const palette = isDark ? palettes.dark : palettes.light;

              // Resolve custom typography with fallback font stacks
              const typography = item.businessIdentity?.typography;
              const requestedArabic = typography?.arabicFont?.trim();
              const requestedEnglish = typography?.englishFont?.trim();

              let arabicFont = 'Cairo';
              if (
                requestedArabic &&
                requestedArabic.toLowerCase() !== 'cairo' &&
                requestedArabic.toLowerCase() !== 'string'
              ) {
                arabicFont = requestedArabic;
              }

              let englishFont = 'Roboto';
              if (
                requestedEnglish &&
                requestedEnglish.toLowerCase() !== 'roboto' &&
                requestedEnglish.toLowerCase() !== 'string'
              ) {
                englishFont = requestedEnglish;
              }

              const customFontFamily = isRTL
                ? `"${arabicFont}", "Cairo", -apple-system, BlinkMacSystemFont, sans-serif`
                : `"${englishFont}", "Roboto", -apple-system, BlinkMacSystemFont, sans-serif`;

              // Cover and logo from header or identity fallbacks
              const cover =
                item.header?.backGroundImage ||
                item.header?.coverUrl ||
                'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80';
              const logo =
                item.header?.logo ||
                item.header?.logoUrl ||
                item.businessIdentity?.logo ||
                'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&auto=format&fit=crop&q=80';

              // Location info from top-level or header address (branch info completely removed)
              const locationText =
                item.header?.addressDetails?.formattedAddress ||
                '';

              const phoneNumber = item.header?.phoneNumber;
              const socialLinks = item.header?.socialLinks || item.header?.socials;

              return (
                <article
                  key={item.businessName}
                  className="group relative flex flex-col w-full h-full rounded-3xl overflow-hidden
                    shadow-md hover:shadow-2xl hover:-translate-y-2
                    transition-all duration-300 ease-out cursor-pointer"
                  style={{
                    backgroundColor: palette.surface,
                    border: `1.5px solid ${palette.border}`,
                    fontFamily: customFontFamily,
                  }}
                >
                  {/* Full Card Clickable Stretched Link */}
                  <Link
                    href={menuUrl}
                    className="absolute inset-0 z-0 focus:outline-none focus-visible:ring-2 rounded-3xl"
                    style={{
                      touchAction: 'manipulation',
                      outlineColor: palette.primary,
                    }}
                    aria-label={displayName}
                  />

                  {/* 1. Hero Cover Image Area */}
                  <div className="relative w-full aspect-[4/2.2] overflow-hidden bg-gray-900 flex-shrink-0 pointer-events-none">
                    <Image
                      src={cover}
                      alt={displayName}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                    {/* Social Media Links (Interactive) */}
                    {socialLinks && (
                      <div className="absolute top-3 end-3 z-30 flex items-center gap-1.5 pointer-events-auto">
                        {socialLinks.instagram && (
                          <a
                            href={socialLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md transition-all shadow-sm hover:scale-110"
                            style={{
                              backgroundColor: withAlpha(palette.surface, 0.85),
                              color: palette.textPrimary,
                              border: `1px solid ${withAlpha(palette.border, 0.6)}`,
                            }}
                          >
                            <InstagramIcon size={13} />
                          </a>
                        )}
                        {socialLinks.facebook && (
                          <a
                            href={socialLinks.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                            className="flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md transition-all shadow-sm hover:scale-110"
                            style={{
                              backgroundColor: withAlpha(palette.surface, 0.85),
                              color: palette.textPrimary,
                              border: `1px solid ${withAlpha(palette.border, 0.6)}`,
                            }}
                          >
                            <FacebookIcon size={13} />
                          </a>
                        )}
                        {socialLinks.tiktok && (
                          <a
                            href={socialLinks.tiktok}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="TikTok"
                            className="flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md transition-all shadow-sm hover:scale-110"
                            style={{
                              backgroundColor: withAlpha(palette.surface, 0.85),
                              color: palette.textPrimary,
                              border: `1px solid ${withAlpha(palette.border, 0.6)}`,
                            }}
                          >
                            <TikTokIcon size={13} />
                          </a>
                        )}
                      </div>
                    )}

                    {/* Location Badge on cover */}
                    {locationText && (
                      <div
                        className="absolute bottom-3 end-4 z-20 pointer-events-none flex items-center gap-1.5 rounded-full backdrop-blur-md px-3 py-1 text-[11px] font-medium shadow-sm border"
                        style={{
                          backgroundColor: isDark ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0.65)',
                          borderColor: withAlpha(palette.border, 0.4),
                          color: '#FFFFFF',
                        }}
                      >
                        <MapPin size={12} style={{ color: palette.primary }} />
                        <span className="truncate max-w-[160px]">{locationText}</span>
                      </div>
                    )}
                  </div>

                  {/* 2. Content Zone */}
                  <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between gap-4 pointer-events-none">
                    <div className="flex flex-col gap-3">
                      {/* Logo and Business Name Row */}
                      <div className="flex items-center gap-3.5 -mt-10 relative z-20">
                        <div
                          className="relative h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0 overflow-hidden rounded-2xl shadow-lg border-2"
                          style={{
                            backgroundColor: palette.surface,
                            borderColor: palette.primary,
                            boxShadow: `0 4px 14px 0 ${withAlpha(palette.primary, 0.25)}`,
                          }}
                        >
                          <Image
                            src={logo}
                            alt={`${displayName} logo`}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex flex-col min-w-0 pt-2">
                          <h3
                            className="font-black text-lg sm:text-xl leading-snug tracking-tight truncate"
                            style={{ color: palette.textPrimary }}
                          >
                            {displayName}
                          </h3>
                        </div>
                      </div>

                      {/* Business Description */}
                      {description && (
                        <p
                          className="text-xs sm:text-sm line-clamp-2 leading-relaxed font-normal"
                          style={{ color: palette.textSecondary }}
                        >
                          {description}
                        </p>
                      )}

                      {/* Contact metadata row */}
                      {phoneNumber && (
                        <div
                          className="flex flex-wrap items-center gap-4 pt-1"
                          style={{ borderColor: palette.border }}
                        >
                          <div
                            className="flex items-center gap-1.5 text-xs font-medium"
                            style={{ color: palette.textSecondary }}
                          >
                            <Phone size={13} style={{ color: palette.primary }} />
                            <span className="font-mono">{phoneNumber}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 3. Footer Bar: Handle & Action Button */}
                    <div
                      className="mt-auto pt-4 flex items-center justify-between border-t gap-3"
                      style={{ borderColor: palette.border }}
                    >
                      {/* Handle Badge */}
                      <div className="flex flex-col min-w-0">
                        <span
                          className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider opacity-70"
                          style={{ color: palette.textSecondary }}
                        >
                          {t('menuHandle')}
                        </span>
                        <span
                          className="font-mono text-xs sm:text-sm font-black truncate"
                          style={{ color: palette.textPrimary }}
                        >
                          @{item.businessName}
                        </span>
                      </div>

                      {/* Action Button styled using the business's unique primary color */}
                      <div className="relative z-10 flex-shrink-0 pointer-events-auto">
                        <span
                          className="inline-flex items-center justify-center gap-2
                            min-h-[40px] px-4 sm:px-5 py-2 rounded-full
                            text-xs sm:text-sm font-bold shadow-md
                            active:scale-95 transition-all duration-200 ease-out cursor-pointer"
                          style={{
                            backgroundColor: palette.primary,
                            color: palette.onPrimary,
                            boxShadow: `0 4px 14px 0 ${withAlpha(palette.primary, 0.35)}`,
                          }}
                        >
                          <UtensilsCrossed size={14} className="flex-shrink-0" />
                          <span>{t('viewMenu')}</span>
                          <ArrowIcon size={14} />
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Pagination bar if totalPages > 1 */}
        {apiData && apiData.totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-3">
            <button
              onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
              disabled={!apiData.hasPreviousPage || pageNumber <= 1}
              className="rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:border-[var(--color-primary)] hover:enabled:text-[var(--color-primary)] transition-all duration-200 cursor-pointer shadow-sm"
            >
              {t('previousPage')}
            </button>
            <span className="text-xs sm:text-sm font-semibold text-[var(--color-text-secondary)] px-2">
              {t('pageOf', { current: apiData.pageNumber, total: apiData.totalPages })}
            </span>
            <button
              onClick={() => setPageNumber((p) => Math.min(apiData.totalPages, p + 1))}
              disabled={!apiData.hasNextPage || pageNumber >= apiData.totalPages}
              className="rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:border-[var(--color-primary)] hover:enabled:text-[var(--color-primary)] transition-all duration-200 cursor-pointer shadow-sm"
            >
              {t('nextPage')}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}