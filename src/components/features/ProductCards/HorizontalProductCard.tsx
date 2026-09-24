'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingBag } from 'lucide-react';
import { Product } from '@/data/menu';
import { useBusinessRoute } from '@/hooks/useLocale';
import { useCart } from '@/store/hooks';
import { useRef, useState } from 'react';

interface HorizontalProductCardProps {
  product: Product;
}

export function HorizontalProductCard({ product }: HorizontalProductCardProps) {
  const { getPath } = useBusinessRoute();
  const href = getPath(product.id);
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const addTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdding) return;
    setIsAdding(true);

    const defaults: Record<string, string> = {};
    if (product.customizationOptions) {
      for (const opt of product.customizationOptions) {
        if (opt.defaultChoice) defaults[opt.name] = opt.defaultChoice;
        else if (opt.choices.length > 0) defaults[opt.name] = opt.choices[0].label;
      }
    }

    addToCart(product, defaults, 1);

    if (addTimeoutRef.current) clearTimeout(addTimeoutRef.current);
    addTimeoutRef.current = setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  const reviewCount = product.reviews?.length || 0;

  return (
    <Link
      href={href}
      prefetch={false}
      className="group relative flex flex-row w-full h-36 sm:h-44 md:h-52
        bg-[var(--color-surface)] rounded-2xl
        border border-[var(--color-border)]
        overflow-hidden
        transition-all duration-400 ease-out
        hover:border-[var(--color-primary)]/40
        active:scale-[0.98]
        cursor-pointer
        shadow-[var(--shadow-card)]
        hover:shadow-[var(--shadow-card-hover)]
        hover:translate-y-[-4px]"
    >
      {/* Image Section – fixed 40% width, fills height */}
      <div className="relative w-2/5 h-full flex-shrink-0 bg-[var(--color-card-light)] dark:bg-[var(--color-card-dark)] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(max-width: 640px) 40vw, 33vw"
        />
        {/* Subtle gradient overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-80 pointer-events-none" />

        {/* Quick Add button – Moved to Top Right of the Image */}
        <button
          onClick={handleQuickAdd}
          disabled={isAdding}
          className={`absolute top-2 sm:top-3 end-2 sm:end-3 z-20 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 
            rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-md border border-[var(--color-border)] 
            text-[var(--color-primary)] transition-all duration-300 
            shadow-[0_4px_10px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_15px_rgba(22,131,199,0.3)] 
            hover:scale-110 active:scale-95 cursor-pointer
            ${isAdding ? 'opacity-50 pointer-events-none' : 'hover:bg-[var(--color-primary)] hover:text-white'}`}
          aria-label="Add to cart"
        >
          <ShoppingBag size={16} className="sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Info Section – clean stacked layout */}
      <div className="flex flex-col flex-1 p-3 sm:p-4 md:p-5 justify-between min-w-0 gap-1.5 sm:gap-2">
        
        {/* Row 1: Product name */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-sm sm:text-base md:text-lg text-[var(--color-text-primary)] leading-tight
            group-hover:text-[var(--color-primary)] transition-colors duration-300 line-clamp-2"
            style={{ fontFamily: 'var(--font-display)' }}>
            {product.name}
          </h3>
        </div>

        {/* Row 2: Description */}
        {product.description && (
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Row 3: Category (Left) and Price + Rating (Right) */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--color-divider)] mt-auto">
          
          {/* Left: Category Badge */}
          {product.category && (
            <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full
              bg-[var(--color-primary-50)] border border-[var(--color-border)]
              font-medium text-[10px] sm:text-xs text-[var(--color-primary)]
              shadow-sm transition-all duration-300
              group-hover:shadow-[0_0_15px_rgba(22,131,199,0.15)]
              whitespace-nowrap uppercase tracking-wider">
              {product.category}
            </span>
          )}

          {/* Right: Price and Rating */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
            {/* Rating Badge */}
            <div className="flex items-center gap-1 bg-[var(--color-primary-50)] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full
              transition-all duration-300 group-hover:shadow-[0_0_12px_rgba(22,131,199,0.15)]">
              <Star size={12} className="sm:w-3.5 sm:h-3.5 text-[var(--color-warning)] fill-[var(--color-warning)]" strokeWidth={0} />
              <span className="text-xs sm:text-sm font-bold text-[var(--color-text-primary)] leading-none">
                {product.rating}
              </span>
              {reviewCount > 0 && (
                <span className="text-[10px] sm:text-xs text-[var(--color-text-muted)] ml-0.5">
                  ({reviewCount})
                </span>
              )}
            </div>
            
            {/* Price */}
            <span className="font-bold text-sm sm:text-base md:text-lg text-[var(--color-primary)] whitespace-nowrap">
              {product.price}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}