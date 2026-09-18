'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { webMenuApi } from '@/lib/api/menuApi';
import { Loader } from '@/components/ui/Loader';

export default function MenuSearchPage() {
  const locale = useLocale();
  const t = useTranslations();
  const [businesses, setBusinesses] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    webMenuApi.getBusinesses().then((result) => {
      if (active) setBusinesses(result || []);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const filteredBusinesses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return businesses.filter((business) => business.toLowerCase().includes(normalizedQuery));
  }, [businesses, query]);

  return (
    <main className="min-h-screen bg-[var(--color-background)] px-6 py-16 text-[var(--color-text-primary)]">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">MOT7KM</p>
        <h1 className="mt-4 text-4xl font-black sm:text-6xl">Find a menu</h1>
        <p className="mt-4 text-lg text-[var(--color-text-muted)]">Search for a business menu to get started.</p>

        <label className="relative mt-8 block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-text-muted)]" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search menus"
            className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] py-4 pl-12 pr-4 text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)]"
            autoFocus
          />
        </label>

        <div className="mt-8 min-h-32">
          {loading ? (
            <Loader variant="section" text={t('loading.page')} />
          ) : filteredBusinesses.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredBusinesses.map((business) => (
                <Link
                  key={business}
                  href={`/${locale}/menu/${encodeURIComponent(business)}`}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 font-semibold transition-colors hover:border-[var(--color-primary)]"
                >
                  {business}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-[var(--color-text-muted)]">No menus found.</p>
          )}
        </div>
      </div>
    </main>
  );
}