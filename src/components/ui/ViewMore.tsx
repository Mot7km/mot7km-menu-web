'use client';

import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';

interface ViewMoreButtonProps {
  onClick: () => void;
  hasMore: boolean;
  label: string;
  variant?: 0 | 1; // 0 = product, 1 = review
}

export function ViewMoreButton({
  onClick,
  hasMore,
  label,
  variant = 0,
}: ViewMoreButtonProps) {
  if (!hasMore) return null;

  const isProduct = variant === 0;

  return (
    <button
      onClick={onClick}
      className={`
        group flex items-center justify-center gap-2 w-full rounded-full
        text-sm font-semibold cursor-pointer
        transition-all duration-300 ease-out
        hover:scale-[1.01] active:scale-[0.98]
        ${
          isProduct
            ? 'py-3.5 px-6 text-[var(--color-text-on-primary)] animate-gradient-shift'
            : 'py-2.5 px-4 text-[var(--color-primary)] bg-[var(--color-primary-50)] border border-[var(--color-primary-100)] hover:bg-[var(--color-primary-100)]'
        }
      `}
      style={isProduct ? { background: 'var(--gradient-primary)', backgroundSize: '200% 200%' } : undefined}
    >
      <span>{label}</span>
      <ChevronDown size={16} className="transition-transform duration-300 group-hover:translate-y-0.5" />
    </button>
  );
}

export function ThatsIt() {
  const t = useTranslations();
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-2">
      <div className="section-divider w-24" />
      <p className="text-xs font-medium text-[var(--color-text-secondary)]">
        {t('productList.thatsIt')}
      </p>
    </div>
  );
}