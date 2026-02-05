import { create } from "zustand";

const defaultUserState = {
   token: null,
   user: null,
   session: null,
   openViewModal: false,
   openCreateModal: false,
   openEditModal: false,
   selectedUser: null,
};

const useUserStore = create((set) => ({
   ...defaultUserState,

   setToken: (token) => set({ token }),

   setUser: (user) => set({ user }),

   setSession: (session) => set({ session }),

   setOpenViewModal: (openViewModal) => set({ openViewModal }),

   setOpenCreateModal: (openCreateModal) => set({ openCreateModal }),

   setOpenEditModal: (openEditModal) => set({ openEditModal }),

   setSelectedUser: (selectedUser) => set({ selectedUser }),

   logout: () => set(defaultUserState),
}));

export default useUserStore;
