'use client';

import Link from 'next/link';
import { Store } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

export function MenuNotFound() {
  const locale = useLocale();
  const t = useTranslations('notFound');

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center shadow-[var(--shadow-card)] sm:p-12">
        <Store className="mx-auto mb-5 h-10 w-10 text-[var(--color-primary)]" aria-hidden="true" />
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">{t('title')}</h1>
        <p className="mx-auto mt-3 max-w-sm text-[var(--color-text-muted)]">{t('description')}</p>
        <Link href={`/${locale}`} className="mt-8 inline-flex rounded-full bg-[var(--color-primary)] px-6 py-3 font-semibold text-[var(--color-text-on-primary)]">
          {t('goHome')}
        </Link>
      </div>
    </div>
  );
}