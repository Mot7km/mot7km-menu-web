'use client';

import { use, useCallback, useMemo, useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { CustomizationOptions } from '@/components/features/CustomizationOptions';
import ListContainer from '@/components/common/ListContainer';
import { ArrowLeft, Sparkles, Star } from 'lucide-react';
import { useCart } from '@/store/hooks';
import { AddToCartBar } from '@/components/cart/AddToCartBar';
import { useStore } from '@/store/storeHooks';
import { useBusinessRoute } from '@/hooks/useLocale';
import { skipToken } from '@reduxjs/toolkit/query';
import {
  useGetProductDetailsQuery,
  useGetProductReviewsQuery,
} from '@/store/menuApi';
import { webMenuApi } from '@/lib/api/menuApi';
import type { Product, Review } from '@/data/menu';

export default function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const t = useTranslations();
  const { addToCart } = useCart();
  const { products: storeProducts, loading, businessName, refresh } = useStore();
  const { getPath } = useBusinessRoute();

  const [selections, setSelections] = useState<Record<string, string>>({});
  const [extraTotal, setExtraTotal] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);

  const baseProduct = useMemo(
    () => storeProducts.find((p) => p.id === id),
    [storeProducts, id]
  );

  // RTK Query — deduplicates the request so the view counter increments exactly once,
  // even across client-side navigation where businessName loads asynchronously.
  const productQueryArg =
    businessName && !isNaN(Number(id))
      ? { businessName, productId: Number(id) }
      : skipToken;

  const { data: productDetails } = useGetProductDetailsQuery(productQueryArg);
  const { data: apiReviews } = useGetProductReviewsQuery(productQueryArg);

  const product = useMemo<Product | undefined>(() => {
    if (!baseProduct && !productDetails) return undefined;

    // Normalize ingredients from productDetails
    const detailIngredients = productDetails?.ingredients?.map((ing) =>
      typeof ing === 'string' ? ing : ing.name
    );

    return {
      id,
      name: productDetails?.productName || baseProduct?.name || '',
      description: productDetails?.description || baseProduct?.description || '',
      price:
        productDetails?.price !== undefined && productDetails.price !== null
          ? String(productDetails.price)
          : baseProduct?.price || '',
      rating: baseProduct?.rating || '',
      image: productDetails?.productImageUrl || baseProduct?.image || '',
      featured: true,
      category: productDetails?.categoryName || baseProduct?.category || '',
      ingredients: detailIngredients || baseProduct?.ingredients || [],
      customizationOptions: baseProduct?.customizationOptions || [],
      reviews: baseProduct?.reviews || [],
    };
  }, [baseProduct, productDetails, id]);

  const reviews = useMemo<Review[]>(() => {
    if (apiReviews && apiReviews.length > 0) {
      return apiReviews.map((r) => ({
        reviewer: r.nameCustomer || 'Customer',
        date: r.createdAt || '',
        rating: r.rating || 5,
        comment: r.content || '',
      }));
    }
    return product?.reviews || [];
  }, [apiReviews, product?.reviews]);

  const [pendingReviews, setPendingReviews] = useState<Review[]>([]);
  const allReviews = useMemo(
    () => [...pendingReviews, ...reviews],
    [pendingReviews, reviews]
  );

  const handleAsyncReviewSubmit = useCallback(
    async (data: { reviewer: string; rating: number; comment: string }) => {
      const numericProductId = Number(id);
      if (businessName && !isNaN(numericProductId)) {
        const response = await webMenuApi.postProductReview(
          businessName,
          numericProductId,
          {
            rating: data.rating,
            nameCustomer: data.reviewer,
            content: data.comment,
          }
        );

        if (response) {
          const newReview: Review = {
            reviewer: response.nameCustomer || data.reviewer || 'Anonymous',
            rating: response.rating ?? data.rating,
            comment: response.content || data.comment,
            date: response.createdAt || new Date().toISOString(),
          };
          setPendingReviews((prev) => [newReview, ...prev]);
          refresh?.();
          return newReview;
        }
      }

      const fallbackReview: Review = {
        reviewer: data.reviewer || 'Anonymous',
        rating: data.rating,
        comment: data.comment,
        date: new Date().toISOString(),
      };
      setPendingReviews((prev) => [fallbackReview, ...prev]);
      return fallbackReview;
    },
    [id, businessName, refresh]
  );

  const reviewSections = useMemo(
    () => [
      {
        type: 'reviews' as const,
        data: allReviews,
        onAsyncReviewSubmit: handleAsyncReviewSubmit,
      },
    ],
    [allReviews, handleAsyncReviewSubmit]
  );

  const averageRating = useMemo(() => {
    if (allReviews.length > 0) {
      return (
        allReviews.reduce((acc, r) => acc + (r.rating || 5), 0) /
        allReviews.length
      ).toFixed(1);
    }
    return product?.rating || '';
  }, [allReviews, product?.rating]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[var(--color-text-muted)]">
        {t('loading.product')}
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const basePrice = parseFloat(product.price.replace('$', '')) || 0;

  const handleAddToCart = () => {
    addToCart(product, selections, quantity);
  };

  const heroHeight = 45; // sm:50, md:55, xl:60

  return (
    <div className="relative min-h-screen overflow-x-clip">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-primary)]/10 blur-[100px] rounded-full pointer-events-none animate-orb-1 -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--color-accent)]/10 blur-[80px] rounded-full pointer-events-none animate-orb-2 -z-10" />

      {/* Hero Image */}
      <div className="fixed inset-x-0 top-0 h-[45vh] sm:h-[50vh] md:h-[55vh] xl:h-[60vh] z-0 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30" />
      </div>

      {/* Back Button – FIXED and stays visible while scrolling */}
      <Link
        href={getPath()}
        className="fixed top-6 left-4 sm:left-6 lg:left-8 z-50
          inline-flex items-center justify-center w-10 h-10 sm:w-auto sm:px-4 sm:h-10 
          rounded-full glass-strong shadow-lg
          text-[var(--color-text-primary)] hover:text-[var(--color-primary)]
          transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer"
      >
        <ArrowLeft
          size={20}
          className="sm:mr-2 group-hover:-translate-x-1 transition-transform"
        />
        <span className="hidden sm:inline font-medium text-sm">
          {t('productPage.backToMenu')}
        </span>
      </Link>

      {/* Content Sheet */}
      <div
        className="relative z-10 w-full bg-[var(--color-background)] rounded-t-[2rem] sm:rounded-t-[3rem] shadow-[0_-12px_40px_rgba(0,0,0,0.15)] pt-8 sm:pt-10 md:pt-12 pb-32 px-4 sm:px-6 lg:px-8"
        style={{
          marginTop: `calc(${heroHeight}vh - 2rem)`,
          minHeight: `calc(100vh - ${heroHeight}vh + 2rem)`,
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="card-premium p-6 sm:p-8 md:p-10 space-y-8 animate-slide-up bg-[var(--color-surface)]">
            {/* Header */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 animate-fade-in stagger-1">
                    <Sparkles size={12} className="text-[var(--color-primary)]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
                      {product.category || t('productPage.noCategory')}
                    </span>
                  </div>
                  <h1 className="font-api text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--color-text-primary)] leading-tight tracking-tight animate-fade-in stagger-2">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-3 animate-fade-in stagger-3">
                    <div className="flex items-center bg-[var(--color-warning)]/10 px-2 py-1 rounded-full">
                      <Star
                        size={14}
                        className="text-[var(--color-warning)] fill-[var(--color-warning)] mr-1"
                      />
                      <span className="text-sm font-bold text-[var(--color-text-primary)]">
                        {averageRating ||
                          product.rating ||
                          t('productPage.noRating')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price Tag */}
                <div className="flex-shrink-0 animate-fade-in-up stagger-3">
                  <div className="relative group cursor-default">
                    <div className="absolute -inset-1 rounded-2xl opacity-75 blur-md bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] group-hover:opacity-100 transition-opacity duration-500 animate-pulse-glow" />
                    <div className="relative px-6 py-3 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-xl flex items-center justify-center">
                      <span className="gradient-text font-api font-black text-3xl md:text-4xl tracking-tight">
                        {product.price || t('productPage.noPrice')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-[var(--color-text-secondary)] text-base md:text-lg leading-relaxed max-w-3xl animate-fade-in stagger-4">
                {product.description || t('productPage.noDescription')}
              </p>
            </div>

            <div className="section-divider-premium animate-fade-in stagger-5" />

            {/* Ingredients */}
            <div className="space-y-4 animate-fade-in-up stagger-6">
              <h3 className="font-api font-bold text-lg sm:text-xl text-[var(--color-text-primary)] flex items-center gap-2">
                <div className="w-1.5 h-6 rounded-full bg-[var(--color-primary)]" />
                {t('productPage.ingredients')}
              </h3>
              {product.ingredients?.length ? (
                <div className="flex flex-wrap gap-2.5">
                  {product.ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="glass-subtle px-4 py-2 rounded-full text-sm font-medium text-[var(--color-text-primary)] shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 border-[var(--color-border)]"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-[var(--color-border)] px-4 py-5 text-center text-sm text-[var(--color-text-muted)]">
                  {t('productPage.noIngredients')}
                </div>
              )}
            </div>

            {/* Customization */}
            <div className="pt-2 animate-fade-in-up stagger-7">
              <CustomizationOptions
                product={product}
                onSelectionsChange={setSelections}
                onPriceChange={(total, extras) => setExtraTotal(extras)}
              />
            </div>

            {/* Reviews */}
            <div className="pt-6 animate-fade-in-up stagger-8">
              <ListContainer sections={reviewSections} />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Add to Cart Bar */}
      <AddToCartBar
        basePrice={basePrice}
        extraTotal={extraTotal}
        quantity={quantity}
        onQuantityChange={setQuantity}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}