'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Coffee, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaCarouselType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';
import { PromoCardData } from '@/data/menupromo';
import { useStore } from '@/store/storeHooks';
import { useLocale, useTranslations } from 'next-intl';

// -------------------------------------------------------------------
// Tween constants — tweak these to control the coverflow intensity
// -------------------------------------------------------------------
const TWEEN_SCALE_FACTOR = 0.9;   // smooth scaling transition
const SCALE_MIN = 0.88;           // side slides scale (88% of center slide)
const OPACITY_MIN = 0.65;         // side slides opacity (clear and legible)

/** Clamp a value between min and max. */
const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

// -------------------------------------------------------------------
// Main Carousel – full‑width on mobile, container‑width on larger screens
// -------------------------------------------------------------------
export const PromotionalCarousel = memo(function PromotionalCarousel() {
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

  // ---- Coverflow tween refs (direct DOM manipulation → 60 fps) ----
  const tweenNodesRef = useRef<HTMLElement[]>([]);

  /** Cache the inner wrapper of every slide so we don't query the DOM on every frame. */
  const setTweenNodes = useCallback((api: EmblaCarouselType) => {
    tweenNodesRef.current = api.slideNodes().map((node) => {
      const inner = node.querySelector<HTMLElement>('[data-tween-target]');
      return inner ?? node;
    });
  }, []);

  /** Apply scale + opacity to every slide based on distance from center. */
  const tweenSlides = useCallback((api: EmblaCarouselType) => {
    const progress = api.scrollProgress();
    const snaps = api.scrollSnapList();

    snaps.forEach((snap, idx) => {
      const node = tweenNodesRef.current[idx];
      if (!node) return;

      // Distance from center: 0 = perfectly centered, ±1 = one full page away
      let diff = snap - progress;

      // Handle looping: pick the shortest wrap-around distance
      if (loop) {
        if (diff > 0.5) diff -= 1;
        else if (diff < -0.5) diff += 1;
      }

      const absDiff = Math.abs(diff);
      const scale = clamp(1 - absDiff * TWEEN_SCALE_FACTOR, SCALE_MIN, 1);
      const opacity = clamp(1 - absDiff * TWEEN_SCALE_FACTOR, OPACITY_MIN, 1);

      node.style.transform = `scale(${scale})`;
      node.style.opacity = `${opacity}`;
    });
  }, [loop]);

  // ---- Standard sync (selected index, snap count, nav) ----
  useEffect(() => {
    if (!emblaApi) return;

    const sync = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setSnapCount(emblaApi.scrollSnapList().length);
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };

    // Init tween nodes & run first tween pass
    setTweenNodes(emblaApi);
    tweenSlides(emblaApi);

    sync();
    emblaApi.on('select', sync);
    emblaApi.on('reInit', sync);
    emblaApi.on('reInit', setTweenNodes);
    emblaApi.on('reInit', tweenSlides);
    emblaApi.on('scroll', tweenSlides);
    emblaApi.on('slideFocus', tweenSlides);

    return () => {
      emblaApi.off('select', sync);
      emblaApi.off('reInit', sync);
      emblaApi.off('reInit', setTweenNodes);
      emblaApi.off('reInit', tweenSlides);
      emblaApi.off('scroll', tweenSlides);
      emblaApi.off('slideFocus', tweenSlides);
    };
  }, [emblaApi, setTweenNodes, tweenSlides]);

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
      <></>
    );
  }

  // Only show navigation when Embla actually has more than one snap.
  const showNav = snapCount > 1;

  return (
    <section className="relative overflow-x-hidden w-full py-1" style={{ perspective: '1200px' }}>
      <div className="relative w-full">
        {/* Carousel Viewport */}
        <div
          className="overflow-hidden touch-pan-y"
          ref={emblaRef}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <div className="flex">
            {promoCards.map((card, index) => (
              <div
                key={card.id}
                className="min-w-0 shrink-0 grow-0 basis-[85%] sm:basis-[72%] md:basis-[58%] lg:basis-[48%] px-1.5 sm:px-2 py-1"
              >
                {/* Inner wrapper targeted by the tween effect — never conflict with Embla's own transforms */}
                <div
                  data-tween-target
                  className="transition-[transform,opacity] duration-300 ease-out will-change-[transform,opacity] origin-center"
                >
                  <PromoCard {...card} isFirst={index === 0} />
                </div>
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
              className="absolute top-1/2 left-3 sm:left-6 -translate-y-1/2 z-10
                hidden sm:flex items-center justify-center
                w-11 h-11 rounded-full
                glass shadow-lg
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
              className="absolute top-1/2 right-3 sm:right-6 -translate-y-1/2 z-10
                hidden sm:flex items-center justify-center
                w-11 h-11 rounded-full
                glass shadow-lg
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
          <div className="flex justify-center gap-2">
            {Array.from({ length: snapCount }).map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                className="group flex items-center justify-center min-w-[16px] min-h-[36px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-full"
              >
                <span
                  className={`h-2 rounded-full transition-[width,opacity] duration-300 ease-out block
                    ${
                      index === selectedIndex
                        ? 'w-7'
                        : 'w-2 bg-[var(--color-border-strong)]'
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
});

// -------------------------------------------------------------------
// Individual Promo Card – fully responsive
// -------------------------------------------------------------------
const PromoCard = memo(function PromoCard({
  title,
  description,
  badge,
  image,
  gradient,
  backgroundColor,
  hasIcon,
  isFirst = false,
}: PromoCardData & { isFirst?: boolean }) {
  const hasImage = Boolean(image);
  const cleanAlt = title && title.trim() !== '.' ? title : 'Promotional Banner';

  return (
    <div
      className="group relative h-[200px] sm:h-[240px] md:h-[260px] w-full overflow-hidden rounded-lg
        border border-[var(--color-border)]
        shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)]
        hover:shadow-[0_12px_32px_-6px_rgba(0,0,0,0.45)]
        hover:border-[var(--color-primary)]/50
        transition-all duration-300 ease-out
        hover:scale-[1.01]
        cursor-pointer"
    >
      {/* Image */}
      {hasImage && (
        <>
          <Image
            src={image}
            alt={cleanAlt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority={isFirst}
            fetchPriority={isFirst ? 'high' : 'auto'}
            loading={isFirst ? undefined : 'lazy'}
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
            className={`mb-2 sm:mb-3 inline-flex w-fit items-center rounded-full
              px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold tracking-wider uppercase
              backdrop-blur-sm border ${
                hasImage || backgroundColor
                  ? 'bg-black/40 text-white border-white/20'
                  : 'bg-[var(--color-primary-50)] text-[var(--color-primary)] border-[var(--color-primary-100)]'
              }`}
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
});