import { Star, Sparkles, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import { Skeleton } from './SkeletonBase';

export function GridProductCardSkeleton() {
  return (
    <article
      className="group relative flex flex-col w-full h-full bg-[var(--color-surface)] rounded-2xl sm:rounded-3xl border border-[var(--color-border)]/80 dark:border-white/[0.08] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden"
      aria-busy="true"
    >
      {/* ── Top edge subtle glow ── */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-primary)]/20 to-transparent pointer-events-none" />

      {/* ── 1. Hero Image Container Skeleton ── */}
      <div
        className="relative w-full overflow-hidden bg-[var(--color-surface-subtle)]/70 flex items-center justify-center flex-shrink-0 skeleton-shimmer"
        style={{ aspectRatio: '4 / 3.4' }}
      >
        {/* Placeholder dish icon */}
        <UtensilsCrossed className="w-10 h-10 text-[var(--color-text-muted)]/20" />

        {/* Floating Badges */}
        <div className="absolute top-2.5 start-2.5 flex items-center gap-1.5 z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full bg-black/35 backdrop-blur-md border border-white/10 shadow-sm">
            <Sparkles size={11} className="text-white/40" />
            <div className="h-2.5 w-12 rounded-full bg-white/30" />
          </div>
        </div>

        <div className="absolute top-2.5 end-2.5 z-10">
          <div className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-black/35 backdrop-blur-md border border-white/10 shadow-sm">
            <Star size={11} className="text-amber-400/40 fill-amber-400/30" />
            <div className="h-2.5 w-5 rounded-full bg-white/40" />
          </div>
        </div>

        {/* Cinematic bottom scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* ── 2. Content Zone Skeleton ── */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-4.5 justify-between gap-3">
        <div className="flex flex-col gap-2">
          {/* Title */}
          <Skeleton className="h-5 w-4/5 rounded-lg" />
          {/* Description */}
          <Skeleton className="h-3 w-full rounded-md" />
          <Skeleton className="h-3 w-3/5 rounded-md" />
        </div>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]/40">
          <div className="flex flex-col gap-1">
            <div className="h-2 w-8 rounded-full bg-[var(--color-border)]/50" />
            <Skeleton className="h-5 w-18 rounded-lg" />
          </div>

          {/* Quick Add Button Skeleton */}
          <div className="flex items-center justify-center h-8.5 w-8.5 sm:h-9 sm:w-9 rounded-xl sm:rounded-2xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)]/60 text-[var(--color-text-muted)]/30 shadow-sm">
            <ShoppingBag size={15} />
          </div>
        </div>
      </div>
    </article>
  );
}

export function HorizontalProductCardSkeleton() {
  return (
    <article
      className="group relative flex flex-row items-stretch w-full min-h-[140px] sm:min-h-[160px] md:min-h-[175px] bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-3 sm:p-4 gap-3.5 sm:gap-4.5 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] overflow-hidden"
      aria-busy="true"
    >
      {/* Left Image Frame Skeleton */}
      <div
        className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 flex-shrink-0 rounded-xl overflow-hidden bg-[var(--color-surface-subtle)]/70 flex items-center justify-center skeleton-shimmer"
        style={{ aspectRatio: '1 / 1' }}
      >
        <UtensilsCrossed className="w-8 h-8 text-[var(--color-text-muted)]/20" />
      </div>

      {/* Right Info Column */}
      <div className="flex flex-col justify-between flex-1 min-w-0 py-1">
        <div className="flex flex-col gap-2">
          {/* Title */}
          <Skeleton className="h-5 w-3/4 rounded-lg" />
          {/* Description */}
          <Skeleton className="h-3.5 w-full rounded-md" />
          <Skeleton className="h-3.5 w-1/2 rounded-md" />
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]/40">
          <Skeleton className="h-5.5 w-20 rounded-lg" />
          <div className="flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)]/60 text-[var(--color-text-muted)]/30">
            <ShoppingBag size={15} />
          </div>
        </div>
      </div>
    </article>
  );
}
