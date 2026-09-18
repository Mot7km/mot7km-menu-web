interface ProductLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string; id: string }>;
}

export default async function ProductLayout({ children, params }: ProductLayoutProps) {
  await params;

  return <div className="min-h-screen bg-[var(--color-background)]">{children}</div>;
}