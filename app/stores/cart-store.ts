import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CartStore, ProductToAdd } from "@/app/interface/cart";

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (product: ProductToAdd) => {
        let added = false;

        set((state: CartStore) => {
          const existing = state.items.find(
            (item: CartItem) => item.productId === product.productId
          );
          const currentQuantity = existing?.quantity ?? 0;

          if (currentQuantity >= product.stock) {
            return state;
          }

          added = true;

          return {
            items: existing
              ? state.items.map((item: CartItem) =>
                item.productId === product.productId
                  ? { ...item, stock: product.stock, quantity: item.quantity + 1 }
                  : item
              )
              : [{ ...product, quantity: 1 }, ...state.items],
          };
        });

        return added;
      },

      decreaseItem: (productId: string) =>
        set((state: CartStore) => ({
          items: state.items
            .map((item: CartItem) =>
              item.productId === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item: CartItem) => item.quantity > 0),
        })),

      removeItem: (productId: string) =>
        set((state: CartStore) => ({
          items: state.items.filter(
            (item: CartItem) => item.productId !== productId
          ),
        })),

      clearCart: () => set({ items: [] }),
    }),
    { name: "cart-storage" }
  )
);