import { Phone, MapPin, Mail, Clock } from 'lucide-react';
import { Skeleton } from './SkeletonBase';

export function FooterSkeleton() {
  return (
    <footer
      className="relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-surface)]"
      style={{ minHeight: '320px' }}
      aria-busy="true"
    >
      {/* Gradient top accent line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-primary)]/30 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {/* Grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8">
          {/* Column 1: Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-subtle)] shadow-sm skeleton-shimmer" />
              <Skeleton className="h-6 w-32 rounded-lg" />
            </div>
            <Skeleton className="h-4 w-44 rounded-md" />
            <Skeleton className="h-3.5 w-36 rounded-md" />
          </div>

          {/* Column 2: Quick Links / Contact */}
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-20 rounded-md" />
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-[var(--color-text-muted)]/30 flex-shrink-0" />
                <Skeleton className="h-4 w-32 rounded-md" />
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[var(--color-text-muted)]/30 flex-shrink-0" />
                <Skeleton className="h-4 w-40 rounded-md" />
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[var(--color-text-muted)]/30 flex-shrink-0" />
                <Skeleton className="h-4 w-28 rounded-md" />
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-[var(--color-text-muted)]/30 flex-shrink-0" />
                <Skeleton className="h-4 w-36 rounded-md" />
              </div>
            </div>
          </div>

          {/* Column 3: Hours placeholder */}
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-24 rounded-md" />
            <div className="flex flex-col gap-2.5">
              <Skeleton className="h-4 w-36 rounded-md" />
              <Skeleton className="h-4 w-28 rounded-md" />
            </div>
          </div>

          {/* Column 4: Social */}
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-16 rounded-md" />
            <div className="flex items-center gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center w-10 h-10 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)]/50 shadow-sm skeleton-shimmer"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom divider + copyright */}
        <div className="section-divider-premium w-full mb-6 border-t border-[var(--color-border)]/50" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <Skeleton className="h-4 w-48 rounded-md" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--color-border)]/40 bg-[var(--color-surface-subtle)]/40">
            <div className="h-3 w-16 rounded-full bg-[var(--color-border)]/60" />
            <div className="h-3 w-12 rounded-full bg-[var(--color-primary)]/40" />
          </div>
        </div>
      </div>
    </footer>
  );
}
