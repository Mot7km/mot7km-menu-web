import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { Roboto, Cairo } from "next/font/google";
import { Providers } from "@/components/providers";
import { i18n } from "@/config/i18n";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-roboto",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-cairo",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://menu.mot7km.store";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MOT7KM — Digital Menus",
    template: "%s | MOT7KM",
  },
  description: "Discover digital restaurant menus with MOT7KM.",
  icons: [{ url: "/default-icon.png", rel: "icon" }],
};

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
      className={`h-full antialiased ${roboto.variable} ${cairo.variable}`}
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