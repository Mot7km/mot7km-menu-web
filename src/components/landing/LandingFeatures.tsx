'use client';

import { useTranslations } from 'next-intl';
import { QrCode, Camera, Palette, RefreshCw, Languages, Moon, ArrowRight } from 'lucide-react';

interface FeatureConfig {
  id: 'qr' | 'cinematic' | 'customization' | 'sync' | 'bilingual' | 'themes';
  icon: typeof QrCode;
  span?: string;
}

const FEATURE_CONFIGS: FeatureConfig[] = [
  { id: 'qr', icon: QrCode, span: 'sm:col-span-2' },
  { id: 'cinematic', icon: Camera },
  { id: 'customization', icon: Palette },
  { id: 'sync', icon: RefreshCw },
  { id: 'bilingual', icon: Languages },
  { id: 'themes', icon: Moon, span: 'sm:col-span-2' },
];

/* ── QR (21×21, real finder patterns, not scannable) ── */
const QR_PATTERN = [
  '111111100000001111111',
  '100000100000001000001',
  '101110100000001011101',
  '101110100000001011101',
  '101110100000001011101',
  '100000100000001000001',
  '111111101010101111111',
  '000000000000000000000',
  '110101100010101001100',
  '001010011010100110010',
  '110011001010100101100',
  '000000000000000000000',
  '110010001010101001100',
  '001101111010100110010',
  '111111101010100101100',
  '100000110101011001100',
  '101110101010100110010',
  '101110101010101001100',
  '101110110101010110010',
  '100000101010101001100',
  '111111101010100110010',
];

function QrArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 21 21" className={className} fill="currentColor" aria-hidden>
      {QR_PATTERN.map((row, y) =>
        [...row].map((cell, x) =>
          cell === '1' ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" /> : null
        )
      )}
    </svg>
  );
}

/* ── Preview visuals ──────────────────────────────────── */

