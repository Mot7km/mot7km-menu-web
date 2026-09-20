'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import type { Product } from '@/data/menu';
import {
  addItem,
  clearCart,
  removeItem,
  setBusinessName,
  setDrawerOpen,
  updateQuantity,
} from './cartSlice';
import type { AppDispatch, RootState } from './index';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export function useCart() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const businessName = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    const value = segments[0] && (segments[0] === 'en' || segments[0] === 'ar') && segments[1] === 'menu'
      ? segments[2]
      : undefined;
    return value ? decodeURIComponent(value) : null;
  }, [pathname]);
  const items = useAppSelector((state) => state.cart.items);
  const isDrawerOpen = useAppSelector((state) => state.cart.isDrawerOpen);

  useEffect(() => {
    dispatch(setBusinessName(businessName));
  }, [businessName, dispatch]);

  const addToCart = useCallback(
    (product: Product, selections: Record<string, string>, quantity = 1) => {
      dispatch(addItem({ product, selections, quantity }));
    },
    [dispatch]
  );
  const removeFromCart = useCallback((itemId: string) => dispatch(removeItem(itemId)), [dispatch]);
  const updateCartQuantity = useCallback(
    (itemId: string, delta: number) => dispatch(updateQuantity({ itemId, delta })),
    [dispatch]
  );
  const resetCart = useCallback(() => dispatch(clearCart()), [dispatch]);
  const setIsDrawerOpen = useCallback((isOpen: boolean) => dispatch(setDrawerOpen(isOpen)), [dispatch]);

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity: updateCartQuantity,
    clearCart: resetCart,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: items.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0),
    isDrawerOpen,
    setIsDrawerOpen,
  };
}

export type { CartItem } from './cartSlice';
