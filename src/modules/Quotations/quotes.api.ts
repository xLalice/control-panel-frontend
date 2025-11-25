import { apiClient } from "@/api/axios";
import { apiRequest } from "@/api/request";
import { QuotationFormData } from "../Inquiry/inquiry.types";
import { Quotation } from "./quotes.types";

export const quotesApi = {
    create: (data: QuotationFormData) => apiRequest(apiClient.post(`/quotes`, data), "Creating quotation failed"),

    fetch: (filters?: Record<string, string>) => {
        const params = new URLSearchParams(filters).toString();
        return apiRequest<{
            data: Quotation[],
            meta: {
                total: number,
                page: number,
                pageSize: number,
                totalPages: number
            }
        }>(
            apiClient.get(`/quotes?${params}`),
            "Fetch failed"
        );
    }

}