// src/data/menu.ts

export interface Review {
  reviewer: string;
  date: string;
  rating: number; // 1–5
  comment: string;
}

export interface CustomizationChoice {
  label: string;
  extraPrice: number;
}

export interface CustomizationOption {
  name: string;
  choices: CustomizationChoice[];
  defaultChoice?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  rating: string;
  image: string;
  featured?: boolean;
  category?: string;
  ingredients?: string[];
  customizationOptions?: CustomizationOption[];
  reviews?: Review[];
}

export const computeTotalPrice = (
  product: Product,
  selections: Record<string, string>
): string => {
  const numericPrice = parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0;
  let extraTotal = 0;

  if (product.customizationOptions) {
    for (const option of product.customizationOptions) {
      const selectedLabel = selections[option.name];
      if (selectedLabel) {
        const found = option.choices.find((c) => c.label === selectedLabel);
        if (found) extraTotal += found.extraPrice;
      }
    }
  }

  return `$${(numericPrice + extraTotal).toFixed(2)}`;
};