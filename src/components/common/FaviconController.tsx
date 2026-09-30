'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { i18n } from '@/config/i18n';

const DEFAULT_ICON = '/default-icon.png';

/**
 * Resolves the business name from a locale-prefixed pathname:
 * /{locale}/{businessName}[/{...nested}] → businessName, else undefined.
 */
function getBusinessNameFromPathname(pathname: string): string | undefined {
  const segments = pathname.split('/').filter(Boolean);
  if (i18n.locales.includes(segments[0] as never) && segments[1]) {
    return decodeURIComponent(segments[1]);
  }
  return undefined;
}

function setFavicon(href: string) {
  if (typeof document === 'undefined') return;
  for (const rel of ['icon', 'apple-touch-icon']) {
    let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
    if (!link) {
      link = document.createElement('link');
      link.rel = rel;
      document.head.appendChild(link);
    }
    if (link.href !== href) {
      link.href = href;
    }
  }
}

/**
 * Single owner of the dynamic favicon:
 * - Base URL (and the root locale route) shows the default icon.
 * - /{locale}/{businessName} and all of its nested pages show that
 *   business's logo (served via /api/tenant-icon), reverting on leave.
 */
export function FaviconController() {
  const pathname = usePathname();

  useEffect(() => {
    const businessName = getBusinessNameFromPathname(pathname);
    const href = businessName
      ? `/api/tenant-icon?businessName=${encodeURIComponent(businessName)}`
      : DEFAULT_ICON;
    setFavicon(new URL(href, window.location.origin).href);
  }, [pathname]);

  return null;
}
