'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode, useEffect } from 'react';
import { applyThemePalette, getStoredThemePalette, THEME_STORAGE_KEY } from '@/config/theme';
import { CartProvider } from '@/context/CartContext';
import { CartOverlay } from '@/components/cart/CartOverlay';
import { LocaleTransitionProvider } from '@/context/LocaleTransitionContext';
import { StoreProvider } from '@/context/StoreContext';

interface ProvidersProps {
  children: ReactNode;
}

function ThemePaletteInitializer() {
  useEffect(() => {
    const syncPalette = () => {
      applyThemePalette(getStoredThemePalette());
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
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey={THEME_STORAGE_KEY}>
      <ThemePaletteInitializer />
      <LocaleTransitionProvider>
        <StoreProvider>
          <CartProvider>
            {children}
            <CartOverlay />
          </CartProvider>
        </StoreProvider>
      </LocaleTransitionProvider>
    </ThemeProvider>
  );
}
