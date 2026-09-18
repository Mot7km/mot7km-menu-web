'use client';

import React from 'react';

export interface LoaderProps {
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'page' | 'section' | 'action';
  text?: string;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  fullScreen = false,
  size = 'md',
  variant = 'section',
  text = 'Loading...',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const textClasses = {
    page: 'text-base font-medium',
    section: 'text-sm',
    action: 'text-xs font-medium',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Gradient spinner */}
      <div className={`relative ${sizeClasses[size]} ${className}`} role="status" aria-label="Loading">
        <div
          className="absolute inset-0 rounded-full animate-spin"
          style={{
            background: 'conic-gradient(from 0deg, transparent, var(--color-primary), transparent)',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
          }}
        />
        <div className="absolute inset-[3px] rounded-full bg-[var(--color-background)]" />
        <span className="sr-only">Loading</span>
      </div>
      {text && <p className={`animate-pulse text-[var(--color-text-muted)] ${textClasses[variant]}`}>{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center glass transition-all">
        {spinner}
      </div>
    );
  }

  return spinner;
};