'use client';

import React, { createContext, useContext } from 'react';
import type { CompleteStoreData } from '@/store/menuApi';

const InitialStoreContext = createContext<CompleteStoreData | null>(null);

export function InitialStoreProvider({
  data,
  children,
}: {
  data?: CompleteStoreData | null;
  children: React.ReactNode;
}) {
  return (
    <InitialStoreContext.Provider value={data || null}>
      {children}
    </InitialStoreContext.Provider>
  );
}

export function useInitialStoreContext(): CompleteStoreData | null {
  return useContext(InitialStoreContext);
}
