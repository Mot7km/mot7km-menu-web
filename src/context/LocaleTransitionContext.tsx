'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { GlobalLoadingOverlay } from '@/components/ui/GlobalLoadingOverlay';

interface LocaleTransitionContextValue {
  isTransitioning: boolean;
  startLocaleTransition: () => void;
}

const LocaleTransitionContext = createContext<LocaleTransitionContextValue | undefined>(undefined);

export function LocaleTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const locale = useLocale();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  const [lastLocale, setLastLocale] = useState(locale);
  const timeoutRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const startLocaleTransition = useCallback(() => {
    clearTimer();
    setIsTransitioning(true);
  }, [clearTimer]);

  useEffect(() => {
    if (!isTransitioning) return;

    const routeChanged = pathname !== lastPathname || locale !== lastLocale;

    clearTimer();

    if (routeChanged) {
      timeoutRef.current = window.setTimeout(() => {
        setLastPathname(pathname);
        setLastLocale(locale);
        setIsTransitioning(false);
      }, 300);
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      setIsTransitioning(false);
    }, 10_000);

    return () => clearTimer();
  }, [clearTimer, isTransitioning, pathname, locale, lastPathname, lastLocale]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const value = useMemo(
    () => ({
      isTransitioning,
      startLocaleTransition,
    }),
    [isTransitioning, startLocaleTransition]
  );

  return (
    <LocaleTransitionContext.Provider value={value}>
      {children}
      <GlobalLoadingOverlay isVisible={isTransitioning} />
    </LocaleTransitionContext.Provider>
  );
}

export function useLocaleTransition() {
  const context = useContext(LocaleTransitionContext);

  if (!context) {
    throw new Error('useLocaleTransition must be used within a LocaleTransitionProvider');
  }

  return context;
}
