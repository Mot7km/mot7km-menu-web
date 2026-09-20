'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function Home() {
  const locale = useLocale();
  return (
    <main className="min-h-screen bg-[var(--color-background)] px-6 py-16 text-[var(--color-text-primary)]">
      <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center gap-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">MOT7KM</p>
        <h1 className="max-w-2xl text-5xl font-black leading-tight sm:text-7xl">Your menu, ready to be discovered.</h1>
        <p className="max-w-xl text-lg text-[var(--color-text-muted)]">A modern home for digital restaurant menus.</p>
        <div className="flex flex-wrap gap-3">
          <Link href={`/${locale}/info`} className="rounded-full bg-[var(--color-primary)] px-6 py-3 font-semibold text-[var(--color-text-on-primary)]">
            Learn more
          </Link>
          <Link href={`/${locale}/menu`} className="rounded-full border border-[var(--color-border)] px-6 py-3 font-semibold">
            Find a menu
          </Link>
        </div>
      </div>
    </main>
  );
}
