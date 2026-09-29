import { HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  shimmer?: boolean;
}

export function Skeleton({ className = '', shimmer = true, style, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`bg-[var(--color-surface-subtle)] rounded-md ${
        shimmer ? 'skeleton-shimmer' : 'animate-pulse'
      } ${className}`}
      style={style}
      {...props}
    />
  );
}
