'use client';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { PromotionalCarousel } from '@/components/features/PromotionalCarousel';
import Categories from '@/components/features/PromotionalCategories';
import ListContainer from '@/components/common/ListContainer';
import SearchBar from '@/components/common/SearchBar';
import { PageShell } from '@/components/layouts/PageShell';
import { useStore } from '@/context/StoreContext';
import Link from 'next/link';
import { MenuNotFound } from '@/components/common/MenuNotFound';

export default function Home() {
  const t = useTranslations();
  const locale = useLocale();
  const { products: storeProducts, categories: apiCategories, promoCards, loading, storeNotFound, businessName } = useStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(() => {
    if (!apiCategories?.length) return [];
    return [
      { id: 'All', label: t('common.all'), image: '' },
      ...apiCategories.map((category) => ({
        id: category.categoryName || category.category_Name || category.name || String(category.id),
        label: category.categoryName || category.category_Name || category.name || String(category.id),
        image: category.categoryImageUrl || category.imageUrl || '',
      })),
    ];
  }, [apiCategories, t]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    return storeProducts.filter((product) => {
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
      if (!matchesCategory) return false;
      if (!normalizedQuery) return true;
      const haystack = [
        product.name,
        product.description,
        product.category,
        ...(product.ingredients ?? []),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [activeCategory, normalizedQuery, storeProducts]);

  const sections = useMemo(() => {
    const result = [];
    result.push({
      type: 'products' as const,
      title: t('home.exploreItems'),
      data: filteredProducts,
      initialCount: 8,
      loadMoreCount: 4,
      showCount: true,
    });
    return result;
  }, [filteredProducts, t]);

  if (!loading && !businessName) {
    return (
      <main className="min-h-screen bg-[var(--color-background)] px-6 py-16 text-[var(--color-text-primary)]">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center gap-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">MOT7KM</p>
          <h1 className="max-w-2xl text-5xl font-black leading-tight sm:text-7xl">Your menu, ready to be discovered.</h1>
          <p className="max-w-xl text-lg text-[var(--color-text-muted)]">A mock landing page for the public menu experience.</p>
          <div className="flex flex-wrap gap-3">
            <Link href={`/${locale}/info`} className="rounded-full bg-[var(--color-primary)] px-6 py-3 font-semibold text-[var(--color-text-on-primary)]">
              Learn more
            </Link>
            <Link href={`/${locale}/menu`} className="rounded-full border border-[var(--color-border)] px-6 py-3 font-semibold">
              Open demo menu
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!loading && storeNotFound) return <MenuNotFound />;

  return (
    <PageShell showHeader showFooter>
      <div className="flex flex-col items-center justify-center">
        <>
            <section className="section-glow relative w-full px-4 pt-10 pb-8 sm:px-6 sm:pt-12 sm:pb-10 lg:px-8">
              <div className="mx-auto max-w-5xl md:max-w-6xl">
                <h2
                  className="accent-line mb-6 text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {t('home.specialOffers')}
                </h2>
                <PromotionalCarousel />
              </div>
            </section>
            <div className="section-divider-premium w-full max-w-3xl mx-auto" />
          </>

        <section className="section-glow relative w-full px-4 pb-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl md:max-w-6xl">
          <div className="relative">
            {categories.length > 0 && <div className="sticky top-0 z-30 bg-[var(--color-background)]/90 backdrop-blur-xl border-b border-[var(--color-border)]/50 pt-3 pb-1 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 mb-6 shadow-sm transition-all duration-300">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              <div className="flex w-full justify-center pt-1 pb-2">
                <Categories
                  categories={categories}
                  activeCategory={activeCategory}
                  onSelectCategory={setActiveCategory}
                />
              </div>
            </div>}

            <ListContainer sections={sections} loading={loading} />
          </div>
        </div>
      </section>
      </div>
    </PageShell>
  );
}
