import { HeaderSkeleton } from './HeaderSkeleton';
import { CarouselSkeleton } from './CarouselSkeleton';
import { CategoriesSkeleton } from './CategoriesSkeleton';
import { ProductSectionSkeleton } from './ProductSectionSkeleton';
import { FooterSkeleton } from './FooterSkeleton';

interface MenuPageSkeletonProps {
  showPromo?: boolean;
}

export function MenuPageSkeleton({ showPromo = true }: MenuPageSkeletonProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-text-primary)]">
      {/* 1. Header Section */}
      <HeaderSkeleton />

      {/* 2. Main Body */}
      <main className="flex-1 w-full">
        {/* Promotional Carousel Skeleton */}
        {showPromo && <CarouselSkeleton />}

        {/* Categories Bar & Products Grid */}
        <section className="relative w-full px-4 pb-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl md:max-w-6xl">
            <div className="relative">
              {/* Sticky Categories Bar Skeleton */}
              <CategoriesSkeleton />

              {/* Product Grid Skeleton */}
              <ProductSectionSkeleton count={8} layout="grid" />
            </div>
          </div>
        </section>
      </main>

      {/* 3. Footer Section */}
      <FooterSkeleton />
    </div>
  );
}
