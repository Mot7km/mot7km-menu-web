import { Sparkles, UtensilsCrossed } from 'lucide-react';
import { Skeleton } from './SkeletonBase';

export function CarouselSkeleton() {
  return (
    <section className="relative w-full pt-6 pb-4 sm:pt-8 sm:pb-6" aria-busy="true">
      {/* Title line */}
      <div className="mx-auto max-w-5xl md:max-w-6xl px-4 sm:px-6 lg:px-8 mb-4">
        <Skeleton className="h-7 sm:h-8 w-44 rounded-lg" />
      </div>

      <div className="w-full mx-auto max-w-5xl md:max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Main Banner Card Skeleton */}
        <div className="relative w-full h-[200px] sm:h-[240px] md:h-[260px] rounded-2xl sm:rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)]/80 dark:border-white/[0.08] overflow-hidden shadow-md flex items-center p-6 sm:p-8 md:p-10">
          {/* Subtle background ambient mesh */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/10 via-[var(--color-surface-subtle)]/40 to-transparent pointer-events-none" />

          {/* Left Content Column */}
          <div className="flex flex-col gap-3 max-w-md z-10">
            {/* Offer Badge Skeleton */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/25 w-fit">
              <Sparkles size={12} className="text-[var(--color-primary)]/50" />
              <div className="h-3 w-20 rounded-full bg-[var(--color-primary)]/30" />
            </div>

            {/* Header / Title */}
            <div className="h-7 sm:h-9 w-3/4 rounded-lg bg-[var(--color-surface-subtle)] skeleton-shimmer" />

            {/* Description lines */}
            <div className="flex flex-col gap-1.5 pt-0.5">
              <div className="h-3.5 w-full rounded-md bg-[var(--color-surface-subtle)] skeleton-shimmer" />
              <div className="h-3.5 w-2/3 rounded-md bg-[var(--color-surface-subtle)] skeleton-shimmer" />
            </div>

            {/* CTA Button Skeleton */}
            <div className="mt-1 h-9 sm:h-10 w-28 sm:w-32 rounded-full bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/30 skeleton-shimmer" />
          </div>

          {/* Right Image Placeholder illustration */}
          <div className="absolute end-6 sm:end-12 top-1/2 -translate-y-1/2 hidden sm:flex items-center justify-center w-36 h-36 md:w-48 md:h-48 rounded-full bg-[var(--color-surface-subtle)]/60 border border-[var(--color-border)]/40 shadow-inner skeleton-shimmer">
            <UtensilsCrossed className="w-16 h-16 md:w-20 md:h-20 text-[var(--color-text-muted)]/20" />
          </div>
        </div>

        {/* Carousel Dots Skeleton */}
        <div className="flex justify-center gap-2 mt-4">
          <div className="h-2 w-7 rounded-full bg-[var(--color-primary)]/60 animate-pulse" />
          <div className="h-2 w-2 rounded-full bg-[var(--color-border-strong)]/40" />
          <div className="h-2 w-2 rounded-full bg-[var(--color-border-strong)]/40" />
        </div>
      </div>
    </section>
  );
}
