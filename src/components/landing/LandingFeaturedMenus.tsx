'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Star, MapPin, Sparkles, UtensilsCrossed, ArrowRight, ArrowLeft } from 'lucide-react';
import { FEATURED_BUSINESSES, FeaturedBusiness } from '@/data/featuredBusinesses';

interface LandingFeaturedMenusProps {
  businesses?: FeaturedBusiness[];
}

export function LandingFeaturedMenus({ businesses = FEATURED_BUSINESSES }: LandingFeaturedMenusProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: isRTL ? 'الكل' : 'All' },
    { id: 'كافيهات ومحامص', label: isRTL ? 'كافيهات ومحامص' : 'Cafes & Roasteries' },
    { id: 'برجر ومشاوي', label: isRTL ? 'برجر ومشاوي' : 'Burger & Grill' },
    { id: 'مطابخ عالمية', label: isRTL ? 'مطابخ عالمية' : 'International' },
    { id: 'مخبوزات وحلويات', label: isRTL ? 'مخبوزات وحلويات' : 'Bakery & Sweets' },
  ];

  const filteredBusinesses = businesses.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  return (
    <section id="clients" className="relative py-16 sm:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[var(--color-primary)]">
            {isRTL ? 'شركاء النجاح' : 'Featured Menus'}
          </span>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-4xl md:text-5xl">
            {isRTL ? 'مطاعم ومقاهٍ تثق بـ مُتـحكّـم' : 'Restaurants & Cafes Powered by MOT7KM'}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed">
            {isRTL
              ? 'تصفح نماذج حية لقوائم رقمية تم إطلاقها عبر منصتنا، واستمتع بتجربة التصفح والطلب السريع.'
              : 'Explore live showcase digital menus powered by our cloud system and experience real-time ordering.'}
          </p>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[var(--color-primary)] text-white shadow-md'
                    : 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-primary)]/40'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Businesses Cards Grid — Matched with real GridProductCard design */}
        <div className="mt-12 sm:mt-16 grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBusinesses.map((biz) => {
            const menuUrl = `/${locale}/menu/${encodeURIComponent(biz.businessName)}`;

            return (
              <article
                key={biz.businessName}
                className="group relative flex flex-col w-full h-full
                  bg-[var(--color-surface)] rounded-2xl sm:rounded-3xl
                  border border-[var(--color-border)]/80 dark:border-white/[0.08]
                  hover:border-[var(--color-primary)]/50 dark:hover:border-[var(--color-primary)]/60
                  shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]
                  hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.12),0_0_0_1px_rgba(var(--color-primary),0.12)]
                  dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.35)]
                  dark:hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6),0_0_0_1px_rgba(var(--color-primary),0.2)]
                  hover:-translate-y-1.5
                  transition-[transform,box-shadow] duration-300 ease-out
                  overflow-hidden cursor-pointer"
              >
                {/* ── Top edge ambient glow line on hover ── */}
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-[2.5px] z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'var(--gradient-primary)' }}
                />

                {/* ── Full Card Clickable Stretched Link ── */}
                <Link
                  href={menuUrl}
                  className="absolute inset-0 z-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-2xl sm:rounded-3xl"
                  style={{ touchAction: 'manipulation' }}
                  aria-label={biz.displayBusinessName}
                />

                {/* ── 1. Hero Cover Image Area with Badges ── */}
                <div className="relative w-full aspect-[4/2.6] sm:aspect-[4/2.5] overflow-hidden bg-[var(--color-surface-subtle)] flex-shrink-0 pointer-events-none">
                  <Image
                    src={biz.cover}
                    alt={biz.displayBusinessName}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover md:group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  {/* Cinematic gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent pointer-events-none" />

                  {/* Top Start: Badge */}
                  <div className="absolute top-2.5 start-2.5 z-10 flex items-center gap-1.5 pointer-events-none">
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wide uppercase text-white shadow-md backdrop-blur-md"
                      style={{ background: 'var(--gradient-primary)' }}
                    >
                      <Sparkles size={11} className="fill-white flex-shrink-0" />
                      <span>{biz.badge || (isRTL ? 'قائمة معتمدة' : 'Featured')}</span>
                    </span>
                  </div>

                  {/* Top End: Rating Badge */}
                  {biz.rating && (
                    <div className="absolute top-2.5 end-2.5 z-10 pointer-events-none">
                      <div className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold backdrop-blur-md bg-black/45 text-white border border-white/20 shadow-sm">
                        <Star size={11} className="text-amber-400 fill-amber-400 flex-shrink-0" />
                        <span>{biz.rating}</span>
                      </div>
                    </div>
                  )}

                  {/* Bottom End: Location Tag */}
                  {biz.location && (
                    <div className="absolute bottom-2.5 end-3 z-10 pointer-events-none flex items-center gap-1 rounded-full bg-black/45 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-medium text-white/90 border border-white/15">
                      <MapPin size={10} className="text-[var(--color-primary)]" />
                      <span>{biz.location}</span>
                    </div>
                  )}

                  {/* Floating Business Logo Overlapping Image Base */}
                  <div className="absolute -bottom-5 start-4 z-20 pointer-events-none">
                    <div className="relative h-12 w-12 sm:h-13 sm:w-13 overflow-hidden rounded-2xl border-2 border-[var(--color-surface)] bg-[var(--color-surface)] shadow-md">
                      <Image
                        src={biz.logo}
                        alt={`${biz.displayBusinessName} logo`}
                        fill
                        className="object-cover"
                        sizes="52px"
                      />
                    </div>
                  </div>
                </div>

                {/* ── 2. Content Zone ── */}
                <div className="flex flex-col flex-1 p-4 sm:p-5 pt-7 justify-between gap-3 pointer-events-none">
                  <div className="flex flex-col gap-1 sm:gap-1.5">
                    {/* Category Tag */}
                    {biz.category && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-semibold tracking-wide uppercase bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/15 w-fit">
                        {biz.category}
                      </span>
                    )}

                    {/* Business Name */}
                    <h3
                      className="font-bold text-sm sm:text-base md:text-lg leading-snug text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors duration-200 line-clamp-1"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {biz.displayBusinessName}
                    </h3>

                    {/* Business Description */}
                    <p className="text-[11px] sm:text-xs text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed font-normal mt-0.5">
                      {biz.businessDescription}
                    </p>
                  </div>

                  {/* ── 3. Footer Bar: Handle & Action Button ── */}
                  <div className="mt-auto pt-3 flex items-center justify-between border-t border-[var(--color-border)]/60 dark:border-white/[0.06] gap-2">
                    {/* Handle Stack */}
                    <div className="flex flex-col min-w-0">
                      <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                        {isRTL ? 'معرف المنيو' : 'Menu Handle'}
                      </span>
                      <span className="font-mono text-xs sm:text-sm font-bold text-[var(--color-text-primary)] truncate">
                        @{biz.businessName}
                      </span>
                    </div>

                    {/* Action Button */}
                    <div className="relative z-10 flex-shrink-0 pointer-events-auto">
                      <span
                        className="inline-flex items-center justify-center gap-1.5
                          min-h-[34px] sm:min-h-[36px] px-3.5 sm:px-4 py-1.5 rounded-full
                          text-xs sm:text-sm font-bold
                          bg-[var(--color-primary)] text-white
                          group-hover:brightness-105 group-hover:shadow-[0_6px_20px_rgba(0,0,0,0.18)]
                          active:scale-95 transition-all duration-200 ease-out
                          shadow-sm cursor-pointer"
                      >
                        <UtensilsCrossed size={13} className="flex-shrink-0" />
                        <span>{isRTL ? 'تصفح المنيو' : 'View Menu'}</span>
                        <ArrowIcon size={13} />
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom Explore All Menus Link */}
        <div className="mt-12 text-center">
          <Link
            href={`/${locale}/menu`}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3 text-sm font-bold text-[var(--color-text-primary)] shadow-sm hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-200"
          >
            <span>{isRTL ? 'عرض جميع القوائم المتاحة في النظام' : 'Browse All Menus on MOT7KM'}</span>
            <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
