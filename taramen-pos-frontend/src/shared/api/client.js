import axios from "axios";
import { config } from "../../config";

const apiClient = axios.create({
  baseURL: config.api.baseUrl,
  timeout: 10000, 
});

apiClient.interceptors.request.use((req) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    req.headers.set('Authorization', `Bearer ${token}`);
  }
  return req;
}, (error) => {
  return Promise.reject(error);
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");

      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;