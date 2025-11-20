import { apiClient } from "@/api/axios";
import { apiRequest } from "@/api/request";
import {
  InquiryFilterParams,
  UpdateInquiryDto,
  CreateInquiryDto,
} from "@/modules/Inquiry/types";

export interface QuoteDetails {
  basePrice: number;
  deliveryFee?: number;
  discount?: number;
  taxes?: number;
  totalPrice: number;
  validUntil?: Date;
  notes?: string;
}

export const inquiryApi = {
  fetch: (params: InquiryFilterParams) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.status) queryParams.append("status", params.status);
    if (params.source) queryParams.append("source", params.source);
    if (params.productType) queryParams.append("productType", params.productType);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
    if (params.search) queryParams.append("search", params.search);
    if (params.startDate) queryParams.append("startDate", params.startDate.toString());
    if (params.endDate) queryParams.append("endDate", params.endDate.toString());

    return apiRequest(apiClient.get(`/inquiries?${queryParams.toString()}`), "Fetching inquiries failed");
  },

  fetchById: (id: string) => apiRequest(apiClient.get(`/inquiries/${id}`), "Fetching inquiry failed"),

  checkCustomerExists: (params: { email?: string; phoneNumber?: string; companyName?: string; clientName?: string; }) =>
    apiRequest(apiClient.post(`/inquiries/check-customer`, params), "Checking customer existence failed"),

  create: (inquiry: CreateInquiryDto) => apiRequest(apiClient.post(`/inquiries`, inquiry), "Creating inquiry failed"),

  update: (id: string, inquiry: UpdateInquiryDto) => apiRequest(apiClient.put(`/inquiries/${id}`, inquiry), "Updating inquiry failed"),

  createQuote: (id: string, quoteDetails: QuoteDetails) => apiRequest(apiClient.post(`/inquiries/${id}/quote`, quoteDetails), "Creating quote failed"),

  approve: (id: string) => apiRequest(apiClient.post(`/inquiries/${id}/approve`), "Approving inquiry failed"),

  schedule: (id: string, scheduledDate: Date | string, options?: { priority?: string; reminderMinutes?: number }) =>
    apiRequest(apiClient.post(`/inquiries/${id}/schedule`, { scheduledDate, ...(options && { priority: options.priority, reminderMinutes: options.reminderMinutes }) }), "Scheduling inquiry failed"),

  fulfill: (id: string) => apiRequest(apiClient.post(`/inquiries/${id}/fulfill`), "Fulfilling inquiry failed"),

  delete: (id: string) => apiRequest(apiClient.delete(`/inquiries/${id}`), "Deleting inquiry failed"),

  getStatistics: (startDate?: string | Date, endDate?: string | Date) => {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append("startDate", startDate.toString());
    if (endDate) queryParams.append("endDate", endDate.toString());
    return apiRequest(apiClient.get(`/inquiries/stats/overview?${queryParams.toString()}`), "Fetching inquiry statistics failed");
  },

  convertToLead: async (id: string) => {
    const result: any = await apiRequest(apiClient.post(`/inquiries/${id}/convert-to-lead`), "Converting inquiry to lead failed");
    return result?.data ?? result;
  },

  review: (id: string) => apiRequest(apiClient.post(`/inquiries/${id}/review`), "Reviewing inquiry failed"),

  close: (id: string) => apiRequest(apiClient.post(`/inquiries/${id}/close`), "Closing inquiry failed"),
};
