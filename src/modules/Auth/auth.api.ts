import { apiClient } from "@/api/axios";
import { apiRequest } from "@/api/request";
import { User } from "@/types/sharedTypes";
import { LoginFormData } from "./Login";

export const authApi = {
    login: (data: LoginFormData) => apiRequest(apiClient.post("/auth/login", data), "Login failed"),
    me: () => apiRequest(apiClient.get<User>("/auth/me"), "Fetch user failed"),
    logout: () => apiRequest(apiClient.post("/auth/logout"), "Logout failed"),
};