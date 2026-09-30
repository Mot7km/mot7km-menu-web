import { usePathname } from 'next/navigation';
import { i18n, type Locale } from '@/config/i18n';

export function useLocale() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const locale: Locale = i18n.locales.includes(segments[0] as Locale)
    ? segments[0] as Locale
    : i18n.defaultLocale;
  return locale;
}

export function useBusinessRoute() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const locale: Locale = i18n.locales.includes(segments[0] as Locale)
    ? segments[0] as Locale
    : i18n.defaultLocale;
  // New URL structure: /[locale]/[businessName]/[id]
  const businessName = segments[1] ? decodeURIComponent(segments[1]) : undefined;
  const getPath = (suffix = '') => `${businessName ? `/${locale}/${encodeURIComponent(businessName)}` : `/${locale}`}${suffix ? `/${suffix.replace(/^\//, '')}` : ''}`;
  return { locale, businessName, getPath };
}