'use client';

import React, { useMemo } from 'react';
import { ShoppingBag, X, Trash2, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface CartItem {
  id: string;
  product: { id: string; name: string; image: string };
  selections: Record<string, any>;
  totalPrice: number;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totalPrice: number;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  totalPrice,
  updateQuantity,
  removeFromCart,
  clearCart,
}: CartDrawerProps) {
  const t = useTranslations();

  const groupedItems = useMemo(() => {
    const map = new Map<
      string,
      {
        product: any;
        selections: Record<string, any>;
        unitPrice: number;
        quantity: number;
        itemIds: string[];
      }
    >();

    items.forEach((item) => {
      const key = `${item.product.id}-${JSON.stringify(
        Object.keys(item.selections)
          .sort()
          .reduce((acc, k) => ({ ...acc, [k]: item.selections[k] }), {})
      )}`;
      if (map.has(key)) {
        const group = map.get(key)!;
        group.quantity += item.quantity;
        group.itemIds.push(item.id);
      } else {
        map.set(key, {
          product: item.product,
          selections: item.selections,
          unitPrice: item.totalPrice,
          quantity: item.quantity,
          itemIds: [item.id],
        });
      }
    });

    return Array.from(map.values());
  }, [items]);

  const removeGroup = (group: (typeof groupedItems)[0]) => {
    group.itemIds.forEach((id) => removeFromCart(id));
  };

  // Handle quantity change for a group
  const handleQuantityChange = (group: (typeof groupedItems)[0], delta: number) => {
    const firstId = group.itemIds[0];
    if (delta > 0) {
      // Increment the first item's quantity
      updateQuantity(firstId, 1);
    } else {
      // Decrement: if total quantity > 1, decrease first item; otherwise remove it
      if (group.quantity > 1) {
        updateQuantity(firstId, -1);
      } else {
        // Remove the entire group (only one item left)
        removeGroup(group);
      }
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity animate-fade-in"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 z-50 
          w-full max-w-4xl
          bg-[var(--color-background)] rounded-t-[2rem] 
          shadow-[0_-20px_60px_rgba(0,0,0,0.15)] flex flex-col
          transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1)
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ maxHeight: '85vh' }}
      >
        {/* Header */}
        <div className="p-3 sm:p-4 lg:p-6 border-b border-[var(--color-border)] flex flex-col items-center shrink-0">
          <div className="w-12 h-1.5 bg-[var(--color-border-strong)] rounded-full mb-3 sm:mb-4 opacity-50" />
          <div className="w-full flex items-center justify-between">
            <h2 className="font-api font-bold text-lg sm:text-xl lg:text-2xl text-[var(--color-text-primary)] flex items-center gap-2">
              <ShoppingBag size={20} className="text-[var(--color-primary)]" />
              {t('cart.yourOrder')}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[var(--color-surface)] text-[var(--color-text-muted)] transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 lg:space-y-6">
          {groupedItems.map((group) => {
            const { product, selections, unitPrice, quantity, itemIds } = group;
            const totalGroupPrice = unitPrice * quantity;

            return (
              <div
                key={itemIds.join('-')}
                className="relative flex gap-3 sm:gap-4 lg:gap-6 p-3 sm:p-4 lg:p-5 rounded-2xl glass-card border border-[var(--color-border)]/50 animate-fade-in-up"
              >
                {/* Product image */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 shrink-0 rounded-xl overflow-hidden bg-[var(--color-card-light)]">
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                </div>

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <h4 className="font-bold text-sm sm:text-base lg:text-lg text-[var(--color-text-primary)] truncate">
                      {product.name}
                    </h4>

                    {/* Selections */}
                    {Object.keys(selections).length > 0 && (
                      <div className="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {Object.entries(selections).map(([key, val]) => (
                          <div
                            key={key}
                            className="flex items-center gap-1 text-xs sm:text-sm bg-[var(--color-surface)]/50 px-2 py-1 rounded-full border border-[var(--color-border)]/40"
                          >
                            <span className="text-[var(--color-text-muted)]">{key}:</span>
                            <span className="font-medium text-[var(--color-text-secondary)] truncate">
                              {val}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {itemIds.length > 1 && (
                      <div className="mt-1.5 text-[10px] sm:text-xs font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-0.5 rounded-full inline-block">
                        {itemIds.length} × combined
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                    <span className="font-api font-bold text-sm sm:text-base lg:text-lg text-[var(--color-primary)]">
                      ${totalGroupPrice.toFixed(2)}
                    </span>

                    {/* Quantity control - replaces static badge */}
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="flex items-center bg-[var(--color-surface-subtle)] rounded-full border border-[var(--color-border)] p-0.5 shadow-sm">
                        <button
                          onClick={() => handleQuantityChange(group, -1)}
                          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full 
                            hover:bg-[var(--color-surface)] active:scale-90 
                            text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]
                            transition-all duration-200 cursor-pointer
                            disabled:opacity-40 disabled:cursor-not-allowed"
                          aria-label={t('cart.decreaseQuantity')}
                          disabled={quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-bold text-sm sm:text-base min-w-[1.75rem] sm:min-w-[2rem] text-center text-[var(--color-text-primary)] select-none">
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(group, 1)}
                          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full 
                            hover:bg-[var(--color-surface)] active:scale-90 
                            text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]
                            transition-all duration-200 cursor-pointer"
                          aria-label={t('cart.increaseQuantity')}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeGroup(group)}
                  className="group self-start p-2 text-[var(--color-danger)]/70 hover:text-white hover:bg-[var(--color-danger)] rounded-full transition-all duration-200 cursor-pointer active:scale-90 hover:rotate-6"
                >
                  <Trash2 size={18} className="transition-transform duration-200 group-hover:scale-110" />
                </button>
              </div>
            );
          })}

          {groupedItems.length === 0 && (
            <div className="text-center py-10 text-[var(--color-text-muted)]">
              <ShoppingBag size={48} className="mx-auto opacity-30 mb-2" />
              <p className="text-sm">{t('cart.empty')}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 lg:p-6 border-t border-[var(--color-border)] bg-[var(--color-surface)] shrink-0 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[var(--color-text-secondary)] font-medium text-sm sm:text-base">
              {t('cart.grandTotal')}
            </span>
            <span className="font-api font-bold text-xl sm:text-2xl lg:text-3xl text-[var(--color-text-primary)]">
              ${totalPrice.toFixed(2)}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <button className="w-full py-3.5 sm:py-4 lg:py-5 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-[var(--color-on-primary)] font-bold text-base sm:text-lg lg:text-xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer">
              {t('cart.checkout')}
            </button>

            <button
              onClick={clearCart}
              className="w-full py-2.5 sm:py-3 lg:py-4 rounded-xl bg-[var(--color-danger)]/10 text-[var(--color-danger)] font-bold text-sm hover:bg-[var(--color-danger)]/20 transition-all active:scale-[0.99] cursor-pointer"
            >
              {t('cart.clearCart')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}