'use client';

import { memo } from 'react';
import Image from 'next/image';
import { LayoutGrid } from 'lucide-react';

interface Category {
  id: string;
  label: string;
  image: string;
}

interface CategoriesProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

function Categories({
  categories,
  activeCategory,
  onSelectCategory,
}: CategoriesProps) {
  return (
    <div className="relative w-full">
      {/* Centering wrapper */}
      <div className="flex justify-center">
        {/* Scrollable container */}
        <div
          className="
            flex flex-nowrap gap-5 sm:gap-6 md:gap-7
            overflow-x-auto
            justify-start
            pt-4 sm:pt-4
            pb-1
            px-20 sm:px-20 md:px-20
            max-w-full
            scrollbar-hide
            snap-x snap-mandatory
          "
          style={{
            flex: '0 0 auto',
            touchAction: 'pan-x pan-y',
            scrollSnapType: 'x mandatory',
            scrollPaddingLeft: '1rem',
            scrollPaddingRight: '1rem',
          }}
        >
          {categories.map((category) => {
            const isActive = category.id === activeCategory;
            const imageSrc = category.image || (category.id === 'All' ? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80' : '');

            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className="
                  group flex flex-col items-center gap-1.5 sm:gap-2
                  snap-center shrink-0
                  transition-transform duration-300 ease-out
                  cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60
                  active:scale-95
                  pt-2
                "
                aria-pressed={isActive}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Circular avatar with gradient ring */}
                <div
                  className={`
                    relative
                    w-12 h-12
                    sm:w-14 sm:h-14
                    md:w-16 md:h-16
                    lg:w-20 lg:h-20
                    rounded-full
                    transition-transform duration-300 ease-out
                    ${
                      isActive
                        ? 'scale-110'
                        : 'group-hover:scale-105'
                    }
                  `}
                >
                  {/* Gradient ring for active */}
                  {isActive && (
                    <div
                      className="absolute -inset-[3px] rounded-full pointer-events-none"
                      style={{
                        background: 'var(--gradient-primary)',
                        padding: '2.5px',
                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        maskComposite: 'exclude',
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                      }}
                    />
                  )}

                  {/* Glow shadow for active */}
                  {isActive && (
                    <div
                      className="absolute inset-0 rounded-full pointer-events-none"
                      style={{
                        boxShadow: 'var(--shadow-glow)',
                        scale: '100%',
                        opacity: '0.8',
                      }}
                    />
                  )}

                  {/* Inner image container (overflow-hidden to guarantee perfect circular clipping) */}
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={category.label}
                        fill
                        sizes="(max-width: 640px) 48px, (max-width: 768px) 56px, (max-width: 1024px) 64px, 80px"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        priority={isActive}
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        className={`absolute inset-0 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${
                          isActive
                            ? 'bg-[var(--color-primary)] text-white shadow-sm'
                            : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                        }`}
                      >
                        <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 transition-transform group-hover:scale-110" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Label with gradient text for active */}
                <span
                  className={`
                    text-[10px] xs:text-xs sm:text-sm font-semibold leading-tight
                    max-w-[72px] truncate text-center
                    ${
                      isActive
                        ? 'font-bold'
                        : 'text-muted-foreground group-hover:text-foreground'
                    }
                  `}
                  style={isActive ? {
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  } : undefined}
                >
                  {category.label}
                </span>

                {/* Active indicator dot */}
                {isActive && (
                  <div
                    className="w-1.5 h-1.5 rounded-full -mt-0.5 animate-scale-in"
                    style={{ background: 'var(--gradient-primary)' }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default memo(Categories);