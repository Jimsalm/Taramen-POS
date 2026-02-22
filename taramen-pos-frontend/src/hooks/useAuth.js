import { useMutation } from "@tanstack/react-query";
import { config } from "../config";

const loginApi = async (credentials) => {
  const endpoint = `${config.api.baseUrl}/login`;
  const email = credentials.username || credentials.email;
  
  if (!email || !email.includes('@')) {
    throw new Error('Please enter a valid email address');
  }
  
  const payload = {
    email,
    password: credentials.password
  };
  
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      mode: "cors",
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch (e) {
        // Silently handle JSON parse error
      }
      throw new Error(errorData.message || `Login failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Failed to login. Please try again.');
  }
};

export const useLogin = () => {
  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      const token = data.token || data.data?.token || data.accessToken;
      if (token) {
        localStorage.setItem("auth_token", token);
      }
    },
    onError: () => {
      // Error is already handled by the error boundary or UI
    }
  });
};