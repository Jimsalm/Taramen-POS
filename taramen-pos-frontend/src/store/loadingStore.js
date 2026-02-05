import { create } from 'zustand';

const useLoadingStore = create((set) => ({
  isLoading: false,
  count: 0, // to handle multiple simultaneous loading actions
  
  showLoading: () => set((state) => ({
    count: state.count + 1,
    isLoading: true,
  })),
  
  hideLoading: () => set((state) => {
    const newCount = Math.max(state.count - 1, 0);
    return {
      count: newCount,
      isLoading: newCount > 0,
    };
  }),
}));

export default useLoadingStore;
