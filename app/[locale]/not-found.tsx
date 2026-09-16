import { UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('notFound');
  const locale = useLocale();

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="card-premium w-full max-w-2xl p-8 text-center sm:p-12">
        {/* Brand icon – smaller, integrated */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] shadow-lg shadow-[var(--color-primary)]/20">
          <UtensilsCrossed strokeWidth={2.2} className="h-8 w-8 text-white" />
        </div>

        {/* 404 – gradient text with animation */}
        <h1
          className="gradient-text text-8xl font-extrabold leading-none tracking-tight sm:text-9xl md:text-[10rem] animate-gradient-shift"
          style={{
            fontFamily: 'var(--font-display)',
          }}
        >
          404
        </h1>

        <h2 className="mt-4 text-2xl font-semibold text-[var(--color-text-primary)] sm:text-3xl md:text-4xl">
          {t('title')}
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm text-[var(--color-text-muted)] sm:text-base md:text-lg">
          {t('description')}
        </p>

        <Link
          href={`/${locale}`}
          className="mt-8 inline-flex items-center rounded-full bg-[var(--color-primary)] px-8 py-3 font-medium text-[var(--color-text-on-primary)] shadow-md transition-all hover:bg-[var(--color-primary-dark)] hover:shadow-lg hover:scale-105 active:scale-95"
        >
          ← {t('goHome')}
        </Link>
      </div>
    </div>
  );
}