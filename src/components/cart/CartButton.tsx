'use client';

import React, { useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { FloatingWrapper, useFloatingContext } from '@/helpers/FloatingWrapper';
import { useCart } from '@/context/CartContext';

// ============================================================
//  CONFIGURATION
// ============================================================
const BUTTON_SIZE = 64;
// ============================================================

interface FloatingCartButtonProps {
  itemCount: number;
  totalPrice: number;
  onOpenDrawer: () => void;
  isVisible?: boolean;
}

// Inner component that consumes the floating context
function CartButtonInner({
  itemCount,
  totalPrice,
}: Pick<FloatingCartButtonProps, 'itemCount' | 'totalPrice'>) {
  const t = useTranslations('cart');
  const {
    tuckOffsetX,
    snapSide,
    isIdle,
    isDragging,
  } = useFloatingContext();

  // ---- Badge shift (for item count) ----
  const badgeShift = useMemo(() => {
    // When idle and snapped to right, shift the badge left so it stays visible
    if (isIdle && snapSide === 'right') {
      // tuckOffsetX is positive when snapped right and idle
      return tuckOffsetX + 8;
    }
    return 0;
  }, [isIdle, snapSide, tuckOffsetX]);

  return (
    <button
      aria-label={t('openCart')}
      className={`
        relative w-full h-full rounded-full
        bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)]
        border border-[var(--color-border-strong)]
        shadow-[var(--shadow-glow)]
        hover:shadow-[var(--shadow-glow-strong)]
        active:scale-95
        touch-manipulation
        flex items-center justify-center
        ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
      `}
      style={{
        backgroundColor: 'var(--color-primary)',
        backdropFilter: 'blur(6px)',
        transform: `translateX(${tuckOffsetX}px)`,
        opacity: isIdle ? 0.6 : 1,
        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease, box-shadow 0.2s',
      }}
    >
      <ShoppingBag size={28} className="text-[var(--color-text-on-primary)] drop-shadow-sm" />

      {itemCount > 0 && (
        <span
          className="absolute bg-[var(--color-secondary)] text-[var(--color-text-on-secondary)] text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-md ring-2 ring-[var(--color-border-strong)]"
          style={{
            top: '-4px',
            right: '-4px',
            transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s',
            transform: `translateX(${badgeShift > 0 ? `-${badgeShift}px` : '0'})`,
          }}
        >
          {itemCount}
        </span>
      )}
    </button>
  );
}

// Main component – wraps the inner content with the FloatingWrapper
export function FloatingCartButton({
  itemCount,
  totalPrice,
  onOpenDrawer,
  isVisible = true,
}: FloatingCartButtonProps) {
  const { clearCart } = useCart();
  const trashRef = useRef<HTMLButtonElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isOverTrash, setIsOverTrash] = useState(false);

  return (
    <>
      <button
        ref={trashRef}
        type="button"
        aria-label={useTranslations('cart')('discardCart')}
        className={`fixed bottom-6 left-1/2 z-[70] flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full border-2 border-dashed border-red-300/80 bg-red-500/90 text-white shadow-[0_10px_35px_rgba(239,68,68,0.35)] transition-all duration-300 ${
          isDragging ? 'pointer-events-auto translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-8 scale-75 opacity-0'
        } ${isOverTrash ? 'scale-125 border-white bg-red-600 shadow-[0_0_0_10px_rgba(239,68,68,0.2),0_12px_40px_rgba(239,68,68,0.55)]' : ''}`}
      >
        <Trash2 size={28} className={isOverTrash ? 'animate-bounce' : ''} />
      </button>

      <FloatingWrapper
        size={BUTTON_SIZE}
        isVisible={isVisible}
        onClick={onOpenDrawer}
        dropTargetRef={trashRef}
        onDragStart={() => setIsDragging(true)}
        onDropTargetChange={setIsOverTrash}
        onDragEnd={(droppedOnTrash) => {
          setIsDragging(false);
          setIsOverTrash(false);
          if (droppedOnTrash) clearCart();
        }}
      >
        <CartButtonInner itemCount={itemCount} totalPrice={totalPrice} />
      </FloatingWrapper>
    </>
  );
}