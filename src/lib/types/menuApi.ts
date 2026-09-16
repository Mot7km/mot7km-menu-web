// src/lib/types/menuApi.ts

/**
 * Brand color definition returned by the Web Menu API.
 * Constrained to exactly 3 colors: primary, secondary, accent.
 */
export interface ApiBrandColors {
  primary?: string | null;
  secondary?: string | null;
  accent?: string | null;
}

export interface ApiTypography {
  id?: string;
  arabicFont?: string | null;
  englishFont?: string | null;
}

export interface ApiBusinessIdentity {
  id?: string;
  businessName?: string | null;
  businessDescription?: string | null;
  logo?: string | null;
  slogan?: string | null;
  colors?: ApiBrandColors | null;
  typography?: ApiTypography | null;
}

export interface ApiSocials {
  whatsapp?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  tiktok?: string | null;
}

export interface ApiStoreHeader {
  businessName?: string | null;
  logo?: string | null;
  logoUrl?: string | null;
  slogan?: string | null;
  backGroundImage?: string | null;
  coverUrl?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  addressAr?: string | null;
  socialLinks?: ApiSocials | null;
  socials?: ApiSocials | null;
  workingHours?: Array<{
    day: number;
    open: string;
    close: string;
    isClosed?: boolean;
  }> | null;
  branches?: any[] | null;
}

export interface ApiSliderItem {
  id?: number;
  name?: string | null;
  title?: string | null;
  titleAr?: string | null;
  header?: string | null;
  description?: string | null;
  descriptionAr?: string | null;
  desc?: string | null;
  badge?: string | null;
  badgeAr?: string | null;
  gradient?: string | null;
  bgColor?: string | null;
  imageUrl?: string | null;
  image?: string | null;
  menuId?: number;
}

export interface ApiSlidersResponse {
  sliderHeader?: string | null;
  sliderItems?: ApiSliderItem[] | null;
}

export type ApiSlider = ApiSliderItem;

export interface ApiProduct {
  id: number | string;
  productName?: string | null;
  product_Name?: string | null;
  name?: string | null;
  price?: number | string;
  productImageUrl?: string | null;
  product_ImageUrl?: string | null;
  image?: string | null;
  description?: string | null;
  category?: string | null;
  categoryName?: string | null;
  categoryId?: number;
  viewCounter?: number;
  rating?: number;
  averageRating?: number;
  favoriteCount?: number;
  reviewCount?: number;
  ingredients?: string[];
  badgesId?: unknown[];
  customizationOptions?: ApiCustomizationOption[];
  reviews?: ApiReview[];
}

export interface ApiCategory {
  id: number | string;
  categoryName?: string | null;
  category_Name?: string | null;
  name?: string | null;
  categoryImageUrl?: string | null;
  imageUrl?: string | null;
  menuId?: number;
  productCount?: number;
  products?: ApiProduct[] | null;
}

/**
 * Customization choice.
 */
export interface ApiCustomizationChoice {
  label: string;
  extraPrice: number;
  labelAr?: string;
}

/**
 * Customization option.
 */
export interface ApiCustomizationOption {
  name: string;
  nameAr?: string;
  choices: ApiCustomizationChoice[];
  defaultChoice?: string;
}

/**
 * Review item.
 */
export interface ApiReview {
  id: number | string;
  reviewer: string;
  nameCustomer?: string;
  date: string;
  createdAt?: string;
  rating: number;
  comment: string;
  content?: string;
}

/**
 * Product item returned by /api/menu/all-products/{categoryId} or /api/menu/products-by-category/{Id}
 */
/**
 * Enriched product details from /api/menu/products/{id} or /api/menu/product-details/{id}
 */
export interface ApiProductDetails extends ApiProduct {
  views?: number;
}

/**
 * Profile returned by /api/menu/profile
 */
export interface ApiMenuProfile {
  businessName?: string;
  menuId?: number;
}

/**
 * View counter response from /api/v1/Products/{id}/views
 */
export interface ApiProductViews {
  productId: number | string;
  viewsCount: number;
}

/**
 * Complete Store Data fetched from /api/menu/by-business-name/{businessName}
 * or aggregated from sub-endpoints.
 */
export interface StoreData {
  businessName: string;
  menuId: number;
  identity: ApiBusinessIdentity;
  header: ApiStoreHeader;
  sliders: ApiSlider[];
  categories: ApiCategory[];
  products: ApiProduct[];
}
