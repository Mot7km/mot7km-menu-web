// src/lib/api/menuApi.ts
import { API_BASE_URL } from '../constants';
import type {
  ApiBusinessIdentity,
  ApiStoreHeader,
  ApiSlider,
  ApiSliderItem,
  ApiSlidersResponse,
  ApiCategory,
  ApiProduct,
  ApiProductDetails,
  ApiMenuProfile,
  ApiProductViews,
  ApiBusinessMenu,
  StoreData,
} from '../types/menuApi';

/**
 * Generic fetcher for Web Menu API endpoints.
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
    if (json && typeof json === 'object' && 'data' in json && json.data !== undefined) {
      return json.data as T;
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
 * Web Menu API Client service implementing all endpoints specified in the Swagger spec.
 */
export const webMenuApi = {
  /** GET /api/menu/businesses */
  async getBusinesses(): Promise<string[] | null> {
    return fetchApi<string[]>('/api/menu/businesses');
  },

  /** GET /api/menu/{businessName} */
  async getMenu(businessName: string): Promise<ApiBusinessMenu | null> {
    return fetchApi<ApiBusinessMenu>(`/api/menu/${encodeURIComponent(businessName)}`);
  },

  /** GET /api/menu/{businessName}/info */
  async getBusinessInfo(businessName: string): Promise<ApiBusinessMenu | null> {
    return fetchApi<ApiBusinessMenu>(`/api/menu/${encodeURIComponent(businessName)}/info`);
  },

  /** GET /api/menu/{businessName}/sliders */
  async getBusinessSliders(businessName: string): Promise<ApiSlidersResponse | null> {
    return fetchApi<ApiSlidersResponse>(`/api/menu/${encodeURIComponent(businessName)}/sliders`);
  },

  /** GET /api/menu/{businessName}/categories */
  async getBusinessCategories(businessName: string): Promise<ApiCategory[] | null> {
    return fetchApi<ApiCategory[]>(`/api/menu/${encodeURIComponent(businessName)}/categories`);
  },

  /** GET /api/menu/{businessName}/products?categoryId={categoryId} */
  async getBusinessProducts(businessName: string, categoryId?: number): Promise<ApiProduct[] | null> {
    const query = categoryId === undefined ? '' : `?categoryId=${encodeURIComponent(categoryId)}`;
    return fetchApi<ApiProduct[]>(`/api/menu/${encodeURIComponent(businessName)}/products${query}`);
  },

  /** GET /api/menu/{businessName}/products/{productId} */
  async getBusinessProductDetails(businessName: string, productId: number | string): Promise<ApiProductDetails | null> {
    return fetchApi<ApiProductDetails>(
      `/api/menu/${encodeURIComponent(businessName)}/products/${encodeURIComponent(productId)}`
    );
  },

  /**
   * GET /api/menu/profile
   * Returns current store BusinessName and MenuID (parameterless)
   */
  async getProfile(): Promise<ApiMenuProfile | null> {
    return fetchApi<ApiMenuProfile>('/api/menu/profile');
  },

  /**
   * GET /api/menu/by-business-name/{businessName}
   * Get complete store menu (identity, header, sliders, categories, and products) in a single request.
   */
  async getByBusinessName(businessName: string): Promise<Partial<StoreData> | null> {
    return fetchApi<Partial<StoreData>>(`/api/menu/by-business-name/${encodeURIComponent(businessName)}`);
  },

  /**
   * GET /api/menu/by-username/{businessName}
   * Get complete store menu in a single request by username.
   */
  async getByUsername(businessName: string): Promise<Partial<StoreData> | null> {
    return fetchApi<Partial<StoreData>>(`/api/menu/by-username/${encodeURIComponent(businessName)}`);
  },

  /**
   * GET /api/menu/business-identity/by-business-name/{businessName}
   * Get business identity (brand colors, typography, fonts) by store business name.
   */
  async getBusinessIdentity(businessName: string): Promise<ApiBusinessIdentity | null> {
    return fetchApi<ApiBusinessIdentity>(
      `/api/menu/business-identity/by-business-name/${encodeURIComponent(businessName)}`
    );
  },

  /**
   * GET /api/menu/business-identity/by-username/{businessName}
   * Get business identity by username.
   */
  async getBusinessIdentityByUsername(businessName: string): Promise<ApiBusinessIdentity | null> {
    return fetchApi<ApiBusinessIdentity>(
      `/api/menu/business-identity/by-username/${encodeURIComponent(businessName)}`
    );
  },

  /**
   * GET /api/menu/header/by-business-name/{businessName}
   * Get store header information (logo, cover background, branches, contact, and social links).
   */
  async getHeader(businessName: string): Promise<ApiStoreHeader | null> {
    return fetchApi<ApiStoreHeader>(
      `/api/menu/header/by-business-name/${encodeURIComponent(businessName)}`
    );
  },

  /**
   * GET /api/menu/header/by-username/{businessName}
   * Get store header information by username.
   */
  async getHeaderByUsername(businessName: string): Promise<ApiStoreHeader | null> {
    return fetchApi<ApiStoreHeader>(
      `/api/menu/header/by-username/${encodeURIComponent(businessName)}`
    );
  },

  /**
   * GET /api/menu/sliders
   * Get promotional sliders and carousel banners.
   */
  async getSliders(): Promise<ApiSlidersResponse | ApiSlider[] | null> {
    return fetchApi<ApiSlidersResponse | ApiSlider[]>('/api/menu/sliders');
  },

  /**
   * GET /api/menu/all-categories/{menuId}
   * Get all categories belonging to a menu ID.
   */
  async getCategories(menuId: number): Promise<ApiCategory[] | null> {
    return fetchApi<ApiCategory[]>(`/api/menu/all-categories/${menuId}`);
  },

  /**
   * GET /api/menu/all-products/{categoryId}
   * Get all products belonging to a category ID.
   */
  async getProductsByCategory(categoryId: number): Promise<ApiProduct[] | null> {
    return fetchApi<ApiProduct[]>(`/api/menu/all-products/${categoryId}`);
  },

  /**
   * GET /api/menu/products-by-category/{Id}
   * Get list of products by multiple product IDs.
   */
  async getProductsByIds(categoryId: number | string, productIds?: number[]): Promise<ApiProduct[] | null> {
    const qs = productIds && productIds.length > 0
      ? `?${productIds.map((id) => `productIds=${id}`).join('&')}`
      : '';
    return fetchApi<ApiProduct[]>(`/api/menu/products-by-category/${categoryId}${qs}`);
  },

  /**
   * GET /api/menu/product-details/{id}
   * Get public product details by ID (automatically increments view counter on backend).
   */
  async getProductDetails(id: number | string): Promise<ApiProductDetails | null> {
    return fetchApi<ApiProductDetails>(`/api/menu/product-details/${id}`);
  },

  /**
   * GET /api/menu/products/{id}
   * Get full enriched product details by ID (Basic Info, Ingredients, Customizations, Reviews Section).
   */
  async getEnrichedProduct(id: number | string): Promise<ApiProductDetails | null> {
    return fetchApi<ApiProductDetails>(`/api/menu/products/${id}`);
  },

  /**
   * GET /api/v1/Products/{id}/views
   * Get product views counter and tracking stats.
   */
  async getProductViews(id: number | string): Promise<ApiProductViews | null> {
    return fetchApi<ApiProductViews>(`/api/v1/Products/${id}/views`);
  },

  /**
   * POST /api/v1/Products/{id}/views
   * Record a product view or interaction.
   */
  async recordProductView(id: number | string): Promise<boolean> {
    try {
      const path = `/api/v1/Products/${id}/views`;
      const url = typeof window === 'undefined' ? `${API_BASE_URL}${path}` : path;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * High-level aggregator that resolves the complete store data for the subsite.
   * Checks /api/menu/profile and /api/menu/by-business-name/{businessName},
   * accurately handling the real backend schema.
   */
  async getCompleteStoreData(customBusinessName?: string): Promise<{
    businessName: string;
    menuId: number;
    identity: ApiBusinessIdentity | null;
    header: ApiStoreHeader | null;
    sliders: ApiSliderItem[] | null;
    sliderHeader: string | null;
    categories: ApiCategory[] | null;
    products: ApiProduct[] | null;
  }> {
    let businessName = customBusinessName;
    const menuId = 0;

    if (!businessName) {
      return { businessName: '', menuId, identity: null, header: null, sliders: null, sliderHeader: null, categories: null, products: null };
    }

    // 2. Fetch the complete menu bundle by business name
    const rawBundle = await this.getMenu(businessName);

    if (rawBundle) {
      const identity: ApiBusinessIdentity | null = rawBundle.businessIdentity || null;

      // Normalize header
      const header: ApiStoreHeader | null = rawBundle.header || null;
      if (rawBundle.businessDescription && header && !header.slogan) {
        header.slogan = rawBundle.businessDescription;
      }

      // Normalize sliders (backend might return { sliderHeader, sliderItems: [...] } or an array)
      let sliders: ApiSliderItem[] | null = null;
      let sliderHeader: string | null = null;
      if (rawBundle.sliders) {
        if (Array.isArray(rawBundle.sliders.sliderItems)) {
          sliders = rawBundle.sliders.sliderItems;
          sliderHeader = rawBundle.sliders.sliderHeader || null;
        }
      }

      // Normalize categories and products
      let categories: ApiCategory[] | null = null;
      let products: ApiProduct[] = [];

      if (Array.isArray(rawBundle.categories) && rawBundle.categories.length > 0) {
        categories = rawBundle.categories.map((c: any) => ({
          id: c.id,
          categoryName: c.categoryName || c.category_Name || c.name || `Category ${c.id}`,
          categoryImageUrl: c.categoryImageUrl || c.imageUrl,
          menuId: c.menuId,
          productCount: c.products?.length ?? c.productCount,
          products: c.products,
        }));

        // Flatten all nested products from the categories
        rawBundle.categories.forEach((cat: any) => {
          if (Array.isArray(cat.products)) {
            cat.products.forEach((p: any) => {
              products.push({
                ...p,
                categoryId: p.categoryId ?? cat.id,
                categoryName: p.categoryName ?? cat.categoryName,
              });
            });
          }
        });
      }

      return {
        businessName: rawBundle.businessName || businessName,
        menuId,
        identity,
        header,
        sliders,
        sliderHeader,
        categories,
        products: products.length > 0 ? products : null,
      };
    }

    return { businessName, menuId, identity: null, header: null, sliders: null, sliderHeader: null, categories: null, products: null };
  },
};
