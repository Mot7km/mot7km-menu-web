import type { Metadata } from 'next';
import { ProductDetailsClient } from '@/components/modules/ProductDetailsClient';
import { InitialStoreProvider } from '@/context/InitialStoreContext';
import { webMenuApi } from '@/lib/api/menuApi';
import { generateThemeVariables } from '@/config/theme';

export const revalidate = 60;

interface BusinessProductPageProps {
  params: Promise<{ locale: string; businessName: string; id: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://menu.mot7km.store';

export async function generateMetadata({ params }: BusinessProductPageProps): Promise<Metadata> {
  const { locale, businessName, id } = await params;
  const decodedBusinessName = decodeURIComponent(businessName);

  try {
    const store = await webMenuApi.getCompleteStoreData(decodedBusinessName);
    const brandName = store.displayBusinessName || store.businessName || decodedBusinessName;
    const product = store.products?.find((p) => String(p.id) === String(id));
    const title = product ? `${product.productName || product.name} | ${brandName}` : brandName;
    const description = product?.description || `${brandName} menu item`;
    const image = product?.productImageUrl || product?.image || store.header?.coverUrl || store.header?.backGroundImage;
    const logoUrl = store.header?.logo || store.header?.logoUrl || store.identity?.logo;
    const iconUrl = logoUrl
      ? `/api/tenant-icon?businessName=${encodeURIComponent(decodedBusinessName)}`
      : '/default-icon.png';

    return {
      title,
      description,
      applicationName: brandName,
      icons: [
        { url: iconUrl, rel: 'icon' },
        { url: iconUrl, rel: 'apple-touch-icon' },
      ],
      alternates: {
        canonical: `${siteUrl}/${locale}/${encodeURIComponent(decodedBusinessName)}/${encodeURIComponent(id)}`,
        languages: {
          en: `${siteUrl}/en/${encodeURIComponent(decodedBusinessName)}/${encodeURIComponent(id)}`,
          ar: `${siteUrl}/ar/${encodeURIComponent(decodedBusinessName)}/${encodeURIComponent(id)}`,
          'x-default': `${siteUrl}/en/${encodeURIComponent(decodedBusinessName)}/${encodeURIComponent(id)}`,
        },
      },
      openGraph: {
        title,
        description,
        siteName: brandName,
        type: 'website',
        images: image ? [{ url: image }] : undefined,
      },
      twitter: {
        card: image ? 'summary_large_image' : 'summary',
        title,
        description,
        images: image ? [image] : undefined,
      },
    };
  } catch {
    return { title: decodedBusinessName };
  }
}

export default async function BusinessProductPage({ params }: BusinessProductPageProps) {
  const { businessName, id } = await params;
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
      <ProductDetailsClient id={id} />
    </InitialStoreProvider>
  );
}
