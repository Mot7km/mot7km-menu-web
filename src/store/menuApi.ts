import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  ApiBusinessInfo,
  ApiBusinessMenu,
  ApiBusinessIdentity,
  ApiCategory,
  ApiProduct,
  ApiProductDetails,
  ApiReviewItem,
  ApiSliderItem,
  ApiSlidersResponse,
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
  tagTypes: ['Menu', 'BusinessInfo', 'Sliders', 'Categories', 'Products', 'Reviews'],
  endpoints: (builder) => ({
    getMenu: builder.query<CompleteStoreData, string>({
      query: (businessName) => `/api/menu/${encodeURIComponent(businessName)}`,
      transformResponse: (data: ApiBusinessMenu, _, businessName) => normalizeMenu(data, businessName),
      providesTags: (_result, _error, businessName) => [{ type: 'Menu', id: businessName }],
    }),

    /** GET /api/menu/{businessName}/info — Theme, branding & store headers */
    getBusinessInfo: builder.query<ApiBusinessInfo, string>({
      query: (businessName) => `/api/menu/${encodeURIComponent(businessName)}/info`,
      providesTags: (_result, _error, businessName) => [{ type: 'BusinessInfo', id: businessName }],
    }),

    /** GET /api/menu/{businessName}/sliders — Promotional carousels and sliders */
    getSliders: builder.query<ApiSlidersResponse, string>({
      query: (businessName) => `/api/menu/${encodeURIComponent(businessName)}/sliders`,
      providesTags: (_result, _error, businessName) => [{ type: 'Sliders', id: businessName }],
    }),

    /** GET /api/menu/{businessName}/categories — Categories list */
    getCategories: builder.query<ApiCategory[], string>({
      query: (businessName) => `/api/menu/${encodeURIComponent(businessName)}/categories`,
      providesTags: (_result, _error, businessName) => [{ type: 'Categories', id: businessName }],
    }),

    /** GET /api/menu/{businessName}/products?categoryId= — Products list */
    getProducts: builder.query<ApiProduct[], { businessName: string; categoryId?: number }>({
      query: ({ businessName, categoryId }) => {
        const query = categoryId !== undefined ? `?categoryId=${encodeURIComponent(categoryId)}` : '';
        return `/api/menu/${encodeURIComponent(businessName)}/products${query}`;
      },
      providesTags: (_result, _error, { businessName }) => [{ type: 'Products', id: businessName }],
    }),

    /** GET /api/menu/{businessName}/products/{productId} — Product details */
    getProductDetails: builder.query<ApiProductDetails, { businessName: string; productId: number | string }>({
      query: ({ businessName, productId }) =>
        `/api/menu/${encodeURIComponent(businessName)}/products/${encodeURIComponent(productId)}`,
      providesTags: (_result, _error, { productId }) => [{ type: 'Products', id: productId }],
    }),

    /** GET /api/menu/{businessName}/products/{productId}/reviews — Reviews */
    getProductReviews: builder.query<ApiReviewItem[], { businessName: string; productId: number | string }>({
      query: ({ businessName, productId }) =>
        `/api/menu/${encodeURIComponent(businessName)}/products/${encodeURIComponent(productId)}/reviews`,
      providesTags: (_result, _error, { productId }) => [{ type: 'Reviews', id: productId }],
    }),
  }),
});

export const {
  useGetMenuQuery,
  useGetBusinessInfoQuery,
  useGetSlidersQuery,
  useGetCategoriesQuery,
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useGetProductReviewsQuery,
} = menuApi;

