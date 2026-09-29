'use client';

import { useState, useRef, useEffect, memo } from 'react';
import Image from 'next/image';
import { Link } from 'next-view-transitions';
import { Star, ShoppingBag, Check, SlidersHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Product } from '@/data/menu';
import { useBusinessRoute } from '@/hooks/useLocale';
import { useCart } from '@/store/hooks';
import { getHeroTransitionName } from '@/helpers/transitionHelper';

interface HorizontalProductCardProps {
  product: Product;
  priority?: boolean;
}

export const HorizontalProductCard = memo(function HorizontalProductCard({ product, priority = false }: HorizontalProductCardProps) {
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

    if (justAdded) return;

    addToCart(product, {}, 1);
    setJustAdded(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setJustAdded(false);
    }, 1200);
  };

  return (
    <article
      className="group relative flex flex-row items-stretch w-full min-h-[140px] sm:min-h-[160px] md:min-h-[175px]
        bg-[var(--color-surface)] rounded-2xl
        border border-[var(--color-border)]
        hover:border-[var(--color-primary)]/40
        p-3 sm:p-4 gap-3.5 sm:gap-4.5
        shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]
        hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.08)]
        hover:-translate-y-0.5
        transition-[transform,box-shadow] duration-300 ease-out
        overflow-hidden"
    >
      {/* ── Full Card Clickable Overlay ── */}
      <Link
        href={href}
        className="absolute inset-0 z-0"
        style={{ touchAction: 'manipulation' }}
        aria-label={product.name}
        tabIndex={-1}
      />

      {/* ── 1. Hero Left Image Frame ── */}
      <div
        className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 flex-shrink-0 rounded-xl overflow-hidden bg-[var(--color-surface-subtle)] z-10 pointer-events-none"
        style={{ aspectRatio: '1 / 1' }}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority={priority}
          fetchPriority={priority ? 'high' : undefined}
          sizes="(max-width: 640px) 112px, (max-width: 768px) 144px, 160px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          style={{
            viewTransitionName: getHeroTransitionName(product.id),
          } as React.CSSProperties}
        />
      </div>

      {/* ── 2. Information Column ── */}
      <div className="flex flex-col justify-between flex-1 min-w-0 z-10 pointer-events-none">
        {/* Top: Product Title, Description, and Tags */}
        <div>
          <h3
            className="font-bold text-sm sm:text-base md:text-lg leading-snug text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {product.name}
          </h3>

          {product.description && (
            <p className="mt-1 text-xs sm:text-sm text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Meta Line: Category & Star Rating */}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {product.category && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold tracking-wide uppercase bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/15 truncate max-w-[140px]">
                {product.category}
              </span>
            )}

            {hasRating && (
              <div
                className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-[var(--color-text-secondary)]"
                aria-label={t('productCard.ratingOutOfFive', { rating: product.rating })}
              >
                <Star size={12} className="text-amber-400 fill-amber-400 flex-shrink-0" />
                <span>{product.rating}</span>
                {reviewCount > 0 && (
                  <span className="text-[10px] text-[var(--color-text-muted)] font-normal">
                    ({reviewCount})
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── 3. Footer Bar: Price & Action Pill Button ── */}
        <div className="mt-2.5 pt-2 sm:pt-2.5 flex items-center justify-between gap-2 border-t border-[var(--color-border)]/50">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
              {t('productCard.price')}
            </span>
            <span className="font-extrabold text-sm sm:text-base md:text-lg text-[var(--color-text-primary)] truncate">
              {product.price}
            </span>
          </div>

          {/* Action Button */}
          {hasOptions ? (
            <Link
              href={href}
              prefetch={false}
              className="pointer-events-auto min-h-[36px] sm:min-h-[38px] px-3 sm:px-3.5 py-1.5 rounded-full
                inline-flex items-center justify-center gap-1.5
                text-xs sm:text-sm font-bold
                bg-[var(--color-primary)]/10 text-[var(--color-primary)]
                border border-[var(--color-primary)]/20
                hover:bg-[var(--color-primary)] hover:text-white
                hover:border-[var(--color-primary)]
                active:scale-95 transition-all duration-200 ease-out
                cursor-pointer shadow-sm"
              aria-label={t('productCard.customizeSpecific', { name: product.name })}
              title={t('productCard.customize')}
            >
              <SlidersHorizontal size={14} />
              <span>{t('productCard.customize')}</span>
            </Link>
          ) : (
            <button
              onClick={handleQuickAdd}
              type="button"
              className={`pointer-events-auto min-h-[36px] sm:min-h-[38px] px-3 sm:px-3.5 py-1.5 rounded-full
                inline-flex items-center justify-center gap-1.5
                text-xs sm:text-sm font-bold
                transition-all duration-200 ease-out cursor-pointer active:scale-95 shadow-sm
                ${
                  justAdded
                    ? 'bg-emerald-500 text-white border border-emerald-500 scale-105'
                    : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)]'
                }`}
              aria-label={t('productCard.addToCartSpecific', { name: product.name })}
              title={t('productCard.addToCart')}
            >
              {justAdded ? (
                <>
                  <Check size={14} className="animate-scale-in" strokeWidth={2.5} />
                  <span>{t('productCard.added')}</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={14} />
                  <span>{t('productCard.addToCart')}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
});