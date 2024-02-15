import { CartItem } from "@/lib/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface CartState {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
  increaseQuantity: (item: CartItem, quantity: number) => void;
  decreaseQuantity: (item: CartItem) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        cart: [],
        addToCart: (item) => {
          set((state) => ({
            cart: [...state.cart, item],
          }));
        },
        removeFromCart: (item) => {
          const productToRemove = get().cart.findIndex((p) => p.id === item.id);

          set((state) => {
            const newCart = [...state.cart];

            newCart.splice(productToRemove, 1);
            return { cart: newCart };
          });
        },

        increaseQuantity: (item, quantity) => {
          const itemToIncrease = get().cart.findIndex((p) => p.id === item.id);

          set((state) => {
            const newCart = [...state.cart];
            newCart[itemToIncrease].quantity += quantity;
            return { cart: newCart };
          });
        },
        decreaseQuantity: (item) => {
          const itemToDecrease = get().cart.findIndex((p) => p.id === item.id);

          set((state) => {
            const newCart = [...state.cart];
            newCart[itemToDecrease].quantity -= 1;
            if (newCart[itemToDecrease].quantity < 1)
              newCart.splice(itemToDecrease, 1);
            return { cart: newCart };
          });
        },
        clearCart: () => {
          set(() => ({
            cart: [],
          }));
        },
      }),
      {
        name: "shopping-cart-storage",
      }
    )
  )
);
