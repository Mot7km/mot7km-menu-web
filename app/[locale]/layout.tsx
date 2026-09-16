import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { Providers } from "@/components/providers";
import { i18n } from "@/config/i18n";

import { webMenuApi } from "@/lib/api/menuApi";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ businessName?: string }> }): Promise<Metadata> {
  try {
    const { businessName } = await searchParams;
    if (!businessName) {
      return {
        icons: [{ url: "/default-icon.png", rel: "icon" }],
      };
    }
    const store = await webMenuApi.getCompleteStoreData(businessName);
    const brandName =
      store.header?.businessName ||
      store.identity?.businessName ||
      businessName;
    const title =
      brandName ||
      "MOT7KM — Smart Restaurant Solutions";
    const description =
      store.header?.slogan ||
      store.identity?.businessDescription ||
      store.identity?.slogan ||
      "A modern SaaS platform for restaurants: QR menus, POS, and ERP — all in one place.";
    const logoUrl = store.header?.logo || store.header?.logoUrl || store.identity?.logo;
    const iconUrl = logoUrl
      ? `/api/tenant-icon?businessName=${encodeURIComponent(businessName)}`
      : "/default-icon.png";

    const icons = [{ url: iconUrl, rel: "icon" as const }, { url: iconUrl, rel: "apple-touch-icon" as const }];

    return {
      title,
      description,
      icons,
      applicationName: brandName,
      keywords: [brandName, "digital menu", "restaurant menu", "QR menu"],
      alternates: {
        canonical: brandName ? `/${businessName}` : undefined,
      },
      openGraph: {
        title,
        description,
        siteName: brandName,
        images: store.header?.coverUrl || store.header?.backGroundImage
          ? [{ url: (store.header?.coverUrl || store.header?.backGroundImage)! }]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: logoUrl ? [logoUrl] : undefined,
      },
    };
  } catch {
    return {
      title: "MOT7KM — Smart Restaurant Solutions",
      description: "A modern SaaS platform for restaurants: QR menus, POS, and ERP — all in one place.",
      icons: [{ url: "/default-icon.png", rel: "icon" }],
    };
  }
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;

  if (!i18n.locales.includes(locale as any)) {
    notFound();
  }

  const isRTL = locale === 'ar';
  const messages = await getMessages({ locale });

  return (
    <html
      lang={locale}
      dir={isRTL ? "rtl" : "ltr"}
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body
        className="flex min-h-full flex-col bg-[var(--color-background)] text-[var(--color-text-primary)] transition-colors duration-300"
        style={{ fontFamily: isRTL ? "var(--font-arabic)" : "var(--font-english)" }}
      >
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}