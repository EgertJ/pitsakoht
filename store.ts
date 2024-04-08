import { CartItem } from "@/lib/types";
import { create } from "zustand";
import {
  devtools,
  persist,
  StateStorage,
  createJSONStorage,
} from "zustand/middleware";
import { get, set, del } from "idb-keyval"; // can use anything: IndexedDB, Ionic Storage, etc.

interface CartState {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
  increaseQuantity: (item: CartItem, quantity: number) => void;
  decreaseQuantity: (item: CartItem) => void;
  clearCart: () => void;
}

const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

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
        storage: createJSONStorage(() => storage),
      }
    )
  )
);
