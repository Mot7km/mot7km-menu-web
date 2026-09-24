'use client';

import Image from 'next/image';

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

export default function Categories({
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
            flex flex-nowrap gap-2 sm:gap-3 md:gap-4
            overflow-x-auto
            justify-start
            py-2 sm:py-3
            px-4 sm:px-6 md:px-8
            max-w-full
            scrollbar-hide
            snap-x snap-mandatory
            touch-pan-x
          "
          style={{
            flex: '0 0 auto',
            scrollSnapType: 'x mandatory',
            scrollPaddingLeft: '1rem',
            scrollPaddingRight: '1rem',
          }}
        >
          {categories.map((category) => {
            const isActive = category.id === activeCategory;
            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className="
                  group flex flex-col items-center gap-1.5 sm:gap-2
                  snap-center shrink-0
                  transition-all duration-300 ease-out
                  cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60
                  active:scale-95
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
                    transition-all duration-400 ease-out
                    ${
                      isActive
                        ? 'scale-110'
                        : 'ring-1 ring-border/50 group-hover:ring-primary/40 group-hover:scale-105 shadow-sm'
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
                        boxShadow: '0 4px 20px rgba(22, 131, 199, 0.25), 0 0 40px rgba(22, 131, 199, 0.1)',
                      }}
                    />
                  )}

                  {category.image ? (
                    <Image
                      src={category.image}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 48px, (max-width: 768px) 56px, (max-width: 1024px) 64px, 80px"
                      className="object-cover rounded-full transition-transform duration-500 group-hover:scale-110"
                      priority={isActive}
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-[var(--color-primary-50)] transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                </div>

                {/* Label with gradient text for active */}
                <span
                  className={`
                    text-[10px] xs:text-xs sm:text-sm font-semibold leading-tight
                    transition-all duration-300
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