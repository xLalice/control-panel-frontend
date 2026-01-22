import { apiClient } from "@/api/axios";
import { SalesOrderFormType } from "./salesOrder.schema";
import { apiRequest } from "@/api/request";
import { API_ROUTES } from "@/api/apiRoutes";

export const salesOrderApi = {
    create: (data: SalesOrderFormType) => apiRequest(apiClient.post(API_ROUTES.SALES_ORDER.ROOT, data), "Failed to create sales order. Try again.")
}