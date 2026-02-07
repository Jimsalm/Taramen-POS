import axios from "axios";
import { config } from "../../config";

const apiClient = axios.create({
  baseURL: config.api.baseUrl,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;