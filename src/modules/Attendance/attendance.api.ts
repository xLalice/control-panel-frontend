import { apiClient } from "@/api/axios";
import { apiRequest } from "@/api/request";
import { DTRSettings } from "@/modules/Attendance/types";

export const attendanceApi = {
  clockIn: () => apiRequest(apiClient.post("/attendance/clock-in"), "Clock in failed"),

  clockOut: () => apiRequest(apiClient.post("/attendance/clock-out"), "Clock out failed"),

  startBreak: (reason?: string) => apiRequest(apiClient.post("/attendance/break/start", { reason }), "Start break failed"),

  endBreak: () => apiRequest(apiClient.post("/attendance/break/end"), "End break failed"),

  getUserAttendance: (params?: { startDate?: string; endDate?: string; userId?: string }) =>
    apiRequest(apiClient.get(params?.userId ? `/attendance/user/${params.userId}` : "/attendance/my-attendance", { params: { startDate: params?.startDate, endDate: params?.endDate } }), "Fetching attendance failed"),

  getAllAttendance: (params?: { startDate?: string; endDate?: string; status?: string }) =>
    apiRequest(apiClient.get("/attendance/all", { params }), "Fetching all attendance failed"),

  updateSettings: (settings: Partial<DTRSettings>) => apiRequest(apiClient.put("/attendance/settings", settings), "Updating settings failed"),

  getSettings: () => apiRequest(apiClient.get("/attendance/settings"), "Fetching settings failed"),

  manageAllowedIPs: (payload: { action: "add" | "remove" | "update"; ipAddress: string; userId: string; description?: string; id?: string }) =>
    apiRequest(apiClient.post("/attendance/allowed-ips", payload), "Managing allowed IPs failed"),

  getAllowedIPs: (userId?: string) => apiRequest(apiClient.get("/attendance/allowed-ips", { params: { userId } }), "Fetching allowed IPs failed"),
};
