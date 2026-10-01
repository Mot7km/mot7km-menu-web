// src/data/menupromo.tsx

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