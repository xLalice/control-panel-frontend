import axios from "axios";
import { LoginFormData } from "../pages/Login";
import { UpdateLeadParams } from "@/types";

const baseURL = `${import.meta.env.VITE_API_URL}/api/`;

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    if (error.response?.status === 403) {
      // Redirect to login if the response status is 403 (Forbidden)
      window.location.href = "/login";
    }
    return Promise.reject(error); // Propagate other errors
  }
);

export const login = async (data: LoginFormData) => {
  try {
    const response = await apiClient.post("/auth/login", data);
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const verify = async (): Promise<{ authenticated: boolean }> => {
  try {
    const response = await apiClient.get("/auth/verify");
    return response.data;
  } catch (error: any) {
    throw new Error("Verify failed");
  }
};


export const logout = async () => {
  try {
    await apiClient.post("/auth/logout");
  } catch (error: any) {
    throw new Error("Logout failed");
  }
};

// ----------------- API Functions -----------------

export const fetchUsers = async (): Promise<any> => {
  try {
    const response = await apiClient.get("/admin/users");
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Fetching users failed");
  }
};

export const addUser = async (userData: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  try {
    const response = await apiClient.post("/admin/users", userData);
    return response.data; // Return the data directly
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Adding user failed");
  }
};

export const updateUser = async (
  id: string,
  userData: { name?: string; email?: string; role?: string }
) => {
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

export const fetchLead = async (sheetName: string, queryParams: string) => {
  try {
    const response = await apiClient.get(
      `/sales/leads/${sheetName}?${queryParams}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Fetching leads failed");
  }
};

export const fetchSheetNames = async () => {
  try {
    const response = await apiClient.get(`/sales/sheets`);
    return response.data.sheetNames;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Fetching sheet names failed"
    );
  }
};

export const updateLead = async (
  sheetName: string,
  leadId: string,
  updates: UpdateLeadParams
): Promise<void> => {
  try {
    const encodedSheetName = encodeURIComponent(sheetName);
    const response = await apiClient.patch(
      `/sales/leads/${encodedSheetName}/${leadId}`,
      updates
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Updating lead failed");
  }
};

// Marketing
export const fetchFacebookOverview = async () => {
  try {
    const facebookData = await apiClient.get("/marketing/facebook/overview");
    return facebookData.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Fetching facebook overview failed"
    );
  }
};

// Reports
export const fetchReports = async () => {
  try {
    const response = await apiClient.get("/reports");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Fetching reports failed");
  }
};

export const createReport = async (reportData: any) => {
  try {
    const response = await apiClient.post("/reports", reportData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Creating report failed");
  }
};

export const updateReport = async (id: string, reportData: any) => {
  try {
    const response = await apiClient.put(`/reports/${id}`, reportData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Updating report failed");
  }
};

export const deleteReport = async (id: string) => {
  try {
    await apiClient.delete(`/reports/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Deleting report failed");
  }
};

// Pricing API
export const getAllPrices = async () => {
  try {
    const response = await apiClient.get("/prices");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error fetching prices");
  }
};

export const getPriceByCategory = async (category: string) => {
  try {
    const response = await apiClient.get(`/prices/${category}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error fetching prices by category");
  }
};

export const addPrice = async (priceData: {
  productId: string;
  price: number;
  unit: string;
  updatedBy: string;
}) => {
  try {
    const response = await apiClient.post("/prices", priceData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error adding price");
  }
};

export const updatePrice = async (id: string, priceData: { price: number; updatedBy: string }) => {
  try {
    const response = await apiClient.put(`/prices/${id}`, priceData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error updating price");
  }
};

export const deletePrice = async (id: string) => {
  try {
    const response = await apiClient.delete(`/prices/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error deleting price");
  }
};

export const getPriceHistory = async (productId: string) => {
  try {
    const response = await apiClient.get(`/price-history/${productId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error fetching price history");
  }
};