function MenuPreview() {
  const items = [
    { name: 'Flat White', price: '4.50' },
    { name: 'Cardamom Latte', price: '5.00' },
    { name: 'Basbousa', price: '6.00' },
    { name: 'Cold Brew', price: '4.00' },
  ];

  return (
    <div className="flex w-full flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-3.5">
      <p className="text-[10.5px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
        Today&rsquo;s Menu
      </p>
      <div className="mt-2.5 space-y-1.5">
        {items.map((it) => (
          <div key={it.name} className="flex items-baseline justify-between gap-3 text-[13px]">
            <span className="truncate text-[var(--color-text-primary)]">{it.name}</span>
            <span className="font-semibold tabular-nums text-[var(--color-text-secondary)]">
              {it.price}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhotoStrip() {
  const photos = [
    { label: 'Hero', tint: 'bg-[var(--color-primary)]/20' },
    { label: 'Gallery', tint: 'bg-[var(--color-accent)]/20' },
    { label: 'Dish', tint: 'bg-[var(--color-text-primary)]/10' },
  ];

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {photos.map((p) => (
        <div key={p.label} className="flex flex-col gap-2">
          <span className={['h-20 rounded-lg', p.tint].join(' ')} aria-hidden />
          <span className="text-[11px] font-medium text-[var(--color-text-muted)]">{p.label}</span>
        </div>
      ))}
    </div>
  );
}

function TypeSpecimen() {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-3xl font-bold leading-none text-[var(--color-text-primary)]">Aa</p>
          <p className="mt-1.5 text-[11px] font-medium text-[var(--color-text-muted)]">English</p>
        </div>
        <div className="text-end">
          <p className="text-3xl font-bold leading-none text-[var(--color-text-primary)]">أب</p>
          <p className="mt-1.5 text-[11px] font-medium text-[var(--color-text-muted)]">العربية</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="h-7 w-7 rounded-md bg-[var(--color-primary)]" aria-hidden />
        <span className="h-7 w-7 rounded-md bg-[var(--color-accent)]" aria-hidden />
        <span className="h-7 w-7 rounded-md bg-[var(--color-text-primary)]" aria-hidden />
        <span className="h-7 w-7 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]" aria-hidden />
      </div>
    </div>
  );
}

function StockRow({
  name,
  status,
  tone,
}: {
  name: string;
  status: string;
  tone: 'ok' | 'low';
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3.5 py-2.5">
      <span className="truncate text-[13.5px] text-[var(--color-text-primary)]">{name}</span>
      <span
        className={[
          'shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tabular-nums',
          tone === 'low'
            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
            : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
        ].join(' ')}
      >
        {status}
      </span>
    </div>
  );
}

function LiveStock() {
  return (
    <div className="space-y-2">
      <StockRow name="Cardamom Latte" status="8 left" tone="ok" />
      <StockRow name="Basbousa" status="Low · 2" tone="low" />
      <StockRow name="Cold Brew" status="5 left" tone="ok" />
    </div>
  );
}

function BilingualSample() {
  const rows = [
    { en: 'Starters', ar: 'المقبلات' },
    { en: 'Hot Drinks', ar: 'مشروبات ساخنة' },
    { en: 'Desserts', ar: 'الحلويات' },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-3.5 py-2.5 text-[10.5px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
        <span>Menu</span>
        <span dir="rtl">القائمة</span>
      </div>
      <div className="space-y-2.5 p-3.5">
        {rows.map((row) => (
          <div key={row.en} className="flex items-center justify-between gap-3 text-[13px]">
            <span className="text-[var(--color-text-primary)]">{row.en}</span>
            <span className="text-[var(--color-text-primary)]" dir="rtl">
              {row.ar}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ThemePreview() {
  const themes = [
    {
      label: 'Light',
      wrap: 'bg-neutral-100 border-neutral-200',
      inkStrong: 'bg-neutral-900',
      ink: 'bg-neutral-500',
      line: 'bg-neutral-300',
      fill: 'bg-white',
    },
    {
      label: 'Dark',
      wrap: 'bg-neutral-950 border-neutral-800',
      inkStrong: 'bg-white',
      ink: 'bg-neutral-400',
      line: 'bg-neutral-800',
      fill: 'bg-neutral-900',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {themes.map((m) => (
        <div key={m.label} className="flex flex-col gap-2">
          <div className={['flex flex-col gap-3 rounded-xl border p-3.5', m.wrap].join(' ')}>
            {/* Header row */}
            <div className="flex items-center gap-2">
              <span className={['h-2.5 w-2.5 rounded-sm', m.inkStrong].join(' ')} aria-hidden />
              <span className={['h-1.5 w-12 rounded-full', m.ink].join(' ')} aria-hidden />
            </div>

            {/* Menu rows */}
            <div className="space-y-2.5">
              {[16, 20, 14].map((w, i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <span
                    className={['h-1.5 rounded-full', m.line].join(' ')}
                    style={{ width: `${w * 4}px` }}
                    aria-hidden
                  />
                  <span className={['h-1.5 w-6 rounded-full', m.line].join(' ')} aria-hidden />
                </div>
              ))}
            </div>

            {/* CTA bar */}
            <div className={['h-7 w-full rounded-lg', m.fill].join(' ')} aria-hidden />
          </div>
          <span className="text-[11px] font-medium text-[var(--color-text-muted)]">{m.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Section ─────────────────────────────────────────── */

export function LandingFeatures() {
  const t = useTranslations('landing.features');

  return (
    <section id="features" className="border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            {t('sectionTag')}
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl md:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed">
            {t('description')}
          </p>
        </div>

        {/* Bento grid */}
        <div className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {FEATURE_CONFIGS.map((feat) => {
            const Icon = feat.icon;

            return (
              <article
                key={feat.id}
                className={[
                  'flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors duration-200 hover:border-[var(--color-primary)]/40',
                  feat.span ?? '',
                ].join(' ')}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className="h-[18px] w-[18px] shrink-0 text-[var(--color-primary)]"
                    strokeWidth={2}
                  />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    {t(`items.${feat.id}.tag`)}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold leading-snug text-[var(--color-text-primary)]">
                  {t(`items.${feat.id}.title`)}
                </h3>

                <p className="mt-2.5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {t(`items.${feat.id}.description`)}
                </p>

                {/* Preview — flows naturally after text, no bottom pinning */}
                <div className="mt-6">
                  {feat.id === 'qr' && (
                    <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-[auto_1fr] sm:gap-5">
                      <QrArt className="mx-auto h-24 w-24 text-[var(--color-text-primary)] sm:mx-0 sm:h-28 sm:w-28" />
                      <MenuPreview />
                    </div>
                  )}
                  {feat.id === 'cinematic' && <PhotoStrip />}
                  {feat.id === 'customization' && <TypeSpecimen />}
                  {feat.id === 'sync' && <LiveStock />}
                  {feat.id === 'bilingual' && <BilingualSample />}
                  {feat.id === 'themes' && <ThemePreview />}
                </div>
              </article>
            );
          })}
        </div>

        {/* Footer strip */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[var(--color-text-secondary)]">
          <span>Every feature is included in every plan.</span>
          <a
            href="#pricing"
            className="inline-flex items-center gap-1.5 font-semibold text-[var(--color-primary)] transition-opacity hover:opacity-80"
          >
            See pricing
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}