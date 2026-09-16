'use client';

import { useTranslations } from 'next-intl';
import { Mail, Sparkles } from 'lucide-react';

export function NewsletterSection() {
  const t = useTranslations('newsletter');

  return (
    <section className="relative w-full py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[var(--color-surface)] border-t border-[var(--color-divider)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-[var(--color-primary)]/6 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[var(--color-accent)]/5 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center gap-4">
        {/* Icon with gradient glow */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center
            text-white mb-2
            shadow-[0_8px_30px_rgba(22,131,199,0.3)]
            transition-all duration-300 hover:scale-105
            hover:shadow-[0_8px_40px_rgba(22,131,199,0.4)]"
          style={{ background: 'var(--gradient-primary)' }}
        >
          <Mail size={28} />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
          bg-[var(--color-primary-50)] border border-[var(--color-primary-100)]
          text-[var(--color-primary)] text-xs font-semibold uppercase tracking-wider">
          <Sparkles size={12} />
          <span>10% OFF</span>
        </div>

        <h2
          className="text-3xl md:text-4xl font-extrabold text-[var(--color-text-primary)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {t('title')}
        </h2>
        <p className="text-base text-[var(--color-text-secondary)] max-w-md">
          {t('subtitle')}
        </p>

        <form
          className="w-full max-w-md flex flex-col sm:flex-row gap-3 mt-4"
          onSubmit={(e) => { e.preventDefault(); }}
        >
          <div className="flex-1 relative group">
            {/* Gradient border on focus */}
            <div
              className="absolute -inset-[1px] rounded-xl opacity-0
                group-focus-within:opacity-100
                transition-opacity duration-500 pointer-events-none"
              style={{ background: 'var(--gradient-primary)', padding: '1px' }}
            >
              <div className="w-full h-full rounded-xl bg-[var(--color-background)]" />
            </div>
            <input
              type="email"
              required
              placeholder={t('placeholder')}
              className="relative w-full h-12 px-4 rounded-xl
                border border-[var(--color-border)]
                bg-[var(--color-background)]
                focus:border-transparent focus:outline-none
                transition-all
                placeholder:text-[var(--color-text-muted)]
                shadow-sm
                group-focus-within:shadow-[var(--shadow-glow)]"
            />
          </div>
          <button
            type="submit"
            className="h-12 px-6 rounded-xl font-bold text-white
              transition-all duration-300
              shadow-[0_4px_15px_rgba(22,131,199,0.3)]
              hover:shadow-[0_4px_25px_rgba(22,131,199,0.45)]
              hover:-translate-y-0.5
              active:scale-95
              flex items-center justify-center gap-2"
            style={{ background: 'var(--gradient-primary)' }}
          >
            <span>{t('button')}</span>
            <Mail size={16} />
          </button>
        </form>
      </div>
    </section>
  );
}
