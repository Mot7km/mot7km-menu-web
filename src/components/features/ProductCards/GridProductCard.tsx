'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingBag } from 'lucide-react';
import { Product } from '@/data/menu';
import { useBusinessRoute } from '@/hooks/useLocale';
import { useCart } from '@/store/hooks';
import { useRef, useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export function GridProductCard({ product }: ProductCardProps) {
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

  return (
    <Link
      href={href}
      prefetch={false}
      className="group relative flex flex-col w-full h-full
        bg-[var(--color-surface)] rounded-3xl
        border border-[var(--color-border)]
        overflow-hidden
        transition-all duration-400 ease-out
        hover:border-[var(--color-accent)]
        hover:shadow-[var(--shadow-glow)]
        active:scale-[0.98]
        cursor-pointer"
    >
      {/* Image Section */}
      <div className="relative w-full aspect-[4/3] overflow-hidden flex-shrink-0">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        
        {/* Dark gradient overlay at the bottom of the image for better badge visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent opacity-80 pointer-events-none" />

        {/* Quick Add Button */}
        <button
          onClick={handleQuickAdd}
          disabled={isAdding}
          className={`absolute top-3 end-3 z-20 flex items-center justify-center w-10 h-10 rounded-full 
            bg-[var(--color-accent-50)] backdrop-blur-md border border-[var(--color-accent)]
            text-[var(--color-accent)] transition-all duration-300
            shadow-[var(--shadow-sm)]
            hover:bg-[var(--color-accent)] hover:text-[var(--color-text-on-accent)] hover:scale-110 active:scale-95 cursor-pointer
            ${isAdding ? 'opacity-50 pointer-events-none' : ''}`}
          aria-label="Add to cart"
        >
          <ShoppingBag size={18} />
        </button>

        {/* Price Badge */}
        <div className="absolute bottom-3 end-3 z-10">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full
            bg-[var(--color-surface)]/80 backdrop-blur-md
            border border-[var(--color-accent)]
            font-bold text-sm text-[var(--color-accent)]
            shadow-lg
            transition-all duration-300
            group-hover:shadow-[var(--shadow-glow)]
            group-hover:scale-105">
            {product.price}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-4 gap-3 bg-[var(--color-surface)]">
        <h4 
          className="font-bold text-base leading-snug text-[var(--color-text-primary)] break-words
            group-hover:text-[var(--color-accent)] transition-colors duration-300"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {product.name}
        </h4>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--color-border)]">
          {/* Category Badge */}
          {product.category && (
            <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full
              bg-[var(--color-primary-50)] border border-[var(--color-border)]
              font-medium text-[10px] sm:text-xs text-[var(--color-primary)]
              shadow-sm transition-all duration-300
              group-hover:shadow-[var(--shadow-glow)]
              whitespace-nowrap uppercase tracking-wider">
              {product.category}
            </span>
          )}

          {/* Rating Badge */}
          <div className="flex items-center gap-1.5
            bg-[var(--color-accent-50)] border border-[var(--color-accent)]
            px-2.5 py-1.5 rounded-full
            transition-all duration-300
            group-hover:shadow-[var(--shadow-glow)]">
            <Star size={14} className="text-[var(--color-accent)] fill-[var(--color-accent)]" strokeWidth={0} />
            <span className="text-xs font-bold text-[var(--color-accent)] leading-none">
              {product.rating}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}