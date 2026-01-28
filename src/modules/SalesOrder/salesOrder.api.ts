import { apiClient } from "@/api/axios";
import { SalesOrderFormType, SalesOrderUpdatePayload } from "./salesOrder.schema";
import { apiRequest } from "@/api/request";
import { API_ROUTES } from "@/api/apiRoutes";

export const salesOrderApi = {
    create: (data: SalesOrderFormType) => apiRequest(apiClient.post(API_ROUTES.SALES_ORDER.ROOT, data), "Failed to create sales order. Try again."),
    fetch: () => apiRequest(apiClient.get(API_ROUTES.SALES_ORDER.ROOT), "Failed to fetch sales orders"),
    fetchDetails: (id: string) => apiRequest(apiClient.get(API_ROUTES.SALES_ORDER.DETAIL(id)), "Failed to fetch the sales order"),
    update: (data: SalesOrderUpdatePayload) => apiRequest(apiClient.patch(API_ROUTES.SALES_ORDER.DETAIL(data.id), data), "Failed to update sales order")
}