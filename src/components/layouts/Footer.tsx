'use client';

import { memo } from 'react';
import Image from 'next/image';
import { Phone, MapPin, Mail, Clock } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useStore } from '@/store/storeHooks';

import { SocialLinkButton } from '@/components/icons';

function formatTime(time24: string): string {
  const [h, m] = time24.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, '0')} ${suffix}`;
}

export const Footer = memo(function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const currentYear = new Date().getFullYear();
  const { storeInfo, header, identity, displayBusinessName } = useStore();

  const today = new Date().getDay();
  const todayHours = storeInfo.workingHours.find((wh) => wh.day === today) || null;
  const displayAddress = isRTL ? (storeInfo.addressAr || storeInfo.address) : storeInfo.address;
  const brandName = displayBusinessName || header?.businessName || identity?.businessName || storeInfo.name;
  const slogan = header?.slogan || identity?.slogan || t('header.tagline');
  const logoUrl = header?.logo || header?.logoUrl || identity?.logo;

  return (
    <footer
      className="relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-surface)]"
    >
      {/* Gradient top accent line with shimmer */}
      <div className="absolute top-0 inset-x-0 h-[2px] overflow-hidden" style={{ background: 'var(--gradient-primary)' }}>
        <div
          className="absolute top-0 left-0 w-1/3 h-full
            bg-gradient-to-r from-transparent via-[var(--color-text-on-primary)]/40 to-transparent"
          style={{ animation: 'shimmerLine 4s ease-in-out infinite' }}
        />
      </div>

      {/* Decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-[var(--color-primary)]/5 blur-[60px] rounded-full pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {/* Grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8">
          {/* Column 1: Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-md">
                {logoUrl ? (
                  <Image src={logoUrl} alt={brandName} width={40} height={40} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-[var(--color-primary)]">{brandName.slice(0, 1)}</span>
                )}
              </div>
              <span
                className="gradient-text text-xl font-extrabold tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {brandName}
              </span>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-[250px]">
              {slogan}
            </p>
          </div>

          {/* Column 3: Contact Info */}
          {(storeInfo.phone || displayAddress || storeInfo.email) && (
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-sm text-[var(--color-text-primary)] uppercase tracking-wider">
                {t('storeInfo.phone')}
              </h4>
              <div className="flex flex-col gap-2.5">
                {storeInfo.phone && (
                  <a
                    href={`tel:${storeInfo.phone}`}
                    className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)]
                      hover:text-[var(--color-primary)]"
                  >
                    <Phone size={14} className="text-[var(--color-primary)] flex-shrink-0" />
                    <span dir="ltr">{storeInfo.phone}</span>
                  </a>
                )}
                {displayAddress && (
                  <div className="inline-flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                    <MapPin size={14} className="text-[var(--color-secondary)] flex-shrink-0 mt-0.5" />
                    <span>{displayAddress}</span>
                  </div>
                )}
                {storeInfo.email && (
                  <a
                    href={`mailto:${storeInfo.email}`}
                    className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)]
                      hover:text-[var(--color-primary)]"
                  >
                    <Mail size={14} className="text-[var(--color-accent)] flex-shrink-0" />
                    <span>{storeInfo.email}</span>
                  </a>
                )}
                {todayHours && (
                  <div className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                    <Clock size={14} className="text-[var(--color-warning)] flex-shrink-0" />
                    <span>{formatTime(todayHours.open)} – {formatTime(todayHours.close)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Column 4: Social */}
          {storeInfo.socials && storeInfo.socials.length > 0 && (
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-sm text-[var(--color-text-primary)] uppercase tracking-wider">
                Social
              </h4>
              <div className="flex items-center gap-2">
                {storeInfo.socials.map((social) => (
                  <SocialLinkButton
                    key={social.platform}
                    platform={social.platform}
                    url={social.url}
                    size={40}
                    iconSize={16}
                    className="!rounded-xl"
                    defaultBg="var(--color-surface)"
                    defaultColor="var(--color-text-secondary)"
                    defaultBorder="1px solid var(--color-border)"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom divider + copyright */}
        <div className="section-divider-premium w-full mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[var(--color-text-secondary)]">
            {t('footer.copyrightText', {
              year: currentYear,
              brand: brandName,
              provider: 'Mot7km'
            })}
          </p>
          <a
            href="https://mot7km.store"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] px-2.5 py-1 rounded-full border border-transparent hover:border-[var(--color-border)] hover:bg-[var(--color-surface)]/40 transition-opacity duration-200 cursor-pointer"
          >
            <span>Powered by</span>
            <span className="gradient-text font-bold">Mot7km</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-[transform,opacity] duration-200"
            >
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
});