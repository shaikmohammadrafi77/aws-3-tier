import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(persist(
  (set, get) => ({
    items: [],
    addItem: (item) => {
      const existing = get().items.find(i => i.id === item.id);
      if (existing) {
        set({ items: get().items.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) });
      } else {
        set({ items: [...get().items, { ...item, qty: 1 }] });
      }
    },
    removeItem: (id) => set({ items: get().items.filter(i => i.id !== id) }),
    updateQty: (id, qty) => {
      if (qty <= 0) return get().removeItem(id);
      set({ items: get().items.map(i => i.id === id ? { ...i, qty } : i) });
    },
    clearCart: () => set({ items: [] }),
    get total() {
      return get().items.reduce((s, i) => s + parseFloat(i.price) * i.qty, 0);
    },
    get count() {
      return get().items.reduce((s, i) => s + i.qty, 0);
    }
  }),
  { name: 'cart-store' }
));
