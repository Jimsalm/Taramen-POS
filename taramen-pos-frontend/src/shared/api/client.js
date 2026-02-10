import axios from "axios";
import { config } from "../../config";

const apiClient = axios.create({
  baseURL: config.api.baseUrl,
});

apiClient.interceptors.request.use((req) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});


apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
