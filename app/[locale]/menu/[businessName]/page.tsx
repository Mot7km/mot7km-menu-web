import type { Metadata } from 'next';
import { MenuPage } from '@/components/layouts/MenuPage';
import { webMenuApi } from '@/lib/api/menuApi';

interface BusinessMenuPageProps {
  params: Promise<{ locale: string; businessName: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://menu.mot7km.store';

export async function generateMetadata({ params }: BusinessMenuPageProps): Promise<Metadata> {
  const { locale, businessName } = await params;
  const decodedBusinessName = decodeURIComponent(businessName);

  try {
    const store = await webMenuApi.getCompleteStoreData(decodedBusinessName);
    const brandName = store.displayBusinessName || store.businessName || decodedBusinessName;
    const description =
      store.header?.slogan ||
      store.identity?.businessDescription ||
      store.identity?.slogan ||
      `${brandName} digital menu`;
    const coverImage = store.header?.coverUrl || store.header?.backGroundImage;
    const logoUrl = store.header?.logo || store.header?.logoUrl || store.identity?.logo;
    const iconUrl = logoUrl
      ? `/api/tenant-icon?businessName=${encodeURIComponent(decodedBusinessName)}`
      : '/default-icon.png';

    return {
      title: brandName,
      description,
      applicationName: brandName,
      keywords: [brandName, 'digital menu', 'restaurant menu', 'QR menu'],
      icons: [
        { url: iconUrl, rel: 'icon' },
        { url: iconUrl, rel: 'apple-touch-icon' },
      ],
      alternates: {
        canonical: `${siteUrl}/${locale}/menu/${encodeURIComponent(decodedBusinessName)}`,
        languages: {
          en: `${siteUrl}/en/menu/${encodeURIComponent(decodedBusinessName)}`,
          ar: `${siteUrl}/ar/menu/${encodeURIComponent(decodedBusinessName)}`,
          'x-default': `${siteUrl}/en/menu/${encodeURIComponent(decodedBusinessName)}`,
        },
      },
      openGraph: {
        title: brandName,
        description,
        siteName: brandName,
        type: 'website',
        images: coverImage ? [{ url: coverImage }] : undefined,
      },
      twitter: {
        card: coverImage ? 'summary_large_image' : 'summary',
        title: brandName,
        description,
        images: coverImage ? [coverImage] : undefined,
      },
    };
  } catch {
    return { title: decodedBusinessName };
  }
}

export default async function BusinessMenuPage({ params }: BusinessMenuPageProps) {
  const { businessName } = await params;
  const decodedBusinessName = decodeURIComponent(businessName);
  let storeData = null;

  try {
    storeData = await webMenuApi.getCompleteStoreData(decodedBusinessName);
  } catch {
    storeData = null;
  }

  return <MenuPage initialStoreData={storeData} />;
}