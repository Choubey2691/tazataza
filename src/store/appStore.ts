import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  category: string;
  description?: string;
  quantity: number;
}

export interface Address {
  id: string;
  house_no: string;
  landmark: string | null;
  area: string;
  pincode: string;
  is_default: boolean | null;
}

interface AppState {
  // Cart (local state, persisted)
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, "quantity">) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  // Selected address (for checkout flow)
  selectedAddress: Address | null;
  setSelectedAddress: (address: Address | null) => void;

  // Delivery slot (for checkout flow)
  selectedSlot: string;
  setSelectedSlot: (slot: string) => void;

  // Payment mode (for checkout flow)
  paymentMode: string;
  setPaymentMode: (mode: string) => void;

  // Reset checkout state
  resetCheckout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Cart
      cart: [],
      addToCart: (product) =>
        set((state) => {
          const existing = state.cart.find((item) => item.id === product.id);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { ...product, quantity: 1 }] };
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { cart: state.cart.filter((item) => item.id !== productId) };
          }
          return {
            cart: state.cart.map((item) =>
              item.id === productId ? { ...item, quantity } : item
            ),
          };
        }),
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        const state = get();
        return state.cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
      getCartCount: () => {
        const state = get();
        return state.cart.reduce((count, item) => count + item.quantity, 0);
      },

      // Checkout state
      selectedAddress: null,
      setSelectedAddress: (address) => set({ selectedAddress: address }),

      selectedSlot: "",
      setSelectedSlot: (slot) => set({ selectedSlot: slot }),

      paymentMode: "",
      setPaymentMode: (mode) => set({ paymentMode: mode }),

      resetCheckout: () =>
        set({
          cart: [],
          selectedAddress: null,
          selectedSlot: "",
          paymentMode: "",
        }),
    }),
    {
      name: "taza-taza-cart",
    }
  )
);
