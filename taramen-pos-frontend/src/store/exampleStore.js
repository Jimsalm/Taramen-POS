import { create } from "zustand";

const initialState = {
   // Simple values
   user: null,
   count: 0,
   isOpen: false,

   // Arrays
   items: [],
   notifications: [],
};

const useExampleStore = create((set, get) => ({
   // Initial state
   ...initialState,

   // Using helpers for simple setters
   setUser: (user) => set({ user }),
   setCount: (count) => set({ count }),

   // Reset entire store
   reset: () => set(initialState),

   // Toggle boolean
   toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),

   // Increment/Decrement
   increment: () => set((state) => ({ count: state.count + 1 })),
   decrement: () => set((state) => ({ count: state.count - 1 })),
   incrementBy: (amount) => set((state) => ({ count: state.count + amount })),

   // Array operations
   addItem: (item) =>
      set((state) => ({
         items: [...state.items, item],
      })),

   updateItem: (id, data) =>
      set((state) => ({
         items: state.items.map((item) => (item.id === id ? { ...item, ...data } : item)),
      })),

   removeItem: (id) =>
      set((state) => ({
         items: state.items.filter((item) => item.id !== id),
      })),

   clearItems: () => set({ items: [] }),

   // Multiple updates at once
   setMultiple: (updates) => set(updates),

   // Complex action with get
   addItemWithValidation: (item) => {
      const { items } = get();

      // Check if item already exists
      if (items.find((i) => i.id === item.id)) {
         throw new Error("Item already exists");
      }

      set({ items: [...items, item] });
   },
}));

export default useExampleStore;
