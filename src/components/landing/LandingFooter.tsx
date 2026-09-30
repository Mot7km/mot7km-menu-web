'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';

export function LandingFooter() {
  const locale = useLocale();
  const isRTL = locale === 'ar';
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
                {isRTL ? 'مُتـحكّـم' : 'MOT7KM'}
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {isRTL
                ? 'المنظومة السحابية المتكاملة لإدارة ونشر القوائم الرقمية للمطاعم والكافيهات. حلول ذكية سريعة تلهم عملاءك وتزيد مبيعاتك.'
                : 'Next-generation cloud digital menu ecosystem for restaurants and cafes. Fast, intuitive, and conversion-focused.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
              {isRTL ? 'روابط سريعة' : 'Navigation'}
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-[var(--color-text-secondary)]">
              <li>
                <Link href={`/${locale}/menu`} className="hover:text-[var(--color-primary)] transition-colors">
                  {isRTL ? 'استكشف القوائم' : 'Explore Menus'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}#features`} className="hover:text-[var(--color-primary)] transition-colors">
                  {isRTL ? 'المميزات' : 'Features'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}#plans`} className="hover:text-[var(--color-primary)] transition-colors">
                  {isRTL ? 'باقات الاشتراك' : 'Pricing Plans'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/info`} className="hover:text-[var(--color-primary)] transition-colors">
                  {isRTL ? 'عن المنصة' : 'About Platform'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
              {isRTL ? 'الدعم والمساعدة' : 'Support & Legal'}
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-[var(--color-text-secondary)]">
              <li>
                <span className="cursor-pointer hover:text-[var(--color-primary)] transition-colors">
                  {isRTL ? 'مركز المساعدة' : 'Help Center'}
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-[var(--color-primary)] transition-colors">
                  {isRTL ? 'الشروط والأحكام' : 'Terms of Service'}
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-[var(--color-primary)] transition-colors">
                  {isRTL ? 'سياسة الخصوصية' : 'Privacy Policy'}
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-[var(--color-primary)] transition-colors">
                  {isRTL ? 'اتفاقية مستوى الخدمة' : 'SLA Status'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-[var(--color-border)]/60 pt-6 text-xs text-[var(--color-text-muted)] gap-4">
          <p>
            {isRTL
              ? `© ${currentYear} مُتحكّم (MOT7KM). جميع الحقوق محفوظة.`
              : `© ${currentYear} MOT7KM Cloud Systems. All rights reserved.`}
          </p>
          <p className="flex items-center gap-1.5">
            <span>{isRTL ? 'صُنع بعناية لقطاع الضيافة والمطاعم' : 'Crafted with care for modern dining'}</span>
            <span>✨</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
