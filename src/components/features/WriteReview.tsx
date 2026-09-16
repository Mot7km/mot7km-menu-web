'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Star } from 'lucide-react';

interface ReviewFormProps {
  /** Callback when review is submitted */
  onSubmit?: (data: { reviewer: string; rating: number; comment: string }) => void;
  /** Initial reviewer name (optional) */
  initialName?: string;
  /** Whether the form is loading (e.g., during submission) */
  isLoading?: boolean;
}

export default function ReviewForm({
  onSubmit,
  initialName = '',
  isLoading = false,
}: ReviewFormProps) {
  const t = useTranslations();

  const [reviewer, setReviewer] = useState(initialName);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === '') return;
    onSubmit?.({ reviewer: reviewer.trim() || 'Anonymous', rating, comment });
    // Optionally reset form after successful submit (parent can handle)
  };

  const isFormValid = rating > 0 && comment.trim().length >= 3;

  return (
    <form
      onSubmit={handleSubmit}
      className="group flex flex-col gap-4 p-4 sm:p-5 w-full
        bg-[var(--color-surface)]
        border border-[var(--color-border)]
        rounded-xl
        transition-all duration-300 ease-out
        hover:border-[var(--color-primary)]/40"
      style={{ boxShadow: 'var(--shadow-xs)' }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-xs)'; }}
    >
      <h3 className="font-api font-bold text-lg text-[var(--color-text-primary)]">
        {t('review.writeReview')}
      </h3>

      {/* Name field */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="reviewer-name" className="text-sm font-medium text-[var(--color-text-secondary)]">
          {t('review.name')} <span className="text-[var(--color-text-muted)]">({t('review.optional')})</span>
        </label>
        <input
          id="reviewer-name"
          type="text"
          value={reviewer}
          onChange={(e) => setReviewer(e.target.value)}
          placeholder={t('review.namePlaceholder')}
          className="w-full px-4 py-2.5 rounded-lg
            bg-[var(--color-background)]
            border border-[var(--color-border)]
            text-[var(--color-text-primary)]
            placeholder:text-[var(--color-text-muted)]/70
            focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40
            transition-all duration-200"
        />
      </div>

      {/* Rating stars */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--color-text-secondary)]">
          {t('review.rating')} <span className="text-[var(--color-danger)]">*</span>
        </label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = (hoveredRating || rating) >= star;
            return (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 focus:outline-none transition-transform hover:scale-110 active:scale-90 cursor-pointer"
                aria-label={`${star} stars`}
              >
                <Star
                  size={28}
                  className={`transition-colors duration-200 ${
                    isFilled
                      ? 'fill-[var(--color-warning)] text-[var(--color-warning)]'
                      : 'fill-transparent text-[var(--color-border)]'
                  }`}
                  strokeWidth={1.5}
                />
              </button>
            );
          })}
          <span className="ml-2 text-sm font-medium text-[var(--color-text-muted)]">
            {rating > 0 ? `${rating} / 5` : ''}
          </span>
        </div>
      </div>

      {/* Comment textarea */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="review-comment" className="text-sm font-medium text-[var(--color-text-secondary)]">
          {t('review.comment')} <span className="text-[var(--color-danger)]">*</span>
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t('review.commentPlaceholder')}
          rows={4}
          className="w-full px-4 py-2.5 rounded-lg
            bg-[var(--color-background)]
            border border-[var(--color-border)]
            text-[var(--color-text-primary)]
            placeholder:text-[var(--color-text-muted)]/70
            focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40
            resize-y min-h-[100px]
            transition-all duration-200"
        />
        <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
          <span>{comment.length} / 500</span>
          {comment.length > 0 && comment.length < 3 && (
            <span className="text-[var(--color-danger)]">{t('review.tooShort')}</span>
          )}
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={!isFormValid || isLoading}
        className="mt-2 w-full py-3 rounded-xl
          bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]
          text-[var(--color-text-on-primary)] font-bold text-base
          shadow-[var(--shadow-glow)]
          hover:shadow-[var(--shadow-glow-strong)]
          hover:scale-[1.01] active:scale-[0.99]
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isLoading ? t('review.submitting') : t('review.submit')}
      </button>
    </form>
  );
}