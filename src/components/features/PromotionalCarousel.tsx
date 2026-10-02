'use client';

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Coffee, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaCarouselType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';
import { PromoCardData } from '@/data/menupromo';
import { useStore } from '@/store/storeHooks';
import { useLocale } from 'next-intl';

const SCALE_MIN = 0.88; // Side slides scale
const OPACITY_MIN = 0.65; // Side slides opacity

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

export const PromotionalCarousel = memo(function PromotionalCarousel() {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const { promoCards, loading } = useStore();

  const originalCards = promoCards ?? [];
  const originalCount = originalCards.length;

  // Automatically pad/duplicate cards so Embla's native loop engine always triggers
  const extendedCards = useMemo(() => {
    if (originalCount === 0) return [];
    let list = [...originalCards];
    while (list.length < 4) {
      list = [...list, ...originalCards];
    }
    return list;
  }, [originalCards, originalCount]);

  const loop = extendedCards.length > 1;

  const autoplayRef = useRef<ReturnType<typeof Autoplay> | null>(null);
  if (autoplayRef.current === null) {
    autoplayRef.current = Autoplay({
      delay: 4000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
    });
  }

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop,
      align: 'center',
      containScroll: false,
      dragFree: false,
      direction: isRTL ? 'rtl' : 'ltr',
    },
    [autoplayRef.current]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const tweenNodesRef = useRef<HTMLElement[]>([]);

  const setTweenNodes = useCallback((api: EmblaCarouselType) => {
    tweenNodesRef.current = api.slideNodes().map((node) => {
      const inner = node.querySelector<HTMLElement>('[data-tween-target]');
      return inner ?? node;
    });
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    const updateStyles = () => {
      const scrollProgress = emblaApi.scrollProgress();

      emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        const node = tweenNodesRef.current[snapIndex];
        if (!node) return;

        let diff = scrollSnap - scrollProgress;
        if (loop) {
          if (diff > 0.5) diff -= 1;
          else if (diff < -0.5) diff += 1;
        }

        const absDiff = Math.abs(diff);
        const scale = clamp(1 - absDiff * 0.3, SCALE_MIN, 1);
        const opacity = clamp(1 - absDiff * 0.35, OPACITY_MIN, 1);

        node.style.transform = `scale(${scale})`;
        node.style.opacity = `${opacity}`;
      });
    };

    setTweenNodes(emblaApi);
    updateStyles();

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    emblaApi.on('scroll', updateStyles);
    emblaApi.on('reInit', () => {
      setTweenNodes(emblaApi);
      updateStyles();
    });

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('scroll', updateStyles);
    };
  }, [emblaApi, setTweenNodes, loop]);

  if (loading || originalCount === 0) {
    return <></>;
  }

  // Map the active carousel index back to the original unique cards for the pagination dots
  const activeOriginalIndex = originalCount > 0 ? selectedIndex % originalCount : 0;
  const showNav = originalCount > 1;

  return (
    <section className="relative overflow-hidden w-full py-2">
      <div className="relative w-full md:max-w-6xl xl:max-w-7xl md:mx-auto md:px-6 lg:px-8">
        <div
          className="overflow-hidden cursor-grab active:cursor-grabbing touch-pan-y py-4"
          ref={emblaRef}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <div className="flex -ml-4">
            {extendedCards.map((card, index) => (
              <div
                key={`${card.id}-${index}`}
                onClick={() => {
                  if (index !== selectedIndex) emblaApi?.scrollTo(index);
                }}
                className="min-w-0 shrink-0 grow-0 basis-[85%] sm:basis-[65%] md:basis-[50%] lg:basis-[42%] pl-4"
              >
                <div
                  data-tween-target
                  className="will-change-[transform,opacity] origin-center"
                >
                  <PromoCard {...card} isFirst={index === 0} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        {showNav && (
          <>
            <button
              onClick={() => emblaApi?.scrollPrev()}
              aria-label={isRTL ? 'التالي' : 'Previous'}
              className="absolute top-1/2 left-2 sm:left-3 md:left-4 -translate-y-1/2 z-20
                hidden sm:flex items-center justify-center
                w-10 h-10 md:w-11 md:h-11 rounded-full
                bg-black/50 hover:bg-black/70 text-white backdrop-blur-md border border-white/20
                shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              aria-label={isRTL ? 'السابق' : 'Next'}
              className="absolute top-1/2 right-2 sm:right-3 md:right-4 -translate-y-1/2 z-20
                hidden sm:flex items-center justify-center
                w-10 h-10 md:w-11 md:h-11 rounded-full
                bg-black/50 hover:bg-black/70 text-white backdrop-blur-md border border-white/20
                shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Pagination Dots mapped to original unique cards */}
        {showNav && (
          <div className="flex justify-center gap-2 mt-4">
            {originalCards.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                className="group flex items-center justify-center min-w-[16px] min-h-[36px] cursor-pointer focus:outline-none rounded-full"
              >
                <span
                  className={`h-2 rounded-full transition-all duration-300 ease-out block ${index === activeOriginalIndex
                      ? 'w-7'
                      : 'w-2 bg-[var(--color-border-strong)]'
                    }`}
                  style={
                    index === activeOriginalIndex
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
      className="group relative h-[210px] sm:h-[250px] md:h-[280px] lg:h-[310px] xl:h-[330px] w-full overflow-hidden rounded-2xl
        border border-[var(--color-border)]
        shadow-lg hover:shadow-2xl
        transition-shadow duration-300 ease-out
        cursor-pointer"
    >
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
          {gradient && <div className="absolute inset-0 opacity-80" style={{ background: gradient }} />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
        </>
      )}

      {!hasImage && (
        <div
          className="absolute inset-0 bg-[var(--color-card-light)] dark:bg-[var(--color-card-dark)]"
          style={backgroundColor ? { backgroundColor } : undefined}
        />
      )}

      {hasIcon && (
        <div className="absolute bottom-0 right-0 opacity-[0.07] group-hover:opacity-[0.14] transition-opacity duration-400">
          <Coffee className="h-32 w-32 sm:h-36 sm:w-36 text-[var(--color-primary)]" />
        </div>
      )}

      <div className="relative z-10 flex h-full flex-col justify-center px-6 sm:px-8 py-6">
        {badge && (
          <span
            className={`mb-3 inline-flex w-fit items-center rounded-full
              px-3 py-1 text-xs font-semibold tracking-wider uppercase
              backdrop-blur-sm border ${hasImage || backgroundColor
                ? 'bg-black/45 text-white border-white/20'
                : 'bg-[var(--color-primary-50)] text-[var(--color-primary)] border-[var(--color-primary-100)]'
              }`}
          >
            {badge}
          </span>
        )}

        <h3
          className={`text-xl sm:text-2xl md:text-3xl font-bold leading-tight tracking-tight
            ${hasImage || backgroundColor ? 'text-white' : 'text-[var(--color-text-primary)]'}
            line-clamp-2
          `}
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h3>

        {description && (
          <p
            className={`mt-2 text-xs sm:text-sm md:text-base font-medium leading-relaxed max-w-md
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