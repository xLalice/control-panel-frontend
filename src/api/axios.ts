import axios from "axios";

export const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401) {
      if (originalRequest.url.includes("/auth/me") || originalRequest.url.includes("/auth/login")) {
        return Promise.reject(error);
      }

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    if (error.response?.status === 403) {
      console.error("You do not have permission to perform this action.");
    }
    return Promise.reject(error);
  }
);