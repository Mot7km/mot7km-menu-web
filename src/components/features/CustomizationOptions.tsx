'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Product, computeTotalPrice } from '@/data/menu';
import { Settings2, Plus, Check } from 'lucide-react';

interface CustomizationOptionsProps {
  product: Product;
  onPriceChange?: (total: string, extras: number) => void;
  onSelectionsChange?: (selections: Record<string, string>) => void;
}

export function CustomizationOptions({ product, onPriceChange, onSelectionsChange }: CustomizationOptionsProps) {
  const t = useTranslations();

  const getDefaultSelections = (): Record<string, string> => {
    const defaults: Record<string, string> = {};
    if (product.customizationOptions) {
      for (const opt of product.customizationOptions) {
        if (opt.defaultChoice) {
          defaults[opt.name] = opt.defaultChoice;
        } else if (opt.choices.length > 0) {
          defaults[opt.name] = opt.choices[0].label;
        }
      }
    }
    return defaults;
  };

  const [selections, setSelections] = useState<Record<string, string>>(getDefaultSelections);
  const [extraTotal, setExtraTotal] = useState<number>(0);

  const updateTotals = (newSelections: Record<string, string>) => {
    let extras = 0;
    if (product.customizationOptions) {
      for (const opt of product.customizationOptions) {
        const chosen = newSelections[opt.name];
        if (chosen) {
          const found = opt.choices.find((c) => c.label === chosen);
          if (found) extras += found.extraPrice;
        }
      }
    }
    setExtraTotal(extras);
    const total = computeTotalPrice(product, newSelections);
    if (onPriceChange) onPriceChange(total, extras);
    if (onSelectionsChange) onSelectionsChange(newSelections);
  };

  const handleSelect = (optionName: string, choiceLabel: string) => {
    const newSelections = { ...selections, [optionName]: choiceLabel };
    setSelections(newSelections);
    updateTotals(newSelections);
  };

  useEffect(() => {
    const defaults = getDefaultSelections();
    setSelections(defaults);
    updateTotals(defaults);
  }, [product]);

  if (!product.customizationOptions || product.customizationOptions.length === 0) {
    return <div className="w-full rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-5 text-center text-sm text-[var(--color-text-muted)]"><div className="mb-1 flex items-center justify-center gap-2 font-semibold text-[var(--color-text-primary)]"><Settings2 size={17} className="text-[var(--color-primary)]" />{t('customization.title')}</div>{t('customization.empty')}</div>;
  }

  const isYesNoOption = (option: typeof product.customizationOptions[0]) => {
    if (option.choices.length !== 2) return false;
    const labels = option.choices.map(c => c.label.trim().toLowerCase());
    return labels.includes('yes') && labels.includes('no');
  };

  const hasExtras = extraTotal > 0;

  return (
    <div className="w-full glass-card rounded-2xl overflow-hidden relative">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-50" />

      <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-border)]/50 bg-[var(--color-surface)]/30 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
            <Settings2 size={18} />
          </div>
          <h3 className="font-api font-bold text-lg lg:text-xl text-[var(--color-text-primary)]">
            {t('customization.title')}
          </h3>
        </div>
        {hasExtras && (
          <div className="relative group animate-scale-in">
            <div className="absolute -inset-1 bg-[var(--color-primary)] rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300" />
            <span className="relative flex items-center gap-1 px-4 py-1.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-primary)]/30 text-sm font-bold text-[var(--color-primary)] shadow-sm">
              <Plus size={14} strokeWidth={3} />
              ${extraTotal.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      <div className="p-6 space-y-5">
        {product.customizationOptions.map((option, idx) => {
          const isYesNo = isYesNoOption(option);
          const currentSelection = selections[option.name];
          const delayClass = `stagger-${(idx % 5) + 1}`;

          if (isYesNo) {
            const yesChoice = option.choices.find(c => c.label.trim().toLowerCase() === 'yes')!;
            const noChoice = option.choices.find(c => c.label.trim().toLowerCase() === 'no')!;
            const isChecked = currentSelection?.trim().toLowerCase() === 'yes';
            const extraPrice = isChecked ? yesChoice.extraPrice : 0;

            const toggleYesNo = () => {
              const newLabel = isChecked ? noChoice.label : yesChoice.label;
              handleSelect(option.name, newLabel);
            };

            return (
              <div
                key={option.name}
                className={`flex items-center justify-between p-4 rounded-xl 
                  bg-[var(--color-surface)]/50 border border-[var(--color-border)]/60
                  hover:bg-[var(--color-surface)] hover:border-[var(--color-primary)]/40 hover:shadow-md
                  transition-all duration-300 cursor-pointer animate-fade-in-up ${delayClass} group`}
                onClick={toggleYesNo}
              >
                <div className="flex flex-col">
                  <span className="text-sm md:text-base font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                    {option.name}
                  </span>
                  {extraPrice > 0 && isChecked && (
                    <span className="text-xs font-medium text-[var(--color-primary)] mt-0.5">
                      +${extraPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className={`w-6 h-6 rounded-md border-2 transition-all duration-300 flex items-center justify-center ml-4
                  ${isChecked 
                    ? 'bg-[var(--color-primary)] border-[var(--color-primary)] shadow-[var(--shadow-glow)]'
                    : 'bg-transparent border-[var(--color-border-strong)] group-hover:border-[var(--color-primary)]/50'
                  }`}
                >
                  <Check size={14} strokeWidth={3} className={`text-[var(--color-text-on-primary)] transition-transform duration-300 ${isChecked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
                </div>
              </div>
            );
          }

          // Multi-choice
          return (
            <div
              key={option.name}
              className={`p-4 rounded-xl bg-[var(--color-surface)]/50 border border-[var(--color-border)]/60 animate-fade-in-up ${delayClass}`}
            >
              <h4 className="text-sm md:text-base font-semibold text-[var(--color-text-primary)] mb-3">
                {option.name}
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {option.choices.map((choice) => {
                  const isSelected = selections[option.name] === choice.label;
                  return (
                    <button
                      key={choice.label}
                      onClick={() => handleSelect(option.name, choice.label)}
                      className={`
                        relative overflow-hidden
                        text-sm font-medium px-4 py-2 rounded-xl transition-all duration-300
                        hover:scale-[1.02] active:scale-[0.98]
                        cursor-pointer
                        ${isSelected
                          ? 'text-[var(--color-text-on-primary)] shadow-[var(--shadow-glow)] border-transparent'
                          : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-text-primary)]'
                        }
                      `}
                    >
                      {isSelected && (
                        <div className="absolute inset-0" style={{ background: 'var(--gradient-primary)' }} />
                      )}
                      <span className="relative z-10 flex items-center gap-1.5">
                        {choice.label}
                        {choice.extraPrice > 0 && (
                          <span className={`text-xs ${isSelected ? 'opacity-90 font-semibold' : 'opacity-70'}`}>
                            (+${choice.extraPrice.toFixed(2)})
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}