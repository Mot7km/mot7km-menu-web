// src/data/featuredBusinesses.ts

export interface FeaturedBusiness {
  businessName: string;
  displayBusinessName: string;
  logo: string;
  cover: string;
  businessDescription: string;
  category?: string;
  badge?: string;
  rating?: number;
  location?: string;
}

export const FEATURED_BUSINESSES: FeaturedBusiness[] = [
  {
    businessName: 'artisan-roastery',
    displayBusinessName: 'محمصة الحِرفيين للقهوة المختصة',
    logo: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
    businessDescription: 'قهوة مختصة مقطرة ومشروبات إسبريسو حصرية من أجود المحاصيل الإثيوبية والكولومبية، مع مخبوزات طازجة يومياً.',
    category: 'كافيهات ومحامص',
    badge: 'الأكثر زيارة',
    rating: 4.9,
    location: 'الرياض، العليا',
  },
  {
    businessName: 'smoke-and-fire',
    displayBusinessName: 'سموك آند فاير برجر & باربيكيو',
    logo: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=200&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
    businessDescription: 'برجر لحم بلاك أنجوس مدخن على حطب البلوط، أضلاع مقرمشة، وصلصات منزلية سرية تحضر يومياً بحرفية تامة.',
    category: 'برجر ومشاوي',
    badge: 'مفضل للزبائن',
    rating: 4.8,
    location: 'جدة، الروضة',
  },
  {
    businessName: 'trattoria-bella',
    displayBusinessName: 'تراتوريا بيلا الإيطالية',
    logo: 'https://images.unsplash.com/photo-1579684947550-22e945225d9a?w=200&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    businessDescription: 'أطباق الباستا الطازجة والبيتزا النابولية المخبوزة في فرن الحطب الحجري على الطريقة الإيطالية التقليدية الأصيلة.',
    category: 'مطابخ عالمية',
    badge: 'تقييم ممتاز',
    rating: 4.9,
    location: 'الدمام، الشاطئ',
  },
  {
    businessName: 'le-croissant-dore',
    displayBusinessName: 'لو كروان دوريه باتيسيري',
    logo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=800&auto=format&fit=crop&q=80',
    businessDescription: 'مخبوزات فرنسية راقية، كرواسون بالزبدة الطبيعية، كيك احتفالي فاخر، وحلويات مصممة لأصحاب الذوق الرفيع.',
    category: 'مخبوزات وحلويات',
    badge: 'جديد ومميز',
    rating: 4.7,
    location: 'الرياض، النخيل',
  },
  {
    businessName: 'sakura-japanese',
    displayBusinessName: 'ساكورا كيتشن & سوشي لاونج',
    logo: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&auto=format&fit=crop&q=80',
    businessDescription: 'رولز سوشي مبتكرة، أطباق نودلز الرامن الغنية، وتجربة يابانية عصرية تمزج بين الفن والطعوم الآسيوية الساحرة.',
    category: 'مطابخ عالمية',
    badge: 'تجربة فريدة',
    rating: 4.8,
    location: 'الخبر، الكورنيش',
  },
  {
    businessName: 'green-bowl-organics',
    displayBusinessName: 'جرين بول للأغذية الصحية',
    logo: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    businessDescription: 'سلطات عضوية طازجة، أطباق بروتين متوازنة، عصائر سموذي نقية، وحلول غذائية تدعم نمط الحياة النشط والصحي.',
    category: 'أكل صحي',
    badge: 'طبيعي 100%',
    rating: 4.9,
    location: 'الرياض، حطين',
  },
];
