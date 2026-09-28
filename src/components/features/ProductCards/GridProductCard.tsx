'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingBag, Check, SlidersHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Product } from '@/data/menu';
import { useBusinessRoute } from '@/hooks/useLocale';
import { useCart } from '@/store/hooks';

interface ProductCardProps {
  product: Product;
}

export function GridProductCard({ product }: ProductCardProps) {
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
    }, 1200);
  };

  return (
    <article
      className="group relative flex flex-col w-full h-full
        bg-[var(--color-surface)] rounded-xl sm:rounded-2xl
        border border-[var(--color-border)]
        hover:border-[var(--color-primary)]/40
        shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]
        hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.07)]
        hover:-translate-y-1
        transition-all duration-300 ease-out
        overflow-hidden cursor-pointer"
    >
      {/* ── Stretched Link covering the entire card ── */}
      <Link
        href={href}
        prefetch={false}
        className="absolute inset-0 z-0"
        aria-label={product.name}
      />

      {/* ── 1. Hero Image (~60% visual weight with square 1:1 format) ── */}
      <div className="relative block w-full aspect-square overflow-hidden bg-[var(--color-surface-subtle)] flex-shrink-0 pointer-events-none">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      {/* ── 2. Content Zone (~40% compact, structured proportion) ── */}
      <div className="flex flex-col flex-1 p-2.5 sm:p-3.5 justify-between gap-1.5 sm:gap-2 pointer-events-none">
        <div className="flex flex-col gap-1 sm:gap-1.5">
          {/* Product Name (First) */}
          <h3
            className="font-bold text-xs sm:text-sm md:text-base leading-snug text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-1 sm:line-clamp-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {product.name}
          </h3>

          {/* Metadata Row: Category Pill & Star Rating (Second) */}
          <div className="flex items-center justify-between gap-1.5 min-h-[18px] sm:min-h-[20px]">
            {product.category ? (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] md:text-[11px] font-semibold tracking-wide uppercase bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/15 truncate max-w-[85px] sm:max-w-[120px]">
                {product.category}
              </span>
            ) : (
              <span />
            )}

            {hasRating && (
              <div
                className="inline-flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-semibold text-[var(--color-text-secondary)]"
                aria-label={t('productCard.ratingOutOfFive', { rating: product.rating })}
              >
                <Star size={11} className="sm:w-3 sm:h-3 text-amber-400 fill-amber-400 flex-shrink-0" />
                <span>{product.rating}</span>
                {reviewCount > 0 && (
                  <span className="text-[9px] text-[var(--color-text-muted)] font-normal hidden sm:inline">
                    ({reviewCount})
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── 3. Footer: Price & Action Trigger ── */}
        <div className="mt-auto pt-1.5 sm:pt-2 flex items-center justify-between border-t border-[var(--color-border)]/50 gap-1">
          <div className="flex flex-col min-w-0">
            <span className="font-extrabold text-xs sm:text-base md:text-lg text-[var(--color-text-primary)] truncate">
              {product.price}
            </span>
          </div>

          {/* Action Trigger */}
          <div className="relative z-10 flex-shrink-0 pointer-events-auto">
            {hasOptions ? (
              <Link
                href={href}
                prefetch={false}
                className="w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 md:w-9 md:h-9 rounded-full
                  flex items-center justify-center
                  bg-[var(--color-primary)]/10 text-[var(--color-primary)]
                  border border-[var(--color-primary)]/20
                  hover:bg-[var(--color-primary)] hover:text-[var(--color-text-on-primary)]
                  hover:border-[var(--color-primary)]
                  active:scale-95 transition-all duration-200 ease-out
                  cursor-pointer"
                aria-label={t('productCard.customizeSpecific', { name: product.name })}
                title={t('productCard.customize')}
              >
                <SlidersHorizontal size={14} className="sm:w-4 sm:h-4" />
              </Link>
            ) : (
              <button
                onClick={handleQuickAdd}
                type="button"
                className={`w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 md:w-9 md:h-9 rounded-full
                  flex items-center justify-center
                  transition-all duration-200 ease-out cursor-pointer active:scale-90
                  ${
                    justAdded
                      ? 'bg-emerald-500 text-white border border-emerald-500 shadow-sm scale-105'
                      : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 hover:bg-[var(--color-primary)] hover:text-[var(--color-text-on-primary)] hover:border-[var(--color-primary)]'
                  }`}
                aria-label={t('productCard.addToCartSpecific', { name: product.name })}
                title={t('productCard.addToCart')}
              >
                {justAdded ? (
                  <Check size={14} className="sm:w-4 sm:h-4 animate-scale-in" strokeWidth={2.5} />
                ) : (
                  <ShoppingBag size={14} className="sm:w-4 sm:h-4" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}