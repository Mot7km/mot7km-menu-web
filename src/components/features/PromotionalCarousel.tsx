'use client';

import Image from 'next/image';
import { Coffee, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PromoCardData } from '@/data/menupromo';
import { useStore } from '@/store/storeHooks';
import { useLocale, useTranslations } from 'next-intl';

// -------------------------------------------------------------------
// Main Carousel – full‑width on mobile, container‑width on larger screens
// -------------------------------------------------------------------
export function PromotionalCarousel() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const { promoCards, sliderHeader, loading } = useStore();

  const slideCount = promoCards?.length ?? 0;

  // Loop only when there are enough slides to fill more than one "page".
  // With 1–2 slides on wide screens, loop:true makes Embla ignore
  // `containScroll` and produces dead snaps.
  const loop = slideCount > 2;

  // Lazy-init Autoplay exactly once. Calling Autoplay() during render would
  // create a new plugin instance on every render and leak listeners.
  const autoplayRef = useRef<ReturnType<typeof Autoplay> | null>(null);
  if (autoplayRef.current === null) {
    autoplayRef.current = Autoplay({
      delay: 4000,
      stopOnInteraction: true,
    });
  }

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop,
      align: 'center',
      containScroll: 'trimSnaps',
      dragFree: false,
      direction: isRTL ? 'rtl' : 'ltr',
    },
    [autoplayRef.current]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [snapCount, setSnapCount] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;

    const sync = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setSnapCount(emblaApi.scrollSnapList().length);
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };

    sync();
    emblaApi.on('select', sync);
    emblaApi.on('reInit', sync);

    return () => {
      emblaApi.off('select', sync);
      emblaApi.off('reInit', sync);
    };
  }, [emblaApi]);

  // Pause autoplay when there's nothing to rotate through.
  useEffect(() => {
    const autoplay = autoplayRef.current;
    if (!autoplay) return;
    if (snapCount > 1) autoplay.play();
    else autoplay.stop();
  }, [snapCount]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi]
  );

  // ---------------- Loading / empty state ----------------
  if (loading || !promoCards?.length) {
    return (
      <section className="relative flex min-h-56 items-center justify-center overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-10 text-center shadow-[var(--shadow-card)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/[0.08] via-transparent to-[var(--color-accent)]/[0.12]" />
        <div className="relative flex max-w-sm flex-col items-center gap-3">
          <Sparkles className="h-7 w-7 text-[var(--color-primary)]" />
          <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
            {loading ? t('loading.store') : t('home.noOffersTitle')}
          </h3>
          {!loading && (
            <p className="text-sm text-[var(--color-text-muted)]">
              {t('home.noOffers')}
            </p>
          )}
        </div>
      </section>
    );
  }

  // Only show navigation when Embla actually has more than one snap.
  const showNav = snapCount > 1;

  return (
    // Full‑width breakout on mobile, respect container on larger screens
    <section
      className="relative overflow-x-hidden py-2
        w-full left-1/2 -translate-x-1/2
        sm:w-auto sm:left-0 sm:translate-x-0"
    >
      <div className="relative">
        {sliderHeader && (
          <h2 className="mb-2 px-2 text-lg font-bold text-[var(--color-text-primary)] font-api">
            {sliderHeader}
          </h2>
        )}
        {/* Carousel Viewport */}
        <div
          className="overflow-hidden rounded-2xl touch-pan-y"
          ref={emblaRef}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <div className="flex">
            {promoCards.map((card) => (
              <div
                key={card.id}
                className="min-w-0 shrink-0 grow-0 basis-[85%] sm:basis-[75%] md:basis-[60%] lg:basis-[50%] px-2 py-2"
              >
                <PromoCard {...card} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows — hidden on mobile, visible on sm+ */}
        {showNav && (
          <>
            <button
              onClick={scrollPrev}
              disabled={!loop && !canPrev}
              aria-label={isRTL ? 'التالي' : 'Previous'}
              className="absolute top-1/2 left-0 -translate-y-1/2 z-10
                hidden sm:flex items-center justify-center
                w-11 h-11 rounded-full
                glass
                text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]
                transition-all duration-200
                hover:scale-110 active:scale-95
                focus:outline-none focus-ring
                cursor-pointer
                disabled:opacity-0 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={scrollNext}
              disabled={!loop && !canNext}
              aria-label={isRTL ? 'السابق' : 'Next'}
              className="absolute top-1/2 right-0 -translate-y-1/2 z-10
                hidden sm:flex items-center justify-center
                w-11 h-11 rounded-full
                glass
                text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]
                transition-all duration-200
                hover:scale-110 active:scale-95
                focus:outline-none focus-ring
                cursor-pointer
                disabled:opacity-0 disabled:pointer-events-none"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Dots — driven by actual snap count, not card count */}
        {showNav && (
          <div className="mt-5 flex justify-center gap-2">
            {Array.from({ length: snapCount }).map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                className="group flex items-center justify-center p-2 min-w-[36px] min-h-[36px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-full"
              >
                <span
                  className={`h-2 rounded-full transition-all duration-400 ease-out block
                    ${
                      index === selectedIndex
                        ? 'w-7'
                        : 'w-2 bg-[var(--color-border-strong)] group-hover:bg-[var(--color-primary)]/40'
                    }
                  `}
                  style={
                    index === selectedIndex
                      ? { background: 'var(--gradient-primary)' }
                      : undefined
                  }
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// -------------------------------------------------------------------
// Individual Promo Card – fully responsive
// -------------------------------------------------------------------
function PromoCard({
  title,
  description,
  badge,
  image,
  gradient,
  backgroundColor,
  hasIcon,
}: PromoCardData) {
  const hasImage = Boolean(image);

  return (
    <div
      className="group relative h-[200px] sm:h-[240px] md:h-[260px] w-full overflow-hidden rounded-2xl
        border border-[var(--color-border)]
        transition-all duration-400 ease-out
        hover:border-[var(--color-primary)]/50
        cursor-pointer"
      style={{ boxShadow: 'var(--shadow-card)' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
        e.currentTarget.style.transform = 'scale(1.02)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {/* Image */}
      {hasImage && (
        <>
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
            sizes="(max-width: 640px) 85vw, (max-width: 768px) 75vw, (max-width: 1024px) 60vw, 50vw"
          />
          {/* Gradient overlay */}
          {gradient && <div className="absolute inset-0 opacity-80" style={{ background: gradient }} />}
          {/* Depth overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 group-hover:from-black/20 transition-colors duration-400" />
        </>
      )}

      {/* No-image background */}
      {!hasImage && (
        <div
          className="absolute inset-0 bg-[var(--color-card-light)] dark:bg-[var(--color-card-dark)]"
          style={backgroundColor ? { backgroundColor } : undefined}
        />
      )}

      {/* Decorative Icon */}
      {hasIcon && (
        <div className="absolute bottom-0 right-0 opacity-[0.07] group-hover:opacity-[0.14] transition-opacity duration-400">
          <Coffee className="h-32 w-32 sm:h-36 sm:w-36 text-[var(--color-primary)]" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-center px-4 sm:px-6 py-4 sm:py-5">
        {badge && (
          <span
            className="mb-2 sm:mb-3 inline-flex w-fit items-center rounded-full
              px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold tracking-wider uppercase
              bg-white/15 text-white/95
              backdrop-blur-sm border border-white/10"
          >
            {badge}
          </span>
        )}

        <h3
          className={`text-xl sm:text-2xl md:text-[1.7rem] font-bold leading-tight tracking-tight
            ${hasImage || backgroundColor ? 'text-white' : 'text-[var(--color-text-primary)]'}
            line-clamp-2
          `}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h3>

        {description && (
          <p
            className={`mt-1 text-xs sm:text-sm font-medium leading-5 max-w-sm
              ${hasImage || backgroundColor ? 'text-white/95' : 'text-[var(--color-text-secondary)]'}
              line-clamp-2 sm:line-clamp-3
            `}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}