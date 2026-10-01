'use client';

import React, { createContext, useContext } from 'react';
import type { CompleteStoreData } from '@/store/menuApi';
import { useStoreStateCalculation, type StoreState } from '@/store/storeHooks';

export const StoreContext = createContext<StoreState | null>(null);

const FALLBACK_STORE_STATE: StoreState = {
  loading: false,
  storeNotFound: false,
  businessName: '',
  displayBusinessName: '',
  menuId: 0,
  identity: null,
  header: null,
  sliders: [],
  sliderHeader: null,
  categories: [],
  products: [],
  storeInfo: {
    name: '',
    nameAr: '',
    phone: '',
    address: '',
    addressAr: '',
    workingHours: [],
    socials: [],
  },
  promoCards: [],
  refresh: async () => {},
};

export function StoreProvider({
  data,
  children,
}: {
  data?: CompleteStoreData | null;
  children: React.ReactNode;
}) {
  const storeState = useStoreStateCalculation(data);
  return <StoreContext.Provider value={storeState}>{children}</StoreContext.Provider>;
}

export const InitialStoreProvider = StoreProvider;

export function useStore(): StoreState {
  const context = useContext(StoreContext);
  return context || FALLBACK_STORE_STATE;
}

export function useInitialStoreContext(): StoreState | null {
  return useContext(StoreContext);
}

export type { StoreState } from '@/store/storeHooks';
