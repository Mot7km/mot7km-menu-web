'use client';

import React, { useEffect } from 'react';
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

  useEffect(() => {
    if (itemCount === 0 && isDrawerOpen) {
      setIsDrawerOpen(false);
    }
  }, [itemCount, isDrawerOpen, setIsDrawerOpen]);

  // Completely unmount if the cart is empty AND the drawer is closed
  if (itemCount === 0 && !isDrawerOpen) {
    return null;
  }

  return (
    <>
      {/* 
        We no longer conditionally unmount the button when the drawer opens.
        Instead, we pass 'isVisible' so it can elegantly hide itself without losing its saved position!
      */}
      <FloatingCartButton 
        itemCount={itemCount} 
        onOpenDrawer={() => setIsDrawerOpen(true)} 
        isVisible={!isDrawerOpen && itemCount > 0}
      />

      <CartDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        items={items} 
        totalPrice={totalPrice} 
        updateQuantity={updateQuantity} 
        removeFromCart={removeFromCart} 
        clearCart={clearCart} 
      />
    </>
  );
}