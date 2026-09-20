'use client';

import { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetMenuQuery } from './menuApi';
import { applyThemePalette, normalizeThemePalette } from '@/config/theme';
import type { ApiBusinessIdentity, ApiCategory, ApiProduct, ApiSliderItem, ApiStoreHeader } from '@/lib/types/menuApi';
import type { StoreInfo } from '@/data/storeInfo';
import type { Product } from '@/data/menu';
import type { PromoCardData } from '@/data/menupromo';

const EMPTY_SLIDERS: ApiSliderItem[] = [];
const EMPTY_CATEGORIES: ApiCategory[] = [];
const EMPTY_PRODUCTS: ApiProduct[] = [];

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

export function useStore(): StoreState {
  const pathname = usePathname();
  const requestedBusinessName = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    const businessName = segments[0] && (segments[0] === 'en' || segments[0] === 'ar') && segments[1] === 'menu'
      ? segments[2]
      : undefined;

    return businessName ? decodeURIComponent(businessName) : undefined;
  }, [pathname]);
  const menuQuery = useGetMenuQuery(requestedBusinessName || skipToken);
  const data = menuQuery.data;
  const loading = menuQuery.isLoading || menuQuery.isFetching;
  const businessName = data?.businessName || requestedBusinessName || '';
  const displayBusinessName = data?.displayBusinessName || businessName;
  const identity = data?.identity || null;
  const header = data?.header || null;
  const sliders = data?.sliders ?? EMPTY_SLIDERS;
  const categories = data?.categories ?? EMPTY_CATEGORIES;
  const apiProducts = data?.products ?? EMPTY_PRODUCTS;
  const storeNotFound = Boolean(requestedBusinessName && !loading && (menuQuery.isError || !data));

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--font-arabic', 'sans-serif');
    root.style.setProperty('--font-english', 'sans-serif');
    root.style.setProperty('--font-display', 'sans-serif');

    const colors = identity?.colors
      ? [identity.colors.primary, identity.colors.secondary, identity.colors.accent]
      : [];
    const validColors = colors.filter(
      (color): color is string => Boolean(color && typeof color === 'string' && color.trim())
    );

    applyThemePalette(normalizeThemePalette(validColors));

    if (identity?.typography) {
      if (identity.typography.arabicFont && identity.typography.arabicFont !== 'string') {
        root.style.setProperty('--font-arabic', identity.typography.arabicFont);
      }
      if (identity.typography.englishFont && identity.typography.englishFont !== 'string') {
        root.style.setProperty('--font-english', identity.typography.englishFont);
        root.style.setProperty('--font-display', identity.typography.englishFont);
      }
    }
  }, [identity]);

  useEffect(() => {
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
      workingHours: header?.workingHours?.map(({ day, open, close }) => ({ day, open, close })) || [],
      socials,
    };
  }, [header, identity, businessName, displayBusinessName]);

  const promoCards = useMemo<PromoCardData[]>(() => sliders.map((slider, index) => ({
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

  const products = useMemo<Product[]>(() => apiProducts.map((product) => ({
    id: String(product.id),
    name: product.productName || product.product_Name || product.name || '',
    description: product.description || '',
    price: product.price === undefined || product.price === null || product.price === '' ? '' : String(product.price),
    rating: (product.rating ?? product.averageRating) == null ? '' : Number(product.rating ?? product.averageRating).toFixed(1),
    image: product.productImageUrl || product.product_ImageUrl || product.image || '',
    featured: true,
    category: product.categoryName || product.category || categories.find((category) => String(category.id) === String(product.categoryId))?.categoryName || '',
    ingredients: product.ingredients || [],
    customizationOptions: product.customizationOptions || [],
    reviews: product.reviews?.map((review) => ({
      reviewer: review.reviewer || review.nameCustomer || 'Customer',
      date: review.date || review.createdAt || '',
      rating: review.rating || 5,
      comment: review.comment || review.content || '',
    })),
  })), [apiProducts, categories]);

  return {
    loading,
    storeNotFound,
    businessName,
    displayBusinessName,
    menuId: data?.menuId || 0,
    identity,
    header,
    sliders,
    sliderHeader: data?.sliderHeader || null,
    categories,
    products,
    storeInfo,
    promoCards,
    refresh: async () => { await menuQuery.refetch(); },
  };
}
