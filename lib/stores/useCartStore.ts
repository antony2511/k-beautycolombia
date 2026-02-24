import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/lib/data/products';
import type { CartItem } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity) => {
        const items = get().items;
        const existingItem = items.find((item) => item.productId === product.id);

        if (existingItem) {
          // Si el producto ya existe, incrementar la cantidad
          set({
            items: items.map((item) =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          // Si es nuevo, agregarlo al carrito
          set({
            items: [
              ...items,
              {
                productId: product.id,
                product,
                quantity,
              },
            ],
          });
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.productId !== productId),
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          // Si la cantidad es 0 o menor, eliminar el item
          get().removeItem(productId);
        } else {
          // Actualizar la cantidad
          set({
            items: get().items.map((item) =>
              item.productId === productId ? { ...item, quantity } : item
            ),
          });
        }
      },

      clearCart: () => {
        set({ items: [] });
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getTotal: () => {
        // Por ahora el total es igual al subtotal
        // En el futuro aquí se aplicarán descuentos
        return get().getSubtotal();
      },
    }),
    {
      name: 'kbeauty-cart', // nombre de la key en localStorage
    }
  )
);
