// src/context/StoreContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { webMenuApi } from '@/lib/api/menuApi';
import type {
  ApiBusinessIdentity,
  ApiStoreHeader,
  ApiSliderItem,
  ApiCategory,
  ApiProduct,
} from '@/lib/types/menuApi';
import { applyThemePalette, normalizeThemePalette } from '@/config/theme';
import { StoreInfo } from '@/data/storeInfo';
import { Product } from '@/data/menu';
import { PromoCardData } from '@/data/menupromo';

export interface StoreContextType {
  loading: boolean;
  storeNotFound: boolean;
  businessName: string;
  menuId: number;
  identity: ApiBusinessIdentity | null;
  header: ApiStoreHeader | null;
  sliders: ApiSliderItem[];
  sliderHeader: string | null;
  categories: ApiCategory[];
  products: Product[];
  storeInfo: StoreInfo;
  promoCards: PromoCardData[];
  recordView: (productId: string | number) => void;
  refresh: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function useStore(): StoreContextType {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

interface StoreProviderProps {
  children: ReactNode;
  initialData?: any;
}

export function StoreProvider({ children, initialData }: StoreProviderProps) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [storeNotFound, setStoreNotFound] = useState(false);
  const [businessName, setBusinessName] = useState(initialData?.businessName || '');
  const [menuId, setMenuId] = useState(initialData?.menuId || 0);
  const [identity, setIdentity] = useState<ApiBusinessIdentity | null>(initialData?.identity || null);
  const [header, setHeader] = useState<ApiStoreHeader | null>(initialData?.header || null);
  const [apiSliders, setApiSliders] = useState<ApiSliderItem[]>(initialData?.sliders || []);
  const [sliderHeader, setSliderHeader] = useState<string | null>(initialData?.sliderHeader || null);
  const [apiCategories, setApiCategories] = useState<ApiCategory[]>(initialData?.categories || []);
  const [apiProducts, setApiProducts] = useState<ApiProduct[]>(initialData?.products || []);

  const loadData = async () => {
    try {
      setLoading(true);
      const segments = window.location.pathname.split('/').filter(Boolean);
      const requestedBusinessName = new URLSearchParams(window.location.search).get('businessName') ||
        (segments.length >= 2 && (segments[1] === 'en' || segments[1] === 'ar') ? decodeURIComponent(segments[0]) : undefined);
      if (!requestedBusinessName) {
        setIdentity(null);
        setHeader(null);
        setApiSliders([]);
        setSliderHeader(null);
        setApiCategories([]);
        setApiProducts([]);
        setStoreNotFound(true);
        return;
      }

      // Clear the previous tenant before applying the next tenant's branding.
      setBusinessName(requestedBusinessName);
      setIdentity(null);
      setHeader(null);
      setApiSliders([]);
      setSliderHeader(null);
      setApiCategories([]);
      setApiProducts([]);
      setStoreNotFound(false);

      const data = await webMenuApi.getCompleteStoreData(requestedBusinessName);
      const returnedName = data.header?.businessName || data.identity?.businessName;
      setStoreNotFound(Boolean(returnedName && returnedName.toLowerCase() !== requestedBusinessName.toLowerCase()) ||
        !data.header && !data.identity && !data.categories?.length && !data.products?.length);

      if (data.businessName) setBusinessName(data.businessName);
      if (data.menuId) setMenuId(data.menuId);
      setIdentity(data.identity);
      setHeader(data.header);
      setApiSliders(data.sliders || []);
      setSliderHeader(data.sliderHeader || null);
      setApiCategories(data.categories || []);
      setApiProducts(data.products || []);
    } catch (err) {
      console.error('[StoreProvider] Failed to fetch live menu data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [pathname]);

  // ─── Synchronize Brand Colors & Typography into DOM (Strictly 3 Colors) ───
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--font-arabic', 'sans-serif');
    root.style.setProperty('--font-english', 'sans-serif');
    root.style.setProperty('--font-display', 'sans-serif');

    const resolvedPalette = identity?.colors
      ? [identity.colors.primary, identity.colors.secondary, identity.colors.accent]
      : [];

    const validPalette = resolvedPalette.filter(
      (color): color is string => Boolean(color && typeof color === 'string' && color.trim())
    );

    if (validPalette.length >= 3) {
      applyThemePalette(normalizeThemePalette(validPalette));
    }

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

  // ─── Dynamic Browser Title / Tab Name ───
  useEffect(() => {
    const storeTitle =
      header?.businessName ||
      identity?.businessName ||
      businessName;
    const slogan =
      header?.slogan ||
      identity?.slogan ||
      '';

    if (storeTitle) {
      document.title = slogan ? `${storeTitle} — ${slogan}` : storeTitle;
    }
  }, [header, identity, businessName]);

  // ─── Map Header / Identity into unified StoreInfo ───
  const storeInfo = useMemo<StoreInfo>(() => {
    const name = header?.businessName || identity?.businessName || businessName;
    const phone = header?.phoneNumber || '';
    const address = header?.address || '';
    const addressAr = header?.addressAr || address;

    const workingHours = header?.workingHours?.length
      ? header.workingHours.map((wh) => ({
          day: wh.day,
          open: wh.open,
          close: wh.close,
        }))
      : [];

    const rawSocials = header?.socialLinks || header?.socials;

    const formatSocialUrl = (platform: string, handleOrUrl?: string | null) => {
      if (!handleOrUrl) return '';
      const val = handleOrUrl.trim();
      if (val.startsWith('http://') || val.startsWith('https://')) return val;
      if (platform === 'facebook') return `https://facebook.com/${val}`;
      if (platform === 'instagram') return `https://instagram.com/${val}`;
      if (platform === 'tiktok') return `https://tiktok.com/@${val.replace(/^@/, '')}`;
      if (platform === 'whatsapp') return `https://wa.me/${val.replace(/[^0-9]/g, '')}`;
      return val;
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
      phone,
      address,
      addressAr,
      mapUrl: address ? `https://maps.google.com/?q=${encodeURIComponent(address)}` : undefined,
      workingHours,
      socials,
    };
  }, [header, identity, businessName]);

  // ─── Map Sliders into PromoCardData ───
  const promoCards = useMemo<PromoCardData[]>(() => {
    if (apiSliders && apiSliders.length > 0) {
      return apiSliders.map((slider, index) => {
        const title = slider.header || slider.title || slider.name || slider.titleAr || '';
        const image = slider.imageUrl || slider.image || '';
        return {
          id: slider.id || index + 1,
          title,
          description: slider.desc || slider.description || slider.descriptionAr || '',
          badge: slider.badge || slider.badgeAr || '',
          image,
          gradient: slider.gradient || '',
          backgroundColor: slider.bgColor || undefined,
          textColor: 'text-white',
          badgeColor: 'text-[var(--color-accent)]',
          badgeBg: 'rgba(0, 0, 0, 0.4)',
          hasIcon: false,
        };
      });
    }
    return [];
  }, [apiSliders]);

  // ─── Map API Products to Application Product Type ───
  const products = useMemo<Product[]>(() => {
    if (apiProducts && apiProducts.length > 0) {
      return apiProducts.map((p) => {
        const rawPrice = p.price;
        const name = p.productName || p.product_Name || p.name || '';
        const image = p.productImageUrl || p.product_ImageUrl || p.image || '';
        const categoryName = p.categoryName || p.category || apiCategories.find((c) => String(c.id) === String(p.categoryId))?.categoryName || '';

        return {
          id: String(p.id),
          name,
          description: p.description || '',
          price: rawPrice === undefined || rawPrice === null || rawPrice === '' ? '' : String(rawPrice),
          rating: (p.rating ?? p.averageRating) == null ? '' : Number(p.rating ?? p.averageRating).toFixed(1),
          image,
          featured: true,
          category: categoryName,
          ingredients: p.ingredients || [],
          customizationOptions: p.customizationOptions || [],
          reviews: p.reviews?.map((r) => ({
            reviewer: r.reviewer || r.nameCustomer || 'Customer',
            date: r.date || r.createdAt || '',
            rating: r.rating || 5,
            comment: r.comment || r.content || '',
          })),
        };
      });
    }
    return [];
  }, [apiProducts, apiCategories]);

  // ─── Product View Tracking ───
  const recordView = (productId: string | number) => {
    webMenuApi.recordProductView(productId);
  };

  const value = {
    loading,
    storeNotFound,
    businessName,
    menuId,
    identity,
    header,
    sliders: apiSliders,
    sliderHeader,
    categories: apiCategories,
    products,
    storeInfo,
    promoCards,
    recordView,
    refresh: loadData,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
