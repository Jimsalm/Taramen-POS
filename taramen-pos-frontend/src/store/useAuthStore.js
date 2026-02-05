import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
      loading: false,

      setAuth: (user, token) => {
        set({ 
          user, 
          token,
          isAuthenticated: !!user && !!token,
          error: null 
        });
      },

      login: (user, token) => {
        localStorage.setItem('token', token);
        set({ 
          user, 
          token,
          isAuthenticated: true,
          error: null,
          loading: false
        });
      },

      logout: () => {
        localStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
          loading: false
        });
      },

      setError: (error) => set({ error, loading: false }),
      setLoading: (loading) => set({ loading }),
      
      showForgotPasswordModal: false,
      showCheckInboxModal: false,
      setShowForgotPasswordModal: (isOpen) => set({ showForgotPasswordModal: isOpen }),
      setShowCheckInboxModal: (isOpen) => set({ showCheckInboxModal: isOpen }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
