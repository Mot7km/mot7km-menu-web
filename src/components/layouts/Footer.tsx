'use client';

import { Phone, MapPin, Mail, Clock } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { isStoreOpen } from '@/data/storeInfo';
import { useStore } from '@/store/storeHooks';

// ── Social Icons ──
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

const socialIconMap: Record<string, React.FC<{ className?: string }>> = {
  whatsapp: WhatsAppIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  tiktok: TikTokIcon,
};

function formatTime(time24: string): string {
  const [h, m] = time24.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, '0')} ${suffix}`;
}

export function Footer() {
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
    <footer className="relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-surface)] transition-colors">
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
                  <img src={logoUrl} alt={brandName} className="h-full w-full object-cover" />
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
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-[250px]">
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
                    className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)]
                      hover:text-[var(--color-primary)] transition-colors"
                  >
                    <Phone size={14} className="text-[var(--color-primary)] flex-shrink-0" />
                    <span dir="ltr">{storeInfo.phone}</span>
                  </a>
                )}
                {displayAddress && (
                  <div className="inline-flex items-start gap-2 text-sm text-[var(--color-text-muted)]">
                    <MapPin size={14} className="text-[var(--color-secondary)] flex-shrink-0 mt-0.5" />
                    <span>{displayAddress}</span>
                  </div>
                )}
                {storeInfo.email && (
                  <a
                    href={`mailto:${storeInfo.email}`}
                    className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)]
                      hover:text-[var(--color-primary)] transition-colors"
                  >
                    <Mail size={14} className="text-[var(--color-accent)] flex-shrink-0" />
                    <span>{storeInfo.email}</span>
                  </a>
                )}
                {todayHours && (
                  <div className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
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
                {storeInfo.socials.map((social) => {
                  const IconComponent = socialIconMap[social.platform];
                  if (!IconComponent) return null;
                  return (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 rounded-xl
                        bg-[var(--color-card-light)] dark:bg-[var(--color-elevated-dark)]
                        border border-[var(--color-border)]
                        hover:border-[var(--color-primary)]/50
                        hover:scale-110 active:scale-95
                        transition-all duration-300 group"
                      aria-label={social.platform}
                    >
                      <IconComponent className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom divider + copyright */}
        <div className="section-divider-premium w-full mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[var(--color-text-muted)]">
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
            className="group inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] px-2.5 py-1 rounded-full border border-transparent hover:border-[var(--color-border)] hover:bg-[var(--color-surface)]/40 transition-all duration-300 opacity-70 hover:opacity-100 cursor-pointer"
          >
            <span className="transition-colors group-hover:text-[var(--color-text)]">Powered by</span>
            <span className="gradient-text font-bold">Mot7km</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
            >
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}