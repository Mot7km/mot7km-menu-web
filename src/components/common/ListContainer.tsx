'use client';

import { Product, Review } from '@/data/menu';
import ProductSection from '../modules/ProductSection';
import ReviewSection from '../modules/ReviewSection';

export type SectionType = 'products' | 'reviews';

export interface SectionConfig {
  type: SectionType;
  title?: string;
  data: Product[] | Review[];
  initialCount?: number;
  loadMoreCount?: number;
  showCount?: boolean;
}

interface ListContainerProps {
  sections?: SectionConfig[];
  loading?: boolean;
}

export default function ListContainer({ sections = [], loading = false }: ListContainerProps) {
  if (!sections.length) return null;

  return (
    <div className="flex flex-col gap-8 w-full">
      {sections.map((section, index) => {
        switch (section.type) {
          case 'products':
            return (
              <ProductSection
                key={index}
                title={section.title}
                products={section.data as Product[]}
                initialCount={section.initialCount ?? 4}
                loadMoreCount={section.loadMoreCount ?? 4}
                showCount={section.showCount ?? true}
                loading={loading}
              />
            );
          case 'reviews':
            return (
              <ReviewSection
                key={index}
                title={section.title}
                reviews={section.data as Review[]}
                initialCount={section.initialCount ?? 1}
                loadMoreCount={section.loadMoreCount ?? 1}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}