import { useMutation } from "@tanstack/react-query";
import { config } from "../config";
import useAuthStore from "../stores/useAuthStore";

const loginApi = async (credentials) => {
  const response = await fetch(`${config.api.baseUrl}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({
      email: credentials.email ?? credentials.username,
      password: credentials.password
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorDetails = data?.errors ? Object.values(data.errors).flat().join(" ") : "";
    throw new Error(errorDetails || data?.message || `Login failed: ${response.status}`);
  }

  return data;
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
      if (token) localStorage.setItem("auth_token", token);
      if (user) localStorage.setItem("auth_user", JSON.stringify(user));
    },
    onError: (error) => showError(error.message),
  });
};

export const useLogout = () => {
  return () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    window.location.href = "/login"; 
  };
};