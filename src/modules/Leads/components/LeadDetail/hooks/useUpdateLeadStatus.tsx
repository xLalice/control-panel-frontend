// src/hooks/useUpdateLeadStatus.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiClient } from "@/api/api";
import { Lead } from "@/modules/Leads/types/leads.types";

interface UpdateStatusPayload {
  leadId: string;
  newStatus: string;
  oldStatus?: string;
  leadName?: string;
}

export const useUpdateLeadStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<Lead, Error, UpdateStatusPayload>({
    mutationFn: async ({ leadId, newStatus }) => {
      const response = await apiClient.patch<Lead>(`/leads/${leadId}/status`, {
        status: newStatus,
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      const { leadId, oldStatus, newStatus, leadName } = variables;
      queryClient.invalidateQueries({ queryKey: ["lead", leadId] });
      queryClient.invalidateQueries({ queryKey: ["lead-activities", leadId] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });

      toast.success("Lead status updated successfully");

      if (oldStatus !== "Won" && newStatus === "Won") {
        toast.success(`Lead "${leadName || "Unknown"}" converted to Won!`);
      }
    },
    onError: (error) => {
      console.error("Error updating status:", error);
      toast.error("Failed to update lead status. Please try again.");
    },
  });
};
