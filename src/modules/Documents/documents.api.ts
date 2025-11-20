import { apiClient } from "@/api/axios";
import { apiRequest } from "@/api/request";

export const documentsApi = {
  fetchCategories: () => apiRequest(apiClient.get(`/documents/categories`), "Fetching categories failed"),

  createCategory: (data: { name: string; description?: string }) =>
    apiRequest(apiClient.post(`/documents/categories`, data), "Creating category failed"),

  updateCategory: (id: number, data: { name?: string; description?: string }) =>
    apiRequest(apiClient.put(`/documents/categories/${id}`, data), "Updating category failed"),

  deleteCategory: (id: number) => apiRequest(apiClient.delete(`/documents/categories/${id}`), "Deleting category failed"),

  fetch: (categoryId?: number) => {
    const queryParams = new URLSearchParams();
    if (categoryId) queryParams.append("categoryId", categoryId.toString());
    return apiRequest(apiClient.get(`/documents?${queryParams.toString()}`), "Fetching documents failed");
  },

  getById: (id: number) => apiRequest(apiClient.get(`/documents/${id}`), "Fetching document failed"),

  upload: (formData: FormData) =>
    apiRequest(apiClient.post(`/documents/upload`, formData, { headers: { "Content-Type": "multipart/form-data" } }), "Uploading document failed"),

  delete: (id: number) => apiRequest(apiClient.delete(`/documents/${id}`), "Deleting document failed"),

  getDownloadUrl: (id: number) => `/api/documents/${id}/download`,

  preview: async (id: number) => {
    const response = await apiClient.get(`/documents/${id}/preview`, { responseType: "arraybuffer" });

    const mimeType = response.headers["content-type"]?.split(";")[0] || "application/octet-stream";

    let filename = "document";
    const contentDisposition = response.headers["content-disposition"];
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="([^\"]+)"/);
      if (match && match[1]) filename = match[1];
    }

    return { mimeType, filename, buffer: response.data };
  },
};
