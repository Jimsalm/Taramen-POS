import { create } from "zustand";

const useSidebarStore = create((set) => ({
   isHovered: false,
   isCollapsed: false,
   isMobile: false,
   openItems: {},
   setIsCollapsed: (isCollapsed) => set({ isCollapsed }),
   setIsHovered: (isHovered) => set({ isHovered }),
   setIsMobile: (isMobile) => set({ isMobile }),
   setOpenItems: (openItems) => set({ openItems }),
   toggleItem: (itemTitle) =>
      set((state) => ({
         openItems: { ...state.openItems, [itemTitle]: !state.openItems[itemTitle] },
      })),
   resetOpenItems: () => set({ openItems: {} }),
}));

export default useSidebarStore;
