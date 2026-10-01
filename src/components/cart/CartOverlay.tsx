'use client';

import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useCartSummary, useCartDrawer } from '@/store/hooks';
import { setBusinessName, setDrawerOpen } from '@/store/cartSlice';
import { FloatingCartButton } from './CartButton';
import { i18n } from '@/config/i18n';

const CartDrawer = dynamic(
  () => import('./CartDrawer').then((m) => m.CartDrawer),
  { ssr: false }
);

export function CartOverlay() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  // Centralized route parameter extraction
  const currentBusinessName = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    const hasLocale = segments[0] && i18n.locales.includes(segments[0] as never);
    const rawBusiness = hasLocale ? segments[1] : segments[0];
    return rawBusiness ? decodeURIComponent(rawBusiness) : null;
  }, [pathname]);

  // Synchronize tenant with Redux cart (clears cart if switching between different stores)
  useEffect(() => {
    dispatch(setBusinessName(currentBusinessName));
  }, [currentBusinessName, dispatch]);

  // Close the cart drawer immediately on navigation to prevent view transition overlap
  useEffect(() => {
    dispatch(setDrawerOpen(false));
  }, [pathname, dispatch]);

  const { itemCount, totalPrice } = useCartSummary();
  const {
    items,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCartDrawer();

  // Prevent ghost touch events from re-opening the drawer immediately after close.
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
    if (closeLockRef.current) return;
    setIsDrawerOpen(true);
  }, [setIsDrawerOpen]);

  useEffect(() => {
    return () => {
      if (closeLockTimerRef.current) clearTimeout(closeLockTimerRef.current);
    };
  }, []);

  // Only show the floating cart button on store pages (not on root / landing page)
  const isStorePage = Boolean(currentBusinessName);

  if ((itemCount === 0 && !isDrawerOpen) || !isStorePage) {
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