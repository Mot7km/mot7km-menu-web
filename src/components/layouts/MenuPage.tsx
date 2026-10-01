'use client';

import { useCallback, useDeferredValue, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import Categories from '@/components/features/PromotionalCategories';
import ListContainer from '@/components/common/ListContainer';
import SearchBar from '@/components/common/SearchBar';
import { PageShell } from '@/components/layouts/PageShell';
import { useStore } from '@/store/storeHooks';
import { MenuNotFound } from '@/components/common/MenuNotFound';

import { PromotionalCarousel } from '@/components/features/PromotionalCarousel';
import { CarouselSkeleton, CategoriesSkeleton } from '@/components/skeletons';

export function MenuPage() {
  const t = useTranslations();
  const {
    products: storeProducts,
    categories: apiCategories,
    promoCards,
    loading,
    storeNotFound,
    sliderHeader
  } = useStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const handleSearchChange = useCallback((val: string) => {
    setSearchQuery(val);
  }, []);

  const handleSelectCategory = useCallback((id: string) => {
    setActiveCategory(id);
  }, []);

  const hasPromos = Boolean(promoCards?.length);

  const categories = useMemo(() => {
    if (!apiCategories?.length) return [];

    return [
      {
        id: 'All',
        label: t('common.all'),
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80',
      },
      ...apiCategories.map((category) => ({
        id: category.categoryName || category.category_Name || category.name || String(category.id),
        label: category.categoryName || category.category_Name || category.name || String(category.id),
        image: category.categoryImageUrl || category.imageUrl || '',
      })),
    ];
  }, [apiCategories, t]);

  const normalizedQuery = deferredSearchQuery.trim().toLowerCase();

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

  const sections = useMemo(() => [{
    type: 'products' as const,
    title: t('home.exploreItems'),
    data: filteredProducts,
    initialCount: 8,
    loadMoreCount: 4,
    showCount: true,
  }], [filteredProducts, t]);

  if (!loading && storeNotFound) return <MenuNotFound />;

  return (
    <PageShell showHeader showFooter>
      <div className="flex flex-col items-center justify-center">
        {loading && !hasPromos ? (
          <CarouselSkeleton />
        ) : hasPromos ? (
          <section className="relative w-full pt-6 pb-4 sm:pt-8 sm:pb-6">
            {sliderHeader && (
              <div className="mx-auto max-w-5xl md:max-w-6xl px-4 sm:px-6 lg:px-8">
                <h2
                  className="accent-line mb-4 text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {sliderHeader}
                </h2>
              </div>
            )}
            <div className="w-full">
              <PromotionalCarousel />
            </div>
          </section>
        ) : null}

        <section className="relative w-full px-4 pb-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl md:max-w-6xl">
            <div className="relative">
              {categories.length > 0 ? (
                <div
                  className="sticky top-0 z-30 bg-[var(--color-background)]/90 backdrop-blur-xl border-b border-[var(--color-border)]/50 pb-1 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 mb-6"
                  style={{ minHeight: '142px' }}
                >
                  <SearchBar value={searchQuery} onChange={handleSearchChange} />
                  <div className="flex w-full justify-center pb-2 min-h-[82px] items-center">
                    <Categories
                      categories={categories}
                      activeCategory={activeCategory}
                      onSelectCategory={handleSelectCategory}
                    />
                  </div>
                </div>
              ) : loading ? (
                <CategoriesSkeleton />
              ) : null}

              <ListContainer sections={sections} loading={loading} />
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}