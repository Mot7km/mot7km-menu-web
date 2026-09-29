'use client';

import { useState, useRef, useEffect, memo } from 'react';
import Image from 'next/image';
import { Link } from 'next-view-transitions';
import { Star, ShoppingBag, Check, SlidersHorizontal, Sparkles, UtensilsCrossed } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Product } from '@/data/menu';
import { useBusinessRoute } from '@/hooks/useLocale';
import { useCart } from '@/store/hooks';
import { getHeroTransitionName } from '@/helpers/transitionHelper';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const GridProductCard = memo(function GridProductCard({ product, priority = false }: ProductCardProps) {
  const t = useTranslations();
  const { getPath } = useBusinessRoute();
  const href = getPath(product.id);
  const { addToCart } = useCart();

  const [justAdded, setJustAdded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const hasOptions = Boolean(product.customizationOptions && product.customizationOptions.length > 0);
  const reviewCount = product.reviews?.length || 0;
  const ratingNum = parseFloat(product.rating || '0');
  const hasRating = !isNaN(ratingNum) && ratingNum > 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (justAdded) return;

    addToCart(product, {}, 1);
    setJustAdded(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setJustAdded(false);
    }, 1400);
  };

  const hasValidDescription = Boolean(
    product.description &&
    product.description.trim() !== '.' &&
    product.description.trim().length > 1
  );

  return (
    <article
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

      {/* ── Stretched Link covering the entire card ── */}
      <Link
        href={href}
        className="absolute inset-0 z-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-2xl sm:rounded-3xl"
        style={{ touchAction: 'manipulation' }}
        aria-label={product.name}
      />

      {/* ── 1. Hero Image Container with Floating Badges ── */}
      <div
        className="relative w-full aspect-[4/3.4] sm:aspect-square overflow-hidden bg-[var(--color-surface-subtle)] flex-shrink-0 pointer-events-none"
        style={{ aspectRatio: '4 / 3.4' }}
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority={priority}
            fetchPriority={priority ? 'high' : undefined}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            style={{
              viewTransitionName: getHeroTransitionName(product.id),
            } as React.CSSProperties}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--color-surface-subtle)] to-[var(--color-border)]/20">
            <UtensilsCrossed className="w-10 h-10 text-[var(--color-text-muted)]/40" />
          </div>
        )}

        {/* Cinematic gradient overlay at base of image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/20 opacity-60 group-hover:opacity-75 transition-opacity duration-300 pointer-events-none" />

        {/* ── Overlaid Badge: Top Start (Featured or Category) ── */}
        <div className="absolute top-2.5 start-2.5 z-10 flex items-center gap-1.5 pointer-events-none max-w-[65%]">
          {product.featured ? (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wide uppercase text-white shadow-md backdrop-blur-md"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <Sparkles size={11} className="fill-white flex-shrink-0" />
              <span className="truncate">{t('home.bestSeller') || 'Special'}</span>
            </span>
          ) : product.category ? (
            <span className="inline-flex items-center px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold tracking-wider uppercase backdrop-blur-md bg-black/45 text-white/95 border border-white/20 shadow-sm truncate">
              {product.category}
            </span>
          ) : null}
        </div>

        {/* ── Overlaid Badge: Top End (Star Rating) ── */}
        {hasRating && (
          <div className="absolute top-2.5 end-2.5 z-10 pointer-events-none">
            <div
              className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold backdrop-blur-md bg-black/45 text-white border border-white/20 shadow-sm"
              aria-label={t('productCard.ratingOutOfFive', { rating: product.rating })}
            >
              <Star size={11} className="text-amber-400 fill-amber-400 flex-shrink-0" />
              <span>{product.rating}</span>
              {reviewCount > 0 && (
                <span className="text-[9px] text-white/70 font-normal hidden sm:inline">
                  ({reviewCount})
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── 2. Content Zone ── */}
      <div className="flex flex-col flex-1 p-3 sm:p-4 justify-between gap-2 pointer-events-none">
        <div className="flex flex-col gap-1 sm:gap-1.5">
          {/* Secondary tag if both featured and category exist */}
          {product.featured && product.category && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-semibold tracking-wide uppercase bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/15 w-fit truncate max-w-[120px]">
              {product.category}
            </span>
          )}

          {/* Product Name */}
          <h3
            className="font-bold text-xs sm:text-sm md:text-[1.05rem] leading-snug text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors duration-200 line-clamp-1 sm:line-clamp-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {product.name}
          </h3>

          {/* Product Description */}
          {hasValidDescription && (
            <p className="text-[11px] sm:text-xs text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed font-normal mt-0.5">
              {product.description}
            </p>
          )}
        </div>

        {/* ── 3. Footer Bar: Price & Action Trigger ── */}
        <div className="mt-auto pt-2.5 sm:pt-3 flex items-center justify-between border-t border-[var(--color-border)]/60 dark:border-white/[0.06] gap-2">
          {/* Price Stack */}
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              {t('productCard.price')}
            </span>
            <span className="font-extrabold text-xs sm:text-base md:text-lg text-[var(--color-text-primary)] tracking-tight truncate">
              {product.price}
            </span>
          </div>

          {/* Action Trigger Button */}
          <div className="relative z-10 flex-shrink-0 pointer-events-auto">
            {hasOptions ? (
              <Link
                href={href}
                prefetch={false}
                className="inline-flex items-center justify-center gap-1.5
                  w-9 h-9 sm:w-auto min-h-[36px] sm:min-h-[38px] px-0 sm:px-3.5 py-1.5 rounded-full
                  text-xs sm:text-sm font-bold
                  bg-[var(--color-primary)]/10 text-[var(--color-primary)]
                  border border-[var(--color-primary)]/20
                  hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)]
                  hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)]
                  active:scale-95 transition-all duration-200 ease-out
                  cursor-pointer shadow-sm"
                aria-label={t('productCard.customizeSpecific', { name: product.name })}
                title={t('productCard.customize')}
              >
                <SlidersHorizontal size={15} className="sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="hidden sm:inline">{t('productCard.customize')}</span>
              </Link>
            ) : (
              <button
                onClick={handleQuickAdd}
                type="button"
                className={`inline-flex items-center justify-center gap-1.5
                  w-9 h-9 sm:w-auto min-h-[36px] sm:min-h-[38px] px-0 sm:px-3.5 py-1.5 rounded-full
                  text-xs sm:text-sm font-bold
                  transition-all duration-200 ease-out cursor-pointer active:scale-95 shadow-sm
                  ${
                    justAdded
                      ? 'bg-emerald-600 text-white border border-emerald-600 scale-105 shadow-md'
                      : 'bg-[var(--color-primary)] text-white hover:brightness-105 hover:shadow-[0_6px_20px_rgba(0,0,0,0.18)] active:scale-95'
                  }`}
                aria-label={t('productCard.addToCartSpecific', { name: product.name })}
                title={t('productCard.addToCart')}
              >
                {justAdded ? (
                  <>
                    <Check size={16} className="animate-scale-in flex-shrink-0" strokeWidth={2.5} />
                    <span className="hidden sm:inline">{t('productCard.added')}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={15} className="flex-shrink-0" />
                    <span className="hidden sm:inline">{t('productCard.addToCart')}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
});