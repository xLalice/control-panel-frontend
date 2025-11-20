import { apiClient } from "@/api/axios";
import { apiRequest } from "@/api/request";
import { Product } from "@/modules/Products/types";

export const productsApi = {
  fetch: () => apiRequest(apiClient.get("/products"), "Fetching products failed"),

  add: (product: Omit<Product, "id">) => apiRequest(apiClient.post("/products", product), "Creating product failed"),

  update: (product: Product) => apiRequest(apiClient.put(`/products/${product.id}`, product), "Updating product failed"),

  delete: (id: string) => apiRequest(apiClient.delete(`/products/${id}`), "Deleting product failed"),
};
