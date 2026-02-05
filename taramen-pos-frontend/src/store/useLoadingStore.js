import { create } from 'zustand';

const useLoadingStore = create((set) => ({
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
  startLoading: () => set({ isLoading: true }),
  stopLoading: () => set({ isLoading: false })
}));

export default useLoadingStore;
