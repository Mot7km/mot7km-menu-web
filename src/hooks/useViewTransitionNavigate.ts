'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useViewTransitionNavigate() {
  const router = useRouter();

  const navigateWithTransition = useCallback(
    (href: string, onBeforeNavigate?: () => void) => {
      onBeforeNavigate?.();

      if (typeof document !== 'undefined' && 'startViewTransition' in document) {
        (document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
          router.push(href);
        });
      } else {
        router.push(href);
      }
    },
    [router]
  );

  return navigateWithTransition;
}
