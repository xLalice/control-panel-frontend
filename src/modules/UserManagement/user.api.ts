import { apiClient } from "@/api/axios";
import { apiRequest } from "@/api/request";

export const userApi = {
  list: () => 
    apiRequest(apiClient.get('/users'), "Fetching users failed"),

  create: (userData: any) => 
    apiRequest(apiClient.post("/users", userData), "Adding user failed"),

  update: (id: string, userData: any) => 
    apiRequest(apiClient.put(`/users/${id}`, userData), "Updating user failed"),

  delete: (id: string) =>
    apiRequest(apiClient.delete(`/users/${id}`), "Deleting user failed"),

  getPermissions: () =>
    apiRequest(apiClient.get(`/users/permissions`), "Getting permissions failed"),
};