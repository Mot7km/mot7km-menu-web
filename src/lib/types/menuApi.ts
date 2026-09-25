// src/lib/types/menuApi.ts

/**
 * Semantic 11-token color palette definition for a single theme mode (light or dark).
 */
export interface ApiColorPalette {
  primary?: string | null;
  onPrimary?: string | null;
  secondary?: string | null;
  onSecondary?: string | null;
  background?: string | null;
  surface?: string | null;
  surfaceSubtle?: string | null;
  textPrimary?: string | null;
  textSecondary?: string | null;
  border?: string | null;
  accent?: string | null;
}

/**
 * Brand color definition returned by the Web Menu API.
 * Supports the full light & dark semantic palette schema,
 * with backward-compatible fallback to the legacy 3-color palette.
 */
export interface ApiBrandColors {
  // New API structure
  light?: ApiColorPalette | null;
  dark?: ApiColorPalette | null;

  // Legacy flat 3-color structure
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
  branches?: ApiBranch[] | null;
}

export interface ApiBranch {
  id: number | string;
  name?: string | null;
  location?: string | null;
  isMainBranch?: boolean;
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
  isAvailable?: boolean;
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
 * Legacy review shape used internally by storeHooks for normalisation.
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
 * Review item returned by GET /api/menu/{businessName}/products/{productId}/reviews
 * and the 201 Created response of POST to the same endpoint.
 */
export interface ApiReviewItem {
  reviewID: number;
  rating: number;
  nameCustomer: string;
  content: string;
  isAvailable: boolean;
  createdAt: string;
}

/**
 * Request body for POST /api/menu/{businessName}/products/{productId}/reviews
 */
export interface ApiReviewRequest {
  rating: number;
  nameCustomer: string;
  content: string;
}

/**
 * Enriched product details from GET /api/menu/{businessName}/products/{productId}
 */
export interface ApiProductDetails extends Omit<ApiProduct, 'ingredients'> {
  views?: number;
  ingredients?: Array<string | { id: number | string; name: string }>;
  customizations?: Array<{ id: number | string; name: string; price: number }>;
}

export interface ApiBusinessInfo {
  businessName: string;
  displayBusinessName?: string | null;
  businessDescription?: string | null;
  businessIdentity?: ApiBusinessIdentity | null;
  header?: ApiStoreHeader | null;
}

export interface ApiBusinessMenu {
  businessName: string;
  displayBusinessName?: string | null;
  businessDescription?: string | null;
  businessIdentity?: ApiBusinessIdentity | null;
  header?: ApiStoreHeader | null;
  sliders?: ApiSlidersResponse | null;
  categories?: ApiCategory[] | null;
}

/**
 * Normalised store data used internally by the app after aggregation.
 * Not a direct API response shape.
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