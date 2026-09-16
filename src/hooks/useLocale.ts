import { usePathname } from 'next/navigation';
import { i18n } from '@/config/i18n';

export function useLocale() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const index = i18n.locales.includes(segments[0] as any) ? 0 : 1;
  const locale = i18n.locales.includes(segments[index] as any) ? segments[index] : i18n.defaultLocale;
  return locale;
}

export function useBusinessRoute() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const leadingLocale = i18n.locales.includes(segments[0] as any);
  const locale = (leadingLocale ? segments[0] : segments[1]) || i18n.defaultLocale;
  const businessName = !leadingLocale && segments.length > 1 ? decodeURIComponent(segments[0]) : undefined;
  const getPath = (suffix = '') => `${businessName ? `/${encodeURIComponent(businessName)}` : ''}/${locale}${suffix ? `/${suffix.replace(/^\//, '')}` : ''}`;
  return { locale, businessName, getPath };
}