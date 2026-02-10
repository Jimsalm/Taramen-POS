import { useMutation } from "@tanstack/react-query";
import { config } from "../config";
import useAuthStore from "../stores/useAuthStore";

const loginApi = async (credentials) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); 

  try {
    const email = credentials.email ?? credentials.username ?? "";
    const requestBody = {
      email,
      password: credentials.password
    };

    const response = await fetch(`${config.api.baseUrl}/login`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = {};
    }

    if (!response.ok) {
      const errorDetails = data?.errors
        ? Object.values(data.errors).flat().filter(Boolean).join(" ")
        : "";
      const errorMessage =
        errorDetails ||
        data?.message ||
        data?.error?.message ||
        `Login failed: ${response.status} ${response.statusText}`;

      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection and try again.');
    }
    throw error;
  }
};

export const useLogin = () => {
  const { showError, setLoading } = useAuthStore();

  return useMutation({
    mutationFn: loginApi,
    onMutate: () => setLoading(true),
    onSettled: () => setLoading(false),
    onSuccess: (data) => {
      const token = data.token || data.data?.token || data.accessToken;
      const user = data.user || data.data?.user;
      if (token) {
        localStorage.setItem("auth_token", token);
      }
      if (user) {
        localStorage.setItem("auth_user", JSON.stringify(user));
      }
    },
    onError: (error) => {
      showError(error?.message || "Login failed. Please check your credentials and try again.");
    },
  });
};

export const useLogout = () => {
  const { showError } = useAuthStore();
  
  return () => {
    try {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    } catch (error) {
      showError("Failed to log out. Please try again.");
    }
  };
};
