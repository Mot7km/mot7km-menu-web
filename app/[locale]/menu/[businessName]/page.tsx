import type { Metadata } from 'next';
import { MenuPage } from '@/components/layouts/MenuPage';
import { webMenuApi } from '@/lib/api/menuApi';

interface BusinessMenuPageProps {
  params: Promise<{ locale: string; businessName: string }>;
}

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
        canonical: `/${locale}/menu/${encodeURIComponent(decodedBusinessName)}`,
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

export default function BusinessMenuPage() {
  return <MenuPage />;
}