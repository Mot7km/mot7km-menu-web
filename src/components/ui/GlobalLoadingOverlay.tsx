'use client';

import { useTranslations } from 'next-intl';
import { Loader } from '@/components/ui/Loader';

interface GlobalLoadingOverlayProps {
  isVisible: boolean;
  text?: string;
}

export function GlobalLoadingOverlay({ isVisible, text }: GlobalLoadingOverlayProps) {
  const t = useTranslations();

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/45 backdrop-blur-sm">
      <div className="rounded-3xl border border-white/20 bg-white/90 px-8 py-8 shadow-2xl dark:bg-[color:var(--color-surface)]/95">
        <Loader
          size="lg"
          text={text || t('loading.switchingLanguage')}
          className="text-[var(--color-primary)]"
        />
      </div>
    </div>
  );
}
