'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useCart } from '@/store/hooks';
import { FloatingCartButton } from './CartButton';

const CartDrawer = dynamic(
  () => import('./CartDrawer').then((m) => m.CartDrawer),
  { ssr: false }
);

export function CartOverlay() {
  const { 
    items, 
    itemCount, 
    totalPrice, 
    isDrawerOpen, 
    setIsDrawerOpen, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useCart();

  // Prevent ghost touch events from re-opening the drawer immediately after close.
  // On mobile, a touchend that fires onClose can bubble and trigger the cart button
  // click event ~50-300ms later. The lock swallows those ghost clicks.
  const closeLockRef = useRef(false);
  const closeLockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (itemCount === 0 && isDrawerOpen) {
      setIsDrawerOpen(false);
    }
  }, [itemCount, isDrawerOpen, setIsDrawerOpen]);

  const handleClose = useCallback(() => {
    setIsDrawerOpen(false);
    closeLockRef.current = true;
    if (closeLockTimerRef.current) clearTimeout(closeLockTimerRef.current);
    closeLockTimerRef.current = setTimeout(() => {
      closeLockRef.current = false;
    }, 400);
  }, [setIsDrawerOpen]);

  const handleOpen = useCallback(() => {
    if (closeLockRef.current) return; // swallow ghost click
    setIsDrawerOpen(true);
  }, [setIsDrawerOpen]);

  useEffect(() => {
    return () => {
      if (closeLockTimerRef.current) clearTimeout(closeLockTimerRef.current);
    };
  }, []);

  // Completely unmount if the cart is empty AND the drawer is closed
  if (itemCount === 0 && !isDrawerOpen) {
    return null;
  }

  return (
    <>
      <FloatingCartButton 
        itemCount={itemCount} 
        onOpenDrawer={handleOpen} 
        isVisible={!isDrawerOpen && itemCount > 0}
      />

      <CartDrawer 
        isOpen={isDrawerOpen} 
        onClose={handleClose} 
        items={items} 
        totalPrice={totalPrice} 
        updateQuantity={updateQuantity} 
        removeFromCart={removeFromCart} 
        clearCart={clearCart} 
      />
    </>
  );
}