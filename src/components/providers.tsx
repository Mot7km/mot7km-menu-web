'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { applyThemePalette, getStoredThemePalette, THEME_STORAGE_KEY } from '@/config/theme';
import { CartProvider } from '@/context/CartContext';
import { CartOverlay } from '@/components/cart/CartOverlay';
import { GlobalLoadingOverlay } from '@/components/ui/GlobalLoadingOverlay';
import { LocaleTransitionProvider } from '@/context/LocaleTransitionContext';
import { StoreProvider, useStore } from '@/context/StoreContext';

interface ProvidersProps {
  children: ReactNode;
}

function StoreLoadingOverlay() {
  const { loading } = useStore();
  const t = useTranslations();

  return <GlobalLoadingOverlay isVisible={loading} text={t('loading.store')} />;
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
          <StoreLoadingOverlay />
          <CartProvider>
            {children}
            <CartOverlay />
          </CartProvider>
        </StoreProvider>
      </LocaleTransitionProvider>
    </ThemeProvider>
  );
}
