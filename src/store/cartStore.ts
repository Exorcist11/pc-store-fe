import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  id: string;
  productId: string;
  variantSku: string;
  imageUrl: string;
  specs: { label: string }[];
  discountPercent: number;
  qty: number;
  price: number;
  name: string;
};

type CartState = {
  items: CartItem[];
  setItems: (items: CartItem[]) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      setItems: (items) => set({ items }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      updateQty: (id, qty) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, qty } : i)),
        })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
