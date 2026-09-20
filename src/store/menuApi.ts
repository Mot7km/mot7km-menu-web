import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  ApiBusinessMenu,
  ApiBusinessIdentity,
  ApiCategory,
  ApiProduct,
  ApiSliderItem,
  ApiStoreHeader,
} from '@/lib/types/menuApi';

export interface CompleteStoreData {
  businessName: string;
  displayBusinessName: string;
  menuId: number;
  identity: ApiBusinessIdentity | null;
  header: ApiStoreHeader | null;
  sliders: ApiSliderItem[] | null;
  sliderHeader: string | null;
  categories: ApiCategory[] | null;
  products: ApiProduct[] | null;
}

function normalizeMenu(rawMenu: ApiBusinessMenu, requestedBusinessName: string): CompleteStoreData {
  const categories = rawMenu.categories?.map((category) => ({
    ...category,
    categoryName: category.categoryName || category.category_Name || category.name || `Category ${category.id}`,
    categoryImageUrl: category.categoryImageUrl || category.imageUrl,
    productCount: category.products?.length ?? category.productCount,
  })) || [];

  const products = categories.flatMap((category) =>
    (category.products || []).map((product) => ({
      ...product,
      categoryId: product.categoryId ?? Number(category.id),
      categoryName: product.categoryName ?? category.categoryName,
    }))
  );

  const sliderItems = rawMenu.sliders?.sliderItems || [];

  return {
    businessName: rawMenu.businessName || requestedBusinessName,
    displayBusinessName: rawMenu.displayBusinessName || rawMenu.businessName || requestedBusinessName,
    menuId: 0,
    identity: rawMenu.businessIdentity || null,
    header: rawMenu.header || null,
    sliders: sliderItems,
    sliderHeader: rawMenu.sliders?.sliderHeader || null,
    categories,
    products,
  };
}

export const menuApi = createApi({
  reducerPath: 'menuApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    getMenu: builder.query<CompleteStoreData, string>({
      query: (businessName) => `/api/menu/${encodeURIComponent(businessName)}`,
      transformResponse: (data: ApiBusinessMenu, _, businessName) => normalizeMenu(data, businessName),
    }),
  }),
});

export const { useGetMenuQuery } = menuApi;
