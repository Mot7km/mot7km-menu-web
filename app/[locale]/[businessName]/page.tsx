import type { Metadata } from 'next';
import { MenuPage } from '@/components/layouts/MenuPage';
import { InitialStoreProvider } from '@/context/InitialStoreContext';
import { webMenuApi } from '@/lib/api/menuApi';
import { generateThemeVariables } from '@/config/theme';

export const revalidate = 60;

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
        canonical: `${siteUrl}/${locale}/${encodeURIComponent(decodedBusinessName)}`,
        languages: {
          en: `${siteUrl}/en/${encodeURIComponent(decodedBusinessName)}`,
          ar: `${siteUrl}/ar/${encodeURIComponent(decodedBusinessName)}`,
          'x-default': `${siteUrl}/en/${encodeURIComponent(decodedBusinessName)}`,
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

  let themeStyles = null;
  if (storeData?.identity?.colors) {
    const { light, dark } = generateThemeVariables(storeData.identity.colors);
    const lightCss = Object.entries(light).map(([k, v]) => `${k}:${v};`).join('');
    const darkCss = Object.entries(dark).map(([k, v]) => `${k}:${v};`).join('');
    themeStyles = (
      <style
        id="tenant-theme-tokens"
        dangerouslySetInnerHTML={{
          __html: `:root { ${lightCss} } .dark { ${darkCss} }`,
        }}
      />
    );
  }

  const rawCover = storeData?.header?.coverUrl || storeData?.header?.backGroundImage;
  const coverImage = typeof rawCover === 'string' && rawCover.trim() ? rawCover.trim() : null;

  return (
    <InitialStoreProvider data={storeData}>
      {coverImage && (
        <link
          rel="preload"
          as="image"
          href={coverImage}
        />
      )}
      {themeStyles}
      <MenuPage />
    </InitialStoreProvider>
  );
}
