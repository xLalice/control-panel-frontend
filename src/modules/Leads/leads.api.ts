import { apiClient } from "@/api/axios";
import { apiRequest } from "@/api/request";

export const leadsApi = {
  fetch: (sheetName: string, queryParams: string) =>
    apiRequest(apiClient.get(`/sales/leads/${sheetName}?${queryParams}`), "Fetching leads failed"),

  update: (sheetName: string, leadId: string, updates: any) =>
    apiRequest(
      apiClient.patch(`/sales/leads/${encodeURIComponent(sheetName)}/${leadId}`, updates),
      "Updating lead failed"
    ),
};
