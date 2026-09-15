'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { LayoutGrid, LayoutList } from 'lucide-react';
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

  if (loading) {
    return (
      <div className="flex min-h-56 items-center justify-center" aria-live="polite">
        <Loader size="md" text="Loading products..." />
      </div>
    );
  }

  const handleLoadMore = () => {
    setVisibleCount(Math.min(visibleCount + loadMoreCount, products.length));
  };

  // Empty state
  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-[var(--color-text-muted)]">
        <p className="text-sm">{t('productList.empty') || 'No products available'}</p>
      </div>
    );
  }

  const sectionTitle = title || t('productList.menu');

  return (
    <section className="flex flex-col gap-6 w-full max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header – title + controls on same row on large screens */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
        <h2
          className="accent-line font-bold text-2xl leading-8 text-[var(--color-text-primary)]"
          style={{ fontFamily: 'var(--font-display), var(--font-inter), system-ui, sans-serif' }}
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
              className={`p-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                layout === 'grid'
                  ? 'bg-[var(--color-primary)] text-white shadow-[0_2px_8px_rgba(22,131,199,0.3)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10'
              }`}
              aria-label="Grid view"
              title="Grid view"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setLayout('horizontal')}
              className={`p-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                layout === 'horizontal'
                  ? 'bg-[var(--color-primary)] text-white shadow-[0_2px_8px_rgba(22,131,199,0.3)]'
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
            className="w-full animate-fade-in-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {layout === 'grid' ? (
              <GridProductCard product={product} />
            ) : (
              <HorizontalProductCard product={product} />
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