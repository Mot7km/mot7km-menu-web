// promoData.ts
export interface PromoCardData {
  id: number;
  title: string;
  description?: string;
  badge?: string;
  image: string;
  gradient: string;
  backgroundColor?: string;
  textColor: string;
  badgeColor?: string;
  badgeBg?: string;
  hasIcon?: boolean;  
}

export const promoCards: PromoCardData[] = [
  {
    id: 1,
    title: '20% Off All Juices',
    description: '',
    badge: 'Limited Time',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80',
    gradient: 'linear-gradient(90deg, rgba(28, 27, 27, 0.8) 0%, rgba(28, 27, 27, 0) 100%)',
    textColor: 'text-white',
    badgeColor: 'text-[#A3F69C]',
    badgeBg: 'rgba(0, 34, 4, 0.5)',
    hasIcon: false,
  },
  {
    id: 2,
    title: 'Best Burger in Town',
    description: 'Try our classic double cheeseburger today.',
    badge: '',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
    gradient: 'linear-gradient(0deg, rgba(164, 55, 0, 0.9) 0%, rgba(164, 55, 0, 0) 100%)',
    textColor: 'text-white',
    hasIcon: false,
  },
  {
    id: 3,
    title: 'Seasonal Cocktails',
    description: '',
    badge: 'NEW ARRIVALS',
    image: '',
    gradient: '',
    textColor: 'text-[#217128]',
    badgeColor: 'text-[#217128]',
    badgeBg: 'transparent',
    hasIcon: true,     
  },
];