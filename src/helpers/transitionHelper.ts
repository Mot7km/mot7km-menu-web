/**
 * Helper to generate consistent, valid CSS view-transition-names
 * for shared-element hero transitions between product cards and product details.
 */
export function getHeroTransitionName(id: string | number): string {
  const safeId = String(id).replace(/[^a-zA-Z0-9_-]/g, '_');
  return `product_hero_${safeId}`;
}
