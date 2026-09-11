// src/context/StoreContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, ReactNode } from 'react';
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
  businessName: string;
  menuId: number;
  identity: ApiBusinessIdentity | null;
  header: ApiStoreHeader | null;
  sliders: ApiSliderItem[];
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
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState(initialData?.businessName || 'iiimot7km');
  const [menuId, setMenuId] = useState(initialData?.menuId || 4);
  const [identity, setIdentity] = useState<ApiBusinessIdentity | null>(initialData?.identity || null);
  const [header, setHeader] = useState<ApiStoreHeader | null>(initialData?.header || null);
  const [apiSliders, setApiSliders] = useState<ApiSliderItem[]>(initialData?.sliders || []);
  const [apiCategories, setApiCategories] = useState<ApiCategory[]>(initialData?.categories || []);
  const [apiProducts, setApiProducts] = useState<ApiProduct[]>(initialData?.products || []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await webMenuApi.getCompleteStoreData();

      if (data.businessName) setBusinessName(data.businessName);
      if (data.menuId) setMenuId(data.menuId);
      if (data.identity) setIdentity(data.identity);
      if (data.header) setHeader(data.header);
      if (data.sliders) setApiSliders(data.sliders);
      if (data.categories) setApiCategories(data.categories);
      if (data.products) setApiProducts(data.products);
    } catch (err) {
      console.error('[StoreProvider] Failed to fetch live menu data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ─── Synchronize Brand Colors & Typography into DOM (Strictly 3 Colors) ───
  useEffect(() => {
    if (identity?.colors) {
      const { primary, secondary, accent } = identity.colors;
      if (primary && primary !== 'string') {
        const custom3Colors = [
          primary,
          secondary && secondary !== 'string' ? secondary : primary,
          accent && accent !== 'string' ? accent : primary,
        ];
        const normalized = normalizeThemePalette(custom3Colors);
        applyThemePalette(normalized);
      }
    }

    if (identity?.typography) {
      const root = document.documentElement;
      if (identity.typography.arabicFont && identity.typography.arabicFont !== 'string') {
        root.style.setProperty('--font-cairo', identity.typography.arabicFont);
      }
      if (identity.typography.englishFont && identity.typography.englishFont !== 'string') {
        root.style.setProperty('--font-inter', identity.typography.englishFont);
        root.style.setProperty('--font-roboto', identity.typography.englishFont);
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

    const workingHours = (header?.workingHours && header.workingHours.length > 0)
      ? header.workingHours.map((wh) => ({
          day: wh.day,
          open: wh.open,
          close: wh.close,
        }))
      : [
          { day: 0, open: '10:00', close: '00:00' },
          { day: 1, open: '10:00', close: '00:00' },
          { day: 2, open: '10:00', close: '00:00' },
          { day: 3, open: '10:00', close: '00:00' },
          { day: 4, open: '10:00', close: '00:00' },
          { day: 5, open: '12:00', close: '02:00' },
          { day: 6, open: '12:00', close: '02:00' },
        ];

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
        const title = slider.title || slider.name || slider.titleAr || 'Special Offer';
        const image = slider.imageUrl || slider.image || '';
        return {
          id: slider.id || index + 1,
          title,
          description: slider.description || slider.descriptionAr || '',
          badge: slider.badge || slider.badgeAr || '',
          image,
          gradient: slider.gradient || 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
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
        const priceNum = typeof rawPrice === 'number'
          ? rawPrice
          : parseFloat(String(rawPrice || '0').replace(/[^0-9.]/g, '')) || 0;

        const name = p.productName || p.product_Name || p.name || 'Product';
        const image = p.productImageUrl || p.product_ImageUrl || p.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80';
        const categoryName = p.categoryName || p.category || (apiCategories.find((c) => String(c.id) === String(p.categoryId))?.categoryName ?? 'General');

        return {
          id: String(p.id),
          name,
          description: p.description || '',
          price: `$${priceNum.toFixed(2)}`,
          rating: (p.rating || p.averageRating) ? Number(p.rating || p.averageRating).toFixed(1) : '5.0',
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
    businessName,
    menuId,
    identity,
    header,
    sliders: apiSliders,
    categories: apiCategories,
    products,
    storeInfo,
    promoCards,
    recordView,
    refresh: loadData,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
