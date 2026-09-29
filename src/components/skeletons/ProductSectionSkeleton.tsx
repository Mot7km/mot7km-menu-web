import { LayoutGrid, LayoutList } from 'lucide-react';
import { Skeleton } from './SkeletonBase';
import { GridProductCardSkeleton, HorizontalProductCardSkeleton } from './ProductCardSkeleton';

interface ProductSectionSkeletonProps {
  count?: number;
  layout?: 'grid' | 'horizontal';
}

export function ProductSectionSkeleton({
  count = 8,
  layout = 'grid',
}: ProductSectionSkeletonProps) {
  return (
    <section className="flex flex-col gap-6 w-full max-w-7xl mx-auto px-4 sm:px-6" aria-busy="true">
      {/* Header – Title + Count Badge + Toggle Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-6 rounded-full bg-[var(--color-primary)]/40" />
          <Skeleton className="h-7 sm:h-8 w-40 sm:w-48 rounded-lg" />
        </div>

        <div className="flex items-center gap-3 justify-end">
          {/* Badge count skeleton */}
          <div className="h-6 w-16 sm:w-20 rounded-full bg-[var(--color-surface-subtle)] border border-[var(--color-border)]/60 flex items-center justify-center">
            <div className="h-2.5 w-10 sm:w-12 rounded-full bg-[var(--color-border)]/50" />
          </div>

          {/* Layout Toggle Buttons Skeleton */}
          <div className="flex items-center rounded-full p-0.5 border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
            <div className="p-1.5 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)]/60">
              <LayoutGrid size={18} />
            </div>
            <div className="p-1.5 rounded-full text-[var(--color-text-muted)]/30">
              <LayoutList size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid Skeleton */}
      <div
        className={`grid gap-4 justify-items-center ${
          layout === 'grid'
            ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            : 'grid-cols-1'
        }`}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="w-full">
            {layout === 'grid' ? (
              <GridProductCardSkeleton />
            ) : (
              <HorizontalProductCardSkeleton />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
