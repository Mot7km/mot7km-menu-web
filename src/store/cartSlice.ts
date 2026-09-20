import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { computeTotalPrice, type Product } from '@/data/menu';

export interface CartItem {
  id: string;
  product: Product;
  selections: Record<string, string>;
  quantity: number;
  totalPrice: number;
}

interface CartState {
  businessName: string | null;
  items: CartItem[];
  isDrawerOpen: boolean;
}

const initialState: CartState = {
  businessName: null,
  items: [],
  isDrawerOpen: false,
};

function generateCartItemId(productId: string, selections: Record<string, string>) {
  const sortedEntries = Object.entries(selections)
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([key, value]) => `${key}:${value}`)
    .join('|');

  return `${productId}-${sortedEntries}`;
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (
      state,
      action: PayloadAction<{
        product: Product;
        selections: Record<string, string>;
        quantity: number;
      }>
    ) => {
      const { product, selections, quantity } = action.payload;
      const itemId = generateCartItemId(product.id, selections);
      const existingItem = state.items.find((item) => item.id === itemId);

      if (existingItem) {
        existingItem.quantity += quantity;
        return;
      }

      const price = parseFloat(computeTotalPrice(product, selections).replace('$', '')) || 0;
      state.items.push({
        id: itemId,
        product,
        selections: { ...selections },
        quantity,
        totalPrice: price,
      });
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ itemId: string; delta: number }>) => {
      const item = state.items.find((entry) => entry.id === action.payload.itemId);
      if (item) item.quantity = Math.max(1, item.quantity + action.payload.delta);
    },
    clearCart: (state) => {
      state.items = [];
      state.isDrawerOpen = false;
    },
    setDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isDrawerOpen = action.payload;
    },
    setBusinessName: (state, action: PayloadAction<string | null>) => {
      if (state.businessName !== action.payload) {
        state.businessName = action.payload;
        state.items = [];
        state.isDrawerOpen = false;
      }
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart, setDrawerOpen, setBusinessName } = cartSlice.actions;
export default cartSlice.reducer;
