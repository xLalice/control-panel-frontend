import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { leadsApi } from "../leads.api";
import { leadKeys } from "../lead.keys";
import { LeadFormData } from "@/modules/Leads/types/leads.types";


export const useLeadDetails = (leadId: string | null | undefined) => {
  return useQuery({
    queryKey: leadKeys.detail(leadId!),
    queryFn: () => leadsApi.getById(leadId!),
    enabled: !!leadId,
  });
};

export const useLeadActivities = (leadId: string | null | undefined) => {
  return useQuery({
    queryKey: leadKeys.activities(leadId!),
    queryFn: () => leadsApi.getActivities(leadId!),
    enabled: !!leadId,
  });
};

export const useCompanies = () => {
  return useQuery({
    queryKey: leadKeys.companies,
    queryFn: leadsApi.getCompanies,
    staleTime: 5 * 60 * 1000,
  });
};


export const useCreateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leadsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
    },
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: LeadFormData }) =>
      leadsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
      queryClient.invalidateQueries({ queryKey: leadKeys.detail(variables.id) });
    },
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leadsApi.delete,
    onSuccess: (_, leadId) => {
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
      queryClient.removeQueries({ queryKey: leadKeys.detail(leadId) });
    },
  });
};

export const useUpdateLeadStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      leadsApi.updateStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
      queryClient.invalidateQueries({ queryKey: leadKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: leadKeys.activities(data.id) });
    },
  });
};

export const useAssignLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string | null }) =>
      leadsApi.assign(id, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
      queryClient.invalidateQueries({ queryKey: leadKeys.detail(variables.id) });
    },
  });
};

export const useConvertToClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leadsApi.convertToClient,
    onSuccess: (newClient, leadId) => {
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
      queryClient.invalidateQueries({ queryKey: leadKeys.detail(leadId) });

      queryClient.invalidateQueries({ queryKey: ["inquiries"] });

      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};