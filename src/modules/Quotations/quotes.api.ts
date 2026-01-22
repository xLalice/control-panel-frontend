import { apiClient } from "@/api/axios";
import { apiRequest } from "@/api/request";
import { QuotationFormData } from "../Inquiry/inquiry.types";
import { Quotation, QuotationStatus } from "./quotes.types";
import { API_ROUTES } from "@/api/apiRoutes";

export const quotesApi = {
    create: (data: QuotationFormData) =>
        apiRequest(
            apiClient.post(API_ROUTES.QUOTES.ROOT, data),
            "Creating quotation failed"
        ),

    fetch: (filters?: Record<string, string | undefined>) => {
        const params = new URLSearchParams();

        Object.entries(filters || {}).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.append(key, value);
            }
        });

        return apiRequest<{
            data: Quotation[];
            meta: {
                total: number;
                page: number;
                pageSize: number;
                totalPages: number;
            };
        }>(
            apiClient.get(`${API_ROUTES.QUOTES.ROOT}?${params.toString()}`),
            "Fetch failed"
        );
    },

    fetchById: (id: string) =>
        apiRequest(apiClient.get(API_ROUTES.QUOTES.DETAIL(id)), "Fetching quote failed"),

    delete: (id: string) =>
        apiRequest(apiClient.delete(API_ROUTES.QUOTES.DETAIL(id)), "Deleting quotation failed"),

    update: (id: string, data: Partial<QuotationFormData> & { status?: QuotationStatus }) =>
        apiRequest(apiClient.patch(API_ROUTES.QUOTES.DETAIL(id), data), "Updating quotation failed"),

    send: (id: string) =>
        apiRequest(apiClient.post(API_ROUTES.QUOTES.SEND(id)), "Sending to customer failed"),

    downloadPdf: (id: string) =>
        apiClient.get(API_ROUTES.QUOTES.PDF(id), {
            responseType: "blob",
        }),
};
