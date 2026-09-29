'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { LayoutGrid, LayoutList, PackageOpen } from 'lucide-react';
import { Product } from '@/data/menu';
import { GridProductCard } from '@/components/features/ProductCards/GridProductCard';
import { HorizontalProductCard } from '@/components/features/ProductCards/HorizontalProductCard';
import { ViewMoreButton, ThatsIt } from '@/components/ui/ViewMore';
import { Loader } from '@/components/ui/Loader';

interface ProductSectionProps {
  title?: string;
  products: Product[];
  initialCount?: number;
  loadMoreCount?: number;
  showCount?: boolean;
  loading?: boolean;
}

function ProductCardSkeleton() {
  return (
    <div className="group relative flex flex-col w-full h-full bg-[var(--color-surface)] rounded-2xl sm:rounded-3xl border border-[var(--color-border)]/80 overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
      {/* 1. Hero Image Skeleton */}
      <div
        className="relative w-full overflow-hidden bg-[var(--color-surface-subtle)] flex-shrink-0 animate-pulse"
        style={{ aspectRatio: '4 / 3.4' }}
      >
        {/* Badge skeletons */}
        <div className="absolute top-2.5 start-2.5 flex items-center gap-1.5">
          <div className="h-4.5 w-16 rounded-full bg-[var(--color-border)]/40" />
        </div>
        <div className="absolute top-2.5 end-2.5">
          <div className="h-4.5 w-10 rounded-full bg-[var(--color-border)]/40" />
        </div>
      </div>

      {/* 2. Content Zone */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-4.5 justify-between gap-3">
        <div className="flex flex-col gap-2">
          {/* Title */}
          <div className="h-4.5 bg-[var(--color-surface-subtle)] rounded-md w-4/5 animate-pulse" />
          {/* Description */}
          <div className="h-3 bg-[var(--color-surface-subtle)] rounded-md w-full animate-pulse" />
          <div className="h-3 bg-[var(--color-surface-subtle)] rounded-md w-2/3 animate-pulse" />
        </div>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between pt-1 border-t border-[var(--color-border)]/30">
          <div className="h-5.5 w-16 bg-[var(--color-surface-subtle)] rounded-lg animate-pulse" />
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-[var(--color-surface-subtle)] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function ProductSection({
  title,
  products,
  initialCount = 4,
  loadMoreCount = 4,
  showCount = true,
  loading = false,
}: ProductSectionProps) {
  const t = useTranslations();
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const [layout, setLayout] = useState<'grid' | 'horizontal'>('grid');
  const hasMore = visibleCount < products.length;
  const visibleItems = products.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(initialCount);
  }, [products, initialCount]);

  const sectionTitle = title || t('productList.menu');

  if (loading) {
    return (
      <section className="flex flex-col gap-6 w-full max-w-7xl mx-auto px-4 sm:px-6" aria-busy="true">
        <div className="flex items-center justify-between">
          <div className="h-7 w-36 bg-[var(--color-surface-subtle)] rounded-lg animate-pulse" />
          <div className="h-6 w-20 bg-[var(--color-surface-subtle)] rounded-full animate-pulse" />
        </div>
        <div className="grid gap-4 justify-items-center grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  const handleLoadMore = () => {
    setVisibleCount(Math.min(visibleCount + loadMoreCount, products.length));
  };

  // Empty state
  if (!products.length) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col gap-6">
          <h2
            className="accent-line font-bold text-2xl leading-8 text-[var(--color-text-primary)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {sectionTitle}
          </h2>

          <div
            role="status"
            aria-live="polite"
            className="relative overflow-hidden rounded-3xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-14 text-center shadow-sm"
          >
            {/* Soft decorative gradient */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--color-primary)]/5 via-transparent to-transparent" />

            <div className="relative">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/20">
                <PackageOpen className="h-8 w-8" aria-hidden="true" />
              </div>

              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                {t('productList.empty') || 'No products available'}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-text-muted)]">
                {t('productList.emptyDescription') ||
                  'Try adjusting your filters or check back later.'}
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-muted)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
                {t('productList.emptyHint') || 'New items are added regularly'}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6 w-full max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header – title + controls on same row on large screens */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
        <h2
          className="accent-line font-bold text-2xl leading-8 text-[var(--color-text-primary)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {sectionTitle}
        </h2>

        {/* Controls (count + toggle) – aligned right on mobile, inline on large */}
        <div className="flex items-center gap-3 justify-end">
          {showCount && (
            <span className="badge-count">
              {t('productList.countOf', { count: visibleItems.length, total: products.length })}
            </span>
          )}

          {/* Layout Toggle */}
          <div className="flex items-center rounded-full p-0.5 border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
            <button
              onClick={() => setLayout('grid')}
              className={`p-1.5 rounded-full transition-transform duration-200 cursor-pointer ${
                layout === 'grid'
                  ? 'bg-[var(--color-primary)] text-[var(--color-text-on-primary)] shadow-[var(--shadow-glow)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10'
              }`}
              aria-label="Grid view"
              title="Grid view"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setLayout('horizontal')}
              className={`p-1.5 rounded-full transition-transform duration-200 cursor-pointer ${
                layout === 'horizontal'
                  ? 'bg-[var(--color-primary)] text-[var(--color-text-on-primary)] shadow-[var(--shadow-glow)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10'
              }`}
              aria-label="Horizontal list view"
              title="Horizontal list view"
            >
              <LayoutList size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div
        className={`grid gap-4 justify-items-center ${
          layout === 'grid'
            ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            : 'grid-cols-1'
        }`}
      >
        {visibleItems.map((product, index) => (
          <div
            key={product.id}
            className="w-full animate-fade-in"
          >
            {layout === 'grid' ? (
              <GridProductCard product={product} priority={index < 2} />
            ) : (
              <HorizontalProductCard product={product} priority={index < 2} />
            )}
          </div>
        ))}
      </div>

      {/* View More / ThatsIt */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <ViewMoreButton
          onClick={handleLoadMore}
          hasMore={hasMore}
          label={t('productList.viewMore')}
          variant={0}
        />
        {!hasMore && products.length > 0 && <ThatsIt />}
      </div>
    </section>
  );
}