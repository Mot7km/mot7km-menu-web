// src/lib/api/menuApi.ts
import { API_BASE_URL } from '../constants';
import type {
  ApiBusinessInfo,
  ApiBusinessMenu,
  ApiSlidersResponse,
  ApiCategory,
  ApiProduct,
  ApiProductDetails,
  ApiReviewItem,
  ApiReviewRequest,
} from '../types/menuApi';

/**
 * Generic fetcher for Web Menu API endpoints.
 * Response media type: text/plain (JSON body).
 */
async function fetchApi<T>(path: string, options?: RequestInit): Promise<T | null> {
  const url = typeof window === 'undefined' ? `${API_BASE_URL}${path}` : path;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(url, {
      ...options,
      signal: options?.signal || controller.signal,
      headers: {
        Accept: 'text/plain, application/json',
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      // Revalidate cache every 60s for high performance SSR + fresh updates
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.warn(`[WebMenuAPI] ${options?.method || 'GET'} ${path} responded with status ${res.status}`);
      return null;
    }

    const body = await res.text();
    let json: unknown;
    try {
      json = JSON.parse(body);
    } catch {
      json = body;
    }
    // Support either direct data or { success, data } envelope
    if (json && typeof json === 'object' && 'data' in json && (json as Record<string, unknown>).data !== undefined) {
      return (json as Record<string, unknown>).data as T;
    }
    return json as T;
  } catch (error) {
    console.error(`[WebMenuAPI] Error fetching ${path}:`, error);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Web Menu API Client — implements exactly the endpoints defined in the API spec.
 */
export const webMenuApi = {
  /** GET /api/menu/businesses — Get all business names. */
  async getBusinesses(): Promise<string[] | null> {
    return fetchApi<string[]>('/api/menu/businesses');
  },

  /** GET /api/menu/{businessName} — Get complete store menu. */
  async getMenu(businessName: string): Promise<ApiBusinessMenu | null> {
    return fetchApi<ApiBusinessMenu>(`/api/menu/${encodeURIComponent(businessName)}`);
  },

  /** GET /api/menu/{businessName}/info — Get business information, branding and theme. */
  async getBusinessInfo(businessName: string): Promise<ApiBusinessInfo | null> {
    return fetchApi<ApiBusinessInfo>(`/api/menu/${encodeURIComponent(businessName)}/info`);
  },

  /** GET /api/menu/{businessName}/sliders — Get promotional sliders and carousel banners. */
  async getBusinessSliders(businessName: string): Promise<ApiSlidersResponse | null> {
    return fetchApi<ApiSlidersResponse>(`/api/menu/${encodeURIComponent(businessName)}/sliders`);
  },

  /** GET /api/menu/{businessName}/categories — Get all categories for the business menu. */
  async getBusinessCategories(businessName: string): Promise<ApiCategory[] | null> {
    return fetchApi<ApiCategory[]>(`/api/menu/${encodeURIComponent(businessName)}/categories`);
  },

  /**
   * GET /api/menu/{businessName}/products — Get all products, optionally filtered by category.
   * @param categoryId Optional category filter (integer).
   */
  async getBusinessProducts(businessName: string, categoryId?: number): Promise<ApiProduct[] | null> {
    const query = categoryId === undefined ? '' : `?categoryId=${encodeURIComponent(categoryId)}`;
    return fetchApi<ApiProduct[]>(`/api/menu/${encodeURIComponent(businessName)}/products${query}`);
  },

  /**
   * GET /api/menu/{businessName}/products/{productId} — Get detailed information for a specific product.
   * Automatically increments view counter.
   */
  async getBusinessProductDetails(businessName: string, productId: number): Promise<ApiProductDetails | null> {
    return fetchApi<ApiProductDetails>(
      `/api/menu/${encodeURIComponent(businessName)}/products/${encodeURIComponent(productId)}`
    );
  },

  /**
   * GET /api/menu/{businessName}/products/{productId}/reviews — Get all available reviews for a product.
   */
  async getProductReviews(businessName: string, productId: number): Promise<ApiReviewItem[] | null> {
    return fetchApi<ApiReviewItem[]>(
      `/api/menu/${encodeURIComponent(businessName)}/products/${encodeURIComponent(productId)}/reviews`
    );
  },

  /**
   * POST /api/menu/{businessName}/products/{productId}/reviews — Submit a customer review.
   * Returns 201 Created with the saved review on success, or null on failure.
   */
  async postProductReview(
    businessName: string,
    productId: number,
    review: ApiReviewRequest
  ): Promise<ApiReviewItem | null> {
    const path = `/api/menu/${encodeURIComponent(businessName)}/products/${encodeURIComponent(productId)}/reviews`;
    const url = typeof window === 'undefined' ? `${API_BASE_URL}${path}` : path;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch(url, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          Accept: 'text/plain, application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(review),
      });

      if (!res.ok) {
        console.warn(`[WebMenuAPI] POST ${path} responded with status ${res.status}`);
        return null;
      }

      const body = await res.text();
      let json: unknown;
      try {
        json = JSON.parse(body);
      } catch {
        json = body;
      }
      if (json && typeof json === 'object' && 'data' in json && (json as Record<string, unknown>).data !== undefined) {
        return (json as Record<string, unknown>).data as ApiReviewItem;
      }
      return json as ApiReviewItem;
    } catch (error) {
      console.error(`[WebMenuAPI] Error posting review to ${path}:`, error);
      return null;
    } finally {
      clearTimeout(timeout);
    }
  },

  /**
   * High-level aggregator that resolves the complete store data by calling
   * specialised endpoints:
   * - GET /api/menu/{businessName}/info for theme, branding, headers, identity
   * - GET /api/menu/{businessName}/sliders for promotional sliders
   * - GET /api/menu/{businessName}/categories for category taxonomy
   * - GET /api/menu/{businessName}/products for products list
   */
  async getCompleteStoreData(customBusinessName?: string): Promise<{
    businessName: string;
    displayBusinessName: string;
    menuId: number;
    identity: import('../types/menuApi').ApiBusinessIdentity | null;
    header: import('../types/menuApi').ApiStoreHeader | null;
    sliders: import('../types/menuApi').ApiSliderItem[] | null;
    sliderHeader: string | null;
    categories: ApiCategory[] | null;
    products: ApiProduct[] | null;
  }> {
    const businessName = customBusinessName;

    if (!businessName) {
      return {
        businessName: '',
        displayBusinessName: '',
        menuId: 0,
        identity: null,
        header: null,
        sliders: null,
        sliderHeader: null,
        categories: null,
        products: null,
      };
    }

    const [infoRes, slidersRes, categoriesRes, productsRes] = await Promise.all([
      this.getBusinessInfo(businessName),
      this.getBusinessSliders(businessName),
      this.getBusinessCategories(businessName),
      this.getBusinessProducts(businessName),
    ]);

    const identity = infoRes?.businessIdentity || null;
    const header = infoRes?.header || null;
    if (infoRes?.businessDescription && header && !header.slogan) {
      header.slogan = infoRes.businessDescription;
    }

    const sliders = slidersRes?.sliderItems || null;
    const sliderHeader = slidersRes?.sliderHeader || null;

    const rawCategories = categoriesRes || [];
    const rawProducts = productsRes || [];

    // Map categories with accurate productCount and product links
    const categories: ApiCategory[] = rawCategories.map((c) => {
      const catProducts = rawProducts.filter((p) => Number(p.categoryId) === Number(c.id));
      return {
        id: c.id,
        categoryName: c.categoryName || c.category_Name || c.name || `Category ${c.id}`,
        categoryImageUrl: c.categoryImageUrl || c.imageUrl,
        menuId: c.menuId,
        productCount: catProducts.length,
        products: catProducts,
      };
    });

    // Ensure all products have categoryName populated
    const products: ApiProduct[] = rawProducts.map((p) => {
      const matchedCat = categories.find((c) => Number(c.id) === Number(p.categoryId));
      return {
        ...p,
        categoryName: p.categoryName || matchedCat?.categoryName,
      };
    });

    return {
      businessName: infoRes?.businessName || businessName,
      displayBusinessName: infoRes?.displayBusinessName || infoRes?.businessName || businessName,
      menuId: 0,
      identity,
      header,
      sliders,
      sliderHeader,
      categories: categories.length > 0 ? categories : null,
      products: products.length > 0 ? products : null,
    };
  },
};