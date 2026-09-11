import type { Metadata } from "next";
import { Cairo, Inter, Plus_Jakarta_Sans, Roboto } from "next/font/google";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { Providers } from "@/components/providers";
import { i18n } from "@/config/i18n";

const roboto = Roboto({
  variable: "--font-roboto",
   weight: ["300", "400", "500", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

import { webMenuApi } from "@/lib/api/menuApi";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const store = await webMenuApi.getCompleteStoreData();
    const title =
      store.header?.businessName ||
      store.identity?.businessName ||
      "MOT7KM — Smart Restaurant Solutions";
    const description =
      store.header?.slogan ||
      store.identity?.businessDescription ||
      store.identity?.slogan ||
      "A modern SaaS platform for restaurants: QR menus, POS, and ERP — all in one place.";
    const icons = store.header?.logoUrl || store.identity?.logo
      ? [{ url: (store.header?.logoUrl || store.identity?.logo)! }]
      : [{ url: "/icon.png" }];

    return {
      title,
      description,
      icons,
      openGraph: {
        title,
        description,
        images: store.header?.coverUrl ? [{ url: store.header.coverUrl }] : undefined,
      },
    };
  } catch {
    return {
      title: "MOT7KM — Smart Restaurant Solutions",
      description: "A modern SaaS platform for restaurants: QR menus, POS, and ERP — all in one place.",
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
      className={`${roboto.variable} ${cairo.variable} ${plusJakarta.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="flex min-h-full flex-col bg-[var(--color-background)] text-[var(--color-text-primary)] transition-colors duration-300"
        style={{ fontFamily: isRTL ? "var(--font-cairo)" : "var(--font-inter)" }}
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