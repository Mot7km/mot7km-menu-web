import { Settings, UtensilsCrossed, MapPin, Phone } from 'lucide-react';
import { Skeleton } from './SkeletonBase';

export function HeaderSkeleton() {
  return (
    <header
      className="
        relative isolate w-full overflow-hidden
        flex items-center justify-center
        rounded-b-[1.75rem] sm:rounded-b-[2.25rem]
        px-4 sm:px-6 lg:px-8
        pt-7 pb-5 sm:pt-9 sm:pb-6 lg:pt-10 lg:pb-7
        bg-[var(--color-secondary)]
      "
      style={{
        minHeight: 'clamp(145px, 18vw, 195px)',
      }}
      aria-busy="true"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/25 via-transparent to-black/35 pointer-events-none" />
      <div className="absolute -top-16 -end-16 w-56 h-56 rounded-full bg-[var(--color-accent)]/15 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -start-10 w-48 h-48 rounded-full bg-[var(--color-primary)]/20 blur-2xl pointer-events-none" />

      {/* Settings gear skeleton in top-end corner */}
      <div className="absolute end-3 top-3 z-20 sm:end-5 sm:top-4">
        <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/15 border border-white/25 text-white/40 backdrop-blur-md shadow-sm">
          <Settings size={15} />
        </div>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center">
        <div className="flex items-center gap-3.5 sm:gap-5 min-w-0 flex-1">
          {/* Logo Frame Skeleton */}
          <div className="relative flex-shrink-0">
            <div className="flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 lg:h-22 lg:w-22 rounded-2xl bg-white/10 border border-white/25 backdrop-blur-md shadow-lg overflow-hidden skeleton-shimmer">
              <UtensilsCrossed className="h-8 w-8 sm:h-10 sm:w-10 text-white/35" />
            </div>

            {/* Smart presence indicator dot */}
            <div className="absolute -bottom-1 -end-1 z-10">
              <span className="relative flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-black/60 backdrop-blur-md ring-2 ring-white/30 shadow-md">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400/60 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500/80" />
              </span>
            </div>
          </div>

          {/* Name & Slogan lines */}
          <div className="flex flex-col justify-center min-w-0 flex-1 gap-2">
            {/* Brand Title */}
            <div className="h-6 sm:h-7 lg:h-8 w-40 sm:w-56 rounded-lg bg-white/30 skeleton-shimmer" />

            {/* Slogan */}
            <div className="h-3.5 sm:h-4 w-52 sm:w-72 rounded-md bg-white/20 skeleton-shimmer" />

            {/* Contact metadata pills */}
            <div className="flex items-center gap-3 pt-0.5 text-white/60">
              <div className="inline-flex items-center gap-1.5">
                <MapPin size={12} className="text-white/40 flex-shrink-0" />
                <div className="h-3 w-24 sm:w-32 rounded-full bg-white/20" />
              </div>
              <div className="w-1 h-1 rounded-full bg-white/30" />
              <div className="inline-flex items-center gap-1.5">
                <Phone size={12} className="text-white/40 flex-shrink-0" />
                <div className="h-3 w-20 sm:w-24 rounded-full bg-white/20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
