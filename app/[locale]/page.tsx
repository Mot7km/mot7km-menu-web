'use client';

import { useCallback, useEffect } from 'react';
import { resetThemePalette } from '@/config/theme';
import {
  LandingNavbar,
  LandingHero,
  LandingSummary,
  LandingFeatures,
  LandingPricing,
  LandingFeaturedMenus,
  LandingCTA,
  LandingFooter,
} from '@/components/landing';

export default function Home() {
  useEffect(() => {
    // Ensure landing page always uses standard Mot7km default theme
    resetThemePalette();
  }, []);

  const handleScrollTo = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const navHeight = 85;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-background)] text-[var(--color-text-primary)] transition-colors duration-300">
      {/* Top Navbar */}
      <LandingNavbar onScrollTo={handleScrollTo} />

      <main className="flex-1">
        {/* Hero Section */}
        <LandingHero
          onExploreClick={() => handleScrollTo('clients')}
          onPlansClick={() => handleScrollTo('plans')}
        />

        {/* Summary about MOT7KM & PDF comparison */}
        <LandingSummary />

        {/* Core Features */}
        <LandingFeatures />

        {/* Featured Partner Menus (Client Cards) */}
        <LandingFeaturedMenus />

        {/* Subscription Plans */}
        <LandingPricing />

        {/* Call to Action Banner */}
        <LandingCTA />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
