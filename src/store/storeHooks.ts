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
import { formatSocialUrl } from '@/components/icons';

const EMPTY_SLIDERS: ApiSliderItem[] = [];
const EMPTY_CATEGORIES: ApiCategory[] = [];
const EMPTY_PRODUCTS: ApiProduct[] = [];

export function parseWorkingHours(raw: unknown, fallback?: unknown): WorkingHours[] {
  if (!raw && !fallback) return [];

  const mapItem = (item: Record<string, unknown>): WorkingHours | null => {
    let dayNum: number | null = null;
    if (typeof item.dayOfWeek === 'number') {
      dayNum = item.dayOfWeek;
    } else if (typeof item.day === 'number') {
      dayNum = item.day;
    } else if (item.dayOfWeek !== undefined) {
      const parsed = Number(item.dayOfWeek);
      if (!isNaN(parsed)) dayNum = parsed;
    } else if (item.day !== undefined) {
      if (typeof item.day === 'string') {
        const daysMap: Record<string, number> = {
          sunday: 0,
          monday: 1,
          tuesday: 2,
          wednesday: 3,
          thursday: 4,
          friday: 5,
          saturday: 6,
        };
        const mapped = daysMap[item.day.toLowerCase().trim()];
        if (mapped !== undefined) dayNum = mapped;
        else {
          const parsed = Number(item.day);
          if (!isNaN(parsed)) dayNum = parsed;
        }
      } else {
        const parsed = Number(item.day);
        if (!isNaN(parsed)) dayNum = parsed;
      }
    }

    if (dayNum === null || isNaN(dayNum) || dayNum < 0 || dayNum > 6) {
      return null;
    }

    const rawOpen = String(item.openTime ?? item.open ?? '').trim();
    const rawClose = String(item.closeTime ?? item.close ?? '').trim();

    // Normalize HH:mm:ss -> HH:mm
    const open = rawOpen.split(':').slice(0, 2).join(':');
    const close = rawClose.split(':').slice(0, 2).join(':');

    const isClosed =
      item.isClosed === true ||
      item.isOpen === false ||
      (!rawOpen && !rawClose);

    const dayName = typeof item.dayName === 'string' ? item.dayName : undefined;

    return {
      day: dayNum,
      open,
      close,
      isClosed,
      dayName,
    };
  };

  const tryParse = (val: unknown): WorkingHours[] => {
    if (!val) return [];

    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        return tryParse(parsed);
      } catch {
        return [];
      }
    }

    if (Array.isArray(val)) {
      return val
        .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
        .map(mapItem)
        .filter((item): item is WorkingHours => item !== null);
    }

    if (typeof val === 'object') {
      const obj = val as Record<string, unknown>;

      if (Array.isArray(obj.days)) {
        const parsed = tryParse(obj.days);
        if (parsed.length > 0) return parsed;
      }

      if (Array.isArray(obj.openClosedTimes)) {
        const parsed = tryParse(obj.openClosedTimes);
        if (parsed.length > 0) return parsed;
      }

      if ('open' in obj || 'openTime' in obj) {
        const single = mapItem(obj);
        if (single) return [single];
      }

      const values = Object.values(obj);
      if (values.length > 0 && typeof values[0] === 'object' && values[0] !== null) {
        const parsed = tryParse(values);
        if (parsed.length > 0) return parsed;
      }
    }

    return [];
  };

  const primary = tryParse(raw);
  if (primary.length > 0) return primary;
  return tryParse(fallback);
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
    if (!rawHeader && !rawDesc && !infoData) return null;

    return {
      businessName: rawHeader?.businessName || infoData?.businessName || initialData?.businessName || null,
      displayBusinessName: rawHeader?.displayBusinessName || infoData?.displayBusinessName || initialData?.displayBusinessName || null,
      ...rawHeader,
      slogan: rawHeader?.slogan || rawDesc || null,
      branches: rawHeader?.branches || (infoData as any)?.branches || null,
      workingHours: rawHeader?.workingHours || (infoData as any)?.workingHours || null,
      openClosedTimes: rawHeader?.openClosedTimes || (infoData as any)?.openClosedTimes || null,
      isCurrentlyOpen: rawHeader?.isCurrentlyOpen ?? (infoData as any)?.isCurrentlyOpen,
      isTemporarilyClosed: rawHeader?.isTemporarilyClosed ?? (infoData as any)?.isTemporarilyClosed,
      addressDetails: rawHeader?.addressDetails || (infoData as any)?.address || null,
      address: rawHeader?.address || (infoData as any)?.address?.formattedAddress || rawHeader?.addressDetails?.formattedAddress || null,
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
    const name = displayBusinessName || header?.displayBusinessName || header?.businessName || identity?.businessName || businessName;
    const address = header?.addressDetails?.formattedAddress || header?.address || '';
    const rawSocials = header?.socialLinks || header?.socials;
    const socials = rawSocials
      ? [
        rawSocials.whatsapp ? { platform: 'whatsapp' as const, url: formatSocialUrl('whatsapp', rawSocials.whatsapp) } : null,
        rawSocials.instagram ? { platform: 'instagram' as const, url: formatSocialUrl('instagram', rawSocials.instagram) } : null,
        rawSocials.facebook ? { platform: 'facebook' as const, url: formatSocialUrl('facebook', rawSocials.facebook) } : null,
        rawSocials.tiktok ? { platform: 'tiktok' as const, url: formatSocialUrl('tiktok', rawSocials.tiktok) } : null,
        (rawSocials.twitter || rawSocials.x) ? { platform: 'twitter' as const, url: formatSocialUrl('twitter', rawSocials.twitter || rawSocials.x) } : null,
        rawSocials.snapchat ? { platform: 'snapchat' as const, url: formatSocialUrl('snapchat', rawSocials.snapchat) } : null,
      ].filter(Boolean) as StoreInfo['socials']
      : [];

    const workingHours = parseWorkingHours(
      header?.workingHours,
      header?.openClosedTimes || (infoData as any)?.openClosedTimes
    );

    const mapUrl =
      header?.addressDetails?.mapsUrl?.trim() ||
      (address ? `https://maps.google.com/?q=${encodeURIComponent(address)}` : undefined);

    return {
      name,
      nameAr: name,
      phone: header?.phoneNumber || '',
      address,
      addressAr: header?.addressAr || address,
      mapUrl,
      workingHours,
      socials,
      businessDescription: infoData?.businessDescription || identity?.businessDescription || undefined,
      isCurrentlyOpen: header?.isCurrentlyOpen ?? (infoData as any)?.isCurrentlyOpen,
      isTemporarilyClosed: header?.isTemporarilyClosed ?? (infoData as any)?.isTemporarilyClosed,
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
