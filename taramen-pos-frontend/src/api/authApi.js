import axiosInstance from '../shared/lib/axios';

const authApi = {
  login: (credentials) => 
    axiosInstance.post('/auth/login', credentials),

  register: (userData) => 
    axiosInstance.post('/auth/register', userData),

  getCurrentUser: () => 
    axiosInstance.get('/auth/me'),


  forgotPassword: (email) =>
    axiosInstance.post('/auth/forgot-password', { email }),

  resetPassword: ({ token, password, password_confirmation }) =>
    axiosInstance.post('/auth/reset-password', {
      token,
      password,
      password_confirmation
    }),

  refreshToken: (refreshToken) =>
    axiosInstance.post('/auth/refresh-token', { refresh_token: refreshToken }),

  logout: () => 
    axiosInstance.post('/auth/logout')
};

export default authApi;