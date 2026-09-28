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
        bg-[var(--color-surface)] rounded-2xl sm:rounded-3xl
        border border-[var(--color-border)]
        hover:border-[var(--color-primary)]/40
        shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]
        hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.07)]
        hover:-translate-y-1
        transition-all duration-300 ease-out
        overflow-hidden"
    >
      {/* ── 1. Hero Image (Expanded square format for appetizing food display) ── */}
      <Link
        href={href}
        prefetch={false}
        className="group/img relative block w-full aspect-square overflow-hidden bg-[var(--color-surface-subtle)] flex-shrink-0 cursor-pointer"
        aria-label={product.name}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover/img:scale-105"
        />
      </Link>

      {/* ── 2. Content Zone ── */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-4 gap-2">
        {/* Upper Metadata: Category Pill & Star Rating */}
        <div className="flex items-center justify-between gap-2 min-h-[22px]">
          {product.category ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-wide uppercase bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/15 truncate max-w-[120px]">
              {product.category}
            </span>
          ) : (
            <span />
          )}

          {hasRating && (
            <div
              className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-[var(--color-text-secondary)]"
              aria-label={t('productCard.ratingOutOfFive', { rating: product.rating })}
            >
              <Star size={13} className="text-amber-400 fill-amber-400 flex-shrink-0" />
              <span>{product.rating}</span>
              {reviewCount > 0 && (
                <span className="text-[10px] text-[var(--color-text-muted)] font-normal">
                  ({reviewCount})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Product Name */}
        <Link href={href} prefetch={false} className="group/title block">
          <h3
            className="font-bold text-sm sm:text-base leading-snug text-[var(--color-text-primary)] group-hover/title:text-[var(--color-primary)] transition-colors line-clamp-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        {product.description && (
          <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* ── 3. Footer: Price & Apple-Grade Touch Target Action ── */}
        <div className="mt-auto pt-3 flex items-center justify-between gap-2 border-t border-[var(--color-border)]/60">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
              {t('productCard.price')}
            </span>
            <span className="font-extrabold text-sm sm:text-base md:text-lg text-[var(--color-text-primary)] truncate">
              {product.price}
            </span>
          </div>

          {/* Action Trigger */}
          {hasOptions ? (
            <Link
              href={href}
              prefetch={false}
              className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full
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
              <SlidersHorizontal size={17} />
            </Link>
          ) : (
            <button
              onClick={handleQuickAdd}
              type="button"
              className={`min-w-[44px] min-h-[44px] w-11 h-11 rounded-full
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
                <Check size={18} className="animate-scale-in" strokeWidth={2.5} />
              ) : (
                <ShoppingBag size={17} />
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}