'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export function LandingFooter() {
  const t = useTranslations('landing.footer');
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)]/60 bg-[var(--color-surface)] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 lg:gap-12">
          {/* Brand Info */}
          <div className="sm:col-span-2">
            <Link href={`/${locale}`} className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white font-black text-base shadow-sm">
                M
              </div>
              <span className="text-xl font-black tracking-tight text-[var(--color-text-primary)]">
                Mot7km
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {t('brandDescription')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
              {t('navTitle')}
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-[var(--color-text-secondary)]">
              <li>
                <Link href={`/${locale}#clients`} className="hover:text-[var(--color-primary)] transition-colors">
                  {t('exploreMenus')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}#features`} className="hover:text-[var(--color-primary)] transition-colors">
                  {t('features')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}#plans`} className="hover:text-[var(--color-primary)] transition-colors">
                  {t('pricingPlans')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}#summary`} className="hover:text-[var(--color-primary)] transition-colors">
                  {t('aboutPlatform')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
              {t('supportTitle')}
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-[var(--color-text-secondary)]">
              <li>
                <span className="cursor-pointer hover:text-[var(--color-primary)] transition-colors">
                  {t('helpCenter')}
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-[var(--color-primary)] transition-colors">
                  {t('termsOfService')}
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-[var(--color-primary)] transition-colors">
                  {t('privacyPolicy')}
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-[var(--color-primary)] transition-colors">
                  {t('slaStatus')}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-[var(--color-border)]/60 pt-6 text-xs text-[var(--color-text-muted)] gap-4">
          <p>
            {t('copyright', { year: currentYear })}
          </p>
          <p className="flex items-center gap-1.5">
            <span>{t('craftedWith')}</span>
            <span>✨</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
