import { useEffect, useMemo, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { skipToken } from '@reduxjs/toolkit/query';
import {
  useGetBusinessInfoQuery,
  useGetSlidersQuery,
  useGetCategoriesQuery,
  useGetProductsQuery,
  type CompleteStoreData,
} from './menuApi';
import { applyThemePalette } from '@/config/theme';
import { loadGoogleFont } from '@/helpers/fontLoader';
import { i18n, type Locale } from '@/config/i18n';
import type { ApiBusinessIdentity, ApiCategory, ApiProduct, ApiSliderItem, ApiStoreHeader } from '@/lib/types/menuApi';
import type { StoreInfo, WorkingHours } from '@/data/storeInfo';
import type { Product } from '@/data/menu';
import type { PromoCardData } from '@/data/menupromo';

const EMPTY_SLIDERS: ApiSliderItem[] = [];
const EMPTY_CATEGORIES: ApiCategory[] = [];
const EMPTY_PRODUCTS: ApiProduct[] = [];

function parseWorkingHours(raw: unknown): WorkingHours[] {
  if (!raw) return [];

  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return parseWorkingHours(parsed);
    } catch {
      return [];
    }
  }

  if (Array.isArray(raw)) {
    return raw
      .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
      .map((item) => ({
        day: typeof item.day === 'number' ? item.day : Number(item.day ?? 0),
        open: typeof item.open === 'string' ? item.open : String(item.open ?? ''),
        close: typeof item.close === 'string' ? item.close : String(item.close ?? ''),
      }))
      .filter((wh) => !isNaN(wh.day) && Boolean(wh.open) && Boolean(wh.close));
  }

  if (typeof raw === 'object') {
    const rawObj = raw as Record<string, unknown>;
    if ('open' in rawObj && 'close' in rawObj) {
      return [
        {
          day: typeof rawObj.day === 'number' ? rawObj.day : Number(rawObj.day ?? 0),
          open: String(rawObj.open ?? ''),
          close: String(rawObj.close ?? ''),
        },
      ].filter((wh) => !isNaN(wh.day) && Boolean(wh.open) && Boolean(wh.close));
    }
    const values = Object.values(rawObj);
    if (values.length > 0 && typeof values[0] === 'object' && values[0] !== null) {
      return parseWorkingHours(values);
    }
  }

  return [];
}

export interface StoreState {
  loading: boolean;
  storeNotFound: boolean;
  businessName: string;
  displayBusinessName: string;
  menuId: number;
  identity: ApiBusinessIdentity | null;
  header: ApiStoreHeader | null;
  sliders: ApiSliderItem[];
  sliderHeader: string | null;
  categories: ApiCategory[];
  products: Product[];
  storeInfo: StoreInfo;
  promoCards: PromoCardData[];
  refresh: () => Promise<void>;
}

/**
 * Custom hook that derives the complete normalized store state.
 * When called inside `StoreProvider`, this runs exactly ONCE for the whole tree.
 */
