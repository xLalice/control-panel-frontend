import { apiClient } from "@/api/axios";
import { SalesOrder, SalesOrderFormType, SalesOrderQueryOptions, SalesOrderUpdatePayload } from "./salesOrder.schema";
import { apiRequest } from "@/api/request";
import { API_ROUTES } from "@/api/apiRoutes";

export const salesOrderApi = {
    create: (data: SalesOrderFormType) => apiRequest(apiClient.post(API_ROUTES.SALES_ORDER.ROOT, data), "Failed to create sales order. Try again."),
    fetch: ({ page, sorting, filters }: SalesOrderQueryOptions) => {
        const params = new URLSearchParams();

        params.append("page", page.toString());
        params.append("limit", "10"); 

        if (filters.search) params.append("search", filters.search);
        if (filters.status && filters.status !== "all") {
             params.append("status", filters.status);
        }

        if (sorting.length > 0) {
            const sort = sorting[0];
            params.append("sortBy", sort.id);
            params.append("sortOrder", sort.desc ? "desc" : "asc");
        }

        return apiRequest<{
            orders: SalesOrder[],
            page: number,
            total: number,
            totalPages: number,
        }>(
            apiClient.get(`${API_ROUTES.SALES_ORDER.ROOT}?${params.toString()}`), 
            "Failed to fetch sales orders"
        );
    },
    fetchDetails: (id: string) => apiRequest(apiClient.get(API_ROUTES.SALES_ORDER.DETAIL(id)), "Failed to fetch the sales order"),
    update: (data: SalesOrderUpdatePayload) => apiRequest(apiClient.patch(API_ROUTES.SALES_ORDER.DETAIL(data.id), data), "Failed to update sales order")
}