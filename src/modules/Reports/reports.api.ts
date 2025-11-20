import { apiClient } from "@/api/axios";
import { apiRequest } from "@/api/request";

export const reportsApi = {
  fetch: () => apiRequest(apiClient.get("/reports"), "Fetching reports failed"),

  create: (reportData: any) => apiRequest(apiClient.post("/reports", reportData), "Creating report failed"),

  update: (id: string, reportData: any) => apiRequest(apiClient.put(`/reports/${id}`, reportData), "Updating report failed"),

  delete: (id: string) => apiRequest(apiClient.delete(`/reports/${id}`), "Deleting report failed"),
};
