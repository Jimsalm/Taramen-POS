import { create } from 'zustand';

const useSidebarStore = create((set) => ({
  isCollapsed: false,
  isHovered: false,
  openItems: {},
  toggleCollapsed: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
  setIsHovered: (isHovered) => set({ isHovered }),
  setOpenItems: (openItems) => set({ openItems }),
  resetOpenItems: () => set({ openItems: {} }),
}));

export default useSidebarStore;
