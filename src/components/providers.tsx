'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode, useEffect } from 'react';
import { applyThemePalette, THEME_STORAGE_KEY } from '@/config/theme';
import { CartOverlay } from '@/components/cart/CartOverlay';
import { LocaleTransitionProvider } from '@/context/LocaleTransitionContext';
import { StoreProvider as ReduxStoreProvider } from '@/store/StoreProvider';

interface ProvidersProps {
  children: ReactNode;
}

function ThemePaletteInitializer() {
  useEffect(() => {
    // Initialize unified theme styles once on app mount
    applyThemePalette();
  }, []);

  return null;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ReduxStoreProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey={THEME_STORAGE_KEY}>
        <ThemePaletteInitializer />
        <LocaleTransitionProvider>
          {children}
          <CartOverlay />
        </LocaleTransitionProvider>
      </ThemeProvider>
    </ReduxStoreProvider>
  );
}
