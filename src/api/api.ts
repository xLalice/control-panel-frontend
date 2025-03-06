import axios from "axios";
import { LoginFormData } from "../pages/Login";
import { UpdateLeadParams } from "@/types";
import { error } from "console";
import { Product } from "@/pages/Products/types";

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
    return response.data;
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

// Products
export const fetchProducts = async () => {
  try {
    const response = await apiClient.get("/products");
    return response.data
  } catch(err: any){
    console.error(err);
    throw new Error(err.response?.data?.message || "Fetching products failed");
  }
}


export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
 try {
  const response = await apiClient.post("/products", product);
  return response.data;
 } catch(err:any){
  console.error(err);
  throw new Error(err.response?.data?.message || "Creating product failed");
 }
};

export const updateProduct = async (product: Product): Promise<Product> => {
  try {
    const response = await apiClient.put(`/products/${product.id}`, product);
    return response.data;
  } catch(err: any){
    console.error(err);
    throw new Error(err.response?.data?.message || "Updating product failed");
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try{
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  } catch(err: any) {
    console.error(err);
    throw new Error(err.response?.data?.message || "Deleting product failed");
  }
};