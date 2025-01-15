import axios from "axios";
import { LoginFormData } from "../pages/Login";

const baseURL = `${import.meta.env.VITE_API_URL}/api/`;

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (data: LoginFormData) => {
  try {
    const response = await apiClient.post("/auth/login", data);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const logout = async () => {
  try {
    await apiClient.post("/logout");
  } catch (error: any) {
    throw new Error("Logout failed");
  }
};

export const fetchUsers = async () => {
  try {
    const response = await apiClient.get("/admin/users");
    return response;
  } catch(error: any) {
    throw new Error(error.response?.data?.message || "Fetching users failed");
  }
}

export const addUser = async (userData: { name: string; email: string; password: string; role: string; }) => {
  try {
    const response = await apiClient.post("/admin/users", userData);
    return response.data; // Return the data directly
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Adding user failed");
  }
};

export const updateUser = async (id: string, userData: { name?: string; email?: string; role?: string; }) => {
  try {
    const response = await apiClient.put(`/admin/users/${id}`, userData);
    return response.data; // Return the data directly
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Updating user failed");
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await apiClient.delete(`/admin/users/${id}`);
    return response.data; // Return the data directly
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Deleting user failed");
  }
};