import { ArrowLeft, Sparkles, UtensilsCrossed, Star } from 'lucide-react';
import { Skeleton } from './SkeletonBase';

export function ProductDetailsSkeleton() {
  const heroHeight = 45; // Matches product page hero height (45vh)

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[var(--color-background)]" aria-busy="true">
      {/* 1. Background Ambient Glow Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-primary)]/10 blur-[100px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--color-accent)]/10 blur-[80px] rounded-full pointer-events-none -z-10" />

      {/* 2. Hero Image Placeholder Skeleton */}
      <div className="fixed inset-x-0 top-0 h-[45vh] sm:h-[50vh] md:h-[55vh] xl:h-[60vh] z-0 overflow-hidden bg-[var(--color-surface-subtle)]">
        <div className="absolute inset-0 skeleton-shimmer opacity-40" />
        {/* Subtle decorative icon placeholder */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <UtensilsCrossed className="w-16 h-16 sm:w-24 sm:h-24 text-[var(--color-text-muted)]" />
        </div>
        {/* Gradient scrims to match real page */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/30 pointer-events-none" />
      </div>

      {/* 3. Floating Back Button Skeleton */}
      <div
        className="fixed top-6 left-4 sm:left-6 lg:left-8 z-50
          inline-flex items-center justify-center w-10 h-10 sm:w-32 sm:h-10 
          rounded-full glass-strong shadow-lg border border-white/20"
      >
        <ArrowLeft size={18} className="text-[var(--color-text-muted)] sm:mr-2 opacity-60" />
        <div className="hidden sm:block h-3.5 w-16 rounded-md bg-[var(--color-surface-subtle)] skeleton-shimmer" />
      </div>

      {/* 4. Sliding Content Sheet */}
      <div
        className="relative z-10 w-full bg-[var(--color-background)] rounded-t-[2rem] sm:rounded-t-[3rem] shadow-[0_-12px_40px_rgba(0,0,0,0.15)] pt-8 sm:pt-10 md:pt-12 pb-32 px-4 sm:px-6 lg:px-8"
        style={{
          marginTop: `calc(${heroHeight}vh - 2rem)`,
          minHeight: `calc(100vh - ${heroHeight}vh + 2rem)`,
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="card-premium p-6 sm:p-8 md:p-10 space-y-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl">
            {/* Header: Title, Category, Rating & Price */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-[200px]">
                  {/* Category Pill */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 w-fit">
                    <Sparkles size={12} className="text-[var(--color-primary)]/50" />
                    <Skeleton className="h-3 w-16 rounded-full" />
                  </div>

                  {/* Title */}
                  <Skeleton className="h-8 sm:h-11 w-4/5 rounded-xl" />

                  {/* Rating Badge Skeleton */}
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center bg-[var(--color-warning)]/10 px-2.5 py-1 rounded-full border border-[var(--color-warning)]/20">
                      <Star size={13} className="text-[var(--color-warning)]/50 mr-1.5" />
                      <Skeleton className="h-3 w-8 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Price Tag Skeleton */}
                <div className="flex-shrink-0">
                  <div className="px-6 py-3.5 bg-[var(--color-surface-subtle)]/70 rounded-2xl border border-[var(--color-border)] shadow-md flex items-center justify-center">
                    <Skeleton className="h-7 w-20 sm:w-24 rounded-lg" />
                  </div>
                </div>
              </div>

              {/* Description Paragraph */}
              <div className="space-y-2 pt-2 max-w-3xl">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-11/12 rounded" />
                <Skeleton className="h-4 w-2/3 rounded" />
              </div>
            </div>

            <div className="section-divider-premium" />

            {/* Ingredients Section Skeleton */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 rounded-full bg-[var(--color-primary)]/40" />
                <Skeleton className="h-5 sm:h-6 w-28 rounded-lg" />
              </div>
              <div className="flex flex-wrap gap-2.5">
                <Skeleton className="h-9 w-20 sm:w-24 rounded-full" />
                <Skeleton className="h-9 w-24 sm:w-28 rounded-full" />
                <Skeleton className="h-9 w-16 sm:w-20 rounded-full" />
                <Skeleton className="h-9 w-22 sm:w-26 rounded-full" />
                <Skeleton className="h-9 w-28 sm:w-32 rounded-full" />
              </div>
            </div>

            {/* Customization Options Skeleton */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 rounded-full bg-[var(--color-primary)]/40" />
                <Skeleton className="h-5 sm:h-6 w-36 rounded-lg" />
              </div>
              <div className="space-y-2.5">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="p-3.5 sm:p-4 rounded-2xl border border-[var(--color-border)]/70 bg-[var(--color-surface-subtle)]/30 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border border-[var(--color-border-strong)]/40 skeleton-shimmer" />
                      <Skeleton className="h-4 w-32 sm:w-44 rounded-md" />
                    </div>
                    <Skeleton className="h-4 w-12 sm:w-16 rounded-md" />
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section Skeleton */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-6 rounded-full bg-[var(--color-primary)]/40" />
                  <Skeleton className="h-5 sm:h-6 w-32 rounded-lg" />
                </div>
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>

              {/* Review Card Skeletons */}
              <div className="space-y-3">
                {[1, 2].map((review) => (
                  <div
                    key={review}
                    className="p-4 sm:p-5 rounded-2xl border border-[var(--color-border)]/70 bg-[var(--color-surface-subtle)]/20 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-[var(--color-surface-subtle)] skeleton-shimmer" />
                        <div className="space-y-1">
                          <Skeleton className="h-3.5 w-24 rounded" />
                          <Skeleton className="h-2.5 w-16 rounded" />
                        </div>
                      </div>
                      <Skeleton className="h-3.5 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-3.5 w-full rounded" />
                    <Skeleton className="h-3.5 w-3/4 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Fixed Sticky Bottom Add-To-Cart Bar Skeleton */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 
          bg-[var(--color-surface)]/80 backdrop-blur-xl 
          border-t border-[var(--color-border)]/60 
          p-4 sm:p-5 md:p-6 
          shadow-[0_-20px_60px_rgba(0,0,0,0.12)]"
      >
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3 md:gap-4">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-surface-subtle)]/70 skeleton-shimmer" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-3 w-12 rounded" />
              <Skeleton className="h-6 w-20 rounded-md" />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            {/* Quantity selector skeleton */}
            <div className="h-10 w-28 rounded-full bg-[var(--color-surface-subtle)]/50 border border-[var(--color-border)] skeleton-shimmer" />
            {/* Add to Cart button skeleton */}
            <div className="h-11 sm:h-12 w-36 sm:w-48 rounded-full bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30 skeleton-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}
