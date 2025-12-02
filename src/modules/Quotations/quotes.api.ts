import { apiClient } from "@/api/axios";
import { apiRequest } from "@/api/request";
import { QuotationFormData } from "../Inquiry/inquiry.types";
import { Quotation, QuotationStatus } from "./quotes.types";

export const quotesApi = {
    create: (data: QuotationFormData) => apiRequest(apiClient.post(`/quotes`, data), "Creating quotation failed"),

    fetch: (filters?: Record<string, string | undefined>) => {
        const params = new URLSearchParams();

        Object.entries(filters || {}).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.append(key, value);
            }
        });

        return apiRequest<{
            data: Quotation[],
            meta: {
                total: number,
                page: number,
                pageSize: number,
                totalPages: number
            }
        }>(
            apiClient.get(`/quotes?${params.toString()}`),
            "Fetch failed"
        );
    },

    fetchById: (id: string) => apiRequest(apiClient.get(`/quotes/${id}`), "Fetching quote failed"),

    delete: (id: string) => apiRequest(apiClient.delete(`/quotes/${id}`), "Deleting quotation failed"),

    update: (id: string, data: Partial<QuotationFormData> & { status?: QuotationStatus }) => apiRequest(apiClient.patch(`/quotes/${id}`, data), "Updating quotation failed"),

    send: (id: string) => apiRequest(apiClient.post(`/quotes/${id}/send`), "Sending to customer failed")
}