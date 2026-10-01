'use client';

import { Header } from '@/components/layouts/Header';
import { Footer } from '@/components/layouts/Footer';

interface PageShellProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function PageShell({ children, showHeader= false, showFooter = false }: PageShellProps) {

  return (
    <>
      {showHeader ? <Header /> : null}
      <main className="flex flex-1 flex-col">{children}</main>
      {showFooter ? <Footer /> : null}
    </>
  );
}
