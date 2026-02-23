import { create } from "zustand";

const useAuthStore = create((set) => ({
  // Modal states
  isForgotPasswordModalOpen: false,
  errorMessage: "",
  isLoading: false,

  // Modal actions
  openForgotPasswordModal: () => set({ 
    isForgotPasswordModalOpen: true
  }),
  
  closeForgotPasswordModal: () => set({ 
    isForgotPasswordModalOpen: false 
  }),

  // Error handling
  showError: (message) => set({ 
    errorMessage: message || "Something went wrong." 
  }),
  
  clearError: () => set({ 
    errorMessage: "" 
  }),

  // Loading state
  setLoading: (isLoading) => set({ isLoading }),
}));

export default useAuthStore;
