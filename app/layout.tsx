import './globals.css';

/**
 * Root layout — required by Next.js 16 to define <html> and <body>.
 * The locale-specific layout (app/[locale]/layout.tsx) sets the actual
 * lang/dir attributes and injects fonts. suppressHydrationWarning is
 * needed because child layouts mutate these attributes on the client.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}