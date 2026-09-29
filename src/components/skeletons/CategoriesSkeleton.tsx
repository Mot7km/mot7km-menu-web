import { Search, LayoutGrid } from 'lucide-react';
import { Skeleton } from './SkeletonBase';

export function CategoriesSkeleton() {
  return (
    <div
      className="sticky top-0 z-30 bg-[var(--color-background)]/90 backdrop-blur-xl border-b border-[var(--color-border)]/50 pb-1 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 mb-6"
      style={{ minHeight: '142px' }}
      aria-busy="true"
    >
      {/* Search Bar Skeleton */}
      <div className="w-full py-1">
        <div className="mx-auto max-w-4xl">
          <div className="relative rounded-full bg-[var(--color-surface-subtle)] border border-[var(--color-border)] h-12 sm:h-13 w-full flex items-center px-4 gap-3 shadow-sm skeleton-shimmer">
            <Search className="w-5 h-5 text-[var(--color-primary)]/40 flex-shrink-0" />
            <div className="h-4 w-44 sm:w-60 rounded-md bg-[var(--color-border)]/40" />
          </div>
        </div>
      </div>

      {/* Category Avatars Row Skeleton */}
      <div className="flex w-full justify-center pb-2 min-h-[82px] items-center">
        <div className="relative flex justify-center items-center gap-5 sm:gap-6 md:gap-7 py-3 overflow-hidden w-full max-w-full">
          {/* 1st Category: Active "All" representation */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full scale-105 flex items-center justify-center bg-[var(--color-surface-subtle)] shadow-[var(--shadow-glow)]">
              {/* Active gradient border simulation */}
              <div
                className="absolute -inset-[2.5px] rounded-full pointer-events-none opacity-80"
                style={{
                  background: 'var(--gradient-primary)',
                  padding: '2px',
                  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  maskComposite: 'exclude',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                }}
              />
              <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-primary)]/40" />
            </div>
            <div className="w-10 sm:w-12 h-3 rounded-full bg-[var(--color-primary)]/30 animate-pulse" />
          </div>

          {/* Other Categories */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 shrink-0">
              {/* Circular Avatar Skeleton */}
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-[var(--color-surface-subtle)] border border-[var(--color-border)]/70 flex items-center justify-center shadow-sm skeleton-shimmer">
                <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-text-muted)]/20" />
              </div>
              {/* Text Label Skeleton */}
              <Skeleton className="w-12 sm:w-14 h-2.5 sm:h-3 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
