'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const t = useTranslations();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="w-full py-1">
      <div className="mx-auto max-w-4xl">
        <form onSubmit={handleSubmit} className="relative group">
          {/* Gradient glow ring (behind) */}
          <div
            className="absolute -inset-[1px] rounded-full opacity-0
              group-focus-within:opacity-100
              transition-opacity duration-500 pointer-events-none"
            style={{ background: 'var(--gradient-primary)', padding: '1px' }}
          >
            <div className="w-full h-full rounded-full bg-[var(--color-surface)]" />
          </div>

          <div
            className="relative rounded-full bg-[var(--color-surface-subtle)] border border-[var(--color-border)] overflow-hidden
              transition-all duration-400
              group-focus-within:border-[var(--color-primary)] group-focus-within:shadow-[var(--shadow-card)]"
          >
            {/* Search Icon */}
            <div className="absolute left-1 top-1 bottom-1 flex items-center pl-4 pointer-events-none">
              <Search
                className="w-5 h-5 text-[var(--color-primary)]
                  transition-all duration-300
                  group-focus-within:scale-110"
              />
            </div>

            {/* Input */}
            <input
              type="text"
              placeholder={t('search.placeholder')}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-transparent rounded-full
                focus:outline-none
                transition-all duration-300
                text-base text-[var(--color-text-primary)]
                placeholder:text-[var(--color-text-muted)]"
            />
          </div>
        </form>
      </div>
    </div>
  );
}