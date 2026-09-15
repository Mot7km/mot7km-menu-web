'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingBag } from 'lucide-react';
import { Product } from '@/data/menu';
import { useLocale } from '@/hooks/useLocale';
import { useCart } from '@/context/CartContext';
import { useRef, useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export function GridProductCard({ product }: ProductCardProps) {
  const locale = useLocale();
  const href = `/${locale}/${product.id}`;
  const { addToCart, setIsDrawerOpen } = useCart();
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
        bg-[#0b1120] rounded-3xl
        border border-slate-800
        overflow-hidden
        transition-all duration-400 ease-out
        hover:border-cyan-500/50
        hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-transparent to-transparent opacity-80 pointer-events-none" />

        {/* Quick Add Button */}
        <button
          onClick={handleQuickAdd}
          disabled={isAdding}
          className={`absolute top-3 end-3 z-20 flex items-center justify-center w-10 h-10 rounded-full 
            bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30 
            text-cyan-400 transition-all duration-300 
            shadow-[0_4px_10px_rgba(0,0,0,0.3)] 
            hover:bg-cyan-500 hover:text-[#0b1120] hover:scale-110 active:scale-95 cursor-pointer
            ${isAdding ? 'opacity-50 pointer-events-none' : ''}`}
          aria-label="Add to cart"
        >
          <ShoppingBag size={18} />
        </button>

        {/* Price Badge */}
        <div className="absolute bottom-3 end-3 z-10">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full
            bg-[#0b1120]/80 backdrop-blur-md
            border border-cyan-500/30
            font-bold text-sm text-cyan-400
            shadow-lg
            transition-all duration-300
            group-hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]
            group-hover:scale-105">
            {product.price}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-4 gap-3 bg-[#0b1120]">
        <h4 
          className="font-bold text-base leading-snug text-white break-words
            group-hover:text-cyan-400 transition-colors duration-300"
          style={{ fontFamily: 'var(--font-display), var(--font-inter), system-ui, sans-serif' }}
        >
          {product.name}
        </h4>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-800">
          {/* Category Badge */}
          {product.category && (
            <span className="text-xs font-medium text-slate-400
              bg-slate-800/80 backdrop-blur-sm
              px-3 py-1.5 rounded-full truncate max-w-[100px]">
              {product.category}
            </span>
          )}

          {/* Rating Badge */}
          <div className="flex items-center gap-1.5
            bg-amber-500/10 border border-amber-500/30 
            px-2.5 py-1.5 rounded-full
            transition-all duration-300
            group-hover:shadow-[0_0_12px_rgba(245,158,11,0.15)]">
            <Star size={14} className="text-amber-400 fill-amber-400" strokeWidth={0} />
            <span className="text-xs font-bold text-amber-400 leading-none">
              {product.rating}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}