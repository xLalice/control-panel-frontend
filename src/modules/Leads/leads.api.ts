import { apiClient } from "@/api/axios";
import { Lead, LeadFormData, Company } from "@/modules/Leads/types/leads.types";
import { Client } from "@/modules/Clients/clients.schema"; 
import { ActivityLog } from "@/types/sharedTypes";

export const leadsApi = {
  getById: (id: string) => 
    apiClient.get<Lead>(`/leads/${id}`).then((res) => res.data),

  getActivities: (id: string) => 
    apiClient.get<ActivityLog[]>(`/leads/${id}/activities`).then((res) => res.data),

  getCompanies: () => 
    apiClient.get<Company[]>("/leads/companies").then((res) => res.data),

  create: (data: LeadFormData) => {
    const payload = {
        ...data,
        estimatedValue: data.estimatedValue ? parseFloat(data.estimatedValue) : null,
        leadScore: data.leadScore || null,
    };
    return apiClient.post<Lead>("/leads", payload).then((res) => res.data);
  },

  update: (id: string, data: LeadFormData) => {
    const payload = {
        ...data,
        estimatedValue: data.estimatedValue ? parseFloat(data.estimatedValue) : null,
        leadScore: data.leadScore || null,
    };
    return apiClient.put<Lead>(`/leads/${id}`, payload).then((res) => res.data);
  },

  delete: (id: string) => 
    apiClient.delete(`/leads/${id}`).then((res) => res.data),

  updateStatus: (id: string, status: string) => 
    apiClient.patch<Lead>(`/leads/${id}/status`, { status }).then((res) => res.data),

  assign: (id: string, assignedToId: string | null) => 
    apiClient.post(`/leads/${id}/assign`, { assignedToId }).then((res) => res.data),

  convertToClient: (id: string) => 
    apiClient.post<Client>(`/leads/convert-to-client/${id}`).then((res) => res.data),
};