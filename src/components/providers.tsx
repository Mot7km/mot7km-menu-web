'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode, useEffect } from 'react';
import { applyThemePalette, getActiveThemePalette, THEME_STORAGE_KEY } from '@/config/theme';
import { CartOverlay } from '@/components/cart/CartOverlay';
import { LocaleTransitionProvider } from '@/context/LocaleTransitionContext';
import { StoreProvider as ReduxStoreProvider } from '@/store/StoreProvider';

interface ProvidersProps {
  children: ReactNode;
}

function ThemePaletteInitializer() {
  useEffect(() => {
    const syncPalette = () => {
      applyThemePalette(getActiveThemePalette());
    };

    syncPalette();

    const observer = new MutationObserver(() => {
      syncPalette();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
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
