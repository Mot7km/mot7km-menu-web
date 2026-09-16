'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ShoppingBag, Minus, Plus } from 'lucide-react';

interface AddToCartBarProps {
  basePrice: number;
  extraTotal: number;
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  onAddToCart: () => void;
}

export function AddToCartBar({
  basePrice,
  extraTotal,
  quantity,
  onQuantityChange,
  onAddToCart,
}: AddToCartBarProps) {
  const t = useTranslations('productPage');
  const total = (basePrice + extraTotal) * quantity;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 
        bg-[var(--color-surface)]/80 backdrop-blur-xl 
        border-t border-[var(--color-border)]/60 
        p-4 sm:p-5 md:p-6 
        shadow-[0_-20px_60px_rgba(0,0,0,0.12)] 
        animate-slide-up"
    >
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3 md:gap-4">
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
            <ShoppingBag size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-[var(--color-text-secondary)] text-xs sm:text-sm font-medium tracking-wide">
              {t('total')}
            </span>
            <span className="font-api font-bold text-2xl sm:text-3xl text-[var(--color-text-primary)] leading-tight">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <div className="flex items-center bg-[var(--color-background)] rounded-full border border-[var(--color-border)] p-0.5 shadow-sm">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="w-9 h-9 flex items-center justify-center rounded-full 
                hover:bg-[var(--color-surface)] active:scale-90 
                text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]
                transition-all duration-200 cursor-pointer
                disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label={t('decreaseQuantity')}
              disabled={quantity <= 1}
            >
              <Minus size={16} />
            </button>
            <span className="font-bold text-base min-w-[2rem] text-center text-[var(--color-text-primary)] select-none">
              {quantity}
            </span>
            <button
              onClick={() => onQuantityChange(quantity + 1)}
              className="w-9 h-9 flex items-center justify-center rounded-full 
                hover:bg-[var(--color-surface)] active:scale-90 
                text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]
                transition-all duration-200 cursor-pointer"
              aria-label={t('increaseQuantity')}
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            onClick={onAddToCart}
            className="flex items-center gap-2 
              bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] 
              text-white font-bold 
              px-5 sm:px-7 py-3 sm:py-3.5 
              rounded-full 
              shadow-[0_4px_20px_rgba(22,131,199,0.35)] 
              hover:shadow-[0_8px_30px_rgba(22,131,199,0.5)] 
              hover:-translate-y-1 
              active:scale-95 
              transition-all duration-300 
              cursor-pointer"
          >
            <ShoppingBag size={20} className="sm:size-[22px]" />
            <span className="hidden sm:inline text-base">
              {t('addToCart')}
            </span>
            <span className="sm:hidden text-sm">
              {t('add')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}