import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import authApi from '@/api/authApi';
import useAuthStore from '@/store/useAuthStore';

export const authKeys = {
  user: ['user'],
};

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: (credentials) => authApi.login(credentials),
    onSuccess: (data) => {
      const { user, token } = data;
      login(user, token);
      queryClient.setQueryData(authKeys.user, user);
      navigate('/dashboard');
      toast.success('Login successful');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logout();
      queryClient.removeQueries(authKeys.user);
      navigate('/login');
      toast.success('Logged out successfully');
    },
    onError: (error) => {
      console.error('Logout error:', error);
      logout();
      queryClient.removeQueries(authKeys.user);
      navigate('/login');
    },
  });
};

export const useUser = () => {
  const { user, isAuthenticated, setAuth } = useAuthStore();
  
  return useQuery({
    queryKey: authKeys.user,
    queryFn: async () => {
      if (isAuthenticated && user) return user;
      
      try {
        const data = await authApi.getCurrentUser();
        setAuth(data.user, data.token);
        return data.user;
      } catch (error) {

        if (error.response?.status === 401) {
          useAuthStore.getState().logout();
        }
        throw error;
      }
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};

export const useRegister = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: (userData) => authApi.register(userData),
    onSuccess: (data) => {
      const { user, token } = data;
      login(user, token);
      queryClient.setQueryData(authKeys.user, user);
      navigate('/dashboard');
      toast.success('Registration successful');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email) => authApi.forgotPassword(email),
    onSuccess: () => {
      useAuthStore.getState().setShowForgotPasswordModal(false);
      useAuthStore.getState().setShowCheckInboxModal(true);
      toast.success('Password reset link sent to your email');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    },
  });
};

export const useResetPassword = () => {
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: (data) => authApi.resetPassword(data),
    onSuccess: () => {
      navigate('/login');
      toast.success('Password reset successful. Please login with your new password.');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    },
  });
};
export const useCheckSession = () => {
  return useQuery({
    queryKey: ['check-session'],
    queryFn: async () => {
      const response = await authApi.getCurrentUser();
      return response.data;
    },
    retry: false,
  });
};
