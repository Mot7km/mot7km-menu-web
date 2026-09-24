import type { MetadataRoute } from 'next';
import { webMenuApi } from '@/lib/api/menuApi';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://menu.mot7km.store';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ['', '/info', '/menu'].flatMap((route) =>
    ['en', 'ar'].map((locale) => ({
      url: `${siteUrl}/${locale}${route}`,
      changeFrequency: 'daily' as const,
      priority: route === '' ? 1 : 0.7,
    }))
  );

  try {
    const businesses = await webMenuApi.getBusinesses();
    const menuRoutes = (businesses || []).flatMap((businessName) =>
      ['en', 'ar'].map((locale) => ({
        url: `${siteUrl}/${locale}/menu/${encodeURIComponent(businessName)}`,
        changeFrequency: 'daily' as const,
        priority: 0.8,
      }))
    );

    return [...staticRoutes, ...menuRoutes];
  } catch {
    return staticRoutes;
  }
}