export function useStoreStateCalculation(initialData?: CompleteStoreData | null): StoreState {
  const pathname = usePathname();
  const segments = useMemo(() => pathname.split('/').filter(Boolean), [pathname]);
  const locale: Locale = i18n.locales.includes(segments[0] as Locale)
    ? (segments[0] as Locale)
    : i18n.defaultLocale;

  const requestedBusinessName = useMemo(() => {
    const businessSegment =
      segments[0] && (segments[0] === 'en' || segments[0] === 'ar') && segments[1]
        ? segments[1]
        : undefined;

    return businessSegment ? decodeURIComponent(businessSegment) : undefined;
  }, [segments]);

  const hasInitialData = Boolean(
    initialData && (initialData.categories?.length || initialData.products?.length || initialData.header)
  );

  const [forceFetch, setForceFetch] = useState(false);
  const shouldSkip = hasInitialData && !forceFetch;

  const queryArg = requestedBusinessName || skipToken;
  const infoQuery = useGetBusinessInfoQuery(queryArg, { skip: shouldSkip });
  const slidersQuery = useGetSlidersQuery(queryArg, { skip: shouldSkip });
  const categoriesQuery = useGetCategoriesQuery(queryArg, { skip: shouldSkip });
  const productsQuery = useGetProductsQuery(
    requestedBusinessName ? { businessName: requestedBusinessName } : skipToken,
    { skip: shouldSkip }
  );

  const loading = !hasInitialData && (infoQuery.isLoading || slidersQuery.isLoading || categoriesQuery.isLoading || productsQuery.isLoading);
  const isFetching = !shouldSkip && (infoQuery.isFetching || slidersQuery.isFetching || categoriesQuery.isFetching || productsQuery.isFetching);

  const infoData = infoQuery.data;
  const slidersData = slidersQuery.data;
  const categoriesData = categoriesQuery.data;
  const productsData = productsQuery.data;

  const businessName = infoData?.businessName || initialData?.businessName || requestedBusinessName || '';
  const displayBusinessName = infoData?.displayBusinessName || initialData?.displayBusinessName || businessName;
  const identity = infoData?.businessIdentity || initialData?.identity || null;

  const header = useMemo<ApiStoreHeader | null>(() => {
    const rawHeader = infoData?.header || initialData?.header;
    const rawDesc = infoData?.businessDescription || initialData?.identity?.businessDescription;
    if (!rawHeader && !rawDesc) return null;

    return {
      ...rawHeader,
      slogan: rawHeader?.slogan || rawDesc || null,
    };
  }, [infoData, initialData]);

  const sliders = slidersData?.sliderItems ?? initialData?.sliders ?? EMPTY_SLIDERS;
  const sliderHeader = slidersData?.sliderHeader || initialData?.sliderHeader || null;

  const rawCategories = categoriesData ?? initialData?.categories ?? EMPTY_CATEGORIES;
  const apiProducts = productsData ?? initialData?.products ?? EMPTY_PRODUCTS;

  // Build categories with productCount matching products from the dedicated products endpoint
  const categories = useMemo<ApiCategory[]>(() => {
    return rawCategories.map((c) => {
      const catProducts = apiProducts.filter((p) => Number(p.categoryId) === Number(c.id));
      return {
        ...c,
        categoryName: c.categoryName || c.category_Name || c.name || `Category ${c.id}`,
        categoryImageUrl: c.categoryImageUrl || c.imageUrl,
        productCount: catProducts.length,
        products: catProducts,
      };
    });
  }, [rawCategories, apiProducts]);

  const storeNotFound = Boolean(
    requestedBusinessName &&
    !hasInitialData &&
    !loading &&
    !isFetching &&
    (infoQuery.isError || (!infoData && !categoriesData && !productsData))
  );

  // Synchronize Google Fonts and Theme palette (runs once per tenant)
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const requestedArabic = identity?.typography?.arabicFont?.trim();
    const requestedEnglish = identity?.typography?.englishFont?.trim();

    let arabicFont = 'Cairo';
    if (requestedArabic && requestedArabic.toLowerCase() !== 'cairo' && requestedArabic.toLowerCase() !== 'string') {
      loadGoogleFont(requestedArabic);
      arabicFont = requestedArabic;
    }

    let englishFont = 'Roboto';
    if (requestedEnglish && requestedEnglish.toLowerCase() !== 'roboto' && requestedEnglish.toLowerCase() !== 'string') {
      loadGoogleFont(requestedEnglish);
      englishFont = requestedEnglish;
    }

    const arabicStack = `"${arabicFont}", "Cairo", sans-serif`;
    const englishStack = `"${englishFont}", "Roboto", sans-serif`;

    applyThemePalette(identity?.colors);

    root.style.setProperty('--font-arabic', arabicStack);
    root.style.setProperty('--font-english', englishStack);
    root.style.setProperty('--font-display', locale === 'ar' ? arabicStack : englishStack);
  }, [identity, locale]);

  // Synchronize document title
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const title = displayBusinessName || header?.businessName || identity?.businessName || businessName;
    const slogan = header?.slogan || identity?.slogan || '';

    if (title) document.title = slogan ? `${title} — ${slogan}` : title;
  }, [header, identity, businessName, displayBusinessName]);

  const storeInfo = useMemo<StoreInfo>(() => {
    const name = displayBusinessName || header?.businessName || identity?.businessName || businessName;
    const address = header?.address || '';
    const rawSocials = header?.socialLinks || header?.socials;
    const formatSocialUrl = (platform: string, value?: string | null) => {
      if (!value) return '';
      const handle = value.trim();
      if (handle.startsWith('http://') || handle.startsWith('https://')) return handle;
      if (platform === 'facebook') return `https://facebook.com/${handle}`;
      if (platform === 'instagram') return `https://instagram.com/${handle}`;
      if (platform === 'tiktok') return `https://tiktok.com/@${handle.replace(/^@/, '')}`;
      if (platform === 'whatsapp') return `https://wa.me/${handle.replace(/[^0-9]/g, '')}`;
      return handle;
    };
    const socials = rawSocials
      ? [
          rawSocials.whatsapp ? { platform: 'whatsapp' as const, url: formatSocialUrl('whatsapp', rawSocials.whatsapp) } : null,
          rawSocials.instagram ? { platform: 'instagram' as const, url: formatSocialUrl('instagram', rawSocials.instagram) } : null,
          rawSocials.facebook ? { platform: 'facebook' as const, url: formatSocialUrl('facebook', rawSocials.facebook) } : null,
          rawSocials.tiktok ? { platform: 'tiktok' as const, url: formatSocialUrl('tiktok', rawSocials.tiktok) } : null,
        ].filter(Boolean) as StoreInfo['socials']
      : [];

    return {
      name,
      nameAr: name,
      phone: header?.phoneNumber || '',
      address,
      addressAr: header?.addressAr || address,
      mapUrl: address ? `https://maps.google.com/?q=${encodeURIComponent(address)}` : undefined,
      workingHours: parseWorkingHours(header?.workingHours),
      socials,
      businessDescription: infoData?.businessDescription || identity?.businessDescription || undefined,
    };
  }, [header, identity, businessName, displayBusinessName, infoData]);

  const promoCards = useMemo<PromoCardData[]>(() => (Array.isArray(sliders) ? sliders : []).map((slider, index) => ({
    id: slider.id || index + 1,
    title: slider.header || slider.title || slider.name || slider.titleAr || '',
    description: slider.desc || slider.description || slider.descriptionAr || '',
    badge: slider.badge || slider.badgeAr || '',
    image: slider.imageUrl || slider.image || '',
    gradient: slider.gradient || '',
    backgroundColor: slider.bgColor || undefined,
    textColor: 'text-white',
    badgeColor: 'text-[var(--color-accent)]',
    badgeBg: 'rgba(0, 0, 0, 0.4)',
    hasIcon: false,
  })), [sliders]);

  const products = useMemo<Product[]>(() => (Array.isArray(apiProducts) ? apiProducts : []).map((product) => ({
    id: String(product.id),
    name: product.productName || product.product_Name || product.name || '',
    description: product.description || '',
    price: product.price === undefined || product.price === null || product.price === '' ? '' : String(product.price),
    rating: (product.rating ?? product.averageRating) == null ? '' : Number(product.rating ?? product.averageRating).toFixed(1),
    image: product.productImageUrl || product.product_ImageUrl || product.image || '',
    featured: Boolean(
      (product as { featured?: boolean; isFeatured?: boolean; is_Featured?: boolean }).featured ||
      (product as { featured?: boolean; isFeatured?: boolean; is_Featured?: boolean }).isFeatured ||
      (product as { featured?: boolean; isFeatured?: boolean; is_Featured?: boolean }).is_Featured
    ),
    category: product.categoryName || product.category || categories.find((category) => String(category.id) === String(product.categoryId))?.categoryName || '',
    ingredients: Array.isArray(product.ingredients) ? product.ingredients : [],
    customizationOptions: Array.isArray(product.customizationOptions) ? product.customizationOptions : [],
    reviews: Array.isArray(product.reviews) ? product.reviews.map((review) => ({
      reviewer: review.reviewer || review.nameCustomer || 'Customer',
      date: review.date || review.createdAt || '',
      rating: review.rating || 5,
      comment: review.comment || review.content || '',
    })) : undefined,
  })), [apiProducts, categories]);

  const refresh = useCallback(async () => {
    setForceFetch(true);
    await Promise.all([
      infoQuery.refetch(),
      slidersQuery.refetch(),
      categoriesQuery.refetch(),
      productsQuery.refetch(),
    ]);
  }, [infoQuery, slidersQuery, categoriesQuery, productsQuery]);

  return useMemo<StoreState>(() => ({
    loading,
    storeNotFound,
    businessName,
    displayBusinessName,
    menuId: 0,
    identity,
    header,
    sliders,
    sliderHeader,
    categories,
    products,
    storeInfo,
    promoCards,
    refresh,
  }), [
    loading,
    storeNotFound,
    businessName,
    displayBusinessName,
    identity,
    header,
    sliders,
    sliderHeader,
    categories,
    products,
    storeInfo,
    promoCards,
    refresh,
  ]);
}

export { useStore, StoreProvider, InitialStoreProvider } from '@/context/InitialStoreContext';
