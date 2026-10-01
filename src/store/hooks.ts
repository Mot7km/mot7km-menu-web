'use client';

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { Product } from '@/data/menu';
import {
  addItem,
  clearCart as clearCartAction,
  removeItem as removeItemAction,
  setDrawerOpen,
  updateQuantity as updateQuantityAction,
} from './cartSlice';
import type { AppDispatch, RootState } from './index';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

/**
 * Isolated hook for adding items to the cart.
 * Crucially, does NOT subscribe to cart state, preventing unnecessary re-renders of product cards!
 */
export function useAddToCart() {
  const dispatch = useAppDispatch();
  return useCallback(
    (product: Product, selections: Record<string, string> = {}, quantity = 1) => {
      dispatch(addItem({ product, selections, quantity }));
    },
    [dispatch]
  );
}

/**
 * Lightweight selector for cart totals.
 * Only components that display the badge/count or checkout total will re-render when totals change.
 */
export function useCartSummary() {
  const items = useAppSelector((state) => state.cart.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0);
  return { itemCount, totalPrice };
}

/**
 * Hook for cart drawer controls and items.
 */
export function useCartDrawer() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const isDrawerOpen = useAppSelector((state) => state.cart.isDrawerOpen);

  const setIsDrawerOpen = useCallback(
    (isOpen: boolean) => dispatch(setDrawerOpen(isOpen)),
    [dispatch]
  );
  const updateQuantity = useCallback(
    (itemId: string, delta: number) => dispatch(updateQuantityAction({ itemId, delta })),
    [dispatch]
  );
  const removeFromCart = useCallback(
    (itemId: string) => dispatch(removeItemAction(itemId)),
    [dispatch]
  );
  const clearCart = useCallback(
    () => dispatch(clearCartAction()),
    [dispatch]
  );

  return {
    items,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
  };
}

/**
 * Combined cart hook for full cart management in checkout and details pages.
 */
export function useCart() {
  const addToCart = useAddToCart();
  const { itemCount, totalPrice } = useCartSummary();
  const {
    items,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCartDrawer();

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
    totalPrice,
    isDrawerOpen,
    setIsDrawerOpen,
  };
}

export type { CartItem } from './cartSlice';
