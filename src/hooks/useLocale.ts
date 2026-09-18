import { usePathname, useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const segments = pathname.split('/').filter(Boolean);
  const locale = i18n.locales.includes(segments[0] as any) ? segments[0] : i18n.defaultLocale;
  const pathBusinessName = segments[1] === 'menu' && segments[2] ? decodeURIComponent(segments[2]) : undefined;
  const businessName = searchParams.get('businessName') || pathBusinessName;
  const getPath = (suffix = '') => `${businessName ? `/${locale}/menu/${encodeURIComponent(businessName)}` : `/${locale}`}${suffix ? `/${suffix.replace(/^\//, '')}` : ''}`;
  return { locale, businessName, getPath };
}