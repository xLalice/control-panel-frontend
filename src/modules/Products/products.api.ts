import { apiClient } from "@/api/axios";
import { apiRequest } from "@/api/request";
import { AdjustStockPayload, Product } from "@/modules/Products/product.types";
import { API_ROUTES } from "@/api/apiRoutes";

export const productsApi = {
  fetch: () => 
    apiRequest(
      apiClient.get(API_ROUTES.PRODUCTS.ROOT), 
      "Fetching products failed"
    ),

  add: (product: Omit<Product, "id">) => 
    apiRequest(
      apiClient.post(API_ROUTES.PRODUCTS.ROOT, product), 
      "Creating product failed"
    ),

  update: (product: Product) => 
    apiRequest(
      apiClient.put(API_ROUTES.PRODUCTS.DETAIL(product.id), product), 
      "Updating product failed"
    ),

  delete: (id: string) => 
    apiRequest(
      apiClient.delete(API_ROUTES.PRODUCTS.DETAIL(id)), 
      "Deleting product failed"
    ),

  adjustStock: (id: string, data: AdjustStockPayload) => 
    apiRequest(
      apiClient.post(API_ROUTES.PRODUCTS.ADJUST_STOCK(id), data), 
      "Stock adjustment failed"
    )
};