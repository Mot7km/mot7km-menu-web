// src/data/featuredBusinesses.ts

export interface LocalizedString {
  ar: string;
  en: string;
}

export interface FeaturedBusiness {
  businessName: string;
  displayBusinessName: string | LocalizedString;
  logo: string;
  cover: string;
  businessDescription: string | LocalizedString;
  categoryKey: 'cafes' | 'grill' | 'international' | 'sweets' | 'healthy';
  category?: string | LocalizedString;
  badge?: string | LocalizedString;
  rating?: number;
  location?: string | LocalizedString;
}

export const FEATURED_BUSINESSES: FeaturedBusiness[] = [
  {
    businessName: 'artisan-roastery',
    displayBusinessName: {
      ar: 'محمصة الحِرفيين للقهوة المختصة',
      en: 'Artisan Specialty Roastery',
    },
    logo: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
    businessDescription: {
      ar: 'قهوة مختصة مقطرة ومشروبات إسبريسو حصرية من أجود المحاصيل الإثيوبية والكولومبية، مع مخبوزات طازجة يومياً.',
      en: 'Single-origin pour-overs and signature espresso roasts from premium Ethiopian and Colombian beans.',
    },
    categoryKey: 'cafes',
    badge: {
      ar: 'الأكثر زيارة',
      en: 'Most Visited',
    },
    rating: 4.9,
    location: {
      ar: 'الرياض، العليا',
      en: 'Riyadh, Olaya',
    },
  },
  {
    businessName: 'smoke-and-fire',
    displayBusinessName: {
      ar: 'سموك آند فاير برجر & باربيكيو',
      en: 'Smoke & Fire Burger Grill',
    },
    logo: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=200&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
    businessDescription: {
      ar: 'برجر لحم بلاك أنجوس مدخن على حطب البلوط، أضلاع مقرمشة، وصلصات منزلية سرية تحضر يومياً بحرفية تامة.',
      en: 'Oak-smoked Black Angus burgers, crisp brisket cuts, and artisanal house-crafted sauces.',
    },
    categoryKey: 'grill',
    badge: {
      ar: 'مفضل للزبائن',
      en: 'Crowd Favorite',
    },
    rating: 4.8,
    location: {
      ar: 'جدة، الروضة',
      en: 'Jeddah, Rawdah',
    },
  },
  {
    businessName: 'trattoria-bella',
    displayBusinessName: {
      ar: 'تراتوريا بيلا الإيطالية',
      en: 'Trattoria Bella Italian',
    },
    logo: 'https://images.unsplash.com/photo-1579684947550-22e945225d9a?w=200&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    businessDescription: {
      ar: 'أطباق الباستا الطازجة والبيتزا النابولية المخبوزة في فرن الحطب الحجري على الطريقة الإيطالية التقليدية الأصيلة.',
      en: 'Hand-rolled fresh pasta and Neapolitan sourdough pizzas baked in an authentic stone wood-fired oven.',
    },
    categoryKey: 'international',
    badge: {
      ar: 'تقييم ممتاز',
      en: 'Top Rated',
    },
    rating: 4.9,
    location: {
      ar: 'الدمام، الشاطئ',
      en: 'Dammam, Al Shatee',
    },
  },
  {
    businessName: 'le-croissant-dore',
    displayBusinessName: {
      ar: 'لو كروان دوريه باتيسيري',
      en: 'Le Croissant Doré Patisserie',
    },
    logo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=800&auto=format&fit=crop&q=80',
    businessDescription: {
      ar: 'مخبوزات فرنسية راقية، كرواسون بالزبدة الطبيعية، كيك احتفالي فاخر، وحلويات مصممة لأصحاب الذوق الرفيع.',
      en: 'Artisanal French pastries, Normandy butter croissants, celebration gateaux, and handcrafted confections.',
    },
    categoryKey: 'sweets',
    badge: {
      ar: 'جديد ومميز',
      en: 'New & Noteworthy',
    },
    rating: 4.7,
    location: {
      ar: 'الرياض، النخيل',
      en: 'Riyadh, Al Nakheel',
    },
  },
  {
    businessName: 'sakura-japanese',
    displayBusinessName: {
      ar: 'ساكورا كيتشن & سوشي لاونج',
      en: 'Sakura Kitchen & Sushi Lounge',
    },
    logo: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&auto=format&fit=crop&q=80',
    businessDescription: {
      ar: 'رولز سوشي مبتكرة، أطباق نودلز الرامن الغنية، وتجربة يابانية عصرية تمزج بين الفن والطعوم الآسيوية الساحرة.',
      en: 'Contemporary sushi artistry, savory ramen broth bowls, and authentic Japanese robata creations.',
    },
    categoryKey: 'international',
    badge: {
      ar: 'تجربة فريدة',
      en: 'Signature Experience',
    },
    rating: 4.8,
    location: {
      ar: 'الخبر، الكورنيش',
      en: 'Khobar, Corniche',
    },
  },
  {
    businessName: 'green-bowl-organics',
    displayBusinessName: {
      ar: 'جرين بول للأغذية الصحية',
      en: 'Green Bowl Organics',
    },
    logo: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    businessDescription: {
      ar: 'سلطات عضوية طازجة، أطباق بروتين متوازنة، عصائر سموذي نقية، وحلول غذائية تدعم نمط الحياة النشط والصحي.',
      en: 'Organic superfood salads, balanced grain bowls, fresh cold-pressed elixirs, and nutrient-dense fuel.',
    },
    categoryKey: 'healthy',
    badge: {
      ar: 'طبيعي 100%',
      en: '100% Organic',
    },
    rating: 4.9,
    location: {
      ar: 'الرياض، حطين',
      en: 'Riyadh, Hittin',
    },
  },
];
